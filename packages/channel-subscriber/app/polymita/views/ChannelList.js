import React from "react";
import { createRSRenderer } from "@polymita/renderer";
import { h, useLogic, createFunctionComponent, classNames } from "@polymita/renderer";
import { signal } from "@polymita/signal-model";
import * as AddSourceModule from "./AddSource";
import * as ListModule from "@polymita/ui/components/list";
var ComponentModule;
((ComponentModule2) => {
  ComponentModule2.name = "ChannelList";
  ComponentModule2.propTypes = {};
  ComponentModule2.logic = (props) => {
    const sourceModalVisible = signal(false);
    return {
      sourceModalVisible
    };
  };
  const AddSourceCpt = createFunctionComponent(AddSourceModule);
  const ListCpt = createFunctionComponent(ListModule);
  ComponentModule2.layout = (props) => {
    const {
      sourceModalVisible
    } = useLogic();
    const { selected } = props;
    return /* @__PURE__ */ h("channelListContainer", { className: "block" }, /* @__PURE__ */ h("listHeader", { className: "flex items-center" }, /* @__PURE__ */ h("listTitle", { className: "flex-1 text-lg" }, props.title)), /* @__PURE__ */ h("listContent", { className: "block pl-2" }, /* @__PURE__ */ h(ListCpt, { border: false, list: props.list, render: (item, i) => {
      const name3 = item.channel;
      const cls = classNames(
        `block cursor-pointer truncate text-base p-2 rounded hover:bg-slate-50`
      );
      return /* @__PURE__ */ h("listSourceContent", null, /* @__PURE__ */ h(
        "listSourceChannel",
        {
          className: cls,
          onClick: () => {
            props.onClick?.(item, i);
          }
        },
        `${name3}`
      ), /* @__PURE__ */ h(
        ListCpt,
        {
          border: false,
          list: item.rss,
          render: (rssItem, i2) => {
            const cls2 = classNames(
              `block truncate cursor-pointer text-sm py-2 pl-4 rounded hover:bg-slate-50`,
              {
                "bg-slate-50": rssItem.id === selected
              }
            );
            return /* @__PURE__ */ h(
              "listSourceRss",
              {
                className: cls2,
                onClick: () => {
                  props.onClick?.(rssItem, i2);
                }
              },
              `${rssItem.name}`
            );
          }
        }
      ));
    } })), /* @__PURE__ */ h(AddSourceCpt, { visible: sourceModalVisible, onSubmit: props.onSubmit }));
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
const ChannelList = (props) => {
  return React.createElement(Component, props);
};
const name = ComponentModule.name;
const meta = ComponentModule.meta;
const logic = ComponentModule.logic;
const layout = ComponentModule.layout;
const styleRules = ComponentModule.styleRules;
const designPattern = ComponentModule.designPattern;
var ChannelList_default = ChannelList;
export {
  ChannelList_default as default,
  designPattern,
  layout,
  logic,
  meta,
  name,
  styleRules
};
