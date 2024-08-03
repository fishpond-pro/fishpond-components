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
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { prisma, writePrisma } from '@polymita/next-connect';
import mi from '@/models/indexes.json'


const RSSParamsTableComponent = createFunctionComponent(RSSParamsTable)

export interface AddRSSSourceProps {
  onQueryPreviews: (v: string) => Promise<PreviewMessage[]>
}

function patchLogic(
  props: typeof BaseModule.meta.props & AddRSSSourceProps,
  prevLogicResult: ReturnType<typeof BaseModule.logic>,
) {
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [previewDrawerVisible, setPreviewDrawerVisible] = useState(false)
  const [dialogParams, setDialogParams] = useState({
    text: ''
  })

  const { onQueryPreviews } = useContext(queryContext)

  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const handleInputChange = (name: string, value: string) => {
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      [name]: value,
    }));
  };

  const [previewLoading, setPreviewLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)

  const [previewItems, setPreviewItems] = useState<PreviewMessage[]>([])

  const writeRSS = writePrisma(mi.rSS)

  const reset1 = () => {
    setPreviewDrawerVisible(false)
    setDrawerVisible(false)
    setFormValues({})
  }
  const reset2 = () => {
    setPreviewLoading(false)
    setSubmitLoading(false)
  }
  const reset3 = () => {
    setDialogParams({
      text: ''
    })
  }
  const handleSubmit = async (event: Event) => {
    setPreviewLoading(true);

    setDialogParams({
      text: 'load previews ...'
    })

    try {
      const destUrl = getRSSComplementURL({
        path: props.value.route.path,
        payload: formValues,
      })

      const previews = await onQueryPreviews(destUrl)

      setPreviewItems(previews)
      setPreviewDrawerVisible(true)

    } finally {
      setPreviewLoading(false)
      reset3();
    }
  };


  const confirmSubmit = async () => {
    setDialogParams({
      text: 'submit rss ...'
    })

    try {

      const destUrl = getRSSComplementURL({
        path: props.value.route.path,
        payload: formValues,
      })

      await writeRSS.create({
        name: props.value.title,
        href: destUrl,
      })

      reset1()
      reset2()

    } catch (e) {

    } finally {
      reset3();
    }
  }

  return {
    ...prevLogicResult,
    drawerVisible,
    setDrawerVisible,
    formValues,
    handleInputChange,
    handleSubmit,
    previewLoading,
    submitLoading,
    previewDrawerVisible, setPreviewDrawerVisible,
    previewItems, setPreviewItems,
    confirmSubmit,
    dialogParams,
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
      previewLoading,
      previewItems,
      confirmSubmit,
      dialogParams,
    } = useLogic<LogicReturn>()

    const { value } = props
    const { route, subGroup, title, tables } = value
  
    const urlParams = getParamsFromPath(route.path, route.paramsdesc)

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
                    loading={previewLoading}
                    onClick={handleSubmit} variant="contained" size="small"
                  >
                    Submit
                  </LoadingButton>
                </addDrawerHeader>
                <Divider />
                <sourceBox className="mt-4 flex-1 overflow-auto" >
                  <sourceTitle className="flex items-center mb-2 w-1/2 ">
                    <sourcePreviewFormLabel className="inline-block w-[60px] text-right">标题：</sourcePreviewFormLabel>
                    <Input 
                      className='flex-1' 
                      value={formValues.title || title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                    />
                  </sourceTitle>
                  <sourceUrl className="flex items-center mb-2  w-1/2">
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
                            onChange={e => handleInputChange(e.target.name, e.target.value)}
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
                    loading={previewLoading}
                    onClick={confirmSubmit} variant="contained" size="small"
                  >
                    Confirm Submit
                  </LoadingButton>
                </addDrawerHeader>
                <Divider />
                <previewResult className="mt-4 flex-1 overflow-auto">
                  <List>
                    {previewItems.map((item, index) => {
                      return (
                        <ListItem>
                          <ListItemText primary={`${index + 1}.${item.title}`} />
                          <a href={item.link} target="_blank" className="hover:underline text-blue-500">
                            [link]
                          </a>
                        </ListItem>
                      )
                    })}
                  </List>
                </previewResult>
              </previewBox>
            </Drawer>
            <Dialog
              open={!!dialogParams.text}
            >
              <DialogContent>
                <DialogContentText>
                  {dialogParams.text}
                </DialogContentText>
              </DialogContent>
            </Dialog>
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