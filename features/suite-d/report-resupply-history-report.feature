@resupply-histort-report
# Created by rama at 6/21/18
Feature: Unblinded Resupply History Report
  PRANCER-4221 Resupply History Report
  TC-3155 except step 4 and 5-downloads part
  Test step 3: No data in forecasting run column

  Scenario: Unblinded resupply history report
      Given 'CSL' is logged in
      And I select study "qa_smoke_regression_teststudy1" only on the selector page
      When I am on the 'report' page
      Then the 'Resupply History' report is listed
      And the report description does have the unblinded label displayed
      When I open the 'Resupply History' report
      Then the 'Resupply History' report is visible and shows accurate data - 'test-data-resupply-history.csl.json'
      When I select resupply report '1'
      Then the 'Resupply Details' report is open for resupply '1'
      When I select the back button
      Then the 'Resupply History' report is visible and shows accurate data - 'test-data-resupply-history.csl.json'
      When I download CSV and PDF files for the report
      Then the pdf file 'Prancer - Resupply History-Unblinding' was downloaded successfully on chrome downloads
      And the csv file 'Prancer - Resupply History-Unblinding' was downloaded successfully on chrome downloads







