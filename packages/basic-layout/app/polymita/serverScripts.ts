import 'server-only'

import * as b from '@/scripts/server/b'; 

export const onMounted = (...args: any[]) => {
  
  b.onMounted?.(...args)     
}