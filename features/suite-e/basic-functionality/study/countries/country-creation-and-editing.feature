@country-creation-and-editing
Feature: Country Creation and Editing
    Prancer-4505 Country Creation and Editing
    TC-3472 AC Completed: AC1

    Scenario: Country Creation and Editing
        Given load 'core features' stack data - 'initialize_e2e_core_features_stack'
        And 'CSL' is logged in
        And I select study "qa_smoke_regression_teststudy1" only on the selector page
        And I am on the 'add-country' page
        Then the add country page is displayed
        And I take a screenshot called "add-country-page-displayed.png"
        And I click button with text 'Next'
        Then the mandatory fields on the add country page will display red error messages
        And I take a screenshot called "error-messages-mandatory-fields.png"
        When I enter the following details for creating a country
            | Country        | Region | Forecasted Number of Sites | Forecasted Sites Activated per Month | Forecasted Patients per Site per Month | Screening cap | Randomization Cap | Country status | Screening Open? | Randomization Open? |
            | United Kingdom | Europe | 10                         | 2                                    | 6                                      | 50            | 20                | Closed         | Closed          | Closed              |
        And I click button with text 'Next'
        Then the add country review screen dispalys all the details
            | Details                                | Values         |
            | Country                                | United Kingdom |
            | Region                                 | Europe         |
            | Forecasted Number of Sites             | 10             |
            | Forecasted Sites Activated per Month   | 2              |
            | Forecasted Patients per Site per Month | 6              |
            | Screening cap                          | 50             |
            | Randomization Cap                      | 20             |
            | Country status                         | Closed         |
            | Screening Open?                        | Closed         |
            | Randomization Open?                    | Closed         |
        When I click the create country button
        Then a success message for creating a country 'United Kingdom' is displayed
        And I take a screenshot called "United-Kingdom-country-created-successfully.png"
        And I click button with text 'BACK TO COUNTRIES'
        Then country 'United Kingdom' is listed on the countries page
        And I take a screenshot called "United-Kingdom-country-displayed-on-countries-page.png"
        When I filter each column on the page
        Then each column filters
        When I sort each column on the page
        Then each column sorts
        And I click the 'screening open' switch for country 'United Kingdom'
        Then the screening open status for 'United Kingdom' is set to open
        When I click the 'randomize open' switch for country 'United Kingdom'
        Then the randomize open status for 'United Kingdom' is set to open
        And I take a screenshot called "screening-and-randomize-status-open.png"
        When I select country 'United Kingdom'
        And I enter the following details to update the country
           | Screening cap | Randomization Cap |
           |  40           |    10             |
        And I take a screenshot called "updated-United-Kingdom-details.png"
        And I click button with text 'Next'
        Then the edit country review screen dispalys all the details
            | Details                                | Values         |
            | Country                                | United Kingdom |
            | Region                                 | Europe         |
            | Forecasted Number of Sites             | 10             |
            | Forecasted Sites Activated per Month   | 2              |
            | Forecasted Patients per Site per Month | 6              |
            | Screening cap                          | 40             |
            | Randomization Cap                      | 10             |
            | Country status                         | Closed         |
            | Screening Open?                        | Open           |
            | Randomization Open?                    | Open           |
        And I take a screenshot called "United-Kingdom-details-displayed-review-page.png"
        When I click the edit country button
        Then a success message for updating country 'United Kingdom' is displayed
        And I take a screenshot called "United-Kingdom-successfully-updated.png"

         
