export class EventHandler {
  listeners = {};

  addEventListener = (type, callback) => {
    if (!this.listeners[type]) this.listeners[type] = [];
    this.listeners[type].push(callback);
    return callback;
  };

  removeEventListener = (type, listener) => {
    for (let i in this.listeners[type]) {
      if (this.listeners[type][i] == listener)
        this.listeners[type].splice(i, 1);
    }
  };

  getListeners = (type) => {
    if (this.listeners[type]) return this.listeners[type];
    return [];
  };

  evoke = function () {
    const args = [...arguments];
    const type = args.shift();
    for (let i of this.getListeners(type)) {
      if (!i(...args)) this.removeEventListener(type, i);
    }
  };
}
