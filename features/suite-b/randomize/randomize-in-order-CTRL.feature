@randomize-CTRL
Feature: Verify Assigned Numbers For Randomized Patients
    As Principal Investigator
    I want to be able to randomize a patient and each patient should
    be assigned with a randomize number in numerical order regardless
    of site or strata

    Scenario: Verify patients are assigned to a random # when randomized
        And 'Principal Investigator' is logged in
        And I select study "TestCase_RandList_CTRL" and site "101" on the selector page
        When I screen a patient born in 2002
        And I randomize the patient
        Then I check rand number '1' has been allocated to the patient on study 'TestCase_RandList_CTRL'
        When I screen a patient born in 2001
        And I randomize the patient
        Then I check rand number '2' has been allocated to the patient on study 'TestCase_RandList_CTRL'
        And I log out
        Given 'Principal Investigator' is logged in
        And I select study "TestCase_RandList_CTRL" and site "102" on the selector page
        When I screen a patient born in 2000
        And I randomize the patient
        Then I check rand number '3' has been allocated to the patient on study 'TestCase_RandList_CTRL'