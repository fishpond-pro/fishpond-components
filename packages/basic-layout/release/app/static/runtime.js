


(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('immer')) :
    typeof define === 'function' && define.amd ? define(['exports', 'immer'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global["@polymita/signal"] = {}, global.immer));
})(this, (function (exports, immer) { 'use strict';

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    /**
     * cloned from https://github.com/tj/co/blob/master/index.js
     */
    /**
     * slice() reference.
     */
    var slice = Array.prototype.slice;
    function co(gen, evt) {
        var ctx = this;
        // we wrap everything in a promise to avoid promise chaining,
        // which leads to memory leak errors.
        // see https://github.com/tj/co/issues/180
        return new Promise(function (resolve, reject) {
            onFulfilled();
            /**
             * @param {Mixed} res
             * @return {Promise}
             * @api private
             */
            function onFulfilled(res) {
                evt.onResume(res);
                var ret;
                try {
                    ret = gen.next(res);
                }
                catch (e) {
                    return reject(e);
                }
                evt.onSuspend();
                next(ret);
                return null;
            }
            /**
             * @param {Error} err
             * @return {Promise}
             * @api private
             */
            function onRejected(err) {
                var ret;
                try {
                    ret = gen.throw(err);
                }
                catch (e) {
                    return reject(e);
                }
                next(ret);
            }
            /**
             * Get the next value in the generator,
             * return a promise.
             *
             * @param {Object} ret
             * @return {Promise}
             * @api private
             */
            function next(ret) {
                if (ret.done)
                    return resolve(ret.value);
                var value = toPromise.call(ctx, ret.value);
                if (value && isPromise$1(value))
                    return value.then(res => {
                        onFulfilled(res);
                    }, onRejected);
                return onRejected(new TypeError('You may only yield a function, promise, generator, array, or object, ' +
                    'but the following object was passed: "' +
                    String(ret.value) +
                    '"'));
            }
        });
    }
    /**
     * Convert a `yield`ed value into a promise.
     *
     * @param {Mixed} obj
     * @return {Promise}
     * @api private
     */
    function toPromise(obj) {
        if (!obj)
            return obj;
        if (isPromise$1(obj))
            return obj;
        if (isGeneratorFunction(obj) || isGenerator$1(obj))
            return co.call(this, obj);
        if ('function' == typeof obj)
            return thunkToPromise.call(this, obj);
        if (Array.isArray(obj))
            return arrayToPromise.call(this, obj);
        if (isObject(obj))
            return objectToPromise.call(this, obj);
        return obj;
    }
    /**
     * Convert a thunk to a promise.
     *
     * @param {Function}
     * @return {Promise}
     * @api private
     */
    function thunkToPromise(fn) {
        var ctx = this;
        return new Promise(function (resolve, reject) {
            fn.call(ctx, function (err, res) {
                if (err)
                    return reject(err);
                if (arguments.length > 2)
                    res = slice.call(arguments, 1);
                resolve(res);
            });
        });
    }
    /**
     * Convert an array of "yieldables" to a promise.
     * Uses `Promise.all()` internally.
     *
     * @param {Array} obj
     * @return {Promise}
     * @api private
     */
    function arrayToPromise(obj) {
        return Promise.all(obj.map(toPromise, this));
    }
    /**
     * Convert an object of "yieldables" to a promise.
     * Uses `Promise.all()` internally.
     *
     * @param {Object} obj
     * @return {Promise}
     * @api private
     */
    function objectToPromise(obj) {
        var results = new obj.constructor();
        var keys = Object.keys(obj);
        var promises = [];
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var promise = toPromise.call(this, obj[key]);
            if (promise && isPromise$1(promise))
                defer(promise, key);
            else
                results[key] = obj[key];
        }
        return Promise.all(promises).then(function () {
            return results;
        });
        function defer(promise, key) {
            // predefine the key in the result
            results[key] = undefined;
            promises.push(promise.then(function (res) {
                results[key] = res;
            }));
        }
    }
    /**
     * Check if `obj` is a promise.
     *
     * @param {Object} obj
     * @return {Boolean}
     * @api private
     */
    function isPromise$1(obj) {
        return 'function' == typeof obj.then;
    }
    /**
     * Check if `obj` is a generator.
     *
     * @param {Mixed} obj
     * @return {Boolean}
     * @api private
     */
    function isGenerator$1(obj) {
        return 'function' == typeof obj.next && 'function' == typeof obj.throw;
    }
    /**
     * Check if `obj` is a generator function.
     *
     * @param {Mixed} obj
     * @return {Boolean}
     * @api private
     */
    function isGeneratorFunction(obj) {
        var constructor = obj.constructor;
        if (!constructor)
            return false;
        if ('GeneratorFunction' === constructor.name ||
            'GeneratorFunction' === constructor.displayName)
            return true;
        return isGenerator$1(constructor.prototype);
    }
    /**
     * Check for plain object.
     *
     * @param {Mixed} val
     * @return {Boolean}
     * @api private
     */
    function isObject(val) {
        return Object == val.constructor;
    }

    const isArray = Array.isArray;
    const ownKeys = Reflect.ownKeys;
    const getOwnPropertyDescriptors = Object.getOwnPropertyDescriptors;
    function shallowCopy(base) {
        if (isArray(base))
            return Array.prototype.slice.call(base);
        const descriptors = getOwnPropertyDescriptors(base);
        let keys = ownKeys(descriptors);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const desc = descriptors[key];
            if (desc.writable === false) {
                desc.writable = true;
                desc.configurable = true;
            }
            // like object.assign, we will read any _own_, get/set accessors. This helps in dealing
            // with libraries that trap values, like mobx or vue
            // unlike object.assign, non-enumerables will be copied as well
            if (desc.get || desc.set)
                descriptors[key] = {
                    configurable: true,
                    writable: true,
                    enumerable: desc.enumerable,
                    value: base[key],
                };
        }
        return Object.create(Object.getPrototypeOf(base), descriptors);
    }
    /* HELPERS */
    const getKeys = Object.keys;
    const isEqual = (x, y) => {
        if (x === y)
            return true;
        if (typeof x === "object" &&
            typeof y === "object" &&
            x !== null &&
            y !== null) {
            if (isArray(x)) {
                if (isArray(y)) {
                    let xLength = x.length;
                    let yLength = y.length;
                    if (xLength !== yLength)
                        return false;
                    while (xLength--) {
                        if (!isEqual(x[xLength], y[xLength]))
                            return false;
                    }
                    return true;
                }
                return false;
            }
            else if (isArray(y)) {
                return false;
            }
            else {
                let xKeys = getKeys(x);
                let xLength = xKeys.length;
                let yKeys = getKeys(y);
                let yLength = yKeys.length;
                if (xLength !== yLength)
                    return false;
                while (xLength--) {
                    const key = xKeys[xLength];
                    const xValue = x[key];
                    const yValue = y[key];
                    if (!isEqual(xValue, yValue))
                        return false;
                    if (yValue === undefined && !Reflect.has(y, key))
                        return false;
                }
            }
            return true;
        }
        return x !== x && y !== y;
    };
    function last(arr) {
        return arr[arr.length - 1];
    }
    function cloneDeep(obj) {
        return obj && JSON.parse(JSON.stringify(obj));
    }
    function applyPatchesToObject(target, patches) {
        patches.forEach((p) => {
            switch (p.op) {
                case "add":
                    set(target, p.path, p.value);
                    break;
                case "remove":
                    deleteKey(target, p);
                    break;
                case "replace":
                    set(target, p.path, p.value);
                    break;
            }
        });
    }
    function isPrimtive(v) {
        if (v === null) {
            return true;
        }
        const type = typeof v;
        return [
            "undefined",
            "number",
            "symbol",
            "string",
            "bigint",
            "boolean",
        ].includes(type);
    }
    function deleteKey(obj, p) {
        const { path, value } = p;
        let tail = path.length > 0 ? get(obj, path.slice(0, -1)) : obj;
        const key = last(path);
        if (tail instanceof Set) {
            tail.delete(value);
        }
        if (tail instanceof Map) {
            tail.delete(key);
        }
        else {
            delete tail[key];
        }
    }
    function set(obj, path, value) {
        let base = obj;
        const currentFieldPath = isArray(path)
            ? path.slice(0)
            : path.split
                ? path.split(".")
                : [path];
        if (currentFieldPath.length > 0) {
            const fieldName = currentFieldPath[currentFieldPath.length - 1];
            currentFieldPath.forEach((p, i) => {
                if (i >= currentFieldPath.length - 1)
                    return;
                if (base[p] === undefined) {
                    const nextP = currentFieldPath[i + 1];
                    base[p] = nextP !== undefined && typeof nextP === "number" ? [] : {};
                }
                base = base[p];
            });
            if (base instanceof Map) {
                base.set(fieldName, value);
            }
            else if (base instanceof Set) {
                base.add(value);
            }
            else {
                base[fieldName] = value;
            }
        }
    }
    function get(obj, path) {
        if (!path) {
            return obj;
        }
        let base = obj;
        const pathArr = isArray(path)
            ? path.slice(0)
            : path.split
                ? path.split(".")
                : [path];
        if (pathArr.length === 0) {
            return obj;
        }
        const currentPathArr = pathArr.slice(0, -1);
        const key = last(pathArr);
        for (const p of currentPathArr) {
            if (base[p] === undefined)
                return undefined;
            base = base[p];
        }
        if (base instanceof Map) {
            return base.get(key);
        }
        return base[key];
    }
    function map(target, callback) {
        if (!target || typeof target !== "object") {
            throw new Error("can not map");
        }
        if (isArray(target)) {
            return target.map(callback);
        }
        return Object.values(target).map(callback);
    }
    function likeObject(target) {
        return target && typeof target === "object";
    }
    function isDef(v) {
        return typeof v !== "undefined";
    }
    function isUndef(v) {
        return typeof v === "undefined";
    }
    function isFunc(f) {
        return typeof f === "function";
    }
    function isAsyncFunc(f) {
        return f && f[Symbol.toStringTag] === "AsyncFunction";
    }
    function isPromise(p) {
        return p && (p instanceof Promise || !!p.then);
    }
    function isGenerator(g) {
        return g && "function" == typeof g.next && "function" == typeof g.throw;
    }
    function nextTick(fn) {
        // const p = Promise.resolve()
        // let run = true
        // p.then(() => {
        //   if (run) {
        //     fn()
        //   }
        // })
        let st = setTimeout(fn, 0);
        return () => clearTimeout(st);
    }
    function findWithDefault(arr, fn, defaults) {
        let e = arr.find(fn);
        if (!e && defaults) {
            e = defaults;
            arr.push(e);
        }
        return e;
    }
    const isDataPatch = (p) => Reflect.has(p, "path");
    /**
     * 修改了对象或数组的patch，计算
     * 如果修改了数组的子元素，就上升到整个数组，因为数组的变化通过patch来反推太不准确了
     * patch本身已经是按计算并合并过的，这里不需要考虑合并问题
     * a.0.b.0.c --> a 变化
     * a.b.c --> a.b.c 变化，需要通知到a.b吗？因为如果不是进一步的依赖，那说明b就是primitive的
     */
    function calculateChangedPath(source, ps) {
        if (isArray(source)) {
            return [[""]]; // root
        }
        const result = [];
        ps.forEach((p) => {
            const i = p.path.findIndex((v, i) => {
                return (typeof v === "number" && isArray(get(source, p.path.slice(0, i + 1))));
            });
            if (i > -1) {
                result.push(p.path.slice(0, i));
            }
            else {
                result.push(p.path.slice());
            }
        });
        return result;
    }
    // execute in server side
    // export function getDiffExecution() {
    //   return getModelConfig().executeDiff
    // }
    // // execute in client side
    // export function getPostDiffToServer() {
    //   return getModelConfig().postDiffToServer
    // }
    let currentEnv = null;
    function setEnv(env) {
        currentEnv = env;
    }
    function getEnv() {
        return {
            client: currentEnv === "client",
            server: currentEnv === "server",
        };
    }
    exports.enableLog = false;
    function log(pre, ...rest) {
        if (exports.enableLog) {
            console.log(`[${process.env.TARGET || ""}] [${pre}]`, ...rest);
        }
    }
    function debuggerLog(open) {
        exports.enableLog = open;
    }
    function getDeps(f) {
        return f.__deps__;
    }
    function getName(f) {
        return f.__name__ || f.name;
    }
    function getNamespace(f) {
        return f.__namespace__;
    }
    function getNames(f) {
        return f.__names__;
    }
    function runGenerator(gen, onResume, onSuspend) {
        return co(gen, {
            onResume: onResume,
            onSuspend: onSuspend,
        });
    }
    function makeBatchCallback(fn) {
        let cancelNotify = () => { };
        return (...args) => {
            cancelNotify();
            cancelNotify = nextTick(() => {
                fn(...args);
            });
        };
    }
    function shortValue(v) {
        if (v === undefined) {
            return "@undef";
        }
        if (typeof v === "symbol") {
            return "@init";
        }
    }
    /**
     * because of Function in the Record is not serializable, so we need to merge it to initialArgs
     */
    function mergeInitialArgs(contextInitialArgs, args) {
        if (!Array.isArray(contextInitialArgs)) {
            return args;
        }
        if (!Array.isArray(args)) {
            return contextInitialArgs;
        }
        const len = Math.max(contextInitialArgs.length, args.length);
        const result = [];
        for (let i = 0; i < len; i++) {
            let contextInitialArg = contextInitialArgs[i];
            const arg = args[i];
            if (typeof contextInitialArg === "object" && typeof arg === "object") {
                Object.entries(arg).forEach(([k, v]) => {
                    if (typeof v === "function" && contextInitialArg[k] === undefined) {
                        contextInitialArg = Object.assign(Object.assign({}, contextInitialArg), { [k]: v });
                    }
                });
            }
            result.push(contextInitialArg);
        }
        return result;
    }

    var has = Object.prototype.hasOwnProperty
      , prefix = '~';

    /**
     * Constructor to create a storage for our `EE` objects.
     * An `Events` instance is a plain object whose properties are event names.
     *
     * @constructor
     * @private
     */
    function Events() {}

    //
    // We try to not inherit from `Object.prototype`. In some engines creating an
    // instance in this way is faster than calling `Object.create(null)` directly.
    // If `Object.create(null)` is not supported we prefix the event names with a
    // character to make sure that the built-in object properties are not
    // overridden or used as an attack vector.
    //
    if (Object.create) {
      Events.prototype = Object.create(null);

      //
      // This hack is needed because the `__proto__` property is still inherited in
      // some old browsers like Android 4, iPhone 5.1, Opera 11 and Safari 5.
      //
      if (!new Events().__proto__) prefix = false;
    }

    /**
     * Representation of a single event listener.
     *
     * @param {Function} fn The listener function.
     * @param {*} context The context to invoke the listener with.
     * @param {Boolean} [once=false] Specify if the listener is a one-time listener.
     * @constructor
     * @private
     */
    function EE(fn, context, once) {
      this.fn = fn;
      this.context = context;
      this.once = once || false;
    }

    /**
     * Add a listener for a given event.
     *
     * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
     * @param {(String|Symbol)} event The event name.
     * @param {Function} fn The listener function.
     * @param {*} context The context to invoke the listener with.
     * @param {Boolean} once Specify if the listener is a one-time listener.
     * @returns {EventEmitter}
     * @private
     */
    function addListener(emitter, event, fn, context, once) {
      if (typeof fn !== 'function') {
        throw new TypeError('The listener must be a function');
      }

      var listener = new EE(fn, context || emitter, once)
        , evt = prefix ? prefix + event : event;

      if (!emitter._events[evt]) emitter._events[evt] = listener, emitter._eventsCount++;
      else if (!emitter._events[evt].fn) emitter._events[evt].push(listener);
      else emitter._events[evt] = [emitter._events[evt], listener];

      return emitter;
    }

    /**
     * Clear event by name.
     *
     * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
     * @param {(String|Symbol)} evt The Event name.
     * @private
     */
    function clearEvent(emitter, evt) {
      if (--emitter._eventsCount === 0) emitter._events = new Events();
      else delete emitter._events[evt];
    }

    /**
     * Minimal `EventEmitter` interface that is molded against the Node.js
     * `EventEmitter` interface.
     *
     * @constructor
     * @public
     */
    function EventEmitter() {
      this._events = new Events();
      this._eventsCount = 0;
    }

    /**
     * Return an array listing the events for which the emitter has registered
     * listeners.
     *
     * @returns {Array}
     * @public
     */
    EventEmitter.prototype.eventNames = function eventNames() {
      var names = []
        , events
        , name;

      if (this._eventsCount === 0) return names;

      for (name in (events = this._events)) {
        if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
      }

      if (Object.getOwnPropertySymbols) {
        return names.concat(Object.getOwnPropertySymbols(events));
      }

      return names;
    };

    /**
     * Return the listeners registered for a given event.
     *
     * @param {(String|Symbol)} event The event name.
     * @returns {Array} The registered listeners.
     * @public
     */
    EventEmitter.prototype.listeners = function listeners(event) {
      var evt = prefix ? prefix + event : event
        , handlers = this._events[evt];

      if (!handlers) return [];
      if (handlers.fn) return [handlers.fn];

      for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) {
        ee[i] = handlers[i].fn;
      }

      return ee;
    };

    /**
     * Return the number of listeners listening to a given event.
     *
     * @param {(String|Symbol)} event The event name.
     * @returns {Number} The number of listeners.
     * @public
     */
    EventEmitter.prototype.listenerCount = function listenerCount(event) {
      var evt = prefix ? prefix + event : event
        , listeners = this._events[evt];

      if (!listeners) return 0;
      if (listeners.fn) return 1;
      return listeners.length;
    };

    /**
     * Calls each of the listeners registered for a given event.
     *
     * @param {(String|Symbol)} event The event name.
     * @returns {Boolean} `true` if the event had listeners, else `false`.
     * @public
     */
    EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
      var evt = prefix ? prefix + event : event;

      if (!this._events[evt]) return false;

      var listeners = this._events[evt]
        , len = arguments.length
        , args
        , i;

      if (listeners.fn) {
        if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);

        switch (len) {
          case 1: return listeners.fn.call(listeners.context), true;
          case 2: return listeners.fn.call(listeners.context, a1), true;
          case 3: return listeners.fn.call(listeners.context, a1, a2), true;
          case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
          case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
          case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
        }

        for (i = 1, args = new Array(len -1); i < len; i++) {
          args[i - 1] = arguments[i];
        }

        listeners.fn.apply(listeners.context, args);
      } else {
        var length = listeners.length
          , j;

        for (i = 0; i < length; i++) {
          if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);

          switch (len) {
            case 1: listeners[i].fn.call(listeners[i].context); break;
            case 2: listeners[i].fn.call(listeners[i].context, a1); break;
            case 3: listeners[i].fn.call(listeners[i].context, a1, a2); break;
            case 4: listeners[i].fn.call(listeners[i].context, a1, a2, a3); break;
            default:
              if (!args) for (j = 1, args = new Array(len -1); j < len; j++) {
                args[j - 1] = arguments[j];
              }

              listeners[i].fn.apply(listeners[i].context, args);
          }
        }
      }

      return true;
    };

    /**
     * Add a listener for a given event.
     *
     * @param {(String|Symbol)} event The event name.
     * @param {Function} fn The listener function.
     * @param {*} [context=this] The context to invoke the listener with.
     * @returns {EventEmitter} `this`.
     * @public
     */
    EventEmitter.prototype.on = function on(event, fn, context) {
      return addListener(this, event, fn, context, false);
    };

    /**
     * Add a one-time listener for a given event.
     *
     * @param {(String|Symbol)} event The event name.
     * @param {Function} fn The listener function.
     * @param {*} [context=this] The context to invoke the listener with.
     * @returns {EventEmitter} `this`.
     * @public
     */
    EventEmitter.prototype.once = function once(event, fn, context) {
      return addListener(this, event, fn, context, true);
    };

    /**
     * Remove the listeners of a given event.
     *
     * @param {(String|Symbol)} event The event name.
     * @param {Function} fn Only remove the listeners that match this function.
     * @param {*} context Only remove the listeners that have this context.
     * @param {Boolean} once Only remove one-time listeners.
     * @returns {EventEmitter} `this`.
     * @public
     */
    EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
      var evt = prefix ? prefix + event : event;

      if (!this._events[evt]) return this;
      if (!fn) {
        clearEvent(this, evt);
        return this;
      }

      var listeners = this._events[evt];

      if (listeners.fn) {
        if (
          listeners.fn === fn &&
          (!once || listeners.once) &&
          (!context || listeners.context === context)
        ) {
          clearEvent(this, evt);
        }
      } else {
        for (var i = 0, events = [], length = listeners.length; i < length; i++) {
          if (
            listeners[i].fn !== fn ||
            (once && !listeners[i].once) ||
            (context && listeners[i].context !== context)
          ) {
            events.push(listeners[i]);
          }
        }

        //
        // Reset the array, or remove it completely if we have no more listeners.
        //
        if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
        else clearEvent(this, evt);
      }

      return this;
    };

    /**
     * Remove all listeners, or those of the specified event.
     *
     * @param {(String|Symbol)} [event] The event name.
     * @returns {EventEmitter} `this`.
     * @public
     */
    EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
      var evt;

      if (event) {
        evt = prefix ? prefix + event : event;
        if (this._events[evt]) clearEvent(this, evt);
      } else {
        this._events = new Events();
        this._eventsCount = 0;
      }

      return this;
    };

    //
    // Alias methods names because people roll like that.
    //
    EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
    EventEmitter.prototype.addListener = EventEmitter.prototype.on;

    //
    // Expose the prefix.
    //
    EventEmitter.prefixed = prefix;

    //
    // Allow `EventEmitter` to be imported as module namespace.
    //
    EventEmitter.EventEmitter = EventEmitter;

    immer.enablePatches();
    function freeze(target) {
        if (target._hook) {
            target._hook.freezed = true;
        }
    }
    function unFreeze(target) {
        if (target._hook) {
            target._hook.freezed = false;
        }
    }
    function checkFreeze(target) {
        var _a;
        return ((_a = target._hook) === null || _a === void 0 ? void 0 : _a.freezed) === true;
    }
    class Watcher {
        constructor(target) {
            this.target = target;
            this.deps = new Map();
        }
        notify(dep, path, patches, reactiveChain) {
            const paths = this.deps.get(dep);
            const matched = paths === null || paths === void 0 ? void 0 : paths.some((p) => isEqual(p, path));
            if (matched) {
                this.target.notify(dep, patches, reactiveChain);
                return true;
            }
        }
        addDep(dep, path = []) {
            dep.addWatcher(this);
            if (path.length === 0) {
                path = [""];
            }
            let paths = this.deps.get(dep);
            if (paths) {
                const exist = paths.find((p) => p === path || isEqual(p, path));
                if (!exist) {
                    paths.push(path);
                }
            }
            else {
                paths = [path];
                this.deps.set(dep, [path]);
            }
            return () => {
                const paths = this.deps.get(dep);
                const existIndex = paths === null || paths === void 0 ? void 0 : paths.findIndex((p) => isEqual(p, path));
                if (paths && existIndex && existIndex > -1) {
                    paths === null || paths === void 0 ? void 0 : paths.splice(existIndex, 1);
                }
            };
        }
    }
    class Hook extends EventEmitter {
        constructor() {
            super(...arguments);
            this.watchers = new Set();
        }
        addWatcher(w) {
            this.watchers.add(w);
        }
    }
    function isState(h) {
        return h && (h._hook ? h._hook instanceof State : h instanceof State);
    }
    function isSignal(h) {
        return (h === null || h === void 0 ? void 0 : h._hook) && (h._hook instanceof Computed || h._hook instanceof State);
    }
    exports.EHookEvents = void 0;
    (function (EHookEvents) {
        EHookEvents["change"] = "change";
        EHookEvents["beforeCalling"] = "beforeCalling";
        EHookEvents["afterCalling"] = "afterCalling";
    })(exports.EHookEvents || (exports.EHookEvents = {}));
    function getValueSilently(s) {
        return s._internalValue;
    }
    function internalProxy(source, _internalValue, path = []) {
        if (underComputed()) {
            last(currentComputedStack).watcher.addDep(source, path);
            if (_internalValue && likeObject(_internalValue)) {
                const copyValue = shallowCopy(_internalValue);
                return new Proxy(copyValue, {
                    get(target, p) {
                        let value = Reflect.get(target, p);
                        if (typeof value === "function") {
                            value = value.bind(target);
                        }
                        return internalProxy(source, value, path.concat(p));
                    },
                });
            }
        }
        return _internalValue;
    }
    class State extends Hook {
        constructor(data) {
            super();
            this.modifiedTimestamp = Date.now();
            this.inputComputePatchesMap = new Map();
            this.contextName = "state";
            this.needContextValue = true;
            this.needCheckAndRefresh = false;
            this.applyComputeAsync = false;
            this._internalValue = data;
        }
        trigger(path = [""], patches, reactiveChain, triggeredSet) {
            if (!path || path.length === 0) {
                path = [""];
            }
            if (!triggeredSet) {
                triggeredSet = new Set();
            }
            this.watchers.forEach((w) => {
                if (triggeredSet === null || triggeredSet === void 0 ? void 0 : triggeredSet.has(w)) {
                    return;
                }
                if (w.notify(this, path, patches, reactiveChain)) {
                    triggeredSet === null || triggeredSet === void 0 ? void 0 : triggeredSet.add(w);
                }
            });
            return triggeredSet;
        }
        hasPatches(ic) {
            const arr = this.inputComputePatchesMap.get(ic);
            return arr && arr.length > 0;
        }
        get value() {
            if (currentInputCompute) {
                return this.getInputComputeDraftValue();
            }
            return internalProxy(this, this._internalValue);
        }
        update(v, patches, silent, reactiveChain) {
            const oldValue = this._internalValue;
            this._internalValue = v;
            const shouldTrigger = oldValue !== v && !isEqual(oldValue, v);
            if (shouldTrigger) {
                this.modifiedTimestamp = Date.now();
                this.emit(exports.EHookEvents.change, this);
            }
            reactiveChain === null || reactiveChain === void 0 ? void 0 : reactiveChain.update();
            if (silent) {
                return;
            }
            log(`[${this.name}][state.update] shouldTrigger=`, shouldTrigger, oldValue, v);
            // trigger only changed
            if (shouldTrigger) {
                const triggeredSet = this.trigger(undefined, undefined, reactiveChain);
                if (patches && patches.length > 0) {
                    const changedPathArr = calculateChangedPath(oldValue, patches);
                    changedPathArr
                        .filter((p) => p.length !== 0)
                        .forEach((path) => this.trigger(path, patches, reactiveChain, triggeredSet));
                }
            }
        }
        applyComputePatches(ic, reactiveChain) {
            var _a;
            let exist = this.inputComputePatchesMap.get(ic);
            if (exist) {
                this.inputComputePatchesMap.delete(ic);
                this.update(exist[0], (_a = exist[1]) === null || _a === void 0 ? void 0 : _a.filter(isDataPatch), false, reactiveChain);
            }
        }
        getInputComputeDraftValue() {
            let exist = this.inputComputePatchesMap.get(currentInputCompute);
            if (exist) {
                return exist[0];
            }
            else {
                if (isPrimtive(this._internalValue)) {
                    return this._internalValue;
                }
                return shallowCopy(this._internalValue);
            }
        }
        addComputePatches(value, patches) {
            if (currentInputCompute) {
                let exist = this.inputComputePatchesMap.get(currentInputCompute);
                if (!exist) {
                    exist = [value, []];
                }
                exist[0] = value;
                /**
                 * @TODO：need merging patches
                 */
                exist[1] = exist[1].concat(patches);
                this.inputComputePatchesMap.set(currentInputCompute, exist);
            }
            else {
                throw new Error("[Model.addComputePatches] must invoked under a InputCompute");
            }
        }
        checkAndRefresh() { }
    }
    class AsyncState extends State {
        constructor() {
            super(...arguments);
            this.init = true;
            this.getterPromise = null;
            this.asyncCount = 0;
        }
        startAsyncGetter() {
            this.asyncCount++;
            const currentCount = this.asyncCount;
            this.init = false;
            let resolve;
            this.getterPromise = new Promise((r) => (resolve = r));
            return {
                end: () => {
                    resolve();
                    this.getterPromise = null;
                },
                valid: () => {
                    return this.asyncCount <= currentCount;
                },
            };
        }
        get pending() {
            return !!this.getterPromise;
        }
    }
    /**
     * check if running inside a computed
     */
    let currentComputedStack = [];
    function underComputed() {
        return currentComputedStack.length > 0;
    }
    function pushComputed(c) {
        currentComputedStack.push(c);
    }
    function popComputed() {
        currentComputedStack.pop();
    }
    // just for unit test
    function setCurrentComputed(c) {
        currentComputedStack = c;
    }
    /**
     * Not real symbol because of the symbol can't be serialized by JSON.stringify
     */
    const ComputedInitialSymbol = "@@ComputedInitialSymbol";
    class Computed extends AsyncState {
        // @TODO: maybe here need trigger async optional setting
        constructor(getter) {
            super(ComputedInitialSymbol);
            this.getter = getter;
            this.batchRunCancel = () => { };
            this.watcher = new Watcher(this);
        }
        get value() {
            const callChain = currentReactiveChain === null || currentReactiveChain === void 0 ? void 0 : currentReactiveChain.addCall(this);
            // console.log(`[Computed.get] name=${this.name}, isInit=`, this._internalValue === ComputedInitialSymbol);
            if (this._internalValue === ComputedInitialSymbol) {
                this.tryModify(callChain);
            }
            const v = super.value;
            return v === ComputedInitialSymbol ? undefined : v;
        }
        run(innerReactiveChain) {
            pushComputed(this);
            // making sure the hook called by computed can register thier chain
            const r = ReactiveChain.withChain(innerReactiveChain, () => {
                return this.getter(this._internalValue);
            });
            popComputed();
            if (isPromise(r)) {
                const { end, valid } = this.startAsyncGetter();
                r.then((asyncResult) => {
                    if (valid()) {
                        this.update(asyncResult, [], false, innerReactiveChain);
                        end();
                    }
                });
            }
            else if (isGenerator(r)) {
                const { end, valid } = this.startAsyncGetter();
                runGenerator(r, () => pushComputed(this), () => popComputed()).then((asyncResult) => {
                    if (valid()) {
                        this.update(asyncResult, [], false, innerReactiveChain);
                        end();
                    }
                });
            }
            else {
                this.update(r, [], false, innerReactiveChain);
                /** @TODO this code need consider again.maybe need re-design */
                this.init = false;
            }
        }
        tryModify(reactiveChain) {
            this.run(reactiveChain === null || reactiveChain === void 0 ? void 0 : reactiveChain.add(this));
        }
        notify(h, p, reactiveChain) {
            /**
             * trigger synchronism
             */
            this.run(reactiveChain === null || reactiveChain === void 0 ? void 0 : reactiveChain.addNotify(this));
        }
        addDep(source, path) {
            this.watcher.addDep(source, path);
        }
    }
    Computed.underComputed = underComputed;
    /**
     * control global InputCompute while running
     */
    let currentInputCompute = null;
    const inputComputeStack = [];
    function getCurrentInputCompute() {
        return currentInputCompute;
    }
    function pushInputComputeStack(ic) {
        inputComputeStack.push(ic);
        currentInputCompute = ic;
    }
    function popInputComputeStack() {
        currentInputCompute = inputComputeStack[inputComputeStack.length - 2];
        return inputComputeStack.pop();
    }
    class InputCompute extends Hook {
        constructor(getter, 
        /** @TODO should not couple the "scope" */
        scope) {
            super();
            this.getter = getter;
            this.scope = scope;
            this.commitPromise = null;
        }
        inputFuncStart() { }
        commitComputePatches(reactiveChain) {
            if (this.commitPromise) {
                this.commitPromise = this.commitPromise.then(() => {
                    const r = this.scope.applyAllComputePatches(this, reactiveChain);
                    if (r === null || r === void 0 ? void 0 : r.some((p) => isPromise(p))) {
                        return Promise.all(r).then();
                    }
                });
                return [this.commitPromise];
            }
            const r = this.scope.applyAllComputePatches(this, reactiveChain);
            if (r === null || r === void 0 ? void 0 : r.some((p) => isPromise(p))) {
                this.commitPromise = Promise.all(r).then();
            }
            return r;
        }
        inputFuncEnd(reactiveChain) {
            const r = this.commitComputePatches(reactiveChain);
            unFreeze({ _hook: this });
            this.emit(exports.EHookEvents.afterCalling, this);
            if (r === null || r === void 0 ? void 0 : r.some((p) => isPromise(p))) {
                return Promise.all(r).then((r) => {
                    this.commitPromise = null;
                });
            }
            return Promise.resolve();
        }
        run(...args) {
            return __awaiter(this, void 0, void 0, function* () {
                this.emit(exports.EHookEvents.beforeCalling, this);
                const isFreeze = checkFreeze({ _hook: this });
                if (isFreeze) {
                    return;
                }
                // confirm：the composed inputCompute still running under the parent inputCompute
                // if (!currentInputCompute) {
                //   currentInputCompute = this
                // }
                // means that current IC is nested in other IC.
                if (currentInputCompute) {
                    const r = currentInputCompute.commitComputePatches(currentReactiveChain);
                    if (r === null || r === void 0 ? void 0 : r.some((p) => isPromise(p))) {
                        yield Promise.all(r);
                    }
                }
                pushInputComputeStack(this);
                const newReactiveChain = currentReactiveChain === null || currentReactiveChain === void 0 ? void 0 : currentReactiveChain.addCall(this);
                const funcResult = ReactiveChain.withChain(newReactiveChain, () => {
                    return this.getter(...args);
                });
                popInputComputeStack();
                // if (currentInputCompute === this) {
                //   currentInputCompute = null
                // }
                log("[InputCompute.run]", `isGen=${isGenerator(funcResult)}`, `isP=${isPromise(funcResult)}`);
                // use generator
                if (isGenerator(funcResult)) {
                    let generatorPreservedCurrentReactiveChain;
                    yield runGenerator(funcResult, 
                    // enter: start/resume
                    () => {
                        // if (!currentInputCompute) {
                        //   currentInputCompute = this
                        // }
                        pushInputComputeStack(this);
                        generatorPreservedCurrentReactiveChain = currentReactiveChain;
                        currentReactiveChain = newReactiveChain;
                    }, 
                    // leave: stop/suspend
                    () => {
                        // tip: inputCompute supporting nestly compose other inputCompute
                        // if (currentInputCompute === this) {
                        //   currentInputCompute = null
                        // }
                        popInputComputeStack();
                        currentReactiveChain = generatorPreservedCurrentReactiveChain;
                    });
                    return this.inputFuncEnd(newReactiveChain);
                }
                else if (isPromise(funcResult)) {
                    // end compute context in advance
                    yield funcResult;
                    return this.inputFuncEnd(newReactiveChain);
                }
                if (currentInputCompute === this) {
                    currentInputCompute = null;
                }
                return this.inputFuncEnd(newReactiveChain);
            });
        }
    }
    class AsyncInputCompute extends InputCompute {
        constructor() {
            super(...arguments);
            this.init = true;
            this.getterPromise = null;
            this.asyncCount = 0;
        }
        startAsyncGetter() {
            this.asyncCount++;
            let currentCount = this.asyncCount;
            this.init = false;
            let resolve;
            this.getterPromise = new Promise((r) => (resolve = r));
            return {
                end: () => {
                    resolve();
                    this.getterPromise = null;
                },
                valid: () => {
                    return this.asyncCount <= currentCount;
                },
            };
        }
        get pending() {
            return !!this.getterPromise;
        }
    }
    /**
     * ScopeContext designed for serialization
     */
    class RunnerContext {
        constructor(driverName, args, initialContext) {
            this.driverName = driverName;
            this.args = args;
            this.initialData = null;
            this.initialArgList = mergeInitialArgs(initialContext === null || initialContext === void 0 ? void 0 : initialContext.initialArgList, args);
            this.withInitialContext = !!initialContext;
            if (initialContext) {
                this.initialData = initialContext["data"];
                this.triggerHookIndex = initialContext.index;
                this.triggerHookName = initialContext.indexName;
                // args in context has higher priority
                if (initialContext.args) {
                    this.args = initialContext.args;
                }
            }
        }
        /**
         * update args means the context had enter into update life cycle
         */
        updateInitialArgList(args, data) {
            this.initialArgList = args;
            this.withInitialContext = true;
            this.initialData = data;
        }
        bindScope(scope) {
            this.scope = scope;
        }
        serialize(type) { }
        formatContextData(hooks, enable) {
            const hooksData = hooks.map((hook, i) => {
                if (hook && (!enable || enable(i))) {
                    if (hook instanceof Computed) {
                        return [
                            hook.name,
                            "computed",
                            getValueSilently(hook),
                            hook.modifiedTimestamp,
                        ];
                    }
                    if (hook instanceof InputCompute) {
                        return [hook.name, "inputCompute"];
                    }
                    if (hook instanceof State) {
                        if (hook.needContextValue) {
                            return [
                                hook.name,
                                hook.contextName,
                                getValueSilently(hook),
                                hook.modifiedTimestamp,
                            ];
                        }
                        return [hook.name, hook.contextName];
                    }
                }
                return [hook === null || hook === void 0 ? void 0 : hook.name, "unserialized"];
            });
            return hooksData;
        }
        /**
         * need deliver context principles, sort by priority:
         * 1.model/cache(server) needn't
         * 2.state
         * 3.related set/get
         */
        serializeAction(hooks, hookIndex, args, deps) {
            const h = hooks[hookIndex];
            const hookName = (h === null || h === void 0 ? void 0 : h.name) || "";
            const noDeps = deps.size === 0;
            const hooksData = this.formatContextData(hooks, (i) => noDeps || deps.has(i));
            return {
                initialArgList: this.initialArgList,
                name: this.driverName,
                data: hooksData,
                index: hookIndex === -1 ? undefined : hookIndex,
                indexName: hookName,
                args: args || [],
            };
        }
        serializePatch(hooks) {
            const hooksData = this.formatContextData(hooks);
            // const p = statePatchEvents.toArray()
            return {
                initialArgList: this.initialArgList,
                name: this.driverName,
                data: hooksData,
                // patch: p
            };
        }
        serializeBase(hooks) {
            const hooksData = this.formatContextData(hooks);
            return {
                initialArgList: this.initialArgList,
                name: this.driverName,
                data: hooksData,
            };
        }
        apply(hooks, c, needUpdateCallback) {
            const contextData = c.data;
            /** @TODO runContext shouldnt care the update logic */
            contextData.forEach(([name, type, value, timestamp], index) => {
                if (isDef(value)) {
                    const state = hooks[index];
                    switch (type) {
                        case "unserialized":
                            break;
                        default:
                            /**
                             * default to keep silent because of deliver total context now
                             */
                            needUpdateCallback(state, value, timestamp);
                            break;
                    }
                }
            });
        }
    }
    class Runner {
        constructor(driver, options) {
            this.driver = driver;
            this.ScopeConstructor = CurrentRunnerScope;
            this.options = {
                believeContext: false,
                updateCallbackSync: false,
                applyComputeParallel: false,
                plugin: null,
            };
            Object.assign(this.options, options);
        }
        prepareScope(args, initialContext, plugin) {
            const context = new RunnerContext(getName(this.driver), args, initialContext);
            const deps = getDeps(this.driver);
            const names = getNames(this.driver);
            const scope = new this.ScopeConstructor(context, deps, names, plugin || this.options.plugin, this.options);
            return scope;
        }
        executeDriver(scope) {
            const { withInitialContext } = scope.runnerContext;
            if (withInitialContext) {
                exports.currentHookFactory = updateHookFactory;
            }
            else {
                exports.currentHookFactory = mountHookFactory;
            }
            currentRunnerScope = scope;
            const result = executeDriver(this.driver, scope.runnerContext.initialArgList);
            currentRunnerScope = null;
            scope.applyDepsMap();
            // do execute effect.maybe from model/cache
            scope.flushEffects();
            return result;
        }
        /**
         * @TODO need to refact because of this function should both return result and scope
         */
        init(args, initialContext) {
            const scope = this.prepareScope(args, initialContext);
            this.scope = scope;
            const result = this.executeDriver(scope);
            return result;
        }
        run(args) {
            this.scope.updateContext(args);
            const result = this.executeDriver(this.scope);
            return result;
        }
        mount(args, initialContext) {
            return this.init(args, initialContext);
        }
        update(initialContext) {
            return this.init(undefined, initialContext);
        }
        /**
         * @TODO after init method refactor. shouldnt callHook through runner but scope
         */
        callHook(hookIndex, args) {
            var _a;
            return (_a = this.scope) === null || _a === void 0 ? void 0 : _a.callHook(hookIndex, args);
        }
        state() {
            return this.scope.getState();
        }
        ready() {
            var _a;
            return (_a = this.scope) === null || _a === void 0 ? void 0 : _a.ready();
        }
        dispose() {
            var _a;
            return (_a = this.scope) === null || _a === void 0 ? void 0 : _a.dispose();
        }
    }
    function executeDriver(f, args = []) {
        const driverResult = f(...args);
        return driverResult;
    }
    const CacheInitialSymbol = "@@CacheInitialSymbol";
    class Cache extends AsyncState {
        constructor(key, options, scope) {
            super(CacheInitialSymbol);
            this.options = options;
            this.scope = scope;
            this.watcher = new Watcher(this);
            this.getterPromise = null;
            this.contextName = "cache";
            this.getterKey = key; // `tarat_cache_${scope.hookRunnerName}__${key}`
            if (this.options.source) {
                this.source = this.options.source._hook;
                this.watcher.addDep(this.source);
                const { _internalValue } = this.source;
                const initVal = isPrimtive(_internalValue)
                    ? _internalValue
                    : shallowCopy(_internalValue);
                super.update(initVal);
            }
        }
        notify(hook, p, reactiveChain) {
            const { from } = this.options;
            const { source } = this;
            if (hook && source && hook === source) {
                log("[Cache.notify] source changed");
                // not calling update prevent notify the watcher for current cache
                this._internalValue = CacheInitialSymbol;
                /**
                 * just clear value in cache not update directly
                 * reason 1: for lazy
                 * reason 2: prevent writing conflict while coccurent writing at same time
                 */
                this.scope.plugin
                    .getPlugin("Cache")
                    .clearValue(this.scope, this.getterKey, from);
                const newReactiveChain = reactiveChain === null || reactiveChain === void 0 ? void 0 : reactiveChain.addNotify(this);
                this.executeQuery(newReactiveChain);
            }
        }
        get value() {
            /** @TODO should use symbol for initial value */
            if (this._internalValue === CacheInitialSymbol) {
                this.executeQuery(currentReactiveChain);
            }
            const v = super.value;
            return v === CacheInitialSymbol ? undefined : v;
        }
        executeQuery(reactiveChain) {
            const _super = Object.create(null, {
                update: { get: () => super.update }
            });
            return __awaiter(this, void 0, void 0, function* () {
                const { from } = this.options;
                const { source } = this;
                const { end, valid } = this.startAsyncGetter();
                try {
                    const valueInCache = yield this.scope.plugin
                        .getPlugin("Cache")
                        .getValue(this.scope, this.getterKey, from);
                    if (!valid()) {
                        return;
                    }
                    log(`[${this.name || ""} Cache.executeQuery] valueInCache=`, valueInCache);
                    if (valueInCache !== undefined) {
                        _super.update.call(this, valueInCache, [], false, reactiveChain);
                    }
                    else if (source) {
                        const valueInSource = source.value;
                        _super.update.call(this, valueInSource, [], false, reactiveChain);
                        // unconcern the result of remote updating
                        this.scope.plugin
                            .getPlugin("Cache")
                            .setValue(this.scope, this.getterKey, valueInSource, from);
                    }
                }
                catch (e) {
                    log(`[Cache.executeQuery] error`);
                    console.error(e);
                }
                finally {
                    log(`[${this.name || ""} Cache.executeQuery]`);
                    if (valid()) {
                        end();
                    }
                }
            });
        }
        /**
         * call by outer
         * @param v new value
         * @param patches new value with patches
         * @param silent update value wont notify watcher
         * @param reactiveChain
         */
        update(v, patches, silent, reactiveChain) {
            const _super = Object.create(null, {
                update: { get: () => super.update }
            });
            return __awaiter(this, void 0, void 0, function* () {
                const { from } = this.options;
                const { source } = this;
                if (source) {
                    throw new Error('[Cache] can not update value directly while the cache has "source" in options ');
                }
                else {
                    _super.update.call(this, v, patches === null || patches === void 0 ? void 0 : patches.filter(isDataPatch), silent, reactiveChain);
                    yield this.scope.plugin
                        .getPlugin("Cache")
                        .setValue(this.scope, this.getterKey, v, from);
                    log(`[${this.name} cache.update] end k=${this.getterKey} v=${v}`);
                }
            });
        }
        addDep(source, path) {
            this.watcher.addDep(source, path);
        }
    }
    exports.EScopeState = void 0;
    (function (EScopeState) {
        EScopeState["init"] = "init";
        EScopeState["idle"] = "idle";
        EScopeState["pending"] = "pending";
    })(exports.EScopeState || (exports.EScopeState = {}));
    class CurrentRunnerScope extends EventEmitter {
        constructor(runnerContext, initialContextDeps, initialContextNames, plugin, op) {
            super();
            this.runnerContext = runnerContext;
            this.initialContextDeps = initialContextDeps;
            this.initialContextNames = initialContextNames;
            this.plugin = plugin;
            this.hooks = [];
            this.composes = []; // store the compose execute resutl
            // outerListeners: Function[] = []
            this.stateChangeCallbackRunning = false;
            this.stateChangeCallbackCancel = () => { };
            this.stateChangeWaitHooks = new Set();
            this.watcher = new Watcher(this);
            this.reactiveChainStack = [];
            /**
             * receive by runner options
             */
            this.believeContext = false;
            this.updateCallbackSync = false;
            this.applyComputeParallel = false;
            // modelIndexes: IModelIndexesBase | undefined = undefined
            // modelIndexesPath: string[] = []
            this.effectFuncArr = [];
            this.disposeFuncArr = [];
            runnerContext.bindScope(this);
            this.initializeHookSet();
            Object.assign(this, op);
        }
        /**
         * copy context value into scope for updateXXX hook
         */
        initializeHookSet() {
            const { runnerContext } = this;
            if (runnerContext.triggerHookIndex !== undefined &&
                typeof runnerContext.triggerHookIndex === "number" &&
                runnerContext.initialData.length > 0) {
                /** @TODO believe deps calculation from client.it's maybe dangerous' */
                const s = new Set([runnerContext.triggerHookIndex]);
                runnerContext.initialData.forEach((d, i) => {
                    if (d[1] !== "unserialized") {
                        s.add(i);
                    }
                });
                this.initialHooksSet = s;
            }
        }
        updateContext(args) {
            const data = this.runnerContext.formatContextData(this.hooks);
            this.runnerContext.updateInitialArgList(args, data);
        }
        triggerEnterComposeDriver(driverNamespace, driverName) {
            this.emit(CurrentRunnerScope.events.enterComposeDriver, {
                driverNamespace,
                driverName,
            });
            return () => {
                this.emit(CurrentRunnerScope.events.leaveComposeDriver, {
                    driverNamespace,
                    driverName,
                });
            };
        }
        effect(f) {
            this.once(CurrentRunnerScope.events.effect, (rc) => {
                f(rc);
            });
        }
        clearEffects() {
            this.off(CurrentRunnerScope.events.effect);
        }
        flushEffects() {
            if (!this.runnerContext.withInitialContext) {
                const reactiveChain = currentReactiveChain === null || currentReactiveChain === void 0 ? void 0 : currentReactiveChain.add(this);
                this.emit(CurrentRunnerScope.events.effect, reactiveChain);
            }
            else {
                this.off(CurrentRunnerScope.events.effect);
            }
        }
        appendDispose(f) {
            this.disposeFuncArr.push(f);
        }
        dispose() {
            this.disposeFuncArr.forEach((f) => f());
        }
        /**
         * call the executable hook: Model, InputCompute
         * @TODO the executable hook maybe need a abstract base class
         */
        callHook(hookIndex, args) {
            return __awaiter(this, void 0, void 0, function* () {
                log("[Scope.callHook] start");
                const hook = this.hooks[hookIndex];
                if (hook) {
                    // if (hook instanceof Model) {
                    // } else
                    if (hook instanceof Computed) {
                        currentReactiveChain = currentReactiveChain === null || currentReactiveChain === void 0 ? void 0 : currentReactiveChain.add(this);
                        hook.run(currentReactiveChain);
                    }
                    else if (hook instanceof InputCompute) {
                        currentReactiveChain = currentReactiveChain === null || currentReactiveChain === void 0 ? void 0 : currentReactiveChain.add(this);
                        yield hook.run(...args);
                    }
                }
                log("[Scope.callHook] end");
            });
        }
        /**
         * while enter UI will activate this function
         */
        activate() {
            this.notifyAllState();
        }
        deactivate() { }
        notifyAllState() {
            this.hooks.forEach((h) => {
                if (h instanceof State && h.needCheckAndRefresh) {
                    h.checkAndRefresh();
                }
            });
        }
        onUpdate(fn) {
            this.on(CurrentRunnerScope.events.update, fn);
            return () => {
                this.off(CurrentRunnerScope.events.update, fn);
            };
        }
        notifyOuter() {
            this.emit(CurrentRunnerScope.events.update);
        }
        notify(s) {
            if (this.updateCallbackSync) {
                this.notifyOuter();
            }
            else {
                this.stateChangeCallbackCancel();
                this.stateChangeCallbackCancel = nextTick(() => {
                    this.notifyOuter();
                });
            }
        }
        addDep(source, path) {
            this.watcher.addDep(source, path);
        }
        findHookIndex(hook) {
            return this.hooks.indexOf(hook);
        }
        addHook(v) {
            if (v && this.findHookIndex(v) > -1) {
                throw new Error("[scope.addHook] cant add repeat hook");
            }
            this.hooks.push(v);
            // assign name by inject deps
            let hookNames;
            if (this.initialContextNames) {
                hookNames = this.initialContextNames.find((arr) => arr[0] === this.hooks.length - 1);
            }
            if (v) {
                this.watcher.addDep(v);
                if (hookNames === null || hookNames === void 0 ? void 0 : hookNames[1]) {
                    v.name = hookNames[1];
                    v.index = hookNames[0];
                }
            }
            return hookNames || [];
        }
        applyDepsMap() {
            const deps = this.initialContextDeps;
            deps === null || deps === void 0 ? void 0 : deps.forEach(([name, hookIndex, getDeps]) => {
                getDeps.forEach((triggerHookIndex) => {
                    var _a, _b, _c;
                    let triggerHook;
                    if (Array.isArray(triggerHookIndex)) {
                        const [type, composeIndex, variableName] = triggerHookIndex;
                        if (type === "c") {
                            const setterGetterFunc = (_a = this.composes[composeIndex]) === null || _a === void 0 ? void 0 : _a[variableName];
                            triggerHook = this.hooks.find((h) => h === (setterGetterFunc === null || setterGetterFunc === void 0 ? void 0 : setterGetterFunc._hook));
                        }
                        // @TODO: maybe unknow case
                    }
                    else {
                        triggerHook = this.hooks[triggerHookIndex];
                    }
                    if (triggerHook) {
                        // make sure the hook had implement ITarget interface
                        (_c = (_b = this.hooks[hookIndex]) === null || _b === void 0 ? void 0 : _b.addDep) === null || _c === void 0 ? void 0 : _c.call(_b, triggerHook);
                    }
                });
            });
        }
        /**
         * offset compose names and current initial names
         */
        appendComposeNames(si, names) {
            if (!names) {
                return;
            }
            const len = names.length;
            const modifiedNames = (this.initialContextNames || []).map((a) => {
                const arr = cloneDeep(a);
                if (arr[0] >= si) {
                    arr[0] += len;
                }
                return arr;
            });
            const newOffsetNames = names.map((a) => {
                return [a[0] + si, a[1]];
            });
            this.initialContextNames = modifiedNames.concat(newOffsetNames);
        }
        offsetComposeIndex(originalIndex, newLength, icrement) {
            const offset = newLength - originalIndex;
            const endIndex = (this.initialContextDeps || []).length - icrement;
            if (offset > 0) {
                const originalDepsBeforeCompose = (this.initialContextDeps || []).slice(0, endIndex);
                const icrementDepsAfterCompose = (this.initialContextDeps || []).slice(endIndex);
                const modifiedOriginalDeps = originalDepsBeforeCompose.map((a) => {
                    const arr = cloneDeep(a);
                    if (arr[2]) {
                        arr[2] = arr[2].map((b) => {
                            if (Array.isArray(b)) {
                                if (b[0] === "c" && b[1] === originalIndex) {
                                    b[1] += offset;
                                }
                            }
                            return b;
                        });
                    }
                    if (arr[3]) {
                        arr[3] = arr[3].map((b) => {
                            if (b[0] === "c" && b[1] === originalIndex) {
                                b[1] += offset;
                            }
                            return b;
                        });
                    }
                    return arr;
                });
                this.initialContextDeps = modifiedOriginalDeps.concat(icrementDepsAfterCompose);
            }
        }
        /**
         * add compose deps to current driver.
         * plus current hook dep index
         */
        appendComposeDeps(si, ei, currentComposeLengh, deps) {
            if (!deps) {
                return;
            }
            const hooksInComposeSize = ei - si;
            const modifiedDeps = (this.initialContextDeps || []).map((a) => {
                const arr = cloneDeep(a);
                if (arr[1] >= si) {
                    arr[1] += hooksInComposeSize;
                }
                if (arr[2]) {
                    arr[2] = arr[2].map((v) => {
                        return typeof v === "number" && v >= si ? v + hooksInComposeSize : v;
                    });
                }
                if (arr[3]) {
                    arr[3] = arr[3].map((v) => {
                        return typeof v === "number" && v >= si ? v + hooksInComposeSize : v;
                    });
                }
                return arr;
            });
            const newModifiedDeps = deps.map((a) => {
                const arr = cloneDeep(a);
                arr[1] += si;
                if (arr[2]) {
                    arr[2] = arr[2].map((v) => typeof v === "number"
                        ? v + si
                        : [v[0], v[1] + currentComposeLengh, v[2]]);
                }
                if (arr[3]) {
                    arr[3] = arr[3].map((v) => typeof v === "number"
                        ? v + si
                        : [v[0], v[1] + currentComposeLengh, v[2]]);
                }
                return arr;
            });
            this.initialContextDeps = modifiedDeps.concat(newModifiedDeps);
        }
        applyAllComputePatches(currentInputCompute, reactiveChain) {
            const { applyComputeParallel, hooks } = this;
            const hookModified = hooks.filter((h) => {
                if (h && h.hasPatches) {
                    return h.hasPatches(currentInputCompute);
                }
            });
            if (hookModified.length) {
                let prevPromise = null;
                return hookModified.map((h) => {
                    const newChildChain = reactiveChain === null || reactiveChain === void 0 ? void 0 : reactiveChain.addUpdate(h);
                    if (applyComputeParallel || !h.applyComputeAsync) {
                        return h.applyComputePatches(currentInputCompute, newChildChain);
                    }
                    prevPromise = prevPromise
                        ? prevPromise.then(() => h.applyComputePatches(currentInputCompute, newChildChain))
                        : Promise.resolve(h.applyComputePatches(currentInputCompute, newChildChain));
                    return prevPromise;
                });
            }
            return [];
        }
        applyContextFromServer(c) {
            const { hooks } = this;
            this.runnerContext.apply(hooks, c, 
            // invoke while the target state is valid for updating
            (state, value, timestamp) => {
                var _a;
                (_a = state.update) === null || _a === void 0 ? void 0 : _a.call(state, value, [], true);
                if (value && timestamp) {
                    state.modifiedTimestamp = timestamp;
                }
            });
            this.notify();
        }
        getState() {
            const asyncHooks = this.hooks.filter((h) => h && Reflect.has(h, "getterPromise"));
            let notReadyHooks = asyncHooks.filter((h) => {
                return !!h.getterPromise;
            });
            return notReadyHooks.length === 0 ? exports.EScopeState.idle : exports.EScopeState.pending;
        }
        ready(specifies) {
            const asyncHooks = this.hooks.filter((h, i) => (specifies ? specifies.has(i) : true) &&
                ((h && Reflect.has(h, "getterPromise")) ||
                    h instanceof AsyncInputCompute ||
                    h instanceof AsyncState));
            let readyResolve;
            let readyPromise = new Promise((resolve) => (readyResolve = resolve));
            let max = asyncHooks.length * 2;
            let i = 0;
            function wait() {
                return __awaiter(this, void 0, void 0, function* () {
                    if (i++ > max) {
                        throw new Error("[Scope.ready] unexpect loop for ready");
                    }
                    let notReadyHooks = asyncHooks
                        .filter((h) => {
                        // if (h.getterPromise) {
                        //   console.log(h)
                        // }
                        return !!h.getterPromise;
                    })
                        .map((h) => h.getterPromise);
                    if (notReadyHooks.length === 0) {
                        readyResolve();
                    }
                    else {
                        yield Promise.all(notReadyHooks);
                        wait();
                    }
                });
            }
            wait();
            return readyPromise;
        }
    }
    CurrentRunnerScope.events = {
        enterComposeDriver: "enterComposeDriver",
        leaveComposeDriver: "leaveComposeDriver",
        update: "update",
        effect: "effect",
    };
    CurrentRunnerScope.getCurrent = () => currentRunnerScope;
    let currentRunnerScope = null;
    function getCurrentRunnerScope() {
        return currentRunnerScope;
    }
    /**
     *
     */
    let currentReactiveChain = undefined;
    function getCurrentReactiveChain() {
        return currentReactiveChain;
    }
    function startReactiveChain(name = "root") {
        currentReactiveChain = new ReactiveChain();
        currentReactiveChain.isRoot = true;
        currentReactiveChain.name = name;
        return currentReactiveChain;
    }
    function stopReactiveChain() {
        currentReactiveChain = undefined;
    }
    class ReactiveChain {
        constructor(parent, hook) {
            this.parent = parent;
            this.hook = hook;
            this.isRoot = false;
            this.allLeafCount = 0;
            this.order = 0;
            this.hasNewValue = false;
            this.children = [];
            this.order = (parent === null || parent === void 0 ? void 0 : parent.plusLeaf()) || 0;
            if (hook instanceof State) {
                this.oldValue = hook._internalValue;
            }
        }
        static withChain(chain, fn) {
            const oldCurrentReactiveChain = currentReactiveChain;
            currentReactiveChain = chain;
            const r = fn();
            currentReactiveChain = oldCurrentReactiveChain;
            return r;
        }
        plusLeaf() {
            if (this.isRoot) {
                this.allLeafCount += 1;
                return this.allLeafCount;
            }
            return this.parent.plusLeaf();
        }
        stop() {
            stopReactiveChain();
        }
        update() {
            if (this.hook instanceof State) {
                this.hasNewValue = true;
                this.newValue = this.hook._internalValue;
            }
        }
        add(trigger, key) {
            const childChain = new ReactiveChain(this, trigger);
            childChain.hookKey = key;
            this.children.push(childChain);
            if (currentRunnerScope) {
                if (trigger instanceof Hook) {
                    const index = currentRunnerScope.findHookIndex(trigger);
                    if (index > -1) {
                        childChain.hookIndex = index;
                    }
                }
            }
            return childChain;
        }
        addCall(trigger, key) {
            const childChain = this.add(trigger, key);
            childChain.type = "call";
            return childChain;
        }
        addNotify(trigger) {
            const childChain = this.add(trigger);
            childChain.type = "notify";
            return childChain;
        }
        addUpdate(child) {
            const childChain = this.add(child);
            childChain.type = "update";
            return childChain;
        }
        print() {
            const preLink = "|--> ";
            const preDec = "|-- ";
            const preHasNextSpace = "|  ";
            const preSpace = "   ";
            function dfi(current) {
                var _a, _b, _c;
                const isRunnerScope = current.hook instanceof CurrentRunnerScope;
                let currentName = ((_a = current.hook) === null || _a === void 0 ? void 0 : _a.constructor.name) || current.name || "";
                if (isRunnerScope) {
                    currentName = `\x1b[32m${currentName}\x1b[0m`;
                }
                if ((_b = current.hook) === null || _b === void 0 ? void 0 : _b.name) {
                    currentName = `${currentName}(${(_c = current.hook) === null || _c === void 0 ? void 0 : _c.name}${current.hookKey ? "." + current.hookKey : ""})`;
                }
                else if (isDef(current.hookIndex)) {
                    currentName = `${currentName}(${current.hookIndex})`;
                }
                if (current.type) {
                    currentName = `${current.type}: ${currentName}`;
                }
                currentName = `\x1b[32m${current.order}\x1b[0m.${currentName}`;
                const currentRows = [currentName];
                if (shortValue(current.oldValue)) {
                    currentRows.push(`${preDec}cur=${shortValue(current.oldValue)}`);
                }
                else {
                    currentRows.push(`${preDec}cur=${JSON.stringify(current.oldValue)}`);
                }
                if (current.hasNewValue) {
                    if (shortValue(current.newValue)) {
                        currentRows.push(`${preDec}new=${shortValue(current.newValue)}`);
                    }
                    else {
                        currentRows.push(`${preDec}new=${JSON.stringify(current.newValue)}`);
                    }
                }
                if (current.children.length > 0) {
                    const names = current.children.map(dfi);
                    const rows = [];
                    names.forEach((arr, i) => {
                        arr.forEach((childName, j) => {
                            if (j === 0) {
                                rows.push(`${preLink}${childName}`);
                            }
                            else {
                                if (names[i + 1]) {
                                    rows.push(`${preHasNextSpace}${childName}`);
                                }
                                else {
                                    rows.push(`${preSpace}${childName}`);
                                }
                            }
                        });
                    });
                    return [...currentRows, ...rows];
                }
                return [...currentRows];
            }
            const logRows = dfi(this);
            const shortLogRows = logRows.map((text) => {
                return text.length > 100 ? text.substring(0, 100) + "..." : text;
            });
            // console the chain log
            console.log(shortLogRows.join("\n"));
        }
    }
    ReactiveChain.getCurrent = () => currentReactiveChain;
    /**
     *
     *
     *
     *
     *
     * hook factory
     *
     *
     *
     *
     *
     *
     */
    const mountHookFactory = {
        state: mountState,
        cache: mountCache,
        computed: mountComputed,
        inputCompute: mountInputCompute,
        // alias
        signal,
        action: mountInputCompute,
    };
    const updateHookFactory = {
        state: updateState,
        cache: updateCache,
        computed: updateComputed,
        inputCompute: updateInputCompute,
        // alias
        signal,
        action: updateInputCompute,
    };
    exports.currentHookFactory = mountHookFactory;
    function getCurrentHookFactory() {
        return exports.currentHookFactory;
    }
    const hookFactoryFeatures = {
        /**
         * all hooks name list
         */
        all: Object.keys(mountHookFactory),
        /**
         * need other hook as data source
         */
        withSource: ["cache"],
        /**
         * manual calling by User or System
         */
        initiativeCompute: ["inputCompute", "action"],
    };
    function updateValidation() {
        if (!currentRunnerScope) {
            throw new Error("[updateValidation] update hook must under a <Runner>");
        }
        const { hooks, initialHooksSet } = currentRunnerScope;
        const currentIndex = hooks.length;
        const valid = !initialHooksSet || initialHooksSet.has(currentIndex);
        return {
            valid,
            currentIndex,
        };
    }
    function createUnAccessGetter(index, name) {
        const f = () => {
            throw new Error(`[update getter] cant access un initialized hook(${index}, ${name})`);
        };
        const newF = Object.assign(f, {
            _hook: null,
        });
        return newF;
    }
    function createStateSetterGetterFunc(s) {
        return (parameter) => {
            if (isDef(parameter)) {
                let result;
                let patches = [];
                if (isFunc(parameter)) {
                    const r = immer.produceWithPatches(s.value, parameter);
                    result = r[0];
                    patches = r[1];
                }
                else {
                    result = parameter;
                }
                if (currentInputCompute) {
                    s.addComputePatches(result, patches);
                }
                else {
                    const reactiveChain = currentReactiveChain === null || currentReactiveChain === void 0 ? void 0 : currentReactiveChain.addUpdate(s);
                    const isUnderComputed = underComputed();
                    s.update(result, patches, isUnderComputed, reactiveChain);
                }
                return [result, patches];
            }
            if (currentReactiveChain) {
                return ReactiveChain.withChain(currentReactiveChain.addCall(s), () => {
                    return s.value;
                });
            }
            return s.value;
        };
    }
    function createCacheSetterGetterFunc(c) {
        return (parameter) => {
            if (isDef(parameter)) {
                let result;
                let patches = [];
                if (isFunc(parameter)) {
                    const r = immer.produceWithPatches(c.value, parameter);
                    result = r[0];
                    patches = r[1];
                }
                else {
                    result = parameter;
                }
                if (currentInputCompute) {
                    c.addComputePatches(result, patches);
                }
                else {
                    const reactiveChain = currentReactiveChain === null || currentReactiveChain === void 0 ? void 0 : currentReactiveChain.addUpdate(c);
                    const isUnderComputed = underComputed();
                    c.update(result, patches, isUnderComputed, reactiveChain);
                }
                return [result, patches];
            }
            if (currentReactiveChain) {
                return ReactiveChain.withChain(currentReactiveChain.addCall(c), () => {
                    return c.value;
                });
            }
            return c.value;
        };
    }
    function updateState(initialValue) {
        var _a, _b;
        const { valid, currentIndex } = updateValidation();
        initialValue =
            (_a = currentRunnerScope.runnerContext.initialData[currentIndex]) === null || _a === void 0 ? void 0 : _a[2];
        // undefined means this hook wont needed in this progress
        if (!valid) {
            const [_, name] = currentRunnerScope.addHook(undefined);
            return createUnAccessGetter(currentIndex, name);
        }
        const timestamp = (_b = currentRunnerScope.runnerContext.initialData[currentIndex]) === null || _b === void 0 ? void 0 : _b[3];
        const hook = new State(initialValue);
        if (timestamp) {
            hook.modifiedTimestamp = timestamp;
        }
        const setterGetter = createStateSetterGetterFunc(hook);
        currentRunnerScope.addHook(hook);
        currentReactiveChain === null || currentReactiveChain === void 0 ? void 0 : currentReactiveChain.add(hook);
        const newSetterGetter = Object.assign(setterGetter, {
            _hook: hook,
        });
        return newSetterGetter;
    }
    function mountState(initialValue) {
        const hook = new State(initialValue);
        const setterGetter = createStateSetterGetterFunc(hook);
        currentRunnerScope === null || currentRunnerScope === void 0 ? void 0 : currentRunnerScope.addHook(hook);
        currentReactiveChain === null || currentReactiveChain === void 0 ? void 0 : currentReactiveChain.add(hook);
        const newSetterGetter = Object.assign(setterGetter, {
            _hook: hook,
        });
        return newSetterGetter;
    }
    function updateCache(key, options) {
        var _a, _b;
        const { valid, currentIndex } = updateValidation();
        if (!valid) {
            const [_, name] = currentRunnerScope.addHook(undefined);
            return createUnAccessGetter(currentIndex, name);
        }
        /** @TODO cache maybe should has initial value */
        const hook = new Cache(key, options, currentRunnerScope);
        currentRunnerScope.addHook(hook);
        const initialValue = (_a = currentRunnerScope.runnerContext.initialData[currentIndex]) === null || _a === void 0 ? void 0 : _a[2];
        const timestamp = (_b = currentRunnerScope.runnerContext.initialData[currentIndex]) === null || _b === void 0 ? void 0 : _b[3];
        if (initialValue !== undefined) {
            hook._internalValue = initialValue;
            if (timestamp) {
                hook.modifiedTimestamp = timestamp;
            }
        }
        const setterGetter = createCacheSetterGetterFunc(hook);
        const newSetterGetter = Object.assign(setterGetter, {
            _hook: hook,
        });
        return newSetterGetter;
    }
    function mountCache(key, options) {
        const hook = new Cache(key, options, currentRunnerScope);
        currentRunnerScope === null || currentRunnerScope === void 0 ? void 0 : currentRunnerScope.addHook(hook);
        currentReactiveChain === null || currentReactiveChain === void 0 ? void 0 : currentReactiveChain.add(hook);
        const setterGetter = createCacheSetterGetterFunc(hook);
        const newSetterGetter = Object.assign(setterGetter, {
            _hook: hook,
        });
        return newSetterGetter;
    }
    function updateComputed(fn) {
        var _a, _b;
        const { valid, currentIndex } = updateValidation();
        if (!valid) {
            const [_, name] = currentRunnerScope.addHook(undefined);
            return createUnAccessGetter(currentIndex, name);
        }
        const initialValue = (_a = currentRunnerScope.runnerContext.initialData[currentIndex]) === null || _a === void 0 ? void 0 : _a[2];
        const timestamp = (_b = currentRunnerScope.runnerContext.initialData[currentIndex]) === null || _b === void 0 ? void 0 : _b[3];
        const hook = new Computed(fn);
        currentRunnerScope.addHook(hook);
        // @TODO: update computed won't trigger
        hook._internalValue = initialValue;
        hook.init = false;
        if (timestamp) {
            hook.modifiedTimestamp = timestamp;
        }
        currentReactiveChain === null || currentReactiveChain === void 0 ? void 0 : currentReactiveChain.add(hook);
        const getter = () => {
            return hook.value;
        };
        const newGetter = Object.assign(getter, {
            _hook: hook,
        });
        return newGetter;
    }
    function mountComputed(fn) {
        const hook = new Computed(fn);
        currentRunnerScope === null || currentRunnerScope === void 0 ? void 0 : currentRunnerScope.addHook(hook);
        currentReactiveChain === null || currentReactiveChain === void 0 ? void 0 : currentReactiveChain.add(hook);
        const getter = () => {
            // console.log(`[mountComputed] name=${hook.name} getter.value=${hook.value}`);
            return hook.value;
        };
        const newGetter = Object.assign(getter, {
            _hook: hook,
        });
        return newGetter;
    }
    function updateInputCompute(func) {
        const { hooks, initialHooksSet } = currentRunnerScope;
        const currentIndex = hooks.length;
        const valid = !initialHooksSet || initialHooksSet.has(currentIndex);
        if (!valid) {
            const [_, name] = currentRunnerScope.addHook(undefined);
            return createUnAccessGetter(currentIndex, name);
        }
        return mountInputCompute(func);
    }
    function mountInputCompute(func) {
        const hook = new InputCompute(func, currentRunnerScope);
        currentRunnerScope === null || currentRunnerScope === void 0 ? void 0 : currentRunnerScope.addHook(hook);
        currentReactiveChain === null || currentReactiveChain === void 0 ? void 0 : currentReactiveChain.add(hook);
        const wrapFunc = (...args) => {
            return hook.run(...args);
        };
        wrapFunc._hook = hook;
        return wrapFunc;
    }
    function state(initialValue) {
        return exports.currentHookFactory.state(initialValue);
    }
    function computed(fn) {
        return exports.currentHookFactory.computed(fn);
    }
    function inputCompute(func) {
        if (!currentRunnerScope) {
            throw new Error("[inputCompute] must under a <Runner>");
        }
        const wrapFunc = exports.currentHookFactory.inputCompute(func);
        return wrapFunc;
    }
    function cache(key, options) {
        return exports.currentHookFactory.cache(key, options);
    }
    // export function signal<T = undefined>(): {
    //   (): T
    //   (parameter: IModifyFunction<T | undefined>): [any, IDataPatch[]]
    // } & { _hook: State<T | undefined> }
    function signal(v) {
        if (isFunc(v)) {
            return computed(v);
        }
        else {
            return state(v);
        }
    }
    const action = inputCompute;
    function onMount(fn) {
        if (!currentRunnerScope) {
            throw new Error("[onMount] must under a <Runner>");
        }
        if (!currentRunnerScope.runnerContext.withInitialContext) {
            fn();
        }
    }
    function onUpdate(fn) {
        if (!currentRunnerScope) {
            throw new Error("[onUpdate] must under a <Runner>");
        }
        if (currentRunnerScope.runnerContext.withInitialContext) {
            fn();
        }
    }
    function after(callback, targets, options) {
        callback = makeBatchCallback(callback);
        targets.forEach((target) => {
            if (target._hook) {
                if (target._hook instanceof InputCompute) {
                    target._hook.on(exports.EHookEvents.afterCalling, callback);
                }
                else {
                    target._hook.on(exports.EHookEvents.change, callback);
                }
            }
        });
        if (options === null || options === void 0 ? void 0 : options.immediate) {
            callback();
        }
        return () => {
            targets.forEach((target) => {
                if (target._hook) {
                    if (target._hook instanceof InputCompute) {
                        target._hook.off(exports.EHookEvents.afterCalling, callback);
                    }
                    else {
                        target._hook.off(exports.EHookEvents.change, callback);
                    }
                }
            });
        };
    }
    function before(callback, targets) {
        callback = makeBatchCallback(callback);
        targets.forEach((target) => {
            if (target._hook) {
                if (target._hook instanceof InputCompute) {
                    target._hook.on(exports.EHookEvents.beforeCalling, callback);
                }
            }
        });
        return () => {
            targets.forEach((target) => {
                if (target._hook) {
                    if (target._hook instanceof InputCompute) {
                        target._hook.off(exports.EHookEvents.beforeCalling, callback);
                    }
                }
            });
        };
    }
    function combineLatest(arr) {
        return () => {
            const latestState = arr.slice(1).reduce((latest, hook) => {
                const { _hook } = hook;
                if (!_hook) {
                    return latest;
                }
                if (!latest._hook) {
                    return hook;
                }
                if (_hook.modifiedTimestamp > latest._hook.modifiedTimestamp) {
                    return hook;
                }
                return latest;
            }, arr[0]);
            return latestState === null || latestState === void 0 ? void 0 : latestState();
        };
    }
    /**
     * using another Driver inside of Driver
     * the important thing is that should consider how to compose their depsMap
     */
    function compose(f, args) {
        if (!currentRunnerScope) {
            throw new Error("[compose] must run side of Driver");
        }
        const startIndex = currentRunnerScope.hooks.length;
        let names = getNames(f);
        const driverName = getName(f);
        const composeIndex = currentRunnerScope.composes.length;
        if (driverName && names) {
            names = names.map((arr) => [
                arr[0],
                `compose.${composeIndex}.${driverName}.${arr[1]}`,
            ]);
            currentRunnerScope.appendComposeNames(startIndex, names);
        }
        const endIndex = startIndex + names.length;
        const deps = getDeps(f);
        const originalDepsSize = (currentRunnerScope.initialContextDeps || []).length;
        currentRunnerScope.appendComposeDeps(startIndex, endIndex, composeIndex, deps);
        const driverNamespace = getNamespace(f);
        log("[compose] current = ", currentRunnerScope.runnerContext.driverName);
        const leaveCompose = currentRunnerScope.triggerEnterComposeDriver(driverNamespace, driverName);
        const insideResult = executeDriver(f, args);
        const afterEnterComposedLength = currentRunnerScope.composes.length;
        if (afterEnterComposedLength > composeIndex) {
            const latestDepsSize = (currentRunnerScope.initialContextDeps || []).length;
            // tip: there exist deeply composing in child compose driver
            currentRunnerScope.offsetComposeIndex(composeIndex, afterEnterComposedLength, latestDepsSize - originalDepsSize);
        }
        leaveCompose();
        currentRunnerScope.composes.push(insideResult);
        return insideResult;
    }
    function progress(getter) {
        const hook = getter._hook;
        return () => ({
            state: hook.init
                ? exports.EScopeState.init
                : hook.pending
                    ? exports.EScopeState.pending
                    : exports.EScopeState.idle,
        });
    }
    function dispose(f) {
        if (!currentRunnerScope) {
            throw new Error("[dispose] must run inside of Driver");
        }
        currentRunnerScope.appendDispose(f);
    }

    /**
     * provide a default CachePlugin for distribution different cahce type
     */
    const defaultCachePlugin = (plugin) => ({
        getValue(scope, k, from) {
            return __awaiter(this, void 0, void 0, function* () {
                return plugin.getPlugin(from).get(scope, k);
            });
        },
        setValue(scope, k, v, from) {
            return plugin.getPlugin(from).set(scope, k, v);
        },
        clearValue(scope, k, from) {
            plugin.getPlugin(from).clear(scope, k);
        },
    });
    class Plugin {
        constructor() {
            this.plugins = {};
            const cachePlugin = defaultCachePlugin(this);
            this.loadPlugin("Cache", cachePlugin);
        }
        clearPlugins() {
            const { plugins } = this;
            Object.keys(plugins).forEach((k) => {
                delete plugins[k];
            });
        }
        getPlugin(k) {
            const { plugins } = this;
            const plugin = plugins[k];
            if (!plugin) {
                throw new Error(`[getPlugin] name=${k} is not found`);
            }
            return plugin;
        }
        loadPlugin(k, p) {
            const { plugins } = this;
            plugins[k] = p;
        }
    }

    Object.defineProperty(exports, 'applyPatches', {
        enumerable: true,
        get: function () { return immer.applyPatches; }
    });
    Object.defineProperty(exports, 'produceWithPatches', {
        enumerable: true,
        get: function () { return immer.produceWithPatches; }
    });
    exports.AsyncState = AsyncState;
    exports.Cache = Cache;
    exports.CacheInitialSymbol = CacheInitialSymbol;
    exports.Computed = Computed;
    exports.ComputedInitialSymbol = ComputedInitialSymbol;
    exports.CurrentRunnerScope = CurrentRunnerScope;
    exports.EventEmitter = EventEmitter;
    exports.Hook = Hook;
    exports.InputCompute = InputCompute;
    exports.Plugin = Plugin;
    exports.ReactiveChain = ReactiveChain;
    exports.Runner = Runner;
    exports.RunnerContext = RunnerContext;
    exports.State = State;
    exports.Watcher = Watcher;
    exports.action = action;
    exports.after = after;
    exports.applyPatchesToObject = applyPatchesToObject;
    exports.before = before;
    exports.cache = cache;
    exports.calculateChangedPath = calculateChangedPath;
    exports.checkFreeze = checkFreeze;
    exports.cloneDeep = cloneDeep;
    exports.combineLatest = combineLatest;
    exports.compose = compose;
    exports.computed = computed;
    exports.debuggerLog = debuggerLog;
    exports.deleteKey = deleteKey;
    exports.dispose = dispose;
    exports.findWithDefault = findWithDefault;
    exports.freeze = freeze;
    exports.get = get;
    exports.getCurrentHookFactory = getCurrentHookFactory;
    exports.getCurrentInputCompute = getCurrentInputCompute;
    exports.getCurrentReactiveChain = getCurrentReactiveChain;
    exports.getCurrentRunnerScope = getCurrentRunnerScope;
    exports.getDeps = getDeps;
    exports.getEnv = getEnv;
    exports.getName = getName;
    exports.getNames = getNames;
    exports.getNamespace = getNamespace;
    exports.getOwnPropertyDescriptors = getOwnPropertyDescriptors;
    exports.hookFactoryFeatures = hookFactoryFeatures;
    exports.inputCompute = inputCompute;
    exports.internalProxy = internalProxy;
    exports.isArray = isArray;
    exports.isAsyncFunc = isAsyncFunc;
    exports.isDataPatch = isDataPatch;
    exports.isDef = isDef;
    exports.isEqual = isEqual;
    exports.isFunc = isFunc;
    exports.isGenerator = isGenerator;
    exports.isPrimtive = isPrimtive;
    exports.isPromise = isPromise;
    exports.isSignal = isSignal;
    exports.isState = isState;
    exports.isUndef = isUndef;
    exports.last = last;
    exports.likeObject = likeObject;
    exports.log = log;
    exports.makeBatchCallback = makeBatchCallback;
    exports.map = map;
    exports.mergeInitialArgs = mergeInitialArgs;
    exports.mountHookFactory = mountHookFactory;
    exports.nextTick = nextTick;
    exports.onMount = onMount;
    exports.onUpdate = onUpdate;
    exports.ownKeys = ownKeys;
    exports.progress = progress;
    exports.runGenerator = runGenerator;
    exports.set = set;
    exports.setCurrentComputed = setCurrentComputed;
    exports.setEnv = setEnv;
    exports.shallowCopy = shallowCopy;
    exports.shortValue = shortValue;
    exports.signal = signal;
    exports.startReactiveChain = startReactiveChain;
    exports.state = state;
    exports.stopReactiveChain = stopReactiveChain;
    exports.underComputed = underComputed;
    exports.updateHookFactory = updateHookFactory;
    exports.updateValidation = updateValidation;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=index.umd.js.map



(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@polymita/signal'), require('immer')) :
    typeof define === 'function' && define.amd ? define(['exports', '@polymita/signal', 'immer'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global["@polymita/signal-model"] = {}, global["@polymita/signal"], global.immer));
})(this, (function (exports, signal, immer) { 'use strict';

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function merge(...items) {
        return _merge(items[0] === true, false, items);
    }
    function clone(input) {
        if (Array.isArray(input)) {
            const output = [];
            for (let index = 0; index < input.length; ++index)
                output.push(clone(input[index]));
            return output;
        }
        else if (isPlainObject(input)) {
            const output = {};
            for (let index in input)
                output[index] = clone(input[index]);
            return output;
        }
        else {
            return input;
        }
    }
    function isPlainObject(input) {
        return input && typeof input === 'object' && !Array.isArray(input);
    }
    function _recursiveMerge(base, extend) {
        if (!isPlainObject(base))
            return extend;
        for (const key in extend) {
            if (key === '__proto__' || key === 'constructor' || key === 'prototype')
                continue;
            base[key] = (isPlainObject(base[key]) && isPlainObject(extend[key])) ?
                _recursiveMerge(base[key], extend[key]) :
                extend[key];
        }
        return base;
    }
    function _merge(isClone, isRecursive, items) {
        let result;
        if (isClone || !isPlainObject(result = items.shift()))
            result = {};
        for (let index = 0; index < items.length; ++index) {
            const item = items[index];
            if (!isPlainObject(item))
                continue;
            for (const key in item) {
                if (key === '__proto__' || key === 'constructor' || key === 'prototype')
                    continue;
                const value = isClone ? clone(item[key]) : item[key];
                result[key] = isRecursive ? _recursiveMerge(result[key], value) : value;
            }
        }
        return result;
    }

    const isModelPatch = (p) => !Reflect.has(p, 'path');
    function checkQueryWhere(where) {
        return where
            ? !Object.values(where).some(v => {
                if (typeof v === 'object') {
                    return !checkQueryWhere(v);
                }
                return v === undefined;
            })
            : true;
    }
    class DataGraphNode {
        constructor(id, type) {
            this.id = id;
            this.type = type;
            // relation types
            this.getBy = new Set();
            this.toSet = new Set();
            this.toCall = new Set();
        }
        addGetBy(n) {
            this.getBy.add(n);
        }
        addToSet(n) {
            this.toSet.add(n);
        }
        addToCall(n) {
            this.toCall.add(n);
        }
        get children() {
            return new Set([
                ...this.getBy,
                ...this.toSet,
                ...this.toCall
            ]);
        }
        getAllChildren(all = new Set()) {
            this.children.forEach(c => {
                if (!all.has(c)) {
                    all.add(c);
                    c.getAllChildren(all);
                }
            });
            return all;
        }
    }
    function dataGrachTraverse(source, callback) {
        function task(current, ancestors = []) {
            const r = callback(current, ancestors);
            if (r === false) {
                return false;
            }
            for (const v1 of current.children) {
                // prevent traverse circle
                if (ancestors.includes(v1)) {
                    continue;
                }
                const r = task(v1, ancestors.concat(current));
                if (r === false) {
                    return false;
                }
            }
        }
        for (const s of [].concat(source)) {
            const r = task(s);
            if (r === false) {
                break;
            }
        }
    }
    function findReactiveDenpendencies(ancestors) {
        if (ancestors.length >= 2) {
            let r = new Set();
            for (let index = ancestors.length - 1; index > 0; index--) {
                const last = ancestors[index];
                const prevLast = ancestors[index - 1];
                if (prevLast.getBy.has(last)) {
                    r.add(prevLast);
                }
                else {
                    break;
                }
            }
            return r;
        }
    }
    function getDependencies(rootNodes, id) {
        const dependencies = new Set();
        dataGrachTraverse([...rootNodes], (n, a) => {
            if (n.id === id) {
                const deps = findReactiveDenpendencies(a.concat(n));
                deps === null || deps === void 0 ? void 0 : deps.forEach(dn => {
                    dependencies.add(dn);
                });
            }
        });
        return dependencies;
    }
    function getTypeFromContextDeps(contextDeps, index) {
        const r = contextDeps.find(v => v[1] === index);
        return (r === null || r === void 0 ? void 0 : r[0]) || 'h';
    }
    function mapGraph(s) {
        const m = new Map();
        s.forEach(n => {
            m.set(n.id, n);
        });
        return m;
    }
    function mapGraphSetToIds(s) {
        return new Set([...s].map(n => n.id));
    }
    function getNextNodes(current) {
        return current.getAllChildren();
    }
    function getPrevNodes(rootNodes, current) {
        const prevNodes = new Set();
        dataGrachTraverse([...rootNodes], (n, ancestor) => {
            if (n.id === current.id) {
                ancestor.forEach(an => {
                    prevNodes.add(an);
                });
            }
        });
        return prevNodes;
    }
    function getPrevNodesWithFilter(rootNodes, current, filter) {
        const prevNodes = new Set();
        dataGrachTraverse([...rootNodes], (n, ancestor) => {
            if (n.id === current.id) {
                const onlyGetChain = filter(ancestor.concat(n));
                onlyGetChain.forEach(gn => {
                    if (gn.id !== current.id) {
                        prevNodes.add(gn);
                    }
                });
            }
        });
        return prevNodes;
    }
    function getDependentPrevNodes(rootNodes, current) {
        return getPrevNodesWithFilter(rootNodes, current, arr => {
            const len = arr.length;
            let i = len - 1;
            while (i >= 0) {
                const last = arr[i];
                const penultimate = arr[i - 1];
                if (!penultimate || !penultimate.getBy.has(last)) {
                    break;
                }
                i--;
            }
            return arr.slice(i);
        });
    }
    function getDependentPrevNodesWithBlock(rootNodes, current, blocks = new Set()) {
        return getPrevNodesWithFilter(rootNodes, current, arr => arr.some(v => blocks.has(v)) ? [] : arr);
    }
    function getShallowDependentPrevNodes(rootNodes, current) {
        return getPrevNodesWithFilter(rootNodes, current, arr => arr.length >= 2 ? [arr[arr.length - 2]] : []);
    }
    function getInfluencedNextNodesWithDependence(rootNodes, current, getDependent) {
        const nextNodes = new Set();
        dataGrachTraverse([...rootNodes], (n, ancestor) => {
            if (n.id === current.id) {
                const allChildren = n.getAllChildren();
                allChildren.forEach(cn => {
                    nextNodes.add(cn);
                    const currentDependentNodes = getDependent(cn, n);
                    currentDependentNodes.forEach(ccn => {
                        nextNodes.add(ccn);
                    });
                });
                return false;
            }
        });
        return nextNodes;
    }
    function getInfluencedNextNodes(rootNodes, current) {
        return getInfluencedNextNodesWithDependence(rootNodes, current, (current, trigger) => {
            return getDependentPrevNodesWithBlock(rootNodes, current, new Set([trigger]));
        });
    }
    function getShallowInfluencedNextNodes(rootNodes, current) {
        return getInfluencedNextNodesWithDependence(rootNodes, current, (current, trigger) => {
            return getShallowDependentPrevNodes(rootNodes, current);
        });
    }
    /**
     * 根据依赖组构建图数据结构
     * [
        ['ic', 2, [1], [0]],
        ['ic', 3, [1], [2, 1]]
     * ]
     * 转化为：
     *  1 -(get by)-> 2 -(set to)-> 0
     *             -> 3 -(set to)-> 1
     *                  -(call to)-> 2
     **/
    function constructDataGraph(contextDeps) {
        const nodesMap = new Map();
        const hasParentIds = new Set();
        contextDeps.forEach(([hookType, id, get, set]) => {
            let current = nodesMap.get(id);
            if (!current) {
                current = new DataGraphNode(id, hookType);
                nodesMap.set(id, current);
            }
            get === null || get === void 0 ? void 0 : get.forEach(idOrArr => {
                if (Array.isArray(idOrArr)) {
                    throw new Error(`[getRelatedIndexes] 1 not support compose. transform it to hook index before calling id=${id}`);
                }
                else {
                    let parent = nodesMap.get(idOrArr);
                    if (!parent) {
                        parent = new DataGraphNode(idOrArr, getTypeFromContextDeps(contextDeps, idOrArr));
                        nodesMap.set(idOrArr, parent);
                    }
                    hasParentIds.add(current.id);
                    parent.addGetBy(current);
                    // 检查环
                }
            });
            set === null || set === void 0 ? void 0 : set.forEach(idOrArr => {
                if (Array.isArray(idOrArr)) {
                    throw new Error(`[getRelatedIndexes] 2 not support compose. transform it to hook index before calling id=${id}`);
                }
                else {
                    let child = nodesMap.get(idOrArr);
                    if (!child) {
                        child = new DataGraphNode(idOrArr, getTypeFromContextDeps(contextDeps, idOrArr));
                        nodesMap.set(idOrArr, child);
                    }
                    if (child.type === 'ic') {
                        current.addToCall(child);
                    }
                    else {
                        current.addToSet(child);
                    }
                    const children = child.getAllChildren();
                    const isCycling = [...children].map(node => node.id).includes(current.id);
                    if (!isCycling) {
                        hasParentIds.add(child.id);
                    }
                }
            });
        });
        const rootNodes = new Set();
        for (const [id, n] of nodesMap) {
            if (!hasParentIds.has(id)) {
                rootNodes.add(n);
            }
        }
        return rootNodes;
    }
    function getRelatedIndexes(index, contextDeps) {
        const indexArr = [].concat(index);
        const deps = new Set(indexArr);
        const rootNodes = constructDataGraph(contextDeps);
        indexArr.forEach(index => {
            const nodes1 = getInfluencedNextNodes(rootNodes, { id: index });
            const nodes2 = getDependentPrevNodes(rootNodes, { id: index });
            [nodes1, nodes2].forEach(s => {
                s.forEach(n => {
                    deps.add(n.id);
                });
            });
        });
        return deps;
    }
    function getShallowRelatedIndexes(index, contextDeps) {
        const indexArr = [].concat(index);
        const deps = new Set(indexArr);
        const rootNodes = constructDataGraph(contextDeps);
        indexArr.forEach(index => {
            const nodes1 = getShallowInfluencedNextNodes(rootNodes, { id: index });
            const nodes2 = getShallowDependentPrevNodes(rootNodes, { id: index });
            [nodes1, nodes2].forEach(s => {
                s.forEach(n => {
                    deps.add(n.id);
                });
            });
        });
        return deps;
    }
    /**
     * model utilities
     */
    /**
     * 预处理patch，推导数组通过splice，找到被删除的元素。修正的patches语义已经跟immer冲突了，不能再二次使用
     * arr.splice(0, 1) -> 0 后面的全部前移，最后length = length -1 完成
     * 删除尾部，直接减少length
     * 删除非尾部, 尾部往前占位，再减少length
     *
     * 考虑新增：如果在删除的过程中又有新增，则新增会去占位已经删除的数据位置，如果通过equal来检查，有可能新增的值跟之前是一样的，如何确认这个数据是新增的还是旧的？
     *  站在DB的场景里思考：如果是含有id的一样，那对于DB来说就不是新增
     *    但可能的异常是：在乐观更新的机制下，新增了无id对象，在更新数据库的异步期间，又新增了，但是因为跟之前的本地内存里的，无id对象一样，误判成了是移动，最后导致异步期间的新增都无效了
     *      解决方法：乐观更新的model，在生产patch需要维护一个本地序列来生产
     */
    function preparePatches2(data, ps) {
        const lengthPatchIndexes = [];
        ps.forEach((p, i) => {
            const source = p.path.length === 1 ? data : signal.get(data, p.path.slice(0, -1));
            if (signal.isArray(source) && signal.last(p.path) === 'length') {
                lengthPatchIndexes.push([i, source, p.path.slice(0, -1)]);
            }
        });
        if (lengthPatchIndexes.length > 0) {
            const allInsertPatches = [];
            lengthPatchIndexes.forEach(([index, source, currentPath]) => {
                const newArrLength = ps[index].value;
                const sourcePatches = [];
                let startMovingIndex = index - 1;
                for (index - 1; startMovingIndex >= 0; startMovingIndex--) {
                    const p = ps[startMovingIndex];
                    const currentSource = p.path.length === 1 ? data : signal.get(data, p.path.slice(0, -1));
                    if (currentSource === source) {
                        sourcePatches.unshift(Object.assign(Object.assign({}, p), { path: p.path.slice(-1) }));
                    }
                    else {
                        break;
                    }
                }
                const newSource = immer.applyPatches(source, sourcePatches);
                const reservedPatches = [];
                const newInsertPatches = [];
                sourcePatches.forEach(p => {
                    // value: maybe add, reserve
                    // path: maybe remove, reserve (including length)
                    const { path, value } = p;
                    const existInOldIndex = source.findIndex((v) => signal.isEqual(v, value));
                    const existInNewIndex = newSource.findIndex((v) => signal.isEqual(v, value));
                    const alreadyReversed1 = reservedPatches.find(p => signal.isEqual(p.value, value));
                    // add
                    if (existInOldIndex === -1 && existInNewIndex > -1) {
                        newInsertPatches.push({
                            op: 'add',
                            value,
                            path: currentPath.concat(path)
                        });
                    }
                    else if (existInOldIndex > -1 && existInNewIndex > -1) {
                        if (!alreadyReversed1) {
                            reservedPatches.push({
                                op: 'replace',
                                value,
                                path: currentPath.concat(path)
                            });
                        }
                    }
                    const oldPathValue = signal.get(source, path);
                    const oldExistInNewIndex = newSource.findIndex((v) => signal.isEqual(v, oldPathValue));
                    const alreadyReversed2 = reservedPatches.find(p => signal.isEqual(p.value, oldPathValue));
                    if (oldExistInNewIndex > -1) {
                        if (!alreadyReversed2) {
                            reservedPatches.push({
                                op: 'replace',
                                value: oldPathValue,
                                path: currentPath.concat(path)
                            });
                        }
                    }
                    else {
                        newInsertPatches.push({
                            op: 'remove',
                            value: oldPathValue,
                            path: currentPath.concat(path)
                        });
                    }
                });
                // directly remove tail
                if (newArrLength < source.length) {
                    let si = newArrLength;
                    let reservedDataValuesMarks = reservedPatches.map(({ value }) => value);
                    while (si < source.length) {
                        const oldReservedLength = reservedDataValuesMarks.length;
                        // @TODO: immer的object是重新生成的，在引用上并不相等，所以需要isEqual
                        // 防止值被重复消费，因为数组的值有可能是重复的
                        reservedDataValuesMarks = reservedDataValuesMarks.filter(v => !signal.isEqual(source[si], v));
                        if (reservedDataValuesMarks.length === oldReservedLength) {
                            // 当前值不是要保留的值，标记“删除”
                            newInsertPatches.push({
                                op: 'remove',
                                value: source[si],
                                path: currentPath.concat(si)
                            });
                        }
                        si++;
                    }
                }
                // newInsertPatches.length must gt 1
                allInsertPatches.push([
                    startMovingIndex + 1,
                    index - startMovingIndex,
                    newInsertPatches
                ]);
            });
            let offset = 0;
            allInsertPatches.forEach(([st, length, arr]) => {
                ps.splice(st - offset, length, ...arr);
                offset = offset + length - arr.length;
            });
        }
        return ps;
    }
    /**
     * 根据patch计算diff，决定要进行的数据库操作
     */
    function calculateDiff(data, ps) {
        data = signal.cloneDeep(data);
        ps = preparePatches2(data, ps);
        let create = [];
        let update = [];
        const remove = [];
        ps.filter(p => p.path.length > 0).forEach(p => {
            if (p.path && p.path.length > 0) {
                const source = p.path.length === 1 ? data : signal.get(data, p.path.slice(0, -1));
                // CAUTION: 是不是太暴力
                const pathSkipArr = p.path.filter((k, i) => {
                    return !signal.isArray(signal.get(data, p.path.slice(0, i)));
                });
                const patchValue = Reflect.has(p, 'value') ? p.value : signal.get(data, p.path);
                /** 4种情况（针对model，没有数组 -> 数组的情况）
                 *
                 * 重点是区分: a.0.b  a.b  a.b.0   0.a.b ， 因为前面数组被过滤了，所以最终都是 a.b
                 *
                 * 取到的是current对象, root = { a:{ b:[x]} } -> root.a.b.0，对象->数组, source=array
                 *   x=object --> a.b
                 *   x=primitiv --> invalid
                 * root={a:{ b:x }} -> root.a.b 对象->对象, source=object
                 *   x=object --> a.b
                 *   x=primitive --> a
                 * root=[{ a: { b: x } }] -> root.0.a.b， 数组->对象->对象, source=object
                 *   x=object --> a.b
                 *   x=primitive --> a
                 * root=[{ a: [{ b: x }] }] -> root.a.0.b， 数组->对象, source=array
                 *   x=object -> a.b
                 *   x=primtive --> a
                 */
                const currentFieldPath = pathSkipArr
                    .slice(0, signal.likeObject(patchValue) ? Infinity : -1)
                    .join('.');
                const lastPathKey = p.path[p.path.length - 1];
                switch (p.op) {
                    case 'replace':
                        {
                            // cant handle the primitive patch in array
                            if (signal.isArray(source) && !signal.likeObject(patchValue)) {
                                return;
                            }
                            const exist = signal.findWithDefault(update, u => u.currentFieldPath === currentFieldPath, {
                                source,
                                value: {},
                                currentFieldPath
                            });
                            if (exist) {
                                if (signal.isArray(source)) {
                                    exist.value = patchValue; // should bring "id"
                                }
                                else {
                                    Object.assign(exist.value, {
                                        [lastPathKey]: patchValue
                                    });
                                }
                            }
                        }
                        break;
                    case 'add':
                        {
                            if (signal.isArray(source)) {
                                if (signal.likeObject(patchValue)) {
                                    create.push({
                                        source,
                                        value: patchValue,
                                        currentFieldPath
                                    });
                                }
                            }
                            else {
                                if (signal.likeObject(patchValue)) {
                                    create.push({
                                        source,
                                        value: patchValue,
                                        currentFieldPath
                                    });
                                }
                                else {
                                    const exist = signal.findWithDefault(update, u => u.currentFieldPath === currentFieldPath, {
                                        source,
                                        value: {},
                                        currentFieldPath
                                    });
                                    if (exist) {
                                        Object.assign(exist.value, {
                                            [lastPathKey]: patchValue
                                        });
                                    }
                                }
                            }
                        }
                        break;
                    case 'remove':
                        {
                            if (signal.likeObject(patchValue)) {
                                if (signal.isArray(source)) {
                                    remove.push({
                                        source,
                                        value: patchValue,
                                        currentFieldPath
                                    });
                                }
                                else {
                                    remove.push({
                                        source,
                                        value: patchValue,
                                        currentFieldPath
                                    });
                                }
                            }
                            else {
                                const exist = signal.findWithDefault(update, u => u.currentFieldPath === currentFieldPath, {
                                    source,
                                    value: {},
                                    currentFieldPath
                                });
                                if (exist) {
                                    Object.assign(exist.value, {
                                        [lastPathKey]: null
                                    });
                                }
                            }
                        }
                        break;
                }
            }
        });
        //combines
        remove.forEach(u => {
            create = create.filter(c => c.currentFieldPath === u.currentFieldPath);
            update = update.filter(c => c.currentFieldPath === u.currentFieldPath);
        });
        return {
            create,
            update,
            remove
        };
    }

    class ModelRunner extends signal.Runner {
        constructor(driver, options) {
            super(driver, options);
            this.driver = driver;
            this.ScopeConstructor = RunnerModelScope;
            this.scope = null;
        }
        prepareScope(args, initialContext, plugin) {
            return super.prepareScope(args, initialContext, plugin);
        }
    }
    let GlobalModelEvent = null;
    function getGlobalModelEvent() {
        return GlobalModelEvent;
    }
    function setGlobalModelEvent(me) {
        GlobalModelEvent = me;
    }
    class ModelEvent {
        constructor() {
            this.data = new Map();
            this.listeners = [];
        }
        subscribe(f) {
            this.listeners.push(f);
            return () => {
                const i = this.listeners.indexOf(f);
                this.listeners.splice(i, 1);
            };
        }
        from(arr) {
            this.data.clear();
            arr.forEach(([entity, record]) => {
                this.data.set(entity, record);
            });
            this.listeners.forEach(f => f());
        }
        toArray() {
            const arr = [];
            this.data.forEach((v, k) => {
                arr.push([k, v]);
            });
            return arr;
        }
        getRecord(m) {
            return this.data.get(m.entity);
        }
        pushPatch(m, p) {
            let record = this.data.get(m.entity);
            if (!record) {
                record = [];
                this.data.set(m.entity, record);
            }
            record.push({
                timing: Date.now(),
                patch: p
            });
        }
    }
    function getModelRunnerScope() {
        return signal.getCurrentRunnerScope();
    }
    class RunnerModelScope extends signal.CurrentRunnerScope {
        constructor(runnerContext, initialContextDeps, initialContextNames, plugin, op) {
            super(runnerContext, initialContextDeps, initialContextNames, plugin, op);
            this.runnerContext = runnerContext;
            this.initialContextDeps = initialContextDeps;
            this.initialContextNames = initialContextNames;
            this.plugin = plugin;
            this.modelIndexesPath = [];
            this.modelHookFactory = mountModelHookFactory;
            if (!this.runtime) {
                this.runtime = 'nodejs';
            }
            this.modelPatchEvents =
                this.runtime === 'nodejs' || !GlobalModelEvent
                    ? new ModelEvent()
                    : GlobalModelEvent;
            this.disposeFuncArr.push(this.modelPatchEvents.subscribe(() => {
                this.notifyAllModel();
            }));
            if (runnerContext.withInitialContext) {
                this.modelHookFactory = updateModelHookFactory;
            }
        }
        readyRelated(h) {
            const hi = this.getRelatedIndexesByHook(h, true);
            return this.ready(hi);
        }
        notifyAllModel() {
            this.hooks.forEach(h => {
                if (h instanceof Model) {
                    h.checkAndRefresh();
                }
            });
        }
        getRealEntityName(entityKey) {
            let result = entityKey;
            if (this.modelIndexes) {
                /**
                 * @TODO 当前工程下生成的modelIndex默认没有modelIndexesPath
                 */
                const subIndexes = signal.get(this.modelIndexes, this.modelIndexesPath);
                result = (subIndexes === null || subIndexes === void 0 ? void 0 : subIndexes[entityKey]) || entityKey;
            }
            signal.log(`[getRealEntityName] entityKey=${entityKey} modelIndexes=${!!this
            .modelIndexes} result=${result}`);
            return result;
        }
        applyContextFromServer(c) {
            var _a;
            super.applyContextFromServer(c);
            if ((_a = c.patch) === null || _a === void 0 ? void 0 : _a.length) {
                this.modelPatchEvents.from(c.patch);
            }
        }
        triggerEnterComposeDriver(driverNamespace, driverName) {
            this.modelIndexesPath.push(driverNamespace);
            const leave = super.triggerEnterComposeDriver(driverNamespace, driverName);
            return () => {
                this.modelIndexesPath.pop();
                leave();
            };
        }
        // transform compose deps to number index that will be convenient for next steps
        hookNumberIndexDeps() {
            const hookIndexDeps = this.initialContextDeps.map(([name, hi, getD, setD]) => {
                const [newGetD, newSetD] = [getD, setD].map(dependencies => {
                    return dependencies === null || dependencies === void 0 ? void 0 : dependencies.map(numOrArr => {
                        var _a;
                        if (Array.isArray(numOrArr) && numOrArr[0] === 'c') {
                            const [_, composeIndex, variableName] = numOrArr;
                            const setterGetterFunc = (_a = this.composes[composeIndex]) === null || _a === void 0 ? void 0 : _a[variableName];
                            if (setterGetterFunc === null || setterGetterFunc === void 0 ? void 0 : setterGetterFunc._hook) {
                                return this.findHookIndex(setterGetterFunc._hook);
                            }
                        }
                        return numOrArr;
                    }).filter(v => v !== undefined);
                });
                return [name, hi, newGetD, newSetD];
            });
            return hookIndexDeps;
        }
        /**
         * get all related hook index according to passive hookIndex
         * design logic:
         * 1.getD -> getD -> getD
         * 2.setD in who's getD -> getD
         */
        getRelatedHookIndexes(hookIndex) {
            if (!this.initialContextDeps) {
                return new Set();
            }
            const hookIndexDeps = this.hookNumberIndexDeps();
            /**
             * for the special performance case:
             * query on any async and client state eg: Client Model, ClientCache, ComputedInServer
             *  that will batch notify all watchers of it and
             *  doing these all operations in single request
             */
            const isModel = this.hooks[hookIndex] instanceof signal.AsyncState;
            if (isModel) {
                const indexArr = [];
                hookIndexDeps.forEach(([_, i, get, set]) => {
                    if (get.includes(hookIndex)) {
                        indexArr.push(i);
                    }
                });
                return getRelatedIndexes(indexArr, hookIndexDeps);
            }
            return getRelatedIndexes(hookIndex, hookIndexDeps);
        }
        getShallowRelatedHookIndexes(hookIndex) {
            if (!this.initialContextDeps) {
                return new Set();
            }
            const hookIndexDeps = this.hookNumberIndexDeps();
            const tailIndexes = getShallowRelatedIndexes(hookIndex, hookIndexDeps);
            return tailIndexes;
        }
        getDependenceByModel(indexes) {
            const result = new Set();
            const hookIndexDeps = this.hookNumberIndexDeps();
            const rootNodes = constructDataGraph(hookIndexDeps);
            const task = (currentIndexes) => {
                if (currentIndexes.size <= 0) {
                    return;
                }
                const modelHookIndexes = new Set();
                currentIndexes.forEach(i => {
                    if (this.hooks[i] instanceof Model) {
                        modelHookIndexes.add(i);
                    }
                });
                if (modelHookIndexes.size > 0) {
                    const nextModelIndexes = new Set();
                    modelHookIndexes.forEach(i => {
                        getShallowDependentPrevNodes(rootNodes, { id: i }).forEach(n => {
                            const r = result.has(n.id);
                            result.add(n.id);
                            if (this.hooks[n.id] instanceof Model && !r) {
                                nextModelIndexes.add(n.id);
                            }
                        });
                    });
                    task(nextModelIndexes);
                }
            };
            task(indexes);
            return result;
        }
        createBaseContext() {
            const { hooks } = this;
            return this.runnerContext.serializeBase(hooks);
        }
        getRelatedIndexesByHook(h, excludeSelf) {
            const hookIndex = this.findHookIndex(h);
            let deps = this.getRelatedHookIndexes(hookIndex);
            if (excludeSelf) {
                deps.delete(hookIndex);
            }
            return deps;
        }
        /**
         * as a response while receive a input context
         */
        createPatchContext() {
            const { hooks, modelPatchEvents } = this;
            const context = this.runnerContext.serializePatch(hooks);
            return Object.assign(Object.assign({}, context), { patch: modelPatchEvents.toArray() });
        }
        /**
         * as a input of other's Runner and trigger
         * need deliver context principles, sort by priority:
         * 1.model/cache(server) needn't
         * 2.state
         * 3.related set/get
         */
        createActionContext(h, args) {
            const { hooks } = this;
            const hookIndex = this.findHookIndex(h);
            let deps = new Set();
            if (h) {
                deps = this.getRelatedHookIndexes(hookIndex);
            }
            return this.runnerContext.serializeAction(hooks, hookIndex, args || [], deps);
        }
        createShallowActionContext(h, args) {
            const { hooks } = this;
            const hookIndex = this.findHookIndex(h);
            let deps = new Set();
            if (h) {
                deps = this.getShallowRelatedHookIndexes(hookIndex);
                /** model must need it's shallow dependent */
                if (deps.size > 0) {
                    const modelDeps = this.getDependenceByModel(deps);
                    modelDeps.forEach(v => {
                        deps.add(v);
                    });
                }
            }
            return this.runnerContext.serializeAction(hooks, hookIndex, args || [], deps);
        }
        // alias
        createInputComputeContext(h, args) {
            return this.createActionContext(h, args);
        }
    }
    class Model extends signal.AsyncState {
        constructor(entity, getter = undefined, options = {}, scope) {
            super([]);
            this.options = options;
            this.scope = scope;
            this.queryWhereComputed = null;
            this.watcher = new signal.Watcher(this);
            this.findGetters = [];
            this.entity = scope.getRealEntityName(entity);
            if (!getter) {
                getter = () => ({});
            }
            this.queryWhereComputed = new signal.Computed(getter);
            this.addDep(this.queryWhereComputed);
            // default to immediate
            if (options.immediate || options.immediate === undefined) {
                // do query after driver ready
                scope.effect((reactiveChain) => {
                    this.queryWhereComputed.name = `${this.name}.query`;
                    const newReactiveChain = reactiveChain === null || reactiveChain === void 0 ? void 0 : reactiveChain.add(this);
                    this.query(newReactiveChain);
                });
            }
        }
        injectFindGetter(fn) {
            this.findGetters.push(fn);
        }
        setGetter(fn) {
            this.queryWhereComputed.getter = fn;
        }
        addDep(source, path) {
            this.watcher.addDep(source, path);
        }
        notify(h, p, reactiveChain) {
            signal.log(`[${this.name}(${this.constructor.name}).executeQuery] withChain=${!!reactiveChain}`);
            const newReactiveChain = reactiveChain === null || reactiveChain === void 0 ? void 0 : reactiveChain.addNotify(this);
            this.executeQuery(newReactiveChain);
        }
        getQueryWhere(reactiveChain) {
            return __awaiter(this, void 0, void 0, function* () {
                if (this.queryWhereComputed.getterPromise) {
                    yield this.queryWhereComputed.getterPromise;
                }
                const queryWhereValue = signal.ReactiveChain.withChain(reactiveChain, () => {
                    return this.queryWhereComputed.value;
                });
                if (queryWhereValue) {
                    if (queryWhereValue === signal.ComputedInitialSymbol) {
                        // queryWhereComputed hadn't run.
                        this.query();
                    }
                    else {
                        const extra = this.findGetters.map(fn => fn()).filter(Boolean);
                        if (extra.length > 0) {
                            return extra.reduce((pre, current) => {
                                return merge(pre, current);
                            }, queryWhereValue);
                        }
                        return queryWhereValue;
                    }
                }
            });
        }
        get value() {
            if (this.init) {
                this.query(signal.getCurrentReactiveChain());
            }
            return super.value;
        }
        ready() {
            return __awaiter(this, void 0, void 0, function* () {
                if (this.getterPromise) {
                    yield this.getterPromise;
                }
            });
        }
        query(reactiveChain) {
            signal.log(`[${this.constructor.name}.query]`);
            if (!reactiveChain) {
                reactiveChain = signal.getCurrentReactiveChain();
            }
            if (this.queryWhereComputed) {
                this.queryWhereComputed.tryModify(reactiveChain);
            }
        }
        enableQuery() {
            return __awaiter(this, void 0, void 0, function* () {
                const q = yield this.getQueryWhere();
                q && checkQueryWhere(q);
                return !!q;
            });
        }
        applyComputePatches(ic, reactiveChain) {
            return __awaiter(this, void 0, void 0, function* () {
                const exist = this.inputComputePatchesMap.get(ic);
                if (exist) {
                    this.inputComputePatchesMap.delete(ic);
                    // @TODO：可以不用filter，因为已经用字段区分 dataPatch 和 modelPatch
                    const patches = exist[1].filter(signal.isDataPatch);
                    const newValue = signal.applyPatches(this._internalValue, patches);
                    yield this.updateWithPatches(newValue, patches, false, reactiveChain);
                }
            });
        }
    }
    exports.EnumWriteMethods = void 0;
    (function (EnumWriteMethods) {
        EnumWriteMethods["create"] = "create";
        EnumWriteMethods["update"] = "update";
        EnumWriteMethods["updateMany"] = "updateMany";
        EnumWriteMethods["upsert"] = "upsert";
        EnumWriteMethods["remove"] = "remove";
        EnumWriteMethods["find"] = "find";
    })(exports.EnumWriteMethods || (exports.EnumWriteMethods = {}));
    const writeInitialSymbol = ('@@writePrismaInitial');
    class WriteModel extends signal.AsyncState {
        constructor(sourceModelGetter, basicGetData, scope) {
            super(writeInitialSymbol);
            this.sourceModelGetter = sourceModelGetter;
            this.basicGetData = basicGetData;
            this.scope = scope;
            this.entity = '';
            this.extraGetters = {
                create: [],
                update: [],
                updateMany: [],
                upsert: [],
                remove: [],
                find: [] // useless
            };
            this.inputComputeModelPatchesMap = new Map();
            if (!basicGetData) {
                this.setGetter(() => ({}));
            }
            if (typeof sourceModelGetter !== 'string') {
                this.sourceModel = sourceModelGetter._hook;
                this.entity = sourceModelGetter._hook.entity;
            }
            else {
                this.entity = sourceModelGetter;
            }
            this.entity = scope.getRealEntityName(this.entity);
        }
        hasPatches(ic) {
            const r1 = super.hasPatches(ic);
            const arr = this.inputComputeModelPatchesMap.get(ic);
            return r1 || (arr && arr.length > 0);
        }
        refresh() {
            var _a, _b;
            /**
             * 在client -> server时，sourceModel不一定被同步序列化，而是createUnaccessibleModelGetter得到了一个空的
             */
            return (_b = (_a = this.sourceModel) === null || _a === void 0 ? void 0 : _a.refresh) === null || _b === void 0 ? void 0 : _b.call(_a);
        }
        injectGetter(fn, method) {
            if (method === 'find') {
                if (this.sourceModel instanceof Model) {
                    this.sourceModel.injectFindGetter(fn);
                }
            }
            else {
                this.extraGetters[method].push(fn);
            }
        }
        getData(method) {
            const arr = this.extraGetters[method];
            const base = this.basicGetData();
            // iterate array from tail to head
            for (let i = arr.length - 1; i >= 0; i--) {
                const fn = arr[i];
                if (fn) {
                    const data = fn();
                    Object.assign(base, data);
                }
            }
            return base;
        }
        setGetter(fn) {
            this.basicGetData = fn;
        }
        addModelPatches(value, patches) {
            const currentInputCompute = signal.getCurrentInputCompute();
            if (currentInputCompute) {
                let exist = this.inputComputeModelPatchesMap.get(currentInputCompute);
                if (!exist) {
                    exist = [value, []];
                }
                exist[0] = value;
                /**
                 * @TODO：need merging patches
                 */
                exist[1] = exist[1].concat(patches);
                this.inputComputeModelPatchesMap.set(currentInputCompute, exist);
            }
            else {
                throw new Error('[Model.addComputePatches] must invoked under a InputCompute');
            }
        }
        applyComputePatches(ic, reactiveChain) {
            return __awaiter(this, void 0, void 0, function* () {
                const exist = this.inputComputeModelPatchesMap.get(ic);
                if (exist) {
                    this.inputComputeModelPatchesMap.delete(ic);
                    const patches = exist[1].filter(isModelPatch);
                    const { end, valid } = this.startAsyncGetter();
                    yield this.executeModelPath(patches);
                    if (!valid()) {
                        return;
                    }
                    this.scope.modelPatchEvents.pushPatch(this, patches);
                    // TIP: must refresh after patch recording to make sure the modified time of model > patch time
                    signal.log('[WriteModel.applyComputePatches]', 'execute patches done');
                    yield this.refresh();
                    signal.log('[WriteModel.applyComputePatches]', 'sourceModel refresh done');
                    reactiveChain === null || reactiveChain === void 0 ? void 0 : reactiveChain.update();
                    end();
                }
            });
        }
    }
    /** TIP: code for example */
    class ClientModel extends Model {
    }
    /** TIP: code for example */
    class ClientWriteModel extends WriteModel {
    }
    /**
     * only used in writing data to model entity
     */
    const writePrismaInitialSymbol = Symbol.for('@@writePrismaInitial');
    class Prisma extends Model {
        constructor() {
            super(...arguments);
            this.identifier = 'prisma';
        }
        executeQuery(reactiveChain) {
            return __awaiter(this, void 0, void 0, function* () {
                const { end, valid } = this.startAsyncGetter();
                try {
                    // @TODO：要确保时序，得阻止旧的query数据更新
                    const q = yield this.getQueryWhere(reactiveChain);
                    if (!valid()) {
                        return;
                    }
                    signal.log(`[${this.name || ''} Model.executeQuery] 1 q.entity, q.query: `, this.entity, q);
                    let result = [];
                    if (!!q) {
                        if (valid()) {
                            result = yield this.scope.plugin.getPlugin('Model').find(this.identifier, this.entity, q);
                            signal.log(`[${this.name || ''} Model.executeQuery] 2 result: `, result);
                        }
                    }
                    if (valid()) {
                        this.update(result, [], false, reactiveChain);
                    }
                }
                catch (e) {
                    signal.log(`[${this.name || ''} Model.executeQuery] error`);
                    console.error(e);
                    throw e;
                }
                finally {
                    signal.log(`[${this.name || ''} Model.executeQuery] end`);
                    if (valid()) {
                        end();
                    }
                }
            });
        }
        exist(obj) {
            return __awaiter(this, void 0, void 0, function* () {
                const result = yield this.scope.plugin.getPlugin('Model').find(this.identifier, this.entity, { where: obj });
                return result[0];
            });
        }
        refresh() {
            var _a;
            return __awaiter(this, void 0, void 0, function* () {
                yield this.executeQuery((_a = signal.getCurrentReactiveChain()) === null || _a === void 0 ? void 0 : _a.add(this));
            });
        }
        updateWithPatches(v, patches, silent, reactiveChain) {
            return __awaiter(this, void 0, void 0, function* () {
                const oldValue = this._internalValue;
                if (!this.options.pessimisticUpdate) {
                    signal.log('[Model.updateWithPatches] update internal v=', v);
                    this.update(v, patches, silent, reactiveChain);
                }
                const { end } = this.startAsyncGetter();
                const { entity } = this;
                try {
                    const diff = calculateDiff(oldValue, patches);
                    signal.log('[Model.updateWithPatches] diff: ', diff);
                    yield this.scope.plugin.getPlugin('Model').executeDiff(this.identifier, entity, diff);
                }
                catch (e) {
                    console.info('[updateWithPatches] postPatches fail', e);
                    // @TODO autoRollback value
                    // if (this.options.autoRollback) {
                    //   this.update(oldValue, [], true)
                    // }
                }
                finally {
                    end();
                }
                yield this.executeQuery(reactiveChain);
            });
        }
        checkAndRefresh() {
            return __awaiter(this, void 0, void 0, function* () {
                // no need in server
            });
        }
    }
    class WritePrisma extends WriteModel {
        constructor() {
            super(...arguments);
            this.identifier = 'prisma';
        }
        executeModelPath(ps) {
            var _a;
            return __awaiter(this, void 0, void 0, function* () {
                const { applyComputeParallel } = this.scope;
                const opMap = {
                    create: (p) => this.scope.plugin.getPlugin('Model').create(this.identifier, this.entity, p.value),
                    update: (p) => this.scope.plugin.getPlugin('Model').update(this.identifier, this.entity, p.value),
                    updateMany: (p) => this.scope.plugin.getPlugin('Model').updateMany(this.identifier, this.entity, p.value),
                    upsert: (p) => this.scope.plugin.getPlugin('Model').upsert(this.identifier, this.entity, p.value),
                    remove: (p) => this.scope.plugin.getPlugin('Model').remove(this.identifier, this.entity, p.value)
                };
                let promiseArr = [];
                for (const p of ps) {
                    (_a = signal.getCurrentReactiveChain()) === null || _a === void 0 ? void 0 : _a.addCall(this, p.op);
                    const r = opMap[p.op](p);
                    if (applyComputeParallel) {
                        promiseArr.push(r);
                    }
                    else {
                        yield r;
                    }
                }
                if (promiseArr.length > 0) {
                    yield Promise.all(promiseArr);
                }
            });
        }
        createRow(obj, include) {
            var _a;
            return __awaiter(this, void 0, void 0, function* () {
                signal.log('[WritePrisma.createRow]');
                const newReactiveChain = (_a = signal.getCurrentReactiveChain()) === null || _a === void 0 ? void 0 : _a.addCall(this);
                const defaults = signal.ReactiveChain.withChain(newReactiveChain, () => {
                    return this.getData(exports.EnumWriteMethods.create);
                });
                if (signal.getCurrentInputCompute()) {
                    const d = Object.assign(defaults, obj);
                    this.addModelPatches(undefined, [
                        {
                            op: 'create',
                            value: {
                                data: d,
                                include
                            }
                        }
                    ]);
                }
                else {
                    throw new Error('[WritePrisma] must invoke "createRow" in a InputCompute');
                }
            });
        }
        updateManyRows(whereIds, obj) {
            var _a;
            return __awaiter(this, void 0, void 0, function* () {
                signal.log('[WritePrisma.updateManyRows]');
                if (signal.getCurrentInputCompute()) {
                    const newReactiveChain = (_a = signal.getCurrentReactiveChain()) === null || _a === void 0 ? void 0 : _a.addCall(this);
                    const defaults = signal.ReactiveChain.withChain(newReactiveChain, () => {
                        return this.getData(exports.EnumWriteMethods.updateMany);
                    });
                    const d = Object.assign(defaults, obj);
                    this.addModelPatches(undefined, [
                        {
                            op: 'updateMany',
                            value: {
                                where: { id: { in: whereIds } },
                                data: d
                            }
                        }
                    ]);
                }
                else {
                    throw new Error('[WritePrisma] must invoke "updateManyRows" in a InputCompute');
                }
            });
        }
        upsertRow(where, obj) {
            var _a;
            return __awaiter(this, void 0, void 0, function* () {
                signal.log('[WritePrisma.upsertRow]');
                if (signal.getCurrentInputCompute()) {
                    const newReactiveChain = (_a = signal.getCurrentReactiveChain()) === null || _a === void 0 ? void 0 : _a.addCall(this);
                    const defaults = signal.ReactiveChain.withChain(newReactiveChain, () => {
                        return this.getData(exports.EnumWriteMethods.upsert);
                    });
                    const d = Object.assign(defaults, obj);
                    const upsertWhere = typeof where === 'number' ? { id: where } : where;
                    this.addModelPatches(undefined, [
                        {
                            op: 'upsert',
                            value: {
                                where: upsertWhere,
                                create: d,
                                update: d
                            }
                        }
                    ]);
                }
                else {
                    throw new Error('[WritePrisma] must invoke "upsertRow" in a InputCompute');
                }
            });
        }
        updateRow(where, obj) {
            var _a;
            return __awaiter(this, void 0, void 0, function* () {
                signal.log('[WritePrisma.updateRow]');
                if (signal.getCurrentInputCompute()) {
                    const newReactiveChain = (_a = signal.getCurrentReactiveChain()) === null || _a === void 0 ? void 0 : _a.addCall(this);
                    const defaults = signal.ReactiveChain.withChain(newReactiveChain, () => {
                        return this.getData(exports.EnumWriteMethods.update);
                    });
                    const d = Object.assign(defaults, obj);
                    this.addModelPatches(undefined, [
                        {
                            op: 'update',
                            value: {
                                where: { id: where },
                                data: d
                            }
                        }
                    ]);
                }
                else {
                    throw new Error('[WritePrisma] must invoke "updateRow" in a InputCompute');
                }
            });
        }
        removeRow(where) {
            var _a;
            return __awaiter(this, void 0, void 0, function* () {
                signal.log('[WritePrisma.removeRow]');
                if (signal.getCurrentInputCompute()) {
                    const newReactiveChain = (_a = signal.getCurrentReactiveChain()) === null || _a === void 0 ? void 0 : _a.addCall(this);
                    const defaults = signal.ReactiveChain.withChain(newReactiveChain, () => {
                        return this.getData(exports.EnumWriteMethods.remove);
                    });
                    this.addModelPatches(undefined, [
                        {
                            op: 'remove',
                            value: {
                                where: { id: where || (defaults === null || defaults === void 0 ? void 0 : defaults.id) }
                            }
                        }
                    ]);
                }
                else {
                    throw new Error('[WritePrisma] must invoke "updateRow" in a InputCompute');
                }
            });
        }
    }
    class ClientPrisma extends Prisma {
        executeQuery() {
            return __awaiter(this, void 0, void 0, function* () {
                const { end } = this.startAsyncGetter();
                const valid = yield this.enableQuery();
                signal.log(`[ClientModel.executeQuery] valid=${valid} ignoreClientEnable=${this.options.ignoreClientEnable}`);
                // @TODO: ignoreClientEnable will useless
                if (valid || this.options.ignoreClientEnable) {
                    const context = this.scope.createActionContext(this);
                    signal.log('[ClientModel.executeQuery] before post');
                    const result = yield this.scope.plugin.getPlugin('Context').postQueryToServer(context);
                    const index = this.scope.findHookIndex(this);
                    if (result.data) {
                        const d = result.data[index];
                        if (d.length >= 2) {
                            this.update(d[2]);
                        }
                    }
                }
                end();
            });
        }
        updateWithPatches() {
            return __awaiter(this, void 0, void 0, function* () {
                throw new Error('[ClientPrisma] cant update in client');
            });
        }
        checkAndRefresh() {
            return __awaiter(this, void 0, void 0, function* () {
                const { modifiedTimestamp } = this;
                const patchEvent = this.scope.modelPatchEvents.getRecord(this);
                if (patchEvent &&
                    patchEvent.some(obj => {
                        return obj.timing > modifiedTimestamp;
                    })) {
                    this.refresh();
                }
            });
        }
    }
    /**
     * writePrisma in client will record the changing
     */
    class ClientWritePrisma extends WritePrisma {
        createRow(obj) {
            return __awaiter(this, void 0, void 0, function* () {
                throw new Error('[ClientWritePrisma] cant invoke "create" directly in client');
            });
        }
        updateRow(whereId, obj) {
            return __awaiter(this, void 0, void 0, function* () {
                throw new Error('[ClientWritePrisma] cant invoke "update" directly in client');
            });
        }
        updateManyRows(whereId, obj) {
            return __awaiter(this, void 0, void 0, function* () {
                throw new Error('[ClientWritePrisma] cant invoke "updateManyRows" directly in client');
            });
        }
        upsertRow(whereId, obj) {
            return __awaiter(this, void 0, void 0, function* () {
                throw new Error('[ClientWritePrisma] cant invoke "upsertRow" directly in client');
            });
        }
        removeRow(whereId) {
            return __awaiter(this, void 0, void 0, function* () {
                throw new Error('[ClientWritePrisma] cant invoke "remove" directly in client');
            });
        }
    }
    class AsyncInputCompute extends signal.InputCompute {
        constructor(getter, scope) {
            super(getter, scope);
            this.getter = getter;
            this.scope = scope;
            this.init = true;
            this.getterPromise = null;
            this.asyncCount = 0;
        }
        startAsyncGetter() {
            this.asyncCount++;
            let currentCount = this.asyncCount;
            this.init = false;
            let resolve;
            this.getterPromise = new Promise(r => (resolve = r));
            return {
                end: () => {
                    resolve();
                    this.getterPromise = null;
                },
                valid: () => {
                    return this.asyncCount <= currentCount;
                }
            };
        }
        get pending() {
            return !!this.getterPromise;
        }
    }
    class InputComputeInServer extends AsyncInputCompute {
        run(...args) {
            var _a;
            return __awaiter(this, void 0, void 0, function* () {
                const { end, valid } = this.startAsyncGetter();
                this.emit(signal.EHookEvents.beforeCalling, this);
                if (!signal.checkFreeze({ _hook: this })) {
                    /**
                     * only icInServer need confirm all related dependencies ready
                     * because IC just be manual (by User or System)
                     */
                    yield this.scope.readyRelated(this);
                    (_a = signal.getCurrentReactiveChain()) === null || _a === void 0 ? void 0 : _a.add(this);
                    const context = this.scope.createShallowActionContext(this, args);
                    const result = yield this.scope.plugin.getPlugin('Context').postComputeToServer(context);
                    if (valid()) {
                        this.scope.applyContextFromServer(result);
                    }
                }
                if (valid()) {
                    const r = this.inputFuncEnd();
                    end();
                    return r;
                }
            });
        }
    }
    class ClientComputed extends signal.Computed {
        constructor(getter, scope) {
            super(getter);
            this.getter = getter;
            this.scope = scope;
        }
        run() {
            const { end, valid } = this.startAsyncGetter();
            const context = this.scope.createActionContext(this);
            signal.log('[ComputedInServer.run] before post');
            this.scope.plugin.getPlugin('Context')
                .postComputeToServer(context)
                .then((result) => {
                if (valid()) {
                    const index = this.scope.findHookIndex(this);
                    if (result.data) {
                        const d = result.data[index];
                        if (d.length >= 2) {
                            this.update(d[2]);
                        }
                    }
                    end();
                }
            });
        }
    }
    /**
     *
     *
     *
     *
     *
     * original hooks api for "InServer"
     *
     *
     *
     *
     *
     *
     */
    const mountModelHookFactory = {
        model: mountPrisma,
        prisma: mountPrisma,
        writePrisma: mountWritePrisma,
        writeModel: writeModel,
        // quick command
        createPrisma: mountCreatePrisma,
        updatePrisma: mountUpdatePrisma,
        removePrisma: mountRemovePrisma,
        computedInServer: mountComputedInServer,
        inputComputeInServer: mountInputComputeInServer
    };
    const updateModelHookFactory = {
        model: updateCyclePrisma,
        prisma: updateCyclePrisma,
        writePrisma: mountWritePrisma,
        writeModel: writeModel,
        createPrisma: mountCreatePrisma,
        updatePrisma: mountUpdatePrisma,
        removePrisma: mountRemovePrisma,
        computedInServer: updateComputedInServer,
        inputComputeInServer: updateInputComputeInServer
    };
    const modelHookFactoryFeatures = {
        /**
         * all hooks name list
         */
        all: Object.keys(Object.assign(Object.assign({}, signal.mountHookFactory), mountModelHookFactory)),
        /**
         * need other hook as data source
         */
        withSource: [
            'cache',
            'writeModel',
            'writePrisma',
            'createPrisma',
            'updatePrisma',
            'removePrisma'
        ],
        /**
         * manual calling by User or System
         */
        initiativeCompute: [
            'inputCompute',
            'inputComputeInServer',
            'writePrisma',
            'writeModel',
            'createPrisma',
            'updatePrisma',
            'removePrisma'
        ],
        /**
         * only compatibility with server
         * "model" & "prisma" maybe still run in client because of their query compute
         */
        serverOnly: ['inputComputeInServer', 'computedInServer']
    };
    const hookFactoryNames = modelHookFactoryFeatures.all;
    const hasSourceHookFactoryNames = modelHookFactoryFeatures.withSource;
    const initiativeComputeHookFactoryNames = modelHookFactoryFeatures.initiativeCompute;
    function createUnaccessibleGetter(index) {
        const f = () => {
            throw new Error(`[update getter] cant access un initialized hook(${index})`);
        };
        const newF = Object.assign(f, {
            _hook: null
        });
        return newF;
    }
    function createUnaccessibleModelGetter(index, entity) {
        const f = () => {
            throw new Error(`[update getter] cant access un initialized hook(${index})`);
        };
        const newF = Object.assign(f, {
            _hook: { entity },
            exist: () => true,
            create: () => { },
            update: () => { },
            remove: () => { },
            refresh: () => { }
        });
        return newF;
    }
    function updateCyclePrisma(e, q, op) {
        var _a, _b, _c;
        const currentRunnerScope = getModelRunnerScope();
        const { valid, currentIndex } = signal.updateValidation();
        if (!valid) {
            currentRunnerScope.addHook(undefined);
            return createUnaccessibleModelGetter(currentIndex, e);
        }
        const inServer = currentRunnerScope.runtime === 'nodejs';
        const { believeContext } = currentRunnerScope;
        const receiveDataFromContext = believeContext || !inServer;
        op = Object.assign({}, op, {
            immediate: !receiveDataFromContext
        });
        const hook = inServer
            ? new Prisma(e, q, op, currentRunnerScope)
            : new ClientPrisma(e, q, op, currentRunnerScope);
        currentRunnerScope.addHook(hook);
        (_a = signal.getCurrentReactiveChain()) === null || _a === void 0 ? void 0 : _a.add(hook);
        if (receiveDataFromContext) {
            const initialValue = (_b = currentRunnerScope.runnerContext.initialData[currentIndex]) === null || _b === void 0 ? void 0 : _b[2];
            const timestamp = (_c = currentRunnerScope.runnerContext.initialData[currentIndex]) === null || _c === void 0 ? void 0 : _c[3];
            hook.init = false;
            hook._internalValue = initialValue || [];
            if (timestamp) {
                hook.modifiedTimestamp = timestamp;
            }
        }
        const setterGetter = createModelSetterGetterFunc(hook);
        const newSetterGetter = Object.assign(setterGetter, {
            _hook: hook,
            exist: hook.exist.bind(hook),
            refresh: hook.refresh.bind(hook)
        });
        return newSetterGetter;
    }
    function updateInputComputeInServer(func) {
        const currentRunnerScope = getModelRunnerScope();
        const { hooks, initialHooksSet } = currentRunnerScope;
        const currentIndex = hooks.length;
        const valid = !initialHooksSet || initialHooksSet.has(currentIndex);
        if (!valid) {
            currentRunnerScope.addHook(undefined);
            return createUnaccessibleGetter(currentIndex);
        }
        return mountInputComputeInServer(func);
    }
    function mountInputComputeInServer(func) {
        var _a;
        const currentRunnerScope = getModelRunnerScope();
        const hook = new InputComputeInServer(func, currentRunnerScope);
        currentRunnerScope.addHook(hook);
        (_a = signal.getCurrentReactiveChain()) === null || _a === void 0 ? void 0 : _a.add(hook);
        const wrapFunc = (...args) => {
            return hook.run(...args);
        };
        wrapFunc._hook = hook;
        return wrapFunc;
    }
    function updateComputedInServer(fn) {
        var _a, _b, _c;
        const currentRunnerScope = getModelRunnerScope();
        const { valid, currentIndex } = signal.updateValidation();
        if (!valid) {
            currentRunnerScope.addHook(undefined);
            return createUnaccessibleGetter(currentIndex);
        }
        const initialValue = (_a = currentRunnerScope.runnerContext.initialData[currentIndex]) === null || _a === void 0 ? void 0 : _a[2];
        const timestamp = (_b = currentRunnerScope.runnerContext.initialData[currentIndex]) === null || _b === void 0 ? void 0 : _b[3];
        const hook = currentRunnerScope.runtime === 'nodejs'
            ? new signal.Computed(fn)
            : new ClientComputed(fn, currentRunnerScope);
        currentRunnerScope.addHook(hook);
        /** @TODO: update computed won't trigger */
        hook._internalValue = initialValue;
        hook.init = false;
        if (timestamp) {
            hook.modifiedTimestamp = timestamp;
        }
        (_c = signal.getCurrentReactiveChain()) === null || _c === void 0 ? void 0 : _c.add(hook);
        const getter = () => {
            return hook.value;
        };
        const newGetter = Object.assign(getter, {
            _hook: hook
        });
        return newGetter;
    }
    function mountComputedInServer(fn) {
        var _a;
        const currentRunnerScope = getModelRunnerScope();
        const hook = currentRunnerScope.runtime === 'nodejs'
            ? new signal.Computed(fn)
            : new ClientComputed(fn, currentRunnerScope);
        currentRunnerScope.addHook(hook);
        (_a = signal.getCurrentReactiveChain()) === null || _a === void 0 ? void 0 : _a.add(hook);
        const getter = () => {
            return hook.value;
        };
        const newGetter = Object.assign(getter, {
            _hook: hook
        });
        return newGetter;
    }
    /**
     *
     *
     *
     *
     *
     *
     *
     * hooks api
     *
     *
     *
     *
     *
     *
     */
    function createModelSetterGetterFunc(m) {
        return (parameter) => {
            var _a;
            if (parameter && signal.isFunc(parameter)) {
                const currentInputCompute = signal.getCurrentInputCompute();
                const [result, patches] = signal.produceWithPatches(signal.shallowCopy(m.value), parameter);
                signal.log('[model setter] result, patches: ', !!currentInputCompute, JSON.stringify(patches, null, 2));
                if (currentInputCompute) {
                    m.addComputePatches(result, patches);
                }
                else {
                    const reactiveChain = (_a = signal.getCurrentReactiveChain()) === null || _a === void 0 ? void 0 : _a.addUpdate(m);
                    const isUnderComputed = signal.underComputed();
                    m.updateWithPatches(result, patches, isUnderComputed, reactiveChain);
                }
                return [result, patches];
            }
            if (signal.getCurrentReactiveChain()) {
                return signal.ReactiveChain.withChain(signal.getCurrentReactiveChain().addCall(m), () => {
                    return m.value;
                });
            }
            return m.value;
        };
    }
    function mountPrisma(e, q, op) {
        var _a;
        const currentRunnerScope = getModelRunnerScope();
        const hook = currentRunnerScope.runtime === 'nodejs'
            ? new Prisma(e, q, op, currentRunnerScope)
            : new ClientPrisma(e, q, op, currentRunnerScope);
        currentRunnerScope.addHook(hook);
        (_a = signal.getCurrentReactiveChain()) === null || _a === void 0 ? void 0 : _a.add(hook);
        const setterGetter = createModelSetterGetterFunc(hook);
        const newSetterGetter = Object.assign(setterGetter, {
            _hook: hook,
            exist: hook.exist.bind(hook),
            refresh: hook.refresh.bind(hook)
        });
        return newSetterGetter;
    }
    // TIP: "function updateWritePrisma" same as mountWritePrisma
    function mountWritePrisma(source, q) {
        var _a;
        const currentRunnerScope = getModelRunnerScope();
        const hook = currentRunnerScope.runtime === 'nodejs'
            ? new WritePrisma(source, q, currentRunnerScope)
            : new ClientWritePrisma(source, q, currentRunnerScope);
        currentRunnerScope.addHook(hook);
        (_a = signal.getCurrentReactiveChain()) === null || _a === void 0 ? void 0 : _a.add(hook);
        const getter = () => {
            throw new Error('[writePrisma] cant get data from writePrisma');
        };
        const newGetter = Object.assign(getter, {
            _hook: hook,
            create: hook.createRow.bind(hook),
            update: hook.updateRow.bind(hook),
            updateMany: hook.updateManyRows.bind(hook),
            upsert: hook.upsertRow.bind(hook),
            remove: hook.removeRow.bind(hook)
        });
        return newGetter;
    }
    function mountCreatePrisma(source, q) {
        var _a;
        const currentRunnerScope = getModelRunnerScope();
        const hook = currentRunnerScope.runtime === 'nodejs'
            ? new WritePrisma(source, q, currentRunnerScope)
            : new ClientWritePrisma(source, q, currentRunnerScope);
        currentRunnerScope.addHook(hook);
        (_a = signal.getCurrentReactiveChain()) === null || _a === void 0 ? void 0 : _a.add(hook);
        const caller = (receivedData) => {
            return hook.createRow(receivedData);
        };
        const newCaller = Object.assign(caller, {
            _method: 'create',
            _hook: hook
        });
        return newCaller;
    }
    function mountUpdatePrisma(source, q) {
        var _a;
        const currentRunnerScope = getModelRunnerScope();
        const hook = currentRunnerScope.runtime === 'nodejs'
            ? new WritePrisma(source, q, currentRunnerScope)
            : new ClientWritePrisma(source, q, currentRunnerScope);
        currentRunnerScope.addHook(hook);
        (_a = signal.getCurrentReactiveChain()) === null || _a === void 0 ? void 0 : _a.add(hook);
        const caller = (where, receivedData) => {
            return hook.updateRow(where, receivedData);
        };
        const newCaller = Object.assign(caller, {
            _method: 'update',
            _hook: hook
        });
        return newCaller;
    }
    function mountRemovePrisma(source, q) {
        var _a;
        const currentRunnerScope = getModelRunnerScope();
        const hook = currentRunnerScope.runtime === 'nodejs'
            ? new WritePrisma(source, q, currentRunnerScope)
            : new ClientWritePrisma(source, q, currentRunnerScope);
        currentRunnerScope.addHook(hook);
        (_a = signal.getCurrentReactiveChain()) === null || _a === void 0 ? void 0 : _a.add(hook);
        const caller = (where) => {
            return hook.removeRow(where);
        };
        const newCaller = Object.assign(caller, {
            _method: 'remove',
            _hook: hook
        });
        return newCaller;
    }
    function computedInServer(fn) {
        const scope = getModelRunnerScope();
        if (!scope) {
            throw new Error('[computed] must under <Runner>');
        }
        return scope.modelHookFactory.computedInServer(fn);
    }
    function inputComputeInServer(func) {
        const scope = getModelRunnerScope();
        if (!scope) {
            throw new Error('[inputComputeServer] must under a <Runner>');
        }
        /**
         * running in client should post request to server
         * if already in server, should execute directly
         */
        if (scope.runtime === 'nodejs') {
            return signal.inputCompute(func);
        }
        const wrapFunc = scope.modelHookFactory.inputComputeInServer(func);
        return wrapFunc;
    }
    function model(e, q, op) {
        const scope = getModelRunnerScope();
        if (!scope) {
            throw new Error('[model] must under a signal model runner');
        }
        return scope.modelHookFactory.prisma(e, q, op);
    }
    function writeModel(source, q) {
        const scope = getModelRunnerScope();
        if (!scope) {
            throw new Error('[writePrisma] must under a signal model runner');
        }
        return scope.modelHookFactory.writePrisma(source, q);
    }
    function prisma(e, q, op) {
        const scope = getModelRunnerScope();
        if (!scope) {
            throw new Error('[prisma] must under a signal model runner');
        }
        return scope.modelHookFactory.prisma(e, q, op);
    }
    function writePrisma(source, q) {
        const scope = getModelRunnerScope();
        if (!scope) {
            throw new Error('[writePrisma] must under a signal model runner');
        }
        return scope.modelHookFactory.writePrisma(source, q);
    }
    function createPrisma(source, q) {
        const scope = getModelRunnerScope();
        if (!scope) {
            throw new Error('[createPrisma] must under a signal model runner');
        }
        return scope.modelHookFactory.createPrisma(source, q);
    }
    function updatePrisma(source, q) {
        const scope = getModelRunnerScope();
        if (!scope) {
            throw new Error('[updatePrisma] must under a signal model runner');
        }
        return scope.modelHookFactory.updatePrisma(source, q);
    }
    function removePrisma(source, q) {
        const scope = getModelRunnerScope();
        if (!scope) {
            throw new Error('[removePrisma] must under a signal model runner');
        }
        return scope.modelHookFactory.removePrisma(source, q);
    }
    function connectModel(modelGetter, dataGetter) {
        modelGetter._hook.setGetter(dataGetter);
    }
    function injectWrite(...args) {
        const [modelGetter, methodOrDataGetter, dataGetter] = args;
        if (dataGetter) {
            modelGetter._hook.injectGetter(dataGetter, methodOrDataGetter);
        }
        else {
            if (modelGetter._hook instanceof Model) {
                modelGetter._hook.injectFindGetter(methodOrDataGetter);
            }
            else if (modelGetter._hook instanceof WriteModel) {
                modelGetter._hook.injectGetter(methodOrDataGetter, modelGetter._method);
            }
            else {
                /** @TODO "_hook" maybe created by createUnaccessModelGetter */
                // throw new Error('[injectWrite] invalid getter._hook type')
                console.error('[injectWrite] invalid getter._hook type');
            }
        }
    }
    const injectModel = injectWrite;

    exports.ClientComputed = ClientComputed;
    exports.ClientModel = ClientModel;
    exports.ClientPrisma = ClientPrisma;
    exports.ClientWriteModel = ClientWriteModel;
    exports.ClientWritePrisma = ClientWritePrisma;
    exports.DataGraphNode = DataGraphNode;
    exports.Model = Model;
    exports.ModelEvent = ModelEvent;
    exports.ModelRunner = ModelRunner;
    exports.Prisma = Prisma;
    exports.RunnerModelScope = RunnerModelScope;
    exports.WriteModel = WriteModel;
    exports.WritePrisma = WritePrisma;
    exports.calculateDiff = calculateDiff;
    exports.checkQueryWhere = checkQueryWhere;
    exports.computedInServer = computedInServer;
    exports.connectModel = connectModel;
    exports.constructDataGraph = constructDataGraph;
    exports.createPrisma = createPrisma;
    exports.dataGrachTraverse = dataGrachTraverse;
    exports.getDependencies = getDependencies;
    exports.getDependentPrevNodes = getDependentPrevNodes;
    exports.getDependentPrevNodesWithBlock = getDependentPrevNodesWithBlock;
    exports.getGlobalModelEvent = getGlobalModelEvent;
    exports.getInfluencedNextNodes = getInfluencedNextNodes;
    exports.getModelRunnerScope = getModelRunnerScope;
    exports.getNextNodes = getNextNodes;
    exports.getPrevNodes = getPrevNodes;
    exports.getRelatedIndexes = getRelatedIndexes;
    exports.getShallowDependentPrevNodes = getShallowDependentPrevNodes;
    exports.getShallowInfluencedNextNodes = getShallowInfluencedNextNodes;
    exports.getShallowRelatedIndexes = getShallowRelatedIndexes;
    exports.hasSourceHookFactoryNames = hasSourceHookFactoryNames;
    exports.hookFactoryNames = hookFactoryNames;
    exports.initiativeComputeHookFactoryNames = initiativeComputeHookFactoryNames;
    exports.injectModel = injectModel;
    exports.injectWrite = injectWrite;
    exports.inputComputeInServer = inputComputeInServer;
    exports.isModelPatch = isModelPatch;
    exports.mapGraph = mapGraph;
    exports.mapGraphSetToIds = mapGraphSetToIds;
    exports.model = model;
    exports.modelHookFactoryFeatures = modelHookFactoryFeatures;
    exports.mountModelHookFactory = mountModelHookFactory;
    exports.prisma = prisma;
    exports.removePrisma = removePrisma;
    exports.setGlobalModelEvent = setGlobalModelEvent;
    exports.updateModelHookFactory = updateModelHookFactory;
    exports.updatePrisma = updatePrisma;
    exports.writeInitialSymbol = writeInitialSymbol;
    exports.writeModel = writeModel;
    exports.writePrisma = writePrisma;
    exports.writePrismaInitialSymbol = writePrismaInitialSymbol;
    Object.keys(signal).forEach(function (k) {
        if (k !== 'default' && !exports.hasOwnProperty(k)) Object.defineProperty(exports, k, {
            enumerable: true,
            get: function () { return signal[k]; }
        });
    });

    Object.defineProperty(exports, '__esModule', { value: true });

}));



(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@polymita/signal-model'), require('@emotion/css')) :
    typeof define === 'function' && define.amd ? define(['exports', '@polymita/signal-model', '@emotion/css'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global["@polymita/renderer"] = {}, global.signalModel, global.css));
})(this, (function (exports, signalModel, css) { 'use strict';

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __rest(s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }

    /**
     * fork from https://github.com/facebook/prop-types
     */
    const SignalFlag = 'Signal';
    const typeFlagSymbol = Symbol.for('renderTypeFlag');
    const typeDefaultValueFlagSymbol = Symbol.for('typeDefaultValueFlagSymbol');
    const PropTypes = {
        array: createPrimitiveTypeChecker('array'),
        bigint: createPrimitiveTypeChecker('bigint'),
        bool: createPrimitiveTypeChecker('boolean'),
        func: createPrimitiveTypeChecker('function'),
        number: createPrimitiveTypeChecker('number'),
        object: createPrimitiveTypeChecker('object'),
        string: createPrimitiveTypeChecker('string'),
        symbol: createPrimitiveTypeChecker('symbol'),
        signal: createSignalTypeChecker(),
        checkPropTypes,
        // any: createAnyTypeChecker(),
        // arrayOf: createArrayOfTypeChecker,
        // element: createElementTypeChecker(),
        // elementType: createElementTypeTypeChecker(),
        // instanceOf: createInstanceTypeChecker,
        // node: createNodeChecker(),
        // objectOf: createObjectOfTypeChecker,
        // oneOf: createEnumTypeChecker,
        // oneOfType: createUnionTypeChecker,
        // shape: createShapeTypeChecker,
        // exact: createStrictShapeTypeChecker,
    };
    // This handles more types than `getPropType`. Only used for error messages.
    // See `createPrimitiveTypeChecker`.
    function getPreciseType(propValue) {
        if (typeof propValue === 'undefined' || propValue === null) {
            return '' + propValue;
        }
        var propType = getPropType(propValue);
        if (propType === 'object') {
            if (propValue instanceof Date) {
                return 'date';
            }
            else if (propValue instanceof RegExp) {
                return 'regexp';
            }
            else ;
        }
        return propType;
    }
    function isSymbol(propType, propValue) {
        // Native Symbol.
        if (propType === 'symbol') {
            return true;
        }
        // falsy value can't be a Symbol
        if (!propValue) {
            return false;
        }
        // 19.4.3.5 Symbol.prototype[@@toStringTag] === 'Symbol'
        if (propValue['@@toStringTag'] === 'Symbol') {
            return true;
        }
        // Fallback for non-spec compliant Symbols which are polyfilled.
        if (typeof Symbol === 'function' && propValue instanceof Symbol) {
            return true;
        }
        return false;
    }
    // Equivalent of `typeof` but with special handling for array and regexp.
    function getPropType(propValue) {
        var propType = typeof propValue;
        if (Array.isArray(propValue)) {
            return 'array';
        }
        if (propValue instanceof RegExp) {
            // Old webkits (at least until Android 4.0) return 'function' rather than
            // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
            // passes PropTypes.object.
            return 'object';
        }
        if (isSymbol(propType, propValue)) {
            return 'symbol';
        }
        return propType;
    }
    /**
     * We use an Error-like object for backward compatibility as people may call
     * PropTypes directly and inspect their output. However, we don't use real
     * Errors anymore. We don't inspect their stack anyway, and creating them
     * is prohibitively expensive if they are created too often, such as what
     * happens in oneOfType() for any type before the one that matched.
     */
    function PropTypeError(message, data) {
        this.message = message;
        this.data = data && typeof data === 'object' ? data : {};
        this.stack = '';
    }
    var ANONYMOUS = '<<anonymous>>';
    function createChainableTypeDefault(validate) {
        function defaultValue(value) {
            validateWithDefault[typeDefaultValueFlagSymbol] = value;
            validateWithDefault[typeFlagSymbol] = validate[typeFlagSymbol];
            function validateWithDefault(props, propName, componentName, location, propFullName) {
                return validate(props, propName, componentName, location, propFullName);
            }
            return validateWithDefault;
        }
        validate.default = defaultValue;
        validate.default[typeFlagSymbol] = validate[typeFlagSymbol];
        validate.isRequired.default = defaultValue;
        validate.isRequired.default[typeFlagSymbol] = validate[typeFlagSymbol];
        return validate;
    }
    function createChainableTypeChecker(validate) {
        function checkType(isRequired, props, propName, componentName, location, propFullName) {
            componentName = componentName || ANONYMOUS;
            propFullName = propFullName || propName;
            if (props[propName] == null) { // ==
                if (isRequired) {
                    if (props[propName] === null) { // ===
                        return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required ' + ('in `' + componentName + '`, but its value is `null`.'));
                    }
                    return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required in ' + ('`' + componentName + '`, but its value is `undefined`.'));
                }
                return null;
            }
            else {
                return validate(props, propName, componentName, location, propFullName);
            }
        }
        var chainedCheckType = checkType.bind(null, false);
        chainedCheckType.isRequired = checkType.bind(null, true);
        chainedCheckType[typeFlagSymbol] = validate[typeFlagSymbol];
        chainedCheckType.isRequired[typeFlagSymbol] = validate[typeFlagSymbol];
        return createChainableTypeDefault(chainedCheckType);
    }
    function createPrimitiveTypeChecker(expectedType) {
        function validate(props, propName, componentName, location, propFullName) {
            var propValue = props[propName];
            var propType = getPropType(propValue);
            if (propType !== expectedType) {
                // `propValue` being instance of, say, date/regexp, pass the 'object'
                // check, but we can offer a more precise error message here rather than
                // 'of type `object`'.
                var preciseType = getPreciseType(propValue);
                return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + preciseType + '` supplied to `' + componentName + '`, expected ') + ('`' + expectedType + '`.'), { expectedType: expectedType });
            }
            return null;
        }
        return createChainableTypeChecker(validate);
    }
    function createSignalTypeChecker() {
        function validate(props, propName, componentName, location, propFullName) {
            var propValue = props[propName];
            if (!signalModel.isSignal(propValue)) {
                var expectedType = 'Signal';
                var preciseType = getPreciseType(propValue);
                return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + preciseType + '` supplied to `' + componentName + '`, expected ') + ('`' + expectedType + '`.'), { expectedType: expectedType });
            }
            return null;
        }
        validate[typeFlagSymbol] = SignalFlag;
        return createChainableTypeChecker(validate);
    }
    /**
     *
     *
     *
     * checker
     *
     *
     *
     */
    let loggedTypeFailures = {};
    const has = Function.call.bind(Object.prototype.hasOwnProperty);
    function printWarning(text) {
        var message = 'Warning: ' + text;
        if (typeof console !== 'undefined') {
            console.error(message);
        }
        try {
            // --- Welcome to debugging React ---
            // This error was thrown as a convenience so that you can use this stack
            // to find the callsite that caused this warning to fire.
            throw new Error(message);
        }
        catch (x) { /**/ }
    }
    /**
     * Assert that the values match with the type specs.
     * Error messages are memorized and will only be shown once.
     *
     * @param {object} typeSpecs Map of name to a ReactPropType
     * @param {object} values Runtime values that need to be type-checked
     * @param {string} location e.g. "prop", "context", "child context"
     * @param {string} componentName Name of the component for error messages.
     * @param {?Function} getStack Returns the component stack.
     * @private
     */
    function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
        for (var typeSpecName in typeSpecs) {
            if (has(typeSpecs, typeSpecName)) {
                var error;
                // Prop type validation may throw. In case they do, we don't want to
                // fail the render phase where it didn't fail before. So we log it.
                // After these have been cleaned up, we'll let them throw.
                try {
                    // This is intentionally an invariant that gets caught. It's the same
                    // behavior as without this statement except with a better message.
                    if (typeof typeSpecs[typeSpecName] !== 'function') {
                        var err = Error((componentName || 'React class') + ': ' + location + ' type `' + typeSpecName + '` is invalid; ' +
                            'it must be a function, usually from the `prop-types` package, but received `' + typeof typeSpecs[typeSpecName] + '`.' +
                            'This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.');
                        err.name = 'Invariant Violation';
                        throw err;
                    }
                    error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null);
                }
                catch (ex) {
                    error = ex;
                }
                if (error && !(error instanceof Error)) {
                    // printWarning(
                    //   (componentName || 'React class') + ': type specification of ' +
                    //   location + ' `' + typeSpecName + '` is invalid; the type checker ' +
                    //   'function must return `null` or an `Error` but returned a ' + typeof error + '. ' +
                    //   'You may have forgotten to pass an argument to the type checker ' +
                    //   'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' +
                    //   'shape all require an argument).'
                    // );
                    printWarning(error.message);
                }
                if (error instanceof Error && !(error.message in loggedTypeFailures)) {
                    // Only monitor this failure once because there tends to be a lot of the
                    // same error.
                    loggedTypeFailures[error.message] = true;
                    var stack = getStack ? getStack() : '';
                    printWarning('Failed ' + location + ' type: ' + error.message + (stack != null ? stack : ''));
                }
            }
        }
    }
    /**
     * Resets warning cache when testing.
     *
     * @private
     */
    checkPropTypes.resetWarningCache = function () {
        loggedTypeFailures = {};
    };

    const isFunction = (v) => typeof v == 'function';

    function mergeFromProps(json, props, keys) {
        keys.forEach((key) => {
            const val = props[key];
            if (val) {
                if (json.props[key]) {
                    json.props[key] = `${json.props[key]} ${val}`;
                }
                else {
                    json.props[key] = val;
                }
            }
        });
        return json;
    }
    /**
     * key point: pattern implicitly match every JSON Node
     */
    const SEMATIC_RELATION_IS = "is";
    const SEMATIC_RELATION_HAS = "has";
    function checkSematic(sematic, props) {
        let result = false;
        const kvArr = Object.entries(props);
        for (const [k, v] of kvArr) {
            const [relationField, ...sematicArr] = k.split("-");
            if (relationField === SEMATIC_RELATION_IS && sematicArr.length > 1) {
                throw new Error("[checkSematic] the node can not be multiply sematic at the same time");
            }
            if ([SEMATIC_RELATION_IS, SEMATIC_RELATION_HAS].includes(relationField)) {
                result = result || sematicArr.includes(sematic);
            }
            if (result) {
                break;
            }
        }
        return result;
    }
    function camelToLine(str) {
        return str
            .replace(/^[A-Z]/, (firstChar) => firstChar.toLocaleLowerCase())
            .replace(/([A-Z])/g, "-$1")
            .toLowerCase();
    }
    function patternResultToEmotionCSS(style, pseudo) {
        let styleRows = [];
        Object.entries(style || {}).forEach(([k, v]) => {
            const r = Array.isArray(v) ? last(v) : v;
            styleRows.push(`${camelToLine(k)}: ${r};`);
        });
        return css.css `
    ${styleRows.join("\n")}
  `;
    }
    function assignPattern(json, pattern, useEmotion) {
        // const source = deepClone(json)
        const source = json;
        traverseLayoutTree(source, (node) => {
            const { props } = node;
            for (const sematic in pattern) {
                if (checkSematic(sematic, props)) {
                    const style = pattern[sematic];
                    if (useEmotion) {
                        const cls = patternResultToEmotionCSS(style);
                        if (props.className) {
                            props.className = `${props.className} ${cls}`;
                        }
                        else {
                            props.className = cls;
                        }
                    }
                    else {
                        if (!props.style) {
                            props.style = {};
                        }
                        Object.entries(style).forEach(([k, v]) => {
                            props.style[k] = Array.isArray(v) ? last(v) : v;
                        });
                    }
                }
            }
        });
        return source;
    }
    function equalMatcher(setting, inputs) {
        return (setting.every((v, i) => v === inputs[i] || v === "*") ||
            setting.some((arr2) => {
                if (Array.isArray(arr2)) {
                    return equalMatcher(arr2, inputs);
                }
                return false;
            }));
    }
    function matchPatternMatrix(patternInputs) {
        return (ps) => {
            let result = {};
            for (let mainSemantic in ps) {
                result[mainSemantic] = {};
                for (let propertyKey in ps[mainSemantic]) {
                    result[mainSemantic][propertyKey] = [];
                    for (let value in ps[mainSemantic][propertyKey]) {
                        const matcher = ps[mainSemantic][propertyKey][value];
                        if (equalMatcher(matcher, patternInputs) || matcher.length === 0) {
                            result[mainSemantic][propertyKey].push(value);
                        }
                    }
                }
            }
            return result;
        };
    }
    // in html attributes
    const renderHTMLProp = "_html";
    const VirtualNodeTypeSymbol = Symbol.for("polymitaVirtualNodeSymbol");
    function isVirtualNode(node) {
        return (node &&
            typeof node === "object" &&
            "type" in node &&
            "props" in node &&
            "children" in node &&
            node.flags === VirtualNodeTypeSymbol);
    }
    function isReactComponent(node) {
        // export function isReactComponent(node: any): node is any {
        return "$$typeof" in node && node.render && typeof node.render === "function";
    }
    /**
     * uppercase path means it is a Module Component
     */
    function isFunctionComponentPath(path) {
        return /^[A-Z]/.test(String(path));
    }
    function isFunctionVNode(node) {
        return typeof node.type === "function";
    }
    function traverse(obj, callback, path = [], cache = new Set()) {
        if (cache.has(obj)) {
            return;
        }
        cache.add(obj);
        if (callback(path, obj) !== false) {
            if (!obj || typeof obj !== "object")
                return;
            for (let k in obj) {
                const v = obj[k];
                if (callback(path.concat(k), v) !== false) {
                    traverse(v, callback, path.concat(k), cache);
                }
            }
        }
    }
    function traverseLayoutTree(layoutTree, callback) {
        if (isVirtualNode(layoutTree)) {
            callback(layoutTree);
            if (layoutTree.children) {
                if (Array.isArray(layoutTree.children)) {
                    layoutTree.children.forEach((child) => {
                        traverseLayoutTree(child, callback);
                    });
                }
                else {
                    traverseLayoutTree(layoutTree.children, callback);
                }
            }
        }
    }
    /** fork from swr */
    const isArray = Array.isArray;
    function last(arr) {
        return arr[arr.length - 1];
    }
    const VNodeComponentSymbol = Symbol("VNodeComponentSymbol");
    const VNodeFunctionComponentSymbol = Symbol("VNodeFunctionComponentSymbol");
    const VNodeFunctionComponentOriginModuleSymbol = Symbol("VNodeFunctionComponentOriginModuleSymbol");
    function getModuleFromFunctionComponent(f) {
        return f[VNodeFunctionComponentOriginModuleSymbol];
    }
    function isVNodeComponent(target) {
        var _a;
        return !!((_a = target === null || target === void 0 ? void 0 : target.type) === null || _a === void 0 ? void 0 : _a[VNodeComponentSymbol]);
    }
    function isVNodeFunctionComponent(target) {
        var _a;
        return !!((_a = target === null || target === void 0 ? void 0 : target.type) === null || _a === void 0 ? void 0 : _a[VNodeFunctionComponentSymbol]);
    }
    function assignDefaultValueByPropTypes(props, propTypes) {
        if (!propTypes) {
            return props;
        }
        const r = {};
        Object.keys(propTypes).forEach((key) => {
            var _a;
            if (props[key] === undefined) {
                const defaultValue = (_a = propTypes === null || propTypes === void 0 ? void 0 : propTypes[key]) === null || _a === void 0 ? void 0 : _a[typeDefaultValueFlagSymbol];
                if (defaultValue !== undefined) {
                    if (signalModel.isSignal(defaultValue)) {
                        console.error(`[propTypes] props.${key} is return a signal directly, it maybe cause some unexpected error.`);
                    }
                    r[key] =
                        typeof defaultValue === "function" ? defaultValue() : defaultValue;
                }
            }
        });
        return Object.assign({}, props, r);
    }
    const ShouldRenderAttr = "if";
    function shouldNotRender(json) {
        var _a;
        return typeof (json === null || json === void 0 ? void 0 : json.type) !== "function" && ((_a = json === null || json === void 0 ? void 0 : json.props) === null || _a === void 0 ? void 0 : _a.if) === false;
    }
    function lowerCaseType(type) {
        return typeof type === "string" ? camelToLine(type) : type;
    }
    /**
     * fork from https://github.com/JedWatson/classnames/blob/main/index.js
     */
    const hasOwn = {}.hasOwnProperty;
    function classNames(...args) {
        var classes = [];
        for (var i = 0; i < args.length; i++) {
            var arg = args[i];
            if (!arg)
                continue;
            var argType = typeof arg;
            if (argType === "string" || argType === "number") {
                classes.push(arg);
            }
            else if (Array.isArray(arg)) {
                if (arg.length) {
                    var inner = classNames.apply(null, arg);
                    if (inner) {
                        classes.push(inner);
                    }
                }
            }
            else if (argType === "object") {
                if (arg.toString !== Object.prototype.toString &&
                    !arg.toString.toString().includes("[native code]")) {
                    classes.push(arg.toString());
                    continue;
                }
                for (var key in arg) {
                    if (hasOwn.call(arg, key) && arg[key]) {
                        classes.push(key);
                    }
                }
            }
        }
        return classes.join(" ");
    }
    const classnames = classNames;
    function getNodeType(type, props) {
        return lowerCaseType((props === null || props === void 0 ? void 0 : props.as) || type);
    }

    /**
     * 匹配
     *  in React framework, runReactLogic
     *  in Vue, runVueLogic
     *  in Other, by extension institution
     */
    const config$2 = {
        matches: [
            {
                renderFramework: 'react',
                stateManagement: 'signal',
            }
        ],
        runLogic: runReactLogic,
        transform,
        convertProps: convertToSignal
    };
    function transform(json) {
        // ** cant clone, json maybe include React.Element instance
        traverseLayoutTree(json, (node) => {
            if (node.props) {
                const { props } = node;
                Object.entries(props).forEach(([key, value]) => {
                    // if support two binding calling
                    if (signalModel.isSignal(value) &&
                        ['value', 'checked'].includes(key) &&
                        typeof node.type === 'string' && ['input', 'textarea'].includes(node.type)) {
                        const eventType = key === 'value' ? 'onInput' : 'onChange';
                        const draftPath = props[key === 'value' ? 'value-path' : 'checked-path'];
                        const fns = [
                            (e) => {
                                if (draftPath) {
                                    value(draft => {
                                        signalModel.set(draft, draftPath, e.target[key]);
                                    });
                                }
                                else {
                                    value(e.target[key]);
                                }
                            },
                        ];
                        if (props[eventType] && isFunction(props[eventType])) {
                            fns.push(props[eventType]);
                        }
                        props[key] = signalModel.get(value(), draftPath);
                        props[eventType] = function reactSignalTransformOnEventType(e) {
                            fns.forEach(fn => {
                                fn(e);
                            });
                        };
                        if (node.type === 'textarea') {
                            props.children = signalModel.get(value(), draftPath);
                        }
                    }
                });
            }
        });
        return json;
    }
    const driverWeakMap$1 = new Map();
    typeof window !== 'undefined' && (window.driverWeakMap = driverWeakMap$1);
    function convertToSignal(props, propTypes) {
        const signalArgs = {};
        Object.entries(props || {}).forEach(([key, value]) => {
            const propType = propTypes === null || propTypes === void 0 ? void 0 : propTypes[key];
            if ((propType === null || propType === void 0 ? void 0 : propType[typeFlagSymbol]) === SignalFlag &&
                !signalModel.isSignal(value) &&
                !isFunction(value)) {
                signalArgs[key] = signalModel.signal(value);
            }
            else {
                signalArgs[key] = value;
            }
        });
        return signalArgs;
    }
    const scopeSymbol = Symbol.for('@NewRendererReactScope');
    function runReactLogic(react, hook, props) {
        const { useRef, useEffect, useState } = react;
        const init = useRef(null);
        const signalProps = props[0];
        if (!init.current) {
            let ssrContext = [];
            const runner = new signalModel.Runner(hook, {
                updateCallbackSync: true,
                believeContext: true,
            });
            const initialContext = ssrContext.pop();
            const scope = runner.prepareScope([signalProps], initialContext);
            const r = runner.executeDriver(scope);
            init.current = {
                scope,
                result: Object.assign({
                    [scopeSymbol]: scope,
                }, r),
                signalProps,
            };
        }
        const [upc, updatePropsCount] = useState(0);
        // watch props
        useEffect(() => {
            let unListenCallbacks = [];
            if (init.current) {
                const { signalProps } = init.current;
                const deps = Object.values(signalProps).filter((v) => signalModel.isSignal(v));
                let waitCount = 0;
                const unListen = signalModel.after(() => {
                    waitCount++;
                    Promise.resolve().then(() => {
                        if (waitCount > 0) {
                            waitCount = 0;
                            updatePropsCount((v) => v + 1);
                        }
                    });
                }, deps);
                unListenCallbacks.push(unListen);
            }
            return () => {
                unListenCallbacks.forEach(fn => fn());
            };
        }, []);
        /**
         * while props changed, sync latest props value to signal
         */
        useEffect(() => {
            if (init.current) {
                const { signalProps: signalPropsRef } = init.current;
                Object.entries(signalProps || {}).forEach(([key, value]) => {
                    if (signalModel.isSignal(signalPropsRef[key])) {
                        if (signalModel.isSignal(value)) {
                            signalPropsRef[key](value());
                        }
                        else if (!isFunction(value)) {
                            signalPropsRef[key](value);
                        }
                    }
                });
            }
        }, [signalProps]);
        useEffect(() => {
            init.current.scope.activate();
            const unListen = init.current.scope.onUpdate(() => {
                setHookResult(Object.assign({}, init.current.result));
            });
            return () => {
                unListen();
                init.current.scope.deactivate();
                init.current.scope.dispose();
            };
        }, []);
        const [hookResult, setHookResult] = useState(init.current.result);
        return hookResult;
    }

    const config$1 = {
        matches: [
            {
                renderFramework: 'react',
                stateManagement: 'hook',
            }
        ],
        runLogic: runHookLogic$1,
        // transform, // 不需要双向绑定，所以不需要transform
        // convertProps: convertToSignal
    };
    function runHookLogic$1(react, logic, propsArr) {
        const props = propsArr[0];
        return logic(props);
    }

    const config = {
        matches: [
            {
                renderFramework: 'react',
                stateManagement: 'hook',
            }
        ],
        runLogic: runHookLogic,
        transform,
        // convertProps: convertToSignal
    };
    function runHookLogic(react, logic, propsArr) {
        const props = propsArr[0];
        return logic(props);
    }

    /**
     * patch cmd to struct
     */
    exports.CommandOP = void 0;
    (function (CommandOP) {
        // for all nodes
        CommandOP["addChild"] = "addChild";
        CommandOP["addFirst"] = "addFirst";
        CommandOP["replace"] = "replace";
        CommandOP["remove"] = "remove";
        CommandOP["assignAttrs"] = "assignAttrs";
        CommandOP["setAttrs"] = "setAttrs";
        // for parent node
        CommandOP["wrap"] = "wrap";
        CommandOP["wrapFirst"] = "wrapFirst";
        CommandOP["wrapLast"] = "wrapLast";
    })(exports.CommandOP || (exports.CommandOP = {}));

    // Method that will return the data type for any structure passed to it
    function getDataType(data) {
        // Use the objects toString method on the data.
        // This will return something like [object String]
        // Then we use .slice to grab the last portion of it (in this case the "string" bit)
        return Object.prototype.toString.call(data).slice(8, -1);
    }
    // Create a method to detect whether an object contains a circular reference
    function isCyclic(data) {
        // Create an array that will store the nodes of the array that have already been iterated over
        let seenObjects = [];
        function detect(data) {
            // If the data pass is an object
            if (data && getDataType(data) === "Object") {
                // If the data is already in the seen nodes array then we know there is a circular reference
                // Therefore return true
                if (seenObjects.indexOf(data) !== -1) {
                    return true;
                }
                // Add the data to the seen objects array
                seenObjects.push(data);
                // Begin iterating through the data passed to the method
                for (var key in data) {
                    // Recall this method with the objects key
                    if (data.hasOwnProperty(key) === true && detect(data[key])) {
                        return true;
                    }
                }
            }
            return false;
        }
        // Return the method
        return detect(data);
    }
    function deepClone(data) {
        // If the data is null or undefined then we return undefined
        if (data === null || data === undefined) {
            return undefined;
        }
        // Get the data type and store it
        const dataType = getDataType(data);
        // If the data passed is a date object
        if (dataType === "Date") {
            // Create a new date object and set the time to what it was previously
            let dataDate = data;
            let clonedDate = new Date();
            clonedDate.setTime(dataDate.getTime());
            return clonedDate;
        }
        // If the data passed is an object
        if (dataType === "Object") {
            // Check for circular references, if there are then we just return the un-cloned data.
            if (isCyclic(data) === true) {
                return data;
            }
            // Create a new object that will store our copied data
            let copiedObject = {};
            // Iterate over the objects keys
            for (let key in data) {
                // Clone the keys of each of the objects so that we can deeply copy and nested data structures
                // For example if an object has a key value that is an array
                // Add this cloned key value to the copiedObject we created earlier
                copiedObject[key] = deepClone(data[key]);
            }
            // Return the deeply copied object
            return copiedObject;
        }
        // If the data is an array
        if (dataType === "Array") {
            // Create a new array that will have no references to the one we want to copy
            let copiedArray = [];
            let dataArray = data;
            // Iterate over the arrays elements
            for (var i = 0; i < dataArray.length; i++) {
                // Push the arrays elements to this new array
                // First recall this method with the elements
                // This is so arrays of objects and other nested data structures get correctly cloned.
                copiedArray.push(deepClone(dataArray[i]));
            }
            // Return the cloned array
            return copiedArray;
        }
        // If it's any other data type like a string or number, they don't need cloning so we just return them
        else {
            return data;
        }
    }

    const ExportPropKey = "props";
    /**
     * eg:
     *  json: ['div', MyCpt, 'div']
     */
    function buildLayoutNestedObj(json) {
        let root = {};
        function buildRoot(target, source) {
            if (isVirtualNode(source)) {
                const tag = source === null || source === void 0 ? void 0 : source.type;
                if (typeof tag === "string") {
                    /**
                     * @TODO how to keep reference to original "props object"?
                     */
                    target[tag] = {
                        [ExportPropKey]: source.props,
                    };
                    if (Array.isArray(source.children) || isVirtualNode(source.children)) {
                        [].concat(source.children).forEach((child) => {
                            buildRoot(target[tag], child);
                        });
                    }
                }
            }
        }
        buildRoot(root, json);
        return root;
    }
    const handlerPathKeySymbol = Symbol.for("handlerPathKeySymbol");
    const draftOperationMethodSymbol = Symbol.for("draftOperationMethod");
    /**
     * key point: apply path to children array with same tag
     * patch[]{
     *   path: ['div', 'div', 'props', 'id'],
     * }
     */
    const DRAFT_OPERATES = [
        exports.CommandOP.addChild,
        exports.CommandOP.addFirst,
        exports.CommandOP.remove,
        exports.CommandOP.replace,
        exports.CommandOP.assignAttrs,
        //
        exports.CommandOP.wrap,
        exports.CommandOP.wrapFirst,
        exports.CommandOP.wrapLast,
    ];
    function getPathsFromDraft(target) {
        return target[handlerPathKeySymbol];
    }
    /**
     * 代理json并记录patch
     * 关键要点：因为有同名节点的存在，同一数组下的同名节点会被合并
     *
     * 返回的是 Proxy对象，只需要考虑 Object，只收集 set
     */
    function proxyLayoutJSON(json) {
        const patches = [];
        const jsonTree = buildLayoutNestedObj(json);
        function createProxy(source, pathArr = []) {
            const clonedTarget = deepClone(source);
            const proxy = new Proxy(clonedTarget, {
                get(target, key) {
                    if (key === handlerPathKeySymbol) {
                        return pathArr;
                    }
                    const v = Reflect.get(target, key);
                    // console.log('target=', target, 'key=', key, 'value=',v);
                    if (typeof key === "string") {
                        if (DRAFT_OPERATES.includes(key)) {
                            return createProxy(Object.assign(() => { }, { [draftOperationMethodSymbol]: key }), pathArr);
                        }
                        else if (typeof v === "object" || v === undefined || v === null) {
                            return createProxy(v || { [fakeProxyObjectSymbol]: true }, pathArr.concat(key));
                        }
                    }
                    return v;
                },
                set(source, key, value) {
                    const currentPathArr = pathArr.concat(key);
                    patches.push({
                        op: exports.CommandOP.setAttrs,
                        path: currentPathArr,
                        value: deepClone(value),
                    });
                    Reflect.set(source, key, value);
                    return true;
                },
                apply(target, thisArg, argArray) {
                    // console.log('argArray: ', argArray);
                    // console.log('target: ', target[draftOperationMethodSymbol]);
                    const currentPathArr = pathArr;
                    const op = target[draftOperationMethodSymbol];
                    patches.push({
                        op,
                        path: currentPathArr,
                        value: argArray[0],
                    });
                },
            });
            return proxy;
        }
        function applyPatches() {
            const newObj = applyJSONTreePatches(json, patches);
            return newObj;
        }
        function appendPatches(ps = []) {
            patches.push(...ps);
        }
        // 此处的类型应该根据 layout 结构生成得出，但这里是通用方法，无法精确取得类型
        const draftJSON = createProxy(jsonTree);
        return {
            draft: draftJSON,
            append: appendPatches,
            apply: applyPatches,
            patches,
        };
    }
    function applyJSONTreePatches(source, patches) {
        let target = source;
        // console.log('patches: ', patches);
        for (const patch of patches) {
            const { op, path, value } = patch;
            const [current, i] = getVirtualNodesByPath(source, path);
            let parent = [];
            if (path.length > 1) {
                parent = getVirtualNodesByPath(source, path.slice(0, -1))[0];
            }
            // console.log('[applyJSONTreePatches] path: ', source, path, current);
            if (isVNodeFunctionComponent(current[0])) {
                mergeConstructOverrideToNode(current, i, patch);
            }
            else {
                const newSource = assignPatchToNode(parent, current, i, patch);
                if (newSource) {
                    target = newSource;
                }
            }
        }
        return target;
    }
    function nodeExists(n1, n2) {
        return typeof n2 === "object" && n1.find((c) => c.type === n2.type);
    }
    function assignPatchToNode(parent, current, depth, patch) {
        const { op, path, value } = patch;
        const jsonValue = value;
        switch (op) {
            case exports.CommandOP.replace:
                parent.forEach((p) => {
                    p.children = p.children.map((child) => {
                        return nodeExists(current, child) ? jsonValue : child;
                    });
                });
                break;
            case exports.CommandOP.addFirst:
                current.forEach((node) => {
                    if (node.children) {
                        node.children = [jsonValue, ...node.children];
                    }
                    else {
                        node.children = [jsonValue];
                    }
                });
                break;
            case exports.CommandOP.addChild:
                // console.log('[assignPatchToNode] current: ', current);
                current.forEach((node) => {
                    if (node.children) {
                        node.children = [].concat(node.children).concat(jsonValue);
                    }
                    else {
                        node.children = [jsonValue];
                    }
                });
                break;
            case exports.CommandOP.remove:
                parent.forEach((p) => {
                    p.children = p.children.filter((child, index) => {
                        return !nodeExists(current, child);
                    });
                });
                break;
            case exports.CommandOP.setAttrs:
                const restKeys = path.slice(depth + 1);
                current.forEach((node) => {
                    signalModel.set(node, restKeys, value);
                });
                break;
            case exports.CommandOP.assignAttrs:
                current.forEach((node) => {
                    Object.assign(node.props, value);
                });
                break;
            case exports.CommandOP.wrap:
                if (parent.length) {
                    parent.forEach((pNode) => {
                        pNode.children.forEach((child, i) => {
                            if (nodeExists(current, child)) {
                                const v = deepClone(jsonValue);
                                pNode.children[i] = v;
                                v.children = [child];
                            }
                        });
                    });
                }
                else {
                    const v = deepClone(jsonValue);
                    v.children.push(...current);
                    return v;
                }
                break;
            case exports.CommandOP.wrapFirst:
                if (parent.length) {
                    parent.forEach((pNode) => {
                        let found = false;
                        pNode.children.forEach((child, i) => {
                            if (nodeExists(current, child) && !found) {
                                const v = deepClone(jsonValue);
                                pNode.children[i] = v;
                                v.children = [child];
                                found = true;
                            }
                        });
                    });
                }
                else {
                    const v = deepClone(jsonValue);
                    v.children.push(...current);
                    return v;
                }
                break;
            case exports.CommandOP.wrapLast:
                parent.forEach((pNode) => {
                    let foundIndex = -1;
                    pNode.children.forEach((child, i) => {
                        if (nodeExists(current, child)) {
                            foundIndex = i;
                        }
                    });
                    if (foundIndex > -1) {
                        jsonValue.children = [pNode.children[foundIndex]];
                        pNode.children[foundIndex] = jsonValue;
                    }
                });
                break;
        }
    }
    function mergeConstructOverrideToNode(nodes, i, patch) {
        const { op, path, value } = patch;
        const newPath = path.slice(i + 1);
        const newPatch = Object.assign(Object.assign({}, patch), { path: newPath });
        nodes.forEach((n) => {
            var _a;
            if (!n.props) {
                n.props = {};
            }
            if ((_a = n.props.override) === null || _a === void 0 ? void 0 : _a.patches) {
                n.props.override.patches.push(newPatch);
            }
            else {
                n.props.override = Object.assign(n.props.override || {}, {
                    patches: [newPatch],
                });
            }
        });
    }
    /**
     * source = div/p/span, path=['div'] => div, 1
     * source = div/span/span, path=['div', 'p'] => null, 1
     * source = div/p/span, path=['div', 'p', 'props'] => 2
     */
    function getVirtualNodesByPath(source, path) {
        let current = [source];
        let i = 0;
        // 'Card.CardContent.Button'
        for (; i < path.length; i++) {
            const type = path[i];
            if (isFunctionComponentPath(type)) {
                /**
                 * 检查冲突情况
                 * @TODO 暂不考虑 polymita-module 和 react-component在同一层级且组件name同名的情况
                 */
                // current.forEach(n => {
                //    // 同层且name相同
                // })
                let isPolymitaModule = false;
                const newCurrent = current.filter((n) => {
                    const matchPolymita = isVNodeFunctionComponent(n) && n.type.name === type;
                    if (matchPolymita) {
                        isPolymitaModule = true;
                    }
                    return matchPolymita;
                });
                // console.log('[getVirtualNodesByPath] FunctionComponent Path current: ', newCurrent);
                /**
                 * @TODO polymita-module默认无children嵌套结构，有patch均认为是修改内部，所以可以直接return
                 */
                if (isPolymitaModule) {
                    current = newCurrent;
                    break;
                }
            }
            const newCurrent = [];
            current.forEach((node) => {
                var _a;
                if (isVirtualNode(node)) {
                    // console.log('[getVirtualNodesByPath] node.type: ', (node.type as any));
                    if (node.type === type) {
                        newCurrent.push(node);
                    }
                    else if (isReactComponent(node.type) &&
                        ((_a = node.type.render) === null || _a === void 0 ? void 0 : _a.name) === type) {
                        newCurrent.push(node);
                    }
                }
            });
            if (newCurrent.length === 0) {
                if (i === 0) {
                    current = [];
                }
                break;
            }
            const nextType = path[i + 1];
            if (nextType) {
                const nextChildren = newCurrent
                    .map((n) => n.children.filter((n) => {
                    if (isVirtualNode(n)) {
                        if (isVNodeFunctionComponent(n)) {
                            return n.type.name === nextType;
                        }
                        return n.type === nextType;
                    }
                }))
                    .flat();
                if (nextChildren.length === 0) {
                    break;
                }
                current = nextChildren;
            }
        }
        return [current, i];
    }
    function runLogicOverrides(overrides, props, logicResult) {
        let prevLogicResult = logicResult;
        // patch logic
        overrides.forEach((override) => {
            var _a;
            prevLogicResult = (_a = override.patchLogic) === null || _a === void 0 ? void 0 : _a.call(override, props, prevLogicResult);
        });
        return prevLogicResult;
    }
    function runLayoutAndRulesOverrides(overrides, props, draft) {
        // patch layout
        overrides.forEach((override) => {
            var _a, _b;
            // 兼容逻辑
            (_a = override.layout) === null || _a === void 0 ? void 0 : _a.call(override, props, draft);
            if (override.patchLayout) {
                const patchLayoutCommands = override.patchLayout(props, draft);
                (_b = patchLayoutCommands === null || patchLayoutCommands === void 0 ? void 0 : patchLayoutCommands.forEach) === null || _b === void 0 ? void 0 : _b.call(patchLayoutCommands, (cmd) => {
                    doPatchLayoutCommand(cmd, draft);
                });
            }
            if (override.patchRules) {
                const rules = override.patchRules(props, draft);
                assignRules(draft, rules);
            }
        });
    }
    function doPatchLayoutCommand(cmd, draft) {
        if ((cmd === null || cmd === void 0 ? void 0 : cmd.condition) === false) {
            return;
        }
        let parent = draft;
        const paths = getPathsFromDraft(cmd.target);
        paths.forEach((path) => (parent = parent[path]));
        if (cmd.op === exports.CommandOP.addChild ||
            cmd.op === exports.CommandOP.addFirst ||
            cmd.op === exports.CommandOP.replace) {
            parent[cmd.op](cmd.child);
        }
        else if (cmd.op === exports.CommandOP.remove) {
            parent[cmd.op]();
        }
        else if (cmd.op === exports.CommandOP.assignAttrs) {
            parent[cmd.op](cmd.attrs);
        }
        else if (cmd.op === exports.CommandOP.wrap ||
            cmd.op === exports.CommandOP.wrapFirst ||
            cmd.op === exports.CommandOP.wrapLast) {
            parent[cmd.op](cmd.parent);
        }
    }
    const fakeProxyObjectSymbol = Symbol.for("fakeProxyObjectSymbol");
    function isFake(obj) {
        return obj && obj[fakeProxyObjectSymbol];
    }
    function assignRules(draft, rules) {
        for (const rule of rules) {
            const { condition, target: draftTarget, style, className } = rule;
            if (!!condition || condition === undefined) {
                const pathInDraft = getPathsFromDraft(draftTarget);
                if (style) {
                    const stylePath = pathInDraft.concat(["props", "style"]);
                    const styleObj = signalModel.get(draft, stylePath);
                    if (isFake(styleObj)) {
                        signalModel.set(draft, stylePath, {});
                    }
                    Object.entries(style).forEach(([k, v]) => {
                        signalModel.set(draft, stylePath.concat(k), v);
                    });
                }
                if (className) {
                    const classNamePath = pathInDraft.concat(["props", "className"]);
                    signalModel.set(draft, classNamePath, className);
                }
            }
        }
    }
    const moduleIndexKey = (m) => `${m.namespace}-${m.name}`;
    function getModulesByBase(m, mp) {
        const key = moduleIndexKey(m);
        const modules = mp.get(key);
        return (modules || []).filter((m) => {
            return key !== moduleIndexKey(m);
        });
    }
    /**
     *
     * module link Map relation
     * {
     *   [module.namespace1-name1]: [Module1, ...],
     *   [module.namespace2-name2]: [Module2, Module2-override, ...],
     * }
     * active modules:
     * [module.namespace1-name1]
     * @param m
     * @param mp
     */
    function getActiveModuleByBase(m, mp, activeModules) {
        const key = moduleIndexKey(m);
        if (m && mp && activeModules) {
            const modules = mp.get(key);
            let result = [];
            modules === null || modules === void 0 ? void 0 : modules.forEach((m) => {
                const i = activeModules.indexOf(moduleIndexKey(m));
                if (i >= 0) {
                    result.push([i, m]);
                }
            });
            return result.sort((a, b) => a[0] - b[0]).map((arr) => arr[1]);
        }
    }
    globalThis.xxx = [];
    /**
     * module link Map relation
     * {
     *   [module.namespace1-name1]: [Module1, ...],
     *   [module.namespace2-name2]: [Module2, Module2-override, ...],
     * }
     * @param m
     * @param mp
     */
    function registerModule(m, mp) {
        if (m && mp) {
            const key = moduleIndexKey(m);
            let modules = mp.get(key);
            if (modules) {
                if (!modules.includes(m)) {
                    modules.push(m);
                }
            }
            else {
                modules = [m];
            }
            mp.set(key, modules);
        }
        if (mp && (m === null || m === void 0 ? void 0 : m.base)) {
            const baseKey = moduleIndexKey(m.base);
            let baseModules = mp.get(baseKey);
            if (baseModules && !baseModules.includes(m)) {
                baseModules.push(m);
            }
            else {
                baseModules = [m];
            }
            mp.set(baseKey, baseModules);
        }
    }
    function mergeOverrideModules(modules) {
        if (modules.length > 1) {
            return modules.reduce((p, n) => {
                return extendModule(p, n.override);
            });
        }
        return modules[0];
    }
    function extendModule(module, override) {
        const newModule = Object.assign(Object.assign({}, module), { base: module, override() {
                var _a;
                const p1 = ((_a = module.override) === null || _a === void 0 ? void 0 : _a.call(module)) || [];
                const p2 = override();
                return [].concat(p1).concat(p2);
            } });
        return newModule;
    }

    const HOVER = "hover";
    const ACTIVE = "active";
    const FOCUS = "focus";
    const DISABLED = "disabled";
    const SELECTED = "selected";
    const CSS = {
        HOVER,
        ACTIVE,
        FOCUS,
    };
    const ATTR = {
        DISABLED,
        SELECTED,
    };
    function isPseudo(k) {
        return [HOVER, ACTIVE, FOCUS].includes(k);
    }
    function isAttr(k) {
        return [DISABLED, SELECTED].includes(k);
    }
    function mapBooleanToNumber(b) {
        return b === true || b === 1 ? 1 : 0;
    }
    /**
     * according to same attr and sematic
     */
    function mergeStyleObjs(cssObjs) {
        const map = new Map();
        cssObjs.forEach((cssObj) => {
            const { attr, pseudo, sematic } = cssObj;
            const key = `${attr.map((arr) => arr.join("")).join("")}${pseudo || ""}${sematic}`;
            const old = map.get(key);
            if (old) {
                old.style = Object.assign(Object.assign({}, old.style), cssObj.style);
            }
            else {
                map.set(key, cssObj);
            }
        });
        return [...map.values()];
    }
    function pushAttr(attr, item) {
        if (!attr.some((arr) => arr[0] === item[0])) {
            attr.push(item);
        }
    }
    function constructCSSObj(matrix) {
        const [constraints, rules] = matrix;
        const cssObjs = [];
        Object.entries(rules).forEach(([sematic, cssMatrix]) => {
            const commonStyle = {};
            Object.entries(cssMatrix).forEach(([cssProp, cssMatrix]) => {
                Object.entries(cssMatrix).forEach(([cssValue, matches]) => {
                    function newCSSObj(valueArr) {
                        const cssObj = {
                            attr: [],
                            style: {},
                            sematic,
                        };
                        if (matches.length === 0 || matches.every((v) => v === "*")) {
                            commonStyle[cssProp] = cssValue;
                        }
                        const attrMatches = [];
                        valueArr.forEach((match, i) => {
                            if (match !== "*") {
                                pushAttr(attrMatches, [
                                    constraints[i],
                                    mapBooleanToNumber(match),
                                ]);
                            }
                        });
                        const pseudos = attrMatches
                            .filter(([attrOrPseudo, val]) => {
                            return isPseudo(attrOrPseudo) && val !== 0;
                        })
                            .map((arr) => arr[0]);
                        const attrMatchesWithoutPseudo = attrMatches.filter(([attrOrPseudo, val]) => {
                            return !isPseudo(attrOrPseudo);
                        });
                        if (pseudos.length > 1) {
                            console.error(`[createPatternCSS] only one pseudo is allowed, but received ${pseudos}`);
                        }
                        cssObj.pseudo = pseudos[0];
                        cssObj.attr = attrMatchesWithoutPseudo;
                        cssObj.style[cssProp] = cssValue;
                        return cssObj;
                    }
                    if (Array.isArray(matches[0])) {
                        matches.forEach((match, i) => {
                            if (Array.isArray(match)) {
                                const cssObj = newCSSObj(match);
                                cssObjs.push(cssObj);
                            }
                        });
                    }
                    else {
                        const cssObj = newCSSObj(matches);
                        cssObjs.push(cssObj);
                    }
                });
            });
            if (Object.keys(commonStyle).length > 0) {
                cssObjs.push({
                    attr: [],
                    style: commonStyle,
                    sematic,
                });
            }
        });
        return cssObjs;
    }
    const AttributeSelectorPrefix = "data-";
    function generateCSSIntoSematic(cssObjs) {
        const sematicMap = {};
        cssObjs.forEach((cssObj, i) => {
            const { attr, pseudo, style, sematic } = cssObj;
            const old = sematicMap[sematic];
            const attributeSelector = attr.reduce((acc, [attr, val]) => {
                acc[0] += String(attr);
                acc[1] += String(val);
                return acc;
            }, [AttributeSelectorPrefix, ""]);
            const attributeSelectorText = attr.length > 0
                ? `[${attributeSelector[0]}="${attributeSelector[1]}"]`
                : "";
            const styleText = Object.entries(style)
                .map(([k, v]) => {
                return `${camelToLine(k)}: ${v};`;
            })
                .join("");
            const pseudoSelector = pseudo ? `:${pseudo}` : "";
            const clsText = `
      ${old || ""}
      &${attributeSelectorText}${pseudoSelector}{
        ${styleText}
      }
    `;
            // const r = `
            // & ${attributeSelectorText} ${pseudoSelector} {
            //   ${styleText}
            // }`
            // console.log(`i=${i} s=${cssObj.sematic}`, cssObj, cls, r)
            sematicMap[sematic] = clsText;
        });
        return sematicMap;
    }
    /**
     * 暂不加 hash，如果有相同的css，确实就会生成完全相同的css
     */
    function createPatternCSS(matrix) {
        const cssObjs = constructCSSObj(matrix);
        const mergedObjs = mergeStyleObjs(cssObjs);
        const sematicCls = generateCSSIntoSematic(mergedObjs);
        return sematicCls;
    }
    function assignDeclarationPatterns(json, patternMatrix) {
        // const source = deepClone(json)
        const source = Object.assign({}, json);
        const attributeConstraints = patternMatrix[0].filter(isAttr);
        const pattern = createPatternCSS(patternMatrix);
        traverseLayoutTree(source, (node) => {
            const { props } = node;
            for (const sematic in pattern) {
                if (checkSematic(sematic, props)) {
                    const clsText = pattern[sematic];
                    const cls = css.css `
          ${clsText}
        `;
                    if (props.className) {
                        props.className = `${props.className} ${cls}`;
                    }
                    else {
                        props.className = cls;
                    }
                    const attributeSelector = [
                        AttributeSelectorPrefix,
                        [],
                        [],
                    ];
                    const singleProps = [];
                    attributeConstraints.forEach((attr) => {
                        if (attr in props) {
                            attributeSelector[1].push(attr);
                            attributeSelector[2].push(mapBooleanToNumber(props[attr]));
                            singleProps.push([attr, mapBooleanToNumber(props[attr])]);
                        }
                    });
                    if (attributeSelector[1].length > 0) {
                        const newProp = [
                            attributeSelector[0],
                            attributeSelector[1].join(""),
                        ].join("");
                        props[newProp] = attributeSelector[2].join("");
                    }
                    singleProps.forEach(([attr, val]) => {
                        props[`${AttributeSelectorPrefix}${attr}`] = String(val);
                    });
                }
            }
        });
        return source;
    }

    const driverWeakMap = new Map();
    typeof window !== 'undefined' && (window.driverWeakMap = driverWeakMap);
    /**
     * fix error:
     *    react-dom.development.js:86 Warning: Received `true` for a non-boolean attribute `is-container`.If you want to write it to the DOM, pass a string instead: is-container="true" or is-container={value.toString()}.
     */
    function filterPatternSematicProps(props) {
        if (!props) {
            return props;
        }
        const obj = {};
        Object.keys(props).forEach(key => {
            if (key.startsWith(`${SEMATIC_RELATION_IS}-`) || key.startsWith(`${SEMATIC_RELATION_HAS}-`)) {
                obj[key] = 1;
            }
            else if (key === renderHTMLProp) {
                obj.dangerouslySetInnerHTML = { __html: props[key] };
            }
            else {
                obj[key] = props[key];
            }
        });
        return obj;
    }
    /**
     * in web-component mode, we need to transform className to class
     * because React wont convert "className" to "class" by default
     */
    function transformClsName(props, type) {
        if ((props === null || props === void 0 ? void 0 : props.className) &&
            typeof type === 'string' &&
            /[a-z]+(?:[A-Z][a-z]*)+/.test(type)) {
            props.class = props.className;
            delete props.className;
        }
        return props;
    }
    function createReactContainer(React, module, stateManagement, options) {
        // shallow copy so that can mark cache in module
        module = Object.assign({}, module);
        const cacheSymbol = Symbol('cacheSymbol');
        const modulePropTypes = module.propTypes;
        const runReactLogic = stateManagement === null || stateManagement === void 0 ? void 0 : stateManagement.runLogic.bind(null, React, module.logic);
        const convertProps = (stateManagement === null || stateManagement === void 0 ? void 0 : stateManagement.convertProps) || ((props) => props);
        function initLogic(props) {
            let cache = module[cacheSymbol];
            if (cache) {
                cache.props = props;
            }
            else {
                module[cacheSymbol] = { props };
                cache = module[cacheSymbol];
            }
            if (!runReactLogic || !module.logic) {
                return;
            }
            const r = runReactLogic([props]);
            cache.logicResult = r;
            cache.props = props;
            return r;
        }
        function updateLogic(r) {
            let cache = module[cacheSymbol];
            if (cache) {
                cache.logicResult = r;
            }
        }
        function runLogicFromCache() {
            const cache = module[cacheSymbol];
            if (cache) {
                return cache.logicResult;
            }
            throw new Error('[runLogic] must run with cached props');
        }
        function getLayoutFromModule(props) {
            var _a;
            const cache = module[cacheSymbol];
            if (cache && cache.proxyHandler) {
                return cache;
            }
            const json = (_a = module.layout) === null || _a === void 0 ? void 0 : _a.call(module, props);
            const handler = proxyLayoutJSON(json);
            if (json) {
                cache.proxyHandler = handler;
            }
            return cache;
        }
        function disposeFromModule() {
            delete module[cacheSymbol];
        }
        function createElementDepth(json, options) {
            if (!json) {
                return;
            }
            if (!isVirtualNode(json)) {
                return json;
            }
            if (isVNodeComponent(json)) {
                json = json.type(Object.assign(Object.assign({}, (json.props || {})), { children: json.children }));
            }
            if (shouldNotRender(json)) {
                return null;
            }
            /**
             * it's danger
             */
            if (ShouldRenderAttr in (json === null || json === void 0 ? void 0 : json.props)) {
                delete json.props[ShouldRenderAttr];
            }
            let children = json.children;
            const nodeType = getNodeType(json.type, json.props);
            let elementArgs = [nodeType, transformClsName(filterPatternSematicProps(json.props), json.type)];
            const originModule = getModuleFromFunctionComponent(nodeType);
            if (originModule) {
                // console.log('[render] originModule: ', options.modulesLinkMap, originModule.namespace, originModule.name);
                const alreadyActiveOverrideModules = getActiveModuleByBase(originModule, options.modulesLinkMap, options.modulesActiveMap);
                // console.log('[render] readyActiveOverrideModules: ', alreadyActiveOverrideModules);
                if (alreadyActiveOverrideModules === null || alreadyActiveOverrideModules === void 0 ? void 0 : alreadyActiveOverrideModules.length) {
                    const newModule = mergeOverrideModules(alreadyActiveOverrideModules);
                    const newNodeType = createFunctionComponent(newModule);
                    migrateRenderContext(nodeType, newNodeType);
                    elementArgs[0] = newNodeType;
                }
            }
            if (Array.isArray(json.children)) {
                children = json.children.map(child => {
                    if (isVirtualNode(child)) {
                        return createElementDepth(child, options);
                    }
                    return child;
                });
                elementArgs.push(...children);
            }
            else {
                if (isVirtualNode(json.children)) {
                    children = createElementDepth(json.children, options);
                }
                elementArgs.push(children);
            }
            return React.createElement(...elementArgs);
        }
        function construct(props, overrides) {
            var _a, _b, _c, _d, _e;
            /**
             * 处理props
             * 1.填充propTypes default
             * 2.使用插件的convertProps拓展转换
             */
            if (!props) {
                props = {};
            }
            const defaultPropsRef = React.useRef(null);
            if (!defaultPropsRef.current) {
                defaultPropsRef.current = assignDefaultValueByPropTypes({}, modulePropTypes);
            }
            props = Object.assign({}, defaultPropsRef.current, props);
            const convertedProps = convertProps(props, modulePropTypes);
            const moduleOverrides = ((_a = module.override) === null || _a === void 0 ? void 0 : _a.call(module)) || [];
            const allOverrideModules = [...moduleOverrides, ...overrides];
            // console.log('[construct] allOverrideModules: ', allOverrideModules[0]?.patchLayout.toString());
            const logicResult = initLogic(convertedProps);
            const overrideLogicResult = runLogicOverrides(allOverrideModules, convertedProps, logicResult);
            if (overrideLogicResult !== logicResult) {
                updateLogic(overrideLogicResult);
            }
            const { proxyHandler } = getLayoutFromModule(convertedProps);
            if (proxyHandler) {
                // inject & keep reference
                const rules = (_b = module.styleRules) === null || _b === void 0 ? void 0 : _b.call(module, convertedProps, proxyHandler.draft);
                if (rules) {
                    assignRules(proxyHandler.draft, rules);
                }
                runLayoutAndRulesOverrides(allOverrideModules, convertedProps, proxyHandler.draft);
                allOverrideModules.forEach(override => {
                    proxyHandler.append(override.patches);
                });
                let newJSON = proxyHandler.apply();
                // assign top attributes to root Node
                newJSON = mergeFromProps(newJSON, props, ['className', 'id', 'style']);
                const patternResult = (_c = module.designPattern) === null || _c === void 0 ? void 0 : _c.call(module, convertedProps);
                if (patternResult) {
                    newJSON = assignPattern(newJSON, patternResult, options.useEmotion);
                }
                const declarationPatterns = (_d = module.designPatterns) === null || _d === void 0 ? void 0 : _d.call(module, convertedProps);
                if (declarationPatterns) {
                    if (Array.isArray(declarationPatterns)) {
                        newJSON = assignDeclarationPatterns(newJSON, declarationPatterns);
                    }
                }
                /** modify layout json */
                (_e = stateManagement === null || stateManagement === void 0 ? void 0 : stateManagement.transform) === null || _e === void 0 ? void 0 : _e.call(stateManagement, newJSON);
                disposeFromModule();
                return newJSON;
            }
            return null;
        }
        function render(json) {
            const root = createElementDepth(json, options);
            return root;
        }
        function getLayout(props) {
            const convertedProps = convertProps(props, modulePropTypes);
            const { proxyHandler } = getLayoutFromModule(convertedProps);
            return proxyHandler === null || proxyHandler === void 0 ? void 0 : proxyHandler.draft;
        }
        return {
            render,
            construct,
            runLogic: runLogicFromCache,
            getLayout,
        };
    }

    function h(type, props, ...children) {
        /** compatible with different versions jsx: children in props, and key in children */
        if (props === null || props === void 0 ? void 0 : props.children) {
            if (children.length !== 0) {
                /** third parameter is key  */
                props.key = children;
            }
            children = [].concat(props.children);
            delete props.children;
        }
        const result = {
            key: props === null || props === void 0 ? void 0 : props.key,
            flags: VirtualNodeTypeSymbol,
            type,
            props: props || {},
            children: children.flat() /** @TODO it's danger! */,
        };
        let key = props === null || props === void 0 ? void 0 : props.key;
        if (key) {
            result.key = key;
        }
        return result;
    }
    let globalCurrentRenderer = [];
    function getCurrentRenderer() {
        return last(globalCurrentRenderer);
    }
    function pushCurrentRenderer(renderer) {
        globalCurrentRenderer.push(renderer);
    }
    function popCurrentRenderer() {
        globalCurrentRenderer.pop();
    }
    const renderContextSymbol = Symbol("renderContextSymbol");
    function attachRendererContext(target, context) {
        target[renderContextSymbol] = context;
    }
    function migrateRenderContext(from, to) {
        to[renderContextSymbol] = from[renderContextSymbol];
        // delete from[renderContextSymbol]
    }
    function traverseAndAttachRendererContext(json, context) {
        function dfs(node) {
            var _a;
            if (node &&
                isVNodeFunctionComponent(node) &&
                !getRendererContext(node.type)) {
                attachRendererContext(node.type, context);
            }
            (_a = node === null || node === void 0 ? void 0 : node.children) === null || _a === void 0 ? void 0 : _a.forEach(dfs);
        }
        dfs(json);
    }
    function getRendererContext(target) {
        return target[renderContextSymbol];
    }
    /**
     *
     * R: React，
     * 传入的状态是正常变量，不是信号
     */
    function createRHRenderer(module, renderHost, override) {
        const renderer = createRenderer3({
            module,
            override,
            renderHost,
            stateManagement: config$1,
            createRenderContainer: createReactContainer,
        });
        return renderer;
    }
    function createRHSRenderer(module, renderHost, override) {
        const renderer = createRenderer3({
            module,
            override,
            renderHost,
            stateManagement: config,
            createRenderContainer: createReactContainer,
        });
        return renderer;
    }
    /**
     * R: React
     * S: Signal
     * 传入的props是信号
     */
    function createRSRenderer(module, renderHost, override) {
        const renderer = createRenderer3({
            module,
            override,
            renderHost,
            stateManagement: config$2,
            createRenderContainer: createReactContainer, // @TODO1
        });
        return renderer;
    }
    /**
     * 组件嵌套
     *
     * 入参
     * 1.配置 module, override
     * 2.动态环境 RenderContainerConstructor, statement, 外部framework
     *
     * 先固化配置
     * 在渲染的时候，获取 RenderContainerConstructor (statement, framework host)
     *
     * usage 引用组件（like react style)：
     * 1.specific component
     *   eg: Cpt = createComponent(module, override)，声明Parent外部
     * 2.render in parent module:
     *   eg: function ParentModule() { return <Cpt />  }
     *
     * usage 组合组件（相当于源码引用，类似于代码写在一起的效果）
     * 1.specific internal module
     *  eg: ChildModule = createComposeComponent(module, override)
     * 2.compose in parent module
     *  eg: function ParentModule() { return <ChildModule />  }
     */
    /**
     * 创建渲染器 createRoot
     * 1.内部保留了这个所需的：renderContainer, statement, 外部framework
     *  1.1 生成 renderContainerContext
     * 2.在渲染的时候
     *  2.1 使用FunctionComponent，内部执行framework 组件
     * 3.返回 framework.Element
     */
    function createRHRoot(config) {
        const currentRendererContext = {
            renderHost: config.renderHost,
            createRenderContainer: createReactContainer,
            stateManagement: config$1,
        };
        return {
            wrap(component) {
                return (props) => {
                    attachRendererContext(component, currentRendererContext);
                    const ele = config.renderHost.framework.lib.createElement(component, props);
                    return ele;
                };
            },
        };
    }
    function createRSRoot(config) {
        const currentRendererContext = {
            renderHost: config.renderHost,
            createRenderContainer: createReactContainer,
            stateManagement: config$2,
        };
        return {
            wrap(component) {
                return (props) => {
                    attachRendererContext(component, currentRendererContext);
                    const ele = config.renderHost.framework.lib.createElement(component, props);
                    return ele;
                };
            },
        };
    }
    function createFunctionComponent(module, override) {
        const { name } = module;
        if (name && /^[a-z]/.test(String(name))) {
            throw new Error(`First char of module name must be uppercase, but got ${name}.`);
        }
        /**
         * real component code in framework
         */
        function frameworkFunctionComponent(props) {
            const { override: secondOverride } = props, restProps = __rest(props, ["override"]);
            const rendererContext = getRendererContext(frameworkFunctionComponent);
            const { createRenderContainer, renderHost, stateManagement } = rendererContext;
            const renderer = createRenderer3({
                module,
                override,
                stateManagement,
                renderHost,
                createRenderContainer,
            });
            renderer.construct(restProps, secondOverride);
            return renderer.render();
        }
        Object.defineProperty(frameworkFunctionComponent, "name", {
            get() {
                return name || "Unknown function component";
            },
        });
        const componentWithSymbol = Object.assign(frameworkFunctionComponent, {
            [VNodeFunctionComponentSymbol]: true,
            [VNodeFunctionComponentOriginModuleSymbol]: module,
        });
        return componentWithSymbol;
    }
    function createComposeComponent(module) {
        const { name } = module;
        if (name && /^[a-z]/.test(String(name))) {
            throw new Error(`First char of module name must be uppercase, but got ${name}.`);
        }
        function frameworkComposeComponent(props) {
            const json = module.layout(props);
            return json;
        }
        Object.defineProperty(frameworkComposeComponent, "name", {
            get() {
                return name || "Unknown compose function component";
            },
        });
        const componentWithSymbol = Object.assign(frameworkComposeComponent, {
            [VNodeComponentSymbol]: true,
        });
        return componentWithSymbol;
    }
    /**
     *
     * common render constructor
     */
    function createRenderer3(config) {
        var _a, _b;
        const { module, override, renderHost, createRenderContainer, stateManagement, } = config;
        const rendererContext = {
            renderHost,
            createRenderContainer,
            stateManagement,
        };
        const rendererContainer = createRenderContainer(renderHost.framework.lib, module, stateManagement, {
            useEmotion: renderHost.useEmotion,
            modulesLinkMap: (_a = renderHost.moduleOverride) === null || _a === void 0 ? void 0 : _a.modulesLinkMap,
            modulesActiveMap: (_b = renderHost.moduleOverride) === null || _b === void 0 ? void 0 : _b.modulesActiveMap,
        });
        let layoutJSON = null;
        function construct(props, secondOverride) {
            const mergedOverrides = [override, secondOverride].filter(Boolean);
            pushCurrentRenderer(rendererContainer);
            const r = rendererContainer.construct(props, mergedOverrides);
            popCurrentRenderer();
            traverseAndAttachRendererContext(r, rendererContext);
            layoutJSON = r;
            return r;
        }
        function render() {
            if (!layoutJSON) {
                return;
            }
            return rendererContainer.render(layoutJSON);
        }
        const currentRendererInstance = {
            construct,
            render,
            rendererContext,
        };
        return currentRendererInstance;
    }
    /**
     * export hooks
     */
    function useLogic(...args) {
        const renderer = getCurrentRenderer();
        if (!renderer) {
            throw new Error("useLogic must be called in render function");
        }
        return renderer.runLogic(...args);
    }
    function useLayout() {
        const renderer = getCurrentRenderer();
        if (!renderer) {
            throw new Error("useLayout must be called in render function");
        }
        return renderer.getLayout();
    }
    // export function h2<
    //   T extends string | Function,
    //   CT1 extends string | Function = undefined,
    //   CT2 extends string | Function = undefined,
    //   CT3 extends string | Function = undefined,
    //   C11 extends string | Function = undefined,
    //   C12 extends string | Function = undefined,
    //   C13 extends string | Function = undefined,
    //   C21 extends string | Function = undefined,
    //   C22 extends string | Function = undefined,
    //   C23 extends string | Function = undefined,
    //   C31 extends string | Function = undefined,
    //   C32 extends string | Function = undefined,
    //   C33 extends string | Function = undefined,
    //   CB1 = undefined,
    //   CB2 = undefined,
    //   CB3 = undefined
    // >(
    //   type: T,
    //   props?: Record<string, any> | null,
    //   c1?: VLayoutNode<CT1, C11, C12, C13> | CB1,
    //   c2?: VLayoutNode<CT2, C21, C22, C23> | CB2,
    //   c3?: VLayoutNode<CT3, C31, C32, C33> | CB3
    // ) {
    //   if (isVNodeComponent(type)) {
    //     const json = (type as any)({
    //       ...(props || {})
    //     })
    //     return json as VLayoutNode<
    //       T,
    //       CT1,
    //       CT2,
    //       CT3,
    //       C11,
    //       C12,
    //       C13,
    //       C21,
    //       C22,
    //       C23,
    //       C31,
    //       C32,
    //       C33,
    //       CB1,
    //       CB2,
    //       CB3
    //     >
    //   }
    //   let key: VLayoutNode<string>['key'] = props?.key
    //   let children = []
    //   if (props?.children) {
    //     if (c1) {
    //       key = c1
    //     }
    //     children = props.children
    //     delete props.children
    //   } else {
    //     children = [c1, c2, c3].filter(Boolean)
    //   }
    //   if (key !== undefined) {
    //     props.key = key
    //   }
    //   const vLayoutNode = {
    //     type,
    //     flags: VirtualNodeTypeSymbol,
    //     props: props || {},
    //     children: [c1, c2, c3].filter(Boolean)
    //   } as unknown as VLayoutNode<
    //     T,
    //     CT1,
    //     CT2,
    //     CT3,
    //     C11,
    //     C12,
    //     C13,
    //     C21,
    //     C22,
    //     C23,
    //     C31,
    //     C32,
    //     C33,
    //     CB1,
    //     CB2,
    //     CB3
    //   >
    //   return vLayoutNode
    // }

    var PKG = {
      "name": "@polymita/renderer",
      "version": "2.0.26",
      "description": "useHook serverless framework",
      "main": "./dist/renderer.umd.js",
      "types": "./dist/renderer.umd.d.ts",
      "scripts": {
        "tsd": "tsd",
        "watch-unit": "jest --watch -- __test__/react-signal-cases/render.new.test.ts",
        "wu": "sh scripts/dev-unit.sh",
        "test-unit": "jest",
        "test-ci": "jest --coverage",
        "test": "npm run test-unit",
        "format": "prettier --write --parser typescript \"*/*.ts?(x)\"",
        "build": "rm -rf dist/ && npm run format && rollup --config rollup.config.js && sh after-build.sh",
        "build:watch": "rm -rf dist/ && npm run format && rollup --config rollup.config.js --watch",
        "release": "npm run build && npm run test-ci && npm run tsd && bump --commit \"release: @polymita/renderer v%s\""
      },
      "exports": {
        ".": {
          "import": "./dist/renderer.esm.js",
          "default": "./dist/renderer.umd.js"
        },
        "./jsx-runtime": {
          "import": "./dist/jsx-runtime.esm.js",
          "default": "./dist/jsx-runtime.esm.js"
        }
      },
      "typesVersions": {
        "*": {
          ".": [
            "./dist/renderer.d.ts"
          ],
          "./jsx-runtime": [
            "./dist/jsx-runtime.d.ts"
          ]
        }
      },
      "tsd": {
        "directory": "__test_types__",
        "compilerOptions": {
          "strict": false
        }
      },
      "files": [
        "src",
        "dist",
        "package.json",
        "jsx-runtime.ts"
      ],
      "repository": {
        "type": "git",
        "url": "git+https://github.com/zhou-yg/tarat.git"
      },
      "author": "zhouyg",
      "bugs": {
        "url": "https://github.com/zhou-yg/tarat/issues"
      },
      "homepage": "https://github.com/zhou-yg/tarat#readme",
      "dependencies": {
        "@emotion/css": "^11.10.5",
        "csstype": "^3.1.1"
      },
      "peerDependencies": {
        "@polymita/signal-model": "workspace:^"
      },
      "devDependencies": {
        "@jsdevtools/version-bump-prompt": "6.1.0",
        "@polymita/renderer": "workspace:^",
        "@polymita/signal-model": "workspace:^",
        "@rollup/plugin-alias": "^3.1.9",
        "@rollup/plugin-node-resolve": "^13.3.0",
        "@rollup/plugin-replace": "^4.0.0",
        "@rollup/plugin-typescript": "^6.1.0",
        "@types/jest": "^29.4.0",
        "@types/node": "^18.6.2",
        "jest": "^29.4.1",
        "prettier": "^2.8.3",
        "rollup": "^2.79.1",
        "rollup-plugin-dts": "^4.2.2",
        "rollup-plugin-typescript2": "^0.31.2",
        "test": "^3.2.1",
        "ts-jest": "^29.0.5",
        "tsd": "^0.25.0",
        "tslib": "^2.4.0"
      }
    };

    // @ts
    if (typeof window !== "undefined") {
        if (window["@polymita/renderer/meta"]) {
            throw new Error("[@polymita/renderer/meta] already loaded");
        }
        // @ts-ignore
        window["@polymita/renderer/meta"] = {
            version: PKG.version,
        };
    }

    Object.defineProperty(exports, 'get', {
        enumerable: true,
        get: function () { return signalModel.get; }
    });
    Object.defineProperty(exports, 'set', {
        enumerable: true,
        get: function () { return signalModel.set; }
    });
    exports.ACTIVE = ACTIVE;
    exports.ATTR = ATTR;
    exports.CSS = CSS;
    exports.DISABLED = DISABLED;
    exports.FOCUS = FOCUS;
    exports.HOVER = HOVER;
    exports.PropTypes = PropTypes;
    exports.SELECTED = SELECTED;
    exports.SEMATIC_RELATION_HAS = SEMATIC_RELATION_HAS;
    exports.SEMATIC_RELATION_IS = SEMATIC_RELATION_IS;
    exports.ShouldRenderAttr = ShouldRenderAttr;
    exports.SignalFlag = SignalFlag;
    exports.VNodeComponentSymbol = VNodeComponentSymbol;
    exports.VNodeFunctionComponentOriginModuleSymbol = VNodeFunctionComponentOriginModuleSymbol;
    exports.VNodeFunctionComponentSymbol = VNodeFunctionComponentSymbol;
    exports.VirtualNodeTypeSymbol = VirtualNodeTypeSymbol;
    exports.applyJSONTreePatches = applyJSONTreePatches;
    exports.assignDeclarationPatterns = assignDeclarationPatterns;
    exports.assignDefaultValueByPropTypes = assignDefaultValueByPropTypes;
    exports.assignPattern = assignPattern;
    exports.assignRules = assignRules;
    exports.buildLayoutNestedObj = buildLayoutNestedObj;
    exports.camelToLine = camelToLine;
    exports.checkSematic = checkSematic;
    exports.classNames = classNames;
    exports.classnames = classnames;
    exports.config = config$2;
    exports.constructCSSObj = constructCSSObj;
    exports.convertToSignal = convertToSignal;
    exports.createComposeComponent = createComposeComponent;
    exports.createFunctionComponent = createFunctionComponent;
    exports.createPatternCSS = createPatternCSS;
    exports.createRHRenderer = createRHRenderer;
    exports.createRHRoot = createRHRoot;
    exports.createRHSRenderer = createRHSRenderer;
    exports.createRSRenderer = createRSRenderer;
    exports.createRSRoot = createRSRoot;
    exports.createReactContainer = createReactContainer;
    exports.createRenderer3 = createRenderer3;
    exports.doPatchLayoutCommand = doPatchLayoutCommand;
    exports.extendModule = extendModule;
    exports.getActiveModuleByBase = getActiveModuleByBase;
    exports.getModuleFromFunctionComponent = getModuleFromFunctionComponent;
    exports.getModulesByBase = getModulesByBase;
    exports.getNodeType = getNodeType;
    exports.getPathsFromDraft = getPathsFromDraft;
    exports.getVirtualNodesByPath = getVirtualNodesByPath;
    exports.h = h;
    exports.handlerPathKeySymbol = handlerPathKeySymbol;
    exports.isArray = isArray;
    exports.isFunction = isFunction;
    exports.isFunctionComponentPath = isFunctionComponentPath;
    exports.isFunctionVNode = isFunctionVNode;
    exports.isReactComponent = isReactComponent;
    exports.isVNodeComponent = isVNodeComponent;
    exports.isVNodeFunctionComponent = isVNodeFunctionComponent;
    exports.isVirtualNode = isVirtualNode;
    exports.last = last;
    exports.lowerCaseType = lowerCaseType;
    exports.matchPatternMatrix = matchPatternMatrix;
    exports.mergeFromProps = mergeFromProps;
    exports.mergeOverrideModules = mergeOverrideModules;
    exports.mergeStyleObjs = mergeStyleObjs;
    exports.migrateRenderContext = migrateRenderContext;
    exports.proxyLayoutJSON = proxyLayoutJSON;
    exports.registerModule = registerModule;
    exports.renderHTMLProp = renderHTMLProp;
    exports.runLayoutAndRulesOverrides = runLayoutAndRulesOverrides;
    exports.runLogicOverrides = runLogicOverrides;
    exports.shouldNotRender = shouldNotRender;
    exports.transform = transform;
    exports.traverse = traverse;
    exports.traverseLayoutTree = traverseLayoutTree;
    exports.typeDefaultValueFlagSymbol = typeDefaultValueFlagSymbol;
    exports.typeFlagSymbol = typeFlagSymbol;
    exports.useLayout = useLayout;
    exports.useLogic = useLogic;

    Object.defineProperty(exports, '__esModule', { value: true });

}));



(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@polymita/signal-model'), require('react')) :
  typeof define === 'function' && define.amd ? define(['exports', '@polymita/signal-model', 'react'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global["@polymita/next-connect"] = {}, global["@polymita/signal-model"], global.React));
})(this, (function (exports, signalModel, React) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

  function createUseSignal(p) {
      const { plugin, modelIndexes: mi, React } = p;
      const { useEffect, useState, useRef } = React;
      function useSignal(ssrContext, driver, ...args) {
          if (typeof ssrContext === "function") {
              // eslint-disable-next-line react-hooks/rules-of-hooks
              return useReactHook(undefined, ssrContext, [driver, ...args]);
          }
          // eslint-disable-next-line react-hooks/rules-of-hooks
          return useReactHook(ssrContext, driver, args);
      }
      const driverWeakMap = new Map();
      function useReactHook(ssrContext, hook, args) {
          var _a;
          const init = useRef(null);
          const runtime = typeof window === "undefined" ? "nodejs" : "edge";
          if (!init.current) {
              const serializedArgs = JSON.stringify(args);
              const cachedDriverResult = (_a = driverWeakMap.get(hook)) === null || _a === void 0 ? void 0 : _a.get(serializedArgs);
              // match the cache
              if (cachedDriverResult) {
                  init.current = {
                      scope: cachedDriverResult.scope,
                      result: Object.assign({
                          [scopeSymbol]: cachedDriverResult.scope,
                      }, cachedDriverResult.result, ``),
                  };
              }
              else {
                  const namespace = signalModel.getNamespace(hook);
                  const name = signalModel.getName(hook);
                  const isComposedDriver = !!hook.__polymita_compose__;
                  const runner = new signalModel.ModelRunner(hook, {
                      plugin,
                      runtime,
                      believeContext: true,
                      modelIndexes: namespace && mi && isComposedDriver
                          ? mi[namespace]
                          : mi,
                  });
                  const scope = runner.prepareScope(args, ssrContext);
                  const r = runner.executeDriver(scope);
                  init.current = {
                      scope,
                      result: Object.assign({
                          [scopeSymbol]: scope,
                      }, r),
                  };
                  typeof window !== "undefined" &&
                      (window.POLYMITA_RUNNER = Object.assign(window.POLYMITA_RUNNER || {}, { [name]: init.current }));
                  let m = driverWeakMap.get(hook);
                  if (!m) {
                      m = new Map();
                      driverWeakMap.set(hook, m);
                  }
                  // @TODO no cache ?
                  // m.set(serializedArgs, {
                  //   scope,
                  //   result: r,
                  // });
              }
          }
          // release event
          useEffect(() => {
              function fn() {
                  setHookResult(Object.assign({}, init.current.result));
              }
              init.current.scope.onUpdate(fn);
              init.current.scope.activate();
              return () => {
                  init.current.scope.deactivate();
              };
          }, []);
          const [hookResult, setHookResult] = useState(init.current.result);
          return hookResult;
      }
      return useSignal;
  }
  const scopeSymbol = Symbol.for("@NewRendererReactScope");
  function useProgress(result) {
      const state = result[scopeSymbol].getState();
      return {
          state,
      };
  }

  function createConnect(p) {
      const { plugin, modelIndexes: mi, React } = p;
      const { useEffect, useState, useRef } = React;
      return (f) => {
          const namespace = signalModel.getNamespace(f);
          const name = signalModel.getName(f);
          const isComposedDriver = !!f.__polymita_compose__;
          return (props) => {
              const { current } = useRef({
                  ctx: null,
                  runner: null,
              });
              let ele = null;
              if (!current.runner) {
                  const runner = new signalModel.ModelRunner(f, {
                      plugin,
                      runtime: "edge",
                      believeContext: true,
                      modelIndexes: namespace && mi && isComposedDriver
                          ? mi[namespace]
                          : mi,
                  });
                  ele = runner.init([props]);
                  current.runner = runner;
              }
              else {
                  ele = current.runner.run([props]);
              }
              typeof window !== "undefined" &&
                  (window.POLYMITA_RUNNER = Object.assign(window.POLYMITA_RUNNER || {}, { [name]: current }));
              const [refresh, setRefreshCount] = useState(0);
              useEffect(() => {
                  function fn() {
                      setRefreshCount((v) => v + 1);
                  }
                  current.runner.scope.onUpdate(fn);
                  current.runner.scope.activate();
                  return () => {
                      current.runner.scope.deactivate();
                  };
              }, []);
              return ele;
          };
      };
  }

  /******************************************************************************
  Copyright (c) Microsoft Corporation.

  Permission to use, copy, modify, and/or distribute this software for any
  purpose with or without fee is hereby granted.

  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
  REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
  AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
  LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
  OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
  PERFORMANCE OF THIS SOFTWARE.
  ***************************************************************************** */

  function __awaiter(thisArg, _arguments, P, generator) {
      function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
      return new (P || (P = Promise))(function (resolve, reject) {
          function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
          function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
          function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
  }

  function createGetContext(p) {
      const { modelIndexes, createPlugin } = p;
      function getContext(signal, ...args) {
          return __awaiter(this, void 0, void 0, function* () {
              const namespace = signalModel.getNamespace(signal);
              const isComposedDriver = !!signal.__polymita_compose__;
              console.log("namespace && mi && isComposedDriver: ", namespace, isComposedDriver);
              const runner = new signalModel.ModelRunner(signal, {
                  modelIndexes: namespace && modelIndexes && isComposedDriver
                      ? modelIndexes[namespace]
                      : modelIndexes,
                  plugin: createPlugin(),
                  believeContext: false,
                  runtime: typeof window === "undefined" ? "nodejs" : "edge",
              });
              const result = runner.init(args);
              yield runner.ready();
              return [result, runner.scope.createBaseContext()];
          });
      }
      return getContext;
  }

  const ConnectContext = React__default["default"].createContext(null);
  const MODEL_UPDATE = 'MODEL_UPDATE';
  const genModelEventKey = (entity) => `${MODEL_UPDATE}:${entity}`;
  const PrismaNamespaceContext = React__default["default"].createContext(null);
  function ConnectProvider(props) {
      return React.createElement(ConnectContext.Provider, {
          value: Object.assign(Object.assign({}, props), { modelEvents: new signalModel.EventEmitter() })
      }, props.children);
  }
  function PrismaNamespaceProvider(props) {
      return React.createElement(PrismaNamespaceContext.Provider, {
          value: {
              namespace: props.namespace,
              modulesLinkMap: props.modulesLinkMap,
              modulesActiveMap: props.modulesActiveMap,
          }
      }, props.children);
  }
  function prisma(namespace, name, queryFn, options) {
      var _a;
      const { plugin, modelIndexes, modelEvents } = React.useContext(ConnectContext);
      const entity = (_a = (namespace ? modelIndexes[namespace] : modelIndexes)) === null || _a === void 0 ? void 0 : _a[name];
      const [data, setData] = React.useState();
      const doQuery = () => {
          const query = queryFn === null || queryFn === void 0 ? void 0 : queryFn();
          const callback = (d) => {
              setData(d);
          };
          if (signalModel.isPromise(query)) {
              query.then((q) => {
                  plugin
                      .getPlugin("Model")
                      .find(namespace, entity, q)
                      .then(callback);
              });
          }
          else {
              plugin
                  .getPlugin("Model")
                  .find(namespace, entity, query)
                  .then(callback);
          }
      };
      React.useEffect(() => {
          const key = genModelEventKey(name);
          modelEvents.on(key, doQuery);
          return () => {
              modelEvents.off(key, doQuery);
          };
      }, []);
      React.useEffect(() => {
          if ((options === null || options === void 0 ? void 0 : options.immediate) !== false) {
              doQuery();
          }
      }, (options === null || options === void 0 ? void 0 : options.deps) || []);
      return data;
  }
  function writePrisma(namespace, name) {
      var _a;
      const { plugin, modelIndexes, modelEvents } = React.useContext(ConnectContext);
      const entity = (_a = (namespace ? modelIndexes[namespace] : modelIndexes)) === null || _a === void 0 ? void 0 : _a[name];
      const key = genModelEventKey(name);
      const create = (obj) => {
          const model = plugin.getPlugin("Model");
          return model.create(namespace, entity, { data: obj }).then(res => {
              modelEvents.emit(key);
              return res;
          });
      };
      const update = (whereId, obj) => {
          return plugin
              .getPlugin("Model")
              .update(namespace, entity, { where: { id: whereId }, data: obj }).then(res => {
              modelEvents.emit(key);
              return res;
          });
      };
      const updateMany = (where, obj) => {
          return plugin
              .getPlugin("Model")
              .updateMany(namespace, entity, { where, data: obj }).then(res => {
              modelEvents.emit(key);
              return res;
          });
      };
      const upsert = (where, obj) => {
          return plugin
              .getPlugin("Model")
              .upsert(namespace, entity, { where, data: obj }).then(res => {
              modelEvents.emit(key);
              return res;
          });
      };
      const remove = (whereId) => {
          return plugin
              .getPlugin("Model")
              .remove(namespace, entity, { where: { id: whereId } }).then(res => {
              modelEvents.emit(key);
              return res;
          });
      };
      return {
          create,
          update,
          updateMany,
          upsert,
          remove,
      };
  }

  function createApiPlugin() {
      const plugin = new signalModel.Plugin();
      const fetchAPI = (from, e, m, w) => {
          return fetch(`/api/prisma/${e}/${m}?from=${from}`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(w),
          }).then(r => r.json());
      };
      function find(from, e, w) {
          return __awaiter(this, void 0, void 0, function* () {
              return fetchAPI(from, e, 'find', w);
          });
      }
      function update(from, e, w) {
          return __awaiter(this, void 0, void 0, function* () {
              return fetchAPI(from, e, 'update', w);
          });
      }
      function remove(from, e, d) {
          return __awaiter(this, void 0, void 0, function* () {
              return fetchAPI(from, e, 'delete', d);
          });
      }
      function create(from, e, q) {
          return __awaiter(this, void 0, void 0, function* () {
              return fetchAPI(from, e, 'create', q);
          });
      }
      function updateMany(from, e, query) {
          return __awaiter(this, void 0, void 0, function* () {
              return fetchAPI(from, e, 'updateMany', query);
          });
      }
      function upsert(from, e, query) {
          return __awaiter(this, void 0, void 0, function* () {
              return fetchAPI(from, e, 'upsert', query);
          });
      }
      plugin.loadPlugin('Model', {
          find, update, remove, create, updateMany, upsert,
          executeDiff() {
              return __awaiter(this, void 0, void 0, function* () { });
          },
      });
      return plugin;
  }

  exports.ConnectContext = ConnectContext;
  exports.ConnectProvider = ConnectProvider;
  exports.PrismaNamespaceContext = PrismaNamespaceContext;
  exports.PrismaNamespaceProvider = PrismaNamespaceProvider;
  exports.createApiPlugin = createApiPlugin;
  exports.createConnect = createConnect;
  exports.createGetContext = createGetContext;
  exports.createUseSignal = createUseSignal;
  exports.genModelEventKey = genModelEventKey;
  exports.prisma = prisma;
  exports.useProgress = useProgress;
  exports.writePrisma = writePrisma;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
