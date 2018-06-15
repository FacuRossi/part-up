# Part-up

[Join the conversation of the Platform Development tribe on Part-up](https://part-up.com/tribes/development/chat)

## Installation

* Clone this repository
* Ensure [meteor](https://www.meteor.com/install) & [node](https://nodejs.org/en/) are installed
* Copy the file `config/development/env.sh.dist` to `config/development/env.sh`
* Run `npm start` (in the root folder of the app)
* App running at: http://localhost:3000/
* If you want to contribute to Part-up please read [CONTRIBUTING.md](https://github.com/part-up/part-up/blob/master/CONTRIBUTING.md)

### Optional installation steps

* If you want to do something with an icon, be sure that [imagemagick](http://www.imagemagick.org/) is installed (OS X: `brew install imagemagick`).
* If you want developer credentials (for an AWS bucket / Social login etc..) install [ansible](https://valdhaus.co/writings/ansible-mac-osx/): `brew install ansible` and decrypt `config/development/env.sh-encrypted` to `config/development/env.sh`.

### Code formatting

We use [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/) for code formatting to maintain the same code style across the app.
Here's a `vscode Settings.json` example to make them work well together and will format the code on save:

```JSON
{
  "editor.detectIndentation": false,
  "editor.formatOnSave": true,
  "editor.insertSpaces": true,
  "editor.tabSize": 2,
  "eslint.autoFixOnSave": true,
  "files.eol": "\n",
  "files.trimTrailingWhitespace": true,
}
```

## Working with Meteor

All of our meteor code can be found in the `app` directory. In here we are working with local meteor packages inside the `packages` directory.

There are three main packages,

* **partup-client-base** _client helpers_;
* **partup-lib** _shared between client and server_;
* **partup-server** _server code_.

if you need to create a new package please check this [guide](https://themeteorchef.com/tutorials/writing-a-package)

### Frontend

The front-end consists of [blaze](http://blazejs.org/guide/introduction.html) templates of which many are a package itself, these start with `partup-client-`. Any functionality that is not directly tied to a template and can be seen as helper functionality lives in the `partup-client-base` package which is only exposed to the client.

<!-- #### Structure
We have four types of application parts: *layout*, *page*, *widget* and *small component*. The explanation below points out their uses. Grahpic: **app/packages/partup:client-pages/app** and for the modals **app/packages/partup:client-pages/modal**. -->

<!-- ### Layout
Layouts are the top-level templates. They can contain a header, current page placeholder and footer. The scss file should only contain header and footer positioning rules. The js file should keep track of the state of the template and handle navigation functionality. -->

#### Pages

We export all pages as a single package **_partup-client-pages_**. A page can contain components with page-specific functionality and make use of multiple widgets. A page, in fact, only represents a composition. Therefore, the scss file should only contain position defenitions of the inside components. Pages are directly bound to routes and should handle any navigation functionality. Pages are also responsible for handling state _(e.g. subscriptions)_ and pass handlers to components that live outside the page package.

#### Widgets

A widget only provides functionality to fulfill a single responsibility. They contain all the functionality required and don't depend on logic of on any other part of the application. Widgets may manage their own state in a limited way, where they should receive as much data as possible from the page they live in. Widgets are stand-alone packages. The scss file should only contain component composition rules.

#### Small components

The whole app is made up of small styled components. These components are not functional by themselves and only provide styling like buttons, inputs, titles, paragraphs and menus. Each component should be defined as a scss class prefixed with “pu-”, for example “pu-button”. Be aware not to define any styling dealing with the position of the component inside its parent or relative to its siblings.

### Backend

#### Schema

We use [SimpleSchema](https://github.com/aldeed/meteor-simple-schema) to define our data structure. The schema can be found in the `partup-lib` package, this is because the client also uses it for validation. Any rules about the model is defined here.

#### Collections

Collections in meteor are used both server and client side. However, the client should only read from these whilst the server uses these to query mongo. For this, we have created helper methods to be used by the server. Data returned from mongo will be transformed into a model, this model may also have extra functionality. When you need to access a collection from the client you first need to subscribe to it. We do this via **publications**, these can be found in `partup-server`.

#### Mutations

When a mutation of data needs to be stored on the server you can call a **meteor method**. In this we define every mutation allowed for a collection.

#### Routes

We have page routes for navigation in `partup-lib` and routes to send data via POST requests in `partup-server`.

## Application testing

Please take a look as this epic: https://github.com/part-up/part-up/issues/528
There is a specific chapter written about how to test a meteor application like part-up.com.

Refer to [CONTRIBUTING.md](https://github.com/part-up/part-up/blob/master/CONTRIBUTING.md#testing) for more information about the tests we write.

### Fixtures

We have fixture data to test part-up locally in `partup-server`.

* the following users are created automatically (all with password "user"):
  * user@example.com
  * john@example.com
  * judy@example.com
  * admin@example.com

### Unit and integration testing

`npm run test:watch`

### End to end test

`npm run test:e2e`

### Unit testing

`meteor run --test`

## DevOps

### Quick deployment

* `cd devops`
* `./devops provision <environment> all --tags=app` (provide the SHA hash of the commit to be deployed, make sure it is build by Jenkins upfront)

### MongoDB

* Connecting: `mongo "<host>/<database>" -u "<user>" -p "<password>"`
* Dumping: `mongodump "<host>" --db "<database>" -u "<user>" -p "<password>" -o \`date +%s\``
* Restoring: `mongorestore "<host>" --db "<database>" -u "<user>" -p "<password>"`
* Restoring Meteor LoginServiceConfiguration: `mongorestore "<host>" --db "<database>" -u "<user>" -p "<password>" -c "meteor_accounts_loginServiceConfiguration" <bson file from dump>`
* Emptying all Collections (run in mongo shell): `db.getCollectionNames().forEach(function(collectionName) { db[collectionName].remove({}); });`
* Make user (super)admin: `db.users.update({ '_id': '<insertuseridhere>' }, { $set: { 'roles': ['admin'] } })`
* Find faulty / wrongly uploaded pictures: `db.getCollection('cfs.images.filerecord').find({'copies':{$exists:false}})`
* Overwrite the language of a specific part-up: `db.getCollection('partups').find({'_id':'<<partupid>>'},{$set: {'language':'nl'}});`

<!--
## Required server environment variables

```
NODE_ENV
MONGO_URL
ROOT_URL
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_BUCKET_REGION
AWS_BUCKET_NAME
FACEBOOK_APP_ID
FACEBOOK_APP_SECRET
LINKEDIN_API_KEY
LINKEDIN_SECRET_KEY
TZ = Europe/Amsterdam
MAIL_URL
NEW_RELIC_LICENSE_KEY
NEW_RELIC_APP_NAME
NEW_RELIC_NO_CONFIG_FILE = true
KADIRA_APP_ID
KADIRA_APP_SECRET
METEOR_SETTINGS = {"public":{"analyticsSettings":{"Google Analytics":{"trackingId":""}}}}
GOOGLE_API_KEY
```
-->

## Data dumps

### Clean userdump

* regular mongo dump command
* unpack bson `for f in *.bson; do bsondump "$f" > "$f.json"; done`
* `cat users.bson.json | sed 's/accessToken" : "[^"]*"/accessToken" : ""/g' > users.bson-clean.json`
* `cat users.bson-clean.json | sed 's/hashedToken" : "[^"]*"/hashedToken" : ""/g' > users.bson-clean-2.json`
* `cat users.bson-clean-2.json | sed 's/bcrypt" : "[^"]*"/bcrypt" : ""/g' > users.bson-clean-3.json`
* `cat users.bson-clean-3.json | sed 's/token" : "[^"]*"/token" : ""/g' > users.bson-clean-4.json`

## Phraseapp translation

Add new keys using the i18n convention to the main locale [/part-up/app/i18n/phraseapp.en.i18n.json](https://github.com/part-up/part-up/blob/master/app/i18n/phraseapp.en.i18n.json) and commit them to your branch.

After merging the PR for your branch, [Ralph Boeije](https://github.com/ralphboeije) will import the new keys to [Phraseapp](https://phraseapp.com/accounts/part-up-com/projects/part-up-webapp/locales) and add the translations to the other locales.

## License

Copyright (C) 2017 Part-up

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. You can find it at [/part-up/LICENSE](https://github.com/part-up/part-up/blob/master/LICENSE)
and the supplement at [/part-up/License supplement](https://github.com/part-up/part-up/blob/master/License%20supplement)
