import React from 'react';
import { ConvertToLayoutTreeDraft, VirtualLayoutJSON } from '@polymita/renderer';
import { ComputedSignal } from '@polymita/signal';
import { SubscribedChannel } from '@/shared/types';
import rssSourceDriver from '@/drivers/rss';
declare namespace ComponentModule {
    type rssSourceDriverReturn = ReturnType<typeof rssSourceDriver>;
    export const name: "SourceList";
    export let meta: {
        props: SourceListProps;
        layoutStruct: SourceListLayout;
        patchCommands: [];
    };
    export interface SourceListProps extends rssSourceDriverReturn {
        width: number;
        subscribed: ComputedSignal<SubscribedChannel[]>;
    }
    export const propTypes: {};
    export const logic: (props: SourceListProps) => {};
    export type SourceListLayout = {
        type: 'sourceListContainer';
        children: [
        ];
    };
    export const layout: (props: SourceListProps) => VirtualLayoutJSON;
    export const styleRules: (props: SourceListProps, layout: ConvertToLayoutTreeDraft<SourceListLayout>) => any[];
    export const designPattern: (props: SourceListProps, layout: ConvertToLayoutTreeDraft<SourceListLayout>) => {};
    export {};
}
declare const RSSSourceList: (props: ComponentModule.RSSSourceListProps) => React.FunctionComponentElement<ComponentModule.SourceListProps>;
export type RSSSourceListProps = ComponentModule.RSSSourceListProps;
export declare const name: "SourceList";
export declare const meta: {
    props: SourceListProps;
    layoutStruct: SourceListLayout;
    patchCommands: [];
};
export declare const logic: (props: SourceListProps) => {};
export type RSSSourceListLayout = ComponentModule.RSSSourceListLayout;
export declare const layout: (props: SourceListProps) => VirtualLayoutJSON;
export declare const styleRules: (props: SourceListProps, layout: ConvertToLayoutTreeDraft<SourceListLayout>) => any[];
export declare const designPattern: (props: SourceListProps, layout: ConvertToLayoutTreeDraft<SourceListLayout>) => {};
export default RSSSourceList;
