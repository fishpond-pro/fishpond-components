'use client'
import React from 'react'
import  * as Content2Module from '@/modules/Content2'
import { createRHSRenderer } from '@polymita/renderer'
import { createConnect } from '@polymita/next-connect'

import mi from '@/models/indexes.json'
import { createPlugin } from '@/app/polymita/connect'


const connect = createConnect({
  modelIndexes: mi,
  plugin: createPlugin(),
  React: React,
})

const Content2 = createRHSRenderer(Content2Module, {
  framework: {
    lib: React,
    name: 'react'
  },
});

const Content2WithScope = (() => {
  Content2.construct()
  return Content2.render()
})

export default () => {
  return (
    <div>
      <Content2WithScope />
    </div>
  )
}