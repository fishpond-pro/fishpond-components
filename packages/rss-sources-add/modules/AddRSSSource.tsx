import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import showdown from 'showdown'
import { h, SignalProps, useLogic, CommandOP, extendModule, ConvertToLayoutTreeDraft2, createFunctionComponent } from '@polymita/renderer';
import * as BaseModule from '@polymita/rss-sources/dist/modules/RSSSourcePanel2'
import type BaseModuleLayout from '@polymita/rss-sources/dist/modules/RSSSourcePanel2.layout'
import { usePathname } from 'next/navigation';
import CardActions from '@mui/material/CardActions';
import Drawer from '@mui/material/Drawer';
import TextField from '@mui/material/TextField';
import Input from '@mui/material/Input';
import { useState } from 'react';
import { getParamsFromPath, getRSSPreviewURL } from '@/shared/utils'
import * as RSSParamsTable from './RSSParamsTable'

const RSSParamsTableComponent = createFunctionComponent(RSSParamsTable)

export interface AddRSSSourceProps {
  
}

function patchLogic(
  props: typeof BaseModule.meta.props & AddRSSSourceProps,
  prevLogicResult: ReturnType<typeof BaseModule.logic>,
) {
  const [drawerVisible, setDrawerVisible] = useState(false)

  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      [name]: value,
    }));
  };

  const handleSubmit = (event: Event) => {
    event.preventDefault();
    console.log(formValues); // 读取表单的值
  };

  return {
    ...prevLogicResult,
    drawerVisible,
    setDrawerVisible,
    formValues,
    handleInputChange,
    handleSubmit,
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
      formValues,
      handleInputChange,
      handleSubmit,
    } = useLogic<LogicReturn>()
    console.log('drawerVisible: ', drawerVisible);

    const path = usePathname();

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
          <Drawer
            anchor='right'
            open={drawerVisible}
            onClose={() => {
              setDrawerVisible(false)
            }}
            className='p-2'
          >
            <addBox className="px-4 w-[50vw]">
              <addDrawerHeader className="w-full py-2 flex items-center justify-between">
                <addTile>
                  {subGroup} - {title}
                </addTile>
                <Button onClick={handleSubmit} variant="contained" size="small">
                  Submit
                </Button>
              </addDrawerHeader>
              <Divider />
              <sourceUrl className="mt-4 flex items-center">
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
                        value={formValues[obj.name]}
                        onChange={handleInputChange}
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
            </addBox>
          </Drawer>
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