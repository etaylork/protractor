@patient-centric-audit-trail
Feature: Patient Centric Audit Trail
    Prancer-3303 Patient Centric Audit Trail
    TC-1891 AC for original story: AC3
    TC-1891 Specific AC for e2e test case: AC2 (partial: title and visible), AC3, AC4, AC5

    @pcat-csl
    Scenario: Patient centric audit trail CSL
        Given 'CSL' is logged in
        And I select study "qa_smoke_regression_teststudy1" only on the selector page
        When I open the 'Patient Centric Audit Trail' report
        Then the 'Patient Centric Audit Trail' report is visible and shows accurate data - 'test-data-pcatr.json'
        When I filter each column in the report
        Then each column filters
        When I sort each column in the report
        Then each column sorts
        When I download CSV and PDF files for the report
        Then the pdf file 'Prancer - Patient Centric Audit Trail' was downloaded successfully on chrome downloads
        And the csv file 'Prancer - Patient Centric Audit Trail' was downloaded successfully on chrome downloads

    @pcat-ce
    Scenario: Patient centric audit trail Customer Excellence
        Given 'CSL' is logged in
        And I select study "qa_smoke_regression_teststudy1" only on the selector page
        When I open the 'Patient Centric Audit Trail' report
        Then the 'Patient Centric Audit Trail' report is visible and shows accurate data - 'test-data-pcatr.json'
        When I filter each column in the report
        Then each column filters
        When I download CSV and PDF files for the report
        Then the pdf file 'Prancer - Patient Centric Audit Trail' was downloaded successfully on chrome downloads
        And the csv file 'Prancer - Patient Centric Audit Trail' was downloaded successfully on chrome downloads

    @pcat-sm
    Scenario: Patient centric audit trail Supply Manager
        Given 'Supply Manager' is logged in
        And I select study "qa_smoke_regression_teststudy1" only on the selector page
        Then I cannot open the 'Patient Centric Audit Trail' report