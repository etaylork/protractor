@kit-history-report
Feature: Kit History Report
    Prancer-3626 Kit History Report
    TC-2050 AC Completed: AC1, AC2, AC3, AC4, AC5

    @khr-csl
    Scenario: Kit history report CSL
        Given 'CSL' is logged in
        And I select study "qa_smoke_regression_teststudy1" and site "S0015" on the selector page
        When I am on the 'report' page
        Then the 'Kit History Report' report is listed
        And the report description does have the unblinded label displayed
        When I open the 'Kit History Report' report
        Then the report is visible and shows no data
        When I select kit '10001'
        Then the 'Kit History Report' report is visible and shows required data - 'test-data-khr.json'
            | header       | metaData                              |
            | Kit ID       | 10001                                 |
            | Location     | qa_smoke_regression_teststudy1: S0015 |
            | Country      | United States of America              |
            | Supply Depot | USDEP1                                |
            | Kit type     | Chocolate                             |
            | Status       | Available                             |
        When I filter each column in the report
        Then each column filters
        When I sort each column in the report
        Then each column sorts
        When I update the expiration date for the lot containing kit '10001'
        And I open the 'Kit History Report' report
        Then the updated lot expiration date is displayed on the report
        When I quarantine the lot containing kit '10001'
        And I open the 'Kit History Report' report
        Then the kit status updates to 'Quarantined' in the report
        And I release the lot from quarantine
        When I randomize a patient and note down the kit id
        And I open the 'Kit History Report' report
        Then the kit displays a dispensing action update for the patient
        When I download CSV and PDF files for the report
        Then the pdf file 'Prancer - Kit History Report-Unblinding' was downloaded successfully on chrome downloads
        And the csv file 'Prancer - Kit History Report-Unblinding' was downloaded successfully on chrome downloads

    @khr-sm
    Scenario: Kit history report Study Manager
        Given 'Study Manager' is logged in
        And I select study "qa_smoke_regression_teststudy1" only on the selector page
        When I am on the 'report' page
        Then the 'Kit History Report' report is listed
        When I open the 'Kit History Report' report
        Then the report is visible and shows no data
        When I download CSV and PDF files for the report
        Then the pdf file 'Prancer - Kit History Report' was downloaded successfully on chrome downloads
        And the csv file 'Prancer - Kit History Report' was downloaded successfully on chrome downloads

    @khr-reload-reports-stack
    Scenario: Clean reload for reports data
        Given load 'reports' stack data - 'initialize_e2e_reports_stack'