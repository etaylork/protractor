@basic-replace-kit
Feature: Basic Functionality: Replace kit
    tc-3365 Replace Kit

    Scenario: Replace randomization kit
        Given that study 'qa_smoke_regression_teststudy1' is clean loaded 
        And 'Principal Investigator' is logged in
        And I select study "qa_smoke_regression_teststudy1" and site "S0015" on the selector page
        When I screen a patient
        And I randomize the patient
        And I choose the 'Replace Kit' action
        Then 'Replace Kit' 'BEGIN' step is displayed
        And table shows
        | Visit Name    | Visit Date | Dispensed   | Kit Name    | Kit Status |
        |               |            |             |             |            |
        | Randomize     |            | 20001/20002 | blinded kit | Dispensed  |
        When I open the 'Reason for dispensing additional medication' dropdown
        And I select option 'Damaged'
        And I select checkbox in row with text 'Randomize'
        And I click the 'Next' button
        And I click the 'Submit' button
        Then 'Replace Kit' 'DONE' step is displayed
        And 'is complete' message is 'displayed'

    Scenario: Replace dosing kit
        Given 'Principal Investigator' is logged in
        And I select study "qa_smoke_regression_teststudy1" and site "S0015" on the selector page
        When I am on the 'patient' page
        And I 'Second dosing' the patient
        And I choose the 'Replace Kit' action
        Then 'Replace Kit' 'BEGIN' step is displayed
        And table shows
        | Visit Name    | Visit Date | Dispensed   | Kit Name    | Kit Status |
        |               |            |             |             |            |
        | Second dosing |            | 20005/20006 | blinded kit | Dispensed  |
        And table does not show
        || Visit Name    | Visit Date | Dispensed   | Kit Name    | Kit Status |
        || Randomize     |            | 20001/20002 | blinded kit | Dispensed  |
        When I open the 'Reason for dispensing additional medication' dropdown
        And I select option 'Damaged'
        And I select checkbox in row with text 'Second dosing'
        And I click the 'Next' button
        And I click the 'Submit' button
        Then 'Replace Kit' 'DONE' step is displayed
        And 'is complete' message is 'displayed'
        When I click the 'Back to Patients' link
        And I choose the 'Replace Kit' action
        Then the 'Replace Kit' table is empty