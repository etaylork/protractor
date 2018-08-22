@receive-shipment
Feature: Receive A Shipment
    As Admin
    I want to be able to screen a patient

    Scenario: Receive a shipment
        #Given that study 'manualShipment' is loaded
        Given 'admin' is logged in
        And I select study "manualshipment" and site "S0002" on the selector page
        When I am on the 'shipment' page
        And I have created all required shipments
        | name | type | destination | source | kit       | lot                         | quantity |
        |  1   | site | S0002       | USDEP1 | coffee    | FAKE LOT mini-coffeelot1    | 1        |
        |      |      |             |        | decaf     | FAKE LOT mini-coffeelot1    | 1        |
        |      |      |             |        | Chocolate | FAKE LOT patient_tree_lot_1 | 1        |
        |      |      |             |        | Mint      | FAKE LOT patient_tree_lot_1 | 1        |
        |      |      |             |        | Vanilla   | FAKE LOT patient_tree_lot_1 | 1        |
        |  2   | site | S0003       | USDEP1 | coffee    | FAKE LOT mini-coffeelot1    | 5        |
        |      |      |             |        | decaf     | FAKE LOT mini-coffeelot1    | 5        |
        |      |      |             |        | Mint      | FAKE LOT patient_tree_lot_1 | 1        |
        |  3   | site | S0004       | USDEP1 | coffee    | FAKE LOT mini-coffeelot1    | 5        |
        |      |      |             |        | decaf     | FAKE LOT mini-coffeelot1    | 5        |
        |      |      |             |        | Vanilla   | FAKE LOT patient_tree_lot_1 | 1        |
        When I dispatch shipment '1'
        Then shipment '1' status is 'In Transit'
        And shipment '2' status is 'Queued'
        And shipment '3' status is 'Queued'
        When I receive shipment 'S0002'
        And I select the intact checkbox
        And 1 is damaged, 1 is lost, and 1 is intact
        And bulk 'coffee' has 1 'damaged'
        And bulk 'decaf' has 1 'lost'
        And I process the shipment
        Then there are 1 available kits
        And there are 2 damaged kits
        And there are 2 lost kits
        When I receive the shipment
        Then the shipment is successfully received
