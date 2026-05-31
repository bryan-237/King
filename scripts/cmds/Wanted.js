Cmd install wanted.js const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");

module.exports = {
  config: {
    name: "wanted",
    version: "5.3.0",
    hasPermssion: 0,
    credits: "Bryan Sabin | PHANTOM KING",
    description: "WANTED 3D Or Diamants - Exact screen",
    commandCategory: "fun",
    usages: "[tag/répondre] [prime]",
    cooldowns: 3
  },

  onStart: async function({ api, event, Users, args }) {
    const { threadID, messageID, senderID, mentions, messageReply } = event;
    let uid = Object.keys(mentions)[0] || (messageReply? messageReply.senderID : senderID);

    let prime = args.find(a => /^\d+$/.test(a)) || "99999";
    prime = parseInt(prime).toLocaleString();

    let name;
    try {
      name = await Users.getNameUser(uid);
    } catch {
      name = "PHANTOM KING";
    }

    let cachePath = path.join(__dirname, "cache");
    await fs.ensureDir(cachePath);
    let pathImg = path.join(cachePath, `wanted_${uid}.png`);

    try {
      let avatarURL = `https://graph.facebook.com/${uid}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
      let avatar = (await axios.get(avatarURL, { responseType: "arraybuffer" })).data;

      const canvas = createCanvas(800, 1100);
      const ctx = canvas.getContext("2d");

      // Fond noir losange diamant comme screen
      ctx.fillStyle = "#0A0A0A";
      ctx.fillRect(0, 0, 800, 1100);
      ctx.strokeStyle = "#222";
      ctx.lineWidth = 2;
      for(let y=0; y<1100; y+=60) {
        for(let x=0; x<800; x+=60) {
          ctx.beginPath();
          ctx.moveTo(x, y+30);
          ctx.lineTo(x+30, y);
          ctx.lineTo(x+60, y+30);
          ctx.lineTo(x+30, y+60);
          ctx.closePath();
          ctx.stroke();
          ctx.fillStyle = "#FFD700";
          ctx.beginPath();
          ctx.arc(x+30, y, 3, 0, Math.PI*2);
          ctx.fill();
        }
      }

      // WANTED 3D OR comme screen
      const grad = ctx.createLinearGradient(0, 30, 0, 150);
      grad.addColorStop(0, "#FFD700");
      grad.addColorStop(0.5, "#FFF8DC");
      grad.addColorStop(1, "#FFA500");
      ctx.fillStyle = grad;
      ctx.shadowColor = "#FFD700";
      ctx.shadowBlur = 30;
      ctx.font = "bold 110px Arial Black";
      ctx.textAlign = "center";
      ctx.fillText("WANTED", 400, 120);
      ctx.shadowBlur = 0;

      // Hexagone doré + glow cyan comme screen
      ctx.strokeStyle = "#FFD700";
      ctx.lineWidth = 8;
      ctx.shadowColor = "#00FFFF";
      ctx.shadowBlur = 25;
      ctx.beginPath();
      ctx.moveTo(400, 180);
      ctx.lineTo(680, 320);
      ctx.lineTo(680, 780);
      ctx.lineTo(400, 920);
      ctx.lineTo(120, 780);
      ctx.lineTo(120, 320);
      ctx.closePath();
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Avatar avec glow cyan
      const avatarImg = await loadImage(Buffer.from(avatar));
      ctx.drawImage(avatarImg, 140, 340, 520, 520);
      ctx.shadowColor = "#00FFFF";
      ctx.shadowBlur = 40;
      ctx.strokeStyle = "#00FFFF";
      ctx.lineWidth = 6;
      ctx.strokeRect(140, 340, 520, 520);
      ctx.shadowBlur = 0;

      // Diamants flottants comme screen
      function drawDiamond(x, y, size) {
        ctx.fillStyle = "#E0FFFF";
        ctx.strokeStyle = "#FFF";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, y-size);
        ctx.lineTo(x+size*0.7, y);
        ctx.lineTo(x, y+size);
        ctx.lineTo(x-size*0.7, y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.shadowColor = "#00FFFF";
        ctx.shadowBlur = 15;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      drawDiamond(200, 300, 25);
      drawDiamond(600, 280, 35);
      drawDiamond(150, 500, 30);
      drawDiamond(650, 520, 40);
      drawDiamond(250, 700, 20);
      drawDiamond(550, 720, 28);
      drawDiamond(400, 250, 22);
      drawDiamond(700, 600, 32);

      // Texte bas cyan glow comme screen
      ctx.fillStyle = "#E0FFFF";
      ctx.shadowColor = "#00FFFF";
      ctx.shadowBlur = 15;
      ctx.textAlign = "center";
      ctx.font = "bold 50px Arial Black";
      ctx.fillText(`NOM: ${name.toUpperCase()}`, 400, 1000);
      ctx.font = "bold 42px Arial Black";
      ctx.fillText(`PRIME: ${prime} BELI`, 400, 1050);
      ctx.font = "bold 55px Arial Black";
      ctx.fillText(`RANK: GOD TIER`, 400, 1100);
      ctx.shadowBlur = 0;

      const buffer = canvas.toBuffer("image/png");
      fs.writeFileSync(pathImg, buffer);

      return api.sendMessage({
        body: `💎 PHANTOM KING PROTOCOL 💎\nCible: ${name} | Prime: ${prime} BELI\nRang: GOD TIER | EXCLUSIVE`,
        attachment: fs.createReadStream(pathImg)
      }, threadID, () => fs.unlinkSync(pathImg), messageID);

    } catch (e) {
      console.log(e);
      return api.sendMessage("❌ Erreur: npm install canvas", threadID, messageID);
    }
  }
};
