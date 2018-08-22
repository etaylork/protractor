@screen-patient
Feature: Screen A Patient
    As Principal Investigator
    I want to be able to screen a patient

    Scenario: Screen a patient
        Given 'Principal Investigator' is logged in
        And I select study "e2e_study_01" and site "101" on the selector page 
        When I screen a patient born in 1960
        Then the number of patients increases by 1
