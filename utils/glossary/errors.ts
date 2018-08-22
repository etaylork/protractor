import { by, element, EF } from '../';
/**
 * Project repository for common error messages
 */
export module Err {
    /* -- error messages by binding locators -- */
    export let SHIPMENT_REQUEST_MAX_ORDER_QUANTITY_EXCEEDED: EF = element(by.binding('SHIPMENT_REQUEST_MAX_ORDER_QUANTITY_EXCEEDED'));

    /* -- string errror messages -- */
    export let VERIFY_META_DATA = "verify meta data";
    export let DISPLAYS_DATA = "displays data";
    export let IS_UNBLINDED = "is unblinded";
    export let FAILED_TO_OPEN_REPORT = (report: string, error?: string) => 
        "Failed to open " + report + " report" + (error? error: null);
    export let FAILED_TO_FIND_USER_IN_REPORT = (name: string, report: string, funcName?: string) => 
        "Failed to find user '" + name + "' in report '" + report + "'" + (funcName? " in func " + funcName: "");
    export let PAGE_NOT_SUPPORT_FUNCTION = (funcName: string) =>
        "Page class does not support '"+funcName+"' function: did you forget to implement it in your subclass?";
    export let COULD_NOT_FIND_SCREEN_PATIENT_BUTTON = "Could not find button type on review page";
    export let SELECT_SITE_COUNT_DOES_NOT_MATCH_DATA = (sitesCount: number, dataCount: number) =>
        "Site code count (" + sitesCount + ") did not match given data count (" + dataCount + ")";
    export let COULD_NOT_FIND_DATA_IN_SITE_CODE = (data: string, siteCode: string[]) =>
        "Could not find data: " + data + " in site code array: " + JSON.stringify(siteCode);
    export let REPORT_NOT_VISIBLE = (message: string) =>
        "Report is not visible with error message: " + message;
}