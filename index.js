import fs from "fs";
import readline from "readline";
import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";
import { Api } from "telegram";

const config = JSON.parse(fs.readFileSync("config.json", "utf8"));
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

const client = new TelegramClient(new StringSession(config.session || ""), config.apiId, config.apiHash, {
  connectionRetries: 5,
});

let savedIds = [];
let addedToday = 0;

async function main() {
  await client.start({
    phoneNumber: async () => await ask("Enter phone number: "),
    password: async () => await ask("Enter 2FA password: "),
    phoneCode: async () => await ask("Enter code: "),
    onError: (err) => console.log(err),
  });

  console.log("Bot started. Type /saveid to enter Telegram IDs, /add to invite, /status to check, /exit to quit.");
  prompt();
}

function ask(q) {
  return new Promise((resolve) => rl.question(q, resolve));
}

function prompt() {
  rl.question("> ", async (cmd) => {
    if (cmd === "/saveid") {
      console.log("Paste Telegram IDs one per line, end with '.'");
      let ids = [];
      rl.on("line", (line) => {
        if (line.trim() === ".") {
          savedIds.push(...ids);
          console.log("✅ Saved IDs:", savedIds);
          rl.removeAllListeners("line");
          prompt();
        } else {
          const id = parseInt(line.trim());
          if (!isNaN(id)) ids.push(id);
        }
      });
    } else if (cmd === "/add") {
      const group = await client.getEntity(config.targetGroup);
      for (const id of savedIds) {
        try {
          await client.invoke(
            new Api.channels.InviteToChannel({
              channel: group,
              users: [new Api.InputPeerUser({ userId: id })],
            })
          );
          addedToday++;
          console.log(`✅ Added ID ${id}`);
          await sleep(config.delay || 10000);
        } catch (err) {
          console.log(`⚠️ Failed to add ID ${id}: ${err.message}`);
        }
      }
      prompt();
    } else if (cmd === "/status") {
      console.log(`Added today: ${addedToday}, Pending: ${savedIds.length}`);
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

main();
