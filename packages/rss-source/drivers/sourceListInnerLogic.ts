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

  const sourcePreviewForm = signal<{ path: string, payload: Record<string, string> }>({
    path: '',
    payload: {} ,
  })

  const selectCurrentSource = inputCompute((source?: RSSSource) => {
    currentSource(source)

    if (source) {
      const params = getParamsFromPath(source.route.path, source.route.paramsdesc)
  
      sourcePreviewForm(draft => {
        draft.path = source.route.path;
        params.forEach(obj => {
          draft.payload[obj.name] = ''
        })
      })
    } else {
      sourcePreviewForm(draft => {
        draft.path = '';
        draft.payload = {}
      })
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
    currentSource,
    sourcePreviewForm,
    selectCurrentSource,
    queryPreview,
    previewMessages,
    submit,
    secondConfirmSubmit,    
    showSubmitConfirm,
  }
}