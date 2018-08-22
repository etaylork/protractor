import { expect, logger, api } from '../../../utils';

import { CohortsPage } from '../../../pages/study/cohorts.page';

const { Given, When } = require("cucumber");

const cohortsPage: CohortsPage = new CohortsPage();

Given(/^the values have been updated for '(.*?)'/,
    async function (cohort:string) {
        logger.debug("cohort study steps: the values have been updated for '(.*?)' ");

        let query = {
            "desc": "test1",
            "study": "cohortstudy1",
            "cohort_code": cohort,
            "rank": "12",
            "status": false,
            "screen_cap": "15",
            "rand_cap": "12"
        }
        
        let response = await api.post("test_api/updatecohort", JSON.stringify(query));
        await expect(response['result']).to.equal('success');
    });

When(/^I update the rank field to '(.*?)' for '(.*?)' in the UI$/,
    async function (rank:string, cohort: string){
        await cohortsPage.updateRankField(cohort, rank);
    });