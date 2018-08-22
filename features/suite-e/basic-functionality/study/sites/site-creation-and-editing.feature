@site-creation-and-editing
Feature: Site Creation and Editing
    Prancer 4471 Site Creation and Editing
    TC-3373 AC Completed: N/A

    Scenario: Site creation and editing Study Manager
        Given load 'core features' stack data - 'initialize_e2e_core_features_stack'
        And 'Study Manager' is logged in
        And I select study "qa_smoke_regression_teststudy1" only on the selector page
        And I am on the 'add-site' page
        When I click button with text 'Next'
        Then the require fields are highlighted with error message
        And I take a screenshot called "required-fields-needed.png"
        When I enter the following details for the new site
            | StudySite | Investigator | Country                  | Time zone | Delivery Contact | Site Address | address 2 | address 3 | city   | state | zip code | Site Phone   | Shipping Address | Site status | Screening Open? | Randomization Open? | Screening cap | Randomization Cap | Site Monitor                    | Allow destruction on site? | Study protocol version | Utility Field |
            | S0015     | Mr.Jones     | United States of America |           | Mr.Smith         | 12 Milk st   | Block A   | Unit 2    | Boston | MA    | 02116    | 617-555-1212 | checked          | Open        | Open            | Open                | 5             | 5                 | Leon Sea (smon2@4gclinical.com) | checked                    | Protocol V1            | Choice D      |
            |           |              |                          |           |                  | 15 Milk st   | Block B   | Unit 3    | Boston | MA    | 02117    | 617-555-1213 |                  |             |                 |                     |               |                   |                                 |                            |                        |               |
        And I enter the following quantities for the site inventory caps
            | kit    | quantity |
            | coffee | 20       |
            | decaf  | 15       |
        And I click button with text 'Next'
        Then a error message is displayed stating site number already exists
        And a error message is displayed stating the time zone field is required
        And I take a screenshot called "errors-site-exists-and-time-zone-required.png"
        When I edit the details for the site
            | Details   | Values           |
            | StudySite | S0999            |
            | Time zone | America/New_York |
        And I click button with text 'Next'
        Then the create site review page displays the following details
            | Details                    | Values                                                                                        |
            | StudySite                  | S0999                                                                                         |
            | Investigator               | Mr.Jones                                                                                      |
            | Country                    | United States of America                                                                      |
            | Time zone                  | America/New_York                                                                              |
            | Delivery Contact           | Mr.Smith                                                                                      |
            | Site Address               | 12 Milk st , Block A , Unit 2 , Boston , MA , 02116 , United States of America , 617-555-1212 |
            | Site Phone                 | 617-555-1212                                                                                  |
            | Shipping Address           | 15 Milk st , Block B , Unit 3 , Boston , MA , 02117 , 617-555-1213                            |
            | Shipping Phone             | 617-555-1213                                                                                  |
            | Site status                | Open                                                                                          |
            | Screening Open?            | yes                                                                                           |
            | Randomization Open?        | yes                                                                                           |
            | Screening cap              | 5                                                                                             |
            | Randomization Cap          | 5                                                                                             |
            | Site Monitor               | Leon Sea (smon2@4gclinical.com)                                                               |
            | Allow destruction on site? | yes                                                                                           |
            | Study protocol version     | PV1                                                                                           |
            | Utility Field              | Choice D                                                                                      |
            | Bulk kits                  | coffe:20 , decaf:15                                                                           |
        When I click the create site button
        Then a success message for creating site 'S0999' is displayed
        And a warning message indicating not all monitors could be added is displayed
        And I take a screenshot called "site-S0999-created-successfully.png"
        When I am on the 'site' page
        And I filter the 'StudySite' column for 'S0999'
        Then the column filters
        When I clear all filters on the site page
        And I filter each column on the site page
        Then each column filters
        When I sort each column on the site page
        Then each column sorts
        When I log out
        And 'CSL' is logged in
        And I select study "qa_smoke_regression_teststudy1" only on the selector page
        And I am on the 'site' page
        And I select the study site 'S0017' link
        And I edit the details for the site
            | Details       | Values                            |
            | Time zone     | America/New_York                  |
            | Site Monitor  | Leon Sea (smon2@4gclinical.com)   |
            | Site Monitor  | James Smith (smon@4gclinical.com) |
            | Utility Field | Choice B                          |
        And I enter the following quantities for the site inventory caps
            | kit                     | quantity |
            | Tea - Earl Grey         | 2        |
            | Tea - English Breakfast | 3        |
        Then all kits are visible to the user on the edit site page
            | Kits                    |
            | decaf                   |
            | Coke                    |
            | RC                      |
            | reiterator-reA          |
            | refactorer-reB          |
            | Chocolate               |
            | Vanilla                 |
            | Mint                    |
            | aspirin                 |
            | Tea - Earl Grey         |
            | Tea - English Breakfast |
            | Pepsi                   |
            | coffee                  |
        And I take a screenshot called "edit-site-enter-details-page-S0017.png"
        When I click button with text 'Next'
        Then the edit site review page displays the following details
            | Details                    | Values                                                              |
            | StudySite                  | S0017                                                               |
            | Investigator               | Dixie                                                               |
            | Country                    | United States of America                                            |
            | Time zone                  | America/New_York                                                    |
            | Delivery Contact           | Site 017 Recipient                                                  |
            | Site Address               | 16 special avenue , Boston , MA , 12345 , United States of America  |
            | Site Phone                 | N/A                                                                 |
            | Shipping Address           | 16 special avenue , Boston , MA , 12345 , United States of America  |
            | Shipping Phone             | N/A                                                                 |
            | Site status                | Open                                                                |
            | Screening Open?            | yes                                                                 |
            | Randomization Open?        | yes                                                                 |
            | Screening cap              | 100                                                                 |
            | Randomization Cap          | 100                                                                 |
            | Site Monitor               | James Smith (smon@4gclinical.com) , Leon Sea (smon2@4gclinical.com) |
            | Allow destruction on site? | no                                                                  |
            | Study protocol version     | N/A                                                                 |
            | Utility Field              | Choice B                                                            |
            | Bulk kits                  | Tea - Earl Grey:2 , Tea - English Breakfast:3                       |
        And I take a screenshot called "edit-site-review-page-S0017.png"
        When I click the update site button
        Then a success message for updating site 'S0017' is displayed
        And I take a screenshot called "site-S0017-updated-successfully.png"
