@patient-visit-summary-report
Feature: Patient Visit Summary Report
    Prancer-3814 Patient Visit Summary Report
    TC-1913 AC Completed: AC1, AC2, AC3(Partially)
    Requirements Completed:
        Prancer-1838: AC3, AC5
        Prancer-1993: AC2-AC3
    
    @pvsr-sm
    Scenario: Patient visit summary report Study Manager
        Given 'Study Manager' is logged in
        And I select study "qa_smoke_regression_teststudy1" only on the selector page
        When I am on the 'report' page
        Then the 'Patient Visit Summary Report' report is listed
        When I open the 'Patient Visit Summary Report' report
        Then the 'Patient Visit Summary Report' report is visible and shows accurate data - 'test-data-pvsr.sm.json'
        When I download CSV and PDF files for the report   
        Then the pdf file 'Prancer - Patient Visit Summary Report' was downloaded successfully on chrome downloads
        And the csv file 'Prancer - Patient Visit Summary Report' was downloaded successfully on chrome downloads
        When I click on a notification link
        Then the notification heading is displayed
        When I download the notification PDF
        Then the pdf file 'Notification' was downloaded successfully on chrome downloads

    @pvsr-csl
    Scenario: Patient visit summary report CSL
        Given 'CSL' is logged in
        And I select study "qa_smoke_regression_teststudy1" only on the selector page
        When I am on the 'report' page
        Then the 'Patient Visit Summary Report' report is listed
        And the report description does have the unblinded label displayed
        When I open the 'Patient Visit Summary Report' report
        Then the 'Patient Visit Summary Report' report is visible and shows accurate data - 'test-data-pvsr.csl.json'
        When I download CSV and PDF files for the report
        Then the pdf file 'Prancer - Patient Visit Summary Report-Unblinding' was downloaded successfully on chrome downloads
        And the csv file 'Prancer - Patient Visit Summary Report-Unblinding' was downloaded successfully on chrome downloads 
        When I filter each column in the report
        Then each column filters
        When I filter the 'StudySite' column for 'BE10003'
        And I filter the 'Visit Description' column for 'Randomize'
        Then the data is accurate in the 'Medication assignment' column
        When I filter the 'Visit Description' column for 'dosing'
        Then the data is accurate in the 'Medication assignment' column
        When  I clear all filters in the report
        And I sort each column in the report
        Then each column sorts
        And I use the 'next' arrow to navigate to a different page
        Then I verify that I was navigated to a different page
        When I click on a notification link
        Then the notification heading is displayed
        When I download the notification PDF
        Then the pdf file 'Notification' was downloaded successfully on chrome downloads

     @pvsr-si
     Scenario: Patient visit summary report Principal Investigator
        Given 'Principal Investigator' is logged in
        And I select study "qa_smoke_regression_teststudy1" only on the selector page
        When I am on the 'report' page
        Then the 'Patient Visit Summary Report' report is listed
        Then I open the 'Patient Visit Summary Report' report
        Then the 'Patient Visit Summary Report' report is visible and shows accurate data - 'test-data-pvsr.si.json'
        When I download CSV and PDF files for the report 
        Then the pdf file 'Prancer - Patient Visit Summary Report' was downloaded successfully on chrome downloads
        And the csv file 'Prancer - Patient Visit Summary Report' was downloaded successfully on chrome downloads
        When I click on a notification link
        Then the notification heading is displayed
        When I download the notification PDF
        Then the pdf file 'Notification' was downloaded successfully on chrome downloads