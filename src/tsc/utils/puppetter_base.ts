import puppeteer, { Browser } from 'puppeteer';
import { Page } from 'puppeteer';
import 'dotenv/config';

export interface PuppetterInterface {
    run(): Promise<void>;
}

export class PuppetterBase implements PuppetterInterface {
    async run(): Promise<void> {
        const browser = await puppeteer.launch(
            { 
                headless: false,
                args: ['--no-sandbox',"--lang=ja"]
            }
        );
        const _page = await browser.newPage();

        // // レスポンス制御
        // _page.on("response", (response) => {
        //     console.info(response.status(), response.url());
        //     if (300 > response.status() && 200 <= response.status()) return;
        //     if (404 == response.status()) {
        //         console.warn("status error", response.status(), response.url());
        //     } else {
        //         console.error("status error", response.status(), response.url());
        //     }
        // });

        await this.crawl(browser, _page);
        await browser.close();
    }

    /**
     * crawl
     * @param browser 
     * @param page 
     * @returns 
     */
    async crawl(browser: Browser, page: Page): Promise<any>
    {
        await page
            .goto('https://sec-sso.click-sec.com/loginweb/sso-redirect');
        await this.login(browser, page);
        await page.screenshot({ path: "gmo.png", fullPage: true });
    }

    /**
     * Login
     * @param browser 
     * @param page 
     */
    async login(browser: Browser, page: Page) :Promise<any>
    {
        if (typeof process.env.GMO_USER_NAME == 'undefined' || typeof process.env.GMO_USER_PASS == 'undefined') {
            console.error('undefined GMO_USER_NAME or GMO_USER_PASS');
            process.exit(1);
        }

        await page.type('#j_username', process.env.GMO_USER_NAME);
        await page.type('#j_password', process.env.GMO_USER_PASS);
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'load'}),
            page.click('button[type="submit"]'),
        ]);
    }
}