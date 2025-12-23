
<p align="center">
  <img src="https://media.giphy.com/media/3o7TKMt1VVNkHV2PaE/giphy.gif" width="120" />
</p>

<h1 align="center">🚀 GramJS Telegram Member Adder Bot</h1>

<p align="center">
  <b>A GramJS-based Telegram bot to invite users into groups using Telegram IDs</b><br>
  Optimized for <b>Termux (Android)</b> & <b>Linux</b> using <b>Yarn</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-v18+-green">
  <img src="https://img.shields.io/badge/GramJS-Latest-blue">
  <img src="https://img.shields.io/badge/Platform-Termux%20%7C%20Linux-orange">
  <img src="https://img.shields.io/badge/Status-Stable-success">
</p>

---

✨ Features

- ✅ Add users to Telegram groups using Telegram IDs  
- ✅ Smart delay & daily limit protection  
- ✅ Interactive CLI command system  
- ✅ Works smoothly on Android (Termux)  
- ✅ No bot token required (user session based)  
- ✅ Session saved locally for reuse  
- ✅ /random command to add a chosen number of random users from a file  

---

📥 Getting Your Users List

To use the /random command or bulk add features, you’ll need a file of Telegram user IDs.  
You can download or prepare your list from:

👉 https://getfiles.unaux.com/

Save the file as users.txt in the project root, with one ID per line:

`
123456789
987654321
112233445
`

⚠️ Important: Do add users.txt from downloads to your forked repo

---

📦 Installation & Setup

1️⃣ Install packages

```bash
pkg update -y && pkg install git nodejs -y && npm install -g yarn
```

2️⃣ Clone the Repository

```bash
git clone git@github.com:amanmohdtp/Get-Telegram-Members.git
cd gramjs-member-adder
```

3️⃣ Install Dependencies

```bash
yarn install --ignore-optional
```

> ⚡ The bot auto-runs after install thanks to the postinstall script.

---

🔧 Interactive Config

add credintias on bracket for not to get ban!
On first run, you’ll be asked for:

- 📱 Telegram number  
- 🔑 API ID  
- 🔑 API Hash  
- 🎯 Target group link  
- ⏱️ Delay between adds (10000)  
- 📊 Daily limit  (50)

These values are saved into config.json automatically.  
No need to edit files manually.

---

▶️ Run the Bot

Start the bot manually (if not auto-run):

```bash
cd Get-Telegram-Members && yarn start```

---

💻 Bot Commands (CLI)

- 📥 Load IDs from file
  `bash
  /loadfile users.txt
  `
- 🗑️ Clear saved IDs
  `bash
  /clear
  `
- ➕ Add all saved IDs
  `bash
  /add
  `
- 🎲 Add random users
  `bash
  /random 5
  `
- 📊 Check status
  `bash
  /status
  `
- 🔧 Change daily limit
  `bash
  /limit 20
  `
- ⏱️ Change delay
  `bash
  /delay 15000
  `
- ❌ Exit bot
  `bash
  /exit
  `

---

⚠️ Important Notes

- Only valid Telegram IDs are processed  
- Users with strict privacy settings may be skipped  
- Daily limit prevents Telegram rate-limits & bans  
- Session data is stored locally in config.json  

---

🛠 Development Info

- 🟢 Built with Node.js  
- 📦 Powered by GramJS  
- 🧶 Dependency management via Yarn  
- 💻 Cross-platform: Linux, macOS, Windows, Android (Termux)  

---

<p align="center">
  <img src="https://media.giphy.com/media/26AHONQ79FdWZhAI0/giphy.gif" width="300" />
</p>

---

⭐ Support

If this project helped you:

- ⭐ Star the repository  
- 🧑‍💻 Contribute improvements  
- 🐞 Report issues  

---
