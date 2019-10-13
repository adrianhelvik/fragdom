"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _Node2 = _interopRequireDefault(require("./Node.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to set private field on non-instance"); } if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } return value; }

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to get private field on non-instance"); } if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

var instancePrefix = '$';

var Element =
/*#__PURE__*/
function (_Node) {
  _inherits(Element, _Node);

  _createClass(Element, [{
    key: "tagName",
    get: function get() {
      return _classPrivateFieldGet(this, _tagName);
    },
    set: function set(tagName) {}
  }]);

  function Element(tagName) {
    var _this;

    _classCallCheck(this, Element);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Element).call(this));

    _defineProperty(_assertThisInitialized(_this), "attributes", {});

    _animationFrame.set(_assertThisInitialized(_this), {
      writable: true,
      value: null
    });

    _tagName.set(_assertThisInitialized(_this), {
      writable: true,
      value: null
    });

    if (typeof tagName !== 'string') {
      throw Error('[nonstandard] tagName must be a string');
    }

    _classPrivateFieldSet(_assertThisInitialized(_this), _tagName, tagName.toUpperCase());

    return _this;
  }

  _createClass(Element, [{
    key: "setAttribute",
    value: function setAttribute(key, value) {
      this.attributes[key] = value;
    }
  }, {
    key: "removeAttribute",
    value: function removeAttribute(key) {
      this.attributes[key] = null;
    }
  }, {
    key: "reconcile",
    value: function reconcile() {
      if (_classPrivateFieldGet(this, _animationFrame)) {
        cancelAnimationFrame(_classPrivateFieldGet(this, _animationFrame));

        _classPrivateFieldSet(this, _animationFrame, null);
      }

      var realNode = this.getPrivateRealNodeWithoutChecks() || window.document.createElement(this.tagName);

      for (var _i = 0, _Object$entries = Object.entries(this.attributes); _i < _Object$entries.length; _i++) {
        var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
            key = _Object$entries$_i[0],
            value = _Object$entries$_i[1];

        if (key.startsWith(instancePrefix)) {
          var name = key.slice(instancePrefix.length);
          realNode[name] = value;
        } else {
          if (value == null) {
            realNode.removeAttribute(key);
          } else if (realNode.getAttribute(key) !== value) {
            realNode.setAttribute(key, value);
          }
        }
      }

      var completeAt = this.childNodes.length;
      var index = 0;

      for (var i = 0; i < this.childNodes.length; i++) {
        this.childNodes[i].reconcile();
        var child = this.childNodes[i].realNode;

        if (Array.isArray(child)) {
          completeAt += child.length;
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = child[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var c = _step.value;

              if (realNode.childNodes[index] !== c) {
                if (realNode.childNodes[index]) {
                  realNode.removeChild(realNode.childNodes[index]);
                }

                realNode.appendChild(c);
              }

              index += 1;
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator["return"] != null) {
                _iterator["return"]();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }
        } else {
          if (realNode.childNodes[i] !== child) {
            if (realNode.childNodes[i]) {
              realNode.removeChild(realNode.childNodes[i]);
            }

            realNode.appendChild(child);
          }

          index += 1;
        }
      }

      for (var _i2 = completeAt; _i2 < realNode.childNodes.length; _i2++) {
        realNode.removeChild(realNode.childNodes[_i2]);
      }

      this.setRealNodeAfterReconciliation(realNode);
    }
  }, {
    key: "reconcileAsync",
    value: function reconcileAsync() {
      var _this2 = this;

      if (_classPrivateFieldGet(this, _animationFrame) != null) {
        return;
      }

      _classPrivateFieldSet(this, _animationFrame, requestAnimationFrame(function () {
        _classPrivateFieldSet(_this2, _animationFrame, null);

        _this2.reconcile();
      }));
    }
  }]);

  return Element;
}(_Node2["default"]);

var _animationFrame = new WeakMap();

var _tagName = new WeakMap();

var _default = Element;
exports["default"] = _default;