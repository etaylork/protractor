@patient-status-by-event-change
Feature: Patient Status By Event Change
    Prancer-4236 Patient Status By Event Change
    TC-2503 AC Completed: AC1, AC2
    Prancer-4254 Patient Status As Defined In Study
    TC-2504 AC Completed: AC1

    @tc-2503-preconditions
    Scenario: TC-2503 preconditions
        Given that study 'ta_patient_testdata1' is clean loaded
        And 'Study Coordinator' is logged in
        And I select study "ta_patient_testdata1" and site "TA10001" on the selector page
        And I screen a patient

    @status-change-even-action
    Scenario: TC-2503 patient status change on system setting configuration and event action completion
        Given 'Study Coordinator' is logged in
        And I select study "ta_patient_testdata1" and site "TA10001" on the selector page
        When I am on the 'patient' page
        Then I see a list of patients
        And patient 'USTA10001001' is displayed in the list patients
        And the status of the patient is 'Registered'
        When I 'Randomize' for patient 'USTA10001001'
        Then I am redirected to the randomize review page
        When I select the next button
        Then I am redirected to the randomize re-authentication page
        When I enter valid credentials
        And I select the submit button
        Then I am redirected to the randomzie completion page
        And a randomize event completion message is displayed
        When I select the back to patients button
        Then I see a list of patients
        And the status of the patient is 'Enrolled'
        When I update the patient status on success for all treatment arms
            | event   | status |
            | dosing2 | Active |
        And I second dose patient 'USTA10001001'
        And I select the back to patients button
        Then the status of the patient is 'Active'
    
    @status-change-system-wides
    Scenario: TC-2503 patient status change by system wides
        Given I add new system wides to the site
            | name                   | value      |
            | initial_patient_status | Screened   |
            | enrolled_status        | Randomized |
        And 'Study Coordinator' is logged in
        And I select study "ta_patient_testdata1" and site "TA10001" on the selector page
        When I screen a patient
        Then patient 'USTA10001002' is displayed in the list patients
        And the status of the patient is 'Screened'
        When I randomize patient 'USTA10001002'
        Then the status of the patient is 'Randomized'
    
    @status-change-screen-failed
    Scenario: TC-2504 change patient status to screen failed
        Given that study 'ta_patient_testdata1' is clean loaded
        And 'admin' is logged in
        And I select study "ta_patient_testdata1" and site "TA10002" on the selector page
        When I screen a patient
        Then patient 'USTA10002001' is displayed in the list patients
        And the 'Screen Fail' action is displayed for the patient
        When I screen fail the patient for 'some reason'
        Then the status of the patient is 'Screen Failed'
        #TC-2504 Test Steps 3-5 being testing in scenario step "When I screen fail the patient for 'some reason'"