@titration-forced-first-assignment
Feature: Titration forced first assignment
    TC-2730/Prancer-4297 Verify that titration first assignment can be forced to any level

    Scenario: Titration forced first assignment
        Given that study 'ta_patient_dispense_forcedtitrations' is clean loaded
        And 'admin' is logged in
        When I select study "ta_patient_dispense_forcedtitrations" and site "S0028" on the selector page
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
        And 'Kit type' column contains entry 'blue50mg' or 'red50mg'