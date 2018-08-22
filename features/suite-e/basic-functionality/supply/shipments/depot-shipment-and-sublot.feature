@depot-shipment-and-sublot
Feature: Depot Shipment and SubLot
    Prancer-4349 Depot Shipment and SubLot
    TC-3370 AC Completed: AC1

    Scenario: Depot shipment and sublot
        Given load 'core features' stack data - 'initialize_e2e_core_features_stack'
        And 'Supply Manager' is logged in
        And I select study "qa_smoke_regression_teststudy1" only on the selector page
        And I am on the 'shipment' page
        When I create a 'depot' shipment
        And I select depot shipment 'Canada Depot' and source 'USDEP1'
        And I set the quantity for all kit types to '4'
        And I confirm creation of sublots
        And I click button with text 'Next'
        And I click button with text 'CREATE SHIPMENT'
        Then 'shipment success' confirmation message is displayed
        When I click button with text 'Back to Shipments'
        And I select action 'Dispatch Shipment' for the last shipment created
        And I click button with text 'Dispatch Shipment'
        Then 'transit success' confirmation message is displayed
        When I log out
        And 'CSL' is logged in
        And I select study "qa_smoke_regression_teststudy1" only on the selector page
        And I am on the 'lots' page
        Then the sublots created by the depot shipment are displayed
            | sublots                                    |
            | autogenerated fake lot 21200 for aspirin_1 |
            | beverages_test_1                           |
            | Both Tea_1                                 |
            | mini-coffeelot1_1                          |
            | resup_lot1_1                               |
        When I am on the 'shipment' page
        And I select action 'Unblind Receive Shipment' for the last shipment created
        And 2 is damaged, 3 is lost, and 7 is intact
        And mark the bulk supply as:
            | bulk supply             | intact | lost | damaged |
            | Coke                    | 4      | 0    | 0       |
            | Pepsi                   | 4      | 0    | 0       |
            | RC                      | 4      | 0    | 0       |
            | Tea - Earl Grey         | 2      | 1    | 1       |
            | Tea - English Breakfast | 1      | 1    | 2       |
            | coffee                  | 2      | 0    | 2       |
            | decaf                   | 3      | 1    | 0       |
        And I click button with text 'Next'
        And I click the unblind receive a shipment button
        Then 'receive shipment' confirmation message is displayed