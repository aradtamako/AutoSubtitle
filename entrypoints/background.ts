import { Message, sendRuntimeMessage, sendTabMessage, StartRecordingMessage } from '@/lib/message'

async function getOffscreenDocument() {
  const existingContexts = await browser.runtime.getContexts({})
  return existingContexts.find(c => c.contextType === 'OFFSCREEN_DOCUMENT')
}

async function createOffscreenDocument() {
  const offscreenDocument = await getOffscreenDocument()
  if (offscreenDocument) {
    return
  }

  await browser.offscreen.createDocument({
    url: browser.runtime.getURL('/offscreen.html'),
    reasons: [browser.offscreen.Reason.DISPLAY_MEDIA],
    justification: 'Recording'
  })
}

async function handleOffscreenMessages(message: Message) {
  switch (message.type) {
    case 'TRANSLATED':
      sendTabMessage(message.data.tabId, message)
      break
  }
  return true
}

export default defineBackground({
  type: 'module',
  main() {
    browser.action.onClicked.addListener(async (tab) => {
      await createOffscreenDocument()
      const streamId = await browser.tabCapture.getMediaStreamId({ targetTabId: tab.id })

      const message: StartRecordingMessage = {
        type: 'START_RECORDING',
        data: {
          tabId: tab.id ?? 0,
          streamId: streamId
        }
      }
      sendRuntimeMessage(message)
    })

    browser.runtime.onMessage.addListener(handleOffscreenMessages)
  }
})

