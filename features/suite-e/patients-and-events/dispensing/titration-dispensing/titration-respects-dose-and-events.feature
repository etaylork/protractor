@titration-respects-does-and-events
Feature: Titration respects dose and events
   TC-2732/Prancer-4299 Verify that system respects both timings of prior dose and events while displaying titration choices and performing actions

   Scenario: Titration respects dose and events
       Given that study 'ta_patient_dispense_titration' is clean loaded
        And 'admin' is logged in
        When I select study "ta_patient_dispense_titration" and site "S0028" on the selector page
        And I screen a patient
        And I randomize the patient
        And I 'Second dosing' the patient with 'Level 2'
        And I start 'Third dosing' the patient
        And I open the 'Dosage' dropdown
        Then 'Level 1' option is available
        And 'Level 3' option is available
        And 'Level 2' option is not available