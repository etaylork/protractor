@temp-monitoring-detail-report
Feature: Temperature Monitoring Detail Report
    Prancer-3783: Temperature Monitoring Details Report
    TC-2203 AC Completed: AC1, AC2, AC3(partially), AC4
    sm user: needs excursion id that has reporting method shipment

    @tmdr-sm
    Scenario: Temperature monitoring detail report Supply Manager
        Given 'Supply Manager' is logged in
        And I select study "qa_smoke_regression_teststudy1" only on the selector page
        When I am on the 'report' page
        Then the 'Temperature Monitoring Details Report' report is listed
        And the report description does have the unblinded label displayed
        And I select study "qa_smoke_regression_teststudy1" only on the selector page
        When I open the 'Temperature Monitoring Summary Report' report
        And I select temperature excursion ID 'Excursion 1'
        Then the 'Temperature Monitoring Details Report' report is visible and shows required data - 'test-data-tmdr.tbl1.json'
            | header                      | metaData |
            | Temperature Details         |          |
            | Maximum temperature         | N/A      |
            | Minimum temperature         | N/A      |
            | Duration above allowed temp | N/A      |
            | Duration below allowed temp | N/A      |
            | Date excursion started      | N/A      |
            | Date excursion ended        | N/A      |
        When I filter each column in the report
        Then each column filters
        When I sort each column in the report
        Then each column sorts
        When I download CSV and PDF files for the report
        Then the pdf file 'Prancer - Temperature Monitoring Details Report-Unblinding' was downloaded successfully on chrome downloads
        And the csv file 'Prancer - Temperature Monitoring Details Report-Unblinding' was downloaded successfully on chrome downloads

    @tmdr-si
    Scenario: Temperature monitoring detail report for Principal Investigator
        Given 'Principal Investigator' is logged in
        And I select study "qa_smoke_regression_teststudy1" only on the selector page
        When I am on the 'report' page
        Then the 'Temperature Monitoring Details Report' report is listed
        And the report description does not have the unblinded label displayed
        When I open the 'Temperature Monitoring Summary Report' report
        And I select temperature excursion ID 'Excursion 1'
        Then the 'Temperature Monitoring Details Report' report is visible and shows required data - 'test-data-tmdr.tbl1.json'
            | header                      | metaData |
            | Temperature Details         |          |
            | Maximum temperature         | N/A      |
            | Minimum temperature         | N/A      |
            | Duration above allowed temp | N/A      |
            | Duration below allowed temp | N/A      |
            | Date excursion started      | N/A      |
            | Date excursion ended        | N/A      |
        And I set values to 'false' in the pooling group temp config
        When I download CSV and PDF files for the report
        Then the pdf file 'Prancer - Temperature Monitoring Details Report' was downloaded successfully on chrome downloads
        And the csv file 'Prancer - Temperature Monitoring Details Report' was downloaded successfully on chrome downloads

    @tmdr-temp-config
    Scenario: Temperature monitoring detail report temperature configuration update
        Given 'Supply Manager' is logged in
        And I select study "qa_smoke_regression_teststudy1" only on the selector page
        When I am on the 'report' page
        Then the 'Temperature Monitoring Details Report' report is listed
        And the report description does have the unblinded label displayed
        When I open the 'Temperature Monitoring Summary Report' report
        And I select temperature excursion ID 'Excursion 1'
        Then the 'Temperature Monitoring Details Report' report is visible and shows required data - 'test-data-tmdr.tbl1.json'
            | header                      | metaData |
            | Temperature Details         |          |
            | Maximum temperature         | N/A      |
            | Duration above allowed temp | N/A      |
            | Date excursion started      | N/A      |
        And I set values to 'default' in the pooling group temp config