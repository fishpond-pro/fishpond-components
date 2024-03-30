import React from "react";
import { createRSRenderer } from "@polymita/renderer";
import { h, useLogic, createFunctionComponent, classnames } from "@polymita/renderer";
import * as MessageModule from "./Message";
import { MessageState } from "@/types/types";
var ComponentModule;
((ComponentModule2) => {
  ComponentModule2.name = "SingleTimeline";
  ComponentModule2.propTypes = {};
  ComponentModule2.logic = (props) => {
    return {};
  };
  const Message = createFunctionComponent(MessageModule);
  ComponentModule2.layout = (props) => {
    const { selected } = props;
    const logic3 = useLogic();
    const messagesData = props.messages();
    return /* @__PURE__ */ h("singleTimeline", null, messagesData.map((message, index) => {
      const current = message.id === selected;
      const cls = classnames("block p-2 mb-1 box-border rounded-md overflow-hidden cursor-default hover:bg-slate-50", {
        "bg-slate-50": current
      });
      return /* @__PURE__ */ h("singleTimelineItem", { className: cls }, /* @__PURE__ */ h(
        Message,
        {
          onClick: () => props.onClick(message, index),
          key: message.title + index,
          title: message.title,
          description: message.description,
          createdAt: message.createdAt,
          footer: "",
          border: false,
          secondary: message.state === MessageState.Read
        }
      ));
    }));
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
const SingleTimeline = (props) => {
  return React.createElement(Component, props);
};
const name = ComponentModule.name;
const meta = ComponentModule.meta;
const logic = ComponentModule.logic;
const layout = ComponentModule.layout;
const styleRules = ComponentModule.styleRules;
const designPattern = ComponentModule.designPattern;
var SingleTimeline_default = SingleTimeline;
export {
  SingleTimeline_default as default,
  designPattern,
  layout,
  logic,
  meta,
  name,
  styleRules
};
