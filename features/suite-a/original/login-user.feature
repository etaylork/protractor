@login-user
Feature: User Login Validation
    As a user 
    I want to validate various elements on the login page  
    
    Scenario: User login validation
        Given I am on the 'login' page
        Then the login page has a support menu 
        And login page has a email and password text box displayed
        And has a submit button and a forgot password link displayed 
        When I enter my email and password 
        Then the page accepts login with valid credentials 
 