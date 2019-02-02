[![Build Status](https://semaphoreci.com/api/v1/water-fountains/proximap/branches/develop/badge.svg)](https://semaphoreci.com/mmmatthew/proximap)

# ProxiMap

Proximap is a responsive web app written using Angular for finding nearby public infrastructure. Drinking fountains are used as a showcase example.
It is being developed in conjunction with [Datablue](https://github.com/water-fountains/datablue), a tool for collecting, aggregating, and serving
fountain data from Open Street Map, Wikidata, Wikimedia Commons, and Wikipedia. Check out [water-fountains.org](https://water-fountains.org)
for more information on the overall project, and [beta.water-fountains.org](https://beta.water-fountains.org) to see a beta version of the app!

## Supported cities
- Zurich (Data imported from https://data.stadt-zuerich.ch/dataset/brunnen to Wikidata)

## License
The project is open source under the GNU Affero General Public License, with a profit contribution agreement applying under restricted conditions. See [COPYING](/COPYING) for information.

# Running the project locally

*Proximap requires a backend server ([Datablue](https://github.com/water-fountains/datablue)) to be running in order to display fountains.*

1. Requirements (make sure these are up to date)
  - [NodeJS](https://nodejs.org) is a JavaScript runtime.
  - [Git](https://git-scm.com/) is a version control system.
  - [Angular CLI](https://cli.angular.io/) is a command line interface for Angular.
    - install Node first
    - Run `npm install -g @angular/cli` to install globally
2. Clone this repository to a local project directory
  - Run `git clone https://github.com/water-fountains/proximap.git -b develop`.
3. Open a command line in the local project directory
  - Install required node packages by running `npm install`
  - Launch the server by running `npm run start`. You can view the application by navigating to `http://localhost:4200/`. The app will automatically reload if you change any of the source files. 

# Testing
We use BrowserStack to test design concepts and user experience for iOS and Android devices.
[![BrowserStack logo](https://raw.githubusercontent.com/mmmatthew/proximap/master/docs/images/BrowserStack_Logo-01.png "BrowserStack")](http://browserstack.com/)

# Contributing

Submit an issue for a feature request, architecture suggestion, or to discuss a modification you have made or would like to make. 

If you would like to contribute directly to the code:
- fork this repo
- checkout the `develop` branch
- create a new branch `feature/[yourFeatureName]`
- make your changes and test them thoroughly
- make a pull request

To get ideas for how to contribute, see open issues.
