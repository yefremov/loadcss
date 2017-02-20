
/**
 * Module dependencies.
 */

var callasync = require('callasync');

/**
 * Expose `loadcss`.
 */

module.exports = loadcss;

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
  options || (options = {});

  if (({}).toString.call(options) === '[object Function]') {
    options = { complete: options };
  }

  var doc = document;
  var sheets = doc.styleSheets;
  var hrefs = ({}).toString.call(href) === '[object Array]' ? href : [href];
  var media = options.media ? options.media : 'all';
  var oncomplete = options.complete || function () {};
  var links = [];

  var before;

  if (options.before) {
    before = options.before;
  } else {
    var refs = (doc.body || doc.getElementsByTagName('head')[0]).childNodes;
    before = refs[refs.length - 1];
  }

  function onready(callback) {
    if (doc.body){
      return callback();
    }

    callasync(function () {
      onready(callback);
    });
  }

  function onloaded() {
    var loaded = 0;
    var index = -1;
    var length = links.length;

    while (++index < length) {
      if (exists(links[index].href) && ++loaded === length) {
        return oncomplete(links);
      }
    }

    callasync(onloaded);
  }

  function exists(href) {
    var index = -1;
    var length = sheets.length;

    while (++index < length) {
      if (sheets[index].href === null || sheets[index].href.length === 0) {
        continue;
      }

      if (sheets[index].href === href) {
        return true;
      }
    }
  }

  onready(function () {
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

    callasync(onloaded);
  });

  return links;
}
