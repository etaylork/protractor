import { Err, expect, TableDefinition, UserRole, utils } from '../../../../../utils';

import { Report } from '../../';

export class LotDetailReport extends Report {

    id: string = "Lot Detail Report";
    title: string = "LOT_DETAIL_REPORT_TITLE";
    linkID: string = "LOT_DETAIL_REPORT";

    description: string = "Detailed header information about a lot and per kit along with current location.";

    async hasRequiredData(user: UserRole, data: {}, table: TableDefinition) {
        await utils.screenshot("ldr-report.png");

        switch (user) {
            case UserRole.roles.SupplyManager:
                expect(await this.verifyMetaData(table), Err.VERIFY_META_DATA).to.be.true;
                expect(await this.displaysData(data), Err.DISPLAYS_DATA).to.be.true;
                expect(await this.isUnblinded(), Err.IS_UNBLINDED).to.be.true;
                return true;
            default:
                throw new Error(Err.FAILED_TO_FIND_USER_IN_REPORT(user.name, this.id, arguments.callee.name));
        }
    }

    async hasNoVisibleData(user: UserRole): Promise<boolean> {
        switch (user) {
            case UserRole.roles.SupplyManager:
                expect(await this.isUnblinded()).to.be.true;
                expect(await super.hasNoVisibleData()).to.be.true;
                return true;
            default:
                throw new Error(Err.FAILED_TO_FIND_USER_IN_REPORT(user.name, this.id, arguments.callee.name));
        }
    }
}