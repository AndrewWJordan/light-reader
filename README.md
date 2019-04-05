# LightReader

LightReader is a Lighthouse utility that reads any number of JSON page audits, extracts the details of each failed audit and displays them.

# Features

  - Run individual page or whole/batch site audits  
  - See individual page and combined site scores
  - Displays failed tests and possible offending elements
  - Gathers URLs via the URL of your sitemap
  - Generates CSV of failed page results on page load


# Upcoming features
  - Dashboarding to track current and historical audit data
  - Batch site audits via sitemap URL

## Installation

LightReader requires [Node.js](https://nodejs.org/en/blog/release/v10.0.0/) v10+ to run.
Install the dependencies and devDependencies and start the server.

```sh
$ git clone [this project]
$ cd light-reader
$ npm install
```  

## How to run

Run in development with Nodemon logger
```
$ npm start
```  
Run normally
```
node server.js
```

## How it works

Place your Lighthouse JSON audit files in the ```reports/``` directory.  Start up the application and hit ```/results``` page.  LightReader will loop through each report's JSON and return a list of all the pages that scored below 100%.  It will extract the overall site's score, the individual page scores and details as to which elements may have caused the violation.  Make your chages on your site and rerun the report from that page.

A CSV file is generated in the root directory of the project. This functionality resides within the ```controllers/reports.js``` file. 
