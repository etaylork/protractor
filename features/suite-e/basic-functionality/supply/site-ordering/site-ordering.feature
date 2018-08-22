@site-ordering
Feature: Site Ordering
    Prancer-4419: Site Ordering
    TC-3430 AC Completed: AC1

    Scenario: Site ordering Study Coordinator
            Given load 'core features' stack data - 'initialize_e2e_core_features_stack'
            And 'Study Coordinator' is logged in
            And I select study "qa_smoke_regression_teststudy1" and site "S0015" on the selector page
            And I am on the 'order-supply' page
            Then kit 'Pepsi' is not displayed in the table
            And the button with text 'Next' is disabled
            When I add supply for kit on the order supply page
                | kit    | quantity |
                | coffee | 20       |
            Then a error message is displayed indicating the max supply for ordering is '10'
            When I add supply for kits on the order supply page
                | kit    | quantity |
                | coffee | 5        |
                | decaf  | 20       |
            And I press the button with text 'Next'
            And I press the button with text 'SUBMIT'
            Then a shipment request 'success' message is displayed
            When I press the order supply button
            And I add supply for kits on the order supply page
                | kit    | quantity |
                | coffee | 2        |
                | decaf  | 9        |
            And I press the button with text 'Next'
            And I press the button with text 'SUBMIT'
            Then a shipment request 'success' message is displayed

    Scenario: Site ordering CSL
        Given 'CSL' is logged in
        And I select study "qa_smoke_regression_teststudy1" and site "S0016" on the selector page
        And I am on the 'order-supply' page
        And I add supply for kits on the order supply page
            | kit    | quantity |
            | coffee | 4        |
            | decaf  | 4        |
        And I press the button with text 'Next'
        And I press the button with text 'SUBMIT'
        Then a shipment request 'success' message is displayed
        When I am on the 'site-resupply' page
        Then '3' order requests are displayed
            | Site                                  | Depot  | Requested by       | Quantity requested | Requested on | Manage |
            | qa_smoke_regression_teststudy1: S0015 | USDEP1 | sc@4gclinical.com  | 25                 |              | Manage |
            | qa_smoke_regression_teststudy1: S0015 | USDEP1 | sc@4gclinical.com  | 11                 |              | Manage |
            | qa_smoke_regression_teststudy1: S0016 | USDEP1 | csl@4gclinical.com | 8                  |              | Manage |
        When I filter each column in the report
        Then each column filters
        When I sort each column in the report
        Then each column sorts
        When I decline the order with '25' kits
        Then '2' order requests are displayed
           | Site                                  | Depot  | Requested by       | Quantity requested | Requested on | Manage |
           | qa_smoke_regression_teststudy1: S0015 | USDEP1 | sc@4gclinical.com  | 11                 |              | Manage |
           | qa_smoke_regression_teststudy1: S0016 | USDEP1 | csl@4gclinical.com | 8                  |              | Manage |
        When I create a shipment from the order with '11' kits
        Then the shipment is displayed on the current shipments list