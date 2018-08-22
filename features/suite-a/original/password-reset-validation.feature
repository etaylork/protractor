@password-reset-validation
Feature: Password Reset Validation
    As a user 
    I want to be able to access the password reset page
    I want to see the contents of the page being displayed 

    Scenario: Password reset validation
        Given I am on the 'login' page
        Then I get rejected when I login with invalid credentials 
        When I go to password reset page 
        Then check title is displayed and title matches 'Password Reset'
        And submit button and email text box is displayed 


    