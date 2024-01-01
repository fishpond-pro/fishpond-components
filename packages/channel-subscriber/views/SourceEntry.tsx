import React, { useState } from 'react'
import * as ComponentModule from '../modules/SournceEntry';
import { RenderToReact } from '@/shared/render';

const Component = RenderToReact(ComponentModule);

const SourceEntry = (props: ComponentModule.SourceEntryProps) => {

  return (
    <Component {...props} />
  )
}

export default SourceEntry;
