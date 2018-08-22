@temp-excursion-summary-report
Feature: Temperature Excursion Summary Report
    Prancer-3665 Temperature Excursion Summary Report
    TC-1907 AC Completed: AC1, AC2, AC3, AC4, AC5, AC6, AC7

    @tesr-sup
    Scenario: Temperature excursion summary report Supply Manager
        Given 'Supply Manager' is logged in
        And I select study "qa_smoke_regression_teststudy1" only on the selector page
        When I am on the 'report' page
        Then the 'Temperature Excursion Summary Report' report is listed
        And the report description does have the unblinded label displayed
        When I open the 'Temperature Excursion Summary Report' report
        Then the 'Temperature Excursion Summary Report' report is visible and shows accurate data - 'test-data-tesr.json'
        When I filter each column in the report
        Then each column filters
        When I sort each column in the report
        Then each column sorts
        When I download CSV and PDF files for the report    
        Then the pdf file 'Prancer - Temperature Excursion Summary Report-Unblinding' was downloaded successfully on chrome downloads
        And the csv file 'Prancer - Temperature Excursion Summary Report-Unblinding' was downloaded successfully on chrome downloads
        And I select temperature excursion ID '1'
        Then the 'Temperature Excursion Detail Report' report is open for excursion '1'

    @tesr-si
    Scenario: Temparature excursion summary report Principal Investigator
        Given 'Principal Investigator' is logged in
        And I select study "qa_smoke_regression_teststudy1" only on the selector page
        When I am on the 'report' page
        Then the 'Temperature Excursion Summary Report' report is listed
        And the report description does not have the unblinded label displayed
        When I open the 'Temperature Excursion Summary Report' report
        Then the 'Temperature Excursion Summary Report' report is visible and shows accurate data - 'test-data-tesr.json'
        When I download CSV and PDF files for the report
        Then the pdf file 'Prancer - Temperature Excursion Summary Report' was downloaded successfully on chrome downloads
        And the csv file 'Prancer - Temperature Excursion Summary Report' was downloaded successfully on chrome downloads
        And I select temperature excursion ID '1'
        Then the 'Temperature Excursion Detail Report' report is open for excursion '1'