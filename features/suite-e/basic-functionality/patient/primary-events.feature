@basic-patient-status-change
Feature: Basic Functionality: Primary events
    tc-3362 Primary events

    Scenario: Basic Functionality: Primary events
        Given that study 'qa_smoke_regression_teststudy1' is clean loaded 
        And 'CSL' is logged in
        And I select study "qa_smoke_regression_teststudy1" and site "S0015" on the selector page
        When I screen a patient
        And I randomize the patient
        And I 'Second dosing' the patient
        And I 'Third dosing' the patient
        And I 'Final visit' the patient with 'feeling good'
        Then the patient table shows
        | Patient Identifier | Status   | Last Visit  |
        | QASR0001           | Complete | Final visit |