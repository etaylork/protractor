@patient-summary-report
Feature: Patient Summary Report
    Prancer-3808 Patient Summary Report
    TC-1912 AC Completed: AC1, AC2, AC3, AC4, AC5(partially), AC6
    Filter Columns that are not working: Country
    Requirements Completed:
        Prancer-1838: AC3, AC5
        Prancer-1993: AC2-AC3

    @psr-sm
    Scenario: Patient summary report Study Manager
        Given 'Study Manager' is logged in
        And I select study "qa_smoke_regression_teststudy1" only on the selector page
        When I am on the 'report' page
        Then the 'Patient Summary Report' report is listed
        When I open the 'Patient Summary Report' report
        Then the 'Patient Summary Report' report is visible and shows accurate data - 'test-data-psr.sm.json'
        When I download CSV and PDF files for the report
        Then the pdf file 'Prancer - Patient Summary Report' was downloaded successfully on chrome downloads
        And the csv file 'Prancer - Patient Summary Report' was downloaded successfully on chrome downloads
        When I select patient 'QASR0001' link
        Then the 'Patient Detail Report' report is open for patient 'QASR0001'
        When I open the 'Patient Summary Report' report
        When I filter each column in the report
        Then each column filters
        When I sort each column in the report
        Then each column sorts
        When I use the 'next' arrow to navigate to a different page
        Then I verify that I was navigated to a different page


    @psr-si
    Scenario: Patient summary report Principal Investigator
        Given 'Principal Investigator' is logged in
        And I select study "qa_smoke_regression_teststudy1" only on the selector page
        When I am on the 'report' page
        Then the 'Patient Summary Report' report is listed
        When I open the 'Patient Summary Report' report
        Then the 'Patient Summary Report' report is visible and shows accurate data - 'test-data-psr.si.json'
        When I download CSV and PDF files for the report
        Then the pdf file 'Prancer - Patient Summary Report' was downloaded successfully on chrome downloads
        And the csv file 'Prancer - Patient Summary Report' was downloaded successfully on chrome downloads
        When I select patient 'QASR0001' link
        Then the 'Patient Detail Report' report is open for patient 'QASR0001'

    @psr-csl
    Scenario: Patient summary report CSL
        Given 'CSL' is logged in
        And I select study "qa_smoke_regression_teststudy1" only on the selector page
        When I am on the 'report' page
        Then the 'Patient Summary Report' report is listed
        And the report description does have the unblinded label displayed
        When I open the 'Patient Summary Report' report
        Then the 'Patient Summary Report' report is visible and shows accurate data - 'test-data-psr.csl.json'
        When I filter each column in the report
        Then each column filters
        When I download CSV and PDF files for the report  
        Then the pdf file 'Prancer - Patient Summary Report-Unblinding' was downloaded successfully on chrome downloads
        And the csv file 'Prancer - Patient Summary Report-Unblinding' was downloaded successfully on chrome downloads
        When I select patient 'QASR0001' link
        Then the 'Patient Detail Report' report is open for patient 'QASR0001'