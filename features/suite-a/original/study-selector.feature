@study-selector
Feature: Validate Study-Selector
    displays when selected
    contains all required elements
    able to change studies
    ablt to goto studies

    Scenario: Validate the study-selector
        #Given that study 'e2e_study_01' is loaded by admin
        #And that study 'e2e_study_02' is also loaded by admin
        Given 'admin' is logged in
        And I am on the 'selector' page
        And I select study "e2e_study_01" and site "101" on the selector page
        When I open the study-selector dialog
        Then the study-selector dialog is displayed
        When I close the study-selector dialog
        Then the study-selector dialog is not present
        When I open the study-selector dialog
        Then the study-selector dialog is displayed
        Then the study-selector title is displayed
        And the study-selector study dropdown is displayed
        And the study-selector site dropdown is displayed
        And the study-selector remember checkbox is displayed
        And the study-selector select button is displayed
        And the study-selector cancel button is displayed
        When I select the study "e2e_study_01"
        Then study-selector dropdown shows study "e2e_study_01"
        When I select the study "e2e_study_02"
        Then study-selector dropdown shows study "e2e_study_02"
        When I select the study "e2e_study_01"
        Then study-selector dropdown shows study "e2e_study_01"
        