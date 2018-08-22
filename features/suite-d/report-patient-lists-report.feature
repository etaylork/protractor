@patient-lists-report
Feature: Patient Lists Report
    Prancer-4183 Patient Lists Report
    TC-3161 Steps: 1-19, AC Completed: AC1(1-3), AC2(1-2)
    # Test step 20 is not being tested
    # Test step 11: cloning report in UI has a duplicate key error

    Scenario: Patient lists report qa_smoke_regression_teststudy1 for CSL
        Given 'CSL' is logged in
        And I select study "qa_smoke_regression_teststudy1" and site "S0015" on the selector page
        Then the 'Patient Lists' table is visible on the home page and shows required data - 'test-data-plr.S0015.json'
            | header                          | metaData |
            | Site status: Open               |          |
            | Active: 7                       |          |
            | In Screening:                   | 2        |
            | Total Screened to date / cap:   | 9 / 100  |
            | Screen failed:                  | 1        |
            | Total Randomized to date / cap: | 6 / 100  |
            | Completed:                      | 0        |
            | Discontinued:                   | 1        |
        When I am on the 'patient' page
        Then the 'Patient Lists' report is visible and shows required data - 'test-data-plr.S0015.json'
            | header                          | metaData |
            | Site status: Open               |          |
            | Active: 7                       |          |
            | In Screening:                   | 2        |
            | Total Screened to date / cap:   | 9 / 100  |
            | Screen failed:                  | 1        |
            | Total Randomized to date / cap: | 6 / 100  |
            | Completed:                      | 0        |
            | Discontinued:                   | 1        |
        And the title of the report is 'S0015 - Captain Cooper'
        When I select patient 'QASR0001' link
        Then the 'Patient Detail Report' report is open
        And 'QASR0001' is displayed in the header headline
        When I am on the 'patient' page
        And I screen a patient
        Then patient 'QASR0028' is displayed in the list patients
        And the return kit value shows as 'No action needed'
        When I randomize patient 'QASR0028'
        Then the return kit value shows as 'Return kit'
        When I choose the 'Replace Kit' action with table
            | reason | quantity |
            | Lost   | 5        |
        And I choose the 'Return Kit' action with table
            | reason | quantity |
            | Lost   | 5        |
        Then the return kit value shows as 'No action needed'

    Scenario: Patient lists report qa_smoke_regression_teststudy1 for Unblinded Investigator
        Given 'Principal Investigator' is logged in
        And I select study "qa_smoke_regression_teststudy1" and site "S0015" on the selector page
        When I am on the 'patient' page
        Then the 'Patient Lists' report is visible and shows required data - 'test-data-plr.S0015.json'
            | header                          | metaData |
            | Site status: Open               |          |
            | Active: 8                       |          |
            | In Screening:                   | 2        |
            | Total Screened to date / cap:   | 10 / 100 |
            | Screen failed:                  | 1        |
            | Total Randomized to date / cap: | 7 / 100  |
            | Completed:                      | 0        |
            | Discontinued:                   | 1        |
        When I select patient 'QASR0001' link
        Then the 'Patient Detail Report' report is open
        And 'QASR0001' is displayed in the header headline
        When I am on the 'patient' page
        Then I screen a patient

    Scenario: Patient lists report preconditions for ta_patient_dispense_titration
        Given 'admin' is logged in
        And I custom config the Patient Lists report for study 'ta_patient_dispense_titration'

    Scenario: Patient lists report ta_patient_dispense_titration for CSL
        Given 'CSL' is logged in
        And I select study "ta_patient_dispense_titration" and site "S0028" on the selector page
        When I screen a patient
        Then patient 'TT-0001' is displayed in the list patients
        And the custom title 'Patients List - TR4183' is displayed
        And the 'Patient Lists' report is visible and shows required data - 'test-data-plr.csl.S0028.json'
            | header                          | metaData |
            | Site status: Open               |          |
            | Active: 1                       |          |
            | In Screening:                   | 1        |
            | Total Screened to date / cap:   | 1 / 100  |
            | Screen failed:                  | 0        |
            | Total Randomized to date / cap: | 0 / 100  |
            | Completed:                      | 0        |
            | Discontinued:                   | 0        |
        #step tests that columns 'Subject' and 'Optional Events' are displayed
        When I randomize patient 'TT-0001'
        Then the 'Discontinue Patient' action is displayed for the patient
        And the 'Break Blind' action is displayed for the patient
        And I discontinue the patient

    Scenario: Patient lists report ta_patient_dispense_titration for Unblinded Investigator
        Given 'Principal Investigator' is logged in
        And I select study "ta_patient_dispense_titration" and site "S0028" on the selector page
        When I am on the 'patient' page
        And the 'Patient Lists' report is visible and shows required data - 'test-data-plr.si.S0028.json'
            | header                          | metaData |
            | Site status: Open               |          |
            | Active: 0                       |          |
            | In Screening:                   | 0        |
            | Total Screened to date / cap:   | 1 / 100  |
            | Screen failed:                  | 0        |
            | Total Randomized to date / cap: | 1 / 100  |
            | Completed:                      | 0        |
            | Discontinued:                   | 1        |
        When I select patient 'TT-0001' link
        Then the 'Patient Detail Report' report is open
        And 'TT-0001' is displayed in the header headline
        When I am on the 'patient' page
        Then I screen a patient

    Scenario: Clean reload for reports data
         Given load 'reports' stack data - 'initialize_e2e_reports_stack'