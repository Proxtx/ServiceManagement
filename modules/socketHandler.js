export let onConnect = [(socket) => {}];

export let onMessage = [
  (msg, socket) => {
    handleMessage(msg, socket);
  },
];

export let subscribeCheck = [];

const handleMessage = (msg, socket) => {
  let cmdChain = msg.split("$_$");
  if (cmdChain[0] == "subscribe") {
    subscribe(cmdChain, socket);
  } else if (cmdChain[0] == "confirm") {
    confirmSocket(cmdChain, socket);
  }
};

const subscribe = (cmdChain, socket) => {
  if (!subs[cmdChain[1]]) {
    subs[cmdChain[1]] = {};
  }
  if (!subs[cmdChain[1]][cmdChain[2]]) {
    subs[cmdChain[1]][cmdChain[2]] = [];
  }
  for (let i in subscribeCheck) {
    if (!subscribeCheck[i](cmdChain)) {
      return;
    }
  }
  subs[cmdChain[1]][cmdChain[2]].push({
    cmdChain: cmdChain,
    socket: socket,
  });
};

let awaitSocketConfirm = {};

const confirmSocket = (cmdChain, socket) => {
  delete awaitSocketConfirm[socket.id];
};

const deleteSocket = (socket) => {
  if (awaitSocketConfirm[socket.id]) {
    subs[awaitSocketConfirm[socket.id].module][
      awaitSocketConfirm[socket.id].key
    ].splice(awaitSocketConfirm[socket.id].index, 1);
    delete awaitSocketConfirm[socket.id];
  }
};

export const sendMessage = (module, key, index, msg) => {
  subs[module][key][index].socket.emit("message", msg);
  awaitSocketConfirm[subs[module][key][index].socket.id] = {
    module: module,
    key: key,
    index: index,
  };

  setTimeout(deleteSocket.bind({}, subs[module][key][index].socket), 10000);
};

export let subs = {};

export const init = (io) => {
  io = io;

  io.on("connect", (socket) => {
    for (let i in onConnect) {
      onConnect[i](socket);
    }
    socket.on(
      "message",
      function (msg) {
        for (let i in onMessage) {
          onMessage[i](msg, this.socket);
        }
      }.bind({ socket: socket })
    );
  });
};
