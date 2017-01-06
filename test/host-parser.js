"use strict";
// Adapted from
// https://github.com/w3c/web-platform-tests/blob/15aa9992b8e104534069c376b8bd0eca94853d13/url/host-parser.html

const URL = require("..").URL;
const assert = require("assert");

describe("Host parser tests", () => {
  for (let i = 0; i < 0x7F; i++) {
    const str = String.fromCharCode(i);
    let shouldPass = true;
    let onlySetters = false;
    if (str.match(/[a-z0-9]/i)) {
      // Skip things we know will work
      continue;
    }
    if (str.match(/\x09|\x0A|\x0D|\?|\/|\\|:|@|#/)) {
      shouldPass = false;
      onlySetters = true;
    }
    if (str.match(/\x00|\x20|%|\[|\]/)) {
      shouldPass = false;
    }
    if (!onlySetters) {
      specify(encodeURI(str), () => {
        if (shouldPass) {
          const url = new URL("https://" + str + "x");

          assert.strictEqual(url.pathname, "/");
          assert.strictEqual(url.host, str + "x");
          assert.strictEqual(url.hostname, str + "x");
        } else {
          assert.throws(() => new URL("https://" + str + "x"), TypeError);
        }
      });
    }
    specify("host/hostname setter for " + encodeURI(str), () => {
      const url = new URL("https://x");

      ["host", "hostname"].forEach(val => {
        url[val] = str;
        if (shouldPass) {
          assert.strictEqual(url[val], str);
        } else {
          assert.strictEqual(url[val], "x");
        }
      });
    }, "host/hostname setter for " + encodeURI(str));
  }
});
