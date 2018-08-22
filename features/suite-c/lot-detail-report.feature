@lsr-report
Feature: Lot Detail Report Tests
    Prancer-3506 Lot Detail Report
    TC-2210 Steps: 1-14, AC Completed: AC1-AC6

    @lsr-discrete-sup
    Scenario: Lot detail report, discrete lot as Supply Manager
        Given 'Supply Manager' is logged in
        And I select study "qa_smoke_regression_teststudy1" only on the selector page
        When I am on the 'report' page
        Then the 'Lot Detail Report' report is listed
        And the report description does have the unblinded label displayed
        When I open the 'Lot Detail Report' report
        Then the report is visible and shows no data
        When I select lot 'resup_lot1'
        Then the 'Lot Detail Report' report is visible and shows required data - 'test-data-ldr.discrete.json'
            | header                 | metaData    |
            | Date the lot was added |             |
            | Location Lot was Added | USDEP1      |
            | Lot Status             | Released    |
            | Initial Release Date   |             |
            | Expiration date        | 10-Oct-2050 |
            | Kit Types Released     |             |
        When I select the '20001' link
        Then the 'Kit History Report' report is visible
        When I open the 'Lot Detail Report' report
        When I filter each column in the report
        Then each column filters
        When I sort each column in the report
        Then each column sorts
        When I download CSV and PDF files for the report
        Then the pdf file 'Prancer - Lot Detail Report-Unblinding' was downloaded successfully on chrome downloads
        And the csv file 'Prancer - Lot Detail Report-Unblinding' was downloaded successfully on chrome downloads


    @lsr-bulk-sup
    Scenario: Lot detail report, bulk lot as Supply Manager
        Given 'Supply Manager' is logged in
        And I select study "qa_smoke_regression_teststudy1" only on the selector page
        When I am on the 'lots' page
        And I select the 'mini-coffeelot1' link
        Then the 'Lot Detail Report' report is visible and shows required data - 'test-data-ldr.bulk.json'
            | header                 | metaData |
            | Date the lot was added |          |
            | Location Lot was Added | USDEP1   |
            | Lot Status             | Released |
            | Initial Release Date   |          |
            | Expiration date        |          |
            | Kit Types Released     |          |
            | Kit Quantity for use   | 2000     |
        When I download CSV and PDF files for the report 
        Then the pdf file 'Prancer - Lot Detail Report-Unblinding' was downloaded successfully on chrome downloads
        And the csv file 'Prancer - Lot Detail Report-Unblinding' was downloaded successfully on chrome downloads