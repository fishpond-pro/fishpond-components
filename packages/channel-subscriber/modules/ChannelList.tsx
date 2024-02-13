import { h, SignalProps, PropTypes, useLogic, ConvertToLayoutTreeDraft, createFunctionComponent, classNames, VirtualLayoutJSON } from '@polymita/renderer';
import { ComputedSignal, Signal, signal } from '@polymita/signal-model'
import * as AddSourceModule from './AddSource'
import * as ListModule from 'polymita/components/list'
import { SubscribedChannel, RSS } from '@/shared/types';
import ReloadIcon from 'polymita/icons/reload'
import PlusIcon from 'polymita/icons/plus'

export const name = 'ChannelList' as const
export let meta: {
  props: ChannelListProps,
  layoutStruct: ChannelListLayout
  patchCommands: []
}

export interface ChannelListProps {
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

export const logic = (props: SignalProps<ChannelListProps>) => {
  const sourceModalVisible = signal(false)
  return {
    sourceModalVisible,
  }
}
type LogicReturn = ReturnType<typeof logic>

export type ChannelListLayout = {
  "type": "channelListContainer",
  "children": [
    {
      "type": "listHeader",
      "children": [
        {
          "type": "listTitle",
          "children": []
        },
      ]
    },
    {
      "type": "listContent",
      "children": [
        {
          "type": "ListCpt"
        }
      ]
    },
    {
      "type": "AddSourceCpt"
    }
  ]
}
const AddSourceCpt = createFunctionComponent(AddSourceModule)
const ListCpt = createFunctionComponent(ListModule);

export const layout = (props: ChannelListProps): VirtualLayoutJSON => {
  const {
    sourceModalVisible,
  } = useLogic<LogicReturn>();

  const { selected } = props;


  return (
    <channelListContainer className="block">
      <listHeader className="flex items-center">
        <listTitle className="flex-1 text-lg">
          {props.title}
        </listTitle>
        {/* <addSourceEntry
          className="inline-block w-[24px] text-center cursor-pointer"
          onClick={() => {
            if (props.internalModal) {
              sourceModalVisible(true)
            } else {
              props.onClickPlus?.();
            }
          }}
        >
          <PlusIcon />
        </addSourceEntry> */}
      </listHeader>
      <listContent className="block pl-2">
        <ListCpt border={false} list={props.list} render={(item: SubscribedChannel, i: number) => {
          // const name = item.type === 0 ? item.rss?.name : item.type === 1 ? item.rpa?.name : '';
          const name = item.channel;
          const cls = classNames(
            `block cursor-pointer truncate text-base p-2 rounded hover:bg-slate-50`,
          )
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
                  const cls2 = classNames(
                    `block truncate cursor-pointer text-sm py-2 pl-4 rounded hover:bg-slate-50`, 
                    {
                      'bg-slate-50': rssItem.id === selected
                    }
                  );        
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
    </channelListContainer>
  )
}

export const styleRules = (props: ChannelListProps, layout: ConvertToLayoutTreeDraft<ChannelListLayout>) => {
  return [
  ]
}

export const designPattern = (props: ChannelListProps, layout: ConvertToLayoutTreeDraft<ChannelListLayout>) => {
  const logic = useLogic<LogicReturn>()
  return {}
}
