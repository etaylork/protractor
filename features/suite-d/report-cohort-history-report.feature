@cohort-history-report
Feature: Cohort History Report
    Prancer-3862 Cohort History Report
    TC-2085 AC Completed: AC1, AC2, AC3, AC4, AC5
    Requirements Completed:
        Prancer-2637: AC-5 - Cohort history record is saved for every edit or change
        Prancer-3973: bug fixed for new entries in cohort history report

    @chr-preconditions
    Scenario: Cohort history report preconditions
        Given that study 'cohortstudy1' is loaded
        And 'admin' is logged in
        And default features are added to 'CSL' user role for the Cohort History Report
        And default features are added to 'Study Manager' user role for the Cohort History Report
        And the values have been updated for 'cohort_1'

    @chr-csl
    Scenario: Cohort history report CSL
        Given 'CSL' is logged in
        And I select study "cohortstudy1" only on the selector page
        When I am on the 'report' page
        Then the 'Cohort History Report' report is listed
        And the report description does not have the unblinded label displayed
        When I open the 'Cohort History Report' report
        Then the report is visible and shows no data
        When I select cohort 'cohort_1'
        Then the 'Cohort History Report' report is visible and shows accurate data - 'test-data-chr.csl.json'
        When I download CSV and PDF files for the report
        Then the pdf file 'Prancer - Cohort History Report' was downloaded successfully on chrome downloads
        And the csv file 'Prancer - Cohort History Report' was downloaded successfully on chrome downloads

    @chr-sm
    Scenario: Cohort history report Study Manager
        Given 'Study Manager' is logged in
        And I select study "cohortstudy1" only on the selector page
        When I am on the 'report' page
        Then the 'Cohort History Report' report is listed
        And the report description does not have the unblinded label displayed
        When I open the 'Cohort History Report' report
        Then the report is visible and shows no data
        When I select cohort 'cohort_1'
        Then the 'Cohort History Report' report is visible and shows accurate data - 'test-data-chr.sm.json'
        When I download CSV and PDF files for the report
        Then the pdf file 'Prancer - Cohort History Report' was downloaded successfully on chrome downloads
        And the csv file 'Prancer - Cohort History Report' was downloaded successfully on chrome downloads

    @chr-preconditions-prancer-3973
    Scenario: Cohort history report preconditions for Prancer-3973
       Given 'CSL' is logged in
       And I select study "cohortstudy1" only on the selector page
       And I am on the 'cohorts' page
       When I update the rank field to '5' for 'cohort_1' in the UI

    @chr-prancer-3973
    Scenario Outline: Cohort history report bug fixed for Prancer-3973
    #Scenario: Bug is fixed and will pass unless bug comes back
    #Summary: when a single cohort is updated in the UI, cohort history report is creating new entry for all cohorts
        Given 'CSL' is logged in
        And I select study "cohortstudy1" only on the selector page
        When I open the 'Cohort History Report' report
        And I select cohort '<cohort>'
        Then a new entry has not been added to the table
        Examples:
        | cohort   |
        | cohort_2 |
        | cohort_3 |
        | cohort_4 |