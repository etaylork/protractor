import { by, element, EF } from '../' 
/**
 * Project repository for common logging messages
 */
export module Msg {
    export let DONE_PAGE_MESSAGE: EF = element(by.css('div.steps'));
    export let PRANCER_MESSAGE: EF = element(by.css('span[e2e-id="message"'));
    export let OPENING_REPORT = (name: string) => 
        "Opening report " + name;
    export let VALIDATING_TEST_DATA_FOR_USER = (user: string) =>
        "Testing data for " + user + " user";
    
}