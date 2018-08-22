@site-resupply
Feature: Site Resupply
    Prancer-4343 Site Resupply
    TC-3371 AC Completed: AC1

    Scenario: Preconditions for site resupply
        Given load 'core features' stack data - 'initialize_e2e_core_features_stack'
        And 'admin' is logged in
        And I select study "qa_smoke_regression_teststudy1" and site "S0015" on the selector page
        And I am on the 'site-inventory' page
        And I update all the site inventory as 'Damaged'
            | kit type | Damaged |
            | Coke     | 10      |
            | Pepsi    | 10      |
            | RC       | 10      |
            | coffee   | 10      |
            | decaf    | 10      |
        And delete user role grant 'ta_patient_testdata1' for 'Supply Manager'

    Scenario: Site resupply pooling group and depot
        Given 'Supply Manager' is logged in
        And I select study "qa_smoke_regression_teststudy1" only on the selector page
        And I am on the 'site-resupply' page
        When I press the tab with text 'Run resupply'
        Then verify the options in the 'Select a pooling group' dropdown
            | options                        |
            | qa_smoke_regression_teststudy1 |
        When I select the resupply 'level' dropdown 'Pooling group and depot'
        And I select the resupply 'depot' dropdown 'USDEP1'
        And I select the resupply 'pooling group' dropdown 'qa_smoke_regression_teststudy1'
        And I click button with text 'Run resupply'
        Then 'resupply running' completion is indicated
        When I am on the 'shipment' page
        And I cancel the last shipment created
        Then no shipments are displayed on the shipment page

    Scenario: Site resupply pooling group and country
        Given 'Supply Manager' is logged in
        And I select study "qa_smoke_regression_teststudy1" only on the selector page
        And I am on the 'site-resupply' page
        When I press the tab with text 'Run resupply'
        And I select the resupply 'level' dropdown 'Pooling group and country'
        And I select the resupply 'pooling group' dropdown 'qa_smoke_regression_teststudy1'
        And I select the resupply 'country' dropdown 'United States of America'
        And I click button with text 'Run resupply'
        Then 'resupply running' completion is indicated
        When I am on the 'shipment' page
        And I cancel the last shipment created
        Then no shipments are displayed on the shipment page

    Scenario: Site resupply pooling group and site
        Given 'Supply Manager' is logged in
        And I select study "qa_smoke_regression_teststudy1" only on the selector page
        And I am on the 'site-resupply' page
        When I press the tab with text 'Run resupply'
        And I select the resupply 'level' dropdown 'Pooling group and site'
        And I select the resupply 'pooling group' dropdown 'qa_smoke_regression_teststudy1'
        And I select the resupply 'site' dropdown 'qa_smoke_regression_teststudy1: S0015'
        And I click button with text 'Run resupply'
        Then 'resupply running' completion is indicated