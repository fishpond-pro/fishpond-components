import React from "react";
import { createRSRenderer } from "@polymita/renderer";
import { h, PropTypes, useLogic, createFunctionComponent } from "@polymita/renderer";
import { inputCompute, signal } from "@polymita/signal-model";
import * as ModalModule from "@polymita/ui/components/modal";
import * as InputModule from "@polymita/ui/components/input";
import * as FormModule from "@polymita/ui/components/schema-form";
var ComponentModule;
((ComponentModule2) => {
  ComponentModule2.name = "AddSource";
  ComponentModule2.propTypes = {
    visible: PropTypes.signal.isRequired
  };
  ComponentModule2.logic = (props) => {
    const name3 = signal("");
    const link = signal("");
    const platform = signal("");
    const submit = inputCompute(() => {
      props.onSubmit({
        name: name3(),
        link: link(),
        platform: platform()
      });
    });
    return {
      form: {
        name: name3,
        link,
        platform
      },
      submit
    };
  };
  const ModalCpt = createFunctionComponent(ModalModule);
  const InputCpt = createFunctionComponent(InputModule, {
    patchRules(props, draft) {
      return [
        {
          target: draft.inputBox,
          style: {
            flex: 1
          }
        }
      ];
    }
  });
  const FormCpt = createFunctionComponent(FormModule);
  ComponentModule2.layout = (props) => {
    const logic3 = useLogic();
    const visible = props.visible();
    return h(
      "addSourceContainer",
      {},
      visible ? h(
        ModalCpt,
        {
          title: "\u6570\u636E\u6E90",
          onClose() {
            props.visible(false);
          },
          onOk() {
            props.visible(false);
            logic3.submit();
          }
        },
        h(FormCpt, {
          layout: { labelWidth: "4em" },
          form: [
            {
              label: "\u540D\u79F0",
              value: logic3.form.name
            },
            {
              label: "\u94FE\u63A5",
              value: logic3.form.link
            },
            {
              label: "\u5E73\u53F0",
              value: logic3.form.platform
            }
          ]
        })
      ) : ""
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
const AddSource = (props) => {
  return React.createElement(Component, props);
};
const name = ComponentModule.name;
const meta = ComponentModule.meta;
const logic = ComponentModule.logic;
const layout = ComponentModule.layout;
const styleRules = ComponentModule.styleRules;
const designPattern = ComponentModule.designPattern;
var AddSource_default = AddSource;
export {
  AddSource_default as default,
  designPattern,
  layout,
  logic,
  meta,
  name,
  styleRules
};
