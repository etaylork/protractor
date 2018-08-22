@accountability-summary-report
Feature: Accountability Summary Report
    Prancer-4205 Accountability Summary Report
    TC-2321 Steps: 1-3, 6, 8 AC Completed: AC1 - AC4

    Scenario: Accountability summary report CSL
        Given 'CSL' is logged in
        And I select study "qa_smoke_regression_teststudy1" only on the selector page
        When I am on the 'report' page
        Then the 'Accountability Summary' report is listed
        And the report description does not have the unblinded label displayed
        When I open the 'Accountability Summary' report
        Then the 'Accountability Summary' report is visible and shows accurate data - 'test-data-asr.csl.json'
        And I select the study site 'BE10003' link
        Then the 'Accountability Details' report is open for site 'BE10003'
        When I open the 'Accountability Summary' report
        When I sort column 'Type'
        Then the column is sorted
        And I sort column 'Site ID'
        Then the column is sorted
        And I filter the 'Site ID' column for 'BE10003'
        Then the column filters
        When I filter the 'Type' column for 'blinded kit'
        Then the column filters
        When I clear all filters in the report
        And I download CSV and PDF files for the report
        Then the pdf file 'Prancer - Accountability Summary' was downloaded successfully on chrome downloads
        And the csv file 'Prancer - Accountability Summary' was downloaded successfully on chrome downloads

    Scenario: Accountability summary report Study Manager
        Given 'Study Manager' is logged in
        And I select study "qa_smoke_regression_teststudy1" only on the selector page
        When I am on the 'report' page
        Then the 'Accountability Summary' report is listed