import 'server-only'

import * as log from '@/scripts/server/log'; 
import * as third from '@/scripts/server/third/index'; 

export const onMounted = (...args: any[]) => {
  
  log.onMounted?.(...args) 
  third.onMounted?.(...args)     
}