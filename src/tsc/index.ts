import { PuppetterBase } from './utils/puppetter_base';

(async () => {
    const crawler = new PuppetterBase();
    await crawler.run();
})();