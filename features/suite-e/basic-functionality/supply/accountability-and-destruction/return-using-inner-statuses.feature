@return-using-inner-statuses
Feature: Return Using Inner Statuses
    Prancer-4518: Returns Using Inner Statuses
    TC-3477 AC Completed: AC1

    Scenario: Return using inner statuses
        Given load 'core features' stack data - 'initialize_e2e_core_features_stack'
        And 'Principal Investigator' is logged in
        And I select study "qa_smoke_regression_teststudy1" and site "S0015" on the selector page
        When I screen a patient
        And I randomize patient 'QASR0001'
        And I second dose patient 'QASR0001'
        And I am on the 'patient' page
        Then the number of patients increases by 1
        When I choose the 'Return kit' action
        Then 'Return kit' 'BEGIN' step is displayed
        And table shows
            | Visit Name    | Visit Date | Dispensed   | Kit Name    | Kit Status |
            |               |            |             |             |            |
            | Second dosing |            | 20003/20004 | blinded kit | Dispensed  |
            | Randomize     |            | 20001/20002 | blinded kit | Dispensed  |
        And I take a screenshot called "Retun Kit Begin page - second dosing.png"
        When I open the 'Reason for dispensing additional medication' dropdown
        And I select option 'Damaged'
        And I take note of the 'Second dosing' kit ID on the return kit form
        And I select checkbox in row with text 'Second dosing'
        And I click the 'Next' button
        Then 'Return kit' 'DEFINE QUANTITIES TO RETURN' step is displayed
        And input fields are available for used, returned, and missing columns
        And there is a check box for Tick box if whole kit missing field
        And I take a screenshot called "Retun kit define quantities to return page - second dosing.png"
        When I enter the following details on the return kit form
            | Details  | Values |
            | Used     | 5      |
            | Returned | 3      |
            | Missing  | 2      |
            | Notes    | Test 1 |
        And I click the next button on the define quantities to return page
        And I click the 'Submit' button
        Then 'Return kit' 'DONE' step is displayed
        And a success message unscheduled return kit action is displayed
        And I take a screenshot called "Return kit done page - second dosing.png"
        When I am on the 'patient' page
        And I choose the 'Return kit' action
        Then 'Return kit' 'BEGIN' step is displayed
        And table shows
            | Visit Name | Visit Date | Dispensed   | Kit Name    | Kit Status |
            |            |            |             |             |            |
            | Randomize  |            | 20001/20002 | blinded kit | Dispensed  |
        When I open the 'Reason for dispensing additional medication' dropdown
        And I select option 'Lost'
        When I take note of the 'Randomize' kit ID on the return kit form
        And I select checkbox in row with text 'Randomize'
        And I take a screenshot called "Return kit begin page - randomization.png"
        And I click the 'Next' button
        Then the input fields for used, returned, and missing columns are empty
        And the missing quantity field shows '10'
        When I enter the following details on the return kit form
            | Details  | Values  |
            | Tick box | checked |
        Then I take a screenshot called "Return kit define quantities to return page - randomization.png"
        When I click the next button on the define quantities to return page
        And I click the 'Submit' button
        Then 'Return kit' 'DONE' step is displayed
        And a success message unscheduled return kit action is displayed
        And I take a screenshot called "Return kit done page - randomization.png"
        When I log out
        And 'CSL' is logged in
        And I select study "qa_smoke_regression_teststudy1" only on the selector page
        And I open the 'Site Inventory Detail Report' report
        And I select site 'S0015'
        And I filter the 'Kit ID' column for kit ID returned from 'Second dosing'
        Then the table shows 
            | Status    |
            | Returned  |
        And I take a screenshot called "Second dosing kit id status - Returned.png"
        When I filter the 'Kit ID' column for kit ID returned from 'Randomization'
        Then the table shows 
            | Status        |
            | Not Returned  |
         And I take a screenshot called "Randomization kit id status - Not Returned.png"