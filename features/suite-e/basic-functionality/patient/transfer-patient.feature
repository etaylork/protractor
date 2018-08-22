@basic-patient-transfer-patient
Feature: Basic Functionality: Transfer patient
    TC-3363 Transfer patient

    Scenario: Basic Functionality: Transfer patient
        Given that study 'qa_smoke_regression_teststudy1' is clean loaded 
        And 'CSL' is logged in
        And I select study "qa_smoke_regression_teststudy1" and site "S0015" on the selector page
        When I screen a patient
        And I randomize the patient
        And I choose the 'Transfer patient' action
        Then 'Transfer patient' 'BEGIN' step is displayed
        When I open the 'Select new site' dropdown
        And I select option 'S0017'
        And I click the 'Next' button
        And I click the 'Submit' button
        Then 'Transfer patient' 'DONE' step is displayed
        And 'is complete' message is 'displayed'
        And the 'Patient' table is empty

    Scenario: Basic Functionality: Verify patient transferred
        Given 'CSL' is logged in
        And I select study "qa_smoke_regression_teststudy1" and site "S0017" on the selector page
        When I am on the 'patient' page
        Then the table shows
        | Patient Identifier | Status   | Last Visit | Last Visit Date | Next Expected Visit | Next expected visit date | More visits |
        | QASR0001           | Enrolled | Randomize  | "today"         | Second dosing       | "in 4 days"              |             |