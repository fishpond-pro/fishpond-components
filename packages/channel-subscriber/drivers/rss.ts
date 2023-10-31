import { RSSItem, RSSSource, genUniquePlatformKey, getRSSComplementURL } from '@/shared/utils'
export type { RSSItem, RSSSource } from '@/shared/utils'
import { getParamsFromPath } from '@/utils/index'
import {
  after,
  compose,
  computed,
  inputCompute,
  inputComputeInServer,
  prisma,
  signal,
  writePrisma,
} from '@polymita/signal-model'
import menusLogic from './menusLogic'
import { RSS, SubscribedChannel } from '@/models/indexesTypes'
import * as indexes from '@/models/indexes.json'

export interface PreviewMessage extends RSSItem{  
}

interface SubscribedChannelWithRss extends SubscribedChannel{
  rss?: RSS[]
}

export type SourceMenus = Array<{
  title: string
  children: string[]
}>

export interface RssSourceProps {
  onQueryRssSources: (arg: [string, string][]) => Promise<RSSSource[]>
  onQueryPreviews: (arg: { path: string, payload: Record<string,any> }) => Promise<PreviewMessage[]>
  onSubmit?: (
    platform: string,
    source: RSSSource,
    arg: { path: string, payload: Record<string,any> },
    previews: PreviewMessage[],
  ) => void
  onSelect: (v: [string, string][]) => void
  menus: SourceMenus
}

export default function rss (props: RssSourceProps) {
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
      const messages:PreviewMessage[] = yield props.onQueryPreviews({
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
    const rsshubURL = getRSSComplementURL(form);
    
    const previews = previewMessages()
    
    const channel = currentSource();
    const uniquePlatform = genUniquePlatformKey(channel);

    addChannel({
      source: {
        link: rsshubURL,
        platform: uniquePlatform,
        name: uniquePlatform,
      },
      previews,
    });

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

  const allRSSSources = computed<RSSSource[]>(function * () {
    const rows = menus.selectedSubGroups();
    if (rows.length === 0) {
      return [];
    };
    const json = yield props.onQueryRssSources(rows);
    return json
  })

  const subscribedChannels = prisma<SubscribedChannelWithRss[]>(indexes['subscribedChannel']);

  const writeSource = writePrisma(indexes['subscribedChannel'])

  const addChannel = inputComputeInServer(function * (params: {
    source: {
      name: string, link: string, platform: string
    },
    previews: RSSItem[]
  }) {
    console.log('[addChannel] params: ', params);
    const { source, previews } = params;

    yield writeSource.upsert(
      {
        channel: source.platform
      },
      {
        type: 0,
        channel: source.platform,
        rss: {
          create: {
            name: source.name,
            href: source.link,
          }
        },
    })        





  })

  return {
    menus,
    subscribed: subscribedChannels,
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
    addChannel,
    allRSSSources,
  }
};