import { by, element, expect, waitClick, waitText } from '../../../utils';

import { AddSitePage, SitePage, TableDefinition } from '../../../pages';

const addSitePage: AddSitePage = new AddSitePage();
const sitePage: SitePage = new SitePage();

const { When, Then } = require('cucumber');

When(/^I click the update site button$/,
    async function(){
        await waitClick(sitePage.updateSiteButton);
    });

When(/^I filter each column on the site page$/, { timeout: 180 * 1000 },
    async function () {
        let result = {};
        let table = sitePage.tables.get(0);
        let tableResult: {}[] = [];
        let columns = sitePage.tables.get(1).all(by.css("td"));
        let columnsLength: number = await table.all(by.css("tr")).get(0).all(by.css("th")).count();
        for(let columnIndex = 0; columnIndex < columnsLength; columnIndex++) {
            let values = element.all(by.xpath('(//table[1])//td'));
            let filteredResult = await sitePage.filter(table, columnIndex, await waitText(values.get(columnIndex)));
            let json = { index: columnIndex, name:await columns.get(columnIndex).getText(), result: filteredResult };
            tableResult.push(json);
        }
        
        result[0] = tableResult;
        

        this.filterResult = result;
    });

When(/^I sort each column on the site page$/,
    async function () {
        let sortResult: object[] = [];
        let table = await sitePage.tables.get(0);
        let sorters = table.all(by.css("md-icon.md-sort-icon"));
        let count: number = await sorters.count();
        for(let i = 0; i < count; i++) {
            sortResult.push(await sitePage.sort(table, i));
        }
        this.sortResult = sortResult;
    });

When(/^I clear all filters on the site page$/,
    async function(){
        await sitePage.clearFilters();
    });

Then(/^all kits are visible to the user on the edit site page$/,
    async function(table: TableDefinition){
        for(let entry of table.hashes()){
            expect(await addSitePage.kits(entry['Kits']).isDisplayed()).to.be.true;
        }
    });