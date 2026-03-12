# AutoSubtitle
<img src="https://github.com/user-attachments/assets/9ea2dcb9-5fb9-4b0c-bd5a-413575a0356a" width=400 height=400 />

# Features
- Auto generate subtitles any languages realtime
- Auto translate to any languages realtime

# How to use
1. Clone this repository
2. Edit .env file
```
WXT_GROQ_API_KEY="ENTER_YOUR_GROQ_API_KEY"
WXT_DEEPGRAM_API_KEY="ENTER_YOUR_DEEPGRAM_API_KEY"
```
3. Build
```
npm run build
```

4. Load extension<br />chrome://extensions/<br /><img src="https://github.com/user-attachments/assets/1b5a09dc-de9b-4af1-9710-8326f164d94f" />

5. Open YouTube
6. Click AutoSubtitle extension icon
7. Subtitles generate automatically

# FAQ
- How can I change language?

<b>offscreen.ts</b>

```diff
- wss://api.deepgram.com/v1/listen?model=nova-3&language=ko
+ wss://api.deepgram.com/v1/listen?model=nova-3&language=ja
```

<b>offscreen.ts</b>

```diff
- { role: 'system', content: 'translate korean to japanese. emit translated text only.' },
+ { role: 'system', content: 'translate japanese to english. emit translated text only.' },
```
