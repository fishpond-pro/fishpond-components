import React from 'react';
import { SignalProps, ConvertToLayoutTreeDraft, VirtualLayoutJSON } from '@polymita/renderer';
import { ComputedSignal } from '@polymita/signal';
import rssSourceDriver from '@/drivers/rss';
import { SubscribedChannelWithForm } from '@/shared/types';
declare namespace ComponentModule {
    export const name: "AddSourceDrawer";
    export let meta: {
        props: AddSourceDrawerProps;
        layoutStruct: AddSourceDrawerLayout;
        patchCommands: [];
    };
    type rssSourceDriverReturn = ReturnType<typeof rssSourceDriver>;
    export interface AddSourceDrawerProps extends rssSourceDriverReturn {
        subscribed: ComputedSignal<SubscribedChannelWithForm[]>;
    }
    export const propTypes: {};
    export const logic: (props: SignalProps<AddSourceDrawerProps>) => {
        showForm: import("@polymita/signal").StateSignal<number[]>;
    };
    export type AddSourceDrawerLayout = {
        type: 'modulesContainer';
        children: [
        ];
    };
    export const layout: (props: AddSourceDrawerProps) => VirtualLayoutJSON;
    export const styleRules: (props: AddSourceDrawerProps, layout: ConvertToLayoutTreeDraft<AddSourceDrawerLayout>) => any[];
    export const designPattern: (props: AddSourceDrawerProps, layout: ConvertToLayoutTreeDraft<AddSourceDrawerLayout>) => {};
    export {};
}
declare const AddSourceDrawer: (props: ComponentModule.AddSourceDrawerProps) => React.FunctionComponentElement<ComponentModule.AddSourceDrawerProps>;
export type AddSourceDrawerProps = ComponentModule.AddSourceDrawerProps;
export declare const name: "AddSourceDrawer";
export declare const meta: {
    props: AddSourceDrawerProps;
    layoutStruct: AddSourceDrawerLayout;
    patchCommands: [];
};
export declare const logic: (props: SignalProps<AddSourceDrawerProps>) => {
    showForm: import("@polymita/signal").StateSignal<number[]>;
};
export type AddSourceDrawerLayout = ComponentModule.AddSourceDrawerLayout;
export declare const layout: (props: AddSourceDrawerProps) => VirtualLayoutJSON;
export declare const styleRules: (props: AddSourceDrawerProps, layout: ConvertToLayoutTreeDraft<AddSourceDrawerLayout>) => any[];
export declare const designPattern: (props: AddSourceDrawerProps, layout: ConvertToLayoutTreeDraft<AddSourceDrawerLayout>) => {};
export default AddSourceDrawer;
