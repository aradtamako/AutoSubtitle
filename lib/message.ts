export const MessageTypes = ['START_RECORDING', 'STOP_RECORDING', 'TRANSLATED'] as const
export type MessageType = (typeof MessageTypes)[number]

interface MessageBase<T extends MessageType> {
  type: T
}

export interface StartRecordingMessage extends MessageBase<'START_RECORDING'> {
  data: {
    tabId: number
    streamId: string
  }
}

export interface StopRecordingMessage extends MessageBase<'STOP_RECORDING'> {
  data: string
}

export interface TranslatedMessage extends MessageBase<'TRANSLATED'> {
  data: {
    tabId: number
    originalText: string
    translatedText: string
  }
}

export type Message = StartRecordingMessage
  | StopRecordingMessage
  | TranslatedMessage

export function sendRuntimeMessage(message: Message): void {
  browser.runtime.sendMessage(message)
}

export function sendTabMessage(tabId: number, message: Message): void {
  browser.tabs.sendMessage(tabId, message)
}
