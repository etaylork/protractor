@dispense-dnd-offset-expiry
Feature: Check For DND Offset And Expiry While Dispensing
    Prancer-4306 Dispensign with DND Offset
    TC-2513 AC Completed: AC1

    Scenario: Dispensing with DND offset and expiry
        Given that study 'ta_patient_testdata1' is clean loaded
        And 'Study Coordinator' is logged in
        And I select study "ta_patient_testdata1" and site "TA10001" on the selector page
        When I screen a patient
        Then patient 'USTA10001001' is displayed in the list patients
        When I randomize patient 'USTA10001001'
        And I change the expiry date for 'mini-coffeelot1' to 2 months in the future
        And I change the dnd days for lot
            | lot             | dnd |
            | mini-coffeelot1 | 200 |
        And I second dose patient 'USTA10001001'
        Then second dosing failed for the patient with an error message: 'Insufficient inventory to dispense, please call Client Excellence'
        When I select the back to patients button
        Then the next expected event for the patient is 'Second dosing'
        When I change the dnd days for lot
            | lot             | dnd |
            | mini-coffeelot1 | 0   |
        And I second dose patient 'USTA10001001'
        Then a second dosing success message for 'bulk' supply is displayed
        And a table with only one of these bulk supply is displayed
            | Kit type | Lot                      || Quantity |
            | decaf    | FAKE LOT mini-coffeelot1 || 1        |
            | coffee   | FAKE LOT mini-coffeelot1 || 1        |
            | coffee   | FAKE LOT mini-coffeelot1 || 2        |
        #Validation for test steps #1-2 is tested in feature step: I second dose patient 'USTA10001001'