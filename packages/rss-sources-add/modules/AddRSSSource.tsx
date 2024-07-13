import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import showdown from 'showdown'
import { h, SignalProps, useLogic, CommandOP, extendModule, ConvertToLayoutTreeDraft2, createFunctionComponent } from '@polymita/renderer';
import * as BaseModule from '@polymita/rss-sources/dist/modules/RSSSourcePanel2'
import type { PreviewMessage } from '@polymita/rss-sources/dist/signals/signals/rss'
import type BaseModuleLayout from '@polymita/rss-sources/dist/modules/RSSSourcePanel2.layout'
import { usePathname } from 'next/navigation';
import CardActions from '@mui/material/CardActions';
import Drawer from '@mui/material/Drawer';
import TextField from '@mui/material/TextField';
import Input from '@mui/material/Input';
import { useContext, useState } from 'react';
import { getParamsFromPath, getRSSComplementURL, getRSSPreviewURL } from '@/shared/utils'
import * as RSSParamsTable from './RSSParamsTable'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { queryContext } from '@/contexts/QueryContext'

const RSSParamsTableComponent = createFunctionComponent(RSSParamsTable)

export interface AddRSSSourceProps {
  onQueryPreviews: (v: string) => Promise<PreviewMessage[]>
}

function patchLogic(
  props: typeof BaseModule.meta.props & AddRSSSourceProps,
  prevLogicResult: ReturnType<typeof BaseModule.logic>,
) {
  console.log('props: ', props);
  const [drawerVisible, setDrawerVisible] = useState(false)

  const [previewDrawerVisible, setPreviewDrawerVisible] = useState(false)

  const { onQueryPreviews } = useContext(queryContext)

  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      [name]: value,
    }));
  };

  const [submitLoading, setSubmitLoading] = useState(false)

  const [previewItems, setPreviewItems] = useState<PreviewMessage[]>([])

  const handleSubmit = async (event: Event) => {
    setSubmitLoading(true);

    try {
      const destUrl = getRSSComplementURL({
        path: props.value.route.path,
        payload: formValues,
      })
      console.log('destUrl: ', destUrl);

      const previews = await onQueryPreviews(destUrl)
      console.log('previews: ', previews);

      setPreviewItems(previews)
      setPreviewDrawerVisible(true)

    } finally {
      setSubmitLoading(false)
    }
  };

  return {
    ...prevLogicResult,
    drawerVisible,
    setDrawerVisible,
    formValues,
    handleInputChange,
    handleSubmit,
    submitLoading,
    previewDrawerVisible, setPreviewDrawerVisible,
    previewItems, setPreviewItems
  }
}

type LogicReturn = ReturnType<typeof patchLogic>

const NewModule = extendModule(BaseModule, () => ({
  patchLogic,
  patchLayout(
    props: typeof BaseModule.meta.props & AddRSSSourceProps,
    root: ConvertToLayoutTreeDraft2<BaseModuleLayout.LayoutTypes>
  ) {
    const { 
      setDrawerVisible, drawerVisible,
      previewDrawerVisible, setPreviewDrawerVisible,
      formValues,
      handleInputChange,
      handleSubmit,
      submitLoading,
      previewItems,
    } = useLogic<LogicReturn>()
    console.log('drawerVisible: ', drawerVisible);

    const { value } = props
    const { route, subGroup, title, tables } = value
    console.log('route, subGroup: ', value);
  
    const urlParams = getParamsFromPath(route.path, route.paramsdesc)
    console.log('params: ', urlParams);    

    const previewPath = getRSSPreviewURL({
      path: route.path,
      payload: formValues,
    });


    return [
      {
        op: CommandOP.addChild,
        target: root.Card,
        child: (
          <CardActions>
            <Button size="small" onClick={(e) => {
              setDrawerVisible(v => !v)
            }}>Add</Button>
          </CardActions>
        ),
      },
      {
        op: CommandOP.addChild,
        target: root.Card,
        child: (
          <drawerContainer>
            <Drawer
              anchor='right'
              open={drawerVisible}
              onClose={() => {
                setDrawerVisible(false)
              }}
              className='p-2'
            >
              <addBox className="px-4 w-[70vw] h-full flex flex-col">
                <addDrawerHeader className="w-full py-2 flex items-center justify-between">
                  <addTile>
                    {subGroup} - {title}
                  </addTile>
                  <LoadingButton 
                    loading={submitLoading}
                    onClick={handleSubmit} variant="contained" size="small"
                  >
                    Submit
                  </LoadingButton>
                </addDrawerHeader>
                <Divider />
                <sourceBox className="mt-4 flex-1 overflow-auto" >
                  <sourceUrl className="flex items-center">
                    <sourcePreviewFormLabel className="inline-block w-[60px] text-right">route：</sourcePreviewFormLabel>
                    <Input className='flex-1' value={previewPath} disabled />
                  </sourceUrl>
                  <sourcePreviewParams className="flex border-slate-100 mt-4">
                    <sourcePreviewFormLabel className="inline-block w-[60px] text-right">参数：</sourcePreviewFormLabel>
                    <sourcePreviewFormForm>
                      {urlParams.map((obj) => (
                        <sourcePreviewFormItem className="flex items-center mb-2" key={obj.name}>
                          <TextField 
                            label={obj.name}
                            name={obj.name}
                            defaultValue={formValues[obj.name]}
                            onChange={handleInputChange}
                            required={!obj.optional}
                            size='small'
                          />
                          <sourcePreviewFormDesc className="ml-2 text-xs text-slate-400">
                            {obj.desc}
                          </sourcePreviewFormDesc>
                        </sourcePreviewFormItem>
                      ))}
                    </sourcePreviewFormForm>
                  </sourcePreviewParams>
                  <addContent className="block py-2">
                    {value.tables?.filter(Boolean).map(table => {
                      return (
                        <RSSParamsTableComponent
                          key={table}
                          tables={table}
                        />
                      )
                    })}
                  </addContent>
                  <sourceParamTips className="block mt-2 p-4 bg-slate-200">
                    {value?.tipsMarkDown.map(tip => {
                      const converter = new showdown.Converter();
                      const html = converter.makeHtml(tip);
                      return (
                        <div className="break-all mb-2" _html={html}></div>                    
                      )
                    })}
                  </sourceParamTips>
                </sourceBox>
              </addBox>
            </Drawer>
            <Drawer
              anchor='right'
              open={previewDrawerVisible}
              onClose={() => {
                setPreviewDrawerVisible(false)
              }}
              className='p-2'            
            >
              <previewBox className="px-4 w-[65vw] h-full flex flex-col">
                <addDrawerHeader className="w-full py-2 flex items-center justify-between">
                  <addTile>
                    Preview
                  </addTile>
                  <LoadingButton 
                    loading={submitLoading}
                    onClick={handleSubmit} variant="contained" size="small"
                  >
                    Confirm Submit
                  </LoadingButton>
                </addDrawerHeader>
                <Divider />
                <previewResult className="mt-4 flex-1 overflow-auto">
                  <List>
                    {previewItems.map(item => {
                      return (
                        <ListItem>
                          <ListItemText primary={item.title} />
                        </ListItem>
                      )
                    })}
                  </List>
                </previewResult>
              </previewBox>
            </Drawer>
          </drawerContainer>
        )
      }
    ]
  }
}))

export const meta = NewModule.meta
export const base = NewModule.base
export const name = 'AddRSSSource'
export const namespace = NewModule.namespace
//
export const override = NewModule.override
export const layout = NewModule.layout
export const logic = NewModule.logic
export const designPattern = NewModule.designPattern
export const designPatterns = NewModule.designPatterns
export const styleRules = NewModule.styleRules