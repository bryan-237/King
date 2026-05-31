 fs = require("fs-extra");
const { createCanvas, loadImage } = require("canvas");
const axios = require("axios");
const path = require("path");

module.exports = {
  config: {
    name: "ship",
    version: "2.0.0",
    hasPermssion: 0,
    credits: "Bryan",
    description: "Ship compatibilité style Otaku",
    commandCategory: "fun",
    usages: "@nom1 @nom2",
    cooldowns: 3
  },

  onStart: async function({ api, event, usersData }) {
    const { threadID, messageID, mentions } = event;
    let uids = Object.keys(mentions);
    if(uids.length < 2) return api.sendMessage("Tag 2 personnes 💕", threadID, messageID);

    let name1 = await usersData.getName(uids[0]).catch(() => "Joueur1");
    let name2 = await usersData.getName(uids[1]).catch(() => "Joueur2");
    let percent = Math.floor(Math.random()*100)+1;

    let canvas = createCanvas(900, 550);
    let ctx = canvas.getContext("2d");

    // Fond dégradé noir → rose
    let grad = ctx.createLinearGradient(0, 0, 900, 550);
    grad.addColorStop(0, "#0A0A0A");
    grad.addColorStop(1, "#FF1493");
    ctx.fillStyle = grad;
    ctx.fillRect(0,0,900,550);

    // Bordure néon or
    ctx.strokeStyle = "#FFD700";
    ctx.lineWidth = 8;
    ctx.shadowColor = "#FFD700";
    ctx.shadowBlur = 20;
    ctx.strokeRect(20,20,860,510);
    ctx.shadowBlur = 0;

    // Cœur néon central
    ctx.strokeStyle = "#FF69B4";
    ctx.lineWidth = 6;
    ctx.shadowColor = "#FF69B4";
    ctx.shadowBlur = 30;
    ctx.beginPath();
    ctx.moveTo(450, 180);
    ctx.bezierCurveTo(380, 120, 280, 150, 280, 240);
    ctx.bezierCurveTo(280, 320, 450, 380, 450, 380);
    ctx.bezierCurveTo(450, 380, 620, 320, 620, 240);
    ctx.bezierCurveTo(620, 150, 520, 120, 450, 180);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Texte SHIP COMPATIBILITY
    ctx.fillStyle = "#FFF";
    ctx.shadowColor = "#FF69B4";
    ctx.shadowBlur = 25;
    ctx.font = "bold 50px Impact";
    ctx.textAlign = "center";
    ctx.fillText("SHIP COMPATIBILITY", 450, 160);
    ctx.font = "bold 80px Impact";
    ctx.fillText(`${percent}%`, 450, 280);
    ctx.shadowBlur = 0;

    // Photos hexagonales
    async function drawHexAvatar(url, x, y, size) {
      let img = await loadImage(url);
      ctx.save();
      ctx.beginPath();
      for(let i=0; i<6; i++) {
        let angle = Math.PI/3 * i - Math.PI/6;
        let px = x + size * Math.cos(angle);
        let py = y + size * Math.sin(angle);
        if(i==0) ctx.moveTo(px,py);
        else ctx.lineTo(px,py);
      }
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(img, x-size, y-size, size*2, size*2);
      ctx.restore();

      // Bordure hexagone or néon
      ctx.strokeStyle = "#FFD700";
      ctx.lineWidth = 5;
      ctx.shadowColor = "#FFD700";
      ctx.shadowBlur = 15;
      ctx.beginPath();
      for(let i=0; i<6; i++) {
        let angle = Math.PI/3 * i - Math.PI/6;
        let px = x + size * Math.cos(angle);
        let py = y + size * Math.sin(angle);
        if(i==0) ctx.moveTo(px,py);
        else ctx.lineTo(px,py);
      }
      ctx.closePath();
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    let avatar1 = `https://graph.facebook.com/${uids[0]}/picture?width=300&height=300&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
    let avatar2 = `https://graph.facebook.com/${uids[1]}/picture?width=300&height=300&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

    await drawHexAvatar(avatar1, 240, 275, 90);
    await drawHexAvatar(avatar2, 660, 275, 90);

    // Noms sous photos
    ctx.fillStyle = "#00FFFF";
    ctx.font = "bold 32px Arial Black";
    ctx.fillText(name1, 240, 420);
    ctx.fillText(name2, 660, 420);

    // Footer Phantom King
    ctx.fillStyle = "#FFD700";
    ctx.font = "bold 28px Impact";
    ctx.fillText("Phantom King", 450, 490);

    // Petits cœurs qui flottent
    ctx.fillStyle = "#FF69B4";
    ctx.font = "30px Arial";
    ctx.fillText("💕", 750, 80);
    ctx.fillText("💖", 120, 450);
    ctx.fillText("💗", 780, 400);

    let cachePath = path.join(__dirname, "cache");
    await fs.ensureDir(cachePath);
    let pathImg = path.join(cachePath, `ship_${Date.now()}.png`);
    fs.writeFileSync(pathImg, canvas.toBuffer());

    api.sendMessage({attachment: fs.createReadStream(pathImg)}, threadID, () => fs.unlinkSync(pathImg), messageID);
  }
                 }
