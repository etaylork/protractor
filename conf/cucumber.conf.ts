import { browser, by, element, ElementFinder, logger } from '../utils';
import { HookScenarioResult } from 'cucumber';
import { WriteStream, ensureDirSync, createWriteStream } from 'fs-extra';
import * as path from 'path';
import * as reports from '../pages/home/report';

let glob = require('glob');
const fs = require('fs-extra');

let debugFileName: string;
let rerunTestCase: TestCase;

const OUTPUT_DIR = "../out/tests/e2e";

const { After, AfterAll, Before, defineParameterType, setDefaultTimeout } = require("cucumber");

interface World {
    'attach': ((arg1: string | Buffer, arg2: string) => void);
};

interface TestCase extends HookScenarioResult {
    sourceLocation: ({
        uri: string;
        line: number
    });
    result: ({
        duration: number;
        status: string
    });
    pickle: ({
        name: string;
        tags: [
            {
                name: string;
            }
        ]
    });
};

setDefaultTimeout(120000);

Before(function (testCase: TestCase) {
    console.log("\n");
    logger.info("*** Test Case: " + testCase.sourceLocation.uri + " ***");
    logger.info("*** Scenario: " + testCase.pickle.name + " ***");
    //creates folder structure for screenshots 
    let featureTagName: string = testCase.pickle.tags[0].name.replace('@', '');
    debugFileName = OUTPUT_DIR + "/debug."+featureTagName+".log";
    browser.params.folderName = OUTPUT_DIR + "/screenshots/" + featureTagName + "/";
    browser.params.testCase = /^(.*?).feature/.exec(path.basename(testCase.sourceLocation.uri))[1];
    browser.params.testTimerStart = Date.now();
});

After(async function (testCase: TestCase): Promise<void> {
    const world = this;
    let testCaseStatusResult = testCase.status ? testCase.status : testCase.result.status;
    let testTime = (Date.now() - browser.params.testTimerStart)/1000;

    rerunTestCase = testCase;

    console.log("\n");
    await logger.info("*** Test case status result: " + testCaseStatusResult + " ***");
    await logger.info("*** Final URL: " + await browser.getCurrentUrl() + " ***");
    await logger.info("*** Time: " + testTime + " ***");

    logger.debug("\n");
    await browser.manage().logs().get('browser').then(async function(browserLog) {
        let history = {};
        for(let log of browserLog) {
            if(typeof history[log.message] === 'undefined') {
                await logger.debug("browser: " + log.timestamp + " " + log.level.name_ + " " + log.message);
                history[log.message] = "";
            }
        }
    });

    if (testCaseStatusResult === 'failed') {
        await saveFailedScenarioScreenshot(<World>world, testCase);
        await savePageHTML(testCase);
    }

    // multi-scenario features require logouts between tests
    let logout: ElementFinder = element(by.id("logout"));
    if (await logout.isPresent()) {
        await logout.click();
        await browser.waitForAngular();
    }
});

AfterAll(async function () {
    let testCase = rerunTestCase;

    let testCaseStatusResult = testCase.status ? testCase.status : testCase.result.status;

    if (testCaseStatusResult === 'passed') {
        let features = {};
        ensureDirSync('.tmp/rerun/');
        features = require("../.tmp/rerun/rerun.json");
        for (let i = 0; i < features["features"].length; i++) {
            let test: string = features["features"][i].split("../")[1];
            if (testCase.sourceLocation.uri.indexOf(test) !== -1) {
                logger.debug("Removing " + test + " from reruns...");
                features["features"].splice(i, 1);
            }
        }
        var json = JSON.stringify(features);
        //var fs = require('fs');
        ensureDirSync('.tmp/rerun/');
        fs.writeFile('.tmp/rerun/rerun.json', json, 'utf8');
    }

    // attach feature file name to debug log file
    if (fs.existsSync(OUTPUT_DIR + '/debug.log')){
        fs.rename(OUTPUT_DIR + '/debug.log', debugFileName, function(err){
            if ( err ) console.log('ERROR: ' + err);
        })
    }
});

defineParameterType({
    typeName: 'report',
    regexp: new RegExp(Object.keys(reports)
        .filter((i) => isReport(i)) 
        .map((i) => getId(i))
        .join("").replace(/.$/,"")),
    transformer: (name: string) => Object.keys(reports)
        .filter((p) => isReport(p))
        .filter((p) => {
            let other = getId(p).replace(/.$/,"");
            return name.indexOf(other) !== -1;
        })
        .map((p) => new reports[p])[0]
});

function getId (i: string): string { return ((new reports[i]()).id) + "|"; }

function isReport (i: string): boolean {
    try{
        let report: reports.Report = new reports[i]();
        let result: boolean = report instanceof reports.Report && report.constructor.name !== reports.Report.name;
        return result;
    } catch (e) {
        return false;
    }
}

defineParameterType({
    typeName: 'data',
    regexp: new RegExp(fs.readdirSync("pages/home/report/data/")
        .map(i => i + "|").join("").replace(/.$/,"")),
    transformer: (name: string) => require("../pages/home/report/data/" + name)
});

defineParameterType({
    typeName: 'page',
    regexp: new RegExp(glob.sync("pages/**/*.page.ts")
        .map(i => /^(.*?).page.ts/.exec(path.basename(i))[1] + "|")
        .join("").replace(/.$/,"")),
    transformer: async (name: string) => {
        let page: string = glob.sync("pages/**/*.page.ts")
            .filter(i => {
                let result = /^(.*?).page.ts/.exec(path.basename(i))[1];
                return name === result;
            })[0];
        let somePage = require("../" + page);
        let result = new somePage[Object.keys(somePage)[0]];
        return await result.open();
    }
});

async function saveFailedScenarioScreenshot(world: World, testCase: TestCase) {
    const screenshot: string = await (browser.takeScreenshot());
    const featureName: string = /^(.*?).feature/.exec(path.basename(testCase.sourceLocation.uri))[1];
    const scenarioName: string = testCase.pickle.name.replace(" ", "-");
    const fileName: string = `${Date.now()}.feature-${featureName}.scenario-${scenarioName}.png`;

    await saveScreenshot(screenshot, fileName);

    world.attach(screenshot, 'image/png');

    return Promise.resolve();
};

function saveScreenshot(screenshot: string, fileName: string) {
    const screenshotPath: string = path.resolve(process.cwd(), OUTPUT_DIR + '/screenshots/failures');
    const filepath: string = path.resolve(screenshotPath, fileName);

    let stream: WriteStream;

    ensureDirSync(screenshotPath);
    stream = createWriteStream(filepath);
    stream.write(new Buffer(screenshot, 'base64'));
    stream.end();
};

async function savePageHTML(testCase: TestCase) {
    let page = element(by.css("html"));

    const featureName = /^(.*?).feature/.exec(path.basename(testCase.sourceLocation.uri))[1];
    const scenarioName = testCase.pickle.name.replace(" ", "-");
    const fileName = `failure-html.${Date.now()}.feature-${featureName}.scenario-${scenarioName}.html`;

    const htmlPath = path.resolve(process.cwd(), OUTPUT_DIR);
    const filepath = path.resolve(htmlPath, fileName);

    ensureDirSync(htmlPath);
    fs.writeFileSync(filepath, await page.getAttribute('innerHTML'));
};
