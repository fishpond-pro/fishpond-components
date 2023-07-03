import { createRSRender, SingleFileModule } from '@polymita/renderer'
import React from 'react'

export function RenderToReact<P>(module: SingleFileModule<any, any, any, any>) {
  
  const renderer = createRSRender(module, {
    framework: {
      name: 'react',
      lib: React
    }
  })
  return (p: P) => {
    const r = renderer.construct(p);
    return renderer.render()
  }
}
