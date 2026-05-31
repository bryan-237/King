const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "annonce",
    version: "2.0.0",
    hasPermssion: 2,
    credits: "Brock",
    description: "Broadcast message + photo dans tous les groupes",
    commandCategory: "admin",
    usages: "annonce <message> | -img <url> pour image",
    cooldowns: 5
  },

  onStart: async function({ api, event, args }) {
    const { threadID, messageID, senderID } = event;

    if(!global.config.ADMINBOT.includes(senderID))
      return api.sendMessage("❌ Admin bot only", threadID, messageID);

    // Récup nom du bot
    let botID = api.getCurrentUserID();
    let botInfo = await api.getUserInfo(botID);
    let botName = botInfo[botID].name;

    let msg = args.join(" ");
    let imgUrl = null;

    // Si -img url dans le message
    if(msg.includes("-img")) {
      let split = msg.split("-img");
      msg = split[0].trim();
      imgUrl = split[1].trim();
    }

    if(!msg) return api.sendMessage("Usage: ¥annonce 𝗕𝗼𝗻𝗷𝗼𝘂𝗿 𝗷𝗲 𝘀𝘂𝗶𝘀 𝗹𝗲 𝗯𝗼𝘁 𝗱𝘂 𝗽𝗹𝘂𝘀 𝗯𝗲𝗮𝘂 𝗮𝘂 𝗺𝗼𝗻𝗱𝗲 𝗲𝘁 𝗹𝗲 𝗽𝗹𝘂𝘀 𝗶𝗻𝘁𝗲𝗹𝗶𝗴𝗲𝗻𝘁 𝗱𝗲𝘀 𝗱𝗲𝘃𝗲𝗹𝗼𝗽𝗲𝘂𝗿 𝗺𝗲𝗿𝗰𝗶 𝗱𝗲 𝗺'𝗮𝗰𝗰𝗲𝗽𝘁𝗲𝗿 𝗱𝗮𝗻𝘀 𝘃𝗼𝘁𝗿𝗲 𝗴𝗿𝗼𝘂𝗽𝗲 𝘂𝘁𝗶𝗹𝗶𝘀𝗲𝗿 𝗺𝗼𝗶 .𝗺𝗼𝗻 𝗥𝗢𝗜 𝗕𝗥𝗬𝗔𝗡 𝗦𝗔𝗕𝗜𝗡 𝗲𝘀𝘁 𝘀𝗲𝗿𝗶𝗲𝘂𝘅  | -img lien_image", threadID, messageID);

    let allThreads = await api.getThreadList(200, null, ["INBOX"]);
    let groupThreads = allThreads.filter(t => t.isGroup && t.isSubscribed);

    api.sendMessage(`📢 Envoi vers ${groupThreads.length} groupes...`, threadID, messageID);

    let success = 0;
    let fail = 0;
    let attachment = null;

    // Télécharger image si y'en a une
    if(imgUrl) {
      try {
        let imgPath = path.join(__dirname, "cache", "annonce.jpg");
        await fs.ensureDir(path.join(__dirname, "cache"));
        const res = await require("axios").get(imgUrl, {responseType: "arraybuffer"});
        fs.writeFileSync(imgPath, res.data);
        attachment = fs.createReadStream(imgPath);
      } catch(e) {
        api.sendMessage("⚠️ Image invalide, envoi sans image", threadID);
      }
    }

    for(let thread of groupThreads) {
      try {
        let presentation = `━━━━━━━━
🤖 ${botName.toUpperCase()} 🤖
━━━━━━━━

👋 Salut tout le monde!

${msg}

━━━━━━━━
📝 Commandes: ¥help
👑 Admin: Brock
━━━━━━━━`;

        if(attachment) {
          await api.sendMessage({body: presentation, attachment: attachment}, thread.threadID);
        } else {
          await api.sendMessage(presentation, thread.threadID);
        }
        success++;
        await new Promise(resolve => setTimeout(resolve, 2500)); // 2.5s délai
      }
      catch(e) {
        fail++;
      }
    }

    // Supprimer image temp
    if(attachment) fs.unlinkSync(path.join(__dirname, "cache", "annonce.jpg"));

    return api.sendMessage(
      `✅ TERMINÉ\nGroupes atteints: ${success}\nÉchecs: ${fail}\nBot: ${botName}`,
      threadID
    );
  }
  }
