@randomize-SITE
Feature: Randomize Patients By Site
    As Principal Investigator
    I want to verify that  the system will dynamically allocate
    a patient to a block depending on what site they are on

    Scenario: Randomize patients by site
        Given 'Principal Investigator' is logged in
        And I select study "TestCase_RandList_SITE" and site "101" on the selector page
        When I screen a patient born in 2000
        And I randomize the patient
        Then I check rand number '1' has been allocated to the patient on study 'TestCase_RandList_SITE'
        And I screen a patient born in 2001
        And I randomize the patient
        Then I check rand number '2' has been allocated to the patient on study 'TestCase_RandList_SITE'
        And I log out
        Given 'Principal Investigator' is logged in
        And I select study "TestCase_RandList_SITE" and site "102" on the selector page
        When I screen a patient born in 2000
        And I randomize the patient
        Then I check rand number '5' has been allocated to the patient on study 'TestCase_RandList_SITE'
        Then I log out
        And 'Principal Investigator' is logged in
        And I select study "TestCase_RandList_SITE" and site "101" on the selector page
        When I screen a patient born in 2002
        And I randomize the patient
        Then I check rand number '3' has been allocated to the patient on study 'TestCase_RandList_SITE'
        And I screen a patient born in 2003
        And I randomize the patient
        Then I check rand number '4' has been allocated to the patient on study 'TestCase_RandList_SITE'