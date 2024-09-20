import {
  __commonJS
} from "./chunk-DC5AMYBS.js";

// node_modules/trie-prefix-tree/dist/config.js
var require_config = __commonJS({
  "node_modules/trie-prefix-tree/dist/config.js"(exports, module) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = {
      END_WORD: "$",
      END_WORD_REPLACER: "9a219a89-91cd-42e2-abd5-eb113af08ca8",
      PERMS_MIN_LEN: 2
    };
    module.exports = exports["default"];
  }
});

// node_modules/trie-prefix-tree/dist/append.js
var require_append = __commonJS({
  "node_modules/trie-prefix-tree/dist/append.js"(exports, module) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = append;
    var _config = require_config();
    var _config2 = _interopRequireDefault(_config);
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    function append(trie, letter, index, array) {
      var isEndWordLetter = letter === _config2.default.END_WORD;
      var isLastLetter = index === array.length - 1;
      if (isEndWordLetter && !isLastLetter) {
        trie[_config2.default.END_WORD] = 1;
        trie[_config2.default.END_WORD_REPLACER] = {};
        trie = trie[_config2.default.END_WORD_REPLACER];
      } else {
        trie[letter] = trie[letter] || {};
        trie = trie[letter];
      }
      if (isLastLetter) {
        trie[_config2.default.END_WORD] = 1;
      }
      return trie;
    }
    module.exports = exports["default"];
  }
});

// node_modules/trie-prefix-tree/dist/create.js
var require_create = __commonJS({
  "node_modules/trie-prefix-tree/dist/create.js"(exports, module) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
      return typeof obj;
    } : function(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
    exports.default = create;
    var _append = require_append();
    var _append2 = _interopRequireDefault(_append);
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    function create(input) {
      if (!Array.isArray(input)) {
        throw "Expected parameter Array, received " + (typeof input === "undefined" ? "undefined" : _typeof(input));
      }
      var trie = input.reduce(function(accumulator, item) {
        item.toLowerCase().split("").reduce(_append2.default, accumulator);
        return accumulator;
      }, {});
      return trie;
    }
    module.exports = exports["default"];
  }
});

// node_modules/trie-prefix-tree/dist/utils.js
var require_utils = __commonJS({
  "node_modules/trie-prefix-tree/dist/utils.js"(exports, module) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = {
      objectCopy: function objectCopy(obj) {
        if (typeof obj === "undefined") {
          return {};
        }
        return JSON.parse(JSON.stringify(obj));
      },
      stringify: function stringify(obj) {
        var spacer = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 2;
        if (typeof obj === "undefined") {
          return "";
        }
        return JSON.stringify(obj, null, spacer);
      }
    };
    module.exports = exports["default"];
  }
});

// node_modules/trie-prefix-tree/dist/checkPrefix.js
var require_checkPrefix = __commonJS({
  "node_modules/trie-prefix-tree/dist/checkPrefix.js"(exports, module) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = checkPrefix;
    var _utils = require_utils();
    var _utils2 = _interopRequireDefault(_utils);
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    function checkPrefix(prefixNode, prefix) {
      var input = prefix.toLowerCase().split("");
      var prefixFound = input.every(function(letter, index) {
        if (!prefixNode[letter]) {
          return false;
        }
        return prefixNode = prefixNode[letter];
      });
      return {
        prefixFound,
        prefixNode
      };
    }
    module.exports = exports["default"];
  }
});

// node_modules/trie-prefix-tree/dist/recursePrefix.js
var require_recursePrefix = __commonJS({
  "node_modules/trie-prefix-tree/dist/recursePrefix.js"(exports, module) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = recursePrefix;
    var _config = require_config();
    var _config2 = _interopRequireDefault(_config);
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    var pushInOrder = function pushInOrder2(word, prefixes) {
      var i = 0;
      while (i < prefixes.length) {
        if (word < prefixes[i]) {
          break;
        }
        i += 1;
      }
      prefixes.splice(i, 0, word);
      return prefixes;
    };
    function recursePrefix(node, prefix, sorted) {
      var prefixes = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : [];
      var word = prefix;
      for (var branch in node) {
        var currentLetter = branch;
        if (branch === _config2.default.END_WORD && typeof node[branch] === "number") {
          if (sorted) {
            pushInOrder(word, prefixes);
          } else {
            prefixes.push(word);
          }
          word = "";
        } else if (branch === _config2.default.END_WORD_REPLACER) {
          currentLetter = _config2.default.END_WORD;
        }
        recursePrefix(node[branch], prefix + currentLetter, sorted, prefixes);
      }
      return prefixes;
    }
    module.exports = exports["default"];
  }
});

// node_modules/trie-prefix-tree/dist/recurseRandomWord.js
var require_recurseRandomWord = __commonJS({
  "node_modules/trie-prefix-tree/dist/recurseRandomWord.js"(exports, module) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = recurseRandomWord;
    var _config = require_config();
    var _config2 = _interopRequireDefault(_config);
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    function recurseRandomWord(node, prefix) {
      var word = prefix;
      var branches = Object.keys(node);
      var branch = branches[Math.floor(Math.random() * branches.length)];
      if (branch === _config2.default.END_WORD) {
        return word;
      }
      return recurseRandomWord(node[branch], prefix + branch);
    }
    module.exports = exports["default"];
  }
});

// node_modules/trie-prefix-tree/dist/permutations.js
var require_permutations = __commonJS({
  "node_modules/trie-prefix-tree/dist/permutations.js"(exports, module) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
      return typeof obj;
    } : function(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
    exports.default = permutations;
    var _config = require_config();
    var _config2 = _interopRequireDefault(_config);
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    function permutations(letters, trie) {
      var opts = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {
        type: "anagram"
      };
      if (typeof letters !== "string") {
        throw "Permutations expects string letters, received " + (typeof letters === "undefined" ? "undefined" : _typeof(letters));
      }
      var words = [];
      var permute = function permute2(word, node) {
        var prefix = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : "";
        var wordIsEmpty = word.length === 0;
        var wordFound = words.indexOf(prefix) !== -1;
        var endWordFound = node[_config2.default.END_WORD] === 1;
        if (wordIsEmpty && endWordFound && !wordFound) {
          words.push(prefix);
        }
        for (var i = 0, len = word.length; i < len; i++) {
          var letter = word[i];
          if (opts.type === "sub-anagram") {
            if (endWordFound && !(words.indexOf(prefix) !== -1)) {
              words.push(prefix);
            }
          }
          if (node[letter]) {
            var remaining = word.substring(0, i) + word.substring(i + 1, len);
            permute2(remaining, node[letter], prefix + letter, words);
          }
        }
        return words.sort();
      };
      return permute(letters, trie);
    }
    module.exports = exports["default"];
  }
});

// node_modules/trie-prefix-tree/dist/index.js
var require_dist = __commonJS({
  "node_modules/trie-prefix-tree/dist/index.js"(exports, module) {
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
      return typeof obj;
    } : function(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
    exports.default = function(input) {
      if (!Array.isArray(input)) {
        throw "Expected parameter Array, received " + (typeof input === "undefined" ? "undefined" : _typeof(input));
      }
      var trie = (0, _create2.default)([].concat(_toConsumableArray(input)));
      return {
        /**
         * Get the generated raw trie object
        */
        tree: function tree() {
          return trie;
        },
        /**
         * Get a string representation of the trie
        */
        dump: function dump() {
          var spacer = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0;
          return _utils2.default.stringify(trie, spacer);
        },
        /**
         * Add a new word to the trie
         */
        addWord: function addWord(word) {
          if (typeof word !== "string" || word === "") {
            throw "Expected parameter string, received " + (typeof word === "undefined" ? "undefined" : _typeof(word));
          }
          var reducer = function reducer2() {
            return _append2.default.apply(void 0, arguments);
          };
          var input2 = word.toLowerCase().split("");
          input2.reduce(reducer, trie);
          return this;
        },
        /**
         * Remove an existing word from the trie
         */
        removeWord: function removeWord(word) {
          if (typeof word !== "string" || word === "") {
            throw "Expected parameter string, received " + (typeof word === "undefined" ? "undefined" : _typeof(word));
          }
          var _checkPrefix = (0, _checkPrefix6.default)(trie, word), prefixFound = _checkPrefix.prefixFound, prefixNode = _checkPrefix.prefixNode;
          if (prefixFound) {
            delete prefixNode[_config2.default.END_WORD];
          }
          return this;
        },
        /**
         * Check a prefix is valid
         * @returns Boolean
        */
        isPrefix: function isPrefix(prefix) {
          if (typeof prefix !== "string") {
            throw "Expected string prefix, received " + (typeof prefix === "undefined" ? "undefined" : _typeof(prefix));
          }
          var _checkPrefix2 = (0, _checkPrefix6.default)(trie, prefix), prefixFound = _checkPrefix2.prefixFound;
          return prefixFound;
        },
        /**
        * Get a list of all words in the trie with the given prefix
        * @returns Array
        */
        getPrefix: function getPrefix(strPrefix) {
          var sorted = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
          if (typeof strPrefix !== "string") {
            throw "Expected string prefix, received " + (typeof strPrefix === "undefined" ? "undefined" : _typeof(strPrefix));
          }
          if (typeof sorted !== "boolean") {
            throw "Expected sort parameter as boolean, received " + (typeof sorted === "undefined" ? "undefined" : _typeof(sorted));
          }
          if (!this.isPrefix(strPrefix)) {
            return [];
          }
          var prefixNode = strPrefix.length ? (0, _checkPrefix6.default)(trie, strPrefix).prefixNode : trie;
          return (0, _recursePrefix2.default)(prefixNode, strPrefix, sorted);
        },
        /**
        * Get a random word in the trie with the given prefix
        * @returns Array
        */
        getRandomWordWithPrefix: function getRandomWordWithPrefix(strPrefix) {
          if (typeof strPrefix !== "string") {
            throw "Expected string prefix, received " + (typeof strPrefix === "undefined" ? "undefined" : _typeof(strPrefix));
          }
          if (!this.isPrefix(strPrefix)) {
            return "";
          }
          var _checkPrefix3 = (0, _checkPrefix6.default)(trie, strPrefix), prefixNode = _checkPrefix3.prefixNode;
          return (0, _recurseRandomWord2.default)(prefixNode, strPrefix);
        },
        /**
        * Count the number of words with the given prefixSearch
        * @returns Number
        */
        countPrefix: function countPrefix(strPrefix) {
          var prefixes = this.getPrefix(strPrefix);
          return prefixes.length;
        },
        /**
        * Get all words in the trie
        * @returns Array
        */
        getWords: function getWords() {
          var sorted = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : true;
          return this.getPrefix("", sorted);
        },
        /**
        * Check the existence of a word in the trie
        * @returns Boolean
        */
        hasWord: function hasWord(word) {
          if (typeof word !== "string") {
            throw "Expected string word, received " + (typeof word === "undefined" ? "undefined" : _typeof(word));
          }
          var _checkPrefix4 = (0, _checkPrefix6.default)(trie, word), prefixFound = _checkPrefix4.prefixFound, prefixNode = _checkPrefix4.prefixNode;
          if (prefixFound) {
            return prefixNode[_config2.default.END_WORD] === 1;
          }
          return false;
        },
        /**
        * Get a list of valid anagrams that can be made from the given letters
        * @returns Array
        */
        getAnagrams: function getAnagrams(letters) {
          if (typeof letters !== "string") {
            throw "Anagrams expected string letters, received " + (typeof letters === "undefined" ? "undefined" : _typeof(letters));
          }
          if (letters.length < PERMS_MIN_LEN) {
            throw "getAnagrams expects at least " + PERMS_MIN_LEN + " letters";
          }
          return (0, _permutations2.default)(letters, trie, {
            type: "anagram"
          });
        },
        /**
        * Get a list of all sub-anagrams that can be made from the given letters
        * @returns Array
        */
        getSubAnagrams: function getSubAnagrams(letters) {
          if (typeof letters !== "string") {
            throw "Expected string letters, received " + (typeof letters === "undefined" ? "undefined" : _typeof(letters));
          }
          if (letters.length < PERMS_MIN_LEN) {
            throw "getSubAnagrams expects at least " + PERMS_MIN_LEN + " letters";
          }
          return (0, _permutations2.default)(letters, trie, {
            type: "sub-anagram"
          });
        }
      };
    };
    var _create = require_create();
    var _create2 = _interopRequireDefault(_create);
    var _append = require_append();
    var _append2 = _interopRequireDefault(_append);
    var _checkPrefix5 = require_checkPrefix();
    var _checkPrefix6 = _interopRequireDefault(_checkPrefix5);
    var _recursePrefix = require_recursePrefix();
    var _recursePrefix2 = _interopRequireDefault(_recursePrefix);
    var _recurseRandomWord = require_recurseRandomWord();
    var _recurseRandomWord2 = _interopRequireDefault(_recurseRandomWord);
    var _utils = require_utils();
    var _utils2 = _interopRequireDefault(_utils);
    var _config = require_config();
    var _config2 = _interopRequireDefault(_config);
    var _permutations = require_permutations();
    var _permutations2 = _interopRequireDefault(_permutations);
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    function _toConsumableArray(arr) {
      if (Array.isArray(arr)) {
        for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
          arr2[i] = arr[i];
        }
        return arr2;
      } else {
        return Array.from(arr);
      }
    }
    var PERMS_MIN_LEN = _config2.default.PERMS_MIN_LEN;
    module.exports = exports["default"];
  }
});
export default require_dist();
//# sourceMappingURL=trie-prefix-tree.js.map
