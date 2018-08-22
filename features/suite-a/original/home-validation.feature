@home-validation
Feature: Validate Home Page
    As Principal Investigator
    I want to be able to validate various elements on the home page

    Scenario: Validate home page
        Given 'Principal Investigator' is logged in
        And I select study "e2e_study_01" and site "101" on the selector page
        And I am on the 'home' page
        Then there is a title
        And there is a support menu
        And there is a sidenav menu
        #And there are 3 cookies
        When I log out
        Then I log out successfully
