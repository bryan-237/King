const fs = require("fs-extra");
const { createCanvas } = require("canvas");
const path = require("path");

module.exports = {
  config: {
    name: "slot",
    version: "3.0.0",
    hasPermssion: 0,
    credits: "Bryan",
    description: "Machine à sous Otaku SSS-RANK",
    commandCategory: "games",
    usages: "[bet]",
    cooldowns: 3
  },

  onStart: async function({ api, event, args, Users }) {
    const { threadID, messageID, senderID } = event;
    let name = await Users.getName(senderID).catch(() => "Joueur");

    let bet = parseInt(args[0]) || 200;
    let userData = await Users.getData(senderID).catch(() => ({money: 0}));
    let balance = userData.money || 0;

    if(balance < bet) return api.sendMessage(`💀 Balance insuffisante: ${balance} POWER`, threadID, messageID);

    let symbols = ["⚡","🔥","💎","🍋","🍒","⭐"];
    let roll = [symbols[Math.floor(Math.random()*6)], symbols[Math.floor(Math.random()*6)], symbols[Math.floor(Math.random()*6)]];

    let win = 0;
    let type = "lose";
    let title = "SLOT MACHINE";
    let subtitle = "";
    let color1 = "#00FFFF";
    let color2 = "#1A0033";

    if(roll[0] == roll[1] && roll[1] == roll[2]) {
      win = 10000;
      type = "jackpot";
      title = "SSS-RANK JACKPOT!!!";
      subtitle = "3 matching symbols! CRIT!!!";
      color1 = "#FFD700";
      color2 = "#FFA500";
    } else if(roll[0] == roll[1] || roll[1] == roll[2] || roll[0] == roll[2]) {
      win = 400;
      type = "win";
      title = "SLOT MACHINE";
      subtitle = "2 matching symbols! NICE!";
      color1 = "#00FFFF";
      color2 = "#1A0033";
    } else {
      type = "lose";
      title = "F-RANK... PERDU 💀";
      subtitle = "0 matching... Try again!";
      color1 = "#FF0000";
      color2 = "#330000";
    }

    await Users.setData(senderID, { money: balance - bet });
    if(win > 0) await Users.setData(senderID, { money: balance - bet + win + bet });
    let newBalance = (await Users.getData(senderID)).money;

    // Canvas 800x600 style ton image
    let canvas = createCanvas(800, 600);
    let ctx = canvas.getContext("2d");

    // Background gradient violet/noir
    let grad = ctx.createLinearGradient(0,0,0,600);
    grad.addColorStop(0, "#0A0A0A");
    grad.addColorStop(1, color2);
    ctx.fillStyle = grad;
    ctx.fillRect(0,0,800,600);

    // Double bordure comme ton image: or + cyan
    ctx.strokeStyle = color1;
    ctx.lineWidth = 10;
    ctx.shadowColor = color1;
    ctx.shadowBlur = 40;
    ctx.strokeRect(25,25,750,550);

    ctx.strokeStyle = "#00FFFF";
    ctx.lineWidth = 6;
    ctx.strokeRect(40,40,720,520);
    ctx.shadowBlur = 0;

    // Titre SSS-RANK JACKPOT!!!
    ctx.fillStyle = "#FFD700";
    ctx.shadowColor = "#FFD700";
    ctx.shadowBlur = 30;
    ctx.font = "bold 50px Impact";
    ctx.textAlign = "center";
    ctx.fillText(title, 400, 80);
    ctx.shadowBlur = 0;

    // Slots style boîte violette
    ctx.font = "100px Arial";
    ctx.fillStyle = "#FFFFFF";
    ctx.shadowColor = color1;
    ctx.shadowBlur = 20;
    ctx.fillText(`[ ${roll[0]} | ${roll[1]} | ${roll[2]} ]`, 400, 200);
    ctx.shadowBlur = 0;

    // Subtitle
    ctx.fillStyle = "#FFD700";
    ctx.font = "bold 28px Arial";
    ctx.fillText(subtitle, 400, 280);

    // WON
    ctx.font = "bold 60px Impact";
    ctx.fillStyle = type == "jackpot"? "#FFD700" : type == "win"? "#00FFFF" : "#FF0000";
    ctx.shadowColor = ctx.fillStyle;
    ctx.shadowBlur = 25;
    ctx.fillText(`WON: ${win} POWER`, 400, 370);
    ctx.shadowBlur = 0;

    // BALANCE
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 32px Arial";
    ctx.fillText(`BALANCE: ${newBalance} POWER`, 400, 450);

    // Spins
    ctx.fillStyle = "#00FFFF";
    ctx.font = "24px Arial";
    ctx.fillText(`SPINS USED TODAY: 1/100`, 400, 500);

    let cachePath = path.join(__dirname, "cache");
    await fs.ensureDir(cachePath);
    let pathImg = path.join(cachePath, `slot_${senderID}.png`);
    fs.writeFileSync(pathImg, canvas.toBuffer());

    api.sendMessage({attachment: fs.createReadStream(pathImg)}, threadID, () => fs.unlinkSync(pathImg), messageID);
  }
        }
