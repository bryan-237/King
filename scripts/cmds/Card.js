Cmd install card.js const fs = require("fs-extra");
const { createCanvas, loadImage } = require("canvas");
const path = require("path");

module.exports = {
  config: {
    name: "card",
    version: "2.1.0",
    hasPermssion: 0,
    credits: "Bryan",
    description: "Carte ID Otaku style badge hexagonal",
    commandCategory: "fun",
    usages: "@nom",
    cooldowns: 3
  },

  onStart: async function({ api, event, usersData }) {
    const { threadID, messageID, mentions, senderID } = event;
    let uid = Object.keys(mentions)[0] || senderID;

    let name = await usersData.getName(uid).catch(() => "Otaku");
    let ranks = ["E-RANK","D-RANK","C-RANK","B-RANK","A-RANK","S-RANK","SS-RANK","SSS-RANK"];
    let rank = ranks[Math.floor(Math.random()*ranks.length)];
    let power = Math.floor(Math.random()*9999)+1000;
    let elements = ["FEU","GLACE","FOUDRE","OMBRE","LUMIERE","POISON","VENT","EAU"];
    let element = elements[Math.floor(Math.random()*elements.length)];

    let canvas = createCanvas(850, 500);
    let ctx = canvas.getContext("2d");

    // Fond dégradé noir → violet comme l'image
    let bgGrad = ctx.createLinearGradient(0, 0, 0, 500);
    bgGrad.addColorStop(0, "#0A0A0A");
    bgGrad.addColorStop(1, "#4B0082");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0,0,850,500);

    // Titre OTAKU ID CARD néon cyan
    ctx.fillStyle = "#FFF";
    ctx.shadowColor = "#00FFFF";
    ctx.shadowBlur = 35;
    ctx.font = "bold 60px Impact";
    ctx.textAlign = "center";
    ctx.fillText("OTAKU ID CARD", 425, 85);
    ctx.shadowBlur = 0;

    // Sous-titre NOM RANK
    ctx.fillStyle = "#FFF";
    ctx.font = "28px Arial";
    ctx.fillText("NOM", 200, 130);
    ctx.fillStyle = "#FF69B4";
    ctx.font = "28px Arial";
    ctx.fillText("RANK", 650, 130);

    // Fonction badge hexagonal avec trou
    async function drawHexBadge(imgUrl, x, y, size) {
      let img = await loadImage(imgUrl);

      // Badge externe or néon
      ctx.strokeStyle = "#FFD700";
      ctx.lineWidth = 6;
      ctx.shadowColor = "#FFD700";
      ctx.shadowBlur = 25;
      ctx.beginPath();
      ctx.moveTo(x, y-size-20);
      ctx.lineTo(x+size*0.8, y-size*0.6);
      ctx.lineTo(x+size*0.8, y+size*0.6);
      ctx.lineTo(x, y+size+20);
      ctx.lineTo(x-size*0.8, y+size*0.6);
      ctx.lineTo(x-size*0.8, y-size*0.6);
      ctx.closePath();
      ctx.fillStyle = "#1A1A1A";
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Trou en haut
      ctx.beginPath();
      ctx.arc(x, y-size-10, 12, 0, Math.PI*2);
      ctx.fillStyle = "#4B0082";
      ctx.fill();
      ctx.strokeStyle = "#FFD700";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Hexagone interne cyan
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

      // Bordure hexagone cyan néon
      ctx.strokeStyle = "#00FFFF";
      ctx.lineWidth = 4;
      ctx.shadowColor = "#00FFFF";
      ctx.shadowBlur = 20;
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

    let avatar = `https://graph.facebook.com/${uid}/picture?width=400&height=400&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
    await drawHexBadge(avatar, 220, 270, 90);

    // Infos à droite style l'image
    ctx.textAlign = "left";
    ctx.fillStyle = "#FFF";
    ctx.font = "bold 28px Arial";
    ctx.fillText(rank, 480, 180);

    ctx.fillStyle = "#FFF";
    ctx.font = "24px Arial";
    ctx.fillText("POWER", 480, 240);

    // Barre power cyan → or
    ctx.fillStyle = "#333";
    ctx.beginPath();
    ctx.roundRect(480, 260, 320, 25, 12);
    ctx.fill();
    let powerGrad = ctx.createLinearGradient(480, 0, 800, 0);
    powerGrad.addColorStop(0, "#00FFFF");
    powerGrad.addColorStop(1, "#FFD700");
    ctx.fillStyle = powerGrad;
    let pw = (power/10000)*320;
    ctx.beginPath();
    ctx.roundRect(480, 260, pw, 25, 12);
    ctx.fill();

    ctx.fillStyle = "#FFF";
    ctx.font = "26px Arial";
    ctx.fillText(power, 480, 320);

    ctx.font = "24px Arial";
    ctx.fillText("ELEMENT", 480, 370);

    // Barre element or
    ctx.fillStyle = "#333";
    ctx.beginPath();
    ctx.roundRect(480, 390, 320, 25, 12);
    ctx.fill();
    ctx.fillStyle = "#FFD700";
    ctx.beginPath();
    ctx.roundRect(480, 390, 280, 25, 12);
    ctx.fill();

    ctx.fillStyle = "#FFF";
    ctx.font = "bold 26px Arial";
    ctx.fillText(element, 480, 450);

    // Ombre sous badge
    ctx.fillStyle = "rgba(0,0,0,0.4)";
    ctx.beginPath();
    ctx.ellipse(220, 420, 100, 25, 0, 0, Math.PI*2);
    ctx.fill();

    let cachePath = path.join(__dirname, "cache");
    await fs.ensureDir(cachePath);
    let pathImg = path.join(cachePath, `card_${uid}.png`);
    fs.writeFileSync(pathImg, canvas.toBuffer());

    api.sendMessage({attachment: fs.createReadStream(pathImg)}, threadID, () => fs.unlinkSync(pathImg), messageID);
  }
      }
