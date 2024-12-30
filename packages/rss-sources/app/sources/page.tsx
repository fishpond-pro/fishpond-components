'use client'
import SourcesFn from '../polymita/views/RssSources'
import * as mo from '../moduleOverride'

const Sources = SourcesFn(mo.modulesLinkMap, mo.modulesActiveMap);

export default () => {

  return (
    <>
      <Sources />
    </>
  )
}