import React from "react";
import { createRSRenderer } from "@polymita/renderer";
import { h, useLogic } from "@polymita/renderer";
import ReloadIcon from "@polymita/ui/icons/reload";
var ComponentModule;
((ComponentModule2) => {
  ComponentModule2.name = "SourceEntry";
  ComponentModule2.propTypes = {};
  ComponentModule2.logic = (props) => {
    return {};
  };
  ComponentModule2.layout = (props) => {
    const logic3 = useLogic();
    return /* @__PURE__ */ h("sourceEntryContainer", { className: "flex" }, /* @__PURE__ */ h("sourceEntryTitle", { className: "flex-1", onClick: props.onClick }, "\u8BA2\u9605\u6E90"), /* @__PURE__ */ h("refreshButton", { onClick: props.onClickRefresh, className: "cursor-pointer" }, /* @__PURE__ */ h(ReloadIcon, null)));
  };
  ComponentModule2.styleRules = (props, layout3) => {
    return [];
  };
  ComponentModule2.designPattern = (props, layout3) => {
    const logic3 = useLogic();
    return {};
  };
})(ComponentModule || (ComponentModule = {}));
function RenderToReact(module) {
  const renderer = createRSRenderer(module, {
    framework: {
      name: "react",
      lib: React
    }
  });
  return (p) => {
    const r = renderer.construct(p);
    return renderer.render();
  };
}
const Component = RenderToReact(ComponentModule);
const SourceEntry = (props) => {
  return React.createElement(Component, props);
};
const name = ComponentModule.name;
const meta = ComponentModule.meta;
const logic = ComponentModule.logic;
const layout = ComponentModule.layout;
const styleRules = ComponentModule.styleRules;
const designPattern = ComponentModule.designPattern;
var SourceEntry_default = SourceEntry;
export {
  SourceEntry_default as default,
  designPattern,
  layout,
  logic,
  meta,
  name,
  styleRules
};
