import {
  state,
} from '@polymita/signal-model'

export default function todo () {

  const s = state(0)

  return {
    s
  }
}