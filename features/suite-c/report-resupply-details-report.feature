@resupply-details
Feature: Resupply Details Report
    Prancer-462 Resupply Details
    TC-3156 AC Completed : AC1, AC2
    Requirements Completed:


    @hkd-sup
    Scenario: Resupply details report for CSL
        Given 'CSL' is logged in
        And I select study "qa_smoke_regression_teststudy1" only on the selector page
        When I am on the 'report' page
        Then the 'Resupply Details' report is listed
        And the report description does have the unblinded label displayed
        When I open the 'Resupply Details' report
        Then the 'Resupply Details' report is visible and shows required data - 'test-data-rdr.json'
            | header                                                   | metaData                                                   |
            | Resupply Run ID                                          | 1                                                          |
            | Run Parameters                                           | Pooling Group: qa_smoke_regression_teststudy1, Site: S0018 |
            | Run Time                                                 |                                                            |
            | Run Type                                                 | Site                                                       |
            | Forecasting Run Executed                                 |                                                            |
            |                                                          |                                                            |
            |                                                          |                                                            |
        When I filter each column in the report
        Then each column filters
        When I sort each column in the report
        Then each column sorts
        When I download CSV and PDF files for the report
        Then the pdf file 'Prancer - Resupply Details-Unblinding' was downloaded successfully on chrome downloads
        And the csv file 'Prancer - Resupply Details-Unblinding' was downloaded successfully on chrome downloads