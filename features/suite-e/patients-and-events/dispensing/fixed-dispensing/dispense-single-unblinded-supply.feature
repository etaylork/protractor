@dispense-single-unblinded-supply
Feature: Dispense Single Discrete Unblinded Supply By Identifier
    Prancer-4296 Dispense Of Single Discrete Unblinded Supply
    TC-2510 AC Completed: AC1

    Scenario: Verify dispensing of single discrete unblinded supply
        Given that study 'ta_patient_testdata17' is clean loaded
        And I change the dosage for
            | study                 | event_id | treatment_arm | action_id               | action_logic            |
            | ta_patient_testdata17 | dosing2  | A             | dispense:1 of Vanilla   | dispense:1 of Vanilla   |
            | ta_patient_testdata17 | dosing2  | B             | dispense:1 of Chocolate | dispense:1 of Chocolate |
        And 'Study Coordinator' is logged in
        And I select study "ta_patient_testdata17" and site "TA10001" on the selector page
        When I screen a patient
        When I am on the 'patient' page
        And I randomize patient 'USTA10001001'
        And I second dose patient 'USTA10001001'
        Then a second dosing success message for 'discrete' supply is displayed
        And a table with only one discrete supply is displayed
            | PLEASE DISPENSE: | Kit type             |
            |  50002 or 50001  | Vanilla or Chocolate |
        #Validation for test steps #1-2 is tested in feature step: I second dose patient 'USTA10001001'