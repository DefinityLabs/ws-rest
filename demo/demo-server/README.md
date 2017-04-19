# REST Server Demo

This is a REST server demo application. It's a simple [express.js](https://expressjs.com) with a single REST endpoint.

## Start Server

To install the REST server demo, run:

```sh
npm install
```

To start the REST server demo, run:

```sh
npm start
```

It will start using `8080` port.

## Echo Service

There is only one endpoint in the server, it's an echo. This service will return the same :text param after a 300ms delay.

```
http://localhost:8080/echo/:text
```
