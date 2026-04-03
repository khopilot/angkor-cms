globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as commonjsRequire } from "./_commonjs-dynamic-modules_M7DZyzCw.mjs";
import require$$0 from "fs";
import require$$1 from "path";
import require$$2 from "util";
import { s as sql } from "./sql_DV5B95Nm.mjs";
import { u as ulid, m as monotonicFactory } from "./index_BQQDygAS.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
import { K as Kysely } from "./kysely_0Asa_Yyn.mjs";
import { m as mime } from "./index_lite_CWDp5SAU.mjs";
import { i as imageSize } from "./index_DFnuKuIX.mjs";
import { s as sax, g as gutenbergToPortableText } from "./index_CME59BVZ.mjs";
import { o as object, n as number, f as boolean, d as _enum, s as string, c as array, u as union, e as discriminatedUnion, l as literal, r as record, t as unknown, w as lazy, v as any } from "./sequence_DzjOVBrG.mjs";
import { n as number$1, b as boolean$1 } from "./coerce_Db55XvBy.mjs";
var lib = { exports: {} };
var util = {};
var hasRequiredUtil;
function requireUtil() {
  if (hasRequiredUtil) return util;
  hasRequiredUtil = 1;
  util.getBooleanOption = (options, key) => {
    let value = false;
    if (key in options && typeof (value = options[key]) !== "boolean") {
      throw new TypeError(`Expected the "${key}" option to be a boolean`);
    }
    return value;
  };
  util.cppdb = /* @__PURE__ */ Symbol();
  util.inspect = /* @__PURE__ */ Symbol.for("nodejs.util.inspect.custom");
  return util;
}
var sqliteError;
var hasRequiredSqliteError;
function requireSqliteError() {
  if (hasRequiredSqliteError) return sqliteError;
  hasRequiredSqliteError = 1;
  const descriptor = { value: "SqliteError", writable: true, enumerable: false, configurable: true };
  function SqliteError(message, code) {
    if (new.target !== SqliteError) {
      return new SqliteError(message, code);
    }
    if (typeof code !== "string") {
      throw new TypeError("Expected second argument to be a string");
    }
    Error.call(this, message);
    descriptor.value = "" + message;
    Object.defineProperty(this, "message", descriptor);
    Error.captureStackTrace(this, SqliteError);
    this.code = code;
  }
  Object.setPrototypeOf(SqliteError, Error);
  Object.setPrototypeOf(SqliteError.prototype, Error.prototype);
  Object.defineProperty(SqliteError.prototype, "name", descriptor);
  sqliteError = SqliteError;
  return sqliteError;
}
var bindings = { exports: {} };
var fileUriToPath_1;
var hasRequiredFileUriToPath;
function requireFileUriToPath() {
  if (hasRequiredFileUriToPath) return fileUriToPath_1;
  hasRequiredFileUriToPath = 1;
  var sep = require$$1.sep || "/";
  fileUriToPath_1 = fileUriToPath;
  function fileUriToPath(uri) {
    if ("string" != typeof uri || uri.length <= 7 || "file://" != uri.substring(0, 7)) {
      throw new TypeError("must pass in a file:// URI to convert to a file path");
    }
    var rest = decodeURI(uri.substring(7));
    var firstSlash = rest.indexOf("/");
    var host = rest.substring(0, firstSlash);
    var path = rest.substring(firstSlash + 1);
    if ("localhost" == host) host = "";
    if (host) {
      host = sep + sep + host;
    }
    path = path.replace(/^(.+)\|/, "$1:");
    if (sep == "\\") {
      path = path.replace(/\//g, "\\");
    }
    if (/^.+\:/.test(path)) ;
    else {
      path = sep + path;
    }
    return host + path;
  }
  return fileUriToPath_1;
}
var hasRequiredBindings;
function requireBindings() {
  if (hasRequiredBindings) return bindings.exports;
  hasRequiredBindings = 1;
  (function(module, exports$1) {
    var fs = require$$0, path = require$$1, fileURLToPath = requireFileUriToPath(), join = path.join, dirname = path.dirname, exists = fs.accessSync && function(path2) {
      try {
        fs.accessSync(path2);
      } catch (e) {
        return false;
      }
      return true;
    } || fs.existsSync || path.existsSync, defaults = {
      arrow: process.env.NODE_BINDINGS_ARROW || " → ",
      compiled: process.env.NODE_BINDINGS_COMPILED_DIR || "compiled",
      platform: process.platform,
      arch: process.arch,
      nodePreGyp: "node-v" + process.versions.modules + "-" + process.platform + "-" + process.arch,
      version: process.versions.node,
      bindings: "bindings.node",
      try: [
        // node-gyp's linked version in the "build" dir
        ["module_root", "build", "bindings"],
        // node-waf and gyp_addon (a.k.a node-gyp)
        ["module_root", "build", "Debug", "bindings"],
        ["module_root", "build", "Release", "bindings"],
        // Debug files, for development (legacy behavior, remove for node v0.9)
        ["module_root", "out", "Debug", "bindings"],
        ["module_root", "Debug", "bindings"],
        // Release files, but manually compiled (legacy behavior, remove for node v0.9)
        ["module_root", "out", "Release", "bindings"],
        ["module_root", "Release", "bindings"],
        // Legacy from node-waf, node <= 0.4.x
        ["module_root", "build", "default", "bindings"],
        // Production "Release" buildtype binary (meh...)
        ["module_root", "compiled", "version", "platform", "arch", "bindings"],
        // node-qbs builds
        ["module_root", "addon-build", "release", "install-root", "bindings"],
        ["module_root", "addon-build", "debug", "install-root", "bindings"],
        ["module_root", "addon-build", "default", "install-root", "bindings"],
        // node-pre-gyp path ./lib/binding/{node_abi}-{platform}-{arch}
        ["module_root", "lib", "binding", "nodePreGyp", "bindings"]
      ]
    };
    function bindings2(opts) {
      if (typeof opts == "string") {
        opts = { bindings: opts };
      } else if (!opts) {
        opts = {};
      }
      Object.keys(defaults).map(function(i2) {
        if (!(i2 in opts)) opts[i2] = defaults[i2];
      });
      if (!opts.module_root) {
        opts.module_root = exports$1.getRoot(exports$1.getFileName());
      }
      if (path.extname(opts.bindings) != ".node") {
        opts.bindings += ".node";
      }
      var requireFunc = typeof __webpack_require__ === "function" ? __non_webpack_require__ : commonjsRequire;
      var tries = [], i = 0, l = opts.try.length, n, b2, err;
      for (; i < l; i++) {
        n = join.apply(
          null,
          opts.try[i].map(function(p2) {
            return opts[p2] || p2;
          })
        );
        tries.push(n);
        try {
          b2 = opts.path ? requireFunc.resolve(n) : requireFunc(n);
          if (!opts.path) {
            b2.path = n;
          }
          return b2;
        } catch (e) {
          if (e.code !== "MODULE_NOT_FOUND" && e.code !== "QUALIFIED_PATH_RESOLUTION_FAILED" && !/not find/i.test(e.message)) {
            throw e;
          }
        }
      }
      err = new Error(
        "Could not locate the bindings file. Tried:\n" + tries.map(function(a) {
          return opts.arrow + a;
        }).join("\n")
      );
      err.tries = tries;
      throw err;
    }
    module.exports = exports$1 = bindings2;
    exports$1.getFileName = function getFileName(calling_file) {
      var origPST = Error.prepareStackTrace, origSTL = Error.stackTraceLimit, dummy = {}, fileName;
      Error.stackTraceLimit = 10;
      Error.prepareStackTrace = function(e, st) {
        for (var i = 0, l = st.length; i < l; i++) {
          fileName = st[i].getFileName();
          if (fileName !== __filename) {
            if (calling_file) {
              if (fileName !== calling_file) {
                return;
              }
            } else {
              return;
            }
          }
        }
      };
      Error.captureStackTrace(dummy);
      dummy.stack;
      Error.prepareStackTrace = origPST;
      Error.stackTraceLimit = origSTL;
      var fileSchema = "file://";
      if (fileName.indexOf(fileSchema) === 0) {
        fileName = fileURLToPath(fileName);
      }
      return fileName;
    };
    exports$1.getRoot = function getRoot(file) {
      var dir = dirname(file), prev;
      while (true) {
        if (dir === ".") {
          dir = process.cwd();
        }
        if (exists(join(dir, "package.json")) || exists(join(dir, "node_modules"))) {
          return dir;
        }
        if (prev === dir) {
          throw new Error(
            'Could not find module root given file: "' + file + '". Do you have a `package.json` file? '
          );
        }
        prev = dir;
        dir = join(dir, "..");
      }
    };
  })(bindings, bindings.exports);
  return bindings.exports;
}
var wrappers = {};
var hasRequiredWrappers;
function requireWrappers() {
  if (hasRequiredWrappers) return wrappers;
  hasRequiredWrappers = 1;
  const { cppdb } = requireUtil();
  wrappers.prepare = function prepare(sql2) {
    return this[cppdb].prepare(sql2, this, false);
  };
  wrappers.exec = function exec(sql2) {
    this[cppdb].exec(sql2);
    return this;
  };
  wrappers.close = function close() {
    this[cppdb].close();
    return this;
  };
  wrappers.loadExtension = function loadExtension(...args) {
    this[cppdb].loadExtension(...args);
    return this;
  };
  wrappers.defaultSafeIntegers = function defaultSafeIntegers(...args) {
    this[cppdb].defaultSafeIntegers(...args);
    return this;
  };
  wrappers.unsafeMode = function unsafeMode(...args) {
    this[cppdb].unsafeMode(...args);
    return this;
  };
  wrappers.getters = {
    name: {
      get: function name() {
        return this[cppdb].name;
      },
      enumerable: true
    },
    open: {
      get: function open() {
        return this[cppdb].open;
      },
      enumerable: true
    },
    inTransaction: {
      get: function inTransaction() {
        return this[cppdb].inTransaction;
      },
      enumerable: true
    },
    readonly: {
      get: function readonly() {
        return this[cppdb].readonly;
      },
      enumerable: true
    },
    memory: {
      get: function memory() {
        return this[cppdb].memory;
      },
      enumerable: true
    }
  };
  return wrappers;
}
var transaction;
var hasRequiredTransaction;
function requireTransaction() {
  if (hasRequiredTransaction) return transaction;
  hasRequiredTransaction = 1;
  const { cppdb } = requireUtil();
  const controllers = /* @__PURE__ */ new WeakMap();
  transaction = function transaction2(fn) {
    if (typeof fn !== "function") throw new TypeError("Expected first argument to be a function");
    const db = this[cppdb];
    const controller = getController(db, this);
    const { apply } = Function.prototype;
    const properties = {
      default: { value: wrapTransaction(apply, fn, db, controller.default) },
      deferred: { value: wrapTransaction(apply, fn, db, controller.deferred) },
      immediate: { value: wrapTransaction(apply, fn, db, controller.immediate) },
      exclusive: { value: wrapTransaction(apply, fn, db, controller.exclusive) },
      database: { value: this, enumerable: true }
    };
    Object.defineProperties(properties.default.value, properties);
    Object.defineProperties(properties.deferred.value, properties);
    Object.defineProperties(properties.immediate.value, properties);
    Object.defineProperties(properties.exclusive.value, properties);
    return properties.default.value;
  };
  const getController = (db, self) => {
    let controller = controllers.get(db);
    if (!controller) {
      const shared = {
        commit: db.prepare("COMMIT", self, false),
        rollback: db.prepare("ROLLBACK", self, false),
        savepoint: db.prepare("SAVEPOINT `	_bs3.	`", self, false),
        release: db.prepare("RELEASE `	_bs3.	`", self, false),
        rollbackTo: db.prepare("ROLLBACK TO `	_bs3.	`", self, false)
      };
      controllers.set(db, controller = {
        default: Object.assign({ begin: db.prepare("BEGIN", self, false) }, shared),
        deferred: Object.assign({ begin: db.prepare("BEGIN DEFERRED", self, false) }, shared),
        immediate: Object.assign({ begin: db.prepare("BEGIN IMMEDIATE", self, false) }, shared),
        exclusive: Object.assign({ begin: db.prepare("BEGIN EXCLUSIVE", self, false) }, shared)
      });
    }
    return controller;
  };
  const wrapTransaction = (apply, fn, db, { begin, commit, rollback, savepoint, release, rollbackTo }) => function sqliteTransaction() {
    let before, after, undo;
    if (db.inTransaction) {
      before = savepoint;
      after = release;
      undo = rollbackTo;
    } else {
      before = begin;
      after = commit;
      undo = rollback;
    }
    before.run();
    try {
      const result = apply.call(fn, this, arguments);
      if (result && typeof result.then === "function") {
        throw new TypeError("Transaction function cannot return a promise");
      }
      after.run();
      return result;
    } catch (ex) {
      if (db.inTransaction) {
        undo.run();
        if (undo !== rollback) after.run();
      }
      throw ex;
    }
  };
  return transaction;
}
var pragma;
var hasRequiredPragma;
function requirePragma() {
  if (hasRequiredPragma) return pragma;
  hasRequiredPragma = 1;
  const { getBooleanOption, cppdb } = requireUtil();
  pragma = function pragma2(source, options) {
    if (options == null) options = {};
    if (typeof source !== "string") throw new TypeError("Expected first argument to be a string");
    if (typeof options !== "object") throw new TypeError("Expected second argument to be an options object");
    const simple = getBooleanOption(options, "simple");
    const stmt = this[cppdb].prepare(`PRAGMA ${source}`, this, true);
    return simple ? stmt.pluck().get() : stmt.all();
  };
  return pragma;
}
var backup;
var hasRequiredBackup;
function requireBackup() {
  if (hasRequiredBackup) return backup;
  hasRequiredBackup = 1;
  const fs = require$$0;
  const path = require$$1;
  const { promisify } = require$$2;
  const { cppdb } = requireUtil();
  const fsAccess = promisify(fs.access);
  backup = async function backup2(filename, options) {
    if (options == null) options = {};
    if (typeof filename !== "string") throw new TypeError("Expected first argument to be a string");
    if (typeof options !== "object") throw new TypeError("Expected second argument to be an options object");
    filename = filename.trim();
    const attachedName = "attached" in options ? options.attached : "main";
    const handler = "progress" in options ? options.progress : null;
    if (!filename) throw new TypeError("Backup filename cannot be an empty string");
    if (filename === ":memory:") throw new TypeError('Invalid backup filename ":memory:"');
    if (typeof attachedName !== "string") throw new TypeError('Expected the "attached" option to be a string');
    if (!attachedName) throw new TypeError('The "attached" option cannot be an empty string');
    if (handler != null && typeof handler !== "function") throw new TypeError('Expected the "progress" option to be a function');
    await fsAccess(path.dirname(filename)).catch(() => {
      throw new TypeError("Cannot save backup because the directory does not exist");
    });
    const isNewFile = await fsAccess(filename).then(() => false, () => true);
    return runBackup(this[cppdb].backup(this, attachedName, filename, isNewFile), handler || null);
  };
  const runBackup = (backup2, handler) => {
    let rate = 0;
    let useDefault = true;
    return new Promise((resolve, reject) => {
      setImmediate(function step() {
        try {
          const progress = backup2.transfer(rate);
          if (!progress.remainingPages) {
            backup2.close();
            resolve(progress);
            return;
          }
          if (useDefault) {
            useDefault = false;
            rate = 100;
          }
          if (handler) {
            const ret = handler(progress);
            if (ret !== void 0) {
              if (typeof ret === "number" && ret === ret) rate = Math.max(0, Math.min(2147483647, Math.round(ret)));
              else throw new TypeError("Expected progress callback to return a number or undefined");
            }
          }
          setImmediate(step);
        } catch (err) {
          backup2.close();
          reject(err);
        }
      });
    });
  };
  return backup;
}
var serialize;
var hasRequiredSerialize;
function requireSerialize() {
  if (hasRequiredSerialize) return serialize;
  hasRequiredSerialize = 1;
  const { cppdb } = requireUtil();
  serialize = function serialize2(options) {
    if (options == null) options = {};
    if (typeof options !== "object") throw new TypeError("Expected first argument to be an options object");
    const attachedName = "attached" in options ? options.attached : "main";
    if (typeof attachedName !== "string") throw new TypeError('Expected the "attached" option to be a string');
    if (!attachedName) throw new TypeError('The "attached" option cannot be an empty string');
    return this[cppdb].serialize(attachedName);
  };
  return serialize;
}
var _function;
var hasRequired_function;
function require_function() {
  if (hasRequired_function) return _function;
  hasRequired_function = 1;
  const { getBooleanOption, cppdb } = requireUtil();
  _function = function defineFunction(name, options, fn) {
    if (options == null) options = {};
    if (typeof options === "function") {
      fn = options;
      options = {};
    }
    if (typeof name !== "string") throw new TypeError("Expected first argument to be a string");
    if (typeof fn !== "function") throw new TypeError("Expected last argument to be a function");
    if (typeof options !== "object") throw new TypeError("Expected second argument to be an options object");
    if (!name) throw new TypeError("User-defined function name cannot be an empty string");
    const safeIntegers = "safeIntegers" in options ? +getBooleanOption(options, "safeIntegers") : 2;
    const deterministic = getBooleanOption(options, "deterministic");
    const directOnly = getBooleanOption(options, "directOnly");
    const varargs = getBooleanOption(options, "varargs");
    let argCount = -1;
    if (!varargs) {
      argCount = fn.length;
      if (!Number.isInteger(argCount) || argCount < 0) throw new TypeError("Expected function.length to be a positive integer");
      if (argCount > 100) throw new RangeError("User-defined functions cannot have more than 100 arguments");
    }
    this[cppdb].function(fn, name, argCount, safeIntegers, deterministic, directOnly);
    return this;
  };
  return _function;
}
var aggregate;
var hasRequiredAggregate;
function requireAggregate() {
  if (hasRequiredAggregate) return aggregate;
  hasRequiredAggregate = 1;
  const { getBooleanOption, cppdb } = requireUtil();
  aggregate = function defineAggregate(name, options) {
    if (typeof name !== "string") throw new TypeError("Expected first argument to be a string");
    if (typeof options !== "object" || options === null) throw new TypeError("Expected second argument to be an options object");
    if (!name) throw new TypeError("User-defined function name cannot be an empty string");
    const start = "start" in options ? options.start : null;
    const step = getFunctionOption(options, "step", true);
    const inverse = getFunctionOption(options, "inverse", false);
    const result = getFunctionOption(options, "result", false);
    const safeIntegers = "safeIntegers" in options ? +getBooleanOption(options, "safeIntegers") : 2;
    const deterministic = getBooleanOption(options, "deterministic");
    const directOnly = getBooleanOption(options, "directOnly");
    const varargs = getBooleanOption(options, "varargs");
    let argCount = -1;
    if (!varargs) {
      argCount = Math.max(getLength(step), inverse ? getLength(inverse) : 0);
      if (argCount > 0) argCount -= 1;
      if (argCount > 100) throw new RangeError("User-defined functions cannot have more than 100 arguments");
    }
    this[cppdb].aggregate(start, step, inverse, result, name, argCount, safeIntegers, deterministic, directOnly);
    return this;
  };
  const getFunctionOption = (options, key, required) => {
    const value = key in options ? options[key] : null;
    if (typeof value === "function") return value;
    if (value != null) throw new TypeError(`Expected the "${key}" option to be a function`);
    if (required) throw new TypeError(`Missing required option "${key}"`);
    return null;
  };
  const getLength = ({ length }) => {
    if (Number.isInteger(length) && length >= 0) return length;
    throw new TypeError("Expected function.length to be a positive integer");
  };
  return aggregate;
}
var table;
var hasRequiredTable;
function requireTable() {
  if (hasRequiredTable) return table;
  hasRequiredTable = 1;
  const { cppdb } = requireUtil();
  table = function defineTable(name, factory) {
    if (typeof name !== "string") throw new TypeError("Expected first argument to be a string");
    if (!name) throw new TypeError("Virtual table module name cannot be an empty string");
    let eponymous = false;
    if (typeof factory === "object" && factory !== null) {
      eponymous = true;
      factory = defer(parseTableDefinition(factory, "used", name));
    } else {
      if (typeof factory !== "function") throw new TypeError("Expected second argument to be a function or a table definition object");
      factory = wrapFactory(factory);
    }
    this[cppdb].table(factory, name, eponymous);
    return this;
  };
  function wrapFactory(factory) {
    return function virtualTableFactory(moduleName, databaseName, tableName, ...args) {
      const thisObject = {
        module: moduleName,
        database: databaseName,
        table: tableName
      };
      const def = apply.call(factory, thisObject, args);
      if (typeof def !== "object" || def === null) {
        throw new TypeError(`Virtual table module "${moduleName}" did not return a table definition object`);
      }
      return parseTableDefinition(def, "returned", moduleName);
    };
  }
  function parseTableDefinition(def, verb, moduleName) {
    if (!hasOwnProperty.call(def, "rows")) {
      throw new TypeError(`Virtual table module "${moduleName}" ${verb} a table definition without a "rows" property`);
    }
    if (!hasOwnProperty.call(def, "columns")) {
      throw new TypeError(`Virtual table module "${moduleName}" ${verb} a table definition without a "columns" property`);
    }
    const rows = def.rows;
    if (typeof rows !== "function" || Object.getPrototypeOf(rows) !== GeneratorFunctionPrototype) {
      throw new TypeError(`Virtual table module "${moduleName}" ${verb} a table definition with an invalid "rows" property (should be a generator function)`);
    }
    let columns = def.columns;
    if (!Array.isArray(columns) || !(columns = [...columns]).every((x2) => typeof x2 === "string")) {
      throw new TypeError(`Virtual table module "${moduleName}" ${verb} a table definition with an invalid "columns" property (should be an array of strings)`);
    }
    if (columns.length !== new Set(columns).size) {
      throw new TypeError(`Virtual table module "${moduleName}" ${verb} a table definition with duplicate column names`);
    }
    if (!columns.length) {
      throw new RangeError(`Virtual table module "${moduleName}" ${verb} a table definition with zero columns`);
    }
    let parameters;
    if (hasOwnProperty.call(def, "parameters")) {
      parameters = def.parameters;
      if (!Array.isArray(parameters) || !(parameters = [...parameters]).every((x2) => typeof x2 === "string")) {
        throw new TypeError(`Virtual table module "${moduleName}" ${verb} a table definition with an invalid "parameters" property (should be an array of strings)`);
      }
    } else {
      parameters = inferParameters(rows);
    }
    if (parameters.length !== new Set(parameters).size) {
      throw new TypeError(`Virtual table module "${moduleName}" ${verb} a table definition with duplicate parameter names`);
    }
    if (parameters.length > 32) {
      throw new RangeError(`Virtual table module "${moduleName}" ${verb} a table definition with more than the maximum number of 32 parameters`);
    }
    for (const parameter of parameters) {
      if (columns.includes(parameter)) {
        throw new TypeError(`Virtual table module "${moduleName}" ${verb} a table definition with column "${parameter}" which was ambiguously defined as both a column and parameter`);
      }
    }
    let safeIntegers = 2;
    if (hasOwnProperty.call(def, "safeIntegers")) {
      const bool = def.safeIntegers;
      if (typeof bool !== "boolean") {
        throw new TypeError(`Virtual table module "${moduleName}" ${verb} a table definition with an invalid "safeIntegers" property (should be a boolean)`);
      }
      safeIntegers = +bool;
    }
    let directOnly = false;
    if (hasOwnProperty.call(def, "directOnly")) {
      directOnly = def.directOnly;
      if (typeof directOnly !== "boolean") {
        throw new TypeError(`Virtual table module "${moduleName}" ${verb} a table definition with an invalid "directOnly" property (should be a boolean)`);
      }
    }
    const columnDefinitions = [
      ...parameters.map(identifier).map((str) => `${str} HIDDEN`),
      ...columns.map(identifier)
    ];
    return [
      `CREATE TABLE x(${columnDefinitions.join(", ")});`,
      wrapGenerator(rows, new Map(columns.map((x2, i) => [x2, parameters.length + i])), moduleName),
      parameters,
      safeIntegers,
      directOnly
    ];
  }
  function wrapGenerator(generator, columnMap, moduleName) {
    return function* virtualTable(...args) {
      const output = args.map((x2) => Buffer.isBuffer(x2) ? Buffer.from(x2) : x2);
      for (let i = 0; i < columnMap.size; ++i) {
        output.push(null);
      }
      for (const row of generator(...args)) {
        if (Array.isArray(row)) {
          extractRowArray(row, output, columnMap.size, moduleName);
          yield output;
        } else if (typeof row === "object" && row !== null) {
          extractRowObject(row, output, columnMap, moduleName);
          yield output;
        } else {
          throw new TypeError(`Virtual table module "${moduleName}" yielded something that isn't a valid row object`);
        }
      }
    };
  }
  function extractRowArray(row, output, columnCount, moduleName) {
    if (row.length !== columnCount) {
      throw new TypeError(`Virtual table module "${moduleName}" yielded a row with an incorrect number of columns`);
    }
    const offset = output.length - columnCount;
    for (let i = 0; i < columnCount; ++i) {
      output[i + offset] = row[i];
    }
  }
  function extractRowObject(row, output, columnMap, moduleName) {
    let count = 0;
    for (const key of Object.keys(row)) {
      const index = columnMap.get(key);
      if (index === void 0) {
        throw new TypeError(`Virtual table module "${moduleName}" yielded a row with an undeclared column "${key}"`);
      }
      output[index] = row[key];
      count += 1;
    }
    if (count !== columnMap.size) {
      throw new TypeError(`Virtual table module "${moduleName}" yielded a row with missing columns`);
    }
  }
  function inferParameters({ length }) {
    if (!Number.isInteger(length) || length < 0) {
      throw new TypeError("Expected function.length to be a positive integer");
    }
    const params = [];
    for (let i = 0; i < length; ++i) {
      params.push(`$${i + 1}`);
    }
    return params;
  }
  const { hasOwnProperty } = Object.prototype;
  const { apply } = Function.prototype;
  const GeneratorFunctionPrototype = Object.getPrototypeOf(function* () {
  });
  const identifier = (str) => `"${str.replace(/"/g, '""')}"`;
  const defer = (x2) => () => x2;
  return table;
}
var inspect;
var hasRequiredInspect;
function requireInspect() {
  if (hasRequiredInspect) return inspect;
  hasRequiredInspect = 1;
  const DatabaseInspection = function Database() {
  };
  inspect = function inspect2(depth, opts) {
    return Object.assign(new DatabaseInspection(), this);
  };
  return inspect;
}
var database;
var hasRequiredDatabase;
function requireDatabase() {
  if (hasRequiredDatabase) return database;
  hasRequiredDatabase = 1;
  const fs = require$$0;
  const path = require$$1;
  const util2 = requireUtil();
  const SqliteError = requireSqliteError();
  let DEFAULT_ADDON;
  function Database(filenameGiven, options) {
    if (new.target == null) {
      return new Database(filenameGiven, options);
    }
    let buffer;
    if (Buffer.isBuffer(filenameGiven)) {
      buffer = filenameGiven;
      filenameGiven = ":memory:";
    }
    if (filenameGiven == null) filenameGiven = "";
    if (options == null) options = {};
    if (typeof filenameGiven !== "string") throw new TypeError("Expected first argument to be a string");
    if (typeof options !== "object") throw new TypeError("Expected second argument to be an options object");
    if ("readOnly" in options) throw new TypeError('Misspelled option "readOnly" should be "readonly"');
    if ("memory" in options) throw new TypeError('Option "memory" was removed in v7.0.0 (use ":memory:" filename instead)');
    const filename = filenameGiven.trim();
    const anonymous = filename === "" || filename === ":memory:";
    const readonly = util2.getBooleanOption(options, "readonly");
    const fileMustExist = util2.getBooleanOption(options, "fileMustExist");
    const timeout = "timeout" in options ? options.timeout : 5e3;
    const verbose = "verbose" in options ? options.verbose : null;
    const nativeBinding = "nativeBinding" in options ? options.nativeBinding : null;
    if (readonly && anonymous && !buffer) throw new TypeError("In-memory/temporary databases cannot be readonly");
    if (!Number.isInteger(timeout) || timeout < 0) throw new TypeError('Expected the "timeout" option to be a positive integer');
    if (timeout > 2147483647) throw new RangeError('Option "timeout" cannot be greater than 2147483647');
    if (verbose != null && typeof verbose !== "function") throw new TypeError('Expected the "verbose" option to be a function');
    if (nativeBinding != null && typeof nativeBinding !== "string" && typeof nativeBinding !== "object") throw new TypeError('Expected the "nativeBinding" option to be a string or addon object');
    let addon;
    if (nativeBinding == null) {
      addon = DEFAULT_ADDON || (DEFAULT_ADDON = requireBindings()("better_sqlite3.node"));
    } else if (typeof nativeBinding === "string") {
      const requireFunc = typeof __non_webpack_require__ === "function" ? __non_webpack_require__ : commonjsRequire;
      addon = requireFunc(path.resolve(nativeBinding).replace(/(\.node)?$/, ".node"));
    } else {
      addon = nativeBinding;
    }
    if (!addon.isInitialized) {
      addon.setErrorConstructor(SqliteError);
      addon.isInitialized = true;
    }
    if (!anonymous && !fs.existsSync(path.dirname(filename))) {
      throw new TypeError("Cannot open database because the directory does not exist");
    }
    Object.defineProperties(this, {
      [util2.cppdb]: { value: new addon.Database(filename, filenameGiven, anonymous, readonly, fileMustExist, timeout, verbose || null, buffer || null) },
      ...wrappers2.getters
    });
  }
  const wrappers2 = requireWrappers();
  Database.prototype.prepare = wrappers2.prepare;
  Database.prototype.transaction = requireTransaction();
  Database.prototype.pragma = requirePragma();
  Database.prototype.backup = requireBackup();
  Database.prototype.serialize = requireSerialize();
  Database.prototype.function = require_function();
  Database.prototype.aggregate = requireAggregate();
  Database.prototype.table = requireTable();
  Database.prototype.loadExtension = wrappers2.loadExtension;
  Database.prototype.exec = wrappers2.exec;
  Database.prototype.close = wrappers2.close;
  Database.prototype.defaultSafeIntegers = wrappers2.defaultSafeIntegers;
  Database.prototype.unsafeMode = wrappers2.unsafeMode;
  Database.prototype[util2.inspect] = requireInspect();
  database = Database;
  return database;
}
var hasRequiredLib;
function requireLib() {
  if (hasRequiredLib) return lib.exports;
  hasRequiredLib = 1;
  lib.exports = requireDatabase();
  lib.exports.SqliteError = requireSqliteError();
  return lib.exports;
}
requireLib();
function detectDialect(db) {
  if (db.getExecutor().adapter.constructor.name === "PostgresAdapter") return "postgres";
  return "sqlite";
}
function isSqlite(db) {
  return detectDialect(db) === "sqlite";
}
function isPostgres(db) {
  return detectDialect(db) === "postgres";
}
function currentTimestamp(db) {
  if (isPostgres(db)) return sql`CURRENT_TIMESTAMP`;
  return sql`(datetime('now'))`;
}
function currentTimestampValue(db) {
  if (isPostgres(db)) return sql`CURRENT_TIMESTAMP`;
  return sql`datetime('now')`;
}
async function tableExists(db, tableName) {
  if (isPostgres(db)) return (await sql`
			SELECT EXISTS(
				SELECT 1 FROM information_schema.tables
				WHERE table_schema = 'public' AND table_name = ${tableName}
			) as exists
		`.execute(db)).rows[0]?.exists === true;
  return (await sql`
		SELECT name FROM sqlite_master
		WHERE type = 'table' AND name = ${tableName}
	`.execute(db)).rows.length > 0;
}
async function listTablesLike(db, pattern) {
  if (isPostgres(db)) return (await sql`
			SELECT table_name FROM information_schema.tables
			WHERE table_schema = 'public' AND table_name LIKE ${pattern}
		`.execute(db)).rows.map((r) => r.table_name);
  return (await sql`
		SELECT name FROM sqlite_master
		WHERE type = 'table' AND name LIKE ${pattern}
	`.execute(db)).rows.map((r) => r.name);
}
function binaryType(db) {
  if (isPostgres(db)) return "bytea";
  return "blob";
}
function jsonExtractExpr(db, column, path) {
  if (isPostgres(db)) return `${column}->>'${path}'`;
  return `json_extract(${column}, '$.${path}')`;
}
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
  let target = {};
  for (var name in all) {
    __defProp(target, name, {
      get: all[name],
      enumerable: true
    });
  }
  {
    __defProp(target, Symbol.toStringTag, { value: "Module" });
  }
  return target;
};
const IDENTIFIER_PATTERN = /^[a-z][a-z0-9_]*$/;
const GENERIC_IDENTIFIER_PATTERN = /^[a-zA-Z][a-zA-Z0-9_]*$/;
const PLUGIN_IDENTIFIER_PATTERN = /^[a-z][a-z0-9_-]*$/;
const MAX_IDENTIFIER_LENGTH = 128;
var IdentifierError = class extends Error {
  constructor(message, identifier) {
    super(message);
    this.identifier = identifier;
    this.name = "IdentifierError";
  }
};
function validateIdentifier(value, label = "identifier") {
  if (!value || typeof value !== "string") throw new IdentifierError(`${label} must be a non-empty string`, String(value));
  if (value.length > MAX_IDENTIFIER_LENGTH) throw new IdentifierError(`${label} must be ${MAX_IDENTIFIER_LENGTH} characters or less, got ${value.length}`, value);
  if (!IDENTIFIER_PATTERN.test(value)) throw new IdentifierError(`${label} must match /^[a-z][a-z0-9_]*$/ (got "${value}")`, value);
}
function validateJsonFieldName(value, label = "JSON field name") {
  if (!value || typeof value !== "string") throw new IdentifierError(`${label} must be a non-empty string`, String(value));
  if (value.length > MAX_IDENTIFIER_LENGTH) throw new IdentifierError(`${label} must be ${MAX_IDENTIFIER_LENGTH} characters or less, got ${value.length}`, value);
  if (!GENERIC_IDENTIFIER_PATTERN.test(value)) throw new IdentifierError(`${label} must match /^[a-zA-Z][a-zA-Z0-9_]*$/ (got "${value}")`, value);
}
function validatePluginIdentifier(value, label = "plugin identifier") {
  if (!value || typeof value !== "string") throw new IdentifierError(`${label} must be a non-empty string`, String(value));
  if (value.length > MAX_IDENTIFIER_LENGTH) throw new IdentifierError(`${label} must be ${MAX_IDENTIFIER_LENGTH} characters or less, got ${value.length}`, value);
  if (!PLUGIN_IDENTIFIER_PATTERN.test(value)) throw new IdentifierError(`${label} must match /^[a-z][a-z0-9_-]*$/ (got "${value}")`, value);
}
const hasNative = typeof Uint8Array.prototype.toBase64 === "function" && typeof Uint8Array.fromBase64 === "function";
function encodeBase64(str) {
  const bytes = new TextEncoder().encode(str);
  if (hasNative) return bytes.toBase64();
  let binary = "";
  for (const b2 of bytes) binary += String.fromCharCode(b2);
  return btoa(binary);
}
function decodeBase64(base64) {
  if (hasNative) return new TextDecoder().decode(Uint8Array.fromBase64(base64));
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}
function encodeCursor(orderValue, id) {
  return encodeBase64(JSON.stringify({
    orderValue,
    id
  }));
}
function decodeCursor(cursor) {
  try {
    const parsed = JSON.parse(decodeBase64(cursor));
    if (typeof parsed.orderValue === "string" && typeof parsed.id === "string") return parsed;
    return null;
  } catch {
    return null;
  }
}
var EmDashValidationError = class extends Error {
  constructor(message, details) {
    super(message);
    this.details = details;
    this.name = "EmDashValidationError";
  }
};
const DIACRITICS_PATTERN = /[\u0300-\u036f]/g;
const WHITESPACE_UNDERSCORE_PATTERN = /[\s_]+/g;
const NON_ALPHANUMERIC_HYPHEN_PATTERN = /[^a-z0-9-]/g;
const MULTIPLE_HYPHENS_PATTERN$1 = /-+/g;
const LEADING_TRAILING_HYPHEN_PATTERN = /^-|-$/g;
const TRAILING_HYPHEN_PATTERN = /-$/;
function slugify(text, maxLength = 80) {
  return text.toLowerCase().normalize("NFD").replace(DIACRITICS_PATTERN, "").replace(WHITESPACE_UNDERSCORE_PATTERN, "-").replace(NON_ALPHANUMERIC_HYPHEN_PATTERN, "").replace(MULTIPLE_HYPHENS_PATTERN$1, "-").replace(LEADING_TRAILING_HYPHEN_PATTERN, "").slice(0, maxLength).replace(TRAILING_HYPHEN_PATTERN, "");
}
const monotonic = monotonicFactory();
var RevisionRepository = class {
  constructor(db) {
    this.db = db;
  }
  /**
  * Create a new revision
  */
  async create(input) {
    const id = monotonic();
    const row = {
      id,
      collection: input.collection,
      entry_id: input.entryId,
      data: JSON.stringify(input.data),
      author_id: input.authorId ?? null
    };
    await this.db.insertInto("revisions").values(row).execute();
    const revision = await this.findById(id);
    if (!revision) throw new Error("Failed to create revision");
    return revision;
  }
  /**
  * Find revision by ID
  */
  async findById(id) {
    const row = await this.db.selectFrom("revisions").selectAll().where("id", "=", id).executeTakeFirst();
    return row ? this.rowToRevision(row) : null;
  }
  /**
  * Get all revisions for an entry (newest first)
  *
  * Orders by monotonic ULID (descending). The monotonic factory
  * guarantees strictly increasing IDs even within the same millisecond.
  */
  async findByEntry(collection, entryId, options = {}) {
    let query = this.db.selectFrom("revisions").selectAll().where("collection", "=", collection).where("entry_id", "=", entryId).orderBy("id", "desc");
    if (options.limit) query = query.limit(options.limit);
    return (await query.execute()).map((row) => this.rowToRevision(row));
  }
  /**
  * Get the most recent revision for an entry
  */
  async findLatest(collection, entryId) {
    const row = await this.db.selectFrom("revisions").selectAll().where("collection", "=", collection).where("entry_id", "=", entryId).orderBy("id", "desc").limit(1).executeTakeFirst();
    return row ? this.rowToRevision(row) : null;
  }
  /**
  * Count revisions for an entry
  */
  async countByEntry(collection, entryId) {
    const result = await this.db.selectFrom("revisions").select((eb) => eb.fn.count("id").as("count")).where("collection", "=", collection).where("entry_id", "=", entryId).executeTakeFirst();
    return Number(result?.count || 0);
  }
  /**
  * Delete all revisions for an entry (use when entry is deleted)
  */
  async deleteByEntry(collection, entryId) {
    const result = await this.db.deleteFrom("revisions").where("collection", "=", collection).where("entry_id", "=", entryId).executeTakeFirst();
    return Number(result.numDeletedRows ?? 0);
  }
  /**
  * Delete old revisions, keeping the most recent N
  */
  async pruneOldRevisions(collection, entryId, keepCount) {
    const keepIds = (await this.db.selectFrom("revisions").select("id").where("collection", "=", collection).where("entry_id", "=", entryId).orderBy("created_at", "desc").orderBy("id", "desc").limit(keepCount).execute()).map((r) => r.id);
    if (keepIds.length === 0) return 0;
    const result = await this.db.deleteFrom("revisions").where("collection", "=", collection).where("entry_id", "=", entryId).where("id", "not in", keepIds).executeTakeFirst();
    return Number(result.numDeletedRows ?? 0);
  }
  /**
  * Update revision data in place
  * Used for autosave to avoid creating many small revisions.
  */
  async updateData(id, data) {
    await this.db.updateTable("revisions").set({ data: JSON.stringify(data) }).where("id", "=", id).execute();
  }
  /**
  * Convert database row to Revision object
  */
  rowToRevision(row) {
    return {
      id: row.id,
      collection: row.collection,
      entryId: row.entry_id,
      data: JSON.parse(row.data),
      authorId: row.author_id,
      createdAt: row.created_at
    };
  }
};
var content_exports = /* @__PURE__ */ __exportAll({ ContentRepository: () => ContentRepository });
const ULID_PATTERN = /^[0-9A-Z]{26}$/;
const SYSTEM_COLUMNS$1 = /* @__PURE__ */ new Set([
  "id",
  "slug",
  "status",
  "author_id",
  "primary_byline_id",
  "created_at",
  "updated_at",
  "published_at",
  "scheduled_at",
  "deleted_at",
  "version",
  "live_revision_id",
  "draft_revision_id",
  "locale",
  "translation_group"
]);
function getTableName$1(type) {
  return `ec_${type}`;
}
function serializeValue(value) {
  if (value === null || value === void 0) return null;
  if (typeof value === "boolean") return value ? 1 : 0;
  if (typeof value === "object") return JSON.stringify(value);
  return value;
}
function deserializeValue(value) {
  if (typeof value === "string") {
    if (value.startsWith("{") || value.startsWith("[")) try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }
  return value;
}
const REGEX_ESCAPE_PATTERN = /[.*+?^${}()|[\]\\]/g;
function escapeRegExp(s2) {
  return s2.replace(REGEX_ESCAPE_PATTERN, "\\$&");
}
var ContentRepository = class {
  constructor(db) {
    this.db = db;
  }
  /**
  * Create a new content item
  */
  async create(input) {
    const id = ulid();
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const { type, slug, data, status = "draft", authorId, primaryBylineId, locale, translationOf, publishedAt } = input;
    if (!type) throw new EmDashValidationError("Content type is required");
    const tableName = getTableName$1(type);
    let translationGroup = id;
    if (translationOf) {
      const source = await this.findById(type, translationOf);
      if (!source) throw new EmDashValidationError("Translation source content not found");
      translationGroup = source.translationGroup || source.id;
    }
    const columns = [
      "id",
      "slug",
      "status",
      "author_id",
      "primary_byline_id",
      "created_at",
      "updated_at",
      "published_at",
      "version",
      "locale",
      "translation_group"
    ];
    const values = [
      id,
      slug || null,
      status,
      authorId || null,
      primaryBylineId ?? null,
      now,
      now,
      publishedAt || null,
      1,
      locale || "en",
      translationGroup
    ];
    if (data && typeof data === "object") {
      for (const [key, value] of Object.entries(data)) if (!SYSTEM_COLUMNS$1.has(key)) {
        columns.push(key);
        values.push(serializeValue(value));
      }
    }
    const columnRefs = columns.map((c) => sql.ref(c));
    const valuePlaceholders = values.map((v2) => v2 === null ? sql`NULL` : sql`${v2}`);
    await sql`
			INSERT INTO ${sql.ref(tableName)} (${sql.join(columnRefs, sql`, `)})
			VALUES (${sql.join(valuePlaceholders, sql`, `)})
		`.execute(this.db);
    const item = await this.findById(type, id);
    if (!item) throw new Error("Failed to create content");
    return item;
  }
  /**
  * Generate a unique slug for a content item within a collection.
  *
  * Checks the collection table for existing slugs that match `baseSlug`
  * (optionally scoped to a locale) and appends a numeric suffix (`-1`,
  * `-2`, etc.) on collision to guarantee uniqueness.
  *
  * Returns `null` if `baseSlug` is empty after slugification.
  */
  async generateUniqueSlug(type, text, locale) {
    const baseSlug = slugify(text);
    if (!baseSlug) return null;
    const tableName = getTableName$1(type);
    if ((locale ? await sql`
					SELECT slug FROM ${sql.ref(tableName)}
					WHERE slug = ${baseSlug}
					AND locale = ${locale}
					LIMIT 1
				`.execute(this.db) : await sql`
					SELECT slug FROM ${sql.ref(tableName)}
					WHERE slug = ${baseSlug}
					LIMIT 1
				`.execute(this.db)).rows.length === 0) return baseSlug;
    const pattern = `${baseSlug}-%`;
    const candidates = locale ? await sql`
					SELECT slug FROM ${sql.ref(tableName)}
					WHERE (slug = ${baseSlug} OR slug LIKE ${pattern})
					AND locale = ${locale}
				`.execute(this.db) : await sql`
					SELECT slug FROM ${sql.ref(tableName)}
					WHERE slug = ${baseSlug} OR slug LIKE ${pattern}
				`.execute(this.db);
    let maxSuffix = 0;
    const suffixPattern = new RegExp(`^${escapeRegExp(baseSlug)}-(\\d+)$`);
    for (const row of candidates.rows) {
      const match = suffixPattern.exec(row.slug);
      if (match) {
        const n = parseInt(match[1], 10);
        if (n > maxSuffix) maxSuffix = n;
      }
    }
    return `${baseSlug}-${maxSuffix + 1}`;
  }
  /**
  * Duplicate a content item
  * Creates a new draft copy with "(Copy)" appended to the title.
  * A slug is auto-generated from the new title by the handler layer.
  */
  async duplicate(type, id, authorId) {
    const original = await this.findById(type, id);
    if (!original) throw new EmDashValidationError("Content item not found");
    const newData = { ...original.data };
    if (typeof newData.title === "string") newData.title = `${newData.title} (Copy)`;
    else if (typeof newData.name === "string") newData.name = `${newData.name} (Copy)`;
    const slugSource = typeof newData.title === "string" ? newData.title : typeof newData.name === "string" ? newData.name : null;
    const slug = slugSource ? await this.generateUniqueSlug(type, slugSource, original.locale ?? void 0) : null;
    return this.create({
      type,
      slug,
      data: newData,
      status: "draft",
      authorId: authorId || original.authorId || void 0
    });
  }
  /**
  * Find content by ID
  */
  async findById(type, id) {
    const tableName = getTableName$1(type);
    const row = (await sql`
			SELECT * FROM ${sql.ref(tableName)}
			WHERE id = ${id}
			AND deleted_at IS NULL
		`.execute(this.db)).rows[0];
    if (!row) return null;
    return this.mapRow(type, row);
  }
  /**
  * Find content by id, including trashed (soft-deleted) items.
  * Used by restore endpoint for ownership checks.
  */
  async findByIdIncludingTrashed(type, id) {
    const tableName = getTableName$1(type);
    const row = (await sql`
			SELECT * FROM ${sql.ref(tableName)}
			WHERE id = ${id}
		`.execute(this.db)).rows[0];
    if (!row) return null;
    return this.mapRow(type, row);
  }
  /**
  * Find content by ID or slug. Tries ID first if it looks like a ULID,
  * otherwise tries slug. Falls back to the other if the first lookup misses.
  */
  async findByIdOrSlug(type, identifier, locale) {
    return this._findByIdOrSlug(type, identifier, false, locale);
  }
  /**
  * Find content by ID or slug, including trashed (soft-deleted) items.
  * Used by restore/permanent-delete endpoints.
  */
  async findByIdOrSlugIncludingTrashed(type, identifier, locale) {
    return this._findByIdOrSlug(type, identifier, true, locale);
  }
  async _findByIdOrSlug(type, identifier, includeTrashed, locale) {
    const looksLikeUlid = ULID_PATTERN.test(identifier);
    const findById = includeTrashed ? (t, id) => this.findByIdIncludingTrashed(t, id) : (t, id) => this.findById(t, id);
    const findBySlug = includeTrashed ? (t, s2) => this.findBySlugIncludingTrashed(t, s2, locale) : (t, s2) => this.findBySlug(t, s2, locale);
    if (looksLikeUlid) {
      const byId = await findById(type, identifier);
      if (byId) return byId;
      return findBySlug(type, identifier);
    }
    const bySlug = await findBySlug(type, identifier);
    if (bySlug) return bySlug;
    return findById(type, identifier);
  }
  /**
  * Find content by slug
  */
  async findBySlug(type, slug, locale) {
    const tableName = getTableName$1(type);
    const row = (locale ? await sql`
					SELECT * FROM ${sql.ref(tableName)}
					WHERE slug = ${slug}
					AND locale = ${locale}
					AND deleted_at IS NULL
				`.execute(this.db) : await sql`
					SELECT * FROM ${sql.ref(tableName)}
					WHERE slug = ${slug}
					AND deleted_at IS NULL
					ORDER BY locale ASC
					LIMIT 1
				`.execute(this.db)).rows[0];
    if (!row) return null;
    return this.mapRow(type, row);
  }
  /**
  * Find content by slug, including trashed (soft-deleted) items.
  * Used by restore/permanent-delete endpoints.
  */
  async findBySlugIncludingTrashed(type, slug, locale) {
    const tableName = getTableName$1(type);
    const row = (locale ? await sql`
					SELECT * FROM ${sql.ref(tableName)}
					WHERE slug = ${slug}
					AND locale = ${locale}
				`.execute(this.db) : await sql`
					SELECT * FROM ${sql.ref(tableName)}
					WHERE slug = ${slug}
					ORDER BY locale ASC
					LIMIT 1
				`.execute(this.db)).rows[0];
    if (!row) return null;
    return this.mapRow(type, row);
  }
  /**
  * Find many content items with filtering and pagination
  */
  async findMany(type, options = {}) {
    const tableName = getTableName$1(type);
    const limit = Math.min(options.limit || 50, 100);
    const orderField = options.orderBy?.field || "createdAt";
    const orderDirection = options.orderBy?.direction || "desc";
    const dbField = this.mapOrderField(orderField);
    const safeOrderDirection = orderDirection.toLowerCase() === "asc" ? "ASC" : "DESC";
    let query = this.db.selectFrom(tableName).selectAll().where("deleted_at", "is", null);
    if (options.where?.status) query = query.where("status", "=", options.where.status);
    if (options.where?.authorId) query = query.where("author_id", "=", options.where.authorId);
    if (options.where?.locale) query = query.where("locale", "=", options.where.locale);
    if (options.cursor) {
      const decoded = decodeCursor(options.cursor);
      if (decoded) {
        const { orderValue, id: cursorId } = decoded;
        if (safeOrderDirection === "DESC") query = query.where((eb) => eb.or([eb(dbField, "<", orderValue), eb.and([eb(dbField, "=", orderValue), eb("id", "<", cursorId)])]));
        else query = query.where((eb) => eb.or([eb(dbField, ">", orderValue), eb.and([eb(dbField, "=", orderValue), eb("id", ">", cursorId)])]));
      }
    }
    query = query.orderBy(dbField, safeOrderDirection === "ASC" ? "asc" : "desc").orderBy("id", safeOrderDirection === "ASC" ? "asc" : "desc").limit(limit + 1);
    const rows = await query.execute();
    const hasMore = rows.length > limit;
    const items = rows.slice(0, limit);
    const mappedResult = { items: items.map((row) => this.mapRow(type, row)) };
    if (hasMore && items.length > 0) {
      const lastRow = items.at(-1);
      const lastOrderValue = lastRow[dbField];
      mappedResult.nextCursor = encodeCursor(typeof lastOrderValue === "string" || typeof lastOrderValue === "number" ? String(lastOrderValue) : "", String(lastRow.id));
    }
    return mappedResult;
  }
  /**
  * Update content
  */
  async update(type, id, input) {
    const tableName = getTableName$1(type);
    const updates = {
      updated_at: (/* @__PURE__ */ new Date()).toISOString(),
      version: sql`version + 1`
    };
    if (input.status !== void 0) updates.status = input.status;
    if (input.slug !== void 0) updates.slug = input.slug;
    if (input.publishedAt !== void 0) updates.published_at = input.publishedAt;
    if (input.scheduledAt !== void 0) updates.scheduled_at = input.scheduledAt;
    if (input.authorId !== void 0) updates.author_id = input.authorId;
    if (input.primaryBylineId !== void 0) updates.primary_byline_id = input.primaryBylineId;
    if (input.data !== void 0 && typeof input.data === "object") {
      for (const [key, value] of Object.entries(input.data)) if (!SYSTEM_COLUMNS$1.has(key)) updates[key] = serializeValue(value);
    }
    await this.db.updateTable(tableName).set(updates).where("id", "=", id).where("deleted_at", "is", null).execute();
    const updated = await this.findById(type, id);
    if (!updated) throw new Error("Content not found");
    return updated;
  }
  /**
  * Delete content (soft delete - moves to trash)
  */
  async delete(type, id) {
    const tableName = getTableName$1(type);
    const now = (/* @__PURE__ */ new Date()).toISOString();
    return ((await sql`
			UPDATE ${sql.ref(tableName)}
			SET deleted_at = ${now}
			WHERE id = ${id}
			AND deleted_at IS NULL
		`.execute(this.db)).numAffectedRows ?? 0n) > 0n;
  }
  /**
  * Restore content from trash
  */
  async restore(type, id) {
    const tableName = getTableName$1(type);
    return ((await sql`
			UPDATE ${sql.ref(tableName)}
			SET deleted_at = NULL
			WHERE id = ${id}
			AND deleted_at IS NOT NULL
		`.execute(this.db)).numAffectedRows ?? 0n) > 0n;
  }
  /**
  * Permanently delete content (cannot be undone)
  */
  async permanentDelete(type, id) {
    const tableName = getTableName$1(type);
    return ((await sql`
			DELETE FROM ${sql.ref(tableName)}
			WHERE id = ${id}
		`.execute(this.db)).numAffectedRows ?? 0n) > 0n;
  }
  /**
  * Find trashed content items
  */
  async findTrashed(type, options = {}) {
    const tableName = getTableName$1(type);
    const limit = Math.min(options.limit || 50, 100);
    const orderField = options.orderBy?.field || "deletedAt";
    const orderDirection = options.orderBy?.direction || "desc";
    const dbField = this.mapOrderField(orderField);
    const safeOrderDirection = orderDirection.toLowerCase() === "asc" ? "ASC" : "DESC";
    let query = this.db.selectFrom(tableName).selectAll().where("deleted_at", "is not", null);
    if (options.cursor) {
      const decoded = decodeCursor(options.cursor);
      if (decoded) {
        const { orderValue, id: cursorId } = decoded;
        if (safeOrderDirection === "DESC") query = query.where((eb) => eb.or([eb(dbField, "<", orderValue), eb.and([eb(dbField, "=", orderValue), eb("id", "<", cursorId)])]));
        else query = query.where((eb) => eb.or([eb(dbField, ">", orderValue), eb.and([eb(dbField, "=", orderValue), eb("id", ">", cursorId)])]));
      }
    }
    query = query.orderBy(dbField, safeOrderDirection === "ASC" ? "asc" : "desc").orderBy("id", safeOrderDirection === "ASC" ? "asc" : "desc").limit(limit + 1);
    const rows = await query.execute();
    const hasMore = rows.length > limit;
    const items = rows.slice(0, limit);
    const mappedResult = { items: items.map((row) => {
      const record2 = row;
      return {
        ...this.mapRow(type, record2),
        deletedAt: typeof record2.deleted_at === "string" ? record2.deleted_at : ""
      };
    }) };
    if (hasMore && items.length > 0) {
      const lastRow = items.at(-1);
      const lastOrderValue = lastRow[dbField];
      mappedResult.nextCursor = encodeCursor(typeof lastOrderValue === "string" || typeof lastOrderValue === "number" ? String(lastOrderValue) : "", String(lastRow.id));
    }
    return mappedResult;
  }
  /**
  * Count trashed content items
  */
  async countTrashed(type) {
    const tableName = getTableName$1(type);
    const result = await this.db.selectFrom(tableName).select((eb) => eb.fn.count("id").as("count")).where("deleted_at", "is not", null).executeTakeFirst();
    return Number(result?.count || 0);
  }
  /**
  * Count content items
  */
  async count(type, where) {
    const tableName = getTableName$1(type);
    let query = this.db.selectFrom(tableName).select((eb) => eb.fn.count("id").as("count")).where("deleted_at", "is", null);
    if (where?.status) query = query.where("status", "=", where.status);
    if (where?.authorId) query = query.where("author_id", "=", where.authorId);
    if (where?.locale) query = query.where("locale", "=", where.locale);
    const result = await query.executeTakeFirst();
    return Number(result?.count || 0);
  }
  /**
  * Schedule content for future publishing
  *
  * Sets status to 'scheduled' and stores the scheduled publish time.
  * The content will be auto-published when the scheduled time is reached.
  */
  async schedule(type, id, scheduledAt) {
    const tableName = getTableName$1(type);
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const scheduledDate = new Date(scheduledAt);
    if (isNaN(scheduledDate.getTime())) throw new EmDashValidationError("Invalid scheduled date");
    if (scheduledDate <= /* @__PURE__ */ new Date()) throw new EmDashValidationError("Scheduled date must be in the future");
    const existing = await this.findById(type, id);
    if (!existing) throw new EmDashValidationError("Content item not found");
    const newStatus = existing.status === "published" ? "published" : "scheduled";
    await sql`
			UPDATE ${sql.ref(tableName)}
			SET status = ${newStatus},
				scheduled_at = ${scheduledAt},
				updated_at = ${now}
			WHERE id = ${id}
			AND deleted_at IS NULL
		`.execute(this.db);
    const updated = await this.findById(type, id);
    if (!updated) throw new Error("Content not found");
    return updated;
  }
  /**
  * Unschedule content
  *
  * Clears the scheduled time. Published posts stay published;
  * draft/scheduled posts revert to 'draft'.
  */
  async unschedule(type, id) {
    const tableName = getTableName$1(type);
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const existing = await this.findById(type, id);
    if (!existing) throw new EmDashValidationError("Content item not found");
    const newStatus = existing.status === "published" ? "published" : "draft";
    await sql`
			UPDATE ${sql.ref(tableName)}
			SET status = ${newStatus},
				scheduled_at = NULL,
				updated_at = ${now}
			WHERE id = ${id}
			AND scheduled_at IS NOT NULL
			AND deleted_at IS NULL
		`.execute(this.db);
    const updated = await this.findById(type, id);
    if (!updated) throw new Error("Content not found");
    return updated;
  }
  /**
  * Find content that is ready to be published
  *
  * Returns all content where scheduled_at <= now, regardless of status.
  * This covers both draft-scheduled posts (status='scheduled') and
  * published posts with scheduled draft changes (status='published').
  */
  async findReadyToPublish(type) {
    const tableName = getTableName$1(type);
    const now = (/* @__PURE__ */ new Date()).toISOString();
    return (await sql`
			SELECT * FROM ${sql.ref(tableName)}
			WHERE scheduled_at IS NOT NULL
			AND scheduled_at <= ${now}
			AND deleted_at IS NULL
			ORDER BY scheduled_at ASC
		`.execute(this.db)).rows.map((row) => this.mapRow(type, row));
  }
  /**
  * Find all translations in a translation group
  */
  async findTranslations(type, translationGroup) {
    const tableName = getTableName$1(type);
    return (await sql`
			SELECT * FROM ${sql.ref(tableName)}
			WHERE translation_group = ${translationGroup}
			AND deleted_at IS NULL
			ORDER BY locale ASC
		`.execute(this.db)).rows.map((row) => this.mapRow(type, row));
  }
  /**
  * Publish the current draft
  *
  * Promotes draft_revision_id to live_revision_id and clears draft pointer.
  * Syncs the draft revision's data into the content table columns so the
  * content table always reflects the published version.
  * If no draft revision exists, creates one from current data and publishes it.
  */
  async publish(type, id) {
    const tableName = getTableName$1(type);
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const existing = await this.findById(type, id);
    if (!existing) throw new EmDashValidationError("Content item not found");
    const revisionRepo = new RevisionRepository(this.db);
    let revisionToPublish = existing.draftRevisionId || existing.liveRevisionId;
    if (!revisionToPublish) revisionToPublish = (await revisionRepo.create({
      collection: type,
      entryId: id,
      data: existing.data
    })).id;
    const revision = await revisionRepo.findById(revisionToPublish);
    if (revision) {
      await this.syncDataColumns(type, id, revision.data);
      if (typeof revision.data._slug === "string") await sql`
					UPDATE ${sql.ref(tableName)}
					SET slug = ${revision.data._slug}
					WHERE id = ${id}
				`.execute(this.db);
    }
    await sql`
			UPDATE ${sql.ref(tableName)}
			SET live_revision_id = ${revisionToPublish},
				draft_revision_id = NULL,
				status = 'published',
				scheduled_at = NULL,
				published_at = COALESCE(published_at, ${now}),
				updated_at = ${now}
			WHERE id = ${id}
			AND deleted_at IS NULL
		`.execute(this.db);
    const updated = await this.findById(type, id);
    if (!updated) throw new Error("Content not found");
    return updated;
  }
  /**
  * Unpublish content
  *
  * Removes live pointer but preserves draft. If no draft exists,
  * creates one from the live version so the content isn't lost.
  */
  async unpublish(type, id) {
    const tableName = getTableName$1(type);
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const existing = await this.findById(type, id);
    if (!existing) throw new EmDashValidationError("Content item not found");
    if (!existing.draftRevisionId && existing.liveRevisionId) {
      const revisionRepo = new RevisionRepository(this.db);
      const liveRevision = await revisionRepo.findById(existing.liveRevisionId);
      if (liveRevision) {
        const draft = await revisionRepo.create({
          collection: type,
          entryId: id,
          data: liveRevision.data
        });
        await sql`
					UPDATE ${sql.ref(tableName)}
					SET draft_revision_id = ${draft.id}
					WHERE id = ${id}
				`.execute(this.db);
      }
    }
    await sql`
			UPDATE ${sql.ref(tableName)}
			SET live_revision_id = NULL,
				status = 'draft',
				updated_at = ${now}
			WHERE id = ${id}
			AND deleted_at IS NULL
		`.execute(this.db);
    const updated = await this.findById(type, id);
    if (!updated) throw new Error("Content not found");
    return updated;
  }
  /**
  * Discard pending draft changes
  *
  * Clears draft_revision_id. The content table columns already hold the
  * published version, so no data sync is needed.
  */
  async discardDraft(type, id) {
    const tableName = getTableName$1(type);
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const existing = await this.findById(type, id);
    if (!existing) throw new EmDashValidationError("Content item not found");
    if (!existing.draftRevisionId) return existing;
    await sql`
			UPDATE ${sql.ref(tableName)}
			SET draft_revision_id = NULL,
				updated_at = ${now}
			WHERE id = ${id}
			AND deleted_at IS NULL
		`.execute(this.db);
    const updated = await this.findById(type, id);
    if (!updated) throw new Error("Content not found");
    return updated;
  }
  /**
  * Sync data columns in the content table from a data object.
  * Used to promote revision data into the content table on publish.
  * Keys starting with _ are revision metadata (e.g. _slug) and are skipped.
  */
  async syncDataColumns(type, id, data) {
    const tableName = getTableName$1(type);
    const updates = {};
    for (const [key, value] of Object.entries(data)) {
      if (SYSTEM_COLUMNS$1.has(key)) continue;
      if (key.startsWith("_")) continue;
      updates[key] = serializeValue(value);
    }
    if (Object.keys(updates).length === 0) return;
    await this.db.updateTable(tableName).set(updates).where("id", "=", id).execute();
  }
  /**
  * Count content items with a pending schedule.
  * Includes both draft-scheduled (status='scheduled') and published
  * posts with scheduled draft changes (status='published', scheduled_at set).
  */
  async countScheduled(type) {
    const tableName = getTableName$1(type);
    const result = await sql`
			SELECT COUNT(id) as count FROM ${sql.ref(tableName)}
			WHERE scheduled_at IS NOT NULL
			AND deleted_at IS NULL
		`.execute(this.db);
    return Number(result.rows[0]?.count || 0);
  }
  /**
  * Map database row to ContentItem
  * Extracts system columns and puts content fields in data
  * Excludes null values from data to match input semantics
  */
  mapRow(type, row) {
    const data = {};
    for (const [key, value] of Object.entries(row)) if (!SYSTEM_COLUMNS$1.has(key) && value !== null) data[key] = deserializeValue(value);
    return {
      id: row.id,
      type,
      slug: row.slug,
      status: row.status,
      data,
      authorId: row.author_id,
      primaryBylineId: row.primary_byline_id ?? null,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      publishedAt: row.published_at,
      scheduledAt: row.scheduled_at,
      liveRevisionId: row.live_revision_id ?? null,
      draftRevisionId: row.draft_revision_id ?? null,
      version: typeof row.version === "number" ? row.version : 1,
      locale: row.locale ?? null,
      translationGroup: row.translation_group ?? null
    };
  }
  /**
  * Map order field names to database columns.
  * Only allows known fields to prevent column enumeration via crafted orderBy values.
  */
  mapOrderField(field) {
    const mapped = {
      createdAt: "created_at",
      updatedAt: "updated_at",
      publishedAt: "published_at",
      scheduledAt: "scheduled_at",
      deletedAt: "deleted_at",
      title: "title",
      slug: "slug"
    }[field];
    if (!mapped) throw new EmDashValidationError(`Invalid order field: ${field}`);
    return mapped;
  }
};
const contentD6C2WsZC = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  i: slugify,
  n: content_exports,
  r: RevisionRepository,
  t: ContentRepository
}, Symbol.toStringTag, { value: "Module" }));
function escapeLike(value) {
  return value.replaceAll("\\", "\\\\").replaceAll("%", "\\%").replaceAll("_", "\\_");
}
var MediaRepository = class {
  constructor(db) {
    this.db = db;
  }
  /**
  * Create a new media item
  */
  async create(input) {
    const id = ulid();
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const row = {
      id,
      filename: input.filename,
      mime_type: input.mimeType,
      size: input.size ?? null,
      width: input.width ?? null,
      height: input.height ?? null,
      alt: input.alt ?? null,
      caption: input.caption ?? null,
      storage_key: input.storageKey,
      content_hash: input.contentHash ?? null,
      blurhash: input.blurhash ?? null,
      dominant_color: input.dominantColor ?? null,
      status: input.status ?? "ready",
      created_at: now,
      author_id: input.authorId ?? null
    };
    await this.db.insertInto("media").values(row).execute();
    return this.rowToItem(row);
  }
  /**
  * Create a pending media item (for signed URL upload flow)
  */
  async createPending(input) {
    return this.create({
      ...input,
      status: "pending"
    });
  }
  /**
  * Confirm upload (mark as ready)
  */
  async confirmUpload(id, metadata) {
    if (!await this.findById(id)) return null;
    const updates = { status: "ready" };
    if (metadata?.width !== void 0) updates.width = metadata.width;
    if (metadata?.height !== void 0) updates.height = metadata.height;
    if (metadata?.size !== void 0) updates.size = metadata.size;
    await this.db.updateTable("media").set(updates).where("id", "=", id).execute();
    return this.findById(id);
  }
  /**
  * Mark upload as failed
  */
  async markFailed(id) {
    if (!await this.findById(id)) return null;
    await this.db.updateTable("media").set({ status: "failed" }).where("id", "=", id).execute();
    return this.findById(id);
  }
  /**
  * Find media by ID
  */
  async findById(id) {
    const row = await this.db.selectFrom("media").selectAll().where("id", "=", id).executeTakeFirst();
    return row ? this.rowToItem(row) : null;
  }
  /**
  * Find media by filename
  * Useful for idempotent imports
  */
  async findByFilename(filename) {
    const row = await this.db.selectFrom("media").selectAll().where("filename", "=", filename).executeTakeFirst();
    return row ? this.rowToItem(row) : null;
  }
  /**
  * Find media by content hash
  * Used for deduplication - same content = same hash
  */
  async findByContentHash(contentHash) {
    const row = await this.db.selectFrom("media").selectAll().where("content_hash", "=", contentHash).where("status", "=", "ready").executeTakeFirst();
    return row ? this.rowToItem(row) : null;
  }
  /**
  * Find many media items with cursor pagination
  *
  * Uses keyset pagination (cursor-based) for consistent results.
  * The cursor encodes the created_at and id of the last item.
  */
  async findMany(options = {}) {
    const limit = Math.min(options.limit || 50, 100);
    let query = this.db.selectFrom("media").selectAll().orderBy("created_at", "desc").orderBy("id", "desc").limit(limit + 1);
    if (options.cursor) {
      const decoded = decodeCursor(options.cursor);
      if (decoded) {
        const { orderValue: createdAt, id: cursorId } = decoded;
        query = query.where((eb) => eb.or([eb("created_at", "<", createdAt), eb.and([eb("created_at", "=", createdAt), eb("id", "<", cursorId)])]));
      }
    }
    if (options.mimeType) {
      const pattern = `${escapeLike(options.mimeType)}%`;
      query = query.where(sql`mime_type LIKE ${pattern} ESCAPE '\\'`);
    }
    if (options.status !== "all") query = query.where("status", "=", options.status ?? "ready");
    const rows = await query.execute();
    const hasMore = rows.length > limit;
    const items = rows.slice(0, limit).map((row) => this.rowToItem(row));
    let nextCursor;
    if (hasMore && items.length > 0) {
      const lastItem = items.at(-1);
      nextCursor = encodeCursor(lastItem.createdAt, lastItem.id);
    }
    return {
      items,
      nextCursor
    };
  }
  /**
  * Update media metadata
  */
  async update(id, input) {
    if (!await this.findById(id)) return null;
    const updates = {};
    if (input.alt !== void 0) updates.alt = input.alt;
    if (input.caption !== void 0) updates.caption = input.caption;
    if (input.width !== void 0) updates.width = input.width;
    if (input.height !== void 0) updates.height = input.height;
    if (Object.keys(updates).length > 0) await this.db.updateTable("media").set(updates).where("id", "=", id).execute();
    return this.findById(id);
  }
  /**
  * Delete media item
  */
  async delete(id) {
    return ((await this.db.deleteFrom("media").where("id", "=", id).executeTakeFirst()).numDeletedRows ?? 0) > 0;
  }
  /**
  * Count media items
  */
  async count(mimeType) {
    let query = this.db.selectFrom("media").select((eb) => eb.fn.count("id").as("count"));
    if (mimeType) {
      const pattern = `${escapeLike(mimeType)}%`;
      query = query.where(sql`mime_type LIKE ${pattern} ESCAPE '\\'`);
    }
    const result = await query.executeTakeFirst();
    return Number(result?.count || 0);
  }
  /**
  * Delete pending uploads older than the given age.
  * Pending uploads that were never confirmed indicate abandoned upload flows.
  *
  * Returns the storage keys of deleted rows so callers can remove the
  * corresponding files from object storage.
  */
  async cleanupPendingUploads(maxAgeMs = 3600 * 1e3) {
    const cutoff = new Date(Date.now() - maxAgeMs).toISOString();
    const rows = await this.db.selectFrom("media").select("storage_key").where("status", "=", "pending").where("created_at", "<", cutoff).execute();
    if (rows.length === 0) return [];
    await this.db.deleteFrom("media").where("status", "=", "pending").where("created_at", "<", cutoff).execute();
    return rows.map((r) => r.storage_key);
  }
  /**
  * Convert database row to MediaItem
  */
  rowToItem(row) {
    return {
      id: row.id,
      filename: row.filename,
      mimeType: row.mime_type,
      size: row.size,
      width: row.width,
      height: row.height,
      alt: row.alt,
      caption: row.caption,
      storageKey: row.storage_key,
      contentHash: row.content_hash,
      blurhash: row.blurhash,
      dominantColor: row.dominant_color,
      status: row.status,
      createdAt: row.created_at,
      authorId: row.author_id
    };
  }
};
const FIELD_TYPES$1 = [
  "string",
  "text",
  "number",
  "integer",
  "boolean",
  "datetime",
  "select",
  "multiSelect",
  "portableText",
  "image",
  "file",
  "reference",
  "json",
  "slug"
];
const FIELD_TYPE_TO_COLUMN = {
  string: "TEXT",
  text: "TEXT",
  number: "REAL",
  integer: "INTEGER",
  boolean: "INTEGER",
  datetime: "TEXT",
  select: "TEXT",
  multiSelect: "JSON",
  portableText: "JSON",
  image: "TEXT",
  file: "TEXT",
  reference: "TEXT",
  json: "JSON",
  slug: "TEXT"
};
const RESERVED_FIELD_SLUGS = [
  "id",
  "slug",
  "status",
  "author_id",
  "primary_byline_id",
  "created_at",
  "updated_at",
  "published_at",
  "scheduled_at",
  "deleted_at",
  "version",
  "live_revision_id",
  "draft_revision_id"
];
const RESERVED_COLLECTION_SLUGS = [
  "content",
  "media",
  "users",
  "revisions",
  "taxonomies",
  "options",
  "audit_logs"
];
let transactionsSupported = null;
const TRANSACTIONS_NOT_SUPPORTED_RE = /transactions are not supported/i;
async function withTransaction(db, fn) {
  if (transactionsSupported === true) return db.transaction().execute(fn);
  if (transactionsSupported === false) return fn(db);
  try {
    const result = await db.transaction().execute(fn);
    transactionsSupported = true;
    return result;
  } catch (error) {
    if (error instanceof Error && TRANSACTIONS_NOT_SUPPORTED_RE.test(error.message)) {
      transactionsSupported = false;
      return fn(db);
    }
    throw error;
  }
}
var FTSManager = class {
  constructor(db) {
    this.db = db;
  }
  /**
  * Validate a collection slug and its searchable field names.
  * Must be called before any raw SQL interpolation.
  */
  validateInputs(collectionSlug, searchableFields) {
    validateIdentifier(collectionSlug, "collection slug");
    if (searchableFields) for (const field of searchableFields) validateIdentifier(field, "searchable field name");
  }
  /**
  * Get the FTS table name for a collection
  * Uses _emdash_ prefix to clearly mark as internal/system table
  */
  getFtsTableName(collectionSlug) {
    return `_emdash_fts_${collectionSlug}`;
  }
  /**
  * Get the content table name for a collection
  */
  getContentTableName(collectionSlug) {
    return `ec_${collectionSlug}`;
  }
  /**
  * Check if an FTS table exists for a collection
  */
  async ftsTableExists(collectionSlug) {
    const ftsTable = this.getFtsTableName(collectionSlug);
    return tableExists(this.db, ftsTable);
  }
  /**
  * Create an FTS5 virtual table for a collection.
  * FTS5 is SQLite-only; on other dialects this is a no-op.
  *
  * @param collectionSlug - The collection slug
  * @param searchableFields - Array of field names to index
  * @param weights - Optional field weights for ranking
  */
  async createFtsTable(collectionSlug, searchableFields, _weights) {
    if (!isSqlite(this.db)) return;
    this.validateInputs(collectionSlug, searchableFields);
    const ftsTable = this.getFtsTableName(collectionSlug);
    const contentTable = this.getContentTableName(collectionSlug);
    const columns = [
      "id UNINDEXED",
      "locale UNINDEXED",
      ...searchableFields
    ].join(", ");
    await sql.raw(`
			CREATE VIRTUAL TABLE IF NOT EXISTS "${ftsTable}" USING fts5(
				${columns},
				content='${contentTable}',
				content_rowid='rowid',
				tokenize='porter unicode61'
			)
		`).execute(this.db);
    await this.createTriggers(collectionSlug, searchableFields);
  }
  /**
  * Create triggers to keep FTS table in sync with content table
  */
  async createTriggers(collectionSlug, searchableFields) {
    const ftsTable = this.getFtsTableName(collectionSlug);
    const contentTable = this.getContentTableName(collectionSlug);
    const fieldList = searchableFields.join(", ");
    const newFieldList = searchableFields.map((f2) => `NEW.${f2}`).join(", ");
    await sql.raw(`
			CREATE TRIGGER IF NOT EXISTS "${ftsTable}_insert" 
			AFTER INSERT ON "${contentTable}" 
			BEGIN
				INSERT INTO "${ftsTable}"(rowid, id, locale, ${fieldList})
				VALUES (NEW.rowid, NEW.id, NEW.locale, ${newFieldList});
			END
		`).execute(this.db);
    await sql.raw(`
			CREATE TRIGGER IF NOT EXISTS "${ftsTable}_update" 
			AFTER UPDATE ON "${contentTable}" 
			BEGIN
				DELETE FROM "${ftsTable}" WHERE rowid = OLD.rowid;
				INSERT INTO "${ftsTable}"(rowid, id, locale, ${fieldList})
				VALUES (NEW.rowid, NEW.id, NEW.locale, ${newFieldList});
			END
		`).execute(this.db);
    await sql.raw(`
			CREATE TRIGGER IF NOT EXISTS "${ftsTable}_delete" 
			AFTER DELETE ON "${contentTable}" 
			BEGIN
				DELETE FROM "${ftsTable}" WHERE rowid = OLD.rowid;
			END
		`).execute(this.db);
  }
  /**
  * Drop triggers for a collection
  */
  async dropTriggers(collectionSlug) {
    const ftsTable = this.getFtsTableName(collectionSlug);
    await sql.raw(`DROP TRIGGER IF EXISTS "${ftsTable}_insert"`).execute(this.db);
    await sql.raw(`DROP TRIGGER IF EXISTS "${ftsTable}_update"`).execute(this.db);
    await sql.raw(`DROP TRIGGER IF EXISTS "${ftsTable}_delete"`).execute(this.db);
  }
  /**
  * Drop the FTS table and triggers for a collection
  */
  async dropFtsTable(collectionSlug) {
    if (!isSqlite(this.db)) return;
    this.validateInputs(collectionSlug);
    const ftsTable = this.getFtsTableName(collectionSlug);
    await this.dropTriggers(collectionSlug);
    await sql.raw(`DROP TABLE IF EXISTS "${ftsTable}"`).execute(this.db);
  }
  /**
  * Rebuild the FTS index for a collection
  *
  * This is useful after bulk imports or if the index gets out of sync.
  */
  async rebuildIndex(collectionSlug, searchableFields, weights) {
    if (!isSqlite(this.db)) return;
    await this.dropFtsTable(collectionSlug);
    await this.createFtsTable(collectionSlug, searchableFields, weights);
    await this.populateFromContent(collectionSlug, searchableFields);
  }
  /**
  * Populate the FTS table from existing content
  */
  async populateFromContent(collectionSlug, searchableFields) {
    if (!isSqlite(this.db)) return;
    this.validateInputs(collectionSlug, searchableFields);
    const ftsTable = this.getFtsTableName(collectionSlug);
    const contentTable = this.getContentTableName(collectionSlug);
    const fieldList = searchableFields.join(", ");
    await sql.raw(`
			INSERT INTO "${ftsTable}"(rowid, id, locale, ${fieldList})
			SELECT rowid, id, locale, ${fieldList} FROM "${contentTable}"
			WHERE deleted_at IS NULL
		`).execute(this.db);
  }
  /**
  * Get the search configuration for a collection
  */
  async getSearchConfig(collectionSlug) {
    const result = await this.db.selectFrom("_emdash_collections").select("search_config").where("slug", "=", collectionSlug).executeTakeFirst();
    if (!result?.search_config) return null;
    try {
      const parsed = JSON.parse(result.search_config);
      if (typeof parsed !== "object" || parsed === null || !("enabled" in parsed) || typeof parsed.enabled !== "boolean") return null;
      const config = { enabled: parsed.enabled };
      if ("weights" in parsed && typeof parsed.weights === "object" && parsed.weights !== null) {
        const weights = {};
        for (const [k2, v2] of Object.entries(parsed.weights)) if (typeof v2 === "number") weights[k2] = v2;
        config.weights = weights;
      }
      return config;
    } catch {
      return null;
    }
  }
  /**
  * Update the search configuration for a collection
  */
  async setSearchConfig(collectionSlug, config) {
    await this.db.updateTable("_emdash_collections").set({ search_config: JSON.stringify(config) }).where("slug", "=", collectionSlug).execute();
  }
  /**
  * Get searchable fields for a collection
  */
  async getSearchableFields(collectionSlug) {
    const collection = await this.db.selectFrom("_emdash_collections").select("id").where("slug", "=", collectionSlug).executeTakeFirst();
    if (!collection) return [];
    return (await this.db.selectFrom("_emdash_fields").select("slug").where("collection_id", "=", collection.id).where("searchable", "=", 1).execute()).map((f2) => f2.slug);
  }
  /**
  * Enable search for a collection
  *
  * Creates the FTS table and triggers, and populates from existing content.
  */
  async enableSearch(collectionSlug, options) {
    if (!isSqlite(this.db)) throw new Error("Full-text search is only available with SQLite databases");
    const searchableFields = await this.getSearchableFields(collectionSlug);
    if (searchableFields.length === 0) throw new Error(`No searchable fields defined for collection "${collectionSlug}". Mark at least one field as searchable before enabling search.`);
    await this.createFtsTable(collectionSlug, searchableFields, options?.weights);
    await this.populateFromContent(collectionSlug, searchableFields);
    await this.setSearchConfig(collectionSlug, {
      enabled: true,
      weights: options?.weights
    });
  }
  /**
  * Disable search for a collection
  *
  * Drops the FTS table and triggers.
  */
  async disableSearch(collectionSlug) {
    if (!isSqlite(this.db)) return;
    await this.dropFtsTable(collectionSlug);
    await this.setSearchConfig(collectionSlug, { enabled: false });
  }
  /**
  * Get index statistics for a collection
  */
  async getIndexStats(collectionSlug) {
    if (!isSqlite(this.db)) return null;
    this.validateInputs(collectionSlug);
    const ftsTable = this.getFtsTableName(collectionSlug);
    if (!await this.ftsTableExists(collectionSlug)) return null;
    return { indexed: (await sql`
			SELECT COUNT(*) as count FROM "${sql.raw(ftsTable)}"
		`.execute(this.db)).rows[0]?.count ?? 0 };
  }
  /**
  * Verify FTS index integrity and rebuild if corrupted.
  *
  * Checks for two corruption indicators:
  * 1. Row count mismatch between content table and FTS table
  * 2. FTS5 integrity-check failure (catches shadow table inconsistencies)
  *
  * Returns true if the index was rebuilt, false if it was healthy.
  */
  async verifyAndRepairIndex(collectionSlug) {
    if (!isSqlite(this.db)) return false;
    this.validateInputs(collectionSlug);
    const ftsTable = this.getFtsTableName(collectionSlug);
    const contentTable = this.getContentTableName(collectionSlug);
    if (!await this.ftsTableExists(collectionSlug)) return false;
    const contentCount = await sql`
			SELECT COUNT(*) as count FROM ${sql.ref(contentTable)}
			WHERE deleted_at IS NULL
		`.execute(this.db);
    const ftsCount = await sql`
			SELECT COUNT(*) as count FROM "${sql.raw(ftsTable)}"
		`.execute(this.db);
    const contentRows = contentCount.rows[0]?.count ?? 0;
    const ftsRows = ftsCount.rows[0]?.count ?? 0;
    if (contentRows !== ftsRows) {
      console.warn(`FTS index for "${collectionSlug}" has ${ftsRows} rows but content table has ${contentRows}. Rebuilding.`);
      const fields = await this.getSearchableFields(collectionSlug);
      const config = await this.getSearchConfig(collectionSlug);
      if (fields.length > 0) await this.rebuildIndex(collectionSlug, fields, config?.weights);
      return true;
    }
    try {
      await sql.raw(`INSERT INTO "${ftsTable}"("${ftsTable}") VALUES('integrity-check')`).execute(this.db);
    } catch {
      console.warn(`FTS integrity check failed for "${collectionSlug}". Rebuilding index.`);
      const fields = await this.getSearchableFields(collectionSlug);
      const config = await this.getSearchConfig(collectionSlug);
      if (fields.length > 0) await this.rebuildIndex(collectionSlug, fields, config?.weights);
      return true;
    }
    return false;
  }
  /**
  * Verify and repair FTS indexes for all search-enabled collections.
  *
  * Intended to run at startup to auto-heal any corruption from
  * previous process crashes.
  */
  async verifyAndRepairAll() {
    if (!isSqlite(this.db)) return 0;
    const collections = await this.db.selectFrom("_emdash_collections").select("slug").where("search_config", "is not", null).execute();
    let repaired = 0;
    for (const { slug } of collections) {
      if (!(await this.getSearchConfig(slug))?.enabled) continue;
      try {
        if (await this.verifyAndRepairIndex(slug)) repaired++;
      } catch (error) {
        console.error(`Failed to verify/repair FTS index for "${slug}":`, error);
      }
    }
    return repaired;
  }
};
const SLUG_VALIDATION_PATTERN = /^[a-z][a-z0-9_]*$/;
const EC_PREFIX_PATTERN = /^ec_/;
const SINGLE_QUOTE_PATTERN = /'/g;
const UNDERSCORE_PATTERN = /_/g;
const WORD_BOUNDARY_PATTERN = /\b\w/g;
const COLUMN_TYPES = /* @__PURE__ */ new Set([
  "TEXT",
  "REAL",
  "INTEGER",
  "JSON"
]);
const VALID_SOURCES = /* @__PURE__ */ new Set([
  "manual",
  "discovered",
  "seed"
]);
function isCollectionSource(value) {
  return VALID_SOURCES.has(value) || value.startsWith("template:") || value.startsWith("import:");
}
function isFieldType(value) {
  return value in FIELD_TYPE_TO_COLUMN;
}
function isColumnType(value) {
  return COLUMN_TYPES.has(value);
}
var SchemaError = class extends Error {
  constructor(message, code, details) {
    super(message);
    this.code = code;
    this.details = details;
    this.name = "SchemaError";
  }
};
var SchemaRegistry = class {
  constructor(db) {
    this.db = db;
  }
  /**
  * List all collections
  */
  async listCollections() {
    return (await this.db.selectFrom("_emdash_collections").selectAll().orderBy("slug", "asc").execute()).map(this.mapCollectionRow);
  }
  /**
  * Get a collection by slug
  */
  async getCollection(slug) {
    const row = await this.db.selectFrom("_emdash_collections").where("slug", "=", slug).selectAll().executeTakeFirst();
    return row ? this.mapCollectionRow(row) : null;
  }
  /**
  * Get a collection with all its fields
  */
  async getCollectionWithFields(slug) {
    const collection = await this.getCollection(slug);
    if (!collection) return null;
    const fields = await this.listFields(collection.id);
    return {
      ...collection,
      fields
    };
  }
  /**
  * Create a new collection
  */
  async createCollection(input) {
    this.validateSlug(input.slug, "collection");
    if (RESERVED_COLLECTION_SLUGS.includes(input.slug)) throw new SchemaError(`Collection slug "${input.slug}" is reserved`, "RESERVED_SLUG");
    if (await this.getCollection(input.slug)) throw new SchemaError(`Collection "${input.slug}" already exists`, "COLLECTION_EXISTS");
    const id = ulid();
    const hasSeo = input.hasSeo ?? input.supports?.includes("seo") ?? false;
    await withTransaction(this.db, async (trx) => {
      await trx.insertInto("_emdash_collections").values({
        id,
        slug: input.slug,
        label: input.label,
        label_singular: input.labelSingular ?? null,
        description: input.description ?? null,
        icon: input.icon ?? null,
        supports: input.supports ? JSON.stringify(input.supports) : null,
        source: input.source ?? "manual",
        has_seo: hasSeo ? 1 : 0,
        comments_enabled: input.commentsEnabled ? 1 : 0,
        url_pattern: input.urlPattern ?? null
      }).execute();
      await this.createContentTable(input.slug, trx);
    });
    const collection = await this.getCollection(input.slug);
    if (!collection) throw new SchemaError("Failed to create collection", "CREATE_FAILED");
    return collection;
  }
  /**
  * Update a collection
  */
  async updateCollection(slug, input) {
    const existing = await this.getCollection(slug);
    if (!existing) throw new SchemaError(`Collection "${slug}" not found`, "COLLECTION_NOT_FOUND");
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const supportsArray = input.supports ?? existing.supports;
    const hasSeo = input.hasSeo !== void 0 ? input.hasSeo : input.supports !== void 0 ? supportsArray.includes("seo") : existing.hasSeo;
    await this.db.updateTable("_emdash_collections").set({
      label: input.label ?? existing.label,
      label_singular: input.labelSingular ?? existing.labelSingular ?? null,
      description: input.description ?? existing.description ?? null,
      icon: input.icon ?? existing.icon ?? null,
      supports: input.supports ? JSON.stringify(input.supports) : JSON.stringify(existing.supports),
      url_pattern: input.urlPattern !== void 0 ? input.urlPattern ?? null : existing.urlPattern ?? null,
      has_seo: hasSeo ? 1 : 0,
      comments_enabled: input.commentsEnabled !== void 0 ? input.commentsEnabled ? 1 : 0 : existing.commentsEnabled ? 1 : 0,
      comments_moderation: input.commentsModeration ?? existing.commentsModeration,
      comments_closed_after_days: input.commentsClosedAfterDays !== void 0 ? input.commentsClosedAfterDays : existing.commentsClosedAfterDays,
      comments_auto_approve_users: input.commentsAutoApproveUsers !== void 0 ? input.commentsAutoApproveUsers ? 1 : 0 : existing.commentsAutoApproveUsers ? 1 : 0,
      updated_at: now
    }).where("slug", "=", slug).execute();
    const updated = await this.getCollection(slug);
    if (!updated) throw new SchemaError("Failed to update collection", "UPDATE_FAILED");
    return updated;
  }
  /**
  * Delete a collection
  */
  async deleteCollection(slug, options) {
    const existing = await this.getCollection(slug);
    if (!existing) throw new SchemaError(`Collection "${slug}" not found`, "COLLECTION_NOT_FOUND");
    if (!options?.force) {
      if (await this.collectionHasContent(slug)) throw new SchemaError(`Collection "${slug}" has content. Use force: true to delete.`, "COLLECTION_HAS_CONTENT");
    }
    await this.dropContentTable(slug);
    await this.db.deleteFrom("_emdash_collections").where("id", "=", existing.id).execute();
  }
  /**
  * List fields for a collection
  */
  async listFields(collectionId) {
    return (await this.db.selectFrom("_emdash_fields").where("collection_id", "=", collectionId).selectAll().orderBy("sort_order", "asc").orderBy("created_at", "asc").execute()).map(this.mapFieldRow);
  }
  /**
  * Get a field by slug within a collection
  */
  async getField(collectionSlug, fieldSlug) {
    const collection = await this.getCollection(collectionSlug);
    if (!collection) return null;
    const row = await this.db.selectFrom("_emdash_fields").where("collection_id", "=", collection.id).where("slug", "=", fieldSlug).selectAll().executeTakeFirst();
    return row ? this.mapFieldRow(row) : null;
  }
  /**
  * Create a new field
  */
  async createField(collectionSlug, input) {
    const collection = await this.getCollection(collectionSlug);
    if (!collection) throw new SchemaError(`Collection "${collectionSlug}" not found`, "COLLECTION_NOT_FOUND");
    this.validateSlug(input.slug, "field");
    if (RESERVED_FIELD_SLUGS.includes(input.slug)) throw new SchemaError(`Field slug "${input.slug}" is reserved`, "RESERVED_SLUG");
    if (await this.getField(collectionSlug, input.slug)) throw new SchemaError(`Field "${input.slug}" already exists in collection "${collectionSlug}"`, "FIELD_EXISTS");
    const id = ulid();
    const columnType = FIELD_TYPE_TO_COLUMN[input.type];
    const maxSort = await this.db.selectFrom("_emdash_fields").where("collection_id", "=", collection.id).select((eb) => eb.fn.max("sort_order").as("max")).executeTakeFirst();
    const sortOrder = input.sortOrder ?? (maxSort?.max ?? -1) + 1;
    await this.db.insertInto("_emdash_fields").values({
      id,
      collection_id: collection.id,
      slug: input.slug,
      label: input.label,
      type: input.type,
      column_type: columnType,
      required: input.required ? 1 : 0,
      unique: input.unique ? 1 : 0,
      default_value: input.defaultValue !== void 0 ? JSON.stringify(input.defaultValue) : null,
      validation: input.validation ? JSON.stringify(input.validation) : null,
      widget: input.widget ?? null,
      options: input.options ? JSON.stringify(input.options) : null,
      sort_order: sortOrder,
      searchable: input.searchable ? 1 : 0,
      translatable: input.translatable === false ? 0 : 1
    }).execute();
    await this.addColumn(collectionSlug, input.slug, input.type, {
      required: input.required,
      defaultValue: input.defaultValue
    });
    const field = await this.getField(collectionSlug, input.slug);
    if (!field) throw new SchemaError("Failed to create field", "CREATE_FAILED");
    return field;
  }
  /**
  * Update a field
  */
  async updateField(collectionSlug, fieldSlug, input) {
    const field = await this.getField(collectionSlug, fieldSlug);
    if (!field) throw new SchemaError(`Field "${fieldSlug}" not found in collection "${collectionSlug}"`, "FIELD_NOT_FOUND");
    await this.db.updateTable("_emdash_fields").set({
      label: input.label ?? field.label,
      required: input.required !== void 0 ? input.required ? 1 : 0 : field.required ? 1 : 0,
      unique: input.unique !== void 0 ? input.unique ? 1 : 0 : field.unique ? 1 : 0,
      searchable: input.searchable !== void 0 ? input.searchable ? 1 : 0 : field.searchable ? 1 : 0,
      translatable: input.translatable !== void 0 ? input.translatable ? 1 : 0 : field.translatable ? 1 : 0,
      default_value: input.defaultValue !== void 0 ? JSON.stringify(input.defaultValue) : field.defaultValue !== void 0 ? JSON.stringify(field.defaultValue) : null,
      validation: input.validation ? JSON.stringify(input.validation) : field.validation ? JSON.stringify(field.validation) : null,
      widget: input.widget ?? field.widget ?? null,
      options: input.options ? JSON.stringify(input.options) : field.options ? JSON.stringify(field.options) : null,
      sort_order: input.sortOrder ?? field.sortOrder
    }).where("id", "=", field.id).execute();
    const updated = await this.getField(collectionSlug, fieldSlug);
    if (!updated) throw new SchemaError("Failed to update field", "UPDATE_FAILED");
    if (input.searchable !== void 0 && input.searchable !== field.searchable) await this.rebuildSearchIndex(collectionSlug);
    return updated;
  }
  /**
  * Rebuild the search index for a collection
  *
  * Called when searchable fields change. If search is enabled for the collection,
  * this will rebuild the FTS table with the updated field list.
  */
  async rebuildSearchIndex(collectionSlug) {
    const ftsManager = new FTSManager(this.db);
    const config = await ftsManager.getSearchConfig(collectionSlug);
    if (!config?.enabled) return;
    const searchableFields = await ftsManager.getSearchableFields(collectionSlug);
    if (searchableFields.length === 0) await ftsManager.disableSearch(collectionSlug);
    else await ftsManager.rebuildIndex(collectionSlug, searchableFields, config.weights);
  }
  /**
  * Delete a field
  */
  async deleteField(collectionSlug, fieldSlug) {
    const field = await this.getField(collectionSlug, fieldSlug);
    if (!field) throw new SchemaError(`Field "${fieldSlug}" not found in collection "${collectionSlug}"`, "FIELD_NOT_FOUND");
    await this.dropColumn(collectionSlug, fieldSlug);
    await this.db.deleteFrom("_emdash_fields").where("id", "=", field.id).execute();
  }
  /**
  * Reorder fields
  */
  async reorderFields(collectionSlug, fieldSlugs) {
    const collection = await this.getCollection(collectionSlug);
    if (!collection) throw new SchemaError(`Collection "${collectionSlug}" not found`, "COLLECTION_NOT_FOUND");
    for (let i = 0; i < fieldSlugs.length; i++) await this.db.updateTable("_emdash_fields").set({ sort_order: i }).where("collection_id", "=", collection.id).where("slug", "=", fieldSlugs[i]).execute();
  }
  /**
  * Create a content table for a collection
  */
  async createContentTable(slug, db) {
    const conn = db ?? this.db;
    const tableName = this.getTableName(slug);
    await conn.schema.createTable(tableName).addColumn("id", "text", (col) => col.primaryKey()).addColumn("slug", "text").addColumn("status", "text", (col) => col.defaultTo("draft")).addColumn("author_id", "text").addColumn("primary_byline_id", "text").addColumn("created_at", "text", (col) => col.defaultTo(currentTimestamp(conn))).addColumn("updated_at", "text", (col) => col.defaultTo(currentTimestamp(conn))).addColumn("published_at", "text").addColumn("scheduled_at", "text").addColumn("deleted_at", "text").addColumn("version", "integer", (col) => col.defaultTo(1)).addColumn("live_revision_id", "text", (col) => col.references("revisions.id")).addColumn("draft_revision_id", "text", (col) => col.references("revisions.id")).addColumn("locale", "text", (col) => col.notNull().defaultTo("en")).addColumn("translation_group", "text").addUniqueConstraint(`${tableName}_slug_locale_unique`, ["slug", "locale"]).execute();
    await sql`
			CREATE INDEX ${sql.ref(`idx_${tableName}_status`)} 
			ON ${sql.ref(tableName)} (status)
		`.execute(conn);
    await sql`
			CREATE INDEX ${sql.ref(`idx_${tableName}_slug`)} 
			ON ${sql.ref(tableName)} (slug)
		`.execute(conn);
    await sql`
			CREATE INDEX ${sql.ref(`idx_${tableName}_created`)} 
			ON ${sql.ref(tableName)} (created_at)
		`.execute(conn);
    await sql`
			CREATE INDEX ${sql.ref(`idx_${tableName}_deleted`)} 
			ON ${sql.ref(tableName)} (deleted_at)
		`.execute(conn);
    await sql`
			CREATE INDEX ${sql.ref(`idx_${tableName}_scheduled`)} 
			ON ${sql.ref(tableName)} (scheduled_at)
			WHERE scheduled_at IS NOT NULL
		`.execute(conn);
    await sql`
			CREATE INDEX ${sql.ref(`idx_${tableName}_live_revision`)} 
			ON ${sql.ref(tableName)} (live_revision_id)
		`.execute(conn);
    await sql`
			CREATE INDEX ${sql.ref(`idx_${tableName}_draft_revision`)} 
			ON ${sql.ref(tableName)} (draft_revision_id)
		`.execute(conn);
    await sql`
			CREATE INDEX ${sql.ref(`idx_${tableName}_author`)} 
			ON ${sql.ref(tableName)} (author_id)
		`.execute(conn);
    await sql`
			CREATE INDEX ${sql.ref(`idx_${tableName}_primary_byline`)} 
			ON ${sql.ref(tableName)} (primary_byline_id)
		`.execute(conn);
    await sql`
			CREATE INDEX ${sql.ref(`idx_${tableName}_updated`)} 
			ON ${sql.ref(tableName)} (updated_at)
		`.execute(conn);
    await sql`
			CREATE INDEX ${sql.ref(`idx_${tableName}_locale`)} 
			ON ${sql.ref(tableName)} (locale)
		`.execute(conn);
    await sql`
			CREATE INDEX ${sql.ref(`idx_${tableName}_translation_group`)} 
			ON ${sql.ref(tableName)} (translation_group)
		`.execute(conn);
  }
  /**
  * Drop a content table
  */
  async dropContentTable(slug) {
    const tableName = this.getTableName(slug);
    await sql`DROP TABLE IF EXISTS ${sql.ref(tableName)}`.execute(this.db);
  }
  /**
  * Add a column to a content table
  */
  async addColumn(collectionSlug, fieldSlug, fieldType, options) {
    const tableName = this.getTableName(collectionSlug);
    const columnType = FIELD_TYPE_TO_COLUMN[fieldType];
    const columnName = this.getColumnName(fieldSlug);
    if (options?.required && options?.defaultValue !== void 0) {
      const defaultVal = this.formatDefaultValue(options.defaultValue, fieldType);
      await sql`
				ALTER TABLE ${sql.ref(tableName)} 
				ADD COLUMN ${sql.ref(columnName)} ${sql.raw(columnType)} NOT NULL DEFAULT ${sql.raw(defaultVal)}
			`.execute(this.db);
    } else if (options?.required) {
      const defaultVal = this.getEmptyDefault(fieldType);
      await sql`
				ALTER TABLE ${sql.ref(tableName)} 
				ADD COLUMN ${sql.ref(columnName)} ${sql.raw(columnType)} NOT NULL DEFAULT ${sql.raw(defaultVal)}
			`.execute(this.db);
    } else await sql`
				ALTER TABLE ${sql.ref(tableName)} 
				ADD COLUMN ${sql.ref(columnName)} ${sql.raw(columnType)}
			`.execute(this.db);
  }
  /**
  * Drop a column from a content table
  */
  async dropColumn(collectionSlug, fieldSlug) {
    const tableName = this.getTableName(collectionSlug);
    const columnName = this.getColumnName(fieldSlug);
    await sql`
			ALTER TABLE ${sql.ref(tableName)} 
			DROP COLUMN ${sql.ref(columnName)}
		`.execute(this.db);
  }
  /**
  * Check if a collection has any content
  */
  async collectionHasContent(slug) {
    const tableName = this.getTableName(slug);
    try {
      return ((await sql`
				SELECT COUNT(*) as count FROM ${sql.ref(tableName)} 
				WHERE deleted_at IS NULL
			`.execute(this.db)).rows[0]?.count ?? 0) > 0;
    } catch {
      return false;
    }
  }
  /**
  * Get table name for a collection
  */
  getTableName(slug) {
    return `ec_${slug}`;
  }
  /**
  * Get column name for a field
  */
  getColumnName(slug) {
    return slug;
  }
  /**
  * Validate a slug
  */
  validateSlug(slug, type) {
    if (!slug || typeof slug !== "string") throw new SchemaError(`${type} slug is required`, "INVALID_SLUG");
    if (!SLUG_VALIDATION_PATTERN.test(slug)) throw new SchemaError(`${type} slug must start with a letter and contain only lowercase letters, numbers, and underscores`, "INVALID_SLUG");
    if (slug.length > 63) throw new SchemaError(`${type} slug must be 63 characters or less`, "INVALID_SLUG");
  }
  /**
  * Format a default value for SQL.
  *
  * SQLite `ALTER TABLE ADD COLUMN ... DEFAULT` requires a literal constant
  * expression — parameterized values cannot be used here. We manually escape
  * single quotes and coerce types to ensure the output is safe.
  *
  * INTEGER/REAL values are coerced through `Number()` which can only produce
  * digits, `.`, `-`, `e`, `Infinity`, or `NaN` — all safe in SQL.
  * TEXT/JSON values have single quotes escaped via SQL standard doubling (`''`).
  */
  formatDefaultValue(value, fieldType) {
    if (value === null || value === void 0) return "NULL";
    const columnType = FIELD_TYPE_TO_COLUMN[fieldType];
    if (columnType === "JSON") return `'${JSON.stringify(value).replace(SINGLE_QUOTE_PATTERN, "''")}'`;
    if (columnType === "INTEGER") {
      if (typeof value === "boolean") return value ? "1" : "0";
      const num = Number(value);
      if (!Number.isFinite(num)) return "0";
      return String(Math.trunc(num));
    }
    if (columnType === "REAL") {
      const num = Number(value);
      if (!Number.isFinite(num)) return "0";
      return String(num);
    }
    let text;
    if (typeof value === "string") text = value;
    else if (typeof value === "number" || typeof value === "boolean") text = String(value);
    else if (typeof value === "object" && value !== null) text = JSON.stringify(value);
    else text = "";
    return `'${text.replace(SINGLE_QUOTE_PATTERN, "''")}'`;
  }
  /**
  * Get empty default for a field type
  */
  getEmptyDefault(fieldType) {
    switch (FIELD_TYPE_TO_COLUMN[fieldType]) {
      case "INTEGER":
        return "0";
      case "REAL":
        return "0.0";
      case "JSON":
        return "'null'";
      default:
        return "''";
    }
  }
  /**
  * Map a collection row to a Collection object
  */
  mapCollectionRow = (row) => {
    const moderation = row.comments_moderation;
    return {
      id: row.id,
      slug: row.slug,
      label: row.label,
      labelSingular: row.label_singular ?? void 0,
      description: row.description ?? void 0,
      icon: row.icon ?? void 0,
      supports: row.supports ? JSON.parse(row.supports) : [],
      source: row.source && isCollectionSource(row.source) ? row.source : void 0,
      hasSeo: row.has_seo === 1,
      urlPattern: row.url_pattern ?? void 0,
      commentsEnabled: row.comments_enabled === 1,
      commentsModeration: moderation === "all" || moderation === "first_time" || moderation === "none" ? moderation : "first_time",
      commentsClosedAfterDays: row.comments_closed_after_days ?? 90,
      commentsAutoApproveUsers: row.comments_auto_approve_users === 1,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  };
  /**
  * Map a field row to a Field object
  */
  mapFieldRow = (row) => {
    return {
      id: row.id,
      collectionId: row.collection_id,
      slug: row.slug,
      label: row.label,
      type: isFieldType(row.type) ? row.type : "string",
      columnType: isColumnType(row.column_type) ? row.column_type : "TEXT",
      required: row.required === 1,
      unique: row.unique === 1,
      defaultValue: row.default_value ? JSON.parse(row.default_value) : void 0,
      validation: row.validation ? JSON.parse(row.validation) : void 0,
      widget: row.widget ?? void 0,
      options: row.options ? JSON.parse(row.options) : void 0,
      sortOrder: row.sort_order,
      searchable: row.searchable === 1,
      translatable: row.translatable !== 0,
      createdAt: row.created_at
    };
  };
  /**
  * Discover orphaned content tables
  *
  * Finds ec_* tables that exist in the database but don't have a
  * corresponding entry in _emdash_collections.
  */
  async discoverOrphanedTables() {
    const allTables = await listTablesLike(this.db, "ec_%");
    const registered = await this.listCollections();
    const registeredSlugs = new Set(registered.map((c) => c.slug));
    const orphans = [];
    for (const tableName of allTables) {
      const slug = tableName.replace(EC_PREFIX_PATTERN, "");
      if (!registeredSlugs.has(slug)) try {
        const countResult = await sql`
						SELECT COUNT(*) as count FROM ${sql.ref(tableName)}
						WHERE deleted_at IS NULL
					`.execute(this.db);
        orphans.push({
          slug,
          tableName,
          rowCount: countResult.rows[0]?.count ?? 0
        });
      } catch {
        orphans.push({
          slug,
          tableName,
          rowCount: 0
        });
      }
    }
    return orphans;
  }
  /**
  * Register an orphaned table as a collection
  *
  * Creates a _emdash_collections entry for an existing ec_* table.
  */
  async registerOrphanedTable(slug, options) {
    const tableName = this.getTableName(slug);
    if (!await tableExists(this.db, tableName)) throw new SchemaError(`Table "${tableName}" does not exist`, "TABLE_NOT_FOUND");
    if (await this.getCollection(slug)) throw new SchemaError(`Collection "${slug}" is already registered`, "COLLECTION_EXISTS");
    const id = ulid();
    const label = options?.label || this.slugToLabel(slug);
    await this.db.insertInto("_emdash_collections").values({
      id,
      slug,
      label,
      label_singular: options?.labelSingular ?? null,
      description: options?.description ?? null,
      icon: null,
      supports: JSON.stringify([]),
      source: "discovered",
      has_seo: 0,
      url_pattern: null
    }).execute();
    const collection = await this.getCollection(slug);
    if (!collection) throw new SchemaError("Failed to register orphaned table", "REGISTER_FAILED");
    return collection;
  }
  /**
  * Convert slug to human-readable label
  */
  slugToLabel(slug) {
    return slug.replace(UNDERSCORE_PATTERN, " ").replace(WORD_BOUNDARY_PATTERN, (c) => c.toUpperCase());
  }
};
const PARAM_PATTERN = /\[(\w+)\]/g;
const SPLAT_PATTERN = /\[\.\.\.(\w+)\]/g;
const ANY_PLACEHOLDER = /\[(?:\.\.\.)?(\w+)\]/g;
const CAPTURE_GROUP_SPLIT = /(\([^)]+\))/;
const REGEX_SPECIAL_CHARS = /[.*+?^${}|\\]/g;
function isPattern(source) {
  return source.match(ANY_PLACEHOLDER) !== null;
}
function compilePattern(source) {
  const paramNames = [];
  let regexStr = source.replace(SPLAT_PATTERN, (_match, name) => {
    paramNames.push(name);
    return "(.+)";
  });
  regexStr = regexStr.replace(PARAM_PATTERN, (_match, name) => {
    paramNames.push(name);
    return "([^/]+)";
  });
  const escaped = regexStr.split(CAPTURE_GROUP_SPLIT).map((part, i) => {
    if (i % 2 === 1) return part;
    return part.replace(REGEX_SPECIAL_CHARS, "\\$&");
  }).join("");
  return {
    regex: new RegExp(`^${escaped}$`),
    paramNames,
    source
  };
}
function matchPattern(compiled, path) {
  const match = path.match(compiled.regex);
  if (!match) return null;
  const params = {};
  for (let i = 0; i < compiled.paramNames.length; i++) {
    const value = match[i + 1];
    if (value !== void 0) params[compiled.paramNames[i]] = value;
  }
  return params;
}
function interpolateDestination(destination, params) {
  let result = destination.replace(SPLAT_PATTERN, (_match, name) => {
    return params[name] ?? "";
  });
  result = result.replace(PARAM_PATTERN, (_match, name) => {
    return params[name] ?? "";
  });
  return result;
}
function rowToRedirect(row) {
  return {
    id: row.id,
    source: row.source,
    destination: row.destination,
    type: row.type,
    isPattern: row.is_pattern === 1,
    enabled: row.enabled === 1,
    hits: row.hits,
    lastHitAt: row.last_hit_at,
    groupName: row.group_name,
    auto: row.auto === 1,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}
var RedirectRepository = class {
  constructor(db) {
    this.db = db;
  }
  async findById(id) {
    const row = await this.db.selectFrom("_emdash_redirects").selectAll().where("id", "=", id).executeTakeFirst();
    return row ? rowToRedirect(row) : null;
  }
  async findBySource(source) {
    const row = await this.db.selectFrom("_emdash_redirects").selectAll().where("source", "=", source).executeTakeFirst();
    return row ? rowToRedirect(row) : null;
  }
  async findMany(opts) {
    const limit = Math.min(Math.max(opts.limit ?? 50, 1), 100);
    let query = this.db.selectFrom("_emdash_redirects").selectAll().orderBy("created_at", "desc").orderBy("id", "desc").limit(limit + 1);
    if (opts.search) {
      const term = `%${opts.search}%`;
      query = query.where((eb) => eb.or([eb("source", "like", term), eb("destination", "like", term)]));
    }
    if (opts.group !== void 0) query = query.where("group_name", "=", opts.group);
    if (opts.enabled !== void 0) query = query.where("enabled", "=", opts.enabled ? 1 : 0);
    if (opts.auto !== void 0) query = query.where("auto", "=", opts.auto ? 1 : 0);
    if (opts.cursor) {
      const decoded = decodeCursor(opts.cursor);
      if (decoded) query = query.where((eb) => eb.or([eb("created_at", "<", decoded.orderValue), eb.and([eb("created_at", "=", decoded.orderValue), eb("id", "<", decoded.id)])]));
    }
    const rows = await query.execute();
    const items = rows.slice(0, limit).map(rowToRedirect);
    const result = { items };
    if (rows.length > limit) {
      const last = items.at(-1);
      result.nextCursor = encodeCursor(last.createdAt, last.id);
    }
    return result;
  }
  async create(input) {
    const id = ulid();
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const patternFlag = input.isPattern ?? isPattern(input.source);
    await this.db.insertInto("_emdash_redirects").values({
      id,
      source: input.source,
      destination: input.destination,
      type: input.type ?? 301,
      is_pattern: patternFlag ? 1 : 0,
      enabled: input.enabled !== false ? 1 : 0,
      hits: 0,
      last_hit_at: null,
      group_name: input.groupName ?? null,
      auto: input.auto ? 1 : 0,
      created_at: now,
      updated_at: now
    }).execute();
    return await this.findById(id);
  }
  async update(id, input) {
    if (!await this.findById(id)) return null;
    const values = { updated_at: (/* @__PURE__ */ new Date()).toISOString() };
    if (input.source !== void 0) {
      values.source = input.source;
      values.is_pattern = input.isPattern !== void 0 ? input.isPattern ? 1 : 0 : isPattern(input.source) ? 1 : 0;
    } else if (input.isPattern !== void 0) values.is_pattern = input.isPattern ? 1 : 0;
    if (input.destination !== void 0) values.destination = input.destination;
    if (input.type !== void 0) values.type = input.type;
    if (input.enabled !== void 0) values.enabled = input.enabled ? 1 : 0;
    if (input.groupName !== void 0) values.group_name = input.groupName;
    await this.db.updateTable("_emdash_redirects").set(values).where("id", "=", id).execute();
    return await this.findById(id);
  }
  async delete(id) {
    const result = await this.db.deleteFrom("_emdash_redirects").where("id", "=", id).executeTakeFirst();
    return BigInt(result.numDeletedRows) > 0n;
  }
  async findExactMatch(path) {
    const row = await this.db.selectFrom("_emdash_redirects").selectAll().where("source", "=", path).where("enabled", "=", 1).where("is_pattern", "=", 0).executeTakeFirst();
    return row ? rowToRedirect(row) : null;
  }
  async findEnabledPatternRules() {
    return (await this.db.selectFrom("_emdash_redirects").selectAll().where("enabled", "=", 1).where("is_pattern", "=", 1).execute()).map(rowToRedirect);
  }
  /**
  * Match a request path against all enabled redirect rules.
  * Checks exact matches first (indexed), then pattern rules.
  * Returns the matched redirect and the resolved destination URL.
  */
  async matchPath(path) {
    const exact = await this.findExactMatch(path);
    if (exact) return {
      redirect: exact,
      resolvedDestination: exact.destination
    };
    const patterns = await this.findEnabledPatternRules();
    for (const redirect of patterns) {
      const params = matchPattern(compilePattern(redirect.source), path);
      if (params) return {
        redirect,
        resolvedDestination: interpolateDestination(redirect.destination, params)
      };
    }
    return null;
  }
  async recordHit(id) {
    await sql`
			UPDATE _emdash_redirects
			SET hits = hits + 1, last_hit_at = ${currentTimestampValue(this.db)}, updated_at = ${currentTimestampValue(this.db)}
			WHERE id = ${id}
		`.execute(this.db);
  }
  /**
  * Create an auto-redirect when a content slug changes.
  * Uses the collection's URL pattern to compute old/new URLs.
  * Collapses existing redirect chains pointing to the old URL.
  */
  async createAutoRedirect(collection, oldSlug, newSlug, contentId, urlPattern) {
    const oldUrl = urlPattern ? urlPattern.replace("{slug}", oldSlug).replace("{id}", contentId) : `/${collection}/${oldSlug}`;
    const newUrl = urlPattern ? urlPattern.replace("{slug}", newSlug).replace("{id}", contentId) : `/${collection}/${newSlug}`;
    await this.collapseChains(oldUrl, newUrl);
    const existing = await this.findBySource(oldUrl);
    if (existing) return await this.update(existing.id, { destination: newUrl });
    return this.create({
      source: oldUrl,
      destination: newUrl,
      type: 301,
      isPattern: false,
      auto: true,
      groupName: "Auto: slug change"
    });
  }
  /**
  * Update all redirects whose destination matches oldDestination
  * to point to newDestination instead. Prevents redirect chains.
  * Returns the number of updated rows.
  */
  async collapseChains(oldDestination, newDestination) {
    const result = await this.db.updateTable("_emdash_redirects").set({
      destination: newDestination,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    }).where("destination", "=", oldDestination).executeTakeFirst();
    return Number(result.numUpdatedRows);
  }
  async log404(entry) {
    await this.db.insertInto("_emdash_404_log").values({
      id: ulid(),
      path: entry.path,
      referrer: entry.referrer ?? null,
      user_agent: entry.userAgent ?? null,
      ip: entry.ip ?? null,
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    }).execute();
  }
  async find404s(opts) {
    const limit = Math.min(Math.max(opts.limit ?? 50, 1), 100);
    let query = this.db.selectFrom("_emdash_404_log").selectAll().orderBy("created_at", "desc").orderBy("id", "desc").limit(limit + 1);
    if (opts.search) query = query.where("path", "like", `%${opts.search}%`);
    if (opts.cursor) {
      const decoded = decodeCursor(opts.cursor);
      if (decoded) query = query.where((eb) => eb.or([eb("created_at", "<", decoded.orderValue), eb.and([eb("created_at", "=", decoded.orderValue), eb("id", "<", decoded.id)])]));
    }
    const rows = await query.execute();
    const items = rows.slice(0, limit).map((row) => ({
      id: row.id,
      path: row.path,
      referrer: row.referrer,
      userAgent: row.user_agent,
      ip: row.ip,
      createdAt: row.created_at
    }));
    const result = { items };
    if (rows.length > limit) {
      const last = items.at(-1);
      result.nextCursor = encodeCursor(last.createdAt, last.id);
    }
    return result;
  }
  async get404Summary(limit = 50) {
    return (await sql`
			SELECT
				path,
				COUNT(*) as count,
				MAX(created_at) as last_seen,
				(
					SELECT referrer FROM _emdash_404_log AS inner_log
					WHERE inner_log.path = _emdash_404_log.path
						AND referrer IS NOT NULL AND referrer != ''
					GROUP BY referrer
					ORDER BY COUNT(*) DESC
					LIMIT 1
				) as top_referrer
			FROM _emdash_404_log
			GROUP BY path
			ORDER BY count DESC
			LIMIT ${limit}
		`.execute(this.db)).rows.map((row) => ({
      path: row.path,
      count: Number(row.count),
      lastSeen: row.last_seen,
      topReferrer: row.top_referrer
    }));
  }
  async delete404(id) {
    const result = await this.db.deleteFrom("_emdash_404_log").where("id", "=", id).executeTakeFirst();
    return BigInt(result.numDeletedRows) > 0n;
  }
  async clear404s() {
    const result = await this.db.deleteFrom("_emdash_404_log").executeTakeFirst();
    return Number(result.numDeletedRows);
  }
  async prune404s(olderThan) {
    const result = await this.db.deleteFrom("_emdash_404_log").where("created_at", "<", olderThan).executeTakeFirst();
    return Number(result.numDeletedRows);
  }
};
function rowToByline(row) {
  return {
    id: row.id,
    slug: row.slug,
    displayName: row.display_name,
    bio: row.bio,
    avatarMediaId: row.avatar_media_id,
    websiteUrl: row.website_url,
    userId: row.user_id,
    isGuest: row.is_guest === 1,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}
var BylineRepository = class {
  constructor(db) {
    this.db = db;
  }
  async findById(id) {
    const row = await this.db.selectFrom("_emdash_bylines").selectAll().where("id", "=", id).executeTakeFirst();
    return row ? rowToByline(row) : null;
  }
  async findBySlug(slug) {
    const row = await this.db.selectFrom("_emdash_bylines").selectAll().where("slug", "=", slug).executeTakeFirst();
    return row ? rowToByline(row) : null;
  }
  async findByUserId(userId) {
    const row = await this.db.selectFrom("_emdash_bylines").selectAll().where("user_id", "=", userId).executeTakeFirst();
    return row ? rowToByline(row) : null;
  }
  async findMany(options) {
    const limit = Math.min(Math.max(options?.limit ?? 50, 1), 100);
    let query = this.db.selectFrom("_emdash_bylines").selectAll().orderBy("created_at", "desc").orderBy("id", "desc").limit(limit + 1);
    if (options?.search) {
      const term = `%${options.search.replaceAll("\\", "\\\\").replaceAll("%", "\\%").replaceAll("_", "\\_")}%`;
      query = query.where((eb) => eb.or([eb("display_name", "like", term), eb("slug", "like", term)]));
    }
    if (options?.isGuest !== void 0) query = query.where("is_guest", "=", options.isGuest ? 1 : 0);
    if (options?.userId !== void 0) query = query.where("user_id", "=", options.userId);
    if (options?.cursor) {
      const decoded = decodeCursor(options.cursor);
      if (decoded) query = query.where((eb) => eb.or([eb("created_at", "<", decoded.orderValue), eb.and([eb("created_at", "=", decoded.orderValue), eb("id", "<", decoded.id)])]));
    }
    const rows = await query.execute();
    const items = rows.slice(0, limit).map(rowToByline);
    const result = { items };
    if (rows.length > limit) {
      const last = items.at(-1);
      if (last) result.nextCursor = encodeCursor(last.createdAt, last.id);
    }
    return result;
  }
  async create(input) {
    const id = ulid();
    const now = (/* @__PURE__ */ new Date()).toISOString();
    await this.db.insertInto("_emdash_bylines").values({
      id,
      slug: input.slug,
      display_name: input.displayName,
      bio: input.bio ?? null,
      avatar_media_id: input.avatarMediaId ?? null,
      website_url: input.websiteUrl ?? null,
      user_id: input.userId ?? null,
      is_guest: input.isGuest ? 1 : 0,
      created_at: now,
      updated_at: now
    }).execute();
    const byline = await this.findById(id);
    if (!byline) throw new Error("Failed to create byline");
    return byline;
  }
  async update(id, input) {
    if (!await this.findById(id)) return null;
    const updates = { updated_at: (/* @__PURE__ */ new Date()).toISOString() };
    if (input.slug !== void 0) updates.slug = input.slug;
    if (input.displayName !== void 0) updates.display_name = input.displayName;
    if (input.bio !== void 0) updates.bio = input.bio;
    if (input.avatarMediaId !== void 0) updates.avatar_media_id = input.avatarMediaId;
    if (input.websiteUrl !== void 0) updates.website_url = input.websiteUrl;
    if (input.userId !== void 0) updates.user_id = input.userId;
    if (input.isGuest !== void 0) updates.is_guest = input.isGuest ? 1 : 0;
    await this.db.updateTable("_emdash_bylines").set(updates).where("id", "=", id).execute();
    return await this.findById(id);
  }
  async delete(id) {
    if (!await this.findById(id)) return false;
    await this.db.transaction().execute(async (trx) => {
      await trx.deleteFrom("_emdash_content_bylines").where("byline_id", "=", id).execute();
      await trx.deleteFrom("_emdash_bylines").where("id", "=", id).execute();
      const tableNames = await listTablesLike(trx, "ec_%");
      for (const tableName of tableNames) {
        validateIdentifier(tableName, "content table");
        await sql`
					UPDATE ${sql.ref(tableName)}
					SET primary_byline_id = NULL
					WHERE primary_byline_id = ${id}
				`.execute(trx);
      }
    });
    return true;
  }
  async getContentBylines(collectionSlug, contentId) {
    return (await this.db.selectFrom("_emdash_content_bylines as cb").innerJoin("_emdash_bylines as b", "b.id", "cb.byline_id").select([
      "cb.sort_order as sort_order",
      "cb.role_label as role_label",
      "b.id as id",
      "b.slug as slug",
      "b.display_name as display_name",
      "b.bio as bio",
      "b.avatar_media_id as avatar_media_id",
      "b.website_url as website_url",
      "b.user_id as user_id",
      "b.is_guest as is_guest",
      "b.created_at as created_at",
      "b.updated_at as updated_at"
    ]).where("cb.collection_slug", "=", collectionSlug).where("cb.content_id", "=", contentId).orderBy("cb.sort_order", "asc").execute()).map((row) => ({
      byline: rowToByline(row),
      sortOrder: row.sort_order,
      roleLabel: row.role_label
    }));
  }
  /**
  * Batch-fetch byline credits for multiple content items in a single query.
  * Returns a Map keyed by contentId.
  */
  async getContentBylinesMany(collectionSlug, contentIds) {
    const result = /* @__PURE__ */ new Map();
    if (contentIds.length === 0) return result;
    const rows = await this.db.selectFrom("_emdash_content_bylines as cb").innerJoin("_emdash_bylines as b", "b.id", "cb.byline_id").select([
      "cb.content_id as content_id",
      "cb.sort_order as sort_order",
      "cb.role_label as role_label",
      "b.id as id",
      "b.slug as slug",
      "b.display_name as display_name",
      "b.bio as bio",
      "b.avatar_media_id as avatar_media_id",
      "b.website_url as website_url",
      "b.user_id as user_id",
      "b.is_guest as is_guest",
      "b.created_at as created_at",
      "b.updated_at as updated_at"
    ]).where("cb.collection_slug", "=", collectionSlug).where("cb.content_id", "in", contentIds).orderBy("cb.sort_order", "asc").execute();
    for (const row of rows) {
      const contentId = row.content_id;
      const credit = {
        byline: rowToByline(row),
        sortOrder: row.sort_order,
        roleLabel: row.role_label
      };
      const existing = result.get(contentId);
      if (existing) existing.push(credit);
      else result.set(contentId, [credit]);
    }
    return result;
  }
  /**
  * Batch-fetch byline profiles linked to user IDs in a single query.
  * Returns a Map keyed by userId.
  */
  async findByUserIds(userIds) {
    const result = /* @__PURE__ */ new Map();
    if (userIds.length === 0) return result;
    const rows = await this.db.selectFrom("_emdash_bylines").selectAll().where("user_id", "in", userIds).execute();
    for (const row of rows) if (row.user_id) result.set(row.user_id, rowToByline(row));
    return result;
  }
  async setContentBylines(collectionSlug, contentId, inputBylines) {
    validateIdentifier(collectionSlug, "collection slug");
    const tableName = `ec_${collectionSlug}`;
    validateIdentifier(tableName, "content table");
    const seen = /* @__PURE__ */ new Set();
    const bylines = inputBylines.filter((item) => {
      if (seen.has(item.bylineId)) return false;
      seen.add(item.bylineId);
      return true;
    });
    if (bylines.length > 0) {
      const ids = bylines.map((item) => item.bylineId);
      if ((await this.db.selectFrom("_emdash_bylines").select("id").where("id", "in", ids).execute()).length !== ids.length) throw new Error("One or more byline IDs do not exist");
    }
    await this.db.deleteFrom("_emdash_content_bylines").where("collection_slug", "=", collectionSlug).where("content_id", "=", contentId).execute();
    for (let i = 0; i < bylines.length; i++) {
      const item = bylines[i];
      await this.db.insertInto("_emdash_content_bylines").values({
        id: ulid(),
        collection_slug: collectionSlug,
        content_id: contentId,
        byline_id: item.bylineId,
        sort_order: i,
        role_label: item.roleLabel ?? null,
        created_at: (/* @__PURE__ */ new Date()).toISOString()
      }).execute();
    }
    await sql`
			UPDATE ${sql.ref(tableName)}
			SET primary_byline_id = ${bylines[0]?.bylineId ?? null}
			WHERE id = ${contentId}
		`.execute(this.db);
    return await this.getContentBylines(collectionSlug, contentId);
  }
};
const ALS_KEY = /* @__PURE__ */ Symbol.for("emdash:request-context");
const storage = globalThis[ALS_KEY] ?? (() => {
  const als = new AsyncLocalStorage();
  globalThis[ALS_KEY] = als;
  return als;
})();
function runWithContext(ctx, fn) {
  return storage.run(ctx, fn);
}
function getRequestContext() {
  return storage.getStore();
}
var loader_exports = /* @__PURE__ */ __exportAll({
  emdashLoader: () => emdashLoader,
  getDb: () => getDb
});
const FIELD_NAME_PATTERN = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
const SYSTEM_COLUMNS = /* @__PURE__ */ new Set([
  "id",
  "status",
  "author_id",
  "primary_byline_id",
  "created_at",
  "updated_at",
  "published_at",
  "scheduled_at",
  "deleted_at",
  "version",
  "live_revision_id",
  "draft_revision_id",
  "locale",
  "translation_group"
]);
function getTableName(type) {
  return `ec_${type}`;
}
let taxonomyNames = null;
async function getTaxonomyNames(db) {
  const hasDbOverride = !!getRequestContext()?.db;
  if (!hasDbOverride && taxonomyNames) return taxonomyNames;
  try {
    const defs = await db.selectFrom("_emdash_taxonomy_defs").select("name").execute();
    const names = new Set(defs.map((d) => d.name));
    if (!hasDbOverride) taxonomyNames = names;
    return names;
  } catch {
    const empty = /* @__PURE__ */ new Set();
    if (!hasDbOverride) taxonomyNames = empty;
    return empty;
  }
}
const INCLUDE_IN_DATA = {
  id: "id",
  status: "status",
  author_id: "authorId",
  primary_byline_id: "primaryBylineId",
  created_at: "createdAt",
  updated_at: "updatedAt",
  published_at: "publishedAt",
  scheduled_at: "scheduledAt",
  draft_revision_id: "draftRevisionId",
  live_revision_id: "liveRevisionId",
  locale: "locale",
  translation_group: "translationGroup"
};
const DATE_COLUMNS = /* @__PURE__ */ new Set([
  "created_at",
  "updated_at",
  "published_at",
  "scheduled_at"
]);
function rowStr(row, key, fallback = "") {
  const val = row[key];
  return typeof val === "string" ? val : fallback;
}
function mapRowToData(row) {
  const data = {};
  for (const [key, value] of Object.entries(row)) {
    if (key in INCLUDE_IN_DATA) {
      if (DATE_COLUMNS.has(key)) data[INCLUDE_IN_DATA[key]] = typeof value === "string" ? new Date(value) : null;
      else data[INCLUDE_IN_DATA[key]] = value;
      continue;
    }
    if (SYSTEM_COLUMNS.has(key)) continue;
    if (typeof value === "string") try {
      if (value.startsWith("{") || value.startsWith("[")) data[key] = JSON.parse(value);
      else data[key] = value;
    } catch {
      data[key] = value;
    }
    else data[key] = value;
  }
  return data;
}
function mapRevisionData(data) {
  const result = {};
  for (const [key, value] of Object.entries(data)) {
    if (key.startsWith("_")) continue;
    result[key] = value;
  }
  return result;
}
let virtualConfig;
let virtualCreateDialect;
async function loadVirtualModules() {
  if (virtualConfig === void 0) virtualConfig = (await import("./config_CG7YeZVr.mjs")).default;
  if (virtualCreateDialect === void 0) virtualCreateDialect = (await import("./dialect_BKY1UUaD.mjs")).createDialect;
}
function buildStatusCondition(db, status, tablePrefix) {
  const statusField = tablePrefix ? `${tablePrefix}.status` : "status";
  const scheduledAtField = tablePrefix ? `${tablePrefix}.scheduled_at` : "scheduled_at";
  if (status === "published") {
    const scheduledAtExpr = isPostgres(db) ? sql`${sql.ref(scheduledAtField)}::timestamptz` : sql.ref(scheduledAtField);
    return sql`(${sql.ref(statusField)} = 'published' OR (${sql.ref(statusField)} = 'scheduled' AND ${scheduledAtExpr} <= ${currentTimestampValue(db)}))`;
  }
  return sql`${sql.ref(statusField)} = ${status}`;
}
function getPrimarySort(orderBy, tablePrefix) {
  if (orderBy) {
    for (const [field, direction] of Object.entries(orderBy)) if (FIELD_NAME_PATTERN.test(field)) return {
      field: tablePrefix ? `${tablePrefix}.${field}` : field,
      direction
    };
  }
  return {
    field: tablePrefix ? `${tablePrefix}.created_at` : "created_at",
    direction: "desc"
  };
}
function buildOrderByClause(orderBy, tablePrefix) {
  if (!orderBy || Object.keys(orderBy).length === 0) {
    const field = tablePrefix ? `${tablePrefix}.created_at` : "created_at";
    return sql`ORDER BY ${sql.ref(field)} DESC, ${sql.ref(tablePrefix ? `${tablePrefix}.id` : "id")} DESC`;
  }
  const sortParts = [];
  for (const [field, direction] of Object.entries(orderBy)) {
    if (!FIELD_NAME_PATTERN.test(field)) continue;
    const fullField = tablePrefix ? `${tablePrefix}.${field}` : field;
    const dir = direction === "asc" ? sql`ASC` : sql`DESC`;
    sortParts.push(sql`${sql.ref(fullField)} ${dir}`);
  }
  if (sortParts.length === 0) {
    const defaultField = tablePrefix ? `${tablePrefix}.created_at` : "created_at";
    return sql`ORDER BY ${sql.ref(defaultField)} DESC, ${sql.ref(tablePrefix ? `${tablePrefix}.id` : "id")} DESC`;
  }
  const primary = getPrimarySort(orderBy, tablePrefix);
  const idField = tablePrefix ? `${tablePrefix}.id` : "id";
  const idDir = primary.direction === "asc" ? sql`ASC` : sql`DESC`;
  sortParts.push(sql`${sql.ref(idField)} ${idDir}`);
  return sql`ORDER BY ${sql.join(sortParts, sql`, `)}`;
}
function buildCursorCondition(cursor, orderBy, tablePrefix) {
  const decoded = decodeCursor(cursor);
  if (!decoded) return null;
  const { orderValue, id: cursorId } = decoded;
  const primary = getPrimarySort(orderBy, tablePrefix);
  const idField = tablePrefix ? `${tablePrefix}.id` : "id";
  if (primary.direction === "desc") return sql`(${sql.ref(primary.field)} < ${orderValue} OR (${sql.ref(primary.field)} = ${orderValue} AND ${sql.ref(idField)} < ${cursorId}))`;
  return sql`(${sql.ref(primary.field)} > ${orderValue} OR (${sql.ref(primary.field)} = ${orderValue} AND ${sql.ref(idField)} > ${cursorId}))`;
}
let dbInstance = null;
async function getDb() {
  const ctx = getRequestContext();
  if (ctx?.db) return ctx.db;
  if (!dbInstance) {
    await loadVirtualModules();
    if (!virtualConfig?.database || typeof virtualCreateDialect !== "function") throw new Error("EmDash database not configured. Add database config to emdash() in astro.config.mjs");
    dbInstance = new Kysely({ dialect: virtualCreateDialect(virtualConfig.database.config) });
  }
  return dbInstance;
}
function emdashLoader() {
  return {
    name: "emdash",
    async loadCollection({ filter }) {
      try {
        const db = await getDb();
        const type = filter?.type;
        if (!type) return { error: /* @__PURE__ */ new Error("type filter is required. Use getEmDashCollection() instead of getLiveCollection() directly.") };
        const tableName = getTableName(type);
        const status = filter?.status || "published";
        const limit = filter?.limit;
        const cursor = filter?.cursor;
        const where = filter?.where;
        const orderBy = filter?.orderBy;
        const locale = filter?.locale;
        const fetchLimit = limit ? limit + 1 : void 0;
        const cursorCondition = cursor ? buildCursorCondition(cursor, orderBy) : null;
        const cursorConditionPrefixed = cursor ? buildCursorCondition(cursor, orderBy, tableName) : null;
        let result;
        if (where && Object.keys(where).length > 0) {
          const taxNames = await getTaxonomyNames(db);
          const taxonomyFilters = {};
          for (const [key, value] of Object.entries(where)) if (taxNames.has(key)) taxonomyFilters[key] = value;
          if (Object.keys(taxonomyFilters).length > 0) {
            const [taxName, termSlugs] = Object.entries(taxonomyFilters)[0];
            const slugs = Array.isArray(termSlugs) ? termSlugs : [termSlugs];
            const orderByClause = buildOrderByClause(orderBy, tableName);
            const statusCondition = buildStatusCondition(db, status, tableName);
            const localeCondition = locale ? sql`AND ${sql.ref(tableName)}.locale = ${locale}` : sql``;
            const cursorCond = cursorConditionPrefixed ? sql`AND ${cursorConditionPrefixed}` : sql``;
            result = await sql`
							SELECT DISTINCT ${sql.ref(tableName)}.* FROM ${sql.ref(tableName)}
							INNER JOIN content_taxonomies ct
								ON ct.collection = ${type}
								AND ct.entry_id = ${sql.ref(tableName)}.id
							INNER JOIN taxonomies t
								ON t.id = ct.taxonomy_id
							WHERE ${sql.ref(tableName)}.deleted_at IS NULL
								AND ${statusCondition}
								${localeCondition}
								${cursorCond}
								AND t.name = ${taxName}
								AND t.slug IN (${sql.join(slugs.map((s2) => sql`${s2}`))})
							${orderByClause}
							${fetchLimit ? sql`LIMIT ${fetchLimit}` : sql``}
						`.execute(db);
          } else {
            const orderByClause = buildOrderByClause(orderBy);
            const statusCondition = buildStatusCondition(db, status);
            const localeFilter = locale ? sql`AND locale = ${locale}` : sql``;
            const cursorCond = cursorCondition ? sql`AND ${cursorCondition}` : sql``;
            result = await sql`
							SELECT * FROM ${sql.ref(tableName)}
							WHERE deleted_at IS NULL
							AND ${statusCondition}
							${localeFilter}
							${cursorCond}
							${orderByClause}
							${fetchLimit ? sql`LIMIT ${fetchLimit}` : sql``}
						`.execute(db);
          }
        } else {
          const orderByClause = buildOrderByClause(orderBy);
          const statusCondition = buildStatusCondition(db, status);
          const localeFilter = locale ? sql`AND locale = ${locale}` : sql``;
          const cursorCond = cursorCondition ? sql`AND ${cursorCondition}` : sql``;
          result = await sql`
						SELECT * FROM ${sql.ref(tableName)}
						WHERE deleted_at IS NULL
						AND ${statusCondition}
						${localeFilter}
						${cursorCond}
						${orderByClause}
						${fetchLimit ? sql`LIMIT ${fetchLimit}` : sql``}
					`.execute(db);
        }
        const hasMore = limit ? result.rows.length > limit : false;
        const rows = hasMore ? result.rows.slice(0, limit) : result.rows;
        const i18nConfig = virtualConfig?.i18n;
        const i18nEnabled = i18nConfig && i18nConfig.locales.length > 1;
        const entries = rows.map((row) => {
          const slug = rowStr(row, "slug") || rowStr(row, "id");
          const rowLocale = rowStr(row, "locale");
          return {
            id: i18nEnabled && rowLocale !== "" && (rowLocale !== i18nConfig.defaultLocale || i18nConfig.prefixDefaultLocale) ? `${rowLocale}/${slug}` : slug,
            slug: rowStr(row, "slug"),
            status: rowStr(row, "status", "draft"),
            data: mapRowToData(row),
            cacheHint: {
              tags: [rowStr(row, "id")],
              lastModified: row.updated_at ? new Date(rowStr(row, "updated_at")) : void 0
            }
          };
        });
        let nextCursor;
        if (hasMore && rows.length > 0) {
          const lastRow = rows.at(-1);
          const primary = getPrimarySort(orderBy);
          const lastOrderValue = lastRow[primary.field.includes(".") ? primary.field.split(".").pop() : primary.field];
          nextCursor = encodeCursor(typeof lastOrderValue === "string" || typeof lastOrderValue === "number" ? String(lastOrderValue) : "", String(lastRow.id));
        }
        let collectionLastModified;
        for (const row of rows) if (row.updated_at) {
          const d = new Date(rowStr(row, "updated_at"));
          if (!collectionLastModified || d > collectionLastModified) collectionLastModified = d;
        }
        return {
          entries,
          nextCursor,
          cacheHint: {
            tags: [type],
            lastModified: collectionLastModified
          }
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        const lowerMessage = message.toLowerCase();
        if (lowerMessage.includes("no such table") || lowerMessage.includes("table") && lowerMessage.includes("does not exist") || lowerMessage.includes("relation") && lowerMessage.includes("does not exist")) return { entries: [] };
        return { error: /* @__PURE__ */ new Error(`Failed to load collection: ${message}`) };
      }
    },
    async loadEntry({ filter }) {
      try {
        const db = await getDb();
        const type = filter?.type;
        const id = filter?.id;
        if (!type || !id) return { error: /* @__PURE__ */ new Error("type and id filters are required. Use getEmDashEntry() instead of getLiveEntry() directly.") };
        const tableName = getTableName(type);
        const locale = filter?.locale;
        const row = (locale ? await sql`
							SELECT * FROM ${sql.ref(tableName)}
							WHERE deleted_at IS NULL
							AND ((slug = ${id} AND locale = ${locale}) OR id = ${id})
							LIMIT 1
						`.execute(db) : await sql`
							SELECT * FROM ${sql.ref(tableName)}
							WHERE deleted_at IS NULL
							AND (slug = ${id} OR id = ${id})
							LIMIT 1
						`.execute(db)).rows[0];
        if (!row) return;
        const i18nConfig = virtualConfig?.i18n;
        const i18nEnabled = i18nConfig && i18nConfig.locales.length > 1;
        const entrySlug = rowStr(row, "slug") || rowStr(row, "id");
        const entryLocale = rowStr(row, "locale");
        const entryId = i18nEnabled && entryLocale !== "" && (entryLocale !== i18nConfig.defaultLocale || i18nConfig.prefixDefaultLocale) ? `${entryLocale}/${entrySlug}` : entrySlug;
        const revisionId = filter?.revisionId;
        if (revisionId) {
          const revData = (await sql`
						SELECT data FROM revisions
						WHERE id = ${revisionId}
						LIMIT 1
					`.execute(db)).rows[0];
          if (revData) {
            const parsed = JSON.parse(revData.data);
            const systemData = {};
            for (const [key, mappedKey] of Object.entries(INCLUDE_IN_DATA)) if (key in row) if (DATE_COLUMNS.has(key)) systemData[mappedKey] = typeof row[key] === "string" ? new Date(row[key]) : null;
            else systemData[mappedKey] = row[key];
            const slug = typeof parsed._slug === "string" ? parsed._slug : rowStr(row, "slug");
            const revSlug = slug || rowStr(row, "id");
            const revLocale = rowStr(row, "locale");
            return {
              id: i18nEnabled && revLocale !== "" && (revLocale !== i18nConfig.defaultLocale || i18nConfig.prefixDefaultLocale) ? `${revLocale}/${revSlug}` : revSlug,
              slug,
              status: rowStr(row, "status", "draft"),
              data: {
                ...systemData,
                slug,
                ...mapRevisionData(parsed)
              },
              cacheHint: {
                tags: [rowStr(row, "id")],
                lastModified: row.updated_at ? new Date(rowStr(row, "updated_at")) : void 0
              }
            };
          }
        }
        return {
          id: entryId,
          slug: rowStr(row, "slug"),
          status: rowStr(row, "status", "draft"),
          data: mapRowToData(row),
          cacheHint: {
            tags: [rowStr(row, "id")],
            lastModified: row.updated_at ? new Date(rowStr(row, "updated_at")) : void 0
          }
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        const lowerMessage = message.toLowerCase();
        if (lowerMessage.includes("no such table") || lowerMessage.includes("table") && lowerMessage.includes("does not exist") || lowerMessage.includes("relation") && lowerMessage.includes("does not exist")) return;
        return { error: /* @__PURE__ */ new Error(`Failed to load entry: ${message}`) };
      }
    }
  };
}
const loaderFz8Q_3EO = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  n: getDb,
  r: loader_exports,
  t: emdashLoader
}, Symbol.toStringTag, { value: "Module" }));
var validate_exports = /* @__PURE__ */ __exportAll({ validateSeed: () => validateSeed });
const COLLECTION_FIELD_SLUG_PATTERN = /^[a-z][a-z0-9_]*$/;
const SLUG_PATTERN = /^[a-z0-9-]+$/;
const REDIRECT_TYPES = /* @__PURE__ */ new Set([
  301,
  302,
  307,
  308
]);
const CRLF_PATTERN = /[\r\n]/;
function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function isValidRedirectPath(path) {
  if (!path.startsWith("/") || path.startsWith("//") || CRLF_PATTERN.test(path)) return false;
  try {
    return !decodeURIComponent(path).split("/").includes("..");
  } catch {
    return false;
  }
}
function validateSeed(data) {
  const errors = [];
  const warnings = [];
  if (!data || typeof data !== "object") return {
    valid: false,
    errors: ["Seed must be an object"],
    warnings: []
  };
  const seed = data;
  if (!seed.version) errors.push("Seed must have a version field");
  else if (seed.version !== "1") errors.push(`Unsupported seed version: ${String(seed.version)}`);
  if (seed.collections) if (!Array.isArray(seed.collections)) errors.push("collections must be an array");
  else {
    const collectionSlugs = /* @__PURE__ */ new Set();
    for (let i = 0; i < seed.collections.length; i++) {
      const collection = seed.collections[i];
      const prefix = `collections[${i}]`;
      if (!collection.slug) errors.push(`${prefix}: slug is required`);
      else {
        if (!COLLECTION_FIELD_SLUG_PATTERN.test(collection.slug)) errors.push(`${prefix}.slug: must start with a letter and contain only lowercase letters, numbers, and underscores`);
        if (collectionSlugs.has(collection.slug)) errors.push(`${prefix}.slug: duplicate collection slug "${collection.slug}"`);
        collectionSlugs.add(collection.slug);
      }
      if (!collection.label) errors.push(`${prefix}: label is required`);
      if (!Array.isArray(collection.fields)) errors.push(`${prefix}.fields: must be an array`);
      else {
        const fieldSlugs = /* @__PURE__ */ new Set();
        for (let j = 0; j < collection.fields.length; j++) {
          const field = collection.fields[j];
          const fieldPrefix = `${prefix}.fields[${j}]`;
          if (!field.slug) errors.push(`${fieldPrefix}: slug is required`);
          else {
            if (!COLLECTION_FIELD_SLUG_PATTERN.test(field.slug)) errors.push(`${fieldPrefix}.slug: must start with a letter and contain only lowercase letters, numbers, and underscores`);
            if (fieldSlugs.has(field.slug)) errors.push(`${fieldPrefix}.slug: duplicate field slug "${field.slug}" in collection "${collection.slug}"`);
            fieldSlugs.add(field.slug);
          }
          if (!field.label) errors.push(`${fieldPrefix}: label is required`);
          if (!field.type) errors.push(`${fieldPrefix}: type is required`);
          else if (!FIELD_TYPES$1.includes(field.type)) errors.push(`${fieldPrefix}.type: unsupported field type "${field.type}"`);
        }
      }
    }
  }
  if (seed.taxonomies) if (!Array.isArray(seed.taxonomies)) errors.push("taxonomies must be an array");
  else {
    const taxonomyNames2 = /* @__PURE__ */ new Set();
    for (let i = 0; i < seed.taxonomies.length; i++) {
      const taxonomy = seed.taxonomies[i];
      const prefix = `taxonomies[${i}]`;
      if (!taxonomy.name) errors.push(`${prefix}: name is required`);
      else {
        if (taxonomyNames2.has(taxonomy.name)) errors.push(`${prefix}.name: duplicate taxonomy name "${taxonomy.name}"`);
        taxonomyNames2.add(taxonomy.name);
      }
      if (!taxonomy.label) errors.push(`${prefix}: label is required`);
      if (taxonomy.hierarchical === void 0) errors.push(`${prefix}: hierarchical is required`);
      if (!Array.isArray(taxonomy.collections)) errors.push(`${prefix}.collections: must be an array`);
      else if (taxonomy.collections.length === 0) warnings.push(`${prefix}.collections: taxonomy "${taxonomy.name}" is not assigned to any collections`);
      if (taxonomy.terms) if (!Array.isArray(taxonomy.terms)) errors.push(`${prefix}.terms: must be an array`);
      else {
        const termSlugs = /* @__PURE__ */ new Set();
        for (let j = 0; j < taxonomy.terms.length; j++) {
          const term = taxonomy.terms[j];
          const termPrefix = `${prefix}.terms[${j}]`;
          if (!term.slug) errors.push(`${termPrefix}: slug is required`);
          else {
            if (termSlugs.has(term.slug)) errors.push(`${termPrefix}.slug: duplicate term slug "${term.slug}" in taxonomy "${taxonomy.name}"`);
            termSlugs.add(term.slug);
          }
          if (!term.label) errors.push(`${termPrefix}: label is required`);
          if (term.parent && taxonomy.hierarchical) ;
          else if (term.parent && !taxonomy.hierarchical) warnings.push(`${termPrefix}.parent: taxonomy "${taxonomy.name}" is not hierarchical, parent will be ignored`);
        }
        if (taxonomy.hierarchical && taxonomy.terms) for (let j = 0; j < taxonomy.terms.length; j++) {
          const term = taxonomy.terms[j];
          if (term.parent && !termSlugs.has(term.parent)) errors.push(`${prefix}.terms[${j}].parent: parent term "${term.parent}" not found in taxonomy`);
          if (term.parent === term.slug) errors.push(`${prefix}.terms[${j}].parent: term cannot be its own parent`);
        }
      }
    }
  }
  if (seed.menus) if (!Array.isArray(seed.menus)) errors.push("menus must be an array");
  else {
    const menuNames = /* @__PURE__ */ new Set();
    for (let i = 0; i < seed.menus.length; i++) {
      const menu = seed.menus[i];
      const prefix = `menus[${i}]`;
      if (!menu.name) errors.push(`${prefix}: name is required`);
      else {
        if (menuNames.has(menu.name)) errors.push(`${prefix}.name: duplicate menu name "${menu.name}"`);
        menuNames.add(menu.name);
      }
      if (!menu.label) errors.push(`${prefix}: label is required`);
      if (!Array.isArray(menu.items)) errors.push(`${prefix}.items: must be an array`);
      else validateMenuItems(menu.items, prefix, errors);
    }
  }
  if (seed.redirects) if (!Array.isArray(seed.redirects)) errors.push("redirects must be an array");
  else {
    const redirectSources = /* @__PURE__ */ new Set();
    for (let i = 0; i < seed.redirects.length; i++) {
      const redirect = seed.redirects[i];
      const prefix = `redirects[${i}]`;
      if (!isRecord(redirect)) {
        errors.push(`${prefix}: must be an object`);
        continue;
      }
      const source = typeof redirect.source === "string" ? redirect.source : void 0;
      const destination = typeof redirect.destination === "string" ? redirect.destination : void 0;
      if (!source) errors.push(`${prefix}: source is required`);
      else {
        if (!isValidRedirectPath(source)) errors.push(`${prefix}.source: must be a path starting with / (no protocol-relative URLs, path traversal, or newlines)`);
        if (redirectSources.has(source)) errors.push(`${prefix}.source: duplicate redirect source "${source}"`);
        redirectSources.add(source);
      }
      if (!destination) errors.push(`${prefix}: destination is required`);
      else if (!isValidRedirectPath(destination)) errors.push(`${prefix}.destination: must be a path starting with / (no protocol-relative URLs, path traversal, or newlines)`);
      if (redirect.type !== void 0) {
        if (typeof redirect.type !== "number" || !REDIRECT_TYPES.has(redirect.type)) errors.push(`${prefix}.type: must be 301, 302, 307, or 308`);
      }
      if (redirect.enabled !== void 0 && typeof redirect.enabled !== "boolean") errors.push(`${prefix}.enabled: must be a boolean`);
      if (redirect.groupName !== void 0 && typeof redirect.groupName !== "string" && redirect.groupName !== null) errors.push(`${prefix}.groupName: must be a string or null`);
    }
  }
  if (seed.widgetAreas) if (!Array.isArray(seed.widgetAreas)) errors.push("widgetAreas must be an array");
  else {
    const areaNames = /* @__PURE__ */ new Set();
    for (let i = 0; i < seed.widgetAreas.length; i++) {
      const area = seed.widgetAreas[i];
      const prefix = `widgetAreas[${i}]`;
      if (!area.name) errors.push(`${prefix}: name is required`);
      else {
        if (areaNames.has(area.name)) errors.push(`${prefix}.name: duplicate widget area name "${area.name}"`);
        areaNames.add(area.name);
      }
      if (!area.label) errors.push(`${prefix}: label is required`);
      if (!Array.isArray(area.widgets)) errors.push(`${prefix}.widgets: must be an array`);
      else for (let j = 0; j < area.widgets.length; j++) {
        const widget = area.widgets[j];
        const widgetPrefix = `${prefix}.widgets[${j}]`;
        if (!widget.type) errors.push(`${widgetPrefix}: type is required`);
        else if (![
          "content",
          "menu",
          "component"
        ].includes(widget.type)) errors.push(`${widgetPrefix}.type: must be "content", "menu", or "component"`);
        if (widget.type === "menu" && !widget.menuName) errors.push(`${widgetPrefix}: menuName is required for menu widgets`);
        if (widget.type === "component" && !widget.componentId) errors.push(`${widgetPrefix}: componentId is required for component widgets`);
      }
    }
  }
  if (seed.sections) if (!Array.isArray(seed.sections)) errors.push("sections must be an array");
  else {
    const sectionSlugs = /* @__PURE__ */ new Set();
    for (let i = 0; i < seed.sections.length; i++) {
      const section = seed.sections[i];
      const prefix = `sections[${i}]`;
      if (!section.slug) errors.push(`${prefix}: slug is required`);
      else {
        if (!SLUG_PATTERN.test(section.slug)) errors.push(`${prefix}.slug: must contain only lowercase letters, numbers, and hyphens`);
        if (sectionSlugs.has(section.slug)) errors.push(`${prefix}.slug: duplicate section slug "${section.slug}"`);
        sectionSlugs.add(section.slug);
      }
      if (!section.title) errors.push(`${prefix}: title is required`);
      if (!Array.isArray(section.content)) errors.push(`${prefix}.content: must be an array`);
      if (section.source && !["theme", "import"].includes(section.source)) errors.push(`${prefix}.source: must be "theme" or "import"`);
    }
  }
  if (seed.bylines) if (!Array.isArray(seed.bylines)) errors.push("bylines must be an array");
  else {
    const bylineIds = /* @__PURE__ */ new Set();
    const bylineSlugs = /* @__PURE__ */ new Set();
    for (let i = 0; i < seed.bylines.length; i++) {
      const byline = seed.bylines[i];
      const prefix = `bylines[${i}]`;
      if (!byline.id) errors.push(`${prefix}: id is required`);
      else {
        if (bylineIds.has(byline.id)) errors.push(`${prefix}.id: duplicate byline id "${byline.id}"`);
        bylineIds.add(byline.id);
      }
      if (!byline.slug) errors.push(`${prefix}: slug is required`);
      else {
        if (!SLUG_PATTERN.test(byline.slug)) errors.push(`${prefix}.slug: must contain only lowercase letters, numbers, and hyphens`);
        if (bylineSlugs.has(byline.slug)) errors.push(`${prefix}.slug: duplicate byline slug "${byline.slug}"`);
        bylineSlugs.add(byline.slug);
      }
      if (!byline.displayName) errors.push(`${prefix}: displayName is required`);
    }
  }
  if (seed.content) if (typeof seed.content !== "object" || Array.isArray(seed.content)) errors.push("content must be an object (collection -> entries)");
  else for (const [collectionSlug, entries] of Object.entries(seed.content)) {
    if (!Array.isArray(entries)) {
      errors.push(`content.${collectionSlug}: must be an array`);
      continue;
    }
    const entryIds = /* @__PURE__ */ new Set();
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      const prefix = `content.${collectionSlug}[${i}]`;
      if (!entry.id) errors.push(`${prefix}: id is required`);
      else {
        if (entryIds.has(entry.id)) errors.push(`${prefix}.id: duplicate entry id "${entry.id}" in collection "${collectionSlug}"`);
        entryIds.add(entry.id);
      }
      if (!entry.slug) errors.push(`${prefix}: slug is required`);
      if (!entry.data || typeof entry.data !== "object") errors.push(`${prefix}: data must be an object`);
      if (entry.translationOf) {
        if (!entry.locale) errors.push(`${prefix}: locale is required when translationOf is set`);
      }
    }
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      if (entry.translationOf && !entryIds.has(entry.translationOf)) errors.push(`content.${collectionSlug}[${i}].translationOf: references "${entry.translationOf}" which is not in this collection`);
    }
  }
  if (seed.menus && seed.content) {
    const allContentIds = /* @__PURE__ */ new Set();
    for (const entries of Object.values(seed.content)) if (Array.isArray(entries)) {
      for (const entry of entries) if (entry.id) allContentIds.add(entry.id);
    }
    for (const menu of seed.menus) if (Array.isArray(menu.items)) validateMenuItemRefs(menu.items, allContentIds, warnings);
  }
  if (seed.content) {
    const seedBylineIds = new Set((seed.bylines ?? []).map((byline) => byline.id));
    for (const [collectionSlug, entries] of Object.entries(seed.content)) {
      if (!Array.isArray(entries)) continue;
      for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];
        if (!entry.bylines) continue;
        if (!Array.isArray(entry.bylines)) {
          errors.push(`content.${collectionSlug}[${i}].bylines: must be an array`);
          continue;
        }
        for (let j = 0; j < entry.bylines.length; j++) {
          const credit = entry.bylines[j];
          const prefix = `content.${collectionSlug}[${i}].bylines[${j}]`;
          if (!credit.byline) {
            errors.push(`${prefix}.byline: is required`);
            continue;
          }
          if (!seedBylineIds.has(credit.byline)) errors.push(`${prefix}.byline: references unknown byline "${credit.byline}"`);
        }
      }
    }
  }
  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}
function validateMenuItems(items, prefix, errors, warnings) {
  for (let i = 0; i < items.length; i++) {
    const raw = items[i];
    const itemPrefix = `${prefix}.items[${i}]`;
    if (!isRecord(raw)) {
      errors.push(`${itemPrefix}: must be an object`);
      continue;
    }
    const item = raw;
    const itemType = typeof item.type === "string" ? item.type : void 0;
    if (!itemType) errors.push(`${itemPrefix}: type is required`);
    else if (![
      "custom",
      "page",
      "post",
      "taxonomy",
      "collection"
    ].includes(itemType)) errors.push(`${itemPrefix}.type: must be "custom", "page", "post", "taxonomy", or "collection"`);
    if (itemType === "custom" && !item.url) errors.push(`${itemPrefix}: url is required for custom menu items`);
    if ((itemType === "page" || itemType === "post") && !item.ref) errors.push(`${itemPrefix}: ref is required for page/post menu items`);
    if (Array.isArray(item.children)) validateMenuItems(item.children, itemPrefix, errors);
  }
}
function validateMenuItemRefs(items, contentIds, warnings) {
  for (const item of items) {
    if ((item.type === "page" || item.type === "post") && item.ref) {
      if (!contentIds.has(item.ref)) warnings.push(`Menu item references content "${item.ref}" which is not in the seed file`);
    }
    if (item.children) validateMenuItemRefs(item.children, contentIds, warnings);
  }
}
const validateO7PWmlnq = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  n: validate_exports,
  t: validateSeed
}, Symbol.toStringTag, { value: "Module" }));
var TaxonomyRepository = class {
  constructor(db) {
    this.db = db;
  }
  /**
  * Create a new taxonomy term
  */
  async create(input) {
    const id = ulid();
    const row = {
      id,
      name: input.name,
      slug: input.slug,
      label: input.label,
      parent_id: input.parentId ?? null,
      data: input.data ? JSON.stringify(input.data) : null
    };
    await this.db.insertInto("taxonomies").values(row).execute();
    const taxonomy = await this.findById(id);
    if (!taxonomy) throw new Error("Failed to create taxonomy");
    return taxonomy;
  }
  /**
  * Find taxonomy by ID
  */
  async findById(id) {
    const row = await this.db.selectFrom("taxonomies").selectAll().where("id", "=", id).executeTakeFirst();
    return row ? this.rowToTaxonomy(row) : null;
  }
  /**
  * Find taxonomy by name and slug (unique constraint)
  */
  async findBySlug(name, slug) {
    const row = await this.db.selectFrom("taxonomies").selectAll().where("name", "=", name).where("slug", "=", slug).executeTakeFirst();
    return row ? this.rowToTaxonomy(row) : null;
  }
  /**
  * Get all terms for a taxonomy (e.g., all categories)
  */
  async findByName(name, options = {}) {
    let query = this.db.selectFrom("taxonomies").selectAll().where("name", "=", name).orderBy("label", "asc");
    if (options.parentId !== void 0) if (options.parentId === null) query = query.where("parent_id", "is", null);
    else query = query.where("parent_id", "=", options.parentId);
    return (await query.execute()).map((row) => this.rowToTaxonomy(row));
  }
  /**
  * Get children of a taxonomy term
  */
  async findChildren(parentId) {
    return (await this.db.selectFrom("taxonomies").selectAll().where("parent_id", "=", parentId).orderBy("label", "asc").execute()).map((row) => this.rowToTaxonomy(row));
  }
  /**
  * Update a taxonomy term
  */
  async update(id, input) {
    if (!await this.findById(id)) return null;
    const updates = {};
    if (input.slug !== void 0) updates.slug = input.slug;
    if (input.label !== void 0) updates.label = input.label;
    if (input.parentId !== void 0) updates.parent_id = input.parentId;
    if (input.data !== void 0) updates.data = JSON.stringify(input.data);
    if (Object.keys(updates).length > 0) await this.db.updateTable("taxonomies").set(updates).where("id", "=", id).execute();
    return this.findById(id);
  }
  /**
  * Delete a taxonomy term
  */
  async delete(id) {
    await this.db.deleteFrom("content_taxonomies").where("taxonomy_id", "=", id).execute();
    return ((await this.db.deleteFrom("taxonomies").where("id", "=", id).executeTakeFirst()).numDeletedRows ?? 0) > 0;
  }
  /**
  * Attach a taxonomy term to a content entry
  */
  async attachToEntry(collection, entryId, taxonomyId) {
    const row = {
      collection,
      entry_id: entryId,
      taxonomy_id: taxonomyId
    };
    await this.db.insertInto("content_taxonomies").values(row).onConflict((oc) => oc.doNothing()).execute();
  }
  /**
  * Detach a taxonomy term from a content entry
  */
  async detachFromEntry(collection, entryId, taxonomyId) {
    await this.db.deleteFrom("content_taxonomies").where("collection", "=", collection).where("entry_id", "=", entryId).where("taxonomy_id", "=", taxonomyId).execute();
  }
  /**
  * Get all taxonomy terms for a content entry
  */
  async getTermsForEntry(collection, entryId, taxonomyName) {
    let query = this.db.selectFrom("content_taxonomies").innerJoin("taxonomies", "taxonomies.id", "content_taxonomies.taxonomy_id").selectAll("taxonomies").where("content_taxonomies.collection", "=", collection).where("content_taxonomies.entry_id", "=", entryId);
    if (taxonomyName) query = query.where("taxonomies.name", "=", taxonomyName);
    return (await query.execute()).map((row) => this.rowToTaxonomy(row));
  }
  /**
  * Set all taxonomy terms for a content entry (replaces existing)
  * Uses batch operations to avoid N+1 queries.
  */
  async setTermsForEntry(collection, entryId, taxonomyName, taxonomyIds) {
    const current = await this.getTermsForEntry(collection, entryId, taxonomyName);
    const currentIds = new Set(current.map((t) => t.id));
    const newIds = new Set(taxonomyIds);
    const toRemove = current.filter((t) => !newIds.has(t.id)).map((t) => t.id);
    if (toRemove.length > 0) await this.db.deleteFrom("content_taxonomies").where("collection", "=", collection).where("entry_id", "=", entryId).where("taxonomy_id", "in", toRemove).execute();
    const toAdd = taxonomyIds.filter((id) => !currentIds.has(id));
    if (toAdd.length > 0) await this.db.insertInto("content_taxonomies").values(toAdd.map((taxonomy_id) => ({
      collection,
      entry_id: entryId,
      taxonomy_id
    }))).onConflict((oc) => oc.doNothing()).execute();
  }
  /**
  * Remove all taxonomy associations for an entry (use when entry is deleted)
  */
  async clearEntryTerms(collection, entryId) {
    const result = await this.db.deleteFrom("content_taxonomies").where("collection", "=", collection).where("entry_id", "=", entryId).executeTakeFirst();
    return Number(result.numDeletedRows ?? 0);
  }
  /**
  * Count entries that have a specific taxonomy term
  */
  async countEntriesWithTerm(taxonomyId) {
    const result = await this.db.selectFrom("content_taxonomies").select((eb) => eb.fn.count("entry_id").as("count")).where("taxonomy_id", "=", taxonomyId).executeTakeFirst();
    return Number(result?.count || 0);
  }
  /**
  * Convert database row to Taxonomy object
  */
  rowToTaxonomy(row) {
    return {
      id: row.id,
      name: row.name,
      slug: row.slug,
      label: row.label,
      parentId: row.parent_id,
      data: row.data ? JSON.parse(row.data) : null
    };
  }
};
var OptionsRepository = class {
  constructor(db) {
    this.db = db;
  }
  /**
  * Get an option value
  */
  async get(name) {
    const row = await this.db.selectFrom("options").select("value").where("name", "=", name).executeTakeFirst();
    if (!row) return null;
    return JSON.parse(row.value);
  }
  /**
  * Get an option value with a default
  */
  async getOrDefault(name, defaultValue) {
    return await this.get(name) ?? defaultValue;
  }
  /**
  * Set an option value (creates or updates)
  */
  async set(name, value) {
    const row = {
      name,
      value: JSON.stringify(value)
    };
    await this.db.insertInto("options").values(row).onConflict((oc) => oc.column("name").doUpdateSet({ value: row.value })).execute();
  }
  /**
  * Delete an option
  */
  async delete(name) {
    return ((await this.db.deleteFrom("options").where("name", "=", name).executeTakeFirst()).numDeletedRows ?? 0) > 0;
  }
  /**
  * Check if an option exists
  */
  async exists(name) {
    return !!await this.db.selectFrom("options").select("name").where("name", "=", name).executeTakeFirst();
  }
  /**
  * Get multiple options at once
  */
  async getMany(names) {
    if (names.length === 0) return /* @__PURE__ */ new Map();
    const rows = await this.db.selectFrom("options").select(["name", "value"]).where("name", "in", names).execute();
    const result = /* @__PURE__ */ new Map();
    for (const row of rows) result.set(row.name, JSON.parse(row.value));
    return result;
  }
  /**
  * Set multiple options at once
  */
  async setMany(options) {
    const entries = Object.entries(options);
    if (entries.length === 0) return;
    for (const [name, value] of entries) await this.set(name, value);
  }
  /**
  * Get all options (use sparingly)
  */
  async getAll() {
    const rows = await this.db.selectFrom("options").select(["name", "value"]).execute();
    const result = /* @__PURE__ */ new Map();
    for (const row of rows) result.set(row.name, JSON.parse(row.value));
    return result;
  }
  /**
  * Get all options matching a prefix
  */
  async getByPrefix(prefix) {
    const rows = await this.db.selectFrom("options").select(["name", "value"]).where("name", "like", `${prefix}%`).execute();
    const result = /* @__PURE__ */ new Map();
    for (const row of rows) result.set(row.name, JSON.parse(row.value));
    return result;
  }
  /**
  * Delete all options matching a prefix
  */
  async deleteByPrefix(prefix) {
    const result = await this.db.deleteFrom("options").where("name", "like", `${prefix}%`).executeTakeFirst();
    return Number(result.numDeletedRows ?? 0);
  }
};
const SETTINGS_PREFIX = "site:";
function isMediaReference(value) {
  return typeof value === "object" && value !== null && "mediaId" in value;
}
async function resolveMediaReference(mediaRef, db, _storage) {
  if (!mediaRef?.mediaId) return mediaRef;
  try {
    const media = await new MediaRepository(db).findById(mediaRef.mediaId);
    if (media) return {
      ...mediaRef,
      url: `/_emdash/api/media/file/${media.storageKey}`
    };
  } catch {
  }
  return mediaRef;
}
async function getSiteSetting(key) {
  return getSiteSettingWithDb(key, await getDb());
}
async function getSiteSettingWithDb(key, db, storage2 = null) {
  const value = await new OptionsRepository(db).get(`${SETTINGS_PREFIX}${key}`);
  if (!value) return;
  if ((key === "logo" || key === "favicon") && isMediaReference(value)) return await resolveMediaReference(value, db);
  return value;
}
async function getSiteSettings() {
  return getSiteSettingsWithDb(await getDb());
}
async function getSiteSettingsWithDb(db, storage2 = null) {
  const allOptions = await new OptionsRepository(db).getByPrefix(SETTINGS_PREFIX);
  const settings = {};
  for (const [key, value] of allOptions) {
    const settingKey = key.replace(SETTINGS_PREFIX, "");
    settings[settingKey] = value;
  }
  const typedSettings = settings;
  if (typedSettings.logo) typedSettings.logo = await resolveMediaReference(typedSettings.logo, db);
  if (typedSettings.favicon) typedSettings.favicon = await resolveMediaReference(typedSettings.favicon, db);
  return typedSettings;
}
async function setSiteSettings(settings, db) {
  const options = new OptionsRepository(db);
  const updates = {};
  for (const [key, value] of Object.entries(settings)) if (value !== void 0) updates[`${SETTINGS_PREFIX}${key}`] = value;
  await options.setMany(updates);
}
const IPV4_MAPPED_IPV6_DOTTED_PATTERN = /^::ffff:(\d+\.\d+\.\d+\.\d+)$/i;
const IPV4_MAPPED_IPV6_HEX_PATTERN = /^::ffff:([0-9a-f]{1,4}):([0-9a-f]{1,4})$/i;
const IPV4_TRANSLATED_HEX_PATTERN = /^::ffff:0:([0-9a-f]{1,4}):([0-9a-f]{1,4})$/i;
const IPV6_EXPANDED_MAPPED_PATTERN = /^0{0,4}:0{0,4}:0{0,4}:0{0,4}:0{0,4}:ffff:([0-9a-f]{1,4}):([0-9a-f]{1,4})$/i;
const IPV4_COMPATIBLE_HEX_PATTERN = /^::([0-9a-f]{1,4}):([0-9a-f]{1,4})$/i;
const NAT64_HEX_PATTERN = /^64:ff9b::([0-9a-f]{1,4}):([0-9a-f]{1,4})$/i;
const IPV6_BRACKET_PATTERN = /^\[|\]$/g;
const BLOCKED_PATTERNS = [
  {
    start: ip4ToNum(127, 0, 0, 0),
    end: ip4ToNum(127, 255, 255, 255)
  },
  {
    start: ip4ToNum(10, 0, 0, 0),
    end: ip4ToNum(10, 255, 255, 255)
  },
  {
    start: ip4ToNum(172, 16, 0, 0),
    end: ip4ToNum(172, 31, 255, 255)
  },
  {
    start: ip4ToNum(192, 168, 0, 0),
    end: ip4ToNum(192, 168, 255, 255)
  },
  {
    start: ip4ToNum(169, 254, 0, 0),
    end: ip4ToNum(169, 254, 255, 255)
  },
  {
    start: ip4ToNum(0, 0, 0, 0),
    end: ip4ToNum(0, 255, 255, 255)
  }
];
const BLOCKED_HOSTNAMES = /* @__PURE__ */ new Set([
  "localhost",
  "metadata.google.internal",
  "metadata.google",
  "[::1]"
]);
const ALLOWED_SCHEMES = /* @__PURE__ */ new Set(["http:", "https:"]);
function ip4ToNum(a, b2, c, d) {
  return (a << 24 | b2 << 16 | c << 8 | d) >>> 0;
}
function parseIpv4(ip) {
  const parts = ip.split(".");
  if (parts.length !== 4) return null;
  const nums = parts.map(Number);
  if (nums.some((n) => isNaN(n) || n < 0 || n > 255)) return null;
  return ip4ToNum(nums[0], nums[1], nums[2], nums[3]);
}
function normalizeIPv6MappedToIPv4(ip) {
  let match = ip.match(IPV4_MAPPED_IPV6_HEX_PATTERN);
  if (!match) match = ip.match(IPV4_TRANSLATED_HEX_PATTERN);
  if (!match) match = ip.match(IPV6_EXPANDED_MAPPED_PATTERN);
  if (!match) match = ip.match(IPV4_COMPATIBLE_HEX_PATTERN);
  if (!match) match = ip.match(NAT64_HEX_PATTERN);
  if (match) {
    const high = parseInt(match[1] ?? "", 16);
    const low = parseInt(match[2] ?? "", 16);
    return `${high >> 8 & 255}.${high & 255}.${low >> 8 & 255}.${low & 255}`;
  }
  return null;
}
function isPrivateIp(ip) {
  if (ip === "::1" || ip === "::ffff:127.0.0.1") return true;
  const hexIpv4 = normalizeIPv6MappedToIPv4(ip);
  if (hexIpv4) return isPrivateIp(hexIpv4);
  const v4Match = ip.match(IPV4_MAPPED_IPV6_DOTTED_PATTERN);
  const num = parseIpv4(v4Match ? v4Match[1] : ip);
  if (num === null) return ip.startsWith("fe80:") || ip.startsWith("fc") || ip.startsWith("fd");
  return BLOCKED_PATTERNS.some((range) => num >= range.start && num <= range.end);
}
var SsrfError = class extends Error {
  code = "SSRF_BLOCKED";
  constructor(message) {
    super(message);
    this.name = "SsrfError";
  }
};
const MAX_REDIRECTS = 5;
function validateExternalUrl(url) {
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    throw new SsrfError("Invalid URL");
  }
  if (!ALLOWED_SCHEMES.has(parsed.protocol)) throw new SsrfError(`Scheme '${parsed.protocol}' is not allowed`);
  const hostname = parsed.hostname.replace(IPV6_BRACKET_PATTERN, "");
  if (BLOCKED_HOSTNAMES.has(hostname.toLowerCase())) throw new SsrfError("URLs targeting internal hosts are not allowed");
  if (isPrivateIp(hostname)) throw new SsrfError("URLs targeting private IP addresses are not allowed");
  return parsed;
}
const CREDENTIAL_HEADERS = [
  "authorization",
  "cookie",
  "proxy-authorization"
];
async function ssrfSafeFetch(url, init) {
  let currentUrl = url;
  let currentInit = init;
  for (let i = 0; i <= MAX_REDIRECTS; i++) {
    validateExternalUrl(currentUrl);
    const response = await globalThis.fetch(currentUrl, {
      ...currentInit,
      redirect: "manual"
    });
    if (response.status < 300 || response.status >= 400) return response;
    const location = response.headers.get("Location");
    if (!location) return response;
    const previousOrigin = new URL(currentUrl).origin;
    currentUrl = new URL(location, currentUrl).href;
    if (previousOrigin !== new URL(currentUrl).origin && currentInit) currentInit = stripCredentialHeaders(currentInit);
  }
  throw new SsrfError(`Too many redirects (max ${MAX_REDIRECTS})`);
}
function stripCredentialHeaders(init) {
  if (!init.headers) return init;
  const headers = new Headers(init.headers);
  for (const name of CREDENTIAL_HEADERS) headers.delete(name);
  return {
    ...init,
    headers
  };
}
var apply_exports = /* @__PURE__ */ __exportAll({ applySeed: () => applySeed });
const FILE_EXTENSION_PATTERN = /\.([a-z0-9]+)(?:\?|$)/i;
const EXTENSION_PATTERN = /\.[^.]+$/;
const QUERY_PARAM_PATTERN = /\?.*$/;
const SANITIZE_PATTERN = /[^a-zA-Z0-9_-]/g;
const MULTIPLE_HYPHENS_PATTERN = /-+/g;
async function applySeed(db, seed, options = {}) {
  const validation = validateSeed(seed);
  if (!validation.valid) throw new Error(`Invalid seed file:
${validation.errors.join("\n")}`);
  const { includeContent = false, storage: storage2, skipMediaDownload = false, onConflict = "skip" } = options;
  const result = {
    collections: {
      created: 0,
      skipped: 0,
      updated: 0
    },
    fields: {
      created: 0,
      skipped: 0,
      updated: 0
    },
    taxonomies: {
      created: 0,
      terms: 0
    },
    bylines: {
      created: 0,
      skipped: 0,
      updated: 0
    },
    menus: {
      created: 0,
      items: 0
    },
    redirects: {
      created: 0,
      skipped: 0,
      updated: 0
    },
    widgetAreas: {
      created: 0,
      widgets: 0
    },
    sections: {
      created: 0,
      skipped: 0,
      updated: 0
    },
    settings: { applied: 0 },
    content: {
      created: 0,
      skipped: 0,
      updated: 0
    },
    media: {
      created: 0,
      skipped: 0
    }
  };
  const mediaContext = {
    db,
    storage: storage2 ?? null,
    skipMediaDownload,
    mediaCache: /* @__PURE__ */ new Map()
  };
  const seedIdMap = /* @__PURE__ */ new Map();
  const seedBylineIdMap = /* @__PURE__ */ new Map();
  if (seed.settings) {
    await setSiteSettings(seed.settings, db);
    result.settings.applied = Object.keys(seed.settings).length;
  }
  if (seed.collections) {
    const registry = new SchemaRegistry(db);
    for (const collection of seed.collections) {
      if (await registry.getCollection(collection.slug)) {
        if (onConflict === "error") throw new Error(`Conflict: collection "${collection.slug}" already exists`);
        if (onConflict === "update") {
          await registry.updateCollection(collection.slug, {
            label: collection.label,
            labelSingular: collection.labelSingular,
            description: collection.description,
            icon: collection.icon,
            supports: collection.supports || [],
            urlPattern: collection.urlPattern,
            commentsEnabled: collection.commentsEnabled
          });
          result.collections.updated++;
          for (const field of collection.fields) if (await registry.getField(collection.slug, field.slug)) {
            await registry.updateField(collection.slug, field.slug, {
              label: field.label,
              required: field.required || false,
              unique: field.unique || false,
              searchable: field.searchable || false,
              defaultValue: field.defaultValue,
              validation: field.validation,
              widget: field.widget,
              options: field.options
            });
            result.fields.updated++;
          } else {
            await registry.createField(collection.slug, {
              slug: field.slug,
              label: field.label,
              type: field.type,
              required: field.required || false,
              unique: field.unique || false,
              searchable: field.searchable || false,
              defaultValue: field.defaultValue,
              validation: field.validation,
              widget: field.widget,
              options: field.options
            });
            result.fields.created++;
          }
          continue;
        }
        result.collections.skipped++;
        result.fields.skipped += collection.fields.length;
        continue;
      }
      await registry.createCollection({
        slug: collection.slug,
        label: collection.label,
        labelSingular: collection.labelSingular,
        description: collection.description,
        icon: collection.icon,
        supports: collection.supports || [],
        source: "seed",
        urlPattern: collection.urlPattern,
        commentsEnabled: collection.commentsEnabled
      });
      result.collections.created++;
      for (const field of collection.fields) {
        await registry.createField(collection.slug, {
          slug: field.slug,
          label: field.label,
          type: field.type,
          required: field.required || false,
          unique: field.unique || false,
          searchable: field.searchable || false,
          defaultValue: field.defaultValue,
          validation: field.validation,
          widget: field.widget,
          options: field.options
        });
        result.fields.created++;
      }
    }
  }
  if (seed.taxonomies) for (const taxonomy of seed.taxonomies) {
    const existingDef = await db.selectFrom("_emdash_taxonomy_defs").selectAll().where("name", "=", taxonomy.name).executeTakeFirst();
    if (existingDef) {
      if (onConflict === "error") throw new Error(`Conflict: taxonomy "${taxonomy.name}" already exists`);
      if (onConflict === "update") await db.updateTable("_emdash_taxonomy_defs").set({
        label: taxonomy.label,
        label_singular: taxonomy.labelSingular ?? null,
        hierarchical: taxonomy.hierarchical ? 1 : 0,
        collections: JSON.stringify(taxonomy.collections)
      }).where("id", "=", existingDef.id).execute();
    } else {
      await db.insertInto("_emdash_taxonomy_defs").values({
        id: ulid(),
        name: taxonomy.name,
        label: taxonomy.label,
        label_singular: taxonomy.labelSingular ?? null,
        hierarchical: taxonomy.hierarchical ? 1 : 0,
        collections: JSON.stringify(taxonomy.collections)
      }).execute();
      result.taxonomies.created++;
    }
    if (taxonomy.terms && taxonomy.terms.length > 0) {
      const termRepo = new TaxonomyRepository(db);
      if (taxonomy.hierarchical) await applyHierarchicalTerms(termRepo, taxonomy.name, taxonomy.terms, result, onConflict);
      else for (const term of taxonomy.terms) {
        const existing = await termRepo.findBySlug(taxonomy.name, term.slug);
        if (existing) {
          if (onConflict === "error") throw new Error(`Conflict: taxonomy term "${term.slug}" in "${taxonomy.name}" already exists`);
          if (onConflict === "update") {
            await termRepo.update(existing.id, {
              label: term.label,
              data: term.description ? { description: term.description } : {}
            });
            result.taxonomies.terms++;
          }
        } else {
          await termRepo.create({
            name: taxonomy.name,
            slug: term.slug,
            label: term.label,
            data: term.description ? { description: term.description } : void 0
          });
          result.taxonomies.terms++;
        }
      }
    }
  }
  if (seed.bylines) {
    const bylineRepo = new BylineRepository(db);
    for (const byline of seed.bylines) {
      const existing = await bylineRepo.findBySlug(byline.slug);
      if (existing) {
        if (onConflict === "error") throw new Error(`Conflict: byline "${byline.slug}" already exists`);
        if (onConflict === "update") {
          await bylineRepo.update(existing.id, {
            displayName: byline.displayName,
            bio: byline.bio ?? null,
            websiteUrl: byline.websiteUrl ?? null,
            isGuest: byline.isGuest
          });
          seedBylineIdMap.set(byline.id, existing.id);
          result.bylines.updated++;
          continue;
        }
        seedBylineIdMap.set(byline.id, existing.id);
        result.bylines.skipped++;
        continue;
      }
      const created = await bylineRepo.create({
        slug: byline.slug,
        displayName: byline.displayName,
        bio: byline.bio ?? null,
        websiteUrl: byline.websiteUrl ?? null,
        isGuest: byline.isGuest
      });
      seedBylineIdMap.set(byline.id, created.id);
      result.bylines.created++;
    }
  }
  if (includeContent && seed.content) {
    const contentRepo = new ContentRepository(db);
    const bylineRepo = new BylineRepository(db);
    for (const [collectionSlug, entries] of Object.entries(seed.content)) for (const entry of entries) {
      const existing = await contentRepo.findBySlug(collectionSlug, entry.slug, entry.locale);
      if (existing) {
        if (onConflict === "error") throw new Error(`Conflict: content "${entry.slug}" in "${collectionSlug}" already exists`);
        if (onConflict === "update") {
          const resolvedData2 = await resolveReferences(entry.data, seedIdMap, mediaContext, result);
          const status2 = entry.status || "published";
          await contentRepo.update(collectionSlug, existing.id, {
            status: status2,
            data: resolvedData2
          });
          seedIdMap.set(entry.id, existing.id);
          result.content.updated++;
          await applyContentBylines(bylineRepo, collectionSlug, existing.id, entry, seedBylineIdMap, true);
          await applyContentTaxonomies(db, collectionSlug, existing.id, entry, true);
          continue;
        }
        result.content.skipped++;
        seedIdMap.set(entry.id, existing.id);
        continue;
      }
      const resolvedData = await resolveReferences(entry.data, seedIdMap, mediaContext, result);
      let translationOf;
      if (entry.translationOf) {
        const sourceId = seedIdMap.get(entry.translationOf);
        if (!sourceId) console.warn(`content.${collectionSlug}: translationOf "${entry.translationOf}" not found (not yet created or missing). Skipping translation link.`);
        else translationOf = sourceId;
      }
      const status = entry.status || "published";
      const created = await contentRepo.create({
        type: collectionSlug,
        slug: entry.slug,
        status,
        data: resolvedData,
        locale: entry.locale,
        translationOf,
        publishedAt: status === "published" ? (/* @__PURE__ */ new Date()).toISOString() : null
      });
      seedIdMap.set(entry.id, created.id);
      result.content.created++;
      await applyContentBylines(bylineRepo, collectionSlug, created.id, entry, seedBylineIdMap);
      await applyContentTaxonomies(db, collectionSlug, created.id, entry, false);
    }
  }
  if (seed.menus) for (const menu of seed.menus) {
    const existingMenu = await db.selectFrom("_emdash_menus").selectAll().where("name", "=", menu.name).executeTakeFirst();
    let menuId;
    if (existingMenu) {
      menuId = existingMenu.id;
      await db.deleteFrom("_emdash_menu_items").where("menu_id", "=", menuId).execute();
    } else {
      menuId = ulid();
      await db.insertInto("_emdash_menus").values({
        id: menuId,
        name: menu.name,
        label: menu.label,
        created_at: (/* @__PURE__ */ new Date()).toISOString(),
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      }).execute();
      result.menus.created++;
    }
    const itemCount = await applyMenuItems(db, menuId, menu.items, null, 0, seedIdMap);
    result.menus.items += itemCount;
  }
  if (seed.redirects) {
    const redirectRepo = new RedirectRepository(db);
    for (const redirect of seed.redirects) {
      const existing = await redirectRepo.findBySource(redirect.source);
      if (existing) {
        if (onConflict === "error") throw new Error(`Conflict: redirect "${redirect.source}" already exists`);
        if (onConflict === "update") {
          await redirectRepo.update(existing.id, {
            destination: redirect.destination,
            type: redirect.type,
            enabled: redirect.enabled,
            groupName: redirect.groupName
          });
          result.redirects.updated++;
          continue;
        }
        result.redirects.skipped++;
        continue;
      }
      await redirectRepo.create({
        source: redirect.source,
        destination: redirect.destination,
        type: redirect.type,
        enabled: redirect.enabled,
        groupName: redirect.groupName
      });
      result.redirects.created++;
    }
  }
  if (seed.widgetAreas) for (const area of seed.widgetAreas) {
    const existingArea = await db.selectFrom("_emdash_widget_areas").selectAll().where("name", "=", area.name).executeTakeFirst();
    let areaId;
    if (existingArea) {
      areaId = existingArea.id;
      await db.deleteFrom("_emdash_widgets").where("area_id", "=", areaId).execute();
    } else {
      areaId = ulid();
      await db.insertInto("_emdash_widget_areas").values({
        id: areaId,
        name: area.name,
        label: area.label,
        description: area.description ?? null
      }).execute();
      result.widgetAreas.created++;
    }
    for (let i = 0; i < area.widgets.length; i++) {
      const widget = area.widgets[i];
      await applyWidget(db, areaId, widget, i);
      result.widgetAreas.widgets++;
    }
  }
  if (seed.sections) for (const section of seed.sections) {
    const existing = await db.selectFrom("_emdash_sections").select("id").where("slug", "=", section.slug).executeTakeFirst();
    if (existing) {
      if (onConflict === "error") throw new Error(`Conflict: section "${section.slug}" already exists`);
      if (onConflict === "update") {
        await db.updateTable("_emdash_sections").set({
          title: section.title,
          description: section.description ?? null,
          keywords: section.keywords ? JSON.stringify(section.keywords) : null,
          content: JSON.stringify(section.content),
          source: section.source || "theme",
          updated_at: (/* @__PURE__ */ new Date()).toISOString()
        }).where("id", "=", existing.id).execute();
        result.sections.updated++;
        continue;
      }
      result.sections.skipped++;
      continue;
    }
    const id = ulid();
    const now = (/* @__PURE__ */ new Date()).toISOString();
    await db.insertInto("_emdash_sections").values({
      id,
      slug: section.slug,
      title: section.title,
      description: section.description ?? null,
      keywords: section.keywords ? JSON.stringify(section.keywords) : null,
      content: JSON.stringify(section.content),
      preview_media_id: null,
      source: section.source || "theme",
      theme_id: section.source === "theme" ? section.slug : null,
      created_at: now,
      updated_at: now
    }).execute();
    result.sections.created++;
  }
  if (seed.collections) {
    const ftsManager = new FTSManager(db);
    for (const collection of seed.collections) if (collection.supports?.includes("search")) {
      if ((await ftsManager.getSearchableFields(collection.slug)).length > 0) try {
        await ftsManager.enableSearch(collection.slug);
      } catch (err) {
        console.warn(`Failed to enable search for ${collection.slug}:`, err);
      }
    }
  }
  return result;
}
async function applyHierarchicalTerms(termRepo, taxonomyName, terms, result, onConflict = "skip") {
  const slugToId = /* @__PURE__ */ new Map();
  let remaining = [...terms];
  let maxPasses = 10;
  while (remaining.length > 0 && maxPasses > 0) {
    const processedThisPass = [];
    for (const term of remaining) if (!term.parent || slugToId.has(term.parent)) {
      const parentId = term.parent ? slugToId.get(term.parent) : void 0;
      const existing = await termRepo.findBySlug(taxonomyName, term.slug);
      if (existing) {
        if (onConflict === "error") throw new Error(`Conflict: taxonomy term "${term.slug}" in "${taxonomyName}" already exists`);
        if (onConflict === "update") {
          await termRepo.update(existing.id, {
            label: term.label,
            parentId,
            data: term.description ? { description: term.description } : {}
          });
          result.taxonomies.terms++;
        }
        slugToId.set(term.slug, existing.id);
      } else {
        const created = await termRepo.create({
          name: taxonomyName,
          slug: term.slug,
          label: term.label,
          parentId,
          data: term.description ? { description: term.description } : void 0
        });
        slugToId.set(term.slug, created.id);
        result.taxonomies.terms++;
      }
      processedThisPass.push(term.slug);
    }
    remaining = remaining.filter((t) => !processedThisPass.includes(t.slug));
    maxPasses--;
  }
  if (remaining.length > 0) console.warn(`Could not process ${remaining.length} terms due to missing parents`);
}
async function applyContentBylines(bylineRepo, collectionSlug, contentId, entry, seedBylineIdMap, isUpdate = false) {
  if (!entry.bylines || entry.bylines.length === 0) {
    if (isUpdate) await bylineRepo.setContentBylines(collectionSlug, contentId, []);
    return;
  }
  const credits = entry.bylines.map((credit) => {
    const bylineId = seedBylineIdMap.get(credit.byline);
    if (!bylineId) return null;
    return {
      bylineId,
      roleLabel: credit.roleLabel ?? null
    };
  }).filter((credit) => Boolean(credit));
  if (credits.length !== entry.bylines.length) console.warn(`content.${collectionSlug}.${entry.slug}: one or more byline refs could not be resolved`);
  if (credits.length > 0 || isUpdate) await bylineRepo.setContentBylines(collectionSlug, contentId, credits);
}
async function applyContentTaxonomies(db, collectionSlug, contentId, entry, isUpdate) {
  if (isUpdate) await db.deleteFrom("content_taxonomies").where("collection", "=", collectionSlug).where("entry_id", "=", contentId).execute();
  if (!entry.taxonomies) return;
  for (const [taxonomyName, termSlugs] of Object.entries(entry.taxonomies)) {
    const termRepo = new TaxonomyRepository(db);
    for (const termSlug of termSlugs) {
      const term = await termRepo.findBySlug(taxonomyName, termSlug);
      if (term) await termRepo.attachToEntry(collectionSlug, contentId, term.id);
    }
  }
}
async function applyMenuItems(db, menuId, items, parentId, startOrder, seedIdMap) {
  let count = 0;
  let order = startOrder;
  for (const item of items) {
    const itemId = ulid();
    let referenceId = null;
    let referenceCollection = null;
    if (item.type === "page" || item.type === "post") {
      if (item.ref && seedIdMap.has(item.ref)) {
        referenceId = seedIdMap.get(item.ref);
        referenceCollection = item.collection || `${item.type}s`;
      }
    }
    await db.insertInto("_emdash_menu_items").values({
      id: itemId,
      menu_id: menuId,
      parent_id: parentId,
      sort_order: order,
      type: item.type,
      reference_collection: referenceCollection,
      reference_id: referenceId,
      custom_url: item.url ?? null,
      label: item.label || "",
      title_attr: item.titleAttr ?? null,
      target: item.target ?? null,
      css_classes: item.cssClasses ?? null,
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    }).execute();
    count++;
    order++;
    if (item.children && item.children.length > 0) {
      const childCount = await applyMenuItems(db, menuId, item.children, itemId, 0, seedIdMap);
      count += childCount;
    }
  }
  return count;
}
async function applyWidget(db, areaId, widget, sortOrder) {
  await db.insertInto("_emdash_widgets").values({
    id: ulid(),
    area_id: areaId,
    sort_order: sortOrder,
    type: widget.type,
    title: widget.title ?? null,
    content: widget.content ? JSON.stringify(widget.content) : null,
    menu_name: widget.menuName ?? null,
    component_id: widget.componentId ?? null,
    component_props: widget.props ? JSON.stringify(widget.props) : null
  }).execute();
}
function isSeedMediaReference(value) {
  if (typeof value !== "object" || value === null || !("$media" in value)) return false;
  const media = value.$media;
  return typeof media === "object" && media !== null && "url" in media && typeof media.url === "string";
}
async function resolveReferences(data, seedIdMap, mediaContext, result) {
  const resolved = {};
  for (const [key, value] of Object.entries(data)) resolved[key] = await resolveValue(value, seedIdMap, mediaContext, result);
  return resolved;
}
async function resolveValue(value, seedIdMap, mediaContext, result) {
  if (typeof value === "string" && value.startsWith("$ref:")) {
    const seedId = value.slice(5);
    return seedIdMap.get(seedId) ?? value;
  }
  if (isSeedMediaReference(value)) return resolveMedia(value, mediaContext, result);
  if (Array.isArray(value)) return Promise.all(value.map((item) => resolveValue(item, seedIdMap, mediaContext, result)));
  if (typeof value === "object" && value !== null) {
    const resolved = {};
    for (const [k2, v2] of Object.entries(value)) resolved[k2] = await resolveValue(v2, seedIdMap, mediaContext, result);
    return resolved;
  }
  return value;
}
async function resolveMedia(ref, ctx, result) {
  const { url, alt, filename, caption } = ref.$media;
  const cached = ctx.mediaCache.get(url);
  if (cached) {
    result.media.skipped++;
    return {
      ...cached,
      alt: alt ?? cached.alt
    };
  }
  if (ctx.skipMediaDownload) {
    const mediaValue = {
      provider: "external",
      id: ulid(),
      src: url,
      alt: alt ?? void 0,
      filename: filename ?? void 0
    };
    ctx.mediaCache.set(url, mediaValue);
    result.media.created++;
    return mediaValue;
  }
  if (!ctx.storage) {
    console.warn(`Skipping $media reference (no storage configured): ${url}`);
    result.media.skipped++;
    return null;
  }
  try {
    validateExternalUrl(url);
    console.log(`  📥 Downloading: ${url}`);
    const response = await ssrfSafeFetch(url, { headers: { "User-Agent": "EmDash-CMS/1.0" } });
    if (!response.ok) {
      console.warn(`  ⚠️ Failed to download ${url}: ${response.status}`);
      result.media.skipped++;
      return null;
    }
    const contentType = response.headers.get("content-type") || "application/octet-stream";
    const ext = getExtensionFromContentType(contentType) || getExtensionFromUrl(url) || ".bin";
    const id = ulid();
    const finalFilename = filename || generateFilename(url, ext);
    const storageKey = `${id}${ext}`;
    const arrayBuffer = await response.arrayBuffer();
    const body = new Uint8Array(arrayBuffer);
    let width;
    let height;
    if (contentType.startsWith("image/")) {
      const dimensions = getImageDimensions(body);
      width = dimensions?.width;
      height = dimensions?.height;
    }
    await ctx.storage.upload({
      key: storageKey,
      body,
      contentType
    });
    await new MediaRepository(ctx.db).create({
      filename: finalFilename,
      mimeType: contentType,
      size: body.length,
      width,
      height,
      alt,
      caption,
      storageKey,
      status: "ready"
    });
    const mediaValue = {
      provider: "local",
      id,
      alt: alt ?? void 0,
      width,
      height,
      mimeType: contentType,
      filename: finalFilename,
      meta: { storageKey }
    };
    ctx.mediaCache.set(url, mediaValue);
    result.media.created++;
    console.log(`  ✅ Uploaded: ${finalFilename}`);
    return mediaValue;
  } catch (error) {
    console.warn(`  ⚠️ Error processing $media ${url}:`, error instanceof Error ? error.message : error);
    result.media.skipped++;
    return null;
  }
}
function getExtensionFromContentType(contentType) {
  const baseMime = contentType.split(";")[0].trim();
  const ext = mime.getExtension(baseMime);
  return ext ? `.${ext}` : null;
}
function getExtensionFromUrl(url) {
  try {
    const match = new URL(url).pathname.match(FILE_EXTENSION_PATTERN);
    return match ? `.${match[1]}` : null;
  } catch {
    return null;
  }
}
function generateFilename(url, ext) {
  try {
    return `${(new URL(url).pathname.split("/").pop() || "media").replace(EXTENSION_PATTERN, "").replace(QUERY_PARAM_PATTERN, "").replace(SANITIZE_PATTERN, "-").replace(MULTIPLE_HYPHENS_PATTERN, "-") || "media"}${ext}`;
  } catch {
    return `media${ext}`;
  }
}
function getImageDimensions(buffer) {
  try {
    const result = imageSize(buffer);
    if (result.width != null && result.height != null) return {
      width: result.width,
      height: result.height
    };
    return null;
  } catch {
    return null;
  }
}
const applyBjfq_b4_ = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  a: stripCredentialHeaders,
  c: getSiteSettings,
  d: TaxonomyRepository,
  i: ssrfSafeFetch,
  l: setSiteSettings,
  n: apply_exports,
  o: validateExternalUrl,
  r: SsrfError,
  s: getSiteSetting,
  t: applySeed,
  u: OptionsRepository
}, Symbol.toStringTag, { value: "Module" }));
var config_exports = /* @__PURE__ */ __exportAll({
  getFallbackChain: () => getFallbackChain,
  getI18nConfig: () => getI18nConfig,
  isI18nEnabled: () => isI18nEnabled,
  setI18nConfig: () => setI18nConfig
});
let _config;
function setI18nConfig(config) {
  _config = config;
}
function getI18nConfig() {
  return _config ?? null;
}
function isI18nEnabled() {
  return _config != null && _config.locales.length > 1;
}
function getFallbackChain(locale) {
  if (!_config) return [locale];
  const chain = [locale];
  let current = locale;
  const visited = /* @__PURE__ */ new Set([locale]);
  while (_config.fallback?.[current]) {
    const next = _config.fallback[current];
    if (visited.has(next)) break;
    chain.push(next);
    visited.add(next);
    current = next;
  }
  if (!visited.has(_config.defaultLocale)) chain.push(_config.defaultLocale);
  return chain;
}
const configCKE8p9xM = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  a: setI18nConfig,
  i: isI18nEnabled,
  n: getFallbackChain,
  r: getI18nConfig,
  t: config_exports
}, Symbol.toStringTag, { value: "Module" }));
const PLUGIN_CAPABILITIES = [
  "network:fetch",
  "network:fetch:any",
  "read:content",
  "write:content",
  "read:media",
  "write:media",
  "read:users",
  "email:send",
  "email:provide",
  "email:intercept",
  "page:inject"
];
const FIELD_TYPES = [
  "string",
  "text",
  "number",
  "integer",
  "boolean",
  "datetime",
  "select",
  "multiSelect",
  "portableText",
  "image",
  "file",
  "reference",
  "json",
  "slug"
];
const HOOK_NAMES = [
  "plugin:install",
  "plugin:activate",
  "plugin:deactivate",
  "plugin:uninstall",
  "content:beforeSave",
  "content:afterSave",
  "content:beforeDelete",
  "content:afterDelete",
  "media:beforeUpload",
  "media:afterUpload",
  "cron",
  "email:beforeSend",
  "email:deliver",
  "email:afterSend",
  "comment:beforeCreate",
  "comment:moderate",
  "comment:afterCreate",
  "comment:afterModerate",
  "page:metadata",
  "page:fragments"
];
const manifestHookEntrySchema = object({
  name: _enum(HOOK_NAMES),
  exclusive: boolean().optional(),
  priority: number().int().optional(),
  timeout: number().int().positive().optional()
});
const routeNamePattern = /^[a-zA-Z0-9][a-zA-Z0-9_\-/]*$/;
const manifestRouteEntrySchema = object({
  name: string().min(1).regex(routeNamePattern, "Route name must be a safe path segment"),
  public: boolean().optional()
});
const indexFieldName = string().regex(/^[a-zA-Z][a-zA-Z0-9_]*$/);
const storageCollectionSchema = object({
  indexes: array(union([indexFieldName, array(indexFieldName)])),
  uniqueIndexes: array(union([indexFieldName, array(indexFieldName)])).optional()
});
const baseSettingFields = {
  label: string(),
  description: string().optional()
};
const settingFieldSchema = discriminatedUnion("type", [
  object({
    ...baseSettingFields,
    type: literal("string"),
    default: string().optional(),
    multiline: boolean().optional()
  }),
  object({
    ...baseSettingFields,
    type: literal("number"),
    default: number().optional(),
    min: number().optional(),
    max: number().optional()
  }),
  object({
    ...baseSettingFields,
    type: literal("boolean"),
    default: boolean().optional()
  }),
  object({
    ...baseSettingFields,
    type: literal("select"),
    options: array(object({
      value: string(),
      label: string()
    })),
    default: string().optional()
  }),
  object({
    ...baseSettingFields,
    type: literal("secret")
  })
]);
const adminPageSchema = object({
  path: string(),
  label: string(),
  icon: string().optional()
});
const dashboardWidgetSchema = object({
  id: string(),
  size: _enum([
    "full",
    "half",
    "third"
  ]).optional(),
  title: string().optional()
});
const pluginAdminConfigSchema = object({
  entry: string().optional(),
  settingsSchema: record(string(), settingFieldSchema).optional(),
  pages: array(adminPageSchema).optional(),
  widgets: array(dashboardWidgetSchema).optional(),
  fieldWidgets: array(object({
    name: string().min(1),
    label: string().min(1),
    fieldTypes: array(_enum(FIELD_TYPES)),
    elements: array(object({
      type: string(),
      action_id: string(),
      label: string().optional()
    }).passthrough()).optional()
  })).optional()
});
const pluginManifestSchema = object({
  id: string().min(1),
  version: string().min(1),
  capabilities: array(_enum(PLUGIN_CAPABILITIES)),
  allowedHosts: array(string()),
  storage: record(string(), storageCollectionSchema),
  hooks: array(union([_enum(HOOK_NAMES), manifestHookEntrySchema])),
  routes: array(union([string().min(1).regex(routeNamePattern, "Route name must be a safe path segment"), manifestRouteEntrySchema])),
  admin: pluginAdminConfigSchema
});
function normalizeManifestRoute(entry) {
  if (typeof entry === "string") return { name: entry };
  return entry;
}
function T(s2) {
  return Date.UTC(s2.y, s2.m - 1, s2.d, s2.h, s2.i, s2.s);
}
function D(s2, e) {
  return s2.y === e.y && s2.m === e.m && s2.d === e.d && s2.h === e.h && s2.i === e.i && s2.s === e.s;
}
function A(s2, e) {
  let t = new Date(Date.parse(s2));
  if (isNaN(t)) throw new Error("Invalid ISO8601 passed to timezone parser.");
  let r = s2.substring(9);
  return r.includes("Z") || r.includes("+") || r.includes("-") ? b(t.getUTCFullYear(), t.getUTCMonth() + 1, t.getUTCDate(), t.getUTCHours(), t.getUTCMinutes(), t.getUTCSeconds(), "Etc/UTC") : b(t.getFullYear(), t.getMonth() + 1, t.getDate(), t.getHours(), t.getMinutes(), t.getSeconds(), e);
}
function v(s2, e, t) {
  return k(A(s2, e), t);
}
function k(s2, e) {
  let t = new Date(T(s2)), r = g(t, s2.tz), n = T(s2), i = T(r), a = n - i, o = new Date(t.getTime() + a), h = g(o, s2.tz);
  if (D(h, s2)) {
    let u = new Date(o.getTime() - 36e5), d = g(u, s2.tz);
    return D(d, s2) ? u : o;
  }
  let l = new Date(o.getTime() + T(s2) - T(h)), y = g(l, s2.tz);
  if (D(y, s2)) return l;
  if (e) throw new Error("Invalid date passed to fromTZ()");
  return o.getTime() > l.getTime() ? o : l;
}
function g(s2, e) {
  let t, r;
  try {
    t = new Intl.DateTimeFormat("en-US", { timeZone: e, year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric", hour12: false }), r = t.formatToParts(s2);
  } catch (i) {
    let a = i instanceof Error ? i.message : String(i);
    throw new RangeError(`toTZ: Invalid timezone '${e}' or date. Please provide a valid IANA timezone (e.g., 'America/New_York', 'Europe/Stockholm'). Original error: ${a}`);
  }
  let n = { year: 0, month: 0, day: 0, hour: 0, minute: 0, second: 0 };
  for (let i of r) (i.type === "year" || i.type === "month" || i.type === "day" || i.type === "hour" || i.type === "minute" || i.type === "second") && (n[i.type] = parseInt(i.value, 10));
  if (isNaN(n.year) || isNaN(n.month) || isNaN(n.day) || isNaN(n.hour) || isNaN(n.minute) || isNaN(n.second)) throw new Error(`toTZ: Failed to parse all date components from timezone '${e}'. This may indicate an invalid date or timezone configuration. Parsed components: ${JSON.stringify(n)}`);
  return n.hour === 24 && (n.hour = 0), { y: n.year, m: n.month, d: n.day, h: n.hour, i: n.minute, s: n.second, tz: e };
}
function b(s2, e, t, r, n, i, a) {
  return { y: s2, m: e, d: t, h: r, i: n, s: i, tz: a };
}
var O = [1, 2, 4, 8, 16], C = class {
  pattern;
  timezone;
  mode;
  alternativeWeekdays;
  sloppyRanges;
  second;
  minute;
  hour;
  day;
  month;
  dayOfWeek;
  year;
  lastDayOfMonth;
  lastWeekday;
  nearestWeekdays;
  starDOM;
  starDOW;
  starYear;
  useAndLogic;
  constructor(e, t, r) {
    this.pattern = e, this.timezone = t, this.mode = r?.mode ?? "auto", this.alternativeWeekdays = r?.alternativeWeekdays ?? false, this.sloppyRanges = r?.sloppyRanges ?? false, this.second = Array(60).fill(0), this.minute = Array(60).fill(0), this.hour = Array(24).fill(0), this.day = Array(31).fill(0), this.month = Array(12).fill(0), this.dayOfWeek = Array(7).fill(0), this.year = Array(1e4).fill(0), this.lastDayOfMonth = false, this.lastWeekday = false, this.nearestWeekdays = Array(31).fill(0), this.starDOM = false, this.starDOW = false, this.starYear = false, this.useAndLogic = false, this.parse();
  }
  parse() {
    if (!(typeof this.pattern == "string" || this.pattern instanceof String)) throw new TypeError("CronPattern: Pattern has to be of type string.");
    this.pattern.indexOf("@") >= 0 && (this.pattern = this.handleNicknames(this.pattern).trim());
    let e = this.pattern.match(/\S+/g) || [""], t = e.length;
    if (e.length < 5 || e.length > 7) throw new TypeError("CronPattern: invalid configuration format ('" + this.pattern + "'), exactly five, six, or seven space separated parts are required.");
    if (this.mode !== "auto") {
      let n;
      switch (this.mode) {
        case "5-part":
          n = 5;
          break;
        case "6-part":
          n = 6;
          break;
        case "7-part":
          n = 7;
          break;
        case "5-or-6-parts":
          n = [5, 6];
          break;
        case "6-or-7-parts":
          n = [6, 7];
          break;
        default:
          n = 0;
      }
      if (!(Array.isArray(n) ? n.includes(t) : t === n)) {
        let a = Array.isArray(n) ? n.join(" or ") : n.toString();
        throw new TypeError(`CronPattern: mode '${this.mode}' requires exactly ${a} parts, but pattern '${this.pattern}' has ${t} parts.`);
      }
    }
    if (e.length === 5 && e.unshift("0"), e.length === 6 && e.push("*"), e[3].toUpperCase() === "LW" ? (this.lastWeekday = true, e[3] = "") : e[3].toUpperCase().indexOf("L") >= 0 && (e[3] = e[3].replace(/L/gi, ""), this.lastDayOfMonth = true), e[3] == "*" && (this.starDOM = true), e[6] == "*" && (this.starYear = true), e[4].length >= 3 && (e[4] = this.replaceAlphaMonths(e[4])), e[5].length >= 3 && (e[5] = this.alternativeWeekdays ? this.replaceAlphaDaysQuartz(e[5]) : this.replaceAlphaDays(e[5])), e[5].startsWith("+") && (this.useAndLogic = true, e[5] = e[5].substring(1), e[5] === "")) throw new TypeError("CronPattern: Day-of-week field cannot be empty after '+' modifier.");
    switch (e[5] == "*" && (this.starDOW = true), this.pattern.indexOf("?") >= 0 && (e[0] = e[0].replace(/\?/g, "*"), e[1] = e[1].replace(/\?/g, "*"), e[2] = e[2].replace(/\?/g, "*"), e[3] = e[3].replace(/\?/g, "*"), e[4] = e[4].replace(/\?/g, "*"), e[5] = e[5].replace(/\?/g, "*"), e[6] && (e[6] = e[6].replace(/\?/g, "*"))), this.mode) {
      case "5-part":
        e[0] = "0", e[6] = "*";
        break;
      case "6-part":
        e[6] = "*";
        break;
      case "5-or-6-parts":
        e[6] = "*";
        break;
    }
    this.throwAtIllegalCharacters(e), this.partToArray("second", e[0], 0, 1), this.partToArray("minute", e[1], 0, 1), this.partToArray("hour", e[2], 0, 1), this.partToArray("day", e[3], -1, 1), this.partToArray("month", e[4], -1, 1);
    let r = this.alternativeWeekdays ? -1 : 0;
    this.partToArray("dayOfWeek", e[5], r, 63), this.partToArray("year", e[6], 0, 1), !this.alternativeWeekdays && this.dayOfWeek[7] && (this.dayOfWeek[0] = this.dayOfWeek[7]);
  }
  partToArray(e, t, r, n) {
    let i = this[e], a = e === "day" && this.lastDayOfMonth, o = e === "day" && this.lastWeekday;
    if (t === "" && !a && !o) throw new TypeError("CronPattern: configuration entry " + e + " (" + t + ") is empty, check for trailing spaces.");
    if (t === "*") return i.fill(n);
    let h = t.split(",");
    if (h.length > 1) for (let l = 0; l < h.length; l++) this.partToArray(e, h[l], r, n);
    else t.indexOf("-") !== -1 && t.indexOf("/") !== -1 ? this.handleRangeWithStepping(t, e, r, n) : t.indexOf("-") !== -1 ? this.handleRange(t, e, r, n) : t.indexOf("/") !== -1 ? this.handleStepping(t, e, r, n) : t !== "" && this.handleNumber(t, e, r, n);
  }
  throwAtIllegalCharacters(e) {
    for (let t = 0; t < e.length; t++) if ((t === 3 ? /[^/*0-9,\-WwLl]+/ : t === 5 ? /[^/*0-9,\-#Ll]+/ : /[^/*0-9,\-]+/).test(e[t])) throw new TypeError("CronPattern: configuration entry " + t + " (" + e[t] + ") contains illegal characters.");
  }
  handleNumber(e, t, r, n) {
    let i = this.extractNth(e, t), a = e.toUpperCase().includes("W");
    if (t !== "day" && a) throw new TypeError("CronPattern: Nearest weekday modifier (W) only allowed in day-of-month.");
    a && (t = "nearestWeekdays");
    let o = parseInt(i[0], 10) + r;
    if (isNaN(o)) throw new TypeError("CronPattern: " + t + " is not a number: '" + e + "'");
    this.setPart(t, o, i[1] || n);
  }
  setPart(e, t, r) {
    if (!Object.prototype.hasOwnProperty.call(this, e)) throw new TypeError("CronPattern: Invalid part specified: " + e);
    if (e === "dayOfWeek") {
      if (t === 7 && (t = 0), t < 0 || t > 6) throw new RangeError("CronPattern: Invalid value for dayOfWeek: " + t);
      this.setNthWeekdayOfMonth(t, r);
      return;
    }
    if (e === "second" || e === "minute") {
      if (t < 0 || t >= 60) throw new RangeError("CronPattern: Invalid value for " + e + ": " + t);
    } else if (e === "hour") {
      if (t < 0 || t >= 24) throw new RangeError("CronPattern: Invalid value for " + e + ": " + t);
    } else if (e === "day" || e === "nearestWeekdays") {
      if (t < 0 || t >= 31) throw new RangeError("CronPattern: Invalid value for " + e + ": " + t);
    } else if (e === "month") {
      if (t < 0 || t >= 12) throw new RangeError("CronPattern: Invalid value for " + e + ": " + t);
    } else if (e === "year" && (t < 1 || t >= 1e4)) throw new RangeError("CronPattern: Invalid value for " + e + ": " + t + " (supported range: 1-9999)");
    this[e][t] = r;
  }
  validateNotNaN(e, t) {
    if (isNaN(e)) throw new TypeError(t);
  }
  validateRange(e, t, r, n, i) {
    if (e > t) throw new TypeError("CronPattern: From value is larger than to value: '" + i + "'");
    if (r !== void 0) {
      if (r === 0) throw new TypeError("CronPattern: Syntax error, illegal stepping: 0");
      if (r > this[n].length) throw new TypeError("CronPattern: Syntax error, steps cannot be greater than maximum value of part (" + this[n].length + ")");
    }
  }
  handleRangeWithStepping(e, t, r, n) {
    if (e.toUpperCase().includes("W")) throw new TypeError("CronPattern: Syntax error, W is not allowed in ranges with stepping.");
    let i = this.extractNth(e, t), a = i[0].match(/^(\d+)-(\d+)\/(\d+)$/);
    if (a === null) throw new TypeError("CronPattern: Syntax error, illegal range with stepping: '" + e + "'");
    let [, o, h, l] = a, y = parseInt(o, 10) + r, u = parseInt(h, 10) + r, d = parseInt(l, 10);
    this.validateNotNaN(y, "CronPattern: Syntax error, illegal lower range (NaN)"), this.validateNotNaN(u, "CronPattern: Syntax error, illegal upper range (NaN)"), this.validateNotNaN(d, "CronPattern: Syntax error, illegal stepping: (NaN)"), this.validateRange(y, u, d, t, e);
    for (let c = y; c <= u; c += d) this.setPart(t, c, i[1] || n);
  }
  extractNth(e, t) {
    let r = e, n;
    if (r.includes("#")) {
      if (t !== "dayOfWeek") throw new Error("CronPattern: nth (#) only allowed in day-of-week field");
      n = r.split("#")[1], r = r.split("#")[0];
    } else if (r.toUpperCase().endsWith("L")) {
      if (t !== "dayOfWeek") throw new Error("CronPattern: L modifier only allowed in day-of-week field (use L alone for day-of-month)");
      n = "L", r = r.slice(0, -1);
    }
    return [r, n];
  }
  handleRange(e, t, r, n) {
    if (e.toUpperCase().includes("W")) throw new TypeError("CronPattern: Syntax error, W is not allowed in a range.");
    let i = this.extractNth(e, t), a = i[0].split("-");
    if (a.length !== 2) throw new TypeError("CronPattern: Syntax error, illegal range: '" + e + "'");
    let o = parseInt(a[0], 10) + r, h = parseInt(a[1], 10) + r;
    this.validateNotNaN(o, "CronPattern: Syntax error, illegal lower range (NaN)"), this.validateNotNaN(h, "CronPattern: Syntax error, illegal upper range (NaN)"), this.validateRange(o, h, void 0, t, e);
    for (let l = o; l <= h; l++) this.setPart(t, l, i[1] || n);
  }
  handleStepping(e, t, r, n) {
    if (e.toUpperCase().includes("W")) throw new TypeError("CronPattern: Syntax error, W is not allowed in parts with stepping.");
    let i = this.extractNth(e, t), a = i[0].split("/");
    if (a.length !== 2) throw new TypeError("CronPattern: Syntax error, illegal stepping: '" + e + "'");
    if (this.sloppyRanges) a[0] === "" && (a[0] = "*");
    else {
      if (a[0] === "") throw new TypeError("CronPattern: Syntax error, stepping with missing prefix ('" + e + "') is not allowed. Use wildcard (*/step) or range (min-max/step) instead.");
      if (a[0] !== "*") throw new TypeError("CronPattern: Syntax error, stepping with numeric prefix ('" + e + "') is not allowed. Use wildcard (*/step) or range (min-max/step) instead.");
    }
    let o = 0;
    a[0] !== "*" && (o = parseInt(a[0], 10) + r);
    let h = parseInt(a[1], 10);
    this.validateNotNaN(h, "CronPattern: Syntax error, illegal stepping: (NaN)"), this.validateRange(0, this[t].length - 1, h, t, e);
    for (let l = o; l < this[t].length; l += h) this.setPart(t, l, i[1] || n);
  }
  replaceAlphaDays(e) {
    return e.replace(/-sun/gi, "-7").replace(/sun/gi, "0").replace(/mon/gi, "1").replace(/tue/gi, "2").replace(/wed/gi, "3").replace(/thu/gi, "4").replace(/fri/gi, "5").replace(/sat/gi, "6");
  }
  replaceAlphaDaysQuartz(e) {
    return e.replace(/sun/gi, "1").replace(/mon/gi, "2").replace(/tue/gi, "3").replace(/wed/gi, "4").replace(/thu/gi, "5").replace(/fri/gi, "6").replace(/sat/gi, "7");
  }
  replaceAlphaMonths(e) {
    return e.replace(/jan/gi, "1").replace(/feb/gi, "2").replace(/mar/gi, "3").replace(/apr/gi, "4").replace(/may/gi, "5").replace(/jun/gi, "6").replace(/jul/gi, "7").replace(/aug/gi, "8").replace(/sep/gi, "9").replace(/oct/gi, "10").replace(/nov/gi, "11").replace(/dec/gi, "12");
  }
  handleNicknames(e) {
    let t = e.trim().toLowerCase();
    if (t === "@yearly" || t === "@annually") return "0 0 1 1 *";
    if (t === "@monthly") return "0 0 1 * *";
    if (t === "@weekly") return "0 0 * * 0";
    if (t === "@daily" || t === "@midnight") return "0 0 * * *";
    if (t === "@hourly") return "0 * * * *";
    if (t === "@reboot") throw new TypeError("CronPattern: @reboot is not supported in this environment. This is an event-based trigger that requires system startup detection.");
    return e;
  }
  setNthWeekdayOfMonth(e, t) {
    if (typeof t != "number" && t.toUpperCase() === "L") this.dayOfWeek[e] = this.dayOfWeek[e] | 32;
    else if (t === 63) this.dayOfWeek[e] = 63;
    else if (t < 6 && t > 0) this.dayOfWeek[e] = this.dayOfWeek[e] | O[t - 1];
    else throw new TypeError(`CronPattern: nth weekday out of range, should be 1-5 or L. Value: ${t}, Type: ${typeof t}`);
  }
};
var P = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], f = [["month", "year", 0], ["day", "month", -1], ["hour", "day", 0], ["minute", "hour", 0], ["second", "minute", 0]], m = class s {
  tz;
  ms;
  second;
  minute;
  hour;
  day;
  month;
  year;
  constructor(e, t) {
    if (this.tz = t, e && e instanceof Date) if (!isNaN(e)) this.fromDate(e);
    else throw new TypeError("CronDate: Invalid date passed to CronDate constructor");
    else if (e == null) this.fromDate(/* @__PURE__ */ new Date());
    else if (e && typeof e == "string") this.fromString(e);
    else if (e instanceof s) this.fromCronDate(e);
    else throw new TypeError("CronDate: Invalid type (" + typeof e + ") passed to CronDate constructor");
  }
  getLastDayOfMonth(e, t) {
    return t !== 1 ? P[t] : new Date(Date.UTC(e, t + 1, 0)).getUTCDate();
  }
  getLastWeekday(e, t) {
    let r = this.getLastDayOfMonth(e, t), i = new Date(Date.UTC(e, t, r)).getUTCDay();
    return i === 0 ? r - 2 : i === 6 ? r - 1 : r;
  }
  getNearestWeekday(e, t, r) {
    let n = this.getLastDayOfMonth(e, t);
    if (r > n) return -1;
    let a = new Date(Date.UTC(e, t, r)).getUTCDay();
    return a === 0 ? r === n ? r - 2 : r + 1 : a === 6 ? r === 1 ? r + 2 : r - 1 : r;
  }
  isNthWeekdayOfMonth(e, t, r, n) {
    let a = new Date(Date.UTC(e, t, r)).getUTCDay(), o = 0;
    for (let h = 1; h <= r; h++) new Date(Date.UTC(e, t, h)).getUTCDay() === a && o++;
    if (n & 63 && O[o - 1] & n) return true;
    if (n & 32) {
      let h = this.getLastDayOfMonth(e, t);
      for (let l = r + 1; l <= h; l++) if (new Date(Date.UTC(e, t, l)).getUTCDay() === a) return false;
      return true;
    }
    return false;
  }
  fromDate(e) {
    if (this.tz !== void 0) if (typeof this.tz == "number") this.ms = e.getUTCMilliseconds(), this.second = e.getUTCSeconds(), this.minute = e.getUTCMinutes() + this.tz, this.hour = e.getUTCHours(), this.day = e.getUTCDate(), this.month = e.getUTCMonth(), this.year = e.getUTCFullYear(), this.apply();
    else try {
      let t = g(e, this.tz);
      this.ms = e.getMilliseconds(), this.second = t.s, this.minute = t.i, this.hour = t.h, this.day = t.d, this.month = t.m - 1, this.year = t.y;
    } catch (t) {
      let r = t instanceof Error ? t.message : String(t);
      throw new TypeError(`CronDate: Failed to convert date to timezone '${this.tz}'. This may happen with invalid timezone names or dates. Original error: ${r}`);
    }
    else this.ms = e.getMilliseconds(), this.second = e.getSeconds(), this.minute = e.getMinutes(), this.hour = e.getHours(), this.day = e.getDate(), this.month = e.getMonth(), this.year = e.getFullYear();
  }
  fromCronDate(e) {
    this.tz = e.tz, this.year = e.year, this.month = e.month, this.day = e.day, this.hour = e.hour, this.minute = e.minute, this.second = e.second, this.ms = e.ms;
  }
  apply() {
    if (this.month > 11 || this.month < 0 || this.day > P[this.month] || this.day < 1 || this.hour > 59 || this.minute > 59 || this.second > 59 || this.hour < 0 || this.minute < 0 || this.second < 0) {
      let e = new Date(Date.UTC(this.year, this.month, this.day, this.hour, this.minute, this.second, this.ms));
      return this.ms = e.getUTCMilliseconds(), this.second = e.getUTCSeconds(), this.minute = e.getUTCMinutes(), this.hour = e.getUTCHours(), this.day = e.getUTCDate(), this.month = e.getUTCMonth(), this.year = e.getUTCFullYear(), true;
    } else return false;
  }
  fromString(e) {
    if (typeof this.tz == "number") {
      let t = v(e);
      this.ms = t.getUTCMilliseconds(), this.second = t.getUTCSeconds(), this.minute = t.getUTCMinutes(), this.hour = t.getUTCHours(), this.day = t.getUTCDate(), this.month = t.getUTCMonth(), this.year = t.getUTCFullYear(), this.apply();
    } else return this.fromDate(v(e, this.tz));
  }
  findNext(e, t, r, n) {
    return this._findMatch(e, t, r, n, 1);
  }
  _findMatch(e, t, r, n, i) {
    let a = this[t], o;
    r.lastDayOfMonth && (o = this.getLastDayOfMonth(this.year, this.month));
    let h = !r.starDOW && t == "day" ? new Date(Date.UTC(this.year, this.month, 1, 0, 0, 0, 0)).getUTCDay() : void 0, l = this[t] + n, y = i === 1 ? (u) => u < r[t].length : (u) => u >= 0;
    for (let u = l; y(u); u += i) {
      let d = r[t][u];
      if (t === "day" && !d) {
        for (let c = 0; c < r.nearestWeekdays.length; c++) if (r.nearestWeekdays[c]) {
          let M = this.getNearestWeekday(this.year, this.month, c - n);
          if (M === -1) continue;
          if (M === u - n) {
            d = 1;
            break;
          }
        }
      }
      if (t === "day" && r.lastWeekday) {
        let c = this.getLastWeekday(this.year, this.month);
        u - n === c && (d = 1);
      }
      if (t === "day" && r.lastDayOfMonth && u - n == o && (d = 1), t === "day" && !r.starDOW) {
        let c = r.dayOfWeek[(h + (u - n - 1)) % 7];
        if (c && c & 63) c = this.isNthWeekdayOfMonth(this.year, this.month, u - n, c) ? 1 : 0;
        else if (c) throw new Error(`CronDate: Invalid value for dayOfWeek encountered. ${c}`);
        r.useAndLogic ? d = d && c : !e.domAndDow && !r.starDOM ? d = d || c : d = d && c;
      }
      if (d) return this[t] = u - n, a !== this[t] ? 2 : 1;
    }
    return 3;
  }
  recurse(e, t, r) {
    if (r === 0 && !e.starYear) {
      if (this.year >= 0 && this.year < e.year.length && e.year[this.year] === 0) {
        let i = -1;
        for (let a = this.year + 1; a < e.year.length && a < 1e4; a++) if (e.year[a] === 1) {
          i = a;
          break;
        }
        if (i === -1) return null;
        this.year = i, this.month = 0, this.day = 1, this.hour = 0, this.minute = 0, this.second = 0, this.ms = 0;
      }
      if (this.year >= 1e4) return null;
    }
    let n = this.findNext(t, f[r][0], e, f[r][2]);
    if (n > 1) {
      let i = r + 1;
      for (; i < f.length; ) this[f[i][0]] = -f[i][2], i++;
      if (n === 3) {
        if (this[f[r][1]]++, this[f[r][0]] = -f[r][2], this.apply(), r === 0 && !e.starYear) {
          for (; this.year >= 0 && this.year < e.year.length && e.year[this.year] === 0 && this.year < 1e4; ) this.year++;
          if (this.year >= 1e4 || this.year >= e.year.length) return null;
        }
        return this.recurse(e, t, 0);
      } else if (this.apply()) return this.recurse(e, t, r - 1);
    }
    return r += 1, r >= f.length ? this : (e.starYear ? this.year >= 3e3 : this.year >= 1e4) ? null : this.recurse(e, t, r);
  }
  increment(e, t, r) {
    return this.second += t.interval !== void 0 && t.interval > 1 && r ? t.interval : 1, this.ms = 0, this.apply(), this.recurse(e, t, 0);
  }
  decrement(e, t) {
    return this.second -= t.interval !== void 0 && t.interval > 1 ? t.interval : 1, this.ms = 0, this.apply(), this.recurseBackward(e, t, 0, 0);
  }
  recurseBackward(e, t, r, n = 0) {
    if (n > 1e4) return null;
    if (r === 0 && !e.starYear) {
      if (this.year >= 0 && this.year < e.year.length && e.year[this.year] === 0) {
        let a = -1;
        for (let o = this.year - 1; o >= 0; o--) if (e.year[o] === 1) {
          a = o;
          break;
        }
        if (a === -1) return null;
        this.year = a, this.month = 11, this.day = 31, this.hour = 23, this.minute = 59, this.second = 59, this.ms = 0;
      }
      if (this.year < 0) return null;
    }
    let i = this.findPrevious(t, f[r][0], e, f[r][2]);
    if (i > 1) {
      let a = r + 1;
      for (; a < f.length; ) {
        let o = f[a][0], h = f[a][2], l = this.getMaxPatternValue(o, e, h);
        this[o] = l, a++;
      }
      if (i === 3) {
        if (this[f[r][1]]--, r === 0) {
          let y = this.getLastDayOfMonth(this.year, this.month);
          this.day > y && (this.day = y);
        }
        if (r === 1) if (this.day <= 0) this.day = 1;
        else {
          let y = this.year, u = this.month;
          for (; u < 0; ) u += 12, y--;
          for (; u > 11; ) u -= 12, y++;
          let d = u !== 1 ? P[u] : new Date(Date.UTC(y, u + 1, 0)).getUTCDate();
          this.day > d && (this.day = d);
        }
        this.apply();
        let o = f[r][0], h = f[r][2], l = this.getMaxPatternValue(o, e, h);
        if (o === "day") {
          let y = this.getLastDayOfMonth(this.year, this.month);
          this[o] = Math.min(l, y);
        } else this[o] = l;
        if (this.apply(), r === 0) {
          let y = f[1][2], u = this.getMaxPatternValue("day", e, y), d = this.getLastDayOfMonth(this.year, this.month), c = Math.min(u, d);
          c !== this.day && (this.day = c, this.hour = this.getMaxPatternValue("hour", e, f[2][2]), this.minute = this.getMaxPatternValue("minute", e, f[3][2]), this.second = this.getMaxPatternValue("second", e, f[4][2]));
        }
        if (r === 0 && !e.starYear) {
          for (; this.year >= 0 && this.year < e.year.length && e.year[this.year] === 0; ) this.year--;
          if (this.year < 0) return null;
        }
        return this.recurseBackward(e, t, 0, n + 1);
      } else if (this.apply()) return this.recurseBackward(e, t, r - 1, n + 1);
    }
    return r += 1, r >= f.length ? this : this.year < 0 ? null : this.recurseBackward(e, t, r, n + 1);
  }
  getMaxPatternValue(e, t, r) {
    if (e === "day" && t.lastDayOfMonth) return this.getLastDayOfMonth(this.year, this.month);
    if (e === "day" && !t.starDOW) return this.getLastDayOfMonth(this.year, this.month);
    for (let n = t[e].length - 1; n >= 0; n--) if (t[e][n]) return n - r;
    return t[e].length - 1 - r;
  }
  findPrevious(e, t, r, n) {
    return this._findMatch(e, t, r, n, -1);
  }
  getDate(e) {
    return e || this.tz === void 0 ? new Date(this.year, this.month, this.day, this.hour, this.minute, this.second, this.ms) : typeof this.tz == "number" ? new Date(Date.UTC(this.year, this.month, this.day, this.hour, this.minute - this.tz, this.second, this.ms)) : k(b(this.year, this.month + 1, this.day, this.hour, this.minute, this.second, this.tz), false);
  }
  getTime() {
    return this.getDate(false).getTime();
  }
  match(e, t) {
    if (!e.starYear && (this.year < 0 || this.year >= e.year.length || e.year[this.year] === 0)) return false;
    for (let r = 0; r < f.length; r++) {
      let n = f[r][0], i = f[r][2], a = this[n];
      if (a + i < 0 || a + i >= e[n].length) return false;
      let o = e[n][a + i];
      if (n === "day") {
        if (!o) {
          for (let h = 0; h < e.nearestWeekdays.length; h++) if (e.nearestWeekdays[h]) {
            let l = this.getNearestWeekday(this.year, this.month, h - i);
            if (l !== -1 && l === a) {
              o = 1;
              break;
            }
          }
        }
        if (e.lastWeekday) {
          let h = this.getLastWeekday(this.year, this.month);
          a === h && (o = 1);
        }
        if (e.lastDayOfMonth) {
          let h = this.getLastDayOfMonth(this.year, this.month);
          a === h && (o = 1);
        }
        if (!e.starDOW) {
          let h = new Date(Date.UTC(this.year, this.month, 1, 0, 0, 0, 0)).getUTCDay(), l = e.dayOfWeek[(h + (a - 1)) % 7];
          l && l & 63 && (l = this.isNthWeekdayOfMonth(this.year, this.month, a, l) ? 1 : 0), e.useAndLogic ? o = o && l : !t.domAndDow && !e.starDOM ? o = o || l : o = o && l;
        }
      }
      if (!o) return false;
    }
    return true;
  }
};
function R(s2) {
  if (s2 === void 0 && (s2 = {}), delete s2.name, s2.legacyMode !== void 0 && s2.domAndDow === void 0 ? s2.domAndDow = !s2.legacyMode : s2.domAndDow === void 0 && (s2.domAndDow = false), s2.legacyMode = !s2.domAndDow, s2.paused = s2.paused === void 0 ? false : s2.paused, s2.maxRuns = s2.maxRuns === void 0 ? 1 / 0 : s2.maxRuns, s2.catch = s2.catch === void 0 ? false : s2.catch, s2.interval = s2.interval === void 0 ? 0 : parseInt(s2.interval.toString(), 10), s2.utcOffset = s2.utcOffset === void 0 ? void 0 : parseInt(s2.utcOffset.toString(), 10), s2.dayOffset = s2.dayOffset === void 0 ? 0 : parseInt(s2.dayOffset.toString(), 10), s2.unref = s2.unref === void 0 ? false : s2.unref, s2.mode = s2.mode === void 0 ? "auto" : s2.mode, s2.alternativeWeekdays = s2.alternativeWeekdays === void 0 ? false : s2.alternativeWeekdays, s2.sloppyRanges = s2.sloppyRanges === void 0 ? false : s2.sloppyRanges, !["auto", "5-part", "6-part", "7-part", "5-or-6-parts", "6-or-7-parts"].includes(s2.mode)) throw new Error("CronOptions: mode must be one of 'auto', '5-part', '6-part', '7-part', '5-or-6-parts', or '6-or-7-parts'.");
  if (s2.startAt && (s2.startAt = new m(s2.startAt, s2.timezone)), s2.stopAt && (s2.stopAt = new m(s2.stopAt, s2.timezone)), s2.interval !== null) {
    if (isNaN(s2.interval)) throw new Error("CronOptions: Supplied value for interval is not a number");
    if (s2.interval < 0) throw new Error("CronOptions: Supplied value for interval can not be negative");
  }
  if (s2.utcOffset !== void 0) {
    if (isNaN(s2.utcOffset)) throw new Error("CronOptions: Invalid value passed for utcOffset, should be number representing minutes offset from UTC.");
    if (s2.utcOffset < -870 || s2.utcOffset > 870) throw new Error("CronOptions: utcOffset out of bounds.");
    if (s2.utcOffset !== void 0 && s2.timezone) throw new Error("CronOptions: Combining 'utcOffset' with 'timezone' is not allowed.");
  }
  if (s2.unref !== true && s2.unref !== false) throw new Error("CronOptions: Unref should be either true, false or undefined(false).");
  if (s2.dayOffset !== void 0 && s2.dayOffset !== 0 && isNaN(s2.dayOffset)) throw new Error("CronOptions: Invalid value passed for dayOffset, should be a number representing days to offset.");
  return s2;
}
function p(s2) {
  return Object.prototype.toString.call(s2) === "[object Function]" || typeof s2 == "function" || s2 instanceof Function;
}
function _(s2) {
  return p(s2);
}
function x(s2) {
  typeof Deno < "u" && typeof Deno.unrefTimer < "u" ? Deno.unrefTimer(s2) : s2 && typeof s2.unref < "u" && s2.unref();
}
var W = 30 * 1e3, w = [], E = class {
  name;
  options;
  _states;
  fn;
  getTz() {
    return this.options.timezone || this.options.utcOffset;
  }
  applyDayOffset(e) {
    if (this.options.dayOffset !== void 0 && this.options.dayOffset !== 0) {
      let t = this.options.dayOffset * 24 * 60 * 60 * 1e3;
      return new Date(e.getTime() + t);
    }
    return e;
  }
  constructor(e, t, r) {
    let n, i;
    if (p(t)) i = t;
    else if (typeof t == "object") n = t;
    else if (t !== void 0) throw new Error("Cron: Invalid argument passed for optionsIn. Should be one of function, or object (options).");
    if (p(r)) i = r;
    else if (typeof r == "object") n = r;
    else if (r !== void 0) throw new Error("Cron: Invalid argument passed for funcIn. Should be one of function, or object (options).");
    if (this.name = n?.name, this.options = R(n), this._states = { kill: false, blocking: false, previousRun: void 0, currentRun: void 0, once: void 0, currentTimeout: void 0, maxRuns: n ? n.maxRuns : void 0, paused: n ? n.paused : false, pattern: new C("* * * * *", void 0, { mode: "auto" }) }, e && (e instanceof Date || typeof e == "string" && e.indexOf(":") > 0) ? this._states.once = new m(e, this.getTz()) : this._states.pattern = new C(e, this.options.timezone, { mode: this.options.mode, alternativeWeekdays: this.options.alternativeWeekdays, sloppyRanges: this.options.sloppyRanges }), this.name) {
      if (w.find((o) => o.name === this.name)) throw new Error("Cron: Tried to initialize new named job '" + this.name + "', but name already taken.");
      w.push(this);
    }
    return i !== void 0 && _(i) && (this.fn = i, this.schedule()), this;
  }
  nextRun(e) {
    let t = this._next(e);
    return t ? this.applyDayOffset(t.getDate(false)) : null;
  }
  nextRuns(e, t) {
    this._states.maxRuns !== void 0 && e > this._states.maxRuns && (e = this._states.maxRuns);
    let r = t || this._states.currentRun || void 0;
    return this._enumerateRuns(e, r, "next");
  }
  previousRuns(e, t) {
    return this._enumerateRuns(e, t || void 0, "previous");
  }
  _enumerateRuns(e, t, r) {
    let n = [], i = t ? new m(t, this.getTz()) : null, a = r === "next" ? this._next : this._previous;
    for (; e--; ) {
      let o = a.call(this, i);
      if (!o) break;
      let h = o.getDate(false);
      n.push(this.applyDayOffset(h)), i = o;
    }
    return n;
  }
  match(e) {
    if (this._states.once) {
      let r = new m(e, this.getTz());
      r.ms = 0;
      let n = new m(this._states.once, this.getTz());
      return n.ms = 0, r.getTime() === n.getTime();
    }
    let t = new m(e, this.getTz());
    return t.ms = 0, t.match(this._states.pattern, this.options);
  }
  getPattern() {
    if (!this._states.once) return this._states.pattern ? this._states.pattern.pattern : void 0;
  }
  getOnce() {
    return this._states.once ? this._states.once.getDate() : null;
  }
  isRunning() {
    let e = this.nextRun(this._states.currentRun), t = !this._states.paused, r = this.fn !== void 0, n = !this._states.kill;
    return t && r && n && e !== null;
  }
  isStopped() {
    return this._states.kill;
  }
  isBusy() {
    return this._states.blocking;
  }
  currentRun() {
    return this._states.currentRun ? this._states.currentRun.getDate() : null;
  }
  previousRun() {
    return this._states.previousRun ? this._states.previousRun.getDate() : null;
  }
  msToNext(e) {
    let t = this._next(e);
    return t ? e instanceof m || e instanceof Date ? t.getTime() - e.getTime() : t.getTime() - new m(e).getTime() : null;
  }
  stop() {
    this._states.kill = true, this._states.currentTimeout && clearTimeout(this._states.currentTimeout);
    let e = w.indexOf(this);
    e >= 0 && w.splice(e, 1);
  }
  pause() {
    return this._states.paused = true, !this._states.kill;
  }
  resume() {
    return this._states.paused = false, !this._states.kill;
  }
  schedule(e) {
    if (e && this.fn) throw new Error("Cron: It is not allowed to schedule two functions using the same Croner instance.");
    e && (this.fn = e);
    let t = this.msToNext(), r = this.nextRun(this._states.currentRun);
    return t == null || isNaN(t) || r === null ? this : (t > W && (t = W), this._states.currentTimeout = setTimeout(() => this._checkTrigger(r), t), this._states.currentTimeout && this.options.unref && x(this._states.currentTimeout), this);
  }
  async _trigger(e) {
    this._states.blocking = true, this._states.currentRun = new m(void 0, this.getTz());
    try {
      if (this.options.catch) try {
        this.fn !== void 0 && await this.fn(this, this.options.context);
      } catch (t) {
        if (p(this.options.catch)) try {
          this.options.catch(t, this);
        } catch {
        }
      }
      else this.fn !== void 0 && await this.fn(this, this.options.context);
    } finally {
      this._states.previousRun = new m(e, this.getTz()), this._states.blocking = false;
    }
  }
  async trigger() {
    await this._trigger();
  }
  runsLeft() {
    return this._states.maxRuns;
  }
  _checkTrigger(e) {
    let t = /* @__PURE__ */ new Date(), r = !this._states.paused && t.getTime() >= e.getTime(), n = this._states.blocking && this.options.protect;
    r && !n ? (this._states.maxRuns !== void 0 && this._states.maxRuns--, this._trigger()) : r && n && p(this.options.protect) && setTimeout(() => this.options.protect(this), 0), this.schedule();
  }
  _next(e) {
    let t = !!(e || this._states.currentRun), r = false;
    !e && this.options.startAt && this.options.interval && ([e, t] = this._calculatePreviousRun(e, t), r = !e), e = new m(e, this.getTz()), this.options.startAt && e && e.getTime() < this.options.startAt.getTime() && (e = this.options.startAt);
    let n = this._states.once || new m(e, this.getTz());
    return !r && n !== this._states.once && (n = n.increment(this._states.pattern, this.options, t)), this._states.once && this._states.once.getTime() <= e.getTime() || n === null || this._states.maxRuns !== void 0 && this._states.maxRuns <= 0 || this._states.kill || this.options.stopAt && n.getTime() >= this.options.stopAt.getTime() ? null : n;
  }
  _previous(e) {
    let t = new m(e, this.getTz());
    this.options.stopAt && t.getTime() > this.options.stopAt.getTime() && (t = this.options.stopAt);
    let r = new m(t, this.getTz());
    return this._states.once ? this._states.once.getTime() < t.getTime() ? this._states.once : null : (r = r.decrement(this._states.pattern, this.options), r === null || this.options.startAt && r.getTime() < this.options.startAt.getTime() ? null : r);
  }
  _calculatePreviousRun(e, t) {
    let r = new m(void 0, this.getTz()), n = e;
    if (this.options.startAt.getTime() <= r.getTime()) {
      n = this.options.startAt;
      let i = n.getTime() + this.options.interval * 1e3;
      for (; i <= r.getTime(); ) n = new m(n, this.getTz()).increment(this._states.pattern, this.options, true), i = n.getTime() + this.options.interval * 1e3;
      t = true;
    }
    return n === null && (n = void 0), [n, t];
  }
};
var UserRepository = class UserRepository2 {
  constructor(db) {
    this.db = db;
  }
  /**
  * Create a new user
  */
  async create(input) {
    const id = ulid();
    const row = {
      id,
      email: input.email.toLowerCase(),
      name: input.name ?? null,
      role: UserRepository2.resolveRole(input.role ?? 10),
      avatar_url: input.avatarUrl ?? null,
      email_verified: 0,
      data: input.data ? JSON.stringify(input.data) : null
    };
    await this.db.insertInto("users").values(row).execute();
    const user = await this.findById(id);
    if (!user) throw new Error("Failed to create user");
    return user;
  }
  /**
  * Find user by ID
  */
  async findById(id) {
    const row = await this.db.selectFrom("users").selectAll().where("id", "=", id).executeTakeFirst();
    return row ? this.rowToUser(row) : null;
  }
  /**
  * Find user by email (case-insensitive)
  */
  async findByEmail(email) {
    const row = await this.db.selectFrom("users").selectAll().where("email", "=", email.toLowerCase()).executeTakeFirst();
    return row ? this.rowToUser(row) : null;
  }
  /**
  * List all users with cursor-based pagination
  */
  async findMany(options = {}) {
    const limit = Math.min(Math.max(1, options.limit || 50), 100);
    let query = this.db.selectFrom("users").selectAll().orderBy("created_at", "desc").orderBy("id", "desc").limit(limit + 1);
    if (options.role !== void 0) query = query.where("role", "=", UserRepository2.resolveRole(options.role));
    if (options.cursor) {
      const decoded = decodeCursor(options.cursor);
      if (decoded) query = query.where((eb) => eb.or([eb("created_at", "<", decoded.orderValue), eb.and([eb("created_at", "=", decoded.orderValue), eb("id", "<", decoded.id)])]));
    }
    const rows = await query.execute();
    const items = rows.slice(0, limit).map((row) => this.rowToUser(row));
    const result = { items };
    if (rows.length > limit && items.length > 0) {
      const last = items.at(-1);
      result.nextCursor = encodeCursor(last.createdAt, last.id);
    }
    return result;
  }
  /**
  * Update a user
  */
  async update(id, input) {
    if (!await this.findById(id)) return null;
    const updates = {};
    if (input.name !== void 0) updates.name = input.name;
    if (input.role !== void 0) updates.role = UserRepository2.resolveRole(input.role);
    if (input.avatarUrl !== void 0) updates.avatar_url = input.avatarUrl;
    if (input.data !== void 0) updates.data = JSON.stringify(input.data);
    if (Object.keys(updates).length > 0) await this.db.updateTable("users").set(updates).where("id", "=", id).execute();
    return this.findById(id);
  }
  /**
  * Delete a user
  */
  async delete(id) {
    return ((await this.db.deleteFrom("users").where("id", "=", id).executeTakeFirst()).numDeletedRows ?? 0) > 0;
  }
  /**
  * Count users
  */
  async count(role) {
    let query = this.db.selectFrom("users").select((eb) => eb.fn.count("id").as("count"));
    if (role !== void 0) query = query.where("role", "=", UserRepository2.resolveRole(role));
    const result = await query.executeTakeFirst();
    return Number(result?.count || 0);
  }
  /**
  * Check if email exists
  */
  async emailExists(email) {
    return !!await this.db.selectFrom("users").select("id").where("email", "=", email.toLowerCase()).executeTakeFirst();
  }
  /**
  * Convert database row to User object
  */
  rowToUser(row) {
    return {
      id: row.id,
      email: row.email,
      name: row.name,
      role: UserRepository2.toRole(row.role),
      avatarUrl: row.avatar_url,
      emailVerified: row.email_verified === 1,
      data: row.data ? JSON.parse(row.data) : null,
      createdAt: row.created_at
    };
  }
  /** Map of role name strings to numeric levels */
  static ROLE_NAME_TO_LEVEL = {
    subscriber: 10,
    contributor: 20,
    author: 30,
    editor: 40,
    admin: 50
  };
  /** Valid numeric role levels */
  static VALID_LEVELS = /* @__PURE__ */ new Set([
    10,
    20,
    30,
    40,
    50
  ]);
  /**
  * Resolve a role name or number to a valid numeric UserRole.
  * Accepts both string names ("admin") and numeric levels (50).
  */
  static resolveRole(role) {
    if (typeof role === "string") {
      const level = UserRepository2.ROLE_NAME_TO_LEVEL[role];
      if (level === void 0) throw new Error(`Invalid role name: ${role}`);
      return level;
    }
    if (!UserRepository2.VALID_LEVELS.has(role)) throw new Error(`Invalid role level: ${role}`);
    return role;
  }
  /**
  * Convert a raw DB integer to a typed UserRole.
  * Falls back to subscriber (10) for unknown values.
  */
  static toRole(level) {
    if (UserRepository2.VALID_LEVELS.has(level)) return level;
    return 10;
  }
};
const LIKE_ESCAPE_RE = /[%_\\]/g;
var CommentRepository = class CommentRepository2 {
  constructor(db) {
    this.db = db;
  }
  /**
  * Create a new comment
  */
  async create(input) {
    const id = ulid();
    const now = (/* @__PURE__ */ new Date()).toISOString();
    await this.db.insertInto("_emdash_comments").values({
      id,
      collection: input.collection,
      content_id: input.contentId,
      parent_id: input.parentId ?? null,
      author_name: input.authorName,
      author_email: input.authorEmail,
      author_user_id: input.authorUserId ?? null,
      body: input.body,
      status: input.status ?? "pending",
      ip_hash: input.ipHash ?? null,
      user_agent: input.userAgent ?? null,
      moderation_metadata: input.moderationMetadata ? JSON.stringify(input.moderationMetadata) : null,
      created_at: now,
      updated_at: now
    }).execute();
    const comment = await this.findById(id);
    if (!comment) throw new Error("Failed to create comment");
    return comment;
  }
  /**
  * Find comment by ID
  */
  async findById(id) {
    const row = await this.db.selectFrom("_emdash_comments").selectAll().where("id", "=", id).executeTakeFirst();
    return row ? this.rowToComment(row) : null;
  }
  /**
  * Find comments for a content item with optional status filter.
  * Results are ordered by created_at ASC (oldest first) for display.
  */
  async findByContent(collection, contentId, options = {}) {
    const limit = Math.min(options.limit || 50, 100);
    let query = this.db.selectFrom("_emdash_comments").selectAll().where("collection", "=", collection).where("content_id", "=", contentId);
    if (options.status) query = query.where("status", "=", options.status);
    if (options.cursor) {
      const decoded = decodeCursor(options.cursor);
      if (decoded) query = query.where((eb) => eb.or([eb("created_at", ">", decoded.orderValue), eb.and([eb("created_at", "=", decoded.orderValue), eb("id", ">", decoded.id)])]));
    }
    query = query.orderBy("created_at", "asc").orderBy("id", "asc").limit(limit + 1);
    const rows = await query.execute();
    const hasMore = rows.length > limit;
    const items = rows.slice(0, limit).map((r) => this.rowToComment(r));
    const result = { items };
    if (hasMore && items.length > 0) {
      const last = items.at(-1);
      result.nextCursor = encodeCursor(last.createdAt, last.id);
    }
    return result;
  }
  /**
  * Find comments by status (moderation inbox).
  * Results are ordered by created_at DESC (newest first).
  */
  async findByStatus(status, options = {}) {
    const limit = Math.min(options.limit || 50, 100);
    let query = this.db.selectFrom("_emdash_comments").selectAll().where("status", "=", status);
    if (options.collection) query = query.where("collection", "=", options.collection);
    if (options.search) {
      const term = `%${options.search.replace(LIKE_ESCAPE_RE, (ch) => `\\${ch}`)}%`;
      query = query.where((eb) => eb.or([
        sql`author_name LIKE ${term} ESCAPE '\\'`,
        sql`author_email LIKE ${term} ESCAPE '\\'`,
        sql`body LIKE ${term} ESCAPE '\\'`
      ]));
    }
    if (options.cursor) {
      const decoded = decodeCursor(options.cursor);
      if (decoded) query = query.where((eb) => eb.or([eb("created_at", "<", decoded.orderValue), eb.and([eb("created_at", "=", decoded.orderValue), eb("id", "<", decoded.id)])]));
    }
    query = query.orderBy("created_at", "desc").orderBy("id", "desc").limit(limit + 1);
    const rows = await query.execute();
    const hasMore = rows.length > limit;
    const items = rows.slice(0, limit).map((r) => this.rowToComment(r));
    const result = { items };
    if (hasMore && items.length > 0) {
      const last = items.at(-1);
      result.nextCursor = encodeCursor(last.createdAt, last.id);
    }
    return result;
  }
  /**
  * Update comment status
  */
  async updateStatus(id, status) {
    const now = (/* @__PURE__ */ new Date()).toISOString();
    await this.db.updateTable("_emdash_comments").set({
      status,
      updated_at: now
    }).where("id", "=", id).execute();
    return this.findById(id);
  }
  /**
  * Bulk update comment statuses
  */
  async bulkUpdateStatus(ids, status) {
    if (ids.length === 0) return 0;
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const result = await this.db.updateTable("_emdash_comments").set({
      status,
      updated_at: now
    }).where("id", "in", ids).executeTakeFirst();
    return Number(result.numUpdatedRows ?? 0);
  }
  /**
  * Hard-delete a single comment. Replies cascade via FK.
  */
  async delete(id) {
    return ((await this.db.deleteFrom("_emdash_comments").where("id", "=", id).executeTakeFirst()).numDeletedRows ?? 0) > 0;
  }
  /**
  * Bulk hard-delete comments
  */
  async bulkDelete(ids) {
    if (ids.length === 0) return 0;
    const result = await this.db.deleteFrom("_emdash_comments").where("id", "in", ids).executeTakeFirst();
    return Number(result.numDeletedRows ?? 0);
  }
  /**
  * Delete all comments for a content item (cascade on content deletion)
  */
  async deleteByContent(collection, contentId) {
    const result = await this.db.deleteFrom("_emdash_comments").where("collection", "=", collection).where("content_id", "=", contentId).executeTakeFirst();
    return Number(result.numDeletedRows ?? 0);
  }
  /**
  * Count comments for a content item, optionally filtered by status
  */
  async countByContent(collection, contentId, status) {
    let query = this.db.selectFrom("_emdash_comments").select((eb) => eb.fn.count("id").as("count")).where("collection", "=", collection).where("content_id", "=", contentId);
    if (status) query = query.where("status", "=", status);
    const result = await query.executeTakeFirst();
    return Number(result?.count ?? 0);
  }
  /**
  * Count comments grouped by status (for inbox badges)
  */
  async countByStatus() {
    const rows = await this.db.selectFrom("_emdash_comments").select(["status"]).select((eb) => eb.fn.count("id").as("count")).groupBy("status").execute();
    const counts = {
      pending: 0,
      approved: 0,
      spam: 0,
      trash: 0
    };
    for (const row of rows) {
      const status = row.status;
      if (status in counts) counts[status] = Number(row.count);
    }
    return counts;
  }
  /**
  * Count approved comments from a given email address.
  * Used for "first time commenter" moderation logic.
  */
  async countApprovedByEmail(email) {
    const result = await this.db.selectFrom("_emdash_comments").select((eb) => eb.fn.count("id").as("count")).where("author_email", "=", email).where("status", "=", "approved").executeTakeFirst();
    return Number(result?.count ?? 0);
  }
  /**
  * Update the moderation metadata JSON on a comment
  */
  async updateModerationMetadata(id, metadata) {
    await this.db.updateTable("_emdash_comments").set({ moderation_metadata: JSON.stringify(metadata) }).where("id", "=", id).execute();
  }
  /**
  * Assemble a flat list of comments into a threaded structure (1-level nesting)
  */
  static assembleThreads(comments) {
    const roots = [];
    const childrenMap = /* @__PURE__ */ new Map();
    for (const comment of comments) if (comment.parentId) {
      const siblings = childrenMap.get(comment.parentId) ?? [];
      siblings.push(comment);
      childrenMap.set(comment.parentId, siblings);
    } else roots.push(comment);
    return roots.map((root) => ({
      ...root,
      _replies: childrenMap.get(root.id) ?? []
    }));
  }
  /**
  * Convert a Comment to its public-facing shape
  */
  static toPublicComment(comment) {
    const pub = {
      id: comment.id,
      parentId: comment.parentId,
      authorName: comment.authorName,
      isRegisteredUser: comment.authorUserId !== null,
      body: comment.body,
      createdAt: comment.createdAt
    };
    if (comment._replies && comment._replies.length > 0) pub.replies = comment._replies.map((r) => CommentRepository2.toPublicComment(r));
    return pub;
  }
  rowToComment(row) {
    return {
      id: row.id,
      collection: row.collection,
      contentId: row.content_id,
      parentId: row.parent_id,
      authorName: row.author_name,
      authorEmail: row.author_email,
      authorUserId: row.author_user_id,
      body: row.body,
      status: row.status,
      ipHash: row.ip_hash,
      userAgent: row.user_agent,
      moderationMetadata: row.moderation_metadata ? safeJsonParse(row.moderation_metadata) : null,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }
};
function safeJsonParse(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}
var StorageQueryError = class extends Error {
  constructor(message, field, suggestion) {
    super(message);
    this.field = field;
    this.suggestion = suggestion;
    this.name = "StorageQueryError";
  }
};
function isRangeFilter(value) {
  if (typeof value !== "object" || value === null) return false;
  return "gt" in value || "gte" in value || "lt" in value || "lte" in value;
}
function isInFilter(value) {
  if (typeof value !== "object" || value === null) return false;
  return "in" in value && Array.isArray(value.in);
}
function isStartsWithFilter(value) {
  if (typeof value !== "object" || value === null) return false;
  return "startsWith" in value && typeof value.startsWith === "string";
}
function getIndexedFields(indexes) {
  const fields = /* @__PURE__ */ new Set();
  for (const index of indexes) if (Array.isArray(index)) for (const field of index) fields.add(field);
  else fields.add(index);
  return fields;
}
function validateWhereClause(where, indexedFields, pluginId, collection) {
  for (const field of Object.keys(where)) if (!indexedFields.has(field)) throw new StorageQueryError(`Cannot query on non-indexed field '${field}'.`, field, `Add '${field}' to storage.${collection}.indexes in plugin '${pluginId}' to enable this query.`);
}
function validateOrderByClause(orderBy, indexedFields, pluginId, collection) {
  for (const field of Object.keys(orderBy)) if (!indexedFields.has(field)) throw new StorageQueryError(`Cannot order by non-indexed field '${field}'.`, field, `Add '${field}' to storage.${collection}.indexes in plugin '${pluginId}' to enable ordering by this field.`);
}
function jsonExtract(db, field) {
  validateJsonFieldName(field, "query field name");
  return jsonExtractExpr(db, "data", field);
}
function buildCondition(db, field, value) {
  const extract = jsonExtract(db, field);
  if (value === null) return {
    sql: `${extract} IS NULL`,
    params: []
  };
  if (typeof value === "string" || typeof value === "number") return {
    sql: `${extract} = ?`,
    params: [value]
  };
  if (typeof value === "boolean") return {
    sql: `${extract} = ?`,
    params: [value]
  };
  if (isInFilter(value)) return {
    sql: `${extract} IN (${value.in.map(() => "?").join(", ")})`,
    params: value.in
  };
  if (isStartsWithFilter(value)) return {
    sql: `${extract} LIKE ?`,
    params: [`${value.startsWith}%`]
  };
  if (isRangeFilter(value)) {
    const conditions = [];
    const params = [];
    if (value.gt !== void 0) {
      conditions.push(`${extract} > ?`);
      params.push(value.gt);
    }
    if (value.gte !== void 0) {
      conditions.push(`${extract} >= ?`);
      params.push(value.gte);
    }
    if (value.lt !== void 0) {
      conditions.push(`${extract} < ?`);
      params.push(value.lt);
    }
    if (value.lte !== void 0) {
      conditions.push(`${extract} <= ?`);
      params.push(value.lte);
    }
    return {
      sql: conditions.join(" AND "),
      params
    };
  }
  throw new StorageQueryError(`Unknown filter type for field '${field}'`);
}
function buildWhereClause(db, where) {
  const conditions = [];
  const params = [];
  for (const [field, value] of Object.entries(where)) {
    const condition = buildCondition(db, field, value);
    conditions.push(condition.sql);
    params.push(...condition.params);
  }
  if (conditions.length === 0) return {
    sql: "",
    params: []
  };
  return {
    sql: conditions.join(" AND "),
    params
  };
}
var PluginStorageRepository = class {
  indexedFields;
  constructor(db, pluginId, collection, indexes) {
    this.db = db;
    this.pluginId = pluginId;
    this.collection = collection;
    this.indexedFields = getIndexedFields(indexes);
  }
  /**
  * Get a document by ID
  */
  async get(id) {
    const row = await this.db.selectFrom("_plugin_storage").select("data").where("plugin_id", "=", this.pluginId).where("collection", "=", this.collection).where("id", "=", id).executeTakeFirst();
    if (!row) return null;
    return JSON.parse(row.data);
  }
  /**
  * Store a document
  */
  async put(id, data) {
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const jsonData = JSON.stringify(data);
    await this.db.insertInto("_plugin_storage").values({
      plugin_id: this.pluginId,
      collection: this.collection,
      id,
      data: jsonData,
      created_at: now,
      updated_at: now
    }).onConflict((oc) => oc.columns([
      "plugin_id",
      "collection",
      "id"
    ]).doUpdateSet({
      data: jsonData,
      updated_at: now
    })).execute();
  }
  /**
  * Delete a document
  */
  async delete(id) {
    return ((await this.db.deleteFrom("_plugin_storage").where("plugin_id", "=", this.pluginId).where("collection", "=", this.collection).where("id", "=", id).executeTakeFirst()).numDeletedRows ?? 0) > 0;
  }
  /**
  * Check if a document exists
  */
  async exists(id) {
    return !!await this.db.selectFrom("_plugin_storage").select("id").where("plugin_id", "=", this.pluginId).where("collection", "=", this.collection).where("id", "=", id).executeTakeFirst();
  }
  /**
  * Get multiple documents by ID
  */
  async getMany(ids) {
    if (ids.length === 0) return /* @__PURE__ */ new Map();
    const rows = await this.db.selectFrom("_plugin_storage").select(["id", "data"]).where("plugin_id", "=", this.pluginId).where("collection", "=", this.collection).where("id", "in", ids).execute();
    const result = /* @__PURE__ */ new Map();
    for (const row of rows) result.set(row.id, JSON.parse(row.data));
    return result;
  }
  /**
  * Store multiple documents
  */
  async putMany(items) {
    if (items.length === 0) return;
    const now = (/* @__PURE__ */ new Date()).toISOString();
    await withTransaction(this.db, async (trx) => {
      for (const item of items) {
        const jsonData = JSON.stringify(item.data);
        await trx.insertInto("_plugin_storage").values({
          plugin_id: this.pluginId,
          collection: this.collection,
          id: item.id,
          data: jsonData,
          created_at: now,
          updated_at: now
        }).onConflict((oc) => oc.columns([
          "plugin_id",
          "collection",
          "id"
        ]).doUpdateSet({
          data: jsonData,
          updated_at: now
        })).execute();
      }
    });
  }
  /**
  * Delete multiple documents
  */
  async deleteMany(ids) {
    if (ids.length === 0) return 0;
    const result = await this.db.deleteFrom("_plugin_storage").where("plugin_id", "=", this.pluginId).where("collection", "=", this.collection).where("id", "in", ids).executeTakeFirst();
    return Number(result.numDeletedRows ?? 0);
  }
  /**
  * Query documents with filters
  */
  async query(options = {}) {
    const { where = {}, orderBy = {}, cursor } = options;
    const limit = Math.min(options.limit ?? 50, 100);
    validateWhereClause(where, this.indexedFields, this.pluginId, this.collection);
    if (Object.keys(orderBy).length > 0) validateOrderByClause(orderBy, this.indexedFields, this.pluginId, this.collection);
    let query = this.db.selectFrom("_plugin_storage").select([
      "id",
      "data",
      "created_at"
    ]).where("plugin_id", "=", this.pluginId).where("collection", "=", this.collection);
    const whereResult = buildWhereClause(this.db, where);
    if (whereResult.sql) {
      const whereSqlParts = [];
      let paramIndex = 0;
      const sqlParts = whereResult.sql.split("?");
      for (let i = 0; i < sqlParts.length; i++) {
        if (i > 0) whereSqlParts.push(sql`${whereResult.params[paramIndex++]}`);
        if (sqlParts[i]) whereSqlParts.push(sql.raw(sqlParts[i]));
      }
      query = query.where(({ eb }) => eb(sql.join(whereSqlParts, sql.raw("")), "=", sql.raw("1")));
    }
    if (cursor) {
      const decoded = decodeCursor(cursor);
      if (decoded) query = query.where(({ eb }) => eb(sql`(created_at, id)`, ">", sql`(${decoded.orderValue}, ${decoded.id})`));
    }
    if (Object.keys(orderBy).length > 0) for (const [field, direction] of Object.entries(orderBy)) {
      const extract = jsonExtract(this.db, field);
      const orderExpr = direction === "desc" ? sql`${sql.raw(extract)} desc` : sql`${sql.raw(extract)} asc`;
      query = query.orderBy(orderExpr);
    }
    else query = query.orderBy("created_at", "asc").orderBy("id", "asc");
    query = query.limit(limit + 1);
    const rows = await query.execute();
    const hasMore = rows.length > limit;
    const items = rows.slice(0, limit).map((row) => ({
      id: row.id,
      data: JSON.parse(row.data)
    }));
    let nextCursor;
    if (hasMore) {
      const lastItem = rows[limit - 1];
      if (lastItem) nextCursor = encodeCursor(lastItem.created_at, lastItem.id);
    }
    return {
      items,
      cursor: nextCursor,
      hasMore
    };
  }
  /**
  * Count documents matching a filter
  */
  async count(where) {
    if (where && Object.keys(where).length > 0) validateWhereClause(where, this.indexedFields, this.pluginId, this.collection);
    let query = this.db.selectFrom("_plugin_storage").select(sql`COUNT(*)`.as("count")).where("plugin_id", "=", this.pluginId).where("collection", "=", this.collection);
    if (where && Object.keys(where).length > 0) {
      const whereResult = buildWhereClause(this.db, where);
      if (whereResult.sql) {
        const whereSqlParts = [];
        let paramIndex = 0;
        const sqlParts = whereResult.sql.split("?");
        for (let i = 0; i < sqlParts.length; i++) {
          if (i > 0) whereSqlParts.push(sql`${whereResult.params[paramIndex++]}`);
          if (sqlParts[i]) whereSqlParts.push(sql.raw(sqlParts[i]));
        }
        query = query.where(({ eb }) => eb(sql.join(whereSqlParts, sql.raw("")), "=", sql.raw("1")));
      }
    }
    return (await query.executeTakeFirst())?.count ?? 0;
  }
};
object({
  id: string(),
  src: string(),
  alt: string().optional(),
  width: number().optional(),
  height: number().optional()
});
object({
  _type: string(),
  _key: string()
}).passthrough();
const SEO_DEFAULTS$1 = {
  title: null,
  description: null,
  image: null,
  canonical: null,
  noIndex: false
};
function hasAnyField(input) {
  return input.title !== void 0 || input.description !== void 0 || input.image !== void 0 || input.canonical !== void 0 || input.noIndex !== void 0;
}
var SeoRepository = class {
  constructor(db) {
    this.db = db;
  }
  /**
  * Get SEO data for a content item. Returns null defaults if no row exists.
  */
  async get(collection, contentId) {
    const row = await this.db.selectFrom("_emdash_seo").selectAll().where("collection", "=", collection).where("content_id", "=", contentId).executeTakeFirst();
    if (!row) return { ...SEO_DEFAULTS$1 };
    return {
      title: row.seo_title ?? null,
      description: row.seo_description ?? null,
      image: row.seo_image ?? null,
      canonical: row.seo_canonical ?? null,
      noIndex: row.seo_no_index === 1
    };
  }
  /**
  * Get SEO data for multiple content items in a single query.
  * Returns a Map keyed by content_id. Items without SEO rows get defaults.
  */
  async getMany(collection, contentIds) {
    const result = /* @__PURE__ */ new Map();
    if (contentIds.length === 0) return result;
    const rows = await this.db.selectFrom("_emdash_seo").selectAll().where("collection", "=", collection).where("content_id", "in", contentIds).execute();
    const rowMap = new Map(rows.map((r) => [r.content_id, r]));
    for (const id of contentIds) {
      const row = rowMap.get(id);
      if (row) result.set(id, {
        title: row.seo_title ?? null,
        description: row.seo_description ?? null,
        image: row.seo_image ?? null,
        canonical: row.seo_canonical ?? null,
        noIndex: row.seo_no_index === 1
      });
      else result.set(id, { ...SEO_DEFAULTS$1 });
    }
    return result;
  }
  /**
  * Upsert SEO data for a content item using INSERT ON CONFLICT DO UPDATE
  * for atomicity. Skips no-op writes when input has no fields set.
  */
  async upsert(collection, contentId, input) {
    if (!hasAnyField(input)) return this.get(collection, contentId);
    const now = (/* @__PURE__ */ new Date()).toISOString();
    await sql`
			INSERT INTO _emdash_seo (
				collection, content_id,
				seo_title, seo_description, seo_image, seo_canonical, seo_no_index,
				created_at, updated_at
			) VALUES (
				${collection}, ${contentId},
				${input.title ?? null}, ${input.description ?? null},
				${input.image ?? null}, ${input.canonical ?? null},
				${input.noIndex ? 1 : 0},
				${now}, ${now}
			)
			ON CONFLICT (collection, content_id) DO UPDATE SET
				seo_title = ${input.title !== void 0 ? sql`${input.title}` : sql`_emdash_seo.seo_title`},
				seo_description = ${input.description !== void 0 ? sql`${input.description}` : sql`_emdash_seo.seo_description`},
				seo_image = ${input.image !== void 0 ? sql`${input.image}` : sql`_emdash_seo.seo_image`},
				seo_canonical = ${input.canonical !== void 0 ? sql`${input.canonical}` : sql`_emdash_seo.seo_canonical`},
				seo_no_index = ${input.noIndex !== void 0 ? sql`${input.noIndex ? 1 : 0}` : sql`_emdash_seo.seo_no_index`},
				updated_at = ${now}
		`.execute(this.db);
    return this.get(collection, contentId);
  }
  /**
  * Delete SEO data for a content item.
  */
  async delete(collection, contentId) {
    await this.db.deleteFrom("_emdash_seo").where("collection", "=", collection).where("content_id", "=", contentId).execute();
  }
  /**
  * Copy SEO data from one content item to another.
  * Used by duplicate. Clears canonical (it pointed to the original).
  */
  async copyForDuplicate(collection, sourceId, targetId) {
    const source = await this.get(collection, sourceId);
    if (source.title !== null || source.description !== null || source.image !== null || source.noIndex) await this.upsert(collection, targetId, {
      title: source.title,
      description: source.description,
      image: source.image,
      canonical: null,
      noIndex: source.noIndex
    });
  }
};
function encodeRev(item) {
  return encodeBase64(`${item.version}:${item.updatedAt}`);
}
function decodeRev(rev) {
  try {
    const decoded = decodeBase64(rev);
    const colonIdx = decoded.indexOf(":");
    if (colonIdx === -1) return null;
    const version = parseInt(decoded.slice(0, colonIdx), 10);
    const updatedAt = decoded.slice(colonIdx + 1);
    if (isNaN(version) || !updatedAt) return null;
    return {
      version,
      updatedAt
    };
  } catch {
    return null;
  }
}
function validateRev(rev, item) {
  if (!rev) return { valid: true };
  const decoded = decodeRev(rev);
  if (!decoded) return {
    valid: false,
    message: "Malformed _rev token"
  };
  if (decoded.version !== item.version || decoded.updatedAt !== item.updatedAt) return {
    valid: false,
    message: "Content has been modified since last read (version conflict)"
  };
  return { valid: true };
}
function getSlugSource(data) {
  if (typeof data.title === "string" && data.title.length > 0) return data.title;
  if (typeof data.name === "string" && data.name.length > 0) return data.name;
  return null;
}
const SEO_DEFAULTS = {
  title: null,
  description: null,
  image: null,
  canonical: null,
  noIndex: false
};
async function collectionHasSeo(db, collection) {
  return (await db.selectFrom("_emdash_collections").select("has_seo").where("slug", "=", collection).executeTakeFirst())?.has_seo === 1;
}
async function hydrateSeo(db, collection, item, hasSeo) {
  if (!hasSeo) return;
  item.seo = await new SeoRepository(db).get(collection, item.id);
}
async function hydrateSeoMany(db, collection, items, hasSeo) {
  if (!hasSeo || items.length === 0) return;
  const seoMap = await new SeoRepository(db).getMany(collection, items.map((i) => i.id));
  for (const item of items) item.seo = seoMap.get(item.id) ?? { ...SEO_DEFAULTS };
}
async function hydrateBylines(db, collection, item) {
  const bylineRepo = new BylineRepository(db);
  const bylines = await bylineRepo.getContentBylines(collection, item.id);
  if (bylines.length > 0) {
    item.bylines = bylines.map((c) => ({
      ...c,
      source: "explicit"
    }));
    item.byline = bylines[0]?.byline ?? null;
    return;
  }
  if (item.primaryBylineId) item.primaryBylineId = null;
  if (item.authorId) {
    const fallback = await bylineRepo.findByUserId(item.authorId);
    if (fallback) {
      item.bylines = [{
        byline: fallback,
        sortOrder: 0,
        roleLabel: null,
        source: "inferred"
      }];
      item.byline = fallback;
      return;
    }
  }
  item.bylines = [];
  item.byline = null;
}
async function hydrateBylinesMany(db, collection, items) {
  if (items.length === 0) return;
  const bylineRepo = new BylineRepository(db);
  const contentIds = items.map((i) => i.id);
  const bylinesMap = await bylineRepo.getContentBylinesMany(collection, contentIds);
  const fallbackAuthorIds = [];
  for (const item of items) if (!bylinesMap.has(item.id) && item.authorId) fallbackAuthorIds.push(item.authorId);
  const uniqueAuthorIds = [...new Set(fallbackAuthorIds)];
  const authorBylineMap = await bylineRepo.findByUserIds(uniqueAuthorIds);
  for (const item of items) {
    const explicit = bylinesMap.get(item.id);
    if (explicit && explicit.length > 0) {
      item.bylines = explicit.map((c) => ({
        ...c,
        source: "explicit"
      }));
      item.byline = explicit[0]?.byline ?? null;
      continue;
    }
    if (item.primaryBylineId) item.primaryBylineId = null;
    if (item.authorId) {
      const fallback = authorBylineMap.get(item.authorId);
      if (fallback) {
        item.bylines = [{
          byline: fallback,
          sortOrder: 0,
          roleLabel: null,
          source: "inferred"
        }];
        item.byline = fallback;
        continue;
      }
    }
    item.bylines = [];
    item.byline = null;
  }
}
async function resolveId(repo, collection, identifier, locale) {
  return (await repo.findByIdOrSlug(collection, identifier, locale))?.id ?? null;
}
async function resolveIdIncludingTrashed(repo, collection, identifier, locale) {
  return (await repo.findByIdOrSlugIncludingTrashed(collection, identifier, locale))?.id ?? null;
}
async function handleContentList(db, collection, params) {
  try {
    const repo = new ContentRepository(db);
    const where = {};
    if (params.status) where.status = params.status;
    if (params.locale) where.locale = params.locale;
    const result = await repo.findMany(collection, {
      cursor: params.cursor,
      limit: params.limit || 50,
      where: Object.keys(where).length > 0 ? where : void 0,
      orderBy: params.orderBy ? {
        field: params.orderBy,
        direction: params.order || "desc"
      } : void 0
    });
    const hasSeo = await collectionHasSeo(db, collection);
    await hydrateSeoMany(db, collection, result.items, hasSeo);
    await hydrateBylinesMany(db, collection, result.items);
    return {
      success: true,
      data: {
        items: result.items,
        nextCursor: result.nextCursor
      }
    };
  } catch (error) {
    console.error("Content list error:", error);
    return {
      success: false,
      error: {
        code: "CONTENT_LIST_ERROR",
        message: "Failed to list content"
      }
    };
  }
}
async function handleContentGet(db, collection, id, locale) {
  try {
    const item = await new ContentRepository(db).findByIdOrSlug(collection, id, locale);
    if (!item) return {
      success: false,
      error: {
        code: "NOT_FOUND",
        message: `Content item not found: ${id}`
      }
    };
    await hydrateSeo(db, collection, item, await collectionHasSeo(db, collection));
    await hydrateBylines(db, collection, item);
    return {
      success: true,
      data: {
        item,
        _rev: encodeRev(item)
      }
    };
  } catch (error) {
    console.error("Content get error:", error);
    return {
      success: false,
      error: {
        code: "CONTENT_GET_ERROR",
        message: "Failed to get content"
      }
    };
  }
}
async function handleContentGetIncludingTrashed(db, collection, id, locale) {
  try {
    const item = await new ContentRepository(db).findByIdOrSlugIncludingTrashed(collection, id, locale);
    if (!item) return {
      success: false,
      error: {
        code: "NOT_FOUND",
        message: `Content item not found: ${id}`
      }
    };
    await hydrateSeo(db, collection, item, await collectionHasSeo(db, collection));
    await hydrateBylines(db, collection, item);
    return {
      success: true,
      data: {
        item,
        _rev: encodeRev(item)
      }
    };
  } catch (error) {
    console.error("Content get error:", error);
    return {
      success: false,
      error: {
        code: "CONTENT_GET_ERROR",
        message: "Failed to get content"
      }
    };
  }
}
async function handleContentCreate(db, collection, body) {
  try {
    const hasSeo = await collectionHasSeo(db, collection);
    if (body.seo && !hasSeo) return {
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: `Collection "${collection}" does not have SEO enabled. Remove the seo field or enable SEO on this collection.`
      }
    };
    const item = await withTransaction(db, async (trx) => {
      const repo = new ContentRepository(trx);
      const bylineRepo = new BylineRepository(trx);
      let slug = body.slug;
      if (!slug) {
        const slugSource = getSlugSource(body.data);
        if (slugSource) slug = await repo.generateUniqueSlug(collection, slugSource, body.locale);
      }
      const created = await repo.create({
        type: collection,
        slug,
        data: body.data,
        status: body.status || "draft",
        authorId: body.authorId,
        locale: body.locale,
        translationOf: body.translationOf
      });
      if (body.bylines !== void 0) {
        await bylineRepo.setContentBylines(collection, created.id, body.bylines);
        created.primaryBylineId = body.bylines[0]?.bylineId ?? null;
      }
      await hydrateBylines(trx, collection, created);
      if (body.seo && hasSeo) created.seo = await new SeoRepository(trx).upsert(collection, created.id, body.seo);
      else if (hasSeo) created.seo = { ...SEO_DEFAULTS };
      return created;
    });
    return {
      success: true,
      data: {
        item,
        _rev: encodeRev(item)
      }
    };
  } catch (error) {
    console.error("Content create error:", error);
    return {
      success: false,
      error: {
        code: "CONTENT_CREATE_ERROR",
        message: "Failed to create content"
      }
    };
  }
}
async function handleContentUpdate(db, collection, id, body) {
  try {
    const hasSeo = await collectionHasSeo(db, collection);
    if (body.seo && !hasSeo) return {
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: `Collection "${collection}" does not have SEO enabled. Remove the seo field or enable SEO on this collection.`
      }
    };
    const repo = new ContentRepository(db);
    const resolvedId = await resolveId(repo, collection, id) ?? id;
    if (body._rev) {
      const existing = await repo.findById(collection, resolvedId);
      if (!existing) return {
        success: false,
        error: {
          code: "NOT_FOUND",
          message: `Content item not found: ${id}`
        }
      };
      const revCheck = validateRev(body._rev, existing);
      if (!revCheck.valid) return {
        success: false,
        error: {
          code: "CONFLICT",
          message: revCheck.message
        }
      };
    }
    const item = await withTransaction(db, async (trx) => {
      const trxRepo = new ContentRepository(trx);
      const bylineRepo = new BylineRepository(trx);
      let oldSlug;
      if (body.slug) {
        const existing = await trxRepo.findById(collection, resolvedId);
        if (existing?.slug && existing.slug !== body.slug) oldSlug = existing.slug;
      }
      const updated = await trxRepo.update(collection, resolvedId, {
        data: body.data,
        slug: body.slug,
        status: body.status,
        authorId: body.authorId
      });
      if (body.bylines !== void 0) {
        await bylineRepo.setContentBylines(collection, resolvedId, body.bylines);
        updated.primaryBylineId = body.bylines[0]?.bylineId ?? null;
      }
      if (oldSlug && body.slug) {
        const collectionRow = await trx.selectFrom("_emdash_collections").select("url_pattern").where("slug", "=", collection).executeTakeFirst();
        await new RedirectRepository(trx).createAutoRedirect(collection, oldSlug, body.slug, resolvedId, collectionRow?.url_pattern ?? null);
      }
      if (isI18nEnabled() && body.data && updated.translationGroup) await syncNonTranslatableFields(trx, collection, updated.id, updated.translationGroup, body.data);
      if (body.seo && hasSeo) updated.seo = await new SeoRepository(trx).upsert(collection, resolvedId, body.seo);
      else if (hasSeo) updated.seo = await new SeoRepository(trx).get(collection, resolvedId);
      await hydrateBylines(trx, collection, updated);
      return updated;
    });
    return {
      success: true,
      data: {
        item,
        _rev: encodeRev(item)
      }
    };
  } catch (error) {
    console.error("Content update error:", error);
    return {
      success: false,
      error: {
        code: "CONTENT_UPDATE_ERROR",
        message: "Failed to update content"
      }
    };
  }
}
async function handleContentDuplicate(db, collection, id, authorId) {
  try {
    const hasSeo = await collectionHasSeo(db, collection);
    return {
      success: true,
      data: { item: await withTransaction(db, async (trx) => {
        const repo = new ContentRepository(trx);
        const bylineRepo = new BylineRepository(trx);
        const resolvedId = await resolveId(repo, collection, id) ?? id;
        const dup = await repo.duplicate(collection, resolvedId, authorId);
        const existingBylines = await bylineRepo.getContentBylines(collection, resolvedId);
        if (existingBylines.length > 0) await bylineRepo.setContentBylines(collection, dup.id, existingBylines.map((entry) => ({
          bylineId: entry.byline.id,
          roleLabel: entry.roleLabel
        })));
        if (hasSeo) {
          const seoRepo = new SeoRepository(trx);
          await seoRepo.copyForDuplicate(collection, resolvedId, dup.id);
          dup.seo = await seoRepo.get(collection, dup.id);
        }
        await hydrateBylines(trx, collection, dup);
        return dup;
      }) }
    };
  } catch (err) {
    if (err instanceof EmDashValidationError) return {
      success: false,
      error: {
        code: "NOT_FOUND",
        message: err.message
      }
    };
    console.error("Content duplicate error:", err);
    return {
      success: false,
      error: {
        code: "CONTENT_DUPLICATE_ERROR",
        message: "Failed to duplicate content"
      }
    };
  }
}
async function handleContentDelete(db, collection, id) {
  try {
    if (!await withTransaction(db, async (trx) => {
      const repo = new ContentRepository(trx);
      const resolvedId = await resolveId(repo, collection, id) ?? id;
      return repo.delete(collection, resolvedId);
    })) return {
      success: false,
      error: {
        code: "NOT_FOUND",
        message: `Content item not found: ${id}`
      }
    };
    return {
      success: true,
      data: { deleted: true }
    };
  } catch (error) {
    console.error("Content delete error:", error);
    return {
      success: false,
      error: {
        code: "CONTENT_DELETE_ERROR",
        message: "Failed to delete content"
      }
    };
  }
}
async function handleContentRestore(db, collection, id) {
  try {
    if (!await withTransaction(db, async (trx) => {
      const repo = new ContentRepository(trx);
      const resolvedId = await resolveIdIncludingTrashed(repo, collection, id) ?? id;
      return repo.restore(collection, resolvedId);
    })) return {
      success: false,
      error: {
        code: "NOT_FOUND",
        message: `Trashed content item not found: ${id}`
      }
    };
    return {
      success: true,
      data: { restored: true }
    };
  } catch (error) {
    console.error("Content restore error:", error);
    return {
      success: false,
      error: {
        code: "CONTENT_RESTORE_ERROR",
        message: "Failed to restore content"
      }
    };
  }
}
async function handleContentPermanentDelete(db, collection, id) {
  try {
    const resolvedId = await resolveIdIncludingTrashed(new ContentRepository(db), collection, id) ?? id;
    if (!await withTransaction(db, async (trx) => {
      const wasDeleted = await new ContentRepository(trx).permanentDelete(collection, resolvedId);
      if (wasDeleted) {
        await new SeoRepository(trx).delete(collection, resolvedId);
        await new CommentRepository(trx).deleteByContent(collection, resolvedId);
      }
      return wasDeleted;
    })) return {
      success: false,
      error: {
        code: "NOT_FOUND",
        message: `Content item not found: ${id}`
      }
    };
    return {
      success: true,
      data: { deleted: true }
    };
  } catch (error) {
    console.error("Content permanent delete error:", error);
    return {
      success: false,
      error: {
        code: "CONTENT_DELETE_ERROR",
        message: "Failed to permanently delete content"
      }
    };
  }
}
async function handleContentListTrashed(db, collection, options = {}) {
  try {
    const result = await new ContentRepository(db).findTrashed(collection, {
      limit: options.limit,
      cursor: options.cursor
    });
    return {
      success: true,
      data: {
        items: result.items.map((item) => ({
          id: item.id,
          type: item.type,
          slug: item.slug,
          status: item.status,
          data: item.data,
          authorId: item.authorId,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          publishedAt: item.publishedAt,
          deletedAt: item.deletedAt
        })),
        nextCursor: result.nextCursor
      }
    };
  } catch (error) {
    console.error("Content list trashed error:", error);
    return {
      success: false,
      error: {
        code: "CONTENT_LIST_ERROR",
        message: "Failed to list trashed content"
      }
    };
  }
}
async function handleContentCountTrashed(db, collection) {
  try {
    return {
      success: true,
      data: { count: await new ContentRepository(db).countTrashed(collection) }
    };
  } catch (error) {
    console.error("Content count trashed error:", error);
    return {
      success: false,
      error: {
        code: "CONTENT_COUNT_ERROR",
        message: "Failed to count trashed content"
      }
    };
  }
}
async function handleContentSchedule(db, collection, id, scheduledAt) {
  try {
    const item = await withTransaction(db, async (trx) => {
      const repo = new ContentRepository(trx);
      const resolvedId = await resolveId(repo, collection, id) ?? id;
      return repo.schedule(collection, resolvedId, scheduledAt);
    });
    await hydrateSeo(db, collection, item, await collectionHasSeo(db, collection));
    return {
      success: true,
      data: { item }
    };
  } catch (error) {
    if (error instanceof EmDashValidationError) return {
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: error.message
      }
    };
    console.error("Content schedule error:", error);
    return {
      success: false,
      error: {
        code: "CONTENT_SCHEDULE_ERROR",
        message: "Failed to schedule content"
      }
    };
  }
}
async function handleContentUnschedule(db, collection, id) {
  try {
    const item = await withTransaction(db, async (trx) => {
      const repo = new ContentRepository(trx);
      const resolvedId = await resolveId(repo, collection, id) ?? id;
      return repo.unschedule(collection, resolvedId);
    });
    await hydrateSeo(db, collection, item, await collectionHasSeo(db, collection));
    return {
      success: true,
      data: { item }
    };
  } catch (error) {
    console.error("Content unschedule error:", error);
    return {
      success: false,
      error: {
        code: "CONTENT_UNSCHEDULE_ERROR",
        message: "Failed to unschedule content"
      }
    };
  }
}
async function handleContentPublish(db, collection, id) {
  try {
    const item = await withTransaction(db, async (trx) => {
      const repo = new ContentRepository(trx);
      const resolvedId = await resolveId(repo, collection, id) ?? id;
      return repo.publish(collection, resolvedId);
    });
    await hydrateSeo(db, collection, item, await collectionHasSeo(db, collection));
    return {
      success: true,
      data: { item }
    };
  } catch (error) {
    console.error("Content publish error:", error);
    return {
      success: false,
      error: {
        code: "CONTENT_PUBLISH_ERROR",
        message: "Failed to publish content"
      }
    };
  }
}
async function handleContentUnpublish(db, collection, id) {
  try {
    const item = await withTransaction(db, async (trx) => {
      const repo = new ContentRepository(trx);
      const resolvedId = await resolveId(repo, collection, id) ?? id;
      return repo.unpublish(collection, resolvedId);
    });
    await hydrateSeo(db, collection, item, await collectionHasSeo(db, collection));
    return {
      success: true,
      data: { item }
    };
  } catch (error) {
    console.error("Content unpublish error:", error);
    return {
      success: false,
      error: {
        code: "CONTENT_UNPUBLISH_ERROR",
        message: "Failed to unpublish content"
      }
    };
  }
}
async function handleContentCountScheduled(db, collection) {
  try {
    return {
      success: true,
      data: { count: await new ContentRepository(db).countScheduled(collection) }
    };
  } catch (error) {
    console.error("Content count scheduled error:", error);
    return {
      success: false,
      error: {
        code: "CONTENT_COUNT_ERROR",
        message: "Failed to count scheduled content"
      }
    };
  }
}
async function handleContentDiscardDraft(db, collection, id) {
  try {
    const item = await withTransaction(db, async (trx) => {
      const repo = new ContentRepository(trx);
      const resolvedId = await resolveId(repo, collection, id) ?? id;
      return repo.discardDraft(collection, resolvedId);
    });
    await hydrateSeo(db, collection, item, await collectionHasSeo(db, collection));
    return {
      success: true,
      data: { item }
    };
  } catch (error) {
    if (error instanceof EmDashValidationError) return {
      success: false,
      error: {
        code: "NOT_FOUND",
        message: error.message
      }
    };
    console.error("Content discard draft error:", error);
    return {
      success: false,
      error: {
        code: "CONTENT_DISCARD_DRAFT_ERROR",
        message: "Failed to discard draft"
      }
    };
  }
}
async function handleContentCompare(db, collection, id) {
  try {
    const entry = await new ContentRepository(db).findByIdOrSlug(collection, id);
    if (!entry) return {
      success: false,
      error: {
        code: "NOT_FOUND",
        message: `Content item not found: ${id}`
      }
    };
    const revisionRepo = new RevisionRepository(db);
    const live = entry.liveRevisionId ? await revisionRepo.findById(entry.liveRevisionId) : null;
    const draft = entry.draftRevisionId ? await revisionRepo.findById(entry.draftRevisionId) : null;
    return {
      success: true,
      data: {
        hasChanges: entry.draftRevisionId !== null && entry.draftRevisionId !== entry.liveRevisionId,
        live: live?.data ?? null,
        draft: draft?.data ?? null
      }
    };
  } catch (error) {
    console.error("Content compare error:", error);
    return {
      success: false,
      error: {
        code: "CONTENT_COMPARE_ERROR",
        message: "Failed to compare revisions"
      }
    };
  }
}
async function handleContentTranslations(db, collection, id) {
  try {
    const repo = new ContentRepository(db);
    const item = await repo.findByIdOrSlug(collection, id);
    if (!item) return {
      success: false,
      error: {
        code: "NOT_FOUND",
        message: `Content item not found: ${id}`
      }
    };
    if (!item.translationGroup) return {
      success: true,
      data: {
        translationGroup: item.id,
        translations: [{
          id: item.id,
          locale: item.locale,
          slug: item.slug,
          status: item.status,
          updatedAt: item.updatedAt
        }]
      }
    };
    const translations = await repo.findTranslations(collection, item.translationGroup);
    return {
      success: true,
      data: {
        translationGroup: item.translationGroup,
        translations: translations.map((t) => ({
          id: t.id,
          locale: t.locale,
          slug: t.slug,
          status: t.status,
          updatedAt: t.updatedAt
        }))
      }
    };
  } catch (error) {
    if (error instanceof Error) console.error("Content translations error:", error);
    return {
      success: false,
      error: {
        code: "CONTENT_TRANSLATIONS_ERROR",
        message: "Failed to get translations"
      }
    };
  }
}
async function syncNonTranslatableFields(trx, collectionSlug, updatedItemId, translationGroup, data) {
  const collection = await trx.selectFrom("_emdash_collections").select("id").where("slug", "=", collectionSlug).executeTakeFirst();
  if (!collection) return;
  const nonTranslatableSlugs = (await trx.selectFrom("_emdash_fields").select("slug").where("collection_id", "=", collection.id).where("translatable", "=", 0).execute()).map((f2) => f2.slug);
  if (nonTranslatableSlugs.length === 0) return;
  const syncData = {};
  for (const slug of nonTranslatableSlugs) if (slug in data) syncData[slug] = data[slug];
  if (Object.keys(syncData).length === 0) return;
  validateIdentifier(collectionSlug, "collection slug");
  const tableName = `ec_${collectionSlug}`;
  const setClauses = Object.entries(syncData).map(([key, value]) => {
    validateIdentifier(key, "field slug");
    const serialized = typeof value === "object" && value !== null ? JSON.stringify(value) : value;
    return sql`${sql.ref(key)} = ${serialized}`;
  });
  await sql`
		UPDATE ${sql.ref(tableName)}
		SET ${sql.join(setClauses, sql`, `)}
		WHERE translation_group = ${translationGroup}
		AND id != ${updatedItemId}
	`.execute(trx);
}
async function hashString(content) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(content));
  return Array.from(new Uint8Array(buf).slice(0, 8), (b2) => b2.toString(16).padStart(2, "0")).join("");
}
async function computeContentHash(content) {
  let buf;
  if (content instanceof ArrayBuffer) buf = content;
  else {
    buf = new ArrayBuffer(content.byteLength);
    new Uint8Array(buf).set(content);
  }
  const hashBuffer = await crypto.subtle.digest("SHA-1", buf);
  const hashArray = new Uint8Array(hashBuffer);
  return `sha1:${Array.from(hashArray, (b2) => b2.toString(16).padStart(2, "0")).join("")}`;
}
async function handleRevisionList(db, collection, entryId, params = {}) {
  try {
    const repo = new RevisionRepository(db);
    const [items, total] = await Promise.all([repo.findByEntry(collection, entryId, { limit: Math.min(params.limit || 50, 100) }), repo.countByEntry(collection, entryId)]);
    return {
      success: true,
      data: {
        items,
        total
      }
    };
  } catch {
    return {
      success: false,
      error: {
        code: "REVISION_LIST_ERROR",
        message: "Failed to list revisions"
      }
    };
  }
}
async function handleRevisionGet(db, revisionId) {
  try {
    const item = await new RevisionRepository(db).findById(revisionId);
    if (!item) return {
      success: false,
      error: {
        code: "NOT_FOUND",
        message: `Revision not found: ${revisionId}`
      }
    };
    return {
      success: true,
      data: { item }
    };
  } catch {
    return {
      success: false,
      error: {
        code: "REVISION_GET_ERROR",
        message: "Failed to get revision"
      }
    };
  }
}
async function handleRevisionRestore(db, revisionId, callerUserId) {
  try {
    const revisionRepo = new RevisionRepository(db);
    const contentRepo = new ContentRepository(db);
    const revision = await revisionRepo.findById(revisionId);
    if (!revision) return {
      success: false,
      error: {
        code: "NOT_FOUND",
        message: `Revision not found: ${revisionId}`
      }
    };
    const { _slug, ...fieldData } = revision.data;
    const item = await contentRepo.update(revision.collection, revision.entryId, {
      data: fieldData,
      slug: typeof _slug === "string" ? _slug : void 0
    });
    await revisionRepo.create({
      collection: revision.collection,
      entryId: revision.entryId,
      data: revision.data,
      authorId: callerUserId
    });
    revisionRepo.pruneOldRevisions(revision.collection, revision.entryId, 50).catch(() => {
    });
    return {
      success: true,
      data: { item }
    };
  } catch {
    return {
      success: false,
      error: {
        code: "REVISION_RESTORE_ERROR",
        message: "Failed to restore revision"
      }
    };
  }
}
async function handleMediaList(db, params) {
  try {
    const result = await new MediaRepository(db).findMany({
      cursor: params.cursor,
      limit: Math.min(params.limit || 50, 100),
      mimeType: params.mimeType
    });
    return {
      success: true,
      data: {
        items: result.items,
        nextCursor: result.nextCursor
      }
    };
  } catch {
    return {
      success: false,
      error: {
        code: "MEDIA_LIST_ERROR",
        message: "Failed to list media"
      }
    };
  }
}
async function handleMediaGet(db, id) {
  try {
    const item = await new MediaRepository(db).findById(id);
    if (!item) return {
      success: false,
      error: {
        code: "NOT_FOUND",
        message: `Media item not found: ${id}`
      }
    };
    return {
      success: true,
      data: { item }
    };
  } catch {
    return {
      success: false,
      error: {
        code: "MEDIA_GET_ERROR",
        message: "Failed to get media"
      }
    };
  }
}
async function handleMediaCreate(db, input) {
  try {
    return {
      success: true,
      data: { item: await new MediaRepository(db).create(input) }
    };
  } catch {
    return {
      success: false,
      error: {
        code: "MEDIA_CREATE_ERROR",
        message: "Failed to create media"
      }
    };
  }
}
async function handleMediaUpdate(db, id, input) {
  try {
    const item = await new MediaRepository(db).update(id, input);
    if (!item) return {
      success: false,
      error: {
        code: "NOT_FOUND",
        message: `Media item not found: ${id}`
      }
    };
    return {
      success: true,
      data: { item }
    };
  } catch {
    return {
      success: false,
      error: {
        code: "MEDIA_UPDATE_ERROR",
        message: "Failed to update media"
      }
    };
  }
}
async function handleMediaDelete(db, id) {
  try {
    if (!await new MediaRepository(db).delete(id)) return {
      success: false,
      error: {
        code: "NOT_FOUND",
        message: `Media item not found: ${id}`
      }
    };
    return {
      success: true,
      data: { deleted: true }
    };
  } catch {
    return {
      success: false,
      error: {
        code: "MEDIA_DELETE_ERROR",
        message: "Failed to delete media"
      }
    };
  }
}
function toPluginStatus(value) {
  if (value === "active") return "active";
  return "inactive";
}
function toPluginSource(value) {
  if (value === "marketplace") return "marketplace";
  return "config";
}
var PluginStateRepository = class {
  constructor(db) {
    this.db = db;
  }
  /**
  * Get state for a specific plugin
  */
  async get(pluginId) {
    const row = await this.db.selectFrom("_plugin_state").selectAll().where("plugin_id", "=", pluginId).executeTakeFirst();
    if (!row) return null;
    return {
      pluginId: row.plugin_id,
      status: toPluginStatus(row.status),
      version: row.version,
      installedAt: new Date(row.installed_at),
      activatedAt: row.activated_at ? new Date(row.activated_at) : null,
      deactivatedAt: row.deactivated_at ? new Date(row.deactivated_at) : null,
      source: toPluginSource(row.source),
      marketplaceVersion: row.marketplace_version ?? null,
      displayName: row.display_name ?? null,
      description: row.description ?? null
    };
  }
  /**
  * Get all plugin states
  */
  async getAll() {
    return (await this.db.selectFrom("_plugin_state").selectAll().execute()).map((row) => ({
      pluginId: row.plugin_id,
      status: toPluginStatus(row.status),
      version: row.version,
      installedAt: new Date(row.installed_at),
      activatedAt: row.activated_at ? new Date(row.activated_at) : null,
      deactivatedAt: row.deactivated_at ? new Date(row.deactivated_at) : null,
      source: toPluginSource(row.source),
      marketplaceVersion: row.marketplace_version ?? null,
      displayName: row.display_name ?? null,
      description: row.description ?? null
    }));
  }
  /**
  * Get all marketplace-installed plugin states
  */
  async getMarketplacePlugins() {
    return (await this.db.selectFrom("_plugin_state").selectAll().where("source", "=", "marketplace").execute()).map((row) => ({
      pluginId: row.plugin_id,
      status: toPluginStatus(row.status),
      version: row.version,
      installedAt: new Date(row.installed_at),
      activatedAt: row.activated_at ? new Date(row.activated_at) : null,
      deactivatedAt: row.deactivated_at ? new Date(row.deactivated_at) : null,
      source: toPluginSource(row.source),
      marketplaceVersion: row.marketplace_version ?? null,
      displayName: row.display_name ?? null,
      description: row.description ?? null
    }));
  }
  /**
  * Create or update plugin state
  */
  async upsert(pluginId, version, status, opts) {
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const existing = await this.get(pluginId);
    if (existing) {
      const updates = {
        status,
        version
      };
      if (status === "active" && existing.status !== "active") updates.activated_at = now;
      else if (status === "inactive" && existing.status !== "inactive") updates.deactivated_at = now;
      if (opts?.source) updates.source = opts.source;
      if (opts?.marketplaceVersion !== void 0) updates.marketplace_version = opts.marketplaceVersion;
      if (opts?.displayName !== void 0) updates.display_name = opts.displayName;
      if (opts?.description !== void 0) updates.description = opts.description;
      await this.db.updateTable("_plugin_state").set(updates).where("plugin_id", "=", pluginId).execute();
    } else await this.db.insertInto("_plugin_state").values({
      plugin_id: pluginId,
      status,
      version,
      installed_at: now,
      activated_at: status === "active" ? now : null,
      deactivated_at: null,
      data: null,
      source: opts?.source ?? "config",
      marketplace_version: opts?.marketplaceVersion ?? null,
      display_name: opts?.displayName ?? null,
      description: opts?.description ?? null
    }).execute();
    return await this.get(pluginId);
  }
  /**
  * Enable a plugin
  */
  async enable(pluginId, version) {
    return this.upsert(pluginId, version, "active");
  }
  /**
  * Disable a plugin
  */
  async disable(pluginId, version) {
    return this.upsert(pluginId, version, "inactive");
  }
  /**
  * Delete plugin state
  */
  async delete(pluginId) {
    return ((await this.db.deleteFrom("_plugin_state").where("plugin_id", "=", pluginId).executeTakeFirst()).numDeletedRows ?? 0) > 0;
  }
};
const VERSION_PATTERN = /^[a-z0-9][a-z0-9._+-]*$/i;
function validateVersion(version) {
  if (version.includes("..")) throw new Error("Invalid version format");
  if (!VERSION_PATTERN.test(version)) throw new Error("Invalid version format");
}
async function streamToText(stream) {
  return new Response(stream).text();
}
async function loadBundleFromR2(storage2, pluginId, version) {
  validatePluginIdentifier(pluginId, "plugin ID");
  validateVersion(version);
  const prefix = `marketplace/${pluginId}/${version}`;
  try {
    const manifestResult = await storage2.download(`${prefix}/manifest.json`);
    const backendResult = await storage2.download(`${prefix}/backend.js`);
    const manifestText = await streamToText(manifestResult.body);
    const backendCode = await streamToText(backendResult.body);
    const parsed = JSON.parse(manifestText);
    const result = pluginManifestSchema.safeParse(parsed);
    if (!result.success) return null;
    const manifest = result.data;
    let adminCode;
    try {
      adminCode = await streamToText((await storage2.download(`${prefix}/admin.js`)).body);
    } catch {
    }
    return {
      manifest,
      backendCode,
      adminCode
    };
  } catch {
    return null;
  }
}
const VALID_ROLE_LEVELS = /* @__PURE__ */ new Set([
  10,
  20,
  30,
  40,
  50
]);
const roleLevel = number$1().int().refine((n) => VALID_ROLE_LEVELS.has(n), { message: "Invalid role level. Must be 10, 20, 30, 40, or 50" });
const cursorPaginationQuery = object({
  cursor: string().optional().meta({ description: "Opaque cursor for pagination" }),
  limit: number$1().int().min(1).max(100).optional().default(50).meta({ description: "Maximum number of items to return (1-100, default 50)" })
}).meta({ id: "CursorPaginationQuery" });
object({
  limit: number$1().int().min(1).max(100).optional().default(50),
  offset: number$1().int().min(0).optional().default(0)
}).meta({ id: "OffsetPaginationQuery" });
const slugPattern = /^[a-z][a-z0-9_]*$/;
const HTTP_SCHEME_RE = /^https?:\/\//i;
const httpUrl = string().url().refine((url) => HTTP_SCHEME_RE.test(url), "URL must use http or https");
const localeCode = string().regex(/^[a-z]{2,3}(-[a-z0-9]{2,8})*$/i, "Invalid locale code").transform((v2) => v2.toLowerCase());
object({ error: object({
  code: string().meta({
    description: "Machine-readable error code",
    example: "NOT_FOUND"
  }),
  message: string().meta({ description: "Human-readable error message" })
}) }).meta({ id: "ApiError" });
object({ deleted: literal(true) }).meta({ id: "DeleteResponse" });
object({ count: number().int().min(0) }).meta({ id: "CountResponse" });
const bylineSlugPattern = /^[a-z][a-z0-9-]*$/;
const bylineSummarySchema = object({
  id: string(),
  slug: string(),
  displayName: string(),
  bio: string().nullable(),
  avatarMediaId: string().nullable(),
  websiteUrl: string().nullable(),
  userId: string().nullable(),
  isGuest: boolean(),
  createdAt: string(),
  updatedAt: string()
}).meta({ id: "BylineSummary" });
const bylineCreditSchema = object({
  byline: bylineSummarySchema,
  sortOrder: number().int(),
  roleLabel: string().nullable(),
  source: _enum(["explicit", "inferred"]).optional().meta({ description: "Whether this credit was explicitly assigned or inferred from authorId" })
}).meta({ id: "BylineCredit" });
const contentBylineInputSchema = object({
  bylineId: string().min(1),
  roleLabel: string().nullish()
}).meta({ id: "ContentBylineInput" });
cursorPaginationQuery.extend({
  search: string().optional(),
  isGuest: boolean$1().optional(),
  userId: string().optional()
}).meta({ id: "BylinesListQuery" });
object({
  slug: string().min(1).regex(bylineSlugPattern, "Slug must contain only lowercase letters, digits, and hyphens"),
  displayName: string().min(1),
  bio: string().nullish(),
  avatarMediaId: string().nullish(),
  websiteUrl: httpUrl.nullish(),
  userId: string().nullish(),
  isGuest: boolean().optional()
}).meta({ id: "BylineCreateBody" });
object({
  slug: string().min(1).regex(bylineSlugPattern, "Slug must contain only lowercase letters, digits, and hyphens").optional(),
  displayName: string().min(1).optional(),
  bio: string().nullish(),
  avatarMediaId: string().nullish(),
  websiteUrl: httpUrl.nullish(),
  userId: string().nullish(),
  isGuest: boolean().optional()
}).meta({ id: "BylineUpdateBody" });
object({
  items: array(bylineSummarySchema),
  nextCursor: string().optional()
}).meta({ id: "BylineListResponse" });
const contentSeoInput = object({
  title: string().max(200).nullish(),
  description: string().max(500).nullish(),
  image: string().nullish(),
  canonical: httpUrl.nullish(),
  noIndex: boolean().optional()
}).meta({ id: "ContentSeoInput" });
cursorPaginationQuery.extend({
  status: string().optional(),
  orderBy: string().optional(),
  order: _enum(["asc", "desc"]).optional(),
  locale: localeCode.optional()
}).meta({ id: "ContentListQuery" });
object({
  data: record(string(), unknown()),
  slug: string().nullish(),
  status: string().optional(),
  bylines: array(contentBylineInputSchema).optional(),
  locale: localeCode.optional(),
  translationOf: string().optional(),
  seo: contentSeoInput.optional()
}).meta({ id: "ContentCreateBody" });
object({
  data: record(string(), unknown()).optional(),
  slug: string().nullish(),
  status: string().optional(),
  authorId: string().nullish(),
  bylines: array(contentBylineInputSchema).optional(),
  _rev: string().optional().meta({ description: "Opaque revision token for optimistic concurrency" }),
  skipRevision: boolean().optional(),
  seo: contentSeoInput.optional()
}).meta({ id: "ContentUpdateBody" });
object({ scheduledAt: string().min(1, "scheduledAt is required").meta({
  description: "ISO 8601 datetime for scheduled publishing",
  example: "2025-06-15T09:00:00Z"
}) }).meta({ id: "ContentScheduleBody" });
object({
  expiresIn: union([string(), number()]).optional(),
  pathPattern: string().optional()
}).meta({ id: "ContentPreviewUrlBody" });
object({ termIds: array(string()) }).meta({ id: "ContentTermsBody" });
const contentSeoSchema = object({
  title: string().nullable(),
  description: string().nullable(),
  image: string().nullable(),
  canonical: string().nullable(),
  noIndex: boolean()
}).meta({ id: "ContentSeo" });
const contentItemSchema = object({
  id: string(),
  type: string().meta({ description: "Collection slug this item belongs to" }),
  slug: string().nullable(),
  status: string().meta({ description: "draft, published, or scheduled" }),
  data: record(string(), unknown()).meta({ description: "User-defined field values" }),
  authorId: string().nullable(),
  primaryBylineId: string().nullable(),
  byline: bylineSummarySchema.nullable().optional(),
  bylines: array(bylineCreditSchema).optional(),
  createdAt: string(),
  updatedAt: string(),
  publishedAt: string().nullable(),
  scheduledAt: string().nullable(),
  liveRevisionId: string().nullable(),
  draftRevisionId: string().nullable(),
  version: number().int(),
  locale: string().nullable(),
  translationGroup: string().nullable(),
  seo: contentSeoSchema.optional()
}).meta({ id: "ContentItem" });
object({
  item: contentItemSchema,
  _rev: string().optional().meta({ description: "Opaque revision token for optimistic concurrency" })
}).meta({ id: "ContentResponse" });
object({
  items: array(contentItemSchema),
  nextCursor: string().optional()
}).meta({ id: "ContentListResponse" });
const trashedContentItemSchema = object({
  id: string(),
  type: string(),
  slug: string().nullable(),
  status: string(),
  data: record(string(), unknown()),
  authorId: string().nullable(),
  createdAt: string(),
  updatedAt: string(),
  publishedAt: string().nullable(),
  deletedAt: string()
}).meta({ id: "TrashedContentItem" });
object({
  items: array(trashedContentItemSchema),
  nextCursor: string().optional()
}).meta({ id: "TrashedContentListResponse" });
object({
  hasChanges: boolean(),
  live: record(string(), unknown()).nullable(),
  draft: record(string(), unknown()).nullable()
}).meta({ id: "ContentCompareResponse" });
const contentTranslationSchema = object({
  id: string(),
  locale: string().nullable(),
  slug: string().nullable(),
  status: string(),
  updatedAt: string()
});
object({
  translationGroup: string(),
  translations: array(contentTranslationSchema)
}).meta({ id: "ContentTranslationsResponse" });
cursorPaginationQuery.extend({ mimeType: string().optional() }).meta({ id: "MediaListQuery" });
object({
  alt: string().optional(),
  caption: string().optional(),
  width: number().int().positive().optional(),
  height: number().int().positive().optional()
}).meta({ id: "MediaUpdateBody" });
const MAX_UPLOAD_SIZE = 50 * 1024 * 1024;
object({
  filename: string().min(1, "filename is required"),
  contentType: string().min(1, "contentType is required"),
  size: number().int().positive().max(MAX_UPLOAD_SIZE, `File size must not exceed ${MAX_UPLOAD_SIZE / 1024 / 1024}MB`),
  contentHash: string().optional()
}).meta({ id: "MediaUploadUrlBody" });
object({
  size: number().int().positive().optional(),
  width: number().int().positive().optional(),
  height: number().int().positive().optional()
}).meta({ id: "MediaConfirmBody" });
cursorPaginationQuery.extend({
  query: string().optional(),
  mimeType: string().optional()
}).meta({ id: "MediaProviderListQuery" });
const mediaStatusSchema = _enum([
  "pending",
  "ready",
  "failed"
]);
const mediaItemSchema = object({
  id: string(),
  filename: string(),
  mimeType: string(),
  size: number().nullable(),
  width: number().nullable(),
  height: number().nullable(),
  alt: string().nullable(),
  caption: string().nullable(),
  storageKey: string(),
  status: mediaStatusSchema,
  contentHash: string().nullable(),
  blurhash: string().nullable(),
  dominantColor: string().nullable(),
  createdAt: string(),
  authorId: string().nullable()
}).meta({ id: "MediaItem" });
object({ item: mediaItemSchema }).meta({ id: "MediaResponse" });
object({
  items: array(mediaItemSchema),
  nextCursor: string().optional()
}).meta({ id: "MediaListResponse" });
object({
  uploadUrl: string(),
  method: literal("PUT"),
  headers: record(string(), string()),
  mediaId: string(),
  storageKey: string(),
  expiresAt: string()
}).meta({ id: "MediaUploadUrlResponse" });
object({
  existing: literal(true),
  mediaId: string(),
  storageKey: string(),
  url: string()
}).meta({ id: "MediaExistingResponse" });
object({ item: mediaItemSchema.extend({ url: string() }) }).meta({ id: "MediaConfirmResponse" });
const collectionSupportValues = _enum([
  "drafts",
  "revisions",
  "preview",
  "scheduling",
  "search"
]);
const collectionSourcePattern = /^(template:.+|import:.+|manual|discovered|seed)$/;
const fieldTypeValues = _enum([
  "string",
  "text",
  "number",
  "integer",
  "boolean",
  "datetime",
  "select",
  "multiSelect",
  "portableText",
  "image",
  "file",
  "reference",
  "json",
  "slug"
]);
const fieldValidation = object({
  required: boolean().optional(),
  min: number().optional(),
  max: number().optional(),
  minLength: number().int().min(0).optional(),
  maxLength: number().int().min(0).optional(),
  pattern: string().optional(),
  options: array(string()).optional()
}).optional();
const fieldWidgetOptions = record(string(), unknown()).optional();
object({
  slug: string().min(1).max(63).regex(slugPattern, "Invalid slug format"),
  label: string().min(1),
  labelSingular: string().optional(),
  description: string().optional(),
  icon: string().optional(),
  supports: array(collectionSupportValues).optional(),
  source: string().regex(collectionSourcePattern).optional(),
  urlPattern: string().optional(),
  hasSeo: boolean().optional()
}).meta({ id: "CreateCollectionBody" });
object({
  label: string().min(1).optional(),
  labelSingular: string().optional(),
  description: string().optional(),
  icon: string().optional(),
  supports: array(collectionSupportValues).optional(),
  urlPattern: string().nullish(),
  hasSeo: boolean().optional(),
  commentsEnabled: boolean().optional(),
  commentsModeration: _enum([
    "all",
    "first_time",
    "none"
  ]).optional(),
  commentsClosedAfterDays: number().int().min(0).optional(),
  commentsAutoApproveUsers: boolean().optional()
}).meta({ id: "UpdateCollectionBody" });
object({
  slug: string().min(1).max(63).regex(slugPattern, "Invalid slug format"),
  label: string().min(1),
  type: fieldTypeValues,
  required: boolean().optional(),
  unique: boolean().optional(),
  defaultValue: unknown().optional(),
  validation: fieldValidation,
  widget: string().optional(),
  options: fieldWidgetOptions,
  sortOrder: number().int().min(0).optional(),
  searchable: boolean().optional(),
  translatable: boolean().optional()
}).meta({ id: "CreateFieldBody" });
object({
  label: string().min(1).optional(),
  required: boolean().optional(),
  unique: boolean().optional(),
  defaultValue: unknown().optional(),
  validation: fieldValidation,
  widget: string().optional(),
  options: fieldWidgetOptions,
  sortOrder: number().int().min(0).optional(),
  searchable: boolean().optional(),
  translatable: boolean().optional()
}).meta({ id: "UpdateFieldBody" });
object({ fieldSlugs: array(string().min(1)) }).meta({ id: "FieldReorderBody" });
object({
  label: string().optional(),
  labelSingular: string().optional(),
  description: string().optional()
}).meta({ id: "OrphanRegisterBody" });
object({ format: string().optional() });
object({ includeFields: string().transform((v2) => v2 === "true").optional() });
const collectionSchema = object({
  id: string(),
  slug: string(),
  label: string(),
  labelSingular: string().nullable(),
  description: string().nullable(),
  icon: string().nullable(),
  supports: array(string()),
  source: string().nullable(),
  urlPattern: string().nullable(),
  hasSeo: boolean(),
  createdAt: string(),
  updatedAt: string()
}).meta({ id: "Collection" });
const fieldSchema = object({
  id: string(),
  collectionId: string(),
  slug: string(),
  label: string(),
  type: fieldTypeValues,
  required: boolean(),
  unique: boolean(),
  defaultValue: unknown().nullable(),
  validation: record(string(), unknown()).nullable(),
  widget: string().nullable(),
  options: record(string(), unknown()).nullable(),
  sortOrder: number().int(),
  searchable: boolean(),
  translatable: boolean(),
  createdAt: string(),
  updatedAt: string()
}).meta({ id: "Field" });
object({ item: collectionSchema }).meta({ id: "CollectionResponse" });
object({ item: collectionSchema.extend({ fields: array(fieldSchema) }) }).meta({ id: "CollectionWithFieldsResponse" });
object({ items: array(collectionSchema) }).meta({ id: "CollectionListResponse" });
object({ item: fieldSchema }).meta({ id: "FieldResponse" });
object({ items: array(fieldSchema) }).meta({ id: "FieldListResponse" });
const orphanedTableSchema = object({
  slug: string(),
  tableName: string(),
  rowCount: number().int()
}).meta({ id: "OrphanedTable" });
object({ items: array(orphanedTableSchema) }).meta({ id: "OrphanedTableListResponse" });
object({
  authorName: string().min(1).max(100),
  authorEmail: string().email(),
  body: string().min(1).max(5e3),
  parentId: string().optional(),
  website_url: string().optional()
}).meta({ id: "CreateCommentBody" });
object({ status: _enum([
  "approved",
  "pending",
  "spam",
  "trash"
]) }).meta({ id: "CommentStatusBody" });
object({
  ids: array(string().min(1)).min(1).max(100),
  action: _enum([
    "approve",
    "spam",
    "trash",
    "delete"
  ])
}).meta({ id: "CommentBulkBody" });
object({
  status: _enum([
    "pending",
    "approved",
    "spam",
    "trash"
  ]).optional(),
  collection: string().optional(),
  search: string().optional(),
  limit: number$1().int().min(1).max(100).optional(),
  cursor: string().optional()
}).meta({ id: "CommentListQuery" });
const commentStatusValues = _enum([
  "pending",
  "approved",
  "spam",
  "trash"
]);
const publicCommentSchema = object({
  id: string(),
  authorName: string(),
  isRegisteredUser: boolean(),
  body: string(),
  parentId: string().nullable(),
  createdAt: string(),
  replies: array(any()).optional()
}).meta({ id: "PublicComment" });
const commentSchema = object({
  id: string(),
  collection: string(),
  contentId: string(),
  authorName: string(),
  authorEmail: string(),
  body: string(),
  status: commentStatusValues,
  parentId: string().nullable(),
  ipHash: string().nullable(),
  createdAt: string(),
  updatedAt: string()
}).meta({ id: "Comment" });
object({
  items: array(publicCommentSchema),
  nextCursor: string().optional(),
  total: number().int()
}).meta({ id: "PublicCommentListResponse" });
object({
  items: array(commentSchema),
  nextCursor: string().optional()
}).meta({ id: "AdminCommentListResponse" });
object({
  pending: number().int(),
  approved: number().int(),
  spam: number().int(),
  trash: number().int()
}).meta({ id: "CommentCountsResponse" });
object({ affected: number().int() }).meta({ id: "CommentBulkResponse" });
const authenticatorTransport$1 = _enum([
  "usb",
  "nfc",
  "ble",
  "internal",
  "hybrid"
]);
const registrationCredential$1 = object({
  id: string(),
  rawId: string(),
  type: literal("public-key"),
  response: object({
    clientDataJSON: string(),
    attestationObject: string(),
    transports: array(authenticatorTransport$1).optional()
  }),
  authenticatorAttachment: _enum(["platform", "cross-platform"]).optional()
});
const authenticationCredential = object({
  id: string(),
  rawId: string(),
  type: literal("public-key"),
  response: object({
    clientDataJSON: string(),
    authenticatorData: string(),
    signature: string(),
    userHandle: string().optional()
  }),
  authenticatorAttachment: _enum(["platform", "cross-platform"]).optional()
});
object({ email: string().email() }).meta({ id: "SignupRequestBody" });
object({
  token: string().min(1),
  credential: registrationCredential$1,
  name: string().optional()
}).meta({ id: "SignupCompleteBody" });
object({
  email: string().email(),
  role: roleLevel.optional()
}).meta({ id: "InviteCreateBody" });
object({
  token: string().min(1),
  credential: registrationCredential$1,
  name: string().optional()
}).meta({ id: "InviteCompleteBody" });
object({ email: string().email() }).meta({ id: "MagicLinkSendBody" });
object({ email: string().email().optional() }).meta({ id: "PasskeyOptionsBody" });
object({ credential: authenticationCredential }).meta({ id: "PasskeyVerifyBody" });
object({ name: string().optional() }).meta({ id: "PasskeyRegisterOptionsBody" });
object({
  credential: registrationCredential$1,
  name: string().optional()
}).meta({ id: "PasskeyRegisterVerifyBody" });
object({ name: string().min(1) }).meta({ id: "PasskeyRenameBody" });
object({ action: string().min(1) }).meta({ id: "AuthMeActionBody" });
const menuItemType = string().min(1);
object({
  name: string().min(1),
  label: string().min(1)
}).meta({ id: "CreateMenuBody" });
object({ label: string().min(1).optional() }).meta({ id: "UpdateMenuBody" });
object({
  type: menuItemType,
  label: string().min(1),
  referenceCollection: string().optional(),
  referenceId: string().optional(),
  customUrl: string().optional(),
  target: string().optional(),
  titleAttr: string().optional(),
  cssClasses: string().optional(),
  parentId: string().optional(),
  sortOrder: number().int().min(0).optional()
}).meta({ id: "CreateMenuItemBody" });
object({
  label: string().min(1).optional(),
  customUrl: string().optional(),
  target: string().optional(),
  titleAttr: string().optional(),
  cssClasses: string().optional(),
  parentId: string().nullish(),
  sortOrder: number().int().min(0).optional()
}).meta({ id: "UpdateMenuItemBody" });
object({ id: string().min(1) });
object({ id: string().min(1) });
object({ items: array(object({
  id: string().min(1),
  parentId: string().nullable(),
  sortOrder: number().int().min(0)
})) }).meta({ id: "ReorderMenuItemsBody" });
const menuSchema = object({
  id: string(),
  name: string(),
  label: string(),
  created_at: string(),
  updated_at: string()
}).meta({ id: "Menu" });
const menuItemSchema = object({
  id: string(),
  menu_id: string(),
  parent_id: string().nullable(),
  sort_order: number().int(),
  type: string(),
  reference_collection: string().nullable(),
  reference_id: string().nullable(),
  custom_url: string().nullable(),
  label: string(),
  title_attr: string().nullable(),
  target: string().nullable(),
  css_classes: string().nullable(),
  created_at: string()
}).meta({ id: "MenuItem" });
menuSchema.extend({ itemCount: number().int() }).meta({ id: "MenuListItem" });
menuSchema.extend({ items: array(menuItemSchema) }).meta({ id: "MenuWithItems" });
const collectionSlugPattern = /^[a-z][a-z0-9_]*$/;
object({
  name: string().min(1).max(63).regex(/^[a-z][a-z0-9_]*$/, "Name must be lowercase alphanumeric with underscores"),
  label: string().min(1).max(200),
  hierarchical: boolean().optional().default(false),
  collections: array(string().min(1).max(63).regex(collectionSlugPattern, "Invalid collection slug format")).max(100).optional().default([])
}).meta({ id: "CreateTaxonomyDefBody" });
object({
  slug: string().min(1),
  label: string().min(1),
  parentId: string().nullish(),
  description: string().optional()
}).meta({ id: "CreateTermBody" });
object({
  slug: string().min(1).optional(),
  label: string().min(1).optional(),
  parentId: string().nullish(),
  description: string().optional()
}).meta({ id: "UpdateTermBody" });
const taxonomyDefSchema = object({
  id: string(),
  name: string(),
  label: string(),
  labelSingular: string().optional(),
  hierarchical: boolean(),
  collections: array(string())
}).meta({ id: "TaxonomyDef" });
object({ taxonomies: array(taxonomyDefSchema) }).meta({ id: "TaxonomyListResponse" });
const termSchema = object({
  id: string(),
  name: string(),
  slug: string(),
  label: string(),
  parentId: string().nullable(),
  description: string().optional()
}).meta({ id: "Term" });
const termWithCountSchema = object({
  id: string(),
  name: string(),
  slug: string(),
  label: string(),
  parentId: string().nullable(),
  description: string().optional(),
  count: number().int(),
  children: array(lazy(() => termWithCountSchema))
}).meta({ id: "TermWithCount" });
object({ terms: array(termWithCountSchema) }).meta({ id: "TermListResponse" });
object({ term: termSchema }).meta({ id: "TermResponse" });
object({ term: termSchema.extend({
  count: number().int(),
  children: array(object({
    id: string(),
    slug: string(),
    label: string()
  }))
}) }).meta({ id: "TermGetResponse" });
const sectionSource = _enum([
  "theme",
  "user",
  "import"
]);
object({
  source: sectionSource.optional(),
  search: string().optional(),
  limit: number$1().int().min(1).max(100).optional(),
  cursor: string().optional()
}).meta({ id: "SectionsListQuery" });
object({
  slug: string().min(1),
  title: string().min(1),
  description: string().optional(),
  keywords: array(string()).optional(),
  content: array(record(string(), unknown())),
  previewMediaId: string().optional(),
  source: sectionSource.optional(),
  themeId: string().optional()
}).meta({ id: "CreateSectionBody" });
object({
  slug: string().min(1).optional(),
  title: string().min(1).optional(),
  description: string().optional(),
  keywords: array(string()).optional(),
  content: array(record(string(), unknown())).optional(),
  previewMediaId: string().nullish()
}).meta({ id: "UpdateSectionBody" });
const sectionSchema = object({
  id: string(),
  slug: string(),
  title: string(),
  description: string().nullable(),
  keywords: array(string()).nullable(),
  content: array(record(string(), unknown())),
  previewMediaId: string().nullable(),
  source: string(),
  themeId: string().nullable(),
  createdAt: string(),
  updatedAt: string()
}).meta({ id: "Section" });
object({
  items: array(sectionSchema),
  nextCursor: string().optional()
}).meta({ id: "SectionListResponse" });
const mediaReference = object({
  mediaId: string(),
  alt: string().optional()
});
const socialSettings = object({
  twitter: string().optional(),
  github: string().optional(),
  facebook: string().optional(),
  instagram: string().optional(),
  linkedin: string().optional(),
  youtube: string().optional()
});
const seoSettings = object({
  titleSeparator: string().max(10).optional(),
  defaultOgImage: mediaReference.optional(),
  robotsTxt: string().max(5e3).optional(),
  googleVerification: string().max(100).optional(),
  bingVerification: string().max(100).optional()
});
object({
  title: string().optional(),
  tagline: string().optional(),
  logo: mediaReference.optional(),
  favicon: mediaReference.optional(),
  url: union([httpUrl, literal("")]).optional(),
  postsPerPage: number().int().min(1).max(100).optional(),
  dateFormat: string().optional(),
  timezone: string().optional(),
  social: socialSettings.optional(),
  seo: seoSettings.optional()
}).meta({ id: "SettingsUpdateBody" });
object({
  title: string().optional(),
  tagline: string().optional(),
  logo: mediaReference.optional(),
  favicon: mediaReference.optional(),
  url: string().optional(),
  postsPerPage: number().int().optional(),
  dateFormat: string().optional(),
  timezone: string().optional(),
  social: socialSettings.optional(),
  seo: seoSettings.optional()
}).meta({ id: "SiteSettings" });
object({
  q: string().min(1),
  collections: string().optional(),
  status: string().optional(),
  locale: localeCode.optional(),
  limit: number$1().int().min(1).max(100).optional()
}).meta({ id: "SearchQuery" });
object({
  q: string().min(1),
  collections: string().optional(),
  locale: localeCode.optional(),
  limit: number$1().int().min(1).max(20).optional()
}).meta({ id: "SearchSuggestQuery" });
object({ collection: string().min(1) }).meta({ id: "SearchRebuildBody" });
object({
  collection: string().min(1),
  enabled: boolean(),
  weights: record(string(), number()).optional()
}).meta({ id: "SearchEnableBody" });
const searchResultSchema = object({
  collection: string(),
  id: string(),
  slug: string().nullable(),
  locale: string(),
  title: string().optional(),
  snippet: string().optional(),
  score: number()
}).meta({ id: "SearchResult" });
object({
  items: array(searchResultSchema),
  nextCursor: string().optional()
}).meta({ id: "SearchResponse" });
object({ url: httpUrl });
object({
  url: httpUrl,
  token: string().min(1)
});
object({
  url: httpUrl,
  token: string().min(1),
  config: record(string(), unknown())
});
object({ postTypes: array(object({
  name: string().min(1),
  collection: string().min(1),
  fields: array(object({
    slug: string().min(1),
    label: string().min(1),
    type: string().min(1),
    required: boolean(),
    searchable: boolean().optional()
  })).optional()
})) });
object({
  attachments: array(record(string(), unknown())),
  stream: boolean().optional()
});
object({
  urlMap: record(string(), string()),
  collections: array(string()).optional()
});
const authenticatorTransport = _enum([
  "usb",
  "nfc",
  "ble",
  "internal",
  "hybrid"
]);
const registrationCredential = object({
  id: string(),
  rawId: string(),
  type: literal("public-key"),
  response: object({
    clientDataJSON: string(),
    attestationObject: string(),
    transports: array(authenticatorTransport).optional()
  }),
  authenticatorAttachment: _enum(["platform", "cross-platform"]).optional()
});
object({
  title: string().min(1),
  tagline: string().optional(),
  includeContent: boolean()
});
object({
  email: string().email(),
  name: string().optional()
});
object({ credential: registrationCredential });
object({
  search: string().optional(),
  role: string().optional(),
  cursor: string().optional(),
  limit: number$1().int().min(1).max(100).optional().default(50)
}).meta({ id: "UsersListQuery" });
object({
  name: string().optional(),
  email: string().email().optional(),
  role: roleLevel.optional()
}).meta({ id: "UserUpdateBody" });
object({
  domain: string().min(1),
  defaultRole: roleLevel
}).meta({ id: "AllowedDomainCreateBody" });
object({
  enabled: boolean().optional(),
  defaultRole: roleLevel.optional()
}).meta({ id: "AllowedDomainUpdateBody" });
const userSchema = object({
  id: string(),
  email: string(),
  name: string().nullable(),
  avatarUrl: string().nullable(),
  role: number().int(),
  emailVerified: boolean(),
  disabled: boolean(),
  createdAt: string(),
  updatedAt: string(),
  lastLogin: string().nullable(),
  credentialCount: number().int().optional(),
  oauthProviders: array(string()).optional()
}).meta({ id: "User" });
object({
  items: array(userSchema),
  nextCursor: string().optional()
}).meta({ id: "UserListResponse" });
object({
  id: string(),
  email: string(),
  name: string().nullable(),
  avatarUrl: string().nullable(),
  role: number().int(),
  emailVerified: boolean(),
  disabled: boolean(),
  createdAt: string(),
  updatedAt: string(),
  lastLogin: string().nullable(),
  credentials: array(object({
    id: string(),
    name: string().nullable(),
    deviceType: string().nullable(),
    createdAt: string(),
    lastUsedAt: string()
  })),
  oauthAccounts: array(object({
    provider: string(),
    createdAt: string()
  }))
}).meta({ id: "UserDetail" });
const widgetType = _enum([
  "content",
  "menu",
  "component"
]);
object({
  name: string().min(1),
  label: string().min(1),
  description: string().optional()
}).meta({ id: "CreateWidgetAreaBody" });
object({
  type: widgetType,
  title: string().optional(),
  content: array(record(string(), unknown())).optional(),
  menuName: string().optional(),
  componentId: string().optional(),
  componentProps: record(string(), unknown()).optional()
}).meta({ id: "CreateWidgetBody" });
object({
  type: widgetType.optional(),
  title: string().optional(),
  content: array(record(string(), unknown())).optional(),
  menuName: string().optional(),
  componentId: string().optional(),
  componentProps: record(string(), unknown()).optional()
}).meta({ id: "UpdateWidgetBody" });
object({ widgetIds: array(string().min(1)) }).meta({ id: "ReorderWidgetsBody" });
const widgetAreaSchema = object({
  id: string(),
  name: string(),
  label: string(),
  description: string().nullable(),
  created_at: string(),
  updated_at: string()
}).meta({ id: "WidgetArea" });
const widgetSchema = object({
  id: string(),
  area_id: string(),
  type: string(),
  title: string().nullable(),
  content: string().nullable(),
  menu_name: string().nullable(),
  component_id: string().nullable(),
  component_props: string().nullable(),
  sort_order: number().int(),
  created_at: string(),
  updated_at: string()
}).meta({ id: "Widget" });
widgetAreaSchema.extend({ widgets: array(widgetSchema) }).meta({ id: "WidgetAreaWithWidgets" });
const redirectType = number$1().int().refine((n) => [
  301,
  302,
  307,
  308
].includes(n), { message: "Redirect type must be 301, 302, 307, or 308" });
const CRLF = /[\r\n]/;
const urlPath = string().min(1).refine((s2) => s2.startsWith("/") && !s2.startsWith("//"), { message: "Must be a path starting with / (no protocol-relative URLs)" }).refine((s2) => !CRLF.test(s2), { message: "URL must not contain newline characters" }).refine((s2) => {
  try {
    return !decodeURIComponent(s2).split("/").includes("..");
  } catch {
    return false;
  }
}, { message: "URL must not contain path traversal segments" });
object({
  source: urlPath,
  destination: urlPath,
  type: redirectType.optional().default(301),
  enabled: boolean().optional().default(true),
  groupName: string().nullish()
}).meta({ id: "CreateRedirectBody" });
object({
  source: urlPath.optional(),
  destination: urlPath.optional(),
  type: redirectType.optional(),
  enabled: boolean().optional(),
  groupName: string().nullish()
}).refine((o) => Object.values(o).some((v2) => v2 !== void 0), { message: "At least one field must be provided" }).meta({ id: "UpdateRedirectBody" });
cursorPaginationQuery.extend({
  search: string().optional(),
  group: string().optional(),
  enabled: _enum(["true", "false"]).transform((v2) => v2 === "true").optional(),
  auto: _enum(["true", "false"]).transform((v2) => v2 === "true").optional()
}).meta({ id: "RedirectsListQuery" });
cursorPaginationQuery.extend({ search: string().optional() }).meta({ id: "NotFoundListQuery" });
object({ limit: number$1().int().min(1).max(100).optional().default(50) });
object({ olderThan: string().datetime({ message: "olderThan must be an ISO 8601 datetime" }) }).meta({ id: "NotFoundPruneBody" });
const redirectSchema = object({
  id: string(),
  source: string(),
  destination: string(),
  type: number().int(),
  isPattern: boolean(),
  enabled: boolean(),
  hits: number().int(),
  lastHitAt: string().nullable(),
  groupName: string().nullable(),
  auto: boolean(),
  createdAt: string(),
  updatedAt: string()
}).meta({ id: "Redirect" });
object({
  items: array(redirectSchema),
  nextCursor: string().optional()
}).meta({ id: "RedirectListResponse" });
const notFoundEntrySchema = object({
  id: string(),
  path: string(),
  referrer: string().nullable(),
  userAgent: string().nullable(),
  ip: string().nullable(),
  createdAt: string()
}).meta({ id: "NotFoundEntry" });
object({
  items: array(notFoundEntrySchema),
  nextCursor: string().optional()
}).meta({ id: "NotFoundListResponse" });
const notFoundSummarySchema = object({
  path: string(),
  count: number().int(),
  lastSeen: string(),
  topReferrer: string().nullable()
}).meta({ id: "NotFoundSummary" });
object({ items: array(notFoundSummarySchema) }).meta({ id: "NotFoundSummaryResponse" });
const PHP_SERIALIZED_STRING_PATTERN = /s:\d+:"([^"]+)"/g;
const PHP_SERIALIZED_STRING_MATCH_PATTERN = /s:\d+:"([^"]+)"/;
function attrStr(attr) {
  if (typeof attr === "string") return attr;
  if (attr && typeof attr === "object" && "value" in attr) return attr.value;
  return "";
}
function isCompleteWxrTerm(term) {
  return term.id !== void 0 && term.taxonomy !== void 0 && term.slug !== void 0 && term.name !== void 0;
}
function parseWxrString(xml) {
  return new Promise((resolve, reject) => {
    const parser = sax.parser(true, {
      trim: false,
      normalize: false
    });
    const data = {
      site: {},
      posts: [],
      attachments: [],
      categories: [],
      tags: [],
      authors: [],
      terms: [],
      navMenus: []
    };
    let currentPath = [];
    let currentText = "";
    let currentItem = null;
    let currentAttachment = null;
    let currentCategory = null;
    let currentTag = null;
    let currentAuthor = null;
    let currentTerm = null;
    let currentMetaKey = "";
    const navMenuItemPosts = [];
    const menuTermsBySlug = /* @__PURE__ */ new Map();
    parser.onopentag = (node) => {
      const tag = node.name.toLowerCase();
      currentPath.push(tag);
      currentText = "";
      if (tag === "item") currentItem = {
        categories: [],
        tags: [],
        customTaxonomies: /* @__PURE__ */ new Map(),
        meta: /* @__PURE__ */ new Map()
      };
      else if (tag === "wp:category") currentCategory = {};
      else if (tag === "wp:tag") currentTag = {};
      else if (tag === "wp:author") currentAuthor = {};
      else if (tag === "wp:term") currentTerm = {};
      if (tag === "category" && currentItem && node.attributes) {
        const domain = attrStr(node.attributes.domain);
        const nicename = attrStr(node.attributes.nicename);
        if (domain === "category" && nicename) currentItem.categories.push(nicename);
        else if (domain === "post_tag" && nicename) currentItem.tags.push(nicename);
        else if (domain && nicename && domain !== "category" && domain !== "post_tag") {
          if (!currentItem.customTaxonomies) currentItem.customTaxonomies = /* @__PURE__ */ new Map();
          const existing = currentItem.customTaxonomies.get(domain) || [];
          existing.push(nicename);
          currentItem.customTaxonomies.set(domain, existing);
        }
      }
    };
    parser.ontext = (text) => {
      currentText += text;
    };
    parser.oncdata = (cdata) => {
      currentText += cdata;
    };
    parser.onclosetag = (tagName) => {
      const tag = tagName.toLowerCase();
      const text = currentText.trim();
      if (currentPath.length === 2 && currentPath[0] === "rss") switch (tag) {
        case "title":
          data.site.title = text;
          break;
        case "link":
          data.site.link = text;
          break;
        case "description":
          data.site.description = text;
          break;
        case "language":
          data.site.language = text;
          break;
        case "wp:base_site_url":
          data.site.baseSiteUrl = text;
          break;
        case "wp:base_blog_url":
          data.site.baseBlogUrl = text;
          break;
      }
      if (currentItem) switch (tag) {
        case "title":
          currentItem.title = text;
          break;
        case "link":
          currentItem.link = text;
          break;
        case "pubdate":
          currentItem.pubDate = text;
          break;
        case "dc:creator":
          currentItem.creator = text;
          break;
        case "guid":
          currentItem.guid = text;
          break;
        case "description":
          currentItem.description = text;
          break;
        case "content:encoded":
          currentItem.content = text;
          break;
        case "excerpt:encoded":
          currentItem.excerpt = text;
          break;
        case "wp:post_id":
          currentItem.id = parseInt(text, 10);
          break;
        case "wp:post_date":
          currentItem.postDate = text;
          break;
        case "wp:post_date_gmt":
          currentItem.postDateGmt = text;
          break;
        case "wp:post_modified":
          currentItem.postModified = text;
          break;
        case "wp:post_modified_gmt":
          currentItem.postModifiedGmt = text;
          break;
        case "wp:comment_status":
          currentItem.commentStatus = text;
          break;
        case "wp:ping_status":
          currentItem.pingStatus = text;
          break;
        case "wp:post_name":
          currentItem.postName = text;
          break;
        case "wp:status":
          currentItem.status = text;
          break;
        case "wp:post_parent":
          currentItem.postParent = parseInt(text, 10);
          break;
        case "wp:menu_order":
          currentItem.menuOrder = parseInt(text, 10);
          break;
        case "wp:post_type":
          currentItem.postType = text;
          if (text === "attachment") currentAttachment = {
            id: currentItem.id,
            title: currentItem.title,
            url: currentItem.link,
            postDate: currentItem.postDate,
            meta: /* @__PURE__ */ new Map()
          };
          break;
        case "wp:post_password":
          currentItem.postPassword = text || void 0;
          break;
        case "wp:is_sticky":
          currentItem.isSticky = text === "1";
          break;
        case "wp:attachment_url":
          if (currentAttachment) currentAttachment.url = text;
          break;
        case "wp:meta_key":
          currentMetaKey = text;
          break;
        case "wp:meta_value":
          if (currentMetaKey && currentItem.meta) currentItem.meta.set(currentMetaKey, text);
          break;
        case "item":
          if (currentAttachment) {
            data.attachments.push(currentAttachment);
            currentAttachment = null;
          } else if (currentItem.postType === "nav_menu_item") {
            navMenuItemPosts.push(currentItem);
            data.posts.push(currentItem);
          } else if (currentItem.postType !== "attachment") data.posts.push(currentItem);
          currentItem = null;
          break;
      }
      if (currentCategory) switch (tag) {
        case "wp:term_id":
          currentCategory.id = parseInt(text, 10);
          break;
        case "wp:category_nicename":
          currentCategory.nicename = text;
          break;
        case "wp:cat_name":
          currentCategory.name = text;
          break;
        case "wp:category_parent":
          currentCategory.parent = text || void 0;
          break;
        case "wp:category_description":
          currentCategory.description = text || void 0;
          break;
        case "wp:category":
          if (currentCategory.name) data.categories.push(currentCategory);
          currentCategory = null;
          break;
      }
      if (currentTag) switch (tag) {
        case "wp:term_id":
          currentTag.id = parseInt(text, 10);
          break;
        case "wp:tag_slug":
          currentTag.slug = text;
          break;
        case "wp:tag_name":
          currentTag.name = text;
          break;
        case "wp:tag_description":
          currentTag.description = text || void 0;
          break;
        case "wp:tag":
          if (currentTag.name) data.tags.push(currentTag);
          currentTag = null;
          break;
      }
      if (currentAuthor) switch (tag) {
        case "wp:author_id":
          currentAuthor.id = parseInt(text, 10);
          break;
        case "wp:author_login":
          currentAuthor.login = text;
          break;
        case "wp:author_email":
          currentAuthor.email = text;
          break;
        case "wp:author_display_name":
          currentAuthor.displayName = text;
          break;
        case "wp:author_first_name":
          currentAuthor.firstName = text;
          break;
        case "wp:author_last_name":
          currentAuthor.lastName = text;
          break;
        case "wp:author":
          if (currentAuthor.login) data.authors.push(currentAuthor);
          currentAuthor = null;
          break;
      }
      if (currentTerm) switch (tag) {
        case "wp:term_id":
          currentTerm.id = parseInt(text, 10);
          break;
        case "wp:term_taxonomy":
          currentTerm.taxonomy = text;
          break;
        case "wp:term_slug":
          currentTerm.slug = text;
          break;
        case "wp:term_name":
          currentTerm.name = text;
          break;
        case "wp:term_parent":
          currentTerm.parent = text || void 0;
          break;
        case "wp:term_description":
          currentTerm.description = text || void 0;
          break;
        case "wp:term":
          if (isCompleteWxrTerm(currentTerm)) {
            data.terms.push(currentTerm);
            if (currentTerm.taxonomy === "nav_menu") menuTermsBySlug.set(currentTerm.slug, currentTerm.id);
          }
          currentTerm = null;
          break;
      }
      currentPath.pop();
      currentText = "";
    };
    parser.onerror = (err) => {
      reject(/* @__PURE__ */ new Error(`XML parsing error: ${err.message}`));
    };
    parser.onend = () => {
      data.navMenus = buildNavMenus(navMenuItemPosts, menuTermsBySlug);
      resolve(data);
    };
    parser.write(xml).close();
  });
}
function buildNavMenus(navMenuItemPosts, menuTermsBySlug) {
  const menuItemsByMenu = /* @__PURE__ */ new Map();
  for (const post of navMenuItemPosts) {
    const navMenuSlugs = post.customTaxonomies?.get("nav_menu");
    if (!navMenuSlugs || navMenuSlugs.length === 0) continue;
    const menuSlug = navMenuSlugs[0];
    if (!menuSlug) continue;
    const items = menuItemsByMenu.get(menuSlug) || [];
    items.push(post);
    menuItemsByMenu.set(menuSlug, items);
  }
  const menus = [];
  for (const [menuSlug, posts] of menuItemsByMenu) {
    const menuId = menuTermsBySlug.get(menuSlug) || 0;
    const items = posts.map((post) => {
      const meta = post.meta;
      const menuItemTypeRaw = meta.get("_menu_item_type") || "custom";
      const menuItemType2 = menuItemTypeRaw === "post_type" || menuItemTypeRaw === "taxonomy" ? menuItemTypeRaw : "custom";
      const objectType = meta.get("_menu_item_object");
      const objectIdStr = meta.get("_menu_item_object_id");
      const url = meta.get("_menu_item_url");
      const parentIdStr = meta.get("_menu_item_menu_item_parent");
      const target = meta.get("_menu_item_target");
      const classesStr = meta.get("_menu_item_classes");
      let classes;
      if (classesStr) {
        const matches = classesStr.match(PHP_SERIALIZED_STRING_PATTERN);
        if (matches) classes = matches.map((m2) => m2.match(PHP_SERIALIZED_STRING_MATCH_PATTERN)?.[1]).filter(Boolean).join(" ");
      }
      return {
        id: post.id || 0,
        menuId,
        parentId: parentIdStr ? parseInt(parentIdStr, 10) || void 0 : void 0,
        sortOrder: post.menuOrder || 0,
        type: menuItemType2,
        objectType: objectType || void 0,
        objectId: objectIdStr ? parseInt(objectIdStr, 10) : void 0,
        url: url || void 0,
        title: post.title || "",
        target: target || void 0,
        classes: classes || void 0
      };
    });
    items.sort((a, b2) => a.sortOrder - b2.sortOrder);
    menus.push({
      id: menuId,
      name: menuSlug,
      label: menuSlug,
      items
    });
  }
  return menus;
}
const SIMPLE_ID = /^[a-z0-9-]+$/;
const SCOPED_ID = /^@[a-z0-9-]+\/[a-z0-9-]+$/;
const SEMVER_PATTERN = /^\d+\.\d+\.\d+/;
function definePlugin(definition) {
  if (!("id" in definition) || !("version" in definition)) {
    if (!("hooks" in definition) && !("routes" in definition)) throw new Error("Standard plugin format requires at least `hooks` or `routes`. For native format, provide `id` and `version`.");
    return definition;
  }
  return defineNativePlugin(definition);
}
function defineNativePlugin(definition) {
  const { id, version, capabilities = [], allowedHosts = [], hooks = {}, routes = {}, admin = {} } = definition;
  const storage2 = definition.storage ?? {};
  if (!SIMPLE_ID.test(id) && !SCOPED_ID.test(id)) throw new Error(`Invalid plugin id "${id}". Must be lowercase alphanumeric with dashes (e.g., "my-plugin" or "@scope/my-plugin").`);
  if (!SEMVER_PATTERN.test(version)) throw new Error(`Invalid plugin version "${version}". Must be semver format (e.g., "1.0.0").`);
  const validCapabilities = /* @__PURE__ */ new Set([
    "network:fetch",
    "network:fetch:any",
    "read:content",
    "write:content",
    "read:media",
    "write:media",
    "read:users",
    "email:send",
    "email:provide",
    "email:intercept",
    "page:inject"
  ]);
  for (const cap of capabilities) if (!validCapabilities.has(cap)) throw new Error(`Invalid capability "${cap}" in plugin "${id}".`);
  const normalizedCapabilities = [...capabilities];
  if (capabilities.includes("write:content") && !capabilities.includes("read:content")) normalizedCapabilities.push("read:content");
  if (capabilities.includes("write:media") && !capabilities.includes("read:media")) normalizedCapabilities.push("read:media");
  if (capabilities.includes("network:fetch:any") && !capabilities.includes("network:fetch")) normalizedCapabilities.push("network:fetch");
  return {
    id,
    version,
    capabilities: normalizedCapabilities,
    allowedHosts,
    storage: storage2,
    hooks: resolveHooks(hooks, id),
    routes,
    admin
  };
}
function resolveHooks(hooks, pluginId) {
  const resolved = {};
  for (const key of Object.keys(hooks)) {
    const hook = hooks[key];
    if (hook) resolved[key] = resolveHook(hook, pluginId);
  }
  return resolved;
}
function isHookConfig(hook) {
  return typeof hook === "object" && hook !== null && "handler" in hook;
}
function resolveHook(hook, pluginId) {
  if (isHookConfig(hook)) {
    if (hook.exclusive !== void 0 && typeof hook.exclusive !== "boolean") throw new Error(`Invalid "exclusive" value in hook config for plugin "${pluginId}". Must be boolean.`);
    return {
      priority: hook.priority ?? 100,
      timeout: hook.timeout ?? 5e3,
      dependencies: hook.dependencies ?? [],
      errorPolicy: hook.errorPolicy ?? "abort",
      exclusive: hook.exclusive ?? false,
      handler: hook.handler,
      pluginId
    };
  }
  return {
    priority: 100,
    timeout: 5e3,
    dependencies: [],
    errorPolicy: "abort",
    exclusive: false,
    handler: hook,
    pluginId
  };
}
const IP_PATTERN = /^[\da-fA-F.:]+$/;
function parseFirstForwardedIp(header) {
  const trimmed = header.split(",")[0]?.trim();
  if (!trimmed) return null;
  return IP_PATTERN.test(trimmed) ? trimmed : null;
}
function getCfObject(request) {
  return request.cf;
}
function extractGeo(cf) {
  if (!cf) return null;
  const country = cf.country ?? null;
  const region = cf.region ?? null;
  const city = cf.city ?? null;
  if (country === null && region === null && city === null) return null;
  return {
    country,
    region,
    city
  };
}
function extractRequestMeta(request) {
  const headers = request.headers;
  const cf = getCfObject(request);
  let ip = null;
  if (cf) {
    const cfIp = headers.get("cf-connecting-ip")?.trim();
    if (cfIp && IP_PATTERN.test(cfIp)) ip = cfIp;
  }
  if (!ip && cf) {
    const xff = headers.get("x-forwarded-for");
    ip = xff ? parseFirstForwardedIp(xff) : null;
  }
  const userAgent = headers.get("user-agent")?.trim() || null;
  const referer = headers.get("referer")?.trim() || null;
  const geo = extractGeo(cf);
  return {
    ip,
    userAgent,
    referer,
    geo
  };
}
const SANDBOX_STRIPPED_HEADERS = /* @__PURE__ */ new Set([
  "cookie",
  "set-cookie",
  "authorization",
  "proxy-authorization",
  "cf-access-jwt-assertion",
  "cf-access-client-id",
  "cf-access-client-secret",
  "x-emdash-request"
]);
function sanitizeHeadersForSandbox(headers) {
  const safe = {};
  headers.forEach((value, key) => {
    if (!SANDBOX_STRIPPED_HEADERS.has(key)) safe[key] = value;
  });
  return safe;
}
const STALE_LOCK_MINUTES = 10;
var CronExecutor = class {
  constructor(db, invokeCronHook) {
    this.db = db;
    this.invokeCronHook = invokeCronHook;
  }
  /**
  * Process all overdue tasks.
  *
  * 1. Atomically claim tasks whose next_run_at <= now, status = idle, enabled = 1.
  * 2. For each claimed task, invoke the plugin's cron hook.
  * 3. On success: compute next_run_at and reset to idle, or delete one-shots.
  * 4. On failure: reset to idle (retry on next tick).
  */
  async tick() {
    const now = (/* @__PURE__ */ new Date()).toISOString();
    let processed = 0;
    const claimed = await sql`
			UPDATE _emdash_cron_tasks
			SET status = 'running', locked_at = ${now}
			WHERE id IN (
				SELECT id FROM _emdash_cron_tasks
				WHERE next_run_at <= ${now}
				  AND status = 'idle'
				  AND enabled = 1
				ORDER BY next_run_at ASC
				LIMIT 10
			)
			RETURNING id, plugin_id, task_name, schedule, is_oneshot, data, next_run_at
		`.execute(this.db);
    for (const task of claimed.rows) {
      let parsedData;
      if (task.data) try {
        parsedData = JSON.parse(task.data);
      } catch {
        console.error(`[cron] Invalid JSON data for ${task.plugin_id}:${task.task_name}, skipping`);
        await sql`
						UPDATE _emdash_cron_tasks
						SET status = 'idle', locked_at = NULL
						WHERE id = ${task.id}
					`.execute(this.db);
        continue;
      }
      const event = {
        name: task.task_name,
        data: parsedData,
        scheduledAt: task.next_run_at
      };
      let hookFailed = false;
      try {
        await this.invokeCronHook(task.plugin_id, event);
      } catch (error) {
        hookFailed = true;
        console.error(`[cron] Hook failed for ${task.plugin_id}:${task.task_name}:`, error);
      }
      if (task.is_oneshot) if (hookFailed) await sql`
						UPDATE _emdash_cron_tasks
						SET status = 'idle', locked_at = NULL, next_run_at = ${new Date(Date.now() + 6e4).toISOString()}
						WHERE id = ${task.id}
					`.execute(this.db);
      else await sql`
						DELETE FROM _emdash_cron_tasks WHERE id = ${task.id}
					`.execute(this.db);
      else await sql`
					UPDATE _emdash_cron_tasks
					SET status = 'idle',
						locked_at = NULL,
						last_run_at = ${now},
						next_run_at = ${nextCronTime(task.schedule)}
					WHERE id = ${task.id}
				`.execute(this.db);
      processed++;
    }
    return processed;
  }
  /**
  * Recover tasks stuck in 'running' for more than STALE_LOCK_MINUTES.
  * These likely crashed mid-execution.
  */
  async recoverStaleLocks() {
    const result = await sql`
			UPDATE _emdash_cron_tasks
			SET status = 'idle', locked_at = NULL
			WHERE status = 'running'
			  AND locked_at < ${(/* @__PURE__ */ new Date(Date.now() - STALE_LOCK_MINUTES * 60 * 1e3)).toISOString()}
		`.execute(this.db);
    return Number(result.numAffectedRows ?? 0);
  }
  /**
  * Get the next due time across all enabled tasks.
  * Returns null if no tasks are scheduled.
  */
  async getNextDueTime() {
    return (await sql`
			SELECT MIN(next_run_at) as next
			FROM _emdash_cron_tasks
			WHERE status = 'idle' AND enabled = 1
		`.execute(this.db)).rows[0]?.next ?? null;
  }
};
var CronAccessImpl = class {
  constructor(db, pluginId, reschedule) {
    this.db = db;
    this.pluginId = pluginId;
    this.reschedule = reschedule;
  }
  async schedule(name, opts) {
    validateTaskName(name);
    validateSchedule(opts.schedule);
    const oneshot = isOneShot(opts.schedule);
    const nextRun = oneshot ? opts.schedule : nextCronTime(opts.schedule);
    const dataJson = opts.data ? JSON.stringify(opts.data) : null;
    await sql`
			INSERT INTO _emdash_cron_tasks (id, plugin_id, task_name, schedule, is_oneshot, data, next_run_at, status, enabled)
			VALUES (${ulid()}, ${this.pluginId}, ${name}, ${opts.schedule}, ${oneshot ? 1 : 0}, ${dataJson}, ${nextRun}, 'idle', 1)
			ON CONFLICT (plugin_id, task_name) DO UPDATE SET
				schedule = ${opts.schedule},
				is_oneshot = ${oneshot ? 1 : 0},
				data = ${dataJson},
				next_run_at = ${nextRun},
				status = CASE WHEN _emdash_cron_tasks.status = 'running' THEN 'running' ELSE 'idle' END,
				locked_at = CASE WHEN _emdash_cron_tasks.status = 'running' THEN _emdash_cron_tasks.locked_at ELSE NULL END,
				enabled = 1
		`.execute(this.db);
    this.reschedule();
  }
  async cancel(name) {
    await sql`
			DELETE FROM _emdash_cron_tasks
			WHERE plugin_id = ${this.pluginId} AND task_name = ${name}
		`.execute(this.db);
    this.reschedule();
  }
  async list() {
    return (await sql`
			SELECT task_name, schedule, next_run_at, last_run_at
			FROM _emdash_cron_tasks
			WHERE plugin_id = ${this.pluginId} AND enabled = 1
			ORDER BY next_run_at ASC
		`.execute(this.db)).rows.map((row) => ({
      name: row.task_name,
      schedule: row.schedule,
      nextRunAt: row.next_run_at,
      lastRunAt: row.last_run_at
    }));
  }
};
function nextCronTime(expression) {
  const next = new E(expression).nextRun();
  if (!next) throw new Error(`Invalid cron expression or no future run: "${expression}"`);
  return next.toISOString();
}
function isCronExpression(schedule) {
  try {
    new E(schedule);
    return true;
  } catch {
    return false;
  }
}
function isOneShot(schedule) {
  if (schedule.startsWith("@")) return false;
  if (isCronExpression(schedule)) return false;
  return !isNaN(Date.parse(schedule));
}
const MAX_TASK_NAME_LENGTH = 128;
const TASK_NAME_RE = /^[a-zA-Z][a-zA-Z0-9_-]*$/;
function validateTaskName(name) {
  if (!name || name.length > MAX_TASK_NAME_LENGTH) throw new Error(`Invalid task name: must be 1-${MAX_TASK_NAME_LENGTH} characters, got ${name.length}`);
  if (!TASK_NAME_RE.test(name)) throw new Error(`Invalid task name "${name}": must start with a letter and contain only letters, numbers, dashes, or underscores`);
}
function validateSchedule(schedule) {
  if (!schedule || schedule.length > 256) throw new Error(`Invalid schedule: must be 1-256 characters, got ${schedule.length}`);
  if (isCronExpression(schedule)) return;
  const parsed = Date.parse(schedule);
  if (isNaN(parsed)) throw new Error(`Invalid schedule "${schedule}": must be a valid cron expression or ISO 8601 datetime`);
}
function createKVAccess(optionsRepo, pluginId) {
  const prefix = `plugin:${pluginId}:`;
  return {
    async get(key) {
      return optionsRepo.get(`${prefix}${key}`);
    },
    async set(key, value) {
      await optionsRepo.set(`${prefix}${key}`, value);
    },
    async delete(key) {
      return optionsRepo.delete(`${prefix}${key}`);
    },
    async list(keyPrefix) {
      const fullPrefix = `${prefix}${keyPrefix ?? ""}`;
      const entriesMap = await optionsRepo.getByPrefix(fullPrefix);
      const result = [];
      for (const [fullKey, value] of entriesMap) result.push({
        key: fullKey.slice(prefix.length),
        value
      });
      return result;
    }
  };
}
function createStorageCollection(db, pluginId, collectionName, indexes) {
  const repo = new PluginStorageRepository(db, pluginId, collectionName, indexes);
  return {
    get: (id) => repo.get(id),
    put: (id, data) => repo.put(id, data),
    delete: (id) => repo.delete(id),
    exists: (id) => repo.exists(id),
    getMany: (ids) => repo.getMany(ids),
    putMany: (items) => repo.putMany(items),
    deleteMany: (ids) => repo.deleteMany(ids),
    count: (where) => repo.count(where),
    async query(options) {
      const result = await repo.query({
        where: options?.where,
        orderBy: options?.orderBy,
        limit: options?.limit,
        cursor: options?.cursor
      });
      return {
        items: result.items,
        cursor: result.cursor,
        hasMore: result.hasMore
      };
    }
  };
}
function createStorageAccess(db, pluginId, storageConfig) {
  const storage2 = {};
  for (const [collectionName, config] of Object.entries(storageConfig)) storage2[collectionName] = createStorageCollection(db, pluginId, collectionName, [...config.indexes, ...config.uniqueIndexes ?? []]);
  return storage2;
}
function createContentAccess(db) {
  const contentRepo = new ContentRepository(db);
  return {
    async get(collection, id) {
      const item = await contentRepo.findById(collection, id);
      if (!item) return null;
      return {
        id: item.id,
        type: item.type,
        data: item.data,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
      };
    },
    async list(collection, options) {
      let orderBy;
      if (options?.orderBy) {
        const first = Object.entries(options.orderBy)[0];
        if (first) orderBy = {
          field: first[0],
          direction: first[1]
        };
      }
      const result = await contentRepo.findMany(collection, {
        limit: options?.limit ?? 50,
        cursor: options?.cursor,
        orderBy
      });
      return {
        items: result.items.map((item) => ({
          id: item.id,
          type: item.type,
          data: item.data,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt
        })),
        cursor: result.nextCursor,
        hasMore: !!result.nextCursor
      };
    }
  };
}
function createContentAccessWithWrite(db) {
  const contentRepo = new ContentRepository(db);
  return {
    ...createContentAccess(db),
    async create(collection, data) {
      const item = await contentRepo.create({
        type: collection,
        data
      });
      return {
        id: item.id,
        type: item.type,
        data: item.data,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
      };
    },
    async update(collection, id, data) {
      const item = await contentRepo.update(collection, id, { data });
      return {
        id: item.id,
        type: item.type,
        data: item.data,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
      };
    },
    async delete(collection, id) {
      return contentRepo.delete(collection, id);
    }
  };
}
function createMediaAccess(db) {
  const mediaRepo = new MediaRepository(db);
  return {
    async get(id) {
      const item = await mediaRepo.findById(id);
      if (!item) return null;
      return {
        id: item.id,
        filename: item.filename,
        mimeType: item.mimeType,
        size: item.size,
        url: `/media/${item.id}/${item.filename}`,
        createdAt: item.createdAt
      };
    },
    async list(options) {
      const result = await mediaRepo.findMany({
        limit: options?.limit ?? 50,
        cursor: options?.cursor,
        mimeType: options?.mimeType
      });
      return {
        items: result.items.map((item) => ({
          id: item.id,
          filename: item.filename,
          mimeType: item.mimeType,
          size: item.size,
          url: `/media/${item.id}/${item.filename}`,
          createdAt: item.createdAt
        })),
        cursor: result.nextCursor,
        hasMore: !!result.nextCursor
      };
    }
  };
}
function createMediaAccessWithWrite(db, getUploadUrlFn, storage2) {
  const mediaRepo = new MediaRepository(db);
  return {
    ...createMediaAccess(db),
    getUploadUrl: getUploadUrlFn,
    async upload(filename, contentType, bytes) {
      if (!storage2) throw new Error("Media upload() requires a storage backend. Configure storage in PluginContextFactoryOptions.");
      const mediaId = ulid();
      const basename = filename.split("/").pop() ?? filename;
      const dotIdx = basename.lastIndexOf(".");
      const storageKey = `${mediaId}${dotIdx > 0 ? basename.slice(dotIdx).toLowerCase() : ""}`;
      await storage2.upload({
        key: storageKey,
        body: new Uint8Array(bytes),
        contentType
      });
      try {
        await mediaRepo.create({
          filename: basename,
          mimeType: contentType,
          size: bytes.byteLength,
          storageKey,
          status: "ready"
        });
      } catch (error) {
        try {
          await storage2.delete(storageKey);
        } catch {
        }
        throw error;
      }
      return {
        mediaId,
        storageKey,
        url: `/_emdash/api/media/file/${storageKey}`
      };
    },
    async delete(id) {
      return mediaRepo.delete(id);
    }
  };
}
const MAX_PLUGIN_REDIRECTS = 5;
function isHostAllowed(host, allowedHosts) {
  return allowedHosts.some((pattern) => {
    if (pattern.startsWith("*.")) {
      const suffix = pattern.slice(1);
      return host.endsWith(suffix) || host === pattern.slice(2);
    }
    return host === pattern;
  });
}
function createHttpAccess(pluginId, allowedHosts) {
  return { async fetch(url, init) {
    if (allowedHosts.length === 0) throw new Error(`Plugin "${pluginId}" has no allowed hosts configured. Add hosts to the plugin's allowedHosts array to enable HTTP requests.`);
    let currentUrl = url;
    let currentInit = init;
    for (let i = 0; i <= MAX_PLUGIN_REDIRECTS; i++) {
      const hostname = new URL(currentUrl).hostname;
      if (!isHostAllowed(hostname, allowedHosts)) throw new Error(`Plugin "${pluginId}" is not allowed to fetch from host "${hostname}". Allowed hosts: ${allowedHosts.join(", ")}`);
      const response = await globalThis.fetch(currentUrl, {
        ...currentInit,
        redirect: "manual"
      });
      if (response.status < 300 || response.status >= 400) return response;
      const location = response.headers.get("Location");
      if (!location) return response;
      const previousOrigin = new URL(currentUrl).origin;
      currentUrl = new URL(location, currentUrl).href;
      if (previousOrigin !== new URL(currentUrl).origin && currentInit) currentInit = stripCredentialHeaders(currentInit);
    }
    throw new Error(`Plugin "${pluginId}": too many redirects (max ${MAX_PLUGIN_REDIRECTS})`);
  } };
}
function createUnrestrictedHttpAccess(pluginId) {
  return { async fetch(url, init) {
    let currentUrl = url;
    let currentInit = init;
    for (let i = 0; i <= MAX_PLUGIN_REDIRECTS; i++) {
      try {
        validateExternalUrl(currentUrl);
      } catch (e) {
        const msg = e instanceof SsrfError ? e.message : "SSRF validation failed";
        throw new Error(`Plugin "${pluginId}": blocked fetch to "${new URL(currentUrl).hostname}": ${msg}`, { cause: e });
      }
      const response = await globalThis.fetch(currentUrl, {
        ...currentInit,
        redirect: "manual"
      });
      if (response.status < 300 || response.status >= 400) return response;
      const location = response.headers.get("Location");
      if (!location) return response;
      const previousOrigin = new URL(currentUrl).origin;
      currentUrl = new URL(location, currentUrl).href;
      if (previousOrigin !== new URL(currentUrl).origin && currentInit) currentInit = stripCredentialHeaders(currentInit);
    }
    throw new Error(`Plugin "${pluginId}": too many redirects (max ${MAX_PLUGIN_REDIRECTS})`);
  } };
}
function createLogAccess(pluginId) {
  const prefix = `[plugin:${pluginId}]`;
  return {
    debug(message, data) {
      if (data !== void 0) console.debug(prefix, message, data);
      else console.debug(prefix, message);
    },
    info(message, data) {
      if (data !== void 0) console.info(prefix, message, data);
      else console.info(prefix, message);
    },
    warn(message, data) {
      if (data !== void 0) console.warn(prefix, message, data);
      else console.warn(prefix, message);
    },
    error(message, data) {
      if (data !== void 0) console.error(prefix, message, data);
      else console.error(prefix, message);
    }
  };
}
const TRAILING_SLASH_RE = /\/$/;
function createSiteInfo(options) {
  return {
    name: options.siteName ?? "",
    url: (options.siteUrl ?? "").replace(TRAILING_SLASH_RE, ""),
    locale: options.locale ?? "en"
  };
}
function createUrlHelper(siteUrl) {
  const base = siteUrl.replace(TRAILING_SLASH_RE, "");
  return (path) => {
    if (!path.startsWith("/")) throw new Error(`URL path must start with "/", got: "${path}"`);
    if (path.startsWith("//")) throw new Error(`URL path must not be protocol-relative, got: "${path}"`);
    return `${base}${path}`;
  };
}
function toUserInfo(user) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    createdAt: user.createdAt
  };
}
function createUserAccess(db) {
  const userRepo = new UserRepository(db);
  return {
    async get(id) {
      const user = await userRepo.findById(id);
      if (!user) return null;
      return toUserInfo(user);
    },
    async getByEmail(email) {
      const user = await userRepo.findByEmail(email);
      if (!user) return null;
      return toUserInfo(user);
    },
    async list(opts) {
      const result = await userRepo.findMany({
        role: opts?.role,
        cursor: opts?.cursor,
        limit: opts?.limit
      });
      return {
        items: result.items.map(toUserInfo),
        nextCursor: result.nextCursor
      };
    }
  };
}
var PluginContextFactory = class {
  optionsRepo;
  db;
  storage;
  getUploadUrl;
  site;
  urlHelper;
  cronReschedule;
  emailPipeline;
  constructor(options) {
    this.db = options.db;
    this.optionsRepo = new OptionsRepository(options.db);
    this.storage = options.storage;
    this.getUploadUrl = options.getUploadUrl;
    this.site = createSiteInfo(options.siteInfo ?? {});
    this.urlHelper = createUrlHelper(this.site.url);
    this.cronReschedule = options.cronReschedule;
    this.emailPipeline = options.emailPipeline;
  }
  /**
  * Create the unified plugin context
  */
  createContext(plugin) {
    const capabilities = new Set(plugin.capabilities);
    const kv = createKVAccess(this.optionsRepo, plugin.id);
    const log = createLogAccess(plugin.id);
    const storage2 = createStorageAccess(this.db, plugin.id, plugin.storage);
    let content;
    if (capabilities.has("write:content")) content = createContentAccessWithWrite(this.db);
    else if (capabilities.has("read:content")) content = createContentAccess(this.db);
    let media;
    if (capabilities.has("write:media") && this.getUploadUrl) media = createMediaAccessWithWrite(this.db, this.getUploadUrl, this.storage);
    else if (capabilities.has("read:media")) media = createMediaAccess(this.db);
    let http;
    if (capabilities.has("network:fetch:any")) http = createUnrestrictedHttpAccess(plugin.id);
    else if (capabilities.has("network:fetch")) http = createHttpAccess(plugin.id, plugin.allowedHosts);
    let users;
    if (capabilities.has("read:users")) users = createUserAccess(this.db);
    let cron;
    if (this.cronReschedule) cron = new CronAccessImpl(this.db, plugin.id, this.cronReschedule);
    let email;
    if (capabilities.has("email:send") && this.emailPipeline?.isAvailable()) {
      const pipeline = this.emailPipeline;
      const pluginId = plugin.id;
      email = { send: (message) => pipeline.send(message, pluginId) };
    }
    return {
      plugin: {
        id: plugin.id,
        version: plugin.version
      },
      storage: storage2,
      kv,
      content,
      media,
      http,
      log,
      site: this.site,
      url: this.urlHelper,
      users,
      cron,
      email
    };
  }
};
var HookPipeline = class HookPipeline2 {
  hooks = /* @__PURE__ */ new Map();
  pluginMap = /* @__PURE__ */ new Map();
  contextFactory = null;
  /** Stored so setContextFactory can merge incrementally. */
  contextFactoryOptions = {};
  /** Hook names where at least one handler declared exclusive: true */
  exclusiveHookNames = /* @__PURE__ */ new Set();
  /**
  * Selected provider plugin ID for each exclusive hook.
  * Set by the PluginManager after resolution.
  */
  exclusiveSelections = /* @__PURE__ */ new Map();
  constructor(plugins, factoryOptions) {
    if (factoryOptions) {
      this.contextFactory = new PluginContextFactory(factoryOptions);
      this.contextFactoryOptions = { ...factoryOptions };
    }
    for (const plugin of plugins) this.pluginMap.set(plugin.id, plugin);
    this.registerPlugins(plugins);
  }
  /**
  * Set or update the context factory options.
  *
  * When called on a pipeline that already has a factory, the new options
  * are merged on top of the existing ones so that callers don't need to
  * repeat every field (e.g. adding `cronReschedule` without losing
  * `storage` / `getUploadUrl`).
  */
  setContextFactory(options) {
    const merged = {
      ...this.contextFactoryOptions,
      ...options
    };
    this.contextFactory = new PluginContextFactory(merged);
    this.contextFactoryOptions = merged;
  }
  /**
  * Get context for a plugin
  */
  getContext(pluginId) {
    const plugin = this.pluginMap.get(pluginId);
    if (!plugin) throw new Error(`Plugin "${pluginId}" not found`);
    if (!this.contextFactory) throw new Error("Context factory not initialized - call setContextFactory first");
    return this.contextFactory.createContext(plugin);
  }
  /**
  * Get typed hooks for a specific hook name.
  * The internal map stores ResolvedHook<unknown>, but we know each name
  * maps to a specific handler type via HookHandlerMap.
  *
  * Exclusive hooks that have a selected provider are filtered out — they
  * should only run via invokeExclusiveHook(), not in the regular pipeline.
  */
  getTypedHooks(name) {
    const all = this.hooks.get(name) ?? [];
    if (this.exclusiveSelections.has(name)) return all.filter((h) => !h.exclusive);
    return all;
  }
  /**
  * Register all hooks from plugins.
  *
  * Registers each hook name individually to preserve type safety. The
  * internal map stores ResolvedHook<unknown> since it's keyed by string,
  * but getTypedHooks() restores the correct handler type on retrieval.
  */
  registerPlugins(plugins) {
    for (const plugin of plugins) {
      this.registerPluginHook(plugin, "plugin:install");
      this.registerPluginHook(plugin, "plugin:activate");
      this.registerPluginHook(plugin, "plugin:deactivate");
      this.registerPluginHook(plugin, "plugin:uninstall");
      this.registerPluginHook(plugin, "content:beforeSave");
      this.registerPluginHook(plugin, "content:afterSave");
      this.registerPluginHook(plugin, "content:beforeDelete");
      this.registerPluginHook(plugin, "content:afterDelete");
      this.registerPluginHook(plugin, "media:beforeUpload");
      this.registerPluginHook(plugin, "media:afterUpload");
      this.registerPluginHook(plugin, "cron");
      this.registerPluginHook(plugin, "email:beforeSend");
      this.registerPluginHook(plugin, "email:deliver");
      this.registerPluginHook(plugin, "email:afterSend");
      this.registerPluginHook(plugin, "comment:beforeCreate");
      this.registerPluginHook(plugin, "comment:moderate");
      this.registerPluginHook(plugin, "comment:afterCreate");
      this.registerPluginHook(plugin, "comment:afterModerate");
      this.registerPluginHook(plugin, "page:metadata");
      this.registerPluginHook(plugin, "page:fragments");
    }
    for (const [hookName, hooks] of this.hooks) this.hooks.set(hookName, this.sortHooks(hooks));
  }
  /**
  * Maps hook names to the capability required to register them.
  *
  * Hooks not listed here have no capability requirement (e.g. lifecycle
  * hooks, cron). Any plugin declaring a listed hook without the required
  * capability will have that hook silently skipped at registration time.
  */
  static HOOK_REQUIRED_CAPABILITY = /* @__PURE__ */ new Map([
    ["email:beforeSend", "email:intercept"],
    ["email:afterSend", "email:intercept"],
    ["email:deliver", "email:provide"],
    ["content:beforeSave", "write:content"],
    ["content:afterSave", "read:content"],
    ["content:beforeDelete", "read:content"],
    ["content:afterDelete", "read:content"],
    ["media:beforeUpload", "write:media"],
    ["media:afterUpload", "read:media"],
    ["comment:beforeCreate", "read:users"],
    ["comment:moderate", "read:users"],
    ["comment:afterCreate", "read:users"],
    ["comment:afterModerate", "read:users"],
    ["page:fragments", "page:inject"]
  ]);
  /**
  * Register a single plugin's hook by name
  */
  registerPluginHook(plugin, name) {
    const hook = plugin.hooks[name];
    if (!hook) return;
    const requiredCapability = HookPipeline2.HOOK_REQUIRED_CAPABILITY.get(name);
    if (requiredCapability && !plugin.capabilities.includes(requiredCapability)) {
      console.warn(`[hooks] Plugin "${plugin.id}" declares ${name} hook without ${requiredCapability} capability — skipping`);
      return;
    }
    if (hook.exclusive) this.exclusiveHookNames.add(name);
    this.registerHook(name, hook);
  }
  /**
  * Register a single hook
  */
  registerHook(name, hook) {
    const existing = this.hooks.get(name) || [];
    existing.push(hook);
    this.hooks.set(name, existing);
  }
  /**
  * Sort hooks by priority and dependencies
  */
  sortHooks(hooks) {
    const sorted = [];
    const remaining = [...hooks];
    while (remaining.length > 0) {
      const ready = remaining.filter((hook) => hook.dependencies.every((dep) => sorted.some((s2) => s2.pluginId === dep)));
      if (ready.length === 0) {
        remaining.sort((a, b2) => a.priority - b2.priority);
        sorted.push(...remaining);
        break;
      }
      ready.sort((a, b2) => a.priority - b2.priority);
      const next = ready[0];
      sorted.push(next);
      remaining.splice(remaining.indexOf(next), 1);
    }
    return sorted;
  }
  /**
  * Execute a hook with timeout
  */
  async executeWithTimeout(fn, timeout) {
    return Promise.race([fn(), new Promise((_2, reject) => setTimeout(() => reject(/* @__PURE__ */ new Error(`Hook timeout after ${timeout}ms`)), timeout))]);
  }
  /**
  * Run plugin:install hooks
  */
  async runPluginInstall(pluginId) {
    return this.runLifecycleHook("plugin:install", pluginId);
  }
  /**
  * Run plugin:activate hooks
  */
  async runPluginActivate(pluginId) {
    return this.runLifecycleHook("plugin:activate", pluginId);
  }
  /**
  * Run plugin:deactivate hooks
  */
  async runPluginDeactivate(pluginId) {
    return this.runLifecycleHook("plugin:deactivate", pluginId);
  }
  /**
  * Run plugin:uninstall hooks
  */
  async runPluginUninstall(pluginId, deleteData) {
    const hooks = this.getTypedHooks("plugin:uninstall");
    const results = [];
    const hook = hooks.find((h) => h.pluginId === pluginId);
    if (!hook) return results;
    const { handler } = hook;
    const event = { deleteData };
    const ctx = this.getContext(pluginId);
    const start = Date.now();
    try {
      await this.executeWithTimeout(() => handler(event, ctx), hook.timeout);
      results.push({
        success: true,
        pluginId: hook.pluginId,
        duration: Date.now() - start
      });
    } catch (error) {
      results.push({
        success: false,
        error: error instanceof Error ? error : new Error(String(error)),
        pluginId: hook.pluginId,
        duration: Date.now() - start
      });
    }
    return results;
  }
  async runLifecycleHook(hookName, pluginId) {
    const hooks = this.getTypedHooks(hookName);
    const results = [];
    const hook = hooks.find((h) => h.pluginId === pluginId);
    if (!hook) return results;
    const { handler } = hook;
    const event = {};
    const ctx = this.getContext(pluginId);
    const start = Date.now();
    try {
      await this.executeWithTimeout(() => handler(event, ctx), hook.timeout);
      results.push({
        success: true,
        pluginId: hook.pluginId,
        duration: Date.now() - start
      });
    } catch (error) {
      results.push({
        success: false,
        error: error instanceof Error ? error : new Error(String(error)),
        pluginId: hook.pluginId,
        duration: Date.now() - start
      });
    }
    return results;
  }
  /**
  * Run content:beforeSave hooks
  * Returns modified content from the pipeline
  */
  async runContentBeforeSave(content, collection, isNew) {
    const hooks = this.getTypedHooks("content:beforeSave");
    const results = [];
    let currentContent = content;
    for (const hook of hooks) {
      const { handler } = hook;
      const event = {
        content: currentContent,
        collection,
        isNew
      };
      const ctx = this.getContext(hook.pluginId);
      const start = Date.now();
      try {
        const result = await this.executeWithTimeout(() => handler(event, ctx), hook.timeout);
        if (result !== void 0) currentContent = result;
        results.push({
          success: true,
          value: currentContent,
          pluginId: hook.pluginId,
          duration: Date.now() - start
        });
      } catch (error) {
        results.push({
          success: false,
          error: error instanceof Error ? error : new Error(String(error)),
          pluginId: hook.pluginId,
          duration: Date.now() - start
        });
        if (hook.errorPolicy === "abort") throw error;
      }
    }
    return {
      content: currentContent,
      results
    };
  }
  /**
  * Run content:afterSave hooks
  */
  async runContentAfterSave(content, collection, isNew) {
    const hooks = this.getTypedHooks("content:afterSave");
    const results = [];
    for (const hook of hooks) {
      const { handler } = hook;
      const event = {
        content,
        collection,
        isNew
      };
      const ctx = this.getContext(hook.pluginId);
      const start = Date.now();
      try {
        await this.executeWithTimeout(() => handler(event, ctx), hook.timeout);
        results.push({
          success: true,
          pluginId: hook.pluginId,
          duration: Date.now() - start
        });
      } catch (error) {
        results.push({
          success: false,
          error: error instanceof Error ? error : new Error(String(error)),
          pluginId: hook.pluginId,
          duration: Date.now() - start
        });
        if (hook.errorPolicy === "abort") throw error;
      }
    }
    return results;
  }
  /**
  * Run content:beforeDelete hooks
  * Returns whether deletion is allowed
  */
  async runContentBeforeDelete(id, collection) {
    const hooks = this.getTypedHooks("content:beforeDelete");
    const results = [];
    let allowed = true;
    for (const hook of hooks) {
      const { handler } = hook;
      const event = {
        id,
        collection
      };
      const ctx = this.getContext(hook.pluginId);
      const start = Date.now();
      try {
        const result = await this.executeWithTimeout(() => handler(event, ctx), hook.timeout);
        if (result === false) allowed = false;
        results.push({
          success: true,
          value: result !== false,
          pluginId: hook.pluginId,
          duration: Date.now() - start
        });
      } catch (error) {
        results.push({
          success: false,
          error: error instanceof Error ? error : new Error(String(error)),
          pluginId: hook.pluginId,
          duration: Date.now() - start
        });
        if (hook.errorPolicy === "abort") throw error;
      }
    }
    return {
      allowed,
      results
    };
  }
  /**
  * Run content:afterDelete hooks
  */
  async runContentAfterDelete(id, collection) {
    const hooks = this.getTypedHooks("content:afterDelete");
    const results = [];
    for (const hook of hooks) {
      const { handler } = hook;
      const event = {
        id,
        collection
      };
      const ctx = this.getContext(hook.pluginId);
      const start = Date.now();
      try {
        await this.executeWithTimeout(() => handler(event, ctx), hook.timeout);
        results.push({
          success: true,
          pluginId: hook.pluginId,
          duration: Date.now() - start
        });
      } catch (error) {
        results.push({
          success: false,
          error: error instanceof Error ? error : new Error(String(error)),
          pluginId: hook.pluginId,
          duration: Date.now() - start
        });
        if (hook.errorPolicy === "abort") throw error;
      }
    }
    return results;
  }
  /**
  * Run media:beforeUpload hooks
  */
  async runMediaBeforeUpload(file) {
    const hooks = this.getTypedHooks("media:beforeUpload");
    const results = [];
    let currentFile = file;
    for (const hook of hooks) {
      const { handler } = hook;
      const event = { file: currentFile };
      const ctx = this.getContext(hook.pluginId);
      const start = Date.now();
      try {
        const result = await this.executeWithTimeout(() => handler(event, ctx), hook.timeout);
        if (result !== void 0) currentFile = result;
        results.push({
          success: true,
          value: currentFile,
          pluginId: hook.pluginId,
          duration: Date.now() - start
        });
      } catch (error) {
        results.push({
          success: false,
          error: error instanceof Error ? error : new Error(String(error)),
          pluginId: hook.pluginId,
          duration: Date.now() - start
        });
        if (hook.errorPolicy === "abort") throw error;
      }
    }
    return {
      file: currentFile,
      results
    };
  }
  /**
  * Run media:afterUpload hooks
  */
  async runMediaAfterUpload(media) {
    const hooks = this.getTypedHooks("media:afterUpload");
    const results = [];
    for (const hook of hooks) {
      const { handler } = hook;
      const event = { media };
      const ctx = this.getContext(hook.pluginId);
      const start = Date.now();
      try {
        await this.executeWithTimeout(() => handler(event, ctx), hook.timeout);
        results.push({
          success: true,
          pluginId: hook.pluginId,
          duration: Date.now() - start
        });
      } catch (error) {
        results.push({
          success: false,
          error: error instanceof Error ? error : new Error(String(error)),
          pluginId: hook.pluginId,
          duration: Date.now() - start
        });
        if (hook.errorPolicy === "abort") throw error;
      }
    }
    return results;
  }
  /**
  * Invoke the cron hook for a specific plugin.
  *
  * Unlike other hooks which broadcast to all plugins, the cron hook is
  * dispatched only to the target plugin — the one that owns the task.
  */
  async invokeCronHook(pluginId, event) {
    const hook = this.getTypedHooks("cron").find((h) => h.pluginId === pluginId);
    if (!hook) return {
      success: false,
      error: /* @__PURE__ */ new Error(`Plugin "${pluginId}" has no cron hook registered`),
      pluginId,
      duration: 0
    };
    const { handler } = hook;
    const ctx = this.getContext(pluginId);
    const start = Date.now();
    try {
      await this.executeWithTimeout(() => handler(event, ctx), hook.timeout);
      return {
        success: true,
        pluginId,
        duration: Date.now() - start
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error(String(error)),
        pluginId,
        duration: Date.now() - start
      };
    }
  }
  /**
  * Run email:beforeSend hooks (middleware pipeline).
  *
  * Each handler receives the message and returns a modified message or
  * `false` to cancel delivery. The pipeline chains message transformations —
  * each handler receives the output of the previous one.
  */
  async runEmailBeforeSend(message, source) {
    const hooks = this.getTypedHooks("email:beforeSend");
    const results = [];
    let currentMessage = message;
    for (const hook of hooks) {
      const { handler } = hook;
      const event = {
        message: { ...currentMessage },
        source
      };
      const ctx = this.getContext(hook.pluginId);
      const start = Date.now();
      try {
        const result = await this.executeWithTimeout(() => handler(event, ctx), hook.timeout);
        if (result === false) {
          results.push({
            success: true,
            value: false,
            pluginId: hook.pluginId,
            duration: Date.now() - start
          });
          return {
            message: false,
            results
          };
        }
        if (result && typeof result === "object") currentMessage = result;
        results.push({
          success: true,
          value: currentMessage,
          pluginId: hook.pluginId,
          duration: Date.now() - start
        });
      } catch (error) {
        results.push({
          success: false,
          error: error instanceof Error ? error : new Error(String(error)),
          pluginId: hook.pluginId,
          duration: Date.now() - start
        });
        if (hook.errorPolicy === "abort") throw error;
      }
    }
    return {
      message: currentMessage,
      results
    };
  }
  /**
  * Run email:afterSend hooks (fire-and-forget).
  *
  * Errors are logged but don't propagate — they don't affect the caller.
  */
  async runEmailAfterSend(message, source) {
    const hooks = this.getTypedHooks("email:afterSend");
    const results = [];
    for (const hook of hooks) {
      const { handler } = hook;
      const event = {
        message,
        source
      };
      const ctx = this.getContext(hook.pluginId);
      const start = Date.now();
      try {
        await this.executeWithTimeout(() => handler(event, ctx), hook.timeout);
        results.push({
          success: true,
          pluginId: hook.pluginId,
          duration: Date.now() - start
        });
      } catch (error) {
        console.error(`[email:afterSend] Plugin "${hook.pluginId}" error:`, error instanceof Error ? error.message : error);
        results.push({
          success: false,
          error: error instanceof Error ? error : new Error(String(error)),
          pluginId: hook.pluginId,
          duration: Date.now() - start
        });
      }
    }
    return results;
  }
  /**
  * Run comment:beforeCreate hooks (middleware pipeline).
  *
  * Each handler receives the event and returns a modified event or
  * `false` to reject the comment. The pipeline chains transformations —
  * each handler receives the output of the previous one.
  */
  async runCommentBeforeCreate(event) {
    const hooks = this.getTypedHooks("comment:beforeCreate");
    let currentEvent = event;
    for (const hook of hooks) {
      const { handler } = hook;
      const ctx = this.getContext(hook.pluginId);
      const start = Date.now();
      try {
        const result = await this.executeWithTimeout(() => handler({ ...currentEvent }, ctx), hook.timeout);
        if (result === false) return false;
        if (result && typeof result === "object") currentEvent = result;
      } catch (error) {
        console.error(`[comment:beforeCreate] Plugin "${hook.pluginId}" error (${Date.now() - start}ms):`, error instanceof Error ? error.message : error);
        if (hook.errorPolicy === "abort") throw error;
      }
    }
    return currentEvent;
  }
  /**
  * Run comment:afterCreate hooks (fire-and-forget).
  *
  * Errors are logged but don't propagate — they don't affect the caller.
  */
  async runCommentAfterCreate(event) {
    const hooks = this.getTypedHooks("comment:afterCreate");
    for (const hook of hooks) {
      const { handler } = hook;
      const ctx = this.getContext(hook.pluginId);
      try {
        await this.executeWithTimeout(() => handler(event, ctx), hook.timeout);
      } catch (error) {
        console.error(`[comment:afterCreate] Plugin "${hook.pluginId}" error:`, error instanceof Error ? error.message : error);
      }
    }
  }
  /**
  * Run comment:afterModerate hooks (fire-and-forget).
  *
  * Errors are logged but don't propagate — they don't affect the caller.
  */
  async runCommentAfterModerate(event) {
    const hooks = this.getTypedHooks("comment:afterModerate");
    for (const hook of hooks) {
      const { handler } = hook;
      const ctx = this.getContext(hook.pluginId);
      try {
        await this.executeWithTimeout(() => handler(event, ctx), hook.timeout);
      } catch (error) {
        console.error(`[comment:afterModerate] Plugin "${hook.pluginId}" error:`, error instanceof Error ? error.message : error);
      }
    }
  }
  /**
  * Run page:metadata hooks. Each handler returns contributions that are
  * merged by the metadata collector. Errors are logged but don't propagate.
  */
  async runPageMetadata(event) {
    const hooks = this.getTypedHooks("page:metadata");
    const results = [];
    for (const hook of hooks) {
      const { handler } = hook;
      const ctx = this.getContext(hook.pluginId);
      try {
        const result = await this.executeWithTimeout(() => Promise.resolve(handler(event, ctx)), hook.timeout);
        if (result != null) {
          const contributions = Array.isArray(result) ? result : [result];
          results.push({
            pluginId: hook.pluginId,
            contributions
          });
        }
      } catch (error) {
        console.error(`[page:metadata] Plugin "${hook.pluginId}" error:`, error instanceof Error ? error.message : error);
      }
    }
    return results;
  }
  /**
  * Run page:fragments hooks. Only trusted plugins should be registered
  * for this hook. Errors are logged but don't propagate.
  */
  async runPageFragments(event) {
    const hooks = this.getTypedHooks("page:fragments");
    const results = [];
    for (const hook of hooks) {
      const { handler } = hook;
      const ctx = this.getContext(hook.pluginId);
      try {
        const result = await this.executeWithTimeout(() => Promise.resolve(handler(event, ctx)), hook.timeout);
        if (result != null) {
          const contributions = Array.isArray(result) ? result : [result];
          results.push({
            pluginId: hook.pluginId,
            contributions
          });
        }
      } catch (error) {
        console.error(`[page:fragments] Plugin "${hook.pluginId}" error:`, error instanceof Error ? error.message : error);
      }
    }
    return results;
  }
  /**
  * Check if any hooks are registered for a given name
  */
  hasHooks(name) {
    const hooks = this.hooks.get(name);
    return hooks !== void 0 && hooks.length > 0;
  }
  /**
  * Get hook count for debugging
  */
  getHookCount(name) {
    return this.hooks.get(name)?.length || 0;
  }
  /**
  * Get all registered hook names
  */
  getRegisteredHooks() {
    return [...this.hooks.keys()];
  }
  /**
  * Returns hook names where at least one handler declared exclusive: true
  */
  getRegisteredExclusiveHooks() {
    return [...this.exclusiveHookNames];
  }
  /**
  * Check if a hook is exclusive
  */
  isExclusiveHook(name) {
    return this.exclusiveHookNames.has(name);
  }
  /**
  * Set the selected provider for an exclusive hook.
  * Called by PluginManager after resolution.
  */
  setExclusiveSelection(hookName, pluginId) {
    this.exclusiveSelections.set(hookName, pluginId);
  }
  /**
  * Clear the selected provider for an exclusive hook.
  */
  clearExclusiveSelection(hookName) {
    this.exclusiveSelections.delete(hookName);
  }
  /**
  * Get the selected provider for an exclusive hook (if any).
  */
  getExclusiveSelection(hookName) {
    return this.exclusiveSelections.get(hookName);
  }
  /**
  * Get all plugins that registered a handler for a given exclusive hook.
  */
  getExclusiveHookProviders(hookName) {
    return (this.hooks.get(hookName) ?? []).filter((h) => h.exclusive).map((h) => ({ pluginId: h.pluginId }));
  }
  /**
  * Invoke an exclusive hook — dispatch only to the selected provider.
  * Returns null if no provider is selected or if the selected hook
  * is not found in the pipeline.
  *
  * This is a generic dispatch used by the email pipeline and other
  * exclusive hook consumers. The handler type is unknown — callers
  * must know the expected signature.
  *
  * Errors are isolated: a failing handler returns an error result
  * instead of propagating the exception to the caller.
  */
  async invokeExclusiveHook(hookName, event) {
    const selectedPluginId = this.exclusiveSelections.get(hookName);
    if (!selectedPluginId) return null;
    const hook = (this.hooks.get(hookName) ?? []).find((h) => h.pluginId === selectedPluginId && h.exclusive);
    if (!hook) return null;
    const start = Date.now();
    try {
      const ctx = this.getContext(selectedPluginId);
      const handler = hook.handler;
      return {
        result: await this.executeWithTimeout(() => handler(event, ctx), hook.timeout),
        pluginId: selectedPluginId,
        duration: Date.now() - start
      };
    } catch (error) {
      return {
        result: void 0,
        pluginId: selectedPluginId,
        error: error instanceof Error ? error : new Error(String(error)),
        duration: Date.now() - start
      };
    }
  }
};
function createHookPipeline(plugins, factoryOptions) {
  return new HookPipeline(plugins, factoryOptions);
}
const EXCLUSIVE_HOOK_KEY_PREFIX$1 = "emdash:exclusive_hook:";
async function resolveExclusiveHooks(opts) {
  const { pipeline, isActive, getOption, setOption, deleteOption, preferredHints } = opts;
  const exclusiveHookNames = pipeline.getRegisteredExclusiveHooks();
  for (const hookName of exclusiveHookNames) {
    const providers = pipeline.getExclusiveHookProviders(hookName);
    const activeProviderIds = new Set(providers.map((p2) => p2.pluginId).filter((id) => isActive(id)));
    const key = `${EXCLUSIVE_HOOK_KEY_PREFIX$1}${hookName}`;
    let currentSelection = null;
    try {
      currentSelection = await getOption(key);
    } catch {
      continue;
    }
    if (currentSelection && activeProviderIds.has(currentSelection)) {
      pipeline.setExclusiveSelection(hookName, currentSelection);
      continue;
    }
    if (currentSelection) try {
      await deleteOption(key);
    } catch {
    }
    if (activeProviderIds.size === 1) {
      const [onlyProvider] = activeProviderIds;
      try {
        await setOption(key, onlyProvider);
      } catch {
      }
      pipeline.setExclusiveSelection(hookName, onlyProvider);
      continue;
    }
    if (preferredHints) {
      let found = false;
      for (const [pluginId, hooks] of preferredHints) if (hooks.includes(hookName) && activeProviderIds.has(pluginId)) {
        try {
          await setOption(key, pluginId);
        } catch {
        }
        pipeline.setExclusiveSelection(hookName, pluginId);
        found = true;
        break;
      }
      if (found) continue;
    }
    pipeline.clearExclusiveSelection(hookName);
  }
}
const EMAIL_DELIVER_HOOK = "email:deliver";
const SYSTEM_SOURCE = "system";
var EmailNotConfiguredError = class extends Error {
  constructor() {
    super("No email provider is configured. Install and activate an email provider plugin, then select it in Settings > Email.");
    this.name = "EmailNotConfiguredError";
  }
};
var EmailRecursionError = class extends Error {
  constructor() {
    super("Recursive email send detected. A plugin hook attempted to send an email from within the email pipeline, which would cause infinite recursion.");
    this.name = "EmailRecursionError";
  }
};
const emailSendALS = new AsyncLocalStorage();
var EmailPipeline = class {
  pipeline;
  constructor(pipeline) {
    this.pipeline = pipeline;
  }
  /**
  * Replace the underlying hook pipeline.
  *
  * Called by the runtime when rebuilding the hook pipeline after a
  * plugin is enabled or disabled, so the email pipeline dispatches
  * to the current set of active hooks.
  */
  setPipeline(pipeline) {
    this.pipeline = pipeline;
  }
  /**
  * Send an email through the full pipeline.
  *
  * @param message - The email to send
  * @param source - Where the email originated ("system" for auth, plugin ID for plugins)
  * @throws EmailNotConfiguredError if no provider is selected
  * @throws EmailRecursionError if called re-entrantly from within a hook
  * @throws Error if the provider handler throws
  */
  async send(message, source) {
    const store = emailSendALS.getStore();
    if (store && store.depth > 0) throw new EmailRecursionError();
    const run = () => this.sendInner(message, source);
    if (store) {
      store.depth++;
      try {
        await run();
      } finally {
        store.depth--;
      }
    } else await emailSendALS.run({ depth: 1 }, run);
  }
  /**
  * Inner send implementation, separated from the recursion guard.
  */
  async sendInner(message, source) {
    if (!message || typeof message !== "object") throw new Error("Invalid email message: message must be an object");
    if (!message.to || typeof message.to !== "string") throw new Error("Invalid email message: 'to' is required and must be a string");
    if (!message.subject || typeof message.subject !== "string") throw new Error("Invalid email message: 'subject' is required and must be a string");
    if (!message.text || typeof message.text !== "string") throw new Error("Invalid email message: 'text' is required and must be a string");
    const isSystemEmail = source === SYSTEM_SOURCE;
    let finalMessage;
    if (isSystemEmail) finalMessage = message;
    else {
      const beforeResult = await this.pipeline.runEmailBeforeSend(message, source);
      if (beforeResult.message === false) {
        const cancelledBy = beforeResult.results.find((r) => r.value === false)?.pluginId ?? "unknown";
        console.info(`[email] Email to "${message.to}" cancelled by plugin "${cancelledBy}"`);
        return;
      }
      finalMessage = beforeResult.message;
    }
    const deliverEvent = {
      message: finalMessage,
      source
    };
    const deliverResult = await this.pipeline.invokeExclusiveHook(EMAIL_DELIVER_HOOK, deliverEvent);
    if (!deliverResult) throw new EmailNotConfiguredError();
    if (deliverResult.error) throw deliverResult.error;
    if (!isSystemEmail) this.pipeline.runEmailAfterSend(finalMessage, source).catch((err) => console.error("[email] afterSend pipeline error:", err instanceof Error ? err.message : err));
  }
  /**
  * Check if an email provider is configured and available.
  *
  * Returns true if an email:deliver provider is selected in the exclusive
  * hook system. Plugins and auth code use this to decide whether to show
  * "send invite" vs "copy invite link" UI.
  */
  isAvailable() {
    return this.pipeline.getExclusiveSelection(EMAIL_DELIVER_HOOK) !== void 0;
  }
};
var PluginRouteHandler = class {
  contextFactory;
  plugin;
  constructor(plugin, factoryOptions) {
    this.plugin = plugin;
    this.contextFactory = new PluginContextFactory(factoryOptions);
  }
  /**
  * Invoke a route by name
  */
  async invoke(routeName, options) {
    const route = this.plugin.routes[routeName];
    if (!route) return {
      success: false,
      error: {
        code: "ROUTE_NOT_FOUND",
        message: `Route "${routeName}" not found in plugin "${this.plugin.id}"`
      },
      status: 404
    };
    let validatedInput;
    if (route.input) {
      const parseResult = route.input.safeParse(options.body);
      if (!parseResult.success) return {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid request body",
          details: parseResult.error.format()
        },
        status: 400
      };
      validatedInput = parseResult.data;
    } else validatedInput = options.body;
    const routeContext = {
      ...this.contextFactory.createContext(this.plugin),
      input: validatedInput,
      request: options.request,
      requestMeta: extractRequestMeta(options.request)
    };
    try {
      return {
        success: true,
        data: await route.handler(routeContext),
        status: 200
      };
    } catch (error) {
      if (error instanceof PluginRouteError) return {
        success: false,
        error: {
          code: error.code,
          message: error.message,
          details: error.details
        },
        status: error.status
      };
      return {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: `Route handler failed: ${error instanceof Error ? error.message : String(error)}`
        },
        status: 500
      };
    }
  }
  /**
  * Get all route names
  */
  getRouteNames() {
    return Object.keys(this.plugin.routes);
  }
  /**
  * Check if a route exists
  */
  hasRoute(name) {
    return name in this.plugin.routes;
  }
  /**
  * Get route metadata without invoking the handler.
  * Returns null if the route doesn't exist.
  */
  getRouteMeta(name) {
    const route = this.plugin.routes[name];
    if (!route) return null;
    return { public: route.public === true };
  }
};
var PluginRouteError = class PluginRouteError2 extends Error {
  constructor(code, message, status = 400, details) {
    super(message);
    this.code = code;
    this.status = status;
    this.details = details;
    this.name = "PluginRouteError";
  }
  /**
  * Create a bad request error (400)
  */
  static badRequest(message, details) {
    return new PluginRouteError2("BAD_REQUEST", message, 400, details);
  }
  /**
  * Create an unauthorized error (401)
  */
  static unauthorized(message = "Unauthorized") {
    return new PluginRouteError2("UNAUTHORIZED", message, 401);
  }
  /**
  * Create a forbidden error (403)
  */
  static forbidden(message = "Forbidden") {
    return new PluginRouteError2("FORBIDDEN", message, 403);
  }
  /**
  * Create a not found error (404)
  */
  static notFound(message = "Not found") {
    return new PluginRouteError2("NOT_FOUND", message, 404);
  }
  /**
  * Create a conflict error (409)
  */
  static conflict(message, details) {
    return new PluginRouteError2("CONFLICT", message, 409, details);
  }
  /**
  * Create an internal error (500)
  */
  static internal(message = "Internal error") {
    return new PluginRouteError2("INTERNAL_ERROR", message, 500);
  }
};
var PluginRouteRegistry = class {
  handlers = /* @__PURE__ */ new Map();
  constructor(factoryOptions) {
    this.factoryOptions = factoryOptions;
  }
  /**
  * Register a plugin's routes
  */
  register(plugin) {
    const handler = new PluginRouteHandler(plugin, this.factoryOptions);
    this.handlers.set(plugin.id, handler);
  }
  /**
  * Unregister a plugin's routes
  */
  unregister(pluginId) {
    this.handlers.delete(pluginId);
  }
  /**
  * Invoke a plugin route
  */
  async invoke(pluginId, routeName, options) {
    const handler = this.handlers.get(pluginId);
    if (!handler) return {
      success: false,
      error: {
        code: "PLUGIN_NOT_FOUND",
        message: `Plugin "${pluginId}" not found`
      },
      status: 404
    };
    return handler.invoke(routeName, options);
  }
  /**
  * Get all registered plugin IDs
  */
  getPluginIds() {
    return [...this.handlers.keys()];
  }
  /**
  * Get routes for a plugin
  */
  getRoutes(pluginId) {
    return this.handlers.get(pluginId)?.getRouteNames() ?? [];
  }
  /**
  * Get route metadata for a specific plugin route.
  * Returns null if the plugin or route doesn't exist.
  */
  getRouteMeta(pluginId, routeName) {
    const handler = this.handlers.get(pluginId);
    if (!handler) return null;
    return handler.getRouteMeta(routeName);
  }
};
async function importReusableBlocksAsSections(posts, db) {
  const result = {
    sectionsCreated: 0,
    sectionsSkipped: 0,
    errors: []
  };
  const reusableBlocks = posts.filter((post) => post.postType === "wp_block");
  if (reusableBlocks.length === 0) return result;
  for (const block of reusableBlocks) try {
    const slug = block.postName || slugify(block.title || `block-${block.id || Date.now()}`);
    if (await db.selectFrom("_emdash_sections").select("id").where("slug", "=", slug).executeTakeFirst()) {
      result.sectionsSkipped++;
      continue;
    }
    const content = block.content ? gutenbergToPortableText(block.content) : [];
    const id = ulid();
    const now = (/* @__PURE__ */ new Date()).toISOString();
    await db.insertInto("_emdash_sections").values({
      id,
      slug,
      title: block.title || "Untitled Block",
      description: null,
      keywords: null,
      content: JSON.stringify(content),
      preview_media_id: null,
      source: "import",
      theme_id: null,
      created_at: now,
      updated_at: now
    }).execute();
    result.sectionsCreated++;
  } catch (error) {
    result.errors.push({
      title: block.title || "Untitled Block",
      error: error instanceof Error ? error.message : String(error)
    });
  }
  return result;
}
const sources = /* @__PURE__ */ new Map();
function registerSource(source) {
  sources.set(source.id, source);
}
const INTERNAL_POST_TYPES = [
  "revision",
  "nav_menu_item",
  "custom_css",
  "customize_changeset",
  "oembed_cache",
  "wp_global_styles",
  "wp_navigation",
  "wp_template",
  "wp_template_part",
  "attachment",
  "wp_block"
];
const INTERNAL_META_PREFIXES = ["_edit_", "_wp_"];
const NUMERIC_PATTERN = /^-?\d+(\.\d+)?$/;
const TRAILING_SLASHES$1 = /\/+$/;
const WP_JSON_SUFFIX$1 = /\/wp-json\/?.*$/;
const INTERNAL_META_KEYS = [
  "_edit_last",
  "_edit_lock",
  "_pingme",
  "_encloseme"
];
const BASE_REQUIRED_FIELDS = [
  {
    slug: "title",
    label: "Title",
    type: "string",
    required: true,
    searchable: true
  },
  {
    slug: "content",
    label: "Content",
    type: "portableText",
    required: false,
    searchable: true
  },
  {
    slug: "excerpt",
    label: "Excerpt",
    type: "text",
    required: false
  }
];
const FEATURED_IMAGE_FIELD = {
  slug: "featured_image",
  label: "Featured Image",
  type: "image",
  required: false
};
function isInternalPostType(type) {
  return INTERNAL_POST_TYPES.includes(type);
}
function isInternalMetaKey(key) {
  if (INTERNAL_META_KEYS.includes(key)) return true;
  for (const prefix of INTERNAL_META_PREFIXES) if (key.startsWith(prefix)) return true;
  if (key === "_thumbnail_id") return false;
  if (key.startsWith("_yoast_")) return false;
  if (key.startsWith("_rank_math_")) return false;
  if (key.startsWith("_")) return true;
  return false;
}
function mapWpStatus(status) {
  switch (status) {
    case "publish":
      return "publish";
    case "draft":
      return "draft";
    case "pending":
      return "pending";
    case "private":
      return "private";
    case "future":
      return "future";
    default:
      return "draft";
  }
}
const POST_TYPE_TO_COLLECTION = {
  post: "posts",
  page: "pages",
  attachment: "media",
  product: "products",
  portfolio: "portfolio",
  testimonial: "testimonials",
  team: "team",
  event: "events",
  faq: "faqs"
};
function mapPostTypeToCollection(postType) {
  return POST_TYPE_TO_COLLECTION[postType] || postType;
}
function mapMetaKeyToField(key) {
  if (key === "_yoast_wpseo_title") return "seo_title";
  if (key === "_yoast_wpseo_metadesc") return "seo_description";
  if (key === "_rank_math_title") return "seo_title";
  if (key === "_rank_math_description") return "seo_description";
  if (key === "_thumbnail_id") return "featured_image";
  if (key.startsWith("_")) return key.slice(1);
  return key;
}
function inferMetaType(key, value) {
  if (key.endsWith("_id") || key === "_thumbnail_id") return "string";
  if (key.endsWith("_date") || key.endsWith("_time")) return "date";
  if (key.endsWith("_count") || key.endsWith("_number")) return "number";
  if (!value) return "string";
  if (value.startsWith("a:") || value.startsWith("{") || value.startsWith("[")) return "json";
  if (NUMERIC_PATTERN.test(value)) return "number";
  if ([
    "0",
    "1",
    "true",
    "false"
  ].includes(value)) return "boolean";
  return "string";
}
function normalizeUrl$1(url) {
  let normalized = url.trim();
  if (!normalized.startsWith("http")) normalized = `https://${normalized}`;
  normalized = normalized.replace(TRAILING_SLASHES$1, "");
  normalized = normalized.replace(WP_JSON_SUFFIX$1, "");
  return normalized;
}
function getFilenameFromUrl(url) {
  try {
    return new URL(url).pathname.split("/").filter(Boolean).pop();
  } catch {
    return;
  }
}
function guessMimeType(filename) {
  return mime.getType(filename) ?? void 0;
}
function buildAttachmentMap(attachments) {
  const map = /* @__PURE__ */ new Map();
  for (const att of attachments) if (att.id && att.url) map.set(String(att.id), att.url);
  return map;
}
function isTypeCompatible(requiredType, existingType) {
  if (requiredType === existingType) return true;
  return {
    string: [
      "string",
      "text",
      "slug"
    ],
    text: ["string", "text"],
    portableText: ["portableText", "json"],
    number: ["number", "integer"],
    integer: ["number", "integer"]
  }[requiredType]?.includes(existingType) ?? false;
}
function checkSchemaCompatibility(requiredFields, existingCollection) {
  if (!existingCollection) {
    const fieldStatus2 = {};
    for (const field of requiredFields) fieldStatus2[field.slug] = {
      status: "missing",
      requiredType: field.type
    };
    return {
      exists: false,
      fieldStatus: fieldStatus2,
      canImport: true
    };
  }
  const fieldStatus = {};
  const incompatibleFields = [];
  for (const field of requiredFields) {
    const existingField = existingCollection.fields.get(field.slug);
    if (!existingField) fieldStatus[field.slug] = {
      status: "missing",
      requiredType: field.type
    };
    else if (isTypeCompatible(field.type, existingField.type)) fieldStatus[field.slug] = {
      status: "compatible",
      existingType: existingField.type,
      requiredType: field.type
    };
    else {
      fieldStatus[field.slug] = {
        status: "type_mismatch",
        existingType: existingField.type,
        requiredType: field.type
      };
      incompatibleFields.push(field.slug);
    }
  }
  const canImport = incompatibleFields.length === 0;
  return {
    exists: true,
    fieldStatus,
    canImport,
    reason: canImport ? void 0 : `Incompatible field types: ${incompatibleFields.join(", ")}`
  };
}
const wxrSource = {
  id: "wxr",
  name: "WordPress Export File",
  description: "Upload a WordPress export file (.xml)",
  icon: "upload",
  requiresFile: true,
  canProbe: false,
  async analyze(input, context) {
    if (input.type !== "file") throw new Error("WXR source requires a file input");
    return analyzeWxrData(await parseWxrString(await input.file.text()), context.getExistingCollections ? await context.getExistingCollections() : /* @__PURE__ */ new Map());
  },
  async *fetchContent(input, options) {
    if (input.type !== "file") throw new Error("WXR source requires a file input");
    const wxr = await parseWxrString(await input.file.text());
    const attachmentMap = buildAttachmentMap(wxr.attachments);
    let count = 0;
    for (const post of wxr.posts) {
      const postType = post.postType || "post";
      if (!options.postTypes.includes(postType)) continue;
      if (isInternalPostType(postType)) continue;
      if (!options.includeDrafts && post.status !== "publish") continue;
      yield wxrPostToNormalizedItem(post, attachmentMap);
      count++;
      if (options.limit && count >= options.limit) break;
    }
  }
};
function analyzeWxrData(wxr, existingCollections) {
  const postTypeCounts = /* @__PURE__ */ new Map();
  const postTypesWithThumbnails = /* @__PURE__ */ new Set();
  const metaKeys = /* @__PURE__ */ new Map();
  const authorPostCounts = /* @__PURE__ */ new Map();
  for (const post of wxr.posts) {
    const type = post.postType || "post";
    postTypeCounts.set(type, (postTypeCounts.get(type) || 0) + 1);
    if (post.creator) authorPostCounts.set(post.creator, (authorPostCounts.get(post.creator) || 0) + 1);
    if (post.meta.has("_thumbnail_id")) postTypesWithThumbnails.add(type);
    for (const [key, value] of post.meta) {
      const existing = metaKeys.get(key);
      if (existing) {
        existing.count++;
        if (existing.samples.length < 3 && value) existing.samples.push(value.slice(0, 100));
      } else metaKeys.set(key, {
        count: 1,
        samples: value ? [value.slice(0, 100)] : [],
        isInternal: isInternalMetaKey(key)
      });
    }
  }
  const customFields = [...metaKeys.entries()].filter(([_2, info]) => !info.isInternal).map(([key, info]) => ({
    key,
    count: info.count,
    samples: info.samples,
    suggestedField: mapMetaKeyToField(key),
    suggestedType: inferMetaType(key, info.samples[0]),
    isInternal: info.isInternal
  })).toSorted((a, b2) => b2.count - a.count);
  const postTypes = [...postTypeCounts.entries()].filter(([type]) => !isInternalPostType(type)).map(([name, count]) => {
    const suggestedCollection = mapPostTypeToCollection(name);
    const existingCollection = existingCollections.get(suggestedCollection);
    const requiredFields = [...BASE_REQUIRED_FIELDS];
    if (postTypesWithThumbnails.has(name)) requiredFields.push(FEATURED_IMAGE_FIELD);
    return {
      name,
      count,
      suggestedCollection,
      requiredFields,
      schemaStatus: checkSchemaCompatibility(requiredFields, existingCollection)
    };
  }).toSorted((a, b2) => b2.count - a.count);
  const attachmentItems = wxr.attachments.map((att) => {
    const filename = att.url ? getFilenameFromUrl(att.url) : void 0;
    const mimeType = filename ? guessMimeType(filename) : void 0;
    return {
      id: att.id,
      title: att.title,
      url: att.url,
      filename,
      mimeType
    };
  });
  const navMenus = wxr.navMenus.map((menu) => ({
    name: menu.name,
    label: menu.label,
    itemCount: menu.items.length
  }));
  const taxonomyMap = /* @__PURE__ */ new Map();
  for (const term of wxr.terms) {
    if (term.taxonomy === "category" || term.taxonomy === "post_tag" || term.taxonomy === "nav_menu") continue;
    const existing = taxonomyMap.get(term.taxonomy);
    if (existing) {
      existing.count++;
      if (existing.samples.length < 3) existing.samples.push(term.name);
    } else taxonomyMap.set(term.taxonomy, {
      count: 1,
      samples: [term.name]
    });
  }
  const customTaxonomies = Array.from(taxonomyMap.entries(), ([slug, info]) => ({
    slug,
    termCount: info.count,
    sampleTerms: info.samples
  })).toSorted((a, b2) => b2.termCount - a.termCount);
  const reusableBlocks = wxr.posts.filter((post) => post.postType === "wp_block").map((post) => ({
    id: post.id || 0,
    title: post.title || "Untitled Block",
    slug: post.postName || slugify(post.title || `block-${post.id || Date.now()}`)
  }));
  return {
    sourceId: "wxr",
    site: {
      title: wxr.site.title || "WordPress Site",
      url: wxr.site.link || ""
    },
    postTypes,
    attachments: {
      count: wxr.attachments.length,
      items: attachmentItems
    },
    categories: wxr.categories.length,
    tags: wxr.tags.length,
    authors: wxr.authors.map((a) => ({
      id: a.id,
      login: a.login,
      email: a.email,
      displayName: a.displayName || a.login || "Unknown",
      postCount: a.login ? authorPostCounts.get(a.login) || 0 : 0
    })),
    navMenus: navMenus.length > 0 ? navMenus : void 0,
    customTaxonomies: customTaxonomies.length > 0 ? customTaxonomies : void 0,
    reusableBlocks: reusableBlocks.length > 0 ? reusableBlocks : void 0,
    customFields
  };
}
function wxrPostToNormalizedItem(post, attachmentMap) {
  const content = post.content ? gutenbergToPortableText(post.content) : [];
  const thumbnailId = post.meta.get("_thumbnail_id");
  const featuredImage = thumbnailId ? attachmentMap.get(String(thumbnailId)) : void 0;
  let customTaxonomies;
  if (post.customTaxonomies && post.customTaxonomies.size > 0) customTaxonomies = Object.fromEntries(post.customTaxonomies);
  return {
    sourceId: post.id || 0,
    postType: post.postType || "post",
    status: mapWpStatus(post.status),
    slug: post.postName || slugify(post.title || `post-${post.id || Date.now()}`),
    title: post.title || "Untitled",
    content,
    excerpt: post.excerpt,
    date: post.postDate ? new Date(post.postDate) : /* @__PURE__ */ new Date(),
    modified: post.postModified ? new Date(post.postModified) : void 0,
    author: post.creator,
    categories: post.categories,
    tags: post.tags,
    meta: Object.fromEntries(post.meta),
    featuredImage,
    parentId: post.postParent && post.postParent !== 0 ? post.postParent : void 0,
    menuOrder: post.menuOrder,
    customTaxonomies
  };
}
const TRAILING_SLASHES = /\/+$/;
const WP_JSON_SUFFIX = /\/wp-json\/?$/;
const wordpressRestSource = {
  id: "wordpress-rest",
  name: "WordPress Site",
  description: "Connect to a self-hosted WordPress site",
  icon: "globe",
  requiresFile: false,
  canProbe: true,
  async probe(url) {
    try {
      const siteUrl = normalizeUrl(url);
      validateExternalUrl(siteUrl);
      const response = await ssrfSafeFetch(`${siteUrl}/wp-json/`, {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(1e4)
      });
      if (!response.ok) {
        if (!(await ssrfSafeFetch(`${siteUrl}/?rest_route=/`, {
          headers: { Accept: "application/json" },
          signal: AbortSignal.timeout(1e4)
        })).ok) return null;
      }
      const data = await response.json();
      if (!data.namespaces?.includes("wp/v2")) return null;
      const preview = await getPublicContentCounts(siteUrl);
      const hasAppPasswords = !!data.authentication?.["application-passwords"];
      return {
        sourceId: "wordpress-rest",
        confidence: "definite",
        detected: {
          platform: "wordpress",
          siteTitle: data.name,
          siteUrl: data.url || data.home || siteUrl
        },
        capabilities: {
          publicContent: true,
          privateContent: false,
          customPostTypes: false,
          allMeta: false,
          mediaStream: true
        },
        auth: hasAppPasswords ? {
          type: "password",
          instructions: "To import drafts and private content, create an Application Password in WordPress → Users → Your Profile → Application Passwords"
        } : void 0,
        preview,
        suggestedAction: {
          type: "upload",
          instructions: "For a complete import including drafts, custom post types, and all metadata, export your content from WordPress (Tools → Export) and upload the file here."
        }
      };
    } catch {
      return null;
    }
  },
  async analyze(_input, _context) {
    throw new Error("Direct REST API import not implemented. Please upload a WXR export file.");
  },
  async *fetchContent(_input, _options) {
    throw new Error("Direct REST API import not implemented. Please upload a WXR export file.");
  }
};
function normalizeUrl(url) {
  let normalized = url.trim();
  if (!normalized.startsWith("http")) normalized = `https://${normalized}`;
  normalized = normalized.replace(TRAILING_SLASHES, "");
  normalized = normalized.replace(WP_JSON_SUFFIX, "");
  return normalized;
}
async function getPublicContentCounts(siteUrl) {
  const result = {};
  try {
    const [postsRes, pagesRes, mediaRes] = await Promise.allSettled([
      ssrfSafeFetch(`${siteUrl}/wp-json/wp/v2/posts?per_page=1`, { signal: AbortSignal.timeout(5e3) }),
      ssrfSafeFetch(`${siteUrl}/wp-json/wp/v2/pages?per_page=1`, { signal: AbortSignal.timeout(5e3) }),
      ssrfSafeFetch(`${siteUrl}/wp-json/wp/v2/media?per_page=1`, { signal: AbortSignal.timeout(5e3) })
    ]);
    if (postsRes.status === "fulfilled" && postsRes.value.ok) {
      const total = postsRes.value.headers.get("X-WP-Total");
      if (total) result.posts = parseInt(total, 10);
    }
    if (pagesRes.status === "fulfilled" && pagesRes.value.ok) {
      const total = pagesRes.value.headers.get("X-WP-Total");
      if (total) result.pages = parseInt(total, 10);
    }
    if (mediaRes.status === "fulfilled" && mediaRes.value.ok) {
      const total = mediaRes.value.headers.get("X-WP-Total");
      if (total) result.media = parseInt(total, 10);
    }
  } catch {
  }
  return result;
}
const wordpressPluginSource = {
  id: "wordpress-plugin",
  name: "WordPress (EmDash Exporter)",
  description: "Import from WordPress sites with the EmDash Exporter plugin installed",
  icon: "plug",
  requiresFile: false,
  canProbe: true,
  async probe(url) {
    try {
      const siteUrl = normalizeUrl$1(url);
      validateExternalUrl(siteUrl);
      const response = await ssrfSafeFetch(`${siteUrl}/wp-json/emdash/v1/probe`, {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(1e4)
      });
      if (!response.ok) return null;
      const data = await response.json();
      if (!data.emdash_exporter) return null;
      return {
        sourceId: "wordpress-plugin",
        confidence: "definite",
        detected: {
          platform: "wordpress",
          version: data.wordpress_version,
          siteTitle: data.site.title,
          siteUrl: data.site.url
        },
        capabilities: {
          publicContent: true,
          privateContent: true,
          customPostTypes: true,
          allMeta: true,
          mediaStream: true
        },
        auth: data.capabilities.application_passwords ? {
          type: "password",
          instructions: data.auth_instructions.instructions
        } : void 0,
        preview: {
          posts: data.post_types.find((p2) => p2.name === "post")?.count,
          pages: data.post_types.find((p2) => p2.name === "page")?.count,
          media: data.media_count
        },
        suggestedAction: { type: "proceed" },
        i18n: pluginI18nToDetection(data.i18n)
      };
    } catch {
      return null;
    }
  },
  async analyze(input, context) {
    const { siteUrl, headers } = getRequestConfig(input);
    const response = await ssrfSafeFetch(`${siteUrl}/wp-json/emdash/v1/analyze`, {
      headers,
      signal: AbortSignal.timeout(3e4)
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `Failed to analyze site: ${response.statusText}`);
    }
    const data = await response.json();
    const existingCollections = context.getExistingCollections ? await context.getExistingCollections() : /* @__PURE__ */ new Map();
    const postTypes = data.post_types.filter((pt) => pt.total > 0).map((pt) => {
      const suggestedCollection = mapPostTypeToCollection(pt.name);
      const existingCollection = existingCollections.get(suggestedCollection);
      const requiredFields = pt.supports && "thumbnail" in pt.supports ? [...BASE_REQUIRED_FIELDS, FEATURED_IMAGE_FIELD] : [...BASE_REQUIRED_FIELDS];
      return {
        name: pt.name,
        count: pt.total,
        suggestedCollection,
        requiredFields,
        schemaStatus: checkSchemaCompatibility(requiredFields, existingCollection)
      };
    });
    const attachments = [];
    if (data.attachments.count > 0) try {
      const mediaResponse = await ssrfSafeFetch(`${siteUrl}/wp-json/emdash/v1/media?per_page=500`, {
        headers,
        signal: AbortSignal.timeout(3e4)
      });
      if (mediaResponse.ok) {
        const mediaData = await mediaResponse.json();
        for (const item of mediaData.items) attachments.push({
          id: item.id,
          url: item.url,
          filename: item.filename,
          mimeType: item.mime_type,
          title: item.title,
          alt: item.alt,
          caption: item.caption,
          width: item.width,
          height: item.height
        });
      }
    } catch (e) {
      console.warn("Failed to fetch media list:", e);
    }
    const categoryTaxonomy = data.taxonomies.find((t) => t.name === "category");
    const tagTaxonomy = data.taxonomies.find((t) => t.name === "post_tag");
    return {
      sourceId: "wordpress-plugin",
      site: {
        title: data.site.title,
        url: data.site.url
      },
      postTypes,
      attachments: {
        count: data.attachments.count,
        items: attachments
      },
      categories: categoryTaxonomy?.term_count ?? 0,
      tags: tagTaxonomy?.term_count ?? 0,
      authors: data.authors.map((a) => ({
        id: a.id,
        login: a.login,
        email: a.email,
        displayName: a.display_name,
        postCount: a.post_count
      })),
      i18n: pluginI18nToDetection(data.i18n)
    };
  },
  async *fetchContent(input, options) {
    const { siteUrl, headers } = getRequestConfig(input);
    for (const postType of options.postTypes) {
      let page = 1;
      let totalPages = 1;
      let yielded = 0;
      while (page <= totalPages) {
        const response = await ssrfSafeFetch(`${siteUrl}/wp-json/emdash/v1/content?post_type=${postType}&status=${options.includeDrafts ? "any" : "publish"}&per_page=100&page=${page}`, {
          headers,
          signal: AbortSignal.timeout(6e4)
        });
        if (!response.ok) throw new Error(`Failed to fetch ${postType}: ${response.statusText}`);
        const data = await response.json();
        totalPages = data.pages;
        for (const post of data.items) {
          yield pluginPostToNormalizedItem(post);
          yielded++;
          if (options.limit && yielded >= options.limit) return;
        }
        page++;
      }
    }
  },
  async fetchMedia(url, _input) {
    validateExternalUrl(url);
    const response = await ssrfSafeFetch(url);
    if (!response.ok) throw new Error(`Failed to fetch media: ${response.statusText}`);
    return response.blob();
  }
};
function pluginI18nToDetection(i18n) {
  if (!i18n) return void 0;
  return {
    plugin: i18n.plugin,
    defaultLocale: i18n.default_locale,
    locales: i18n.locales
  };
}
function getRequestConfig(input) {
  if (input.type === "url") {
    const siteUrl = normalizeUrl$1(input.url);
    validateExternalUrl(siteUrl);
    const headers = { Accept: "application/json" };
    if (input.token) headers["Authorization"] = `Basic ${input.token}`;
    return {
      siteUrl,
      headers
    };
  }
  if (input.type === "oauth") {
    const oauthSiteUrl = normalizeUrl$1(input.url);
    validateExternalUrl(oauthSiteUrl);
    return {
      siteUrl: oauthSiteUrl,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${input.accessToken}`
      }
    };
  }
  throw new Error("WordPress plugin source requires URL or OAuth input");
}
function pluginPostToNormalizedItem(post) {
  const content = post.content ? gutenbergToPortableText(post.content) : [];
  const categories = post.taxonomies?.category?.map((c) => c.slug) ?? post.taxonomies?.categories?.map((c) => c.slug) ?? [];
  const tags = post.taxonomies?.post_tag?.map((t) => t.slug) ?? post.taxonomies?.tags?.map((t) => t.slug) ?? [];
  const meta = { ...post.meta };
  if (post.acf) meta._acf = post.acf;
  if (post.yoast) meta._yoast = post.yoast;
  if (post.rankmath) meta._rankmath = post.rankmath;
  return {
    sourceId: post.id,
    postType: post.post_type,
    status: mapWpStatus(post.status),
    slug: post.slug,
    title: post.title,
    content,
    excerpt: post.excerpt || void 0,
    date: new Date(post.date_gmt || post.date),
    modified: post.modified_gmt ? new Date(post.modified_gmt) : new Date(post.modified),
    author: post.author?.login,
    categories,
    tags,
    meta,
    featuredImage: post.featured_image?.url,
    locale: post.locale,
    translationGroup: post.translation_group
  };
}
registerSource(wordpressPluginSource);
registerSource(wordpressRestSource);
registerSource(wxrSource);
async function getMenu(name) {
  return getMenuWithDb(name, await getDb());
}
async function getMenuWithDb(name, db) {
  const menuRow = await db.selectFrom("_emdash_menus").selectAll().where("name", "=", name).executeTakeFirst();
  if (!menuRow) return null;
  const items = await buildMenuTree(await db.selectFrom("_emdash_menu_items").selectAll().$castTo().where("menu_id", "=", menuRow.id).orderBy("sort_order", "asc").execute(), db);
  return {
    id: menuRow.id,
    name: menuRow.name,
    label: menuRow.label,
    items
  };
}
async function buildMenuTree(items, db) {
  const collectionSlugs = /* @__PURE__ */ new Set();
  for (const item of items) {
    if (item.reference_collection) collectionSlugs.add(item.reference_collection);
    if (item.type === "page" || item.type === "post") collectionSlugs.add(item.reference_collection || `${item.type}s`);
  }
  const urlPatterns = /* @__PURE__ */ new Map();
  if (collectionSlugs.size > 0) {
    const rows = await db.selectFrom("_emdash_collections").select(["slug", "url_pattern"]).where("slug", "in", [...collectionSlugs]).execute();
    for (const row of rows) urlPatterns.set(row.slug, row.url_pattern);
  }
  const validItems = (await Promise.all(items.map((item) => resolveMenuItem(item, db, urlPatterns)))).filter((item) => item !== null);
  const itemMap = /* @__PURE__ */ new Map();
  const rootItems = [];
  for (const item of validItems) itemMap.set(item.id, {
    ...item,
    children: []
  });
  for (const item of items) {
    const menuItem = itemMap.get(item.id);
    if (!menuItem) continue;
    if (item.parent_id) {
      const parent = itemMap.get(item.parent_id);
      if (parent) parent.children.push(menuItem);
      else rootItems.push(menuItem);
    } else rootItems.push(menuItem);
  }
  return rootItems;
}
async function resolveMenuItem(item, db, urlPatterns) {
  let url;
  try {
    switch (item.type) {
      case "custom":
        url = item.custom_url || "#";
        break;
      case "page":
      case "post":
        url = await resolveContentUrl(item.reference_collection || `${item.type}s`, item.reference_id, db, urlPatterns);
        if (url === null) return null;
        break;
      case "taxonomy":
        url = await resolveTaxonomyUrl(item.reference_id, db);
        if (url === null) return null;
        break;
      case "collection":
        url = `/${item.reference_collection}/`;
        break;
      default:
        if (item.reference_collection && item.reference_id) {
          url = await resolveContentUrl(item.reference_collection, item.reference_id, db, urlPatterns);
          if (url === null) return null;
        } else url = "#";
    }
  } catch (error) {
    console.error(`Failed to resolve menu item ${item.id}:`, error);
    return null;
  }
  return {
    id: item.id,
    label: item.label,
    url,
    target: item.target || void 0,
    titleAttr: item.title_attr || void 0,
    cssClasses: item.css_classes || void 0,
    children: []
  };
}
const SLUG_PLACEHOLDER = /\{slug\}/g;
const ID_PLACEHOLDER = /\{id\}/g;
function interpolateUrlPattern(pattern, slug, id) {
  return pattern.replace(SLUG_PLACEHOLDER, slug).replace(ID_PLACEHOLDER, id);
}
async function resolveContentUrl(collection, entryId, db, urlPatterns) {
  if (!entryId) return null;
  try {
    const row = (await sql`
			SELECT slug FROM ${sql.ref(`ec_${collection}`)} WHERE id = ${entryId} LIMIT 1
		`.execute(db)).rows[0];
    if (row) {
      const pattern = urlPatterns.get(collection);
      if (pattern) return interpolateUrlPattern(pattern, row.slug, entryId);
      return `/${collection}/${row.slug}`;
    }
    return null;
  } catch (error) {
    console.error(`Failed to resolve content URL for ${collection}/${entryId}:`, error);
    return null;
  }
}
async function resolveTaxonomyUrl(taxonomyId, db) {
  if (!taxonomyId) return null;
  const taxonomy = await db.selectFrom("taxonomies").select(["name", "slug"]).where("id", "=", taxonomyId).executeTakeFirst();
  if (!taxonomy) return null;
  return `/${taxonomy.name}/${taxonomy.slug}`;
}
async function getTerm(taxonomyName, slug) {
  const db = await getDb();
  const row = await db.selectFrom("taxonomies").selectAll().where("name", "=", taxonomyName).where("slug", "=", slug).executeTakeFirst();
  if (!row) return null;
  const count = (await db.selectFrom("content_taxonomies").select((eb) => eb.fn.count("entry_id").as("count")).where("taxonomy_id", "=", row.id).executeTakeFirst())?.count ?? 0;
  const children = (await db.selectFrom("taxonomies").selectAll().where("parent_id", "=", row.id).orderBy("label", "asc").execute()).map((child) => ({
    id: child.id,
    name: child.name,
    slug: child.slug,
    label: child.label,
    parentId: child.parent_id ?? void 0,
    children: []
  }));
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    label: row.label,
    parentId: row.parent_id ?? void 0,
    description: row.data ? JSON.parse(row.data).description : void 0,
    children,
    count
  };
}
async function getEntryTerms(collection, entryId, taxonomyName) {
  let query = (await getDb()).selectFrom("content_taxonomies").innerJoin("taxonomies", "taxonomies.id", "content_taxonomies.taxonomy_id").selectAll("taxonomies").where("content_taxonomies.collection", "=", collection).where("content_taxonomies.entry_id", "=", entryId);
  query = query.where("taxonomies.name", "=", taxonomyName);
  return (await query.execute()).map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    label: row.label,
    parentId: row.parent_id ?? void 0,
    children: []
  }));
}
new Set(PLUGIN_CAPABILITIES);
new Set(HOOK_NAMES);
export {
  handleContentCountScheduled as $,
  resolveExclusiveHooks as A,
  BylineRepository as B,
  ContentRepository as C,
  handleContentList as D,
  EmailPipeline as E,
  FTSManager as F,
  handleContentGet as G,
  handleContentGetIncludingTrashed as H,
  handleContentCreate as I,
  validateRev as J,
  handleContentUpdate as K,
  handleContentDelete as L,
  MediaRepository as M,
  handleContentListTrashed as N,
  OptionsRepository as O,
  PluginRouteError as P,
  handleContentRestore as Q,
  RevisionRepository as R,
  SchemaRegistry as S,
  handleContentPermanentDelete as T,
  handleContentCountTrashed as U,
  handleContentDuplicate as V,
  handleContentPublish as W,
  handleContentUnpublish as X,
  handleContentSchedule as Y,
  handleContentUnschedule as Z,
  __exportAll as _,
  getI18nConfig as a,
  handleContentDiscardDraft as a0,
  handleContentCompare as a1,
  handleContentTranslations as a2,
  handleMediaList as a3,
  handleMediaGet as a4,
  handleMediaCreate as a5,
  handleMediaUpdate as a6,
  handleMediaDelete as a7,
  handleRevisionList as a8,
  handleRevisionGet as a9,
  handleRevisionRestore as aa,
  PluginRouteRegistry as ab,
  sanitizeHeadersForSandbox as ac,
  extractRequestMeta as ad,
  RedirectRepository as ae,
  getMenu as af,
  contentD6C2WsZC as ag,
  loaderFz8Q_3EO as ah,
  validateO7PWmlnq as ai,
  applyBjfq_b4_ as aj,
  configCKE8p9xM as ak,
  getFallbackChain as b,
  getDb as c,
  importReusableBlocksAsSections as d,
  computeContentHash as e,
  getTerm as f,
  getRequestContext as g,
  hashString as h,
  isI18nEnabled as i,
  getEntryTerms as j,
  emdashLoader as k,
  currentTimestamp as l,
  listTablesLike as m,
  isSqlite as n,
  currentTimestampValue as o,
  parseWxrString as p,
  binaryType as q,
  definePlugin as r,
  runWithContext as s,
  setI18nConfig as t,
  createHookPipeline as u,
  validateIdentifier as v,
  CronExecutor as w,
  PluginStateRepository as x,
  loadBundleFromR2 as y,
  normalizeManifestRoute as z
};
