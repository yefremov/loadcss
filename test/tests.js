
QUnit.test("should be exposed to window object", function( assert ) {
  assert.expect(2);
  assert.ok(window.loadcss, "loadcss should exist on the window object" );
  assert.ok(typeof window.loadcss === "function", "loadcss should be a function" );
});

QUnit.test("should load a single css file", function( assert ) {
  assert.expect(1);

  var done = assert.async(1);

  loadcss("fixtures/a.css", function (links) {
    assert.ok(links[0].href.indexOf("fixtures/a.css") > -1);
    done();
  });
});

QUnit.test("should load a multiple css files", function( assert ) {
  assert.expect(2);

  var done = assert.async(1);

  loadcss(["fixtures/b.css", "fixtures/c.css"], function (links) {
    assert.ok(links[0].href.indexOf("fixtures/b.css") > -1);
    assert.ok(links[1].href.indexOf("fixtures/c.css") > -1);
    done();
  });

  QUnit.test("should load css with a media specified media type", function( assert ) {
    assert.expect(1);

    var done = assert.async(1);

    loadcss(["fixtures/d.css"], {
      media: "screen",
      done: function (links) {
        console.log(links);
        assert.ok(links[0].media === 'screen');
        done();
      }
    });
  });

  QUnit.test("should insert line before a specified element", function( assert ) {
    assert.expect(1);

    var done = assert.async(1);

    var element = document.getElementById("before");

    loadcss(["fixtures/e.css"], {
      before: element,
      done: function (links) {
        assert.equal(links[0].nextElementSibling, element);
        done();
      }
    });
  });

});
