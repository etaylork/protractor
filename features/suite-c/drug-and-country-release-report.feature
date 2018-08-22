@drug-and-country-release-report
Feature: Drug and Country Release Report
    Prancer-3652 Drug and Country Release Report
    TC-1941 AC Completed : AC1, AC2, AC3, AC4, AC5
    Requirements Completed:
        Prancer-1993: AC2-AC3

    @dacrr-sup
    Scenario: Drug and country release report Supply Manager
        Given 'Supply Manager' is logged in
        And I select study "qa_smoke_regression_teststudy1" only on the selector page
        When I am on the 'report' page
        Then the 'Drug and Country Release Report' report is listed
        And the report description does have the unblinded label displayed
        When I open the 'Drug and Country Release Report' report
        And I select lot 'resup_lot1'
        Then the 'Drug and Country Release Report' report is visible and shows required data - 'test-data-dacrr.json'
            | header                                                   | metaData            |
            | lot                                                      | resup_lot1          |
            | Lot description                                          | FAKE LOT resup_lot1 |
            | Kit type                                                 |                     |
            | Sequence Number range                                    |                     |
            | Kit Number associate with first and last sequence number |                     |
            | Retained kit numbers(s)                                  |                     |
            | Retained Quantity                                        |                     |
        When I download CSV and PDF files for the report 
        Then the pdf file 'Prancer - Drug and Country Release Report-Unblinding' was downloaded successfully on chrome downloads
        And the csv file 'Prancer - Drug and Country Release Report-Unblinding' was downloaded successfully on chrome downloads

    @dacrr-bulk-kit
    Scenario: Drug and country release report for bulk kits
        Given 'Supply Manager' is logged in
        And I select study "qa_smoke_regression_teststudy1" only on the selector page
        When I am on the 'report' page
        Then the 'Drug and Country Release Report' report is listed
        And the report description does have the unblinded label displayed
        When I open the 'Drug and Country Release Report' report
        And I select lot 'Both_Tea'
        Then the 'Drug and Country Release Report' report is visible and shows required data - 'test-data-dacrr.bothtea.json'
            | header                                                   | metaData          |
            | lot                                                      | Both_Tea          |
            | Lot description                                          | FAKE LOT Both_Tea |
            | Kit type                                                 | coffee            |
            | Sequence Number range                                    | N/A               |
            | Kit Number associate with first and last sequence number | N/A               |
            | Retained kit numbers(s)                                  | N/A               |
            | Retained Quantity                                        | N/A               |
        When I filter each column in the report
        Then each column filters
        When I sort each column in the report
        Then each column sorts
        When I download CSV and PDF files for the report
        Then the pdf file 'Prancer - Drug and Country Release Report-Unblinding' was downloaded successfully on chrome downloads
        And the csv file 'Prancer - Drug and Country Release Report-Unblinding' was downloaded successfully on chrome downloads
