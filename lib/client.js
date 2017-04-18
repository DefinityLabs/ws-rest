const Promise = require('promise');
const shortId = require('shortid');

const WsRestClient = function() {
  let ws;
  let queue = {};

  return {
    connect: function(url) {
      ws = new WebSocket(url);
      ws.onopen = function(){
        console.log('open socket');
      }
      ws.onmessage = function(e) {
        let json = JSON.parse(e.data);
        let promise = queue[json.messageId];

        promise.resolve(json.data);
      }
      ws.onclose = function(){
        console.log('close socket');
      }
    },

    send: function(msg) {
      let messageId = shortId.generate();

      let promise = new Promise(function(resolve, reject){
        queue[messageId] = {
          resolve: resolve,
          reject: reject
        };
      });

      waitForSocketConnection(ws, function(){
        ws.send(JSON.stringify({messageId: messageId, timestamp: new Date(), data: msg}));
      });

      return promise;
    },

    close: function() {
      ws.close();
    }
  };
};

function waitForSocketConnection(socket, callback){
  setTimeout(function(){
    if (socket.readyState === 1) {
      if (callback !== undefined){
        callback();
      }
    } else {
      waitForSocketConnection(socket, callback);
    }
  }, 5);
};

let wsRestClient = new WsRestClient();

module.exports = wsRestClient;
