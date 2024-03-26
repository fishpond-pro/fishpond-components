import React from 'react';
import { SignalProps, ConvertToLayoutTreeDraft } from '@polymita/renderer';
import { Signal } from '@polymita/signal-model';
declare namespace ComponentModule {
    const name: "AddSource";
    let meta: {
        props: AddSourceProps;
        layoutStruct: AddSourceLayout;
        patchCommands: [];
    };
    interface AddSourceProps {
        visible: Signal<boolean>;
        onSubmit: (arg: {
            name: string;
            link: string;
            platform: string;
        }) => void;
    }
    const propTypes: {
        visible: ((...args: any[]) => any) & {
            default: (...args: any[]) => any;
        };
    };
    const logic: (props: SignalProps<AddSourceProps>) => {
        form: {
            name: import("@polymita/signal").StateSignal<string>;
            link: import("@polymita/signal").StateSignal<string>;
            platform: import("@polymita/signal").StateSignal<string>;
        };
        submit: import("@polymita/signal").InputComputeFn<[]> & {
            _hook: import("@polymita/signal").Hook;
        };
    };
    type AddSourceLayout = {
        type: 'addSourceContainer';
        children: [
        ];
    };
    const layout: (props: AddSourceProps) => import("@polymita/renderer").VirtualLayoutJSON;
    const styleRules: (props: AddSourceProps, layout: ConvertToLayoutTreeDraft<AddSourceLayout>) => any[];
    const designPattern: (props: AddSourceProps, layout: ConvertToLayoutTreeDraft<AddSourceLayout>) => {};
}
declare const AddSource: (props: ComponentModule.AddSourceProps) => React.FunctionComponentElement<ComponentModule.AddSourceProps>;
export type AddSourceProps = ComponentModule.AddSourceProps;
export declare const name: "AddSource";
export declare const meta: {
    props: AddSourceProps;
    layoutStruct: AddSourceLayout;
    patchCommands: [];
};
export declare const logic: (props: SignalProps<AddSourceProps>) => {
    form: {
        name: import("@polymita/signal").StateSignal<string>;
        link: import("@polymita/signal").StateSignal<string>;
        platform: import("@polymita/signal").StateSignal<string>;
    };
    submit: import("@polymita/signal").InputComputeFn<[]> & {
        _hook: import("@polymita/signal").Hook;
    };
};
export type AddSourceLayout = ComponentModule.AddSourceLayout;
export declare const layout: (props: AddSourceProps) => import("@polymita/renderer").VirtualLayoutJSON;
export declare const styleRules: (props: AddSourceProps, layout: ConvertToLayoutTreeDraft<AddSourceLayout>) => any[];
export declare const designPattern: (props: AddSourceProps, layout: ConvertToLayoutTreeDraft<AddSourceLayout>) => {};
export default AddSource;
