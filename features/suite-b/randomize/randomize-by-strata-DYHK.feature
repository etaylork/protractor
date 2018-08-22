@randomize-DYHK
Feature:Randomize Patients By Strata Values
    As Principal Investigator
    I want to verify that the system will randomize patients
    by strata and will cause blocks to dynamically allocate to
    strata values

    Scenario: Randomize patients by strata values
        #Given that study 'TestCase_RandList_DYHK' is loaded by Principal Investigator
        Given 'Principal Investigator' is logged in
        And I select study "TestCase_RandList_DYHK" and site "101" on the selector page
        And I screen a patient born in 2000
        And I randomize the patient with strata combo: eye-color = "brown" , gender = "female"
        Then I check rand number '1' has been allocated to the patient on study 'TestCase_RandList_DYHK'
        And I screen a patient born in 2001
        And I randomize the patient with strata combo: eye-color = "brown" , gender = "male"
        Then I check rand number '5' has been allocated to the patient on study 'TestCase_RandList_DYHK'
        And I screen a patient born in 2002
        And I randomize the patient with strata combo: eye-color = "brown" , gender = "female"
        Then I check rand number '2' has been allocated to the patient on study 'TestCase_RandList_DYHK'
        And I log out
        Given 'Principal Investigator' is logged in
        And I select study "TestCase_RandList_DYHK" and site "102" on the selector page
        When I screen a patient born in 2000
        And I randomize the patient with strata combo: eye-color = "brown" , gender = "female"
        Then I check rand number '3' has been allocated to the patient on study 'TestCase_RandList_DYHK'
        And I log out
        Given 'Principal Investigator' is logged in
        And I select study "TestCase_RandList_DYHK" and site "101" on the selector page
        When I screen a patient born in 2003
        And I randomize the patient with strata combo: eye-color = "brown" , gender = "female"
        Then I check rand number '4' has been allocated to the patient on study 'TestCase_RandList_DYHK'
        When I screen a patient born in 2004
        And I randomize the patient with strata combo: eye-color = "brown" , gender = "female"
        Then I check rand number '9' has been allocated to the patient on study 'TestCase_RandList_DYHK'








