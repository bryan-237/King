const { createCanvas, loadImage } = require("canvas");
const fs = require("fs-extra");
const path = require("path");

async function genWelcome(name, id, count, gName) {
  const canvas = createCanvas(1080, 600);
  const ctx = canvas.getContext("2d");

  // Fond dégradé
  const bg = ctx.createLinearGradient(0, 0, 1080, 600);
  bg.addColorStop(0, "#1a1a2e");
  bg.addColorStop(1, "#16213e");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 1080, 600);

  // Étoiles
  ctx.fillStyle = "#FFD700";
  for(let i=0; i<40; i++) {
    ctx.beginPath();
    ctx.arc(Math.random()*1080, Math.random()*600, 1.5, 0, Math.PI*2);
    ctx.fill();
  }

  // Avatar rond
  try {
    const avatar = await loadImage(`https://graph.facebook.com/${id}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`);
    ctx.strokeStyle = "#FFD700";
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.arc(180, 300, 120, 0, Math.PI*2);
    ctx.stroke();
    ctx.save();
    ctx.beginPath();
    ctx.arc(180, 300, 115, 0, Math.PI*2);
    ctx.clip();
    ctx.drawImage(avatar, 65, 185, 230, 230);
    ctx.restore();
  } catch(e) {}

  // Texte
  ctx.shadowColor = "#000";
  ctx.shadowBlur = 10;
  ctx.textAlign = "left";

  ctx.fillStyle = "#FFD700";
  ctx.font = "bold 60px Impact";
  ctx.fillText("BIENVENUE", 360, 230);

  ctx.fillStyle = "#fff";
  ctx.font = "bold 42px Arial";
  ctx.fillText(name.toUpperCase(), 360, 295);

  ctx.fillStyle = "#aaa";
  ctx.font = "28px Arial";
  ctx.fillText(`Membre n°${count} | ${gName}`, 360, 360);
  ctx.fillText("Tape 'miff' pour les règles", 360, 410);

  ctx.font = "60px Arial";
  ctx.fillText("🎉👋", 900, 300);

  return canvas.toBuffer();
}

module.exports = {
  config: {
    name: "welcome",
    eventType: ["log:subscribe"],
    version: "2.1.0",
    credits: "Brock"
  },

  onStart: async function({ api, event, Threads }) {
    const { threadID, logMessageData } = event;
    const added = logMessageData.addedParticipants;
    if (!added || added.length === 0) return;

    const threadData = await Threads.getData(threadID);
    if (threadData.data.welcome === false) return;

    const info = await api.getThreadInfo(threadID);
    const gName = info.threadName || "le groupe";
    const count = info.participantIDs.length;

    const cache = path.join(__dirname, "..", "cache");
    if (!fs.existsSync(cache)) fs.mkdirSync(cache);

    for (let u of added) {
      const img = await genWelcome(u.fullName, u.userFbId, count, gName);
      const imgPath = path.join(cache, `wel_${u.userFbId}.png`);
      fs.writeFileSync(imgPath, img);

      api.sendMessage({
        body: `🎉 BIENVENUE ${u.fullName} 🎉\n\n👋 Tu rejoins ${gName}\n📊 Membre n°${count}\n📜 Tape "miff" pour les règles\nRespect & amuse-toi! 💎`,
        mentions: [{ tag: u.fullName, id: u.userFbId }],
        attachment: fs.createReadStream(imgPath)
      }, threadID, () => fs.unlinkSync(imgPath));
    }
  }
};
