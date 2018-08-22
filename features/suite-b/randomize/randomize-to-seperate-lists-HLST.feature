@randomize-HLST
Feature: Randomize Patients To Seperate Lists
    As Principal Investigator
    I want to verify that a patient is
    on a certain random list depending on what strata
    combo they choose from

    Scenario: Randomize patients to seperate lists
        #Given that study 'TestCase_RandList_HLST' is loaded by Site Monitor
        Given 'Principal Investigator' is logged in
        And I select study "TestCase_RandList_HLST" and site "101" on the selector page
        When I screen a patient born in 2000
        And I randomize the patient with strata combo: eye-color = "brown" , gender = "female"
        Then I check that patient is on rand list "1" and allocated to rand number "1000" on study "TestCase_RandList_HLST"
        When I screen a patient born in 2001
        And I randomize the patient with strata combo: eye-color = "brown" , gender = "male"
        Then I check that patient is on rand list "2" and allocated to rand number "2000" on study "TestCase_RandList_HLST"
        And I log out
        Given 'Principal Investigator' is logged in
        And I select study "TestCase_RandList_HLST" and site "102" on the selector page
        When I screen a patient born in 2002
        And I randomize the patient with strata combo: eye-color = "brown" , gender = "female"
        Then I check that patient is on rand list "1" and allocated to rand number "1001" on study "TestCase_RandList_HLST"
