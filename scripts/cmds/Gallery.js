fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

module.exports = {
  config: {
    name: "gallery",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Bryan Sabin",
    description: "Sauvegarde + affiche galerie photos normales",
    commandCategory: "media",
    usages: "gallery / gallery clear",
    cooldowns: 2
  },

  onStart: async function({ api, event, args }) {
    const { threadID, messageID, senderID } = event;
    let cachePath = path.join(__dirname, "cache", "gallery");
    await fs.ensureDir(cachePath);

    //!gallery clear → vide la galerie
    if(args[0] == "clear") {
      await fs.emptyDir(cachePath);
      return api.sendMessage("🗑️ Galerie vidée avec succès", threadID, messageID);
    }

    //!gallery → affiche toutes les photos stockées
    let files = await fs.readdir(cachePath);
    if(files.length == 0)
      return api.sendMessage("📸 Galerie vide. Envoie des photos normales et je les stocke auto.", threadID, messageID);

    let attachments = files.map(f => fs.createReadStream(path.join(cachePath, f)));
    return api.sendMessage({
      body: `💎 GALERIE PHANTOM KING 💎\nTotal: ${files.length} photos`,
      attachment: attachments
    }, threadID, messageID);
  },

  // Sauvegarde auto toutes les photos normales
  onMessage: async function({ api, event }) {
    const { threadID, attachments, senderID } = event;
    if(!attachments || attachments.length == 0) return;

    let cachePath = path.join(__dirname, "cache", "gallery");
    await fs.ensureDir(cachePath);

    for(let att of attachments) {
      // Seulement photos normales, pas view once
      if(att.type == "photo" && att.url) {
        let img = (await axios.get(att.url, { responseType: "arraybuffer" })).data;
        let fileName = `${Date.now()}_${senderID}.jpg`;
        fs.writeFileSync(path.join(cachePath, fileName), Buffer.from(img));
      }
    }
  }
};
