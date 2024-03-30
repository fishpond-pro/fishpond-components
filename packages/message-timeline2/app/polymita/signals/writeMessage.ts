import {
  compose,
  injectModel,
  inputComputeInServer,
  prisma,
  state,
  writePrisma,
} from "@polymita/signal-model";
import indexes from "@/models/indexes.json";
import messageDriver, { MessageContent } from "./message";

export default function writeMessage() {
  const { messages } = compose(messageDriver);

  // source
  const sourceModel = prisma<ChannelRecord[]>(indexes.channelRecord);

  const writeChannelRecord = writePrisma(sourceModel);
  const saveChannelRecord = inputComputeInServer(
    async (param: ChannelRecord) => {
      if (param.id) {
        await writeChannelRecord.update(param.id, param);
      } else {
        await writeChannelRecord.create(param);
      }
    },
  );

  // message
  const messageModel = prisma<MessageItem[]>(indexes.message);
  const writeMessage = writePrisma(messageModel);
  const saveMessage = inputComputeInServer(async (param: MessageItem) => {
    if (param.id) {
      await writeMessage.update(param.id, param);
    } else {
      await writeMessage.create(param);
    }
  });

  // content
  const contentModel = prisma<MessageContent[]>(indexes.messageContent);
  const writeMessageContent = writePrisma(contentModel);
  const saveMessageContent = inputComputeInServer(
    async (param: MessageContent) => {
      if (param.id) {
        await writeMessageContent.update(param.id, param);
      } else {
        await writeMessageContent.create(param);
      }
    },
  );

  return {
    messages,
    saveChannelRecord,
    saveMessage,
    saveMessageContent,
  };
}
/**. auto generated */
// location at:/Users/zhouyunge/Documents/fishpond-desktop-workspace/packages/fishpond-components/packages/message-timeline2/app/polymita/signals/writeMessage.ts
const autoParser1711802407123_1 = {
  writeMessage: {
    names: [
      [0, "sourceModel"],
      [1, "writeChannelRecord"],
      [2, "saveChannelRecord"],
      [3, "messageModel"],
      [4, "writeMessage2"],
      [5, "saveMessage"],
      [6, "contentModel"],
      [7, "writeMessageContent"],
      [8, "saveMessageContent"],
    ],
    deps: [
      ["ic", 1, [], [0]],
      ["ic", 2, [], [1]],
      ["ic", 4, [], [3]],
      ["ic", 5, [], [4]],
      ["ic", 7, [], [6]],
      ["ic", 8, [], [7]],
    ],
  },
};
Object.assign(writeMessage, {
  __deps__: autoParser1711802407123_1.writeMessage.deps,
  __names__: autoParser1711802407123_1.writeMessage.names,
  __name__: "writeMessage",
  __namespace__: "@polymita/message-timeline2",
});
/** auto generated .*/
