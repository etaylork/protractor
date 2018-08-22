@dispense-single-blinded-supply
Feature: Dispense Single Blinded Supply By Blinded Identifier
    Prancer-4287 Dispense Of Single Discrete blinded Supply
    TC-2508 AC Completed: AC1

    Scenario: Verify dispensing of single discrete blinded supply
        Given that study 'ta_patient_testdata14' is clean loaded
        And I change the dosage for
            | study                 | event_id | treatment_arm | action_id                | action_logic             |
            | ta_patient_testdata14 | dosing2  | A             | dispense: 1 of Mint      | dispense: 1 of Mint      |
            | ta_patient_testdata14 | dosing2  | B             | dispense: 1 of Vanilla   | dispense: 1 of Vanilla   |
            | ta_patient_testdata14 | dosing2  | C             | dispense: 1 of Chocolate | dispense: 1 of Chocolate |
        And 'Study Coordinator' is logged in
        And I select study "ta_patient_testdata14" and site "TA10001" on the selector page
        When I screen a patient
        When I am on the 'patient' page
        And I randomize patient 'USTA10001001'
        And I second dose patient 'USTA10001001'
        Then a second dosing success message for 'discrete' supply is displayed
        And a table with only one discrete supply is displayed
            | PLEASE DISPENSE: | Kit type    |
            | "10001/10003"    | blinded kit |
        #Validation for test steps #1-2 is tested in feature step: I second dose patient 'USTA10001001'