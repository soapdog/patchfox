(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global){
const definitions = require("ssb-schema-definitions");

global.ssbSchemaDefinitions = ssbSchemaDefinitions;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"ssb-schema-definitions":10}],2:[function(require,module,exports){
(function (global){
/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    promiseTag = '[object Promise]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to match `RegExp` flags from their coerced string values. */
var reFlags = /\w*$/;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/** Used to identify `toStringTag` values supported by `_.clone`. */
var cloneableTags = {};
cloneableTags[argsTag] = cloneableTags[arrayTag] =
cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] =
cloneableTags[boolTag] = cloneableTags[dateTag] =
cloneableTags[float32Tag] = cloneableTags[float64Tag] =
cloneableTags[int8Tag] = cloneableTags[int16Tag] =
cloneableTags[int32Tag] = cloneableTags[mapTag] =
cloneableTags[numberTag] = cloneableTags[objectTag] =
cloneableTags[regexpTag] = cloneableTags[setTag] =
cloneableTags[stringTag] = cloneableTags[symbolTag] =
cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =
cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
cloneableTags[errorTag] = cloneableTags[funcTag] =
cloneableTags[weakMapTag] = false;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/**
 * Adds the key-value `pair` to `map`.
 *
 * @private
 * @param {Object} map The map to modify.
 * @param {Array} pair The key-value pair to add.
 * @returns {Object} Returns `map`.
 */
function addMapEntry(map, pair) {
  // Don't return `map.set` because it's not chainable in IE 11.
  map.set(pair[0], pair[1]);
  return map;
}

/**
 * Adds `value` to `set`.
 *
 * @private
 * @param {Object} set The set to modify.
 * @param {*} value The value to add.
 * @returns {Object} Returns `set`.
 */
function addSetEntry(set, value) {
  // Don't return `set.add` because it's not chainable in IE 11.
  set.add(value);
  return set;
}

/**
 * A specialized version of `_.forEach` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEach(array, iteratee) {
  var index = -1,
      length = array ? array.length : 0;

  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

/**
 * A specialized version of `_.reduce` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {*} [accumulator] The initial value.
 * @param {boolean} [initAccum] Specify using the first element of `array` as
 *  the initial value.
 * @returns {*} Returns the accumulated value.
 */
function arrayReduce(array, iteratee, accumulator, initAccum) {
  var index = -1,
      length = array ? array.length : 0;

  if (initAccum && length) {
    accumulator = array[++index];
  }
  while (++index < length) {
    accumulator = iteratee(accumulator, array[index], index, array);
  }
  return accumulator;
}

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
function isHostObject(value) {
  // Many host objects are `Object` objects that can coerce to strings
  // despite having improperly defined `toString` methods.
  var result = false;
  if (value != null && typeof value.toString != 'function') {
    try {
      result = !!(value + '');
    } catch (e) {}
  }
  return result;
}

/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */
function mapToArray(map) {
  var index = -1,
      result = Array(map.size);

  map.forEach(function(value, key) {
    result[++index] = [key, value];
  });
  return result;
}

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}

/** Used for built-in method references. */
var arrayProto = Array.prototype,
    funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined,
    Symbol = root.Symbol,
    Uint8Array = root.Uint8Array,
    getPrototype = overArg(Object.getPrototypeOf, Object),
    objectCreate = Object.create,
    propertyIsEnumerable = objectProto.propertyIsEnumerable,
    splice = arrayProto.splice;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols,
    nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined,
    nativeKeys = overArg(Object.keys, Object);

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView'),
    Map = getNative(root, 'Map'),
    Promise = getNative(root, 'Promise'),
    Set = getNative(root, 'Set'),
    WeakMap = getNative(root, 'WeakMap'),
    nativeCreate = getNative(Object, 'create');

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView),
    mapCtorString = toSource(Map),
    promiseCtorString = toSource(Promise),
    setCtorString = toSource(Set),
    weakMapCtorString = toSource(WeakMap);

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  return this.has(key) && delete this.__data__[key];
}

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
}

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
}

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  return true;
}

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  return getMapData(this, key)['delete'](key);
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  getMapData(this, key).set(key, value);
  return this;
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  this.__data__ = new ListCache(entries);
}

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new ListCache;
}

/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  return this.__data__['delete'](key);
}

/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var cache = this.__data__;
  if (cache instanceof ListCache) {
    var pairs = cache.__data__;
    if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
      pairs.push([key, value]);
      return this;
    }
    cache = this.__data__ = new MapCache(pairs);
  }
  cache.set(key, value);
  return this;
}

// Add methods to `Stack`.
Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
  // Safari 9 makes `arguments.length` enumerable in strict mode.
  var result = (isArray(value) || isArguments(value))
    ? baseTimes(value.length, String)
    : [];

  var length = result.length,
      skipIndexes = !!length;

  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) &&
        !(skipIndexes && (key == 'length' || isIndex(key, length)))) {
      result.push(key);
    }
  }
  return result;
}

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
      (value === undefined && !(key in object))) {
    object[key] = value;
  }
}

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.assign` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssign(object, source) {
  return object && copyObject(source, keys(source), object);
}

/**
 * The base implementation of `_.clone` and `_.cloneDeep` which tracks
 * traversed objects.
 *
 * @private
 * @param {*} value The value to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @param {boolean} [isFull] Specify a clone including symbols.
 * @param {Function} [customizer] The function to customize cloning.
 * @param {string} [key] The key of `value`.
 * @param {Object} [object] The parent object of `value`.
 * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
 * @returns {*} Returns the cloned value.
 */
function baseClone(value, isDeep, isFull, customizer, key, object, stack) {
  var result;
  if (customizer) {
    result = object ? customizer(value, key, object, stack) : customizer(value);
  }
  if (result !== undefined) {
    return result;
  }
  if (!isObject(value)) {
    return value;
  }
  var isArr = isArray(value);
  if (isArr) {
    result = initCloneArray(value);
    if (!isDeep) {
      return copyArray(value, result);
    }
  } else {
    var tag = getTag(value),
        isFunc = tag == funcTag || tag == genTag;

    if (isBuffer(value)) {
      return cloneBuffer(value, isDeep);
    }
    if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
      if (isHostObject(value)) {
        return object ? value : {};
      }
      result = initCloneObject(isFunc ? {} : value);
      if (!isDeep) {
        return copySymbols(value, baseAssign(result, value));
      }
    } else {
      if (!cloneableTags[tag]) {
        return object ? value : {};
      }
      result = initCloneByTag(value, tag, baseClone, isDeep);
    }
  }
  // Check for circular references and return its corresponding clone.
  stack || (stack = new Stack);
  var stacked = stack.get(value);
  if (stacked) {
    return stacked;
  }
  stack.set(value, result);

  if (!isArr) {
    var props = isFull ? getAllKeys(value) : keys(value);
  }
  arrayEach(props || value, function(subValue, key) {
    if (props) {
      key = subValue;
      subValue = value[key];
    }
    // Recursively populate clone (susceptible to call stack limits).
    assignValue(result, key, baseClone(subValue, isDeep, isFull, customizer, key, value, stack));
  });
  return result;
}

/**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} prototype The object to inherit from.
 * @returns {Object} Returns the new object.
 */
function baseCreate(proto) {
  return isObject(proto) ? objectCreate(proto) : {};
}

/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
}

/**
 * The base implementation of `getTag`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  return objectToString.call(value);
}

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = (isFunction(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

/**
 * Creates a clone of  `buffer`.
 *
 * @private
 * @param {Buffer} buffer The buffer to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Buffer} Returns the cloned buffer.
 */
function cloneBuffer(buffer, isDeep) {
  if (isDeep) {
    return buffer.slice();
  }
  var result = new buffer.constructor(buffer.length);
  buffer.copy(result);
  return result;
}

/**
 * Creates a clone of `arrayBuffer`.
 *
 * @private
 * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
 * @returns {ArrayBuffer} Returns the cloned array buffer.
 */
function cloneArrayBuffer(arrayBuffer) {
  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
  new Uint8Array(result).set(new Uint8Array(arrayBuffer));
  return result;
}

/**
 * Creates a clone of `dataView`.
 *
 * @private
 * @param {Object} dataView The data view to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned data view.
 */
function cloneDataView(dataView, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
  return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
}

/**
 * Creates a clone of `map`.
 *
 * @private
 * @param {Object} map The map to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned map.
 */
function cloneMap(map, isDeep, cloneFunc) {
  var array = isDeep ? cloneFunc(mapToArray(map), true) : mapToArray(map);
  return arrayReduce(array, addMapEntry, new map.constructor);
}

/**
 * Creates a clone of `regexp`.
 *
 * @private
 * @param {Object} regexp The regexp to clone.
 * @returns {Object} Returns the cloned regexp.
 */
function cloneRegExp(regexp) {
  var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
  result.lastIndex = regexp.lastIndex;
  return result;
}

/**
 * Creates a clone of `set`.
 *
 * @private
 * @param {Object} set The set to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned set.
 */
function cloneSet(set, isDeep, cloneFunc) {
  var array = isDeep ? cloneFunc(setToArray(set), true) : setToArray(set);
  return arrayReduce(array, addSetEntry, new set.constructor);
}

/**
 * Creates a clone of the `symbol` object.
 *
 * @private
 * @param {Object} symbol The symbol object to clone.
 * @returns {Object} Returns the cloned symbol object.
 */
function cloneSymbol(symbol) {
  return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
}

/**
 * Creates a clone of `typedArray`.
 *
 * @private
 * @param {Object} typedArray The typed array to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned typed array.
 */
function cloneTypedArray(typedArray, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}

/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */
function copyArray(source, array) {
  var index = -1,
      length = source.length;

  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}

/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property identifiers to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @param {Function} [customizer] The function to customize copied values.
 * @returns {Object} Returns `object`.
 */
function copyObject(source, props, object, customizer) {
  object || (object = {});

  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];

    var newValue = customizer
      ? customizer(object[key], source[key], key, object, source)
      : undefined;

    assignValue(object, key, newValue === undefined ? source[key] : newValue);
  }
  return object;
}

/**
 * Copies own symbol properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */
function copySymbols(source, object) {
  return copyObject(source, getSymbols(source), object);
}

/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeys(object) {
  return baseGetAllKeys(object, keys, getSymbols);
}

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

/**
 * Creates an array of the own enumerable symbol properties of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbols = nativeGetSymbols ? overArg(nativeGetSymbols, Object) : stubArray;

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11,
// for data views in Edge < 14, and promises in Node.js.
if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
    (Map && getTag(new Map) != mapTag) ||
    (Promise && getTag(Promise.resolve()) != promiseTag) ||
    (Set && getTag(new Set) != setTag) ||
    (WeakMap && getTag(new WeakMap) != weakMapTag)) {
  getTag = function(value) {
    var result = objectToString.call(value),
        Ctor = result == objectTag ? value.constructor : undefined,
        ctorString = Ctor ? toSource(Ctor) : undefined;

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag;
        case mapCtorString: return mapTag;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag;
        case weakMapCtorString: return weakMapTag;
      }
    }
    return result;
  };
}

/**
 * Initializes an array clone.
 *
 * @private
 * @param {Array} array The array to clone.
 * @returns {Array} Returns the initialized clone.
 */
function initCloneArray(array) {
  var length = array.length,
      result = array.constructor(length);

  // Add properties assigned by `RegExp#exec`.
  if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
    result.index = array.index;
    result.input = array.input;
  }
  return result;
}

/**
 * Initializes an object clone.
 *
 * @private
 * @param {Object} object The object to clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneObject(object) {
  return (typeof object.constructor == 'function' && !isPrototype(object))
    ? baseCreate(getPrototype(object))
    : {};
}

/**
 * Initializes an object clone based on its `toStringTag`.
 *
 * **Note:** This function only supports cloning values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to clone.
 * @param {string} tag The `toStringTag` of the object to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneByTag(object, tag, cloneFunc, isDeep) {
  var Ctor = object.constructor;
  switch (tag) {
    case arrayBufferTag:
      return cloneArrayBuffer(object);

    case boolTag:
    case dateTag:
      return new Ctor(+object);

    case dataViewTag:
      return cloneDataView(object, isDeep);

    case float32Tag: case float64Tag:
    case int8Tag: case int16Tag: case int32Tag:
    case uint8Tag: case uint8ClampedTag: case uint16Tag: case uint32Tag:
      return cloneTypedArray(object, isDeep);

    case mapTag:
      return cloneMap(object, isDeep, cloneFunc);

    case numberTag:
    case stringTag:
      return new Ctor(object);

    case regexpTag:
      return cloneRegExp(object);

    case setTag:
      return cloneSet(object, isDeep, cloneFunc);

    case symbolTag:
      return cloneSymbol(object);
  }
}

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length &&
    (typeof value == 'number' || reIsUint.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to process.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/**
 * Creates a shallow clone of `value`.
 *
 * **Note:** This method is loosely based on the
 * [structured clone algorithm](https://mdn.io/Structured_clone_algorithm)
 * and supports cloning arrays, array buffers, booleans, date objects, maps,
 * numbers, `Object` objects, regexes, sets, strings, symbols, and typed
 * arrays. The own enumerable properties of `arguments` objects are cloned
 * as plain objects. An empty object is returned for uncloneable values such
 * as error objects, functions, DOM nodes, and WeakMaps.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to clone.
 * @returns {*} Returns the cloned value.
 * @see _.cloneDeep
 * @example
 *
 * var objects = [{ 'a': 1 }, { 'b': 2 }];
 *
 * var shallow = _.clone(objects);
 * console.log(shallow[0] === objects[0]);
 * // => true
 */
function clone(value) {
  return baseClone(value, false, true);
}

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
function isArguments(value) {
  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
  return isArrayLikeObject(value) && hasOwnProperty.call(value, 'callee') &&
    (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject(value) {
  return isObjectLike(value) && isArrayLike(value);
}

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse;

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */
function stubArray() {
  return [];
}

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

module.exports = clone;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],3:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

},{}],4:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};

},{}],5:[function(require,module,exports){
'use strict';

exports.decode = exports.parse = require('./decode');
exports.encode = exports.stringify = require('./encode');

},{"./decode":3,"./encode":4}],6:[function(require,module,exports){
module.exports = {
  type: 'string',
  minLength: 1
}

},{}],7:[function(require,module,exports){
module.exports = {
  type: 'object',
  required: ['blob', 'mimeType'],
  properties: {
    blob: { $ref: '#/definitions/blobId' },
    mimeType: {
      type: 'string',
      pattern: '^image/.*$'
    },
    size: { type: 'integer' },
    width: { type: 'integer' },
    height: { type: 'integer' }
  }
}

},{}],8:[function(require,module,exports){
module.exports = {
  message: {
    type: 'object',
    required: ['link'],
    properties: {
      link: { $ref: '#/definitions/messageId' }
    }
  },
  feed: {
    type: 'object',
    required: ['link', 'name'],
    properties: {
      link: { $ref: '#/definitions/feedId' },
      name: { type: 'string' }
    }
  },
  blob: {
    type: 'object',
    required: ['link', 'name'],
    properties: {
      link: { $ref: '#/definitions/blobId' },
      name: { type: 'string' }
    }
  },
  channel: {
    type: 'object',
    required: ['link'],
    properties: {
      link: { $ref: '#/definitions/channel' }
    }
  },
  any: {
    oneOf: [
      { type: 'null' },
      {
        type: 'array',
        items: {
          oneOf: [
            { $ref: '#/definitions/feedId' },
            { $ref: '#/definitions/messageId' },
            { $ref: '#/definitions/blobId' },
            { $ref: '#/definitions/mentions/feed' },
            { $ref: '#/definitions/mentions/message' },
            { $ref: '#/definitions/mentions/blob' },
            { $ref: '#/definitions/mentions/channel' }
          ]
        }
      }
    ]
  }
}

},{}],9:[function(require,module,exports){
const { msgIdRegex, feedIdRegex, blobIdRegex } = require('ssb-ref')
const channelRegex = /^#[^\s]+/
// TODO find a canonical ssb definition of channel
if (!msgIdRegex || !feedIdRegex || !blobIdRegex) throw new Error('ssb-schema-definitions is missing a regex!')

module.exports = {
  messageId: {
    type: 'string',
    pattern: msgIdRegex
  },
  feedId: {
    type: 'string',
    pattern: feedIdRegex
  },
  blobId: {
    type: 'string',
    pattern: blobIdRegex
  },
  channel: {
    type: 'string',
    pattern: channelRegex
  },

  // TODO - extract and test
  root: { $ref: '#/definitions/messageId' },
  branch: {
    oneOf: [
      { $ref: '#/definitions/messageId' },
      {
        type: 'array',
        items: {
          oneOf: [ // TODO - remove this (write tests first)
            { $ref: '#/definitions/messageId' }
          ]
        }
      }
    ]
  },

  // TODO - extract and test
  recps: {
    oneOf: [
      { type: 'null' },
      {
        type: 'array',
        items: {
          oneOf: [ // TODO - remove this (write tests first)
            { $ref: '#/definitions/feedId' }
            // { $ref: '#/definitions/mentions/feed' }
          ]
        },
        minItems: 1,
        maxItems: 7
      }
    ]
  },

  // TODO - extract and test
  encrypt: {
    // TODO check if this needs the following (write tests):
    // type: 'object'
    // required: ['box'],
    // properties: {
    box: {
      type: 'string',
      pattern: '\.box$' // was giving me grief so I brutally trimmed it
    }
  }
}

},{"ssb-ref":11}],10:[function(require,module,exports){
const primitives = require('./definition/primitives')
const mentions = require('./definition/mentions')
const contentWarning = require('./definition/content-warning')
const image = require('./definition/image')

const definitions = Object.assign(
  {},
  primitives, // required
  { mentions },
  { contentWarning },
  { image }
)

module.exports = function Definitions () {
  return clone(definitions)
}

function clone (obj) {
  return require('lodash.clone')(obj)
  // return JSON.parse(JSON.stringify(obj)) // fails
  // return Object.assign({}, obj) // too shallow
}

},{"./definition/content-warning":6,"./definition/image":7,"./definition/mentions":8,"./definition/primitives":9,"lodash.clone":2}],11:[function(require,module,exports){
var isCanonicalBase64 = require('is-canonical-base64')
var isDomain = require('is-valid-domain')
var Querystring = require('querystring')
var MultiServerAddress = require('multiserver-address')


var parseLinkRegex = /^((@|%|&)[A-Za-z0-9\/+]{43}=\.[\w\d]+)(\?(.+))?$/
var linkRegex = exports.linkRegex = /^(@|%|&)[A-Za-z0-9\/+]{43}=\.[\w\d]+$/
var feedIdRegex = exports.feedIdRegex = isCanonicalBase64('@', '\.(?:sha256|ed25519)', 32)
var blobIdRegex = exports.blobIdRegex = isCanonicalBase64('&', '\.sha256', 32)
var msgIdRegex = exports.msgIdRegex = isCanonicalBase64('%', '\.sha256', 32)

var extractRegex = /([@%&][A-Za-z0-9\/+]{43}=\.[\w\d]+)/

var ip = {
  ipv4Regex: /^(\d{1,3}\.){3,3}\d{1,3}$/,
  ipv6Regex: /^(::)?(((\d{1,3}\.){3}(\d{1,3}){1})?([0-9a-f]){0,4}:{0,2}){1,8}(::)?$/i,
  isV4Format: function(ip) { return this.ipv4Regex.test(ip)},
  isV6Format: function(ip) { return this.ipv6Regex.test(ip)}
}

function isMultiServerAddress (str) {
  //a http url fits into the multiserver scheme,
  //but all ssb address must have a transport and a transform
  //so check there is at least one unescaped ~ in the address
  return MultiServerAddress.check(str) && /[^!][~]/.test(str)
}

function isIP (s) {
  return ip.isV4Format(s) || ip.isV6Format(s)
}

var isInteger = Number.isInteger
var DEFAULT_PORT = 8008

function isString(s) {
  return 'string' === typeof s
}

var isHost = function (addr) {
  if(!isString(addr)) return
  addr = addr.replace(/^wss?:\/\//, '')
  return (isIP(addr)) || isDomain(addr) || addr === 'localhost'
}

var isPort = function (p) {
  return isInteger(p) && p <= 65536
}

function isObject (o) {
  return o && 'object' === typeof o && !Array.isArray(o)
}

var isFeedId = exports.isFeed = exports.isFeedId =
  function (data) {
    return isString(data) && feedIdRegex.test(data)
  }

var isMsgId = exports.isMsg = exports.isMsgId =
  function (data) {
    return isString(data) && msgIdRegex.test(data)
  }

var isBlobId = exports.isBlob = exports.isBlobId =
  function (data) {
    return isString(data) && blobIdRegex.test(data)
  }

var isLink = exports.isLink =
  function (data) {
    if(!isString(data)) return false
    var index = data.indexOf('?')
    data = ~index ? data.substring(0, index) : data
    return isString(data) && (isFeedId(data) || isMsgId(data) || isBlobId(data))
  }


exports.isBlobLink = function (s) {
  return s[0] === '&' && isLink(s)
}

exports.isMsgLink = function (s) {
  return s[0] === '%' && isLink(s)
}


var normalizeChannel = exports.normalizeChannel =
  function (data) {
    if (typeof data === 'string') {
      data = data.toLowerCase().replace(/\s|,|\.|\?|!|<|>|\(|\)|\[|\]|"|#/g, '')
      if (data.length > 0 && data.length < 30) {
        return data
      }
    }
  }

function deprecate (name, fn) {
  var logged = false
  return function () {
    var args = [].slice.call(arguments)
    if(!logged) {
      console.trace('deprecated api used: '+name)
      logged = true
    }
    return fn.apply(this, args)
  }
}

var parseMultiServerAddress = function (data) {
  if(!isString(data)) return false
  if(!MultiServerAddress.check(data)) return false

  var addr = MultiServerAddress.decode(data)
  addr = addr.find(function (address) {
    if (!address[0]) return false
    if (!address[1]) return false
    return /^(net|wss?|onion)$/.test(address[0].name) && /^shs/.test(address[1].name)
  })
  if (!Array.isArray(addr)) {
    return false
  }
  var port = +addr[0].data.pop() //last item always port, to handle ipv6

  //preserve protocol type on websocket addresses
  var host = (/^wss?$/.test(addr[0].name) ? addr[0].name+':' : '') + addr[0].data.join(':')
  var key = '@'+addr[1].data[0]+'.ed25519'
  var seed = addr[1].data[2]
  // allow multiserver addresses that are not currently understood!
  if(!(isHost(host) && isPort(+port) && isFeedId(key))) return false
  var address = {
    host: host,
    port: port,
    key: key,
  }
  if(seed)
    address.seed = seed

  return address
}

var toLegacyAddress = parseMultiServerAddress
exports.toLegacyAddress = deprecate('ssb-ref.toLegacyAddress', toLegacyAddress)

var isLegacyAddress = exports.isLegacyAddress = function (addr) {
  return isObject(addr) && isHost(addr.host) && isPort(addr.port) && isFeedId(addr.key)
}

var toMultiServerAddress = exports.toMultiServerAddress = function (addr) {
  if(MultiServerAddress.check(addr)) return addr
  if(!isPort(addr.port)) throw new Error('ssb-ref.toMultiServerAddress - invalid port:'+addr.port)
  if(!isHost(addr.host)) throw new Error('ssb-ref.toMultiServerAddress - invalid host:'+addr.host)
  if(!isFeedId(addr.key)) throw new Error('ssb-ref.toMultiServerAddress - invalid key:'+addr.key)

  return (
    /^wss?:/.test(addr.host)   ? addr.host
  : /\.onion$/.test(addr.host) ? 'onion:'+addr.host
  :                              'net:'+addr.host
  )+':'+addr.port+'~shs:'+addr.key.substring(1, addr.key.indexOf('.'))
}

var isAddress = exports.isAddress = function (data) {
  var host, port, id
  if(isObject(data)) {
    id = data.key; host = data.host; port = data.port
  }
  else if(!isString(data)) return false
  else if(isMultiServerAddress(data)) return true
  else {
    var parts = data.split(':')
    id = parts.pop(); port = parts.pop(); host = parts.join(':')
  }
  return (
    isFeedId(id) && isPort(+port)
    && isHost(host)
  )
}

//This is somewhat fragile, because maybe non-shs protocols get added...
//it would be better to treat all addresses as opaque or have multiserver handle
//extraction of a signing key from the address.
var getKeyFromAddress = exports.getKeyFromAddress = function (addr) {
  if(addr.key) return addr.key
  var data = MultiServerAddress.decode(addr)
  if(!data) return
  for(var k in data) {
    var address = data[k]
    for(var j in address) {
      var protocol = address[j]
      if(/^shs/.test(protocol.name)) //forwards compatible with future shs versions...
        return '@'+protocol.data[0]+'.ed25519'
    }
  }
}

var parseAddress = function (e) {
  if(isString(e)) {
    if(~e.indexOf('~'))
      return parseMultiServerAddress(e)
    var parts = e.split(':')
    var id = parts.pop(), port = parts.pop(), host = parts.join(':')
    var e = {
      host: host,
      port: +(port || DEFAULT_PORT),
      key: id
    }
    return e
  }
  return e
}
exports.parseAddress = deprecate('ssb-ref.parseAddress',parseAddress)

var toAddress = exports.toAddress = function (e) {
  e = parseAddress(e)
  e.port = e.port || DEFAULT_PORT
  e.host = e.host || 'localhost'
  return e
}


var legacyInviteRegex = /^[A-Za-z0-9\/+]{43}=$/
var legacyInviteFixerRegex = /#.*$/
var isLegacyInvite = exports.isLegacyInvite =
  function (data) {
    if(!isString(data)) return false
    data = data.replace(legacyInviteFixerRegex, '')
    var parts = data.split('~')
    return parts.length == 2 && isAddress(parts[0]) && legacyInviteRegex.test(parts[1])
  }

var isMultiServerInvite = exports.isMultiServerInvite =
  function (data) {
    if(!isString(data)) return false
    return !!parseMultiServerInvite(data)
  }

var isInvite = exports.isInvite =
  function (data) {
    if(!isString(data)) return false
    return isLegacyInvite(data) || isMultiServerInvite(data)
  }

exports.parseLink = function parseBlob (ref) {
  var match = parseLinkRegex.exec(ref)
  if (match && match[1]) {
    if (match[3]) {
      var query = Querystring.parse(match[4])
      // unbox keys have a '+' in them that is parsed into a ' ', this changes it back
      if (isString(query.unbox)) query.unbox = query.unbox.replace(/ /g, '+')
      return {link: match[1], query }
    } else {
      return {link: match[1]}
    }
  }
}

function parseLegacyInvite (invite) {
  var redirect = invite.split('#')
  invite = redirect.shift()
  var parts = invite.split('~')
  var addr = toAddress(parts[0])//.split(':')
  //convert legacy code to multiserver invite code.
  invite = remote+':'+parts[1]
  var remote = toMultiServerAddress(addr)
  return {
    invite: remote + ':' + parts[1],
    key: addr.key,
    redirect: null,
    remote: remote,
    redirect: redirect.length ? '#' + redirect.join('#') : null
  }
}

function parseMultiServerInvite (invite) {

  var redirect = invite.split('#')
  if(!redirect.length) return null

  invite = redirect.shift()
  var addr = toLegacyAddress(invite)
  if(!addr) return null
  delete addr.seed
  return {
    invite: invite,
    remote: toMultiServerAddress(addr),
    key: addr.key,
    redirect: redirect.length ? '#' + redirect.join('#') : null
  }
}

exports.parseLegacyInvite = deprecate('ssb-ref.parseLegacyInvite', parseLegacyInvite)
exports.parseMultiServerInvite = deprecate('ssb-ref.parseMultiServerInvite', parseMultiServerInvite)

exports.parseInvite = deprecate('ssb-ref.parseInvite', function (invite) {
  return (
    isLegacyInvite(invite)
  ? parseLegacyInvite(invite)
  : isMultiServerInvite(invite)
  ? parseMultiServerInvite(invite)
  : null
  )
})

exports.type =
  function (id) {
    if(!isString(id)) return false
    var c = id.charAt(0)
    if (c == '@' && isFeedId(id))
      return 'feed'
    else if (c == '%' && isMsgId(id))
      return 'msg'
    else if (c == '&' && isBlobId(id))
      return 'blob'
    else if(isAddress(id)) return 'address'
    else if(isInvite(id)) return 'invite'
    else
    return false
  }

exports.extract =
  function (data) {
    if (!isString(data))
      return false

    var _data = data

    var res = extractRegex.exec(_data)
    if (res) {
      return res && res[0]
    } else {
      try { _data = decodeURIComponent(data) }
      catch (e) {} // this may fail if it's not encoded, so don't worry if it does
      _data = _data.replace(/&amp;/g, '&')

      var res = extractRegex.exec(_data)
      return res && res[0]
    }
  }









},{"is-canonical-base64":12,"is-valid-domain":14,"multiserver-address":15,"querystring":5}],12:[function(require,module,exports){

var char = '[a-zA-Z0-9\/\+]'
var trail2 = '[AQgw]=='
var trail4 = '[AEIMQUYcgkosw048]='
var rx = '(?:' +char+ '{4})*(?:' +char+ '(?:(?:' +trail2 + ')|(?:' +char+trail4+ ')))?'
module.exports = function (prefix,suffix, length) {
  if(!Number.isInteger(length)) return new RegExp('^'+(prefix||'')+rx+(suffix||'')+'$')

  var mod = length % 3

  return new RegExp('^'+(prefix||'')+(
      char +'{'+~~((length*8)/6)+'}' + (
        mod === 0 ? ''
      : mod === 1 ? trail2
      :             trail4
      )
  )+(suffix||'')+'$')
}
















},{}],13:[function(require,module,exports){
module.exports = {"com.ac":true,"net.ac":true,"gov.ac":true,"org.ac":true,"mil.ac":true,"co.ae":true,"net.ae":true,"gov.ae":true,"ac.ae":true,"sch.ae":true,"org.ae":true,"mil.ae":true,"pro.ae":true,"name.ae":true,"com.af":true,"edu.af":true,"gov.af":true,"net.af":true,"org.af":true,"com.al":true,"edu.al":true,"gov.al":true,"mil.al":true,"net.al":true,"org.al":true,"ed.ao":true,"gv.ao":true,"og.ao":true,"co.ao":true,"pb.ao":true,"it.ao":true,"com.ar":true,"edu.ar":true,"gob.ar":true,"gov.ar":true,"int.ar":true,"mil.ar":true,"net.ar":true,"org.ar":true,"tur.ar":true,"gv.at":true,"ac.at":true,"co.at":true,"or.at":true,"com.au":true,"net.au":true,"org.au":true,"edu.au":true,"gov.au":true,"csiro.au":true,"asn.au":true,"id.au":true,"vic.au":true,"sa.au":true,"wa.au":true,"nt.au":true,"tas.au":true,"qld.au":true,"act.au":true,"conf.au":true,"oz.au":true,"org.ba":true,"net.ba":true,"edu.ba":true,"gov.ba":true,"mil.ba":true,"unsa.ba":true,"untz.ba":true,"unmo.ba":true,"unbi.ba":true,"unze.ba":true,"co.ba":true,"com.ba":true,"rs.ba":true,"co.bb":true,"com.bb":true,"net.bb":true,"org.bb":true,"gov.bb":true,"edu.bb":true,"info.bb":true,"store.bb":true,"tv.bb":true,"biz.bb":true,"com.bh":true,"info.bh":true,"cc.bh":true,"edu.bh":true,"biz.bh":true,"net.bh":true,"org.bh":true,"gov.bh":true,"com.bn":true,"edu.bn":true,"gov.bn":true,"net.bn":true,"org.bn":true,"com.bo":true,"net.bo":true,"org.bo":true,"tv.bo":true,"mil.bo":true,"int.bo":true,"gob.bo":true,"gov.bo":true,"edu.bo":true,"adm.br":true,"adv.br":true,"agr.br":true,"am.br":true,"arq.br":true,"art.br":true,"ato.br":true,"b.br":true,"bio.br":true,"blog.br":true,"bmd.br":true,"cim.br":true,"cng.br":true,"cnt.br":true,"com.br":true,"coop.br":true,"ecn.br":true,"edu.br":true,"eng.br":true,"esp.br":true,"etc.br":true,"eti.br":true,"far.br":true,"flog.br":true,"fm.br":true,"fnd.br":true,"fot.br":true,"fst.br":true,"g12.br":true,"ggf.br":true,"gov.br":true,"imb.br":true,"ind.br":true,"inf.br":true,"jor.br":true,"jus.br":true,"lel.br":true,"mat.br":true,"med.br":true,"mil.br":true,"mus.br":true,"net.br":true,"nom.br":true,"not.br":true,"ntr.br":true,"odo.br":true,"org.br":true,"ppg.br":true,"pro.br":true,"psc.br":true,"psi.br":true,"qsl.br":true,"rec.br":true,"slg.br":true,"srv.br":true,"tmp.br":true,"trd.br":true,"tur.br":true,"tv.br":true,"vet.br":true,"vlog.br":true,"wiki.br":true,"zlg.br":true,"com.bs":true,"net.bs":true,"org.bs":true,"edu.bs":true,"gov.bs":true,"om.bz":true,"du.bz":true,"ov.bz":true,"et.bz":true,"rg.bz":true,"ab.ca":true,"bc.ca":true,"mb.ca":true,"nb.ca":true,"nf.ca":true,"nl.ca":true,"ns.ca":true,"nt.ca":true,"nu.ca":true,"on.ca":true,"pe.ca":true,"qc.ca":true,"sk.ca":true,"yk.ca":true,"co.ck":true,"org.ck":true,"edu.ck":true,"gov.ck":true,"net.ck":true,"gen.ck":true,"biz.ck":true,"info.ck":true,"ac.cn":true,"com.cn":true,"edu.cn":true,"gov.cn":true,"mil.cn":true,"net.cn":true,"org.cn":true,"ah.cn":true,"bj.cn":true,"cq.cn":true,"fj.cn":true,"gd.cn":true,"gs.cn":true,"gz.cn":true,"gx.cn":true,"ha.cn":true,"hb.cn":true,"he.cn":true,"hi.cn":true,"hl.cn":true,"hn.cn":true,"jl.cn":true,"js.cn":true,"jx.cn":true,"ln.cn":true,"nm.cn":true,"nx.cn":true,"qh.cn":true,"sc.cn":true,"sd.cn":true,"sh.cn":true,"sn.cn":true,"sx.cn":true,"tj.cn":true,"tw.cn":true,"xj.cn":true,"xz.cn":true,"yn.cn":true,"zj.cn":true,"com.co":true,"org.co":true,"edu.co":true,"gov.co":true,"net.co":true,"mil.co":true,"nom.co":true,"ac.cr":true,"co.cr":true,"ed.cr":true,"fi.cr":true,"go.cr":true,"or.cr":true,"sa.cr":true,"cr":true,"ac.cy":true,"net.cy":true,"gov.cy":true,"org.cy":true,"pro.cy":true,"name.cy":true,"ekloges.cy":true,"tm.cy":true,"ltd.cy":true,"biz.cy":true,"press.cy":true,"parliament.cy":true,"com.cy":true,"edu.do":true,"gob.do":true,"gov.do":true,"com.do":true,"sld.do":true,"org.do":true,"net.do":true,"web.do":true,"mil.do":true,"art.do":true,"com.dz":true,"org.dz":true,"net.dz":true,"gov.dz":true,"edu.dz":true,"asso.dz":true,"pol.dz":true,"art.dz":true,"com.ec":true,"info.ec":true,"net.ec":true,"fin.ec":true,"med.ec":true,"pro.ec":true,"org.ec":true,"edu.ec":true,"gov.ec":true,"mil.ec":true,"com.eg":true,"edu.eg":true,"eun.eg":true,"gov.eg":true,"mil.eg":true,"name.eg":true,"net.eg":true,"org.eg":true,"sci.eg":true,"com.er":true,"edu.er":true,"gov.er":true,"mil.er":true,"net.er":true,"org.er":true,"ind.er":true,"rochest.er":true,"w.er":true,"com.es":true,"nom.es":true,"org.es":true,"gob.es":true,"edu.es":true,"com.et":true,"gov.et":true,"org.et":true,"edu.et":true,"net.et":true,"biz.et":true,"name.et":true,"info.et":true,"ac.fj":true,"biz.fj":true,"com.fj":true,"info.fj":true,"mil.fj":true,"name.fj":true,"net.fj":true,"org.fj":true,"pro.fj":true,"co.fk":true,"org.fk":true,"gov.fk":true,"ac.fk":true,"nom.fk":true,"net.fk":true,"fr":true,"tm.fr":true,"asso.fr":true,"nom.fr":true,"prd.fr":true,"presse.fr":true,"com.fr":true,"gouv.fr":true,"co.gg":true,"net.gg":true,"org.gg":true,"com.gh":true,"edu.gh":true,"gov.gh":true,"org.gh":true,"mil.gh":true,"com.gn":true,"ac.gn":true,"gov.gn":true,"org.gn":true,"net.gn":true,"com.gr":true,"edu.gr":true,"net.gr":true,"org.gr":true,"gov.gr":true,"mil.gr":true,"com.gt":true,"edu.gt":true,"net.gt":true,"gob.gt":true,"org.gt":true,"mil.gt":true,"ind.gt":true,"com.gu":true,"net.gu":true,"gov.gu":true,"org.gu":true,"edu.gu":true,"com.hk":true,"edu.hk":true,"gov.hk":true,"idv.hk":true,"net.hk":true,"org.hk":true,"2000.hu":true,"agrar.hu":true,"bolt.hu":true,"casino.hu":true,"city.hu":true,"co.hu":true,"erotica.hu":true,"erotika.hu":true,"film.hu":true,"forum.hu":true,"games.hu":true,"hotel.hu":true,"info.hu":true,"ingatlan.hu":true,"jogasz.hu":true,"konyvelo.hu":true,"lakas.hu":true,"media.hu":true,"news.hu":true,"org.hu":true,"priv.hu":true,"reklam.hu":true,"sex.hu":true,"shop.hu":true,"sport.hu":true,"suli.huv":true,"szex.hu":true,"tm.hu":true,"tozsde.hu":true,"utazas.hu":true,"video.hu":true,"ac.id":true,"co.id":true,"net.id":true,"or.id":true,"web.id":true,"sch.id":true,"mil.id":true,"go.id":true,"war.net.id":true,"ac.il":true,"co.il":true,"org.il":true,"net.il":true,"k12.il":true,"gov.il":true,"muni.il":true,"idf.il":true,"in":true,"4fd.in":true,"co.in":true,"firm.in":true,"net.in":true,"org.in":true,"gen.in":true,"ind.in":true,"ac.in":true,"edu.in":true,"res.in":true,"ernet.in":true,"gov.in":true,"mil.in":true,"nic.in":true,"iq":true,"gov.iq":true,"edu.iq":true,"com.iq":true,"mil.iq":true,"org.iq":true,"net.iq":true,"ir":true,"ac.ir":true,"co.ir":true,"gov.ir":true,"id.ir":true,"net.ir":true,"org.ir":true,"sch.ir":true,"dnssec.ir":true,"gov.it":true,"edu.it":true,"co.je":true,"net.je":true,"org.je":true,"com.jo":true,"net.jo":true,"gov.jo":true,"edu.jo":true,"org.jo":true,"mil.jo":true,"name.jo":true,"sch.jo":true,"ac.jp":true,"ad.jp":true,"co.jp":true,"ed.jp":true,"go.jp":true,"gr.jp":true,"lg.jp":true,"ne.jp":true,"or.jp":true,"co.ke":true,"or.ke":true,"ne.ke":true,"go.ke":true,"ac.ke":true,"sc.ke":true,"me.ke":true,"mobi.ke":true,"info.ke":true,"per.kh":true,"com.kh":true,"edu.kh":true,"gov.kh":true,"mil.kh":true,"net.kh":true,"org.kh":true,"com.ki":true,"biz.ki":true,"de.ki":true,"net.ki":true,"info.ki":true,"org.ki":true,"gov.ki":true,"edu.ki":true,"mob.ki":true,"tel.ki":true,"km":true,"com.km":true,"coop.km":true,"asso.km":true,"nom.km":true,"presse.km":true,"tm.km":true,"medecin.km":true,"notaires.km":true,"pharmaciens.km":true,"veterinaire.km":true,"edu.km":true,"gouv.km":true,"mil.km":true,"net.kn":true,"org.kn":true,"edu.kn":true,"gov.kn":true,"kr":true,"co.kr":true,"ne.kr":true,"or.kr":true,"re.kr":true,"pe.kr":true,"go.kr":true,"mil.kr":true,"ac.kr":true,"hs.kr":true,"ms.kr":true,"es.kr":true,"sc.kr":true,"kg.kr":true,"seoul.kr":true,"busan.kr":true,"daegu.kr":true,"incheon.kr":true,"gwangju.kr":true,"daejeon.kr":true,"ulsan.kr":true,"gyeonggi.kr":true,"gangwon.kr":true,"chungbuk.kr":true,"chungnam.kr":true,"jeonbuk.kr":true,"jeonnam.kr":true,"gyeongbuk.kr":true,"gyeongnam.kr":true,"jeju.kr":true,"edu.kw":true,"com.kw":true,"net.kw":true,"org.kw":true,"gov.kw":true,"com.ky":true,"org.ky":true,"net.ky":true,"edu.ky":true,"gov.ky":true,"com.kz":true,"edu.kz":true,"gov.kz":true,"mil.kz":true,"net.kz":true,"org.kz":true,"com.lb":true,"edu.lb":true,"gov.lb":true,"net.lb":true,"org.lb":true,"gov.lk":true,"sch.lk":true,"net.lk":true,"int.lk":true,"com.lk":true,"org.lk":true,"edu.lk":true,"ngo.lk":true,"soc.lk":true,"web.lk":true,"ltd.lk":true,"assn.lk":true,"grp.lk":true,"hotel.lk":true,"com.lr":true,"edu.lr":true,"gov.lr":true,"org.lr":true,"net.lr":true,"com.lv":true,"edu.lv":true,"gov.lv":true,"org.lv":true,"mil.lv":true,"id.lv":true,"net.lv":true,"asn.lv":true,"conf.lv":true,"com.ly":true,"net.ly":true,"gov.ly":true,"plc.ly":true,"edu.ly":true,"sch.ly":true,"med.ly":true,"org.ly":true,"id.ly":true,"ma":true,"net.ma":true,"ac.ma":true,"org.ma":true,"gov.ma":true,"press.ma":true,"co.ma":true,"tm.mc":true,"asso.mc":true,"co.me":true,"net.me":true,"org.me":true,"edu.me":true,"ac.me":true,"gov.me":true,"its.me":true,"priv.me":true,"org.mg":true,"nom.mg":true,"gov.mg":true,"prd.mg":true,"tm.mg":true,"edu.mg":true,"mil.mg":true,"com.mg":true,"com.mk":true,"org.mk":true,"net.mk":true,"edu.mk":true,"gov.mk":true,"inf.mk":true,"name.mk":true,"pro.mk":true,"com.ml":true,"net.ml":true,"org.ml":true,"edu.ml":true,"gov.ml":true,"presse.ml":true,"gov.mn":true,"edu.mn":true,"org.mn":true,"com.mo":true,"edu.mo":true,"gov.mo":true,"net.mo":true,"org.mo":true,"com.mt":true,"org.mt":true,"net.mt":true,"edu.mt":true,"gov.mt":true,"aero.mv":true,"biz.mv":true,"com.mv":true,"coop.mv":true,"edu.mv":true,"gov.mv":true,"info.mv":true,"int.mv":true,"mil.mv":true,"museum.mv":true,"name.mv":true,"net.mv":true,"org.mv":true,"pro.mv":true,"ac.mw":true,"co.mw":true,"com.mw":true,"coop.mw":true,"edu.mw":true,"gov.mw":true,"int.mw":true,"museum.mw":true,"net.mw":true,"org.mw":true,"com.mx":true,"net.mx":true,"org.mx":true,"edu.mx":true,"gob.mx":true,"com.my":true,"net.my":true,"org.my":true,"gov.my":true,"edu.my":true,"sch.my":true,"mil.my":true,"name.my":true,"com.nf":true,"net.nf":true,"arts.nf":true,"store.nf":true,"web.nf":true,"firm.nf":true,"info.nf":true,"other.nf":true,"per.nf":true,"rec.nf":true,"com.ng":true,"org.ng":true,"gov.ng":true,"edu.ng":true,"net.ng":true,"sch.ng":true,"name.ng":true,"mobi.ng":true,"biz.ng":true,"mil.ng":true,"gob.ni":true,"co.ni":true,"com.ni":true,"ac.ni":true,"edu.ni":true,"org.ni":true,"nom.ni":true,"net.ni":true,"mil.ni":true,"com.np":true,"edu.np":true,"gov.np":true,"org.np":true,"mil.np":true,"net.np":true,"edu.nr":true,"gov.nr":true,"biz.nr":true,"info.nr":true,"net.nr":true,"org.nr":true,"com.nr":true,"com.om":true,"co.om":true,"edu.om":true,"ac.om":true,"sch.om":true,"gov.om":true,"net.om":true,"org.om":true,"mil.om":true,"museum.om":true,"biz.om":true,"pro.om":true,"med.om":true,"edu.pe":true,"gob.pe":true,"nom.pe":true,"mil.pe":true,"sld.pe":true,"org.pe":true,"com.pe":true,"net.pe":true,"com.ph":true,"net.ph":true,"org.ph":true,"mil.ph":true,"ngo.ph":true,"i.ph":true,"gov.ph":true,"edu.ph":true,"com.pk":true,"net.pk":true,"edu.pk":true,"org.pk":true,"fam.pk":true,"biz.pk":true,"web.pk":true,"gov.pk":true,"gob.pk":true,"gok.pk":true,"gon.pk":true,"gop.pk":true,"gos.pk":true,"pwr.pl":true,"com.pl":true,"biz.pl":true,"net.pl":true,"art.pl":true,"edu.pl":true,"org.pl":true,"ngo.pl":true,"gov.pl":true,"info.pl":true,"mil.pl":true,"waw.pl":true,"warszawa.pl":true,"wroc.pl":true,"wroclaw.pl":true,"krakow.pl":true,"katowice.pl":true,"poznan.pl":true,"lodz.pl":true,"gda.pl":true,"gdansk.pl":true,"slupsk.pl":true,"radom.pl":true,"szczecin.pl":true,"lublin.pl":true,"bialystok.pl":true,"olsztyn.pl":true,"torun.pl":true,"gorzow.pl":true,"zgora.pl":true,"biz.pr":true,"com.pr":true,"edu.pr":true,"gov.pr":true,"info.pr":true,"isla.pr":true,"name.pr":true,"net.pr":true,"org.pr":true,"pro.pr":true,"est.pr":true,"prof.pr":true,"ac.pr":true,"com.ps":true,"net.ps":true,"org.ps":true,"edu.ps":true,"gov.ps":true,"plo.ps":true,"sec.ps":true,"co.pw":true,"ne.pw":true,"or.pw":true,"ed.pw":true,"go.pw":true,"belau.pw":true,"arts.ro":true,"com.ro":true,"firm.ro":true,"info.ro":true,"nom.ro":true,"nt.ro":true,"org.ro":true,"rec.ro":true,"store.ro":true,"tm.ro":true,"www.ro":true,"co.rs":true,"org.rs":true,"edu.rs":true,"ac.rs":true,"gov.rs":true,"in.rs":true,"com.sb":true,"net.sb":true,"edu.sb":true,"org.sb":true,"gov.sb":true,"com.sc":true,"net.sc":true,"edu.sc":true,"gov.sc":true,"org.sc":true,"co.sh":true,"com.sh":true,"org.sh":true,"gov.sh":true,"edu.sh":true,"net.sh":true,"nom.sh":true,"com.sl":true,"net.sl":true,"org.sl":true,"edu.sl":true,"gov.sl":true,"gov.st":true,"saotome.st":true,"principe.st":true,"consulado.st":true,"embaixada.st":true,"org.st":true,"edu.st":true,"net.st":true,"com.st":true,"store.st":true,"mil.st":true,"co.st":true,"edu.sv":true,"gob.sv":true,"com.sv":true,"org.sv":true,"red.sv":true,"co.sz":true,"ac.sz":true,"org.sz":true,"com.tr":true,"gen.tr":true,"org.tr":true,"biz.tr":true,"info.tr":true,"av.tr":true,"dr.tr":true,"pol.tr":true,"bel.tr":true,"tsk.tr":true,"bbs.tr":true,"k12.tr":true,"edu.tr":true,"name.tr":true,"net.tr":true,"gov.tr":true,"web.tr":true,"tel.tr":true,"tv.tr":true,"co.tt":true,"com.tt":true,"org.tt":true,"net.tt":true,"biz.tt":true,"info.tt":true,"pro.tt":true,"int.tt":true,"coop.tt":true,"jobs.tt":true,"mobi.tt":true,"travel.tt":true,"museum.tt":true,"aero.tt":true,"cat.tt":true,"tel.tt":true,"name.tt":true,"mil.tt":true,"edu.tt":true,"gov.tt":true,"edu.tw":true,"gov.tw":true,"mil.tw":true,"com.tw":true,"net.tw":true,"org.tw":true,"idv.tw":true,"game.tw":true,"ebiz.tw":true,"club.tw":true,"com.mu":true,"gov.mu":true,"net.mu":true,"org.mu":true,"ac.mu":true,"co.mu":true,"or.mu":true,"ac.mz":true,"co.mz":true,"edu.mz":true,"org.mz":true,"gov.mz":true,"com.na":true,"co.na":true,"ac.nz":true,"co.nz":true,"cri.nz":true,"geek.nz":true,"gen.nz":true,"govt.nz":true,"health.nz":true,"iwi.nz":true,"maori.nz":true,"mil.nz":true,"net.nz":true,"org.nz":true,"parliament.nz":true,"school.nz":true,"abo.pa":true,"ac.pa":true,"com.pa":true,"edu.pa":true,"gob.pa":true,"ing.pa":true,"med.pa":true,"net.pa":true,"nom.pa":true,"org.pa":true,"sld.pa":true,"com.pt":true,"edu.pt":true,"gov.pt":true,"int.pt":true,"net.pt":true,"nome.pt":true,"org.pt":true,"publ.pt":true,"com.py":true,"edu.py":true,"gov.py":true,"mil.py":true,"net.py":true,"org.py":true,"com.qa":true,"edu.qa":true,"gov.qa":true,"mil.qa":true,"net.qa":true,"org.qa":true,"asso.re":true,"com.re":true,"nom.re":true,"ac.ru":true,"adygeya.ru":true,"altai.ru":true,"amur.ru":true,"arkhangelsk.ru":true,"astrakhan.ru":true,"bashkiria.ru":true,"belgorod.ru":true,"bir.ru":true,"bryansk.ru":true,"buryatia.ru":true,"cbg.ru":true,"chel.ru":true,"chelyabinsk.ru":true,"chita.ru":true,"chukotka.ru":true,"chuvashia.ru":true,"com.ru":true,"dagestan.ru":true,"e-burg.ru":true,"edu.ru":true,"gov.ru":true,"grozny.ru":true,"int.ru":true,"irkutsk.ru":true,"ivanovo.ru":true,"izhevsk.ru":true,"jar.ru":true,"joshkar-ola.ru":true,"kalmykia.ru":true,"kaluga.ru":true,"kamchatka.ru":true,"karelia.ru":true,"kazan.ru":true,"kchr.ru":true,"kemerovo.ru":true,"khabarovsk.ru":true,"khakassia.ru":true,"khv.ru":true,"kirov.ru":true,"koenig.ru":true,"komi.ru":true,"kostroma.ru":true,"kranoyarsk.ru":true,"kuban.ru":true,"kurgan.ru":true,"kursk.ru":true,"lipetsk.ru":true,"magadan.ru":true,"mari.ru":true,"mari-el.ru":true,"marine.ru":true,"mil.ru":true,"mordovia.ru":true,"mosreg.ru":true,"msk.ru":true,"murmansk.ru":true,"nalchik.ru":true,"net.ru":true,"nnov.ru":true,"nov.ru":true,"novosibirsk.ru":true,"nsk.ru":true,"omsk.ru":true,"orenburg.ru":true,"org.ru":true,"oryol.ru":true,"penza.ru":true,"perm.ru":true,"pp.ru":true,"pskov.ru":true,"ptz.ru":true,"rnd.ru":true,"ryazan.ru":true,"sakhalin.ru":true,"samara.ru":true,"saratov.ru":true,"simbirsk.ru":true,"smolensk.ru":true,"spb.ru":true,"stavropol.ru":true,"stv.ru":true,"surgut.ru":true,"tambov.ru":true,"tatarstan.ru":true,"tom.ru":true,"tomsk.ru":true,"tsaritsyn.ru":true,"tsk.ru":true,"tula.ru":true,"tuva.ru":true,"tver.ru":true,"tyumen.ru":true,"udm.ru":true,"udmurtia.ru":true,"ulan-ude.ru":true,"vladikavkaz.ru":true,"vladimir.ru":true,"vladivostok.ru":true,"volgograd.ru":true,"vologda.ru":true,"voronezh.ru":true,"vrn.ru":true,"vyatka.ru":true,"yakutia.ru":true,"yamal.ru":true,"yekaterinburg.ru":true,"yuzhno-sakhalinsk.ru":true,"ac.rw":true,"co.rw":true,"com.rw":true,"edu.rw":true,"gouv.rw":true,"gov.rw":true,"int.rw":true,"mil.rw":true,"net.rw":true,"com.sa":true,"edu.sa":true,"gov.sa":true,"med.sa":true,"net.sa":true,"org.sa":true,"pub.sa":true,"sch.sa":true,"com.sd":true,"edu.sd":true,"gov.sd":true,"info.sd":true,"med.sd":true,"net.sd":true,"org.sd":true,"tv.sd":true,"a.se":true,"ac.se":true,"b.se":true,"bd.se":true,"c.se":true,"d.se":true,"e.se":true,"f.se":true,"g.se":true,"h.se":true,"i.se":true,"k.se":true,"l.se":true,"m.se":true,"n.se":true,"o.se":true,"org.se":true,"p.se":true,"parti.se":true,"pp.se":true,"press.se":true,"r.se":true,"s.se":true,"t.se":true,"tm.se":true,"u.se":true,"w.se":true,"x.se":true,"y.se":true,"z.se":true,"com.sg":true,"edu.sg":true,"gov.sg":true,"idn.sg":true,"net.sg":true,"org.sg":true,"per.sg":true,"art.sn":true,"com.sn":true,"edu.sn":true,"gouv.sn":true,"org.sn":true,"perso.sn":true,"univ.sn":true,"com.sy":true,"edu.sy":true,"gov.sy":true,"mil.sy":true,"net.sy":true,"news.sy":true,"org.sy":true,"ac.th":true,"co.th":true,"go.th":true,"in.th":true,"mi.th":true,"net.th":true,"or.th":true,"ac.tj":true,"biz.tj":true,"co.tj":true,"com.tj":true,"edu.tj":true,"go.tj":true,"gov.tj":true,"info.tj":true,"int.tj":true,"mil.tj":true,"name.tj":true,"net.tj":true,"nic.tj":true,"org.tj":true,"test.tj":true,"web.tj":true,"agrinet.tn":true,"com.tn":true,"defense.tn":true,"edunet.tn":true,"ens.tn":true,"fin.tn":true,"gov.tn":true,"ind.tn":true,"info.tn":true,"intl.tn":true,"mincom.tn":true,"nat.tn":true,"net.tn":true,"org.tn":true,"perso.tn":true,"rnrt.tn":true,"rns.tn":true,"rnu.tn":true,"tourism.tn":true,"ac.tz":true,"co.tz":true,"go.tz":true,"ne.tz":true,"or.tz":true,"biz.ua":true,"cherkassy.ua":true,"chernigov.ua":true,"chernovtsy.ua":true,"ck.ua":true,"cn.ua":true,"co.ua":true,"com.ua":true,"crimea.ua":true,"cv.ua":true,"dn.ua":true,"dnepropetrovsk.ua":true,"donetsk.ua":true,"dp.ua":true,"edu.ua":true,"gov.ua":true,"if.ua":true,"in.ua":true,"ivano-frankivsk.ua":true,"kh.ua":true,"kharkov.ua":true,"kherson.ua":true,"khmelnitskiy.ua":true,"kiev.ua":true,"kirovograd.ua":true,"km.ua":true,"kr.ua":true,"ks.ua":true,"kv.ua":true,"lg.ua":true,"lugansk.ua":true,"lutsk.ua":true,"lviv.ua":true,"me.ua":true,"mk.ua":true,"net.ua":true,"nikolaev.ua":true,"od.ua":true,"odessa.ua":true,"org.ua":true,"pl.ua":true,"poltava.ua":true,"pp.ua":true,"rovno.ua":true,"rv.ua":true,"sebastopol.ua":true,"sumy.ua":true,"te.ua":true,"ternopil.ua":true,"uzhgorod.ua":true,"vinnica.ua":true,"vn.ua":true,"zaporizhzhe.ua":true,"zhitomir.ua":true,"zp.ua":true,"zt.ua":true,"ac.ug":true,"co.ug":true,"go.ug":true,"ne.ug":true,"or.ug":true,"org.ug":true,"sc.ug":true,"ac.uk":true,"bl.uk":true,"british-library.uk":true,"co.uk":true,"cym.uk":true,"gov.uk":true,"govt.uk":true,"icnet.uk":true,"jet.uk":true,"lea.uk":true,"ltd.uk":true,"me.uk":true,"mil.uk":true,"mod.uk":true,"national-library-scotland.uk":true,"nel.uk":true,"net.uk":true,"nhs.uk":true,"nic.uk":true,"nls.uk":true,"org.uk":true,"orgn.uk":true,"parliament.uk":true,"plc.uk":true,"police.uk":true,"sch.uk":true,"scot.uk":true,"soc.uk":true,"4fd.us":true,"dni.us":true,"fed.us":true,"isa.us":true,"kids.us":true,"nsn.us":true,"com.uy":true,"edu.uy":true,"gub.uy":true,"mil.uy":true,"net.uy":true,"org.uy":true,"co.ve":true,"com.ve":true,"edu.ve":true,"gob.ve":true,"info.ve":true,"mil.ve":true,"net.ve":true,"org.ve":true,"web.ve":true,"co.vi":true,"com.vi":true,"k12.vi":true,"net.vi":true,"org.vi":true,"ac.vn":true,"biz.vn":true,"com.vn":true,"edu.vn":true,"gov.vn":true,"health.vn":true,"info.vn":true,"int.vn":true,"name.vn":true,"net.vn":true,"org.vn":true,"pro.vn":true,"co.ye":true,"com.ye":true,"gov.ye":true,"ltd.ye":true,"me.ye":true,"net.ye":true,"org.ye":true,"plc.ye":true,"ac.yu":true,"co.yu":true,"edu.yu":true,"gov.yu":true,"org.yu":true,"ac.za":true,"agric.za":true,"alt.za":true,"bourse.za":true,"city.za":true,"co.za":true,"cybernet.za":true,"db.za":true,"ecape.school.za":true,"edu.za":true,"fs.school.za":true,"gov.za":true,"gp.school.za":true,"grondar.za":true,"iaccess.za":true,"imt.za":true,"inca.za":true,"kzn.school.za":true,"landesign.za":true,"law.za":true,"lp.school.za":true,"mil.za":true,"mpm.school.za":true,"ncape.school.za":true,"net.za":true,"ngo.za":true,"nis.za":true,"nom.za":true,"nw.school.za":true,"olivetti.za":true,"org.za":true,"pix.za":true,"school.za":true,"tm.za":true,"wcape.school.za":true,"web.za":true,"ac.zm":true,"co.zm":true,"com.zm":true,"edu.zm":true,"gov.zm":true,"net.zm":true,"org.zm":true,"sch.zm":true}

},{}],14:[function(require,module,exports){
var sldMap= require('./domains/sld')

module.exports = function isValidDomain(v, opts) {
  if (typeof v !== 'string') return false
  if (!(opts instanceof Object)) opts = {}
  v = v.toLowerCase()

  var validChars = /^([a-z0-9-.*]+)$/g
  if (!validChars.test(v)) {
    return false
  }

  var sldRegex = /(.*)\.(([a-z0-9]+)(\.[a-z0-9]+))/
  var matches = v.match(sldRegex)
  var tld = null
  var parts = null
  if (matches && matches.length > 2) {
    if (sldMap[matches[2]]) {
      tld = matches[2]
      parts = matches[1].split('.')
    }
  }

  if (!parts) {
    parts = v.split('.')
    if (parts.length <= 1) return false

    tld = parts.pop()
    var tldRegex = /^(?:xn--)?(?!^\d+$)[a-z0-9]+$/gi

    if (!tldRegex.test(tld)) return false
  }

  if (opts.subdomain == false && parts.length > 1) return false

  var isValid = parts.every(function(host, index) {
    if (opts.wildcard && index === 0 && host === '*' && parts.length > 1) return true

    var hostRegex = /^(?!:\/\/)([a-z0-9]+|[a-z0-9][a-z0-9-]*[a-z0-9])$/gi;

    return hostRegex.test(host)
  })

  return isValid
}
},{"./domains/sld":13}],15:[function(require,module,exports){
var nearley = require('nearley')
var grammar = nearley.Grammar.fromCompiled(require('./multiserver'))

function parse (string) {
  var parser = new nearley.Parser(grammar)
  parser.feed(string)
  var a = parser.results
  if(a.length  === 0) throw new Error('unexpected end')
  return a[0]
}

exports.decode = function (address) {
  return parse(address)
}

exports.encode = function (data) {
  return data.map(function (e) {
    return e.map(function (e) {
      return e.name + (e.data.length ? ':'+e.data.join(':') : '')
    }).join('~')
  }).join(';')
}

function repeat (head, separator, tail) {
  if(!tail) tail = head
  return head + '(?:'+ separator + tail + ')*'
}

var name = '[a-z][a-z\-0-9]+'
var data = '(?:["-9]|[<-}]|![!~:;])*'
var protocol = repeat(name, ':', data)
var address = repeat(protocol, '~')
var multi = repeat(address, ';')

var multi_rx = new RegExp('^'+multi+'$')

exports.check = function (data) {
  return !!multi_rx.exec(data)
}

exports.type = 'multiaddress'

exports.buffer = false


},{"./multiserver":16,"nearley":17}],16:[function(require,module,exports){
// Generated automatically by nearley, version 2.15.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }
var grammar = {
    Lexer: undefined,
    ParserRules: [
    {"name": "multiaddress$ebnf$1", "symbols": []},
    {"name": "multiaddress$ebnf$1$subexpression$1", "symbols": [{"literal":";"}, "address"]},
    {"name": "multiaddress$ebnf$1", "symbols": ["multiaddress$ebnf$1", "multiaddress$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "multiaddress", "symbols": ["address", "multiaddress$ebnf$1"], "postprocess": d => [d[0]].concat(d[1].map(function (e) { return e[1] }))},
    {"name": "address$ebnf$1", "symbols": []},
    {"name": "address$ebnf$1$subexpression$1", "symbols": [{"literal":"~"}, "protocol"]},
    {"name": "address$ebnf$1", "symbols": ["address$ebnf$1", "address$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "address", "symbols": ["protocol", "address$ebnf$1"], "postprocess": d => [d[0]].concat(d[1].map(function (e) { return e[1] }))},
    {"name": "protocol$ebnf$1", "symbols": []},
    {"name": "protocol$ebnf$1$subexpression$1", "symbols": [{"literal":":"}, "data"]},
    {"name": "protocol$ebnf$1", "symbols": ["protocol$ebnf$1", "protocol$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "protocol", "symbols": ["name", "protocol$ebnf$1"], "postprocess": (d) => { return {name: d[0], data: d[1].map(e =>  e[1] )} }},
    {"name": "name$ebnf$1", "symbols": [/[a-z\-0-9]/]},
    {"name": "name$ebnf$1", "symbols": ["name$ebnf$1", /[a-z\-0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "name", "symbols": [/[a-z]/, "name$ebnf$1"], "postprocess": d => d[0]+d[1].join('')},
    {"name": "data$ebnf$1", "symbols": []},
    {"name": "data$ebnf$1$subexpression$1", "symbols": ["char"]},
    {"name": "data$ebnf$1$subexpression$1", "symbols": ["escaped_char"]},
    {"name": "data$ebnf$1", "symbols": ["data$ebnf$1", "data$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "data", "symbols": ["data$ebnf$1"], "postprocess": d => d[0].join('')},
    {"name": "char", "symbols": [/["-9]/]},
    {"name": "char", "symbols": [/[<-}]/], "postprocess": d => d[0]},
    {"name": "escaped_char$subexpression$1$string$1", "symbols": [{"literal":"!"}, {"literal":"!"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "escaped_char$subexpression$1", "symbols": ["escaped_char$subexpression$1$string$1"]},
    {"name": "escaped_char$subexpression$1$string$2", "symbols": [{"literal":"!"}, {"literal":"~"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "escaped_char$subexpression$1", "symbols": ["escaped_char$subexpression$1$string$2"]},
    {"name": "escaped_char$subexpression$1$string$3", "symbols": [{"literal":"!"}, {"literal":":"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "escaped_char$subexpression$1", "symbols": ["escaped_char$subexpression$1$string$3"]},
    {"name": "escaped_char$subexpression$1$string$4", "symbols": [{"literal":"!"}, {"literal":";"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "escaped_char$subexpression$1", "symbols": ["escaped_char$subexpression$1$string$4"]},
    {"name": "escaped_char", "symbols": ["escaped_char$subexpression$1"], "postprocess": d => d[0][0][1]}
]
  , ParserStart: "multiaddress"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();

},{}],17:[function(require,module,exports){
(function(root, factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.nearley = factory();
    }
}(this, function() {

    function Rule(name, symbols, postprocess) {
        this.id = ++Rule.highestId;
        this.name = name;
        this.symbols = symbols;        // a list of literal | regex class | nonterminal
        this.postprocess = postprocess;
        return this;
    }
    Rule.highestId = 0;

    Rule.prototype.toString = function(withCursorAt) {
        function stringifySymbolSequence (e) {
            return e.literal ? JSON.stringify(e.literal) :
                   e.type ? '%' + e.type : e.toString();
        }
        var symbolSequence = (typeof withCursorAt === "undefined")
                             ? this.symbols.map(stringifySymbolSequence).join(' ')
                             : (   this.symbols.slice(0, withCursorAt).map(stringifySymbolSequence).join(' ')
                                 + " ● "
                                 + this.symbols.slice(withCursorAt).map(stringifySymbolSequence).join(' ')     );
        return this.name + " → " + symbolSequence;
    }


    // a State is a rule at a position from a given starting point in the input stream (reference)
    function State(rule, dot, reference, wantedBy) {
        this.rule = rule;
        this.dot = dot;
        this.reference = reference;
        this.data = [];
        this.wantedBy = wantedBy;
        this.isComplete = this.dot === rule.symbols.length;
    }

    State.prototype.toString = function() {
        return "{" + this.rule.toString(this.dot) + "}, from: " + (this.reference || 0);
    };

    State.prototype.nextState = function(child) {
        var state = new State(this.rule, this.dot + 1, this.reference, this.wantedBy);
        state.left = this;
        state.right = child;
        if (state.isComplete) {
            state.data = state.build();
        }
        return state;
    };

    State.prototype.build = function() {
        var children = [];
        var node = this;
        do {
            children.push(node.right.data);
            node = node.left;
        } while (node.left);
        children.reverse();
        return children;
    };

    State.prototype.finish = function() {
        if (this.rule.postprocess) {
            this.data = this.rule.postprocess(this.data, this.reference, Parser.fail);
        }
    };


    function Column(grammar, index) {
        this.grammar = grammar;
        this.index = index;
        this.states = [];
        this.wants = {}; // states indexed by the non-terminal they expect
        this.scannable = []; // list of states that expect a token
        this.completed = {}; // states that are nullable
    }


    Column.prototype.process = function(nextColumn) {
        var states = this.states;
        var wants = this.wants;
        var completed = this.completed;

        for (var w = 0; w < states.length; w++) { // nb. we push() during iteration
            var state = states[w];

            if (state.isComplete) {
                state.finish();
                if (state.data !== Parser.fail) {
                    // complete
                    var wantedBy = state.wantedBy;
                    for (var i = wantedBy.length; i--; ) { // this line is hot
                        var left = wantedBy[i];
                        this.complete(left, state);
                    }

                    // special-case nullables
                    if (state.reference === this.index) {
                        // make sure future predictors of this rule get completed.
                        var exp = state.rule.name;
                        (this.completed[exp] = this.completed[exp] || []).push(state);
                    }
                }

            } else {
                // queue scannable states
                var exp = state.rule.symbols[state.dot];
                if (typeof exp !== 'string') {
                    this.scannable.push(state);
                    continue;
                }

                // predict
                if (wants[exp]) {
                    wants[exp].push(state);

                    if (completed.hasOwnProperty(exp)) {
                        var nulls = completed[exp];
                        for (var i = 0; i < nulls.length; i++) {
                            var right = nulls[i];
                            this.complete(state, right);
                        }
                    }
                } else {
                    wants[exp] = [state];
                    this.predict(exp);
                }
            }
        }
    }

    Column.prototype.predict = function(exp) {
        var rules = this.grammar.byName[exp] || [];

        for (var i = 0; i < rules.length; i++) {
            var r = rules[i];
            var wantedBy = this.wants[exp];
            var s = new State(r, 0, this.index, wantedBy);
            this.states.push(s);
        }
    }

    Column.prototype.complete = function(left, right) {
        var copy = left.nextState(right);
        this.states.push(copy);
    }


    function Grammar(rules, start) {
        this.rules = rules;
        this.start = start || this.rules[0].name;
        var byName = this.byName = {};
        this.rules.forEach(function(rule) {
            if (!byName.hasOwnProperty(rule.name)) {
                byName[rule.name] = [];
            }
            byName[rule.name].push(rule);
        });
    }

    // So we can allow passing (rules, start) directly to Parser for backwards compatibility
    Grammar.fromCompiled = function(rules, start) {
        var lexer = rules.Lexer;
        if (rules.ParserStart) {
          start = rules.ParserStart;
          rules = rules.ParserRules;
        }
        var rules = rules.map(function (r) { return (new Rule(r.name, r.symbols, r.postprocess)); });
        var g = new Grammar(rules, start);
        g.lexer = lexer; // nb. storing lexer on Grammar is iffy, but unavoidable
        return g;
    }


    function StreamLexer() {
      this.reset("");
    }

    StreamLexer.prototype.reset = function(data, state) {
        this.buffer = data;
        this.index = 0;
        this.line = state ? state.line : 1;
        this.lastLineBreak = state ? -state.col : 0;
    }

    StreamLexer.prototype.next = function() {
        if (this.index < this.buffer.length) {
            var ch = this.buffer[this.index++];
            if (ch === '\n') {
              this.line += 1;
              this.lastLineBreak = this.index;
            }
            return {value: ch};
        }
    }

    StreamLexer.prototype.save = function() {
      return {
        line: this.line,
        col: this.index - this.lastLineBreak,
      }
    }

    StreamLexer.prototype.formatError = function(token, message) {
        // nb. this gets called after consuming the offending token,
        // so the culprit is index-1
        var buffer = this.buffer;
        if (typeof buffer === 'string') {
            var nextLineBreak = buffer.indexOf('\n', this.index);
            if (nextLineBreak === -1) nextLineBreak = buffer.length;
            var line = buffer.substring(this.lastLineBreak, nextLineBreak)
            var col = this.index - this.lastLineBreak;
            message += " at line " + this.line + " col " + col + ":\n\n";
            message += "  " + line + "\n"
            message += "  " + Array(col).join(" ") + "^"
            return message;
        } else {
            return message + " at index " + (this.index - 1);
        }
    }


    function Parser(rules, start, options) {
        if (rules instanceof Grammar) {
            var grammar = rules;
            var options = start;
        } else {
            var grammar = Grammar.fromCompiled(rules, start);
        }
        this.grammar = grammar;

        // Read options
        this.options = {
            keepHistory: false,
            lexer: grammar.lexer || new StreamLexer,
        };
        for (var key in (options || {})) {
            this.options[key] = options[key];
        }

        // Setup lexer
        this.lexer = this.options.lexer;
        this.lexerState = undefined;

        // Setup a table
        var column = new Column(grammar, 0);
        var table = this.table = [column];

        // I could be expecting anything.
        column.wants[grammar.start] = [];
        column.predict(grammar.start);
        // TODO what if start rule is nullable?
        column.process();
        this.current = 0; // token index
    }

    // create a reserved token for indicating a parse fail
    Parser.fail = {};

    Parser.prototype.feed = function(chunk) {
        var lexer = this.lexer;
        lexer.reset(chunk, this.lexerState);

        var token;
        while (token = lexer.next()) {
            // We add new states to table[current+1]
            var column = this.table[this.current];

            // GC unused states
            if (!this.options.keepHistory) {
                delete this.table[this.current - 1];
            }

            var n = this.current + 1;
            var nextColumn = new Column(this.grammar, n);
            this.table.push(nextColumn);

            // Advance all tokens that expect the symbol
            var literal = token.text !== undefined ? token.text : token.value;
            var value = lexer.constructor === StreamLexer ? token.value : token;
            var scannable = column.scannable;
            for (var w = scannable.length; w--; ) {
                var state = scannable[w];
                var expect = state.rule.symbols[state.dot];
                // Try to consume the token
                // either regex or literal
                if (expect.test ? expect.test(value) :
                    expect.type ? expect.type === token.type
                                : expect.literal === literal) {
                    // Add it
                    var next = state.nextState({data: value, token: token, isToken: true, reference: n - 1});
                    nextColumn.states.push(next);
                }
            }

            // Next, for each of the rules, we either
            // (a) complete it, and try to see if the reference row expected that
            //     rule
            // (b) predict the next nonterminal it expects by adding that
            //     nonterminal's start state
            // To prevent duplication, we also keep track of rules we have already
            // added

            nextColumn.process();

            // If needed, throw an error:
            if (nextColumn.states.length === 0) {
                // No states at all! This is not good.
                var err = new Error(this.reportError(token));
                err.offset = this.current;
                err.token = token;
                throw err;
            }

            // maybe save lexer state
            if (this.options.keepHistory) {
              column.lexerState = lexer.save()
            }

            this.current++;
        }
        if (column) {
          this.lexerState = lexer.save()
        }

        // Incrementally keep track of results
        this.results = this.finish();

        // Allow chaining, for whatever it's worth
        return this;
    };

    Parser.prototype.reportError = function(token) {
        var lines = [];
        var tokenDisplay = (token.type ? token.type + " token: " : "") + JSON.stringify(token.value !== undefined ? token.value : token);
        lines.push(this.lexer.formatError(token, "Syntax error"));
        lines.push('Unexpected ' + tokenDisplay + '. Instead, I was expecting to see one of the following:\n');
        var lastColumnIndex = this.table.length - 2;
        var lastColumn = this.table[lastColumnIndex];
        var expectantStates = lastColumn.states
            .filter(function(state) {
                var nextSymbol = state.rule.symbols[state.dot];
                return nextSymbol && typeof nextSymbol !== "string";
            });

        // Display a "state stack" for each expectant state
        // - which shows you how this state came to be, step by step.
        // If there is more than one derivation, we only display the first one.
        var stateStacks = expectantStates
            .map(function(state) {
                return this.buildFirstStateStack(state, []);
            }, this);
        // Display each state that is expecting a terminal symbol next.
        stateStacks.forEach(function(stateStack) {
            var state = stateStack[0];
            var nextSymbol = state.rule.symbols[state.dot];
            var symbolDisplay = this.getSymbolDisplay(nextSymbol);
            lines.push('A ' + symbolDisplay + ' based on:');
            this.displayStateStack(stateStack, lines);
        }, this);

        lines.push("");
        return lines.join("\n");
    };

    Parser.prototype.displayStateStack = function(stateStack, lines) {
        var lastDisplay;
        var sameDisplayCount = 0;
        for (var j = 0; j < stateStack.length; j++) {
            var state = stateStack[j];
            var display = state.rule.toString(state.dot);
            if (display === lastDisplay) {
                sameDisplayCount++;
            } else {
                if (sameDisplayCount > 0) {
                    lines.push('    ⬆ ︎' + sameDisplayCount + ' more lines identical to this');
                }
                sameDisplayCount = 0;
                lines.push('    ' + display);
            }
            lastDisplay = display;
        }
    };

    Parser.prototype.getSymbolDisplay = function(symbol) {
        var type = typeof symbol;
        if (type === "string") {
            return symbol;
        } else if (type === "object" && symbol.literal) {
            return JSON.stringify(symbol.literal);
        } else if (type === "object" && symbol instanceof RegExp) {
            return 'character matching ' + symbol;
        } else if (type === "object" && symbol.type) {
            return symbol.type + ' token';
        } else {
            throw new Error('Unknown symbol type: ' + symbol);
        }
    };

    /*
    Builds a the first state stack. You can think of a state stack as the call stack
    of the recursive-descent parser which the Nearley parse algorithm simulates.
    A state stack is represented as an array of state objects. Within a
    state stack, the first item of the array will be the starting
    state, with each successive item in the array going further back into history.

    This function needs to be given a starting state and an empty array representing
    the visited states, and it returns an single state stack.

    */
    Parser.prototype.buildFirstStateStack = function(state, visited) {
        if (visited.indexOf(state) !== -1) {
            // Found cycle, return null
            // to eliminate this path from the results, because
            // we don't know how to display it meaningfully
            return null;
        }
        if (state.wantedBy.length === 0) {
            return [state];
        }
        var prevState = state.wantedBy[0];
        var childVisited = [state].concat(visited);
        var childResult = this.buildFirstStateStack(prevState, childVisited);
        if (childResult === null) {
            return null;
        }
        return [state].concat(childResult);
    };

    Parser.prototype.save = function() {
        var column = this.table[this.current];
        column.lexerState = this.lexerState;
        return column;
    };

    Parser.prototype.restore = function(column) {
        var index = column.index;
        this.current = index;
        this.table[index] = column;
        this.table.splice(index + 1);
        this.lexerState = column.lexerState;

        // Incrementally keep track of results
        this.results = this.finish();
    };

    // nb. deprecated: use save/restore instead!
    Parser.prototype.rewind = function(index) {
        if (!this.options.keepHistory) {
            throw new Error('set option `keepHistory` to enable rewinding')
        }
        // nb. recall column (table) indicies fall between token indicies.
        //        col 0   --   token 0   --   col 1
        this.restore(this.table[index]);
    };

    Parser.prototype.finish = function() {
        // Return the possible parsings
        var considerations = [];
        var start = this.grammar.start;
        var column = this.table[this.table.length - 1]
        column.states.forEach(function (t) {
            if (t.rule.name === start
                    && t.dot === t.rule.symbols.length
                    && t.reference === 0
                    && t.data !== Parser.fail) {
                considerations.push(t);
            }
        });
        return considerations.map(function(c) {return c.data; });
    };

    return {
        Parser: Parser,
        Grammar: Grammar,
        Rule: Rule,
    };

}));

},{}]},{},[1]);
