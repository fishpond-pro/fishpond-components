'use client'
import React, { useRef } from 'react'

export default () => {

  const a  = useRef(0)
  a.current++
  console.log('a: ', a);

  return (
    <div>
      test:
      {a.current}
    </div>
  )
}