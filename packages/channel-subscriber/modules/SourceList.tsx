import { h, SignalProps, PropTypes, useLogic, ConvertToLayoutTreeDraft, createFunctionComponent, classNames, VirtualLayoutJSON } from '@polymita/renderer';
import { Signal, signal } from '@polymita/signal-model'
import * as AddSourceModule from './AddSource'
import type { DataSource } from '@/drivers/source';
import * as ListModule from 'polymita/components/list'

export const name = 'SourceList' as const
export let meta: {
  props: SourceListProps,
  layoutStruct: SourceListLayout
  patchCommands: []
}

export interface SourceListProps {
  title?: string
  onSubmit?: AddSourceModule.AddSourceProps['onSubmit']
  list: Signal<DataSource[]>
  onClick?: (ds: DataSource, index: number) => void;
  internalModal?: boolean
  onClickPlus?: () => void;
  selected?: number;
}

export const propTypes = {
}

export const logic = (props: SignalProps<SourceListProps>) => {
  const sourceModalVisible = signal(false)
  return {
    sourceModalVisible,
  }
}
type LogicReturn = ReturnType<typeof logic>

export type SourceListLayout = {
  type: 'sourceListContainer',
  children: [
  ],
}
const AddSourceCpt = createFunctionComponent(AddSourceModule)
const ListCpt = createFunctionComponent(ListModule);

export const layout = (props: SourceListProps): VirtualLayoutJSON => {
  const {
    sourceModalVisible,
  } = useLogic<LogicReturn>();

  const { selected } = props;


  return (
    <sourceListContainer className="block">
      <listHeader className="flex p-2">
        <listTitle className="flex-1 text-lg">
          {props.title}
        </listTitle>
        <addSourceEntry
          className="inline-block w-[24px] text-center cursor-pointer"
          onClick={() => {
            if (props.internalModal) {
              sourceModalVisible(true)
            } else {
              props.onClickPlus?.();
            }
          }}
        >
          +
        </addSourceEntry>
      </listHeader>
      <listContent className="block pl-2">
        <ListCpt border={false} list={props.list} render={(item: DataSource, i: number) => {
          const name = item.type === 0 ? item.rss?.name : item.type === 1 ? item.rpa?.name : '';
          const current = item.id === selected;
          const cls = classNames(`block truncate text-base p-2 rounded hover:bg-slate-50`, {
            'bg-slate-50': current
          })
          return (
            <listSourceContent
              className={cls}
              onClick={() => {
                props.onClick?.(item, i);
              }}
            >
              {`${name}`}
            </listSourceContent>
          )
        }} />
      </listContent>
      <AddSourceCpt visible={sourceModalVisible} onSubmit={props.onSubmit} />
    </sourceListContainer>
  )
}

export const styleRules = (props: SourceListProps, layout: ConvertToLayoutTreeDraft<SourceListLayout>) => {
  return [
  ]
}

export const designPattern = (props: SourceListProps, layout: ConvertToLayoutTreeDraft<SourceListLayout>) => {
  const logic = useLogic<LogicReturn>()
  return {}
}
