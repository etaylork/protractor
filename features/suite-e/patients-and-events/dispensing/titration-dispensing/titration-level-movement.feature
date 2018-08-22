@titration-level-movement
Feature: Titration level movement
    TC-2728/Prancer-4291 Verify that a patient may move to any other level (up or down) or remain on the existing level based on a prior level

    Scenario: Titration level movement
        Given that study 'ta_patient_dispense_titration' is clean loaded
        And 'admin' is logged in
        When I select study "ta_patient_dispense_titration" and site "S0028" on the selector page
        And I screen a patient
        And I start to 'Randomize' the patient
        Then 'Randomize' 'BEGIN' step is displayed
        When I click button with text 'Next'
        Then 'Randomize' 'REVIEW' step is displayed
        And 'Please review your changes' message is 'displayed'
        Then button with text 'Submit' is displayed
        When I click button with text 'Submit'
        Then 'Randomize' 'DONE' step is displayed
        And 'Please dispense the following bulk supply to patient' message is 'displayed'
        And 'Kit type' column contains entry 'blue10mg' or 'red10mg'
        When I finish 'DONE' step for 'Randomize' the patient
        When I start 'Second dosing' the patient
        And I open the 'Dosage' dropdown
        Then 'Level 1' option is available
        And 'Level 2' option is available
        When I select option 'Level 1'
        And I finish 'BEGIN' step for 'Second dosing' the patient
        Then 'Second dosing' 'REVIEW' step is displayed
        And 'Dosage' field shows 'Level 1'
        When I click button with text 'Submit'
        Then 'Please dispense the following bulk supply to patient' message is 'displayed'
        And 'Kit type' column contains entry 'blue10mg' or 'red10mg'
        When I finish 'DONE' step for 'Second dosing' the patient
        And I 'Third dosing' the patient with 'Level 2' until 'DONE'
        Then 'Please dispense the following bulk supply to patient' message is 'displayed'
        And 'Kit type' column contains entry 'blue20mg' or 'red20mg'
        When I finish 'DONE' step for 'Third dosing' the patient
        And I 'Fourth dosing' the patient with 'Level 1' until 'DONE'
        Then 'Please dispense the following bulk supply to patient' message is 'displayed'
        And 'Kit type' column contains entry 'blue10mg' or 'red10mg'