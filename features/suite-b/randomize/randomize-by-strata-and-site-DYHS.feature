@randomize-DYHS
Feature: Randomize Patients By Strata Values And Study Site
    As Principal Investigator
    I want to verify that the system will randomize patients
    depending on both strata and site. Allocating blocks depending
    on both strata values and what site the patient is on

    Scenario: Randomization patients by strata values and study site
        Given 'Principal Investigator' is logged in
        And I select study "TestCase_RandList_DYHS" and site "101" on the selector page
        And I screen a patient born in 2000
        And I randomize the patient with strata combo: eye-color = "brown" , gender = "female"
        Then I check rand number '1' has been allocated to the patient on study 'TestCase_RandList_DYHS'
        And I screen a patient born in 2001
        And I randomize the patient with strata combo: eye-color = "brown" , gender = "male"
        Then I check rand number '5' has been allocated to the patient on study 'TestCase_RandList_DYHS'
        And I log out
        Given 'Principal Investigator' is logged in
        And I select study "TestCase_RandList_DYHS" and site "102" on the selector page
        And I screen a patient born in 2002
        And I randomize the patient with strata combo: eye-color = "brown" , gender = "female"
        Then I check rand number '9' has been allocated to the patient on study 'TestCase_RandList_DYHS'