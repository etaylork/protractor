@single-lot-dispensing
Feature: Single Lot Dispensing
    PRANCER-1658: AC 1 - AC 5

    Background: Lot dispensing preconditions
        Given that study 'single_lot1' is loaded
        And 'admin' is logged in
        And I select study "single_lot1" and site "S0030" on the selector page
        And I am on the 'shipment' page

    @sld-lddssa
    Scenario: Lot dispensing default split A
        When I have created all required shipments
        | name | type | destination | source | kit       | lot                   | quantity |
        |  1   | site | S0030       | USDEP1 | ashton    | FAKE LOT robusto_lot2 | 4        |
        And I fully receive shipment 'S0030'
        And I screen a patient
        And I 'Visit 2' the patient
        Then observe 2 lots from 'robusto_lot1'
        And observe 2 lots from 'robusto_lot2'

    @sld-lddssb
    Scenario: Lot dispensing default split B
        When I have created all required shipments
        | name | type | destination | source | kit       | lot                   | quantity |
        |  1   | site | S0030       | USDEP1 | ashton    | FAKE LOT robusto_lot1 | 2        |
        And I fully receive shipment 'S0030'
        And I set parameter 'same_lot_dispensing' with scope 'systemwide' and value 'HARD'
        And I set parameter 'same_lot_dispensing' with scope 'studywide' and value 'SOFT'
        And I screen a patient
        And I 'Visit 2' the patient
        Then observe 2 lots from 'robusto_lot1'
        And observe 2 lots from 'robusto_lot2'

    @sld-ldsos
    Scenario: Lot dispensing study overrides system
        And I have created all required shipments
        | name | type | destination | source | kit       | lot                   | quantity |
        |  1   | site | S0030       | USDEP1 | ashton    | FAKE LOT robusto_lot1 | 4        |
        |  2   | site | S0030       | USDEP1 | ashton    | FAKE LOT robusto_lot2 | 2        |
        And I fully receive shipment 'S0030'
        And I fully receive shipment 'S0030'
        When I screen a patient
        And I 'Visit 2' the patient
        Then observe 4 lots from 'robusto_lot1'

    @sld-ldhsb
    Scenario: Lot dispensing hard study blocks
        And I have created all required shipments
        | name | type | destination | source | kit       | lot                   | quantity |
        |  1   | site | S0030       | USDEP1 | ashton    | FAKE LOT robusto_lot1 | 3        |
        And I fully receive shipment 'S0030'
        And I set parameter 'same_lot_dispensing' with scope 'studywide' and value 'HARD'
        When I screen a patient
        And I 'Visit 2' the patient fails

    @sld-ldhsw
    Scenario: Lot dispensing hard study works
        And I have created all required shipments
        | name | type | destination | source | kit       | lot                   | quantity |
        |  1   | site | S0030       | USDEP1 | ashton    | FAKE LOT robusto_lot2 | 2        |
        And I fully receive shipment 'S0030'
        When I screen a patient
        And I 'Visit 2' the patient
        Then observe 4 lots from 'robusto_lot2'
