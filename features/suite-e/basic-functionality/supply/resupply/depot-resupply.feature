@depot-resupply
Feature: Depot Resupply
    Prancer-4360 Depot Resupply
    TC-3372 AC Completed: AC1

    Scenario: Depot resupply
        Given load 'core features' stack data - 'initialize_e2e_core_features_stack'
        And 'Supply Manager' is logged in
        And I select study "qa_smoke_regression_teststudy1" only on the selector page
        And I am on the 'depot-resupply' page
        When depot resupply is run
        Then run is successful and shipment request is displayed
        When I filter each column on the page
        Then each column filters
        When I sort each column on the page
        Then each column sorts
        And click on the available inventory link for 'USDEP1'
        Then the 'Depot Inventory Report' report is open for depot 'USDEP1'
        When I am on the 'depot-resupply' page
        And I open the create shipment form for 'USDEP2'
        Then the shipment request has 'USDEP2' preset as the destination
        And the source of the shipment is preset to 'USDEP1'
        When I ship out bulk kits for the shipments
            | kit                     | quantity     |
            | coffee                  | 5            |
            | decaf                   | 5            |
            | Tea - Earl Grey         | 5            |
            | Tea - English Breakfast | 5            |
            | refactorer-reB          | 5            |
            | reiterator-reA          | 5            |
        And I click button with text 'Next'
        And I click button with text 'CREATE SHIPMENT'
        Then 'shipment success' confirmation message is displayed