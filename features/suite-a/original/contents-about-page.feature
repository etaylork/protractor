@contents-about-page
Feature: Contents About Page
    As a user
    I wish to see all contents of the page displayed 

    Scenario: About page contents 
        #Given that study 'e2e_study_01' is loaded 
        Given 'CSL' is logged in
        And I select study "e2e_study_01" and site "101" on the selector page
        When I am on the 'about' page 
        Then I check that the about page has the right elements