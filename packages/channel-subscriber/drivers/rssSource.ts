import { RSSItem, RSSSource, genUniquePlatformKey } from '@/shared/utils'
import { getParamsFromPath } from '@/utils/index'
import {
  after,
  compose,
  computed,
  inputCompute,
  signal,
} from '@polymita/signal-model'
import menusLogic from './menusLogic'


export interface PreviewMessage extends RSSItem{  
}

export type SourceMenus = Array<{
  title: string
  children: string[]
}>

export interface RssSourceProps {
  onQuery: (arg: { path: string, payload: Record<string,any> }) => Promise<PreviewMessage[]>
  onSubmit?: (
    platform: string,
    source: RSSSource,
    arg: { path: string, payload: Record<string,any> },
    previews: PreviewMessage[],
  ) => void
  onSelect: (v: [string, string][]) => void
  menus: SourceMenus
}

export default function rssSource (props: RssSourceProps) {
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
      previewMessages(() => [])
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
    const previews = previewMessages()
    const channel = currentSource();
    const key = genUniquePlatformKey(channel)
    props.onSubmit(
      key,
      channel,
      form,
      previews,
    );

    selectCurrentSource(null)
  })

  const expandablePreviewDescriptions = signal([])
  const toggleDescriptionExpandable = inputCompute((index: number) => {
    expandablePreviewDescriptions(draft => {
      draft[index] = !draft[index]
    })
  })

  const menus = compose(menusLogic, [{
    onSelect: props.onSelect,
    menus: props.menus,
  }])

  return {
    menus,
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
};