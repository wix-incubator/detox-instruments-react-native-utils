
class DetoxInstrumentsRNLogger {
  constructor() {
    this._customConsoleLog = this._customConsoleLog.bind(this);
    this._swizzleConsoleLog();
  }

  _swizzleConsoleLog() {
    this._origConsoleLog = console.log;
    console.log = this._customConsoleLog;
  }

  _customConsoleLog() {
    const firstArg = arguments[0];
    const isSingleStringArg = (arguments.length === 1 && isString(firstArg));
    const newArguments = isSingleStringArg ? [formatArg(firstArg)] :
                         Object.keys(arguments).map((arg, key) => formatArg(arguments[key]));
    this._origConsoleLog.apply(this, newArguments);
  }
}

const LOG_MARKER = '!@!';
const isString = (value) => typeof value === 'string';
const formatArg = (arg) => isString(arg) ? `${LOG_MARKER}${arg}${LOG_MARKER}` : `${LOG_MARKER}${JSON.stringify(arg)}${LOG_MARKER}`;

export default new DetoxInstrumentsRNLogger();
