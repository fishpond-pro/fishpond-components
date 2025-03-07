import { h, SignalProps, useLogic, ConvertToLayoutTreeDraft, CommandOP, extendModule, VirtualLayoutJSON } from '@polymita/renderer';
import * as bl from '@polymita/basic-layout'
import { usePathname } from 'next/navigation';
import { Link } from 'react-router-dom'
import { prisma } from '@polymita/next-connect';
import mi from '@/models/indexes.json'
import { ChannelRecord } from '@/models/indexesTypes';

export interface AsideNewProps {
  
}



const NewModule = extendModule(bl.modules.Aside, () => ({
  patchLogic(props, prevLogicResult) {

    const channels = prisma<ChannelRecord[]>(mi.namespace, mi.channelRecord);

    return {
      ...prevLogicResult,
      channels,
    }
  },

  patchLayout(props: typeof bl.modules.Aside.meta.props & AsideNewProps, root) {
    const logic = useLogic()
    const channels: ChannelRecord[] = logic.channels

    const path = usePathname();

    return [
      {
        op: CommandOP.addChild,
        condition: true,
        target: root.asideContainer.asideMenuContainer,
        child: (
          <asideMessageListMenuItem className='block mb-2'>
            <asideMessageListTitle className='block hover:bg-gray-200 p-2 rounded-md'>
              <Link to="/messages">All Messages 2</Link>
            </asideMessageListTitle>
            <asideMessageListRecordContainer className='block'>
              {channels?.map(channel => {
                return (
                  <Link key={channel.channel} to={`/messages?channel=${channel.id}`}>
                    <asideMessageListRecord 
                      className="block hover:bg-gray-200 p-2 rounded-md ml-4"
                    >
                      {channel.name}
                    </asideMessageListRecord>
                  </Link>
                )
              })}
            </asideMessageListRecordContainer>
          </asideMessageListMenuItem>
        ),
      },
    ]
  }
}))

export const meta = NewModule.meta
export const base = NewModule.base
export const name = 'MessageListRssMenuItem'
export const namespace = NewModule.namespace
//
export const override = NewModule.override
export const layout = NewModule.layout
export const logic = NewModule.logic
export const designPattern = NewModule.designPattern
export const designPatterns = NewModule.designPatterns
export const styleRules = NewModule.styleRules