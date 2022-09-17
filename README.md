# Experimental pokemon game for educational purposes

### How to use

```
git clone https://github.com/AlexandrosDa007/pokemon-clone.git
```

## Prerequisites

- node
- npm
- Java
- Firebase project with Auth(email) and Realtime DB enabled

## Next step

- Create a `.env` file in the `server` directory and add these strings:

```
DATABASE_URL="<LOCAL_DATABASE_URL>"
FIREBASE_AUTH_EMULATOR_HOST="<LOCAL_AUTH_URL>"
```

- Download a `service-account` from Firebase and place in the `server` directory (must be named `service-account.json`)

- Change the firebaseConfig object in the `client/firebase.ts` file to reflect
  your own Firebase project (don't forget the local strings in the `connectDatabaseEmulator` and `connectAuthEmulator` functions)

- Change the `.firebaserc` file in the `root` directory of the project to reflect
  your own Firebase project

## Install dependencies in both `client` and `server` directories

```
npm i
```

## Run firebase locally
From the root project directory
```
firebase emulators:start
```

## Run server instance
From the `server` directory
```
npm run dev
```

## Run client instance
From the `client` directory
```
npm run serve
```