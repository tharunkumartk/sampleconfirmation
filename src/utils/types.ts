/**
 * interface for a message item. a message item represents a
 * single message in the chat, of all types.
 *
 * plain message:
 * { text: "hello world" }
 *
 * message with buttons:
 * {
 *   text: "hello world",
 *   buttons: [{ text: "button1" }, { text: "button2" }],
 *   awaitUserInput: true,
 * }
 *
 * message with timer (in seconds):
 * {  requireTimer: true, timerCount: 10 }
 *
 * message sent by user:
 * { text: "hello world", isUser: true }
 *
 */
export interface MessageItem {
  text?: string;
  isUser?: boolean;
  requireTimer?: boolean;
  timerCount?: number; // in seconds
  buttons?: Array<MessageButton>;
  awaitUserInput?: boolean;
  forceButtons?: boolean;
  timeStamp?: Date;
  isTyping?: boolean;
  setIsTyping?: (isTyping: boolean) => void;
}

/**
 * interface for the message buttons stored in each MessageItem.
 */
export interface MessageButton {
  text: string;
  onPress?: () => void;
  disabled?: boolean;
}
