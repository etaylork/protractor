@patient-detail-report
Feature: Patient Detail Report
    Prancer-3436 Patient Detail Report
    TC-1893 AC Completed - Study Manager: AC1, AC2, AC3
    TC-1893 AC Completed - CSL: AC1, AC2, AC3
    Requirements Completed:
        Prancer-1993: AC2-AC3
        Prancer-1881 [Default Report] Customized script to replace existing Patient Detail report
        AC1, AC2(2.1-2.6), AC3(3.1-3.9), AC4, and AC5

    @pdr-sm
    Scenario: Patient detail report Study Manager
        Given 'Study Manager' is logged in
        And I select study "qa_smoke_regression_teststudy1" only on the selector page
        When I open the 'Patient Summary Report' report
        And I select patient 'QASR0001' link
        Then the 'Patient Detail Report' report is visible and shows required data - 'test-data-pdr.sm.json'
            | header                | metaData                 |
            | Patient               | QASR0001                 |
            | Site                  | S0015 - Captain Cooper   |
            | Country               | United States of America |
            | Status                | Enrolled                 |
            | Date of Screening     |                          |
            | Date of Randomization |                          |
        When I filter each column in the report
        Then each column filters
        When I sort each column in the report
        Then each column sorts
        When I download CSV and PDF files for the report
        Then the pdf file 'Prancer - Patient Detail Report' was downloaded successfully on chrome downloads
        And the csv file 'Prancer - Patient Detail Report' was downloaded successfully on chrome downloads

    @pdr-csl
    Scenario: Patient detail report CSL
        Given 'CSL' is logged in
        And I select study "qa_smoke_regression_teststudy1" and site "BE10003" on the selector page
        When I am on the 'report' page
        Then the 'Patient Detail Report' report is listed
        And the report description does have the unblinded label displayed
        When I open the 'Patient Summary Report' report
        And I select patient 'QASR0001' link
        Then the 'Patient Detail Report' report is visible and shows required data - 'test-data-pdr.csl.json'
            | header                | metaData                 |
            | Patient               | QASR0001                 |
            | Site                  | S0015 - Captain Cooper   |
            | Country               | United States of America |
            | Status                | Enrolled                 |
            | Date of Screening     |                          |
            | Date of Randomization |                          |
        When I download CSV and PDF files for the report
        Then the pdf file 'Prancer - Patient Detail Report-Unblinding' was downloaded successfully on chrome downloads
        And the csv file 'Prancer - Patient Detail Report-Unblinding' was downloaded successfully on chrome downloads

    @pdr-med
    Scenario: Patient detail report medication assignment field validation As CSL
        Given 'CSL' is logged in
        And I select study "qa_smoke_regression_teststudy1" and site "BE10003" on the selector page
        When I am on the 'report' page
        Then the 'Patient Detail Report' report is listed
        And the report description does have the unblinded label displayed
        When I open the 'Patient Summary Report' report
        And I select patient 'QASR0010' link
        Then the 'Patient Detail Report' report is visible and shows required data - 'test-data-pdr.qasr0010.json'
            | header                | metaData                 |
            | Patient               | QASR0010                 |
            | Site                  | S0016                    |
            | Country               | United States of America |
            | Status                | Enrolled                 |
            | Date of Screening     |                          |
            | Date of Randomization |                          |