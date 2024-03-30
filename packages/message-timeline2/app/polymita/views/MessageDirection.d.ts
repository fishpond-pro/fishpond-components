import React from 'react';
import { SignalProps, ConvertToLayoutTreeDraft } from '@polymita/renderer';
import * as MessageModule from './Message';
declare namespace ComponentModule {
    const name: "MessageDirection";
    let meta: {
        props: MessageDirectionProps;
        layoutStruct: MessageDirectionLayout;
        patchCommands: [];
    };
    interface MessageDirectionProps extends MessageModule.MessageProps {
        direction: 'left' | 'right';
        showYear?: boolean;
    }
    const propTypes: {};
    const logic: (props: SignalProps<MessageDirectionProps>) => {};
    type MessageDirectionLayout = {
        type: 'messageDirectionContainer';
        children: [
            MessageModule.MessageLayout
        ];
    };
    const layout: (props: MessageDirectionProps) => import("@polymita/renderer").VirtualLayoutJSON;
    const styleRules: (props: MessageDirectionProps, layout: ConvertToLayoutTreeDraft<MessageDirectionLayout>) => any[];
    const designPattern: (props: MessageDirectionProps, layout: ConvertToLayoutTreeDraft<MessageDirectionLayout>) => {};
}
declare const MessageDirection: (props: ComponentModule.MessageDirectionProps) => React.FunctionComponentElement<ComponentModule.MessageDirectionProps>;
export type MessageDirectionProps = ComponentModule.MessageDirectionProps;
export declare const name: "MessageDirection";
export declare const meta: {
    props: MessageDirectionProps;
    layoutStruct: MessageDirectionLayout;
    patchCommands: [];
};
export declare const logic: (props: SignalProps<MessageDirectionProps>) => {};
export type MessageDirectionLayout = ComponentModule.MessageDirectionLayout;
export declare const layout: (props: MessageDirectionProps) => import("@polymita/renderer").VirtualLayoutJSON;
export declare const styleRules: (props: MessageDirectionProps, layout: ConvertToLayoutTreeDraft<MessageDirectionLayout>) => any[];
export declare const designPattern: (props: MessageDirectionProps, layout: ConvertToLayoutTreeDraft<MessageDirectionLayout>) => {};
export default MessageDirection;
