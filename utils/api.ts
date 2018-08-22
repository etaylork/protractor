import { protractor,browser } from 'protractor';
import { logger } from '../utils/logger';
import { ensureDirSync } from 'fs-extra';

const xhrc = require('xmlhttprequest-cookie');
const XMLHttpRequest = xhrc.XMLHttpRequest;
const CookieJar = xhrc.CookieJar;
const Cookie = require('xmlhttprequest-cookie/xmlhttprequest-cookie-obj');

let fs = require('fs');

export class API {

    email: string = "admin@4gclinical.com";
    password: string = "admin";
    token: string = null;

    setToken(token: string) {
        this.token = token;
    }

    post(path: string, body: string): Promise<any> {
        browser.params.timerStart = new Date().getTime();
        logger.debug("Posting to api with path="+path+" and body="+body+");")
        var parent = this;

        return new Promise(async function(resolve) {
            // Login
            var loginRequest = new XMLHttpRequest();
            loginRequest.debug = false;
            let baseURL = browser.baseUrl;
            loginRequest.open('POST', baseURL + 'api/v1/auth/login', );
            loginRequest.setRequestHeader('Content-Type', 'application/json');
            if(browser.params.csrfToken !== "") {
                let csrfValue = browser.params.csrfToken;
                loginRequest.setRequestHeader('X-CSRFToken', csrfValue);
            }
            loginRequest.send('{"email":"' + parent.email + '", "password":"' + parent.password + '"}');

            loginRequest.onreadystatechange = function() {
                if (loginRequest.readyState === 4) {
                    const fileName = `login.${loginRequest.status}.${Date.now()}.html`;
                    const dir = "../out/tests/e2e/api/";

                    ensureDirSync(dir);
                    fs.writeFileSync(dir+fileName, loginRequest.responseText);

                    if(loginRequest.status != '200') {
                        throw Error("Login request failed! " + loginRequest.status);
                    }

                    var cookieString: string = 'authenticatedAccount=' + encodeURIComponent(loginRequest.responseText) + '; HttpOnly; Path=/';
                    let baseURL = protractor.browser.baseUrl;
                    var url: string = baseURL;
                    CookieJar.insert(Cookie.build(cookieString, url));

                    // Authenticated request
                    var authenticatedRequest = new XMLHttpRequest();
                    authenticatedRequest.debug = false;
                    authenticatedRequest.open('POST', baseURL + path,true);
                    authenticatedRequest.setRequestHeader('Content-Type', 'application/json');

                    // Set CSRF token
                    var loginCookieString = loginRequest.getResponseHeader('Set-Cookie');
                    var cookieArray = ('' + loginCookieString).split('; ');
                    var csrfToken = "";
                    for( let value of cookieArray){
                        if(value.indexOf("csrftoken") !== -1){
                            csrfToken = value; 
                        }
                    }
                    var csrfTokenArray = csrfToken.split('=');
                    var csrfValue = csrfTokenArray[csrfTokenArray.length -1];

                    browser.params.csrfToken = csrfValue;
                    authenticatedRequest.setRequestHeader('X-CSRFToken', csrfValue);

                    authenticatedRequest.send(body);

                    authenticatedRequest.onreadystatechange = function() {
                        if (authenticatedRequest.readyState === 4) {
                            browser.params.timerEnd = new Date().getTime();

                            const fileName = `request.${authenticatedRequest.status}.${Date.now()}.html`;
                            const dir = "../out/tests/e2e/api/";

                            ensureDirSync(dir);
                            fs.writeFileSync(dir+fileName, authenticatedRequest.responseText);

                            if(authenticatedRequest.status != '200') {
                                throw Error("Authenticated request failed! status: " + authenticatedRequest.status);
                            } else {
                                logger.debug("Call completed successfully... time was " + (browser.params.timerEnd-browser.params.timerStart)/1000 + " seconds");
                                if(authenticatedRequest.responseText != "")
                                    resolve(JSON.parse(authenticatedRequest.responseText));
                            }
                            resolve(null);
                        }
                    };
                }
            };
        });
    }

    constructor() { }
}