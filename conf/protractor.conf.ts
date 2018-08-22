import { Config } from 'protractor';
import { ensureDirSync } from 'fs-extra';
import { argv as args } from 'yargs';

import * as moment from 'moment';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as proc from 'child_process';

const clientName = '4G Clinical';
const clientLogo = 'https://www.4gclinical.com/hs-fs/hubfs/New%20Content/4G-Clinical-logo.png?t=1510268020484&width=720&name=4G-Clinical-logo.png';

export let config: Config = {

    framework: 'custom',
    frameworkPath: require.resolve('protractor-cucumber-framework'),
    seleniumAddress: process.env.SELENIUM_URL || 'http://localhost:4444/wd/hub/',
    baseUrl: (process.env.PRANCER_HOST ? `http://${process.env.PRANCER_HOST}/` : 'http://prancer.4g.local/'),
    allScriptsTimeout: 80000,
    disableChecks: true,
    SELENIUM_PROMISE_MANAGER: false,
    specs: getFeatures(),

    cucumberOpts: {
        compiler: 'ts:ts-node/register',
        require: [
            path.resolve(process.cwd(), './conf/cucumber.conf.ts'),
            path.resolve(process.cwd(), './step_definitions/**/*.steps.ts')
        ],
        format: 'json:../out/tests/e2e/results/results.json',
        tags: args.tags || ''
    },

    multiCapabilities: [{
        browserName: 'chrome',
        chromeOptions: {
            args: ['disable-infobars']
        },
        shardTestFiles: true,
        maxInstances: 1,
        deviceProperties: {
            device: 'MacBook Pro 13',
            platform: {
                name: 'OSX', version: '10.13.1'
            }
        }
    }],

    plugins: [{
        package: 'protractor-multiple-cucumber-html-reporter-plugin',
        options: {
            reportName: '</p><img class="pull-left" src="' + clientLogo + '" alt="' + clientName + '" height="50"><p class="navbar-text">' + clientName + ' Test Report ' + moment().format('MM-DD-YYYY h:mm a') + '</p><img class="pull-right" src="http://www.zeenyx.com/LogoQualiTest%20Transparent.png" alt="QualiTest" height="50"><p>',
            automaticallyGenerateReport: true,
            openReportInBrowser: false,
            metadataKey: 'deviceProperties',
            saveCollectedJSON: true,
            disableLog: true,
            customData: {
                title: 'Results files',
                data: [
                    {label: '<a href="../../screenshots/screenshots.html">Screenshots</a>', value: ' - regular and failure screenshots '},
                    {label: '<a href="../../index.html">Debug files</a>', value: ' - debug logs and failure html files'}
                ]
            }
        }
    }],

    /**
     * Remove temp directories, load rerun features list,
     */
    beforeLaunch: () => {
        if (args.rerun) {
            // do nothing
        } else if (args.a || args.b || args.e || args.g) {
            clearTmpDirs();
            loadRerunFeaturesList();
        } else if (args.c || args.d) {
            clearTmpDirs();
            loadRerunFeaturesList();
            if(!args.dev && (!args.d || !args.fullrun)) {
                return loadReportsStack();
            }
        }
    
        return null;
    },

    params: {
        csrfToken: "",
        folderName: "",
        timerStart: Date.now(),
        timerEnd: Date.now(),
        testTimerStart: 0,
        timeout: 70000,
        study: "",
        site: "",
        year: "",

        printProperties: function (myObject) {
            if (typeof (myObject) === 'object') {
                var propValue;
                for (var propName in myObject) {
                    propValue = myObject[propName];
                    console.log(propName, propValue);
                }
            } else {
                console.log("Could not print properties, param is of type " + typeof (myObject) + " not object");
            }
        }
    },

    /**
     * Add screenshot, debug logs, and failure html results to E2E_Tests_Report
     */
    afterLaunch: () => {

        interface CustomReportData {
            title: string,
            path: string,
            command: (path: string) => string,
            writePath: (path: string) => string
        }

        interface CustomReportHTML {
            header: (text: string) => string,
            link: (text: string) => string,
            footer: string
        }

        let screenshots: CustomReportData = {
            title: 'Screenshots',
            path: '../out/tests/e2e/screenshots',
            command: (path: string) => 'find '+path+' -name "*.png"',
            writePath: (path: string) => path+'/screenshots.html'
        };

        let debug: CustomReportData = {
            title: 'Debug files',
            path: '../out/tests/e2e',
            command: (path: string) => "find "+path+" -maxdepth 1 -name '*.*'",
            writePath: (path: string) => path+'/index.html'
        }

        let html: CustomReportHTML = {
            header: (text: string) => "<!DOCTYPE html><html><body><h1>"+text+"</h1><p>",
            link: (entry: string) => '<a href="./'+entry+'">'+entry+'</a><br>',
            footer: "</body></html>"
        }

        return new Promise((res,rej) => {
            suppress(rej);
            type resp = (value?: {} | PromiseLike<{}>) => void;

            let writeData = (datas: CustomReportData[], html: CustomReportHTML, res: resp ) => {
                let data = datas[0];
                datas.splice(0, 1);
                proc.exec(data.command(data.path), (err, stdout, stderr) => {
                    suppress(err);
                    suppress(stderr);
                    let all = stdout.split('\n');
                    let page = html.header(data.title);
                    for(let entry of all) {
                        entry = entry.replace(data.path, "");
                        page += html.link(entry);
                    }
                    page += html.footer;
                    fs.writeFile(data.writePath(data.path), page, (err) => {
                        if(err) throw err;
                        if(datas.length > 0) {
                            writeData(datas, html, res);
                        } else {
                            res();
                        }
                    })
                });
            }

            writeData([screenshots, debug], html, res);
        })
    }
};

function getFeatures() {
    if (args.rerun) {
        const features = require("../.tmp/rerun/rerun.json");
        return features["features"];
    }
    
    if (args.features !== undefined) {
        return args.features.split(',').map(feature => `${process.cwd()}/features/suite-${args.current}/**/${feature}.feature`);
    }

    return [`${process.cwd()}/features/suite-${args.current}/**/*.feature`];
}

function clearTmpDirs() {
    if (!process.env.PRANCER_HOST) {
        fs.removeSync('./.tmp');
        fs.removeSync('../out');
    }
}

function loadRerunFeaturesList() {
    proc.exec('find features/suite-' + args.current + ' "*.feature"', (err, stdout, stderr) => {
        suppress(err);
        suppress(stderr);
        let specified = {};
        let tests;
        if (args.features) {
            args.features.split(",").forEach(k => specified[k] = true);
            tests = stdout.split("\n").filter(k => k.indexOf(".feature") !== -1)
                .filter(k => specified[/[\w.-]*.feature$/.exec(k).toString().split(".feature")[0]] == true)
                .map(k => "../" + k);
        } else {
            tests = stdout.split("\n").filter(k => k.indexOf(".feature") !== -1)
                .map(k => "../" + k);
        }
        let features = {};
        features["features"] = tests;
        var json = JSON.stringify(features);
        var fs = require('fs');
        ensureDirSync('.tmp/rerun/');
        fs.writeFile('.tmp/rerun/rerun.json', json, 'utf8', () => {});
    });
}

function loadReportsStack() {
    console.log("Loading reports stack...");
    return new Promise(function (resolve) {
        const request = require('request');
        let baseUrl = (process.env.PRANCER_HOST ?
            `http://${process.env.PRANCER_HOST}/` : 'http://prancer.4g.local/'
        );
        let authDataLogin = { email: 'admin@4gclinical.com', password: 'admin' }
        let optionsLogin = {
            method: 'POST', url: baseUrl + 'api/v1/auth/login',
            headers: { 'Content-Type': 'application/json' },
            body: authDataLogin, json: true
        }
        let loginCallback = function (error, response, body) {
            suppress(error);
            suppress(body);
            if(response.statusCode != 200) {
                let SITE_DOWN_ERROR = response.request.method+" to "+response.request.uri.href +
                    " failed with status "+response.statusCode
                throw Error(SITE_DOWN_ERROR);
            }
            let csrftoken = /csrftoken=(.*?);/.exec(response.rawHeaders
                .find(k => k.indexOf("csrftoken") !== -1))[1];
            let sessionid = /sessionid=(.*?);/.exec(response.rawHeaders
                .find(k => k.indexOf("sessionid") !== -1))[1];
            let dataLoad = { stack: "reports", command: "initialize_e2e_reports_stack" };
            let optionsLoad = {
                method: 'POST', url: baseUrl + 'test_api/stackloader',
                headers: {
                    'X-CSRFToken': csrftoken,
                    Cookie: "sessionid=" + sessionid + "; csrftoken=" + csrftoken,
                },
                body: dataLoad,
                json: true,
            }
            let loadCallback = function () {
                resolve(null);
            }
            request(optionsLoad, loadCallback);
        };
        request(optionsLogin, loginCallback);
    });
}

/**
 * Apparently this is the recommended way of suppressing cli errors with tslint
 * @param obj any object that is throwing an unused error in tslint
 */
function suppress(obj: any): void {
    !!false && eval(obj);
}