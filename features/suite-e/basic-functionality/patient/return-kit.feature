@basic-return-kit
Feature: Basic Functionality: Return kit
    tc-3366 Return kit

    Scenario: Return randomization kit
        Given that study 'qa_smoke_regression_teststudy1' is clean loaded 
        And 'Principal Investigator' is logged in
        And I select study "qa_smoke_regression_teststudy1" and site "S0015" on the selector page
        When I screen a patient
        And I randomize the patient
        And I 'Second dosing' the patient
        And I 'Third dosing' the patient
        And I choose the 'Return kit' action
        Then 'Return kit' 'BEGIN' step is displayed
        And table shows
        | Visit Name    | Visit Date | Dispensed   | Kit Name    | Kit Status |
        |               |            |             |             |            |
        | Third dosing  |            | 20005/20006 | blinded kit | Dispensed  |
        | Second dosing |            | 20003/20004 | blinded kit | Dispensed  |
        | Randomize     |            | 20001/20002 | blinded kit | Dispensed  |
        When I open the 'Reason for dispensing additional medication' dropdown
        And I select option 'Damaged'
        And I select checkbox in row with text 'Randomize'
        And I click the 'Next' button
        And I click the 'Submit' button
        Then 'Return kit' 'DONE' step is displayed
        And 'is complete' message is 'displayed'

    Scenario: Return dosing kits
        Given 'Principal Investigator' is logged in
        And I select study "qa_smoke_regression_teststudy1" and site "S0015" on the selector page
        When I am on the 'patient' page
        And I choose the 'Return kit' action
        Then 'Return kit' 'BEGIN' step is displayed
        And table shows
        | Visit Name    | Visit Date | Dispensed   | Kit Name    | Kit Status |
        |               |            |             |             |            |
        | Third dosing  |            | 20005/20006 | blinded kit | Dispensed  |
        | Second dosing |            | 20003/20004 | blinded kit | Dispensed  |
        And table does not show
        | Visit Name    | Visit Date | Dispensed   | Kit Name    | Kit Status |
        | Randomize     |            | 20001/20002 | blinded kit | Dispensed  |
        When I select checkbox with text 'Display kits already returned for this patient'
        Then table shows
        | Visit Name    | Visit Date | Dispensed   | Kit Name    | Kit Status |
        |               |            |             |             |            |
        | Third dosing  |            | 20005/20006 | blinded kit | Dispensed  |
        | Second dosing |            | 20003/20004 | blinded kit | Dispensed  |
        | Randomize     |            | 20001/20002 | blinded kit | Returned   |
        When I open the 'Reason for dispensing additional medication' dropdown
        And I select option 'Damaged'
        And I select checkbox in row with text 'Second dosing'
        And I select checkbox in row with text 'Third dosing'
        And I click the 'Next' button
        And I click the 'Submit' button
        Then 'Return kit' 'DONE' step is displayed
        And 'is complete' message is 'displayed'
        When I click the 'Back to Patients' link
        And I choose the 'Return kit' action
        Then the 'Return kit' table is empty