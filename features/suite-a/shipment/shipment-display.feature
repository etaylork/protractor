@shipment-display
Feature: Shipment Display
    As Supply Manager
    I want to verify that system displays shipment options for site and depot.

    Scenario: Verify that system displays shipment options for site and depot.
        Given 'Supply Manager' is logged in
        And I select study "manualshipment" only on the selector page
        And I am on the 'shipment' page
        Then button with text 'Create a site shipment' is displayed
        And button with text 'Create a depot shipment' is displayed
        #Since the study is loaded from scratch there are no existing shipments to check for
