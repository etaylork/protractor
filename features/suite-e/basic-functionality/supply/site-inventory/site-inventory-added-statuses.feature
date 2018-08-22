@site-inventory-with-added-statuses
Feature: Site Inventory with Added Statuses
    Prancer-4389: Site Inventory with Added Statuses
    TC-3375 AC Completed: AC1

    Scenario: Site inventory with added statuses Principal Investigator
       Given load 'inventory' stack data - 'initialize_e2e_inventory_stack'
       And 'Principal Investigator' is logged in
       And I select study "qa_smoke_regression_teststudy1" only on the selector page
       And I am on the 'site-inventory' page
       Then there is inventory displayed with the following status columns on the site inventory page
            | columns    |
            | Hold       |
            | Available  |
            | Lost       |
            | Damaged    |
            | Quarantine |
        When I mark the following discrete kits as
            | kit ID | status     |
            | 10001  | Hold       |
            | 10002  | Hold       |
            | 10003  | Lost       |
            | 10004  | Lost       |
            | 10005  | Damaged    |
            | 10006  | Damaged    |
            | 10007  | Quarantine |
            | 10008  | Quarantine |
        And I mark the following bulk kits as
            | kit type | Hold | Lost | Damaged | Quarantine |
            | coffee   | 1    | 2    | 3       | 4          |
            | decaf    | 4    | 3    | 2       | 1          |
        And continue with updating the site inventory
        Then the site inventory updated successfully
        When I click button with text 'Back to Inventory'
        Then discrete kit '10003' is not visible
        And discrete kit '10004' is not visible
        When I mark the following discrete kits as
            | kit ID | status    |
            | 10001  | Available |
            | 10002  | Available |
        And I mark the following bulk kits as
            | kit type | Available |
            | coffee   |   1       |
            | decaf    |   4       |
        And continue with updating the site inventory
        Then the site inventory updated successfully

    Scenario: Site inventory with added statuses CSL
        Given 'CSL' is logged in
        And I select study "qa_smoke_regression_teststudy1" and site "S0015" on the selector page
        And I am on the 'site-inventory' page
        Then kit '10007' is visible in 'Quarantine' status
        And kit '10008' is visible in 'Quarantine' status
        When I mark all discrete kits on the page as 'Available'
        And I mark the 'Quarantine' bulk kits as 'Available'
        | kit type |
        | coffee   |
        | decaf    |
        And continue with updating the site inventory
        Then the site inventory updated successfully
        When I click button with text 'Back to Inventory'
        And I mark all discrete kits as 'Damaged'
        And I mark the following bulk kits as
           | kit type | Damaged |
           | coffee   | 5       |
           | decaf    | 5       |
           | Coke     | 10      |
           | Pepsi    | 10      |
           | RC       | 10      |
        And continue with updating the site inventory
        Then the site inventory updated successfully
        When I click button with text 'Back to Inventory'
        Then there is no inventory on the site inventory page
        When I select study 'ta_patient_testdata1' and site 'TA10001' on the study-selector dialog
        And I am on the 'site-inventory' page
        Then there is inventory displayed with the following status columns on the site inventory page
         | columns    |
         | Available  |
         | Damaged    |
         | Lost       |