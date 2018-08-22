@basic-patient-status-change
Feature: Basic Functionality: Patient status change
    tc-3364 Patient status change

    Scenario: Basic Functionality: Patient status change
        Given that study 'qa_smoke_regression_teststudy1' is clean loaded 
        And 'CSL' is logged in
        And I select study "qa_smoke_regression_teststudy1" and site "S0015" on the selector page
        When I screen a patient
        And I choose the 'Screen Fail' action
        Then 'Screen Fail' 'BEGIN' step is displayed
        When I select the 'Screen fail reason' input
        And enter text 'screen fail test'
        And I click the 'Next' button
        And I click the 'Submit' button
        Then 'Screen Fail' 'DONE' step is displayed
        And 'is complete' message is 'displayed'
        When I click the 'Back to Patients' link
        Then the table shows
        | Patient Identifier | Status        | Last Visit | Last Visit Date | Next Expected Visit |
        | QASR0001           | Screen Failed | Screen     |                 | ""                  |
        When I open the 'Other actions' menu
        Then 'Screen Fail' button is not displayed
        And 'Rescreen' button is displayed