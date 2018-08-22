@resupply-valid-combinations
Feature: Resupply Validation

    Scenario: System only allows valid combinations
        #Given that study 'ta_patient_testdata1' is loaded
        Given 'Supply Manager' is logged in
        And I select study "ta_patient_testdata1" only on the selector page
        And I am on the 'site-resupply' page
        When I select the resupply 'level' dropdown 'Pooling group and depot'
        Then resupply dropdown 'depot' is 'enabled'
        And resupply dropdown 'pooling group' is 'enabled'
        And resupply dropdown 'country' is 'disabled'
        And resupply dropdown 'site' is 'disabled'
        When I select the resupply 'depot' dropdown 'USDEP1'
        And I select the resupply 'pooling group' dropdown 'ta_patient_testdata1'
        Then I take a screenshot called "resupply-valid-combinations-1-depot-selected"
        And 'USDEP1' resupply 'depot' is displayed
        And 'ta_patient_testdata1' resupply 'pooling group' is displayed
        When I select the resupply 'level' dropdown 'Pooling group and country'
        Then I take a screenshot called "resupply-valid-combinations-2-country-selected"
        And no resupply 'depot' is displayed
        And resupply dropdown 'pooling group' is 'enabled'
        And resupply dropdown 'country' is 'enabled'
        And resupply dropdown 'site' is 'disabled'
        When I select the resupply 'pooling group' dropdown 'ta_patient_testdata1'
        Then 'ta_patient_testdata1' resupply 'pooling group' is displayed
        #When I select resupply country 'United States of America'
        #Then 'United States of America' resupply country is displayed
        When I select the resupply 'level' dropdown 'Pooling group and site'
        Then I take a screenshot called "resupply-valid-combinations-3-site-selected"
        And resupply dropdown 'pooling group' is 'enabled'
        And resupply dropdown 'site' is 'enabled'
        And no resupply 'country' is displayed
        When I select the resupply 'site' dropdown 'TA10001'
        Then 'TA10001' resupply 'site' is displayed
        When I select the resupply 'level' dropdown 'Pooling group and depot'
        Then resupply dropdown 'depot' is 'enabled'
        And resupply dropdown 'pooling group' is 'enabled'
        And no resupply 'country' is displayed
        And no resupply 'site' is displayed