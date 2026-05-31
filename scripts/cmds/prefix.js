Cmd install prefix.js module.exports = {
  config: {
    name: "prefix",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Bryan Sabin",
    description: "Affiche prefix avec effet typing",
    commandCategory: "system",
    usages: "",
    cooldowns: 3
  },

  onStart: async function({ api, event, args, threadsData }) {
    const { threadID, messageID } = event;

    let data = await threadsData.get(threadID);
    let prefix = data.prefix || "¥";

    const header = "⚙️☠️𝗕𝗥𝗬𝗔𝗡 𝗦𝗔𝗕𝗜𝗡☠️\n\n";
    const text = `|SYSTEM| System Prefix: ${prefix}`;
    let msg = await api.sendMessage(header + "|SYSTEM| System Pre", threadID, messageID);

    // Effet machine à écrire lettre par lettre
    let currentText = "|SYSTEM| System Pre";
    for(let i = currentText.length; i < text.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 80)); // vitesse écriture 80ms
      currentText += text[i];
      // Curseur clignotant
      let displayText = currentText + "|";
      await api.editMessage(header + displayText, msg.messageID);
    }

    // Supprime curseur à la fin
    setTimeout(() => {
      api.editMessage(header + text, msg.messageID);
    }, 300);

  }
};
