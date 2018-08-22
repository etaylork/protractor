import * as request from 'request';
import {browser, promise} from 'protractor';
import {IWebDriverOptionsCookie} from 'selenium-webdriver';
// import {logger} from "../utils/logger";

export function getBaseUrlIfNotCurrent(): promise.Promise<void> {
    return browser.driver.getCurrentUrl()
        .then((currentUrl: string) => {
            if(currentUrl.indexOf(browser.baseUrl) != 0) {
                return browser.get(browser.baseUrl);
            }else{
                return null;
            }
        });
}

export function getBrowserCookies() {
    return getBaseUrlIfNotCurrent()
        .then(() => {
            return browser.manage().getCookies();
        });
}

export function copyToCookieJar(browserCookies: IWebDriverOptionsCookie[]) {
    let jar = request.jar();
    for (let browserCookie of browserCookies) {
        let jarCookie = request.cookie(`${browserCookie.name}=${browserCookie.value}`);
        jar.setCookie(jarCookie, browser.baseUrl);
    }
    return jar;
}

export function filterCookies(name: string, cookieJar: request.CookieJar): request.Cookie[] {
    let cookies = cookieJar.getCookies(browser.baseUrl);
    return cookies.filter((c: any) => c.key == name);
}
