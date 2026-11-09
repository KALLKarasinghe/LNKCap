# 📱 LNKcap Mobile – Sinhala AI Caption Studio

> **Google Gemini Flash බලයෙන් ක්‍රියාත්මක වන ප්‍රථම සිංහල AI Mobile Caption Studio යෙදුම.**  
> Built for mobile creators (Reels, TikTok, YouTube Shorts, Facebook). 100% Free & Unlimited.

---

## ✨ Features (ප්‍රධාන පහසුකම්)

1. **🎙️ Gemini Flash AI Sinhala Auto Captions**:
   - වීඩියෝවක් තෝරා එක් ක්ලික් කිරීමකින් සම්පූර්ණ සිංහල කතාව නිවැරදි Timestamps සමඟ Subtitles බවට පත් කිරීම.
   - Web Audio API මගින් දුරකථනය තුළදීම 16kHz Mono WAV ලෙස සකස් කර Gemini Flash වෙත යැවීම (No external desktop binaries required!).
2. **🔤 19 Offline Sinhala Fonts Included**:
   - `Sinhala Impact`, `Derana`, `Sigiri`, `Bhashitha`, `Bindumathi`, `Disapamok`, `Sandhyanee`, `Alakamanda`, `Basuru`, `Warna`, `Abhaya Libre`, `Gemunu Libre` ඇතුළු සිංහල ෆොන්ට් 19 ක් යෙදුම තුළම ඇතුළත් කර ඇත.
3. **🎨 40 SinCap Caption Styles**:
   - **Popular**: Hormozi Pop, Reference Pop, Clean White, Spotlight, Subtitle Box, Cinema Serif.
   - **Highlight**: Weight Fade Focus (SinCap smart style), Golden Karaoke, Karaoke Mint, Beast Lime, Emerald Mint.
   - **Social / Reels**: TikTok Bold, Reels Punch, Duo Flow, Comic Punch, One Word, Electric Velocity.
   - **Effects (Pro)**: Metallic Gold, Silver Chrome, Cyber Glitch, Light Sweep, Big Moment, Synthwave Glow, Cyber Cyan.
4. **🚀 Dual SRT Export & Sharing**:
   - **Export Unicode (.srt)**: CapCut, YouTube, Facebook, TikTok, VLC සඳහා.
   - **Export FM Font (.srt)**: Adobe Premiere Pro, After Effects, Photoshop වල සිංහල අකුරු කැඩීමකින් තොරව FM Fonts (`FM Abhaya`, `FM Samantha`, ආදී) භාවිතා කිරීමට.
   - දුරකථනයේ WhatsApp, Telegram, Files, CapCut වෙත කෙලින්ම **Share** කිරීමේ පහසුකම (Mobile Web Share API).
5. **🎬 Burned-In Video Export**:
   - දුරකථනයෙන්ම Subtitles සමඟ වීඩියෝව Render කර Save කරගැනීම.
6. **📱 Mobile-First Responsive Design**:
   - 9:16 Vertical Video (Reels/Shorts), 1:1 Square, සහ 16:9 Landscape aspect ratios.
   - පහළ Navigation bar එක මගින් පහසුවෙන් භාවිත කළ හැකි පිරිසිදු Dark UI.

---

## 🚀 How to Run & Test (භාවිතා කරන ආකාරය)

### 1. Development Server එක Run කිරීම:
පරිගණකයේ Terminal / PowerShell විවෘත කර:
```bash
cd "D:\Git Hub\LNKCap Mobile app"
npm install
npm run dev
```
Terminal එකෙහි පහත පරිදි Local Network URL එක පෙන්වයි:
```
  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.1.X:5173/
```

### 2. ඔබගේ Mobile Phone එකෙන් Test කිරීම:
1. ඔබගේ Mobile Phone එක සහ පරිගණකය **එකම Wi-Fi ජාලයකට (Same Network)** සම්බන්ධ කරන්න.
2. Phone එකේ Chrome හෝ Safari browser එක විවෘත කර Terminal එකේ පෙන්වන `Network` ලිපිනය (`http://192.168.1.X:5173`) ඇතුළත් කරන්න.
3. දුරකථනයෙන්ම Gallery එකෙන් Video එකක් තෝරා Gemini API Key ඇතුළත් කර Captions සාදා ගන්න!

---

## 📦 How to Build Android APK (Android App එකක් ලෙස සෑදීම)

මෙම ව්‍යාපෘතිය **Capacitor** සමඟ සකස් කර ඇති බැවින් Android APK එකක් සෑදීම ඉතා පහසුය:

1. **Production Build එක සෑදීම:**
   ```bash
   npm run build
   ```

2. **Android Platform එක එක් කිරීම:**
   ```bash
   npx cap add android
   ```

3. **Android Studio වෙත Open කර APK එක Build කිරීම:**
   ```bash
   npx cap sync
   npx cap open android
   ```
   Android Studio විවෘත වූ පසු **Build → Build Bundle(s) / APK(s) → Build APK(s)** මගින් ඔබගේම Android APK එක ලබාගත හැක.

---

## 📲 Install as PWA (Play Store නොමැතිව Phone එකට Install කිරීම)
Android හෝ iPhone browser එකෙන් Web App එක විවෘත කර:
- **Chrome (Android)**: Menu (⋮) → **"Install app"** හෝ **"Add to Home screen"**
- **Safari (iOS)**: Share Icon → **"Add to Home Screen"**

---

## 📁 Project Structure
```
D:\Git Hub\LNKCap Mobile app\
├── capacitor.config.json    # Capacitor Android/iOS config
├── package.json             # NPM scripts & dependencies
├── vite.config.js           # Vite dev/build bundler config
├── index.html               # Mobile Studio UI
├── public/
│   ├── fonts.css            # 19 bundled Sinhala fonts CSS
│   └── fonts/               # 19 TTF font binaries
└── src/
    ├── main.js              # Mobile application controller
    ├── style.css            # Mobile responsive dark theme
    ├── gemini.js            # Google Gemini AI client
    ├── audio-extractor.js   # In-browser 16kHz WAV audio extractor
    ├── captions.js          # Unicode & FM SRT engine
    ├── fm-converter.js      # Sinhala Unicode to FM Wijesekara converter
    ├── styles.js            # 40 caption presets & metrics
    ├── video-size.js        # Aspect ratio helpers
    └── video-renderer.js    # Canvas MediaRecorder video burner
```
