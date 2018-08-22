@randomize-HLDS
Feature: Randomize Patients Seperate Lists / Dynamically Allocated To Site
    As Principal Investigator
    I want to verify that patients are randomized to seperate lists
    based off strata values, but still dynamically block to site
    within those lists

    Scenario: Randomize patients to sperate lists / dynamically allocated to site
        And 'Principal Investigator' is logged in
        And I select study "TestCase_RandList_HLDS" and site "101" on the selector page
        When I screen a patient born in 2000
        And I randomize the patient with strata combo: eye-color = "brown" , gender = "female"
        Then I check that the patient is on randlist "1", in randblock "1", and allocated to randnumber "1000" on study "TestCase_RandList_HLDS"
        When I screen a patient born in 2001
        And I randomize the patient with strata combo: eye-color = "brown" , gender = "female"
        Then I check that the patient is on randlist "1", in randblock "1", and allocated to randnumber "1001" on study "TestCase_RandList_HLDS"
        When I screen a patient born in 2001
        And I randomize the patient with strata combo: eye-color = "brown" , gender = "male"
        Then I check that the patient is on randlist "2", in randblock "1", and allocated to randnumber "2000" on study "TestCase_RandList_HLDS"
        And I log out
        Given 'Principal Investigator' is logged in
        And I select study "TestCase_RandList_HLDS" and site "102" on the selector page
        When I screen a patient born in 2002
        And I randomize the patient with strata combo: eye-color = "brown" , gender = "male"
        Then I check that the patient is on randlist "2", in randblock "2", and allocated to randnumber "2004" on study "TestCase_RandList_HLDS"