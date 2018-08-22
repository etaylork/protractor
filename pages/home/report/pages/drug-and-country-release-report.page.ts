import { browser, waitText, utils } from '../../../../utils';
import { TableDefinition } from 'cucumber';

import { Report } from '../';
import { UserRole } from '../../../../utils/user.role';

export class DrugAndCountryReleaseReport extends Report {

    id: string = "Drug and Country Release Report";
    title: string = "LOT_TRANSACTION_HISTORY_REPORT";

    async hasRequiredData(user: UserRole, data: {}, table: TableDefinition) {

        await utils.screenshot("dacrr-report.png");

        switch (user) {
            case UserRole.roles.SupplyManager:
                return await this.verifyMetaData(table) &&
                    await this.displaysData(data) &&
                    await this.isUnblinded();
        }
        return false;
    }

    public async verifyMetaData(table: TableDefinition): Promise<boolean> {

        await browser.waitForAngular();

        var headerArr = [];
        var metaDataArr = [];

        let process = async k => {
            await k.isDisplayed();
            let text = await waitText(k);
            let keyValue = text.split(" :");
            headerArr.push(keyValue[0]);
            if (keyValue[1] == undefined) {
                metaDataArr.push(keyValue[0]);
            } else if (keyValue[1].charAt(0) == " ") {
                metaDataArr.push(keyValue[1].slice(1));
            } else {
                metaDataArr.push(keyValue[1]);
            }
        }

        //site header data 
        await process(this.site_code);

        //sub data
        for (let i = 0; i < await this.subheaderData.count(); i++) {
            await process(this.subheaderData.get(i));
        }

        //meta data 
        for (let i = 0; i < await this.metaData.count(); i++) {
            await process(this.metaData.get(i));
        }
        //verify headers and meta data are there 
        for (let key of table.hashes()) {
            if (headerArr.indexOf(key.header) !== -1 && metaDataArr.indexOf[key.metaData] !== -1) {
                return true;
            } else {
                return false;
            }
        }

        return true;
    }
}