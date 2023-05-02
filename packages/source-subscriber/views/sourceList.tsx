import React, { useState } from 'react'
import * as ComponentModule from '../modules/SourceList';
import { RenderToReact } from '@/shared/render';

const Component = RenderToReact(ComponentModule);

export interface SourceListProps extends ComponentModule.SourceListProps {
}

const SourceList = (props: SourceListProps) => {
  console.log('props: ', props);

  return (
    <Component {...props} />
  )
}

export default SourceList;
