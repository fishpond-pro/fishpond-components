import 'server-only'

import * as c from '@/scripts/edge/c'; 

export const onMounted = (...args: any[]) => {
  
  c.onMounted?.(...args)     
}