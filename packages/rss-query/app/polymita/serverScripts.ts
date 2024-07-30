import 'server-only'

import * as b from '@/scripts/server/b'; 
import * as thirdPart from '@/scripts/server/third_part/index'; 

export const onMounted = (...args: any[]) => {
  
  b.onMounted?.(...args) 
  thirdPart.onMounted?.(...args)     
}