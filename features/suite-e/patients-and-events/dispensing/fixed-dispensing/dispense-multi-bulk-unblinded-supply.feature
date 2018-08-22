@dispense-multi-bulk-unblinded-supply
Feature: Dispense Multiple Bulk Unblinded Supply By Identifiers
    Prancer-4300 Verify Dispensing Of Multiple Bulk Unblinded Supply
    TC-2511 AC Completed: AC1

    Scenario: TC-2511 verify dispensing of multi bulk unblinded supply
        Given that study 'ta_patient_testdata18' is clean loaded
        And 'Study Coordinator' is logged in
        And I select study "ta_patient_testdata18" and site "TA10001" on the selector page
        When I screen a patient
        And I randomize patient 'USTA10001001'
        And I second dose patient 'USTA10001001'
        Then a second dosing success message for 'bulk' supply is displayed
        And a table with unblinded supply is displayed
            | Kit type        | Lot                      | Expiration date | Quantity |
            | coffee or decaf | FAKE LOT mini-coffeelot1 | 10-Oct-2029     | 1        |
            | coffee or decaf | FAKE LOT mini-coffeelot1 | 10-Oct-2029     | 1        |
        #Validation for test steps #1-2 is tested in feature step: I second dose patient 'USTA10001001'