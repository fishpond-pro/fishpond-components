import 'server-only'

import * as log from '@/scripts/server/log'; 

export const onMounted = (...args: any[]) => {
  
  log.onMounted?.(...args)     
}