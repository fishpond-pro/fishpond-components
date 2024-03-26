import React from "react";
import { createRSRenderer } from "@polymita/renderer";
import { h, useLogic } from "@polymita/renderer";
import { getParamsFromPath } from "@/utils/index";
var ComponentModule;
((ComponentModule2) => {
  ComponentModule2.name = "RSSSourcePanel";
  ComponentModule2.propTypes = {};
  ComponentModule2.logic = (props) => {
    return {};
  };
  ComponentModule2.layout = (props) => {
    const logic3 = useLogic();
    const { width, value, count } = props;
    const { route, subGroup, title } = value;
    const { path } = route;
    const params = getParamsFromPath(route.path, route.paramsdesc);
    return /* @__PURE__ */ h(
      "sourceItemContainer",
      {
        onClick: () => {
          props.onClick?.(value);
        },
        className: "relative cursor-pointer inline-block box-border border mb-2 p-4",
        style: { width: width || 200 }
      },
      /* @__PURE__ */ h(
        "sourceItemCount",
        {
          if: !!count,
          className: "inline-block bg-slate-300 w-6 h-6 text-center leading-5 text-sm absolute -top-2 -left-2 rounded-full border"
        },
        count
      ),
      /* @__PURE__ */ h("sourceItemTitle", { className: "mb-2 pb-2 border-b flex items-center" }, /* @__PURE__ */ h("span", { className: "inline-block text-ellipsis whitespace-nowrap overflow-hidden" }, subGroup), /* @__PURE__ */ h("span", { className: "mx-1" }, "-"), /* @__PURE__ */ h("span", { className: "flex-1 whitespace-nowrap" }, title)),
      /* @__PURE__ */ h("sourceItemRoute", { className: "block break-all" }, /* @__PURE__ */ h("span", { className: "mr-1 text-gray-500" }, "\u8DEF\u5F84:"), "/", path),
      /* @__PURE__ */ h("sourceItemRoute", { if: !!params.length, className: "block break-all" }, /* @__PURE__ */ h("span", { className: "mr-1 text-gray-500" }, "\u53C2\u6570:")),
      /* @__PURE__ */ h("sourceItemRouteParams", { if: !!params.length, className: "block" }, params.map((p) => /* @__PURE__ */ h("sourceItemRouteParam", { className: "block" }, /* @__PURE__ */ h("span", { className: "px-[4px] py-[2px] bg-slate-100 text-gray-600" }, p.name), ",", p.optional ? "\u53EF\u9009" : "\u5FC5\u9009", ",", p.desc)))
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
const RSSSourcePanel = (props) => {
  return React.createElement(Component, props);
};
const name = ComponentModule.name;
const meta = ComponentModule.meta;
const logic = ComponentModule.logic;
const layout = ComponentModule.layout;
const styleRules = ComponentModule.styleRules;
const designPattern = ComponentModule.designPattern;
var RSSSourcePanel_default = RSSSourcePanel;
export {
  RSSSourcePanel_default as default,
  designPattern,
  layout,
  logic,
  meta,
  name,
  styleRules
};
