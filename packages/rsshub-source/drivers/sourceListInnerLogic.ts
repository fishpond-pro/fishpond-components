import { getParamsFromPath } from '@/utils/index'
import {
  after,
  computed,
  inputCompute,
  signal,
} from '@polymita/signal'

export interface RSSSource {
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
  tables?: string[]
}

export interface PreviewMessage {
  title: string
  link?: string
  description?: string // maybe html
  content?: string | {
    html?: string
    [k: string]: string
  }
}

export interface SourceListInnerLogicProps {
  onQuery: (arg: { path: string, payload: Record<string,any> }) => Promise<PreviewMessage[]>
  onSubmit: (source: RSSSource, arg: { path: string, payload: Record<string,any> }) => void
}

export default function sourceListInnerLogic (props: SourceListInnerLogicProps) {
  const currentSource = signal<RSSSource>(null)

  const sourcePreviewForm = signal<{
    path: string,
    payload: Record<string, string>
    fullContentPath?: string
  }>({
    path: '',
    payload: {} ,
    fullContentPath: ''
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

  after(() => {
    showSubmitConfirm(draft => {
      draft.visible = false
      draft.title = ''
    })
  }, [sourcePreviewForm])

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
    props.onSubmit(
      currentSource(),
      form
    );

    selectCurrentSource(null)
  })

  const expandablePreviewDescriptions = signal([])
  const toggleDescriptionExpandable = inputCompute((index: number) => {
    expandablePreviewDescriptions(draft => {
      draft[index] = !draft[index]
    })
  })

  return {
    expandablePreviewDescriptions,
    toggleDescriptionExpandable,
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