@site-detail-report
Feature: Site Detail Report
    Prancer-3315 Site Detail Report
    TC-1939 AC for PRANCER-1883: AC1, AC2, AC3, AC4 , AC5, AC6
    TC-1939 AC for PRANCER-2581: AC1, AC2, AC3

    @sdr-sm
    Scenario: Site detail report Study Manager
        Given 'Study Manager' is logged in
        And I select study "qa_smoke_regression_teststudy1" only on the selector page
        When I open the 'Site Detail Report' report
        Then the report is visible and shows no data
        When I select site 'S0015'
        Then the 'Site Detail Report' report is visible and shows required data - 'test-data-sdr.json'
            | header            | metaData                                                   |
            | Site              | S0015 - Captain Cooper                                     |
            | Address           | 14 special avenue , Boston , MA , United States of America |
            | Active            | 7                                                          |
            | Status            | Open                                                       |
            | Enrollment        | Low                                                        |
            | Screening cap     | 100                                                        |
            | Randomization Cap | 100                                                        |
            | In Screening      | 2                                                          |
            | Total Screened    | 9                                                          |
            | Screen Failed     | 1                                                          |
            | Randomized        | 6                                                          |
            | Completed         | 0                                                          |
            | Discontinued      | 1                                                          |
        And displays '9' patients
        When I filter each column in the report
        Then each column filters
        When I sort each column in the report
        Then each column sorts
        When I download CSV and PDF files for the report
        Then the pdf file 'Prancer - Site Detail Report' was downloaded successfully on chrome downloads
        And the csv file 'Prancer - Site Detail Report' was downloaded successfully on chrome downloads
        When I select patient 'QASR0001' link
        Then the 'Patient Detail Report' report is open for patient 'QASR0001'

    @sdr-pi
    Scenario: Site detail report Principal Investigator
        Given 'Principal Investigator' is logged in
        And I select study "qa_smoke_regression_teststudy1" only on the selector page
        When I open the 'Site Detail Report' report
        Then the report is visible and shows no data
        And 'Principal Investigator' has access to the sites that he or she is associated with only
        When I select site 'S0015'
        Then the 'Site Detail Report' report is visible and shows required data - 'test-data-sdr.json'
            | header            | metaData                                                   |
            | Site              | S0015 - Captain Cooper                                     |
            | Address           | 14 special avenue , Boston , MA , United States of America |
            | Active            | 7                                                          |
            | Status            | Open                                                       |
            | Enrollment        | Low                                                        |
            | Screening cap     | 100                                                        |
            | Randomization Cap | 100                                                        |
            | In Screening      | 2                                                          |
            | Total Screened    | 9                                                          |
            | Screen Failed     | 1                                                          |
            | Randomized        | 6                                                          |
            | Completed         | 0                                                          |
            | Discontinued      | 1                                                          |
        When I download CSV and PDF files for the report   
        Then the pdf file 'Prancer - Site Detail Report' was downloaded successfully on chrome downloads
        And the csv file 'Prancer - Site Detail Report' was downloaded successfully on chrome downloads

    @sdr-csl
    Scenario: Site detail report CSL
        Given 'CSL' is logged in
        And I select study "qa_smoke_regression_teststudy1" only on the selector page
        When I am on the 'report' page
        Then the 'Site Detail Report' report is listed
        And the report description does have the unblinded label displayed
        When I open the 'Site Detail Report' report
        Then the report is visible and shows no data
        When I select site 'S0015'
        Then the 'Site Detail Report' report is visible and shows required data - 'test-data-sdr.json'
            | header            | metaData                                                   |
            | Site              | S0015 - Captain Cooper                                     |
            | Address           | 14 special avenue , Boston , MA , United States of America |
            | Active            | 7                                                          |
            | Status            | Open                                                       |
            | Enrollment        | Low                                                        |
            | Screening cap     | 100                                                        |
            | Randomization Cap | 100                                                        |
            | In Screening      | 2                                                          |
            | Total Screened    | 9                                                          |
            | Screen Failed     | 1                                                          |
            | Randomized        | 6                                                          |
            | Completed         | 0                                                          |
            | Discontinued      | 1                                                          |
        And displays '9' patients
        When I download CSV and PDF files for the report
        Then the pdf file 'Prancer - Site Detail Report-Unblinding' was downloaded successfully on chrome downloads
        And the csv file 'Prancer - Site Detail Report-Unblinding' was downloaded successfully on chrome downloads
        When I select patient 'QASR0001' link
        Then the 'Patient Detail Report' report is open for patient 'QASR0001'
