@lot-summary-report
Feature: Lot Summary Report
    Prancer-3506 Lot Summary Report
    TC-1541 AC Completed: AC1-AC3
    Requirements Completed:
        Prancer-664: AC1-AC3
        Prancer-2874
        Prancer-3226
        Prancer-3555: AC1-AC3

    @lsr-sup
    Scenario: Lot summary report Supply Manager
        Given 'Supply Manager' is logged in
        And I select study "qa_smoke_regression_teststudy1" only on the selector page
        When I am on the 'lots' page
        And I create lots
        | number | description | location | expiration | kitType | quantity | release | country |
        | LN1    | LD1         | USDEP1   | Tomorrow   | coffee  | 1        | true    | all     |
        | LN2    | LD2         | USDEP1   | Tomorrow   | coffee  | 1        | true    | none    |
        | LN3    | LD3         | USDEP1   | Tomorrow   | decaf   | 1        | false   | none    |
        And I open the 'Lot Summary Report' report
        Then the 'Lot Summary Report' report is visible and shows accurate data - 'test-data-lsr.sma.json'
        And 'Lot number' column contains links
        And 'Drug and Country Release Report' column contains links
        When I am on the 'lots' page
        And I create lots
        | number | description | location | expiration | kitType | quantity | release | country |
        | LN4    | LD4         | USDEP1   | Tomorrow   | decaf   | 500      | true    | all     |
        And I open the 'Lot Summary Report' report
        Then the 'Lot Summary Report' report is visible and shows accurate data - 'test-data-lsr.smb.json'
        When I select the 'Drug and Country Release Report' link
        Then the 'Drug and Country Release Report' report is open for lot '178887'
        When I select code 'LN1'
        Then lot number is not a link
        When I open the 'Lot Summary Report' report
        And I download CSV and PDF files for the report
        Then the pdf file 'Prancer - Lot Summary Report-Unblinding' was downloaded successfully on chrome downloads
        And the csv file 'Prancer - Lot Summary Report-Unblinding' was downloaded successfully on chrome downloads 
        When I select the '178887' lot number link
        Then the 'Lot Detail Report' report is open for lot '178887'
        When I select lot 'LN1'
        Then metadata does not contain a link
        # TODO: check for unblinding status (currently in another branch)
        When I am on the 'lots' page
        ## checks for 'Action' button IAW Prancer-2874
        Then the table shows accurate data - 'data-a'
        And actions dropdown does not contain 'Drug and Country'

    @lsr-sm
    Scenario: Lot summary report not visible to Study Manager
        Given 'Study Manager' is logged in
        When I select study "qa_smoke_regression_teststudy1" only on the selector page
        Then I cannot open the 'Lot Summary Report' report