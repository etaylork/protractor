@verify-patient-dupecheck
Feature: Patient Dupecheckstudy
    AC Completed: AC1, AC2, AC3, AC4, AC5, AC6, AC8

    @vpdc-preconditions-part1
    Scenario: Preconditions for study dupecheckstudy
        Given that study 'dupecheckstudy' is loaded
        And that study 'ta_patient_testdata15' is loaded
        And 'CSL' is logged in
        And I select study "dupecheckstudy" and site "TC10006" on the selector page
        And A duplicate check configuration is set for study 'dupecheckstudy'
        And I screen a patient born in 1995

    @vpdc-warning-levels
    Scenario Outline: Configure warning levels
        Given 'CSL' is logged in
        And I select study "dupecheckstudy" and site "S0101" on the selector page
        And the warning level is set to '<lvl>' in the dupe check configuration
        When I begin to screen a patient born in '1995'
        Then a warning message is '<displayed>' on the review section
        And the <button> is <visible> and <enabled> on the review section
        And I take a screenshot called "<name>"
        Examples:
            | lvl | displayed | visible | enabled | button | name         |
            | 0   | false     | true    | true    | yes    | no-warning   |
            | 1   | true      | true    | true    | submit | soft-warning |
            | 2   | true      | true    | true    | yes    | hard-warning |
            | 3   | true      | true    | false   | yes    | stop-warning |

    @vpdc-soft-site
    Scenario: Configure soft warn level and site check level
        Given 'CSL' is logged in
        And I select study "dupecheckstudy" and site "S0101" on the selector page
        And the check level is set to 'site' in the dupe check configuration
        When I begin to screen a patient born in '1995'
        Then a warning message is 'not displayed' on the review section
        And I select the study site 'TC10007' on the study-selector dialog
        And I begin to screen a patient born in '1995'
        Then a warning message is 'not displayed' on the review section
        And I select the study site 'TC10006' on the study-selector dialog
        And I begin to screen a patient born in '1995'
        Then a warning message is 'displayed' on the review section
        And I continue to screen the patient

    @vpdc-preconditions-part2
    Scenario: Preconditions for study ta_patient_testdata15
        Given 'CSL' is logged in
        And I select study "ta_patient_testdata15" and site "TA40001" on the selector page
        And A duplicate check configuration is set for study 'ta_patient_testdata15'
        And I screen a patient born in 2000

    @vpdc-all-studies
    Scenario: Configure check level to all studies
        Given 'CSL' is logged in
        And I select study "dupecheckstudy" and site "S0101" on the selector page
        And the check level is set to 'all_studies' in the dupe check configuration
        When I begin to screen a patient born in '2000'
        Then a warning message is 'displayed' on the review section

    @vpdc-country
    Scenario: Configure check level to country
        Given 'CSL' is logged in
        And I select study "dupecheckstudy" and site "S0101" on the selector page
        And the country is set to 'CA' and the check level is set to 'country' in the dupe check configuration
        When I begin to screen a patient born in '2000'
        Then a warning message is 'not displayed' on the review section

    @vpdc-masters-list
    Scenario: Add a masters check list
        Given 'CSL' is logged in
        And I select study "dupecheckstudy" and site "S0101" on the selector page
        And that a dupe masters check is added for study 'ta_patient_testdata15'
        And the check level is set to 'master_list' in the dupe check configuration
        When I begin to screen a patient born in '2000'
        Then a warning message is 'displayed' on the review section
        And I continue to screen the patient

    @vpdc-regions
    Scenario: Configure region site
        Given 'CSL' is logged in
        And I select study "dupecheckstudy" and site "S0101" on the selector page
        And I add a region called 'Region1' in the dupe check configuration
        And the region is set to 'Region1' and the check level is set to 'site' in the dupe check configuration
        When I begin to screen a patient born in '2000'
        Then a warning message is 'not displayed' on the review section
        Given I select the study site 'TC10006' on the study-selector dialog
        And I begin to screen a patient born in '1995'
        Then a warning message is 'displayed' on the review section

    @vpdc-glossary
    Scenario: Configure glossary details
        Given 'CSL' is logged in
        And I change the detail text in the glossary for 'DUPE_PATIENT_SOFT_WARNING_WITH_ID'
        And the check level is set to 'site' in the dupe check configuration
        And I select study "dupecheckstudy" and site "S0101" on the selector page
        When I begin to screen a patient born in '2000'
        Then a warning message is 'displayed' on the review section