@site-inventory-detail-report
Feature: Site Inventory Detail Report
    Prancer-3601 Site Inventory Details Report
    TC-1939 AC Completed:
        Supply Manager Role: AC1, AC2, AC2(1 - 3), AC4,
        Client Excellence: AC1, AC2, AC2(1 - 3), AC4, AC5
    Requirements Completed:
       Prancer-1838: AC3, AC5
       Prancer-1993: AC2-AC3

    @sid-sup
    Scenario: Site inventory detail report Supply Manager
        Given 'Supply Manager' is logged in
        And I select study "qa_smoke_regression_teststudy1" only on the selector page
        When I am on the 'report' page
        Then the 'Site Inventory Detail Report' report is listed
        And the report description does have the unblinded label displayed
        When I open the 'Site Inventory Detail Report' report
        Then the report is visible and shows no data
        When I select site 'S0015'
        Then the 'Site Inventory Detail Report' report is visible and shows required data - 'test-data-sid.sup_DI.json'
            | header       | metaData                  |
            | StudySite    | S0015 - Captain Cooper    |
            | Site Group   | Low                       |
            | Depot        | USDEP1 - Primary US Depot |
            | Country      | United States of America  |
            | Investigator | Captain Cooper            |
        When I filter each column in the report
        Then each column filters
        When I sort each column in the report
        Then each column sorts
        When I use the 'next' arrow to navigate to a different page
        Then I verify that I was navigated to a different page
        When I select site 'BE10003'
        And I download CSV and PDF files for the report    
        Then the pdf file 'Prancer - Site Inventory Detail Report-Unblinding' was downloaded successfully on chrome downloads
        And the csv file 'Prancer - Site Inventory Detail Report-Unblinding' was downloaded successfully on chrome downloads

    @sid-ce
    Scenario: Site invetory detail report Client Excellence
        Given 'Client Excellence' is logged in
        And I select study "qa_smoke_regression_teststudy1" only on the selector page
        When I am on the 'report' page
        Then the 'Site Inventory Detail Report' report is listed
        And the report description does not have the unblinded label displayed
        When I open the 'Site Inventory Detail Report' report
        Then the report is visible and shows no data
        When I select site 'S0015'
        Then the 'Site Inventory Detail Report' report is visible and shows required data - 'test-data-sid.ce_DI.json'
            | header       | metaData                  |
            | StudySite    | S0015 - Captain Cooper    |
            | Site Group   | Low                       |
            | Depot        | USDEP1 - Primary US Depot |
            | Country      | United States of America  |
            | Investigator | Captain Cooper            |
        When I download CSV and PDF files for the report
        Then the pdf file 'Prancer - Site Inventory Detail Report' was downloaded successfully on chrome downloads
        And the csv file 'Prancer - Site Inventory Detail Report' was downloaded successfully on chrome downloads