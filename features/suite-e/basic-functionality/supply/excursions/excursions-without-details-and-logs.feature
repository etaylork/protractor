@excursions-without-collected-details-and-logs
Feature: Excursions Without Collected Details and Logs
    Prancer-4430: Excursions Without Collecting Details and Logs
    TC-3440: AC Completed: AC1-AC3

    Scenario: Preconditions excursions without collected details and logs
        Given that study 'qa_smoke_regression_teststudy1' is clean loaded
        And 'admin' is logged in
        And add 'USDEP2' depot for the 'qa_smoke_regression_teststudy1' pooling group
        And update depot 'USDEP2' address to address with id 'TA20002'
        And 'CSL' is given feature access: 'menu_supply_new_depot_excursion'
        And set pooling group temp configs for study 'qa_smoke_regression_teststudy1' and excursions 'without collecting details and logs'

    Scenario: Create temperature excursions
        Given 'CSL' is logged in
        And I select study "qa_smoke_regression_teststudy1" and site "S0015" on the selector page
        And I am on the 'shipment' page
        When I create a 'depot' shipment
        And I select depot shipment 'USDEP2' and source 'USDEP1'
        And I ship out bulk kits for the shipments
            | kit            | quantity |
            | coffee         | 5        |
            | decaf          | 5        |
            | refactorer-reB | 5        |
            | reiterator-reA | 5        |
        And I continue with creating a shipment
        And I click button with text 'Back to Shipments'
        And I select action 'Receive Shipment' for the last shipment created
        And I indicate that there is a temp excursion
        And I mark all discrete and bulk supply as 'Temp excursion'
            | bulk supply | Temp excursion |
            | coffee      | 5              |
            | decaf       | 5              |
        And I click button with text 'Next'
        Then the discrete kits are displayed in descending order on the receive shipment review page
        And I click button with text 'Receive Shipment'
        Then 'receive shipment' confirmation message is displayed
        And a shipment temperature excursion report message is displayed

        When I am on the 'shipment' page
        And I create a 'site' shipment
        And I select site shipment 'S0015' and source 'USDEP1'
        And I ship out bulk kits for the shipments
            | kit            | quantity |
            | coffee         | 3        |
            | decaf          | 3        |
            | refactorer-reB | 3        |
            | reiterator-reA | 3        |
        And I continue with creating a shipment
        And I click button with text 'Back to Shipments'
        And I select action 'Receive Shipment' for the last shipment created
        And I indicate that there is a temp excursion
        And I mark all discrete and bulk supply as 'Temp excursion'
            | bulk supply | Temp excursion |
            | coffee      | 3              |
            | decaf       | 3              |
        And I click button with text 'Next'
        Then the discrete kits are displayed in descending order on the receive shipment review page
        And I click button with text 'Receive Shipment'
        Then 'receive shipment' confirmation message is displayed
        And a shipment temperature excursion report message is displayed

        When I am on the 'depot-excursion' page
        And I select depot 'USDEP1' on the depot excursion page
        And I mark '3' discrete supply as 'Temp excursion' for inventory with temp excursion process
        And I mark bulk kits for inventory with temp excursion process
            | kit    | status         | quantity |
            | coffee | Temp excursion | 1        |
        And I progress with completing inventory with temp excursions process
        Then a temperature excursion report message is displayed

        When I am on the 'site-excursion' page
        And I mark '4' discrete supply as 'Temp excursion' for inventory with temp excursion process
        And I mark bulk kits for inventory with temp excursion process
            | kit   | status         | quantity |
            | decaf | Temp excursion | 2        |
        And I progress with completing inventory with temp excursions process
        Then a temperature excursion report message is displayed
        When I am on the 'excursion' page
        Then a total of '4' excursions are displayed

    Scenario Outline: Validate and resolve all excursions
        Given 'CSL' is logged in
        And I select study "qa_smoke_regression_teststudy1" and site "S0015" on the selector page
        And I am on the 'excursion' page
        When I progress excursion '<id>' marking all kits as 'Rejected'
        Then a success resolution message is displayed for excursion '<id>'
        And the temperature exursion details for excursion '<id>' is displayed
        Examples:
            | id |
            | 1  |
            | 2  |
            | 3  |
            | 4  |