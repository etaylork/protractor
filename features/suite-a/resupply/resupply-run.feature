@resupply-run
Feature: Resupply Run
    As Supply Manager
    I want to verify that resupply can be run and accounts for the parameters

    Scenario: Verify that resupply can be run and accounts for the parameters
        #Given that study 'tc_resupply_study_1' is loaded
        Given 'Supply Manager' is logged in
        And I select study "tc_resupply_study_1" only on the selector page
        And I am on the 'site-resupply' page
        When I select the resupply 'level' dropdown 'Pooling group and depot'
        And I select the resupply 'depot' dropdown 'USDEP1'
        And I run the resupply by clicking the 'run resupply' button
        Then I take a screenshot called "resupply-run-1-depot-level"
        Then 'resupply running' confirmation message is displayed
        And 'resupply running' completion is indicated
        #And resupply run has correct configuration in admin page

        When I select the resupply 'level' dropdown 'Pooling group and country'
        When I select the resupply 'pooling group' dropdown 'tc_resupply_study_1'
        #When I select the resupply 'country' dropdown 'United States of America'
        Then I run the resupply by clicking the 'run resupply' button
        And I take a screenshot called "resupply-run-2-pgc"
        And 'resupply running' confirmation message is displayed
        And 'resupply running' completion is indicated
        #And resupply run has correct configuration in admin page

        When I select the resupply 'level' dropdown 'Pooling group and site'
        When I select the resupply 'pooling group' dropdown 'tc_resupply_study_1'
        When I select the resupply 'site' dropdown '101'
        Then I run the resupply by clicking the 'run resupply' button
        And I take a screenshot called "resupply-run-3-pgs"
        And 'resupply running' confirmation message is displayed
        And 'resupply running' completion is indicated
        #And resupply run has correct configuration in admin page
