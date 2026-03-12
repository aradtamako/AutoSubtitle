import { Message } from '@/lib/message'

export default defineContentScript({
  matches: ['*://*.youtube.com/*'],
  main() {
    const captionContainerElement = document.querySelector('#ytp-caption-window-container') as HTMLDivElement
    captionContainerElement.style = 'z-index: 100; display: flex; align-items: flex-end; justify-content: center; word-break: break-all; font-size: 20px;'

    browser.runtime.onMessage.addListener(async (message: Message) => {
      switch (message.type) {
        case 'TRANSLATED':
          if (captionContainerElement) {
            const textElement = document.createElement('div')
            textElement.innerText = message.data.translatedText
            textElement.style = 'background: black; padding: 5px;'

            for (const childNode of captionContainerElement.childNodes) {
              captionContainerElement.removeChild(childNode)
            }
            captionContainerElement.appendChild(textElement)
          }
          break
      }
    })
  }
})
