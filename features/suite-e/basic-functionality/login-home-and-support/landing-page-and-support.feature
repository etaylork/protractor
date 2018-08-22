@landing-page-and-support
Feature: Landing Page And Support
    Prancer-4319 Landing Page And Support
    TC-3359 AC Completed: AC1

    Scenario: Landing page
        Given that study 'qa_smoke_regression_teststudy1' is clean loaded
        And I am on the 'login' page
        Then A header with client title 'XYZ BIO-PHARMA' is displayed
        And the support link is displayed
        And the sign in link is displayed
        And login page has a email and password text box displayed
        And has a submit button and a forgot password link displayed
        When I enter my email and password
        Then the page accepts login with valid credentials
        When I select study "qa_smoke_regression_teststudy1" only on the selector page
        Then these options are presented in the support drop down menu:
           | options                |
           | About                  |
           | Contact Support        |
           | Chat with Support      |
           | Co-Browse with Support |
        When I select the 'About' option from the support drop down menu
        Then I check that the about page has the right elements
        #TC-3359 test step 3: validation effort is tested on ^this step
        When I select the 'Contact Support' option from the support drop down menu
        Then I check that the contact support page has the right elements
        #TC-3359 test step 4: validation effort is tested on ^this step
        When I fill out the contact support form
            | sponsor | study                          | name      | role           | studySite | email                 | phoneNumber    | message           |
            | Client1 | qa_smoke_regression_teststudy1 | Rob Manny | Unblinded User | N/A       | tester@4gclinical.com | 1-781-489-3201 | Test message only |
        Then a confirmation message for the contact support form is displayed
        When I select link - '4G Clinical Help Center'
        Then a new browser window is open for the 4G Clinical Help Center page
        When I switch back to the prancer site browser window
        And I select the 'Chat with Support' option from the support drop down menu
        Then a live chat for support is open on a new browser window
        When I switch back to the prancer site browser window
        And I select the 'Co-Browse with Support' option from the support drop down menu
        Then A pop up window for Co-Browse with Support is displayed
        When I close the Co-Browse with Support pop up
        Then the Co-Browse with Support pop up is not displayed


