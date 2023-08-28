# SYRC Bot

## Running the Bot On Your Computer

First, install dependencies by running:
```
npm install
```

Then, fill in the `DATABASE_URL` and the `TOKEN` inside the `.env` file.   

The `DATABASE_URL` is the url for the psql database. `TOKEN` is the discord bot token.


After that, you can start up the bot by running:
```
npm start
```

## CI/CD - Auto Deploy to Fly.io
Currently, this repo is set to auto deploy main to Fly.io every time a change is made to main. Be careful when merging it in! Because it is going straight to production.


## Running the Bot on Fly.io

NOTE: Fly.io changes how stuff works fairly often so it is possible that if you are reading this a while down the road, this may no longer apply to you. In that case, just read the docs and figure it out yourself.

First, make sure you have the Fly.io CLI installed: [https://fly.io/docs/hands-on/install-flyctl/](https://fly.io/docs/hands-on/install-flyctl/)


After that, navigate to the root directory of this project and run:

```
fly apps create
```

This will guide you through the creation process.


Once this is done, you will have to navigate to your dashboard on fly.io and go to your app's secrets tab. Inside there, you will have to add your `DATABASE_URL` and `TOKEN`. These should be the same as what you use when your run the bot locally on your own computer.


After that, simply run:
```
fly deploy
```

This will deploy the app. If everything goes well, you should have the app running on Fly.io.

## Psql Database
To run the app, you will need a running postgresql database instance. If you are looking for a free instance, [neon](https://neon.tech/) is not bad. Fly.io also has it's own psql database instance that you can setup and connect to.
