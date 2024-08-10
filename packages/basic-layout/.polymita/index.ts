import * as App from '../modules/App'
import * as Aside from '../modules/Aside'
import * as Content from '../modules/Content'
import * as AsideNewForTest from '../overrides/AsideNewForTest'
import * as c from '../scripts/edge/c'
import React from 'react'
import { createRHRenderer, SingleFileModule, registerModule } from '@polymita/renderer'
import '@polymita/renderer/jsx-runtime';

function RenderToReact<P extends Record<string, any>>(
  module: SingleFileModule<P, any, any, any>,
  modulesLinkMap: Map<string, any>,
  modulesActiveLink: string[],
) {
  registerModule(module, modulesLinkMap)

  const renderer = createRHRenderer(module, {
    framework: {
      name: 'react',
      lib: React
    },
    moduleOverride: {
      modulesLinkMap,
      modulesActiveMap: modulesActiveLink,
    },
  })
  return (p: P) => {
    const r = renderer.construct(p);
    return renderer.render()
  }
}


const forwardApp = (modulesLinkMap: Map<string, any>, modulesActiveLink: string[]) => {
  const Component = RenderToReact(App as any, modulesLinkMap, modulesActiveLink);
  const innerApp = (props: App.AppProps) => {
    return React.createElement(Component, props)
  }
  return innerApp;
}

const forwardAside = (modulesLinkMap: Map<string, any>, modulesActiveLink: string[]) => {
  const Component = RenderToReact(Aside as any, modulesLinkMap, modulesActiveLink);
  const innerAside = (props: Aside.AsideProps) => {
    return React.createElement(Component, props)
  }
  return innerAside;
}

const forwardContent = (modulesLinkMap: Map<string, any>, modulesActiveLink: string[]) => {
  const Component = RenderToReact(Content as any, modulesLinkMap, modulesActiveLink);
  const innerContent = (props: Content.ContentProps) => {
    return React.createElement(Component, props)
  }
  return innerContent;
}

const forwardAsideNewForTest = (modulesLinkMap: Map<string, any>, modulesActiveLink: string[]) => {
  const Component = RenderToReact(AsideNewForTest as any, modulesLinkMap, modulesActiveLink);
  const innerAsideNewForTest = (props: AsideNewForTest.AsideNewForTestProps) => {
    return React.createElement(Component, props)
  }
  return innerAsideNewForTest;
}


export const views = {
  
  App: forwardApp, 
  Aside: forwardAside, 
  Content: forwardContent, 
  AsideNewForTest: forwardAsideNewForTest, 

}
export const modules = { App, Aside, Content }
export const overrides = { AsideNewForTest }
export const scriptsClient = { c }