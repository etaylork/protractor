import { expect, sidebar, utils } from '../utils';
import { defineSupportCode } from 'cucumber';

import { AboutPage } from '../pages/other/about/about.page';

const aboutPage: AboutPage = new AboutPage();

defineSupportCode(({ Given, Then }) => {

    Given(/^I go to the about page$/,
        async () => {
            await sidebar.openAboutPage();
        });

    Then(/^I check that the about page has the right elements$/,
         async () => {
            expect(await aboutPage.titleElement.isDisplayed()).to.equal(true);
            expect(await aboutPage.systemNameElement.isDisplayed()).to.equal(true);
            expect(await aboutPage.getSystemName()).to.contain('Prancer RTSM');
            expect(await aboutPage.getSystemInfo()).to.match(/commit/);
            await utils.screenshot('about-page.png');
        });
});