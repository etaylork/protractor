@patient-data-changes-report
Feature: Patient Data Changes Report
    Prancer-3819 Patient Data Changes Report
    TC-1945 AC Completed: AC1, AC2, AC3, AC4
    Requirements Completed:
        Prancer-1838: AC3, AC5
        Prancer-1993: AC2-AC3

    @pdcr-sm
    Scenario: Patient data changes report Study Manager
        Given 'Study Manager' is logged in
        And I select study "qa_smoke_regression_teststudy1" only on the selector page
        When I am on the 'report' page
        Then the 'Patient Data Changes Report' report is listed
        When I open the 'Patient Data Changes Report' report
        Then the 'Patient Data Changes Report' report is visible and shows accurate data - 'test-data-pdcr.sm.json'
        When I filter each column in the report
        Then each column filters
        When I sort each column in the report
        Then each column sorts
        When I use the 'next' arrow to navigate to a different page
        Then I verify that I was navigated to a different page
        When I download CSV and PDF files for the report
        Then the pdf file 'Prancer - Patient Data Changes Report' was downloaded successfully on chrome downloads
        And the csv file 'Prancer - Patient Data Changes Report' was downloaded successfully on chrome downloads
        
    @pdcr-si
    Scenario: Patient data changes report Principal Investigator
        Given 'Principal Investigator' is logged in
        And I select study "qa_smoke_regression_teststudy1" only on the selector page
        When I am on the 'report' page
        Then the 'Patient Data Changes Report' report is listed
        When I open the 'Patient Data Changes Report' report
        Then the 'Patient Data Changes Report' report is visible and shows accurate data - 'test-data-pdcr.si.json'
        When I download CSV and PDF files for the report
        Then the pdf file 'Prancer - Patient Data Changes Report' was downloaded successfully on chrome downloads
        And the csv file 'Prancer - Patient Data Changes Report' was downloaded successfully on chrome downloads