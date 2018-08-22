@user-login
Feature: User Login
    Prancer-4326 User Login
    TC-3360 AC Completed: AC1

    Scenario: User Login CSL
        Given that study 'qa_smoke_regression_teststudy1' is clean loaded
        And that study 'ta_patient_testdata1' is also loaded
        And 'CSL' is logged in
        Then the study dropdown with no study chosen is displayed
        And the study site dropdown with no site chosen is displayed
        And a disabled select button is displayed
        And a unchecked 'remember my choice' check box is displayed
        When I select study "qa_smoke_regression_teststudy1" only on the selector page
        Then the 'home' page is open
        And 'qa_smoke_regression_teststudy1' is shown in the header
        And the 'Study' dashboard is displayed
        And the 'Site' dashboard is displayed
        And the 'Supply' dashboard is displayed
        When I log out
        And 'CSL' is logged in
        And I select study "ta_patient_testdata1" and site "TA10002" on the selector page
        Then the 'home' page is open
        And 'ta_patient_testdata1 | TA10002 - TA Engineer2' is shown in the header

    Scenario: User login Study Coordinator
        Given 'Study Coordinator' is logged in
        Then the study dropdown with no study chosen is displayed
        And the study site dropdown with no site chosen is displayed
        And a unchecked 'remember my choice' check box is displayed
        And a disabled select button is displayed
        When I select study "qa_smoke_regression_teststudy1" only on the selector page
        Then the 'home' page is open
        And 'qa_smoke_regression_teststudy1' is shown in the header
        # validation for the study and study site displayed fails on jenkins due to window size on jenkins server
        And the 'Site' dashboard is displayed
        And the 'Study' dashboard is not displayed
        And the 'Supply' dashboard is not displayed

    Scenario: User login Supply Manager
        Given 'Supply Manager' is logged in
        Then the study dropdown with no study chosen is displayed
        And a unchecked 'remember my choice' check box is displayed
        And a disabled select button is displayed
        When I select study "qa_smoke_regression_teststudy1" only on the selector page
        Then the 'home' page is open
        And 'qa_smoke_regression_teststudy1' is shown in the header
        And the 'Supply' dashboard is displayed
        And the 'Study' dashboard is not displayed
        And the 'Site' dashboard is not displayed