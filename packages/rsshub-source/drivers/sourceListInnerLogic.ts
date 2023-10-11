import { RSSItem } from '@/shared/utils'
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

export interface PreviewMessage extends RSSItem{  
}

export type SourceMenus = Array<{
  title: string
  children: string[]
}>

export interface SourceListInnerLogicProps {
  onQuery: (arg: { path: string, payload: Record<string,any> }) => Promise<PreviewMessage[]>
  onSubmit: (
    source: RSSSource,
    arg: { path: string, payload: Record<string,any> },
    previews: PreviewMessage[],
  ) => void
  menus: SourceMenus
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
    props.onSubmit(
      currentSource(),
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

  const selectedGroups = signal<string[]>([props.menus[0].title]);

  const selectGroup = (title: string) => {
    selectedGroups(draft => {
      const index = draft.indexOf(title)
      if (index > -1) {
        draft.splice(index, 1)
      } else {
        draft.push(title)
      }
    })
  }

  const groupRows = signal(() => {
    const groups = props.menus
    const selected = selectedGroups()
    return groups.filter(item => {
      return selected.length <= 0 || selected.includes(item.title)
    })
  })

  const selectedSubGroups = signal<[string, string][]>([
    [groupRows[0].title, groupRows[0].children[0]]
  ])

  const selectSubGroup = (group: string, subGroup: string) => {
    selectedSubGroups(draft => {
      const i = draft.findIndex(([g, s]) => g === group && s === subGroup);
      if (i > -1) {
        draft.splice(i, 1)
      } else {
        draft.push([group, subGroup])
      }
    })
  }
  
  return {
    menus: {
      selectedGroups,
      selectedSubGroups,
      groupRows,
      selectGroup,
      selectSubGroup,
    },
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