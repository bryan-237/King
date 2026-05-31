Cmd install roast.js fs = require("fs-extra");
const { createCanvas } = require("canvas");
const path = require("path");

module.exports = {
  config: {
    name: "roast",
    version: "1.1.0",
    hasPermssion: 0,
    credits: "Bryan",
    commandCategory: "fun",
    usages: "@nom",
    cooldowns: 3
  },

  onStart: async function({ api, event, usersData }) {
    const { threadID, messageID, mentions } = event;
    let uid = Object.keys(mentions)[0];
    if(!uid) return api.sendMessage("Tag une victime 😈", threadID, messageID);

    // FIX: GoatBot v2 = usersData.getName
    let name;
    try {
      name = await usersData.getName(uid);
    } catch {
      name = "Victime";
    }

    const roasts = [
      `${name} ton cerveau a moins de RAM que mon bot`,
      `${name} même Google te trouve pas`,
      `${name} t'es le mode avion de l'intelligence`,
      `${name} si la bêtise tuait, t'es immortel`,
      `${name} t'as le charisme d'une porte`,
      `${name} t'es la mise à jour que personne a demandé`
    ];
    let roast = roasts[Math.floor(Math.random()*roasts.length)];

    let canvas = createCanvas(700, 400);
    let ctx = canvas.getContext("2d");

    // Fond noir diamant
    ctx.fillStyle = "#0A0A0A"; ctx.fillRect(0,0,700,400);
    // Bordure or
    ctx.strokeStyle = "#FFD700"; ctx.lineWidth = 10; ctx.strokeRect(10,10,680,380);

    // ROASTED 3D
    ctx.fillStyle = "#FFD700";
    ctx.shadowColor = "#FFA500";
    ctx.shadowBlur = 20;
    ctx.font = "bold 60px Impact";
    ctx.textAlign = "center";
    ctx.fillText("ROASTED", 350, 100);
    ctx.shadowBlur = 0;

    // Texte roast cyan
    ctx.fillStyle = "#00FFFF";
    ctx.font = "28px Arial Black";
    ctx.fillText(roast, 350, 220);

    // Footer
    ctx.fillStyle = "#FFD700";
    ctx.font = "18px Arial";
    ctx.fillText("PHANTOM KING PROTOCOL ©", 350, 360);

    let cachePath = path.join(__dirname, "cache");
    await fs.ensureDir(cachePath);
    let pathImg = path.join(cachePath, `roast_${uid}.png`);
    fs.writeFileSync(pathImg, canvas.toBuffer());

    api.sendMessage({attachment: fs.createReadStream(pathImg)}, threadID, () => fs.unlinkSync(pathImg), messageID);
  }
}
