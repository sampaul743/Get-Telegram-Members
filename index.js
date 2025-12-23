import fs from "fs";
import readline from "readline";
import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions/index.js";
import { Api } from "telegram";

const inquirer = await import("inquirer");

const DAILY_LIMIT = 100;
const FIXED_DELAY = 10000; // 10 seconds
const WAIT_TIME = 3 * 60 * 60 * 1000; // 3 hours

async function loadConfig() {
  if (fs.existsSync("config.json")) {
    return JSON.parse(fs.readFileSync("config.json", "utf8"));
  }
  const answers = await inquirer.default.prompt([
    { name: "apiId", message: "Enter your Telegram API ID:", validate: v => !isNaN(v) },
    { name: "apiHash", message: "Enter your Telegram API Hash:" },
    { name: "phone", message: "Enter your own phone number (+countrycode...):" },
    { name: "targetGroup", message: "Enter your target group link:" }
  ]);
  fs.writeFileSync("config.json", JSON.stringify(answers, null, 2));
  return answers;
}

(async () => {
  const config = await loadConfig();
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const client = new TelegramClient(new StringSession(""), parseInt(config.apiId), config.apiHash, { connectionRetries: 5 });

  let verifiedNumbers = [];
  let addedToday = 0;

  await client.start({
    phoneNumber: async () => config.phone,
    password: async () => await ask("Enter 2FA password (if any): "),
    phoneCode: async () => await ask("Enter login code: "),
    onError: (err) => console.log(err),
  });

  console.log("Bot started. Commands: /verify, /add, /status");
  prompt();

  function ask(q) {
    return new Promise((resolve) => rl.question(q, resolve));
  }

  function prompt() {
    rl.question("> ", async (cmd) => {
      if (cmd === "/verify") {
        try {
          const lines = fs.readFileSync("users.txt", "utf8").split("\n");
          const numbers = lines.map(l => l.trim()).filter(n => n.length > 0);
          verifiedNumbers = [];
          for (const number of numbers) {
            try {
              const user = await client.getEntity(number);
              if (user) {
                verifiedNumbers.push(number);
                console.log(`✅ Verified: ${number}`);
              }
            } catch {
              console.log(`❌ Not a Telegram user: ${number}`);
            }
          }
          fs.writeFileSync("users.txt", verifiedNumbers.join("\n"));
          console.log(`🎯 Verification complete. ${verifiedNumbers.length} valid numbers saved.`);
        } catch (err) {
          console.log(`⚠️ Error verifying: ${err.message}`);
        }
        prompt();
      } else if (cmd === "/add") {
        const group = await client.getEntity(config.targetGroup);
        for (const number of verifiedNumbers) {
          if (addedToday >= DAILY_LIMIT) {
            console.log("⛔ Daily limit of 100 reached. Waiting 3 hours before continuing...");
            await sleep(WAIT_TIME);
            addedToday = 0; // reset after wait
          }
          try {
            const user = await client.getEntity(number);
            await client.invoke(
              new Api.channels.InviteToChannel({
                channel: group,
                users: [user],
              })
            );
            addedToday++;
            console.log(`✅ Added ${number} (${addedToday}/${DAILY_LIMIT})`);
            await sleep(FIXED_DELAY);
          } catch (err) {
            console.log(`⚠️ Failed to add ${number}: ${err.message}`);
          }
        }
        console.log("🎯 Add process finished.");
        prompt();
      } else if (cmd === "/status") {
        const now = new Date();
        console.log(`🕒 Time: ${now.toLocaleString()}`);
        console.log(`📱 Verified numbers: ${verifiedNumbers.length}`);
        console.log("📜 Commands: /verify, /add, /status");
        prompt();
      } else {
        prompt();
      }
    });
  }

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
})();
