@dispense-multi-discrete-unblinded-supply
Feature: Dispense Multiple Discrete Unblinded Supply By Identifiers
    Prancer-4292 Verify Dispensing Of Multiple Discrete Unblinded Supply
    TC-2509 AC Completed: AC1

    Scenario: TC-2509 verify dispensing of multi discrete unblinded supply
        Given that study 'ta_patient_testdata17' is clean loaded
        And 'Study Coordinator' is logged in
        And I select study "ta_patient_testdata17" and site "TA10001" on the selector page
        When I screen a patient
        And I randomize patient 'USTA10001001'
        And I second dose patient 'USTA10001001'
        Then a second dosing success message for 'discrete' supply is displayed
        And a table with unblinded supply is displayed
            | PLEASE DISPENSE: | Kit type             |
            | 50001            | Chocolate            |
            | 50002 or 50003   | Chocolate or Vanilla |
        #Validation for test steps #1-2 is tested in feature step: I second dose patient 'USTA10001001'