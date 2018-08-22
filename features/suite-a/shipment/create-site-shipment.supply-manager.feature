@create-site-shipment-sup
Feature: Create Site Shipment Supply Manager
    As Supply Manager
    I want to verify that the user is able to create a site shipment

    Scenario: Verify that Supply Manager is able to create a site shipment
        #Given that study 'manualShipment' is loaded by admin
        Given 'Supply Manager' is logged in
        And I select study "manualshipment" only on the selector page
        And I am on the 'shipment' page
        When I create a 'site' shipment
        And I take a screenshot called "create-site-shipment-supply-manager-1"
        Then I see all the required create-a-shipment fields
        When I filter shipments by 'Site ID' equal to 'S0005'
        And I take a screenshot called "create-site-shipment-supply-manager-2"
        Then shipment 'Site ID' equal to 'S0005' is displayed
        When I filter shipments by 'Site ID' equal to 'S0006'
        And I take a screenshot called "create-site-shipment-supply-manager-3"
        Then shipment 'Site ID' equal to 'S0006' is not displayed
        When I select site shipment 'S0003' and source 'USDEP1'
        And I take a screenshot called "create-site-shipment-supply-manager-4"
        Then I see all the required create-a-shipment inventory fields
        When I set quantity for 'Chocolate', 'FAKE LOT patient_tree_lot_1' equal to '60'
        And I submit the shipment
        And I take a screenshot called "create-site-shipment-supply-manager-5"
        Then I see 'quantity too large' error message
        When I set quantity for 'Chocolate', 'FAKE LOT patient_tree_lot_1' equal to '5'
        And I set quantity for 'coffee', 'FAKE LOT mini-coffeelot1' equal to '10'
        And I submit the shipment
        And I take a screenshot called "create-site-shipment-supply-manager-5"
        Then create site shipment review page 'source' is 'USDEP1'
        And create site shipment review page 'destination' is 'S0003'
        And create site shipment review page 'Chocolate' 'quantity' is '5'
        And create site shipment review page 'coffee' 'quantity' is '10'
        And button with text 'Back' is displayed
        And button with text 'CREATE SHIPMENT' is displayed
        When I click button with text 'CREATE SHIPMENT'
        And I take a screenshot called "create-site-shipment-supply-manager-6"
        Then 'shipment success' confirmation message is displayed
        And shipment id is verified on shipment reports list