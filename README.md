# LIBP2P STREAM BROWSER DEMO

This repo represents an attempt to translate the [js-libp2p listener/dialer stream example](https://github.com/libp2p/js-libp2p/tree/master/examples/chat/src) into a browser environment.

This example is not yet working. Although it is possible to create a connection between the listener and dialer in the browser, the listener does not seem to receive (or handle) the `dialProtocol` request and thus no stream is created.

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.
