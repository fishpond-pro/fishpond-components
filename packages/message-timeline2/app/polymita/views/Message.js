import React from "react";
import { createRSRenderer } from "@polymita/renderer";
import { h, useLogic, classNames } from "@polymita/renderer";
var ComponentModule;
((ComponentModule2) => {
  ComponentModule2.name = "Message";
  ComponentModule2.propTypes = {};
  ComponentModule2.logic = (props) => {
    return {};
  };
  ComponentModule2.layout = (props) => {
    const logic3 = useLogic();
    const cls1 = classNames(`block text-base rounded-md overflow-hidden cursor-default`, props.className, {
      border: props.border,
      "opacity-70": props.secondary
    });
    const cls2 = classNames("text-sm text-slate-500 block p-2 text-xs", {
      "border-t": props.border
    });
    return /* @__PURE__ */ h("messageContainer", { onClick: props.onClick, className: cls1 }, /* @__PURE__ */ h("messageTitle", { className: "text-slate-800 block p-2 text-base" }, props.title), /* @__PURE__ */ h("messageDescription", { className: "text-slate-400 block px-2 truncate" }, props.description), /* @__PURE__ */ h("messageFooter", { if: !!props.footer, className: cls2 }, props.footer));
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
const Message = (props) => {
  return React.createElement(Component, props);
};
const name = ComponentModule.name;
const meta = ComponentModule.meta;
const logic = ComponentModule.logic;
const layout = ComponentModule.layout;
const styleRules = ComponentModule.styleRules;
const designPattern = ComponentModule.designPattern;
var Message_default = Message;
export {
  Message_default as default,
  designPattern,
  layout,
  logic,
  meta,
  name,
  styleRules
};
