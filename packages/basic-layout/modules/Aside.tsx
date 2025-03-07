import { h, SignalProps, PropTypes, useLogic, ConvertToLayoutTreeDraft, VirtualLayoutJSON } from '@polymita/renderer';
import { getDynamicRoutes } from '@polymita/next-connect'
import '@polymita/renderer/jsx-runtime'
import { Link } from 'react-router-dom'

export const name = 'Aside' as const
export const namespace = 'components' as const
export const base = undefined
export let meta: {
  props: AsideProps,
  layoutStruct: AsideLayout
  patchCommands: []
}

export interface AsideProps {
  children?: any;
  title?: string;
}

export const propTypes = {
}

export const logic = (props: SignalProps<AsideProps>) => {
  return {
    logicName: '123'
  }
}
type LogicReturn = ReturnType<typeof logic>

export type AsideLayout = {
  type: 'asideContainer',
  children: [
  ]
}
export const layout = (props: AsideProps): VirtualLayoutJSON => {
  const logic = useLogic<LogicReturn>();
  const { title } = props;
  
  const routes = getDynamicRoutes();

  return (
    <asideContainer className="block flex-1 h-full">
      <asideName className="block m-4 text-xl font-bold">{title}</asideName>
      <asideMenuContainer className="block mt-6 mx-2">
        {routes.filter(r => !r.hidden).map((route) => {
          const toPath = route.path.startsWith('/') ? route.path : `/${route.path}`;
          return (
            <sideMenuItem className="block mb-2">
              <Link to={toPath}>
                <sideMenuMainItem key={toPath} className="block hover:bg-gray-200 p-2 rounded-md">
                  {route.title}
                </sideMenuMainItem>
              </Link>
              {route.children?.map((child) => {
                return (
                  <Link to={child.path}>
                    <sideMenuSubItem key={child.path} className="block ml-4 hover:bg-gray-200 p-2 rounded-md">
                      {child.title}
                    </sideMenuSubItem>
                  </Link>
                )
              })}
            </sideMenuItem>
          )
        })}
      </asideMenuContainer>
    </asideContainer>
  )
}

export const styleRules = (props: AsideProps, layout: ConvertToLayoutTreeDraft<AsideLayout>) => {
  return [
  ]
}

export const designPattern = (props: AsideProps, layout: ConvertToLayoutTreeDraft<AsideLayout>) => {
  const logic = useLogic<LogicReturn>()
  return {}
}
