[![Build Status](https://github.com/water-fountains/proximap/actions/workflows/build-ubuntu.yml/badge.svg)](https://github.com/water-fountains/proximap/actions/workflows/build-ubuntu.yml)

# ProxiMap

Proximap is a responsive web app written using Angular for finding nearby public infrastructure. Drinking fountains are used as a showcase example.
It is being developed in conjunction with [Datablue](https://github.com/water-fountains/datablue), a tool for collecting, aggregating, and serving
fountain data from Open Street Map, Wikidata, Wikimedia Commons, and Wikipedia. Check out the app at [water-fountains.org](https://water-fountains.org), or [beta.water-fountains.org](https://beta.water-fountains.org) to see a beta version of the app!

## Supported cities

- Zurich (Data imported from https://data.stadt-zuerich.ch/dataset/brunnen to Wikidata)
- Geneva
- Basel
- Lucerne
- Nidwalden
- New York
- Bergama (antique Pergamon near Izmir)
- Rome
- Hamburg
- Paris

To have a city added, create a git issue.

## License

The project is open source under the GNU Affero General Public License, with a profit contribution agreement applying under restricted conditions. See [COPYING](/COPYING) for information.

# Running the project locally

_Proximap requires a backend server ([Datablue](https://github.com/water-fountains/datablue)) to be running in order to display fountains._

1. Requirements (make sure these are up to date)

   - [NodeJS](https://nodejs.org) is a JavaScript runtime.
   - [Git](https://git-scm.com/) is a version control system you will need to have available as a command line executable on your path. A git integrated in your IDE will not be sufficient (and may cause issues).
   - Around 400-500MB of space on your disk. The project has development dependencies that are downloaded when you run `> npm install` (see point 3).
   - [Angular CLI](https://cli.angular.io/) is a command line interface for Angular.
     - install Node first
     - Run `> npm install -g @angular/cli` to install globally

2. Clone this repository to a local project directory. Checkout the `develop` branch to get all the latest features. The `stable` branch is updated at a less frequent interval to guarantee stability.

   - Run `> git clone https://github.com/water-fountains/proximap.git -b develop`.

3. Open a command line in the local project directory
   - Install required node packages by running `> npm install`. If you update the project with `> git pull`, be sure to run npm `> npm install` again to update all packages.
   - run `> npm run sync_datablue` to replicate the two constants files from datablue (the datablue server must be running)
   - Launch the server by running `` ~/git/proximap$ npm run start 2>&1 | tee npm_pm_`date +%y%m%d_%H%M%S`.log ``. You can view the application by navigating to <a href="http://localhost:4200" target="_blank" >http://localhost:4200</a>. The app will automatically reload if you change any of the source files.

# Testing

We use BrowserStack to test design concepts and user experience for iOS and Android devices.
[![BrowserStack logo](https://raw.githubusercontent.com/mmmatthew/proximap/master/docs/images/BrowserStack_Logo-01.png 'BrowserStack')](http://browserstack.com/)

# Diary

210502

- `ERROR in src/app/locations.ts(13,23): error TS2304: Cannot find name 'require'.`

  `declare var require: any` on the line before appears to be a quick and dirty fix

# Deployment

https://github.com/water-fountains/proximap/actions

# Contributing

Submit an issue for a feature request, architecture suggestion, or to discuss a modification you have made or would like to make.

If you would like to contribute directly to the code:

- fork this repo
- checkout the `develop` branch
- create a new branch `feature/[yourFeatureName]`
- make your changes and test them thoroughly
- run `npm run pr` (pr = pull request) before you commit which will format the source code and run the linter  
- make a pull request

To get ideas for how to contribute, see open issues.
