@temp-excursion-metrics-report
Feature: Temperature Excursion Metrics Report
    Prancer-3725 Temperature Excursion Metrics Report
    TC-1910 AC Completed: AC1, AC2, AC3, AC4, AC5
    Test Step 11: depots on the y-axis and count of excursions are on the x-axis
    Requirements Completed:
        Prancer-1993: AC1-AC3
        Prancer-3813

    @temr-kit-table
    Scenario: Temperature excursion metrics report kit table
        Given 'CSL' is logged in
        And I select study "qa_smoke_regression_teststudy1" only on the selector page
        When I am on the 'report' page
        Then the 'Temperature Excursion Metrics' report is listed
        And the report description is displayed
        And the report description does have the unblinded label displayed
        When I open the 'Temperature Excursion Metrics' report
        Then the 'Kit Type' table shows accurate data
        When I filter the 'Reporting Method' for all options in the drop down menu
        Then the data updates accordingly
        And the bar chart updates accordingly
        When I filter the 'Excursion Status' for all options in the drop down menu
        Then the data updates accordingly
        And the bar chart updates accordingly
        When I hover over the bar chart
        Then a popup panel appears over the bar chart
        When I select the stacked radio button
        Then the width of the bar chart 'increases'
        When I select the grouped radio button
        Then the width of the bar chart 'decreases'

    @temr-location-table
    Scenario: Temperature excursion metrics report location table
        Given 'CSL' is logged in
        And I select study "qa_smoke_regression_teststudy1" only on the selector page
        When I open the 'Temperature Excursion Metrics' report
        Then the 'Location Type' table shows accurate data
        And the location bar graph displays accurate data
        When I filter the 'Reporting Method' for all options in the drop down menu
        Then the data updates accordingly
        Then the bar chart updates accordingly
        When I filter the 'Excursion Status' for all options in the drop down menu
        Then the data updates accordingly
        And the bar chart updates accordingly
        When I select depot 'USDEP1'
        Then the data updates accordingly
        And the bar chart updates accordingly
        And the 'Country' filter dropdown is displayed
        When I select 'US' for the 'Country' filter
        And I get the updated table and chart data
        Then the data updates accordingly
        And the bar chart updates accordingly
        # step 14: "location column now includes the locations related to that country"
        # tested in the: data updates accordingly step

    @temr-preconditions-over-time-chart
    Scenario: Preconditions over time chart
        Given 'admin' is logged in
        And I select study "qa_smoke_regression_teststudy1" only on the selector page
        And I am on the 'depot-excursion' page
        And I create a temp excursion for depot 'USDEP1'

    @temr-over-time-chart
    Scenario: Temperature excursion metrics report over time chart
        Given 'CSL' is logged in
        And I select study "qa_smoke_regression_teststudy1" only on the selector page
        When I open the 'Temperature Excursion Metrics' report
        Then the 'Over Time Type' table shows accurate data
        When I select 'Site' for the 'Reporting Method' filter
        Then the total amount of kits displayed on the Over Time Chart is '1'
        When I select 'Depot' for the 'Reporting Method' filter
        Then the total amount of kits displayed on the Over Time Chart is '1'
        When I select 'All' for the 'Reporting Method' filter
        And I select a radio button on the Over Time Chart
        Then the total amount of kits displayed on the Over Time Chart is '1'

    @temr-sm
    Scenario: Temperature excursion metrics report Study Manager
        Given 'Study Manager' is given feature access: 'report_temp_excursions_metrics'
        And 'Study Manager' is logged in
        And I select study "qa_smoke_regression_teststudy1" only on the selector page
        Then I cannot open the 'Temperature Excursion Metrics' report