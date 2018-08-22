import { by, element, Err, expect, waitText, utils, Msg } from '../utils';

const { Then } = require('cucumber');


/* --- step defintions for validating error messages --- */
Then(/^a error message is displayed indicating the max supply for ordering is '(.*?)'/,
    async function(maxQuantity: string){
        expect(await Err.SHIPMENT_REQUEST_MAX_ORDER_QUANTITY_EXCEEDED.isDisplayed()).to.be.true;
        expect(await waitText(Err.SHIPMENT_REQUEST_MAX_ORDER_QUANTITY_EXCEEDED)).to.contain(maxQuantity);
        utils.screenshot('max-quantity-error-msg.png');
    });


/* --- step definitions for validating confirmation messages --- */
Then(/^a shipment request '(.*?)' message is displayed$/,
    async function(msg: string){
        switch(msg){
            case 'success': 
                     expect(await waitText(Msg.PRANCER_MESSAGE)).to.contain('Shipment Request created successfully');
                     utils.screenshot('shipment-request-success.png');
                     return;
            case 'decline':
                     expect(await waitText(Msg.PRANCER_MESSAGE)).to.contain('Shipment Request declined successfully');
                     utils.screenshot('shipment-request-declined.png');
                     return;
        }
    });

Then(/^a shipment temperature excursion report message is displayed$/,
    async function(){
        expect(await waitText(Msg.DONE_PAGE_MESSAGE)).to.contain('A shipment temperature excursion was reported.');
        await utils.screenshot('shipment-temperature-excursion-reported-message.png');
    });

Then(/^a temperature excursion report message is displayed$/,
    async function(){
        expect(await waitText(Msg.DONE_PAGE_MESSAGE)).to.contain('Temperature excursion reported successfully.');
        await utils.screenshot('temperature-excursion-reported-message.png');
    });

Then(/^a success resolution message is displayed for excursion '(.*?)'$/,
    async function(excursion: string){
        expect(await waitText(Msg.DONE_PAGE_MESSAGE)).to.match(/Excursion (.*?) reported on (.*?) is fully resolved/);
        expect(await waitText(Msg.DONE_PAGE_MESSAGE)).to.contain(excursion);
        await(utils.screenshot('excursion-resolved-success-message.png'));
    }); 

Then(/^a success partially resolved message is displayed for excursion '(.*?)'$/,
    async function(excursion: string){
        let messageLocator =  element(by.css('div.steps'));
        expect(await waitText(messageLocator)).to.match(/Excursion (.*?) reported on (.*?) is partially resolved/);
        expect(await waitText(messageLocator)).to.contain(excursion);
        await(utils.screenshot('excursion-partially-resolved-success-message.png'));
    });

Then(/^a success message for creating site '(.*?)' is displayed$/,
    async function(siteNumber: string){
        expect(await waitText(Msg.DONE_PAGE_MESSAGE)).to.contain('Site ' + siteNumber + ' successfully created!');
    });

Then(/^a warning message indicating not all monitors could be added is displayed$/,
    async function(){
        await waitText(Msg.DONE_PAGE_MESSAGE).then( (message) =>{
            expect(message).to.contain("Couldn't find default depot for site.");
            expect(message).to.contain("One or several site(s) monitor(s) cannot be added");
        });
    }); 

Then(/^a success message for updating site '(.*?)' is displayed$/,
    async function(siteNumber: string){
        expect(await waitText(Msg.DONE_PAGE_MESSAGE)).to.contain('Site ' + siteNumber + ' successfully updated!');
    });

Then(/^a success message for creating a country '(.*?)' is displayed$/,
    async function(country: string){
        expect(await waitText(Msg.DONE_PAGE_MESSAGE)).to.contain('Country ' + country + ' successfully created!');
    });

Then(/^a success message for updating country '(.*?)' is displayed$/,
    async function(country: string){
        expect(await waitText(Msg.DONE_PAGE_MESSAGE)).to.contain('Country ' + country + ' successfully updated!');
    });
 
Then(/^a success message unscheduled return kit action is displayed$/,
        async function(){
            expect(await waitText(Msg.DONE_PAGE_MESSAGE)).to.contain("Unscheduled visit 'Return kit' is complete");
    });
