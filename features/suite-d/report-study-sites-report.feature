@study-sites-report
Feature: Study Sites Report
    AC Completed: AC1, AC2, AC3, AC4, AC5
    Columns that don't filter correctly: Study status

    @ssr-sm
    Scenario: Study sites report Supply Manager
        Given 'Study Manager' is logged in
        And I select study "qa_smoke_regression_teststudy1" only on the selector page
        When I open the 'Study Sites Report' report
        Then the 'Study Sites Report' report is visible and shows accurate data - 'test-data-ssr.sm.json'
        When I select the study site 'BE10003' link
        Then the link opens the correct 'Site Detail Report'
        When I filter each column in the report
        Then each column filters
        When I sort each column in the report
        Then each column sorts
        When I download CSV and PDF files for the report
        Then the pdf file 'Prancer - Study Sites Report' was downloaded successfully on chrome downloads
        And the csv file 'Prancer - Study Sites Report' was downloaded successfully on chrome downloads

    @ssr-smon
    Scenario: Study sites report Site Monitor
        Given 'Site Monitor' is logged in
        And I select study "qa_smoke_regression_teststudy1" and site "BE10003" on the selector page
        When I open the 'Study Sites Report' report
        Then the 'Study Sites Report' report is visible and shows accurate data - 'test-data-ssr.smon.json'
        When I download CSV and PDF files for the report
        Then the pdf file 'Prancer - Study Sites Report' was downloaded successfully on chrome downloads
        And the csv file 'Prancer - Study Sites Report' was downloaded successfully on chrome downloads 
        And I select the study site 'S0015' link
        Then the link opens the correct 'Site Detail Report'
