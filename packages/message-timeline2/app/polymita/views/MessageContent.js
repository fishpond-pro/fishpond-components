import React from "react";
import { createRSRenderer } from "@polymita/renderer";
import { createFunctionComponent, h, useLogic } from "@polymita/renderer";
import { signal } from "@polymita/signal";
import * as DrawerModule from "@polymita/ui/components/drawer";
var ComponentModule;
((ComponentModule2) => {
  ComponentModule2.name = "MessageContent";
  ComponentModule2.propTypes = {};
  ComponentModule2.logic = (props) => {
    const showIframe = signal(false);
    return {
      showIframe
    };
  };
  const Drawer = createFunctionComponent(DrawerModule);
  ComponentModule2.layout = (props) => {
    const { mode } = props;
    const logic3 = useLogic();
    return /* @__PURE__ */ h("modulesContainer", { className: "block h-full" }, /* @__PURE__ */ h("messageContent", { className: "h-full message-content p-10 py-4 flex flex-col" }, /* @__PURE__ */ h("messageContentHeader", { className: "flex items-center justify-between mb-6" }, /* @__PURE__ */ h("messageContentTitle", { className: "text-2xl font-bold" }, props.title)), /* @__PURE__ */ h("messageContentBody", { className: "flex flex-col flex-1" }, /* @__PURE__ */ h("messageContentContentFrame", { if: !props.content, className: "flex text-base leading-8 text-gray-600 flex-1" }, /* @__PURE__ */ h("webview", { id: props.contentLink, src: props.contentLink, className: "w-full flex-1" })))));
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
const MessageContent = (props) => {
  return React.createElement(Component, props);
};
const name = ComponentModule.name;
const meta = ComponentModule.meta;
const logic = ComponentModule.logic;
const layout = ComponentModule.layout;
const styleRules = ComponentModule.styleRules;
const designPattern = ComponentModule.designPattern;
var MessageContent_default = MessageContent;
export {
  MessageContent_default as default,
  designPattern,
  layout,
  logic,
  meta,
  name,
  styleRules
};
