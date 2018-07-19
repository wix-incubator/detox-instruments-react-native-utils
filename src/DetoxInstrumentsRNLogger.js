class DetoxInstrumentsRNLogger {
  constructor() {
    this._customConsoleLog = this._customConsoleLog.bind(this);
    this._swizzleConsoleLog();
  }

  _swizzleConsoleLog() {
    this._origConsoleLog = console.log;
    console.log = this._customConsoleLog;
  }

  _canLogToDtxHook(args) {
    return global.dtxNativeLoggingHook && global.dtx_numberOfRecordings > 0 && !isCyclic(args);
  }

  _createLogLine(args) {
    let logLine = '';
    for (let i = 0; i < args.length; i++) {
      logLine += `${isString(args[i]) ? args[i] : JSON.stringify(args[i])}, `;
    }
    return logLine;
  }

  _customConsoleLog() {
    if(this._canLogToDtxHook(arguments)) {
      global.dtxNativeLoggingHook(arguments, this._createLogLine(arguments));
    } else {
      this._origConsoleLog.apply(this, arguments);
    }
  }
}

const isString = (value) => typeof value === 'string';

function isCyclic(obj) {
  const keys = [];
  const stack = [];
  const stackSet = new Set();
  let detected = false;

  function detect(obj, key) {
    if (typeof obj !== 'object') {
      return;
    }

    if (stackSet.has(obj)) { // it's cyclic!
      detected = true;
      return;
    }

    keys.push(key);
    stack.push(obj);
    stackSet.add(obj);

    for (let k in obj) { //dive on the object's children
      if (obj.hasOwnProperty(k)) {
        detect(obj[k], k);
      }
    }

    keys.pop();
    stack.pop();
    stackSet.delete(obj);
  }

  detect(obj, 'obj');
  return detected;
}

export default new DetoxInstrumentsRNLogger();