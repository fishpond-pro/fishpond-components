'use client'

import { RSSItem, RSSSource } from '../shared/utils'
export type { RSSItem, RSSSource } from '../shared/utils'
import { getParamsFromPath } from '../shared/utils';
import menusLogic from './menusLogic'
import { SubscribedChannelWithForm } from '../shared/types'
import { useEffect, useMemo, useState } from 'react';

export interface PreviewMessage extends RSSItem{  
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
  subscribed: SubscribedChannelWithForm[]
}

export default function rss (props: RssSourceProps) {
  const [currentSource, setCurrentSource] = useState<RSSSource>(null)

  const [sourcePreviewForm, setSourcePreviewForm] = useState<{
    path: string,
    payload: Record<string, string>
    fullContentPath?: string
  }>({
    path: '',
    payload: {} ,
    fullContentPath: ''
  })

  const selectCurrentSource = (source?: RSSSource) => {
    setCurrentSource(source)

    if (source) {
      const params = getParamsFromPath(source.route.path, source.route.paramsdesc)
  
      setSourcePreviewForm(draft => {
        draft.path = source.route.path;
        params.forEach(obj => {
          draft.payload[obj.name] = ''
        })
        return {...draft}
      })
    } else {
      setSourcePreviewForm(draft => {
        return {
          ...draft,
          path:'',
          payload: {}
        }
      })
      setPreviewMessages(() => [])
    }
  };

  function resetSourcePreviewForm () {
    setSourcePreviewForm(draft => {
      draft.path = '';
      Object.keys(draft.payload).forEach(k => {
        draft.payload[k] = ''
      })
      return {...draft}
    })
  }

  useEffect(() => {
    setShowSubmitConfirm(draft => {
      draft.visible = false
      draft.title = ''
      return {...draft}
    })
  }, [sourcePreviewForm])

  const [previewMessages, setPreviewMessages] = useState<PreviewMessage[]>([])

  const [error, setError] = useState('')

  const queryPreview = async function () {
    const { path, payload } = sourcePreviewForm
    try {
      const messages:PreviewMessage[] = await props.onQueryPreviews({
        path,
        payload
      })
      setPreviewMessages(messages)
    } catch (e) {
      setError(e.message)
    }
  }

  const [showSubmitConfirm, setShowSubmitConfirm] = useState({
    visible: false,
    title: '',
  })

  const [expandablePreviewDescriptions, setExpandablePreviewDescriptions] = useState([])
  const toggleDescriptionExpandable = (index: number) => {
    setExpandablePreviewDescriptions(draft => {
      draft[index] = !draft[index]
      return draft.slice()
    })
  }

  const menus = menusLogic({
    onSelect: props.onSelect,
    menus: props.menus,
  })

  const [allRSSSources, setAllRSSSources] = useState([])
  useEffect(function () {
    const rows = menus.selectedSubGroups;
    if (rows.length !== 0) {
      props.onQueryRssSources(rows).then(json => {
        setAllRSSSources(json)
      });
    };
  }, [menus.selectedSubGroups])

  return {
    menus,
    expandablePreviewDescriptions,
    toggleDescriptionExpandable,
    currentSource,
    sourcePreviewForm,
    setSourcePreviewForm,
    selectCurrentSource,
    queryPreview,
    previewMessages,
    resetSourcePreviewForm,
    showSubmitConfirm,
    allRSSSources,
  }
};