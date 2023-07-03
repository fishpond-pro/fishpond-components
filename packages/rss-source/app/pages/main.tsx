import React from 'react'

import SourceList from '@/views/SourceList'
import sourceMock from './source.json'

export default function Main () {
  return (<SourceList sources={sourceMock} />)
}