# loadcss

[![npm version](https://badge.fury.io/js/loadcss.svg)](https://badge.fury.io/js/loadcss)
[![Build Status](https://travis-ci.org/yefremov/loadcss.svg?branch=master)](https://travis-ci.org/yefremov/loadcss)

Fast and reliable utility to asynchronously load multiple css files and apply to
the document.

## Installation

```bash
$ npm install loadcss
```

## API

```js
import loadcss from 'loadcss';

// load a single css file
loadcss('/foo.css', links => {
  links.forEach(link => console.log(link.href));
});

// load multiple css files
loadcss(['/a/foo.css', '/b/bar.css'], links => {
  links.forEach(link => console.log(link.href));
});
```

## Running tests

```bash
$ npm install
$ npm test
```

## License

[MIT](LICENSE)
