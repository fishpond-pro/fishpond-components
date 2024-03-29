import {
  RSSItem,
  RSSSource,
  genUniquePlatformKey,
  getRSSComplementURL,
} from "@/shared/utils";
export type { RSSItem, RSSSource } from "@/shared/utils";
import { getParamsFromPath } from "@/utils/index";
import {
  ComputedSignal,
  after,
  compose,
  computed,
  inputCompute,
  inputComputeInServer,
  prisma,
  signal,
  writePrisma,
} from "@polymita/signal-model";
import menusLogic from "./menusLogic";
import indexes from "@/models/indexes.json";
import { SubscribedChannelWithForm } from "@/shared/types";

export interface PreviewMessage extends RSSItem {}

export type SourceMenus = Array<{
  title: string;
  children: string[];
}>;

export interface RssSourceProps {
  onQueryRssSources: (arg: [string, string][]) => Promise<RSSSource[]>;
  onQueryPreviews: (arg: {
    path: string;
    payload: Record<string, any>;
  }) => Promise<PreviewMessage[]>;
  onSubmit?: (
    platform: string,
    source: RSSSource,
    arg: { path: string; payload: Record<string, any> },
    previews: PreviewMessage[],
  ) => void;
  onSelect: (v: [string, string][]) => void;
  menus: SourceMenus;
  subscribed: ComputedSignal<SubscribedChannelWithForm[]>;
}

export default function rss(props: RssSourceProps) {
  const currentSource = signal<RSSSource>(null);

  const sourcePreviewForm = signal<{
    path: string;
    payload: Record<string, string>;
    fullContentPath?: string;
  }>({
    path: "",
    payload: {},
    fullContentPath: "",
  });

  const selectCurrentSource = inputCompute((source?: RSSSource) => {
    currentSource(source);

    if (source) {
      const params = getParamsFromPath(
        source.route.path,
        source.route.paramsdesc,
      );

      sourcePreviewForm((draft) => {
        draft.path = source.route.path;
        params.forEach((obj) => {
          draft.payload[obj.name] = "";
        });
      });
    } else {
      sourcePreviewForm((draft) => {
        draft.path = "";
        draft.payload = {};
      });
      previewMessages(() => []);
    }
  });

  function resetSourcePreviewForm() {
    sourcePreviewForm((draft) => {
      draft.path = "";
      Object.keys(draft.payload).forEach((k) => {
        draft.payload[k] = "";
      });
    });
  }

  function checkDuplicate() {
    const form = sourcePreviewForm();
  }

  after(() => {
    showSubmitConfirm((draft) => {
      draft.visible = false;
      draft.title = "";
    });
  }, [sourcePreviewForm]);

  const previewMessages = signal<PreviewMessage[]>([]);

  const error = signal("");

  const queryPreview = inputCompute(function* () {
    const { path, payload } = sourcePreviewForm();
    try {
      const messages: PreviewMessage[] = yield props.onQueryPreviews({
        path,
        payload,
      });
      previewMessages(messages);
    } catch (e) {
      error(e.message);
    }
  });

  const showSubmitConfirm = signal({
    visible: false,
    title: "",
  });

  const submit = inputCompute(() => {
    const messages = previewMessages();
    if (messages.length <= 0) {
      showSubmitConfirm((draft) => {
        draft.visible = true;
        draft.title = "Sure to submit?";
      });
      return;
    }

    secondConfirmSubmit();
  });
  const secondConfirmSubmit = inputCompute(() => {
    showSubmitConfirm((draft) => {
      draft.visible = false;
    });
    const form = sourcePreviewForm();
    const rsshubURL = getRSSComplementURL(form);

    const previews = previewMessages();

    const channel = currentSource();
    const uniquePlatform = genUniquePlatformKey(channel);

    addChannel({
      source: {
        link: rsshubURL,
        platform: uniquePlatform,
        name: channel.title,
      },
      previews,
    });

    selectCurrentSource(null);
  });

  const expandablePreviewDescriptions = signal([]);
  const toggleDescriptionExpandable = inputCompute((index: number) => {
    expandablePreviewDescriptions((draft) => {
      draft[index] = !draft[index];
    });
  });

  const menus = compose(menusLogic, [
    {
      onSelect: props.onSelect,
      menus: props.menus,
    },
  ]);

  const allRSSSources = computed<RSSSource[]>(function* () {
    const rows = menus.selectedSubGroups();
    if (rows.length === 0) {
      return [];
    }
    const json = yield props.onQueryRssSources(rows);
    return json;
  });

  const writeSource = writePrisma(indexes["subscribedChannel"]);

  const addChannel = inputComputeInServer(function* (params: {
    source: {
      name: string;
      link: string;
      platform: string;
    };
    previews: RSSItem[];
  }) {
    console.log("[addChannel] params: ", params);
    const { source, previews } = params;

    yield writeSource.upsert(
      {
        channel: source.platform,
      },
      {
        type: 0,
        channel: source.platform,
        rss: {
          create: {
            name: source.name,
            href: source.link,
          },
        },
      },
    );
  });

  return {
    menus,
    expandablePreviewDescriptions,
    toggleDescriptionExpandable,
    currentSource,
    sourcePreviewForm,
    selectCurrentSource,
    queryPreview,
    previewMessages,
    resetSourcePreviewForm,
    submit,
    secondConfirmSubmit,
    showSubmitConfirm,
    addChannel,
    allRSSSources,
  };
}
/**. auto generated */
// location at:/Users/zhouyunge/Documents/fishpond-desktop-workspace/packages/fishpond-components/packages/channel-subscriber/app/polymita/signals/rss.ts
const autoParser1711647882955_2 = {
  rss: {
    names: [
      [0, "currentSource"],
      [1, "sourcePreviewForm"],
      [2, "selectCurrentSource"],
      [3, "previewMessages"],
      [4, "error"],
      [5, "queryPreview"],
      [6, "showSubmitConfirm"],
      [7, "submit"],
      [8, "secondConfirmSubmit"],
      [9, "expandablePreviewDescriptions"],
      [10, "toggleDescriptionExpandable"],
      [11, "allRSSSources"],
      [12, "writeSource"],
      [13, "addChannel"],
    ],
    deps: [
      ["ic", 2, [], [0, 1, 3]],
      ["ic", 5, [1], [3, 4]],
      ["ic", 7, [3], [6, 8]],
      ["ic", 8, [1, 3, 0], [6, 13, 2]],
      ["ic", 10, [], [9]],
      ["h", 11, [["c", 0, "selectedSubGroups"]]],
      ["ic", 13, [], [12]],
    ],
  },
};
Object.assign(rss, {
  __deps__: autoParser1711647882955_2.rss.deps,
  __names__: autoParser1711647882955_2.rss.names,
  __name__: "rss",
  __namespace__: "@polymita/channel-subscriber",
});
/** auto generated .*/
