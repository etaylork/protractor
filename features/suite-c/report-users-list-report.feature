@users-list
Feature: Users List
    Prancer-3849 Users List report
    TC-1947 AC Completed: Prancer-1907 AC1-AC10
                          Prancer-2096 AC1-AC10
    Requirements Completed:
        Prancer-1838: AC3, AC5

    @ul-sm
    Scenario: Users list Study Manager
        Given 'Study Manager' is logged in
        And I select study "qa_smoke_regression_teststudy1" only on the selector page
        When I am on the 'report' page
        Then the 'Users List' report is listed
        When I open the 'Users List' report
        Then the 'Users List' report is visible and shows accurate data - 'test-data-ul.sm.json'
        When I select a successful login date link
        Then the 'User Login History' report is open
        When I open the 'Users List' report
        When I filter each column in the report
        Then each column filters
        When I sort each column in the report
        Then each column sorts
        When I use the 'next' arrow to navigate to a different page
        Then I verify that I was navigated to a different page
        When I download CSV and PDF files for the report 
        Then the pdf file 'Prancer - Users List' was downloaded successfully on chrome downloads
        And the csv file 'Prancer - Users List' was downloaded successfully on chrome downloads


    @ul-smon
    Scenario: Users list Site Monitor
        Given 'Site Monitor' is logged in
        And I select study "qa_smoke_regression_teststudy1" and site "S0015" on the selector page
        When I am on the 'report' page
        Then the 'Users List' report is listed
        When I open the 'Users List' report
        Then the 'Users List' report is visible and shows accurate data - 'test-data-ul.smon.json'
        When I download CSV and PDF files for the report
        Then the pdf file 'Prancer - Users List' was downloaded successfully on chrome downloads
        And the csv file 'Prancer - Users List' was downloaded successfully on chrome downloads

    @ul-csl
    Scenario: Users list CSL
        Given 'CSL' is logged in
        And I select study "qa_smoke_regression_teststudy1" only on the selector page
        When I am on the 'report' page
        Then the 'Users List' report is listed
        When I open the 'Users List' report
        Then the 'Users List' report is visible and shows accurate data - 'test-data-ul.csl.json'
        # data file tests for step 9: ' There is an additional column called Failed Logins '
        When I filter each column in the report
        Then each column filters
        When I sort each column in the report
        Then each column sorts
        When I download CSV and PDF files for the report
        Then the pdf file 'Prancer - Users List' was downloaded successfully on chrome downloads
        And the csv file 'Prancer - Users List' was downloaded successfully on chrome downloads