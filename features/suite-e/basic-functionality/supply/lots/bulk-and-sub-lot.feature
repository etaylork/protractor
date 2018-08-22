@release-and-approve-bulk-sub-lot
Feature: Release and Approve Bulk and Sub Lot
    Prancer-4336 Release and Approve Bulk and Sub Lot
    TC-3367: AC Completed AC1

    Scenario: Release and Approve Bulk and Sub Lot
        Given load 'core features' stack data - 'initialize_e2e_core_features_stack'
        And 'Supply Manager' is logged in
        And I select study "qa_smoke_regression_teststudy1" only on the selector page
        When I am on the 'lots' page
        And I press the button with text 'Add a lot'
        Then verify the options in the lots location drop down is displayed
            | options                           |
            | Canada Depot - Canada             |
            | USDEP1 - United States of America |
            | USDEP1 - United States of America |
        And I am on the 'lots' page
        And I create lots
            | number     | description   | location | expiration  | kitType      | quantity | release | country | container    |
            | Bulk Lot 1 | Bulk Lot Desc | USDEP1   | 31-Dec-2030 | decaf,coffee | 1000     | true    | all     | Shipper Comp |
        #Test steps #4 - 6 tested in create lots step^ 
        And I create a sub lot for lot 'Bulk Lot 1'
            | lot        | supply        | quantity | release | email              | password  |
            | Bulk Lot 1 | coffee, decaf | 200      | true    | sup@4gclinical.com | QA4th!Gen |
        #Test steps #7 tested in create sub lots step^ 
        Then sub lot 'Bulk Lot 1_1' is displayed on the lots page