import { h, SignalProps, PropTypes, useLogic, ConvertToLayoutTreeDraft, createFunctionComponent, createComposeComponent } from '@polymita/renderer';
import '@polymita/renderer/jsx-runtime';
import * as ModalModule from '@polymita/ui/components/modal'
import * as InputModule from '@polymita/ui/components/input'
import * as FormModule from '@polymita/ui/components/schema-form'
import { useState } from 'react';

export const name = 'AddSource' as const
export let meta: {
  props: AddSourceProps,
  layoutStruct: AddSourceLayout
  patchCommands: []
}

export interface AddSourceProps {
  visible: boolean,
  onVisible: (v: boolean) => void,
  onSubmit: (arg: {
    name: string,
    link: string,
    platform: string
  }) => void
}

export const propTypes = {
  visible: PropTypes.signal.isRequired,
}

export const logic = (props: SignalProps<AddSourceProps>) => {
  const name = useState('')
  const link = useState('')
  const platform = useState('')

  const submit = (() => {
    props.onSubmit({
      name: name[0],
      link: link[0],
      platform: platform[0],
    });
  });

  return {
    form: {
      name,
      link,
      platform,
    },
    submit
  }
}
type LogicReturn = ReturnType<typeof logic>

export type AddSourceLayout = {
  type: 'addSourceContainer',
  children: [
  ]
}

const ModalCpt = createFunctionComponent(ModalModule)
const InputCpt = createFunctionComponent(InputModule, {
  patchRules (props, draft) {
    return [
      {
        target: draft.inputBox,
        style: {
          flex: 1
        }
      }
    ]
  }
})
const FormCpt = createFunctionComponent(FormModule);

export const layout = (props: AddSourceProps) => {
  const logic = useLogic<LogicReturn>()

  const visible = props.visible;

  return (
    h('addSourceContainer', {},
      visible ? h(ModalCpt, {
        title: '数据源',
        onClose () { props.onVisible(false) },
        onOk () { props.onVisible(false); logic.submit() }
      },
        h(FormCpt, {
          layout: { labelWidth: '4em' },
          form: [
            {
              label: '名称',
              value: logic.form.name,
            },
            {
              label: '链接',
              value: logic.form.link,
            },
            {
              label: '平台',
              value: logic.form.platform,
            },
          ]
        })
      ) : ''
    )
  )
}

export const styleRules = (props: AddSourceProps, layout: ConvertToLayoutTreeDraft<AddSourceLayout>) => {
  return [
  ]
}

export const designPattern = (props: AddSourceProps, layout: ConvertToLayoutTreeDraft<AddSourceLayout>) => {
  const logic = useLogic<LogicReturn>()
  return {}
}
