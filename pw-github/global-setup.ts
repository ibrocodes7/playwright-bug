import config from './config';
import { utils } from './src/utils';
import { LoginPage } from './src/pages';
import { teamEdition, Mailinator } from './src/constants';
import {
    createConnection,
    createWorksheetWithAPI,
    populateWorksheetIds,
    createTeamEditionUser
} from './src/constants/global-methods';

const fs = require('fs');

export async function createSession(
    username: string = config.TS_USERNAME,
    password: string = config.TS_PASSWORD
) {
    if (fs.existsSync(utils.getStateJsonFileName())) {
        fs.writeFileSync(
            utils.getStateJsonFileName(),
            JSON.stringify({ cookies: [], origins: [] }, null, 2),
            (err) => {
                if (err) {
                    // eslint-disable-next-line no-console
                    console.log(err);
                }
            }
        );
    }

    const { page, browser } = await utils.createPage({ applySession: false });
    try {
        const loginPage = new LoginPage(page);
        // await page.context().tracing.start({ screenshots: true, snapshots: true });

        /*
    With waitForResponse added into loginPage.login() now, trace files for global-setup does not get generated anymore.
    Note: Issue has been raised with Playwright team.
    For debugging purposes, we have video files and console output of API responses(!200).
    */
        await loginPage.navigate();
        await loginPage.login(username, password);
        await page
            .context()
            .storageState({ path: utils.getStateJsonFileName() });
    } catch (error) {
        // await page.context().tracing.stop({
        //   path: './test-results/failed-setup-trace.zip',
        // });
        await browser.close();

        throw error;
    } finally {
        await browser.close();
    }
}

async function globalSetup() {
    await utils.getSessionInfoJson();
    if (
        !fs.existsSync(utils.getStateJsonFileName()) &&
        config.TEST_TARGET !== teamEdition.testTarget
    ) {
        await createSession();
    }

    if (config.TEST_TARGET === teamEdition.testTarget) {
        await createTeamEditionUser();
        await createSession(
            `${teamEdition.teamEditionUser}@${Mailinator.domain}`,
            teamEdition.teamEditionPassword
        );
    }

    if (config.CONNECTION_TYPE !== 'none') {
        await createConnection(
            utils.capitalizeFirstLetter(config.CONNECTION_TYPE)
        );
        // await createConnectionForDataUpload(utils.capitalizeFirstLetter(config.CONNECTION_TYPE));
    }

    if (config.CREATE_WORKSHEETS === 'true') {
        await createWorksheetWithAPI();
    }

    await populateWorksheetIds();
}

export default globalSetup;
