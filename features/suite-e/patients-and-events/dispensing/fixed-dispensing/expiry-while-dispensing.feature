@verify-expiry-while-dispensing
Feature: Verify Expiration While Dispensing
    Prancer-4266 Verify system accounts for expiry while dispensing
    TC-2505 AC Completed: AC1

    Scenario: Preconditions for verify expiration while dispensing
        Given that study 'ta_patient_testdata4' is clean loaded
        And 'admin' is logged in
        And I select study "ta_patient_testdata4" and site "TA40001" on the selector page
        And I screen a patient
        And patient 'US1' is displayed in the list patients
        And I randomize patient 'US1'
        And I change the expiry date for lot
            | lot             | date      |
            | mini-coffeelot1 | 2018-2-19 |
    
    @verify-expiry-dispense-error
    Scenario: Verify expiration while dispensing
        Given 'Study Coordinator' is logged in
        And I select study "ta_patient_testdata4" and site "TA40001" on the selector page
        When I am on the 'patient' page
        Then patient 'US1' is displayed in the list patients
        When I second dose patient 'US1'
        Then second dosing failed for the patient with an error message: 'Insufficient inventory to dispense, please call Client Excellence'