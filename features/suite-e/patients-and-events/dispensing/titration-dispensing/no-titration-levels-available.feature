@no-titration-levels-available
Feature: No titration levels available
    TC-2727/Prancer-4290 Verify that system displays appropriate message if no titration levels are yet available due to timing logic

    Scenario: No titration levels available
        Given that study 'ta_patient_dispense_titration' is clean loaded
        And 'admin' is logged in
        When I select study "ta_patient_dispense_titration" and site "S0028" on the selector page
        And I screen a patient
        And I randomize the patient
        And I 'Second dosing' the patient with 'Level 2'
        And I 'Third dosing' the patient with 'Level 3'
        And I 'Fourth dosing' the patient with 'Level 4'
        And I 'Fifth Dosing' the patient with 'Level 5'
        And I start 'Sixth Dosing' the patient
        Then 'Dosage' form is not present
        And 'Next' button is not displayed
        And 'No titration options available for patient' message is 'displayed'
