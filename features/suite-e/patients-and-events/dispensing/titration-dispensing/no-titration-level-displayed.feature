@no-titration-level-displayed
Feature: No titration level displayed
    TC-2726/Prancer-4286 Verify that system does not display any titration level to select if a single level is available and should complete forced titration
    * validation disabled until PRANCER-3583 issue is fixed

    Scenario: No titration level displayed
        Given that study 'ta_patient_dispense_titration' is clean loaded
        And 'admin' is logged in
        When I select study "ta_patient_dispense_titration" and site "S0028" on the selector page
        And I screen a patient
        And I randomize the patient
        And I 'Second dosing' the patient with 'Level 2'
        And I 'Third dosing' the patient with 'Level 3'
        And I start 'Fourth dosing' the patient with 'Level 4'
        ## pending PRANCER-3583
        #Then 'Dosage' form is not present
        When I finish 'BEGIN' step for 'Fourth dosing' the patient
        ## pending PRANCER-3583
        #Then 'Dosage' field is not present
        When I finish 'REVIEW' step for 'Fourth dosing' the patient
        Then 'titration dispensing' confirmation message is displayed
