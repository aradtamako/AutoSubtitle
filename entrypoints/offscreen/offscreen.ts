import { Message, sendRuntimeMessage, TranslatedMessage } from '@/lib/message'

browser.runtime.onMessage.addListener(async (message: Message) => {
  switch (message.type) {
    case 'START_RECORDING':
      const media = await navigator.mediaDevices.getUserMedia({
        audio: {
          mandatory: {
            chromeMediaSource: 'tab',
            chromeMediaSourceId: message.data.streamId
          }
        }
      })

      // キャプチャ開始後ユーザーに音声を提供し続ける（ミュート状態にしない）
      const audioContext = new AudioContext()
      const source = audioContext.createMediaStreamSource(media)
      source.connect(audioContext.destination)

      const recorder = new MediaRecorder(media, { mimeType: 'audio/webm' })
      const socket = new WebSocket('wss://api.deepgram.com/v1/listen?model=nova-3&language=ko', [
        'token', import.meta.env.WXT_DEEPGRAM_API_KEY]
      )

      recorder.addEventListener('dataavailable', evt => {
        if (evt.data.size > 0 && socket.readyState == 1) {
          socket.send(evt.data)
        }
      })

      socket.onopen = () => {
        recorder.start(250)
      }

      socket.onmessage = async msg => {
        const { transcript } = JSON.parse(msg.data).channel.alternatives[0]
        if (transcript) {
          const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${import.meta.env.WXT_GROQ_API_KEY}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              model: 'openai/gpt-oss-120b',
              messages: [
                { role: 'system', content: 'translate korean to japanese. emit translated text only.' },
                { role: 'user', content: transcript }
              ]
            })
          })

          const obj = await response.json()
          const translatedMessage: TranslatedMessage = {
            type: 'TRANSLATED',
            data: {
              tabId: message.data.tabId,
              originalText: transcript,
              translatedText: obj.choices[0].message.content
            }
          }
          sendRuntimeMessage(translatedMessage)
        }
      }
      break
  }

});

(async () => {
  await browser.runtime.sendMessage({ data: 'hello from offscreen' })
})()
