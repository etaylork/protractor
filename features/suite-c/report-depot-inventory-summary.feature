@depot-inventory-summary-report
Feature: Depot Inventory Summary Report
    Prancer-3777 Depot Inventory Summary Report
    TC-1943 AC Completed: AC1, AC2, AC3
    
    @disr-sup
    Scenario: Depot inventory summary report Supply Manager
        Given 'Supply Manager' is logged in
        And I select study "qa_smoke_regression_teststudy1" only on the selector page
        When I am on the 'report' page
        Then the 'Depot Inventory Report' report is listed
        And the report description does have the unblinded label displayed
        When I open the 'Depot Inventory Report' report
        Then the 'Depot Inventory Report' report is visible and shows accurate data - 'test-data-disr.json'
        When I filter each column in the report
        Then each column filters
        When I sort each column in the report
        Then each column sorts
        When I use the 'next' arrow to navigate to a different page
        Then I verify that I was navigated to a different page
        When I download CSV and PDF files for the report
        Then the pdf file 'Prancer - Depot Inventory Report-Unblinding' was downloaded successfully on chrome downloads
        And the csv file 'Prancer - Depot Inventory Report-Unblinding' was downloaded successfully on chrome downloads