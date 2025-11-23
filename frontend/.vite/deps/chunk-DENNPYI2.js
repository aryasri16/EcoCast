import {
  require_classnames
} from "./chunk-PU5AC3CG.js";
import {
  require_prop_types
} from "./chunk-JL2MEAST.js";
import {
  require_react
} from "./chunk-W4EHDCLL.js";
import {
  __esm,
  __export,
  __toESM
} from "./chunk-EWTE5DHJ.js";

// node_modules/@visx/group/esm/Group.js
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
function Group(_ref) {
  var _ref$top = _ref.top, top = _ref$top === void 0 ? 0 : _ref$top, _ref$left = _ref.left, left = _ref$left === void 0 ? 0 : _ref$left, transform = _ref.transform, className = _ref.className, children = _ref.children, innerRef = _ref.innerRef, restProps = _objectWithoutPropertiesLoose(_ref, _excluded);
  return import_react.default.createElement("g", _extends({
    ref: innerRef,
    className: (0, import_classnames.default)("visx-group", className),
    transform: transform || "translate(" + left + ", " + top + ")"
  }, restProps), children);
}
var import_prop_types, import_react, import_classnames, _excluded;
var init_Group = __esm({
  "node_modules/@visx/group/esm/Group.js"() {
    import_prop_types = __toESM(require_prop_types());
    import_react = __toESM(require_react());
    import_classnames = __toESM(require_classnames());
    _excluded = ["top", "left", "transform", "className", "children", "innerRef"];
    Group.propTypes = {
      top: import_prop_types.default.number,
      left: import_prop_types.default.number,
      transform: import_prop_types.default.string,
      className: import_prop_types.default.string,
      children: import_prop_types.default.node,
      innerRef: import_prop_types.default.oneOfType([import_prop_types.default.string, import_prop_types.default.func, import_prop_types.default.object])
    };
  }
});

// node_modules/@visx/group/esm/index.js
var esm_exports = {};
__export(esm_exports, {
  Group: () => Group
});
var init_esm = __esm({
  "node_modules/@visx/group/esm/index.js"() {
    init_Group();
  }
});

export {
  Group,
  esm_exports,
  init_esm
};
//# sourceMappingURL=chunk-DENNPYI2.js.map
