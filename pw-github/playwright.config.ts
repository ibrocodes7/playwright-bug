import { PlaywrightTestConfig } from '@playwright/test';
import config from './config';
import { utils } from './src/utils';

const config: PlaywrightTestConfig & { args: string[]; headless: boolean } = {
    globalSetup: './global-setup',
    // globalTeardown: './global-teardown',
    args: ['--disable-features=IsolateOrigins,site-per-process'],
    headless: false,

    use: {
        // Artifacts
        baseURL: config.BASE_URL,
        headless: config.HEADLESS,
        viewport: {
            width: config.BROWSER_WIDTH,
            height: config.BROWSER_HEIGHT
        },
        ignoreHTTPSErrors: true,
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        trace: 'retain-on-failure',
        storageState: utils.getStateJsonFileName(),
        actionTimeout:
            config.ACTION_TIMEOUT * 1000 * config.CUSTOM_TIMEOUT_MULTIPLY,
        navigationTimeout:
            config.NAVIGATION_TIMEOUT * 1000 * config.CUSTOM_TIMEOUT_MULTIPLY,
        browserName: config.BROWSER,
        permissions: ['clipboard-read', 'clipboard-write']
    },
    timeout: config.TEST_TIMEOUT * 60 * 1000 * config.CUSTOM_TIMEOUT_MULTIPLY,

    expect: { timeout: 15 * 1000 }, // 15 seconds

    retries: config.RETRIES,

    workers: config.WORKERS,

    repeatEach: config.REPEAT_EACH,

    // testMatch: [''],
    testDir: 'tests',

    reporter: [
        ['list'],
        [
            'allure-playwright',
            {
                suiteTitle: true,
                environmentInfo: {
                    NODE_VERSION: process.version,
                    OS: process.platform,
                    IS_HEADLESS: process.env.HEADLESS,
                    BROWSER: process.env.BROWSER
                }
            }
        ],
        ['json', { outputFile: 'test-results.json' }],
        ['junit', { outputFile: 'test-results.xml' }],
        ['html', { open: 'never' }],
        ['./summaryReporter']
    ]

    // outputDir: './reports',
    // reporter: 'line',
    // outputDir: path.dirname('./ts-results'),
    // Two reporters for CI:
    // - concise "dot"
    // - comprehensive json report

    // reporter: !process.env.CI
    //   ? // Default 'list' reporter for the terminal
    //     'list'
    //   : // Two reporters for CI:
    //     // - concise "dot"
    //     // - comprehensive json report
    //     [['dot'], ['json', { outputFile: 'test-results.json' }], ['junit']],

    // projects: [
    //   {
    //     name: 'Chromium',
    //     use: {
    //       browserName: 'chromium',

    //       // Context options
    //       viewport: { width: 1920, height: 1020 },
    //     },
    //   },
    //   {
    //     name: 'Firefox',
    //     use: {
    //       browserName: 'firefox',

    //       // Context options
    //       viewport: { width: 1920, height: 1020 },
    //     },
    //   },
    //   {
    //     name: 'WebKit',
    //     use: { browserName: 'webkit', viewport: { width: 600, height: 800 } },
    //   },
    // ],
};

export default config;
