
/**
 * Module dependencies.
 */

var callasync = require('callasync');

/**
 * Expose `loadcss`.
 */

module.exports = loadcss;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */

function toString(value) {
  return Object.prototype.toString.call(value);
};

/**
 * Array tag reference.
 */

var arrayTag = '[object Array]';

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @param {*} value The value to check.
 * @return Returns `true` if `value` is an array, else `false`.
 */

function isArray(value) {
  return toString(value) === arrayTag;
};

/**
 * Function tag reference.
 */

var functionTag = '[object Function]';

/**
 * Checks if `value` is classified as an `Function` object.
 *
 * @param {*} value The value to check.
 * @return Returns `true` if `value` is a function, else `false`.
 */

function isFunction(value) {
  return toString(value) === functionTag;
}

/**
 * Reference to the document.
 */

var doc = document;

/**
 * Reference to the document style sheets.
 */

var sheets = doc.styleSheets;

/**
 * Loads and inserts stylesheets with the specified `href` and `options`;
 *
 * @param {Array|string} href
 * @param {Object|Function} [options]
 * @param {DOMElement} [options.before]
 * @param {string} [options.media]
 * @param {Function} [options.complete]
 */

function loadcss(href, options) {
  // default options
  options = options || {};

  // if second argument is a `complete` function
  if (isFunction(options)) {
    options = { complete: options };
  }

  // completion callback
  var complete = options.complete || function () { /* no-op */ };


  // reference to stylesheets media type
  var media = options.media ? options.media : 'all';

  var before;

  if (options.before) {
    before = options.before;
  } else {
    // when no before node specified, reference the last children node of the
    // document body or head
    var refs = (doc.body || doc.getElementsByTagName('head')[0]).childNodes;
    before = refs[refs.length - 1];
  }

  // hrefs to load and insert to the document
  var hrefs = isArray(href) ? href : [href];

  // array of link elements
  var links = [];

  // execute `callback` when body is parsed and ready
 function ready(callback) {
   if (doc.body){
     return callback();
   }

   callasync(function () {
     ready(callback);
   });
 }

  // polls stylesheets till `href` is resolved
  function loading() {
    var loaded = 0;
    var index = -1;
    var length = hrefs.length;

    // test wether document has applied stylesheets
    while (++index < length) {
      if (exists(href[index]) && ++loaded === length) {
        // executes when all stylesheets where loaded.
        return complete(links);
      }
    }
    // shedule polling again
    callasync(loading);
  }

  // test wether `href` is resolved by document
  function exists(href) {
    var index = -1;
    var length = sheets.length;

    while (++index < length) {
      // couple of quick checks on the style sheet
      if (sheets[index].href === null || sheets[index].href.length === 0) {
        continue;
      }

      // test wether `href` is in document style sheets
      if (sheets[index].href.indexOf(href) > -1) {
        return true;
      }
    }
  }

  // when document is parsed and ready
  ready(function () {
    var index = -1;
    var length = hrefs.length;
    var referenceNode = options.before ? before : before.nextSibling;

    while (++index < length) {
      links[index] = doc.createElement('link');

      links[index].rel = 'stylesheet';
      links[index].href = hrefs[index];
      links[index].media = media;

      before.parentNode.insertBefore(links[index], referenceNode);
    }
    // shedule polling of loaded style sheets
    callasync(loading);
  });

  return links;
}
