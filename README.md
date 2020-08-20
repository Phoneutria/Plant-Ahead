# Plant Ahead

Plant ahead is a mobile app for time management. 

Users can enter task information in our app. WHen they complete the task, they check it off a list and say how long it took, then receive a reward in the form of virtual growth points that can be spent to upgrade a virtual plant. The app also syncs with the user's Google Tasks account automatically. 

## Technical details

This app was built using Expo, and in its current form you will need Expo in order to run it. You will also need a Firebase account and the corresponding credential files. 

In order to start working with our files, first clone the repo. Then create a new folder named Credentials in the plantCalendar folder. 

Put your Firebase API key in a new file called firebaseApiKey.js in this folder. The file should read 

`export const firebaseApiKey = <your API key here>;`
  
Then, create two new files in the same directory called androidClientId.js and iosClientId.js. In each file, put 

`export const androidClientId = <your android ID here>;`
  
and

`export const iosClientId = <your ios ID here>;`

respectively. You can find the IDs in the configuration files you get when setting up Firebase to work with mobile apps; follow the instructions [here](https://firebase.google.com/docs/ios/setup). 

Then run 

`npm install` 

in the terminal in the directory of the plantCalendar folder on your machine.

To run the app, run

`expo start`

in a terminal in the plantCalendar directory. You will either need an emulator, or the Expo app installed on your phone, in order to run the software. 
