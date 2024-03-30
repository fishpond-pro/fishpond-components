import React from "react";
import { createRSRenderer } from "@polymita/renderer";
import { h, useLogic, createFunctionComponent } from "@polymita/renderer";
import * as MessageModule from "./Message";
import { format } from "date-fns";
var ComponentModule;
((ComponentModule2) => {
  ComponentModule2.name = "MessageDirection";
  const getFormat = (showYear) => showYear ? "yyyy-MM-dd hh:mm:ss" : "MM-dd hh:mm:ss";
  ComponentModule2.propTypes = {};
  ComponentModule2.logic = (props) => {
    return {};
  };
  const Message = createFunctionComponent(MessageModule);
  ComponentModule2.layout = (props) => {
    const dateStr = format(new Date(props.createdAt), getFormat(props.showYear));
    return h(
      "messageDirectionContainer",
      {},
      h(Message, { ...props }),
      props.direction === "left" ? h(
        "direction-line",
        { class: "block relative border-slate-100 h-[30px] border-l-[2px] border-b-[2px]", style: { marginLeft: "50%" } },
        h(
          "created-time",
          { class: "bg-white block border-slate-100 absolute text-xs top-full left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-slate-200" },
          dateStr
        )
      ) : null,
      props.direction === "right" ? h(
        "direction-line",
        { class: "block relative border-slate-100 h-[30px] border-r-[2px] border-b-[2px]", style: { marginRight: "50%" } },
        h(
          "created-time",
          { class: "bg-white block border-slate-100 absolute text-xs top-full left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-slate-200" },
          dateStr
        )
      ) : null
    );
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
const MessageDirection = (props) => {
  return React.createElement(Component, props);
};
const name = ComponentModule.name;
const meta = ComponentModule.meta;
const logic = ComponentModule.logic;
const layout = ComponentModule.layout;
const styleRules = ComponentModule.styleRules;
const designPattern = ComponentModule.designPattern;
var MessageDirection_default = MessageDirection;
export {
  MessageDirection_default as default,
  designPattern,
  layout,
  logic,
  meta,
  name,
  styleRules
};
