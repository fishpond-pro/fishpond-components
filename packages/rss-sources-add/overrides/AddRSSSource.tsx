import { Divider } from '@mui/material';
import { Button } from '@mui/material';
import showdown from 'showdown'
import { h, SignalProps, useLogic, CommandOP, extendModule, ConvertToLayoutTreeDraft2, createFunctionComponent } from '@polymita/renderer';
import * as rs from '@polymita/rss-sources'
import type { PreviewMessage } from '@polymita/rss-sources/dist/signals/signals/rss'
import type RSSSourcePanel2Layout from '@polymita/rss-sources/dist/modules/RSSSourcePanel2.layout'
import { CardActions } from '@mui/material';
import { Drawer } from '@mui/material';
import { TextField } from '@mui/material';
import { Input } from '@mui/material';
import { useContext, useState } from 'react';
import { getParamsFromPath, getRSSComplementURL, getRSSPreviewURL, toRSS_JSON } from '@/shared/utils'
import * as RSSParamsTable from '@/modules/RSSParamsTable'
import { List } from '@mui/material';
import { ListItem } from '@mui/material';
import { ListItemText } from '@mui/material';
import { Dialog } from '@mui/material';
import { DialogContent } from '@mui/material';
import { DialogContentText } from '@mui/material';
import { writePrisma } from '@polymita/next-connect';
import mi from '@/models/indexes.json'

const RSSParamsTableComponent = createFunctionComponent(RSSParamsTable)

export interface AddRSSSourceProps {
  onQueryPreviews: (v: string) => Promise<PreviewMessage[]>
}

function patchLogic(
  props: typeof rs.modules.RSSSourcePanel2.meta.props & AddRSSSourceProps,
  prevLogicResult: ReturnType<typeof rs.modules.RSSSourcePanel2.logic>,
) {
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [previewDrawerVisible, setPreviewDrawerVisible] = useState(false)
  const [dialogParams, setDialogParams] = useState({
    text: ''
  })

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
  const handleSubmit = async () => {
    setPreviewLoading(true);

    setDialogParams({
      text: 'load previews ...'
    })

    try {
      const destQueryPath = getRSSComplementURL({
        path: props.value.route.path,
        payload: formValues,
      })

      const previews = await fetch(`/third_part/rsshub${destQueryPath}`)
        .then(res => res.text())
        .then(xml => toRSS_JSON(xml).item)

      setPreviewItems((previews))
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
        name: formValues.title || props.value.title,
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

const NewModule = extendModule(rs.modules.RSSSourcePanel2, () => ({
  patchLogic,
  patchLayout(
    props: typeof rs.modules.RSSSourcePanel2.meta.props & AddRSSSourceProps,
    root: ConvertToLayoutTreeDraft2<RSSSourcePanel2Layout.LayoutTypes>
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
                  <Button 
                    onClick={handleSubmit} variant="contained" size="small"
                  >
                    Submit {previewLoading ? '...' : ''}
                  </Button>
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
                  <Button 
                    onClick={confirmSubmit} variant="contained" size="small"
                  >
                    Confirm Submit {previewLoading ? '...' : ''}
                  </Button>
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