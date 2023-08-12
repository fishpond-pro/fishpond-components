import { getParamsFromPath } from '@/utils/index'
import {
  computed,
  inputCompute,
  signal,
} from '@polymita/signal'

interface RSSSource {
  group: string
  subGroup: string
  title: string
  route: {
    author: string
    example: string,
    path: string,
    radar?: boolean,
    rssbud?: boolean
    paramsdesc?: string[]
  },
  tipsMarkDown: string[]
}

interface PreviewMessage {
  title: string
}

export interface SourceListInnerLogicProps {
  onQuery: (arg: { path: string, payload: Record<string,any> }) => Promise<PreviewMessage[]>
  onSubmit: (arg: { path: string, payload: Record<string,any> }) => void
}

export default function sourceListInnerLogic (props: SourceListInnerLogicProps) {
  const currentSource = signal<RSSSource>(null)

  const path = signal('')
  const payloads = signal<{ key: string, value: string }[]>([])

  const sourcePreviewForm = computed(() => {
    return {
      path: path(),
      payload: payloads().reduce((pre, cur) => (Object.assign(pre, { [cur.key]: cur.value})), {} as Record<string, string>)
    }
  })

  const selectCurrentSource = inputCompute((source?: RSSSource) => {
    currentSource(source)

    if (source) {
      const params = getParamsFromPath(source.route.path, source.route.paramsdesc)
  
      path(source.route.path)
      payloads(params.map(obj => ({ key: obj.name, value: '' })))
    } else {
      path('')
      payloads([])
    }
  });

  const previewMessages = signal<PreviewMessage[]>([])

  const error = signal('')

  const queryPreview = inputCompute(function * () {
    const { path, payload } = sourcePreviewForm()
    try {
      const messages:PreviewMessage[] = yield props.onQuery({
        path,
        payload
      })
      previewMessages(messages)
    } catch (e) {
      error(e.message)
    }
  })

  const showSubmitConfirm = signal({
    visible: false,
    title: '',
  })

  const submit = inputCompute(() => {

    const messages = previewMessages()
    if (messages.length <= 0) {
      showSubmitConfirm(draft => {
        draft.visible = true
        draft.title = 'Sure to submit?'
      })
      return
    } 

    secondConfirmSubmit()
  })
  const secondConfirmSubmit = inputCompute(() => {
    showSubmitConfirm(draft => {
      draft.visible = false
    })
    const form = sourcePreviewForm()
    props.onSubmit(form)   

    selectCurrentSource(undefined)
  })

  return {
    path,
    currentSource,
    selectCurrentSource,
    form: {
      path,
      payloads,
    },
    queryPreview,
    previewMessages,
    submit,
    secondConfirmSubmit,    
    showSubmitConfirm,
  }
}