import { browser, expect, waitVisible, waitClick, waitText, TableDefinition, utils } from '../utils';
import { ContactSupportPage } from '../pages';

const contactSupportPage:ContactSupportPage = new ContactSupportPage();

const { Then, When } = require('cucumber');

When(/^I fill out the contact support form$/,
    async function(table: TableDefinition){
        await contactSupportPage.fillOutContactForm(table);
        await utils.screenshot("filled-out-contact-form.png")
    });

Then(/^I check that the contact support page has the right elements$/,
    async function(){
        expect(await waitVisible(contactSupportPage.emailForm, 5000)).to.be.true;
        expect(await waitVisible(contactSupportPage.emailField, 5000)).to.be.true;
        expect(await waitVisible(contactSupportPage.nameField, 5000)).to.be.true;
        expect(await waitVisible(contactSupportPage.messageField, 5000)).to.be.true;
        expect(await waitVisible(contactSupportPage.studyField, 5000)).to.be.true;
        expect(await waitVisible(contactSupportPage.studySiteField, 5000)).to.be.true;
        expect(await waitVisible(contactSupportPage.roleField, 5000)).to.be.true;
        expect(await waitVisible(contactSupportPage.phoneNumberField, 5000)).to.be.true;
        expect(await waitVisible(contactSupportPage.submitButton, 5000)).to.be.true;
        expect(await waitVisible(contactSupportPage.liveChatButton, 5000)).to.be.true;
        expect(await waitVisible(contactSupportPage.supportHelpCenterLink, 5000)).to.be.true;
        expect(await waitVisible(contactSupportPage.supportNumberListLink, 5000)).to.be.true;
        await utils.screenshot('contact-support-page.png');
    });

Then(/^a confirmation message for the contact support form is displayed$/,
    async function(){
        expect(await contactSupportPage.confirmationMessage.isDisplayed()).to.be.true;
        expect(await waitText(contactSupportPage.confirmationMessage)).to.contain("Thank you! Your form has been successfully submitted");
        await utils.screenshot("form-confirmation-message-displayed.png");
    });

Then(/^a new browser window is open for the 4G Clinical Help Center page$/,
    async function(){
        await browser.getAllWindowHandles().then(async function (handles) {
            await browser.switchTo().window(handles[1]);
            browser.ignoreSynchronization = true;
            let url = await browser.driver.getCurrentUrl();
            utils.screenshot('help-center-page.png');
            expect(url).to.equal("https://support.4gclinical.com/hc/en-us");
        });
    });

Then(/^a live chat for support is open on a new browser window$/,
    async function(){
        await browser.getAllWindowHandles().then(async function (handles) {
            await browser.switchTo().window(handles[2]);
            browser.ignoreSynchronization = true;
            let url = await browser.getCurrentUrl();
            utils.screenshot('live-chat-support-page.png');
            expect(url).to.contain("https://home-c19.incontact.com/inContact/ChatClient/");
            expect(await waitVisible(contactSupportPage.supportLiveChat)).to.be.true;
        });
    });

When(/^I close the Co-Browse with Support pop up$/,
    async function(){
        await waitClick(contactSupportPage.closeWindowIcon);
        await waitClick(contactSupportPage.stopButton);
        await browser.switchTo().defaultContent();
        browser.ignoreSynchronization = false;
        await browser.waitForAngular();
    });

Then(/^the Co-Browse with Support pop up is not displayed$/,
    async function(){
        expect(await contactSupportPage.coBrowseIframe.isDisplayed()).to.be.false;
    });

Then(/^A pop up window for Co-Browse with Support is displayed$/,
    async function(){
        var driver = browser.driver;
        await waitVisible(contactSupportPage.coBrowseIframe);
        await browser.driver.switchTo().frame(contactSupportPage.coBrowseIframe.getWebElement()).then(async function(){
            browser.ignoreSynchronization = true;
            utils.screenshot("co-browse-with-support-pop-up.png");
            expect(await contactSupportPage.coBrowseWindow.getWebElement().isDisplayed()).to.be.true;
        });
    });