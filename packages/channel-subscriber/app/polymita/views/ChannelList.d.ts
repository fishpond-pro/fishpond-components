import React from 'react';
import { SignalProps, ConvertToLayoutTreeDraft, VirtualLayoutJSON } from '@polymita/renderer';
import { ComputedSignal } from '@polymita/signal-model';
import * as AddSourceModule from './AddSource';
import { SubscribedChannel, RSS } from '@/shared/types';
declare namespace ComponentModule {
    const name: "ChannelList";
    let meta: {
        props: ChannelListProps;
        layoutStruct: ChannelListLayout;
        patchCommands: [];
    };
    interface ChannelListProps {
        title?: string;
        onSubmit?: AddSourceModule.AddSourceProps['onSubmit'];
        list: ComputedSignal<SubscribedChannel[]>;
        onClick?: (ds: SubscribedChannel | RSS, index: number) => void;
        internalModal?: boolean;
        onClickPlus?: () => void;
        selected?: number;
    }
    const propTypes: {};
    const logic: (props: SignalProps<ChannelListProps>) => {
        sourceModalVisible: import("@polymita/signal").StateSignal<boolean>;
    };
    type ChannelListLayout = {
        "type": "channelListContainer";
        "children": [
            {
                "type": "listHeader";
                "children": [
                    {
                        "type": "listTitle";
                        "children": [];
                    }
                ];
            },
            {
                "type": "listContent";
                "children": [
                    {
                        "type": "ListCpt";
                    }
                ];
            },
            {
                "type": "AddSourceCpt";
            }
        ];
    };
    const layout: (props: ChannelListProps) => VirtualLayoutJSON;
    const styleRules: (props: ChannelListProps, layout: ConvertToLayoutTreeDraft<ChannelListLayout>) => any[];
    const designPattern: (props: ChannelListProps, layout: ConvertToLayoutTreeDraft<ChannelListLayout>) => {};
}
declare const ChannelList: (props: ComponentModule.ChannelListProps) => React.FunctionComponentElement<ComponentModule.ChannelListProps>;
export type ChannelListProps = ComponentModule.ChannelListProps;
export declare const name: "ChannelList";
export declare const meta: {
    props: ChannelListProps;
    layoutStruct: ChannelListLayout;
    patchCommands: [];
};
export declare const logic: (props: SignalProps<ChannelListProps>) => {
    sourceModalVisible: import("@polymita/signal").StateSignal<boolean>;
};
export type ChannelListLayout = ComponentModule.ChannelListLayout;
export declare const layout: (props: ChannelListProps) => VirtualLayoutJSON;
export declare const styleRules: (props: ChannelListProps, layout: ConvertToLayoutTreeDraft<ChannelListLayout>) => any[];
export declare const designPattern: (props: ChannelListProps, layout: ConvertToLayoutTreeDraft<ChannelListLayout>) => {};
export default ChannelList;
