(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.loadcss=f()}})(function(){var define,module,exports;return function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}({1:[function(require,module,exports){var callasync=require("callasync");module.exports=loadcss;function toString(value){return Object.prototype.toString.call(value)}var arrayTag="[object Array]";function isArray(value){return toString(value)===arrayTag}var functionTag="[object Function]";function isFunction(value){return toString(value)===functionTag}function loadcss(href,options){var doc=document;var styles=doc.styleSheets;var hrefs=isArray(href)?href:[href];var length=hrefs.length;var before;if(options&&options.before){before=options.before}else{var refs=(doc.body||doc.getElementsByTagName("head")[0]).childNodes;before=refs[refs.length-1]}var media;if(options&&options.media){media=options.media}else{media="all"}var done=isFunction(options)?options:options.done||function(){};var links=[];ready(function(){var index=-1;while(++index<length){var referenceNode;if(options&&options.before){referenceNode=before}else{referenceNode=before.nextSibling}links[index]=doc.createElement("link");links[index].href=hrefs[index];links[index].media=media;links[index].rel="stylesheet";before.parentNode.insertBefore(links[index],referenceNode)}load()});function ready(callback){if(doc.body){return callback()}callasync(function(){ready(callback)})}function load(){var index=-1;var loaded=0;while(++index<length){if(exists(href[index])&&++loaded===length){return complete(links)}}callasync(load)}function exists(href){var index=-1;var length=styles.length;while(++index<length){if(styles[index].href.indexOf(href)>-1){return true}}return false}function complete(){done(links)}return links}},{callasync:2}],2:[function(require,module,exports){module.exports=callAsync;var waiting=[];var waitingID=0;var callWaiting=function(){var funcs=waiting;waiting=[];waitingID=0;while(funcs.length){funcs.shift()()}};function callAsync(func){waiting.push(func);if(waitingID===0){waitingID=setTimeout(callWaiting,0)}}},{}]},{},[1])(1)});