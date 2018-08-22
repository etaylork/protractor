@excursions-with-uploaded-logs-and-collected-details
Feature: Excursions With Uploaded Logs and Collected Details
    Prancer-4466 Excursions With Uploaded Logs and Collected Details
    TC-3332 AC Complete: AC1-AC3

    Scenario: Preconditions excursions with uploaded logs and collected details
        Given that study 'qa_smoke_regression_teststudy1' is clean loaded
        And 'admin' is logged in
        And add 'USDEP2' depot for the 'qa_smoke_regression_teststudy1' pooling group
        And update depot 'USDEP2' address to address with id 'TA20002'
        And 'CSL' is given feature access: 'menu_supply_new_depot_excursion'
        And set pooling group temp configs for study 'qa_smoke_regression_teststudy1' and excursions 'with uploaded logs and collected details'

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
        And I enter the temperature details
            | Temp ID | max temp | min temp | above allowed temp | below allowed temp |
            | test    | 50       | 10       | 10                 | 1                  |
        And I click the add file button
        And I upload file 1 - 'temp-log-01-test.pdf'
        And I upload file 2 - 'temp-log-02.pdf'
        And I click the temperature details page next button
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
        And I enter the temperature details
            | Temp ID | max temp | min temp | above allowed temp | below allowed temp |
            | test    | 50       | 10       | 10                 | 1                  |
        And I click the add file button
        And I upload file 1 - 'temp-log-01-test.pdf'
        And I upload file 2 - 'temp-log-02.pdf'
        And I click the temperature details page next button
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
        And I click button with text 'Next'
        And I enter the temperature details on the inventory with temp excursion page
            | Temp ID | max temp | min temp | above allowed temp | below allowed temp | Date excursion started | Date excursion ended |
            | test    | 50       | 10       | 10                 | 1                  | 07-Aug-2018 05:29 AM   | 09-Aug-2018 05:29 PM |
        And I click the add file button
        And I upload file 1 - 'temp-log-01-test.pdf'
        And I upload file 2 - 'temp-log-02.pdf'
        And I progress with completing inventory with temp excursions process
        Then a temperature excursion report message is displayed
        When I am on the 'site-excursion' page
        And I mark '4' discrete supply as 'Temp excursion' for inventory with temp excursion process
        And I mark bulk kits for inventory with temp excursion process
            | kit   | status         | quantity |
            | decaf | Temp excursion | 2        |
        And I click button with text 'Next'
        And I enter the temperature details on the inventory with temp excursion page
            | Temp ID | max temp | min temp | above allowed temp | below allowed temp | Date excursion started | Date excursion ended |
            | test    | 50       | 10       | 10                 | 1                  | 07-Aug-2018 05:29 AM   | 09-Aug-2018 05:29 PM |
        And I click the add file button
        And I upload file 1 - 'temp-log-01-test.pdf'
        And I upload file 2 - 'temp-log-02.pdf'
        And I progress with completing inventory with temp excursions process
        Then a temperature excursion report message is displayed

    Scenario: Validate excursions
        Given 'CSL' is logged in
        And I select study "qa_smoke_regression_teststudy1" and site "S0015" on the selector page
        And I am on the 'excursion' page
        Then a total of '4' excursions are displayed
        When I partially progress excursion '1' as 'Resolved'
        Then a success partially resolved message is displayed for excursion '1'
        When I progress excursion '2' marking all kits as 'Resolved'
        Then a success resolution message is displayed for excursion '2'
        When I am on the 'excursion' page
        And I show all the excursions
        And I filter each column in the report
        Then each column filters
        When I sort each column in the report
        Then each column sorts

    Scenario Outline: Resolve all excursions and validate uploaded logs
        Given 'CSL' is logged in
        And I select study "qa_smoke_regression_teststudy1" and site "S0015" on the selector page
        When I am on the 'excursion' page
        And I progress excursion '<id>'
        And I press the partial link text 'temp-log-01-test'
        Then the uploaded file 'temp-log-01-test' is accessible
        When I switch back to the prancer site browser window
        And I press the partial link text 'temp-log-02'
        Then the uploaded file 'temp-log-02' is accessible
        When I switch back to the prancer site browser window
        And I progress excursion '<id>' marking all kits as 'Resolved'
        Then a success resolution message is displayed for excursion '<id>'
        And the temperature exursion details for excursion '<id>' is displayed
        Examples: 
            | id |
            | 4  |
            | 3  |
            | 1  |