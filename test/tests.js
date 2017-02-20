(function (window) {

  var getStyles = window.getComputedStyle
    ? function (node) { return window.getComputedStyle(node, null) }
    : function (node) { return node.currentStyle };

  QUnit.assert.contains = function(needle, target, message) {
    var actual = target.indexOf(needle) > -1;

    this.pushResult({
      result: actual,
      actual: actual,
      expected: needle,
      message: message
    });
  };

  QUnit.test('should be exposed to window object', function( assert ) {
    assert.expect(2);
    assert.ok(window.loadcss);
    assert.ok(typeof window.loadcss === 'function');
  });

  QUnit.test('should load a single css file', function( assert ) {
    assert.expect(1);

    var done = assert.async(1);

    loadcss('./fixtures/a.css', function (links) {
      var a = links.shift();

      assert.contains('fixtures/a.css', a.href);
      done();
    });
  });

  QUnit.test('should load a multiple css files', function(assert) {
    assert.expect(2);

    var done = assert.async(1);

    loadcss(['fixtures/b.css', 'fixtures/c.css'], function (links) {
      var b = links.shift();
      var c = links.shift();

      assert.contains('fixtures/b.css', b.href);
      assert.contains('fixtures/c.css', c.href);

      done();
    });

    QUnit.test('should default media type to all devices', function( assert ) {
      assert.expect(1);

      var done = assert.async(1);

      loadcss(['fixtures/d.css'], function (links) {
        var d = links.shift();

        assert.equal(d.media, 'all');
        done();
      });
    });

    QUnit.test('should set media type specified in options', function( assert ) {
      assert.expect(1);

      var done = assert.async(1);

      loadcss(['fixtures/e.css'], {
        media: 'print',
        before: document.getElementById('loader'),
        complete: function (links) {
          var e = links.shift();

          assert.ok(e.media === 'print');
          done();
        }
      });
    });

    QUnit.test('should insert link before specified node', function(assert) {
      assert.expect(1);

      var done = assert.async(1);

      var element = document.getElementById('loader');

      loadcss(['fixtures/f.css'], {
        before: element,
        complete: function (links) {
          var f = links.shift();

          assert.equal(f.nextElementSibling, element);
          done();
        }
      });
    });

    QUnit.test('should fire callback after stylesheet is loaded', function(assert) {
      assert.expect(1);

      var done = assert.async(1);

      var fixtures = window.document.getElementById("qunit-fixture");

      var header = window.document.createElement('div');

      header.innerHTML = 'Hello, World!';
      header.id = 'header';

      fixtures.appendChild(header);

      loadcss(['fixtures/g.css'], {
        complete: function (links) {
          var g = links.shift();

          assert.equal(getStyles(header).color, 'rgb(238, 130, 238)');
          done();
        }
      });
    });
  });
}(window));
