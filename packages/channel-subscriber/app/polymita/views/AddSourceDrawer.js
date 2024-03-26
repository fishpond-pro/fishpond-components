import React from "react";
import { createRSRenderer } from "@polymita/renderer";
import { h, useLogic, createFunctionComponent } from "@polymita/renderer";
import { signal } from "@polymita/signal";
import showdown from "showdown";
import * as DrawerModule from "@polymita/ui/components/drawer";
import * as InputModule from "@polymita/ui/components/input";
import * as ButtonModule from "@polymita/ui/components/button";
import * as TabsModule from "@polymita/ui/components/tabs";
import * as ListModule from "@polymita/ui/components/list";
import * as RSSPanelsTableModule from "./RSSParamsTable";
import { getParamsFromPath } from "@/utils/index";
import { extractParams } from "@/shared/utils";
var ComponentModule;
((ComponentModule2) => {
  ComponentModule2.name = "AddSourceDrawer";
  ComponentModule2.propTypes = {};
  ComponentModule2.logic = (props) => {
    const showForm = signal([]);
    return {
      showForm
    };
  };
  const Drawer = createFunctionComponent(DrawerModule);
  const Input = createFunctionComponent(InputModule);
  const Button = createFunctionComponent(ButtonModule);
  const RSSTable = createFunctionComponent(RSSPanelsTableModule);
  const Tabs = createFunctionComponent(TabsModule);
  const TabsPanel = createFunctionComponent(TabsModule.panelModule);
  const List = createFunctionComponent(ListModule);
  ComponentModule2.layout = (props) => {
    const logic3 = useLogic();
    const currentSource = props.currentSource();
    const params = currentSource && getParamsFromPath(currentSource.route.path, currentSource.route.paramsdesc);
    return /* @__PURE__ */ h(
      Drawer,
      {
        closable: true,
        width: 1e3,
        onClose: () => props.selectCurrentSource(null),
        title: `${currentSource.group}/${currentSource.subGroup}/${currentSource.title}`,
        extra: [
          /* @__PURE__ */ h(
            Button,
            {
              key: "submit",
              disabled: props.showSubmitConfirm().visible,
              onClick: () => props.submit()
            },
            "submit"
          )
        ]
      },
      /* @__PURE__ */ h(Tabs, null, /* @__PURE__ */ h(TabsPanel, { header: "new" }, /* @__PURE__ */ h("sourceParamsTop", { className: "flex flex-col mg-2 h-full" }, /* @__PURE__ */ h(
        "submitConfirmMessage",
        {
          if: props.showSubmitConfirm().visible,
          className: "flex my-4 p-2 border border-yellow-600 justify-between items-center text-yellow-600"
        },
        /* @__PURE__ */ h("span", null, props.showSubmitConfirm().title),
        /* @__PURE__ */ h(Button, { onClick: () => props.showSubmitConfirm(), type: "primary" }, "Sure")
      ), /* @__PURE__ */ h("rowParams", { className: "flex flex-row h-full relative" }, /* @__PURE__ */ h("leftParams", { className: "flex-1 min-w-0" }, /* @__PURE__ */ h("sourceExtraParamBox", { className: "block p-2 border my-2" }, /* @__PURE__ */ h("h3", { className: "mt-2" }, "\u53C2\u6570\u8868\u5355"), /* @__PURE__ */ h("sourcePreviewForm", { className: "block border-slate-100 mt-2 pd-2" }, Object.keys(props.sourcePreviewForm().payload).map((key) => /* @__PURE__ */ h("sourcePreviewFormItem", { className: "block mb-2", key }, /* @__PURE__ */ h(
        Input,
        {
          placeholder: key,
          value: props.sourcePreviewForm,
          "value-path": ["payload", key]
        }
      ))), /* @__PURE__ */ h("fullContentPathLabel", { className: "block mt-4" }, "\u6307\u5B9A\u5168\u6587\u5185\u5BB9\u7684\u8DEF\u5F84"), /* @__PURE__ */ h("div", { className: "mt-2" }, /* @__PURE__ */ h(
        Input,
        {
          placeholder: "full content path",
          value: props.sourcePreviewForm,
          "value-path": ["fullContentPath"]
        }
      ))), /* @__PURE__ */ h("sourceParamBoxError", { className: "block mt-2 text-red-500" }), /* @__PURE__ */ h("sourceParamBoxFooter", { className: "flex justify-end mt-2" }, /* @__PURE__ */ h("div", { className: "mr-2" }, /* @__PURE__ */ h(Button, { key: "preview", onClick: () => props.resetSourcePreviewForm() }, "rest")), /* @__PURE__ */ h(Button, { key: "preview", onClick: () => props.queryPreview() }, "preview"))), /* @__PURE__ */ h("sourceItemRoute", { className: "block break-all" }, /* @__PURE__ */ h("span", { className: "mr-1 text-gray-500" }, "\u8DEF\u5F84:"), "/", currentSource.route.path), /* @__PURE__ */ h("sourceItemRoute", { if: !!params.length, className: "block break-all" }, /* @__PURE__ */ h("span", { className: "mr-1 text-gray-500" }, "\u53C2\u6570:")), /* @__PURE__ */ h("sourceItemRouteParams", { if: !!params.length, className: "block" }, params.map((p) => /* @__PURE__ */ h("sourceItemRouteParam", { className: "flex items-center" }, /* @__PURE__ */ h("span", { className: "ml-2 inline-block bg-black rounded-full w-[6px] h-[6px]" }), /* @__PURE__ */ h("span", { className: "ml-2 px-[4px] py-[2px] bg-slate-100 text-gray-600" }, p.name), ",", p.optional ? "\u53EF\u9009" : "\u5FC5\u9009", ",", p.desc))), [].concat(currentSource.tables).filter(Boolean).map((table, index) => {
        return /* @__PURE__ */ h("div", { key: table, className: "mt-3" }, /* @__PURE__ */ h(RSSTable, { tables: table }));
      }), /* @__PURE__ */ h("sourceItemParamTips", { className: "block mt-2 p-4 bg-slate-200" }, currentSource.tipsMarkDown.map((tip) => {
        const converter = new showdown.Converter();
        const html = converter.makeHtml(tip);
        return /* @__PURE__ */ h("div", { className: "break-all mb-2", _html: html });
      }))), /* @__PURE__ */ h("arrowSymbol", { className: "flex mx-4 items-center justify-center" }, ">"), /* @__PURE__ */ h("rightPreviewContainer", { className: "flex-1 relative border border-slate-500 p-2 min-w-0 overflow-auto" }, props.previewMessages()?.length === 0 ? /* @__PURE__ */ h("span", { className: "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" }, "\u6682\u65E0") : "", props.previewMessages()?.map((m, index) => {
        return /* @__PURE__ */ h("pre", { key: m.title + index, className: "p-4 border my-2" }, JSON.stringify(m, null, 2));
      }))))), /* @__PURE__ */ h(TabsPanel, { header: "subscribed" }, props.subscribed()?.[0]?.rss.map((rssItem, index) => {
        const isShowForm = logic3.showForm().includes(rssItem.id);
        const params2 = extractParams(currentSource.route.path, rssItem.href);
        const displayForm = {
          ...rssItem.payload,
          ...params2
        };
        return /* @__PURE__ */ h("rssListItem", { className: "block" }, /* @__PURE__ */ h("rssItem", { className: "w-full p-2 flex items-center" }, /* @__PURE__ */ h("rssItemName", { className: "flex-1" }, rssItem.name, /* @__PURE__ */ h("a", { href: rssItem.href, className: "ml-2", target: "_blank" }, rssItem.href)), /* @__PURE__ */ h("rssItemLink", { className: "ml-2" }, /* @__PURE__ */ h("rssItemForm", { className: "mr-2", onClick: () => {
          logic3.showForm((draft) => {
            if (draft.includes(rssItem.id)) {
              return draft.filter((id) => id !== rssItem.id);
            } else {
              draft.push(rssItem.id);
            }
          });
        } }, "Parameters"))), /* @__PURE__ */ h("rssItemFormContent", { className: "block p-4", if: isShowForm }, /* @__PURE__ */ h("pre", null, JSON.stringify(displayForm, null, 2))));
      })))
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
const AddSourceDrawer = (props) => {
  return React.createElement(Component, props);
};
const name = ComponentModule.name;
const meta = ComponentModule.meta;
const logic = ComponentModule.logic;
const layout = ComponentModule.layout;
const styleRules = ComponentModule.styleRules;
const designPattern = ComponentModule.designPattern;
var AddSourceDrawer_default = AddSourceDrawer;
export {
  AddSourceDrawer_default as default,
  designPattern,
  layout,
  logic,
  meta,
  name,
  styleRules
};
