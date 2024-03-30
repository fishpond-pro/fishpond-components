import React from "react";
import { createRSRenderer } from "@polymita/renderer";
import { h, useLogic, createFunctionComponent } from "@polymita/renderer";
import * as MessageDirectionModule from "./MessageDirection";
var ComponentModule;
((ComponentModule2) => {
  ComponentModule2.name = "Timeline";
  ComponentModule2.propTypes = {};
  ComponentModule2.logic = (props) => {
    return {};
  };
  function split(messages) {
    const left = [];
    const right = [];
    messages.forEach((message, index) => {
      if (index % 2 === 0) {
        left.push(message);
      } else {
        right.push(message);
      }
    });
    return [left, right];
  }
  const MessageDirection = createFunctionComponent(MessageDirectionModule, {
    patchRules(props, draft) {
      return [
        {
          target: draft.messageDirectionContainer,
          style: {
            display: "block",
            margin: "10px"
          }
        }
      ];
    }
  });
  ComponentModule2.layout = (props) => {
    const logic3 = useLogic();
    const messagesData = props.messages();
    const [left, right] = split(messagesData);
    return /* @__PURE__ */ h("timelineContainer", { className: "p-2 flex relative" }, /* @__PURE__ */ h("leftLine", { className: "flex-1 min-w-0" }, left.map((message) => {
      return /* @__PURE__ */ h(
        MessageDirection,
        {
          key: message.id,
          title: message.title,
          description: message.description,
          footer: message.channelRecord?.platform,
          createdAt: message.createdAt,
          direction: "left"
        }
      );
    })), /* @__PURE__ */ h("centerLine", { className: "w-[2px] bg-gray-200 absolute top-2 bottom-2 left-1/2 -translate-x-1/2" }), /* @__PURE__ */ h("rightLine", { className: "flex-1 min-w-0" }, right.map((message) => {
      return /* @__PURE__ */ h(
        MessageDirection,
        {
          key: message.id,
          title: message.title,
          description: message.description,
          footer: message.channelRecord?.platform,
          createdAt: message.createdAt,
          direction: "right"
        }
      );
    })));
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
const Timeline = (props) => {
  return React.createElement(Component, props);
};
const name = ComponentModule.name;
const meta = ComponentModule.meta;
const logic = ComponentModule.logic;
const layout = ComponentModule.layout;
const styleRules = ComponentModule.styleRules;
const designPattern = ComponentModule.designPattern;
var Timeline_default = Timeline;
export {
  Timeline_default as default,
  designPattern,
  layout,
  logic,
  meta,
  name,
  styleRules
};
