import { h, SignalProps, PropTypes, useLogic, ConvertToLayoutTreeDraft, createFunctionComponent, classNames, VirtualLayoutJSON } from '@polymita/renderer';
import { ComputedSignal, Signal, signal } from '@polymita/signal-model'
import * as AddSourceModule from './AddSource'
import * as ListModule from 'polymita/components/list'
import { SubscribedChannel, RSS } from '@/shared/types';

export const name = 'SourceList' as const
export let meta: {
  props: SourceListProps,
  layoutStruct: SourceListLayout
  patchCommands: []
}

export interface SourceListProps {
  title?: string
  onSubmit?: AddSourceModule.AddSourceProps['onSubmit']
  list: ComputedSignal<SubscribedChannel[]>
  onClick?: (ds: SubscribedChannel | RSS, index: number) => void;
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
        <ListCpt border={false} list={props.list} render={(item: SubscribedChannel, i: number) => {
          // const name = item.type === 0 ? item.rss?.name : item.type === 1 ? item.rpa?.name : '';
          const name = item.channel;
          const current = item.id === selected;
          const cls = classNames(`block truncate text-base p-2 rounded hover:bg-slate-50`, {
            'bg-slate-50': current
          })
          return (
            <listSourceContent>
              <listSourceChannel               
                className={cls}
                onClick={() => {
                  props.onClick?.(item, i);
                }} >
                {`${name}`}
              </listSourceChannel>
              <ListCpt 
                border={false}
                list={item.rss as any}
                render={(rssItem:RSS, i:number) => {
                  const cls2 = classNames(`block truncate text-sm py-2 pl-4 rounded hover:bg-slate-50`, {
                    'bg-slate-50': rssItem.id === selected
                  });        
                  return (
                    <listSourceRss 
                      className={cls2}
                      onClick={() => {
                        props.onClick?.(rssItem, i);
                      }} >
                      {`${rssItem.name}`}
                    </listSourceRss>
                  );
                }}
              />
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
