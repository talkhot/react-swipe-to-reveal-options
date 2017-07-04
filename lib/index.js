'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function translateStyle(x, measure, y) {
  var _y = y || "0";
  return {
    transform: "translate3d(" + x + measure + ", " + _y + ", 0)",
    WebkitTransform: "translate3d(" + x + measure + ", " + _y + ", 0)"
  };
}

var Swipeable = function (_Component) {
  _inherits(Swipeable, _Component);

  function Swipeable(props) {
    _classCallCheck(this, Swipeable);

    var _this = _possibleConstructorReturn(this, (Swipeable.__proto__ || Object.getPrototypeOf(Swipeable)).call(this, props));

    _this.state = {
      x: null,
      y: null,
      swiping: false,
      start: 0
    };

    _this.calculatePos = function (e) {
      var x = e.changedTouches[0].clientX;
      var y = e.changedTouches[0].clientY;

      var xd = _this.state.x - x;
      var yd = _this.state.y - y;

      var axd = Math.abs(xd);
      var ayd = Math.abs(yd);

      return {
        deltaX: xd,
        deltaY: yd,
        absX: axd,
        absY: ayd
      };
    };

    _this.touchStart = function (e) {
      if (e.touches.length > 1) {
        return;
      }
      _this.setState({
        start: Date.now(),
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        swiping: false
      });
    };

    _this.touchMove = function (e) {
      if (!_this.state.x || !_this.state.y || e.touches.length > 1) {
        return;
      }

      var cancelPageSwipe = false;
      var pos = _this.calculatePos(e);

      if (pos.absX < _this.props.delta && pos.absY < _this.props.delta) {
        return;
      }

      if (pos.absX > pos.absY) {
        if (pos.deltaX > 0) {
          if (_this.props.onSwipingLeft) {
            _this.props.onSwipingLeft(e, pos.absX);
            cancelPageSwipe = true;
          }
        } else {
          if (_this.props.onSwipingRight) {
            _this.props.onSwipingRight(e, pos.absX);
            cancelPageSwipe = true;
          }
        }
      } else {
        if (pos.deltaY > 0) {
          if (_this.props.onSwipingUp) {
            _this.props.onSwipingUp(e, pos.absY);
            cancelPageSwipe = true;
          }
        } else {
          if (_this.props.onSwipingDown) {
            _this.props.onSwipingDown(e, pos.absY);
            cancelPageSwipe = true;
          }
        }
      }

      _this.setState({ swiping: true });

      if (cancelPageSwipe) {
        e.preventDefault();
      }
    };

    _this.touchEnd = function (ev) {
      if (_this.state.swiping) {
        var pos = _this.calculatePos(ev);

        var time = Date.now() - _this.state.start;
        var velocity = Math.sqrt(pos.absX * pos.absX + pos.absY * pos.absY) / time;
        var isFlick = velocity > _this.props.flickThreshold;

        _this.props.onSwiped && _this.props.onSwiped(ev, pos.deltaX, pos.deltaY, isFlick);

        if (pos.absX > pos.absY) {
          if (pos.deltaX > 0) {
            _this.props.onSwipedLeft && _this.props.onSwipedLeft(ev, pos.deltaX);
          } else {
            _this.props.onSwipedRight && _this.props.onSwipedRight(ev, pos.deltaX);
          }
        } else {
          if (pos.deltaY > 0) {
            _this.props.onSwipedUp && _this.props.onSwipedUp(ev, pos.deltaY);
          } else {
            _this.props.onSwipedDown && _this.props.onSwipedDown(ev, pos.deltaY);
          }
        }
      }

      _this.setState({
        x: null,
        y: null,
        swiping: false,
        start: 0
      });
    };

    return _this;
  }

  _createClass(Swipeable, [{
    key: 'render',
    value: function render() {
      var props = Object.assign({}, this.props, { onTouchStart: this.touchStart,
        onTouchMove: this.touchMove,
        onTouchEnd: this.touchEnd });
      var customPropNames = ["onSwiped", "onSwipingUp", "onSwipingRight", "onSwipingLeft", "onSwipedUp", "onSwipedRight", "onSwipedDown", "onSwipedLeft", "flickThreshold", "delta"];
      for (var i = 0; i < customPropNames.length; i++) {
        var customPropName = customPropNames[i];
        delete props[customPropName];
      }
      return (0, _react.createElement)("div", props, this.props.children);
    }
  }]);

  return Swipeable;
}(_react.Component);

;

Swipeable.defaultProps = {
  flickThreshold: 0.6,
  delta: 10
};

var SwipeToRevealOptions = function (_Component2) {
  _inherits(SwipeToRevealOptions, _Component2);

  function SwipeToRevealOptions(props) {
    _classCallCheck(this, SwipeToRevealOptions);

    var _this2 = _possibleConstructorReturn(this, (SwipeToRevealOptions.__proto__ || Object.getPrototypeOf(SwipeToRevealOptions)).call(this, props));

    _this2.state = {
      delta: 0,
      showRightButtons: false,
      showLeftButtons: false,
      swipingLeft: false,
      swipingRight: false,
      transitionBack: false,
      action: null,
      callActionWhenSwipingFarRight: false,
      callActionWhenSwipingFarLeft: false,
      transitionBackOnRightClick: true,
      transitionBackOnLeftClick: true
    };

    _this2.swipingLeft = function (event, delta) {
      if (_this2.swipingHandleStylesAndDelta(delta, "left")) {
        return;
      }

      var action = null;
      if (delta > _this2.props.visibilityThreshold) {
        action = "rightVisible";
      }
      if (_this2.props.callActionWhenSwipingFarLeft && delta > _this2.props.actionThreshold) {
        action = "rightAction";
      }

      _this2.setState({
        delta: -delta,
        action: action,
        swipingLeft: true
      });
    };

    _this2.swipingRight = function (event, delta) {
      if (_this2.swipingHandleStylesAndDelta(delta, "right")) {
        return;
      }

      var action = null;
      if (delta > _this2.props.visibilityThreshold) {
        action = "leftVisible";
      }
      if (_this2.props.callActionWhenSwipingFarRight && delta > _this2.props.actionThreshold) {
        action = "leftAction";
      }

      _this2.setState({
        delta: delta,
        action: action,
        swipingRight: true
      });
    };

    _this2.swipingHandleStylesAndDelta = function (delta, direction) {
      if (_this2.shouldAbort(direction)) {
        return true;
      }

      _this2.shouldTransitionBack(direction);
      _this2.shouldCloseOthers(direction);

      return false;
    };

    _this2.shouldAbort = function (direction) {
      if (_this2.state.transitionBack) {
        return true;
      }
      if (direction === "right") {
        return !_this2.props.leftOptions.length && !_this2.state.showRightButtons || _this2.state.showLeftButtons && !_this2.props.callActionWhenSwipingFarRight;
      } else {
        return !_this2.props.rightOptions.length && !_this2.state.showLeftButtons || _this2.state.showRightButtons && !_this2.props.callActionWhenSwipingFarLeft;
      }
    };

    _this2.shouldTransitionBack = function (direction) {
      if (direction === "right" && _this2.state.showRightButtons || _this2.state.showLeftButtons) {
        _this2.transitionBack();
      }
    };

    _this2.shouldCloseOthers = function (direction) {
      if (_this2.props.closeOthers) {
        if (direction === "right" && !_this2.state.swipingRight || !_this2.state.swipingLeft) {
          _this2.props.closeOthers();
        }
      }
    };

    _this2.swiped = function () {
      switch (_this2.state.action) {
        case "rightVisible":
          _this2.revealRight();
          break;
        case "leftVisible":
          _this2.revealLeft();
          break;
        case "leftAction":
          _this2.leftClick(_this2.props.leftOptions[_this2.props.leftOptions.length - 1]);
          break;
        case "rightAction":
          _this2.rightClick(_this2.props.rightOptions[_this2.props.rightOptions.length - 1]);
          break;
      }
      _this2.setState({
        delta: 0,
        action: null,
        swipingLeft: false,
        swipingRight: false,
        secondarySwipe: false,
        transitionBack: true
      });
      if (_this2._timeout) {
        clearTimeout(_this2._timeout);
      }
      _this2._timeout = setTimeout(function () {
        this.setState({ transitionBack: false });
      }.bind(_this2), _this2.props.transitionBackTimeout);
    };

    _this2.revealRight = function () {
      _this2.props.onReveal("right");
      _this2.setState({ showRightButtons: true, showLeftButtons: false });
    };

    _this2.revealLeft = function () {
      _this2.props.onReveal("left");
      _this2.setState({ showRightButtons: false, showLeftButtons: true });
    };

    _this2.rightClick = function (option) {
      _this2.props.onRightClick(option);
      if (_this2.props.transitionBackOnRightClick) _this2.transitionBack();
    };

    _this2.leftClick = function (option) {
      _this2.props.onLeftClick(option);
      if (_this2.props.transitionBackOnLeftClick) _this2.transitionBack();
    };

    _this2.close = function () {
      _this2.transitionBack();
    };

    _this2.transitionBack = function () {
      _this2.setState({
        showLeftButtons: false,
        showRightButtons: false,
        transitionBack: true
      });
      if (_this2._timeout) {
        clearTimeout(_this2._timeout);
      }
      _this2._timeout = setTimeout(function () {
        this.setState({ transitionBack: false });
      }.bind(_this2), _this2.props.transitionBackTimeout);
    };

    _this2.getContainerStyle = function () {
      var itemWidth;
      if (_this2.state.delta === 0 && _this2.state.showRightButtons) {
        itemWidth = _this2.getItemWidth("right");
        return translateStyle(-_this2.props.rightOptions.length * itemWidth, "px");
      } else if (_this2.state.delta === 0 && _this2.state.showLeftButtons) {
        itemWidth = _this2.getItemWidth("left");
        return translateStyle(_this2.props.leftOptions.length * itemWidth, "px");
      }
      return translateStyle(_this2.state.delta, "px");
    };

    _this2.getItemWidth = function (side) {
      var nbOptions = side === "left" ? _this2.props.leftOptions.length : _this2.props.rightOptions.length;
      return Math.min(_this2.props.parentWidth / (nbOptions + 1), _this2.props.maxItemWidth);
    };

    _this2.getStyle = function (side, index) {
      var left = side === 'left';
      var factor = left ? -1 : 1;
      var nbOptions = left ? _this2.props.leftOptions.length : _this2.props.rightOptions.length;
      var width = _this2.getItemWidth(side);
      var transition;
      var style;

      if (_this2.state.transitionBack || left && _this2.state.showLeftButtons || _this2.state.showRightButtons) {
        style = translateStyle(factor * index * width, "px");
        return style;
      }

      var modifier = index * 1 / nbOptions;
      var offset = -1 * modifier * _this2.state.delta; // fixes wrong position of buttons on the left side
      if (Math.abs(_this2.state.delta) > _this2.props.actionThreshold && (left && _this2.props.callActionWhenSwipingFarRight || _this2.props.callActionWhenSwipingFarLeft) && index === nbOptions - 1) {
        transition = "transform 0.15s ease-out";
        offset = 0;
      } else if (nbOptions * width < Math.abs(_this2.state.delta)) {
        offset += factor * (Math.abs(_this2.state.delta) - nbOptions * width) * 0.85;
      }
      style = translateStyle(offset, "px");
      if (transition) {
        style.transition = transition;
      }
      return style;
    };

    _this2.getSpanStyle = function (side, index) {
      var left = side === 'left';
      var width = _this2.getItemWidth(side);
      var factor = left ? 1 : -1;
      var nbOptions = left ? _this2.props.leftOptions.length : _this2.props.rightOptions.length;
      var padding;
      var style;

      if (_this2.state.transitionBack || left && _this2.state.showLeftButtons || _this2.state.showRightButtons) {
        style = translateStyle(0, "px", "-50%");
        style.width = width;
        return style;
      }

      if (Math.abs(_this2.state.delta) > _this2.props.actionThreshold && (left && _this2.props.callActionWhenSwipingFarRight || _this2.props.callActionWhenSwipingFarLeft) && index === nbOptions - 1) {
        padding = 0;
      } else if (nbOptions * width < Math.abs(_this2.state.delta)) {
        padding += factor * (Math.abs(_this2.state.delta) - nbOptions * width) * 0.425;
      }
      style = translateStyle(padding, 'px', '-50%');
      style.width = width;
      return style;
    };

    _this2.handleContentClick = function () {
      _this2.props.closeOthers();
      _this2.transitionBack();
    };

    return _this2;
  }

  _createClass(SwipeToRevealOptions, [{
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (this._timeout) {
        clearTimeout(this._timeout);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var classes = this.props.className + " stro-container";
      if (this.state.transitionBack) {
        classes += " transition-back";
      }
      if (this.state.showRightButtons) {
        classes += " show-right-buttons";
      }
      if (this.state.showLeftButtons) {
        classes += " show-left-buttons";
      }

      return (0, _react.createElement)("div", { className: classes,
        style: this.getContainerStyle() }, (0, _react.createElement)("div", { className: "stro-left" }, this.props.leftOptions.map(function (option, index) {
        var propsLabel = { style: this.getSpanStyle('left', index) };
        if (typeof option.label === 'string') {
          propsLabel.dangerouslySetInnerHTML = {
            __html: option.label
          };
        }
        return (0, _react.createElement)("div", { className: "stro-button stro-left-button " + option.class,
          key: 'swipe-left-option-' + index,
          onClick: this.leftClick.bind(this, option),
          style: this.getStyle("left", index) }, (0, _react.createElement)("span", propsLabel, typeof option.label !== 'string' && option.label || void 0));
      }.bind(this))), (0, _react.createElement)(Swipeable, { className: "stro-content",
        onSwipingLeft: this.swipingLeft,
        onClick: this.handleContentClick,
        onSwipingRight: this.swipingRight,
        delta: 15,
        onSwiped: this.swiped }, this.props.children), (0, _react.createElement)("div", { className: "stro-right" }, this.props.rightOptions.map(function (option, index) {
        var propsLabel = { style: this.getSpanStyle('right', index) };
        if (typeof option.label === 'string') {
          propsLabel.dangerouslySetInnerHTML = {
            __html: option.label
          };
        }
        return (0, _react.createElement)("div", { className: "stro-button stro-right-button " + option.class,
          key: 'swipe-right-option-' + index,
          onClick: this.rightClick.bind(this, option),
          style: this.getStyle("right", index) }, (0, _react.createElement)("span", propsLabel, typeof option.label !== 'string' && option.label || void 0));
      }.bind(this))));
    }
  }]);

  return SwipeToRevealOptions;
}(_react.Component);

;

SwipeToRevealOptions.defaultProps = {
  rightOptions: [],
  leftOptions: [],
  className: "",
  actionThreshold: 300,
  visibilityThreshold: 50,
  transitionBackTimeout: 400,
  onRightClick: function onRightClick() {},
  onLeftClick: function onLeftClick() {},
  onReveal: function onReveal() {},
  closeOthers: function closeOthers() {},
  maxItemWidth: 120,
  parentWidth: typeof window !== 'undefined' && window.outerWidth || typeof screen !== 'undefined' && screen.width || 320
};

exports.default = SwipeToRevealOptions;
module.exports = exports['default'];