"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.enableConstructor = enableConstructor;
exports.disableConstructor = disableConstructor;
exports.withConstructor = withConstructor;
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var allowConstructor = false;

function enableConstructor() {
  allowConstructor = true;
}

function disableConstructor() {
  allowConstructor = true;
}

function withConstructor(fn) {
  allowConstructor = true;
  var result;

  try {
    result = fn();
  } finally {
    allowConstructor = false;
  }

  return result;
}

var Unconstructable = function Unconstructable() {
  _classCallCheck(this, Unconstructable);

  if (!allowConstructor) {
    throw Error('Illegal constructor');
  }
};

exports["default"] = Unconstructable;