import 'server-only'

import * as log from '@/scripts/log'; 

export const onMounted = (...args: any[]) => {
  
  log.onMounted?.(...args)     
}