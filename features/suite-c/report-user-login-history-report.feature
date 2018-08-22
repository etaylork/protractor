@user-login-history
Feature: User Login History 
    Prancer-3851 User Login History Report
    TC-1948 AC Completed: AC1, AC2, AC4
    Requirements Completed:
        Prancer-1850: AC1-AC2, AC4
        Prancer-2659: Login History report AC1-AC3

    @ulhr-csl
    Scenario: User login history CSL
        Given 'CSL' is logged in
        And I select study "qa_smoke_regression_teststudy1" only on the selector page
        When I am on the 'report' page
        Then the 'User Login History' report is listed
        When I open the 'User Login History' report
        Then the 'User Login History' report is visible and shows accurate data - 'test-data-ulhr.csl.json'
        When I filter each column in the report
        Then each column filters
        When I sort each column in the report
        Then each column sorts
        When I download CSV and PDF files for the report    
        Then the pdf file 'Prancer - User Login History' was downloaded successfully on chrome downloads
        And the csv file 'Prancer - User Login History' was downloaded successfully on chrome downloads