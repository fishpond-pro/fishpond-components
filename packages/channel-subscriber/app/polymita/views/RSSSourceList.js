import React from "react";
import { createRSRenderer } from "@polymita/renderer";
import { h, useLogic, createFunctionComponent, classnames } from "@polymita/renderer";
import * as RSSSourcePanelModule from "./RSSSourcePanel";
import * as DrawerModule from "@polymita/ui/components/drawer";
import * as InputModule from "@polymita/ui/components/input";
import * as ButtonModule from "@polymita/ui/components/button";
import * as RSSPanelsTableModule from "./RSSParamsTable";
import { getParamsFromPath } from "@/utils/index";
import { genUniquePlatformKey } from "@/shared/utils";
var ComponentModule;
((ComponentModule2) => {
  ComponentModule2.name = "SourceList";
  ComponentModule2.propTypes = {};
  const RSSSourcePanel = createFunctionComponent(RSSSourcePanelModule);
  const Drawer = createFunctionComponent(DrawerModule);
  const Input = createFunctionComponent(InputModule);
  const Button = createFunctionComponent(ButtonModule);
  const RSSTable = createFunctionComponent(RSSPanelsTableModule);
  ComponentModule2.logic = (props) => {
    return {};
  };
  const COLUMN_WIDTH_COUNT = 4;
  const COLUMN_PADDING = 20;
  ComponentModule2.layout = (props) => {
    const logic3 = useLogic();
    const columnWidth = (props.width - COLUMN_PADDING * 2 - 20) / COLUMN_WIDTH_COUNT;
    const {
      menus
    } = props;
    const currentSource = props.currentSource();
    const params = currentSource && getParamsFromPath(currentSource.route.path, currentSource.route.paramsdesc);
    const selectedGroups = menus.selectedGroups();
    const selectedSubGroups = menus.selectedSubGroups();
    const allMenus = menus.allMenus();
    const rssSources = props.allRSSSources();
    const subscribed = props.subscribed();
    console.log("menus.groupRows()::", menus.groupRows());
    return /* @__PURE__ */ h("sourceListContainer", { className: "block" }, /* @__PURE__ */ h("sourceListMenus", { className: "block" }, /* @__PURE__ */ h("sourceMenuGroup", { className: "w-full flex mb-2 flex-wrap" }, /* @__PURE__ */ h("sourceMenuGroupPre", { className: "block w-[80px] text-right mr-2" }, "\u5206\u7C7B:"), /* @__PURE__ */ h("sourceMenuGroupItems", { className: "flex-1" }, allMenus.map((menu) => {
      const cls = classnames(
        "inline-block cursor-pointer mr-1 rounded-md border mb-1",
        {
          "border-transparent": !selectedGroups.includes(menu.title),
          "border-slate-500": selectedGroups.includes(menu.title)
        }
      );
      return /* @__PURE__ */ h("sourceMenuGroupItem", { key: menu.title, className: cls, onClick: () => {
        menus.selectGroup(menu.title);
      } }, /* @__PURE__ */ h("sourceMenuGroupItemTitle", { className: "text-gray-500 p-2" }, menu.title));
    }))), /* @__PURE__ */ h("sourceMenuSubGroup", { className: "block" }, menus.groupRows().map((row) => {
      return /* @__PURE__ */ h("sourceGroupRow", { key: row.title, className: "flex mb-2" }, /* @__PURE__ */ h("sourceMenuSubGroupPre", { className: "block w-[80px] text-right mr-2" }, row.title, ":"), /* @__PURE__ */ h("sourceMenuSubGroupItems", { className: "flex-1" }, row.children.map((subGroup) => {
        const isSelected = selectedSubGroups.some(([g, g2]) => g === row.title && g2 === subGroup);
        const cls = classnames(
          "inline-block cursor-pointer mr-1 rounded-md border mb-1",
          {
            "border-transparent hover:border-slate-300": !isSelected,
            "border-slate-500": isSelected
          }
        );
        return /* @__PURE__ */ h(
          "sourceMenuSubGroupItem",
          {
            key: `${row.title}-${subGroup}`,
            className: cls,
            onClick: () => {
              menus.selectSubGroup(row.title, subGroup);
            }
          },
          /* @__PURE__ */ h("sourceMenuSubGroupItemTitle", { className: "text-gray-500 p-2" }, subGroup)
        );
      })));
    }))), /* @__PURE__ */ h("div", { style: {
      columnCount: COLUMN_WIDTH_COUNT,
      columnFill: "balance",
      padding: `0 ${COLUMN_PADDING}px`
    } }, rssSources?.map((source) => {
      const key = genUniquePlatformKey(source);
      const subscribedChannel = subscribed.find((sub) => {
        return sub.channel === key;
      });
      const count = subscribedChannel?.rss?.length || 0;
      return /* @__PURE__ */ h(
        RSSSourcePanel,
        {
          width: columnWidth,
          key: key + source.title,
          value: source,
          count,
          onClick: () => {
            props.selectCurrentSource(source);
          }
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
const RSSSourceList = (props) => {
  return React.createElement(Component, props);
};
const name = ComponentModule.name;
const meta = ComponentModule.meta;
const logic = ComponentModule.logic;
const layout = ComponentModule.layout;
const styleRules = ComponentModule.styleRules;
const designPattern = ComponentModule.designPattern;
var RSSSourceList_default = RSSSourceList;
export {
  RSSSourceList_default as default,
  designPattern,
  layout,
  logic,
  meta,
  name,
  styleRules
};
