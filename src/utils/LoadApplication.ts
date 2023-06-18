import readXlsxFile from "read-excel-file";
import { MessageButton, MessageItem } from "./types";

/**
 * function that returns a object representing a message item
 * @param text text of the message
 * @param buttonTexts text of the buttons
 * @param force_buttons whether the buttons are forced or not
 * @param timer_count the amount of seconds the timer is for
 * @returns a object representing a message item
 */
export const getMessageItemObject = (
  text: string = "",
  buttonTexts: Array<string> = [],
  force_buttons: boolean = false,
  timer_count: number = -1
) => {
  if (timer_count != -1) {
    return {
      timerCount: timer_count,
      requireTimer: true,
    };
  }
  const button_dicts: MessageButton[] = buttonTexts.map((ite) => ({
    text: ite,
  }));
  const ret: MessageItem = {
    text: text,
    buttons: button_dicts,
    awaitUserInput: true,
  };
  if (force_buttons) {
    ret.forceButtons = true;
  }
  return ret;
};

export const extractMessageItems = (xlsxFile: File) => {
  const messageItems: MessageItem[] = [];
  readXlsxFile(xlsxFile).then((rows) => {
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const text: string = row[0] === null ? "" : (row[0].valueOf() as string);
      const forceButtons: boolean =
        row[1] === null ? false : (row[1].valueOf() as boolean);
      const timerCount = row[2] === null ? -1 : parseInt(row[2].toString());
      const buttonTexts: string[] = [];
      for (let j = 3; j < row.length; j++) {
        if (row[j] === null) continue;
        buttonTexts.push(row[j].valueOf() as string);
      }
      messageItems.push(
        getMessageItemObject(text, buttonTexts, forceButtons, timerCount)
      );
    }
    console.log(messageItems);
  });
  return messageItems;
};
