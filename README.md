## GramJS Telegram Bot 
## (ID-based Adder)

A Telegram bot built with GramJS that invites users into a group using their Telegram IDs.  
Designed to run smoothly in Termux (Android/Linux) with Yarn for dependency management.

---

📦 Prerequisites

- A Telegram account
- API credentials from https://my.telegram.org
  - apiId
  - apiHash
- Termux (Android) or any Linux shell
- Node.js (v18+ recommended)
- Yarn package manager

---

🚀 Setup

1. Clone the repository
   `bash
   git clone https://github.com/yourusername/gramjs-bot-id.git
   cd gramjs-bot-id
   `

2. Install dependencies with Yarn
   `bash
   yarn install --ignore-optional
   `

   > ⚠️ --ignore-optional skips native modules (bufferutil, utf-8-validate) that fail in Termux.

3. Configure your bot
   Edit config.json:
   `json
   {
     "apiId": 123456,
     "apiHash": "yourapihash_here",
     "session": "",
     "targetGroup": "https://t.me/yourgroup",
     "delay": 10000,
     "dailyLimit": 50
   }
   `

   - Replace apiId and apiHash with your values.
   - Set targetGroup to your group link.
   - Adjust delay (ms between adds) and dailyLimit as needed.

---

▶️ Run the Bot

Start the bot:
`bash
yarn start
`

You’ll be prompted to log in with your Telegram account (phone number, code, 2FA password if enabled).

---

💻 Commands

At the > prompt inside the bot:

- Save IDs
  `
  /saveid
  `
  Paste Telegram IDs one per line, end with a single .:
  `
  123456789
  987654321
  .
  `

- Add users to group
  `
  /add
  `

- Check status
  `
  /status
  `

- Exit bot
  `
  /exit
  `

---

⚠️ Notes

- Only valid Telegram IDs will be added.
- Users with restrictive privacy settings may be skipped.
- Daily limit prevents Telegram rate‑limits.
- Session data is stored locally in config.json.

---

🛠 Development

- Written in Node.js using GramJS.
- Runs cross‑platform: Linux, macOS, Windows, Termux (Android).
- Yarn is recommended for dependency management.

---

