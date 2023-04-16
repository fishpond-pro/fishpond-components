import React, { useState } from 'react'
import * as ComponentModule from '../modules/SourceList';
import { RenderToReact } from '@/shared/render';

const Component = RenderToReact(ComponentModule);

const SourceList = (props: any) => {
  console.log('props: ', props);

  return (
    <Component {...props} />
  )
}

export default SourceList;
