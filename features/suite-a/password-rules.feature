@password-rules
Feature: Validate Password Restrictions

    Scenario: Validate password restrictions
        Given 'CSL' is logged in
        And I select study "ta_patient_testdata1" only on the selector page
        And I am on the 'profile' page and on the 'System Access' tab
        Then trying to change to an invalid password throws an error
        | new_password | old_password | screenshot_name  |       error_message       |
        |   87654321   |   QA4th!Gen  | password-rules-1 | New password is not valid |
        |   ABCDEFGH   |   QA4th!Gen  | password-rules-2 | New password is not valid |
        |   abcdefgh   |   QA4th!Gen  | password-rules-3 | New password is not valid |
        |   AbCdEfGh   |   QA4th!Gen  | password-rules-4 | New password is not valid |
        |   Ab1@Ab1    |   QA4th!Gen  | password-rules-5 | New password is not valid |
        Then trying to change to a valid password gives a confirmation message
        | new_password | old_password | screenshot_name  |     confirmation_message      |
        |   Ab1@Ab1@   |   QA4th!Gen  | password-rules-6 | System access details updated |
        |   QA4th!Gen  |   Ab1@Ab1@   | password-rules-7 | System access details updated |