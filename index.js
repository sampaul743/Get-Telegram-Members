// index.js
import fs from "fs";
import readline from "readline";
import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions/index.js"; // explicit file import
import { Api } from "telegram";

// dynamic import for inquirer (ESM)
const inquirer = await import("inquirer");

// fixed constants
const DAILY_LIMIT = 100;
const FIXED_DELAY = 10000; // 10 seconds

async function loadConfig() {
  if (fs.existsSync("config.json")) {
    return JSON.parse(fs.readFileSync("config.json", "utf8"));
  }
  const answers = await inquirer.default.prompt([
    { name: "apiId", message: "Enter your Telegram API ID:", validate: v => !isNaN(v) },
    { name: "apiHash", message: "Enter your Telegram API Hash:" },
    { name: "phone", message: "Enter your phone number (+countrycode...):" },
    { name: "targetGroup", message: "Enter your target group link:" }
  ]);
  fs.writeFileSync("config.json", JSON.stringify(answers, null, 2));
  return answers;
}

(async () => {
  const config = await loadConfig();
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const client = new TelegramClient(new StringSession(""), parseInt(config.apiId), config.apiHash, { connectionRetries: 5 });

  let savedIds = [];
  let addedToday = 0;

  await client.start({
    phoneNumber: async () => config.phone,
    password: async () => await ask("Enter 2FA password (if any): "),
    phoneCode: async () => await ask("Enter login code: "),
    onError: (err) => console.log(err),
  });

  console.log("Bot started. Commands: /loadfile, /clear, /add, /status, /random <n>, /exit");
  prompt();

  function ask(q) {
    return new Promise((resolve) => rl.question(q, resolve));
  }

  function prompt() {
    rl.question("> ", async (cmd) => {
      if (cmd.startsWith("/loadfile")) {
        const parts = cmd.split(" ");
        const filename = parts[1] || "users.txt";
        try {
          const lines = fs.readFileSync(filename, "utf8").split("\n");
          savedIds = lines.map(l => parseInt(l.trim())).filter(n => !isNaN(n));
          console.log(`✅ Loaded ${savedIds.length} IDs from ${filename}`);
        } catch (err) {
          console.log(`⚠️ Could not read ${filename}: ${err.message}`);
        }
        prompt();
      } else if (cmd === "/clear") {
        savedIds = [];
        console.log("🗑️ Cleared saved IDs");
        prompt();
      } else if (cmd === "/add") {
        const group = await client.getEntity(config.targetGroup);
        for (const id of savedIds) {
          if (addedToday >= DAILY_LIMIT) {
            console.log("⛔ Daily limit of 100 reached. Try again tomorrow.");
            break;
          }
          try {
            await client.invoke(
              new Api.channels.InviteToChannel({
                channel: group,
                users: [new Api.InputPeerUser({ userId: id })],
              })
            );
            addedToday++;
            console.log(`✅ Added ID ${id} (${addedToday}/${DAILY_LIMIT})`);
            await sleep(FIXED_DELAY);
          } catch (err) {
            console.log(`⚠️ Failed to add ID ${id}: ${err.message}`);
          }
        }
        prompt();
      } else if (cmd === "/status") {
        console.log(`Added today: ${addedToday}/${DAILY_LIMIT}, Pending: ${savedIds.length}`);
        prompt();
      } else if (cmd.startsWith("/random")) {
        const count = parseInt(cmd.split(" ")[1]);
        if (isNaN(count) || count <= 0) {
          console.log("⚠️ Usage: /random <number>");
          prompt();
          return;
        }
        let fileIds = [];
        try {
          const lines = fs.readFileSync("users.txt", "utf8").split("\n");
          fileIds = lines.map(l => parseInt(l.trim())).filter(n => !isNaN(n));
        } catch {}
        const ids = fileIds.length > 0 ? fileIds : savedIds;
        if (ids.length === 0) {
          console.log("⚠️ No IDs available");
          prompt();
          return;
        }
        const group = await client.getEntity(config.targetGroup);
        let added = 0, attempts = 0;
        while (added < count && attempts < ids.length * 2) {
          if (addedToday >= DAILY_LIMIT) {
            console.log("⛔ Daily limit of 100 reached. Try again tomorrow.");
            break;
          }
          attempts++;
          const id = ids[Math.floor(Math.random() * ids.length)];
          try {
            await client.invoke(
              new Api.channels.InviteToChannel({
                channel: group,
                users: [new Api.InputPeerUser({ userId: id })],
              })
            );
            added++;
            addedToday++;
            console.log(`✅ Randomly added ID ${id} (${addedToday}/${DAILY_LIMIT})`);
            await sleep(FIXED_DELAY);
          } catch (err) {
            console.log(`⚠️ Failed ID ${id}: ${err.message}`);
          }
        }
        console.log(`🎯 Random add finished. Requested: ${count}, Added: ${added}`);
        prompt();
      } else if (cmd === "/exit") {
        rl.close();
        process.exit(0);
      } else {
        prompt();
      }
    });
  }

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
})();
