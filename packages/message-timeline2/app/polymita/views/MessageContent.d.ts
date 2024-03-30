import React from 'react';
import { SignalProps, ConvertToLayoutTreeDraft, VirtualLayoutJSON } from '@polymita/renderer';
declare namespace ComponentModule {
    const name: "MessageContent";
    let meta: {
        props: MessageContentProps;
        layoutStruct: MessageContentLayout;
        patchCommands: [];
    };
    interface MessageContentProps {
        title?: string;
        description?: string;
        content?: string;
        contentLink?: string;
        displayType: 'drawer' | 'modal' | 'normal';
        mode: 'iframe' | 'webview';
    }
    const propTypes: {};
    const logic: (props: SignalProps<MessageContentProps>) => {
        showIframe: import("@polymita/signal").StateSignal<boolean>;
    };
    type MessageContentLayout = {
        type: 'modulesContainer';
        children: [
        ];
    };
    const layout: (props: MessageContentProps) => VirtualLayoutJSON;
    const styleRules: (props: MessageContentProps, layout: ConvertToLayoutTreeDraft<MessageContentLayout>) => any[];
    const designPattern: (props: MessageContentProps, layout: ConvertToLayoutTreeDraft<MessageContentLayout>) => {};
}
declare const MessageContent: (props: ComponentModule.MessageContentProps) => React.FunctionComponentElement<ComponentModule.MessageContentProps>;
export type MessageContentProps = ComponentModule.MessageContentProps;
export declare const name: "MessageContent";
export declare const meta: {
    props: MessageContentProps;
    layoutStruct: MessageContentLayout;
    patchCommands: [];
};
export declare const logic: (props: SignalProps<MessageContentProps>) => {
    showIframe: import("@polymita/signal").StateSignal<boolean>;
};
export type MessageContentLayout = ComponentModule.MessageContentLayout;
export declare const layout: (props: MessageContentProps) => VirtualLayoutJSON;
export declare const styleRules: (props: MessageContentProps, layout: ConvertToLayoutTreeDraft<MessageContentLayout>) => any[];
export declare const designPattern: (props: MessageContentProps, layout: ConvertToLayoutTreeDraft<MessageContentLayout>) => {};
export default MessageContent;
