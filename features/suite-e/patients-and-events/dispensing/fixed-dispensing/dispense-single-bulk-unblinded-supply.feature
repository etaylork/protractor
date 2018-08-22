@dispense-single-bulk-unblinded-supply
Feature: Dispense Single Bulk Unblinded Supply By Identifier
    Prancer-4305 Dispense Single Bulk unblinded Supply
    TC-2512 AC Completed: AC1

    Scenario: Verify dispensing of single bulk unblinded supply
        Given that study 'ta_patient_testdata18' is clean loaded
        And I change the dosage for
            | study                 | event_id | treatment_arm | action_id             | action_logic          |
            | ta_patient_testdata18 | dosing2  | A             | dispense: 1 of coffee | dispense: 1 of coffee |
            | ta_patient_testdata18 | dosing2  | B             | dispense: 1 of decaf  | dispense: 1 of decaf  |
        And 'Study Coordinator' is logged in
        And I select study "ta_patient_testdata18" and site "TA10001" on the selector page
        When I screen a patient
        When I am on the 'patient' page
        And I randomize patient 'USTA10001001'
        And I second dose patient 'USTA10001001'
        Then a second dosing success message for 'bulk' supply is displayed
        And a table with only one of these bulk supply is displayed
            | Kit type | Lot                      | Expiration date | Quantity |
            | decaf    | FAKE LOT mini-coffeelot1 | 10-Oct-2029     | 1        |
            | coffee   | FAKE LOT mini-coffeelot1 | 10-Oct-2029     | 1        |
        #Validation for test steps #1-2 is tested in feature step: I second dose patient 'USTA10001001'