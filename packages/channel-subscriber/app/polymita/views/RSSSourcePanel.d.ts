import React from 'react';
import { SignalProps, ConvertToLayoutTreeDraft } from '@polymita/renderer';
declare namespace ComponentModule {
}
declare const RSSSourcePanel: (props: ComponentModule.RSSSourcePanelProps) => React.FunctionComponentElement<ComponentModule.RSSSourcePanelProps>;
export type RSSSourcePanelProps = ComponentModule.RSSSourcePanelProps;
export declare const name: "RSSSourcePanel";
export declare const meta: {
    props: RSSSourcePanelProps;
    layoutStruct: RSSSourcePanelLayout;
    patchCommands: [];
};
export declare const logic: (props: SignalProps<RSSSourcePanelProps>) => {};
export type RSSSourcePanelLayout = ComponentModule.RSSSourcePanelLayout;
export declare const layout: (props: RSSSourcePanelProps) => JSX.Element;
export declare const styleRules: (props: RSSSourcePanelProps, layout: ConvertToLayoutTreeDraft<RSSSourcePanelLayout>) => any[];
export declare const designPattern: (props: RSSSourcePanelProps, layout: ConvertToLayoutTreeDraft<RSSSourcePanelLayout>) => {};
export default RSSSourcePanel;
