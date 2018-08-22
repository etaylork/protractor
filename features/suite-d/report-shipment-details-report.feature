@shipment-details-report
Feature: Shipment Details Report
    Prancer-3844 Shipment Details Report
    TC-1940 AC Completed: AC1, AC2, AC3, AC6, AC7, AC10 (AC1-3, AC6-7)
    Requirements Completed:
        Prancer-1838 AC5
        Prancer-1993 AC2-AC3

    @shpdr-sup
    Scenario: Shipment details report Supply Manager
        Given 'Supply Manager' is logged in
        And I select study "qa_smoke_regression_teststudy1" only on the selector page
        When I am on the 'report' page
        Then the 'Shipment Details Report' report is listed
        And the report description does have the unblinded label displayed
        When I open the 'Shipment Details Report' report
        And I select shipment '1'
        Then the 'Shipment Details Report' report is visible and shows accurate data - 'test-data-shpdr.sup.json'
        When I use the 'next' arrow to navigate to a different page
        Then the 'Shipment Details Report' report is visible and shows accurate data - 'test-data-shpdr.sup.json'
        When I use the 'next' arrow to navigate to a different page
        Then the 'Shipment Details Report' report is visible and shows accurate data - 'test-data-shpdr.sup.1.json'
        When I open the 'Shipment Details Report' report
        And I select shipment '1'
        And I filter each column in the report
        Then each column filters
        When I sort each column in the report
        Then each column sorts
        When I use the 'next' arrow to navigate to a different page
        Then I verify that I was navigated to a different page
        When I download CSV and PDF files for the report
        Then the pdf file 'Prancer - Shipment Details Report' was downloaded successfully on chrome downloads
        And the csv file 'Prancer - Shipment Details Report' was downloaded successfully on chrome downloads

    @shpdr-sm
    Scenario: Shipment details report Study Manager
        Given 'Study Manager' is logged in
        And I select study "qa_smoke_regression_teststudy1" only on the selector page
        When I open the 'Shipment Details Report' report
        And I select shipment '1'
        Then the 'Shipment Details Report' report is visible and shows accurate data - 'test-data-shpdr.sm.json'
        When I use the 'next' arrow to navigate to a different page
        When I download CSV and PDF files for the report   
        Then the pdf file 'Prancer - Shipment Details Report' was downloaded successfully on chrome downloads
        And the csv file 'Prancer - Shipment Details Report' was downloaded successfully on chrome downloads

    @shpdr-tp
    Scenario: Shipment details report Pharmacist
        Given 'Pharmacist' is logged in
        And I select study "qa_smoke_regression_teststudy1" only on the selector page
        When I open the 'Shipment Details Report' report
        Then the only shipments associated with the 'Pharamacist' role are displayed
            | values |
            | 1      |
            | 8      |
            | 12     |
        And I select shipment '1'
        Then the 'Shipment Details Report' report is visible and shows accurate data - 'test-data-shpdr.tp.json'
        When I use the 'next' arrow to navigate to a different page
        Then the 'Shipment Details Report' report is visible and shows accurate data - 'test-data-shpdr.tp.json'
        When I use the 'next' arrow to navigate to a different page
        Then the 'Shipment Details Report' report is visible and shows accurate data - 'test-data-shpdr.tp.json'
        When I download CSV and PDF files for the report     
        Then the pdf file 'Prancer - Shipment Details Report' was downloaded successfully on chrome downloads
        And the csv file 'Prancer - Shipment Details Report' was downloaded successfully on chrome downloads