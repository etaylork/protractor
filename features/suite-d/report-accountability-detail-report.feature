@accountability-details-report
Feature: Accountability Details Report
Prancer-4214 Accountability Details Report
TC-2322 Steps: 1-6, 9-10, AC Completed: AC1 (1-4), AC2

    @adr-csl
    Scenario: Accountability details report CSL
        Given 'CSL' is logged in
        And I select study "qa_smoke_regression_teststudy1" only on the selector page
        When I am on the 'report' page
        Then the 'Accountability Details' report is listed
        And the report description does not have the unblinded label displayed
        When I open the 'Accountability Details' report
        Then the report is visible and shows no data
        When I select site 'S0015'
        Then the 'Accountability Details' report is visible and shows required data - 'test-data-adr.csl.json'
            | header       | metaData                                                |
            | Site         | S0015 - Captain Cooper                                  |
            | Address      | 14 special avenue, Boston, MA, United States of America |
            | Investigator | Captain Cooper                                          |
        And the table of patients is displayed in descending order
        When I download CSV and PDF files for the report  
        Then the pdf file 'Prancer - Accountability Details' was downloaded successfully on chrome downloads
        And the csv file 'Prancer - Accountability Details' was downloaded successfully on chrome downloads
        When I filter each column in the report
        Then each column filters
        When I sort each column in the report
        Then each column sorts
        When I select the back button
        Then I am taken back to the reports lists

    @adr-sm
    Scenario: Accountability details report Study Manager
        Given 'Study Manager' is logged in
        And I select study "qa_smoke_regression_teststudy1" only on the selector page
        When I am on the 'report' page
        Then the 'Accountability Details' report is listed