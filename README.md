[![Gitter chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/proximap)

# ProxiMap

Proximap is a responsive web app for finding nearby public infrastructure, and uses drinking fountains as a showcase example.
It is being developed in conjunction with [Datablue](//github.com/mmmatthew/datablue), a tool for collecting and aggregating
data from open government data repositories and the Wikicommons websites. Check out [water-fountains.org](//water-fountains.org)
for more information on the overall project, and [beta.water-fountains.org](http://beta.water-fountains.org) to see the current beta!

The project is open source under the GNU Affero General Public License, with a profit contribution agreement applying under restricted conditions. See [COPYING](/COPYING) for information.

## Vision
![mockup preview](/docs/images/mockup-preview.png)

A mockup has been created with Figma to illustrate how proximap could look. See it [here](https://www.figma.com/proto/VtlRvM4aWOWYIEL2j7EcCeVk/water-fountains.org?scaling=contain&node-id=1%3A30). See the [roadmap](/docs/source/roadmap.rst) for planned milestones.

# Up and running

## Requirements
- NodeJS
- Angular CLI: after NodeJS is installed, open a command window and run `npm install -g @angular/cli`

## Get the files and dependencies

Clone this repository to your computer, open a command window in the directory you cloned to, change to the `code/` directory and run `npm install`.

## Launch a dev server

In the `code/` directory, open a command window and  run `ng serve` to launch a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build the project

Run `ng build` from the `code/` directory to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

# Contributing

Submit an issue for a feature request, architecture suggestion, or to discuss a modification you have made or would like to make. 

If you would like to contribute directly to the code, fork this repo and make a pull request.

To get ideas for how to contribute, check out the [roadmap](/docs/roadmap.md) or look for *TODO* comments in the code.
