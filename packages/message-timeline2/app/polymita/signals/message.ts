import {
  inputCompute,
  inputComputeInServer,
  prisma,
  signal,
  state,
} from "@polymita/signal-model";
import indexes from "@/models/indexes.json";

/**
 * Model Content
 *
 */
export type MessageContent = {
  id: number;
  title: string;
  description: string;
  content: string;
  messageId: number;
  createdAt: Date;
  modifiedAt: Date;

  message?: MessageItem;
};

export default function message() {
  const params = signal<{
    messageId: number;
    channelRecordId: number;
    size: number;
  }>({
    messageId: undefined,
    channelRecordId: undefined,
    size: 50,
  });

  const messages = prisma<MessageItem[]>(indexes.message, () => {
    const payload = params();

    return {
      orderBy: {
        createdAt: "desc",
      },
      where: {
        id: payload.messageId,
        channelRecordId: payload.channelRecordId,
      },
      take: payload.size,
      include: {
        channelRecord: true,
      },
    };
  });

  const queryMessageByChannelRecord = inputComputeInServer(function* (
    id: number,
  ) {
    params((draft) => {
      Object.assign(draft, {
        messageId: undefined,
        channelRecordId: id,
      });
    });
  });
  const queryMessageByMessageId = inputComputeInServer(function* (id: number) {
    params((draft) => {
      Object.assign(draft, {
        messageId: id,
        channelRecordId: undefined,
      });
    });
  });

  const queryMessageAll = inputComputeInServer(function* () {
    params((draft) => {
      Object.assign(draft, {
        messageId: undefined,
        channelRecordId: undefined,
      });
    });
  });

  const currentMessageItemId = signal<number>(null);

  const currentMessageItem = signal<MessageItem | null>(() => {
    const id = currentMessageItemId();
    return id
      ? messages().find((item) => {
          return item.id === id;
        })
      : null;
  });

  const selectMessage = inputCompute((mc: MessageItem) => {
    currentMessageItemId(() => {
      return mc.id;
    });
  });

  return {
    queryMessageByChannelRecord,
    queryMessageByMessageId,
    queryMessageAll,
    selectMessage,
    currentMessageItem,
    messages,
  };
}

/**. auto generated */
// location at:/Users/zhouyunge/Documents/fishpond-desktop-workspace/packages/fishpond-components/packages/message-timeline2/app/polymita/signals/message.ts
const autoParser1711802407123_0 = {
  message: {
    names: [
      [0, "params"],
      [1, "messages"],
      [2, "queryMessageByChannelRecord"],
      [3, "queryMessageByMessageId"],
      [4, "queryMessageAll"],
      [5, "currentMessageItemId"],
      [6, "currentMessageItem"],
      [7, "selectMessage"],
    ],
    deps: [
      ["h", 1, [0]],
      ["ic", 2, [], [0]],
      ["ic", 3, [], [0]],
      ["ic", 4, [], [0]],
      ["h", 6, [5, 1]],
      ["ic", 7, [], [5]],
    ],
  },
};
Object.assign(message, {
  __deps__: autoParser1711802407123_0.message.deps,
  __names__: autoParser1711802407123_0.message.names,
  __name__: "message",
  __namespace__: "@polymita/message-timeline2",
});
/** auto generated .*/
