import React from 'react';
import { SignalProps, ConvertToLayoutTreeDraft, VirtualLayoutJSON } from '@polymita/renderer';
declare namespace ComponentModule {
    const name: "SourceEntry";
    let meta: {
        props: SourceEntryProps;
        layoutStruct: SourceEntryLayout;
        patchCommands: [];
    };
    interface SourceEntryProps {
        onClickRefresh?: () => void;
        onClick?: () => void;
    }
    const propTypes: {};
    const logic: (props: SignalProps<SourceEntryProps>) => {};
    type SourceEntryLayout = {
        type: 'sourceEntryContainer';
        children: [
        ];
    };
    const layout: (props: SourceEntryProps) => VirtualLayoutJSON;
    const styleRules: (props: SourceEntryProps, layout: ConvertToLayoutTreeDraft<SourceEntryLayout>) => any[];
    const designPattern: (props: SourceEntryProps, layout: ConvertToLayoutTreeDraft<SourceEntryLayout>) => {};
}
declare const SourceEntry: (props: ComponentModule.SourceEntryProps) => React.FunctionComponentElement<ComponentModule.SourceEntryProps>;
export type SourceEntryProps = ComponentModule.SourceEntryProps;
export declare const name: "SourceEntry";
export declare const meta: {
    props: SourceEntryProps;
    layoutStruct: SourceEntryLayout;
    patchCommands: [];
};
export declare const logic: (props: SignalProps<SourceEntryProps>) => {};
export type SourceEntryLayout = ComponentModule.SourceEntryLayout;
export declare const layout: (props: SourceEntryProps) => VirtualLayoutJSON;
export declare const styleRules: (props: SourceEntryProps, layout: ConvertToLayoutTreeDraft<SourceEntryLayout>) => any[];
export declare const designPattern: (props: SourceEntryProps, layout: ConvertToLayoutTreeDraft<SourceEntryLayout>) => {};
export default SourceEntry;
