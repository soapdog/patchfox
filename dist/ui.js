/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/css-loader/dist/cjs.js!./src/ui/Navigation.svelte.css":
/*!****************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/ui/Navigation.svelte.css ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js")(false);
// Module
exports.push([module.i, ".blocker.svelte-14egiim{height:70px;display:block}.above.svelte-14egiim{z-index:99999;width:100;padding:5px;position:fixed}.current.svelte-14egiim{border:none;background:none;border-bottom:solid 2px rgb(2, 146, 50);outline:none}", ""]);



/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/ui/Patchfox.svelte.css":
/*!**************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/ui/Patchfox.svelte.css ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js")(false);
// Module
exports.push([module.i, ".reduced-line-length.svelte-1mwu09k{max-width:840px;margin:auto}", ""]);



/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/ui/messageTypes/GenericMsg.svelte.css":
/*!*****************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/ui/messageTypes/GenericMsg.svelte.css ***!
  \*****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js")(false);
// Module
exports.push([module.i, "pre.code.svelte-mp70wj{overflow:scroll}", ""]);



/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/ui/messageTypes/MessageRenderer.svelte.css":
/*!**********************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/ui/messageTypes/MessageRenderer.svelte.css ***!
  \**********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js")(false);
// Module
exports.push([module.i, ".blured.svelte-1jn1wek img.svelte-1jn1wek{filter:blur(20px) !important}.blured.svelte-1jn1wek{border:solid 2px red}.feed-display.svelte-1jn1wek{cursor:pointer}.channel-display.svelte-1jn1wek{cursor:pointer}.menu-right.svelte-1jn1wek{right:0px;left:unset;min-width:300px}.private.svelte-1jn1wek{border:solid 2px orange}", ""]);



/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/ui/messageTypes/PostMsg.svelte.css":
/*!**************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/ui/messageTypes/PostMsg.svelte.css ***!
  \**************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js")(false);
// Module
exports.push([module.i, ".card-body.svelte-1ftdgav{overflow-wrap:break-word}", ""]);



/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/ui/views/Channels.svelte.css":
/*!********************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/ui/views/Channels.svelte.css ***!
  \********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js")(false);
// Module
exports.push([module.i, ".channel.svelte-1or0a5q{cursor:pointer}", ""]);



/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/ui/views/Compose.svelte.css":
/*!*******************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/ui/views/Compose.svelte.css ***!
  \*******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js")(false);
// Module
exports.push([module.i, ".file-on-top.svelte-olsuyr{border:solid 2px rgb(26, 192, 11)}input[type=\"file\"].svelte-olsuyr{display:none}", ""]);



/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/ui/views/Settings.svelte.css":
/*!********************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/ui/views/Settings.svelte.css ***!
  \********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js")(false);
// Module
exports.push([module.i, ".filter.svelte-1e0jkdi{height:300px;margin-bottom:0.4rem;overflow:hidden}.feed.svelte-1e0jkdi{max-width:100%;overflow:hidden}", ""]);



/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function (useSourceMap) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = cssWithMappingToString(item, useSourceMap);

      if (item[2]) {
        return '@media ' + item[2] + '{' + content + '}';
      } else {
        return content;
      }
    }).join('');
  }; // import a list of modules into the list


  list.i = function (modules, mediaQuery) {
    if (typeof modules === 'string') {
      modules = [[null, modules, '']];
    }

    var alreadyImportedModules = {};

    for (var i = 0; i < this.length; i++) {
      var id = this[i][0];

      if (id != null) {
        alreadyImportedModules[id] = true;
      }
    }

    for (i = 0; i < modules.length; i++) {
      var item = modules[i]; // skip already imported module
      // this implementation is not 100% perfect for weird media query combinations
      // when a module is imported multiple times with different media queries.
      // I hope this will never occur (Hey this way we have smaller bundles)

      if (item[0] == null || !alreadyImportedModules[item[0]]) {
        if (mediaQuery && !item[2]) {
          item[2] = mediaQuery;
        } else if (mediaQuery) {
          item[2] = '(' + item[2] + ') and (' + mediaQuery + ')';
        }

        list.push(item);
      }
    }
  };

  return list;
};

function cssWithMappingToString(item, useSourceMap) {
  var content = item[1] || '';
  var cssMapping = item[3];

  if (!cssMapping) {
    return content;
  }

  if (useSourceMap && typeof btoa === 'function') {
    var sourceMapping = toComment(cssMapping);
    var sourceURLs = cssMapping.sources.map(function (source) {
      return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */';
    });
    return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
  }

  return [content].join('\n');
} // Adapted from convert-source-map (MIT)


function toComment(sourceMap) {
  // eslint-disable-next-line no-undef
  var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
  var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;
  return '/*# ' + data + ' */';
}

/***/ }),

/***/ "./node_modules/decode-uri-component/index.js":
/*!****************************************************!*\
  !*** ./node_modules/decode-uri-component/index.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var token = '%[a-f0-9]{2}';
var singleMatcher = new RegExp(token, 'gi');
var multiMatcher = new RegExp('(' + token + ')+', 'gi');

function decodeComponents(components, split) {
	try {
		// Try to decode the entire string first
		return decodeURIComponent(components.join(''));
	} catch (err) {
		// Do nothing
	}

	if (components.length === 1) {
		return components;
	}

	split = split || 1;

	// Split the array in 2 parts
	var left = components.slice(0, split);
	var right = components.slice(split);

	return Array.prototype.concat.call([], decodeComponents(left), decodeComponents(right));
}

function decode(input) {
	try {
		return decodeURIComponent(input);
	} catch (err) {
		var tokens = input.match(singleMatcher);

		for (var i = 1; i < tokens.length; i++) {
			input = decodeComponents(tokens, i).join('');

			tokens = input.match(singleMatcher);
		}

		return input;
	}
}

function customDecodeURIComponent(input) {
	// Keep track of all the replacements and prefill the map with the `BOM`
	var replaceMap = {
		'%FE%FF': '\uFFFD\uFFFD',
		'%FF%FE': '\uFFFD\uFFFD'
	};

	var match = multiMatcher.exec(input);
	while (match) {
		try {
			// Decode as big chunks as possible
			replaceMap[match[0]] = decodeURIComponent(match[0]);
		} catch (err) {
			var result = decode(match[0]);

			if (result !== match[0]) {
				replaceMap[match[0]] = result;
			}
		}

		match = multiMatcher.exec(input);
	}

	// Add `%C2` at the end of the map to make sure it does not replace the combinator before everything else
	replaceMap['%C2'] = '\uFFFD';

	var entries = Object.keys(replaceMap);

	for (var i = 0; i < entries.length; i++) {
		// Replace all decoded components
		var key = entries[i];
		input = input.replace(new RegExp(key, 'g'), replaceMap[key]);
	}

	return input;
}

module.exports = function (encodedURI) {
	if (typeof encodedURI !== 'string') {
		throw new TypeError('Expected `encodedURI` to be of type `string`, got `' + typeof encodedURI + '`');
	}

	try {
		encodedURI = encodedURI.replace(/\+/g, ' ');

		// Try the built in decoder first
		return decodeURIComponent(encodedURI);
	} catch (err) {
		// Fallback to a more advanced decoder
		return customDecodeURIComponent(encodedURI);
	}
};


/***/ }),

/***/ "./node_modules/drag-and-drop-files/ondrop.js":
/*!****************************************************!*\
  !*** ./node_modules/drag-and-drop-files/ondrop.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function handleDrop(callback, event) {
  event.stopPropagation()
  event.preventDefault()
  callback(Array.prototype.slice.call(event.dataTransfer.files))
}

function killEvent(e) {
  e.stopPropagation()
  e.preventDefault()
  return false
}

function addDragDropListener(element, callback) {
  element.addEventListener("dragenter", killEvent, false)
  element.addEventListener("dragover", killEvent, false)
  element.addEventListener("drop", handleDrop.bind(undefined, callback), false)
}

module.exports = addDragDropListener

/***/ }),

/***/ "./node_modules/query-string/index.js":
/*!********************************************!*\
  !*** ./node_modules/query-string/index.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const strictUriEncode = __webpack_require__(/*! strict-uri-encode */ "./node_modules/strict-uri-encode/index.js");
const decodeComponent = __webpack_require__(/*! decode-uri-component */ "./node_modules/decode-uri-component/index.js");
const splitOnFirst = __webpack_require__(/*! split-on-first */ "./node_modules/split-on-first/index.js");

function encoderForArrayFormat(options) {
	switch (options.arrayFormat) {
		case 'index':
			return key => (result, value) => {
				const index = result.length;
				if (value === undefined) {
					return result;
				}

				if (value === null) {
					return [...result, [encode(key, options), '[', index, ']'].join('')];
				}

				return [
					...result,
					[encode(key, options), '[', encode(index, options), ']=', encode(value, options)].join('')
				];
			};

		case 'bracket':
			return key => (result, value) => {
				if (value === undefined) {
					return result;
				}

				if (value === null) {
					return [...result, [encode(key, options), '[]'].join('')];
				}

				return [...result, [encode(key, options), '[]=', encode(value, options)].join('')];
			};

		case 'comma':
			return key => (result, value, index) => {
				if (value === null || value === undefined || value.length === 0) {
					return result;
				}

				if (index === 0) {
					return [[encode(key, options), '=', encode(value, options)].join('')];
				}

				return [[result, encode(value, options)].join(',')];
			};

		default:
			return key => (result, value) => {
				if (value === undefined) {
					return result;
				}

				if (value === null) {
					return [...result, encode(key, options)];
				}

				return [...result, [encode(key, options), '=', encode(value, options)].join('')];
			};
	}
}

function parserForArrayFormat(options) {
	let result;

	switch (options.arrayFormat) {
		case 'index':
			return (key, value, accumulator) => {
				result = /\[(\d*)\]$/.exec(key);

				key = key.replace(/\[\d*\]$/, '');

				if (!result) {
					accumulator[key] = value;
					return;
				}

				if (accumulator[key] === undefined) {
					accumulator[key] = {};
				}

				accumulator[key][result[1]] = value;
			};

		case 'bracket':
			return (key, value, accumulator) => {
				result = /(\[\])$/.exec(key);
				key = key.replace(/\[\]$/, '');

				if (!result) {
					accumulator[key] = value;
					return;
				}

				if (accumulator[key] === undefined) {
					accumulator[key] = [value];
					return;
				}

				accumulator[key] = [].concat(accumulator[key], value);
			};

		case 'comma':
			return (key, value, accumulator) => {
				const isArray = typeof value === 'string' && value.split('').indexOf(',') > -1;
				const newValue = isArray ? value.split(',') : value;
				accumulator[key] = newValue;
			};

		default:
			return (key, value, accumulator) => {
				if (accumulator[key] === undefined) {
					accumulator[key] = value;
					return;
				}

				accumulator[key] = [].concat(accumulator[key], value);
			};
	}
}

function encode(value, options) {
	if (options.encode) {
		return options.strict ? strictUriEncode(value) : encodeURIComponent(value);
	}

	return value;
}

function decode(value, options) {
	if (options.decode) {
		return decodeComponent(value);
	}

	return value;
}

function keysSorter(input) {
	if (Array.isArray(input)) {
		return input.sort();
	}

	if (typeof input === 'object') {
		return keysSorter(Object.keys(input))
			.sort((a, b) => Number(a) - Number(b))
			.map(key => input[key]);
	}

	return input;
}

function removeHash(input) {
	const hashStart = input.indexOf('#');
	if (hashStart !== -1) {
		input = input.slice(0, hashStart);
	}

	return input;
}

function extract(input) {
	input = removeHash(input);
	const queryStart = input.indexOf('?');
	if (queryStart === -1) {
		return '';
	}

	return input.slice(queryStart + 1);
}

function parse(input, options) {
	options = Object.assign({
		decode: true,
		arrayFormat: 'none'
	}, options);

	const formatter = parserForArrayFormat(options);

	// Create an object with no prototype
	const ret = Object.create(null);

	if (typeof input !== 'string') {
		return ret;
	}

	input = input.trim().replace(/^[?#&]/, '');

	if (!input) {
		return ret;
	}

	for (const param of input.split('&')) {
		let [key, value] = splitOnFirst(param.replace(/\+/g, ' '), '=');

		// Missing `=` should be `null`:
		// http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
		value = value === undefined ? null : decode(value, options);

		formatter(decode(key, options), value, ret);
	}

	return Object.keys(ret).sort().reduce((result, key) => {
		const value = ret[key];
		if (Boolean(value) && typeof value === 'object' && !Array.isArray(value)) {
			// Sort object keys, not values
			result[key] = keysSorter(value);
		} else {
			result[key] = value;
		}

		return result;
	}, Object.create(null));
}

exports.extract = extract;
exports.parse = parse;

exports.stringify = (object, options) => {
	if (!object) {
		return '';
	}

	options = Object.assign({
		encode: true,
		strict: true,
		arrayFormat: 'none'
	}, options);

	const formatter = encoderForArrayFormat(options);
	const keys = Object.keys(object);

	if (options.sort !== false) {
		keys.sort(options.sort);
	}

	return keys.map(key => {
		const value = object[key];

		if (value === undefined) {
			return '';
		}

		if (value === null) {
			return encode(key, options);
		}

		if (Array.isArray(value)) {
			return value
				.reduce(formatter(key), [])
				.join('&');
		}

		return encode(key, options) + '=' + encode(value, options);
	}).filter(x => x.length > 0).join('&');
};

exports.parseUrl = (input, options) => {
	return {
		url: removeHash(input).split('?')[0] || '',
		query: parse(extract(input), options)
	};
};


/***/ }),

/***/ "./node_modules/split-on-first/index.js":
/*!**********************************************!*\
  !*** ./node_modules/split-on-first/index.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = (string, separator) => {
	if (!(typeof string === 'string' && typeof separator === 'string')) {
		throw new TypeError('Expected the arguments to be of type `string`');
	}

	if (separator === '') {
		return [string];
	}

	const separatorIndex = string.indexOf(separator);

	if (separatorIndex === -1) {
		return [string];
	}

	return [
		string.slice(0, separatorIndex),
		string.slice(separatorIndex + separator.length)
	];
};


/***/ }),

/***/ "./node_modules/strict-uri-encode/index.js":
/*!*************************************************!*\
  !*** ./node_modules/strict-uri-encode/index.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = str => encodeURIComponent(str).replace(/[!'()*]/g, x => `%${x.charCodeAt(0).toString(16).toUpperCase()}`);


/***/ }),

/***/ "./node_modules/style-loader/lib/addStyles.js":
/*!****************************************************!*\
  !*** ./node_modules/style-loader/lib/addStyles.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getTarget = function (target, parent) {
  if (parent){
    return parent.querySelector(target);
  }
  return document.querySelector(target);
};

var getElement = (function (fn) {
	var memo = {};

	return function(target, parent) {
                // If passing function in options, then use it for resolve "head" element.
                // Useful for Shadow Root style i.e
                // {
                //   insertInto: function () { return document.querySelector("#foo").shadowRoot }
                // }
                if (typeof target === 'function') {
                        return target();
                }
                if (typeof memo[target] === "undefined") {
			var styleTarget = getTarget.call(this, target, parent);
			// Special case to return head of iframe instead of iframe itself
			if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
				try {
					// This will throw an exception if access to iframe is blocked
					// due to cross-origin restrictions
					styleTarget = styleTarget.contentDocument.head;
				} catch(e) {
					styleTarget = null;
				}
			}
			memo[target] = styleTarget;
		}
		return memo[target]
	};
})();

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(/*! ./urls */ "./node_modules/style-loader/lib/urls.js");

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton && typeof options.singleton !== "boolean") options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
        if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else if (typeof options.insertAt === "object" && options.insertAt.before) {
		var nextSibling = getElement(options.insertAt.before, target);
		target.insertBefore(style, nextSibling);
	} else {
		throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	if(options.attrs.type === undefined) {
		options.attrs.type = "text/css";
	}

	if(options.attrs.nonce === undefined) {
		var nonce = getNonce();
		if (nonce) {
			options.attrs.nonce = nonce;
		}
	}

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	if(options.attrs.type === undefined) {
		options.attrs.type = "text/css";
	}
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function getNonce() {
	if (false) {}

	return __webpack_require__.nc;
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = typeof options.transform === 'function'
		 ? options.transform(obj.css) 
		 : options.transform.default(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),

/***/ "./node_modules/style-loader/lib/urls.js":
/*!***********************************************!*\
  !*** ./node_modules/style-loader/lib/urls.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/|\s*$)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),

/***/ "./node_modules/svelte/easing.mjs":
/*!****************************************!*\
  !*** ./node_modules/svelte/easing.mjs ***!
  \****************************************/
/*! exports provided: linear, backInOut, backIn, backOut, bounceOut, bounceInOut, bounceIn, circInOut, circIn, circOut, cubicInOut, cubicIn, cubicOut, elasticInOut, elasticIn, elasticOut, expoInOut, expoIn, expoOut, quadInOut, quadIn, quadOut, quartInOut, quartIn, quartOut, quintInOut, quintIn, quintOut, sineInOut, sineIn, sineOut */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "backInOut", function() { return backInOut; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "backIn", function() { return backIn; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "backOut", function() { return backOut; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "bounceOut", function() { return bounceOut; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "bounceInOut", function() { return bounceInOut; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "bounceIn", function() { return bounceIn; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "circInOut", function() { return circInOut; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "circIn", function() { return circIn; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "circOut", function() { return circOut; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "cubicInOut", function() { return cubicInOut; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "cubicIn", function() { return cubicIn; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "cubicOut", function() { return cubicOut; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "elasticInOut", function() { return elasticInOut; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "elasticIn", function() { return elasticIn; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "elasticOut", function() { return elasticOut; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "expoInOut", function() { return expoInOut; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "expoIn", function() { return expoIn; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "expoOut", function() { return expoOut; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "quadInOut", function() { return quadInOut; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "quadIn", function() { return quadIn; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "quadOut", function() { return quadOut; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "quartInOut", function() { return quartInOut; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "quartIn", function() { return quartIn; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "quartOut", function() { return quartOut; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "quintInOut", function() { return quintInOut; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "quintIn", function() { return quintIn; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "quintOut", function() { return quintOut; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sineInOut", function() { return sineInOut; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sineIn", function() { return sineIn; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sineOut", function() { return sineOut; });
/* harmony import */ var _internal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./internal */ "./node_modules/svelte/internal.mjs");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "linear", function() { return _internal__WEBPACK_IMPORTED_MODULE_0__["identity"]; });



/*
Adapted from https://github.com/mattdesl
Distributed under MIT License https://github.com/mattdesl/eases/blob/master/LICENSE.md
*/
function backInOut(t) {
    const s = 1.70158 * 1.525;
    if ((t *= 2) < 1)
        return 0.5 * (t * t * ((s + 1) * t - s));
    return 0.5 * ((t -= 2) * t * ((s + 1) * t + s) + 2);
}
function backIn(t) {
    const s = 1.70158;
    return t * t * ((s + 1) * t - s);
}
function backOut(t) {
    const s = 1.70158;
    return --t * t * ((s + 1) * t + s) + 1;
}
function bounceOut(t) {
    const a = 4.0 / 11.0;
    const b = 8.0 / 11.0;
    const c = 9.0 / 10.0;
    const ca = 4356.0 / 361.0;
    const cb = 35442.0 / 1805.0;
    const cc = 16061.0 / 1805.0;
    const t2 = t * t;
    return t < a
        ? 7.5625 * t2
        : t < b
            ? 9.075 * t2 - 9.9 * t + 3.4
            : t < c
                ? ca * t2 - cb * t + cc
                : 10.8 * t * t - 20.52 * t + 10.72;
}
function bounceInOut(t) {
    return t < 0.5
        ? 0.5 * (1.0 - bounceOut(1.0 - t * 2.0))
        : 0.5 * bounceOut(t * 2.0 - 1.0) + 0.5;
}
function bounceIn(t) {
    return 1.0 - bounceOut(1.0 - t);
}
function circInOut(t) {
    if ((t *= 2) < 1)
        return -0.5 * (Math.sqrt(1 - t * t) - 1);
    return 0.5 * (Math.sqrt(1 - (t -= 2) * t) + 1);
}
function circIn(t) {
    return 1.0 - Math.sqrt(1.0 - t * t);
}
function circOut(t) {
    return Math.sqrt(1 - --t * t);
}
function cubicInOut(t) {
    return t < 0.5 ? 4.0 * t * t * t : 0.5 * Math.pow(2.0 * t - 2.0, 3.0) + 1.0;
}
function cubicIn(t) {
    return t * t * t;
}
function cubicOut(t) {
    const f = t - 1.0;
    return f * f * f + 1.0;
}
function elasticInOut(t) {
    return t < 0.5
        ? 0.5 *
            Math.sin(((+13.0 * Math.PI) / 2) * 2.0 * t) *
            Math.pow(2.0, 10.0 * (2.0 * t - 1.0))
        : 0.5 *
            Math.sin(((-13.0 * Math.PI) / 2) * (2.0 * t - 1.0 + 1.0)) *
            Math.pow(2.0, -10.0 * (2.0 * t - 1.0)) +
            1.0;
}
function elasticIn(t) {
    return Math.sin((13.0 * t * Math.PI) / 2) * Math.pow(2.0, 10.0 * (t - 1.0));
}
function elasticOut(t) {
    return (Math.sin((-13.0 * (t + 1.0) * Math.PI) / 2) * Math.pow(2.0, -10.0 * t) + 1.0);
}
function expoInOut(t) {
    return t === 0.0 || t === 1.0
        ? t
        : t < 0.5
            ? +0.5 * Math.pow(2.0, 20.0 * t - 10.0)
            : -0.5 * Math.pow(2.0, 10.0 - t * 20.0) + 1.0;
}
function expoIn(t) {
    return t === 0.0 ? t : Math.pow(2.0, 10.0 * (t - 1.0));
}
function expoOut(t) {
    return t === 1.0 ? t : 1.0 - Math.pow(2.0, -10.0 * t);
}
function quadInOut(t) {
    t /= 0.5;
    if (t < 1)
        return 0.5 * t * t;
    t--;
    return -0.5 * (t * (t - 2) - 1);
}
function quadIn(t) {
    return t * t;
}
function quadOut(t) {
    return -t * (t - 2.0);
}
function quartInOut(t) {
    return t < 0.5
        ? +8.0 * Math.pow(t, 4.0)
        : -8.0 * Math.pow(t - 1.0, 4.0) + 1.0;
}
function quartIn(t) {
    return Math.pow(t, 4.0);
}
function quartOut(t) {
    return Math.pow(t - 1.0, 3.0) * (1.0 - t) + 1.0;
}
function quintInOut(t) {
    if ((t *= 2) < 1)
        return 0.5 * t * t * t * t * t;
    return 0.5 * ((t -= 2) * t * t * t * t + 2);
}
function quintIn(t) {
    return t * t * t * t * t;
}
function quintOut(t) {
    return --t * t * t * t * t + 1;
}
function sineInOut(t) {
    return -0.5 * (Math.cos(Math.PI * t) - 1);
}
function sineIn(t) {
    const v = Math.cos(t * Math.PI * 0.5);
    if (Math.abs(v) < 1e-14)
        return 1;
    else
        return 1 - v;
}
function sineOut(t) {
    return Math.sin((t * Math.PI) / 2);
}




/***/ }),

/***/ "./node_modules/svelte/index.mjs":
/*!***************************************!*\
  !*** ./node_modules/svelte/index.mjs ***!
  \***************************************/
/*! exports provided: onMount, onDestroy, beforeUpdate, afterUpdate, setContext, getContext, tick, createEventDispatcher */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _internal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./internal */ "./node_modules/svelte/internal.mjs");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "onMount", function() { return _internal__WEBPACK_IMPORTED_MODULE_0__["onMount"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "onDestroy", function() { return _internal__WEBPACK_IMPORTED_MODULE_0__["onDestroy"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "beforeUpdate", function() { return _internal__WEBPACK_IMPORTED_MODULE_0__["beforeUpdate"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "afterUpdate", function() { return _internal__WEBPACK_IMPORTED_MODULE_0__["afterUpdate"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "setContext", function() { return _internal__WEBPACK_IMPORTED_MODULE_0__["setContext"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getContext", function() { return _internal__WEBPACK_IMPORTED_MODULE_0__["getContext"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "tick", function() { return _internal__WEBPACK_IMPORTED_MODULE_0__["tick"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "createEventDispatcher", function() { return _internal__WEBPACK_IMPORTED_MODULE_0__["createEventDispatcher"]; });




/***/ }),

/***/ "./node_modules/svelte/internal.mjs":
/*!******************************************!*\
  !*** ./node_modules/svelte/internal.mjs ***!
  \******************************************/
/*! exports provided: create_animation, fix_position, handle_promise, append, insert, detach, detach_between, detach_before, detach_after, destroy_each, element, object_without_properties, svg_element, text, space, empty, listen, prevent_default, stop_propagation, attr, set_attributes, set_custom_element_data, xlink_attr, get_binding_group_value, to_number, time_ranges_to_array, children, claim_element, claim_text, set_data, set_input_type, set_style, select_option, select_options, select_value, select_multiple_value, add_resize_listener, toggle_class, custom_event, destroy_block, outro_and_destroy_block, fix_and_outro_and_destroy_block, update_keyed_each, measure, current_component, set_current_component, beforeUpdate, onMount, afterUpdate, onDestroy, createEventDispatcher, setContext, getContext, bubble, clear_loops, loop, dirty_components, intros, schedule_update, tick, add_binding_callback, add_render_callback, add_flush_callback, flush, get_spread_update, invalid_attribute_name_character, spread, escaped, escape, each, missing_component, validate_component, debug, create_ssr_component, get_store_value, group_outros, check_outros, on_outro, create_in_transition, create_out_transition, create_bidirectional_transition, noop, identity, assign, is_promise, add_location, run, blank_object, run_all, is_function, safe_not_equal, not_equal, validate_store, subscribe, create_slot, get_slot_context, get_slot_changes, exclude_internal_props, now, raf, set_now, set_raf, bind, mount_component, init, SvelteElement, SvelteComponent, SvelteComponentDev */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "create_animation", function() { return create_animation; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fix_position", function() { return fix_position; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handle_promise", function() { return handle_promise; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "append", function() { return append; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "insert", function() { return insert; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "detach", function() { return detach; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "detach_between", function() { return detach_between; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "detach_before", function() { return detach_before; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "detach_after", function() { return detach_after; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "destroy_each", function() { return destroy_each; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "element", function() { return element; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "object_without_properties", function() { return object_without_properties; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "svg_element", function() { return svg_element; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "text", function() { return text; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "space", function() { return space; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "empty", function() { return empty; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "listen", function() { return listen; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "prevent_default", function() { return prevent_default; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "stop_propagation", function() { return stop_propagation; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "attr", function() { return attr; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "set_attributes", function() { return set_attributes; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "set_custom_element_data", function() { return set_custom_element_data; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xlink_attr", function() { return xlink_attr; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "get_binding_group_value", function() { return get_binding_group_value; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "to_number", function() { return to_number; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "time_ranges_to_array", function() { return time_ranges_to_array; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "children", function() { return children; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "claim_element", function() { return claim_element; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "claim_text", function() { return claim_text; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "set_data", function() { return set_data; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "set_input_type", function() { return set_input_type; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "set_style", function() { return set_style; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "select_option", function() { return select_option; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "select_options", function() { return select_options; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "select_value", function() { return select_value; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "select_multiple_value", function() { return select_multiple_value; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "add_resize_listener", function() { return add_resize_listener; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "toggle_class", function() { return toggle_class; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "custom_event", function() { return custom_event; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "destroy_block", function() { return destroy_block; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "outro_and_destroy_block", function() { return outro_and_destroy_block; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fix_and_outro_and_destroy_block", function() { return fix_and_outro_and_destroy_block; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "update_keyed_each", function() { return update_keyed_each; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "measure", function() { return measure; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "current_component", function() { return current_component; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "set_current_component", function() { return set_current_component; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "beforeUpdate", function() { return beforeUpdate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "onMount", function() { return onMount; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "afterUpdate", function() { return afterUpdate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "onDestroy", function() { return onDestroy; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createEventDispatcher", function() { return createEventDispatcher; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setContext", function() { return setContext; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getContext", function() { return getContext; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "bubble", function() { return bubble; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "clear_loops", function() { return clear_loops; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "loop", function() { return loop; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "dirty_components", function() { return dirty_components; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "intros", function() { return intros; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "schedule_update", function() { return schedule_update; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "tick", function() { return tick; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "add_binding_callback", function() { return add_binding_callback; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "add_render_callback", function() { return add_render_callback; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "add_flush_callback", function() { return add_flush_callback; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "flush", function() { return flush; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "get_spread_update", function() { return get_spread_update; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "invalid_attribute_name_character", function() { return invalid_attribute_name_character; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "spread", function() { return spread; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "escaped", function() { return escaped; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "escape", function() { return escape; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "each", function() { return each; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "missing_component", function() { return missing_component; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "validate_component", function() { return validate_component; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "debug", function() { return debug; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "create_ssr_component", function() { return create_ssr_component; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "get_store_value", function() { return get_store_value; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "group_outros", function() { return group_outros; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "check_outros", function() { return check_outros; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "on_outro", function() { return on_outro; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "create_in_transition", function() { return create_in_transition; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "create_out_transition", function() { return create_out_transition; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "create_bidirectional_transition", function() { return create_bidirectional_transition; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "noop", function() { return noop; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "identity", function() { return identity; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "assign", function() { return assign; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "is_promise", function() { return is_promise; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "add_location", function() { return add_location; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "run", function() { return run; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "blank_object", function() { return blank_object; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "run_all", function() { return run_all; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "is_function", function() { return is_function; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "safe_not_equal", function() { return safe_not_equal; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "not_equal", function() { return not_equal; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "validate_store", function() { return validate_store; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "subscribe", function() { return subscribe; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "create_slot", function() { return create_slot; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "get_slot_context", function() { return get_slot_context; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "get_slot_changes", function() { return get_slot_changes; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "exclude_internal_props", function() { return exclude_internal_props; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "now", function() { return now; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "raf", function() { return raf; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "set_now", function() { return set_now; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "set_raf", function() { return set_raf; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "bind", function() { return bind; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mount_component", function() { return mount_component; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "init", function() { return init; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SvelteElement", function() { return SvelteElement; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SvelteComponent", function() { return SvelteComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SvelteComponentDev", function() { return SvelteComponentDev; });
function noop() { }
const identity = x => x;
function assign(tar, src) {
    for (const k in src)
        tar[k] = src[k];
    return tar;
}
function is_promise(value) {
    return value && typeof value.then === 'function';
}
function add_location(element, file, line, column, char) {
    element.__svelte_meta = {
        loc: { file, line, column, char }
    };
}
function run(fn) {
    return fn();
}
function blank_object() {
    return Object.create(null);
}
function run_all(fns) {
    fns.forEach(run);
}
function is_function(thing) {
    return typeof thing === 'function';
}
function safe_not_equal(a, b) {
    return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}
function not_equal(a, b) {
    return a != a ? b == b : a !== b;
}
function validate_store(store, name) {
    if (!store || typeof store.subscribe !== 'function') {
        throw new Error(`'${name}' is not a store with a 'subscribe' method`);
    }
}
function subscribe(component, store, callback) {
    const unsub = store.subscribe(callback);
    component.$$.on_destroy.push(unsub.unsubscribe
        ? () => unsub.unsubscribe()
        : unsub);
}
function create_slot(definition, ctx, fn) {
    if (definition) {
        const slot_ctx = get_slot_context(definition, ctx, fn);
        return definition[0](slot_ctx);
    }
}
function get_slot_context(definition, ctx, fn) {
    return definition[1]
        ? assign({}, assign(ctx.$$scope.ctx, definition[1](fn ? fn(ctx) : {})))
        : ctx.$$scope.ctx;
}
function get_slot_changes(definition, ctx, changed, fn) {
    return definition[1]
        ? assign({}, assign(ctx.$$scope.changed || {}, definition[1](fn ? fn(changed) : {})))
        : ctx.$$scope.changed || {};
}
function exclude_internal_props(props) {
    const result = {};
    for (const k in props)
        if (k[0] !== '$')
            result[k] = props[k];
    return result;
}
const is_client = typeof window !== 'undefined';
let now = is_client
    ? () => window.performance.now()
    : () => Date.now();
let raf = is_client ? requestAnimationFrame : noop;
// used internally for testing
function set_now(fn) {
    now = fn;
}
function set_raf(fn) {
    raf = fn;
}

const tasks = new Set();
let running = false;
function run_tasks() {
    tasks.forEach(task => {
        if (!task[0](now())) {
            tasks.delete(task);
            task[1]();
        }
    });
    running = tasks.size > 0;
    if (running)
        raf(run_tasks);
}
function clear_loops() {
    // for testing...
    tasks.forEach(task => tasks.delete(task));
    running = false;
}
function loop(fn) {
    let task;
    if (!running) {
        running = true;
        raf(run_tasks);
    }
    return {
        promise: new Promise(fulfil => {
            tasks.add(task = [fn, fulfil]);
        }),
        abort() {
            tasks.delete(task);
        }
    };
}

function append(target, node) {
    target.appendChild(node);
}
function insert(target, node, anchor) {
    target.insertBefore(node, anchor || null);
}
function detach(node) {
    node.parentNode.removeChild(node);
}
function detach_between(before, after) {
    while (before.nextSibling && before.nextSibling !== after) {
        before.parentNode.removeChild(before.nextSibling);
    }
}
function detach_before(after) {
    while (after.previousSibling) {
        after.parentNode.removeChild(after.previousSibling);
    }
}
function detach_after(before) {
    while (before.nextSibling) {
        before.parentNode.removeChild(before.nextSibling);
    }
}
function destroy_each(iterations, detaching) {
    for (let i = 0; i < iterations.length; i += 1) {
        if (iterations[i])
            iterations[i].d(detaching);
    }
}
function element(name) {
    return document.createElement(name);
}
function object_without_properties(obj, exclude) {
    const target = {};
    for (const k in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, k)
            // @ts-ignore
            && exclude.indexOf(k) === -1) {
            // @ts-ignore
            target[k] = obj[k];
        }
    }
    return target;
}
function svg_element(name) {
    return document.createElementNS('http://www.w3.org/2000/svg', name);
}
function text(data) {
    return document.createTextNode(data);
}
function space() {
    return text(' ');
}
function empty() {
    return text('');
}
function listen(node, event, handler, options) {
    node.addEventListener(event, handler, options);
    return () => node.removeEventListener(event, handler, options);
}
function prevent_default(fn) {
    return function (event) {
        event.preventDefault();
        // @ts-ignore
        return fn.call(this, event);
    };
}
function stop_propagation(fn) {
    return function (event) {
        event.stopPropagation();
        // @ts-ignore
        return fn.call(this, event);
    };
}
function attr(node, attribute, value) {
    if (value == null)
        node.removeAttribute(attribute);
    else
        node.setAttribute(attribute, value);
}
function set_attributes(node, attributes) {
    for (const key in attributes) {
        if (key === 'style') {
            node.style.cssText = attributes[key];
        }
        else if (key in node) {
            node[key] = attributes[key];
        }
        else {
            attr(node, key, attributes[key]);
        }
    }
}
function set_custom_element_data(node, prop, value) {
    if (prop in node) {
        node[prop] = value;
    }
    else {
        attr(node, prop, value);
    }
}
function xlink_attr(node, attribute, value) {
    node.setAttributeNS('http://www.w3.org/1999/xlink', attribute, value);
}
function get_binding_group_value(group) {
    const value = [];
    for (let i = 0; i < group.length; i += 1) {
        if (group[i].checked)
            value.push(group[i].__value);
    }
    return value;
}
function to_number(value) {
    return value === '' ? undefined : +value;
}
function time_ranges_to_array(ranges) {
    const array = [];
    for (let i = 0; i < ranges.length; i += 1) {
        array.push({ start: ranges.start(i), end: ranges.end(i) });
    }
    return array;
}
function children(element) {
    return Array.from(element.childNodes);
}
function claim_element(nodes, name, attributes, svg) {
    for (let i = 0; i < nodes.length; i += 1) {
        const node = nodes[i];
        if (node.nodeName === name) {
            for (let j = 0; j < node.attributes.length; j += 1) {
                const attribute = node.attributes[j];
                if (!attributes[attribute.name])
                    node.removeAttribute(attribute.name);
            }
            return nodes.splice(i, 1)[0]; // TODO strip unwanted attributes
        }
    }
    return svg ? svg_element(name) : element(name);
}
function claim_text(nodes, data) {
    for (let i = 0; i < nodes.length; i += 1) {
        const node = nodes[i];
        if (node.nodeType === 3) {
            node.data = data;
            return nodes.splice(i, 1)[0];
        }
    }
    return text(data);
}
function set_data(text, data) {
    data = '' + data;
    if (text.data !== data)
        text.data = data;
}
function set_input_type(input, type) {
    try {
        input.type = type;
    }
    catch (e) {
        // do nothing
    }
}
function set_style(node, key, value) {
    node.style.setProperty(key, value);
}
function select_option(select, value) {
    for (let i = 0; i < select.options.length; i += 1) {
        const option = select.options[i];
        if (option.__value === value) {
            option.selected = true;
            return;
        }
    }
}
function select_options(select, value) {
    for (let i = 0; i < select.options.length; i += 1) {
        const option = select.options[i];
        option.selected = ~value.indexOf(option.__value);
    }
}
function select_value(select) {
    const selected_option = select.querySelector(':checked') || select.options[0];
    return selected_option && selected_option.__value;
}
function select_multiple_value(select) {
    return [].map.call(select.querySelectorAll(':checked'), option => option.__value);
}
function add_resize_listener(element, fn) {
    if (getComputedStyle(element).position === 'static') {
        element.style.position = 'relative';
    }
    const object = document.createElement('object');
    object.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; pointer-events: none; z-index: -1;');
    object.type = 'text/html';
    let win;
    object.onload = () => {
        win = object.contentDocument.defaultView;
        win.addEventListener('resize', fn);
    };
    if (/Trident/.test(navigator.userAgent)) {
        element.appendChild(object);
        object.data = 'about:blank';
    }
    else {
        object.data = 'about:blank';
        element.appendChild(object);
    }
    return {
        cancel: () => {
            win && win.removeEventListener && win.removeEventListener('resize', fn);
            element.removeChild(object);
        }
    };
}
function toggle_class(element, name, toggle) {
    element.classList[toggle ? 'add' : 'remove'](name);
}
function custom_event(type, detail) {
    const e = document.createEvent('CustomEvent');
    e.initCustomEvent(type, false, false, detail);
    return e;
}

let stylesheet;
let active = 0;
let current_rules = {};
// https://github.com/darkskyapp/string-hash/blob/master/index.js
function hash(str) {
    let hash = 5381;
    let i = str.length;
    while (i--)
        hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
    return hash >>> 0;
}
function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
    const step = 16.666 / duration;
    let keyframes = '{\n';
    for (let p = 0; p <= 1; p += step) {
        const t = a + (b - a) * ease(p);
        keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
    }
    const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
    const name = `__svelte_${hash(rule)}_${uid}`;
    if (!current_rules[name]) {
        if (!stylesheet) {
            const style = element('style');
            document.head.appendChild(style);
            stylesheet = style.sheet;
        }
        current_rules[name] = true;
        stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
    }
    const animation = node.style.animation || '';
    node.style.animation = `${animation ? `${animation}, ` : ``}${name} ${duration}ms linear ${delay}ms 1 both`;
    active += 1;
    return name;
}
function delete_rule(node, name) {
    node.style.animation = (node.style.animation || '')
        .split(', ')
        .filter(name
        ? anim => anim.indexOf(name) < 0 // remove specific animation
        : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
    )
        .join(', ');
    if (name && !--active)
        clear_rules();
}
function clear_rules() {
    raf(() => {
        if (active)
            return;
        let i = stylesheet.cssRules.length;
        while (i--)
            stylesheet.deleteRule(i);
        current_rules = {};
    });
}

function create_animation(node, from, fn, params) {
    if (!from)
        return noop;
    const to = node.getBoundingClientRect();
    if (from.left === to.left && from.right === to.right && from.top === to.top && from.bottom === to.bottom)
        return noop;
    const { delay = 0, duration = 300, easing = identity, start: start_time = now() + delay, end = start_time + duration, tick = noop, css } = fn(node, { from, to }, params);
    let running = true;
    let started = false;
    let name;
    function start() {
        if (css) {
            name = create_rule(node, 0, 1, duration, delay, easing, css);
        }
        if (!delay) {
            started = true;
        }
    }
    function stop() {
        if (css)
            delete_rule(node, name);
        running = false;
    }
    loop(now$$1 => {
        if (!started && now$$1 >= start_time) {
            started = true;
        }
        if (started && now$$1 >= end) {
            tick(1, 0);
            stop();
        }
        if (!running) {
            return false;
        }
        if (started) {
            const p = now$$1 - start_time;
            const t = 0 + 1 * easing(p / duration);
            tick(t, 1 - t);
        }
        return true;
    });
    start();
    tick(0, 1);
    return stop;
}
function fix_position(node) {
    const style = getComputedStyle(node);
    if (style.position !== 'absolute' && style.position !== 'fixed') {
        const { width, height } = style;
        const a = node.getBoundingClientRect();
        node.style.position = 'absolute';
        node.style.width = width;
        node.style.height = height;
        const b = node.getBoundingClientRect();
        if (a.left !== b.left || a.top !== b.top) {
            const style = getComputedStyle(node);
            const transform = style.transform === 'none' ? '' : style.transform;
            node.style.transform = `${transform} translate(${a.left - b.left}px, ${a.top - b.top}px)`;
        }
    }
}

let current_component;
function set_current_component(component) {
    current_component = component;
}
function get_current_component() {
    if (!current_component)
        throw new Error(`Function called outside component initialization`);
    return current_component;
}
function beforeUpdate(fn) {
    get_current_component().$$.before_render.push(fn);
}
function onMount(fn) {
    get_current_component().$$.on_mount.push(fn);
}
function afterUpdate(fn) {
    get_current_component().$$.after_render.push(fn);
}
function onDestroy(fn) {
    get_current_component().$$.on_destroy.push(fn);
}
function createEventDispatcher() {
    const component = current_component;
    return (type, detail) => {
        const callbacks = component.$$.callbacks[type];
        if (callbacks) {
            // TODO are there situations where events could be dispatched
            // in a server (non-DOM) environment?
            const event = custom_event(type, detail);
            callbacks.slice().forEach(fn => {
                fn.call(component, event);
            });
        }
    };
}
function setContext(key, context) {
    get_current_component().$$.context.set(key, context);
}
function getContext(key) {
    return get_current_component().$$.context.get(key);
}
// TODO figure out if we still want to support
// shorthand events, or if we want to implement
// a real bubbling mechanism
function bubble(component, event) {
    const callbacks = component.$$.callbacks[event.type];
    if (callbacks) {
        callbacks.slice().forEach(fn => fn(event));
    }
}

const dirty_components = [];
const intros = { enabled: false };
const resolved_promise = Promise.resolve();
let update_scheduled = false;
const binding_callbacks = [];
const render_callbacks = [];
const flush_callbacks = [];
function schedule_update() {
    if (!update_scheduled) {
        update_scheduled = true;
        resolved_promise.then(flush);
    }
}
function tick() {
    schedule_update();
    return resolved_promise;
}
function add_binding_callback(fn) {
    binding_callbacks.push(fn);
}
function add_render_callback(fn) {
    render_callbacks.push(fn);
}
function add_flush_callback(fn) {
    flush_callbacks.push(fn);
}
function flush() {
    const seen_callbacks = new Set();
    do {
        // first, call beforeUpdate functions
        // and update components
        while (dirty_components.length) {
            const component = dirty_components.shift();
            set_current_component(component);
            update(component.$$);
        }
        while (binding_callbacks.length)
            binding_callbacks.shift()();
        // then, once components are updated, call
        // afterUpdate functions. This may cause
        // subsequent updates...
        while (render_callbacks.length) {
            const callback = render_callbacks.pop();
            if (!seen_callbacks.has(callback)) {
                callback();
                // ...so guard against infinite loops
                seen_callbacks.add(callback);
            }
        }
    } while (dirty_components.length);
    while (flush_callbacks.length) {
        flush_callbacks.pop()();
    }
    update_scheduled = false;
}
function update($$) {
    if ($$.fragment) {
        $$.update($$.dirty);
        run_all($$.before_render);
        $$.fragment.p($$.dirty, $$.ctx);
        $$.dirty = null;
        $$.after_render.forEach(add_render_callback);
    }
}

let promise;
function wait() {
    if (!promise) {
        promise = Promise.resolve();
        promise.then(() => {
            promise = null;
        });
    }
    return promise;
}
function dispatch(node, direction, kind) {
    node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
}
let outros;
function group_outros() {
    outros = {
        remaining: 0,
        callbacks: []
    };
}
function check_outros() {
    if (!outros.remaining) {
        run_all(outros.callbacks);
    }
}
function on_outro(callback) {
    outros.callbacks.push(callback);
}
function create_in_transition(node, fn, params) {
    let config = fn(node, params);
    let running = false;
    let animation_name;
    let task;
    let uid = 0;
    function cleanup() {
        if (animation_name)
            delete_rule(node, animation_name);
    }
    function go() {
        const { delay = 0, duration = 300, easing = identity, tick: tick$$1 = noop, css } = config;
        if (css)
            animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
        tick$$1(0, 1);
        const start_time = now() + delay;
        const end_time = start_time + duration;
        if (task)
            task.abort();
        running = true;
        task = loop(now$$1 => {
            if (running) {
                if (now$$1 >= end_time) {
                    tick$$1(1, 0);
                    cleanup();
                    return running = false;
                }
                if (now$$1 >= start_time) {
                    const t = easing((now$$1 - start_time) / duration);
                    tick$$1(t, 1 - t);
                }
            }
            return running;
        });
    }
    let started = false;
    return {
        start() {
            if (started)
                return;
            delete_rule(node);
            if (typeof config === 'function') {
                config = config();
                wait().then(go);
            }
            else {
                go();
            }
        },
        invalidate() {
            started = false;
        },
        end() {
            if (running) {
                cleanup();
                running = false;
            }
        }
    };
}
function create_out_transition(node, fn, params) {
    let config = fn(node, params);
    let running = true;
    let animation_name;
    const group = outros;
    group.remaining += 1;
    function go() {
        const { delay = 0, duration = 300, easing = identity, tick: tick$$1 = noop, css } = config;
        if (css)
            animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
        const start_time = now() + delay;
        const end_time = start_time + duration;
        loop(now$$1 => {
            if (running) {
                if (now$$1 >= end_time) {
                    tick$$1(0, 1);
                    if (!--group.remaining) {
                        // this will result in `end()` being called,
                        // so we don't need to clean up here
                        run_all(group.callbacks);
                    }
                    return false;
                }
                if (now$$1 >= start_time) {
                    const t = easing((now$$1 - start_time) / duration);
                    tick$$1(1 - t, t);
                }
            }
            return running;
        });
    }
    if (typeof config === 'function') {
        wait().then(() => {
            config = config();
            go();
        });
    }
    else {
        go();
    }
    return {
        end(reset) {
            if (reset && config.tick) {
                config.tick(1, 0);
            }
            if (running) {
                if (animation_name)
                    delete_rule(node, animation_name);
                running = false;
            }
        }
    };
}
function create_bidirectional_transition(node, fn, params, intro) {
    let config = fn(node, params);
    let t = intro ? 0 : 1;
    let running_program = null;
    let pending_program = null;
    let animation_name = null;
    function clear_animation() {
        if (animation_name)
            delete_rule(node, animation_name);
    }
    function init(program, duration) {
        const d = program.b - t;
        duration *= Math.abs(d);
        return {
            a: t,
            b: program.b,
            d,
            duration,
            start: program.start,
            end: program.start + duration,
            group: program.group
        };
    }
    function go(b) {
        const { delay = 0, duration = 300, easing = identity, tick: tick$$1 = noop, css } = config;
        const program = {
            start: now() + delay,
            b
        };
        if (!b) {
            // @ts-ignore todo: improve typings
            program.group = outros;
            outros.remaining += 1;
        }
        if (running_program) {
            pending_program = program;
        }
        else {
            // if this is an intro, and there's a delay, we need to do
            // an initial tick and/or apply CSS animation immediately
            if (css) {
                clear_animation();
                animation_name = create_rule(node, t, b, duration, delay, easing, css);
            }
            if (b)
                tick$$1(0, 1);
            running_program = init(program, duration);
            add_render_callback(() => dispatch(node, b, 'start'));
            loop(now$$1 => {
                if (pending_program && now$$1 > pending_program.start) {
                    running_program = init(pending_program, duration);
                    pending_program = null;
                    dispatch(node, running_program.b, 'start');
                    if (css) {
                        clear_animation();
                        animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                    }
                }
                if (running_program) {
                    if (now$$1 >= running_program.end) {
                        tick$$1(t = running_program.b, 1 - t);
                        dispatch(node, running_program.b, 'end');
                        if (!pending_program) {
                            // we're done
                            if (running_program.b) {
                                // intro — we can tidy up immediately
                                clear_animation();
                            }
                            else {
                                // outro — needs to be coordinated
                                if (!--running_program.group.remaining)
                                    run_all(running_program.group.callbacks);
                            }
                        }
                        running_program = null;
                    }
                    else if (now$$1 >= running_program.start) {
                        const p = now$$1 - running_program.start;
                        t = running_program.a + running_program.d * easing(p / running_program.duration);
                        tick$$1(t, 1 - t);
                    }
                }
                return !!(running_program || pending_program);
            });
        }
    }
    return {
        run(b) {
            if (typeof config === 'function') {
                wait().then(() => {
                    config = config();
                    go(b);
                });
            }
            else {
                go(b);
            }
        },
        end() {
            clear_animation();
            running_program = pending_program = null;
        }
    };
}

function handle_promise(promise, info) {
    const token = info.token = {};
    function update(type, index, key, value) {
        if (info.token !== token)
            return;
        info.resolved = key && { [key]: value };
        const child_ctx = assign(assign({}, info.ctx), info.resolved);
        const block = type && (info.current = type)(child_ctx);
        if (info.block) {
            if (info.blocks) {
                info.blocks.forEach((block, i) => {
                    if (i !== index && block) {
                        group_outros();
                        on_outro(() => {
                            block.d(1);
                            info.blocks[i] = null;
                        });
                        block.o(1);
                        check_outros();
                    }
                });
            }
            else {
                info.block.d(1);
            }
            block.c();
            if (block.i)
                block.i(1);
            block.m(info.mount(), info.anchor);
            flush();
        }
        info.block = block;
        if (info.blocks)
            info.blocks[index] = block;
    }
    if (is_promise(promise)) {
        promise.then(value => {
            update(info.then, 1, info.value, value);
        }, error => {
            update(info.catch, 2, info.error, error);
        });
        // if we previously had a then/catch block, destroy it
        if (info.current !== info.pending) {
            update(info.pending, 0);
            return true;
        }
    }
    else {
        if (info.current !== info.then) {
            update(info.then, 1, info.value, promise);
            return true;
        }
        info.resolved = { [info.value]: promise };
    }
}

function destroy_block(block, lookup) {
    block.d(1);
    lookup.delete(block.key);
}
function outro_and_destroy_block(block, lookup) {
    on_outro(() => {
        destroy_block(block, lookup);
    });
    block.o(1);
}
function fix_and_outro_and_destroy_block(block, lookup) {
    block.f();
    outro_and_destroy_block(block, lookup);
}
function update_keyed_each(old_blocks, changed, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
    let o = old_blocks.length;
    let n = list.length;
    let i = o;
    const old_indexes = {};
    while (i--)
        old_indexes[old_blocks[i].key] = i;
    const new_blocks = [];
    const new_lookup = new Map();
    const deltas = new Map();
    i = n;
    while (i--) {
        const child_ctx = get_context(ctx, list, i);
        const key = get_key(child_ctx);
        let block = lookup.get(key);
        if (!block) {
            block = create_each_block(key, child_ctx);
            block.c();
        }
        else if (dynamic) {
            block.p(changed, child_ctx);
        }
        new_lookup.set(key, new_blocks[i] = block);
        if (key in old_indexes)
            deltas.set(key, Math.abs(i - old_indexes[key]));
    }
    const will_move = new Set();
    const did_move = new Set();
    function insert(block) {
        if (block.i)
            block.i(1);
        block.m(node, next);
        lookup.set(block.key, block);
        next = block.first;
        n--;
    }
    while (o && n) {
        const new_block = new_blocks[n - 1];
        const old_block = old_blocks[o - 1];
        const new_key = new_block.key;
        const old_key = old_block.key;
        if (new_block === old_block) {
            // do nothing
            next = new_block.first;
            o--;
            n--;
        }
        else if (!new_lookup.has(old_key)) {
            // remove old block
            destroy(old_block, lookup);
            o--;
        }
        else if (!lookup.has(new_key) || will_move.has(new_key)) {
            insert(new_block);
        }
        else if (did_move.has(old_key)) {
            o--;
        }
        else if (deltas.get(new_key) > deltas.get(old_key)) {
            did_move.add(new_key);
            insert(new_block);
        }
        else {
            will_move.add(old_key);
            o--;
        }
    }
    while (o--) {
        const old_block = old_blocks[o];
        if (!new_lookup.has(old_block.key))
            destroy(old_block, lookup);
    }
    while (n)
        insert(new_blocks[n - 1]);
    return new_blocks;
}
function measure(blocks) {
    const rects = {};
    let i = blocks.length;
    while (i--)
        rects[blocks[i].key] = blocks[i].node.getBoundingClientRect();
    return rects;
}

function get_spread_update(levels, updates) {
    const update = {};
    const to_null_out = {};
    const accounted_for = { $$scope: 1 };
    let i = levels.length;
    while (i--) {
        const o = levels[i];
        const n = updates[i];
        if (n) {
            for (const key in o) {
                if (!(key in n))
                    to_null_out[key] = 1;
            }
            for (const key in n) {
                if (!accounted_for[key]) {
                    update[key] = n[key];
                    accounted_for[key] = 1;
                }
            }
            levels[i] = n;
        }
        else {
            for (const key in o) {
                accounted_for[key] = 1;
            }
        }
    }
    for (const key in to_null_out) {
        if (!(key in update))
            update[key] = undefined;
    }
    return update;
}

const invalid_attribute_name_character = /[\s'">/=\u{FDD0}-\u{FDEF}\u{FFFE}\u{FFFF}\u{1FFFE}\u{1FFFF}\u{2FFFE}\u{2FFFF}\u{3FFFE}\u{3FFFF}\u{4FFFE}\u{4FFFF}\u{5FFFE}\u{5FFFF}\u{6FFFE}\u{6FFFF}\u{7FFFE}\u{7FFFF}\u{8FFFE}\u{8FFFF}\u{9FFFE}\u{9FFFF}\u{AFFFE}\u{AFFFF}\u{BFFFE}\u{BFFFF}\u{CFFFE}\u{CFFFF}\u{DFFFE}\u{DFFFF}\u{EFFFE}\u{EFFFF}\u{FFFFE}\u{FFFFF}\u{10FFFE}\u{10FFFF}]/u;
// https://html.spec.whatwg.org/multipage/syntax.html#attributes-2
// https://infra.spec.whatwg.org/#noncharacter
function spread(args) {
    const attributes = Object.assign({}, ...args);
    let str = '';
    Object.keys(attributes).forEach(name => {
        if (invalid_attribute_name_character.test(name))
            return;
        const value = attributes[name];
        if (value === undefined)
            return;
        if (value === true)
            str += " " + name;
        const escaped = String(value)
            .replace(/"/g, '&#34;')
            .replace(/'/g, '&#39;');
        str += " " + name + "=" + JSON.stringify(escaped);
    });
    return str;
}
const escaped = {
    '"': '&quot;',
    "'": '&#39;',
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;'
};
function escape(html) {
    return String(html).replace(/["'&<>]/g, match => escaped[match]);
}
function each(items, fn) {
    let str = '';
    for (let i = 0; i < items.length; i += 1) {
        str += fn(items[i], i);
    }
    return str;
}
const missing_component = {
    $$render: () => ''
};
function validate_component(component, name) {
    if (!component || !component.$$render) {
        if (name === 'svelte:component')
            name += ' this={...}';
        throw new Error(`<${name}> is not a valid SSR component. You may need to review your build config to ensure that dependencies are compiled, rather than imported as pre-compiled modules`);
    }
    return component;
}
function debug(file, line, column, values) {
    console.log(`{@debug} ${file ? file + ' ' : ''}(${line}:${column})`); // eslint-disable-line no-console
    console.log(values); // eslint-disable-line no-console
    return '';
}
let on_destroy;
function create_ssr_component(fn) {
    function $$render(result, props, bindings, slots) {
        const parent_component = current_component;
        const $$ = {
            on_destroy,
            context: new Map(parent_component ? parent_component.$$.context : []),
            // these will be immediately discarded
            on_mount: [],
            before_render: [],
            after_render: [],
            callbacks: blank_object()
        };
        set_current_component({ $$ });
        const html = fn(result, props, bindings, slots);
        set_current_component(parent_component);
        return html;
    }
    return {
        render: (props = {}, options = {}) => {
            on_destroy = [];
            const result = { head: '', css: new Set() };
            const html = $$render(result, props, {}, options);
            run_all(on_destroy);
            return {
                html,
                css: {
                    code: Array.from(result.css).map(css => css.code).join('\n'),
                    map: null // TODO
                },
                head: result.head
            };
        },
        $$render
    };
}
function get_store_value(store) {
    let value;
    store.subscribe(_ => value = _)();
    return value;
}

function bind(component, name, callback) {
    if (component.$$.props.indexOf(name) === -1)
        return;
    component.$$.bound[name] = callback;
    callback(component.$$.ctx[name]);
}
function mount_component(component, target, anchor) {
    const { fragment, on_mount, on_destroy, after_render } = component.$$;
    fragment.m(target, anchor);
    // onMount happens after the initial afterUpdate. Because
    // afterUpdate callbacks happen in reverse order (inner first)
    // we schedule onMount callbacks before afterUpdate callbacks
    add_render_callback(() => {
        const new_on_destroy = on_mount.map(run).filter(is_function);
        if (on_destroy) {
            on_destroy.push(...new_on_destroy);
        }
        else {
            // Edge case - component was destroyed immediately,
            // most likely as a result of a binding initialising
            run_all(new_on_destroy);
        }
        component.$$.on_mount = [];
    });
    after_render.forEach(add_render_callback);
}
function destroy(component, detaching) {
    if (component.$$) {
        run_all(component.$$.on_destroy);
        component.$$.fragment.d(detaching);
        // TODO null out other refs, including component.$$ (but need to
        // preserve final state?)
        component.$$.on_destroy = component.$$.fragment = null;
        component.$$.ctx = {};
    }
}
function make_dirty(component, key) {
    if (!component.$$.dirty) {
        dirty_components.push(component);
        schedule_update();
        component.$$.dirty = blank_object();
    }
    component.$$.dirty[key] = true;
}
function init(component, options, instance, create_fragment, not_equal$$1, prop_names) {
    const parent_component = current_component;
    set_current_component(component);
    const props = options.props || {};
    const $$ = component.$$ = {
        fragment: null,
        ctx: null,
        // state
        props: prop_names,
        update: noop,
        not_equal: not_equal$$1,
        bound: blank_object(),
        // lifecycle
        on_mount: [],
        on_destroy: [],
        before_render: [],
        after_render: [],
        context: new Map(parent_component ? parent_component.$$.context : []),
        // everything else
        callbacks: blank_object(),
        dirty: null
    };
    let ready = false;
    $$.ctx = instance
        ? instance(component, props, (key, value) => {
            if ($$.ctx && not_equal$$1($$.ctx[key], $$.ctx[key] = value)) {
                if ($$.bound[key])
                    $$.bound[key](value);
                if (ready)
                    make_dirty(component, key);
            }
        })
        : props;
    $$.update();
    ready = true;
    run_all($$.before_render);
    $$.fragment = create_fragment($$.ctx);
    if (options.target) {
        if (options.hydrate) {
            $$.fragment.l(children(options.target));
        }
        else {
            $$.fragment.c();
        }
        if (options.intro && component.$$.fragment.i)
            component.$$.fragment.i();
        mount_component(component, options.target, options.anchor);
        flush();
    }
    set_current_component(parent_component);
}
let SvelteElement;
if (typeof HTMLElement !== 'undefined') {
    SvelteElement = class extends HTMLElement {
        constructor() {
            super();
            this.attachShadow({ mode: 'open' });
        }
        connectedCallback() {
            // @ts-ignore todo: improve typings
            for (const key in this.$$.slotted) {
                // @ts-ignore todo: improve typings
                this.appendChild(this.$$.slotted[key]);
            }
        }
        attributeChangedCallback(attr$$1, oldValue, newValue) {
            this[attr$$1] = newValue;
        }
        $destroy() {
            destroy(this, true);
            this.$destroy = noop;
        }
        $on(type, callback) {
            // TODO should this delegate to addEventListener?
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    };
}
class SvelteComponent {
    $destroy() {
        destroy(this, true);
        this.$destroy = noop;
    }
    $on(type, callback) {
        const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
        callbacks.push(callback);
        return () => {
            const index = callbacks.indexOf(callback);
            if (index !== -1)
                callbacks.splice(index, 1);
        };
    }
    $set() {
        // overridden by instance, if it has props
    }
}
class SvelteComponentDev extends SvelteComponent {
    constructor(options) {
        if (!options || (!options.target && !options.$$inline)) {
            throw new Error(`'target' is a required option`);
        }
        super();
    }
    $destroy() {
        super.$destroy();
        this.$destroy = () => {
            console.warn(`Component was already destroyed`); // eslint-disable-line no-console
        };
    }
}




/***/ }),

/***/ "./node_modules/svelte/store.mjs":
/*!***************************************!*\
  !*** ./node_modules/svelte/store.mjs ***!
  \***************************************/
/*! exports provided: readable, writable, derived, get */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "readable", function() { return readable; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "writable", function() { return writable; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "derived", function() { return derived; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "get", function() { return get; });
/* harmony import */ var _internal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./internal */ "./node_modules/svelte/internal.mjs");


/**
 * Creates a `Readable` store that allows reading by subscription.
 * @param value initial value
 * @param {StartStopNotifier}start start and stop notifications for subscriptions
 */
function readable(value, start) {
    return {
        subscribe: writable(value, start).subscribe,
    };
}
/**
 * Create a `Writable` store that allows both updating and reading by subscription.
 * @param {*=}value initial value
 * @param {StartStopNotifier=}start start and stop notifications for subscriptions
 */
function writable(value, start = _internal__WEBPACK_IMPORTED_MODULE_0__["noop"]) {
    let stop;
    const subscribers = [];
    function set(new_value) {
        if (Object(_internal__WEBPACK_IMPORTED_MODULE_0__["safe_not_equal"])(value, new_value)) {
            value = new_value;
            if (!stop) {
                return; // not ready
            }
            subscribers.forEach((s) => s[1]());
            subscribers.forEach((s) => s[0](value));
        }
    }
    function update(fn) {
        set(fn(value));
    }
    function subscribe(run, invalidate = _internal__WEBPACK_IMPORTED_MODULE_0__["noop"]) {
        const subscriber = [run, invalidate];
        subscribers.push(subscriber);
        if (subscribers.length === 1) {
            stop = start(set) || _internal__WEBPACK_IMPORTED_MODULE_0__["noop"];
        }
        run(value);
        return () => {
            const index = subscribers.indexOf(subscriber);
            if (index !== -1) {
                subscribers.splice(index, 1);
            }
            if (subscribers.length === 0) {
                stop();
            }
        };
    }
    return { set, update, subscribe };
}
/**
 * Derived value store by synchronizing one or more readable stores and
 * applying an aggregation function over its input values.
 * @param {Stores} stores input stores
 * @param {function(Stores=, function(*)=):*}fn function callback that aggregates the values
 * @param {*=}initial_value when used asynchronously
 */
function derived(stores, fn, initial_value) {
    const single = !Array.isArray(stores);
    const stores_array = single
        ? [stores]
        : stores;
    const auto = fn.length < 2;
    return readable(initial_value, (set) => {
        let inited = false;
        const values = [];
        let pending = 0;
        let cleanup = _internal__WEBPACK_IMPORTED_MODULE_0__["noop"];
        const sync = () => {
            if (pending) {
                return;
            }
            cleanup();
            const result = fn(single ? values[0] : values, set);
            if (auto) {
                set(result);
            }
            else {
                cleanup = Object(_internal__WEBPACK_IMPORTED_MODULE_0__["is_function"])(result) ? result : _internal__WEBPACK_IMPORTED_MODULE_0__["noop"];
            }
        };
        const unsubscribers = stores_array.map((store, i) => store.subscribe((value) => {
            values[i] = value;
            pending &= ~(1 << i);
            if (inited) {
                sync();
            }
        }, () => {
            pending |= (1 << i);
        }));
        inited = true;
        sync();
        return function stop() {
            Object(_internal__WEBPACK_IMPORTED_MODULE_0__["run_all"])(unsubscribers);
            cleanup();
        };
    });
}
/**
 * Get the current value from a store by subscribing and immediately unsubscribing.
 * @param store readable
 */
function get(store) {
    let value;
    store.subscribe((_) => value = _)();
    return value;
}




/***/ }),

/***/ "./node_modules/svelte/transition.mjs":
/*!********************************************!*\
  !*** ./node_modules/svelte/transition.mjs ***!
  \********************************************/
/*! exports provided: fade, fly, slide, scale, draw, crossfade */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fade", function() { return fade; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fly", function() { return fly; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "slide", function() { return slide; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "scale", function() { return scale; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "draw", function() { return draw; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "crossfade", function() { return crossfade; });
/* harmony import */ var _easing__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./easing */ "./node_modules/svelte/easing.mjs");
/* harmony import */ var _internal__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./internal */ "./node_modules/svelte/internal.mjs");



/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
}

function fade(node, { delay = 0, duration = 400 }) {
    const o = +getComputedStyle(node).opacity;
    return {
        delay,
        duration,
        css: t => `opacity: ${t * o}`
    };
}
function fly(node, { delay = 0, duration = 400, easing = _easing__WEBPACK_IMPORTED_MODULE_0__["cubicOut"], x = 0, y = 0, opacity = 0 }) {
    const style = getComputedStyle(node);
    const target_opacity = +style.opacity;
    const transform = style.transform === 'none' ? '' : style.transform;
    const od = target_opacity * (1 - opacity);
    return {
        delay,
        duration,
        easing,
        css: (t, u) => `
			transform: ${transform} translate(${(1 - t) * x}px, ${(1 - t) * y}px);
			opacity: ${target_opacity - (od * u)}`
    };
}
function slide(node, { delay = 0, duration = 400, easing = _easing__WEBPACK_IMPORTED_MODULE_0__["cubicOut"] }) {
    const style = getComputedStyle(node);
    const opacity = +style.opacity;
    const height = parseFloat(style.height);
    const padding_top = parseFloat(style.paddingTop);
    const padding_bottom = parseFloat(style.paddingBottom);
    const margin_top = parseFloat(style.marginTop);
    const margin_bottom = parseFloat(style.marginBottom);
    const border_top_width = parseFloat(style.borderTopWidth);
    const border_bottom_width = parseFloat(style.borderBottomWidth);
    return {
        delay,
        duration,
        easing,
        css: t => `overflow: hidden;` +
            `opacity: ${Math.min(t * 20, 1) * opacity};` +
            `height: ${t * height}px;` +
            `padding-top: ${t * padding_top}px;` +
            `padding-bottom: ${t * padding_bottom}px;` +
            `margin-top: ${t * margin_top}px;` +
            `margin-bottom: ${t * margin_bottom}px;` +
            `border-top-width: ${t * border_top_width}px;` +
            `border-bottom-width: ${t * border_bottom_width}px;`
    };
}
function scale(node, { delay = 0, duration = 400, easing = _easing__WEBPACK_IMPORTED_MODULE_0__["cubicOut"], start = 0, opacity = 0 }) {
    const style = getComputedStyle(node);
    const target_opacity = +style.opacity;
    const transform = style.transform === 'none' ? '' : style.transform;
    const sd = 1 - start;
    const od = target_opacity * (1 - opacity);
    return {
        delay,
        duration,
        easing,
        css: (t, u) => `
			transform: ${transform} scale(${1 - (sd * u)});
			opacity: ${target_opacity - (od * u)}
		`
    };
}
function draw(node, { delay = 0, speed, duration, easing = _easing__WEBPACK_IMPORTED_MODULE_0__["cubicInOut"] }) {
    const len = node.getTotalLength();
    if (duration === undefined) {
        if (speed === undefined) {
            duration = 800;
        }
        else {
            duration = len / speed;
        }
    }
    else if (typeof duration === 'function') {
        duration = duration(len);
    }
    return {
        delay,
        duration,
        easing,
        css: (t, u) => `stroke-dasharray: ${t * len} ${u * len}`
    };
}
function crossfade(_a) {
    var { fallback } = _a, defaults = __rest(_a, ["fallback"]);
    const to_receive = new Map();
    const to_send = new Map();
    function crossfade(from, node, params) {
        const { delay = 0, duration = d => Math.sqrt(d) * 30, easing = _easing__WEBPACK_IMPORTED_MODULE_0__["cubicOut"] } = Object(_internal__WEBPACK_IMPORTED_MODULE_1__["assign"])(Object(_internal__WEBPACK_IMPORTED_MODULE_1__["assign"])({}, defaults), params);
        const to = node.getBoundingClientRect();
        const dx = from.left - to.left;
        const dy = from.top - to.top;
        const d = Math.sqrt(dx * dx + dy * dy);
        const style = getComputedStyle(node);
        const transform = style.transform === 'none' ? '' : style.transform;
        const opacity = +style.opacity;
        return {
            delay,
            duration: Object(_internal__WEBPACK_IMPORTED_MODULE_1__["is_function"])(duration) ? duration(d) : duration,
            easing,
            css: (t, u) => `
				opacity: ${t * opacity};
				transform: ${transform} translate(${u * dx}px,${u * dy}px);
			`
        };
    }
    function transition(items, counterparts, intro) {
        return (node, params) => {
            items.set(params.key, {
                rect: node.getBoundingClientRect()
            });
            return () => {
                if (counterparts.has(params.key)) {
                    const { rect } = counterparts.get(params.key);
                    counterparts.delete(params.key);
                    return crossfade(rect, node, params);
                }
                // if the node is disappearing altogether
                // (i.e. wasn't claimed by the other list)
                // then we need to supply an outro
                items.delete(params.key);
                return fallback && fallback(node, params, intro);
            };
        };
    }
    return [
        transition(to_send, to_receive, false),
        transition(to_receive, to_send, true)
    ];
}




/***/ }),

/***/ "./node_modules/timeago-simple/index.js":
/*!**********************************************!*\
  !*** ./node_modules/timeago-simple/index.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

var timeago = function(){};

timeago.prototype.simple = function(date_time) {
    // today date and time in milliseconds 
    var today = Date.now();
    var dateParse = Date.parse(date_time);
    
    //We will perform some test - if there is error, we will throw error to console and exit, no change will be on the data.
    try {
        // We need to check if we able to parse the Date (if the result is NaN, this is an issue)
        if(dateParse !== dateParse) throw "timeago-simple: Please check date and time format! Unable to parse the date & time: " + date_time;
    }
    catch(err) {
        console.error(err);
        return (date_time);
    }
    
    if((dateParse - today) < 0) {
		return pastCalc(date_time);
	} else {
		return futureCalc(date_time);
	}
};


// General help functions for time calculations
function pastCalc(timeData){

    // today date and time in milliseconds 
    var today = Date.now();
        
    // parsing post date and time into milliseconds format
    timeData = Date.parse(timeData);

    var seconds = (today - timeData) / 1000;
    var minutes = (seconds / 60);
    var hours = (seconds / 3600);
    if(seconds < 60 && minutes < 1) {
        return (seconds === 1 ? Math.round(seconds) + " second ago" : Math.round(seconds) + " seconds ago");
    }
    if(minutes < 60 && hours < 1) {
        return (minutes === 1 ? Math.round(minutes) + " minute ago" : Math.round(minutes) + " minutes ago");
    }
    if(hours > 24){
        var days = hours / 24;
        if (days > 30) {
            var month = days / 30;
            if (month > 12) {
                var years = month / 12;
                if (years > 0) {
                    return (years === 1 ? Math.ceil(years) + " year ago" : Math.ceil(years) + " years ago");
                }
            }
            return (Math.round(month) + " month ago");
        }
        return (days === 1 ? Math.round(days) + " day ago" : Math.round(days) + " days ago");
    } else {
        return (hours === 1 ? Math.round(hours) + " hour ago" : Math.round(hours) + " hours ago");
    }
        
}

function futureCalc(timeData){

    // today date and time in milliseconds 
    var today = Date.now();
     
    // parsing post date and time into milliseconds format
    timeData = Date.parse(timeData);
    var seconds = (timeData - today) / 1000;
    var minutes = (seconds / 60);
    var hours = (seconds / 3600);
    if(seconds < 60 && minutes < 1) {
        return (seconds === 1 ? "in " + Math.round(seconds) + " second" : "in " + Math.round(seconds) + " seconds");
    }
    if(minutes < 60 && hours < 1) {
        return (minutes === 1 ? "in " + Math.round(minutes) + " minute" : "in " + Math.round(minutes) + " minutes");
    }
    if(hours > 24){
        var days = hours / 24;
        if (days > 30) {
            var month = days / 30;
            if (month > 12) {
                var years = month / 12;
                if (years > 0) {
                    return (years === 1 ? "in " + Math.ceil(years) + " year" : "in " + Math.ceil(years) + " years"); 
                }
            }
           return ("in " + Math.round(month) + " month"); 
        }
        return (days === 1 ? "in " + Math.round(days) + " day" : "in " + Math.round(days) + " days");
    } else {
        return (hours === 1 ? "in " + Math.round(hours) + " hour" : "in " + Math.round(hours) + " hours");
    }
}

// Future calculation
timeago.prototype.future = function(timeData) {
    console.warn("timeago-simple: .future function is depricated! Please use .simple for both past and future dates.");
    // today date and time in milliseconds 
    var today = Date.now();

    //We will perform some test - if there is error, we will throw error to console and exit, no change will be on the data.
    try {
        // We need to check if we able to parse the Date (if the result is NaN, this is an issue)
        if(Date.parse(timeData) !== Date.parse(timeData)) throw "timeago-simple: Please check date and time format! Unable to parse the date & time: " + timeData;
        // Need to check if it's really future date to parse
        if((Date.parse(timeData) - today) < 0) throw "timeago-simple: Looks like it's more relevant case for timeago.simple"; 
    }
    catch(err) {
        console.error(err);
        return (timeData);
    }
  
    // parsing post date and time into milliseconds format
    timeData = Date.parse(timeData);
    var seconds = (timeData - today) / 1000;
    var minutes = (seconds / 60);
    var hours = (seconds / 3600);
    /* istanbul ignore if */
    if(seconds < 60 && minutes < 1) {
        return (seconds === 1 ? "in " + Math.round(seconds) + " second" : "in " + Math.round(seconds) + " seconds");
    }
    /* istanbul ignore if */
    if(minutes < 60 && hours < 1) {
    	return (minutes === 1 ? "in " + Math.round(minutes) + " minute" : "in " + Math.round(minutes) + " minutes");
    }
    /* istanbul ignore if */
    if(hours > 24){
        var days = hours / 24;
        if (days > 30) {
            var month = days / 30;
            if (month > 12) {
                var years = month / 12;
                if (years > 0) {
                    return (years === 1 ? "in " + Math.ceil(years) + " year" : "in " + Math.ceil(years) + " years");
                }
            }
	        return ("in " + Math.round(month) + " month");
        }
        return (days === 1 ? "in " + Math.round(days) + " day" : "in " + Math.round(days) + " days");
    }
    return (hours === 1 ? "in " + Math.round(hours) + " hour" : "in " + Math.round(hours) + " hours");
};


module.exports = new timeago();

/***/ }),

/***/ "./src/ui/Navigation.svelte":
/*!**********************************!*\
  !*** ./src/ui/Navigation.svelte ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var svelte_internal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! svelte/internal */ "./node_modules/svelte/internal.mjs");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils.js */ "./src/ui/utils.js");
/* harmony import */ var C_Users_andre_prog_ssbc_patchfox_src_ui_Navigation_svelte_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./src/ui/Navigation.svelte.css */ "./src/ui/Navigation.svelte.css");
/* harmony import */ var C_Users_andre_prog_ssbc_patchfox_src_ui_Navigation_svelte_css__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(C_Users_andre_prog_ssbc_patchfox_src_ui_Navigation_svelte_css__WEBPACK_IMPORTED_MODULE_2__);
/* src\ui\Navigation.svelte generated by Svelte v3.4.4 */



function create_fragment(ctx) {
	var header, section0, a0, t0, a1, figure0, img0, t1, i1, i1_class_value, t2, a2, t4, a3, t6, a4, t8, a5, t10, a6, t12, a7, t14, section1, div0, input, t15, button0, t17, section2, button1, t18, a8, figure1, img1, t19, i3, i3_class_value, t20, div1, a9, t22, ul, li0, a10, t24, li1, a11, t26, li2, a12, t28, li3, a13, t30, li4, a14, t32, li5, t34, li6, a16, t36, div2, dispose;

	return {
		c() {
			header = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("header");
			section0 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("section");
			a0 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("a");
			a0.innerHTML = `<i class="icon icon-minus text-black"></i>`;
			t0 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			a1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("a");
			figure0 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("figure");
			img0 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("img");
			t1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			i1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("i");
			t2 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			a2 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("a");
			a2.textContent = "Compose";
			t4 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			a3 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("a");
			a3.textContent = "Public";
			t6 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			a4 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("a");
			a4.textContent = "Mentions";
			t8 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			a5 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("a");
			a5.textContent = "Channels";
			t10 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			a6 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("a");
			a6.textContent = "Settings";
			t12 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			a7 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("a");
			a7.textContent = "Help";
			t14 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			section1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("section");
			div0 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");
			input = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("input");
			t15 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			button0 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("button");
			button0.textContent = "Go";
			t17 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			section2 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("section");
			button1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("button");
			button1.innerHTML = `<i class="icon icon-back"></i>`;
			t18 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			a8 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("a");
			figure1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("figure");
			img1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("img");
			t19 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			i3 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("i");
			t20 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			div1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");
			a9 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("a");
			a9.innerHTML = `
			        Menu
			        <i class="icon icon-caret"></i>`;
			t22 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			ul = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("ul");
			li0 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("li");
			a10 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("a");
			a10.textContent = "Compose";
			t24 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			li1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("li");
			a11 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("a");
			a11.textContent = "Public";
			t26 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			li2 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("li");
			a12 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("a");
			a12.textContent = "Channels";
			t28 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			li3 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("li");
			a13 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("a");
			a13.textContent = "Mentions";
			t30 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			li4 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("li");
			a14 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("a");
			a14.textContent = "Settings";
			t32 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			li5 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("li");
			li5.innerHTML = `<a href="/docs/index.html" class="btn btn-link">Help</a>`;
			t34 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			li6 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("li");
			a16 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("a");
			a16.textContent = "Open as a Tab";
			t36 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			div2 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");
			a0.href = "#/sidebar";
			a0.className = "btn btn-link";
			img0.src = ctx.avatar;
			img0.alt = "L";
			i1.className = i1_class_value = "avatar-presence " + (ctx.$connected ? 'online' : 'offline') + " svelte-14egiim";
			figure0.className = "avatar avatar-lg";
			a1.href = "#";
			a1.className = "navbar-brand mr-2 p-1";
			a2.href = "#/compose";
			a2.className = "btn btn-link";
			a3.href = "#/public";
			a3.className = "btn btn-link";
			a4.href = "#/mentions";
			a4.className = "btn btn-link";
			a5.href = "#/channels";
			a5.className = "btn btn-link";
			a6.href = "#/settings";
			a6.className = "btn btn-link";
			a7.href = "/docs/index.html";
			a7.className = "btn btn-link";
			section0.className = "navbar-section hide-sm";
			input.className = "form-input";
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["attr"])(input, "type", "text");
			input.placeholder = "search";
			button0.className = "btn btn-primary input-group-btn";
			div0.className = "input-group input-inline";
			section1.className = "navbar-section hide-sm";
			button1.className = "btn btn-link";
			img1.src = ctx.avatar;
			img1.alt = "L";
			i3.className = i3_class_value = "avatar-presence " + (ctx.$connected ? 'online' : 'offline') + " svelte-14egiim";
			figure1.className = "avatar";
			a8.href = "...";
			a8.className = "navbar-brand mr-2 p-1";
			a9.href = "?";
			a9.className = "btn btn-link dropdown-toggle";
			a9.tabIndex = "0";
			a10.href = "#/compose";
			a10.className = "btn btn-link";
			li0.className = "menu-item";
			a11.href = "#/public";
			a11.className = "btn btn-link";
			li1.className = "menu-item";
			a12.href = "#/channels";
			a12.className = "btn btn-link";
			li2.className = "menu-item";
			a13.href = "#/mentions";
			a13.className = "btn btn-link";
			li3.className = "menu-item";
			a14.href = "#/settings";
			a14.className = "btn btn-link";
			li4.className = "menu-item";
			li5.className = "menu-item";
			a16.href = "#/sidebar";
			a16.className = "btn btn-link";
			li6.className = "menu-item";
			ul.className = "menu";
			div1.className = "dropdown float-right";
			section2.className = "navbar-section show-sm bg-gray above svelte-14egiim";
			div2.className = "blocker show-sm svelte-14egiim";
			header.className = "navbar";

			dispose = [
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(a0, "click", ctx.openSidebar),
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(a1, "click", ctx.openMyProfile),
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(a2, "click", Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["stop_propagation"])(Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["prevent_default"])(ctx.goCompose))),
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(a3, "click", Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["stop_propagation"])(Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["prevent_default"])(ctx.goPublic))),
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(a4, "click", Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["stop_propagation"])(Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["prevent_default"])(ctx.goMentions))),
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(a5, "click", Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["stop_propagation"])(Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["prevent_default"])(ctx.goChannels))),
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(a6, "click", ctx.goSettings),
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(input, "input", ctx.input_input_handler),
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(button0, "click", ctx.goSearch),
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(button1, "click", ctx.click_handler),
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(a9, "click", Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["stop_propagation"])(Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["prevent_default"])(click_handler_1))),
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(a10, "click", Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["stop_propagation"])(Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["prevent_default"])(ctx.goCompose))),
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(a11, "click", Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["stop_propagation"])(Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["prevent_default"])(ctx.goPublic))),
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(a12, "click", Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["stop_propagation"])(Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["prevent_default"])(ctx.goChannels))),
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(a13, "click", Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["stop_propagation"])(Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["prevent_default"])(ctx.goMentions))),
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(a14, "click", ctx.goSettings),
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(a16, "click", ctx.closeSidebar)
			];
		},

		m(target, anchor) {
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, header, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(header, section0);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(section0, a0);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(section0, t0);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(section0, a1);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(a1, figure0);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(figure0, img0);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(figure0, t1);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(figure0, i1);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(section0, t2);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(section0, a2);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(section0, t4);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(section0, a3);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(section0, t6);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(section0, a4);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(section0, t8);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(section0, a5);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(section0, t10);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(section0, a6);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(section0, t12);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(section0, a7);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(header, t14);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(header, section1);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(section1, div0);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div0, input);

			input.value = ctx.query;

			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div0, t15);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div0, button0);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(header, t17);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(header, section2);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(section2, button1);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(section2, t18);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(section2, a8);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(a8, figure1);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(figure1, img1);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(figure1, t19);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(figure1, i3);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(section2, t20);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(section2, div1);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div1, a9);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div1, t22);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div1, ul);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(ul, li0);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(li0, a10);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(ul, t24);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(ul, li1);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(li1, a11);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(ul, t26);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(ul, li2);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(li2, a12);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(ul, t28);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(ul, li3);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(li3, a13);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(ul, t30);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(ul, li4);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(li4, a14);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(ul, t32);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(ul, li5);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(ul, t34);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(ul, li6);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(li6, a16);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(header, t36);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(header, div2);
		},

		p(changed, ctx) {
			if (changed.avatar) {
				img0.src = ctx.avatar;
			}

			if ((changed.$connected) && i1_class_value !== (i1_class_value = "avatar-presence " + (ctx.$connected ? 'online' : 'offline') + " svelte-14egiim")) {
				i1.className = i1_class_value;
			}

			if (changed.query && (input.value !== ctx.query)) input.value = ctx.query;

			if (changed.avatar) {
				img1.src = ctx.avatar;
			}

			if ((changed.$connected) && i3_class_value !== (i3_class_value = "avatar-presence " + (ctx.$connected ? 'online' : 'offline') + " svelte-14egiim")) {
				i3.className = i3_class_value;
			}
		},

		i: svelte_internal__WEBPACK_IMPORTED_MODULE_0__["noop"],
		o: svelte_internal__WEBPACK_IMPORTED_MODULE_0__["noop"],

		d(detaching) {
			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(header);
			}

			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["run_all"])(dispose);
		}
	};
}

function click_handler_1() {
	return '';
}

function instance($$self, $$props, $$invalidate) {
	let $connected;

	Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["subscribe"])($$self, _utils_js__WEBPACK_IMPORTED_MODULE_1__["connected"], $$value => { $connected = $$value; $$invalidate('$connected', $connected); });

	let avatar = "/images/icon.png";

  let query =""

  const goSettings = ev => Object(_utils_js__WEBPACK_IMPORTED_MODULE_1__["navigate"])("/settings");
  const goCompose = () => Object(_utils_js__WEBPACK_IMPORTED_MODULE_1__["navigate"])("/compose");
  const goPublic = () => Object(_utils_js__WEBPACK_IMPORTED_MODULE_1__["navigate"])("/public");
  const goChannels = () => Object(_utils_js__WEBPACK_IMPORTED_MODULE_1__["navigate"])("/channels");
  const goMentions = () => Object(_utils_js__WEBPACK_IMPORTED_MODULE_1__["navigate"])("/mentions");

  const goSearch = () => {
    Object(_utils_js__WEBPACK_IMPORTED_MODULE_1__["navigate"])("/intercept", {query})
    Object(_utils_js__WEBPACK_IMPORTED_MODULE_1__["intercept"])()
  }

  const openSidebar = async ev => {
    let loc = window.location.href;
    browser.sidebarAction.setPanel({ panel: loc });
    browser.sidebarAction.open();
  };

  const closeSidebar = async ev => {
    let loc = await browser.sidebarAction.getPanel({});
    await browser.tabs.create({ url: loc });
    await browser.sidebarAction.close();
  };

  const openMyProfile = ev => {
    ev.stopPropagation();
    ev.preventDefault();

    if (ssb.feed) {
      Object(_utils_js__WEBPACK_IMPORTED_MODULE_1__["navigate"])("/profile", { feed: ssb.feed });
    }
  };

	function input_input_handler() {
		query = this.value;
		$$invalidate('query', query);
	}

	function click_handler() {
		return history.back();
	}

	$$self.$$.update = ($$dirty = { $connected: 1 }) => {
		if ($$dirty.$connected) { if ($connected) {
        ssb.avatar(ssb.feed).then(data => {
          $$invalidate('avatar', avatar = `http://localhost:8989/blobs/get/${data.image}`);
        });
      } }
	};

	return {
		avatar,
		query,
		goSettings,
		goCompose,
		goPublic,
		goChannels,
		goMentions,
		goSearch,
		openSidebar,
		closeSidebar,
		openMyProfile,
		$connected,
		input_input_handler,
		click_handler
	};
}

class Navigation extends svelte_internal__WEBPACK_IMPORTED_MODULE_0__["SvelteComponent"] {
	constructor(options) {
		super();
		Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["init"])(this, options, instance, create_fragment, svelte_internal__WEBPACK_IMPORTED_MODULE_0__["safe_not_equal"], []);
	}
}


if (false) {}

/* harmony default export */ __webpack_exports__["default"] = (Navigation);




/***/ }),

/***/ "./src/ui/Navigation.svelte.css":
/*!**************************************!*\
  !*** ./src/ui/Navigation.svelte.css ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../node_modules/css-loader/dist/cjs.js!./Navigation.svelte.css */ "./node_modules/css-loader/dist/cjs.js!./src/ui/Navigation.svelte.css");

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(/*! ../../node_modules/style-loader/lib/addStyles.js */ "./node_modules/style-loader/lib/addStyles.js")(content, options);

if(content.locals) module.exports = content.locals;

if(false) {}

/***/ }),

/***/ "./src/ui/Patchfox.svelte":
/*!********************************!*\
  !*** ./src/ui/Patchfox.svelte ***!
  \********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var svelte_internal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! svelte/internal */ "./node_modules/svelte/internal.mjs");
/* harmony import */ var svelte__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! svelte */ "./node_modules/svelte/index.mjs");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils.js */ "./src/ui/utils.js");
/* harmony import */ var _Navigation_svelte__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Navigation.svelte */ "./src/ui/Navigation.svelte");
/* harmony import */ var C_Users_andre_prog_ssbc_patchfox_src_ui_Patchfox_svelte_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./src/ui/Patchfox.svelte.css */ "./src/ui/Patchfox.svelte.css");
/* harmony import */ var C_Users_andre_prog_ssbc_patchfox_src_ui_Patchfox_svelte_css__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(C_Users_andre_prog_ssbc_patchfox_src_ui_Patchfox_svelte_css__WEBPACK_IMPORTED_MODULE_4__);
/* src\ui\Patchfox.svelte generated by Svelte v3.4.4 */





function create_fragment(ctx) {
	var div2, div1, div0, t, current, dispose;

	var navigation = new _Navigation_svelte__WEBPACK_IMPORTED_MODULE_3__["default"]({});

	var switch_value = ctx.$currentView;

	function switch_props(ctx) {
		return {};
	}

	if (switch_value) {
		var switch_instance = new switch_value(switch_props(ctx));
	}

	return {
		c() {
			div2 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");
			div1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");
			div0 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");
			navigation.$$.fragment.c();
			t = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			if (switch_instance) switch_instance.$$.fragment.c();
			div0.className = "column svelte-1mwu09k";
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["toggle_class"])(div0, "reduced-line-length", ctx.useShortColumn);
			div1.className = "columns";
			div2.className = "container bg-gray";

			dispose = [
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(window, "popstate", ctx.popState),
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(window, "error", ctx.handleUncaughtException),
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(window, "hashchange", ctx.hashChange)
			];
		},

		m(target, anchor) {
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, div2, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div2, div1);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div1, div0);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["mount_component"])(navigation, div0, null);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div0, t);

			if (switch_instance) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["mount_component"])(switch_instance, div0, null);
			}

			current = true;
		},

		p(changed, ctx) {
			if (switch_value !== (switch_value = ctx.$currentView)) {
				if (switch_instance) {
					Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["group_outros"])();
					const old_component = switch_instance;
					Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["on_outro"])(() => {
						old_component.$destroy();
					});
					old_component.$$.fragment.o(1);
					Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["check_outros"])();
				}

				if (switch_value) {
					switch_instance = new switch_value(switch_props(ctx));

					switch_instance.$$.fragment.c();
					switch_instance.$$.fragment.i(1);
					Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["mount_component"])(switch_instance, div0, null);
				} else {
					switch_instance = null;
				}
			}

			if (changed.useShortColumn) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["toggle_class"])(div0, "reduced-line-length", ctx.useShortColumn);
			}
		},

		i(local) {
			if (current) return;
			navigation.$$.fragment.i(local);

			if (switch_instance) switch_instance.$$.fragment.i(local);

			current = true;
		},

		o(local) {
			navigation.$$.fragment.o(local);
			if (switch_instance) switch_instance.$$.fragment.o(local);
			current = false;
		},

		d(detaching) {
			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(div2);
			}

			navigation.$destroy();

			if (switch_instance) switch_instance.$destroy();
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["run_all"])(dispose);
		}
	};
}

function instance($$self, $$props, $$invalidate) {
	let $routeLocation, $currentView;

	Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["subscribe"])($$self, _utils_js__WEBPACK_IMPORTED_MODULE_2__["routeLocation"], $$value => { $routeLocation = $$value; $$invalidate('$routeLocation', $routeLocation); });
	Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["subscribe"])($$self, _utils_js__WEBPACK_IMPORTED_MODULE_2__["currentView"], $$value => { $currentView = $$value; $$invalidate('$currentView', $currentView); });

	

  let useShortColumn = Object(_utils_js__WEBPACK_IMPORTED_MODULE_2__["getPref"])("columnSize", "short") == "short";
  console.log("columnSize", useShortColumn)

  Object(svelte__WEBPACK_IMPORTED_MODULE_1__["onMount"])(async () => {
    try {
      await Object(_utils_js__WEBPACK_IMPORTED_MODULE_2__["connect"])();

      Object(_utils_js__WEBPACK_IMPORTED_MODULE_2__["keepPinging"])();
    } catch (n) {
      console.error("connect error", n);
      switch (n) {
        case "Can't connect to sbot":
          // need to be able to go to settings even though no connection is
          // established.
          if ($routeLocation !== "/settings") {
            window.location = "/docs/index.html#/troubleshooting/no-connection";
          }
          break;
        default:
          Object(_utils_js__WEBPACK_IMPORTED_MODULE_2__["navigate"])("/error", { error: n });
          break;
      }
    }
  });

  const popState = event => {
    if (event.state !== null) {
      console.dir("pop", event.state);
      let { location, data } = event.state;
      _utils_js__WEBPACK_IMPORTED_MODULE_2__["route"].set({ location, data });
    }
  };

  const handleUncaughtException = event => {
    console.error("Uncaught exception", event);
    Object(_utils_js__WEBPACK_IMPORTED_MODULE_2__["navigate"])("/error", { error: event.message });
  };

  const hashChange = event => {
    console.dir("hash change", event);
  };

	return {
		useShortColumn,
		popState,
		handleUncaughtException,
		hashChange,
		$currentView
	};
}

class Patchfox extends svelte_internal__WEBPACK_IMPORTED_MODULE_0__["SvelteComponent"] {
	constructor(options) {
		super();
		Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["init"])(this, options, instance, create_fragment, svelte_internal__WEBPACK_IMPORTED_MODULE_0__["safe_not_equal"], []);
	}
}


if (false) {}

/* harmony default export */ __webpack_exports__["default"] = (Patchfox);




/***/ }),

/***/ "./src/ui/Patchfox.svelte.css":
/*!************************************!*\
  !*** ./src/ui/Patchfox.svelte.css ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../node_modules/css-loader/dist/cjs.js!./Patchfox.svelte.css */ "./node_modules/css-loader/dist/cjs.js!./src/ui/Patchfox.svelte.css");

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(/*! ../../node_modules/style-loader/lib/addStyles.js */ "./node_modules/style-loader/lib/addStyles.js")(content, options);

if(content.locals) module.exports = content.locals;

if(false) {}

/***/ }),

/***/ "./src/ui/abusePrevention.js":
/*!***********************************!*\
  !*** ./src/ui/abusePrevention.js ***!
  \***********************************/
/*! exports provided: getFilters, addFilter, deleteFilter, isMessageBlured, isMessageHidden, isMessageFiltered */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getFilters", function() { return getFilters; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "addFilter", function() { return addFilter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "deleteFilter", function() { return deleteFilter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isMessageBlured", function() { return isMessageBlured; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isMessageHidden", function() { return isMessageHidden; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isMessageFiltered", function() { return isMessageFiltered; });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils.js */ "./src/ui/utils.js");


const getFilters = () => Object(_utils_js__WEBPACK_IMPORTED_MODULE_0__["getPref"])("filters", [])

const addFilter = (filter) => {
    let currentFilters = getFilters()

    currentFilters.push(filter)

    Object(_utils_js__WEBPACK_IMPORTED_MODULE_0__["setPref"])("filters", currentFilters)
}

const deleteFilter = (filter) => {
    let currentFilters = getFilters()

    Object(_utils_js__WEBPACK_IMPORTED_MODULE_0__["setPref"])("filters", currentFilters.filter(f => f !== filter))
}

const isMessageBlured = (msg) => {
    let currentFilters = getFilters().filter(f => f.action == "blur")
    if (currentFilters.length > 0) {
        let res = currentFilters.map((f) => isMessageFiltered(msg, f, "blur"))
        return !res.some(r => r)
    } else {
        return false
    }
}


const isMessageHidden = (msg) => {
    let currentFilters = getFilters().filter(f => f.action == "hide")
    if (currentFilters.length > 0) {
        let res = currentFilters.map((f) => isMessageFiltered(msg, f, "hide"))
        return res.some(r => r)
    } else {
        return true // true because it is used by a pull.filter()
    }
}

const isMessageFiltered = (msg, filter, action) => {
    let filterResults = []
    if (filter.action !== action) {
        return true
    }

    if (filter.expires) {
        let expirationDate = new Date(filter.expires)
        let today = new Date()

        if (today > expirationDate) {
            return true
        }
    }

    if (filter.feed) {
        if (filter.feed == msg.value.author) {
            console.log("filtered due to feed")
            filterResults.push(true)
        } else {
            filterResults.push(false)
        }
    }

    if (filter.channel) {
        console.log("filtered due to channel")
        if (msg.value.content.channel && filter.channel == msg.value.content.channel) {
            filterResults.push(true)
        } else {
            filterResults.push(false)
        }
    }

    if (filter.keywords.length > 0 && msg.value.content.type == "post" && msg.value.content.text) {
        let keywords = filter.keywords
        let content = msg.value.content.text.toLowerCase()

        let res = keywords.map(k => content.includes(k.toLowerCase())).some(r => r)
        if (res) console.log("filtered due to keywords")
        filterResults.push(res)
    }

    console.log("res", !filterResults.some(n => n == true))
    return !filterResults.some(n => n == true)
}

/***/ }),

/***/ "./src/ui/main.js":
/*!************************!*\
  !*** ./src/ui/main.js ***!
  \************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Patchfox_svelte__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Patchfox.svelte */ "./src/ui/Patchfox.svelte");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils.js */ "./src/ui/utils.js");




const main = async () => {
    window.ssb = false;

    Object(_utils_js__WEBPACK_IMPORTED_MODULE_1__["intercept"])()
    
    try {
        await Object(_utils_js__WEBPACK_IMPORTED_MODULE_1__["loadConfiguration"])()

    } catch (n) {
        console.error("initialization error", n)
        switch (n) {
            case "Configuration is missing":
                Object(_utils_js__WEBPACK_IMPORTED_MODULE_1__["navigate"])("/settings")
                break
            default:
                Object(_utils_js__WEBPACK_IMPORTED_MODULE_1__["navigate"])("/error", { error: n })
                break
        }

    }

    const patchfox = new _Patchfox_svelte__WEBPACK_IMPORTED_MODULE_0__["default"]({
        target: document.body
    });

}

main()

/***/ }),

/***/ "./src/ui/messageTypes/AboutMsg.svelte":
/*!*********************************************!*\
  !*** ./src/ui/messageTypes/AboutMsg.svelte ***!
  \*********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var svelte_internal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! svelte/internal */ "./node_modules/svelte/internal.mjs");
/* src\ui\messageTypes\AboutMsg.svelte generated by Svelte v3.4.4 */


// (52:2) {:else}
function create_else_block_1(ctx) {
	var div, t0, t1;

	return {
		c() {
			div = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");
			t0 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])(ctx.person);
			t1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])(" is doing something related to a gathering but gatherings are not\r\n      supported yet, sorry.");
			div.className = "toast";
		},

		m(target, anchor) {
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, div, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div, t0);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div, t1);
		},

		p(changed, ctx) {
			if (changed.person) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["set_data"])(t0, ctx.person);
			}
		},

		d(detaching) {
			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(div);
			}
		}
	};
}

// (35:2) {#if isThisAboutFeeds}
function create_if_block(ctx) {
	var t0, t1, t2, t3, a, a_href_value, t4, if_block1_anchor;

	function select_block_type_1(ctx) {
		if (ctx.image) return create_if_block_2;
		return create_else_block;
	}

	var current_block_type = select_block_type_1(ctx);
	var if_block0 = current_block_type(ctx);

	var if_block1 = (ctx.msg.value.content.description) && create_if_block_1(ctx);

	return {
		c() {
			t0 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])(ctx.person);
			t1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			t2 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])(ctx.verb);
			t3 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			a = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("a");
			if_block0.c();
			t4 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			if (if_block1) if_block1.c();
			if_block1_anchor = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["empty"])();
			a.href = a_href_value = "?feed=" + ctx.otherLink + "#/profile";
		},

		m(target, anchor) {
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, t0, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, t1, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, t2, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, t3, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, a, anchor);
			if_block0.m(a, null);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, t4, anchor);
			if (if_block1) if_block1.m(target, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, if_block1_anchor, anchor);
		},

		p(changed, ctx) {
			if (changed.person) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["set_data"])(t0, ctx.person);
			}

			if (changed.verb) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["set_data"])(t2, ctx.verb);
			}

			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block0) {
				if_block0.p(changed, ctx);
			} else {
				if_block0.d(1);
				if_block0 = current_block_type(ctx);
				if (if_block0) {
					if_block0.c();
					if_block0.m(a, null);
				}
			}

			if (ctx.msg.value.content.description) {
				if (if_block1) {
					if_block1.p(changed, ctx);
				} else {
					if_block1 = create_if_block_1(ctx);
					if_block1.c();
					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
				}
			} else if (if_block1) {
				if_block1.d(1);
				if_block1 = null;
			}
		},

		d(detaching) {
			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(t0);
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(t1);
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(t2);
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(t3);
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(a);
			}

			if_block0.d();

			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(t4);
			}

			if (if_block1) if_block1.d(detaching);

			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(if_block1_anchor);
			}
		}
	};
}

// (43:6) {:else}
function create_else_block(ctx) {
	var span, t;

	return {
		c() {
			span = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("span");
			t = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])(ctx.otherName);
			span.className = "chip";
		},

		m(target, anchor) {
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, span, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(span, t);
		},

		p(changed, ctx) {
			if (changed.otherName) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["set_data"])(t, ctx.otherName);
			}
		},

		d(detaching) {
			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(span);
			}
		}
	};
}

// (38:6) {#if image}
function create_if_block_2(ctx) {
	var div, img, t0, t1;

	return {
		c() {
			div = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");
			img = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("img");
			t0 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			t1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])(ctx.otherName);
			img.src = ctx.image;
			img.className = "avatar avatar-sm";
			img.alt = ctx.otherName;
			div.className = "chip";
		},

		m(target, anchor) {
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, div, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div, img);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div, t0);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div, t1);
		},

		p(changed, ctx) {
			if (changed.otherName) {
				img.alt = ctx.otherName;
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["set_data"])(t1, ctx.otherName);
			}
		},

		d(detaching) {
			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(div);
			}
		}
	};
}

// (47:4) {#if msg.value.content.description}
function create_if_block_1(ctx) {
	var blockquote, raw_value = ctx.ssb.markdown(ctx.msg.value.content.description);

	return {
		c() {
			blockquote = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("blockquote");
		},

		m(target, anchor) {
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, blockquote, anchor);
			blockquote.innerHTML = raw_value;
		},

		p(changed, ctx) {
			if ((changed.msg) && raw_value !== (raw_value = ctx.ssb.markdown(ctx.msg.value.content.description))) {
				blockquote.innerHTML = raw_value;
			}
		},

		d(detaching) {
			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(blockquote);
			}
		}
	};
}

function create_fragment(ctx) {
	var div;

	function select_block_type(ctx) {
		if (ctx.isThisAboutFeeds) return create_if_block;
		return create_else_block_1;
	}

	var current_block_type = select_block_type(ctx);
	var if_block = current_block_type(ctx);

	return {
		c() {
			div = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");
			if_block.c();
			div.className = "card-body";
		},

		m(target, anchor) {
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, div, anchor);
			if_block.m(div, null);
		},

		p(changed, ctx) {
			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
				if_block.p(changed, ctx);
			} else {
				if_block.d(1);
				if_block = current_block_type(ctx);
				if (if_block) {
					if_block.c();
					if_block.m(div, null);
				}
			}
		},

		i: svelte_internal__WEBPACK_IMPORTED_MODULE_0__["noop"],
		o: svelte_internal__WEBPACK_IMPORTED_MODULE_0__["noop"],

		d(detaching) {
			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(div);
			}

			if_block.d();
		}
	};
}

function instance($$self, $$props, $$invalidate) {
	let { msg } = $$props;

  let person = msg.value.author;
  let otherLink = encodeURIComponent(msg.value.content.about);
  let otherName = msg.value.content.name || msg.value.content.about;
  let isThisAboutFeeds = true;
  let verb =
    msg.value.content.about === msg.value.author
      ? "self-identifies"
      : "identifies";

  ssb.avatar(msg.value.author).then(data => { const $$result = (person = data.name); $$invalidate('person', person); return $$result; });

  if (otherName === msg.value.content.about) {
    ssb.avatar(msg.value.content.about).then(data => { const $$result = (otherName = data.name); $$invalidate('otherName', otherName); return $$result; });
  }

  let image = msg.value.content.image
    ? `http://localhost:8989/blobs/get/${encodeURIComponent(
        msg.value.content.image
      )}`
    : false;

  if (msg.value.content.description) {
    $$invalidate('verb', verb += " with description");
  }

  if (msg.value.content.about.startsWith("%")) {
    $$invalidate('isThisAboutFeeds', isThisAboutFeeds = false); // this appear to be a gathering
  }

	$$self.$set = $$props => {
		if ('msg' in $$props) $$invalidate('msg', msg = $$props.msg);
	};

	return {
		msg,
		person,
		otherLink,
		otherName,
		isThisAboutFeeds,
		verb,
		image,
		ssb
	};
}

class AboutMsg extends svelte_internal__WEBPACK_IMPORTED_MODULE_0__["SvelteComponent"] {
	constructor(options) {
		super();
		Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["init"])(this, options, instance, create_fragment, svelte_internal__WEBPACK_IMPORTED_MODULE_0__["safe_not_equal"], ["msg"]);
	}
}


if (false) {}

/* harmony default export */ __webpack_exports__["default"] = (AboutMsg);


/***/ }),

/***/ "./src/ui/messageTypes/BlogMsg.svelte":
/*!********************************************!*\
  !*** ./src/ui/messageTypes/BlogMsg.svelte ***!
  \********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var svelte_internal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! svelte/internal */ "./node_modules/svelte/internal.mjs");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils.js */ "./src/ui/utils.js");
/* src\ui\messageTypes\BlogMsg.svelte generated by Svelte v3.4.4 */



// (87:0) {#if thumbnail}
function create_if_block_6(ctx) {
	var div, img, img_src_value;

	return {
		c() {
			div = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");
			img = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("img");
			img.src = img_src_value = "http://localhost:8989/blobs/get/" + encodeURIComponent(ctx.thumbnail);
			img.className = "img-responsive";
			img.alt = ctx.title;
			div.className = "card-image";
		},

		m(target, anchor) {
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, div, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div, img);
		},

		p: svelte_internal__WEBPACK_IMPORTED_MODULE_0__["noop"],

		d(detaching) {
			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(div);
			}
		}
	};
}

// (96:2) {#if title}
function create_if_block_5(ctx) {
	var h1, t;

	return {
		c() {
			h1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("h1");
			t = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])(ctx.title);
			h1.className = "card-title h5";
		},

		m(target, anchor) {
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, h1, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(h1, t);
		},

		p: svelte_internal__WEBPACK_IMPORTED_MODULE_0__["noop"],

		d(detaching) {
			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(h1);
			}
		}
	};
}

// (100:2) {#if toast}
function create_if_block_4(ctx) {
	var div, t0, t1;

	return {
		c() {
			div = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");
			t0 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])("Can't load blogpost: ");
			t1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])(ctx.toastMsg);
			div.className = "toast toast-error";
		},

		m(target, anchor) {
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, div, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div, t0);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div, t1);
		},

		p(changed, ctx) {
			if (changed.toastMsg) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["set_data"])(t1, ctx.toastMsg);
			}
		},

		d(detaching) {
			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(div);
			}
		}
	};
}

// (105:2) {:else}
function create_else_block_1(ctx) {
	var raw_before, raw_after;

	return {
		c() {
			raw_before = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])('noscript');
			raw_after = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])('noscript');
		},

		m(target, anchor) {
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, raw_before, anchor);
			raw_before.insertAdjacentHTML("afterend", ctx.summary);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, raw_after, anchor);
		},

		p: svelte_internal__WEBPACK_IMPORTED_MODULE_0__["noop"],

		d(detaching) {
			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach_between"])(raw_before, raw_after);
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(raw_before);
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(raw_after);
			}
		}
	};
}

// (103:2) {#if showBlogpost}
function create_if_block_3(ctx) {
	var raw_before, raw_after;

	return {
		c() {
			raw_before = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])('noscript');
			raw_after = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])('noscript');
		},

		m(target, anchor) {
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, raw_before, anchor);
			raw_before.insertAdjacentHTML("afterend", ctx.post);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, raw_after, anchor);
		},

		p(changed, ctx) {
			if (changed.post) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach_between"])(raw_before, raw_after);
				raw_before.insertAdjacentHTML("afterend", ctx.post);
			}
		},

		d(detaching) {
			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach_between"])(raw_before, raw_after);
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(raw_before);
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(raw_after);
			}
		}
	};
}

// (117:6) {#if msg.value.content.root}
function create_if_block_2(ctx) {
	var span, a, t, a_href_value, dispose;

	return {
		c() {
			span = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("span");
			a = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("a");
			t = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])("(root)");
			a.href = a_href_value = "?thread=" + encodeURIComponent(ctx.msg.value.content.root) + "#/thread";
			dispose = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(a, "click", Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["prevent_default"])(ctx.goRoot));
		},

		m(target, anchor) {
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, span, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(span, a);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(a, t);
		},

		p(changed, ctx) {
			if ((changed.msg) && a_href_value !== (a_href_value = "?thread=" + encodeURIComponent(ctx.msg.value.content.root) + "#/thread")) {
				a.href = a_href_value;
			}
		},

		d(detaching) {
			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(span);
			}

			dispose();
		}
	};
}

// (126:6) {#if msg.value.content.branch}
function create_if_block_1(ctx) {
	var span, a, t, a_href_value, dispose;

	return {
		c() {
			span = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("span");
			a = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("a");
			t = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])("(in reply to)");
			a.href = a_href_value = "?thread=" + encodeURIComponent(ctx.msg.value.content.branch) + "#/thread";
			dispose = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(a, "click", Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["prevent_default"])(ctx.goBranch));
		},

		m(target, anchor) {
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, span, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(span, a);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(a, t);
		},

		p(changed, ctx) {
			if ((changed.msg) && a_href_value !== (a_href_value = "?thread=" + encodeURIComponent(ctx.msg.value.content.branch) + "#/thread")) {
				a.href = a_href_value;
			}
		},

		d(detaching) {
			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(span);
			}

			dispose();
		}
	};
}

// (145:6) {:else}
function create_else_block(ctx) {
	var button, dispose;

	return {
		c() {
			button = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("button");
			button.textContent = "Close Blogpost";
			button.className = "btn btn-primary";
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["toggle_class"])(button, "locating", ctx.loading);
			dispose = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(button, "click", ctx.click_handler);
		},

		m(target, anchor) {
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, button, anchor);
		},

		p(changed, ctx) {
			if (changed.loading) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["toggle_class"])(button, "locating", ctx.loading);
			}
		},

		d(detaching) {
			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(button);
			}

			dispose();
		}
	};
}

// (138:6) {#if !showBlogpost}
function create_if_block(ctx) {
	var button, dispose;

	return {
		c() {
			button = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("button");
			button.textContent = "Read Blogpost";
			button.className = "btn btn-primary";
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["toggle_class"])(button, "locating", ctx.loading);
			dispose = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(button, "click", ctx.displayBlogPost);
		},

		m(target, anchor) {
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, button, anchor);
		},

		p(changed, ctx) {
			if (changed.loading) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["toggle_class"])(button, "locating", ctx.loading);
			}
		},

		d(detaching) {
			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(button);
			}

			dispose();
		}
	};
}

function create_fragment(ctx) {
	var t0, div0, t1, t2, t3, div4, div3, div1, label, input, t4, i, t5, t6, t7, t8, div2, button, t10, dispose;

	var if_block0 = (ctx.thumbnail) && create_if_block_6(ctx);

	var if_block1 = (ctx.title) && create_if_block_5(ctx);

	var if_block2 = (ctx.toast) && create_if_block_4(ctx);

	function select_block_type(ctx) {
		if (ctx.showBlogpost) return create_if_block_3;
		return create_else_block_1;
	}

	var current_block_type = select_block_type(ctx);
	var if_block3 = current_block_type(ctx);

	var if_block4 = (ctx.msg.value.content.root) && create_if_block_2(ctx);

	var if_block5 = (ctx.msg.value.content.branch) && create_if_block_1(ctx);

	function select_block_type_1(ctx) {
		if (!ctx.showBlogpost) return create_if_block;
		return create_else_block;
	}

	var current_block_type_1 = select_block_type_1(ctx);
	var if_block6 = current_block_type_1(ctx);

	return {
		c() {
			if (if_block0) if_block0.c();
			t0 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			div0 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");
			if (if_block1) if_block1.c();
			t1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			if (if_block2) if_block2.c();
			t2 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			if_block3.c();
			t3 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			div4 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");
			div3 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");
			div1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");
			label = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("label");
			input = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("input");
			t4 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			i = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("i");
			t5 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])("\r\n        Like");
			t6 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			if (if_block4) if_block4.c();
			t7 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			if (if_block5) if_block5.c();
			t8 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			div2 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");
			button = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("button");
			button.textContent = "Reply";
			t10 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			if_block6.c();
			div0.className = "card-body";
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["attr"])(input, "type", "checkbox");
			input.checked = ctx.liked;
			i.className = "form-icon";
			label.className = "form-switch d-inline";
			div1.className = "column col-6";
			button.className = "btn";
			div2.className = "column col-6 text-right";
			div3.className = "columns col-gapless";
			div4.className = "card-footer";

			dispose = [
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(input, "change", ctx.likeChanged),
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(button, "click", ctx.reply)
			];
		},

		m(target, anchor) {
			if (if_block0) if_block0.m(target, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, t0, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, div0, anchor);
			if (if_block1) if_block1.m(div0, null);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div0, t1);
			if (if_block2) if_block2.m(div0, null);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div0, t2);
			if_block3.m(div0, null);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, t3, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, div4, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div4, div3);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div3, div1);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div1, label);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(label, input);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(label, t4);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(label, i);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(label, t5);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div1, t6);
			if (if_block4) if_block4.m(div1, null);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div1, t7);
			if (if_block5) if_block5.m(div1, null);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div3, t8);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div3, div2);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div2, button);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div2, t10);
			if_block6.m(div2, null);
		},

		p(changed, ctx) {
			if (ctx.thumbnail) {
				if (if_block0) {
					if_block0.p(changed, ctx);
				} else {
					if_block0 = create_if_block_6(ctx);
					if_block0.c();
					if_block0.m(t0.parentNode, t0);
				}
			} else if (if_block0) {
				if_block0.d(1);
				if_block0 = null;
			}

			if (ctx.title) {
				if (if_block1) {
					if_block1.p(changed, ctx);
				} else {
					if_block1 = create_if_block_5(ctx);
					if_block1.c();
					if_block1.m(div0, t1);
				}
			} else if (if_block1) {
				if_block1.d(1);
				if_block1 = null;
			}

			if (ctx.toast) {
				if (if_block2) {
					if_block2.p(changed, ctx);
				} else {
					if_block2 = create_if_block_4(ctx);
					if_block2.c();
					if_block2.m(div0, t2);
				}
			} else if (if_block2) {
				if_block2.d(1);
				if_block2 = null;
			}

			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block3) {
				if_block3.p(changed, ctx);
			} else {
				if_block3.d(1);
				if_block3 = current_block_type(ctx);
				if (if_block3) {
					if_block3.c();
					if_block3.m(div0, null);
				}
			}

			if (changed.liked) {
				input.checked = ctx.liked;
			}

			if (ctx.msg.value.content.root) {
				if (if_block4) {
					if_block4.p(changed, ctx);
				} else {
					if_block4 = create_if_block_2(ctx);
					if_block4.c();
					if_block4.m(div1, t7);
				}
			} else if (if_block4) {
				if_block4.d(1);
				if_block4 = null;
			}

			if (ctx.msg.value.content.branch) {
				if (if_block5) {
					if_block5.p(changed, ctx);
				} else {
					if_block5 = create_if_block_1(ctx);
					if_block5.c();
					if_block5.m(div1, null);
				}
			} else if (if_block5) {
				if_block5.d(1);
				if_block5 = null;
			}

			if (current_block_type_1 === (current_block_type_1 = select_block_type_1(ctx)) && if_block6) {
				if_block6.p(changed, ctx);
			} else {
				if_block6.d(1);
				if_block6 = current_block_type_1(ctx);
				if (if_block6) {
					if_block6.c();
					if_block6.m(div2, null);
				}
			}
		},

		i: svelte_internal__WEBPACK_IMPORTED_MODULE_0__["noop"],
		o: svelte_internal__WEBPACK_IMPORTED_MODULE_0__["noop"],

		d(detaching) {
			if (if_block0) if_block0.d(detaching);

			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(t0);
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(div0);
			}

			if (if_block1) if_block1.d();
			if (if_block2) if_block2.d();
			if_block3.d();

			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(t3);
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(div4);
			}

			if (if_block4) if_block4.d();
			if (if_block5) if_block5.d();
			if_block6.d();
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["run_all"])(dispose);
		}
	};
}

function instance($$self, $$props, $$invalidate) {
	let $routeLocation;

	Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["subscribe"])($$self, _utils_js__WEBPACK_IMPORTED_MODULE_1__["routeLocation"], $$value => { $routeLocation = $$value; $$invalidate('$routeLocation', $routeLocation); });

	let { msg } = $$props;

  let content = msg.value.content;

  let summary = ssb.markdown(content.summary);
  let thumbnail = content.thumbnail || false;
  let title = content.title || false;
  let showBlogpost = false;
  let loading = false;
  let toast = false;
  let toastMsg = "";
  let post = summary;

  let liked = false;

  ssb.votes(msg.key).then(ms => {
    ms.forEach(m => {
      let author = m.value.author;
      if ((author === ssb.feed && m.value.content.vote.value === 1)) {
        $$invalidate('liked', liked = true);
      }
    });
  });

  const likeChanged = ev => {
    let v = ev.target.checked;
    if (v) {
      ssb
        .like(msg.key)
        .then(() => console.log("liked", msg.key))
        .catch(() => { const $$result = (liked = false); $$invalidate('liked', liked); return $$result; });
    } else {
      ssb
        .unlike(msg.key)
        .then(() => console.log("unliked", msg.key))
        .catch(() => { const $$result = (liked = true); $$invalidate('liked', liked); return $$result; });
    }
  };

  const displayBlogPost = ev => {
    $$invalidate('loading', loading = true);
    console.log("loading blogpost", content.blog);

    ssb
      .getBlob(content.blog)
      .then(data => {
        $$invalidate('post', post = ssb.markdown(data));
        $$invalidate('showBlogpost', showBlogpost = true);
      })
      .catch(err => {
        console.error("can't load blog post", err);
        $$invalidate('toast', toast = true);
        $$invalidate('toastMsg', toastMsg = err);
      });
  };

  const reply = ev => {
    let rootId = msg.value.content.root || msg.key;
    let channel = msg.value.content.channel;
    Object(_utils_js__WEBPACK_IMPORTED_MODULE_1__["navigate"])("/compose", { root: rootId, branch: msg.key, channel });
  };

  const goRoot = ev => {
    let rootId = msg.value.content.root || msg.key;
    Object(_utils_js__WEBPACK_IMPORTED_MODULE_1__["navigate"])("/thread", { thread: rootId });
  };

  const goBranch = ev => {
    let branchId = msg.value.content.branch || msg.key;
    Object(_utils_js__WEBPACK_IMPORTED_MODULE_1__["navigate"])("/thread", { thread: branchId });
  };

  if ($routeLocation == "/thread") {
    setTimeout(displayBlogPost, 100);
  }

	function click_handler() {
		const $$result = (showBlogpost = false);
		$$invalidate('showBlogpost', showBlogpost);
		return $$result;
	}

	$$self.$set = $$props => {
		if ('msg' in $$props) $$invalidate('msg', msg = $$props.msg);
	};

	return {
		msg,
		summary,
		thumbnail,
		title,
		showBlogpost,
		loading,
		toast,
		toastMsg,
		post,
		liked,
		likeChanged,
		displayBlogPost,
		reply,
		goRoot,
		goBranch,
		click_handler
	};
}

class BlogMsg extends svelte_internal__WEBPACK_IMPORTED_MODULE_0__["SvelteComponent"] {
	constructor(options) {
		super();
		Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["init"])(this, options, instance, create_fragment, svelte_internal__WEBPACK_IMPORTED_MODULE_0__["safe_not_equal"], ["msg"]);
	}
}


if (false) {}

/* harmony default export */ __webpack_exports__["default"] = (BlogMsg);


/***/ }),

/***/ "./src/ui/messageTypes/ChannelMsg.svelte":
/*!***********************************************!*\
  !*** ./src/ui/messageTypes/ChannelMsg.svelte ***!
  \***********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var svelte_internal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! svelte/internal */ "./node_modules/svelte/internal.mjs");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils.js */ "./src/ui/utils.js");
/* src\ui\messageTypes\ChannelMsg.svelte generated by Svelte v3.4.4 */



function create_fragment(ctx) {
	var div, t0, t1, t2, t3, a, t4, t5, a_href_value, dispose;

	return {
		c() {
			div = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");
			t0 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])(ctx.person);
			t1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			t2 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])(ctx.verb);
			t3 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			a = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("a");
			t4 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])("#");
			t5 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])(ctx.channel);
			a.href = a_href_value = "?channel=" + ctx.channel + "#/channel";
			div.className = "card-body";
			dispose = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(a, "click", ctx.goChannel);
		},

		m(target, anchor) {
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, div, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div, t0);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div, t1);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div, t2);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div, t3);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div, a);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(a, t4);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(a, t5);
		},

		p(changed, ctx) {
			if (changed.person) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["set_data"])(t0, ctx.person);
			}
		},

		i: svelte_internal__WEBPACK_IMPORTED_MODULE_0__["noop"],
		o: svelte_internal__WEBPACK_IMPORTED_MODULE_0__["noop"],

		d(detaching) {
			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(div);
			}

			dispose();
		}
	};
}

function instance($$self, $$props, $$invalidate) {
	let { msg } = $$props;

  let person = msg.value.author;
  let verb = msg.value.content.subscribed ? "subscribed" : "unsubscribed";
  let channel = encodeURIComponent(msg.value.content.channel);

  ssb.avatar(msg.value.author).then(data => { const $$result = (person = data.name); $$invalidate('person', person); return $$result; });

   const goChannel = ev => {
    ev.stopPropagation();
    ev.preventDefault();
    Object(_utils_js__WEBPACK_IMPORTED_MODULE_1__["navigate"])("/channel", { channel: msg.value.content.channel });
  };

	$$self.$set = $$props => {
		if ('msg' in $$props) $$invalidate('msg', msg = $$props.msg);
	};

	return { msg, person, verb, channel, goChannel };
}

class ChannelMsg extends svelte_internal__WEBPACK_IMPORTED_MODULE_0__["SvelteComponent"] {
	constructor(options) {
		super();
		Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["init"])(this, options, instance, create_fragment, svelte_internal__WEBPACK_IMPORTED_MODULE_0__["safe_not_equal"], ["msg"]);
	}
}


if (false) {}

/* harmony default export */ __webpack_exports__["default"] = (ChannelMsg);


/***/ }),

/***/ "./src/ui/messageTypes/ContactMsg.svelte":
/*!***********************************************!*\
  !*** ./src/ui/messageTypes/ContactMsg.svelte ***!
  \***********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var svelte_internal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! svelte/internal */ "./node_modules/svelte/internal.mjs");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils.js */ "./src/ui/utils.js");
/* src\ui\messageTypes\ContactMsg.svelte generated by Svelte v3.4.4 */



function create_fragment(ctx) {
	var div, t0, t1, t2, t3, a, t4, a_href_value, dispose;

	return {
		c() {
			div = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");
			t0 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])(ctx.person);
			t1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			t2 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])(ctx.verb);
			t3 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			a = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("a");
			t4 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])(ctx.otherPersonName);
			a.href = a_href_value = "?feed=" + ctx.otherPersonFeed + "#/profile";
			div.className = "card-body";
			dispose = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(a, "click", ctx.goProfile);
		},

		m(target, anchor) {
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, div, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div, t0);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div, t1);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div, t2);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div, t3);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div, a);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(a, t4);
		},

		p(changed, ctx) {
			if (changed.person) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["set_data"])(t0, ctx.person);
			}

			if (changed.verb) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["set_data"])(t2, ctx.verb);
			}

			if (changed.otherPersonName) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["set_data"])(t4, ctx.otherPersonName);
			}
		},

		i: svelte_internal__WEBPACK_IMPORTED_MODULE_0__["noop"],
		o: svelte_internal__WEBPACK_IMPORTED_MODULE_0__["noop"],

		d(detaching) {
			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(div);
			}

			dispose();
		}
	};
}

function instance($$self, $$props, $$invalidate) {
	let { msg } = $$props;

  let person = msg.value.author;
  let otherPersonFeed = encodeURIComponent(msg.value.content.contact);
  let otherPersonName = otherPersonFeed;
  let verb = msg.value.content.following ? "followed" : "unfollowed";

  if (msg.value.content.blocking) {
    $$invalidate('verb', verb = "blocked");
  }

  ssb.avatar(msg.value.author).then(data => { const $$result = (person = data.name); $$invalidate('person', person); return $$result; });
  ssb
    .avatar(msg.value.content.contact)
    .then(data => {
      $$invalidate('otherPersonName', otherPersonName = data.name);
    })
    .catch(n => console.log(n));

  const goProfile = ev => {
    ev.stopPropagation();
    ev.preventDefault();
    Object(_utils_js__WEBPACK_IMPORTED_MODULE_1__["navigate"])("/profile", { feed: msg.value.content.contact });
  };

	$$self.$set = $$props => {
		if ('msg' in $$props) $$invalidate('msg', msg = $$props.msg);
	};

	return {
		msg,
		person,
		otherPersonFeed,
		otherPersonName,
		verb,
		goProfile
	};
}

class ContactMsg extends svelte_internal__WEBPACK_IMPORTED_MODULE_0__["SvelteComponent"] {
	constructor(options) {
		super();
		Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["init"])(this, options, instance, create_fragment, svelte_internal__WEBPACK_IMPORTED_MODULE_0__["safe_not_equal"], ["msg"]);
	}
}


if (false) {}

/* harmony default export */ __webpack_exports__["default"] = (ContactMsg);


/***/ }),

/***/ "./src/ui/messageTypes/GenericMsg.svelte":
/*!***********************************************!*\
  !*** ./src/ui/messageTypes/GenericMsg.svelte ***!
  \***********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var svelte_internal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! svelte/internal */ "./node_modules/svelte/internal.mjs");
/* harmony import */ var C_Users_andre_prog_ssbc_patchfox_src_ui_messageTypes_GenericMsg_svelte_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./src/ui/messageTypes/GenericMsg.svelte.css */ "./src/ui/messageTypes/GenericMsg.svelte.css");
/* harmony import */ var C_Users_andre_prog_ssbc_patchfox_src_ui_messageTypes_GenericMsg_svelte_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(C_Users_andre_prog_ssbc_patchfox_src_ui_messageTypes_GenericMsg_svelte_css__WEBPACK_IMPORTED_MODULE_1__);
/* src\ui\messageTypes\GenericMsg.svelte generated by Svelte v3.4.4 */


function create_fragment(ctx) {
	var div, pre, code, t;

	return {
		c() {
			div = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");
			pre = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("pre");
			code = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("code");
			t = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])(ctx.rawContent);
			pre.className = "code svelte-mp70wj";
			div.className = "card-body";
		},

		m(target, anchor) {
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, div, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div, pre);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(pre, code);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(code, t);
		},

		p: svelte_internal__WEBPACK_IMPORTED_MODULE_0__["noop"],
		i: svelte_internal__WEBPACK_IMPORTED_MODULE_0__["noop"],
		o: svelte_internal__WEBPACK_IMPORTED_MODULE_0__["noop"],

		d(detaching) {
			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(div);
			}
		}
	};
}

function instance($$self, $$props, $$invalidate) {
	let { msg } = $$props;

  let rawContent = JSON.stringify(msg, null, 2);

	$$self.$set = $$props => {
		if ('msg' in $$props) $$invalidate('msg', msg = $$props.msg);
	};

	return { msg, rawContent };
}

class GenericMsg extends svelte_internal__WEBPACK_IMPORTED_MODULE_0__["SvelteComponent"] {
	constructor(options) {
		super();
		Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["init"])(this, options, instance, create_fragment, svelte_internal__WEBPACK_IMPORTED_MODULE_0__["safe_not_equal"], ["msg"]);
	}
}


if (false) {}

/* harmony default export */ __webpack_exports__["default"] = (GenericMsg);




/***/ }),

/***/ "./src/ui/messageTypes/GenericMsg.svelte.css":
/*!***************************************************!*\
  !*** ./src/ui/messageTypes/GenericMsg.svelte.css ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../../node_modules/css-loader/dist/cjs.js!./GenericMsg.svelte.css */ "./node_modules/css-loader/dist/cjs.js!./src/ui/messageTypes/GenericMsg.svelte.css");

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(/*! ../../../node_modules/style-loader/lib/addStyles.js */ "./node_modules/style-loader/lib/addStyles.js")(content, options);

if(content.locals) module.exports = content.locals;

if(false) {}

/***/ }),

/***/ "./src/ui/messageTypes/MessageRenderer.svelte":
/*!****************************************************!*\
  !*** ./src/ui/messageTypes/MessageRenderer.svelte ***!
  \****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var svelte_internal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! svelte/internal */ "./node_modules/svelte/internal.mjs");
/* harmony import */ var _PostMsg_svelte__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./PostMsg.svelte */ "./src/ui/messageTypes/PostMsg.svelte");
/* harmony import */ var _GenericMsg_svelte__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./GenericMsg.svelte */ "./src/ui/messageTypes/GenericMsg.svelte");
/* harmony import */ var _VoteMsg_svelte__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./VoteMsg.svelte */ "./src/ui/messageTypes/VoteMsg.svelte");
/* harmony import */ var _PrivateMsg_svelte__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./PrivateMsg.svelte */ "./src/ui/messageTypes/PrivateMsg.svelte");
/* harmony import */ var _ContactMsg_svelte__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./ContactMsg.svelte */ "./src/ui/messageTypes/ContactMsg.svelte");
/* harmony import */ var _ChannelMsg_svelte__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./ChannelMsg.svelte */ "./src/ui/messageTypes/ChannelMsg.svelte");
/* harmony import */ var _AboutMsg_svelte__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./AboutMsg.svelte */ "./src/ui/messageTypes/AboutMsg.svelte");
/* harmony import */ var _PubMsg_svelte__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./PubMsg.svelte */ "./src/ui/messageTypes/PubMsg.svelte");
/* harmony import */ var _BlogMsg_svelte__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./BlogMsg.svelte */ "./src/ui/messageTypes/BlogMsg.svelte");
/* harmony import */ var _parts_AvatarChip_svelte__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../parts/AvatarChip.svelte */ "./src/ui/parts/AvatarChip.svelte");
/* harmony import */ var _parts_timestamp_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../parts/timestamp.js */ "./src/ui/parts/timestamp.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../utils.js */ "./src/ui/utils.js");
/* harmony import */ var _abusePrevention_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../abusePrevention.js */ "./src/ui/abusePrevention.js");
/* harmony import */ var C_Users_andre_prog_ssbc_patchfox_src_ui_messageTypes_MessageRenderer_svelte_css__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./src/ui/messageTypes/MessageRenderer.svelte.css */ "./src/ui/messageTypes/MessageRenderer.svelte.css");
/* harmony import */ var C_Users_andre_prog_ssbc_patchfox_src_ui_messageTypes_MessageRenderer_svelte_css__WEBPACK_IMPORTED_MODULE_14___default = /*#__PURE__*/__webpack_require__.n(C_Users_andre_prog_ssbc_patchfox_src_ui_messageTypes_MessageRenderer_svelte_css__WEBPACK_IMPORTED_MODULE_14__);
/* src\ui\messageTypes\MessageRenderer.svelte generated by Svelte v3.4.4 */















// (148:4) {#if privateMsgForYou}
function create_if_block_3(ctx) {
	var span;

	return {
		c() {
			span = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("span");
			span.textContent = "PRIVATE";
			span.className = "label";
		},

		m(target, anchor) {
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, span, anchor);
		},

		d(detaching) {
			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(span);
			}
		}
	};
}

// (157:8) {#if msg.value.content.channel}
function create_if_block_2(ctx) {
	var t0, t1_value = ctx.msg.value.content.channel, t1;

	return {
		c() {
			t0 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])("#");
			t1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])(t1_value);
		},

		m(target, anchor) {
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, t0, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, t1, anchor);
		},

		p(changed, ctx) {
			if ((changed.msg) && t1_value !== (t1_value = ctx.msg.value.content.channel)) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["set_data"])(t1, t1_value);
			}
		},

		d(detaching) {
			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(t0);
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(t1);
			}
		}
	};
}

// (193:44) {:else}
function create_else_block_1(ctx) {
	var t;

	return {
		c() {
			t = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])("Close raw message");
		},

		m(target, anchor) {
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, t, anchor);
		},

		d(detaching) {
			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(t);
			}
		}
	};
}

// (193:14) {#if !showRaw}
function create_if_block_1(ctx) {
	var t;

	return {
		c() {
			t = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])("Show raw message");
		},

		m(target, anchor) {
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, t, anchor);
		},

		d(detaching) {
			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(t);
			}
		}
	};
}

// (202:2) {:else}
function create_else_block(ctx) {
	var div3, div2, div0, pre, code, t0, t1, div1, p0, t2, em, t3, t4, t5, p1, t6, a, t7, t8, a_href_value, t9;

	return {
		c() {
			div3 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");
			div2 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");
			div0 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");
			pre = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("pre");
			code = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("code");
			t0 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])(ctx.rawContent);
			t1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			div1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");
			p0 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("p");
			t2 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])("This is a message of type\r\n            ");
			em = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("em");
			t3 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])(ctx.type);
			t4 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])("\r\n            .");
			t5 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			p1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("p");
			t6 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])("To learn more about it, go to\r\n            ");
			a = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("a");
			t7 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])("the documentation about messages with type ");
			t8 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])(ctx.type);
			t9 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])("\r\n            .");
			pre.className = "code";
			div0.className = "column col-9";
			a.target = "_blank";
			a.href = a_href_value = "/docs/index.html#/message_types/" + ctx.type;
			div1.className = "column col-3";
			div2.className = "columns";
			div3.className = "card-body";
		},

		m(target, anchor) {
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, div3, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div3, div2);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div2, div0);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div0, pre);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(pre, code);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(code, t0);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div2, t1);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div2, div1);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div1, p0);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(p0, t2);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(p0, em);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(em, t3);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(p0, t4);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div1, t5);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div1, p1);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(p1, t6);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(p1, a);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(a, t7);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(a, t8);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(p1, t9);
		},

		p(changed, ctx) {
			if (changed.type) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["set_data"])(t3, ctx.type);
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["set_data"])(t8, ctx.type);
			}

			if ((changed.type) && a_href_value !== (a_href_value = "/docs/index.html#/message_types/" + ctx.type)) {
				a.href = a_href_value;
			}
		},

		i: svelte_internal__WEBPACK_IMPORTED_MODULE_0__["noop"],
		o: svelte_internal__WEBPACK_IMPORTED_MODULE_0__["noop"],

		d(detaching) {
			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(div3);
			}
		}
	};
}

// (200:2) {#if !showRaw}
function create_if_block(ctx) {
	var switch_instance_anchor, current;

	var switch_value = ctx.selectedRenderer;

	function switch_props(ctx) {
		return { props: { msg: ctx.msg } };
	}

	if (switch_value) {
		var switch_instance = new switch_value(switch_props(ctx));
	}

	return {
		c() {
			if (switch_instance) switch_instance.$$.fragment.c();
			switch_instance_anchor = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["empty"])();
		},

		m(target, anchor) {
			if (switch_instance) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["mount_component"])(switch_instance, target, anchor);
			}

			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, switch_instance_anchor, anchor);
			current = true;
		},

		p(changed, ctx) {
			var switch_instance_changes = {};
			if (changed.msg) switch_instance_changes.msg = ctx.msg;

			if (switch_value !== (switch_value = ctx.selectedRenderer)) {
				if (switch_instance) {
					Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["group_outros"])();
					const old_component = switch_instance;
					Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["on_outro"])(() => {
						old_component.$destroy();
					});
					old_component.$$.fragment.o(1);
					Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["check_outros"])();
				}

				if (switch_value) {
					switch_instance = new switch_value(switch_props(ctx));

					switch_instance.$$.fragment.c();
					switch_instance.$$.fragment.i(1);
					Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["mount_component"])(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
				} else {
					switch_instance = null;
				}
			}

			else if (switch_value) {
				switch_instance.$set(switch_instance_changes);
			}
		},

		i(local) {
			if (current) return;
			if (switch_instance) switch_instance.$$.fragment.i(local);

			current = true;
		},

		o(local) {
			if (switch_instance) switch_instance.$$.fragment.o(local);
			current = false;
		},

		d(detaching) {
			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(switch_instance_anchor);
			}

			if (switch_instance) switch_instance.$destroy(detaching);
		}
	};
}

function create_fragment(ctx) {
	var div10, div9, div6, div5, div4, div1, div0, img, t0, div3, div2, t1, t2, small, t3_value = Object(_parts_timestamp_js__WEBPACK_IMPORTED_MODULE_11__["default"])(ctx.msg.value.timestamp), t3, t4, t5, div8, span0, t6, div7, span1, t7, ul, li0, a0, i1, t8, a0_href_value, t9, li1, a1, t11, li2, a2, t13, li3, t14, li4, a3, i4, t15, t16, current_block_type_index, if_block3, current, dispose;

	var if_block0 = (ctx.privateMsgForYou) && create_if_block_3(ctx);

	var if_block1 = (ctx.msg.value.content.channel) && create_if_block_2(ctx);

	function select_block_type(ctx) {
		if (!ctx.showRaw) return create_if_block_1;
		return create_else_block_1;
	}

	var current_block_type = select_block_type(ctx);
	var if_block2 = current_block_type(ctx);

	var if_block_creators = [
		create_if_block,
		create_else_block
	];

	var if_blocks = [];

	function select_block_type_1(ctx) {
		if (!ctx.showRaw) return 0;
		return 1;
	}

	current_block_type_index = select_block_type_1(ctx);
	if_block3 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

	return {
		c() {
			div10 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");
			div9 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");
			div6 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");
			div5 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");
			div4 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");
			div1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");
			div0 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");
			img = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("img");
			t0 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			div3 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");
			div2 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");
			t1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])(ctx.name);
			t2 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			small = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("small");
			t3 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])(t3_value);
			t4 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			if (if_block0) if_block0.c();
			t5 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			div8 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");
			span0 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("span");
			if (if_block1) if_block1.c();
			t6 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			div7 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");
			span1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("span");
			span1.innerHTML = `<i class="icon icon-more-vert"></i>`;
			t7 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			ul = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("ul");
			li0 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("li");
			a0 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("a");
			i1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("i");
			t8 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])("\r\n              Open in new tab");
			t9 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			li1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("li");
			a1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("a");
			a1.innerHTML = `<i class="icon icon-copy"></i>
			              Copy permalink to clipboard
			            `;
			t11 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			li2 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("li");
			a2 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("a");
			a2.innerHTML = `<i class="icon icon-copy"></i>
			              Copy message id to clipboard
			            `;
			t13 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			li3 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("li");
			t14 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			li4 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("li");
			a3 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("a");
			i4 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("i");
			t15 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			if_block2.c();
			t16 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			if_block3.c();
			img.src = ctx.image;
			img.className = "avatar avatar-lg svelte-1jn1wek";
			img.alt = ctx.feed;
			div0.className = "example-tile-icon";
			div1.className = "tile-icon";
			div2.className = "tile-title";
			small.className = "tile-subtitle text-gray";
			div3.className = "tile-content";
			div4.className = "tile tile-centered feed-display svelte-1jn1wek";
			div5.className = "card-title";
			div6.className = "float-left";
			span0.className = "text-gray channel-display svelte-1jn1wek";
			span1.className = "btn btn-link dropdown-toggle";
			span1.tabIndex = "0";
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["toggle_class"])(span1, "active", ctx.dropdownActive);
			i1.className = "icon icon-share";
			a0.href = a0_href_value = "?thread=" + ctx.encodeURIComponent(ctx.msg.key) + "#/thread";
			a0.target = "_blank";
			li0.className = "menu-item";
			a1.href = "#";
			li1.className = "menu-item";
			a2.href = "#";
			li2.className = "menu-item";
			li3.className = "divider";
			li3.dataset.content = "FOR THE CURIOUS";
			i4.className = "icon icon-message";
			a3.href = "#";
			li4.className = "menu-item";
			ul.className = "menu menu-right svelte-1jn1wek";
			div7.className = "dropdown";
			div8.className = "float-right";
			div9.className = "card-header";
			div10.className = "card m-2 svelte-1jn1wek";
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["toggle_class"])(div10, "private", ctx.privateMsgForYou);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["toggle_class"])(div10, "blured", ctx.blured);

			dispose = [
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(div4, "click", ctx.goProfile),
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(span0, "click", ctx.click_handler),
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(span1, "click", ctx.click_handler_1),
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(a1, "click", Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["prevent_default"])(ctx.copyPermalink)),
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(a2, "click", Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["prevent_default"])(ctx.copyHash)),
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(a3, "click", Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["prevent_default"])(ctx.toggleRawMessage))
			];
		},

		m(target, anchor) {
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, div10, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div10, div9);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div9, div6);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div6, div5);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div5, div4);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div4, div1);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div1, div0);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div0, img);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div4, t0);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div4, div3);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div3, div2);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div2, t1);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div3, t2);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div3, small);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(small, t3);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div9, t4);
			if (if_block0) if_block0.m(div9, null);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div9, t5);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div9, div8);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div8, span0);
			if (if_block1) if_block1.m(span0, null);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div8, t6);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div8, div7);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div7, span1);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div7, t7);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div7, ul);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(ul, li0);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(li0, a0);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(a0, i1);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(a0, t8);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(ul, t9);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(ul, li1);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(li1, a1);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(ul, t11);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(ul, li2);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(li2, a2);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(ul, t13);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(ul, li3);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(ul, t14);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(ul, li4);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(li4, a3);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(a3, i4);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(a3, t15);
			if_block2.m(a3, null);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div10, t16);
			if_blocks[current_block_type_index].m(div10, null);
			current = true;
		},

		p(changed, ctx) {
			if (!current || changed.image) {
				img.src = ctx.image;
			}

			if (!current || changed.name) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["set_data"])(t1, ctx.name);
			}

			if ((!current || changed.msg) && t3_value !== (t3_value = Object(_parts_timestamp_js__WEBPACK_IMPORTED_MODULE_11__["default"])(ctx.msg.value.timestamp))) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["set_data"])(t3, t3_value);
			}

			if (ctx.privateMsgForYou) {
				if (!if_block0) {
					if_block0 = create_if_block_3(ctx);
					if_block0.c();
					if_block0.m(div9, t5);
				}
			} else if (if_block0) {
				if_block0.d(1);
				if_block0 = null;
			}

			if (ctx.msg.value.content.channel) {
				if (if_block1) {
					if_block1.p(changed, ctx);
				} else {
					if_block1 = create_if_block_2(ctx);
					if_block1.c();
					if_block1.m(span0, null);
				}
			} else if (if_block1) {
				if_block1.d(1);
				if_block1 = null;
			}

			if (changed.dropdownActive) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["toggle_class"])(span1, "active", ctx.dropdownActive);
			}

			if ((!current || changed.msg) && a0_href_value !== (a0_href_value = "?thread=" + ctx.encodeURIComponent(ctx.msg.key) + "#/thread")) {
				a0.href = a0_href_value;
			}

			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
				if_block2.d(1);
				if_block2 = current_block_type(ctx);
				if (if_block2) {
					if_block2.c();
					if_block2.m(a3, null);
				}
			}

			var previous_block_index = current_block_type_index;
			current_block_type_index = select_block_type_1(ctx);
			if (current_block_type_index === previous_block_index) {
				if_blocks[current_block_type_index].p(changed, ctx);
			} else {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["group_outros"])();
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["on_outro"])(() => {
					if_blocks[previous_block_index].d(1);
					if_blocks[previous_block_index] = null;
				});
				if_block3.o(1);
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["check_outros"])();

				if_block3 = if_blocks[current_block_type_index];
				if (!if_block3) {
					if_block3 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
					if_block3.c();
				}
				if_block3.i(1);
				if_block3.m(div10, null);
			}

			if (changed.privateMsgForYou) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["toggle_class"])(div10, "private", ctx.privateMsgForYou);
			}

			if (changed.blured) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["toggle_class"])(div10, "blured", ctx.blured);
			}
		},

		i(local) {
			if (current) return;
			if (if_block3) if_block3.i();
			current = true;
		},

		o(local) {
			if (if_block3) if_block3.o();
			current = false;
		},

		d(detaching) {
			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(div10);
			}

			if (if_block0) if_block0.d();
			if (if_block1) if_block1.d();
			if_block2.d();
			if_blocks[current_block_type_index].d();
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["run_all"])(dispose);
		}
	};
}

function instance($$self, $$props, $$invalidate) {
	

  let { msg } = $$props;

  let type;
  let feed = msg.value.author;
  let showRaw = false;
  let rawContent = JSON.stringify(msg, null, 2);
  let dropdownActive = false;
  let privateMsgForYou = false;

  let messageTypes = {
    "*": _GenericMsg_svelte__WEBPACK_IMPORTED_MODULE_2__["default"],
    post: _PostMsg_svelte__WEBPACK_IMPORTED_MODULE_1__["default"],
    vote: _VoteMsg_svelte__WEBPACK_IMPORTED_MODULE_3__["default"],
    private: _PrivateMsg_svelte__WEBPACK_IMPORTED_MODULE_4__["default"],
    contact: _ContactMsg_svelte__WEBPACK_IMPORTED_MODULE_5__["default"],
    channel: _ChannelMsg_svelte__WEBPACK_IMPORTED_MODULE_6__["default"],
    about: _AboutMsg_svelte__WEBPACK_IMPORTED_MODULE_7__["default"],
    pub: _PubMsg_svelte__WEBPACK_IMPORTED_MODULE_8__["default"],
    blog: _BlogMsg_svelte__WEBPACK_IMPORTED_MODULE_9__["default"]
  };

  let selectedRenderer;

  if (typeof msg.value.content === "string") {
    $$invalidate('type', type = "private");
  } else {
    $$invalidate('type', type = msg.value.content.type);
  }

  if (msg.value.private) {
    $$invalidate('privateMsgForYou', privateMsgForYou = true);
  }

  if (messageTypes.hasOwnProperty(type)) {
    $$invalidate('selectedRenderer', selectedRenderer = messageTypes[type]);
  } else {
    $$invalidate('selectedRenderer', selectedRenderer = messageTypes["*"]);
  }

  let image = "images/icon.png";
  let name = feed;
  let blured = Object(_abusePrevention_js__WEBPACK_IMPORTED_MODULE_13__["isMessageBlured"])(msg);

  ssb.avatar(feed).then(data => {
    if (data.image !== null) {
      $$invalidate('image', image = `http://localhost:8989/blobs/get/${data.image}`);
    }
    $$invalidate('name', name = data.name);
  });

  const toggleRawMessage = () => {
    $$invalidate('showRaw', showRaw = !showRaw);
    $$invalidate('dropdownActive', dropdownActive = false);
  };

  const copyPermalink = () => {
    navigator.clipboard
      .writeText(`ssb:${msg.key}`)
      .then(() => console.log("permalink copied"))
      .catch(err => console.error("can't copy permalink", err));

    $$invalidate('dropdownActive', dropdownActive = false);
  };

  const copyHash = () => {
    navigator.clipboard
      .writeText(`${msg.key}`)
      .then(() => console.log("hash copied"))
      .catch(err => console.error("can't copy hash", err));

    $$invalidate('dropdownActive', dropdownActive = false);
  };

  const goProfile = ev => {
    if (ev.ctrlKey) {
      window.open(`?feed=${encodeURIComponent(feed)}#/profile`);
    } else {
      Object(_utils_js__WEBPACK_IMPORTED_MODULE_12__["navigate"])("/profile", { feed });
    }
  };

	function click_handler() {
		return Object(_utils_js__WEBPACK_IMPORTED_MODULE_12__["navigate"])('/channel', {
	            channel: msg.value.content.channel
	          });
	}

	function click_handler_1() {
		const $$result = (dropdownActive = !dropdownActive);
		$$invalidate('dropdownActive', dropdownActive);
		return $$result;
	}

	$$self.$set = $$props => {
		if ('msg' in $$props) $$invalidate('msg', msg = $$props.msg);
	};

	return {
		msg,
		type,
		feed,
		showRaw,
		rawContent,
		dropdownActive,
		privateMsgForYou,
		selectedRenderer,
		image,
		name,
		blured,
		toggleRawMessage,
		copyPermalink,
		copyHash,
		goProfile,
		encodeURIComponent,
		click_handler,
		click_handler_1
	};
}

class MessageRenderer extends svelte_internal__WEBPACK_IMPORTED_MODULE_0__["SvelteComponent"] {
	constructor(options) {
		super();
		Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["init"])(this, options, instance, create_fragment, svelte_internal__WEBPACK_IMPORTED_MODULE_0__["safe_not_equal"], ["msg"]);
	}
}


if (false) {}

/* harmony default export */ __webpack_exports__["default"] = (MessageRenderer);




/***/ }),

/***/ "./src/ui/messageTypes/MessageRenderer.svelte.css":
/*!********************************************************!*\
  !*** ./src/ui/messageTypes/MessageRenderer.svelte.css ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../../node_modules/css-loader/dist/cjs.js!./MessageRenderer.svelte.css */ "./node_modules/css-loader/dist/cjs.js!./src/ui/messageTypes/MessageRenderer.svelte.css");

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(/*! ../../../node_modules/style-loader/lib/addStyles.js */ "./node_modules/style-loader/lib/addStyles.js")(content, options);

if(content.locals) module.exports = content.locals;

if(false) {}

/***/ }),

/***/ "./src/ui/messageTypes/PostMsg.svelte":
/*!********************************************!*\
  !*** ./src/ui/messageTypes/PostMsg.svelte ***!
  \********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var svelte_internal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! svelte/internal */ "./node_modules/svelte/internal.mjs");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils.js */ "./src/ui/utils.js");
/* harmony import */ var C_Users_andre_prog_ssbc_patchfox_src_ui_messageTypes_PostMsg_svelte_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./src/ui/messageTypes/PostMsg.svelte.css */ "./src/ui/messageTypes/PostMsg.svelte.css");
/* harmony import */ var C_Users_andre_prog_ssbc_patchfox_src_ui_messageTypes_PostMsg_svelte_css__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(C_Users_andre_prog_ssbc_patchfox_src_ui_messageTypes_PostMsg_svelte_css__WEBPACK_IMPORTED_MODULE_2__);
/* src\ui\messageTypes\PostMsg.svelte generated by Svelte v3.4.4 */



// (84:2) {:else}
function create_else_block(ctx) {
	var t, raw_before, raw_after;

	var if_block = (ctx.hasContentWarning) && create_if_block_4(ctx);

	return {
		c() {
			if (if_block) if_block.c();
			t = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			raw_before = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])('noscript');
			raw_after = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])('noscript');
		},

		m(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, t, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, raw_before, anchor);
			raw_before.insertAdjacentHTML("afterend", ctx.content);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, raw_after, anchor);
		},

		p(changed, ctx) {
			if (ctx.hasContentWarning) {
				if (if_block) {
					if_block.p(changed, ctx);
				} else {
					if_block = create_if_block_4(ctx);
					if_block.c();
					if_block.m(t.parentNode, t);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}
		},

		d(detaching) {
			if (if_block) if_block.d(detaching);

			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(t);
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach_between"])(raw_before, raw_after);
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(raw_before);
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(raw_after);
			}
		}
	};
}

// (77:2) {#if hasContentWarning && showContentWarning}
function create_if_block_3(ctx) {
	var p, t0_value = ctx.msg.value.content.contentWarning, t0, t1, button, dispose;

	return {
		c() {
			p = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("p");
			t0 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])(t0_value);
			t1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			button = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("button");
			button.textContent = "Show Message";
			button.className = "btn";
			dispose = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(button, "click", ctx.click_handler);
		},

		m(target, anchor) {
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, p, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(p, t0);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, t1, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, button, anchor);
		},

		p(changed, ctx) {
			if ((changed.msg) && t0_value !== (t0_value = ctx.msg.value.content.contentWarning)) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["set_data"])(t0, t0_value);
			}
		},

		d(detaching) {
			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(p);
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(t1);
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(button);
			}

			dispose();
		}
	};
}

// (85:4) {#if hasContentWarning}
function create_if_block_4(ctx) {
	var div, p, b, t1, t2_value = ctx.msg.value.content.contentWarning, t2, t3, button, dispose;

	return {
		c() {
			div = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");
			p = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("p");
			b = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("b");
			b.textContent = "Content Warning:";
			t1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			t2 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])(t2_value);
			t3 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			button = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("button");
			button.textContent = "Hide Message";
			button.className = "btn btn-sm float-right";
			div.className = "toast toast-warning";
			dispose = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(button, "click", ctx.click_handler_1);
		},

		m(target, anchor) {
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, div, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div, p);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(p, b);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(p, t1);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(p, t2);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(p, t3);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(p, button);
		},

		p(changed, ctx) {
			if ((changed.msg) && t2_value !== (t2_value = ctx.msg.value.content.contentWarning)) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["set_data"])(t2, t2_value);
			}
		},

		d(detaching) {
			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(div);
			}

			dispose();
		}
	};
}

// (109:6) {#if msg.value.content.root}
function create_if_block_2(ctx) {
	var span, a, t, a_href_value, dispose;

	return {
		c() {
			span = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("span");
			a = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("a");
			t = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])("(root)");
			a.href = a_href_value = "?thread=" + encodeURIComponent(ctx.msg.value.content.root) + "#/thread";
			dispose = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(a, "click", Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["prevent_default"])(ctx.goRoot));
		},

		m(target, anchor) {
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, span, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(span, a);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(a, t);
		},

		p(changed, ctx) {
			if ((changed.msg) && a_href_value !== (a_href_value = "?thread=" + encodeURIComponent(ctx.msg.value.content.root) + "#/thread")) {
				a.href = a_href_value;
			}
		},

		d(detaching) {
			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(span);
			}

			dispose();
		}
	};
}

// (118:6) {#if msg.value.content.branch}
function create_if_block_1(ctx) {
	var span, a, t, a_href_value, dispose;

	return {
		c() {
			span = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("span");
			a = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("a");
			t = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])("(in reply to)");
			a.href = a_href_value = "?thread=" + encodeURIComponent(ctx.msg.value.content.branch) + "#/thread";
			dispose = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(a, "click", Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["prevent_default"])(ctx.goBranch));
		},

		m(target, anchor) {
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, span, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(span, a);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(a, t);
		},

		p(changed, ctx) {
			if ((changed.msg) && a_href_value !== (a_href_value = "?thread=" + encodeURIComponent(ctx.msg.value.content.branch) + "#/thread")) {
				a.href = a_href_value;
			}
		},

		d(detaching) {
			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(span);
			}

			dispose();
		}
	};
}

// (129:4) {#if !msg.value.private}
function create_if_block(ctx) {
	var div, button0, t_1, button1, dispose;

	return {
		c() {
			div = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");
			button0 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("button");
			button0.textContent = "Fork";
			t_1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			button1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("button");
			button1.textContent = "Reply";
			button0.className = "btn";
			button1.className = "btn";
			div.className = "column col-6 text-right";

			dispose = [
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(button0, "click", ctx.fork),
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(button1, "click", ctx.reply)
			];
		},

		m(target, anchor) {
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, div, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div, button0);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div, t_1);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div, button1);
		},

		p: svelte_internal__WEBPACK_IMPORTED_MODULE_0__["noop"],

		d(detaching) {
			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(div);
			}

			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["run_all"])(dispose);
		}
	};
}

function create_fragment(ctx) {
	var div0, t0, div3, div2, div1, label, input, t1, i, t2, t3, t4, t5, dispose;

	function select_block_type(ctx) {
		if (ctx.hasContentWarning && ctx.showContentWarning) return create_if_block_3;
		return create_else_block;
	}

	var current_block_type = select_block_type(ctx);
	var if_block0 = current_block_type(ctx);

	var if_block1 = (ctx.msg.value.content.root) && create_if_block_2(ctx);

	var if_block2 = (ctx.msg.value.content.branch) && create_if_block_1(ctx);

	var if_block3 = (!ctx.msg.value.private) && create_if_block(ctx);

	return {
		c() {
			div0 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");
			if_block0.c();
			t0 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			div3 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");
			div2 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");
			div1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");
			label = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("label");
			input = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("input");
			t1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			i = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("i");
			t2 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])("\r\n        Like");
			t3 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			if (if_block1) if_block1.c();
			t4 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			if (if_block2) if_block2.c();
			t5 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			if (if_block3) if_block3.c();
			div0.className = "card-body svelte-1ftdgav";
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["attr"])(input, "type", "checkbox");
			input.checked = ctx.liked;
			i.className = "form-icon";
			label.className = "form-switch d-inline";
			div1.className = "column col-6";
			div2.className = "columns col-gapless";
			div3.className = "card-footer";
			dispose = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(input, "change", ctx.likeChanged);
		},

		m(target, anchor) {
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, div0, anchor);
			if_block0.m(div0, null);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, t0, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, div3, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div3, div2);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div2, div1);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div1, label);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(label, input);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(label, t1);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(label, i);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(label, t2);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div1, t3);
			if (if_block1) if_block1.m(div1, null);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div1, t4);
			if (if_block2) if_block2.m(div1, null);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div2, t5);
			if (if_block3) if_block3.m(div2, null);
		},

		p(changed, ctx) {
			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block0) {
				if_block0.p(changed, ctx);
			} else {
				if_block0.d(1);
				if_block0 = current_block_type(ctx);
				if (if_block0) {
					if_block0.c();
					if_block0.m(div0, null);
				}
			}

			if (changed.liked) {
				input.checked = ctx.liked;
			}

			if (ctx.msg.value.content.root) {
				if (if_block1) {
					if_block1.p(changed, ctx);
				} else {
					if_block1 = create_if_block_2(ctx);
					if_block1.c();
					if_block1.m(div1, t4);
				}
			} else if (if_block1) {
				if_block1.d(1);
				if_block1 = null;
			}

			if (ctx.msg.value.content.branch) {
				if (if_block2) {
					if_block2.p(changed, ctx);
				} else {
					if_block2 = create_if_block_1(ctx);
					if_block2.c();
					if_block2.m(div1, null);
				}
			} else if (if_block2) {
				if_block2.d(1);
				if_block2 = null;
			}

			if (!ctx.msg.value.private) {
				if (if_block3) {
					if_block3.p(changed, ctx);
				} else {
					if_block3 = create_if_block(ctx);
					if_block3.c();
					if_block3.m(div2, null);
				}
			} else if (if_block3) {
				if_block3.d(1);
				if_block3 = null;
			}
		},

		i: svelte_internal__WEBPACK_IMPORTED_MODULE_0__["noop"],
		o: svelte_internal__WEBPACK_IMPORTED_MODULE_0__["noop"],

		d(detaching) {
			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(div0);
			}

			if_block0.d();

			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(t0);
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(div3);
			}

			if (if_block1) if_block1.d();
			if (if_block2) if_block2.d();
			if (if_block3) if_block3.d();
			dispose();
		}
	};
}

function instance($$self, $$props, $$invalidate) {
	let { msg } = $$props;

  let content = ssb.markdown(msg.value.content.text);
  let liked = false;
  let hasContentWarning = msg.value.content.contentWarning || false;
  let showContentWarning = true;

  ssb.votes(msg.key).then(ms => {
    ms.forEach(m => {
      let author = m.value.author;
      if (author === ssb.feed && m.value.content.vote.value === 1) {
        $$invalidate('liked', liked = true);
      }
    });
  });

  const likeChanged = ev => {
    let v = ev.target.checked;
    if (v) {
      ssb
        .like(msg.key)
        .then(() => console.log("liked", msg.key))
        .catch(() => { const $$result = (liked = false); $$invalidate('liked', liked); return $$result; });
    } else {
      ssb
        .unlike(msg.key)
        .then(() => console.log("unliked", msg.key))
        .catch(() => { const $$result = (liked = true); $$invalidate('liked', liked); return $$result; });
    }
  };

  const reply = ev => {
    let root = msg.value.content.root || msg.key;
    let channel = msg.value.content.channel;
    let replyfeed = msg.value.author;
    Object(_utils_js__WEBPACK_IMPORTED_MODULE_1__["navigate"])("/compose", { root, branch: msg.key, channel, replyfeed });
  };

  const fork = ev => {
    let originalRoot = msg.value.content.root || msg.key;
    let channel = msg.value.content.channel;
    let replyfeed = msg.value.author;
    Object(_utils_js__WEBPACK_IMPORTED_MODULE_1__["navigate"])("/compose", {
      root: msg.key,
      branch: msg.key,
      fork: originalRoot,
      channel,
      replyfeed
    });
  };

  const goRoot = ev => {
    let rootId = msg.value.content.root || msg.key;
    Object(_utils_js__WEBPACK_IMPORTED_MODULE_1__["navigate"])("/thread", { thread: rootId });
  };

  const goBranch = ev => {
    let branchId = msg.value.content.branch || msg.key;
    Object(_utils_js__WEBPACK_IMPORTED_MODULE_1__["navigate"])("/thread", { thread: branchId });
  };

	function click_handler() {
		const $$result = (showContentWarning = !showContentWarning);
		$$invalidate('showContentWarning', showContentWarning);
		return $$result;
	}

	function click_handler_1() {
		const $$result = (showContentWarning = !showContentWarning);
		$$invalidate('showContentWarning', showContentWarning);
		return $$result;
	}

	$$self.$set = $$props => {
		if ('msg' in $$props) $$invalidate('msg', msg = $$props.msg);
	};

	return {
		msg,
		content,
		liked,
		hasContentWarning,
		showContentWarning,
		likeChanged,
		reply,
		fork,
		goRoot,
		goBranch,
		click_handler,
		click_handler_1
	};
}

class PostMsg extends svelte_internal__WEBPACK_IMPORTED_MODULE_0__["SvelteComponent"] {
	constructor(options) {
		super();
		Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["init"])(this, options, instance, create_fragment, svelte_internal__WEBPACK_IMPORTED_MODULE_0__["safe_not_equal"], ["msg"]);
	}
}


if (false) {}

/* harmony default export */ __webpack_exports__["default"] = (PostMsg);




/***/ }),

/***/ "./src/ui/messageTypes/PostMsg.svelte.css":
/*!************************************************!*\
  !*** ./src/ui/messageTypes/PostMsg.svelte.css ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../../node_modules/css-loader/dist/cjs.js!./PostMsg.svelte.css */ "./node_modules/css-loader/dist/cjs.js!./src/ui/messageTypes/PostMsg.svelte.css");

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(/*! ../../../node_modules/style-loader/lib/addStyles.js */ "./node_modules/style-loader/lib/addStyles.js")(content, options);

if(content.locals) module.exports = content.locals;

if(false) {}

/***/ }),

/***/ "./src/ui/messageTypes/PrivateMsg.svelte":
/*!***********************************************!*\
  !*** ./src/ui/messageTypes/PrivateMsg.svelte ***!
  \***********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var svelte_internal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! svelte/internal */ "./node_modules/svelte/internal.mjs");
/* src\ui\messageTypes\PrivateMsg.svelte generated by Svelte v3.4.4 */


function create_fragment(ctx) {
	var div;

	return {
		c() {
			div = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");
			div.innerHTML = `<p>🔒 PRIVATE</p>`;
			div.className = "card-body";
		},

		m(target, anchor) {
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, div, anchor);
		},

		p: svelte_internal__WEBPACK_IMPORTED_MODULE_0__["noop"],
		i: svelte_internal__WEBPACK_IMPORTED_MODULE_0__["noop"],
		o: svelte_internal__WEBPACK_IMPORTED_MODULE_0__["noop"],

		d(detaching) {
			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(div);
			}
		}
	};
}

function instance($$self, $$props, $$invalidate) {
	let { msg } = $$props;

	$$self.$set = $$props => {
		if ('msg' in $$props) $$invalidate('msg', msg = $$props.msg);
	};

	return { msg };
}

class PrivateMsg extends svelte_internal__WEBPACK_IMPORTED_MODULE_0__["SvelteComponent"] {
	constructor(options) {
		super();
		Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["init"])(this, options, instance, create_fragment, svelte_internal__WEBPACK_IMPORTED_MODULE_0__["safe_not_equal"], ["msg"]);
	}
}


if (false) {}

/* harmony default export */ __webpack_exports__["default"] = (PrivateMsg);


/***/ }),

/***/ "./src/ui/messageTypes/PubMsg.svelte":
/*!*******************************************!*\
  !*** ./src/ui/messageTypes/PubMsg.svelte ***!
  \*******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var svelte_internal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! svelte/internal */ "./node_modules/svelte/internal.mjs");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils.js */ "./src/ui/utils.js");
/* src\ui\messageTypes\PubMsg.svelte generated by Svelte v3.4.4 */



function create_fragment(ctx) {
	var div, t0, t1, a, t2, t3, t4, a_href_value, dispose;

	return {
		c() {
			div = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");
			t0 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])(ctx.person);
			t1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])(" announced pub\r\n  ");
			a = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("a");
			t2 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])(ctx.host);
			t3 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])(":");
			t4 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])(ctx.port);
			a.href = a_href_value = "/index.html?feed=" + ctx.encodedid + "#/profile";
			div.className = "card-body";
			dispose = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(a, "click", ctx.goProfile);
		},

		m(target, anchor) {
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, div, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div, t0);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div, t1);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div, a);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(a, t2);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(a, t3);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(a, t4);
		},

		p(changed, ctx) {
			if (changed.person) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["set_data"])(t0, ctx.person);
			}
		},

		i: svelte_internal__WEBPACK_IMPORTED_MODULE_0__["noop"],
		o: svelte_internal__WEBPACK_IMPORTED_MODULE_0__["noop"],

		d(detaching) {
			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(div);
			}

			dispose();
		}
	};
}

function instance($$self, $$props, $$invalidate) {
	let { msg } = $$props;

  let encodedid = encodeURIComponent(msg.value.content.address.key);
  let person = msg.value.author;
  let host = msg.value.content.address.host
  let port = msg.value.content.address.port

  ssb.avatar(msg.value.author).then(data => { const $$result = (person = data.name); $$invalidate('person', person); return $$result; });

  
  const goProfile = ev => {
    ev.stopPropagation();
    ev.preventDefault();
    Object(_utils_js__WEBPACK_IMPORTED_MODULE_1__["navigate"])("/profile", { feed: msg.value.content.address.key });
  };

	$$self.$set = $$props => {
		if ('msg' in $$props) $$invalidate('msg', msg = $$props.msg);
	};

	return {
		msg,
		encodedid,
		person,
		host,
		port,
		goProfile
	};
}

class PubMsg extends svelte_internal__WEBPACK_IMPORTED_MODULE_0__["SvelteComponent"] {
	constructor(options) {
		super();
		Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["init"])(this, options, instance, create_fragment, svelte_internal__WEBPACK_IMPORTED_MODULE_0__["safe_not_equal"], ["msg"]);
	}
}


if (false) {}

/* harmony default export */ __webpack_exports__["default"] = (PubMsg);


/***/ }),

/***/ "./src/ui/messageTypes/VoteMsg.svelte":
/*!********************************************!*\
  !*** ./src/ui/messageTypes/VoteMsg.svelte ***!
  \********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var svelte_internal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! svelte/internal */ "./node_modules/svelte/internal.mjs");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils.js */ "./src/ui/utils.js");
/* src\ui\messageTypes\VoteMsg.svelte generated by Svelte v3.4.4 */



function create_fragment(ctx) {
	var div, t0, t1, t2, t3, a, t4, a_href_value, dispose;

	return {
		c() {
			div = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");
			t0 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])(ctx.person);
			t1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			t2 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])(ctx.expression);
			t3 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			a = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("a");
			t4 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])(ctx.label);
			a.href = a_href_value = "/index.html?thread=" + ctx.encodedid + "#/thread";
			div.className = "card-body";
			dispose = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(a, "click", ctx.goThread);
		},

		m(target, anchor) {
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, div, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div, t0);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div, t1);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div, t2);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div, t3);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div, a);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(a, t4);
		},

		p(changed, ctx) {
			if (changed.person) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["set_data"])(t0, ctx.person);
			}

			if (changed.label) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["set_data"])(t4, ctx.label);
			}
		},

		i: svelte_internal__WEBPACK_IMPORTED_MODULE_0__["noop"],
		o: svelte_internal__WEBPACK_IMPORTED_MODULE_0__["noop"],

		d(detaching) {
			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(div);
			}

			dispose();
		}
	};
}

function instance($$self, $$props, $$invalidate) {
	let { msg } = $$props;

  let expression = msg.value.content.vote.expression;
  let msgid = msg.value.content.vote.link;
  let encodedid = encodeURIComponent(msgid);
  let label = msgid;
  let person = msg.value.author;

  ssb.blurbFromMsg(msgid, 100).then(blurb => {
    $$invalidate('label', label = blurb);
  });

  ssb.avatar(msg.value.author).then(data => { const $$result = (person = data.name); $$invalidate('person', person); return $$result; });

  const goThread = ev => {
    ev.stopPropagation();
    ev.preventDefault();
    if (ev.ctrlKey) {
      window.open(`?thread=${encodeURIComponent(msgid)}#/thread`);
    } else {
      Object(_utils_js__WEBPACK_IMPORTED_MODULE_1__["navigate"])("/thread", { thread: msgid });
    }
  };

	$$self.$set = $$props => {
		if ('msg' in $$props) $$invalidate('msg', msg = $$props.msg);
	};

	return {
		msg,
		expression,
		encodedid,
		label,
		person,
		goThread
	};
}

class VoteMsg extends svelte_internal__WEBPACK_IMPORTED_MODULE_0__["SvelteComponent"] {
	constructor(options) {
		super();
		Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["init"])(this, options, instance, create_fragment, svelte_internal__WEBPACK_IMPORTED_MODULE_0__["safe_not_equal"], ["msg"]);
	}
}


if (false) {}

/* harmony default export */ __webpack_exports__["default"] = (VoteMsg);


/***/ }),

/***/ "./src/ui/parts/AvatarChip.svelte":
/*!****************************************!*\
  !*** ./src/ui/parts/AvatarChip.svelte ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var svelte_internal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! svelte/internal */ "./node_modules/svelte/internal.mjs");
/* harmony import */ var svelte__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! svelte */ "./node_modules/svelte/index.mjs");
/* src\ui\parts\AvatarChip.svelte generated by Svelte v3.4.4 */



// (29:0) {:else}
function create_else_block(ctx) {
	var span, t, dispose;

	return {
		c() {
			span = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("span");
			t = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])(ctx.name);
			span.className = "chip";
			dispose = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(span, "click", ctx.avatarClick);
		},

		m(target, anchor) {
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, span, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(span, t);
		},

		p(changed, ctx) {
			if (changed.name) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["set_data"])(t, ctx.name);
			}
		},

		d(detaching) {
			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(span);
			}

			dispose();
		}
	};
}

// (24:0) {#if image}
function create_if_block(ctx) {
	var div, img, t0, t1, dispose;

	return {
		c() {
			div = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");
			img = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("img");
			t0 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			t1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])(ctx.name);
			img.src = ctx.image;
			img.className = "avatar avatar-sm";
			div.className = "chip";
			dispose = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(div, "click", ctx.avatarClick);
		},

		m(target, anchor) {
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, div, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div, img);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div, t0);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div, t1);
		},

		p(changed, ctx) {
			if (changed.image) {
				img.src = ctx.image;
			}

			if (changed.name) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["set_data"])(t1, ctx.name);
			}
		},

		d(detaching) {
			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(div);
			}

			dispose();
		}
	};
}

function create_fragment(ctx) {
	var if_block_anchor;

	function select_block_type(ctx) {
		if (ctx.image) return create_if_block;
		return create_else_block;
	}

	var current_block_type = select_block_type(ctx);
	var if_block = current_block_type(ctx);

	return {
		c() {
			if_block.c();
			if_block_anchor = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["empty"])();
		},

		m(target, anchor) {
			if_block.m(target, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, if_block_anchor, anchor);
		},

		p(changed, ctx) {
			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
				if_block.p(changed, ctx);
			} else {
				if_block.d(1);
				if_block = current_block_type(ctx);
				if (if_block) {
					if_block.c();
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			}
		},

		i: svelte_internal__WEBPACK_IMPORTED_MODULE_0__["noop"],
		o: svelte_internal__WEBPACK_IMPORTED_MODULE_0__["noop"],

		d(detaching) {
			if_block.d(detaching);

			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(if_block_anchor);
			}
		}
	};
}

function instance($$self, $$props, $$invalidate) {
	let { feed } = $$props;

  let image = false;
  let name = feed;
  const dispatch = Object(svelte__WEBPACK_IMPORTED_MODULE_1__["createEventDispatcher"])();

  ssb.avatar(feed).then(data => {
    if (data.image !== null) {
      $$invalidate('image', image = `http://localhost:8989/blobs/get/${data.image}`);
    }
    $$invalidate('name', name = data.name);
  });

  function avatarClick() {
    dispatch("avatarClick", {
      feed,
      name
    });
  }

	$$self.$set = $$props => {
		if ('feed' in $$props) $$invalidate('feed', feed = $$props.feed);
	};

	return { feed, image, name, avatarClick };
}

class AvatarChip extends svelte_internal__WEBPACK_IMPORTED_MODULE_0__["SvelteComponent"] {
	constructor(options) {
		super();
		Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["init"])(this, options, instance, create_fragment, svelte_internal__WEBPACK_IMPORTED_MODULE_0__["safe_not_equal"], ["feed"]);
	}
}


if (false) {}

/* harmony default export */ __webpack_exports__["default"] = (AvatarChip);


/***/ }),

/***/ "./src/ui/parts/timestamp.js":
/*!***********************************!*\
  !*** ./src/ui/parts/timestamp.js ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var timeago_simple__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! timeago-simple */ "./node_modules/timeago-simple/index.js");
/* harmony import */ var timeago_simple__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(timeago_simple__WEBPACK_IMPORTED_MODULE_0__);


const timestamp = t => {

    return timeago_simple__WEBPACK_IMPORTED_MODULE_0___default.a.simple(new Date(t))
}

/* harmony default export */ __webpack_exports__["default"] = (timestamp);


/***/ }),

/***/ "./src/ui/ssb.js":
/*!***********************!*\
  !*** ./src/ui/ssb.js ***!
  \***********************/
/*! exports provided: SSB */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SSB", function() { return SSB; });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils.js */ "./src/ui/utils.js");
/* harmony import */ var _abusePrevention_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./abusePrevention.js */ "./src/ui/abusePrevention.js");
/**
 * SSB
 *
 * TL;DR: SSB API for Patchfox using Hermiebox.
 *
 * OBJECTIVE:
 * The SSB is in flux right now. There are many approaches being played with which might
 * affect how this WebExtension connect to sbot. Some of the experiments being tried out are:
 *
 * - lessbot/nobot: each app maintain its own database and index but post through a shared sbot.
 * - graphql: export a GraphQL server which offers SSB features.
 * - json-rpc: export a JSON-RPC server offering SSB features.
 *
 * This driver folder will contain the various adapters to use these modes of connection as they
 * become available. For now, we'll use hermiebox.
 *
 * **Important: Each driver should export the exact same API to Patchfox**. This way we can
 * switch drivers without having to refactor the add-on.
 *
 * HOW IT WORKS:
 * Hermiebox is a browserified fat package of common NodeJS modules from our community and also
 * few highlevel API methods for common tasks. It uses WebSockets to connect to a running sbot
 * using muxrpc and shs stuff, so it needs your `secret` to be available.
 * 
 * ATTENTION:
 * This is a legacy from when Patchfox was vanilla JS. I'm gonna need to refactor this a lot
 * 
 * TODO: Refactor to use `ssb-query`
 */




const pull = hermiebox.modules.pullStream
const sort = hermiebox.modules.ssbSort

let sbot = false

let avatarCache = {}

class SSB {

  log(pMsg, pVal = "") {
    console.log(`[SSB API] - ${pMsg}`, pVal)
  }

  async connect(pKeys) {
    var server = await hermiebox.api.connect(pKeys)
    this.log("you are", server.id)
    this.feed = server.id
    sbot = server
  }

  filterLimit() {
    let limit = Object(_utils_js__WEBPACK_IMPORTED_MODULE_0__["getPref"])("limit", 10)
    return pull.take(limit)
  }

  filterWithUserFilters() {
    return pull.filter(m => Object(_abusePrevention_js__WEBPACK_IMPORTED_MODULE_1__["isMessageHidden"])(m))
  }

  filterTypes() {
    let knownMessageTypes = {
      "post": "showTypePost",
      "about": "showTypeAbout",
      "vote": "showTypeVote",
      "contact": "showTypeContact",
      "pub": "showTypePub",
      "blog": "showTypeBlog",
      "channel": "showTypeChannel"
    }

    let showUnknown = Object(_utils_js__WEBPACK_IMPORTED_MODULE_0__["getPref"])("showTypeUnknown", false)

    if (showUnknown) {
      return pull.filter(() => true);
    }

    return pull.filter(msg => {
      let type = msg.value.content.type

      if (typeof type == "string" && knownMessageTypes[type]) {
        return Object(_utils_js__WEBPACK_IMPORTED_MODULE_0__["getPref"])(knownMessageTypes[type], true)
      }
      return Object(_utils_js__WEBPACK_IMPORTED_MODULE_0__["getPref"])("showTypeUnknown", false)
    })
  }

  

  public(opts) {
    return new Promise((resolve, reject) => {

      opts = opts || {}
      opts.reverse = opts.reverse || true

      console.log("opts", opts)

      pull(
        sbot.createFeedStream(opts),
        pull.filter(msg => msg && msg.value && msg.value.content),
        this.filterTypes(),
        this.filterWithUserFilters(),
        this.filterLimit(),
        pull.collect((err, msgs) => {
          console.log("msgs", msgs)
          if (err) {
            reject(err)
          }

          resolve(msgs)
        })
      )
    })
  }

  thread(id) {
    return new Promise((resolve, reject) => {
      sbot.get(id, (err, value) => {
        if (err) return cb(err)
        var rootMsg = { key: id, value: value }
        pull(
          sbot.backlinks && sbot.backlinks.read ? sbot.backlinks.read({
            query: [
              {
                $filter: {
                  dest: id,
                  value: {
                    content: {

                      root: id
                    }
                  }
                }
              }
            ]
          }) : pull(
            sbot.links({ dest: id, values: true, rel: 'root' }),
            pull.filter(function (msg) {
              var c = msg && msg.value && msg.value.content
              return c && c.type === 'post' && c.root === id
            }),
            pull.unique('key')
          ),
          this.filterTypes(),
          this.filterWithUserFilters(),
          this.filterLimit(),
          pull.collect((err, msgs) => {
            if (err) reject(err)
            resolve(sort([rootMsg].concat(msgs)))
          })
        )
      })
    })
  }

  mentions(feed, lt) {
    return new Promise((resolve, reject) => {
      const createBacklinkStream = id => {
        var filterQuery = {
          $filter: {
            dest: id
          }
        };
    
        if (lt) {
          filterQuery.$filter.value = { timestamp: { $lt: lt } };
        }
    
        return sbot.backlinks.read({
          query: [filterQuery],
          index: "DTA", // use asserted timestamps
          reverse: true,
        });
      };
    
      const uniqueRoots = msg => {
        return pull.filter(msg => {
          let msgKey = msg.key;
          if (msg.value.content.type !== "post") {
            return true;
          }
          let rootKey = msg.value.content.root || false;
          if (rootKey) {
            if (msgs.some(m => m.value.content.root === rootKey)) {
              return false;
            }
          }
          return true;
        });
      };
    
      const mentionUser = msg => {
        return pull.filter(msg => {
          if (msg.value.content.type !== "post") {
            return true;
          }
          let mentions = msg.value.content.mentions || [];
          if (mentions.some(m => m.link == sbot.id)) {
            return true;
          }
          return false;
        });
      };

      pull(
        createBacklinkStream(sbot.id),
        this.filterTypes(),
        this.filterWithUserFilters(),
        this.filterLimit(),
        pull.collect((err, msgs) => {
          if (err) {
            reject(err)
          } else {
            resolve(msgs)
          }
        })
      );
    })
  }

  async profile(feedid) {
    try {
      var user = await hermiebox.api.profile(feedid)
      return user

    } catch (n) {
      console.error(n)
      return false
    }
  }

  async get(msgid) {
    var msg = await hermiebox.api.get(msgid)
    return msg
  }

  async setAvatarCache(feed, data) {
    let s = {}
    s[`avatar-${feed}`] = data
    return browser.storage.local.set(s)
  }

  async getCachedAvatar(feed) {
    return browser.storage.local.get(`avatar-${feed}`)
  }

  async avatar(feed) {
    if (avatarCache[feed]) {
      return avatarCache[feed]
    }
    try {
      let avatar = await hermiebox.api.avatar(feed)
      // await this.setAvatarCache(feed, avatar)
      avatarCache[feed] = avatar
      return avatar
    } catch (n) {
      throw n
    }

  }

  async blurbFromMsg(msgid, howManyChars) {
    let retVal = msgid

    try {
      let data = await ssb.get(msgid)

      if (data.content.type == "post") {
        retVal = this.plainTextFromMarkdown(data.content.text.slice(0, howManyChars) + "...")
      }
      return retVal
    } catch (n) {
      return retVal
    }
  }
  plainTextFromMarkdown(text) {
    // TODO: this doesn't belong here
    let html = this.markdown(text)
    let div = document.createElement("div")
    div.innerHTML = html
    return div.innerText
  }

  markdown(text) {

    function replaceMsgID(match, id, offset, string) {
      let eid = encodeURIComponent(`%${id}`);

      return `<a class="thread-link" href="?thread=${eid}#/thread`;
    }

    function replaceChannel(match, id, offset, string) {
      let eid = encodeURIComponent(id);

      return `<a class="channel-link" href="?channel=${eid}#/channel`;
    }


    function replaceFeedID(match, id, offset, string) {
      let eid = encodeURIComponent(`@${id}`);
      return "<a class=\"profile-link\" href=\"?feed=" + eid + "#/profile";
    }


    function replaceImageLinks(match, id, offset, string) {
      return "<a class=\"image-link\" target=\"_blank\" href=\"http://localhost:8989/blobs/get/&" + encodeURIComponent(id);
    }


    function replaceImages(match, id, offset, string) {
      return "<img class=\"is-image-from-blob\" src=\"http://localhost:8989/blobs/get/&" + encodeURIComponent(id);
    }

    let html = hermiebox.modules.ssbMarkdown.block(text)
    html = html
      .replace(/<pre>/gi, "<pre class=\"code\">")
      .replace(/<a href="#([^"]*)/gi, replaceChannel)
      .replace(/<a href="@([^"]*)/gi, replaceFeedID)
      .replace(/target="_blank"/gi, "")
      .replace(/<a href="%([^"]*)/gi, replaceMsgID)
      .replace(/<img src="&([^"]*)/gi, replaceImages)
      .replace(/<a href="&([^"]*)/gi, replaceImageLinks)

    return html
  }

  ref() {
    return hermiebox.modules.ssbRef
  }

  getTimestamp(msg) {
    const arrivalTimestamp = msg.timestamp;
    const declaredTimestamp = msg.value.timestamp;
    return Math.min(arrivalTimestamp, declaredTimestamp);
  }

  getRootMsgId(msg) {
    if (msg && msg.value && msg.value.content) {
      const root = msg.value.content.root;
      if (hermiebox.modules.ssbRef.isMsgId(root)) {
        return root;
      }
    }
  }

  newPost(data) {
    return new Promise((resolve, reject) => {
      let msgToPost = { type: "post", text: data.text }

      const commonFields = [
        "root",
        "branch",
        "channel",
        "fork",
        "contentWarning"
      ]

      commonFields.forEach(f => {
        if (typeof data[f] !== "undefined") {
          msgToPost[f] = data[f]
        }
      })

      msgToPost.mentions = hermiebox.modules.ssbMentions(msgToPost.text) || []
      msgToPost.mentions = msgToPost.mentions.filter(n => n) // prevent null elements...

      const sbot = hermiebox.sbot || false

      console.log("post", msgToPost)

      if (sbot) {
        sbot.publish(msgToPost, function (err, msg) {
          if (err) {
            reject(err)
          } else {
            resolve(msg)
          }
        })
      } else {
        reject("There is no sbot connection")
      }
    })
  }

  follow(userId) {
    return new Promise((resolve, reject) => {
      const sbot = hermiebox.sbot || false

      if (sbot) {
        sbot.publish({
          type: "contact",
          contact: userId,
          following: true
        }, (err, msg) => {
          // 'msg' includes the hash-id and headers
          if (err) {
            reject(err)
          } else {
            resolve(msg)
          }
        })
      }
    })
  }


  getBlob(blobid) {
    return hermiebox.api.getBlob(blobid)
  }

  votes(msgid) {
    return new Promise((resolve, reject) => {
      let pull = hermiebox.modules.pullStream
      let sbot = hermiebox.sbot

      if (sbot) {
        pull(
          sbot.links({ dest: msgid, rel: "vote", values: true }),
          pull.collect((err, msgs) => {
            if (err) {
              reject(err)
            } else {
              resolve(msgs)
            }
          })
        )
      }
    })
  }

  like(msgid) {
    return new Promise((resolve, reject) => {

      const sbot = hermiebox.sbot || false

      const msgToPost = {
        "type": "vote",
        "vote": {
          "link": msgid,
          "value": 1,
          "expression": "Like"
        }
      }

      if (sbot) {
        sbot.publish(msgToPost, function (err, msg) {
          if (err) {
            reject(err)
          } else {
            resolve(msg)
          }
        })
      }
    })
  }

  unlike(msgid) {
    return new Promise((resolve, reject) => {
      const sbot = hermiebox.sbot || false

      const msgToPost = {
        "type": "vote",
        "vote": {
          "link": msgid,
          "value": 0,
          "expression": "Unlike"
        }
      }

      if (sbot) {
        sbot.publish(msgToPost, function (err, msg) {
          if (err) {
            reject(err)
          } else {
            resolve(msg)
          }
        })
      }
    })
  }

  channels() {
    return new Promise((resolve, reject) => {
      let pull = hermiebox.modules.pullStream
      let sbot = hermiebox.sbot || false

      if (sbot) {
        console.log("querying channels")
        pull(
          sbot.query.read({
            query: [
              { "$filter": { "value": { "content": { "channel": { "$is": "string" }, "type": "post" } } } },
              {
                "$reduce": {
                  "channel": ["value", "content", "channel"],
                  "count": { "$count": true },
                  "timestamp": { "$max": ["value", "timestamp"] }
                }
              },
              { "$sort": [["timestamp"], ["count"]] }
            ],
            limit: 20
          }),
          pull.collect(function (err, data) {
            console.log("channels", data)
            if (err) {
              reject(err)
            } else {
              resolve(data)
            }
          })
        )
      } else {
        reject("no sbot")
      }
    })
  }

  channel(channel, opts) {
    return new Promise((resolve, reject) => {
      let pull = hermiebox.modules.pullStream
      let sbot = hermiebox.sbot || false
      let query = {
        "$filter": {
          value: {
            content: { channel }
          }
        }
      }

      if (opts.lt) {
        query.$filter.value.timestamp = { $lt: opts.lt }
      }

      if (sbot) {
        pull(
          sbot.query.read({
            query: [
              query
            ],
            reverse: true
          }),
          this.filterTypes(),
          this.filterWithUserFilters(),
          this.filterLimit(),
          pull.collect(function (err, data) {
            if (err) {
              reject(err)
            } else {
              resolve(data)
            }
          })
        )
      } else {
        reject("no sbot")
      }
    })
  }

  channelSubscribe(channel) {
    return new Promise((resolve, reject) => {
      const sbot = hermiebox.sbot || false

      const msgToPost = {
        "type": "channel",
        "channel": channel,
        "subscribed": true
      }

      if (sbot) {
        sbot.publish(msgToPost, function (err, msg) {
          if (err) {
            reject(err)
          } else {
            resolve(msg)
          }
        })
      }
    })
  }

  channelUnsubscribe(channel) {
    return new Promise((resolve, reject) => {
      const sbot = hermiebox.sbot || false

      const msgToPost = {
        "type": "channel",
        "channel": channel,
        "subscribed": false
      }

      if (sbot) {
        sbot.publish(msgToPost, function (err, msg) {
          if (err) {
            reject(err)
          } else {
            resolve(msg)
          }
        })
      }
    })
  }

  channelSubscribed(channel, feed) {
    return new Promise((resolve, reject) => {
      let pull = hermiebox.modules.pullStream
      let sbot = hermiebox.sbot || false

      if (sbot) {
        if (!feed) {
          feed = sbot.id
        }

        let query = {
          "$filter": {
            value: {
              author: feed,
              content: {
                type: "channel",
                channel
              }
            }
          }
        }


        pull(
          sbot.query.read({
            query: [
              query
            ],
            reverse: true
          }),
          pull.collect(function (err, data) {
            if (err) {
              reject(err)
            } else {
              if (data.length > 0) {
                resolve(data[0].value.content.subscribed || false)
              } else {
                resolve(false)
              }
            }
          })
        )
      } else {
        reject("no sbot")
      }
    })
  }

  subscribedChannels(channel, feed) {
    return new Promise((resolve, reject) => {
      let pull = hermiebox.modules.pullStream
      let sbot = hermiebox.sbot || false

      if (sbot) {
        if (!feed) {
          feed = sbot.id
        }

        let query = {
          "$filter": {
            value: {
              author: feed,
              content: {
                type: "channel"
              }
            }
          },
          "$map": {
            channel: ["value", "content", "channel"],
            subscribed: ["value", "content", "subscribed"]
          },
          "$sort": [["value", "timestamp"]]
        }


        pull(
          sbot.query.read({
            query: [
              query
            ],
            reverse: true
          }),
          pull.collect(function (err, data) {
            if (err) {
              reject(err)
            } else {
              resolve(data)
            }
          })
        )
      } else {
        reject("no sbot")
      }
    })
  }

  follow(feed) {
    return new Promise((resolve, reject) => {
      const sbot = hermiebox.sbot || false

      const msgToPost = {
        "type": "contact",
        "contact": feed,
        "following": true
      }

      if (sbot) {
        sbot.publish(msgToPost, function (err, msg) {
          if (err) {
            reject(err)
          } else {
            resolve(msg)
          }
        })
      }
    })
  }

  unfollow(feed) {
    return new Promise((resolve, reject) => {
      const sbot = hermiebox.sbot || false

      const msgToPost = {
        "type": "contact",
        "contact": feed,
        "following": false
      }

      if (sbot) {
        sbot.publish(msgToPost, function (err, msg) {
          if (err) {
            reject(err)
          } else {
            resolve(msg)
          }
        })
      }
    })
  }

  block(feed) {
    return new Promise((resolve, reject) => {
      const sbot = hermiebox.sbot || false

      const msgToPost = {
        "type": "contact",
        "contact": feed,
        "blocking": true
      }

      if (sbot) {
        sbot.publish(msgToPost, function (err, msg) {
          if (err) {
            reject(err)
          } else {
            resolve(msg)
          }
        })
      }
    })
  }

  unblock(feed) {
    return new Promise((resolve, reject) => {
      const sbot = hermiebox.sbot || false

      const msgToPost = {
        "type": "contact",
        "contact": feed,
        "blocking": false
      }

      if (sbot) {
        sbot.publish(msgToPost, function (err, msg) {
          if (err) {
            reject(err)
          } else {
            resolve(msg)
          }
        })
      }
    })
  }

  following(feed, byWhom) {
    return new Promise((resolve, reject) => {
      let pull = hermiebox.modules.pullStream
      let sbot = hermiebox.sbot || false

      if (sbot) {
        if (!byWhom) {
          byWhom = sbot.id
        }

        let query = {
          "$filter": {
            value: {
              author: byWhom,
              content: {
                type: "contact",
                contact: feed,
                following: { $is: "boolean" }
              }
            }
          }
        }


        pull(
          sbot.query.read({
            query: [
              query
            ],
            reverse: true
          }),
          pull.collect(function (err, data) {
            if (err) {
              reject(err)
            } else {
              if (data.length > 0) {
                resolve(data[0].value.content.following || false)
              } else {
                resolve(false)
              }
            }
          })
        )
      } else {
        reject("no sbot")
      }
    })
  }

  blocking(feed, byWhom) {
    return new Promise((resolve, reject) => {
      let pull = hermiebox.modules.pullStream
      let sbot = hermiebox.sbot || false

      if (sbot) {
        if (!byWhom) {
          byWhom = sbot.id
        }

        let query = {
          "$filter": {
            value: {
              author: byWhom,
              content: {
                type: "contact",
                contact: feed,
                blocking: { $is: "boolean" }
              }
            }
          }
        }


        pull(
          sbot.query.read({
            query: [
              query
            ],
            reverse: true
          }),
          pull.collect(function (err, data) {
            if (err) {
              reject(err)
            } else {
              if (data.length > 0) {
                resolve(data[0].value.content.blocking || false)
              } else {
                resolve(false)
              }
            }
          })
        )
      } else {
        reject("no sbot")
      }
    })
  }

  query(filter, reverse, map, reduce) {
    return new Promise((resolve, reject) => {
      if (sbot) {

        let query = {
          "$filter": filter
        }

        if (map) {
          query.$map = map
        }

        if (reduce) {
          query.$reduce = reduce
        }

        if (typeof reverse == "undefined") {
          reverse = true
        }

        pull(
          sbot.query.read({
            query: [
              query
            ],
            reverse: reverse
          }),
          this.filterTypes(),
          this.filterLimit(),
          pull.collect( (err, data) => {
            if (err) {
              reject(err)
            } else {
              resolve(data)
            }
          })
        )
      } else {
        reject("no sbot")
      }
    })
  }
}


/***/ }),

/***/ "./src/ui/utils.js":
/*!*************************!*\
  !*** ./src/ui/utils.js ***!
  \*************************/
/*! exports provided: parseLocation, intercept, connected, route, routeParams, routeLocation, navigate, currentView, loadConfiguration, connect, reconnect, keepPinging, getPref, setConnectionConfiguration, setPref */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "parseLocation", function() { return parseLocation; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "intercept", function() { return intercept; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "connected", function() { return connected; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "route", function() { return route; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "routeParams", function() { return routeParams; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "routeLocation", function() { return routeLocation; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "navigate", function() { return navigate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "currentView", function() { return currentView; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "loadConfiguration", function() { return loadConfiguration; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "connect", function() { return connect; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "reconnect", function() { return reconnect; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "keepPinging", function() { return keepPinging; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getPref", function() { return getPref; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setConnectionConfiguration", function() { return setConnectionConfiguration; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setPref", function() { return setPref; });
/* harmony import */ var svelte_store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! svelte/store */ "./node_modules/svelte/store.mjs");
/* harmony import */ var _ssb_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ssb.js */ "./src/ui/ssb.js");
/* harmony import */ var query_string__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! query-string */ "./node_modules/query-string/index.js");
/* harmony import */ var query_string__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(query_string__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _views_Public_svelte__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./views/Public.svelte */ "./src/ui/views/Public.svelte");
/* harmony import */ var _views_Default_svelte__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./views/Default.svelte */ "./src/ui/views/Default.svelte");
/* harmony import */ var _views_Compose_svelte__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./views/Compose.svelte */ "./src/ui/views/Compose.svelte");
/* harmony import */ var _views_Thread_svelte__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./views/Thread.svelte */ "./src/ui/views/Thread.svelte");
/* harmony import */ var _views_Profile_svelte__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./views/Profile.svelte */ "./src/ui/views/Profile.svelte");
/* harmony import */ var _views_ErrorView_svelte__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./views/ErrorView.svelte */ "./src/ui/views/ErrorView.svelte");
/* harmony import */ var _views_Channels_svelte__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./views/Channels.svelte */ "./src/ui/views/Channels.svelte");
/* harmony import */ var _views_Channel_svelte__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./views/Channel.svelte */ "./src/ui/views/Channel.svelte");
/* harmony import */ var _views_Settings_svelte__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./views/Settings.svelte */ "./src/ui/views/Settings.svelte");
/* harmony import */ var _views_Mentions_svelte__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./views/Mentions.svelte */ "./src/ui/views/Mentions.svelte");















let savedData = {}

const parseLocation = () => {
  let data = query_string__WEBPACK_IMPORTED_MODULE_2___default.a.parse(window.location.search)
  let loc = window.location.hash.slice(1).replace("?", "")
  return { data, location: loc }
};

const intercept = () => {
  let r = parseLocation()
  if (r.location == "/intercept" && r.data.query) {
    let hash = r.data.query.replace("ssb:", "")
    let sigil = hash[0]
    switch (sigil) {
      case "%":
        window.location = `/index.html?thread=${encodeURIComponent(hash)}#/thread`
        break
      case "&":
        window.location = `http://localhost:8989/blobs/get/${hash}`
        break
      case "@":
        window.location = `/index.html?feed=${encodeURIComponent(hash)}#/profile`
        break
      case "#":
        window.location = `/index.html?channel=${hash.replace("#","")}#/channel` 
        break
    }
  }
}

const connected = Object(svelte_store__WEBPACK_IMPORTED_MODULE_0__["writable"])(false);

// maybe in the future, migrate routing system to:
// https://github.com/ItalyPaleAle/svelte-spa-router
const route = Object(svelte_store__WEBPACK_IMPORTED_MODULE_0__["writable"])(parseLocation());
const routeParams = Object(svelte_store__WEBPACK_IMPORTED_MODULE_0__["derived"])(route, $route => $route.data)
const routeLocation = Object(svelte_store__WEBPACK_IMPORTED_MODULE_0__["derived"])(route, $route => $route.location)

const navigate = (location, data) => {
  data = data || {}
  route.set({ location, data });
  let dataAsQuery = query_string__WEBPACK_IMPORTED_MODULE_2___default.a.stringify(data);
  history.pushState({ location, data }, `Patchfox - ${location}`, `/index.html?${dataAsQuery}#${location}`);
  console.log(`Navigate ${location}`, data);
};


const routes = {
  "/thread": _views_Thread_svelte__WEBPACK_IMPORTED_MODULE_6__["default"],
  "/public": _views_Public_svelte__WEBPACK_IMPORTED_MODULE_3__["default"],
  "/compose": _views_Compose_svelte__WEBPACK_IMPORTED_MODULE_5__["default"],
  "/profile": _views_Profile_svelte__WEBPACK_IMPORTED_MODULE_7__["default"],
  "/error": _views_ErrorView_svelte__WEBPACK_IMPORTED_MODULE_8__["default"],
  "/channels": _views_Channels_svelte__WEBPACK_IMPORTED_MODULE_9__["default"],
  "/channel": _views_Channel_svelte__WEBPACK_IMPORTED_MODULE_10__["default"],
  "/settings": _views_Settings_svelte__WEBPACK_IMPORTED_MODULE_11__["default"],
  "/mentions": _views_Mentions_svelte__WEBPACK_IMPORTED_MODULE_12__["default"],
  "*": _views_Default_svelte__WEBPACK_IMPORTED_MODULE_4__["default"]
};



const currentView = Object(svelte_store__WEBPACK_IMPORTED_MODULE_0__["derived"])([connected, route], ([$connected, $route]) => {
  let r = $route.location
  if ($connected) {
    if (routes.hasOwnProperty(r)) {
      return routes[r];
    } else {
      console.log("didn't find", r);
      return routes["*"];
    }
  } else {
    if (r === "/settings") {
      return _views_Settings_svelte__WEBPACK_IMPORTED_MODULE_11__["default"]
    } else {
      return routes["*"];
    }
  }


});


/// connection stuff

const configurationMissing = () => {
  console.log("config missing");
  window.location = "/docs/index.html#/troubleshooting/no-configuration";
};

const cantConnect = () => {
  console.log("config missing");
  window.location = "/docs/index.html#/troubleshooting/no-connection";
};

const loadConfiguration = async () => {
  console.log("Loading configuration...")
  try {
    let data = await browser.storage.local.get()

    if (data.hasOwnProperty("keys")) {
      savedData = data
    } else {
      throw "Configuration is missing"
    }
  } catch (n) {
    throw "Configuration is missing"
  }
}

const connect = async () => {
  console.log("Connecting to sbot...")
  window.ssb = new _ssb_js__WEBPACK_IMPORTED_MODULE_1__["SSB"]();

  try {
    await ssb.connect(savedData.keys)
    connected.set(true);
  } catch (err) {
    console.error("can't connect", err);
    connected.set(false)
    throw "Can't connect to sbot"
  }
}

const reconnect = () => {
  return new Promise((resolve, reject) => {
    const tryConnect = (data) => {
      window.ssb = new _ssb_js__WEBPACK_IMPORTED_MODULE_1__["SSB"]();

      ssb
        .connect(data.keys)
        .then(data => {
          console.log("connected");
          connected.set(true);
          resolve()
        })
        .catch(err => {
          console.error("can't reconnect", err);
          reject(err);
        });
    }

    browser.storage.local
      .get()
      .then(tryConnect, reject);
  })
}

const keepPinging = () => {
  let interval = setInterval(() => {
    if (hermiebox.sbot) {
      hermiebox.sbot.whoami((err, v) => {
        if (err) {
          console.error("can't call whoami", err);
          reconnect().catch(n => {
            console.error("can't reconnect");
            clearInterval(interval);
            navigate("/error", { error: n });
          });
        }
      });
    }
  }, 5000);
}

// Preferences

const getPref = (key, defaultValue) => {
  if (savedData.preferences) {
    if (savedData.preferences.hasOwnProperty(key)) {
      return savedData.preferences[key]
    }
  }
  return defaultValue
}

const setConnectionConfiguration = ({ keys, remote, manifest }) => {
  savedData.keys = keys
  savedData.remote = remote
  savedData.manifest = manifest

  browser.storage.local.set(savedData)

}

const setPref = (key, value) => {
  savedData.preferences = savedData.preferences || {}
  savedData.preferences[key] = value

  browser.storage.local.set(savedData)
}


/***/ }),

/***/ "./src/ui/views/Channel.svelte":
/*!*************************************!*\
  !*** ./src/ui/views/Channel.svelte ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var svelte_internal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! svelte/internal */ "./node_modules/svelte/internal.mjs");
/* harmony import */ var _messageTypes_MessageRenderer_svelte__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../messageTypes/MessageRenderer.svelte */ "./src/ui/messageTypes/MessageRenderer.svelte");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils.js */ "./src/ui/utils.js");
/* harmony import */ var svelte__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! svelte */ "./node_modules/svelte/index.mjs");
/* src\ui\views\Channel.svelte generated by Svelte v3.4.4 */





function get_each_context(ctx, list, i) {
	const child_ctx = Object.create(ctx);
	child_ctx.msg = list[i];
	return child_ctx;
}

// (102:0) {#if error}
function create_if_block_1(ctx) {
	var div, t0, t1;

	return {
		c() {
			div = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");
			t0 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])("Error: ");
			t1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])(ctx.error);
			div.className = "toast toast-error";
		},

		m(target, anchor) {
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, div, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div, t0);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div, t1);
		},

		p: svelte_internal__WEBPACK_IMPORTED_MODULE_0__["noop"],

		d(detaching) {
			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(div);
			}
		}
	};
}

// (107:0) {:else}
function create_else_block(ctx) {
	var each_blocks = [], each_1_lookup = new Map(), t0, ul, li0, a0, t2, li1, a1, current, dispose;

	var each_value = ctx.msgs;

	const get_key = ctx => ctx.msg.key;

	for (var i = 0; i < each_value.length; i += 1) {
		let child_ctx = get_each_context(ctx, each_value, i);
		let key = get_key(child_ctx);
		each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
	}

	var each_1_else = null;

	if (!each_value.length) {
		each_1_else = create_else_block_1(ctx);
		each_1_else.c();
	}

	return {
		c() {
			for (i = 0; i < each_blocks.length; i += 1) each_blocks[i].c();

			t0 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			ul = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("ul");
			li0 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("li");
			a0 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("a");
			a0.innerHTML = `<div class="page-item-subtitle">Previous</div>`;
			t2 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			li1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("li");
			a1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("a");
			a1.innerHTML = `<div class="page-item-subtitle">Next</div>`;
			a0.href = "#/public";
			li0.className = "page-item page-previous";
			a1.href = "#/public";
			li1.className = "page-item page-next";
			ul.className = "pagination";

			dispose = [
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(a0, "click", Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["stop_propagation"])(Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["prevent_default"])(ctx.goPrevious))),
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(a1, "click", Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["stop_propagation"])(Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["prevent_default"])(ctx.goNext)))
			];
		},

		m(target, anchor) {
			for (i = 0; i < each_blocks.length; i += 1) each_blocks[i].m(target, anchor);

			if (each_1_else) {
				each_1_else.m(target, null);
			}

			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, t0, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, ul, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(ul, li0);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(li0, a0);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(ul, t2);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(ul, li1);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(li1, a1);
			current = true;
		},

		p(changed, ctx) {
			const each_value = ctx.msgs;

			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["group_outros"])();
			each_blocks = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["update_keyed_each"])(each_blocks, changed, get_key, 1, ctx, each_value, each_1_lookup, t0.parentNode, svelte_internal__WEBPACK_IMPORTED_MODULE_0__["outro_and_destroy_block"], create_each_block, t0, get_each_context);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["check_outros"])();

			if (each_value.length) {
				if (each_1_else) {
					each_1_else.d(1);
					each_1_else = null;
				}
			} else if (!each_1_else) {
				each_1_else = create_else_block_1(ctx);
				each_1_else.c();
				each_1_else.m(t0.parentNode, t0);
			}
		},

		i(local) {
			if (current) return;
			for (var i = 0; i < each_value.length; i += 1) each_blocks[i].i();

			current = true;
		},

		o(local) {
			for (i = 0; i < each_blocks.length; i += 1) each_blocks[i].o();

			current = false;
		},

		d(detaching) {
			for (i = 0; i < each_blocks.length; i += 1) each_blocks[i].d(detaching);

			if (each_1_else) each_1_else.d(detaching);

			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(t0);
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(ul);
			}

			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["run_all"])(dispose);
		}
	};
}

// (105:0) {#if !msgs}
function create_if_block(ctx) {
	var div;

	return {
		c() {
			div = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");
			div.className = "loading loading-lg";
		},

		m(target, anchor) {
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, div, anchor);
		},

		p: svelte_internal__WEBPACK_IMPORTED_MODULE_0__["noop"],
		i: svelte_internal__WEBPACK_IMPORTED_MODULE_0__["noop"],
		o: svelte_internal__WEBPACK_IMPORTED_MODULE_0__["noop"],

		d(detaching) {
			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(div);
			}
		}
	};
}

// (110:2) {:else}
function create_else_block_1(ctx) {
	var p;

	return {
		c() {
			p = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("p");
			p.textContent = "No messages.";
		},

		m(target, anchor) {
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, p, anchor);
		},

		d(detaching) {
			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(p);
			}
		}
	};
}

// (108:2) {#each msgs as msg (msg.key)}
function create_each_block(key_1, ctx) {
	var first, current;

	var messagerenderer = new _messageTypes_MessageRenderer_svelte__WEBPACK_IMPORTED_MODULE_1__["default"]({ props: { msg: ctx.msg } });

	return {
		key: key_1,

		first: null,

		c() {
			first = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["empty"])();
			messagerenderer.$$.fragment.c();
			this.first = first;
		},

		m(target, anchor) {
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, first, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["mount_component"])(messagerenderer, target, anchor);
			current = true;
		},

		p(changed, ctx) {
			var messagerenderer_changes = {};
			if (changed.msgs) messagerenderer_changes.msg = ctx.msg;
			messagerenderer.$set(messagerenderer_changes);
		},

		i(local) {
			if (current) return;
			messagerenderer.$$.fragment.i(local);

			current = true;
		},

		o(local) {
			messagerenderer.$$.fragment.o(local);
			current = false;
		},

		d(detaching) {
			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(first);
			}

			messagerenderer.$destroy(detaching);
		}
	};
}

function create_fragment(ctx) {
	var div3, div2, div0, h4, t0, t1, t2, div1, label, input, t3, i, t4, t5, button, t6, button_href_value, t7, t8, current_block_type_index, if_block1, if_block1_anchor, current, dispose;

	var if_block0 = (ctx.error) && create_if_block_1(ctx);

	var if_block_creators = [
		create_if_block,
		create_else_block
	];

	var if_blocks = [];

	function select_block_type(ctx) {
		if (!ctx.msgs) return 0;
		return 1;
	}

	current_block_type_index = select_block_type(ctx);
	if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

	return {
		c() {
			div3 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");
			div2 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");
			div0 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");
			h4 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("h4");
			t0 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])("Channel: #");
			t1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])(ctx.channel);
			t2 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			div1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");
			label = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("label");
			input = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("input");
			t3 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			i = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("i");
			t4 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])("\r\n        Subscribe");
			t5 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			button = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("button");
			t6 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])("New Post");
			t7 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			if (if_block0) if_block0.c();
			t8 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			if_block1.c();
			if_block1_anchor = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["empty"])();
			div0.className = "column";
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["attr"])(input, "type", "checkbox");
			i.className = "form-icon";
			label.className = "form-switch float-right";
			button.className = "btn btn-link float-right";
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["attr"])(button, "href", button_href_value = "?channel=" + ctx.channel + "#/compose");
			div1.className = "column";
			div2.className = "columns";
			div3.className = "container";

			dispose = [
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(input, "change", ctx.input_change_handler),
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(input, "change", ctx.subscriptionChanged),
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(button, "click", Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["prevent_default"])(ctx.click_handler))
			];
		},

		m(target, anchor) {
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, div3, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div3, div2);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div2, div0);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div0, h4);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(h4, t0);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(h4, t1);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div2, t2);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div2, div1);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div1, label);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(label, input);

			input.checked = ctx.subscribed;

			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(label, t3);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(label, i);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(label, t4);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div1, t5);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div1, button);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(button, t6);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, t7, anchor);
			if (if_block0) if_block0.m(target, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, t8, anchor);
			if_blocks[current_block_type_index].m(target, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, if_block1_anchor, anchor);
			current = true;
		},

		p(changed, ctx) {
			if (changed.subscribed) input.checked = ctx.subscribed;

			if (ctx.error) {
				if (if_block0) {
					if_block0.p(changed, ctx);
				} else {
					if_block0 = create_if_block_1(ctx);
					if_block0.c();
					if_block0.m(t8.parentNode, t8);
				}
			} else if (if_block0) {
				if_block0.d(1);
				if_block0 = null;
			}

			var previous_block_index = current_block_type_index;
			current_block_type_index = select_block_type(ctx);
			if (current_block_type_index === previous_block_index) {
				if_blocks[current_block_type_index].p(changed, ctx);
			} else {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["group_outros"])();
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["on_outro"])(() => {
					if_blocks[previous_block_index].d(1);
					if_blocks[previous_block_index] = null;
				});
				if_block1.o(1);
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["check_outros"])();

				if_block1 = if_blocks[current_block_type_index];
				if (!if_block1) {
					if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
					if_block1.c();
				}
				if_block1.i(1);
				if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
			}
		},

		i(local) {
			if (current) return;
			if (if_block1) if_block1.i();
			current = true;
		},

		o(local) {
			if (if_block1) if_block1.o();
			current = false;
		},

		d(detaching) {
			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(div3);
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(t7);
			}

			if (if_block0) if_block0.d(detaching);

			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(t8);
			}

			if_blocks[current_block_type_index].d(detaching);

			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(if_block1_anchor);
			}

			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["run_all"])(dispose);
		}
	};
}

function instance($$self, $$props, $$invalidate) {
	let $routeParams;

	Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["subscribe"])($$self, _utils_js__WEBPACK_IMPORTED_MODULE_2__["routeParams"], $$value => { $routeParams = $$value; $$invalidate('$routeParams', $routeParams); });

	

  let msgs = false;
  let error = $routeParams.error || false;
  let channel = $routeParams.channel || false;
  let subscribed = false;

  if (!channel) {
    console.log("can't navigate to unnamed channel, going back to public");
    location = "index.html#/public"; // force reload.
  }

  let opts = {
    limit: $routeParams.limit || Object(_utils_js__WEBPACK_IMPORTED_MODULE_2__["getPref"])("limit", 10),
    reverse: true
  };

  ssb.channelSubscribed(channel).then(s => { const $$result = (subscribed = s); $$invalidate('subscribed', subscribed); return $$result; });

  const subscriptionChanged = ev => {
    let v = ev.target.checked;
    if (v) {
      ssb.channelSubscribe(channel).catch(() => { const $$result = (subscribed = false); $$invalidate('subscribed', subscribed); return $$result; });
    } else {
      ssb.channelUnsubscribe(channel).catch(() => { const $$result = (subscribed = true); $$invalidate('subscribed', subscribed); return $$result; });
    }
  };

  const goNext = () => {
    Object(_utils_js__WEBPACK_IMPORTED_MODULE_2__["navigate"])("/channel", {
      channel,
      lt: msgs[msgs.length - 1].rts
    });
  };
  const goPrevious = () => {
    history.back();
  };

	function input_change_handler() {
		subscribed = this.checked;
		$$invalidate('subscribed', subscribed);
	}

	function click_handler() {
		return Object(_utils_js__WEBPACK_IMPORTED_MODULE_2__["navigate"])('/compose', { channel });
	}

	$$self.$$.update = ($$dirty = { opts: 1, $routeParams: 1, channel: 1, error: 1 }) => {
		if ($$dirty.opts || $$dirty.$routeParams || $$dirty.channel || $$dirty.error) { {
        Object.assign(opts, $routeParams);
    
        document.title = `Patchfox - #${channel}`;
    
        if (opts.hasOwnProperty("lt")) {
          opts.lt = parseInt(opts.lt); $$invalidate('opts', opts), $$invalidate('$routeParams', $routeParams), $$invalidate('channel', channel), $$invalidate('error', error);
        }
    
        if (opts.hasOwnProperty("limit")) {
          opts.limit = parseInt(opts.limit); $$invalidate('opts', opts), $$invalidate('$routeParams', $routeParams), $$invalidate('channel', channel), $$invalidate('error', error);
        }
    
        let promise = ssb
          .channel(channel, opts)
          .then(ms => {
            console.log("msg", ms);
            $$invalidate('msgs', msgs = ms);
            window.scrollTo(0, 0);
          })
          .catch(n => {
            if (!error) {
              console.error("errrrooooor", n);
            }
          });
      } }
	};

	return {
		msgs,
		error,
		channel,
		subscribed,
		subscriptionChanged,
		goNext,
		goPrevious,
		input_change_handler,
		click_handler
	};
}

class Channel extends svelte_internal__WEBPACK_IMPORTED_MODULE_0__["SvelteComponent"] {
	constructor(options) {
		super();
		Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["init"])(this, options, instance, create_fragment, svelte_internal__WEBPACK_IMPORTED_MODULE_0__["safe_not_equal"], []);
	}
}


if (false) {}

/* harmony default export */ __webpack_exports__["default"] = (Channel);


/***/ }),

/***/ "./src/ui/views/Channels.svelte":
/*!**************************************!*\
  !*** ./src/ui/views/Channels.svelte ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var svelte_internal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! svelte/internal */ "./node_modules/svelte/internal.mjs");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils.js */ "./src/ui/utils.js");
/* harmony import */ var C_Users_andre_prog_ssbc_patchfox_src_ui_views_Channels_svelte_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./src/ui/views/Channels.svelte.css */ "./src/ui/views/Channels.svelte.css");
/* harmony import */ var C_Users_andre_prog_ssbc_patchfox_src_ui_views_Channels_svelte_css__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(C_Users_andre_prog_ssbc_patchfox_src_ui_views_Channels_svelte_css__WEBPACK_IMPORTED_MODULE_2__);
/* src\ui\views\Channels.svelte generated by Svelte v3.4.4 */



function get_each_context(ctx, list, i) {
	const child_ctx = Object.create(ctx);
	child_ctx.c = list[i];
	return child_ctx;
}

// (69:0) {:else}
function create_else_block(ctx) {
	var each_1_anchor;

	var each_value = ctx.subscribedChannels;

	var each_blocks = [];

	for (var i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
	}

	return {
		c() {
			for (var i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			each_1_anchor = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["empty"])();
		},

		m(target, anchor) {
			for (var i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(target, anchor);
			}

			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, each_1_anchor, anchor);
		},

		p(changed, ctx) {
			if (changed.subscribedChannels) {
				each_value = ctx.subscribedChannels;

				for (var i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(changed, child_ctx);
					} else {
						each_blocks[i] = create_each_block(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}
				each_blocks.length = each_value.length;
			}
		},

		d(detaching) {
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["destroy_each"])(each_blocks, detaching);

			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(each_1_anchor);
			}
		}
	};
}

// (65:0) {#if subscribedChannels.length == 0}
function create_if_block(ctx) {
	var div, t, p;

	return {
		c() {
			div = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");
			t = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			p = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("p");
			p.textContent = "This is a complex query, it might take a while... Channels will appear as we find them";
			div.className = "loading";
		},

		m(target, anchor) {
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, div, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, t, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, p, anchor);
		},

		p: svelte_internal__WEBPACK_IMPORTED_MODULE_0__["noop"],

		d(detaching) {
			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(div);
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(t);
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(p);
			}
		}
	};
}

// (70:2) {#each subscribedChannels as c}
function create_each_block(ctx) {
	var span, t0, t1_value = ctx.c, t1, t2, dispose;

	function click_handler() {
		return ctx.click_handler(ctx);
	}

	return {
		c() {
			span = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("span");
			t0 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])("#");
			t1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])(t1_value);
			t2 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			span.className = "channel label label-secondary m-1 svelte-1or0a5q";
			dispose = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(span, "click", click_handler);
		},

		m(target, anchor) {
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, span, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(span, t0);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(span, t1);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(span, t2);
		},

		p(changed, new_ctx) {
			ctx = new_ctx;
			if ((changed.subscribedChannels) && t1_value !== (t1_value = ctx.c)) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["set_data"])(t1, t1_value);
			}
		},

		d(detaching) {
			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(span);
			}

			dispose();
		}
	};
}

function create_fragment(ctx) {
	var h4, t_1, if_block_anchor;

	function select_block_type(ctx) {
		if (ctx.subscribedChannels.length == 0) return create_if_block;
		return create_else_block;
	}

	var current_block_type = select_block_type(ctx);
	var if_block = current_block_type(ctx);

	return {
		c() {
			h4 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("h4");
			h4.textContent = "Subscribed Channels";
			t_1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			if_block.c();
			if_block_anchor = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["empty"])();
		},

		m(target, anchor) {
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, h4, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, t_1, anchor);
			if_block.m(target, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, if_block_anchor, anchor);
		},

		p(changed, ctx) {
			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
				if_block.p(changed, ctx);
			} else {
				if_block.d(1);
				if_block = current_block_type(ctx);
				if (if_block) {
					if_block.c();
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			}
		},

		i: svelte_internal__WEBPACK_IMPORTED_MODULE_0__["noop"],
		o: svelte_internal__WEBPACK_IMPORTED_MODULE_0__["noop"],

		d(detaching) {
			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(h4);
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(t_1);
			}

			if_block.d(detaching);

			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(if_block_anchor);
			}
		}
	};
}

function instance($$self, $$props, $$invalidate) {
	let activeChannels = [];
  let subscribedChannels = [];

  let loading = true;

  let pull = hermiebox.modules.pullStream;
  let sbot = hermiebox.sbot;

  const loadSubscribedChannels = () => {
    let query = {
      $filter: {
        value: {
          author: sbot.id,
          content: {
            type: "channel"
          }
        }
      },
      $sort: [["value", "timestamp"]]
    };
    pull(
      sbot.query.read({
        query: [query],
        live: true,
        reverse: true,
        limit: 500
      }),
      //pull.filter(c => {
      //  !subscribedChannels.some(sc => sc.channel == c.channel);
      //}),
      pull.drain(c => {
        if (c.sync) {
          console.log("finished loading");
          loading = false;
        } else {
          if (c.value.content.subscribed) {
            subscribedChannels.push(c.value.content.channel);
            $$invalidate('subscribedChannels', subscribedChannels);
          }
        }
      })
    );
  };

  loadSubscribedChannels();

	function click_handler({ c }) {
		return Object(_utils_js__WEBPACK_IMPORTED_MODULE_1__["navigate"])('/channel', { channel: c });
	}

	return { subscribedChannels, click_handler };
}

class Channels extends svelte_internal__WEBPACK_IMPORTED_MODULE_0__["SvelteComponent"] {
	constructor(options) {
		super();
		Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["init"])(this, options, instance, create_fragment, svelte_internal__WEBPACK_IMPORTED_MODULE_0__["safe_not_equal"], []);
	}
}


if (false) {}

/* harmony default export */ __webpack_exports__["default"] = (Channels);




/***/ }),

/***/ "./src/ui/views/Channels.svelte.css":
/*!******************************************!*\
  !*** ./src/ui/views/Channels.svelte.css ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../../node_modules/css-loader/dist/cjs.js!./Channels.svelte.css */ "./node_modules/css-loader/dist/cjs.js!./src/ui/views/Channels.svelte.css");

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(/*! ../../../node_modules/style-loader/lib/addStyles.js */ "./node_modules/style-loader/lib/addStyles.js")(content, options);

if(content.locals) module.exports = content.locals;

if(false) {}

/***/ }),

/***/ "./src/ui/views/Compose.svelte":
/*!*************************************!*\
  !*** ./src/ui/views/Compose.svelte ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var svelte_internal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! svelte/internal */ "./node_modules/svelte/internal.mjs");
/* harmony import */ var svelte__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! svelte */ "./node_modules/svelte/index.mjs");
/* harmony import */ var drag_and_drop_files__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! drag-and-drop-files */ "./node_modules/drag-and-drop-files/ondrop.js");
/* harmony import */ var drag_and_drop_files__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(drag_and_drop_files__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var svelte_transition__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! svelte/transition */ "./node_modules/svelte/transition.mjs");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils.js */ "./src/ui/utils.js");
/* harmony import */ var _parts_AvatarChip_svelte__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../parts/AvatarChip.svelte */ "./src/ui/parts/AvatarChip.svelte");
/* harmony import */ var C_Users_andre_prog_ssbc_patchfox_src_ui_views_Compose_svelte_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./src/ui/views/Compose.svelte.css */ "./src/ui/views/Compose.svelte.css");
/* harmony import */ var C_Users_andre_prog_ssbc_patchfox_src_ui_views_Compose_svelte_css__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(C_Users_andre_prog_ssbc_patchfox_src_ui_views_Compose_svelte_css__WEBPACK_IMPORTED_MODULE_6__);
/* src\ui\views\Compose.svelte generated by Svelte v3.4.4 */







// (222:6) {#if fork}
function create_if_block_12(ctx) {
	var div, t0, t1;

	return {
		c() {
			div = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");
			t0 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])("You are forking: ");
			t1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])(ctx.fork);
			div.className = "toast toast-warning";
		},

		m(target, anchor) {
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, div, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div, t0);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div, t1);
		},

		p: svelte_internal__WEBPACK_IMPORTED_MODULE_0__["noop"],

		d(detaching) {
			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(div);
			}
		}
	};
}

// (225:6) {#if msg}
function create_if_block_10(ctx) {
	var if_block_anchor;

	function select_block_type(ctx) {
		if (ctx.error) return create_if_block_11;
		return create_else_block_1;
	}

	var current_block_type = select_block_type(ctx);
	var if_block = current_block_type(ctx);

	return {
		c() {
			if_block.c();
			if_block_anchor = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["empty"])();
		},

		m(target, anchor) {
			if_block.m(target, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, if_block_anchor, anchor);
		},

		p(changed, ctx) {
			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
				if_block.p(changed, ctx);
			} else {
				if_block.d(1);
				if_block = current_block_type(ctx);
				if (if_block) {
					if_block.c();
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			}
		},

		d(detaching) {
			if_block.d(detaching);

			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(if_block_anchor);
			}
		}
	};
}

// (228:8) {:else}
function create_else_block_1(ctx) {
	var div, t0, a, t1, a_href_value;

	return {
		c() {
			div = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");
			t0 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])("Your message has been posted. Do you want to\r\n            ");
			a = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("a");
			t1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])("Check it out?");
			a.target = "_blank";
			a.href = a_href_value = "?thread=" + ctx.encodeURIComponent(ctx.msg.key) + "#/thread";
			div.className = "toast toast-success";
		},

		m(target, anchor) {
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, div, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div, t0);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div, a);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(a, t1);
		},

		p(changed, ctx) {
			if ((changed.msg) && a_href_value !== (a_href_value = "?thread=" + ctx.encodeURIComponent(ctx.msg.key) + "#/thread")) {
				a.href = a_href_value;
			}
		},

		d(detaching) {
			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(div);
			}
		}
	};
}

// (226:8) {#if error}
function create_if_block_11(ctx) {
	var div, t;

	return {
		c() {
			div = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");
			t = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])(ctx.msg);
			div.className = "toast toast-error";
		},

		m(target, anchor) {
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, div, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div, t);
		},

		p(changed, ctx) {
			if (changed.msg) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["set_data"])(t, ctx.msg);
			}
		},

		d(detaching) {
			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(div);
			}
		}
	};
}

// (301:6) {:else}
function create_else_block(ctx) {
	var div4, h2, t1, t2, raw_value = ctx.ssb.markdown(ctx.content), raw_before, raw_after, t3, div0, t4, div3, div1, t6, div2, button0, t8, button1, dispose;

	var if_block = (ctx.channel || ctx.root || ctx.branch || ctx.contentWarning.length > 0) && create_if_block_5(ctx);

	return {
		c() {
			div4 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");
			h2 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("h2");
			h2.textContent = "Post preview";
			t1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			if (if_block) if_block.c();
			t2 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			raw_before = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])('noscript');
			raw_after = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])('noscript');
			t3 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			div0 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");
			t4 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			div3 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");
			div1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");
			div1.innerHTML = `<span class="label label-warning">
			                This message will be public and can't be edited or deleted
			              </span>`;
			t6 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			div2 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");
			button0 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("button");
			button0.textContent = "Go Back";
			t8 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			button1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("button");
			button1.textContent = "Post";
			div0.className = "divider";
			div1.className = "column col-md-12 col-lg-10";
			button0.className = "btn";
			button1.className = "btn btn-primary";
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["toggle_class"])(button1, "loading", ctx.posting);
			div2.className = "column col-md-12 col-lg-2";
			div3.className = "columns";
			div4.className = "column col-md-12";

			dispose = [
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(button0, "click", ctx.click_handler),
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(button1, "click", ctx.post)
			];
		},

		m(target, anchor) {
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, div4, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div4, h2);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div4, t1);
			if (if_block) if_block.m(div4, null);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div4, t2);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div4, raw_before);
			raw_before.insertAdjacentHTML("afterend", raw_value);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div4, raw_after);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div4, t3);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div4, div0);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div4, t4);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div4, div3);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div3, div1);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div3, t6);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div3, div2);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div2, button0);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div2, t8);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div2, button1);
		},

		p(changed, ctx) {
			if (ctx.channel || ctx.root || ctx.branch || ctx.contentWarning.length > 0) {
				if (if_block) {
					if_block.p(changed, ctx);
				} else {
					if_block = create_if_block_5(ctx);
					if_block.c();
					if_block.m(div4, t2);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}

			if ((changed.content) && raw_value !== (raw_value = ctx.ssb.markdown(ctx.content))) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach_between"])(raw_before, raw_after);
				raw_before.insertAdjacentHTML("afterend", raw_value);
			}

			if (changed.posting) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["toggle_class"])(button1, "loading", ctx.posting);
			}
		},

		i: svelte_internal__WEBPACK_IMPORTED_MODULE_0__["noop"],
		o: svelte_internal__WEBPACK_IMPORTED_MODULE_0__["noop"],

		d(detaching) {
			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(div4);
			}

			if (if_block) if_block.d();
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["run_all"])(dispose);
		}
	};
}

// (239:6) {#if !showPreview}
function create_if_block(ctx) {
	var div1, label0, t1, input0, t2, t3, t4, label1, t6, textarea, t7, div0, button0, t9, t10, input1, t11, button1, t13, t14, button2, div1_intro, div1_outro, current, dispose;

	var if_block0 = (ctx.branch) && create_if_block_4(ctx);

	var if_block1 = (ctx.replyfeed) && create_if_block_3(ctx);

	var if_block2 = (ctx.showContentWarningField) && create_if_block_2(ctx);

	var if_block3 = (ctx.ipfsDaemonRunning) && create_if_block_1(ctx);

	return {
		c() {
			div1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");
			label0 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("label");
			label0.textContent = "Channel";
			t1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			input0 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("input");
			t2 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			if (if_block0) if_block0.c();
			t3 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			if (if_block1) if_block1.c();
			t4 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			label1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("label");
			label1.textContent = "Message";
			t6 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			textarea = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("textarea");
			t7 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			div0 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");
			button0 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("button");
			button0.textContent = "CW";
			t9 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			if (if_block2) if_block2.c();
			t10 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			input1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("input");
			t11 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			button1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("button");
			button1.textContent = "Attach File";
			t13 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			if (if_block3) if_block3.c();
			t14 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			button2 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("button");
			button2.textContent = "Preview";
			label0.className = "form-label";
			label0.htmlFor = "channel";
			input0.className = "form-input";
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["attr"])(input0, "type", "text");
			input0.id = "channel";
			input0.placeholder = "channel";
			label1.className = "form-label";
			label1.htmlFor = "content";
			textarea.className = "form-input svelte-olsuyr";
			textarea.id = "content";
			textarea.placeholder = "Type in your post";
			textarea.rows = "10";
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["toggle_class"])(textarea, "file-on-top", ctx.fileOnTop);
			button0.className = "btn btn-link";
			div0.className = "d-block m-2";
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["attr"])(input1, "type", "file");
			input1.id = "fileInput";
			input1.className = "svelte-olsuyr";
			button1.className = "btn";
			button2.className = "btn btn-primary float-right";
			div1.className = "form-group";

			dispose = [
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(input0, "input", ctx.input0_input_handler),
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(textarea, "input", ctx.textarea_input_handler),
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(textarea, "dragover", Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["stop_propagation"])(Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["prevent_default"])(ctx.dragOver))),
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(textarea, "dragleave", Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["stop_propagation"])(Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["prevent_default"])(ctx.dragLeave))),
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(button0, "click", ctx.toggleContentWarning),
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(input1, "input", ctx.attachFile),
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(button1, "click", ctx.attachFileTrigger),
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(button2, "click", ctx.preview)
			];
		},

		m(target, anchor) {
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, div1, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div1, label0);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div1, t1);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div1, input0);

			input0.value = ctx.channel;

			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div1, t2);
			if (if_block0) if_block0.m(div1, null);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div1, t3);
			if (if_block1) if_block1.m(div1, null);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div1, t4);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div1, label1);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div1, t6);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div1, textarea);

			textarea.value = ctx.content;

			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div1, t7);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div1, div0);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div0, button0);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div0, t9);
			if (if_block2) if_block2.m(div0, null);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div1, t10);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div1, input1);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div1, t11);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div1, button1);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div1, t13);
			if (if_block3) if_block3.m(div1, null);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div1, t14);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div1, button2);
			current = true;
		},

		p(changed, ctx) {
			if (changed.channel && (input0.value !== ctx.channel)) input0.value = ctx.channel;

			if (ctx.branch) {
				if (if_block0) {
					if_block0.p(changed, ctx);
				} else {
					if_block0 = create_if_block_4(ctx);
					if_block0.c();
					if_block0.m(div1, t3);
				}
			} else if (if_block0) {
				if_block0.d(1);
				if_block0 = null;
			}

			if (ctx.replyfeed) {
				if (if_block1) {
					if_block1.p(changed, ctx);
					if_block1.i(1);
				} else {
					if_block1 = create_if_block_3(ctx);
					if_block1.c();
					if_block1.i(1);
					if_block1.m(div1, t4);
				}
			} else if (if_block1) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["group_outros"])();
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["on_outro"])(() => {
					if_block1.d(1);
					if_block1 = null;
				});

				if_block1.o(1);
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["check_outros"])();
			}

			if (changed.content) textarea.value = ctx.content;

			if (changed.fileOnTop) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["toggle_class"])(textarea, "file-on-top", ctx.fileOnTop);
			}

			if (ctx.showContentWarningField) {
				if (if_block2) {
					if_block2.p(changed, ctx);
				} else {
					if_block2 = create_if_block_2(ctx);
					if_block2.c();
					if_block2.m(div0, null);
				}
			} else if (if_block2) {
				if_block2.d(1);
				if_block2 = null;
			}

			if (ctx.ipfsDaemonRunning) {
				if (if_block3) {
					if_block3.p(changed, ctx);
				} else {
					if_block3 = create_if_block_1(ctx);
					if_block3.c();
					if_block3.m(div1, t14);
				}
			} else if (if_block3) {
				if_block3.d(1);
				if_block3 = null;
			}
		},

		i(local) {
			if (current) return;
			if (if_block1) if_block1.i();

			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["add_render_callback"])(() => {
				if (div1_outro) div1_outro.end(1);
				if (!div1_intro) div1_intro = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["create_in_transition"])(div1, svelte_transition__WEBPACK_IMPORTED_MODULE_3__["slide"], {});
				div1_intro.start();
			});

			current = true;
		},

		o(local) {
			if (if_block1) if_block1.o();
			if (div1_intro) div1_intro.invalidate();

			if (local) {
				div1_outro = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["create_out_transition"])(div1, svelte_transition__WEBPACK_IMPORTED_MODULE_3__["slide"], {});
			}

			current = false;
		},

		d(detaching) {
			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(div1);
			}

			if (if_block0) if_block0.d();
			if (if_block1) if_block1.d();
			if (if_block2) if_block2.d();
			if (if_block3) if_block3.d();

			if (detaching) {
				if (div1_outro) div1_outro.end();
			}

			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["run_all"])(dispose);
		}
	};
}

// (304:10) {#if channel || root || branch || contentWarning.length > 0}
function create_if_block_5(ctx) {
	var blockquote, t0, t1, t2;

	var if_block0 = (ctx.channel) && create_if_block_9(ctx);

	var if_block1 = (ctx.root) && create_if_block_8(ctx);

	var if_block2 = (ctx.branch) && create_if_block_7(ctx);

	var if_block3 = (ctx.contentWarning.length > 0) && create_if_block_6(ctx);

	return {
		c() {
			blockquote = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("blockquote");
			if (if_block0) if_block0.c();
			t0 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			if (if_block1) if_block1.c();
			t1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			if (if_block2) if_block2.c();
			t2 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			if (if_block3) if_block3.c();
		},

		m(target, anchor) {
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, blockquote, anchor);
			if (if_block0) if_block0.m(blockquote, null);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(blockquote, t0);
			if (if_block1) if_block1.m(blockquote, null);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(blockquote, t1);
			if (if_block2) if_block2.m(blockquote, null);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(blockquote, t2);
			if (if_block3) if_block3.m(blockquote, null);
		},

		p(changed, ctx) {
			if (ctx.channel) {
				if (if_block0) {
					if_block0.p(changed, ctx);
				} else {
					if_block0 = create_if_block_9(ctx);
					if_block0.c();
					if_block0.m(blockquote, t0);
				}
			} else if (if_block0) {
				if_block0.d(1);
				if_block0 = null;
			}

			if (ctx.root) {
				if (if_block1) {
					if_block1.p(changed, ctx);
				} else {
					if_block1 = create_if_block_8(ctx);
					if_block1.c();
					if_block1.m(blockquote, t1);
				}
			} else if (if_block1) {
				if_block1.d(1);
				if_block1 = null;
			}

			if (ctx.branch) {
				if (if_block2) {
					if_block2.p(changed, ctx);
				} else {
					if_block2 = create_if_block_7(ctx);
					if_block2.c();
					if_block2.m(blockquote, t2);
				}
			} else if (if_block2) {
				if_block2.d(1);
				if_block2 = null;
			}

			if (ctx.contentWarning.length > 0) {
				if (if_block3) {
					if_block3.p(changed, ctx);
				} else {
					if_block3 = create_if_block_6(ctx);
					if_block3.c();
					if_block3.m(blockquote, null);
				}
			} else if (if_block3) {
				if_block3.d(1);
				if_block3 = null;
			}
		},

		d(detaching) {
			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(blockquote);
			}

			if (if_block0) if_block0.d();
			if (if_block1) if_block1.d();
			if (if_block2) if_block2.d();
			if (if_block3) if_block3.d();
		}
	};
}

// (306:14) {#if channel}
function create_if_block_9(ctx) {
	var p, b, t1, t2_value = ctx.channel.startsWith('#') ? ctx.channel.slice(1) : ctx.channel, t2;

	return {
		c() {
			p = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("p");
			b = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("b");
			b.textContent = "Channel:";
			t1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			t2 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])(t2_value);
		},

		m(target, anchor) {
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, p, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(p, b);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(p, t1);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(p, t2);
		},

		p(changed, ctx) {
			if ((changed.channel) && t2_value !== (t2_value = ctx.channel.startsWith('#') ? ctx.channel.slice(1) : ctx.channel)) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["set_data"])(t2, t2_value);
			}
		},

		d(detaching) {
			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(p);
			}
		}
	};
}

// (312:14) {#if root}
function create_if_block_8(ctx) {
	var p, b, t1, t2;

	return {
		c() {
			p = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("p");
			b = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("b");
			b.textContent = "Root:";
			t1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			t2 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])(ctx.root);
		},

		m(target, anchor) {
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, p, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(p, b);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(p, t1);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(p, t2);
		},

		p: svelte_internal__WEBPACK_IMPORTED_MODULE_0__["noop"],

		d(detaching) {
			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(p);
			}
		}
	};
}

// (318:14) {#if branch}
function create_if_block_7(ctx) {
	var p, b, t1, t2;

	return {
		c() {
			p = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("p");
			b = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("b");
			b.textContent = "In Reply To:";
			t1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			t2 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])(ctx.branch);
		},

		m(target, anchor) {
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, p, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(p, b);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(p, t1);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(p, t2);
		},

		p(changed, ctx) {
			if (changed.branch) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["set_data"])(t2, ctx.branch);
			}
		},

		d(detaching) {
			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(p);
			}
		}
	};
}

// (324:14) {#if contentWarning.length > 0}
function create_if_block_6(ctx) {
	var p, b, t1, t2;

	return {
		c() {
			p = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("p");
			b = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("b");
			b.textContent = "Content Warning:";
			t1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			t2 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])(ctx.contentWarning);
		},

		m(target, anchor) {
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, p, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(p, b);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(p, t1);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(p, t2);
		},

		p(changed, ctx) {
			if (changed.contentWarning) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["set_data"])(t2, ctx.contentWarning);
			}
		},

		d(detaching) {
			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(p);
			}
		}
	};
}

// (249:10) {#if branch}
function create_if_block_4(ctx) {
	var label, t_1, input, dispose;

	return {
		c() {
			label = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("label");
			label.textContent = "In reply to";
			t_1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			input = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("input");
			label.className = "form-label";
			label.htmlFor = "reply-to";
			input.className = "form-input";
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["attr"])(input, "type", "text");
			input.id = "reply-to";
			input.placeholder = "in reply to";
			dispose = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(input, "input", ctx.input_input_handler);
		},

		m(target, anchor) {
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, label, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, t_1, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, input, anchor);

			input.value = ctx.branch;
		},

		p(changed, ctx) {
			if (changed.branch && (input.value !== ctx.branch)) input.value = ctx.branch;
		},

		d(detaching) {
			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(label);
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(t_1);
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(input);
			}

			dispose();
		}
	};
}

// (259:10) {#if replyfeed}
function create_if_block_3(ctx) {
	var div, span, t, current;

	var avatarchip = new _parts_AvatarChip_svelte__WEBPACK_IMPORTED_MODULE_5__["default"]({ props: { feed: ctx.replyfeed } });
	avatarchip.$on("avatarClick", ctx.avatarClick);

	return {
		c() {
			div = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");
			span = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("span");
			t = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])("Click the avatar to add a link to the message:\r\n                ");
			avatarchip.$$.fragment.c();
			div.className = "mt-2";
		},

		m(target, anchor) {
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, div, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div, span);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(span, t);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["mount_component"])(avatarchip, span, null);
			current = true;
		},

		p(changed, ctx) {
			var avatarchip_changes = {};
			if (changed.replyfeed) avatarchip_changes.feed = ctx.replyfeed;
			avatarchip.$set(avatarchip_changes);
		},

		i(local) {
			if (current) return;
			avatarchip.$$.fragment.i(local);

			current = true;
		},

		o(local) {
			avatarchip.$$.fragment.o(local);
			current = false;
		},

		d(detaching) {
			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(div);
			}

			avatarchip.$destroy();
		}
	};
}

// (281:12) {#if showContentWarningField}
function create_if_block_2(ctx) {
	var input, dispose;

	return {
		c() {
			input = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("input");
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["attr"])(input, "type", "text");
			input.size = "50";
			input.placeholder = "Describe your content warning (leave empty to no use it)";
			dispose = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(input, "input", ctx.input_input_handler_1);
		},

		m(target, anchor) {
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, input, anchor);

			input.value = ctx.contentWarning;
		},

		p(changed, ctx) {
			if (changed.contentWarning && (input.value !== ctx.contentWarning)) input.value = ctx.contentWarning;
		},

		d(detaching) {
			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(input);
			}

			dispose();
		}
	};
}

// (291:10) {#if ipfsDaemonRunning}
function create_if_block_1(ctx) {
	var input, t, button, dispose;

	return {
		c() {
			input = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("input");
			t = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			button = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("button");
			button.textContent = "Attach File using IPFS";
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["attr"])(input, "type", "file");
			input.id = "fileInputIPFS";
			input.className = "svelte-olsuyr";
			button.className = "btn";

			dispose = [
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(input, "input", ctx.attachFileIPFS),
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(button, "click", ctx.attachFileIPFSTrigger)
			];
		},

		m(target, anchor) {
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, input, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, t, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, button, anchor);
		},

		p: svelte_internal__WEBPACK_IMPORTED_MODULE_0__["noop"],

		d(detaching) {
			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(input);
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(t);
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(button);
			}

			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["run_all"])(dispose);
		}
	};
}

function create_fragment(ctx) {
	var div2, div1, div0, t0, t1, current_block_type_index, if_block2, current;

	var if_block0 = (ctx.fork) && create_if_block_12(ctx);

	var if_block1 = (ctx.msg) && create_if_block_10(ctx);

	var if_block_creators = [
		create_if_block,
		create_else_block
	];

	var if_blocks = [];

	function select_block_type_1(ctx) {
		if (!ctx.showPreview) return 0;
		return 1;
	}

	current_block_type_index = select_block_type_1(ctx);
	if_block2 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

	return {
		c() {
			div2 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");
			div1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");
			div0 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");
			if (if_block0) if_block0.c();
			t0 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			if (if_block1) if_block1.c();
			t1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			if_block2.c();
			div0.className = "column";
			div1.className = "columns";
			div2.className = "container";
		},

		m(target, anchor) {
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, div2, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div2, div1);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div1, div0);
			if (if_block0) if_block0.m(div0, null);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div0, t0);
			if (if_block1) if_block1.m(div0, null);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div0, t1);
			if_blocks[current_block_type_index].m(div0, null);
			current = true;
		},

		p(changed, ctx) {
			if (ctx.fork) {
				if (if_block0) {
					if_block0.p(changed, ctx);
				} else {
					if_block0 = create_if_block_12(ctx);
					if_block0.c();
					if_block0.m(div0, t0);
				}
			} else if (if_block0) {
				if_block0.d(1);
				if_block0 = null;
			}

			if (ctx.msg) {
				if (if_block1) {
					if_block1.p(changed, ctx);
				} else {
					if_block1 = create_if_block_10(ctx);
					if_block1.c();
					if_block1.m(div0, t1);
				}
			} else if (if_block1) {
				if_block1.d(1);
				if_block1 = null;
			}

			var previous_block_index = current_block_type_index;
			current_block_type_index = select_block_type_1(ctx);
			if (current_block_type_index === previous_block_index) {
				if_blocks[current_block_type_index].p(changed, ctx);
			} else {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["group_outros"])();
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["on_outro"])(() => {
					if_blocks[previous_block_index].d(1);
					if_blocks[previous_block_index] = null;
				});
				if_block2.o(1);
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["check_outros"])();

				if_block2 = if_blocks[current_block_type_index];
				if (!if_block2) {
					if_block2 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
					if_block2.c();
				}
				if_block2.i(1);
				if_block2.m(div0, null);
			}
		},

		i(local) {
			if (current) return;
			if (if_block2) if_block2.i();
			current = true;
		},

		o(local) {
			if (if_block2) if_block2.o();
			current = false;
		},

		d(detaching) {
			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(div2);
			}

			if (if_block0) if_block0.d();
			if (if_block1) if_block1.d();
			if_blocks[current_block_type_index].d();
		}
	};
}

function instance($$self, $$props, $$invalidate) {
	let $routeParams;

	Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["subscribe"])($$self, _utils_js__WEBPACK_IMPORTED_MODULE_4__["routeParams"], $$value => { $routeParams = $$value; $$invalidate('$routeParams', $routeParams); });

	

  let showPreview = false;
  let msg = false;
  let error = false;
  let posting = false;

  let root = $routeParams.root;
  let branch = $routeParams.branch;
  let channel = $routeParams.channel || "";
  let content = $routeParams.content || "";
  let replyfeed = $routeParams.replyfeed || false;
  let fork = $routeParams.fork;
  let fileOnTop = false;
  let pull = hermiebox.modules.pullStream;
  let fileReader = hermiebox.modules.pullFileReader;
  let sbot = hermiebox.sbot;
  let ipfsDaemonRunning = false;

  document.title = `Patchfox - compose`;

  Object(svelte__WEBPACK_IMPORTED_MODULE_1__["onMount"])(() => {
    $$invalidate('error', error = false);
    $$invalidate('msg', msg = "");

    // this code could be in some better/smarter place.
    // e.dataTransfer.getData('url'); from images in the browser window

    drag_and_drop_files__WEBPACK_IMPORTED_MODULE_2___default()(document.getElementById("content"), files => readFileAndAttach(files));
    checkIpfsDaemon();
  });

  const checkIpfsDaemon = () => {
    let port = Object(_utils_js__WEBPACK_IMPORTED_MODULE_4__["getPref"])("ipfsPort", 5001);
    fetch(`http://127.0.0.1:${port}/api/v0/config/show`).then(data => {
      $$invalidate('ipfsDaemonRunning', ipfsDaemonRunning = true);
    });
  };

  const readFileAndAttach = files => {
    $$invalidate('error', error = false);
    $$invalidate('msg', msg = "");

    if (files.length == 0) {
      $$invalidate('fileOnTop', fileOnTop = false);
      console.log("this is not a file");
      return false;
    }

    var first = files[0];
    console.log(first);

    if (!first.type.startsWith("image")) {
      $$invalidate('error', error = true);
      $$invalidate('msg', msg = `You can only drag & drop image, this file is a ${first.type}`);
      return false;
    }

    if (first.size >= 5000000) {
      $$invalidate('error', error = true);
      $$invalidate('msg', msg = `File too large: ${Math.floor(
        first.size / 1048576,
        2
      )}mb when max size is 5mb`);
      return false;
    }

    pull(
      fileReader(first),
      sbot.blobs.add(function(err, hash) {
        // 'hash' is the hash-id of the blob
        if (err) {
          $$invalidate('error', error = true);
          $$invalidate('msg', msg = "Couldn't attach file: " + err);
        } else {
          $$invalidate('content', content += ` ![${first.name}](${hash})`);
        }
        $$invalidate('fileOnTop', fileOnTop = false);
      })
    );
  };

  const post = async ev => {
    ev.stopPropagation();
    ev.preventDefault();

    if (!posting) {
      $$invalidate('posting', posting = true);

      if (channel.startsWith("#")) {
        $$invalidate('channel', channel = channel.slice(1));
      }

      try {
        $$invalidate('msg', msg = await ssb.newPost({
          text: content,
          channel,
          root,
          branch,
          fork,
          contentWarning: contentWarning.length > 0 ? contentWarning : undefined
        }));
        $$invalidate('posting', posting = false);
        console.log("posted", msg);
        window.scrollTo(0, 0);
      } catch (n) {
        $$invalidate('error', error = true);
        $$invalidate('msg', msg = `Couldn't post your message: ${n}`);
        window.scrollTo(0, 0);

        if (msg.message == "stream is closed") {
          $$invalidate('msg', msg += ". We lost connection to sbot. We'll try to restablish it...");

          Object(_utils_js__WEBPACK_IMPORTED_MODULE_4__["reconnect"])()
            .then(() => {
              $$invalidate('showPreview', showPreview = false);
              $$invalidate('posting', posting = false);
              $$invalidate('error', error = false);
              $$invalidate('msg', msg = "Connection to sbot reestablished. Try posting again");
            })
            .catch(err => {
              window.location.search = `?root=${encodeURIComponent(
                root
              )}&branch=${encodeURIComponent(
                branch
              )}&content=${encodeURIComponent(
                content
              )}&channel=${encodeURIComponent(channel)}`;
              $$invalidate('msg', msg = `Sorry, couldn't reconnect to sbot:${err}. Try reloading the page. Your content has been saved to the URL`);
            });
        }
      }
    }
  };

  const preview = ev => {
    $$invalidate('showPreview', showPreview = true);
  };

  const saveToURL = ev => {
    window.location.search = `?root=${encodeURIComponent(
      root
    )}&branch=${encodeURIComponent(branch)}&content=${encodeURIComponent(
      content
    )}&channel=${encodeURIComponent(channel)}`;
  };

  const avatarClick = ev => {
    let feed = ev.detail.feed;
    let name = ev.detail.name;

    if (content.length > 0) {
      $$invalidate('content', content += ` [${name}](${feed})`);
    } else {
      $$invalidate('content', content = `[${name}](${feed})`);
    }
  };

  const dragOver = ev => {
    $$invalidate('fileOnTop', fileOnTop = true);
  };

  const dragLeave = ev => {
    $$invalidate('fileOnTop', fileOnTop = false);
  };

  const attachFileTrigger = () => {
    document.getElementById("fileInput").click();
  };

  const attachFileIPFSTrigger = () => {
    document.getElementById("fileInputIPFS").click();
  };

  const attachFile = ev => {
    const files = ev.target.files;
    readFileAndAttach(files);
  };

  const attachFileIPFS = ev => {
    const files = ev.target.files;
    readFileAndAttachIPFS(files);
  };

  const readFileAndAttachIPFS = async files => {
    $$invalidate('error', error = false);
    $$invalidate('msg', msg = "");

    var ipfs = window.IpfsHttpClient("127.0.0.1", "5001");
    const results = await ipfs.add(files[0]);

    console.log("added via IPFS", results);
    $$invalidate('content', content += ` [${results[0].path}](ipfs://${results[0].hash})`);
  };

  let showContentWarningField = false;

  const toggleContentWarning = () =>
    { const $$result = (showContentWarningField = !showContentWarningField); $$invalidate('showContentWarningField', showContentWarningField); return $$result; };

  let contentWarning = "";

	function input0_input_handler() {
		channel = this.value;
		$$invalidate('channel', channel);
	}

	function input_input_handler() {
		branch = this.value;
		$$invalidate('branch', branch);
	}

	function textarea_input_handler() {
		content = this.value;
		$$invalidate('content', content);
	}

	function input_input_handler_1() {
		contentWarning = this.value;
		$$invalidate('contentWarning', contentWarning);
	}

	function click_handler() {
		const $$result = (showPreview = false);
		$$invalidate('showPreview', showPreview);
		return $$result;
	}

	return {
		showPreview,
		msg,
		error,
		posting,
		root,
		branch,
		channel,
		content,
		replyfeed,
		fork,
		fileOnTop,
		ipfsDaemonRunning,
		post,
		preview,
		avatarClick,
		dragOver,
		dragLeave,
		attachFileTrigger,
		attachFileIPFSTrigger,
		attachFile,
		attachFileIPFS,
		showContentWarningField,
		toggleContentWarning,
		contentWarning,
		ssb,
		encodeURIComponent,
		input0_input_handler,
		input_input_handler,
		textarea_input_handler,
		input_input_handler_1,
		click_handler
	};
}

class Compose extends svelte_internal__WEBPACK_IMPORTED_MODULE_0__["SvelteComponent"] {
	constructor(options) {
		super();
		Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["init"])(this, options, instance, create_fragment, svelte_internal__WEBPACK_IMPORTED_MODULE_0__["safe_not_equal"], []);
	}
}


if (false) {}

/* harmony default export */ __webpack_exports__["default"] = (Compose);




/***/ }),

/***/ "./src/ui/views/Compose.svelte.css":
/*!*****************************************!*\
  !*** ./src/ui/views/Compose.svelte.css ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../../node_modules/css-loader/dist/cjs.js!./Compose.svelte.css */ "./node_modules/css-loader/dist/cjs.js!./src/ui/views/Compose.svelte.css");

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(/*! ../../../node_modules/style-loader/lib/addStyles.js */ "./node_modules/style-loader/lib/addStyles.js")(content, options);

if(content.locals) module.exports = content.locals;

if(false) {}

/***/ }),

/***/ "./src/ui/views/Default.svelte":
/*!*************************************!*\
  !*** ./src/ui/views/Default.svelte ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var svelte_internal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! svelte/internal */ "./node_modules/svelte/internal.mjs");
/* src\ui\views\Default.svelte generated by Svelte v3.4.4 */


function create_fragment(ctx) {
	var div;

	return {
		c() {
			div = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");
			div.className = "empty";
		},

		m(target, anchor) {
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, div, anchor);
		},

		p: svelte_internal__WEBPACK_IMPORTED_MODULE_0__["noop"],
		i: svelte_internal__WEBPACK_IMPORTED_MODULE_0__["noop"],
		o: svelte_internal__WEBPACK_IMPORTED_MODULE_0__["noop"],

		d(detaching) {
			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(div);
			}
		}
	};
}

class Default extends svelte_internal__WEBPACK_IMPORTED_MODULE_0__["SvelteComponent"] {
	constructor(options) {
		super();
		Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["init"])(this, options, null, create_fragment, svelte_internal__WEBPACK_IMPORTED_MODULE_0__["safe_not_equal"], []);
	}
}


if (false) {}

/* harmony default export */ __webpack_exports__["default"] = (Default);


/***/ }),

/***/ "./src/ui/views/ErrorView.svelte":
/*!***************************************!*\
  !*** ./src/ui/views/ErrorView.svelte ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var svelte_internal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! svelte/internal */ "./node_modules/svelte/internal.mjs");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils.js */ "./src/ui/utils.js");
/* src\ui\views\ErrorView.svelte generated by Svelte v3.4.4 */



// (51:2) {#if toast}
function create_if_block_1(ctx) {
	var div, t, div_class_value;

	return {
		c() {
			div = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");
			t = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])(ctx.msg);
			div.className = div_class_value = "toast " + ctx.toastClass;
		},

		m(target, anchor) {
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, div, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div, t);
		},

		p(changed, ctx) {
			if (changed.msg) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["set_data"])(t, ctx.msg);
			}

			if ((changed.toastClass) && div_class_value !== (div_class_value = "toast " + ctx.toastClass)) {
				div.className = div_class_value;
			}
		},

		d(detaching) {
			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(div);
			}
		}
	};
}

// (60:4) {#if cta}
function create_if_block(ctx) {
	var li, a, t_value = ctx.cta.label, t, dispose;

	return {
		c() {
			li = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("li");
			a = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("a");
			t = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])(t_value);
			a.href = "#";
			dispose = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(a, "click", Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["stop_propagation"])(Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["prevent_default"])(ctx.cta.action)));
		},

		m(target, anchor) {
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, li, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(li, a);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(a, t);
		},

		p(changed, ctx) {
			if ((changed.cta) && t_value !== (t_value = ctx.cta.label)) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["set_data"])(t, t_value);
			}
		},

		d(detaching) {
			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(li);
			}

			dispose();
		}
	};
}

function create_fragment(ctx) {
	var div, h1, t1, t2, h4, t4, pre, code, t5, t6, p, t8, ul, t9, li0, t11, li1;

	var if_block0 = (ctx.toast) && create_if_block_1(ctx);

	var if_block1 = (ctx.cta) && create_if_block(ctx);

	return {
		c() {
			div = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");
			h1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("h1");
			h1.textContent = "😿 An Error Has Occurred, sorry 😭";
			t1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			if (if_block0) if_block0.c();
			t2 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			h4 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("h4");
			h4.textContent = "This is what we know about it";
			t4 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			pre = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("pre");
			code = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("code");
			t5 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])(ctx.error);
			t6 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			p = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("p");
			p.textContent = "You might want to:";
			t8 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			ul = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("ul");
			if (if_block1) if_block1.c();
			t9 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			li0 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("li");
			li0.innerHTML = `<a href="/docs/index.html#/troubleshooting/" target="_blank">
			        Open our troubleshooting documentation.
			      </a>`;
			t11 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			li1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("li");
			li1.innerHTML = `<a href="https://github.com/soapdog/patchfox/issues" target="_blank">
			        Add an issue
			      </a>
			      to the Patchfox repository.
			    `;
			pre.className = "code";
			div.className = "container";
		},

		m(target, anchor) {
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, div, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div, h1);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div, t1);
			if (if_block0) if_block0.m(div, null);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div, t2);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div, h4);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div, t4);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div, pre);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(pre, code);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(code, t5);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div, t6);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div, p);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div, t8);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div, ul);
			if (if_block1) if_block1.m(ul, null);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(ul, t9);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(ul, li0);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(ul, t11);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(ul, li1);
		},

		p(changed, ctx) {
			if (ctx.toast) {
				if (if_block0) {
					if_block0.p(changed, ctx);
				} else {
					if_block0 = create_if_block_1(ctx);
					if_block0.c();
					if_block0.m(div, t2);
				}
			} else if (if_block0) {
				if_block0.d(1);
				if_block0 = null;
			}

			if (changed.error) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["set_data"])(t5, ctx.error);
			}

			if (ctx.cta) {
				if (if_block1) {
					if_block1.p(changed, ctx);
				} else {
					if_block1 = create_if_block(ctx);
					if_block1.c();
					if_block1.m(ul, t9);
				}
			} else if (if_block1) {
				if_block1.d(1);
				if_block1 = null;
			}
		},

		i: svelte_internal__WEBPACK_IMPORTED_MODULE_0__["noop"],
		o: svelte_internal__WEBPACK_IMPORTED_MODULE_0__["noop"],

		d(detaching) {
			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(div);
			}

			if (if_block0) if_block0.d();
			if (if_block1) if_block1.d();
		}
	};
}

function instance($$self, $$props, $$invalidate) {
	let $routeParams;

	Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["subscribe"])($$self, _utils_js__WEBPACK_IMPORTED_MODULE_1__["routeParams"], $$value => { $routeParams = $$value; $$invalidate('$routeParams', $routeParams); });

	document.title = `Patchfox - Error`;

  let error = $routeParams.error;
  let errorObj = {};
  let toastClass = "";
  let toast = false;
  let msg;
  let cta = false;

  console.dir(error);
  if (typeof error == "object") {
    errorObj = error;
    $$invalidate('error', error = errorObj.message);
  }

  const tryReconnect = () => {
    $$invalidate('toast', toast = true);
    $$invalidate('toastClass', toastClass = "toast-warning");
    $$invalidate('msg', msg = "Attempting to reconnect to sbot...");
    Object(_utils_js__WEBPACK_IMPORTED_MODULE_1__["reconnect"])()
      .then(() => {
        $$invalidate('toastClass', toastClass = "toast-success");
        $$invalidate('toast', toast = true);
        $$invalidate('msg', msg =
          "Connection to sbot reestablished. Try going to your public feed.");
      })
      .catch(n => {
        $$invalidate('toastClass', toastClass = "toast-error");
        $$invalidate('toast', toast = true);
        $$invalidate('msg', msg = "Couldn't reconnect. Try reloading the page.");
      });
  };

  let errorMapping = {
    "Error: stream is closed": {
      label: "Want to try to reconnect?",
      action: tryReconnect
    }
  };

  if (errorMapping.hasOwnProperty(error)) {
    $$invalidate('cta', cta = errorMapping[error]);
  }

	return { error, toastClass, toast, msg, cta };
}

class ErrorView extends svelte_internal__WEBPACK_IMPORTED_MODULE_0__["SvelteComponent"] {
	constructor(options) {
		super();
		Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["init"])(this, options, instance, create_fragment, svelte_internal__WEBPACK_IMPORTED_MODULE_0__["safe_not_equal"], []);
	}
}


if (false) {}

/* harmony default export */ __webpack_exports__["default"] = (ErrorView);


/***/ }),

/***/ "./src/ui/views/Mentions.svelte":
/*!**************************************!*\
  !*** ./src/ui/views/Mentions.svelte ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var svelte_internal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! svelte/internal */ "./node_modules/svelte/internal.mjs");
/* harmony import */ var _messageTypes_MessageRenderer_svelte__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../messageTypes/MessageRenderer.svelte */ "./src/ui/messageTypes/MessageRenderer.svelte");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils.js */ "./src/ui/utils.js");
/* harmony import */ var svelte__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! svelte */ "./node_modules/svelte/index.mjs");
/* src\ui\views\Mentions.svelte generated by Svelte v3.4.4 */





function get_each_context(ctx, list, i) {
	const child_ctx = Object.create(ctx);
	child_ctx.msg = list[i];
	return child_ctx;
}

// (60:0) {:else}
function create_else_block(ctx) {
	var each_blocks = [], each_1_lookup = new Map(), t0, ul, li0, a0, t2, li1, a1, current, dispose;

	var each_value = ctx.msgs;

	const get_key = ctx => ctx.msg.key;

	for (var i = 0; i < each_value.length; i += 1) {
		let child_ctx = get_each_context(ctx, each_value, i);
		let key = get_key(child_ctx);
		each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
	}

	return {
		c() {
			for (i = 0; i < each_blocks.length; i += 1) each_blocks[i].c();

			t0 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			ul = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("ul");
			li0 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("li");
			a0 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("a");
			a0.innerHTML = `<div class="page-item-subtitle">Previous</div>`;
			t2 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			li1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("li");
			a1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("a");
			a1.innerHTML = `<div class="page-item-subtitle">Next</div>`;
			a0.href = "#/public";
			li0.className = "page-item page-previous";
			a1.href = "#/public";
			li1.className = "page-item page-next";
			ul.className = "pagination";

			dispose = [
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(a0, "click", Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["stop_propagation"])(Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["prevent_default"])(ctx.click_handler))),
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(a1, "click", Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["stop_propagation"])(Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["prevent_default"])(ctx.click_handler_1)))
			];
		},

		m(target, anchor) {
			for (i = 0; i < each_blocks.length; i += 1) each_blocks[i].m(target, anchor);

			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, t0, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, ul, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(ul, li0);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(li0, a0);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(ul, t2);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(ul, li1);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(li1, a1);
			current = true;
		},

		p(changed, ctx) {
			const each_value = ctx.msgs;

			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["group_outros"])();
			each_blocks = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["update_keyed_each"])(each_blocks, changed, get_key, 1, ctx, each_value, each_1_lookup, t0.parentNode, svelte_internal__WEBPACK_IMPORTED_MODULE_0__["outro_and_destroy_block"], create_each_block, t0, get_each_context);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["check_outros"])();
		},

		i(local) {
			if (current) return;
			for (var i = 0; i < each_value.length; i += 1) each_blocks[i].i();

			current = true;
		},

		o(local) {
			for (i = 0; i < each_blocks.length; i += 1) each_blocks[i].o();

			current = false;
		},

		d(detaching) {
			for (i = 0; i < each_blocks.length; i += 1) each_blocks[i].d(detaching);

			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(t0);
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(ul);
			}

			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["run_all"])(dispose);
		}
	};
}

// (58:0) {#if msgs.length === 0}
function create_if_block(ctx) {
	var div;

	return {
		c() {
			div = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");
			div.className = "loading loading-lg";
		},

		m(target, anchor) {
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, div, anchor);
		},

		p: svelte_internal__WEBPACK_IMPORTED_MODULE_0__["noop"],
		i: svelte_internal__WEBPACK_IMPORTED_MODULE_0__["noop"],
		o: svelte_internal__WEBPACK_IMPORTED_MODULE_0__["noop"],

		d(detaching) {
			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(div);
			}
		}
	};
}

// (61:2) {#each msgs as msg (msg.key)}
function create_each_block(key_1, ctx) {
	var first, current;

	var messagerenderer = new _messageTypes_MessageRenderer_svelte__WEBPACK_IMPORTED_MODULE_1__["default"]({ props: { msg: ctx.msg } });

	return {
		key: key_1,

		first: null,

		c() {
			first = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["empty"])();
			messagerenderer.$$.fragment.c();
			this.first = first;
		},

		m(target, anchor) {
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, first, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["mount_component"])(messagerenderer, target, anchor);
			current = true;
		},

		p(changed, ctx) {
			var messagerenderer_changes = {};
			if (changed.msgs) messagerenderer_changes.msg = ctx.msg;
			messagerenderer.$set(messagerenderer_changes);
		},

		i(local) {
			if (current) return;
			messagerenderer.$$.fragment.i(local);

			current = true;
		},

		o(local) {
			messagerenderer.$$.fragment.o(local);
			current = false;
		},

		d(detaching) {
			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(first);
			}

			messagerenderer.$destroy(detaching);
		}
	};
}

function create_fragment(ctx) {
	var div_2, t_2, current_block_type_index, if_block, if_block_anchor, current;

	var if_block_creators = [
		create_if_block,
		create_else_block
	];

	var if_blocks = [];

	function select_block_type(ctx) {
		if (ctx.msgs.length === 0) return 0;
		return 1;
	}

	current_block_type_index = select_block_type(ctx);
	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

	return {
		c() {
			div_2 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");
			div_2.innerHTML = `<div class="columns"><h4 class="column">Mentions</h4>
			    <div class="column"></div></div>`;
			t_2 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			if_block.c();
			if_block_anchor = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["empty"])();
			div_2.className = "container";
		},

		m(target, anchor) {
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, div_2, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, t_2, anchor);
			if_blocks[current_block_type_index].m(target, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, if_block_anchor, anchor);
			current = true;
		},

		p(changed, ctx) {
			var previous_block_index = current_block_type_index;
			current_block_type_index = select_block_type(ctx);
			if (current_block_type_index === previous_block_index) {
				if_blocks[current_block_type_index].p(changed, ctx);
			} else {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["group_outros"])();
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["on_outro"])(() => {
					if_blocks[previous_block_index].d(1);
					if_blocks[previous_block_index] = null;
				});
				if_block.o(1);
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["check_outros"])();

				if_block = if_blocks[current_block_type_index];
				if (!if_block) {
					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
					if_block.c();
				}
				if_block.i(1);
				if_block.m(if_block_anchor.parentNode, if_block_anchor);
			}
		},

		i(local) {
			if (current) return;
			if (if_block) if_block.i();
			current = true;
		},

		o(local) {
			if (if_block) if_block.o();
			current = false;
		},

		d(detaching) {
			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(div_2);
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(t_2);
			}

			if_blocks[current_block_type_index].d(detaching);

			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(if_block_anchor);
			}
		}
	};
}

function instance($$self, $$props, $$invalidate) {
	

  let msgs = [];
  let unsub;

  document.title = `Patchfox - Mentions`;

  let lt = false;

  const pull = hermiebox.modules.pullStream;
  const sbot = hermiebox.sbot;
  

  const loadMentions = () => {
    console.log("Loading mentions...", lt);
    window.scrollTo(0, 0);
    $$invalidate('msgs', msgs = []);
    ssb.mentions(ssb.feed, lt).then(ms => { const $$result = msgs = ms; $$invalidate('msgs', msgs); return $$result; })
  }; 

  Object(svelte__WEBPACK_IMPORTED_MODULE_3__["onDestroy"])(() => {
    unsub();
  });

  Object(svelte__WEBPACK_IMPORTED_MODULE_3__["onMount"])(() => {
    unsub = _utils_js__WEBPACK_IMPORTED_MODULE_2__["routeParams"].subscribe(params => {
      console.log("params changed.", lt, params.lt);
      if (params.lt) {
        let newlt = parseInt(params.lt);
        if (newlt !== lt) {
          lt = newlt;
        }
      } else {
        lt = false;
      }
      loadMentions();
    });
  });

	function click_handler() {
		return history.back();
	}

	function click_handler_1() {
	          Object(_utils_js__WEBPACK_IMPORTED_MODULE_2__["navigate"])('/mentions', { lt: msgs[msgs.length - 1].rts });
	        }

	return { msgs, click_handler, click_handler_1 };
}

class Mentions extends svelte_internal__WEBPACK_IMPORTED_MODULE_0__["SvelteComponent"] {
	constructor(options) {
		super();
		Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["init"])(this, options, instance, create_fragment, svelte_internal__WEBPACK_IMPORTED_MODULE_0__["safe_not_equal"], []);
	}
}


if (false) {}

/* harmony default export */ __webpack_exports__["default"] = (Mentions);


/***/ }),

/***/ "./src/ui/views/Profile.svelte":
/*!*************************************!*\
  !*** ./src/ui/views/Profile.svelte ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var svelte_internal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! svelte/internal */ "./node_modules/svelte/internal.mjs");
/* harmony import */ var _messageTypes_MessageRenderer_svelte__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../messageTypes/MessageRenderer.svelte */ "./src/ui/messageTypes/MessageRenderer.svelte");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils.js */ "./src/ui/utils.js");
/* src\ui\views\Profile.svelte generated by Svelte v3.4.4 */




function get_each_context(ctx, list, i) {
	const child_ctx = Object.create(ctx);
	child_ctx.msg = list[i];
	return child_ctx;
}

// (175:2) {:catch n}
function create_catch_block_1(ctx) {
	var p, t0, t1_value = ctx.n.message, t1;

	return {
		c() {
			p = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("p");
			t0 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])("Error: ");
			t1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])(t1_value);
		},

		m(target, anchor) {
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, p, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(p, t0);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(p, t1);
		},

		p: svelte_internal__WEBPACK_IMPORTED_MODULE_0__["noop"],
		i: svelte_internal__WEBPACK_IMPORTED_MODULE_0__["noop"],
		o: svelte_internal__WEBPACK_IMPORTED_MODULE_0__["noop"],

		d(detaching) {
			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(p);
			}
		}
	};
}

// (106:2) {:then}
function create_then_block(ctx) {
	var div3, div1, div0, img, img_src_value, t0, div2, h1, t1, t2, pre, t3, t4, t5, p, raw_value = ctx.ssb.markdown(ctx.description), t6, div4, promise, current;

	var if_block = (ctx.feed !== ctx.ssb.feed) && create_if_block(ctx);

	let info = {
		ctx,
		current: null,
		pending: create_pending_block_1,
		then: create_then_block_1,
		catch: create_catch_block,
		value: 'data',
		error: 'n',
		blocks: Array(3)
	};

	Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["handle_promise"])(promise = ctx.messagePromise, info);

	return {
		c() {
			div3 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");
			div1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");
			div0 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");
			img = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("img");
			t0 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			div2 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");
			h1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("h1");
			t1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])(ctx.name);
			t2 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			pre = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("pre");
			t3 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])(ctx.feed);
			t4 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			if (if_block) if_block.c();
			t5 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			p = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("p");
			t6 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			div4 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");

			info.block.c();
			img.className = "img-responsive";
			img.src = img_src_value = "http://localhost:8989/blobs/get/" + ctx.image;
			img.alt = ctx.feed;
			div0.className = "container";
			div1.className = "column col-6";
			div2.className = "column col-6";
			div3.className = "columns";
		},

		m(target, anchor) {
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, div3, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div3, div1);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div1, div0);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div0, img);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div3, t0);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div3, div2);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div2, h1);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(h1, t1);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div2, t2);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div2, pre);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(pre, t3);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div2, t4);
			if (if_block) if_block.m(div2, null);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div2, t5);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div2, p);
			p.innerHTML = raw_value;
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, t6, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, div4, anchor);

			info.block.m(div4, info.anchor = null);
			info.mount = () => div4;
			info.anchor = null;

			current = true;
		},

		p(changed, new_ctx) {
			ctx = new_ctx;
			if ((!current || changed.image) && img_src_value !== (img_src_value = "http://localhost:8989/blobs/get/" + ctx.image)) {
				img.src = img_src_value;
			}

			if (!current || changed.feed) {
				img.alt = ctx.feed;
			}

			if (!current || changed.name) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["set_data"])(t1, ctx.name);
			}

			if (!current || changed.feed) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["set_data"])(t3, ctx.feed);
			}

			if (ctx.feed !== ctx.ssb.feed) {
				if (if_block) {
					if_block.p(changed, ctx);
				} else {
					if_block = create_if_block(ctx);
					if_block.c();
					if_block.m(div2, t5);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}

			if ((!current || changed.description) && raw_value !== (raw_value = ctx.ssb.markdown(ctx.description))) {
				p.innerHTML = raw_value;
			}

			info.ctx = ctx;

			if (('messagePromise' in changed) && promise !== (promise = ctx.messagePromise) && Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["handle_promise"])(promise, info)) {
				// nothing
			} else {
				info.block.p(changed, Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["assign"])(Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["assign"])({}, ctx), info.resolved));
			}
		},

		i(local) {
			if (current) return;
			info.block.i();
			current = true;
		},

		o(local) {
			for (let i = 0; i < 3; i += 1) {
				const block = info.blocks[i];
				if (block) block.o();
			}

			current = false;
		},

		d(detaching) {
			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(div3);
			}

			if (if_block) if_block.d();

			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(t6);
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(div4);
			}

			info.block.d();
			info = null;
		}
	};
}

// (120:8) {#if feed !== ssb.feed}
function create_if_block(ctx) {
	var div3, div0, t0, div1, label0, input0, t1, i0, t2, t3, label1, input1, t4, i1, t5, t6, div2, dispose;

	return {
		c() {
			div3 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");
			div0 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");
			t0 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			div1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");
			label0 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("label");
			input0 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("input");
			t1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			i0 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("i");
			t2 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])("\r\n                following");
			t3 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			label1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("label");
			input1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("input");
			t4 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			i1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("i");
			t5 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])("\r\n                blocking");
			t6 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			div2 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");
			div0.className = "divider";
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["attr"])(input0, "type", "checkbox");
			i0.className = "form-icon";
			label0.className = "form-switch form-inline";
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["attr"])(input1, "type", "checkbox");
			i1.className = "form-icon";
			label1.className = "form-switch form-inline";
			div1.className = "form-group";
			div2.className = "divider";
			div3.className = "container";

			dispose = [
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(input0, "change", ctx.input0_change_handler),
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(input0, "change", ctx.followingChanged),
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(input1, "change", ctx.input1_change_handler),
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(input1, "change", ctx.blockingChanged)
			];
		},

		m(target, anchor) {
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, div3, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div3, div0);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div3, t0);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div3, div1);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div1, label0);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(label0, input0);

			input0.checked = ctx.following;

			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(label0, t1);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(label0, i0);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(label0, t2);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div1, t3);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div1, label1);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(label1, input1);

			input1.checked = ctx.blocking;

			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(label1, t4);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(label1, i1);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(label1, t5);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div3, t6);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div3, div2);
		},

		p(changed, ctx) {
			if (changed.following) input0.checked = ctx.following;
			if (changed.blocking) input1.checked = ctx.blocking;
		},

		d(detaching) {
			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(div3);
			}

			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["run_all"])(dispose);
		}
	};
}

// (169:6) {:catch n}
function create_catch_block(ctx) {
	var p, t0, t1_value = ctx.n.message, t1;

	return {
		c() {
			p = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("p");
			t0 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])("Error fetching messages: ");
			t1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])(t1_value);
		},

		m(target, anchor) {
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, p, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(p, t0);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(p, t1);
		},

		p(changed, ctx) {
			if ((changed.messagePromise) && t1_value !== (t1_value = ctx.n.message)) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["set_data"])(t1, t1_value);
			}
		},

		i: svelte_internal__WEBPACK_IMPORTED_MODULE_0__["noop"],
		o: svelte_internal__WEBPACK_IMPORTED_MODULE_0__["noop"],

		d(detaching) {
			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(p);
			}
		}
	};
}

// (153:6) {:then data}
function create_then_block_1(ctx) {
	var each_blocks = [], each_1_lookup = new Map(), t, ul, li, a, current, dispose;

	var each_value = ctx.lastMsgs;

	const get_key = ctx => ctx.msg.key;

	for (var i = 0; i < each_value.length; i += 1) {
		let child_ctx = get_each_context(ctx, each_value, i);
		let key = get_key(child_ctx);
		each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
	}

	return {
		c() {
			for (i = 0; i < each_blocks.length; i += 1) each_blocks[i].c();

			t = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			ul = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("ul");
			li = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("li");
			a = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("a");
			a.innerHTML = `<div class="page-item-subtitle">Load More</div>`;
			a.href = "#/public";
			li.className = "page-item page-next";
			ul.className = "pagination";
			dispose = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(a, "click", Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["stop_propagation"])(Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["prevent_default"])(ctx.click_handler)));
		},

		m(target, anchor) {
			for (i = 0; i < each_blocks.length; i += 1) each_blocks[i].m(target, anchor);

			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, t, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, ul, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(ul, li);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(li, a);
			current = true;
		},

		p(changed, ctx) {
			const each_value = ctx.lastMsgs;

			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["group_outros"])();
			each_blocks = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["update_keyed_each"])(each_blocks, changed, get_key, 1, ctx, each_value, each_1_lookup, t.parentNode, svelte_internal__WEBPACK_IMPORTED_MODULE_0__["outro_and_destroy_block"], create_each_block, t, get_each_context);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["check_outros"])();
		},

		i(local) {
			if (current) return;
			for (var i = 0; i < each_value.length; i += 1) each_blocks[i].i();

			current = true;
		},

		o(local) {
			for (i = 0; i < each_blocks.length; i += 1) each_blocks[i].o();

			current = false;
		},

		d(detaching) {
			for (i = 0; i < each_blocks.length; i += 1) each_blocks[i].d(detaching);

			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(t);
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(ul);
			}

			dispose();
		}
	};
}

// (154:8) {#each lastMsgs as msg (msg.key)}
function create_each_block(key_1, ctx) {
	var first, current;

	var messagerenderer = new _messageTypes_MessageRenderer_svelte__WEBPACK_IMPORTED_MODULE_1__["default"]({ props: { msg: ctx.msg } });

	return {
		key: key_1,

		first: null,

		c() {
			first = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["empty"])();
			messagerenderer.$$.fragment.c();
			this.first = first;
		},

		m(target, anchor) {
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, first, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["mount_component"])(messagerenderer, target, anchor);
			current = true;
		},

		p(changed, ctx) {
			var messagerenderer_changes = {};
			if (changed.lastMsgs) messagerenderer_changes.msg = ctx.msg;
			messagerenderer.$set(messagerenderer_changes);
		},

		i(local) {
			if (current) return;
			messagerenderer.$$.fragment.i(local);

			current = true;
		},

		o(local) {
			messagerenderer.$$.fragment.o(local);
			current = false;
		},

		d(detaching) {
			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(first);
			}

			messagerenderer.$destroy(detaching);
		}
	};
}

// (151:29)           <div class="loading" />        {:then data}
function create_pending_block_1(ctx) {
	var div;

	return {
		c() {
			div = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");
			div.className = "loading";
		},

		m(target, anchor) {
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, div, anchor);
		},

		p: svelte_internal__WEBPACK_IMPORTED_MODULE_0__["noop"],
		i: svelte_internal__WEBPACK_IMPORTED_MODULE_0__["noop"],
		o: svelte_internal__WEBPACK_IMPORTED_MODULE_0__["noop"],

		d(detaching) {
			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(div);
			}
		}
	};
}

// (104:40)       <div class="loading loading-lg" />    {:then}
function create_pending_block(ctx) {
	var div;

	return {
		c() {
			div = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");
			div.className = "loading loading-lg";
		},

		m(target, anchor) {
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, div, anchor);
		},

		p: svelte_internal__WEBPACK_IMPORTED_MODULE_0__["noop"],
		i: svelte_internal__WEBPACK_IMPORTED_MODULE_0__["noop"],
		o: svelte_internal__WEBPACK_IMPORTED_MODULE_0__["noop"],

		d(detaching) {
			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(div);
			}
		}
	};
}

function create_fragment(ctx) {
	var div, promise, current;

	let info = {
		ctx,
		current: null,
		pending: create_pending_block,
		then: create_then_block,
		catch: create_catch_block_1,
		value: 'null',
		error: 'n',
		blocks: Array(3)
	};

	Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["handle_promise"])(promise = ctx.aboutPromise && ctx.avatarPromise, info);

	return {
		c() {
			div = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");

			info.block.c();
			div.className = "container";
		},

		m(target, anchor) {
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, div, anchor);

			info.block.m(div, info.anchor = null);
			info.mount = () => div;
			info.anchor = null;

			current = true;
		},

		p(changed, new_ctx) {
			ctx = new_ctx;
			info.ctx = ctx;

			if (promise !== (promise = ctx.aboutPromise && ctx.avatarPromise) && Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["handle_promise"])(promise, info)) {
				// nothing
			} else {
				info.block.p(changed, Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["assign"])(Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["assign"])({}, ctx), info.resolved));
			}
		},

		i(local) {
			if (current) return;
			info.block.i();
			current = true;
		},

		o(local) {
			for (let i = 0; i < 3; i += 1) {
				const block = info.blocks[i];
				if (block) block.o();
			}

			current = false;
		},

		d(detaching) {
			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(div);
			}

			info.block.d();
			info = null;
		}
	};
}

let profile = false;

function instance($$self, $$props, $$invalidate) {
	let $routeParams;

	Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["subscribe"])($$self, _utils_js__WEBPACK_IMPORTED_MODULE_2__["routeParams"], $$value => { $routeParams = $$value; $$invalidate('$routeParams', $routeParams); });

	

  let description = false;
  let following = false;
  let blocking = false;
  let image,
    feed,
    lastMsgs = [],
    lastAbout;

  // todo: move back into using stores.
  $$invalidate('feed', feed = $routeParams.feed);

  if (!feed) {
    $$invalidate('feed', feed = ssb.feed);
  }

  let name = feed;

  document.title = `Patchfox - Feed: ${feed}`;

  console.log("fetching", feed);

  let avatarPromise = ssb.avatar(feed).then(data => {
    $$invalidate('name', name = data.name);
    $$invalidate('image', image = data.image);
    document.title = `Patchfox - Feed: ${name}`;
  });

  let aboutPromise = ssb.profile(feed).then(data => {
    lastAbout = data.about.reverse().find(m => {
      let a = m.value.content;
      return a.hasOwnProperty("description");
    });
    try {
      $$invalidate('description', description = lastAbout.value.content.description);
    } catch (n) {
      $$invalidate('description', description = "");
    }
    window.scrollTo(0, 0);
  });

  let messagePromise = ssb
    .query(
      {
        value: {
          author: feed 
        }
      },
      10
    )
    .then(msgs => {
      $$invalidate('lastMsgs', lastMsgs = msgs);

      window.scrollTo(0, 0);
    });

  if (feed !== ssb.feed) {
    ssb.following(feed).then(f => { const $$result = (following = f); $$invalidate('following', following); return $$result; });
    ssb.blocking(feed).then(f => { const $$result = (blocking = f); $$invalidate('blocking', blocking); return $$result; });
  }

  const blockingChanged = ev => {
    let v = ev.target.checked;
    if (v) {
      ssb.block(feed).catch(() => { const $$result = (blocking = false); $$invalidate('blocking', blocking); return $$result; });
    } else {
      ssb.unblock(feed).catch(() => { const $$result = (blocking = true); $$invalidate('blocking', blocking); return $$result; });
    }
  };

  const followingChanged = ev => {
    let v = ev.target.checked;
    if (v) {
      ssb.follow(feed).catch(() => { const $$result = (following = false); $$invalidate('following', following); return $$result; });
    } else {
      ssb.unfollow(feed).catch(() => { const $$result = (following = true); $$invalidate('following', following); return $$result; });
    }
  };

  // todo: refactor navigation here. This is a hack it shouldn't hide and show values which are
  // not reloading.
  const loadMoreMessages = lt => {
    $$invalidate('messagePromise', messagePromise = ssb
      .query(
        {
          value: {
            author: feed,
            timestamp: { $lt: lt }
          }
        }
      )
      .then(msgs => {
        $$invalidate('lastMsgs', lastMsgs = msgs);
        window.scrollTo(0, 0);
      }));
  };

	function input0_change_handler() {
		following = this.checked;
		$$invalidate('following', following);
	}

	function input1_change_handler() {
		blocking = this.checked;
		$$invalidate('blocking', blocking);
	}

	function click_handler() {
	                loadMoreMessages(lastMsgs[lastMsgs.length - 1].value.timestamp);
	              }

	return {
		description,
		following,
		blocking,
		image,
		feed,
		lastMsgs,
		name,
		avatarPromise,
		aboutPromise,
		messagePromise,
		blockingChanged,
		followingChanged,
		loadMoreMessages,
		ssb,
		input0_change_handler,
		input1_change_handler,
		click_handler
	};
}

class Profile extends svelte_internal__WEBPACK_IMPORTED_MODULE_0__["SvelteComponent"] {
	constructor(options) {
		super();
		Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["init"])(this, options, instance, create_fragment, svelte_internal__WEBPACK_IMPORTED_MODULE_0__["safe_not_equal"], []);
	}
}


if (false) {}

/* harmony default export */ __webpack_exports__["default"] = (Profile);


/***/ }),

/***/ "./src/ui/views/Public.svelte":
/*!************************************!*\
  !*** ./src/ui/views/Public.svelte ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var svelte_internal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! svelte/internal */ "./node_modules/svelte/internal.mjs");
/* harmony import */ var _messageTypes_MessageRenderer_svelte__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../messageTypes/MessageRenderer.svelte */ "./src/ui/messageTypes/MessageRenderer.svelte");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils.js */ "./src/ui/utils.js");
/* harmony import */ var svelte__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! svelte */ "./node_modules/svelte/index.mjs");
/* src\ui\views\Public.svelte generated by Svelte v3.4.4 */





function get_each_context(ctx, list, i) {
	const child_ctx = Object.create(ctx);
	child_ctx.msg = list[i];
	return child_ctx;
}

// (63:0) {#if error}
function create_if_block_1(ctx) {
	var div, t0, t1;

	return {
		c() {
			div = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");
			t0 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])("Error: ");
			t1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])(ctx.error);
			div.className = "toast toast-error";
		},

		m(target, anchor) {
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, div, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div, t0);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div, t1);
		},

		p: svelte_internal__WEBPACK_IMPORTED_MODULE_0__["noop"],

		d(detaching) {
			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(div);
			}
		}
	};
}

// (68:0) {:else}
function create_else_block(ctx) {
	var each_blocks = [], each_1_lookup = new Map(), t0, ul, li0, a0, t2, li1, a1, current, dispose;

	var each_value = ctx.msgs;

	const get_key = ctx => ctx.msg.key;

	for (var i = 0; i < each_value.length; i += 1) {
		let child_ctx = get_each_context(ctx, each_value, i);
		let key = get_key(child_ctx);
		each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
	}

	return {
		c() {
			for (i = 0; i < each_blocks.length; i += 1) each_blocks[i].c();

			t0 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			ul = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("ul");
			li0 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("li");
			a0 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("a");
			a0.innerHTML = `<div class="page-item-subtitle">Previous</div>`;
			t2 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			li1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("li");
			a1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("a");
			a1.innerHTML = `<div class="page-item-subtitle">Next</div>`;
			a0.href = "#/public";
			li0.className = "page-item page-previous";
			a1.href = "#/public";
			li1.className = "page-item page-next";
			ul.className = "pagination";

			dispose = [
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(a0, "click", Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["stop_propagation"])(Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["prevent_default"])(ctx.goPrevious))),
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(a1, "click", Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["stop_propagation"])(Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["prevent_default"])(ctx.goNext)))
			];
		},

		m(target, anchor) {
			for (i = 0; i < each_blocks.length; i += 1) each_blocks[i].m(target, anchor);

			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, t0, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, ul, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(ul, li0);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(li0, a0);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(ul, t2);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(ul, li1);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(li1, a1);
			current = true;
		},

		p(changed, ctx) {
			const each_value = ctx.msgs;

			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["group_outros"])();
			each_blocks = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["update_keyed_each"])(each_blocks, changed, get_key, 1, ctx, each_value, each_1_lookup, t0.parentNode, svelte_internal__WEBPACK_IMPORTED_MODULE_0__["outro_and_destroy_block"], create_each_block, t0, get_each_context);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["check_outros"])();
		},

		i(local) {
			if (current) return;
			for (var i = 0; i < each_value.length; i += 1) each_blocks[i].i();

			current = true;
		},

		o(local) {
			for (i = 0; i < each_blocks.length; i += 1) each_blocks[i].o();

			current = false;
		},

		d(detaching) {
			for (i = 0; i < each_blocks.length; i += 1) each_blocks[i].d(detaching);

			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(t0);
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(ul);
			}

			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["run_all"])(dispose);
		}
	};
}

// (66:0) {#if !msgs}
function create_if_block(ctx) {
	var div;

	return {
		c() {
			div = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");
			div.className = "loading loading-lg";
		},

		m(target, anchor) {
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, div, anchor);
		},

		p: svelte_internal__WEBPACK_IMPORTED_MODULE_0__["noop"],
		i: svelte_internal__WEBPACK_IMPORTED_MODULE_0__["noop"],
		o: svelte_internal__WEBPACK_IMPORTED_MODULE_0__["noop"],

		d(detaching) {
			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(div);
			}
		}
	};
}

// (69:2) {#each msgs as msg (msg.key)}
function create_each_block(key_1, ctx) {
	var first, current;

	var messagerenderer = new _messageTypes_MessageRenderer_svelte__WEBPACK_IMPORTED_MODULE_1__["default"]({ props: { msg: ctx.msg } });

	return {
		key: key_1,

		first: null,

		c() {
			first = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["empty"])();
			messagerenderer.$$.fragment.c();
			this.first = first;
		},

		m(target, anchor) {
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, first, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["mount_component"])(messagerenderer, target, anchor);
			current = true;
		},

		p(changed, ctx) {
			var messagerenderer_changes = {};
			if (changed.msgs) messagerenderer_changes.msg = ctx.msg;
			messagerenderer.$set(messagerenderer_changes);
		},

		i(local) {
			if (current) return;
			messagerenderer.$$.fragment.i(local);

			current = true;
		},

		o(local) {
			messagerenderer.$$.fragment.o(local);
			current = false;
		},

		d(detaching) {
			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(first);
			}

			messagerenderer.$destroy(detaching);
		}
	};
}

function create_fragment(ctx) {
	var div_2, t2, t3, current_block_type_index, if_block1, if_block1_anchor, current;

	var if_block0 = (ctx.error) && create_if_block_1(ctx);

	var if_block_creators = [
		create_if_block,
		create_else_block
	];

	var if_blocks = [];

	function select_block_type(ctx) {
		if (!ctx.msgs) return 0;
		return 1;
	}

	current_block_type_index = select_block_type(ctx);
	if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

	return {
		c() {
			div_2 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");
			div_2.innerHTML = `<div class="columns"><h4 class="column">Public Feed</h4>
			    <div class="column"></div></div>`;
			t2 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			if (if_block0) if_block0.c();
			t3 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			if_block1.c();
			if_block1_anchor = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["empty"])();
			div_2.className = "container";
		},

		m(target, anchor) {
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, div_2, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, t2, anchor);
			if (if_block0) if_block0.m(target, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, t3, anchor);
			if_blocks[current_block_type_index].m(target, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, if_block1_anchor, anchor);
			current = true;
		},

		p(changed, ctx) {
			if (ctx.error) {
				if (if_block0) {
					if_block0.p(changed, ctx);
				} else {
					if_block0 = create_if_block_1(ctx);
					if_block0.c();
					if_block0.m(t3.parentNode, t3);
				}
			} else if (if_block0) {
				if_block0.d(1);
				if_block0 = null;
			}

			var previous_block_index = current_block_type_index;
			current_block_type_index = select_block_type(ctx);
			if (current_block_type_index === previous_block_index) {
				if_blocks[current_block_type_index].p(changed, ctx);
			} else {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["group_outros"])();
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["on_outro"])(() => {
					if_blocks[previous_block_index].d(1);
					if_blocks[previous_block_index] = null;
				});
				if_block1.o(1);
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["check_outros"])();

				if_block1 = if_blocks[current_block_type_index];
				if (!if_block1) {
					if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
					if_block1.c();
				}
				if_block1.i(1);
				if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
			}
		},

		i(local) {
			if (current) return;
			if (if_block1) if_block1.i();
			current = true;
		},

		o(local) {
			if (if_block1) if_block1.o();
			current = false;
		},

		d(detaching) {
			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(div_2);
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(t2);
			}

			if (if_block0) if_block0.d(detaching);

			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(t3);
			}

			if_blocks[current_block_type_index].d(detaching);

			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(if_block1_anchor);
			}
		}
	};
}

let dropdownActive = false;

function instance($$self, $$props, $$invalidate) {
	let $routeParams;

	Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["subscribe"])($$self, _utils_js__WEBPACK_IMPORTED_MODULE_2__["routeParams"], $$value => { $routeParams = $$value; $$invalidate('$routeParams', $routeParams); });

	

  let msgs = false;
  let error = $routeParams.error || false;

  let opts = {};

  const goNext = () => {
    Object(_utils_js__WEBPACK_IMPORTED_MODULE_2__["navigate"])("/public", {
      lt: msgs[msgs.length - 1].value.timestamp
    });
  };
  const goPrevious = () => {
    history.back();
  };

	$$self.$$.update = ($$dirty = { opts: 1, $routeParams: 1, error: 1 }) => {
		if ($$dirty.opts || $$dirty.$routeParams || $$dirty.error) { {
        Object.assign(opts, $routeParams);
    
        document.title = `Patchfox - Public`;
    
        if (opts.hasOwnProperty("lt")) {
          opts.lt = parseInt(opts.lt); $$invalidate('opts', opts), $$invalidate('$routeParams', $routeParams), $$invalidate('error', error);
        }
    
        if (opts.hasOwnProperty("limit")) {
          opts.limit = parseInt(opts.limit); $$invalidate('opts', opts), $$invalidate('$routeParams', $routeParams), $$invalidate('error', error);
        }
    
        let promise = ssb
          .public(opts)
          .then(ms => {
            $$invalidate('msgs', msgs = ms);
            window.scrollTo(0, 0);
          })
          .catch(n => {
            if (!error) {
              console.error("errrrooooor", n);
            }
          });
      } }
	};

	return { msgs, error, goNext, goPrevious };
}

class Public extends svelte_internal__WEBPACK_IMPORTED_MODULE_0__["SvelteComponent"] {
	constructor(options) {
		super();
		Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["init"])(this, options, instance, create_fragment, svelte_internal__WEBPACK_IMPORTED_MODULE_0__["safe_not_equal"], []);
	}
}


if (false) {}

/* harmony default export */ __webpack_exports__["default"] = (Public);


/***/ }),

/***/ "./src/ui/views/Settings.svelte":
/*!**************************************!*\
  !*** ./src/ui/views/Settings.svelte ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var svelte_internal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! svelte/internal */ "./node_modules/svelte/internal.mjs");
/* harmony import */ var svelte__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! svelte */ "./node_modules/svelte/index.mjs");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils.js */ "./src/ui/utils.js");
/* harmony import */ var _abusePrevention_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../abusePrevention.js */ "./src/ui/abusePrevention.js");
/* harmony import */ var C_Users_andre_prog_ssbc_patchfox_src_ui_views_Settings_svelte_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./src/ui/views/Settings.svelte.css */ "./src/ui/views/Settings.svelte.css");
/* harmony import */ var C_Users_andre_prog_ssbc_patchfox_src_ui_views_Settings_svelte_css__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(C_Users_andre_prog_ssbc_patchfox_src_ui_views_Settings_svelte_css__WEBPACK_IMPORTED_MODULE_4__);
/* src\ui\views\Settings.svelte generated by Svelte v3.4.4 */





function get_each_context(ctx, list, i) {
	const child_ctx = Object.create(ctx);
	child_ctx.filter = list[i];
	return child_ctx;
}

// (399:4) {:else}
function create_else_block(ctx) {
	var div;

	return {
		c() {
			div = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");
			div.innerHTML = `<p class="label">You don't have any filter yet.</p>`;
			div.className = "column col-12";
		},

		m(target, anchor) {
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, div, anchor);
		},

		d(detaching) {
			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(div);
			}
		}
	};
}

// (370:14) {#if filter.feed}
function create_if_block_3(ctx) {
	var li, t0, a, t1_value = ctx.filter.feed, t1, a_href_value;

	return {
		c() {
			li = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("li");
			t0 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])("From ");
			a = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("a");
			t1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])(t1_value);
			a.href = a_href_value = "?feed=" + ctx.filter.feed + "#/profile";
			a.target = "_blank";
			a.className = "feed svelte-1e0jkdi";
		},

		m(target, anchor) {
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, li, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(li, t0);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(li, a);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(a, t1);
		},

		p(changed, ctx) {
			if ((changed.currentFilters) && t1_value !== (t1_value = ctx.filter.feed)) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["set_data"])(t1, t1_value);
			}

			if ((changed.currentFilters) && a_href_value !== (a_href_value = "?feed=" + ctx.filter.feed + "#/profile")) {
				a.href = a_href_value;
			}
		},

		d(detaching) {
			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(li);
			}
		}
	};
}

// (373:14) {#if filter.channel}
function create_if_block_2(ctx) {
	var li, t0, a, t1, t2_value = ctx.filter.channel, t2, a_href_value;

	return {
		c() {
			li = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("li");
			t0 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])("On channel ");
			a = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("a");
			t1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])("#");
			t2 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])(t2_value);
			a.href = a_href_value = "?channel=" + ctx.filter.feed + "#/channel";
			a.target = "_blank";
			a.className = "feed svelte-1e0jkdi";
		},

		m(target, anchor) {
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, li, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(li, t0);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(li, a);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(a, t1);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(a, t2);
		},

		p(changed, ctx) {
			if ((changed.currentFilters) && t2_value !== (t2_value = ctx.filter.channel)) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["set_data"])(t2, t2_value);
			}

			if ((changed.currentFilters) && a_href_value !== (a_href_value = "?channel=" + ctx.filter.feed + "#/channel")) {
				a.href = a_href_value;
			}
		},

		d(detaching) {
			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(li);
			}
		}
	};
}

// (376:14) {#if filter.keywords.length > 0}
function create_if_block_1(ctx) {
	var i, li, t0, t1_value = ctx.filter.keywords.join(', '), t1;

	return {
		c() {
			i = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("i");
			li = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("li");
			t0 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])("Containing: ");
			t1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])(t1_value);
		},

		m(target, anchor) {
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, i, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(i, li);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(li, t0);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(li, t1);
		},

		p(changed, ctx) {
			if ((changed.currentFilters) && t1_value !== (t1_value = ctx.filter.keywords.join(', '))) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["set_data"])(t1, t1_value);
			}
		},

		d(detaching) {
			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(i);
			}
		}
	};
}

// (381:14) {#if filter.expires}
function create_if_block(ctx) {
	var li, t0, t1_value = ctx.filter.expires, t1;

	return {
		c() {
			li = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("li");
			t0 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])("Expiring in ");
			t1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])(t1_value);
		},

		m(target, anchor) {
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, li, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(li, t0);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(li, t1);
		},

		p(changed, ctx) {
			if ((changed.currentFilters) && t1_value !== (t1_value = ctx.filter.expires)) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["set_data"])(t1, t1_value);
			}
		},

		d(detaching) {
			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(li);
			}
		}
	};
}

// (362:4) {#each currentFilters as filter}
function create_each_block(ctx) {
	var div5, div4, div1, div0, t0_value = ctx.filter.action, t0, t1, div2, ul, t2, t3, t4, t5, div3, button, dispose;

	var if_block0 = (ctx.filter.feed) && create_if_block_3(ctx);

	var if_block1 = (ctx.filter.channel) && create_if_block_2(ctx);

	var if_block2 = (ctx.filter.keywords.length > 0) && create_if_block_1(ctx);

	var if_block3 = (ctx.filter.expires) && create_if_block(ctx);

	function click_handler() {
		return ctx.click_handler(ctx);
	}

	return {
		c() {
			div5 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");
			div4 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");
			div1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");
			div0 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");
			t0 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])(t0_value);
			t1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			div2 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");
			ul = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("ul");
			if (if_block0) if_block0.c();
			t2 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			if (if_block1) if_block1.c();
			t3 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			if (if_block2) if_block2.c();
			t4 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			if (if_block3) if_block3.c();
			t5 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			div3 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");
			button = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("button");
			button.textContent = "Delete";
			div0.className = "card-title h5";
			div1.className = "card-header";
			div2.className = "card-body";
			button.className = "btn";
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["attr"])(button, "aria-label", "Delete");
			div3.className = "card-footer";
			div4.className = "card filter svelte-1e0jkdi";
			div5.className = "column col-6";
			dispose = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(button, "click", click_handler);
		},

		m(target, anchor) {
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, div5, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div5, div4);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div4, div1);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div1, div0);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div0, t0);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div4, t1);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div4, div2);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div2, ul);
			if (if_block0) if_block0.m(ul, null);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(ul, t2);
			if (if_block1) if_block1.m(ul, null);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(ul, t3);
			if (if_block2) if_block2.m(ul, null);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(ul, t4);
			if (if_block3) if_block3.m(ul, null);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div4, t5);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div4, div3);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div3, button);
		},

		p(changed, new_ctx) {
			ctx = new_ctx;
			if ((changed.currentFilters) && t0_value !== (t0_value = ctx.filter.action)) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["set_data"])(t0, t0_value);
			}

			if (ctx.filter.feed) {
				if (if_block0) {
					if_block0.p(changed, ctx);
				} else {
					if_block0 = create_if_block_3(ctx);
					if_block0.c();
					if_block0.m(ul, t2);
				}
			} else if (if_block0) {
				if_block0.d(1);
				if_block0 = null;
			}

			if (ctx.filter.channel) {
				if (if_block1) {
					if_block1.p(changed, ctx);
				} else {
					if_block1 = create_if_block_2(ctx);
					if_block1.c();
					if_block1.m(ul, t3);
				}
			} else if (if_block1) {
				if_block1.d(1);
				if_block1 = null;
			}

			if (ctx.filter.keywords.length > 0) {
				if (if_block2) {
					if_block2.p(changed, ctx);
				} else {
					if_block2 = create_if_block_1(ctx);
					if_block2.c();
					if_block2.m(ul, t4);
				}
			} else if (if_block2) {
				if_block2.d(1);
				if_block2 = null;
			}

			if (ctx.filter.expires) {
				if (if_block3) {
					if_block3.p(changed, ctx);
				} else {
					if_block3 = create_if_block(ctx);
					if_block3.c();
					if_block3.m(ul, null);
				}
			} else if (if_block3) {
				if_block3.d(1);
				if_block3 = null;
			}
		},

		d(detaching) {
			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(div5);
			}

			if (if_block0) if_block0.d();
			if (if_block1) if_block1.d();
			if (if_block2) if_block2.d();
			if (if_block3) if_block3.d();
			dispose();
		}
	};
}

function create_fragment(ctx) {
	var h1, t1, p0, t5, p1, t11, h40, t13, form0, label0, t21, input0, t22, label1, t24, input1, t25, label2, t27, textarea, t28, br0, t29, button0, t31, p2, t33, h41, t35, form1, label3, t37, input2, t38, br1, t39, span, t43, label4, input3, t44, i5, t45, b1, t47, t48, label5, input4, t49, i6, t50, b2, t52, t53, label6, input5, t54, i7, t55, b3, t57, t58, label7, input6, t59, i8, t60, b4, t62, t63, label8, input7, t64, i9, t65, b5, t67, t68, label9, input8, t69, i10, t70, b6, t72, t73, label10, input9, t74, i11, t75, b7, t77, t78, label11, input10, t79, i12, t80, b8, t82, t83, div0, t84, label12, input11, t85, i13, t86, b9, t88, t89, br2, t90, label13, t92, label14, input12, t93, i14, t94, t95, label15, input13, t96, i15, t97, t98, h42, t100, p3, t102, h50, t104, p4, t108, div2, div1, t109, h51, t111, form_group, label16, input14, t112, i16, t113, t114, label17, input15, t115, i17, t116, t117, label18, t119, input16, t120, label19, t122, input17, t123, label20, t125, input18, t126, label21, t128, input19, t129, br3, t130, button1, t132, br4, t133, br5, dispose;

	var each_value = ctx.currentFilters;

	var each_blocks = [];

	for (var i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
	}

	var each_1_else = null;

	if (!each_value.length) {
		each_1_else = create_else_block(ctx);
		each_1_else.c();
	}

	return {
		c() {
			h1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("h1");
			h1.textContent = "Settings";
			t1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			p0 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("p");
			p0.innerHTML = `
			  Settings changes are saved as you make them except for identity and connection
			  changes, those require a full page reload and thus you need to press a save
			  button. The reason behind this is that Patchfox needs to disconnect and
			  reconnect to the
			  <i>ssb-server</i>
			  using the new info.
			`;
			t5 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			p1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("p");
			p1.innerHTML = `<b>
			    You can't use Patchfox until you fill your
			    <i>Connection &amp; Identity</i>
			    information.
			    <a href="/docs/index.html#/troubleshooting/no-configuration" target="_blank">
			      If you want more help regarding connection and configuration click here
			    </a>
			    .
			  </b>`;
			t11 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			h40 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("h4");
			h40.textContent = "Connection & Identity";
			t13 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			form0 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("form");
			label0 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("label");
			label0.innerHTML = `
			    Patchfox can infer the values for both
			    <i>remote</i>
			    and
			    <i>secret</i>
			    from your
			    <code>~/.ssb/secret</code>
			    file. You can use the button below to browse for it.
			  `;
			t21 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			input0 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("input");
			t22 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			label1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("label");
			label1.textContent = "Remote";
			t24 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			input1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("input");
			t25 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			label2 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("label");
			label2.textContent = "Secret";
			t27 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			textarea = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("textarea");
			t28 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			br0 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("br");
			t29 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			button0 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("button");
			button0.textContent = "Save Identity & Remote";
			t31 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			p2 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("p");
			p2.textContent = "Saving identity and remote will cause a full page refresh.";
			t33 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			h41 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("h4");
			h41.textContent = "Vieweing Experience";
			t35 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			form1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("form");
			label3 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("label");
			label3.textContent = "Messages per page";
			t37 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			input2 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("input");
			t38 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			br1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("br");
			t39 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			span = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("span");
			span.innerHTML = `
			    Which message types you want to see?
			    <a target="_blank" href="/docs/index.html#/message_types/">
			      Click here for more information about
			      <i>Message Types</i></a>`;
			t43 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			label4 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("label");
			input3 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("input");
			t44 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			i5 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("i");
			t45 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			b1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("b");
			b1.textContent = "About";
			t47 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])("\r\n    (aka people setting avatars and descriptions; gatherings)");
			t48 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			label5 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("label");
			input4 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("input");
			t49 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			i6 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("i");
			t50 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			b2 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("b");
			b2.textContent = "Blog";
			t52 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])("\r\n    (Longform text posts)");
			t53 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			label6 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("label");
			input5 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("input");
			t54 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			i7 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("i");
			t55 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			b3 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("b");
			b3.textContent = "Channel";
			t57 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])("\r\n    (People subscribing to channels)");
			t58 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			label7 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("label");
			input6 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("input");
			t59 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			i8 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("i");
			t60 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			b4 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("b");
			b4.textContent = "Contact";
			t62 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])("\r\n    (People following each other)");
			t63 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			label8 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("label");
			input7 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("input");
			t64 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			i9 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("i");
			t65 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			b5 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("b");
			b5.textContent = "Posts";
			t67 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])("\r\n    (Common content post, leave this on or it is not that fun)");
			t68 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			label9 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("label");
			input8 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("input");
			t69 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			i10 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("i");
			t70 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			b6 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("b");
			b6.textContent = "Pub";
			t72 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])("\r\n    (Pub servers announcements)");
			t73 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			label10 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("label");
			input9 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("input");
			t74 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			i11 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("i");
			t75 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			b7 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("b");
			b7.textContent = "Private";
			t77 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])("\r\n    (Private messages; You won't be able to read them, but you'll see their\r\n    encrypted content passing by)");
			t78 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			label11 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("label");
			input10 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("input");
			t79 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			i12 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("i");
			t80 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			b8 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("b");
			b8.textContent = "Vote";
			t82 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])("\r\n    (People liking/digging stuff)");
			t83 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			div0 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");
			t84 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			label12 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("label");
			input11 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("input");
			t85 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			i13 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("i");
			t86 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			b9 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("b");
			b9.textContent = "Unknown";
			t88 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])("\r\n    (Show messages Patchfox doesn't understand as their raw content)");
			t89 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			br2 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("br");
			t90 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			label13 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("label");
			label13.textContent = "Feed column size. There is research that says that a short column size makes\r\n    for a more pleasant reading experience, still some users prefer to use the\r\n    full screen space. Your choice is between reading through long text lines or\r\n    short ones.";
			t92 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			label14 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("label");
			input12 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("input");
			t93 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			i14 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("i");
			t94 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])("\r\n    Short column");
			t95 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			label15 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("label");
			input13 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("input");
			t96 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			i15 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("i");
			t97 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])("\r\n    Long column");
			t98 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			h42 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("h4");
			h42.textContent = "Abuse Prevention";
			t100 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			p3 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("p");
			p3.textContent = "Use the features from this section to tailor your Patchfox experience to suit\r\n  your needs.";
			t102 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			h50 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("h5");
			h50.textContent = "Filters";
			t104 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			p4 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("p");
			p4.innerHTML = `
			  Use filters to hide messages and blur images. Use any combination of channel,
			  feeds and keywords (separated by commas) to create your triggers and make SSB
			  the platform you want. Be aware that these filters are saved to your browser,
			  they are not shared on the feed, they don't affect gossiping, they only affect
			  the displaying of messages and images in Patchfox itself. If you create a
			  filter and open a different client, they won't be working there. If you want
			  to learn more about
			  <a href="/docs/index.html#/features/filter">
			    filters, click here to go to the documentation.
			  </a>
			  You can create as many filters as you want.
			`;
			t108 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			div2 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");
			div1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");

			for (var i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t109 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			h51 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("h5");
			h51.textContent = "New Filter";
			t111 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			form_group = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("form-group");
			label16 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("label");
			input14 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("input");
			t112 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			i16 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("i");
			t113 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])("\r\n    Hide Message");
			t114 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			label17 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("label");
			input15 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("input");
			t115 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			i17 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("i");
			t116 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])("\r\n    Blur Images");
			t117 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			label18 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("label");
			label18.textContent = "Channel";
			t119 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			input16 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("input");
			t120 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			label19 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("label");
			label19.textContent = "Feed";
			t122 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			input17 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("input");
			t123 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			label20 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("label");
			label20.textContent = "Keywords";
			t125 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			input18 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("input");
			t126 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			label21 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("label");
			label21.textContent = "Expiration Date";
			t128 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			input19 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("input");
			t129 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			br3 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("br");
			t130 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			button1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("button");
			button1.textContent = "Add Filter";
			t132 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			br4 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("br");
			t133 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			br5 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("br");
			label0.className = "form-label";
			label0.htmlFor = "secret-file";
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["attr"])(input0, "type", "file");
			input0.className = "form-input";
			input0.id = "secret-file";
			label1.className = "form-label";
			label1.htmlFor = "remote";
			input1.className = "form-input";
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["attr"])(input1, "type", "text");
			input1.id = "remote";
			input1.placeholder = "remote";
			label2.className = "form-label";
			label2.htmlFor = "secret";
			textarea.className = "form-input";
			textarea.id = "secret";
			textarea.placeholder = "Your secret";
			textarea.rows = "8";
			button0.className = "btn btn-primary float-right";
			form0.className = "form-group";
			label3.className = "form-label";
			label3.htmlFor = "limit";
			input2.className = "form-input";
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["attr"])(input2, "type", "number");
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["attr"])(input3, "type", "checkbox");
			i5.className = "form-icon";
			label4.className = "form-switch";
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["attr"])(input4, "type", "checkbox");
			i6.className = "form-icon";
			label5.className = "form-switch";
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["attr"])(input5, "type", "checkbox");
			i7.className = "form-icon";
			label6.className = "form-switch";
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["attr"])(input6, "type", "checkbox");
			i8.className = "form-icon";
			label7.className = "form-switch";
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["attr"])(input7, "type", "checkbox");
			i9.className = "form-icon";
			label8.className = "form-switch";
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["attr"])(input8, "type", "checkbox");
			i10.className = "form-icon";
			label9.className = "form-switch";
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["attr"])(input9, "type", "checkbox");
			i11.className = "form-icon";
			label10.className = "form-switch";
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["attr"])(input10, "type", "checkbox");
			i12.className = "form-icon";
			label11.className = "form-switch";
			div0.className = "divider";
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["attr"])(input11, "type", "checkbox");
			i13.className = "form-icon";
			label12.className = "form-switch";
			label13.className = "form-label";
			ctx.$$binding_groups[1].push(input12);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["attr"])(input12, "type", "radio");
			input12.name = "column-size";
			input12.__value = "short";
			input12.value = input12.__value;
			i14.className = "form-icon";
			label14.className = "form-radio";
			ctx.$$binding_groups[1].push(input13);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["attr"])(input13, "type", "radio");
			input13.name = "column-size";
			input13.__value = "long";
			input13.value = input13.__value;
			i15.className = "form-icon";
			label15.className = "form-radio";
			form1.className = "form-group";
			div1.className = "columns";
			div2.className = "container";
			ctx.$$binding_groups[0].push(input14);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["attr"])(input14, "type", "radio");
			input14.name = "filter-action";
			input14.__value = "hide";
			input14.value = input14.__value;
			i16.className = "form-icon";
			label16.className = "form-radio";
			ctx.$$binding_groups[0].push(input15);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["attr"])(input15, "type", "radio");
			input15.name = "filter-action";
			input15.__value = "blur";
			input15.value = input15.__value;
			i17.className = "form-icon";
			label17.className = "form-radio";
			label18.className = "form-label";
			label18.htmlFor = "remote";
			input16.className = "form-input";
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["attr"])(input16, "type", "text");
			input16.placeholder = "Channel";
			label19.className = "form-label";
			label19.htmlFor = "remote";
			input17.className = "form-input";
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["attr"])(input17, "type", "text");
			input17.placeholder = "Feed";
			label20.className = "form-label";
			label20.htmlFor = "remote";
			input18.className = "form-input";
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["attr"])(input18, "type", "text");
			input18.placeholder = "Keywords separated by commas";
			label21.className = "form-label";
			label21.htmlFor = "remote";
			input19.className = "form-input";
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["attr"])(input19, "type", "date");
			input19.placeholder = "When should this filter expiry";
			button1.className = "btn btn-primary";

			dispose = [
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(input0, "change", ctx.selectedFile),
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(input1, "input", ctx.input1_input_handler),
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(textarea, "input", ctx.textarea_input_handler),
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(button0, "click", ctx.saveConfiguration),
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(input2, "input", ctx.input2_input_handler),
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(input2, "change", ctx.change_handler),
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(input3, "change", ctx.input3_change_handler),
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(input3, "change", ctx.change_handler_1),
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(input4, "change", ctx.input4_change_handler),
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(input4, "change", ctx.change_handler_2),
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(input5, "change", ctx.input5_change_handler),
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(input5, "change", ctx.change_handler_3),
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(input6, "change", ctx.input6_change_handler),
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(input6, "change", ctx.change_handler_4),
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(input7, "change", ctx.input7_change_handler),
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(input7, "change", ctx.change_handler_5),
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(input8, "change", ctx.input8_change_handler),
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(input8, "change", ctx.change_handler_6),
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(input9, "change", ctx.input9_change_handler),
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(input9, "change", ctx.change_handler_7),
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(input10, "change", ctx.input10_change_handler),
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(input10, "change", ctx.change_handler_8),
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(input11, "change", ctx.input11_change_handler),
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(input11, "change", ctx.change_handler_9),
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(input12, "change", ctx.input12_change_handler),
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(input12, "change", ctx.change_handler_10),
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(input13, "change", ctx.input13_change_handler),
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(input13, "change", ctx.change_handler_11),
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(input14, "change", ctx.input14_change_handler),
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(input15, "change", ctx.input15_change_handler),
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(input16, "input", ctx.input16_input_handler),
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(input17, "input", ctx.input17_input_handler),
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(input18, "input", ctx.input18_input_handler),
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(input19, "input", ctx.input19_input_handler),
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["listen"])(button1, "click", ctx.addNewFilter)
			];
		},

		m(target, anchor) {
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, h1, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, t1, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, p0, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, t5, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, p1, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, t11, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, h40, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, t13, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, form0, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(form0, label0);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(form0, t21);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(form0, input0);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(form0, t22);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(form0, label1);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(form0, t24);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(form0, input1);

			input1.value = ctx.remote;

			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(form0, t25);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(form0, label2);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(form0, t27);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(form0, textarea);

			textarea.value = ctx.keys;

			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(form0, t28);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(form0, br0);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(form0, t29);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(form0, button0);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(form0, t31);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(form0, p2);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, t33, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, h41, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, t35, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, form1, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(form1, label3);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(form1, t37);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(form1, input2);

			input2.value = ctx.limit;

			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(form1, t38);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(form1, br1);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(form1, t39);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(form1, span);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(form1, t43);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(form1, label4);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(label4, input3);

			input3.checked = ctx.showTypeAbout;

			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(label4, t44);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(label4, i5);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(label4, t45);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(label4, b1);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(label4, t47);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(form1, t48);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(form1, label5);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(label5, input4);

			input4.checked = ctx.showTypeBlog;

			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(label5, t49);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(label5, i6);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(label5, t50);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(label5, b2);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(label5, t52);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(form1, t53);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(form1, label6);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(label6, input5);

			input5.checked = ctx.showTypeChannel;

			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(label6, t54);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(label6, i7);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(label6, t55);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(label6, b3);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(label6, t57);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(form1, t58);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(form1, label7);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(label7, input6);

			input6.checked = ctx.showTypeContact;

			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(label7, t59);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(label7, i8);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(label7, t60);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(label7, b4);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(label7, t62);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(form1, t63);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(form1, label8);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(label8, input7);

			input7.checked = ctx.showTypePost;

			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(label8, t64);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(label8, i9);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(label8, t65);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(label8, b5);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(label8, t67);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(form1, t68);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(form1, label9);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(label9, input8);

			input8.checked = ctx.showTypePub;

			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(label9, t69);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(label9, i10);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(label9, t70);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(label9, b6);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(label9, t72);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(form1, t73);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(form1, label10);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(label10, input9);

			input9.checked = ctx.showTypePrivate;

			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(label10, t74);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(label10, i11);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(label10, t75);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(label10, b7);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(label10, t77);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(form1, t78);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(form1, label11);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(label11, input10);

			input10.checked = ctx.showTypeVote;

			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(label11, t79);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(label11, i12);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(label11, t80);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(label11, b8);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(label11, t82);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(form1, t83);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(form1, div0);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(form1, t84);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(form1, label12);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(label12, input11);

			input11.checked = ctx.showTypeUnknown;

			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(label12, t85);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(label12, i13);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(label12, t86);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(label12, b9);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(label12, t88);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(form1, t89);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(form1, br2);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(form1, t90);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(form1, label13);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(form1, t92);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(form1, label14);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(label14, input12);

			input12.checked = input12.__value === ctx.columnSize;

			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(label14, t93);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(label14, i14);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(label14, t94);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(form1, t95);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(form1, label15);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(label15, input13);

			input13.checked = input13.__value === ctx.columnSize;

			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(label15, t96);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(label15, i15);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(label15, t97);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, t98, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, h42, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, t100, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, p3, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, t102, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, h50, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, t104, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, p4, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, t108, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, div2, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div2, div1);

			for (var i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div1, null);
			}

			if (each_1_else) {
				each_1_else.m(div1, null);
			}

			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, t109, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, h51, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, t111, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, form_group, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(form_group, label16);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(label16, input14);

			input14.checked = input14.__value === ctx.filterAction;

			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(label16, t112);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(label16, i16);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(label16, t113);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(form_group, t114);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(form_group, label17);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(label17, input15);

			input15.checked = input15.__value === ctx.filterAction;

			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(label17, t115);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(label17, i17);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(label17, t116);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(form_group, t117);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(form_group, label18);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(form_group, t119);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(form_group, input16);

			input16.value = ctx.filterChannel;

			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(form_group, t120);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(form_group, label19);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(form_group, t122);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(form_group, input17);

			input17.value = ctx.filterFeed;

			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(form_group, t123);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(form_group, label20);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(form_group, t125);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(form_group, input18);

			input18.value = ctx.filterKeywords;

			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(form_group, t126);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(form_group, label21);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(form_group, t128);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(form_group, input19);

			input19.value = ctx.filterExpiry;

			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, t129, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, br3, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, t130, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, button1, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, t132, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, br4, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, t133, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, br5, anchor);
		},

		p(changed, ctx) {
			if (changed.remote && (input1.value !== ctx.remote)) input1.value = ctx.remote;
			if (changed.keys) textarea.value = ctx.keys;
			if (changed.limit) input2.value = ctx.limit;
			if (changed.showTypeAbout) input3.checked = ctx.showTypeAbout;
			if (changed.showTypeBlog) input4.checked = ctx.showTypeBlog;
			if (changed.showTypeChannel) input5.checked = ctx.showTypeChannel;
			if (changed.showTypeContact) input6.checked = ctx.showTypeContact;
			if (changed.showTypePost) input7.checked = ctx.showTypePost;
			if (changed.showTypePub) input8.checked = ctx.showTypePub;
			if (changed.showTypePrivate) input9.checked = ctx.showTypePrivate;
			if (changed.showTypeVote) input10.checked = ctx.showTypeVote;
			if (changed.showTypeUnknown) input11.checked = ctx.showTypeUnknown;
			if (changed.columnSize) input12.checked = input12.__value === ctx.columnSize;
			if (changed.columnSize) input13.checked = input13.__value === ctx.columnSize;

			if (changed.currentFilters) {
				each_value = ctx.currentFilters;

				for (var i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(changed, child_ctx);
					} else {
						each_blocks[i] = create_each_block(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div1, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}
				each_blocks.length = each_value.length;
			}

			if (each_value.length) {
				if (each_1_else) {
					each_1_else.d(1);
					each_1_else = null;
				}
			} else if (!each_1_else) {
				each_1_else = create_else_block(ctx);
				each_1_else.c();
				each_1_else.m(div1, null);
			}

			if (changed.filterAction) input14.checked = input14.__value === ctx.filterAction;
			if (changed.filterAction) input15.checked = input15.__value === ctx.filterAction;
			if (changed.filterChannel && (input16.value !== ctx.filterChannel)) input16.value = ctx.filterChannel;
			if (changed.filterFeed && (input17.value !== ctx.filterFeed)) input17.value = ctx.filterFeed;
			if (changed.filterKeywords && (input18.value !== ctx.filterKeywords)) input18.value = ctx.filterKeywords;
			if (changed.filterExpiry) input19.value = ctx.filterExpiry;
		},

		i: svelte_internal__WEBPACK_IMPORTED_MODULE_0__["noop"],
		o: svelte_internal__WEBPACK_IMPORTED_MODULE_0__["noop"],

		d(detaching) {
			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(h1);
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(t1);
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(p0);
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(t5);
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(p1);
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(t11);
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(h40);
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(t13);
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(form0);
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(t33);
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(h41);
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(t35);
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(form1);
			}

			ctx.$$binding_groups[1].splice(ctx.$$binding_groups[1].indexOf(input12), 1);
			ctx.$$binding_groups[1].splice(ctx.$$binding_groups[1].indexOf(input13), 1);

			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(t98);
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(h42);
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(t100);
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(p3);
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(t102);
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(h50);
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(t104);
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(p4);
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(t108);
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(div2);
			}

			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["destroy_each"])(each_blocks, detaching);

			if (each_1_else) each_1_else.d();

			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(t109);
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(h51);
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(t111);
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(form_group);
			}

			ctx.$$binding_groups[0].splice(ctx.$$binding_groups[0].indexOf(input14), 1);
			ctx.$$binding_groups[0].splice(ctx.$$binding_groups[0].indexOf(input15), 1);

			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(t129);
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(br3);
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(t130);
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(button1);
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(t132);
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(br4);
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(t133);
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(br5);
			}

			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["run_all"])(dispose);
		}
	};
}

function instance($$self, $$props, $$invalidate) {
	
 
  let keys = {};
  let remote = "";
  let limit = Object(_utils_js__WEBPACK_IMPORTED_MODULE_2__["getPref"])("limit", 10);
  let columnSize = Object(_utils_js__WEBPACK_IMPORTED_MODULE_2__["getPref"])("columnSize", "short");

  document.title = "Patchfox - Settings";

  // message type filters
  let showTypeUnknown = Object(_utils_js__WEBPACK_IMPORTED_MODULE_2__["getPref"])("showTypeUnknown", false);
  let showTypeAbout = Object(_utils_js__WEBPACK_IMPORTED_MODULE_2__["getPref"])("showTypeAbout", true);
  let showTypeBlog = Object(_utils_js__WEBPACK_IMPORTED_MODULE_2__["getPref"])("showTypeBlog", true);
  let showTypeChannel = Object(_utils_js__WEBPACK_IMPORTED_MODULE_2__["getPref"])("showTypeChannel", true);
  let showTypeContact = Object(_utils_js__WEBPACK_IMPORTED_MODULE_2__["getPref"])("showTypeContact", true);
  let showTypePost = Object(_utils_js__WEBPACK_IMPORTED_MODULE_2__["getPref"])("showTypePost", true);
  let showTypePrivate = Object(_utils_js__WEBPACK_IMPORTED_MODULE_2__["getPref"])("showTypePrivate", true);
  let showTypePub = Object(_utils_js__WEBPACK_IMPORTED_MODULE_2__["getPref"])("showTypePub", true);
  let showTypeVote = Object(_utils_js__WEBPACK_IMPORTED_MODULE_2__["getPref"])("showTypeVote", true);

  // Abuse Prevention - filters
  let currentFilters = Object(_abusePrevention_js__WEBPACK_IMPORTED_MODULE_3__["getFilters"])();
  let filterFeed = "";
  let filterChannel = "";
  let filterKeywords = "";
  let filterExpiry = "";
  let filterAction = "";

  const saveConfiguration = ev => {
    Object(_utils_js__WEBPACK_IMPORTED_MODULE_2__["setConnectionConfiguration"])({ remote, keys: JSON.parse(keys), manifest });
    Object(_utils_js__WEBPACK_IMPORTED_MODULE_2__["navigate"])("/public");
    location.reload();
  };

  const selectedFile = ev => {
    const secretFile = ev.target.files[0];
    const reader = new FileReader();
    reader.onload = function(evt) {
      console.log(evt.target.result);
      const contents = evt.target.result;
      let secret = contents.split("\n").filter(function(line) {
        return line.indexOf("#") != 0;
      });
      secret = JSON.parse(secret.join("\n"));
      $$invalidate('remote', remote = `ws://localhost:8989~shs:${secret.id.slice(
        0,
        secret.id.indexOf("=") + 1
      )}`);
      updateUI({ keys: secret, remote });
    };
    reader.readAsText(secretFile);
  };

  const updateUI = savedData => {
    console.log("saved data from settings", savedData);
    $$invalidate('remote', remote = savedData.remote || "");
    if (savedData.keys) {
      $$invalidate('keys', keys = JSON.stringify(savedData.keys, null, 2));
    } else {
      $$invalidate('keys', keys = "");
    }
  };

  const onError = error => {
    console.error("error on settings", error);
  };

  const gettingStoredSettings = browser.storage.local
    .get()
    .then(updateUI, onError);

  const addNewFilter = () => {
    let keywords = filterKeywords
      .split(",")
      .map(v => v.trim())
      .filter(v => v.length !== 0);

    let filter = {};
    filter.action = filterAction.length !== 0 ? filterAction : false;
    filter.feed = filterFeed.length !== 0 ? filterFeed : false;
    filter.channel = filterChannel.length !== 0 ? filterChannel : false;
    filter.keywords = keywords;
    filter.expires = filterExpiry.length !== 0 ? filterExpiry : false;

    if (filter.channel && filter.channel.startsWith("#")) {
      filter.channel = filter.channel.slice(1);
    }

    if (
      filter.action &&
      (filter.feed || filter.channel || filter.keywords.length > 0)
    ) {
      Object(_abusePrevention_js__WEBPACK_IMPORTED_MODULE_3__["addFilter"])(filter);

      $$invalidate('currentFilters', currentFilters = Object(_abusePrevention_js__WEBPACK_IMPORTED_MODULE_3__["getFilters"])());

      console.dir("filters", currentFilters);

      $$invalidate('filterFeed', filterFeed = "");
      $$invalidate('filterChannel', filterChannel = "");
      $$invalidate('filterKeywords', filterKeywords = "");
      $$invalidate('filterExpiry', filterExpiry = "");
      $$invalidate('filterAction', filterAction = "");
    } else {
      alert("Fill at least filter action and one of feed, channel or keywords");
    }
  };

	const $$binding_groups = [[], []];

	function input1_input_handler() {
		remote = this.value;
		$$invalidate('remote', remote);
	}

	function textarea_input_handler() {
		keys = this.value;
		$$invalidate('keys', keys);
	}

	function input2_input_handler() {
		limit = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["to_number"])(this.value);
		$$invalidate('limit', limit);
	}

	function change_handler() {
		return Object(_utils_js__WEBPACK_IMPORTED_MODULE_2__["setPref"])('limit', limit);
	}

	function input3_change_handler() {
		showTypeAbout = this.checked;
		$$invalidate('showTypeAbout', showTypeAbout);
	}

	function change_handler_1(ev) {
	        Object(_utils_js__WEBPACK_IMPORTED_MODULE_2__["setPref"])('showTypeAbout', showTypeAbout);
	      }

	function input4_change_handler() {
		showTypeBlog = this.checked;
		$$invalidate('showTypeBlog', showTypeBlog);
	}

	function change_handler_2(ev) {
	        Object(_utils_js__WEBPACK_IMPORTED_MODULE_2__["setPref"])('showTypeBlog', showTypeBlog);
	      }

	function input5_change_handler() {
		showTypeChannel = this.checked;
		$$invalidate('showTypeChannel', showTypeChannel);
	}

	function change_handler_3(ev) {
	        Object(_utils_js__WEBPACK_IMPORTED_MODULE_2__["setPref"])('showTypeChannel', showTypeChannel);
	      }

	function input6_change_handler() {
		showTypeContact = this.checked;
		$$invalidate('showTypeContact', showTypeContact);
	}

	function change_handler_4(ev) {
	        Object(_utils_js__WEBPACK_IMPORTED_MODULE_2__["setPref"])('showTypeContact', showTypeContact);
	      }

	function input7_change_handler() {
		showTypePost = this.checked;
		$$invalidate('showTypePost', showTypePost);
	}

	function change_handler_5(ev) {
	        Object(_utils_js__WEBPACK_IMPORTED_MODULE_2__["setPref"])('showTypePost', showTypePost);
	      }

	function input8_change_handler() {
		showTypePub = this.checked;
		$$invalidate('showTypePub', showTypePub);
	}

	function change_handler_6(ev) {
	        Object(_utils_js__WEBPACK_IMPORTED_MODULE_2__["setPref"])('showTypePub', showTypePub);
	      }

	function input9_change_handler() {
		showTypePrivate = this.checked;
		$$invalidate('showTypePrivate', showTypePrivate);
	}

	function change_handler_7(ev) {
	        Object(_utils_js__WEBPACK_IMPORTED_MODULE_2__["setPref"])('showTypePrivate', showTypePrivate);
	      }

	function input10_change_handler() {
		showTypeVote = this.checked;
		$$invalidate('showTypeVote', showTypeVote);
	}

	function change_handler_8(ev) {
	        Object(_utils_js__WEBPACK_IMPORTED_MODULE_2__["setPref"])('showTypeVote', showTypeVote);
	      }

	function input11_change_handler() {
		showTypeUnknown = this.checked;
		$$invalidate('showTypeUnknown', showTypeUnknown);
	}

	function change_handler_9(ev) {
	        Object(_utils_js__WEBPACK_IMPORTED_MODULE_2__["setPref"])('showTypeUnknown', showTypeUnknown);
	      }

	function input12_change_handler() {
		columnSize = this.__value;
		$$invalidate('columnSize', columnSize);
	}

	function change_handler_10() {
		return Object(_utils_js__WEBPACK_IMPORTED_MODULE_2__["setPref"])('columnSize', columnSize);
	}

	function input13_change_handler() {
		columnSize = this.__value;
		$$invalidate('columnSize', columnSize);
	}

	function change_handler_11() {
		return Object(_utils_js__WEBPACK_IMPORTED_MODULE_2__["setPref"])('columnSize', columnSize);
	}

	function click_handler({ filter }) {
	                Object(_abusePrevention_js__WEBPACK_IMPORTED_MODULE_3__["deleteFilter"])(filter);
	                currentFilters = Object(_abusePrevention_js__WEBPACK_IMPORTED_MODULE_3__["getFilters"])(); $$invalidate('currentFilters', currentFilters);
	              }

	function input14_change_handler() {
		filterAction = this.__value;
		$$invalidate('filterAction', filterAction);
	}

	function input15_change_handler() {
		filterAction = this.__value;
		$$invalidate('filterAction', filterAction);
	}

	function input16_input_handler() {
		filterChannel = this.value;
		$$invalidate('filterChannel', filterChannel);
	}

	function input17_input_handler() {
		filterFeed = this.value;
		$$invalidate('filterFeed', filterFeed);
	}

	function input18_input_handler() {
		filterKeywords = this.value;
		$$invalidate('filterKeywords', filterKeywords);
	}

	function input19_input_handler() {
		filterExpiry = this.value;
		$$invalidate('filterExpiry', filterExpiry);
	}

	return {
		keys,
		remote,
		limit,
		columnSize,
		showTypeUnknown,
		showTypeAbout,
		showTypeBlog,
		showTypeChannel,
		showTypeContact,
		showTypePost,
		showTypePrivate,
		showTypePub,
		showTypeVote,
		currentFilters,
		filterFeed,
		filterChannel,
		filterKeywords,
		filterExpiry,
		filterAction,
		saveConfiguration,
		selectedFile,
		addNewFilter,
		input1_input_handler,
		textarea_input_handler,
		input2_input_handler,
		change_handler,
		input3_change_handler,
		change_handler_1,
		input4_change_handler,
		change_handler_2,
		input5_change_handler,
		change_handler_3,
		input6_change_handler,
		change_handler_4,
		input7_change_handler,
		change_handler_5,
		input8_change_handler,
		change_handler_6,
		input9_change_handler,
		change_handler_7,
		input10_change_handler,
		change_handler_8,
		input11_change_handler,
		change_handler_9,
		input12_change_handler,
		change_handler_10,
		input13_change_handler,
		change_handler_11,
		click_handler,
		input14_change_handler,
		input15_change_handler,
		input16_input_handler,
		input17_input_handler,
		input18_input_handler,
		input19_input_handler,
		$$binding_groups
	};
}

class Settings extends svelte_internal__WEBPACK_IMPORTED_MODULE_0__["SvelteComponent"] {
	constructor(options) {
		super();
		Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["init"])(this, options, instance, create_fragment, svelte_internal__WEBPACK_IMPORTED_MODULE_0__["safe_not_equal"], []);
	}
}


if (false) {}

/* harmony default export */ __webpack_exports__["default"] = (Settings);




/***/ }),

/***/ "./src/ui/views/Settings.svelte.css":
/*!******************************************!*\
  !*** ./src/ui/views/Settings.svelte.css ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../../node_modules/css-loader/dist/cjs.js!./Settings.svelte.css */ "./node_modules/css-loader/dist/cjs.js!./src/ui/views/Settings.svelte.css");

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(/*! ../../../node_modules/style-loader/lib/addStyles.js */ "./node_modules/style-loader/lib/addStyles.js")(content, options);

if(content.locals) module.exports = content.locals;

if(false) {}

/***/ }),

/***/ "./src/ui/views/Thread.svelte":
/*!************************************!*\
  !*** ./src/ui/views/Thread.svelte ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var svelte_internal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! svelte/internal */ "./node_modules/svelte/internal.mjs");
/* harmony import */ var _messageTypes_MessageRenderer_svelte__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../messageTypes/MessageRenderer.svelte */ "./src/ui/messageTypes/MessageRenderer.svelte");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils.js */ "./src/ui/utils.js");
/* src\ui\views\Thread.svelte generated by Svelte v3.4.4 */




function get_each_context(ctx, list, i) {
	const child_ctx = Object.create(ctx);
	child_ctx.msg = list[i];
	return child_ctx;
}

// (36:0) {#if error}
function create_if_block_1(ctx) {
	var div, t0, a, t1, a_href_value, t2, t3;

	return {
		c() {
			div = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");
			t0 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])("Couldn't load thead\r\n    ");
			a = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("a");
			t1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])(ctx.msgid);
			t2 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])("\r\n    : ");
			t3 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])(ctx.error);
			a.href = a_href_value = "?thread=" + ctx.msgid + "#/thread";
			div.className = "toast toast-error";
		},

		m(target, anchor) {
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, div, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div, t0);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div, a);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(a, t1);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div, t2);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div, t3);
		},

		p(changed, ctx) {
			if (changed.msgid) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["set_data"])(t1, ctx.msgid);
			}

			if ((changed.msgid) && a_href_value !== (a_href_value = "?thread=" + ctx.msgid + "#/thread")) {
				a.href = a_href_value;
			}

			if (changed.error) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["set_data"])(t3, ctx.error);
			}
		},

		d(detaching) {
			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(div);
			}
		}
	};
}

// (45:0) {:else}
function create_else_block(ctx) {
	var each_blocks = [], each_1_lookup = new Map(), each_1_anchor, current;

	var each_value = ctx.msgs;

	const get_key = ctx => ctx.msg.key;

	for (var i = 0; i < each_value.length; i += 1) {
		let child_ctx = get_each_context(ctx, each_value, i);
		let key = get_key(child_ctx);
		each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
	}

	return {
		c() {
			for (i = 0; i < each_blocks.length; i += 1) each_blocks[i].c();

			each_1_anchor = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["empty"])();
		},

		m(target, anchor) {
			for (i = 0; i < each_blocks.length; i += 1) each_blocks[i].m(target, anchor);

			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, each_1_anchor, anchor);
			current = true;
		},

		p(changed, ctx) {
			const each_value = ctx.msgs;

			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["group_outros"])();
			each_blocks = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["update_keyed_each"])(each_blocks, changed, get_key, 1, ctx, each_value, each_1_lookup, each_1_anchor.parentNode, svelte_internal__WEBPACK_IMPORTED_MODULE_0__["outro_and_destroy_block"], create_each_block, each_1_anchor, get_each_context);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["check_outros"])();
		},

		i(local) {
			if (current) return;
			for (var i = 0; i < each_value.length; i += 1) each_blocks[i].i();

			current = true;
		},

		o(local) {
			for (i = 0; i < each_blocks.length; i += 1) each_blocks[i].o();

			current = false;
		},

		d(detaching) {
			for (i = 0; i < each_blocks.length; i += 1) each_blocks[i].d(detaching);

			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(each_1_anchor);
			}
		}
	};
}

// (43:0) {#if !msgs && !error}
function create_if_block(ctx) {
	var div;

	return {
		c() {
			div = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");
			div.className = "loading loading-lg";
		},

		m(target, anchor) {
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, div, anchor);
		},

		p: svelte_internal__WEBPACK_IMPORTED_MODULE_0__["noop"],
		i: svelte_internal__WEBPACK_IMPORTED_MODULE_0__["noop"],
		o: svelte_internal__WEBPACK_IMPORTED_MODULE_0__["noop"],

		d(detaching) {
			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(div);
			}
		}
	};
}

// (46:2) {#each msgs as msg (msg.key)}
function create_each_block(key_1, ctx) {
	var first, current;

	var messagerenderer = new _messageTypes_MessageRenderer_svelte__WEBPACK_IMPORTED_MODULE_1__["default"]({ props: { msg: ctx.msg } });

	return {
		key: key_1,

		first: null,

		c() {
			first = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["empty"])();
			messagerenderer.$$.fragment.c();
			this.first = first;
		},

		m(target, anchor) {
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, first, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["mount_component"])(messagerenderer, target, anchor);
			current = true;
		},

		p(changed, ctx) {
			var messagerenderer_changes = {};
			if (changed.msgs) messagerenderer_changes.msg = ctx.msg;
			messagerenderer.$set(messagerenderer_changes);
		},

		i(local) {
			if (current) return;
			messagerenderer.$$.fragment.i(local);

			current = true;
		},

		o(local) {
			messagerenderer.$$.fragment.o(local);
			current = false;
		},

		d(detaching) {
			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(first);
			}

			messagerenderer.$destroy(detaching);
		}
	};
}

function create_fragment(ctx) {
	var div, h4, t0, small, t1, t2, t3, current_block_type_index, if_block1, if_block1_anchor, current;

	var if_block0 = (ctx.error) && create_if_block_1(ctx);

	var if_block_creators = [
		create_if_block,
		create_else_block
	];

	var if_blocks = [];

	function select_block_type(ctx) {
		if (!ctx.msgs && !ctx.error) return 0;
		return 1;
	}

	current_block_type_index = select_block_type(ctx);
	if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

	return {
		c() {
			div = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("div");
			h4 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("h4");
			t0 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])("Thread\r\n    ");
			small = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["element"])("small");
			t1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["text"])(ctx.msgid);
			t2 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			if (if_block0) if_block0.c();
			t3 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["space"])();
			if_block1.c();
			if_block1_anchor = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["empty"])();
			small.className = "label hide-sm";
			div.className = "container";
		},

		m(target, anchor) {
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, div, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(div, h4);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(h4, t0);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(h4, small);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["append"])(small, t1);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, t2, anchor);
			if (if_block0) if_block0.m(target, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, t3, anchor);
			if_blocks[current_block_type_index].m(target, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["insert"])(target, if_block1_anchor, anchor);
			current = true;
		},

		p(changed, ctx) {
			if (!current || changed.msgid) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["set_data"])(t1, ctx.msgid);
			}

			if (ctx.error) {
				if (if_block0) {
					if_block0.p(changed, ctx);
				} else {
					if_block0 = create_if_block_1(ctx);
					if_block0.c();
					if_block0.m(t3.parentNode, t3);
				}
			} else if (if_block0) {
				if_block0.d(1);
				if_block0 = null;
			}

			var previous_block_index = current_block_type_index;
			current_block_type_index = select_block_type(ctx);
			if (current_block_type_index === previous_block_index) {
				if_blocks[current_block_type_index].p(changed, ctx);
			} else {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["group_outros"])();
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["on_outro"])(() => {
					if_blocks[previous_block_index].d(1);
					if_blocks[previous_block_index] = null;
				});
				if_block1.o(1);
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["check_outros"])();

				if_block1 = if_blocks[current_block_type_index];
				if (!if_block1) {
					if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
					if_block1.c();
				}
				if_block1.i(1);
				if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
			}
		},

		i(local) {
			if (current) return;
			if (if_block1) if_block1.i();
			current = true;
		},

		o(local) {
			if (if_block1) if_block1.o();
			current = false;
		},

		d(detaching) {
			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(div);
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(t2);
			}

			if (if_block0) if_block0.d(detaching);

			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(t3);
			}

			if_blocks[current_block_type_index].d(detaching);

			if (detaching) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["detach"])(if_block1_anchor);
			}
		}
	};
}

function instance($$self, $$props, $$invalidate) {
	let $routeParams;

	Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["subscribe"])($$self, _utils_js__WEBPACK_IMPORTED_MODULE_2__["routeParams"], $$value => { $routeParams = $$value; $$invalidate('$routeParams', $routeParams); });

	
  let msgs = false;
  let error = false;
  let msgid;

	$$self.$$.update = ($$dirty = { $routeParams: 1, msgid: 1 }) => {
		if ($$dirty.$routeParams || $$dirty.msgid) { {
        $$invalidate('msgid', msgid = $routeParams.thread);
        if (msgid.startsWith("ssb:")) {
          $$invalidate('msgid', msgid = msgid.replace("ssb:", ""));
        }
        document.title = `Patchfox - Thread: ${msgid}`;
    
        let promise = ssb
          .thread(msgid)
          .then(ms => {
            $$invalidate('msgs', msgs = ms);
            window.scrollTo(0, 0);
          })
          .catch(n => {
            console.dir(n);
            $$invalidate('error', error = n.message);
          });
      } }
	};

	return { msgs, error, msgid };
}

class Thread extends svelte_internal__WEBPACK_IMPORTED_MODULE_0__["SvelteComponent"] {
	constructor(options) {
		super();
		Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__["init"])(this, options, instance, create_fragment, svelte_internal__WEBPACK_IMPORTED_MODULE_0__["safe_not_equal"], []);
	}
}


if (false) {}

/* harmony default export */ __webpack_exports__["default"] = (Thread);


/***/ }),

/***/ 0:
/*!******************************!*\
  !*** multi ./src/ui/main.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./src/ui/main.js */"./src/ui/main.js");


/***/ })

/******/ });
//# sourceMappingURL=ui.js.map