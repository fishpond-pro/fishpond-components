import React from 'react';
import { SignalProps, ConvertToLayoutTreeDraft } from '@polymita/renderer';
declare namespace ComponentModule {
}
declare const RSSParamsTable: (props: ComponentModule.RSSParamsTableProps) => React.FunctionComponentElement<ComponentModule.RSSTableProps>;
export type RSSParamsTableProps = ComponentModule.RSSParamsTableProps;
export declare const name: "RSSTable";
export declare const meta: {
    props: RSSTableProps;
    layoutStruct: RSSTableLayout;
    patchCommands: [];
};
export declare const logic: (props: SignalProps<RSSTableProps>) => {};
export type RSSParamsTableLayout = ComponentModule.RSSParamsTableLayout;
export declare const layout: (props: RSSTableProps) => JSX.Element;
export declare const styleRules: (props: RSSTableProps, layout: ConvertToLayoutTreeDraft<RSSTableLayout>) => any[];
export declare const designPattern: (props: RSSTableProps, layout: ConvertToLayoutTreeDraft<RSSTableLayout>) => {};
export default RSSParamsTable;
