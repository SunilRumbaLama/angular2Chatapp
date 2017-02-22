# NepalChatApp

DEMO: [NepalChatApp](https://chatapp-a9558.firebaseapp.com/)

Run `npm uninstall -g angular-cli` </br>
Run `npm cache clean`</br>
Run `npm install -g angular-cli@1.0.0-beta.21`</br>
Run `npm install` to install all the dependencies.</br>

Go to [FIREBASE](https://firebase.google.com/docs/web/setup), set up an account, create a project and get the keys that you need. It is really easy process. Go through the firebase docs.

## Create a project in firebase. Navigate to app/src/app.module.ts
export const firebaseConfig = { <br/>
  apiKey: 'yourapikey',<br/>
  authDomain: 'your authDomain',<br/>
  databaseURL: 'yourdatabaseurl',<br/>
  storageBucket: 'yourStorageBucket',<br/>
  messagingSenderId: 'yourid'<br/>
};<br/>

Changing the keys to your firebase application will get you up and running.

## Development server
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

