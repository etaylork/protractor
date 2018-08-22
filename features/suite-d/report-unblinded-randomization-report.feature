@unblinded-randomization-report
Feature: Unblinded Randomization Report
    Prancer-3815 Unblinded Randomization Report
    TC-1994 AC Completed: AC1, AC2
    
    @ubrr-csl
    Scenario: Unblinded randomization report CSL
        Given 'CSL' is logged in
        And I select study "qa_smoke_regression_teststudy1" only on the selector page
        When I am on the 'report' page
        Then the 'Unblinded Randomization Report' report is listed
        And the report description does have the unblinded label displayed
        When I open the 'Unblinded Randomization Report' report
        Then the 'Unblinded Randomization Report' report is visible and shows accurate data - 'test-data-ubrr.json'
        When I select patient 'QASR0001' link
        Then the 'Patient Detail Report' report is open for patient 'QASR0001'
        When I open the 'Unblinded Randomization Report' report
        When I filter each column in the report
        Then each column filters
        When I sort each column in the report
        Then each column sorts
        When I download CSV and PDF files for the report
        Then the pdf file 'Prancer - Unblinded Randomization Report-Unblinding' was downloaded successfully on chrome downloads
        And the csv file 'Prancer - Unblinded Randomization Report-Unblinding' was downloaded successfully on chrome downloads