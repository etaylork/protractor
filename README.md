End-to-end testing for Prancer.  This project uses Angular's Protractor to drive Selenium WebDriver.


Testing Framework Technologies
------------------------------

* Protractor
* Cucumber


Protractor Overview
-------------------
http://www.protractortest.org/#/infrastructure


Install
-------
From the e2e_tests folder, run:
```
sudo npm install -g protractor

sudo webdriver-manager update
```
This will install two command line tools, protractor and webdriver-manager. Try running protractor --version to make sure it's working.
<p>
Then install the project dependencies with:
```
sudo npm install
```
if you get an error regarding persmissions - start the command(s) with sudo like: sudo npm install -g protractor



To run e2e tests
----------------

Before you run a test, the webdriver needs to be running:


To start driver:
- webdriver-manager start

Ensure Prancer is running at the correct URL: ($PRANCER_HOST || http://prancer.4g.local)

<h4>Setting up Protractor build on PyCharm:</h4>
- TBD

<h4>To run tests from PyCharm:</h4>
- Select the Protractor build
- Use run or debug to start the tests

<h4>To run all tests from CLI: </h4>
```
gulp test
```
<h4>To run a specific test or a specific set of tests from CLI: </h4>
- Suite A
```
gulp test -a
```
- Suite A with reruns of failed tests
```
gulp test -a -r
```
- Suite A with features
```
gulp test -a <featureName>,<featureName>,<featureName>
```
- Suite B & C & D
```
gulp test -b -c -d
```
- Suite B & C & D with features
```
gulp test -b <featureName>,<featureName> -c <featureName>,<featureName> -d <featureName>,<featureName>
---
