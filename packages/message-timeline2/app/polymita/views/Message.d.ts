import React from 'react';
import { SignalProps, ConvertToLayoutTreeDraft } from '@polymita/renderer';
declare namespace ComponentModule {
}
declare const Message: (props: ComponentModule.MessageProps) => React.FunctionComponentElement<ComponentModule.MessageProps>;
export type MessageProps = ComponentModule.MessageProps;
export declare const name: "Message";
export declare const meta: {
    props: MessageProps;
    layoutStruct: MessageLayout;
    patchCommands: [];
};
export declare const logic: (props: SignalProps<MessageProps>) => {};
export type MessageLayout = ComponentModule.MessageLayout;
export declare const layout: (props: MessageProps) => JSX.Element;
export declare const styleRules: (props: MessageProps, layout: ConvertToLayoutTreeDraft<MessageLayout>) => any[];
export declare const designPattern: (props: MessageProps, layout: ConvertToLayoutTreeDraft<MessageLayout>) => {};
export default Message;
