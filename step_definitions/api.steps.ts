import { browser, logger, UserRole } from '../utils';
import { defineSupportCode, TableDefinition } from 'cucumber';

import { API } from '../utils/api';
import { SelectorPage } from '../pages/other/selector/selector.page';

const api: API = new API();
const selectorPage: SelectorPage = new SelectorPage();

defineSupportCode(({ Given, When, Then }) => {

    Given(/^that study '(.*?)' is loaded$/, { timeout: 180 * 1000 },
        async (study: string) => {
            this.study = study;
            let result = await api.post('test_api/query', '{"study-loaded":"' + study + '"}');
            if (result["study-loaded"].indexOf("true") !== -1) {
                logger.debug("study '" + study + "' is already loaded");
            } else {
                logger.debug("loading '" + study + "' study...");
                await api.post('test_api/studyprovision', '{"study":"' + study + '", "clean":false}');
            }
        });

    Given(/^I set parameter '(.*?)' with scope '(.*?)' and value '(.*?)'$/, { timeout: 180 * 1000 },
        async (parameter: string, scope: string, value: string) => {
            await api.post('test_api/' + scope, '{"study":"' + this.study + '", "name":"' + parameter + '", "value":"' + value + '"}');
        });

    Given(/^that study '(.*?)' is also loaded$/, { timeout: 180 * 1000 },
        async (study: string) => {
            await api.post('test_api/studyprovision', '{"study":"' + study + '", "clean":false}');
        });

    Given(/^that study '(.*?)' is clean loaded$/, { timeout: 180 * 1000 },
        async (study: string) => {
            await api.post('test_api/studyprovision', '{"study":"' + study + '", "clean":true}');
        });

    Given(/^that a dupe masters check is added for study '(.*?)'$/, { timeout: 180 * 1000 },
        async function (study: string) {
            await api.post('test_api/dupemasterconfig', '{"study":"' + study + '"}');
        });

    Given(/^A duplicate check configuration is set for study '(.*?)'$/, { timeout: 180 * 1000 },
        async (study: string) => {
            await api.post('test_api/dupecheckconfig', '{"study":"' + study + '"}');
        });

    When(/^the warning level is set to '(\d+)' in the dupe check configuration$/, { timeout: 180 * 1000 },
        async function (level: number) {
            this.warningLevel = level;
            await api.post('test_api/dupecheckconfigupdate', '{"warn" : ' + level + '}');
        });

    When(/^the check level is set to '(.*?)' in the dupe check configuration$/, { timeout: 180 * 1000 },
        async function (level: string) {
            await api.post('test_api/dupecheckconfigupdate', '{"check" : "' + level + '"}');
        });

    When(/^the country is set to '(.*?)' and the check level is set to '(.*?)' in the dupe check configuration$/, { timeout: 180 * 1000 },
        async function (country: string, level: string) {
            await api.post('test_api/dupecheckconfigupdate', '{"country" : "' + country + '", "check" : "' + level + '"}');
        });

    When(/^the region is set to '(.*?)' and the check level is set to '(.*?)' in the dupe check configuration$/, { timeout: 180 * 1000 },
        async function (region: string, site: string) {
            await api.post('test_api/dupecheckconfigupdate', '{"region" : "' + region + '", "check" : "' + site + '"}');
        });

    When(/^I change the detail text in the glossary for '(.*?)'$/, { timeout: 180 * 1000 },
        async function (text: string) {
            this.glossary = true;
            await api.post('test_api/glossaryupdate', '{"text" : "' + text + '"}');
        });

    When(/^I add a region called '(.*?)' in the dupe check configuration$/, { timeout: 180 * 1000 },
        async function (region: string) {
            await api.post('test_api/createregion', '{"region" : "' + region + '"}');
        });

    Then(/^all the studies and sites are cleared$/, { timeout: 180 * 1000 },
        async () => {
            await api.post('test_api/studyprovision', '{"study":"", "clean":true}');
        });

    Given(/^'(.*?)' study is loaded on the selector page$/, { timeout: 180 * 1000 },
        async (study: string) => {
            logger.debug("Then '" + study + "' study is loaded on selector page");
            await browser.refresh();
            await browser.waitForAngular();
            if (!await selectorPage.containsStudy(study)) {
                logger.debug("Loading study: " + study);
                await api.post('test_api/studyprovision', '{"study":"' + study + '", "clean":false}');
            }
        });

    Given(/^I set values to '(.*?)' in the pooling group temp config$/, { timeout: 180 * 1000 },
        async function (config: string) {
            if (config === "default") {
                await api.post('test_api/setpoolinggrouptempconfig', '{"study":"' + browser.params.study + '"}');
            } else {
                await api.post('test_api/setpoolinggrouptempconfig', '{"study":"' + browser.params.study + '", "config": false}');
            }
        });

    Given(/^default depot for '(.*?)' is set to '(.*?)'$/,
        async (depot: string, defaultDepot: string) => {
            await api.post('test_api/defaultdepot', '{"depot":"' + depot + '", "default":"'+defaultDepot+'"}');
        })
    
    Given(/^default features are added to '(.*?)' user role for the Cohort History Report$/,
        async (user:string) => {
            await api.post('test_api/cohorthistory', '{"user":"'+ user + '"}');
        });

    Given(/^'(.*?)' is given feature access: '(.*?)'$/,
        async function (userRole: string, feature: string) {
            await api.post('test_api/adduserrolefeature', '{"user":"' + userRole + '", "feature":"' + feature + '"}');
        });

    Given(/^I custom config the Patient Lists report for study '(.*?)'$/,
        async function (study: string){
            await api.post('test_api/patientslistconfig', ' {"study": "'+ study + '"}')
        });

    Given(/^I update the patient status on success for all treatment arms$/,
        async function (table: TableDefinition){
            let data = (table.rows())[0];
            await api.post('test_api/eventactions', '{"study":"' + browser.params.study + '", "event_id":"' + data[0] + '", "p_status":"' + data[1] + '" }');
        });

    When(/^I add new system wides to the site$/,
        async function(table: TableDefinition){
            for( let entry of table.hashes()){
                await api.post('test_api/addsystemwide', '{"system_wide_name":"' + entry.name + '", "system_wide_value":"' + entry.value + '"}');
            }
        });

    Given(/^I change the expiry date for lot$/,
        async function (table : TableDefinition) {
            for(let entry of table.hashes())
                await api.post('test_api/lotupdate', '{"id":"' + entry.lot + '", "date":"' + entry.date + '"}');
        });

    Given(/^I change the dnd days for lot$/,
        async function (table : TableDefinition) {
            for(let entry of table.hashes())
                await api.post('test_api/lotupdate', '{"id":"' + entry.lot + '", "dnd_days":"' + entry.dnd + '"}');
        });

    Given(/^I change the expiry date for '(.*?)' to 2 months in the future$/,
        async function(lot: string){
            let currentDate = new Date();
            let newDate = String((new Date(currentDate.setMonth(currentDate.getMonth() + 2))).toISOString());  
            await api.post('test_api/lotupdate', '{"id":"' + lot + '", "date":"' +  newDate.substr(0, newDate.indexOf("T")) + '"}');
        });

    Given(/^I change the dosage for$/,
        async function (table : TableDefinition) {
            for(let entry of table.hashes()){
                let query = {
                    "study" : entry.study,
                    "event_id" : entry.event_id,
                    "t_code" : entry.treatment_arm,
                    "action_id" : entry.action_id,
                    "action_logic" : entry.action_logic
                }
                await api.post('test_api/eventactions', JSON.stringify(query));
            }
        });

    Given(/^I update all bulk supply to '(\d+)'$/,
        async function (qty: number){
            await api.post('test_api/updatebulksupplyquantity', '{"supply":' + qty + '}');
        });

    Given(/^load '(.*?)' stack data - '(.*?)'$/, { timeout: 180 * 1000 },
        async function (stack: string, command: string) {
            await logger.info("\nLoading "+ stack + " stack data...");
            await api.post('test_api/stackloader', '{"stack":"'+stack+'", "command":"'+command+'"}');
        });

    Given(/^delete user role grant '(.*?)' for '(.*?)'$/,
        async function(study: string, user: string){
            let userRole = UserRole.getUser(user);
            await api.post('test_api/removeuserrolegrant', '{"study":"'+study+'", "email":"'+userRole.email+'"}');
        });

    /** 
     *  loads fake patient data that can be used for preloading patient screening, randomization, and dosing for 
     *  patients ( used mainly for preconditions in test cases )
     *  
     * @param file - takes in a .csv file from directory ../prancer_meta/prancer_meta/management/data/fake_patients
     **/
    Given(/^I preload fake patient data - '(.*?)'$/,
        async function (file: string){
            await api.post('test_api/createfakepatients', '{"csvFile":"' + file + '"}');
        });

    Given(/^set pooling group temp configs for study '(.*?)' and excursions '(.*?)'$/,
        async function (study: string, test: string){
            await api.post('test_api/excursionpoolinggrouptempconfig', '{"study":"' + study + '", "test" : "'+test+'" }');
        });

    Given(/^add '(.*?)' depot for the '(.*?)' pooling group$/,
        async function(depot: string, study: string){
            await api.post('test_api/addpoolinggroupdepot', '{"study":"'+study+'" , "location_id":"'+depot+'"}');
        });

    Given(/^update depot '(.*?)' address to address with id '(.*?)'$/,
        async function(depot: string, addressId: string){
            await api.post('test_api/updatedepotaddress', '{"depot":"'+depot+'" , "address_id":"'+addressId+'"}');
        });


    });