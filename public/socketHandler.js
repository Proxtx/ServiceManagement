class socketHandler {
  socket;
  init = () => {
    this.socket = io();
  };

  onMessage = [];

  enabled = true;

  subscribe = function (service) {
    let argsString = "";
    for (let i = 1; i < arguments.length; i++) {
      argsString += "$_$" + arguments[i];
    }
    this.socket.emit("message", "subscribe$_$" + service + argsString);

    this.socket.on(
      "message",
      function (msg) {
        if (!this.this.enabled) return;
        for (let i in this.this.onMessage) {
          let f = this.this.onMessage[i].bind(this.this);
          f(msg);
        }

        this.socket.emit("message", "confirm");
      }.bind({ this: this, socket: this.socket })
    );
  };
}
