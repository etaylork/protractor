@site-inventory-summary-report
Feature: Site Inventory Summary Report
    Prancer-3503 Site Inventory Summary Report
    TC-1938 AC Completed for Prancer-252  AC1-AC7
    TC-1938 AC Completed for Prancer-2352 AC1-AC6
    Requirements Completed:
        Prancer-1816: AC1
        Prancer-1993: AC2-AC3
          
    @sisr-sup
    Scenario: Site inventory summary report Supply Manager
        Given 'Supply Manager' is logged in 
        And I select study "qa_smoke_regression_teststudy1" only on the selector page
        When I am on the 'report' page
        Then the 'Site Inventory Summary Report' report is listed
        And the report description does have the unblinded label displayed
        When I open the 'Site Inventory Summary Report' report
        Then the 'Site Inventory Summary Report' report is visible and shows accurate data - 'test-data-sisr.sup.json'
        When I select the back button 
        Then I am taken back to the reports lists  
        When I open the 'Site Inventory Summary Report' report
        And I select the study site 'BE10003' link
        Then the link opens the correct 'Site Inventory Detail Report'
        When I filter each column in the report
        Then each column filters
        When I sort each column in the report
        Then each column sorts
        When I download CSV and PDF files for the report     
        Then the pdf file 'Prancer - Site Inventory Summary Report-Unblinding' was downloaded successfully on chrome downloads
        And the csv file 'Prancer - Site Inventory Summary Report-Unblinding' was downloaded successfully on chrome downloads
    
    @sisr-ce
    Scenario: Site inventory summary report Client Excellence
        Given 'Client Excellence' is logged in 
        And I select study "qa_smoke_regression_teststudy1" only on the selector page
        When I am on the 'report' page
        Then the 'Site Inventory Summary Report' report is listed
        And the report description does not have the unblinded label displayed
        When I open the 'Site Inventory Summary Report' report
        Then the 'Site Inventory Summary Report' report is visible and shows accurate data - 'test-data-sisr.ce.json'
        When I select the back button 
        Then I am taken back to the reports lists
        When I open the 'Site Inventory Summary Report' report
        And I select the study site 'BE10003' link
        Then the link opens the correct 'Site Inventory Detail Report'
        When I configure the reports landscape to 'true'
        Then I log out 
        And 'Supply Manager' is logged in 
        And I select study "qa_smoke_regression_teststudy1" only on the selector page
        And I open the 'Site Inventory Summary Report' report
        And I download CSV and PDF files for the report
        Then the pdf file 'Prancer - Site Inventory Summary Report' was downloaded successfully on chrome downloads
        And the csv file 'Prancer - Site Inventory Summary Report' was downloaded successfully on chrome downloads