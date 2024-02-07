import { createRequire as __WEBPACK_EXTERNAL_createRequire } from "module";
/******/ var __webpack_modules__ = ({

/***/ 159:
/***/ ((module) => {

module.exports = {
	trueFunc: function trueFunc(){
		return true;
	},
	falseFunc: function falseFunc(){
		return false;
	}
};

/***/ }),

/***/ 218:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

var __webpack_unused_export__;

__webpack_unused_export__ = ({ value: true });
var parser_context_1 = __nccwpck_require__(664);
var render_1 = __nccwpck_require__(785);
var CssSelectorParser = /** @class */ (function () {
    function CssSelectorParser() {
        this.pseudos = {};
        this.attrEqualityMods = {};
        this.ruleNestingOperators = {};
        this.substitutesEnabled = false;
    }
    CssSelectorParser.prototype.registerSelectorPseudos = function () {
        var pseudos = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            pseudos[_i] = arguments[_i];
        }
        for (var _a = 0, pseudos_1 = pseudos; _a < pseudos_1.length; _a++) {
            var pseudo = pseudos_1[_a];
            this.pseudos[pseudo] = 'selector';
        }
        return this;
    };
    CssSelectorParser.prototype.unregisterSelectorPseudos = function () {
        var pseudos = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            pseudos[_i] = arguments[_i];
        }
        for (var _a = 0, pseudos_2 = pseudos; _a < pseudos_2.length; _a++) {
            var pseudo = pseudos_2[_a];
            delete this.pseudos[pseudo];
        }
        return this;
    };
    CssSelectorParser.prototype.registerNumericPseudos = function () {
        var pseudos = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            pseudos[_i] = arguments[_i];
        }
        for (var _a = 0, pseudos_3 = pseudos; _a < pseudos_3.length; _a++) {
            var pseudo = pseudos_3[_a];
            this.pseudos[pseudo] = 'numeric';
        }
        return this;
    };
    CssSelectorParser.prototype.unregisterNumericPseudos = function () {
        var pseudos = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            pseudos[_i] = arguments[_i];
        }
        for (var _a = 0, pseudos_4 = pseudos; _a < pseudos_4.length; _a++) {
            var pseudo = pseudos_4[_a];
            delete this.pseudos[pseudo];
        }
        return this;
    };
    CssSelectorParser.prototype.registerNestingOperators = function () {
        var operators = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            operators[_i] = arguments[_i];
        }
        for (var _a = 0, operators_1 = operators; _a < operators_1.length; _a++) {
            var operator = operators_1[_a];
            this.ruleNestingOperators[operator] = true;
        }
        return this;
    };
    CssSelectorParser.prototype.unregisterNestingOperators = function () {
        var operators = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            operators[_i] = arguments[_i];
        }
        for (var _a = 0, operators_2 = operators; _a < operators_2.length; _a++) {
            var operator = operators_2[_a];
            delete this.ruleNestingOperators[operator];
        }
        return this;
    };
    CssSelectorParser.prototype.registerAttrEqualityMods = function () {
        var mods = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            mods[_i] = arguments[_i];
        }
        for (var _a = 0, mods_1 = mods; _a < mods_1.length; _a++) {
            var mod = mods_1[_a];
            this.attrEqualityMods[mod] = true;
        }
        return this;
    };
    CssSelectorParser.prototype.unregisterAttrEqualityMods = function () {
        var mods = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            mods[_i] = arguments[_i];
        }
        for (var _a = 0, mods_2 = mods; _a < mods_2.length; _a++) {
            var mod = mods_2[_a];
            delete this.attrEqualityMods[mod];
        }
        return this;
    };
    CssSelectorParser.prototype.enableSubstitutes = function () {
        this.substitutesEnabled = true;
        return this;
    };
    CssSelectorParser.prototype.disableSubstitutes = function () {
        this.substitutesEnabled = false;
        return this;
    };
    CssSelectorParser.prototype.parse = function (str) {
        return parser_context_1.parseCssSelector(str, 0, this.pseudos, this.attrEqualityMods, this.ruleNestingOperators, this.substitutesEnabled);
    };
    CssSelectorParser.prototype.render = function (path) {
        return render_1.renderEntity(path).trim();
    };
    return CssSelectorParser;
}());
exports.N = CssSelectorParser;


/***/ }),

/***/ 664:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var utils_1 = __nccwpck_require__(17);
function parseCssSelector(str, pos, pseudos, attrEqualityMods, ruleNestingOperators, substitutesEnabled) {
    var l = str.length;
    var chr = '';
    function getStr(quote, escapeTable) {
        var result = '';
        pos++;
        chr = str.charAt(pos);
        while (pos < l) {
            if (chr === quote) {
                pos++;
                return result;
            }
            else if (chr === '\\') {
                pos++;
                chr = str.charAt(pos);
                var esc = void 0;
                if (chr === quote) {
                    result += quote;
                }
                else if ((esc = escapeTable[chr]) !== undefined) {
                    result += esc;
                }
                else if (utils_1.isHex(chr)) {
                    var hex = chr;
                    pos++;
                    chr = str.charAt(pos);
                    while (utils_1.isHex(chr)) {
                        hex += chr;
                        pos++;
                        chr = str.charAt(pos);
                    }
                    if (chr === ' ') {
                        pos++;
                        chr = str.charAt(pos);
                    }
                    result += String.fromCharCode(parseInt(hex, 16));
                    continue;
                }
                else {
                    result += chr;
                }
            }
            else {
                result += chr;
            }
            pos++;
            chr = str.charAt(pos);
        }
        return result;
    }
    function getIdent() {
        var result = '';
        chr = str.charAt(pos);
        while (pos < l) {
            if (utils_1.isIdent(chr)) {
                result += chr;
            }
            else if (chr === '\\') {
                pos++;
                if (pos >= l) {
                    throw Error('Expected symbol but end of file reached.');
                }
                chr = str.charAt(pos);
                if (utils_1.identSpecialChars[chr]) {
                    result += chr;
                }
                else if (utils_1.isHex(chr)) {
                    var hex = chr;
                    pos++;
                    chr = str.charAt(pos);
                    while (utils_1.isHex(chr)) {
                        hex += chr;
                        pos++;
                        chr = str.charAt(pos);
                    }
                    if (chr === ' ') {
                        pos++;
                        chr = str.charAt(pos);
                    }
                    result += String.fromCharCode(parseInt(hex, 16));
                    continue;
                }
                else {
                    result += chr;
                }
            }
            else {
                return result;
            }
            pos++;
            chr = str.charAt(pos);
        }
        return result;
    }
    function skipWhitespace() {
        chr = str.charAt(pos);
        var result = false;
        while (chr === ' ' || chr === "\t" || chr === "\n" || chr === "\r" || chr === "\f") {
            result = true;
            pos++;
            chr = str.charAt(pos);
        }
        return result;
    }
    function parse() {
        var res = parseSelector();
        if (pos < l) {
            throw Error('Rule expected but "' + str.charAt(pos) + '" found.');
        }
        return res;
    }
    function parseSelector() {
        var selector = parseSingleSelector();
        if (!selector) {
            return null;
        }
        var res = selector;
        chr = str.charAt(pos);
        while (chr === ',') {
            pos++;
            skipWhitespace();
            if (res.type !== 'selectors') {
                res = {
                    type: 'selectors',
                    selectors: [selector]
                };
            }
            selector = parseSingleSelector();
            if (!selector) {
                throw Error('Rule expected after ",".');
            }
            res.selectors.push(selector);
        }
        return res;
    }
    function parseSingleSelector() {
        skipWhitespace();
        var selector = {
            type: 'ruleSet'
        };
        var rule = parseRule();
        if (!rule) {
            return null;
        }
        var currentRule = selector;
        while (rule) {
            rule.type = 'rule';
            currentRule.rule = rule;
            currentRule = rule;
            skipWhitespace();
            chr = str.charAt(pos);
            if (pos >= l || chr === ',' || chr === ')') {
                break;
            }
            if (ruleNestingOperators[chr]) {
                var op = chr;
                pos++;
                skipWhitespace();
                rule = parseRule();
                if (!rule) {
                    throw Error('Rule expected after "' + op + '".');
                }
                rule.nestingOperator = op;
            }
            else {
                rule = parseRule();
                if (rule) {
                    rule.nestingOperator = null;
                }
            }
        }
        return selector;
    }
    // @ts-ignore no-overlap
    function parseRule() {
        var rule = null;
        while (pos < l) {
            chr = str.charAt(pos);
            if (chr === '*') {
                pos++;
                (rule = rule || {}).tagName = '*';
            }
            else if (utils_1.isIdentStart(chr) || chr === '\\') {
                (rule = rule || {}).tagName = getIdent();
            }
            else if (chr === '.') {
                pos++;
                rule = rule || {};
                (rule.classNames = rule.classNames || []).push(getIdent());
            }
            else if (chr === '#') {
                pos++;
                (rule = rule || {}).id = getIdent();
            }
            else if (chr === '[') {
                pos++;
                skipWhitespace();
                var attr = {
                    name: getIdent()
                };
                skipWhitespace();
                // @ts-ignore
                if (chr === ']') {
                    pos++;
                }
                else {
                    var operator = '';
                    if (attrEqualityMods[chr]) {
                        operator = chr;
                        pos++;
                        chr = str.charAt(pos);
                    }
                    if (pos >= l) {
                        throw Error('Expected "=" but end of file reached.');
                    }
                    if (chr !== '=') {
                        throw Error('Expected "=" but "' + chr + '" found.');
                    }
                    attr.operator = operator + '=';
                    pos++;
                    skipWhitespace();
                    var attrValue = '';
                    attr.valueType = 'string';
                    // @ts-ignore
                    if (chr === '"') {
                        attrValue = getStr('"', utils_1.doubleQuotesEscapeChars);
                        // @ts-ignore
                    }
                    else if (chr === '\'') {
                        attrValue = getStr('\'', utils_1.singleQuoteEscapeChars);
                        // @ts-ignore
                    }
                    else if (substitutesEnabled && chr === '$') {
                        pos++;
                        attrValue = getIdent();
                        attr.valueType = 'substitute';
                    }
                    else {
                        while (pos < l) {
                            if (chr === ']') {
                                break;
                            }
                            attrValue += chr;
                            pos++;
                            chr = str.charAt(pos);
                        }
                        attrValue = attrValue.trim();
                    }
                    skipWhitespace();
                    if (pos >= l) {
                        throw Error('Expected "]" but end of file reached.');
                    }
                    if (chr !== ']') {
                        throw Error('Expected "]" but "' + chr + '" found.');
                    }
                    pos++;
                    attr.value = attrValue;
                }
                rule = rule || {};
                (rule.attrs = rule.attrs || []).push(attr);
            }
            else if (chr === ':') {
                pos++;
                var pseudoName = getIdent();
                var pseudo = {
                    name: pseudoName
                };
                // @ts-ignore
                if (chr === '(') {
                    pos++;
                    var value = '';
                    skipWhitespace();
                    if (pseudos[pseudoName] === 'selector') {
                        pseudo.valueType = 'selector';
                        value = parseSelector();
                    }
                    else {
                        pseudo.valueType = pseudos[pseudoName] || 'string';
                        // @ts-ignore
                        if (chr === '"') {
                            value = getStr('"', utils_1.doubleQuotesEscapeChars);
                            // @ts-ignore
                        }
                        else if (chr === '\'') {
                            value = getStr('\'', utils_1.singleQuoteEscapeChars);
                            // @ts-ignore
                        }
                        else if (substitutesEnabled && chr === '$') {
                            pos++;
                            value = getIdent();
                            pseudo.valueType = 'substitute';
                        }
                        else {
                            while (pos < l) {
                                if (chr === ')') {
                                    break;
                                }
                                value += chr;
                                pos++;
                                chr = str.charAt(pos);
                            }
                            value = value.trim();
                        }
                        skipWhitespace();
                    }
                    if (pos >= l) {
                        throw Error('Expected ")" but end of file reached.');
                    }
                    if (chr !== ')') {
                        throw Error('Expected ")" but "' + chr + '" found.');
                    }
                    pos++;
                    pseudo.value = value;
                }
                rule = rule || {};
                (rule.pseudos = rule.pseudos || []).push(pseudo);
            }
            else {
                break;
            }
        }
        return rule;
    }
    return parse();
}
exports.parseCssSelector = parseCssSelector;


/***/ }),

/***/ 785:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var utils_1 = __nccwpck_require__(17);
function renderEntity(entity) {
    var res = '';
    switch (entity.type) {
        case 'ruleSet':
            var currentEntity = entity.rule;
            var parts = [];
            while (currentEntity) {
                if (currentEntity.nestingOperator) {
                    parts.push(currentEntity.nestingOperator);
                }
                parts.push(renderEntity(currentEntity));
                currentEntity = currentEntity.rule;
            }
            res = parts.join(' ');
            break;
        case 'selectors':
            res = entity.selectors.map(renderEntity).join(', ');
            break;
        case 'rule':
            if (entity.tagName) {
                if (entity.tagName === '*') {
                    res = '*';
                }
                else {
                    res = utils_1.escapeIdentifier(entity.tagName);
                }
            }
            if (entity.id) {
                res += "#" + utils_1.escapeIdentifier(entity.id);
            }
            if (entity.classNames) {
                res += entity.classNames.map(function (cn) {
                    return "." + (utils_1.escapeIdentifier(cn));
                }).join('');
            }
            if (entity.attrs) {
                res += entity.attrs.map(function (attr) {
                    if ('operator' in attr) {
                        if (attr.valueType === 'substitute') {
                            return "[" + utils_1.escapeIdentifier(attr.name) + attr.operator + "$" + attr.value + "]";
                        }
                        else {
                            return "[" + utils_1.escapeIdentifier(attr.name) + attr.operator + utils_1.escapeStr(attr.value) + "]";
                        }
                    }
                    else {
                        return "[" + utils_1.escapeIdentifier(attr.name) + "]";
                    }
                }).join('');
            }
            if (entity.pseudos) {
                res += entity.pseudos.map(function (pseudo) {
                    if (pseudo.valueType) {
                        if (pseudo.valueType === 'selector') {
                            return ":" + utils_1.escapeIdentifier(pseudo.name) + "(" + renderEntity(pseudo.value) + ")";
                        }
                        else if (pseudo.valueType === 'substitute') {
                            return ":" + utils_1.escapeIdentifier(pseudo.name) + "($" + pseudo.value + ")";
                        }
                        else if (pseudo.valueType === 'numeric') {
                            return ":" + utils_1.escapeIdentifier(pseudo.name) + "(" + pseudo.value + ")";
                        }
                        else {
                            return (":" + utils_1.escapeIdentifier(pseudo.name) +
                                "(" + utils_1.escapeIdentifier(pseudo.value) + ")");
                        }
                    }
                    else {
                        return ":" + utils_1.escapeIdentifier(pseudo.name);
                    }
                }).join('');
            }
            break;
        default:
            throw Error('Unknown entity type: "' + entity.type + '".');
    }
    return res;
}
exports.renderEntity = renderEntity;


/***/ }),

/***/ 17:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
function isIdentStart(c) {
    return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || (c === '-') || (c === '_');
}
exports.isIdentStart = isIdentStart;
function isIdent(c) {
    return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || (c >= '0' && c <= '9') || c === '-' || c === '_';
}
exports.isIdent = isIdent;
function isHex(c) {
    return (c >= 'a' && c <= 'f') || (c >= 'A' && c <= 'F') || (c >= '0' && c <= '9');
}
exports.isHex = isHex;
function escapeIdentifier(s) {
    var len = s.length;
    var result = '';
    var i = 0;
    while (i < len) {
        var chr = s.charAt(i);
        if (exports.identSpecialChars[chr]) {
            result += '\\' + chr;
        }
        else {
            if (!(chr === '_' || chr === '-' ||
                (chr >= 'A' && chr <= 'Z') ||
                (chr >= 'a' && chr <= 'z') ||
                (i !== 0 && chr >= '0' && chr <= '9'))) {
                var charCode = chr.charCodeAt(0);
                if ((charCode & 0xF800) === 0xD800) {
                    var extraCharCode = s.charCodeAt(i++);
                    if ((charCode & 0xFC00) !== 0xD800 || (extraCharCode & 0xFC00) !== 0xDC00) {
                        throw Error('UCS-2(decode): illegal sequence');
                    }
                    charCode = ((charCode & 0x3FF) << 10) + (extraCharCode & 0x3FF) + 0x10000;
                }
                result += '\\' + charCode.toString(16) + ' ';
            }
            else {
                result += chr;
            }
        }
        i++;
    }
    return result;
}
exports.escapeIdentifier = escapeIdentifier;
function escapeStr(s) {
    var len = s.length;
    var result = '';
    var i = 0;
    var replacement;
    while (i < len) {
        var chr = s.charAt(i);
        if (chr === '"') {
            chr = '\\"';
        }
        else if (chr === '\\') {
            chr = '\\\\';
        }
        else if ((replacement = exports.strReplacementsRev[chr]) !== undefined) {
            chr = replacement;
        }
        result += chr;
        i++;
    }
    return "\"" + result + "\"";
}
exports.escapeStr = escapeStr;
exports.identSpecialChars = {
    '!': true,
    '"': true,
    '#': true,
    '$': true,
    '%': true,
    '&': true,
    '\'': true,
    '(': true,
    ')': true,
    '*': true,
    '+': true,
    ',': true,
    '.': true,
    '/': true,
    ';': true,
    '<': true,
    '=': true,
    '>': true,
    '?': true,
    '@': true,
    '[': true,
    '\\': true,
    ']': true,
    '^': true,
    '`': true,
    '{': true,
    '|': true,
    '}': true,
    '~': true
};
exports.strReplacementsRev = {
    '\n': '\\n',
    '\r': '\\r',
    '\t': '\\t',
    '\f': '\\f',
    '\v': '\\v'
};
exports.singleQuoteEscapeChars = {
    n: '\n',
    r: '\r',
    t: '\t',
    f: '\f',
    '\\': '\\',
    '\'': '\''
};
exports.doubleQuotesEscapeChars = {
    n: '\n',
    r: '\r',
    t: '\t',
    f: '\f',
    '\\': '\\',
    '"': '"'
};


/***/ })

/******/ });
/************************************************************************/
/******/ // The module cache
/******/ var __webpack_module_cache__ = {};
/******/ 
/******/ // The require function
/******/ function __nccwpck_require__(moduleId) {
/******/ 	// Check if module is in cache
/******/ 	var cachedModule = __webpack_module_cache__[moduleId];
/******/ 	if (cachedModule !== undefined) {
/******/ 		return cachedModule.exports;
/******/ 	}
/******/ 	// Create a new module (and put it into the cache)
/******/ 	var module = __webpack_module_cache__[moduleId] = {
/******/ 		// no module.id needed
/******/ 		// no module.loaded needed
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// Execute the module function
/******/ 	var threw = true;
/******/ 	try {
/******/ 		__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 		threw = false;
/******/ 	} finally {
/******/ 		if(threw) delete __webpack_module_cache__[moduleId];
/******/ 	}
/******/ 
/******/ 	// Return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/define property getters */
/******/ (() => {
/******/ 	// define getter functions for harmony exports
/******/ 	__nccwpck_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__nccwpck_require__.o(definition, key) && !__nccwpck_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ (() => {
/******/ 	__nccwpck_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ })();
/******/ 
/******/ /* webpack/runtime/compat */
/******/ 
/******/ if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = new URL('.', import.meta.url).pathname.slice(import.meta.url.match(/^file:\/\/\/\w:/) ? 1 : 0, -1) + "/";
/******/ 
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {

// EXPORTS
__nccwpck_require__.d(__webpack_exports__, {
  "Z": () => (/* binding */ src)
});

;// CONCATENATED MODULE: external "crypto"
const external_crypto_namespaceObject = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("crypto");
;// CONCATENATED MODULE: ./node_modules/nanoid/index.js



const POOL_SIZE_MULTIPLIER = 128
let pool, poolOffset
let fillPool = bytes => {
  if (!pool || pool.length < bytes) {
    pool = Buffer.allocUnsafe(bytes * POOL_SIZE_MULTIPLIER)
    ;(0,external_crypto_namespaceObject.randomFillSync)(pool)
    poolOffset = 0
  } else if (poolOffset + bytes > pool.length) {
    (0,external_crypto_namespaceObject.randomFillSync)(pool)
    poolOffset = 0
  }
  poolOffset += bytes
}
let random = bytes => {
  fillPool((bytes -= 0))
  return pool.subarray(poolOffset - bytes, poolOffset)
}
let customRandom = (alphabet, defaultSize, getRandom) => {
  let mask = (2 << (31 - Math.clz32((alphabet.length - 1) | 1))) - 1
  let step = Math.ceil((1.6 * mask * defaultSize) / alphabet.length)
  return (size = defaultSize) => {
    let id = ''
    while (true) {
      let bytes = getRandom(step)
      let i = step
      while (i--) {
        id += alphabet[bytes[i] & mask] || ''
        if (id.length === size) return id
      }
    }
  }
}
let customAlphabet = (alphabet, size = 21) =>
  customRandom(alphabet, size, random)
let nanoid = (size = 21) => {
  fillPool((size -= 0))
  let id = ''
  for (let i = poolOffset - size; i < poolOffset; i++) {
    id += urlAlphabet[pool[i] & 63]
  }
  return id
}

;// CONCATENATED MODULE: ./node_modules/myst-common/dist/utils.js

function addMessageInfo(message, info) {
    if (info === null || info === void 0 ? void 0 : info.note)
        message.note = info.note;
    if (info === null || info === void 0 ? void 0 : info.url)
        message.url = info.url;
    if (info === null || info === void 0 ? void 0 : info.ruleId)
        message.ruleId = info.ruleId;
    if (info === null || info === void 0 ? void 0 : info.fatal)
        message.fatal = true;
    return message;
}
function fileError(file, message, opts) {
    return addMessageInfo(file.message(message, opts === null || opts === void 0 ? void 0 : opts.node, opts === null || opts === void 0 ? void 0 : opts.source), { ...opts, fatal: true });
}
function fileWarn(file, message, opts) {
    return addMessageInfo(file.message(message, opts === null || opts === void 0 ? void 0 : opts.node, opts === null || opts === void 0 ? void 0 : opts.source), opts);
}
function fileInfo(file, message, opts) {
    return addMessageInfo(file.info(message, opts === null || opts === void 0 ? void 0 : opts.node, opts === null || opts === void 0 ? void 0 : opts.source), opts);
}
const az = 'abcdefghijklmnopqrstuvwxyz';
const alpha = az + az.toUpperCase();
const numbers = '0123456789';
const nanoidAZ = customAlphabet(alpha, 1);
const nanoidAZ9 = customAlphabet(alpha + numbers, 9);
function createId() {
    return nanoidAZ() + nanoidAZ9();
}
/**
 * https://github.com/syntax-tree/mdast#association
 * @param label A label field can be present.
 *        label is a string value: it works just like title on a link or a
 *        lang on code: character escapes and character references are parsed.
 * @returns { identifier, label, html_id }
 */
function normalizeLabel(label) {
    if (!label)
        return undefined;
    const identifier = label
        .replace(/[\t\n\r ]+/g, ' ')
        .trim()
        .toLowerCase();
    const html_id = createHtmlId(identifier);
    return { identifier, label: label, html_id };
}
function createHtmlId(identifier) {
    if (!identifier)
        return undefined;
    return identifier
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, '-') // Remove any fancy characters
        .replace(/^([0-9-])/, 'id-$1') // Ensure that the id starts with a letter
        .replace(/-[-]+/g, '-') // Replace repeated `-`s
        .replace(/(?:^[-]+)|(?:[-]+$)/g, ''); // Remove repeated `-`s at the start or the end
}
/**
 * Helper function for recursively lifting children
 */
function getNodeOrLiftedChildren(node, removeType) {
    if (!node.children)
        return [node];
    const children = node.children.map((child) => getNodeOrLiftedChildren(child, removeType)).flat();
    if (node.type === removeType) {
        // There are some checks in unist that look like `'children' in node`
        // all children must be deleted, and not a key on the object
        if (node && node.children == null)
            delete node.children;
        return children;
    }
    node.children = children;
    return [node];
}
/**
 * Eliminate all parent nodes in `tree` of type `removeType`; children of eliminated nodes are moved up to it's parent
 *
 * Nodes of `removeType` will remain if:
 * - they are the root of `tree`
 * - their children are undefined
 */
function liftChildren(tree, removeType) {
    if (!tree.children)
        return;
    tree.children = tree.children.map((child) => getNodeOrLiftedChildren(child, removeType)).flat();
}
function setTextAsChild(node, text) {
    node.children = [{ type: 'text', value: text }];
}
/**
 * Renders a textual representation of one or more nodes
 * by concatenating all children that have a text representation.
 * @param content The node or nodes to provide as input.
 * @returns A string. An empty string is returned in case no
 * textual representation could be extracted.
 */
function toText(content) {
    if (!content)
        return '';
    if (!Array.isArray(content))
        return toText([content]);
    return content
        .map((n) => {
        if (!n || typeof n === 'string')
            return n || '';
        if ('value' in n)
            return n.value;
        if ('children' in n && n.children)
            return toText(n.children);
        return '';
    })
        .join('');
}
function copyNode(node) {
    return JSON.parse(JSON.stringify(node));
}
function mergeTextNodes(node) {
    var _a;
    const children = (_a = node.children) === null || _a === void 0 ? void 0 : _a.reduce((c, n) => {
        var _a;
        if ((n === null || n === void 0 ? void 0 : n.type) !== 'text') {
            c.push(mergeTextNodes(n));
            return c;
        }
        const last = c[c.length - 1];
        if ((last === null || last === void 0 ? void 0 : last.type) !== 'text') {
            c.push(n);
            return c;
        }
        if ((_a = n.position) === null || _a === void 0 ? void 0 : _a.end) {
            if (!last.position)
                last.position = {};
            last.position.end = n.position.end;
        }
        if (!last.value)
            last.value = '';
        if (n.value)
            last.value += n.value;
        return c;
    }, []);
    if (children)
        node.children = children;
    return node;
}
function admonitionKindToTitle(kind) {
    const transform = {
        attention: 'Attention',
        caution: 'Caution',
        danger: 'Danger',
        error: 'Error',
        important: 'Important',
        hint: 'Hint',
        note: 'Note',
        seealso: 'See Also',
        tip: 'Tip',
        warning: 'Warning',
    };
    return transform[kind] || `Unknown Admonition "${kind}"`;
}
function writeTexLabelledComment(title, commands, commentLength) {
    if (!commands || (commands === null || commands === void 0 ? void 0 : commands.length) === 0)
        return '';
    const len = (commentLength - title.length - 4) / 2;
    const start = ''.padEnd(Math.ceil(len), '%');
    const end = ''.padEnd(Math.floor(len), '%');
    const titleBlock = `${start}  ${title}  ${end}\n`;
    return `${titleBlock}${commands.join('\n')}\n`;
}

;// CONCATENATED MODULE: ./node_modules/unist-util-is/lib/index.js
/**
 * @typedef {import('unist').Node} Node
 * @typedef {import('unist').Parent} Parent
 */

/**
 * @template Fn
 * @template Fallback
 * @typedef {Fn extends (value: any) => value is infer Thing ? Thing : Fallback} Predicate
 */

/**
 * @callback Check
 *   Check that an arbitrary value is a node.
 * @param {unknown} this
 *   The given context.
 * @param {unknown} [node]
 *   Anything (typically a node).
 * @param {number | null | undefined} [index]
 *   The node’s position in its parent.
 * @param {Parent | null | undefined} [parent]
 *   The node’s parent.
 * @returns {boolean}
 *   Whether this is a node and passes a test.
 *
 * @typedef {Record<string, unknown> | Node} Props
 *   Object to check for equivalence.
 *
 *   Note: `Node` is included as it is common but is not indexable.
 *
 * @typedef {Array<Props | TestFunction | string> | Props | TestFunction | string | null | undefined} Test
 *   Check for an arbitrary node.
 *
 * @callback TestFunction
 *   Check if a node passes a test.
 * @param {unknown} this
 *   The given context.
 * @param {Node} node
 *   A node.
 * @param {number | undefined} [index]
 *   The node’s position in its parent.
 * @param {Parent | undefined} [parent]
 *   The node’s parent.
 * @returns {boolean | undefined | void}
 *   Whether this node passes the test.
 *
 *   Note: `void` is included until TS sees no return as `undefined`.
 */

/**
 * Check if `node` is a `Node` and whether it passes the given test.
 *
 * @param {unknown} node
 *   Thing to check, typically `Node`.
 * @param {Test} test
 *   A check for a specific node.
 * @param {number | null | undefined} index
 *   The node’s position in its parent.
 * @param {Parent | null | undefined} parent
 *   The node’s parent.
 * @param {unknown} context
 *   Context object (`this`) to pass to `test` functions.
 * @returns {boolean}
 *   Whether `node` is a node and passes a test.
 */
const is =
  // Note: overloads in JSDoc can’t yet use different `@template`s.
  /**
   * @type {(
   *   (<Condition extends string>(node: unknown, test: Condition, index?: number | null | undefined, parent?: Parent | null | undefined, context?: unknown) => node is Node & {type: Condition}) &
   *   (<Condition extends Props>(node: unknown, test: Condition, index?: number | null | undefined, parent?: Parent | null | undefined, context?: unknown) => node is Node & Condition) &
   *   (<Condition extends TestFunction>(node: unknown, test: Condition, index?: number | null | undefined, parent?: Parent | null | undefined, context?: unknown) => node is Node & Predicate<Condition, Node>) &
   *   ((node?: null | undefined) => false) &
   *   ((node: unknown, test?: null | undefined, index?: number | null | undefined, parent?: Parent | null | undefined, context?: unknown) => node is Node) &
   *   ((node: unknown, test?: Test, index?: number | null | undefined, parent?: Parent | null | undefined, context?: unknown) => boolean)
   * )}
   */
  (
    /**
     * @param {unknown} [node]
     * @param {Test} [test]
     * @param {number | null | undefined} [index]
     * @param {Parent | null | undefined} [parent]
     * @param {unknown} [context]
     * @returns {boolean}
     */
    // eslint-disable-next-line max-params
    function (node, test, index, parent, context) {
      const check = convert(test)

      if (
        index !== undefined &&
        index !== null &&
        (typeof index !== 'number' ||
          index < 0 ||
          index === Number.POSITIVE_INFINITY)
      ) {
        throw new Error('Expected positive finite index')
      }

      if (
        parent !== undefined &&
        parent !== null &&
        (!is(parent) || !parent.children)
      ) {
        throw new Error('Expected parent node')
      }

      if (
        (parent === undefined || parent === null) !==
        (index === undefined || index === null)
      ) {
        throw new Error('Expected both parent and index')
      }

      return looksLikeANode(node)
        ? check.call(context, node, index, parent)
        : false
    }
  )

/**
 * Generate an assertion from a test.
 *
 * Useful if you’re going to test many nodes, for example when creating a
 * utility where something else passes a compatible test.
 *
 * The created function is a bit faster because it expects valid input only:
 * a `node`, `index`, and `parent`.
 *
 * @param {Test} test
 *   *   when nullish, checks if `node` is a `Node`.
 *   *   when `string`, works like passing `(node) => node.type === test`.
 *   *   when `function` checks if function passed the node is true.
 *   *   when `object`, checks that all keys in test are in node, and that they have (strictly) equal values.
 *   *   when `array`, checks if any one of the subtests pass.
 * @returns {Check}
 *   An assertion.
 */
const convert =
  // Note: overloads in JSDoc can’t yet use different `@template`s.
  /**
   * @type {(
   *   (<Condition extends string>(test: Condition) => (node: unknown, index?: number | null | undefined, parent?: Parent | null | undefined, context?: unknown) => node is Node & {type: Condition}) &
   *   (<Condition extends Props>(test: Condition) => (node: unknown, index?: number | null | undefined, parent?: Parent | null | undefined, context?: unknown) => node is Node & Condition) &
   *   (<Condition extends TestFunction>(test: Condition) => (node: unknown, index?: number | null | undefined, parent?: Parent | null | undefined, context?: unknown) => node is Node & Predicate<Condition, Node>) &
   *   ((test?: null | undefined) => (node?: unknown, index?: number | null | undefined, parent?: Parent | null | undefined, context?: unknown) => node is Node) &
   *   ((test?: Test) => Check)
   * )}
   */
  (
    /**
     * @param {Test} [test]
     * @returns {Check}
     */
    function (test) {
      if (test === null || test === undefined) {
        return ok
      }

      if (typeof test === 'function') {
        return castFactory(test)
      }

      if (typeof test === 'object') {
        return Array.isArray(test) ? anyFactory(test) : propsFactory(test)
      }

      if (typeof test === 'string') {
        return typeFactory(test)
      }

      throw new Error('Expected function, string, or object as test')
    }
  )

/**
 * @param {Array<Props | TestFunction | string>} tests
 * @returns {Check}
 */
function anyFactory(tests) {
  /** @type {Array<Check>} */
  const checks = []
  let index = -1

  while (++index < tests.length) {
    checks[index] = convert(tests[index])
  }

  return castFactory(any)

  /**
   * @this {unknown}
   * @type {TestFunction}
   */
  function any(...parameters) {
    let index = -1

    while (++index < checks.length) {
      if (checks[index].apply(this, parameters)) return true
    }

    return false
  }
}

/**
 * Turn an object into a test for a node with a certain fields.
 *
 * @param {Props} check
 * @returns {Check}
 */
function propsFactory(check) {
  const checkAsRecord = /** @type {Record<string, unknown>} */ (check)

  return castFactory(all)

  /**
   * @param {Node} node
   * @returns {boolean}
   */
  function all(node) {
    const nodeAsRecord = /** @type {Record<string, unknown>} */ (
      /** @type {unknown} */ (node)
    )

    /** @type {string} */
    let key

    for (key in check) {
      if (nodeAsRecord[key] !== checkAsRecord[key]) return false
    }

    return true
  }
}

/**
 * Turn a string into a test for a node with a certain type.
 *
 * @param {string} check
 * @returns {Check}
 */
function typeFactory(check) {
  return castFactory(type)

  /**
   * @param {Node} node
   */
  function type(node) {
    return node && node.type === check
  }
}

/**
 * Turn a custom test into a test for a node that passes that test.
 *
 * @param {TestFunction} testFunction
 * @returns {Check}
 */
function castFactory(testFunction) {
  return check

  /**
   * @this {unknown}
   * @type {Check}
   */
  function check(value, index, parent) {
    return Boolean(
      looksLikeANode(value) &&
        testFunction.call(
          this,
          value,
          typeof index === 'number' ? index : undefined,
          parent || undefined
        )
    )
  }
}

function ok() {
  return true
}

/**
 * @param {unknown} value
 * @returns {value is Node}
 */
function looksLikeANode(value) {
  return value !== null && typeof value === 'object' && 'type' in value
}

;// CONCATENATED MODULE: ./node_modules/unist-util-find-before/lib/index.js
/**
 * @typedef {import('unist').Node} UnistNode
 * @typedef {import('unist').Parent} UnistParent
 */

/**
 * @typedef {Exclude<import('unist-util-is').Test, undefined> | undefined} Test
 *   Test from `unist-util-is`.
 *
 *   Note: we have remove and add `undefined`, because otherwise when generating
 *   automatic `.d.ts` files, TS tries to flatten paths from a local perspective,
 *   which doesn’t work when publishing on npm.
 */

/**
 * @typedef {(
 *   Fn extends (value: any) => value is infer Thing
 *   ? Thing
 *   : Fallback
 * )} Predicate
 *   Get the value of a type guard `Fn`.
 * @template Fn
 *   Value; typically function that is a type guard (such as `(x): x is Y`).
 * @template Fallback
 *   Value to yield if `Fn` is not a type guard.
 */

/**
 * @typedef {(
 *   Check extends null | undefined // No test.
 *   ? Value
 *   : Value extends {type: Check} // String (type) test.
 *   ? Value
 *   : Value extends Check // Partial test.
 *   ? Value
 *   : Check extends Function // Function test.
 *   ? Predicate<Check, Value> extends Value
 *     ? Predicate<Check, Value>
 *     : never
 *   : never // Some other test?
 * )} MatchesOne
 *   Check whether a node matches a primitive check in the type system.
 * @template Value
 *   Value; typically unist `Node`.
 * @template Check
 *   Value; typically `unist-util-is`-compatible test, but not arrays.
 */

/**
 * @typedef {(
 *   Check extends Array<any>
 *   ? MatchesOne<Value, Check[keyof Check]>
 *   : MatchesOne<Value, Check>
 * )} Matches
 *   Check whether a node matches a check in the type system.
 * @template Value
 *   Value; typically unist `Node`.
 * @template Check
 *   Value; typically `unist-util-is`-compatible test.
 */

/**
 * @typedef {(
 *   Kind extends {children: Array<infer Child>}
 *   ? Child
 *   : never
 * )} Child
 *   Collect nodes that can be parents of `Child`.
 * @template {UnistNode} Kind
 *   All node types.
 */



/**
 * Find the first node in `parent` before another `node` or before an index,
 * that passes `test`.
 *
 * @param parent
 *   Parent node.
 * @param index
 *   Child node or index.
 * @param [test=undefined]
 *   Test for child to look for (optional).
 * @returns
 *   A child (matching `test`, if given) or `undefined`.
 */
const findBefore =
  // Note: overloads like this are needed to support optional generics.
  /**
   * @type {(
   *   (<Kind extends UnistParent, Check extends Test>(parent: Kind, index: Child<Kind> | number, test: Check) => Matches<Child<Kind>, Check> | undefined) &
   *   (<Kind extends UnistParent>(parent: Kind, index: Child<Kind> | number, test?: null | undefined) => Child<Kind> | undefined)
   * )}
   */
  (
    /**
     * @param {UnistParent} parent
     *   Parent node.
     * @param {UnistNode | number} index
     *   Child node or index.
     * @param {Test} [test=undefined]
     *   Test for child to look for.
     * @returns {UnistNode | undefined}
     *   A child (matching `test`, if given) or `undefined`.
     */
    function (parent, index, test) {
      const is = convert(test)

      if (!parent || !parent.type || !parent.children) {
        throw new Error('Expected parent node')
      }

      if (typeof index === 'number') {
        if (index < 0 || index === Number.POSITIVE_INFINITY) {
          throw new Error('Expected positive finite number as index')
        }
      } else {
        index = parent.children.indexOf(index)

        if (index < 0) {
          throw new Error('Expected child node or index')
        }
      }

      // Performance.
      if (index > parent.children.length) {
        index = parent.children.length
      }

      while (index--) {
        const child = parent.children[index]

        if (is(child, index, parent)) {
          return child
        }
      }

      return undefined
    }
  )

;// CONCATENATED MODULE: ./node_modules/unist-util-remove/lib/index.js
/**
 * @typedef {import('unist').Node} Node
 * @typedef {import('unist').Parent} Parent
 * @typedef {import('unist-util-is').Test} Test
 */

/**
 * @typedef Options
 *   Configuration.
 * @property {boolean | null | undefined} [cascade=true]
 *   Whether to drop parent nodes if they had children, but all their children
 *   were filtered out (default: `true`).
 */



/**
 * Change the given `tree` by removing all nodes that pass `test`.
 *
 * `tree` itself is never tested.
 * The tree is walked in preorder (NLR), visiting the node itself, then its
 * head, etc.
 *
 * @overload
 * @param {Node} node
 * @param {Test} [test]
 * @returns {undefined}
 *
 * @overload
 * @param {Node} node
 * @param {Options | null | undefined} options
 * @param {Test} [test]
 * @returns {undefined}
 *
 * @param {Node} tree
 *   Tree to change.
 * @param {Options | Test} options
 *   Configuration (optional).
 * @param {Test} [test]
 *   `unist-util-is` compatible test.
 * @returns {undefined}
 *   Nothing.
 */
function remove(tree, options, test) {
  const is = convert(test || options)
  let cascade = true

  if (
    options &&
    typeof options === 'object' &&
    'cascade' in options &&
    typeof options.cascade === 'boolean'
  ) {
    cascade = options.cascade
  }

  preorder(tree)

  /**
   * Check and remove nodes recursively in preorder.
   * For each composite node, modify its children array in-place.
   *
   * @param {Node} node
   * @param {number | undefined} [index]
   * @param {Parent | undefined} [parent]
   * @returns {boolean}
   */
  function preorder(node, index, parent) {
    if (node !== tree && is(node, index, parent)) {
      return false
    }

    if ('children' in node && Array.isArray(node.children)) {
      const nodeAsParent = /** @type {Parent} */ (node)
      const children = nodeAsParent.children
      let oldChildIndex = -1
      let newChildIndex = 0

      if (children.length > 0) {
        // Move all living children to the beginning of the children array.
        while (++oldChildIndex < children.length) {
          if (preorder(children[oldChildIndex], oldChildIndex, nodeAsParent)) {
            children[newChildIndex++] = children[oldChildIndex]
          }
        }

        // Cascade delete.
        if (node !== tree && cascade && !newChildIndex) {
          return false
        }

        // Drop other nodes.
        children.length = newChildIndex
      }
    }

    return true
  }
}

;// CONCATENATED MODULE: ./node_modules/zwitch/index.js
/**
 * @callback Handler
 *   Handle a value, with a certain ID field set to a certain value.
 *   The ID field is passed to `zwitch`, and it’s value is this function’s
 *   place on the `handlers` record.
 * @param {...any} parameters
 *   Arbitrary parameters passed to the zwitch.
 *   The first will be an object with a certain ID field set to a certain value.
 * @returns {any}
 *   Anything!
 */

/**
 * @callback UnknownHandler
 *   Handle values that do have a certain ID field, but it’s set to a value
 *   that is not listed in the `handlers` record.
 * @param {unknown} value
 *   An object with a certain ID field set to an unknown value.
 * @param {...any} rest
 *   Arbitrary parameters passed to the zwitch.
 * @returns {any}
 *   Anything!
 */

/**
 * @callback InvalidHandler
 *   Handle values that do not have a certain ID field.
 * @param {unknown} value
 *   Any unknown value.
 * @param {...any} rest
 *   Arbitrary parameters passed to the zwitch.
 * @returns {void|null|undefined|never}
 *   This should crash or return nothing.
 */

/**
 * @template {InvalidHandler} [Invalid=InvalidHandler]
 * @template {UnknownHandler} [Unknown=UnknownHandler]
 * @template {Record<string, Handler>} [Handlers=Record<string, Handler>]
 * @typedef Options
 *   Configuration (required).
 * @property {Invalid} [invalid]
 *   Handler to use for invalid values.
 * @property {Unknown} [unknown]
 *   Handler to use for unknown values.
 * @property {Handlers} [handlers]
 *   Handlers to use.
 */

const own = {}.hasOwnProperty

/**
 * Handle values based on a field.
 *
 * @template {InvalidHandler} [Invalid=InvalidHandler]
 * @template {UnknownHandler} [Unknown=UnknownHandler]
 * @template {Record<string, Handler>} [Handlers=Record<string, Handler>]
 * @param {string} key
 *   Field to switch on.
 * @param {Options<Invalid, Unknown, Handlers>} [options]
 *   Configuration (required).
 * @returns {{unknown: Unknown, invalid: Invalid, handlers: Handlers, (...parameters: Parameters<Handlers[keyof Handlers]>): ReturnType<Handlers[keyof Handlers]>, (...parameters: Parameters<Unknown>): ReturnType<Unknown>}}
 */
function zwitch(key, options) {
  const settings = options || {}

  /**
   * Handle one value.
   *
   * Based on the bound `key`, a respective handler will be called.
   * If `value` is not an object, or doesn’t have a `key` property, the special
   * “invalid” handler will be called.
   * If `value` has an unknown `key`, the special “unknown” handler will be
   * called.
   *
   * All arguments, and the context object, are passed through to the handler,
   * and it’s result is returned.
   *
   * @this {unknown}
   *   Any context object.
   * @param {unknown} [value]
   *   Any value.
   * @param {...unknown} parameters
   *   Arbitrary parameters passed to the zwitch.
   * @property {Handler} invalid
   *   Handle for values that do not have a certain ID field.
   * @property {Handler} unknown
   *   Handle values that do have a certain ID field, but it’s set to a value
   *   that is not listed in the `handlers` record.
   * @property {Handlers} handlers
   *   Record of handlers.
   * @returns {unknown}
   *   Anything.
   */
  function one(value, ...parameters) {
    /** @type {Handler|undefined} */
    let fn = one.invalid
    const handlers = one.handlers

    if (value && own.call(value, key)) {
      // @ts-expect-error Indexable.
      const id = String(value[key])
      // @ts-expect-error Indexable.
      fn = own.call(handlers, id) ? handlers[id] : one.unknown
    }

    if (fn) {
      return fn.call(this, value, ...parameters)
    }
  }

  one.handlers = settings.handlers || {}
  one.invalid = settings.invalid
  one.unknown = settings.unknown

  // @ts-expect-error: matches!
  return one
}

;// CONCATENATED MODULE: ./node_modules/unist-util-select/lib/attribute.js
/**
 * @typedef {import('./types.js').Rule} Rule
 * @typedef {import('./types.js').RuleAttr} RuleAttr
 * @typedef {import('./types.js').Node} Node
 */



/** @type {(query: RuleAttr, node: Node) => boolean} */
const handle = zwitch('operator', {
  unknown: unknownOperator,
  // @ts-expect-error: hush.
  invalid: exists,
  handlers: {
    '=': exact,
    '^=': begins,
    '$=': ends,
    '*=': containsString,
    '~=': containsArray
  }
})

/**
 * @param {Rule} query
 * @param {Node} node
 * @returns {boolean}
 */
function attribute(query, node) {
  let index = -1

  while (++index < query.attrs.length) {
    if (!handle(query.attrs[index], node)) return false
  }

  return true
}

/**
 * Check whether an attribute exists.
 *
 * `[attr]`
 *
 * @param {RuleAttr} query
 * @param {Node} node
 * @returns {boolean}
 */
function exists(query, node) {
  // @ts-expect-error: Looks like a record.
  return node[query.name] !== null && node[query.name] !== undefined
}

/**
 * Check whether an attribute has an exact value.
 *
 * `[attr=value]`
 *
 * @param {RuleAttr} query
 * @param {Node} node
 * @returns {boolean}
 */
function exact(query, node) {
  // @ts-expect-error: Looks like a record.
  return exists(query, node) && String(node[query.name]) === query.value
}

/**
 * Check whether an attribute, as a list, contains a value.
 *
 * When the attribute value is not a list, checks that the serialized value
 * is the queried one.
 *
 * `[attr~=value]`
 *
 * @param {RuleAttr} query
 * @param {Node} node
 * @returns {boolean}
 */
function containsArray(query, node) {
  /** @type {unknown} */
  // @ts-expect-error: Looks like a record.
  const value = node[query.name]

  if (value === null || value === undefined) return false

  // If this is an array, and the query is contained in it, return true.
  // Coverage comment in place because TS turns `Array.isArray(unknown)`
  // into `Array<any>` instead of `Array<unknown>`.
  // type-coverage:ignore-next-line
  if (Array.isArray(value) && value.includes(query.value)) {
    return true
  }

  // For all other values, return whether this is an exact match.
  return String(value) === query.value
}

/**
 * Check whether an attribute has a substring as its start.
 *
 * `[attr^=value]`
 *
 * @param {RuleAttr} query
 * @param {Node} node
 * @returns {boolean}
 */
function begins(query, node) {
  /** @type {unknown} */
  // @ts-expect-error: Looks like a record.
  const value = node[query.name]

  return Boolean(
    query.value &&
      typeof value === 'string' &&
      value.slice(0, query.value.length) === query.value
  )
}

/**
 * Check whether an attribute has a substring as its end.
 *
 * `[attr$=value]`
 *
 * @param {RuleAttr} query
 * @param {Node} node
 * @returns {boolean}
 */
function ends(query, node) {
  /** @type {unknown} */
  // @ts-expect-error: Looks like a record.
  const value = node[query.name]

  return Boolean(
    query.value &&
      typeof value === 'string' &&
      value.slice(-query.value.length) === query.value
  )
}

/**
 * Check whether an attribute contains a substring.
 *
 * `[attr*=value]`
 *
 * @param {RuleAttr} query
 * @param {Node} node
 * @returns {boolean}
 */
function containsString(query, node) {
  /** @type {unknown} */
  // @ts-expect-error: Looks like a record.
  const value = node[query.name]
  return Boolean(
    query.value && typeof value === 'string' && value.includes(query.value)
  )
}

// Shouldn’t be called, parser throws an error instead.
/**
 * @param {unknown} query
 * @returns {never}
 */
/* c8 ignore next 4 */
function unknownOperator(query) {
  // @ts-expect-error: `operator` guaranteed.
  throw new Error('Unknown operator `' + query.operator + '`')
}

;// CONCATENATED MODULE: ./node_modules/unist-util-select/lib/name.js
/**
 * @typedef {import('./types.js').Rule} Rule
 * @typedef {import('./types.js').Node} Node
 */

/**
 * Check whether a node has a type.
 *
 * @param {Rule} query
 * @param {Node} node
 */
function name_name(query, node) {
  return query.tagName === '*' || query.tagName === node.type
}

;// CONCATENATED MODULE: ./node_modules/nth-check/lib/esm/parse.js
// Following http://www.w3.org/TR/css3-selectors/#nth-child-pseudo
// Whitespace as per https://www.w3.org/TR/selectors-3/#lex is " \t\r\n\f"
const whitespace = new Set([9, 10, 12, 13, 32]);
const ZERO = "0".charCodeAt(0);
const NINE = "9".charCodeAt(0);
/**
 * Parses an expression.
 *
 * @throws An `Error` if parsing fails.
 * @returns An array containing the integer step size and the integer offset of the nth rule.
 * @example nthCheck.parse("2n+3"); // returns [2, 3]
 */
function parse_parse(formula) {
    formula = formula.trim().toLowerCase();
    if (formula === "even") {
        return [2, 0];
    }
    else if (formula === "odd") {
        return [2, 1];
    }
    // Parse [ ['-'|'+']? INTEGER? {N} [ S* ['-'|'+'] S* INTEGER ]?
    let idx = 0;
    let a = 0;
    let sign = readSign();
    let number = readNumber();
    if (idx < formula.length && formula.charAt(idx) === "n") {
        idx++;
        a = sign * (number !== null && number !== void 0 ? number : 1);
        skipWhitespace();
        if (idx < formula.length) {
            sign = readSign();
            skipWhitespace();
            number = readNumber();
        }
        else {
            sign = number = 0;
        }
    }
    // Throw if there is anything else
    if (number === null || idx < formula.length) {
        throw new Error(`n-th rule couldn't be parsed ('${formula}')`);
    }
    return [a, sign * number];
    function readSign() {
        if (formula.charAt(idx) === "-") {
            idx++;
            return -1;
        }
        if (formula.charAt(idx) === "+") {
            idx++;
        }
        return 1;
    }
    function readNumber() {
        const start = idx;
        let value = 0;
        while (idx < formula.length &&
            formula.charCodeAt(idx) >= ZERO &&
            formula.charCodeAt(idx) <= NINE) {
            value = value * 10 + (formula.charCodeAt(idx) - ZERO);
            idx++;
        }
        // Return `null` if we didn't read anything.
        return idx === start ? null : value;
    }
    function skipWhitespace() {
        while (idx < formula.length &&
            whitespace.has(formula.charCodeAt(idx))) {
            idx++;
        }
    }
}
//# sourceMappingURL=parse.js.map
// EXTERNAL MODULE: ./node_modules/boolbase/index.js
var boolbase = __nccwpck_require__(159);
;// CONCATENATED MODULE: ./node_modules/nth-check/lib/esm/compile.js

/**
 * Returns a function that checks if an elements index matches the given rule
 * highly optimized to return the fastest solution.
 *
 * @param parsed A tuple [a, b], as returned by `parse`.
 * @returns A highly optimized function that returns whether an index matches the nth-check.
 * @example
 *
 * ```js
 * const check = nthCheck.compile([2, 3]);
 *
 * check(0); // `false`
 * check(1); // `false`
 * check(2); // `true`
 * check(3); // `false`
 * check(4); // `true`
 * check(5); // `false`
 * check(6); // `true`
 * ```
 */
function compile(parsed) {
    const a = parsed[0];
    // Subtract 1 from `b`, to convert from one- to zero-indexed.
    const b = parsed[1] - 1;
    /*
     * When `b <= 0`, `a * n` won't be lead to any matches for `a < 0`.
     * Besides, the specification states that no elements are
     * matched when `a` and `b` are 0.
     *
     * `b < 0` here as we subtracted 1 from `b` above.
     */
    if (b < 0 && a <= 0)
        return boolbase.falseFunc;
    // When `a` is in the range -1..1, it matches any element (so only `b` is checked).
    if (a === -1)
        return (index) => index <= b;
    if (a === 0)
        return (index) => index === b;
    // When `b <= 0` and `a === 1`, they match any element.
    if (a === 1)
        return b < 0 ? boolbase.trueFunc : (index) => index >= b;
    /*
     * Otherwise, modulo can be used to check if there is a match.
     *
     * Modulo doesn't care about the sign, so let's use `a`s absolute value.
     */
    const absA = Math.abs(a);
    // Get `b mod a`, + a if this is negative.
    const bMod = ((b % absA) + absA) % absA;
    return a > 1
        ? (index) => index >= b && index % absA === bMod
        : (index) => index <= b && index % absA === bMod;
}
/**
 * Returns a function that produces a monotonously increasing sequence of indices.
 *
 * If the sequence has an end, the returned function will return `null` after
 * the last index in the sequence.
 *
 * @param parsed A tuple [a, b], as returned by `parse`.
 * @returns A function that produces a sequence of indices.
 * @example <caption>Always increasing (2n+3)</caption>
 *
 * ```js
 * const gen = nthCheck.generate([2, 3])
 *
 * gen() // `1`
 * gen() // `3`
 * gen() // `5`
 * gen() // `8`
 * gen() // `11`
 * ```
 *
 * @example <caption>With end value (-2n+10)</caption>
 *
 * ```js
 *
 * const gen = nthCheck.generate([-2, 5]);
 *
 * gen() // 0
 * gen() // 2
 * gen() // 4
 * gen() // null
 * ```
 */
function compile_generate(parsed) {
    const a = parsed[0];
    // Subtract 1 from `b`, to convert from one- to zero-indexed.
    let b = parsed[1] - 1;
    let n = 0;
    // Make sure to always return an increasing sequence
    if (a < 0) {
        const aPos = -a;
        // Get `b mod a`
        const minValue = ((b % aPos) + aPos) % aPos;
        return () => {
            const val = minValue + aPos * n++;
            return val > b ? null : val;
        };
    }
    if (a === 0)
        return b < 0
            ? // There are no result — always return `null`
                () => null
            : // Return `b` exactly once
                () => (n++ === 0 ? b : null);
    if (b < 0) {
        b += a * Math.ceil(-b / a);
    }
    return () => a * n++ + b;
}
//# sourceMappingURL=compile.js.map
;// CONCATENATED MODULE: ./node_modules/nth-check/lib/esm/index.js



/**
 * Parses and compiles a formula to a highly optimized function.
 * Combination of {@link parse} and {@link compile}.
 *
 * If the formula doesn't match any elements,
 * it returns [`boolbase`](https://github.com/fb55/boolbase)'s `falseFunc`.
 * Otherwise, a function accepting an _index_ is returned, which returns
 * whether or not the passed _index_ matches the formula.
 *
 * Note: The nth-rule starts counting at `1`, the returned function at `0`.
 *
 * @param formula The formula to compile.
 * @example
 * const check = nthCheck("2n+3");
 *
 * check(0); // `false`
 * check(1); // `false`
 * check(2); // `true`
 * check(3); // `false`
 * check(4); // `true`
 * check(5); // `false`
 * check(6); // `true`
 */
function nthCheck(formula) {
    return compile(parse_parse(formula));
}
/**
 * Parses and compiles a formula to a generator that produces a sequence of indices.
 * Combination of {@link parse} and {@link generate}.
 *
 * @param formula The formula to compile.
 * @returns A function that produces a sequence of indices.
 * @example <caption>Always increasing</caption>
 *
 * ```js
 * const gen = nthCheck.sequence('2n+3')
 *
 * gen() // `1`
 * gen() // `3`
 * gen() // `5`
 * gen() // `8`
 * gen() // `11`
 * ```
 *
 * @example <caption>With end value</caption>
 *
 * ```js
 *
 * const gen = nthCheck.sequence('-2n+5');
 *
 * gen() // 0
 * gen() // 2
 * gen() // 4
 * gen() // null
 * ```
 */
function sequence(formula) {
    return generate(parse(formula));
}
//# sourceMappingURL=index.js.map
;// CONCATENATED MODULE: ./node_modules/unist-util-select/lib/util.js
/**
 * @typedef {import('./types.js').Node} Node
 * @typedef {import('./types.js').Parent} Parent
 */

/**
 * @param {Node} node
 * @returns {node is Parent}
 */
function util_parent(node) {
  // @ts-expect-error: looks like a record.
  return Array.isArray(node.children)
}

;// CONCATENATED MODULE: ./node_modules/unist-util-select/lib/pseudo.js
/**
 * @typedef {import('./types.js').Rule} Rule
 * @typedef {import('./types.js').RulePseudo} RulePseudo
 * @typedef {import('./types.js').RulePseudoSelector} RulePseudoSelector
 * @typedef {import('./types.js').Parent} Parent
 * @typedef {import('./types.js').SelectState} SelectState
 * @typedef {import('./types.js').Node} Node
 */






/** @type {import('nth-check').default} */
// @ts-expect-error
const pseudo_nthCheck = nthCheck["default"] || nthCheck

/** @type {(rule: Rule | RulePseudo, node: Node, index: number | undefined, parent: Parent | undefined, state: SelectState) => boolean} */
const pseudo_handle = zwitch('name', {
  unknown: unknownPseudo,
  invalid: invalidPseudo,
  handlers: {
    any: matches,
    blank: empty,
    empty,
    'first-child': firstChild,
    'first-of-type': firstOfType,
    has,
    'last-child': lastChild,
    'last-of-type': lastOfType,
    matches,
    not,
    'nth-child': nthChild,
    'nth-last-child': nthLastChild,
    'nth-of-type': nthOfType,
    'nth-last-of-type': nthLastOfType,
    'only-child': onlyChild,
    'only-of-type': onlyOfType,
    root,
    scope
  }
})

pseudo.needsIndex = [
  'any',
  'first-child',
  'first-of-type',
  'last-child',
  'last-of-type',
  'matches',
  'not',
  'nth-child',
  'nth-last-child',
  'nth-of-type',
  'nth-last-of-type',
  'only-child',
  'only-of-type'
]

/**
 * Check whether an node matches pseudo selectors.
 *
 * @param {Rule} query
 * @param {Node} node
 * @param {number | undefined} index
 * @param {Parent | undefined} parent
 * @param {SelectState} state
 * @returns {boolean}
 */
function pseudo(query, node, index, parent, state) {
  const pseudos = query.pseudos
  let offset = -1

  while (++offset < pseudos.length) {
    if (!pseudo_handle(pseudos[offset], node, index, parent, state)) return false
  }

  return true
}

/**
 * Check whether a node matches an `:empty` pseudo.
 *
 * @param {RulePseudo} _1
 * @param {Node} node
 * @returns {boolean}
 */
function empty(_1, node) {
  return util_parent(node) ? node.children.length === 0 : !('value' in node)
}

/**
 * Check whether a node matches a `:first-child` pseudo.
 *
 * @param {RulePseudo} query
 * @param {Node} _1
 * @param {number | undefined} _2
 * @param {Parent | undefined} _3
 * @param {SelectState} state
 * @returns {boolean}
 */
function firstChild(query, _1, _2, _3, state) {
  assertDeep(state, query)
  return state.nodeIndex === 0 // Specifically `0`, not falsey.
}

/**
 * Check whether a node matches a `:first-of-type` pseudo.
 *
 * @param {RulePseudo} query
 * @param {Node} _1
 * @param {number | undefined} _2
 * @param {Parent | undefined} _3
 * @param {SelectState} state
 * @returns {boolean}
 */
function firstOfType(query, _1, _2, _3, state) {
  assertDeep(state, query)
  return state.typeIndex === 0
}

/**
 * @param {RulePseudoSelector} query
 * @param {Node} node
 * @param {number | undefined} _1
 * @param {Parent | undefined} _2
 * @param {SelectState} state
 * @returns {boolean}
 */
function has(query, node, _1, _2, state) {
  const fragment = {type: 'root', children: util_parent(node) ? node.children : []}
  /** @type {SelectState} */
  const childState = {
    ...state,
    // Not found yet.
    found: false,
    // Do walk deep.
    shallow: false,
    // One result is enough.
    one: true,
    scopeNodes: [node],
    results: [],
    rootQuery: queryToSelectors(query.value)
  }

  walk_walk(childState, fragment)

  return childState.results.length > 0
}

/**
 * Check whether a node matches a `:last-child` pseudo.
 *
 * @param {RulePseudo} query
 * @param {Node} _1
 * @param {number | undefined} _2
 * @param {Parent | undefined} _3
 * @param {SelectState} state
 * @returns {boolean}
 */
function lastChild(query, _1, _2, _3, state) {
  assertDeep(state, query)
  return (
    typeof state.nodeCount === 'number' &&
    state.nodeIndex === state.nodeCount - 1
  )
}

/**
 * Check whether a node matches a `:last-of-type` pseudo.
 *
 * @param {RulePseudo} query
 * @param {Node} _1
 * @param {number | undefined} _2
 * @param {Parent | undefined} _3
 * @param {SelectState} state
 * @returns {boolean}
 */
function lastOfType(query, _1, _2, _3, state) {
  assertDeep(state, query)
  return (
    typeof state.typeCount === 'number' &&
    state.typeIndex === state.typeCount - 1
  )
}

/**
 * Check whether a node `:matches` further selectors.
 *
 * @param {RulePseudoSelector} query
 * @param {Node} node
 * @param {number | undefined} _1
 * @param {Parent | undefined} _2
 * @param {SelectState} state
 * @returns {boolean}
 */
function matches(query, node, _1, _2, state) {
  /** @type {SelectState} */
  const childState = {
    ...state,
    // Not found yet.
    found: false,
    // Do walk deep.
    shallow: false,
    // One result is enough.
    one: true,
    scopeNodes: [node],
    results: [],
    rootQuery: queryToSelectors(query.value)
  }

  walk_walk(childState, node)

  return childState.results[0] === node
}

/**
 * Check whether a node does `:not` match further selectors.
 *
 * @param {RulePseudoSelector} query
 * @param {Node} node
 * @param {number | undefined} index
 * @param {Parent | undefined} parent
 * @param {SelectState} state
 * @returns {boolean}
 */
function not(query, node, index, parent, state) {
  return !matches(query, node, index, parent, state)
}

/**
 * Check whether a node matches an `:nth-child` pseudo.
 *
 * @param {RulePseudo} query
 * @param {Node} _1
 * @param {number | undefined} _2
 * @param {Parent | undefined} _3
 * @param {SelectState} state
 * @returns {boolean}
 */
function nthChild(query, _1, _2, _3, state) {
  const fn = getCachedNthCheck(query)
  assertDeep(state, query)
  return typeof state.nodeIndex === 'number' && fn(state.nodeIndex)
}

/**
 * Check whether a node matches an `:nth-last-child` pseudo.
 *
 * @param {RulePseudo} query
 * @param {Node} _1
 * @param {number | undefined} _2
 * @param {Parent | undefined} _3
 * @param {SelectState} state
 * @returns {boolean}
 */
function nthLastChild(query, _1, _2, _3, state) {
  const fn = getCachedNthCheck(query)
  assertDeep(state, query)
  return (
    typeof state.nodeCount === 'number' &&
    typeof state.nodeIndex === 'number' &&
    fn(state.nodeCount - state.nodeIndex - 1)
  )
}

/**
 * Check whether a node matches a `:nth-last-of-type` pseudo.
 *
 * @param {RulePseudo} query
 * @param {Node} _1
 * @param {number | undefined} _2
 * @param {Parent | undefined} _3
 * @param {SelectState} state
 * @returns {boolean}
 */
function nthLastOfType(query, _1, _2, _3, state) {
  const fn = getCachedNthCheck(query)
  assertDeep(state, query)
  return (
    typeof state.typeIndex === 'number' &&
    typeof state.typeCount === 'number' &&
    fn(state.typeCount - 1 - state.typeIndex)
  )
}

/**
 * Check whether a node matches an `:nth-of-type` pseudo.
 *
 * @param {RulePseudo} query
 * @param {Node} _1
 * @param {number | undefined} _2
 * @param {Parent | undefined} _3
 * @param {SelectState} state
 * @returns {boolean}
 */
function nthOfType(query, _1, _2, _3, state) {
  const fn = getCachedNthCheck(query)
  assertDeep(state, query)
  return typeof state.typeIndex === 'number' && fn(state.typeIndex)
}

/**
 * Check whether a node matches an `:only-child` pseudo.
 *
 * @param {RulePseudo} query
 * @param {Node} _1
 * @param {number | undefined} _2
 * @param {Parent | undefined} _3
 * @param {SelectState} state
 * @returns {boolean}
 */
function onlyChild(query, _1, _2, _3, state) {
  assertDeep(state, query)
  return state.nodeCount === 1
}

/**
 * Check whether a node matches an `:only-of-type` pseudo.
 *
 * @param {RulePseudo} query
 * @param {Node} _1
 * @param {number | undefined} _2
 * @param {Parent | undefined} _3
 * @param {SelectState} state
 * @returns {boolean}
 */
function onlyOfType(query, _1, _2, _3, state) {
  assertDeep(state, query)
  return state.typeCount === 1
}

/**
 * Check whether a node matches a `:root` pseudo.
 *
 * @param {RulePseudo} _1
 * @param {Node} node
 * @param {number | undefined} _2
 * @param {Parent | undefined} parent
 * @returns {boolean}
 */
function root(_1, node, _2, parent) {
  return node && !parent
}

/**
 * Check whether a node matches a `:scope` pseudo.
 *
 * @param {RulePseudo} _1
 * @param {Node} node
 * @param {number | undefined} _2
 * @param {Parent | undefined} _3
 * @param {SelectState} state
 * @returns {boolean}
 */
function scope(_1, node, _2, _3, state) {
  return node && state.scopeNodes.includes(node)
}

// Shouldn’t be called, parser gives correct data.
/* c8 ignore next 3 */
function invalidPseudo() {
  throw new Error('Invalid pseudo-selector')
}

/**
 * @param {unknown} query
 * @returns {never}
 */
function unknownPseudo(query) {
  // @ts-expect-error: indexable.
  if (query.name) {
    // @ts-expect-error: indexable.
    throw new Error('Unknown pseudo-selector `' + query.name + '`')
  }

  throw new Error('Unexpected pseudo-element or empty pseudo-class')
}

/**
 * @param {SelectState} state
 * @param {RulePseudo} query
 */
function assertDeep(state, query) {
  if (state.shallow) {
    throw new Error('Cannot use `:' + query.name + '` without parent')
  }
}

/**
 * @param {RulePseudo} query
 * @returns {(value: number) => boolean}
 */
function getCachedNthCheck(query) {
  /** @type {(value: number) => boolean} */
  // @ts-expect-error: cache.
  let fn = query._cachedFn

  if (!fn) {
    // @ts-expect-error: always string.
    fn = pseudo_nthCheck(query.value)
    // @ts-expect-error: cache.
    query._cachedFn = fn
  }

  return fn
}

;// CONCATENATED MODULE: ./node_modules/unist-util-select/lib/test.js
/**
 * @typedef {import('./types.js').Rule} Rule
 * @typedef {import('./types.js').Node} Node
 * @typedef {import('./types.js').Parent} Parent
 * @typedef {import('./types.js').SelectState} SelectState
 */





/**
 * @param {Rule} query
 * @param {Node} node
 * @param {number | undefined} index
 * @param {Parent | undefined} parent
 * @param {SelectState} state
 * @returns {boolean}
 */
function test(query, node, index, parent, state) {
  if (query.id) throw new Error('Invalid selector: id')
  if (query.classNames) throw new Error('Invalid selector: class')

  return Boolean(
    node &&
      (!query.tagName || name_name(query, node)) &&
      (!query.attrs || attribute(query, node)) &&
      (!query.pseudos || pseudo(query, node, index, parent, state))
  )
}

;// CONCATENATED MODULE: ./node_modules/unist-util-select/lib/walk.js
/**
 * @typedef {import('./types.js').Node} Node
 * @typedef {import('./types.js').Parent} Parent
 * @typedef {import('./types.js').RuleSet} RuleSet
 * @typedef {import('./types.js').SelectState} SelectState
 * @typedef {import('./types.js').Selectors} Selectors
 *
 * @typedef Nest
 *   Rule sets by nesting.
 * @property {Array<RuleSet> | undefined} descendant
 *   `a b`
 * @property {Array<RuleSet> | undefined} directChild
 *   `a > b`
 * @property {Array<RuleSet> | undefined} adjacentSibling
 *   `a + b`
 * @property {Array<RuleSet> | undefined} generalSibling
 *   `a ~ b`
 *
 * @typedef Counts
 *   Info on nodes in a parent.
 * @property {number} count
 *   Number of nodes.
 * @property {Map<string, number>} types
 *   Number of nodes by type.
 */




/** @type {Array<never>} */
const walk_empty = []

/**
 * Turn a query into a uniform object.
 *
 * @param {Selectors | RuleSet | null} query
 * @returns {Selectors}
 */
function queryToSelectors(query) {
  if (query === null) {
    return {type: 'selectors', selectors: []}
  }

  if (query.type === 'ruleSet') {
    return {type: 'selectors', selectors: [query]}
  }

  return query
}

/**
 * Walk a tree.
 *
 * @param {SelectState} state
 * @param {Node | undefined} tree
 */
function walk_walk(state, tree) {
  if (tree) {
    one(state, [], tree, undefined, undefined)
  }
}

/**
 * Check a node.
 *
 * @param {SelectState} state
 * @param {Array<RuleSet>} currentRules
 * @param {Node} node
 * @param {number | undefined} index
 * @param {Parent | undefined} parentNode
 * @returns {Nest}
 */
function one(state, currentRules, node, index, parentNode) {
  /** @type {Nest} */
  let nestResult = {
    directChild: undefined,
    descendant: undefined,
    adjacentSibling: undefined,
    generalSibling: undefined
  }

  nestResult = applySelectors(
    state,
    // Try the root rules for this node too.
    combine(currentRules, state.rootQuery.selectors),
    node,
    index,
    parentNode
  )

  // If this is a parent, and we want to delve into them, and we haven’t found
  // our single result yet.
  if (util_parent(node) && !state.shallow && !(state.one && state.found)) {
    walk_all(state, nestResult, node)
  }

  return nestResult
}

/**
 * Check a node.
 *
 * @param {SelectState} state
 * @param {Nest} nest
 * @param {Parent} node
 * @returns {void}
 */
function walk_all(state, nest, node) {
  const fromParent = combine(nest.descendant, nest.directChild)
  /** @type {Array<RuleSet> | undefined} */
  let fromSibling
  let index = -1
  /**
   * Total counts.
   * @type {Counts}
   */
  const total = {count: 0, types: new Map()}
  /**
   * Counts of previous siblings.
   * @type {Counts}
   */
  const before = {count: 0, types: new Map()}

  while (++index < node.children.length) {
    count(total, node.children[index])
  }

  index = -1

  while (++index < node.children.length) {
    const child = node.children[index]
    // Uppercase to prevent prototype polution, injecting `constructor` or so.
    const name = child.type.toUpperCase()
    // Before counting further nodes:
    state.nodeIndex = before.count
    state.typeIndex = before.types.get(name) || 0
    // After counting all nodes.
    state.nodeCount = total.count
    state.typeCount = total.types.get(name)

    // Only apply if this is a parent.
    const forSibling = combine(fromParent, fromSibling)
    const nest = one(state, forSibling, node.children[index], index, node)
    fromSibling = combine(nest.generalSibling, nest.adjacentSibling)

    // We found one thing, and one is enough.
    if (state.one && state.found) {
      break
    }

    count(before, node.children[index])
  }
}

/**
 * Apply selectors to a node.
 *
 * @param {SelectState} state
 *   Current state.
 * @param {Array<RuleSet>} rules
 *   Rules to apply.
 * @param {Node} node
 *   Node to apply rules to.
 * @param {number | undefined} index
 *   Index of node in parent.
 * @param {Parent | undefined} parent
 *   Parent of node.
 * @returns {Nest}
 *   Further rules.
 */
function applySelectors(state, rules, node, index, parent) {
  /** @type {Nest} */
  const nestResult = {
    directChild: undefined,
    descendant: undefined,
    adjacentSibling: undefined,
    generalSibling: undefined
  }
  let selectorIndex = -1

  while (++selectorIndex < rules.length) {
    const ruleSet = rules[selectorIndex]

    // We found one thing, and one is enough.
    if (state.one && state.found) {
      break
    }

    // When shallow, we don’t allow nested rules.
    // Idea: we could allow a stack of parents?
    // Might get quite complex though.
    if (state.shallow && ruleSet.rule.rule) {
      throw new Error('Expected selector without nesting')
    }

    // If this rule matches:
    if (test(ruleSet.rule, node, index, parent, state)) {
      const nest = ruleSet.rule.rule

      // Are there more?
      if (nest) {
        /** @type {RuleSet} */
        const rule = {type: 'ruleSet', rule: nest}
        /** @type {keyof Nest} */
        const label =
          nest.nestingOperator === '+'
            ? 'adjacentSibling'
            : nest.nestingOperator === '~'
            ? 'generalSibling'
            : nest.nestingOperator === '>'
            ? 'directChild'
            : 'descendant'
        add(nestResult, label, rule)
      } else {
        // We have a match!
        state.found = true

        if (!state.results.includes(node)) {
          state.results.push(node)
        }
      }
    }

    // Descendant.
    if (ruleSet.rule.nestingOperator === null) {
      add(nestResult, 'descendant', ruleSet)
    }
    // Adjacent.
    else if (ruleSet.rule.nestingOperator === '~') {
      add(nestResult, 'generalSibling', ruleSet)
    }
    // Drop top-level nesting (`undefined`), direct child (`>`), adjacent sibling (`+`).
  }

  return nestResult
}

/**
 * Combine two lists, if needed.
 *
 * This is optimized to create as few lists as possible.
 *
 * @param {Array<RuleSet> | undefined} left
 * @param {Array<RuleSet> | undefined} right
 * @returns {Array<RuleSet>}
 */
function combine(left, right) {
  return left && right && left.length > 0 && right.length > 0
    ? [...left, ...right]
    : left && left.length > 0
    ? left
    : right && right.length > 0
    ? right
    : walk_empty
}

/**
 * Add a rule to a nesting map.
 *
 * @param {Nest} nest
 * @param {keyof Nest} field
 * @param {RuleSet} rule
 */
function add(nest, field, rule) {
  const list = nest[field]
  if (list) {
    list.push(rule)
  } else {
    nest[field] = [rule]
  }
}

/**
 * Count a node.
 *
 * @param {Counts} counts
 *   Counts.
 * @param {Node} node
 *   Node.
 * @returns {void}
 *   Nothing.
 */
function count(counts, node) {
  // Uppercase to prevent prototype polution, injecting `constructor` or so.
  // Normalize because HTML is insensitive.
  const name = node.type.toUpperCase()
  const count = (counts.types.get(name) || 0) + 1
  counts.count++
  counts.types.set(name, count)
}

// EXTERNAL MODULE: ./node_modules/css-selector-parser/lib/index.js
var lib = __nccwpck_require__(218);
;// CONCATENATED MODULE: ./node_modules/unist-util-select/lib/parse.js
/**
 * @typedef {import('./types.js').Selectors} Selectors
 * @typedef {import('./types.js').RuleSet} RuleSet
 */



const parser = new lib/* CssSelectorParser */.N()

parser.registerAttrEqualityMods('~', '^', '$', '*')
parser.registerSelectorPseudos('any', 'matches', 'not', 'has')
parser.registerNestingOperators('>', '+', '~')

/**
 * @param {string} selector
 * @returns {Selectors | RuleSet | null}
 */
function lib_parse_parse(selector) {
  if (typeof selector !== 'string') {
    throw new TypeError('Expected `string` as selector, not `' + selector + '`')
  }

  return parser.parse(selector)
}

;// CONCATENATED MODULE: ./node_modules/unist-util-select/index.js
/**
 * @typedef {import('unist').Position} Position
 * @typedef {import('unist').Node} Node
 * @typedef {import('./lib/types.js').SelectState} SelectState
 * @typedef {Record<string, unknown> & {type: string, position?: Position | undefined}} NodeLike
 */





/**
 * Check that the given `node` matches `selector`.
 *
 * This only checks the node itself, not the surrounding tree.
 * Thus, nesting in selectors is not supported (`paragraph strong`,
 * `paragraph > strong`), neither are selectors like `:first-child`, etc.
 * This only checks that the given node matches the selector.
 *
 * @param {string} selector
 *   CSS selector, such as (`heading`, `link, linkReference`).
 * @param {Node | NodeLike | null | undefined} [node]
 *   Node that might match `selector`.
 * @returns {boolean}
 *   Whether `node` matches `selector`.
 */
function unist_util_select_matches(selector, node) {
  const state = createState(selector, node)
  state.one = true
  state.shallow = true
  walk(state, node || undefined)
  return state.results.length > 0
}

/**
 * Select the first node that matches `selector` in the given `tree`.
 *
 * Searches the tree in *preorder*.
 *
 * @param {string} selector
 *   CSS selector, such as (`heading`, `link, linkReference`).
 * @param {Node | NodeLike | null | undefined} [tree]
 *   Tree to search.
 * @returns {Node | null}
 *   First node in `tree` that matches `selector` or `null` if nothing is
 *   found.
 *
 *   This could be `tree` itself.
 */
function unist_util_select_select(selector, tree) {
  const state = createState(selector, tree)
  state.one = true
  walk_walk(state, tree || undefined)
  // To do next major: return `undefined`.
  return state.results[0] || null
}

/**
 * Select all nodes that match `selector` in the given `tree`.
 *
 * Searches the tree in *preorder*.
 *
 * @param {string} selector
 *   CSS selector, such as (`heading`, `link, linkReference`).
 * @param {Node | NodeLike | null | undefined} [tree]
 *   Tree to search.
 * @returns {Array<Node>}
 *   Nodes in `tree` that match `selector`.
 *
 *   This could include `tree` itself.
 */
function selectAll(selector, tree) {
  const state = createState(selector, tree)
  walk_walk(state, tree || undefined)
  return state.results
}

/**
 * @param {string} selector
 *   Selector to parse.
 * @param {Node | null | undefined} tree
 *   Tree to search.
 * @returns {SelectState}
 */
function createState(selector, tree) {
  return {
    // State of the query.
    rootQuery: queryToSelectors(lib_parse_parse(selector)),
    results: [],
    scopeNodes: tree
      ? util_parent(tree) &&
        // Root in nlcst.
        (tree.type === 'RootNode' || tree.type === 'root')
        ? tree.children
        : [tree]
      : [],
    one: false,
    shallow: false,
    found: false,
    // State in the tree.
    typeIndex: undefined,
    nodeIndex: undefined,
    typeCount: undefined,
    nodeCount: undefined
  }
}

;// CONCATENATED MODULE: ./src/crossReferencePrefix.ts




/**
 * Regex for words that fall before cross references
 *
 * For example, with figure cross references, this includes:
 * Fig, Figs, figure, figures, fig., figs. (all case insensitive)
 */
const XREF_PREFIX_RE = {
    figure: 'fig(s|(ures{0,1})|(s{0,1}\\.)){0,1} {0,1}$',
    equation: 'eq(s|(ns{0,1})|(uations{0,1})|(n{0,1}s{0,1}\\.)){0,1} {0,1}$',
    heading: 'sections{0,1} {0,1}$',
};
XREF_PREFIX_RE.subequation = XREF_PREFIX_RE.equation;
/**
 * Generic case captures just the kind, singular and plural
 *
 * For example, with table cross references:
 * table and tables
 */
const XREF_PREFIX_RE_NO_KIND = 's{0,1} {0,1}$';
/**
 * Prefix text will only be removed if cross reference text starts with the equivalent
 *
 * For most cases, this is the kind. For example, "Figure 1" for kind figure.
 *
 * However, for equations, the cross reference text is "(1)" so we must look for a different pattern.
 * Headings should always remove the prefix.
 */
const ALT_XREF_START = {
    equation: '(',
    heading: '',
};
ALT_XREF_START.subequation = ALT_XREF_START.equation;
const XREF_NUMBER_ONLY_RE = '^[0-9]+[a-z0-9\\.]*$';
var Action;
(function (Action) {
    Action["move"] = "move";
    Action["trim"] = "trim";
})(Action || (Action = {}));
/**
 * Traverse mdast tree and remove any redundant text before cross references
 *
 * For example, since the cross reference fills "Figure" text,
 *
 * "See Figure [](#my-fig)"
 *
 * will resolve to
 *
 * "See [](#my-fig)"
 */
function crossReferencePrefixTransform(mdast, vfile) {
    const paragraphs = selectAll('paragraph', mdast);
    paragraphs.forEach((paragraph) => {
        // Treat each paragraph individually
        const xrefs = selectAll('crossReference', paragraph);
        xrefs.forEach((xref) => {
            var _a;
            const { kind } = xref;
            if (!kind)
                return;
            const xrefPrefix = (_a = XREF_PREFIX_RE[kind]) !== null && _a !== void 0 ? _a : `${kind}${XREF_PREFIX_RE_NO_KIND}`;
            const xrefStart = kind === 'subequation' ? 'eq' : kind.slice(0, 2);
            const altXrefStart = ALT_XREF_START[kind];
            const xrefText = toText(xref);
            if (!xrefPrefix || !xrefStart || !xrefText)
                return;
            // First see if xref has placeholder text we don't want duplicated
            const lowerXrefText = xrefText.toLowerCase();
            const numberRegex = new RegExp(XREF_NUMBER_ONLY_RE, 'gi');
            let action;
            if (lowerXrefText.startsWith(xrefStart) || lowerXrefText.startsWith(altXrefStart)) {
                action = Action.trim;
            }
            else if (numberRegex.exec(lowerXrefText)) {
                action = Action.move;
            }
            else {
                return;
            }
            // Then find the last node before the cross reference
            let previousNode = findBefore(paragraph, xref);
            if (previousNode === null || previousNode === void 0 ? void 0 : previousNode.children) {
                previousNode = unist_util_select_select(':last-child', previousNode);
            }
            if ((previousNode === null || previousNode === void 0 ? void 0 : previousNode.type) !== 'text' || !previousNode.value)
                return;
            // If this node is just a space, find the next one (this happens with, like: "_figure_ [](#my-fig)")
            let spaceNode;
            if (previousNode.value === ' ') {
                spaceNode = previousNode;
                previousNode = findBefore(paragraph, spaceNode);
                if (previousNode === null || previousNode === void 0 ? void 0 : previousNode.children) {
                    previousNode = unist_util_select_select(':last-child', previousNode);
                }
                if ((previousNode === null || previousNode === void 0 ? void 0 : previousNode.type) !== 'text' || !previousNode.value)
                    return;
            }
            // If it is text and ends with an unwanted cross reference prefix, remove the prefix
            const regex = new RegExp(xrefPrefix, 'gi');
            const match = regex.exec(previousNode.value);
            if (match) {
                const messageIndex = previousNode.value.length < 30 ? 0 : previousNode.value.length - 30;
                const beforeXref = `[${toText(xref)}]` + (xref.identifier ? `(${xref.identifier})` : '');
                const before = `${previousNode.value.slice(messageIndex)}${spaceNode ? ' ' : ''}${beforeXref}`;
                if (action === Action.move) {
                    xref.children = [
                        { type: 'text', value: `${match[0]}${spaceNode ? ' ' : ''}` },
                        ...xref.children,
                    ];
                }
                previousNode.value = previousNode.value.replace(regex, '');
                const afterXref = `[${toText(xref)}]` + (xref.identifier ? `(${xref.identifier})` : '');
                const after = `${previousNode.value.slice(messageIndex)}${afterXref}`;
                fileInfo(vfile, `Rewrote cross-reference prefix:\n    Before: ...${before}\n    After:  ...${after}`);
                if (spaceNode)
                    spaceNode.type = '__delete__';
                if (!previousNode.value)
                    previousNode.type = '__delete__';
            }
        });
    });
    remove(mdast, '__delete__');
}
const crossReferencePrefixPlugin = () => (tree, vfile) => {
    crossReferencePrefixTransform(tree, vfile);
};

;// CONCATENATED MODULE: ./src/index.ts

const crossReferencePrefixTransformSpec = {
    name: 'Cross-Reference Prefix Transform',
    stage: 'project',
    plugin: crossReferencePrefixPlugin,
};
const src_plugin = {
    name: 'Cross-Reference Prefix Plugin',
    author: 'Franklin Koch',
    license: 'MIT',
    transforms: [crossReferencePrefixTransformSpec],
    directives: [],
    roles: [],
};
/* harmony default export */ const src = (src_plugin);

})();

var __webpack_exports__default = __webpack_exports__.Z;
export { __webpack_exports__default as default };
