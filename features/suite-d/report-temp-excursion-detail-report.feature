@temp-excursion-detail-report
Feature: Temperature Excursion Detail Report
    Prancer-3689 Temperature Excursion Detail Report
    TC-1942 AC Completed: AC1, AC2, AC3, AC4, AC5
    Need more data added to the temp excursion detail report 
    Requirements Completed:
        Prancer-1993: AC2-AC3
    
    @tedr-sup
    Scenario: Temperature excursion detail report Supply Manager
        Given 'Supply Manager' is logged in
        And I select study "qa_smoke_regression_teststudy1" only on the selector page
        When I am on the 'report' page
        Then the 'Temperature Excursion Detail Report' report is listed
        And the report description does have the unblinded label displayed
        When I open the 'Temperature Excursion Summary Report' report
        And I select temperature excursion ID '1'
        And the 'Temperature Excursion Detail Report' report is visible and shows required data - 'test-data-tedr.tbl1.json'
            | header                      | metaData |
            | Temperature Details         |          |
            | Maximum temperature         | N/A      |
            | Minimum temperature         | N/A      |
            | Duration above allowed temp | N/A      |
            | Duration below allowed temp | N/A      |
        When I filter each column in the report
        Then each column filters
        When I sort each column in the report
        Then each column sorts
        When I download CSV and PDF files for the report 
        Then the pdf file 'Prancer - Temperature Excursion Detail Report-Unblinding' was downloaded successfully on chrome downloads
        And the csv file 'Prancer - Temperature Excursion Detail Report-Unblinding' was downloaded successfully on chrome downloads

    @tedr-si
    Scenario: Temperature excursion detail report Principal Investigator
        Given 'Principal Investigator' is logged in
        And I select study "qa_smoke_regression_teststudy1" only on the selector page
        When I am on the 'report' page
        Then the 'Temperature Excursion Detail Report' report is listed
        And the report description does not have the unblinded label displayed
        When I open the 'Temperature Excursion Summary Report' report
        And I select temperature excursion ID '1'
        And the 'Temperature Excursion Detail Report' report is visible and shows required data - 'test-data-tedr.tbl1.json'
            | header                      | metaData |
            | Temperature Details         |          |
            | Maximum temperature         | N/A      |
            | Minimum temperature         | N/A      |
            | Duration above allowed temp | N/A      |
            | Duration below allowed temp | N/A      |
        When I download CSV and PDF files for the report
        Then the pdf file 'Prancer - Temperature Excursion Detail Report' was downloaded successfully on chrome downloads
        And the csv file 'Prancer - Temperature Excursion Detail Report' was downloaded successfully on chrome downloads
