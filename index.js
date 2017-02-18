
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
 * Loads and inserts stylesheets with the specified `href` and `options`;
 *
 * @param {Array|string} href
 * @param {Object} [options]
 * @param {DOMElement} [options.before]
 * @param {string} [options.media]
 * @param {Function} [options.done]
 */

function loadcss(href, options) {
  var doc = document;
  var styles = doc.styleSheets;
  var hrefs = isArray(href) ? href : [href]; // cast href to array of hrefs
  var length = hrefs.length;

  // reference to node to insert links before
  var before;

  if (options && options.before) {
    before = options.before;
  } else {
    // if no before node specified, then default reference to the last node of
    // documents head element
    var refs = (doc.body || doc.getElementsByTagName('head')[0]).childNodes;
    before = refs[refs.length - 1];
  }

  // reference to stylesheets media type
  var media;

  if (options && options.media) {
    media = options.media;
  } else {
    // if no media type specified, then default  media type to `all` value
    media = 'all';
  }

  // reference to a callback function
  var done = isFunction(options) ? options : options.done || function () {};

  // reference to array of link nodes
  var links = [];

  // insert link when document body is processed
  ready(function () {
    var index = -1;

    while (++index < length) {
      var referenceNode;

      if (options && options.before) {
        referenceNode = before;
      } else {
        referenceNode = before.nextSibling;
      }

      links[index] = doc.createElement('link');

      links[index].href = hrefs[index];
      links[index].media = media;

      links[index].rel = 'stylesheet';

      before.parentNode.insertBefore(links[index], referenceNode);
    }

    load(); // begin stylesheets loading
  });

  /**
   * Executes `callback` when document body is ready
   * @param {Function} callback
   */

  function ready(callback) {
    if (doc.body){
      return callback();
    }

    callasync(function () {
      ready(callback);
    });
  }

  function load() {
    var index = -1;
    var loaded = 0;
    // test wether document has applied stylesheets
    while (++index < length) {
      if (exists(href[index]) && ++loaded === length) {
        // when all stylesheets applied, call done and exit

        return complete(links);
      }
    }

    // continue loading stylesheets (recursevly)
    callasync(load);
  }

  /**
   * Test wether stylesheet with `href` has been applied to document.
   * @param {string} href Href attribute of the stylesheet.
   * @return {boolean}
   */

  function exists(href) {
    var index = -1;
    var length = styles.length;

    while (++index < length) {
      if (styles[index].href && styles[index].href.indexOf(href) > -1) {
        return true;
      }
    }

    return false;
  }

  /**
   *  Executes when all stylesheets where loaded.
   */

  function complete() {
    done(links);
  }

  return links;
}
