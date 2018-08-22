@insufficient-supply-dispensing-error
Feature: Dispensing Error For Insufficient Supply
    Prancer-4280 Dispensing Error For Insufficient Supply
    TC-2514 AC Completed: AC1

    Scenario: Dispensing error for insufficent supply
        Given that study 'ta_patient_testdata1' is clean loaded
        And 'Study Coordinator' is logged in
        When I select study "ta_patient_testdata1" and site "TA10001" on the selector page
        And I screen a patient
        When I randomize patient 'USTA10001001'
        And I update all bulk supply to '0'
        And I refresh the page
        And I second dose patient 'USTA10001001'
        Then second dosing failed for the patient with an error message: 'Insufficient inventory to dispense, please call Client Excellence'
        #Validation for test steps #1-2 is tested in feature step: I second dose patient 'USTA10001001'