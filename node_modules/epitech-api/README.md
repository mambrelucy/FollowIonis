Nodejs-Epitech-API
==================

A small API to request Epitech's intranet using Nodejs

`npm install epitech-api --save`

## Usage


### Login

```

var EpitechAPIConnector = require("epitech-api").EpitechAPIConnector;

var connector = new EpitechAPIConnector("login_x", "passwordunix");

var callbackSuccess = function (jsonData) {
    console.log("User is connected");
};

var callbackFailure = function (error, response) {
    console.log("User is not connected");
};

connector.signIn(callbackSuccess, callbackFailure);
```

### Modules

Once logged in, you can get some informations about a specific module. You need to provide its `year`, its `codemodule` and its `codeinstance`.

```

var EpitechAPIConnector = require("epitech-api").EpitechAPIConnector;

var connector = new EpitechAPIConnector("login_x", "passwordunix");

connector.signIn(function () {
    connector.getModule("2013", "B-GPR-650", "FR-6-1", function (json) {
        console.log("Successfully get'd module");
    }, function (error, response) {
        console.log("Couldn't get module");
    });
}, function () {
    console.log("Cannot login");
});
```

### Activity meeting slots

Once logged in, you can get a complete dump of the meeting slots page for an activity.
You need to provide its `year`, its `codemodule`, its `codeinstance` and its `codeacti`.

```

var EpitechAPIConnector = require("epitech-api").EpitechAPIConnector;

var connector = new EpitechAPIConnector("login_x", "passwordunix");

connector.signIn(function () {
    connector.getMeetingSlots("2013", "B-GPR-650", "FR-6-1", "acti-122352", function (json) {
        console.log("Successfully get'd meeting slots");
    }, function (error, response) {
        console.log("Couldn't get meeting slots");
    });
}, function () {
    console.log("Cannot login");
});
```