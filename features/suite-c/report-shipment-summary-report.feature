@shipment-summary-report
Feature: Shipment Summary Report
    Prancer-3842 Shipment Summary Report
    TC-1946 AC Completed: AC1 - AC4, AC6, AC7

    @ssr-sup
    Scenario: Shipment summary report Supply Manager
        Given 'Supply Manager' is logged in
        And I select study "qa_smoke_regression_teststudy1" only on the selector page
        When I open the 'Shipments Report' report
        Then the 'Shipments Report' report is visible and shows accurate data - 'test-data-shpsr.sup.json'
        When I download CSV and PDF files for the report
        Then the pdf file 'Prancer - Shipments Report' was downloaded successfully on chrome downloads
        And the csv file 'Prancer - Shipments Report' was downloaded successfully on chrome downloads
        When I select shipment report '1'
        Then the 'Shipment Details Report' report is open for shipment '1'
        When I open the 'Shipments Report' report
        And I filter each column in the report
        Then each column filters
        When I sort each column in the report
        Then each column sorts
        When I click on a notification link
        Then the notification heading is displayed
        When I download the notification PDF
        Then the pdf file 'Notification' was downloaded successfully on chrome downloads

    @ssr-smon
    Scenario: Shipment summary report Site Monitor
        Given 'Site Monitor' is logged in
        And I select study "qa_smoke_regression_teststudy1" and site "BE10003" on the selector page
        When I open the 'Shipments Report' report
        Then the 'Shipments Report' report is visible and shows accurate data - 'test-data-shpsr.smon.json'
        When I download CSV and PDF files for the report
        Then the pdf file 'Prancer - Shipments Report' was downloaded successfully on chrome downloads
        And the csv file 'Prancer - Shipments Report' was downloaded successfully on chrome downloads 
        When I select shipment report '1'
        Then the 'Shipment Details Report' report is open for shipment '1'
        When I open the 'Shipments Report' report
        And I click on a notification link
        Then the notification heading is displayed
        When I download the notification PDF 
        Then the pdf file 'Notification' was downloaded successfully on chrome downloads
