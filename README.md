# README #

[Autoclipping.com](https://autoclipping.com) Angular Bulk Clipping Client

This repository contains the source code of bulk clipping client
running at [Autoclipping.com](https://autoclipping.com)

Feel free to fork this project to use as a starting point for our own solutions using our [API](https://autoclipping.com/bulkapi) .

Requirements
=============
* Angular 7.0.0
* Node >= 8.9

Resources
=========
Development:

* Bugtracker: https://github.com/autoclipping/bulk-clipping-angular-client/issues

Environments:

* Test: TBD
* Live: TBD

Setup instructions
==================
* Clone repository
* Copy environment configs and modify values if needed
```
cp environment.example.ts environment.ts
cp environment.prod.example.ts environment.prod.ts
```
* Run install in the root folder
```
npm install
```
### For development ###

* To setup localhost
```
ng serve
```
* Open in browser
```
http://localhost:4200/
```
### For production ###

* To build as angular custom elements 
* Replace WEB_ROOT with the URL where the angular elements component will be hosted.
```
ng build --prod --deployUrl WEB_ROOT --aot --output-hashing none && node build-script.js
```
* Make contents of app folder available on URL specified in WEB_ROOT
* Put into any page with html tags and link global styles, replace API_URL and API_TOKEN with values specific to your use case.
```
<link rel="stylesheet" href="WEB_ROOT/styles.css">
<ac-root
    token="API_TOKEN"
    api-url="API_URL"
></ac-root>
<script src="WEB_ROOT/bulkclipping.js"></script>
```
Command reference
=================
* ``` npm install ``` Installs all packages defined in package.json to node_modules directory
* ``` ng build --prod --deployUrl WEB_ROOT --aot --output-hashing none && node build-script.js ``` 
Build as angular custom element, WEB_ROOT is the URL where static assets for the angular custom element are hosted.

Development workflow
====================
* Project structure and files must follow [common angular coding practices](https://angular.io/guide/styleguide) 
* [Cheatsheet for angular](https://angular.io/guide/cheatsheet)
* Each task/bugfix should be done in separate branch.
* All libraries in package.json must have fixed versions without wildcards

Branching strategy
------------------
[In depth explanation](http://nvie.com/posts/a-successful-git-branching-model/)

1. Until there has not been any releases, all developments are branched from `development` and merged to `development`.

2. With each release separate release branch should be created, e.g `release/0.1`. After first release there will 
be also two separate main branches: `development` and `master`. Release fixes should be branched from release branches,
developments from `development` branch. Final releases are merged into `master`, which is supposed to be the 
cleanest branch (farthest away from `development`).

Naming convention: 

* Feature branches (e.g. `feature/1234-image-bulk-resize`)
* Bugfixes (e.g. `bugfix/2134`) where number indicates on ticket in Redmine
