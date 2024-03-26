import React from "react";
import { createRSRenderer } from "@polymita/renderer";
import { h, useLogic } from "@polymita/renderer";
var ComponentModule;
((ComponentModule2) => {
  ComponentModule2.name = "RSSTable";
  ComponentModule2.propTypes = {};
  ComponentModule2.logic = (props) => {
    return {};
  };
  function rssTables(tables) {
    const rows = tables.split("\n");
    const header = rows[0].split(/\s|\|/g).filter(Boolean);
    const body = rows.slice(2).map((row) => row.split(/\s|\|/g).filter(Boolean));
    return {
      header,
      body
    };
  }
  ComponentModule2.layout = (props) => {
    if (!props.tables) {
      return null;
    }
    const { header, body } = rssTables(props.tables);
    return /* @__PURE__ */ h("rssTableContainer", { className: "block pb-2 max-w-full overflow-auto" }, /* @__PURE__ */ h("table", { className: "border" }, /* @__PURE__ */ h("thead", null, /* @__PURE__ */ h("tr", null, header.map((t, i) => /* @__PURE__ */ h("th", { key: t + i, className: "px-2 py-1" }, t)))), /* @__PURE__ */ h("tbody", null, body.map((row) => /* @__PURE__ */ h("tr", { className: "border-t" }, row.map((t, i) => /* @__PURE__ */ h("td", { key: t + i, className: "px-2 py-1" }, t)))))));
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
const RSSParamsTable = (props) => {
  return React.createElement(Component, props);
};
const name = ComponentModule.name;
const meta = ComponentModule.meta;
const logic = ComponentModule.logic;
const layout = ComponentModule.layout;
const styleRules = ComponentModule.styleRules;
const designPattern = ComponentModule.designPattern;
var RSSParamsTable_default = RSSParamsTable;
export {
  RSSParamsTable_default as default,
  designPattern,
  layout,
  logic,
  meta,
  name,
  styleRules
};
