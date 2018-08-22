@country-summary-report
Feature: Country Summary Report
    Acceptance Criteria Completed: AC1, AC2, AC3, AC4, AC5

    @csr-sm
    Scenario: Country summary report Supply Manager
        Given 'Study Manager' is logged in
        And I select study "qa_smoke_regression_teststudy1" only on the selector page
        When I open the 'Country Summary Report' report
        Then the 'Country Summary Report' report is visible and shows accurate data - 'test-data-csr.json'
        When I select the country 'United States of America' link
        Then the 'Study Sites Report' report is open for country 'US'
        When I open the 'Country Summary Report' report
        And I filter each column in the report
        Then each column filters
        When I sort each column in the report
        Then each column sorts
        When I configure the reports landscape to 'true'
        And I log out 
        And 'CSL' is logged in 
        And I select study "qa_smoke_regression_teststudy1" only on the selector page
        And I open the 'Country Summary Report' report
        When I download CSV and PDF files for the report
        Then the pdf file 'Prancer - Country Summary Report' was downloaded successfully on chrome downloads
        And the csv file 'Prancer - Country Summary Report' was downloaded successfully on chrome downloads