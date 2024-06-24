'use client'

import { useEffect, useMemo, useState } from "react"

export type SourceMenus = Array<{
  title: string
  children: string[]
}>

export interface MenusLogicProps {
  onSelect: (v: [string, string][]) => void
  menus: SourceMenus
}

export default function menusLogic (props: MenusLogicProps) {
  const [allMenus, innerSetAllMenus] = useState(props.menus);

  const [selectedGroups, setSelectedGroups] = useState<string[]>([props.menus[0]?.title]);

  const selectGroup = (title: string) => {
    setSelectedGroups(draft => {
      const index = draft.indexOf(title)
      if (index > -1) {
        draft.splice(index, 1)
      } else {
        draft.push(title)
      }
      return draft.slice()
    })
  }

  const groupRows = useMemo(() => {
    const groups = allMenus;
    const selected = selectedGroups
    const r = groups.filter(item => {
      return selected.length <= 0 || selected.includes(item.title)
    })
    console.log('[groupRows]r: ', r);
    return r;
  }, [allMenus, selectedGroups])

  const [selectedSubGroups, setSelectedSubGroups] = useState<[string, string][]>([
    [props.menus[0]?.title, props.menus[0]?.children[0]]
  ])

  const selectSubGroup = (group: string, subGroup: string) => {
    setSelectedSubGroups(draft => {
      const i = draft.findIndex(([g, s]) => g === group && s === subGroup);
      if (i > -1) {
        draft.splice(i, 1)
      } else {
        draft.push([group, subGroup])
      }
      return draft.slice()
    })
  }


  function setAllMenus (menus: SourceMenus) {
    innerSetAllMenus(menus);
    setSelectedGroups([menus[0]?.title].filter(Boolean));
    if (menus.length > 0) {
      setSelectedSubGroups(
        [[
        menus[0]?.title,
        menus[0]?.children[0]
      ]]);
    } else{
      setSelectedSubGroups([]);
    }
  }

  useEffect(() => {
    props.onSelect?.(selectedSubGroups)
  }, [selectedSubGroups])

  // useEffect(() => {
  //   props.onSelect?.(selectedSubGroups)

  //   setAllMenus(props.menus);
  // }, [])

  return {
    allMenus,
    setAllMenus,
    selectedGroups,
    selectedSubGroups,
    groupRows,
    selectGroup,
    selectSubGroup,
  }
}