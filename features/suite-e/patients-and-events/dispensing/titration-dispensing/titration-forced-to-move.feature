@titration-forced-to-move
Feature: Titration forced to move
    TC-2731/Prancer-4298 Verify that a patient is forced to move to another specific level (up or down), based on a prior level

    Scenario: Titration forced to move
       Given that study 'ta_patient_dispense_forcedtitrations' is clean loaded
       And 'admin' is logged in
       When I select study "ta_patient_dispense_forcedtitrations" and site "S0028" on the selector page
       And I screen a patient
       And I 'Randomize' the patient until 'DONE'
       And I remember the medication type
       And I finish 'DONE' step for 'Randomize' the patient
       And I 'Second dosing' the patient with 'Level 1' until 'DONE'
       Then the medication type is the same with '10mg'
       When I finish 'DONE' step for 'Second dosing' the patient
       And I 'Third dosing' the patient with 'Level 1' until 'DONE'
       Then the medication type is the same with '10mg'
       When I finish 'DONE' step for 'Third dosing' the patient
       And I 'Fourth dosing' the patient until 'DONE'
      Then the medication type is the same with '20mg'
