## how to use

This app is built on ionic (http://ionicframework.com). Steps:

1. Install node.js
2. npm install -g ionic cordova
3. From the root directory, run ionic serve. It should open the app in a web browser. If it doesn't something's broken.

To compile for mobile:

Install apache ant through homebrew (http://brew.sh)

`brew install ant`

Also make sure you have the android sdk from google.

then:

1. ionic platform add [device]
2. Run:
    - on a real phone: ionic build [device]
    - in an emulator: ionic emulate [device]

Where [device] is one of ios or android.

