import {
  after,
  onMount,
  signal,
} from '@polymita/signal'

export type SourceMenus = Array<{
  title: string
  children: string[]
}>

export interface MenusLogicProps {
  onSelect: (v: [string, string][]) => void
  menus: SourceMenus
}

export default function menusLogic (props: MenusLogicProps) {
  const allMenus = signal(props.menus);

  const selectedGroups = signal<string[]>([]);

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
    const groups = allMenus();
    const selected = selectedGroups()
    const r = groups.filter(item => {
      return selected.length <= 0 || selected.includes(item.title)
    })
    console.log('[groupRows]r: ', r);
    return r;
  })

  const selectedSubGroups = signal<[string, string][]>([])

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

  after(() => {
    props.onSelect?.(selectedSubGroups())
  }, [selectedSubGroups])

  function setAllMenus (menus: SourceMenus) {
    allMenus(menus);
    selectedGroups([menus[0]?.title].filter(Boolean));
    if (menus.length > 0) {
      selectedSubGroups(
        [[
        menus[0]?.title,
        menus[0]?.children[0]
      ]]);
    } else{
      selectedSubGroups([]);
    }
  }

  onMount(() => {
    props.onSelect?.(selectedSubGroups())

    setAllMenus(props.menus);
  })

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