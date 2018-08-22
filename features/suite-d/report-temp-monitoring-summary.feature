@temp-monitoring-summary-report
Feature: Temperature Monitoring Summary Report
    Prancer-3743 Temperature Monitoring Summary Report
    TC-2202 AC Completed: AC1, AC2, AC3(Partially)
    Need more data in table to use pagination buttons
    Column: Uploaded Temp Log does not have a link to click on

    @tmsr-sup
    Scenario: Temperature monitoring summary report Supply Manager
        Given 'Supply Manager' is logged in
        And I select study "qa_smoke_regression_teststudy1" only on the selector page
        When I am on the 'report' page
        Then the 'Temperature Monitoring Summary Report' report is listed
        And the report description does have the unblinded label displayed
        When I open the 'Temperature Monitoring Summary Report' report
        Then the 'Temperature Monitoring Summary Report' report is visible and shows accurate data - 'test-data-tmsr.sup.json'
        When I select temperature excursion ID 'Excursion 1'
        Then the 'Temperature Monitoring Details Report' report is open for excursion 'excursion_1'
        When I open the 'Temperature Monitoring Summary Report' report
        When I filter each column in the report
        Then each column filters
        When I sort each column in the report
        Then each column sorts
        When I download CSV and PDF files for the report 
        Then the pdf file 'Prancer - Temperature Monitoring Summary Report-Unblinding' was downloaded successfully on chrome downloads
        And the csv file 'Prancer - Temperature Monitoring Summary Report-Unblinding' was downloaded successfully on chrome downloads

    @tmsr-si
    Scenario: Temperature monitoring summary report Principal Invesitagtor
        Given 'Principal Investigator' is logged in
        And I select study "qa_smoke_regression_teststudy1" only on the selector page
        When I am on the 'report' page
        Then the 'Temperature Monitoring Summary Report' report is listed
        And the report description does not have the unblinded label displayed
        When I open the 'Temperature Monitoring Summary Report' report
        And I select temperature excursion ID 'Excursion 1'
        Then the 'Temperature Monitoring Details Report' report is open for excursion 'excursion_1'
        When I open the 'Temperature Monitoring Summary Report' report
        And I download CSV and PDF files for the report
        Then the pdf file 'Prancer - Temperature Monitoring Summary Report' was downloaded successfully on chrome downloads
        And the csv file 'Prancer - Temperature Monitoring Summary Report' was downloaded successfully on chrome downloads
        And I set values to 'false' in the pooling group temp config
        Then the 'Temperature Monitoring Summary Report' report is visible and shows accurate data - 'test-data-tmsr.si.json'
        And I set values to 'default' in the pooling group temp config