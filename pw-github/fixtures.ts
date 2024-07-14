import { Page, test as base } from '@playwright/test';
import { createSession } from '../global-setup';
import config from '../config';

import {
    AdminPage
    // etc 40 pages
} from '../src/pages';

export const test = base.extend<
    {
        testFixture: string;
        autoTestFixture: string;
        unusedFixture: string;
        adminPage: AdminPage;
        // etc 40 pages
    },
    {
        workerFixture: string;
        autoWorkerFixture: string;
    }
>({
    autoWorkerFixture: [
        async ({}, use) => {
            console.log('autoWorkerFixture setup...');
            await createSession();

            await use('autoWorkerFixture');
        },
        { scope: 'worker', auto: true }
    ],

    adminPage: async ({ page }, use) => {
        await use(new AdminPage(page));
    }
    // etc 40 pages
});

export const expect = test.expect;
