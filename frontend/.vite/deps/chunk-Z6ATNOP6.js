import {
  require_classnames
} from "./chunk-PU5AC3CG.js";
import {
  require_prop_types
} from "./chunk-JL2MEAST.js";
import {
  require_react_dom
} from "./chunk-UHINIFCJ.js";
import {
  require_react
} from "./chunk-W4EHDCLL.js";
import {
  __toESM
} from "./chunk-EWTE5DHJ.js";

// node_modules/@visx/tooltip/esm/enhancers/withTooltip.js
var import_react2 = __toESM(require_react());

// node_modules/@visx/tooltip/esm/hooks/useTooltip.js
var import_react = __toESM(require_react());
var _excluded = ["tooltipOpen"];
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }
  return target;
}
function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}
function useTooltip(initialTooltipState) {
  var _useState = (0, import_react.useState)(_extends({
    tooltipOpen: false
  }, initialTooltipState)), tooltipState = _useState[0], setTooltipState = _useState[1];
  var showTooltip = (0, import_react.useCallback)(function(showArgs) {
    return setTooltipState(typeof showArgs === "function" ? function(_ref) {
      var tooltipOpen = _ref.tooltipOpen, show = _objectWithoutPropertiesLoose(_ref, _excluded);
      return _extends({}, showArgs(show), {
        tooltipOpen: true
      });
    } : {
      tooltipOpen: true,
      tooltipLeft: showArgs.tooltipLeft,
      tooltipTop: showArgs.tooltipTop,
      tooltipData: showArgs.tooltipData
    });
  }, [setTooltipState]);
  var hideTooltip = (0, import_react.useCallback)(function() {
    return setTooltipState({
      tooltipOpen: false,
      tooltipLeft: void 0,
      tooltipTop: void 0,
      tooltipData: void 0
    });
  }, [setTooltipState]);
  return {
    tooltipOpen: tooltipState.tooltipOpen,
    tooltipLeft: tooltipState.tooltipLeft,
    tooltipTop: tooltipState.tooltipTop,
    tooltipData: tooltipState.tooltipData,
    updateTooltip: setTooltipState,
    showTooltip,
    hideTooltip
  };
}

// node_modules/@visx/tooltip/esm/enhancers/withTooltip.js
function _extends2() {
  _extends2 = Object.assign ? Object.assign.bind() : function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends2.apply(this, arguments);
}
function withTooltip(BaseComponent, containerProps, renderContainer) {
  if (containerProps === void 0) {
    containerProps = {
      style: {
        position: "relative",
        width: "inherit",
        height: "inherit"
      }
    };
  }
  if (renderContainer === void 0) {
    renderContainer = function renderContainer2(children, props) {
      return import_react2.default.createElement("div", props, children);
    };
  }
  var WrappedComponent = function WrappedComponent2(props) {
    var tooltipProps = useTooltip();
    return renderContainer(import_react2.default.createElement(BaseComponent, _extends2({}, tooltipProps, props)), containerProps);
  };
  return WrappedComponent;
}

// node_modules/@visx/tooltip/esm/hooks/useTooltipInPortal.js
var import_react9 = __toESM(require_react());

// node_modules/react-use-measure/dist/index.js
var import_react3 = __toESM(require_react());
function g(n, t) {
  let o;
  return (...i) => {
    window.clearTimeout(o), o = window.setTimeout(() => n(...i), t);
  };
}
function j({ debounce: n, scroll: t, polyfill: o, offsetSize: i } = { debounce: 0, scroll: false, offsetSize: false }) {
  const a = o || (typeof window == "undefined" ? class {
  } : window.ResizeObserver);
  if (!a) throw new Error("This browser does not support ResizeObserver out of the box. See: https://github.com/react-spring/react-use-measure/#resize-observer-polyfills");
  const [c, h] = (0, import_react3.useState)({ left: 0, top: 0, width: 0, height: 0, bottom: 0, right: 0, x: 0, y: 0 }), e = (0, import_react3.useRef)({ element: null, scrollContainers: null, resizeObserver: null, lastBounds: c, orientationHandler: null }), d = n ? typeof n == "number" ? n : n.scroll : null, f = n ? typeof n == "number" ? n : n.resize : null, w = (0, import_react3.useRef)(false);
  (0, import_react3.useEffect)(() => (w.current = true, () => void (w.current = false)));
  const [z, m, s] = (0, import_react3.useMemo)(() => {
    const r = () => {
      if (!e.current.element) return;
      const { left: y, top: C, width: H, height: O, bottom: S, right: x, x: B, y: R } = e.current.element.getBoundingClientRect(), l = { left: y, top: C, width: H, height: O, bottom: S, right: x, x: B, y: R };
      e.current.element instanceof HTMLElement && i && (l.height = e.current.element.offsetHeight, l.width = e.current.element.offsetWidth), Object.freeze(l), w.current && !D(e.current.lastBounds, l) && h(e.current.lastBounds = l);
    };
    return [r, f ? g(r, f) : r, d ? g(r, d) : r];
  }, [h, i, d, f]);
  function v() {
    e.current.scrollContainers && (e.current.scrollContainers.forEach((r) => r.removeEventListener("scroll", s, true)), e.current.scrollContainers = null), e.current.resizeObserver && (e.current.resizeObserver.disconnect(), e.current.resizeObserver = null), e.current.orientationHandler && ("orientation" in screen && "removeEventListener" in screen.orientation ? screen.orientation.removeEventListener("change", e.current.orientationHandler) : "onorientationchange" in window && window.removeEventListener("orientationchange", e.current.orientationHandler));
  }
  function b() {
    e.current.element && (e.current.resizeObserver = new a(s), e.current.resizeObserver.observe(e.current.element), t && e.current.scrollContainers && e.current.scrollContainers.forEach((r) => r.addEventListener("scroll", s, { capture: true, passive: true })), e.current.orientationHandler = () => {
      s();
    }, "orientation" in screen && "addEventListener" in screen.orientation ? screen.orientation.addEventListener("change", e.current.orientationHandler) : "onorientationchange" in window && window.addEventListener("orientationchange", e.current.orientationHandler));
  }
  const L = (r) => {
    !r || r === e.current.element || (v(), e.current.element = r, e.current.scrollContainers = E(r), b());
  };
  return X(s, !!t), W(m), (0, import_react3.useEffect)(() => {
    v(), b();
  }, [t, s, m]), (0, import_react3.useEffect)(() => v, []), [L, c, z];
}
function W(n) {
  (0, import_react3.useEffect)(() => {
    const t = n;
    return window.addEventListener("resize", t), () => void window.removeEventListener("resize", t);
  }, [n]);
}
function X(n, t) {
  (0, import_react3.useEffect)(() => {
    if (t) {
      const o = n;
      return window.addEventListener("scroll", o, { capture: true, passive: true }), () => void window.removeEventListener("scroll", o, true);
    }
  }, [n, t]);
}
function E(n) {
  const t = [];
  if (!n || n === document.body) return t;
  const { overflow: o, overflowX: i, overflowY: a } = window.getComputedStyle(n);
  return [o, i, a].some((c) => c === "auto" || c === "scroll") && t.push(n), [...t, ...E(n.parentElement)];
}
var k = ["x", "y", "top", "bottom", "left", "right", "width", "height"];
var D = (n, t) => k.every((o) => n[o] === t[o]);

// node_modules/@visx/tooltip/esm/Portal.js
var import_prop_types = __toESM(require_prop_types());
var import_react4 = __toESM(require_react());
var import_react_dom = __toESM(require_react_dom());
function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  _setPrototypeOf(subClass, superClass);
}
function _setPrototypeOf(o, p2) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf3(o2, p3) {
    o2.__proto__ = p3;
    return o2;
  };
  return _setPrototypeOf(o, p2);
}
var Portal = function(_React$PureComponent) {
  _inheritsLoose(Portal2, _React$PureComponent);
  function Portal2() {
    return _React$PureComponent.apply(this, arguments) || this;
  }
  var _proto = Portal2.prototype;
  _proto.componentWillUnmount = function componentWillUnmount() {
    if (this.node && document.body) {
      document.body.removeChild(this.node);
      delete this.node;
    }
  };
  _proto.render = function render() {
    if (!this.node && typeof document !== "undefined") {
      this.node = document.createElement("div");
      if (this.props.zIndex != null) this.node.style.zIndex = "" + this.props.zIndex;
      document.body.append(this.node);
    }
    if (!this.node) {
      return null;
    }
    return import_react_dom.default.createPortal(this.props.children, this.node);
  };
  return Portal2;
}(import_react4.default.PureComponent);
Portal.propTypes = {
  zIndex: import_prop_types.default.oneOfType([import_prop_types.default.number, import_prop_types.default.string])
};

// node_modules/@visx/tooltip/esm/tooltips/Tooltip.js
var import_prop_types2 = __toESM(require_prop_types());
var import_react5 = __toESM(require_react());
var import_classnames = __toESM(require_classnames());
var _excluded2 = ["className", "top", "left", "offsetLeft", "offsetTop", "style", "children", "unstyled", "applyPositionStyle"];
function _extends3() {
  _extends3 = Object.assign ? Object.assign.bind() : function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends3.apply(this, arguments);
}
function _objectWithoutPropertiesLoose2(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }
  return target;
}
var defaultStyles = {
  position: "absolute",
  backgroundColor: "white",
  color: "#666666",
  padding: ".3rem .5rem",
  borderRadius: "3px",
  fontSize: "14px",
  boxShadow: "0 1px 2px rgba(33,33,33,0.2)",
  lineHeight: "1em",
  pointerEvents: "none"
};
var Tooltip = import_react5.default.forwardRef(function(_ref, ref) {
  var className = _ref.className, top = _ref.top, left = _ref.left, _ref$offsetLeft = _ref.offsetLeft, offsetLeft = _ref$offsetLeft === void 0 ? 10 : _ref$offsetLeft, _ref$offsetTop = _ref.offsetTop, offsetTop = _ref$offsetTop === void 0 ? 10 : _ref$offsetTop, _ref$style = _ref.style, style = _ref$style === void 0 ? defaultStyles : _ref$style, children = _ref.children, _ref$unstyled = _ref.unstyled, unstyled = _ref$unstyled === void 0 ? false : _ref$unstyled, _ref$applyPositionSty = _ref.applyPositionStyle, applyPositionStyle = _ref$applyPositionSty === void 0 ? false : _ref$applyPositionSty, restProps = _objectWithoutPropertiesLoose2(_ref, _excluded2);
  return import_react5.default.createElement("div", _extends3({
    ref,
    className: (0, import_classnames.default)("visx-tooltip", className),
    style: _extends3({
      top: top == null || offsetTop == null ? top : top + offsetTop,
      left: left == null || offsetLeft == null ? left : left + offsetLeft
    }, applyPositionStyle && {
      position: "absolute"
    }, !unstyled && style)
  }, restProps), children);
});
Tooltip.propTypes = {
  children: import_prop_types2.default.node,
  className: import_prop_types2.default.string,
  left: import_prop_types2.default.number,
  offsetLeft: import_prop_types2.default.number,
  offsetTop: import_prop_types2.default.number,
  top: import_prop_types2.default.number,
  applyPositionStyle: import_prop_types2.default.bool,
  unstyled: import_prop_types2.default.bool
};
Tooltip.displayName = "Tooltip";
var Tooltip_default = Tooltip;

// node_modules/@visx/tooltip/esm/tooltips/TooltipWithBounds.js
var import_prop_types3 = __toESM(require_prop_types());
var import_react8 = __toESM(require_react());

// node_modules/@visx/bounds/esm/enhancers/withBoundingRects.js
var import_react6 = __toESM(require_react());
var import_react_dom2 = __toESM(require_react_dom());
function _extends4() {
  _extends4 = Object.assign ? Object.assign.bind() : function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends4.apply(this, arguments);
}
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function _inheritsLoose2(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  _setPrototypeOf2(subClass, superClass);
}
function _setPrototypeOf2(o, p2) {
  _setPrototypeOf2 = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf3(o2, p3) {
    o2.__proto__ = p3;
    return o2;
  };
  return _setPrototypeOf2(o, p2);
}
var emptyRect = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  width: 0,
  height: 0
};
function withBoundingRects(BaseComponent) {
  var _class;
  return _class = function(_React$PureComponent) {
    _inheritsLoose2(WrappedComponent, _React$PureComponent);
    function WrappedComponent(props) {
      var _this;
      _this = _React$PureComponent.call(this, props) || this;
      _this.state = {
        rect: void 0,
        parentRect: void 0
      };
      _this.nodeRef = import_react6.default.createRef();
      _this.getRects = _this.getRects.bind(_assertThisInitialized(_this));
      return _this;
    }
    var _proto = WrappedComponent.prototype;
    _proto.componentDidMount = function componentDidMount() {
      var _this$nodeRef, _this2 = this;
      this.node = (_this$nodeRef = this.nodeRef) != null && _this$nodeRef.current ? this.nodeRef.current : import_react_dom2.default.findDOMNode(this);
      this.setState(function() {
        return _this2.getRects();
      });
    };
    _proto.getRects = function getRects() {
      if (!this.node) return this.state;
      var node = this.node;
      var parentNode = node.parentNode;
      var rect = node.getBoundingClientRect ? node.getBoundingClientRect() : emptyRect;
      var parentRect = parentNode != null && parentNode.getBoundingClientRect ? parentNode.getBoundingClientRect() : emptyRect;
      return {
        rect,
        parentRect
      };
    };
    _proto.render = function render() {
      return import_react6.default.createElement(BaseComponent, _extends4({
        nodeRef: this.nodeRef,
        getRects: this.getRects
      }, this.state, this.props));
    };
    return WrappedComponent;
  }(import_react6.default.PureComponent), _class.displayName = "withBoundingRects(" + (BaseComponent.displayName || "") + ")", _class;
}

// node_modules/@visx/tooltip/esm/context/TooltipPositionContext.js
var import_react7 = __toESM(require_react());
var TooltipPositionContext = (0, import_react7.createContext)({
  isFlippedVertically: false,
  isFlippedHorizontally: false
});
var TooltipPositionProvider = TooltipPositionContext.Provider;
var TooltipPositionConsumer = TooltipPositionContext.Consumer;
var useTooltipPosition = function useTooltipPosition2() {
  return (0, import_react7.useContext)(TooltipPositionContext);
};

// node_modules/@visx/tooltip/esm/tooltips/TooltipWithBounds.js
var _excluded3 = ["children", "getRects", "left", "offsetLeft", "offsetTop", "parentRect", "rect", "style", "top", "unstyled", "nodeRef"];
function _extends5() {
  _extends5 = Object.assign ? Object.assign.bind() : function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends5.apply(this, arguments);
}
function _objectWithoutPropertiesLoose3(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }
  return target;
}
function TooltipWithBounds(_ref) {
  var children = _ref.children, getRects = _ref.getRects, _ref$left = _ref.left, initialLeft = _ref$left === void 0 ? 0 : _ref$left, _ref$offsetLeft = _ref.offsetLeft, offsetLeft = _ref$offsetLeft === void 0 ? 10 : _ref$offsetLeft, _ref$offsetTop = _ref.offsetTop, offsetTop = _ref$offsetTop === void 0 ? 10 : _ref$offsetTop, parentBounds = _ref.parentRect, ownBounds = _ref.rect, _ref$style = _ref.style, style = _ref$style === void 0 ? defaultStyles : _ref$style, _ref$top = _ref.top, initialTop = _ref$top === void 0 ? 0 : _ref$top, _ref$unstyled = _ref.unstyled, unstyled = _ref$unstyled === void 0 ? false : _ref$unstyled, nodeRef = _ref.nodeRef, otherProps = _objectWithoutPropertiesLoose3(_ref, _excluded3);
  var transform;
  var placeTooltipLeft = false;
  var placeTooltipUp = false;
  if (ownBounds && parentBounds) {
    var left = initialLeft;
    var top = initialTop;
    if (parentBounds.width) {
      var rightPlacementClippedPx = left + offsetLeft + ownBounds.width - parentBounds.width;
      var leftPlacementClippedPx = ownBounds.width - left - offsetLeft;
      placeTooltipLeft = rightPlacementClippedPx > 0 && rightPlacementClippedPx > leftPlacementClippedPx;
    } else {
      var _rightPlacementClippedPx = left + offsetLeft + ownBounds.width - window.innerWidth;
      var _leftPlacementClippedPx = ownBounds.width - left - offsetLeft;
      placeTooltipLeft = _rightPlacementClippedPx > 0 && _rightPlacementClippedPx > _leftPlacementClippedPx;
    }
    if (parentBounds.height) {
      var bottomPlacementClippedPx = top + offsetTop + ownBounds.height - parentBounds.height;
      var topPlacementClippedPx = ownBounds.height - top - offsetTop;
      placeTooltipUp = bottomPlacementClippedPx > 0 && bottomPlacementClippedPx > topPlacementClippedPx;
    } else {
      placeTooltipUp = top + offsetTop + ownBounds.height > window.innerHeight;
    }
    left = placeTooltipLeft ? left - ownBounds.width - offsetLeft : left + offsetLeft;
    top = placeTooltipUp ? top - ownBounds.height - offsetTop : top + offsetTop;
    left = Math.round(left);
    top = Math.round(top);
    transform = "translate(" + left + "px, " + top + "px)";
  }
  return import_react8.default.createElement(Tooltip_default, _extends5({
    ref: nodeRef,
    style: _extends5({
      left: 0,
      top: 0,
      transform
    }, !unstyled && style)
  }, otherProps), import_react8.default.createElement(TooltipPositionProvider, {
    value: {
      isFlippedVertically: !placeTooltipUp,
      isFlippedHorizontally: !placeTooltipLeft
    }
  }, children));
}
TooltipWithBounds.propTypes = {
  nodeRef: import_prop_types3.default.oneOfType([import_prop_types3.default.string, import_prop_types3.default.func, import_prop_types3.default.object])
};
var TooltipWithBounds_default = withBoundingRects(TooltipWithBounds);

// node_modules/@visx/tooltip/esm/hooks/useTooltipInPortal.js
var _excluded4 = ["detectBounds", "zIndex"];
var _excluded22 = ["left", "top", "detectBounds", "zIndex"];
function _extends6() {
  _extends6 = Object.assign ? Object.assign.bind() : function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends6.apply(this, arguments);
}
function _objectWithoutPropertiesLoose4(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }
  return target;
}
function useTooltipInPortal(_temp) {
  var _ref = _temp === void 0 ? {} : _temp, _ref$detectBounds = _ref.detectBounds, detectBoundsOption = _ref$detectBounds === void 0 ? true : _ref$detectBounds, zIndexOption = _ref.zIndex, useMeasureOptions = _objectWithoutPropertiesLoose4(_ref, _excluded4);
  var _useMeasure = j(useMeasureOptions), containerRef = _useMeasure[0], containerBounds = _useMeasure[1], forceRefreshBounds = _useMeasure[2];
  var _useState = (0, import_react9.useState)(false), isSsr = _useState[0], setIsSsr = _useState[1];
  (0, import_react9.useEffect)(function() {
    setIsSsr(false);
  }, []);
  var TooltipInPortal = (0, import_react9.useMemo)(function() {
    return function(_ref2) {
      var _ref2$left = _ref2.left, containerLeft = _ref2$left === void 0 ? 0 : _ref2$left, _ref2$top = _ref2.top, containerTop = _ref2$top === void 0 ? 0 : _ref2$top, detectBoundsProp = _ref2.detectBounds, zIndexProp = _ref2.zIndex, tooltipProps = _objectWithoutPropertiesLoose4(_ref2, _excluded22);
      var detectBounds = detectBoundsProp == null ? detectBoundsOption : detectBoundsProp;
      var zIndex = zIndexProp == null ? zIndexOption : zIndexProp;
      var TooltipComponent = detectBounds ? TooltipWithBounds_default : Tooltip_default;
      var scrollX = isSsr ? 0 : window.scrollX;
      var scrollY = isSsr ? 0 : window.scrollY;
      var portalLeft = containerLeft + (containerBounds.left || 0) + scrollX;
      var portalTop = containerTop + (containerBounds.top || 0) + scrollY;
      return import_react9.default.createElement(Portal, {
        zIndex
      }, import_react9.default.createElement(TooltipComponent, _extends6({
        left: portalLeft,
        top: portalTop
      }, tooltipProps)));
    };
  }, [detectBoundsOption, zIndexOption, containerBounds.left, containerBounds.top, isSsr]);
  return {
    containerRef,
    containerBounds,
    forceRefreshBounds,
    TooltipInPortal
  };
}

export {
  j,
  useTooltip,
  withTooltip,
  Portal,
  defaultStyles,
  Tooltip_default,
  TooltipPositionConsumer,
  useTooltipPosition,
  TooltipWithBounds_default,
  useTooltipInPortal
};
//# sourceMappingURL=chunk-Z6ATNOP6.js.map
