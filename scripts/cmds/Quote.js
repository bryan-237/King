 module.exports = {
  config: {
    name: "quote",
    version: "2.0.0",
    hasPermssion: 0,
    credits: "Bryan",
    description: "Quote style manga",
    commandCategory: "fun",
    usages: "[naruto/sasuke]",
    cooldowns: 2
  },

  onStart: async function({ api, event, args }) {
    const { threadID, messageID } = event;

    const quotes = {
      naruto: [
        "Si tu abandonnes, ça devient une vraie défaite.",
        "Je suis pas un génie, mais je lâche jamais.",
        "Les gens qui n’ont pas d’amis ne comprendront jamais.",
        "Croire en soi, c’est ça le vrai pouvoir."
      ],
      sasuke: [
        "Je n’ai pas besoin d’amis pour devenir fort.",
        "La vengeance... c’est tout ce qui me reste.",
        "Je couperai tous les liens qui me retiennent.",
        "Le pouvoir... je veux tout le pouvoir."
      ],
      default: [
        "Le succès tue l'ego. L'échec le forge.",
        "Sois la version qui fait peur aux autres.",
        "Les rois ne demandent pas, ils prennent.",
        "Ton temps viendra. Travaille en silence."
      ]
    };

    let type = args[0]?.toLowerCase() || "default";
    let list = quotes[type] || quotes.default;
    let quote = list[Math.floor(Math.random()*list.length)];

    // Style manga avec bordure
    let msg = `💎 𝗣𝗛𝗔𝗡𝗧𝗢𝗠 𝗞𝗜𝗡𝗚 𝗤𝗨𝗢𝗧𝗘 💎\n\n`;
    msg += `「 ${quote} 」\n\n`;
    msg += `— ${type == "default"? "Phantom King" : type.toUpperCase()} —`;

    api.sendMessage(msg, threadID, messageID);
  }
}
