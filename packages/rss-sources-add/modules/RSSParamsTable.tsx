import { h, SignalProps, PropTypes, useLogic, ConvertToLayoutTreeDraft } from '@polymita/renderer';
import '@polymita/renderer/jsx-runtime';

export const name = 'RSSTable' as const
export let meta: {
  props: RSSTableProps,
  layoutStruct: RSSTableLayout
  patchCommands: []
}

export interface RSSTableProps {
  tables: string;
}

export const propTypes = {
}

export const logic = (props: SignalProps<RSSTableProps>) => {
  return {
  }
}
type LogicReturn = ReturnType<typeof logic>

export type RSSTableLayout = {
  type: 'RSSTableContainer',
  children: [
  ]
}

function rssTables (tables: string) {
  const rows = tables.split('\n')
  const header = rows[0].split(/\s|\|/g).filter(Boolean)
  const body = rows.slice(2).map(row => row.split(/\s|\|/g).filter(Boolean))

  return {
    header,
    body
  }
}

export const layout = (props: RSSTableProps) => {
  if (!props.tables) {
    return null
  }

  const { header, body } = rssTables(props.tables)
  return (
    <rssTableContainer className="block pb-2 max-w-full overflow-auto">
      <table className="border">
        <thead>
          <tr>
            {header.map((t, i) => (
              <th key={t+i} className="px-2 py-1">{t}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map(row => (
            <tr className="border-t">
              {row.map((t, i) => (
                <td key={t + i} className="px-2 py-1">{t}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </rssTableContainer>
  )
}

export const styleRules = (props: RSSTableProps, layout: ConvertToLayoutTreeDraft<RSSTableLayout>) => {
  return [
  ]
}

export const designPattern = (props: RSSTableProps, layout: ConvertToLayoutTreeDraft<RSSTableLayout>) => {
  const logic = useLogic<LogicReturn>()
  return {}
}
