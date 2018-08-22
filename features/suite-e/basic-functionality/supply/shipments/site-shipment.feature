@site-shipment
Feature: Site Shipment
    Prancer-4343 Site Shipment
    TC-3368 AC Completed: AC1

    Scenario: Site shipment
        Given that study 'qa_smoke_regression_teststudy1' is clean loaded
        And 'CSL' is logged in
        And I select study "qa_smoke_regression_teststudy1" only on the selector page
        And I am on the 'shipment' page
        When I create a 'site' shipment
        And I select site shipment 'S0015' and source 'USDEP1'
        And I set the quantity for all kit types to '3'
        And I click button with text 'Next'
        And I click button with text 'CREATE SHIPMENT'
        Then 'shipment success' confirmation message is displayed
        When I click button with text 'Back to Shipments'
        And I select action 'Dispatch Shipment' for shipment with id '6'
        And I click button with text 'Dispatch Shipment'
        Then 'transit success' confirmation message is displayed
        When I click button with text 'Back to Shipments'
        And I select action 'Receive Shipment' for shipment with id '6'
        And 2 is damaged, 3 is lost, and 4 is intact
        #changed the order of discrete kits: first 4 is intact, next three is lost, and the last two is damaged
        And mark the bulk supply as:
            | bulk supply | intact | lost | damaged |
            | Coke        | 3      | 0    | 0       |
            | Pepsi       | 3      | 0    | 0       |
            | RC          | 3      | 0    | 0       |
            | coffee      | 2      | 0    | 1       |
            | decaf       | 1      | 1    | 1       |
        And I click button with text 'Next'
        And I click button with text 'Receive Shipment'
        Then 'receive shipment' confirmation message is displayed
