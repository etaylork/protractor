@resupply-verification
Feature: Resupply Verification
    As Supply Manager
    I want to verify that manual resupply page exists and lists the right elements

    Scenario: Validate resupply page # ta_patient_testdata1
        #Given that study 'ta_patient_testdata1' is loaded
        Given 'Supply Manager' is logged in
        And I select study "ta_patient_testdata1" only on the selector page
        And I am on the 'site-resupply' page
        Then I take a screenshot called "resupply-validation-1-before-test"
        When I select the resupply 'level' dropdown 'Pooling group and depot'
        Then 'Pooling group and depot' resupply 'level' is displayed
        When I select the resupply 'level' dropdown 'Pooling group and country'
        Then 'Pooling group and country' resupply 'level' is displayed
        When I select the resupply 'level' dropdown 'Pooling group and site'
        Then 'Pooling group and site' resupply 'level' is displayed
        When I select the resupply 'level' dropdown 'Pooling group and depot'
        And I select the resupply 'depot' dropdown 'USDEP1'
        Then 'USDEP1' resupply 'depot' is displayed
        Then I take a screenshot called "resupply-validation-2-depot-selected"
        When I select the resupply 'pooling group' dropdown 'ta_patient_testdata1'
        Then 'ta_patient_testdata1' resupply 'pooling group' is displayed
        Then I take a screenshot called "resupply-validation-3-depot-selected"
        When I select the resupply 'level' dropdown 'Pooling group and country'
        Then 'Pooling group and country' resupply 'level' is displayed
        Then I take a screenshot called "resupply-validation-4-pooling-group-country"
        When I select the resupply 'pooling group' dropdown 'ta_patient_testdata1'
        Then I take a screenshot called "resupply-validation-5-pooling-group"
        Then 'ta_patient_testdata1' resupply 'pooling group' is displayed
        ##When I select the resupply 'country' dropdown 'United States of America'
        ##Then I take a screenshot called resupply-validation-5-country
        ##Then 'United States of America' resupply country is displayed
        When I select the resupply 'level' dropdown 'Pooling group and site'
        Then 'Pooling group and site' resupply 'level' is displayed
        When I select the resupply 'pooling group' dropdown 'ta_patient_testdata1'
        Then I take a screenshot called "resupply-validation-6-pooling-group"
        Then 'ta_patient_testdata1' resupply 'pooling group' is displayed
        When I select the resupply 'site' dropdown 'TA10001'
        Then I take a screenshot called "resupply-validation-7-site"
        Then 'TA10001' resupply 'site' is displayed
