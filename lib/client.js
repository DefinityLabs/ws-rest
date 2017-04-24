const Promise = require('promise');
const shortId = require('shortid');

const WsRestClient = function() {
  let proxyUrl;
  let ws;

  let queue = {};

  let open = false;
  let lastSentMessageTime;
  let lastReceivedMessageTime;

  let autoClose = false;
  let closeConnectionAfter = 5000;
  let checkConnectionIdleEach = 1000;

  return {
    connect: function(url, options) {
      proxyUrl = url;

      if (options) {
        if (options.autoClose) {
          autoClose = options.autoClose;
        }
      }

      openConnection();
    },

    send: function(msg) {
      let messageId = shortId.generate();

      let promise = new Promise(function(resolve, reject){
        queue[messageId] = {
          resolve: resolve,
          reject: reject
        };
      });

      waitForSocketConnection(function(){
        lastSentMessageTime = new Date().getTime();
        ws.send(JSON.stringify({messageId: messageId, timestamp: new Date(), data: msg}));
      });

      return promise;
    },

    close: function() {
      ws.close();
    }
  };

  function openConnection() {
    open = true;

    ws = new WebSocket(proxyUrl);

    ws.onopen = function(){
      console.log('open socket: ' + proxyUrl);

      if (autoClose) {
        checkIfConnectionIsActive();
      }
    }
    ws.onmessage = function(e) {
      lastReceivedMessageTime = new Date().getTime();
      let json = JSON.parse(e.data);
      let promise = queue[json.messageId];

      delete queue[json.messageId];

      if (json.data) {
        promise.resolve(json.data);
      } else {
        promise.reject(json.error);
      }
    }
    ws.onclose = function(){
      open = false;
      console.log('close socket: ' + proxyUrl);
    }
  }

  function waitForSocketConnection(callback){
    if (!open) {
      openConnection();
    }
    setTimeout(function(){
      if (ws.readyState === WebSocket.OPEN) {
        if (callback !== undefined){
          callback();
        }
      } else {
        waitForSocketConnection(callback);
      }
    }, 5);
  }

  function checkIfConnectionIsActive() {
    if (!open) {
      return;
    }

    setTimeout(function(){
      let now = new Date().getTime();
      let diff;

      let shouldClose = false;

      if (lastSentMessageTime) {
        diff = now - lastSentMessageTime;
        if (diff > closeConnectionAfter) {
          shouldClose = true;
        }
      }

      if (lastReceivedMessageTime) {
        diff = now - lastReceivedMessageTime;
        if (diff > closeConnectionAfter) {
          shouldClose = true;
        }
      }

      if (shouldClose) {
        ws.close();
      } else {
        checkIfConnectionIsActive();
      }
    }, checkConnectionIdleEach);
  }

};

const wsRestClient = new WsRestClient();

module.exports = wsRestClient;
