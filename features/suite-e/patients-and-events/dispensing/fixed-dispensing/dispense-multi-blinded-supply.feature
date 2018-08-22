@dispense-multi-blinded-supply
Feature: Dispense Multi Blinded Supply By Blinded Identifier
    Prancer-4283 Verify Dispensing Of Multiple Discrete Blinded Supply
    TC-2507 AC Completed: AC1

    Scenario: Verify dispensing of multi blinded supply
        Given that study 'ta_patient_testdata14' is clean loaded
        And 'Study Coordinator' is logged in
        And I select study "ta_patient_testdata14" and site "TA10001" on the selector page
        When I screen a patient
        And I randomize patient 'USTA10001001'
        And I change the dosage for
            | study                 | event_id | treatment_arm | action_id               | action_logic            |
            | ta_patient_testdata14 | dosing2  | A             | dispense:2 of Chocolate | dispense:2 of Chocolate |
            | ta_patient_testdata14 | dosing2  | B             | dispense:2 of Chocolate | dispense:2 of Chocolate |
            | ta_patient_testdata14 | dosing2  | C             | dispense:2 of Mint      | dispense:2 of Mint      |
        And I refresh the page
        And I second dose patient 'USTA10001001'
        Then a second dosing success message for 'discrete' supply is displayed
        And a table with blinded supply is displayed
            | PLEASE DISPENSE: | Kit type    |
            | "10001/10003"    | blinded kit |
            | "10004/10006"    | blinded kit |
        #Validation for test steps #1-2 is tested in feature step: I second dose patient 'USTA10001001'