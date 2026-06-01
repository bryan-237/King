// quiz.js
module.exports = {
  config: {
    name: "quiz",
    version: "1.0.0",
    author: "PrinceDev",
    role: 1, // 1 = tous peuvent lancer
    category: "Fun",
    description: "Démarre un quiz automatique",
    usages: "quiz [catégorie]",
    cooldowns: 5
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID, senderID } = event;

    const category = args[0]?.toLowerCase();
    const quizData = {
      sport: [
        { question: "Quel sport utilise un ballon ovale?", options: ["A: Football", "B: Rugby", "C: Basket", "D: Handball"], answer: "B" },
        { question: "Combien de joueurs sur un terrain de football?", options: ["A: 9", "B: 10", "C: 11", "D: 12"], answer: "C" },
        // ajoute 8 autres questions...
      ],
      culture: [
        { question: "Quelle est la capitale de la France?", options: ["A: Madrid", "B: Rome", "C: Paris", "D: Berlin"], answer: "C" },
      ],
      science: [
        { question: "Quelle planète est la plus proche du Soleil?", options: ["A: Vénus", "B: Mercure", "C: Mars", "D: Terre"], answer: "B" },
      ],
      musique: [],
      animes: [],
      series: [],
      drapeaux: [],
      math: []
    };

    if (!category || !quizData[category]) {
      return api.sendMessage("Choisis une catégorie valide : sport, culture, science, musique, animes, series, drapeaux, math.", threadID, messageID);
    }

    // 1. Invitation à rejoindre
    const participants = new Set();
    api.sendMessage(`📢 Quiz sur **${category}** démarre dans 20 secondes ! Tapez "join" pour participer.`, threadID);

    const filterJoin = (m) => m.body.toLowerCase() === "join";
    const joinListener = async (response) => {
      if (filterJoin(response)) participants.add(response.senderID);
    };

    api.listen("message", joinListener);
    await new Promise(r => setTimeout(r, 20000));
    api.removeListener("message", joinListener);

    if (participants.size === 0) return api.sendMessage("Personne n'a rejoint le quiz 😢", threadID, messageID);

    // 2. Démarrage du quiz
    const scores = {};
    participants.forEach(id => scores[id] = 0);
    api.sendMessage(`Le quiz commence avec ${participants.size} participant(s) !`, threadID);

    for (let i = 0; i < quizData[category].length; i++) {
      const q = quizData[category][i];
      api.sendMessage(`**Question ${i+1}:** ${q.question}\n${q.options.join("\n")}`, threadID);

      const answerListener = (response) => {
        if (participants.has(response.senderID)) {
          const answer = response.body.toUpperCase();
          if (["A","B","C","D"].includes(answer) && answer === q.answer) {
            scores[response.senderID] += 10;
          }
        }
      };

      api.listen("message", answerListener);
      await new Promise(r => setTimeout(r, 15000)); // 15s pour répondre
      api.removeListener("message", answerListener);
    }

    // 3. Affichage des résultats
    let results = "**Résultats du Quiz:**\n";
    Object.entries(scores).sort((a,b) => b[1]-a[1]).forEach(([id, score], idx) => {
      results += `${idx+1}. ${id}: ${score}/100\n`;
    });
    api.sendMessage(results, threadID);
  }
};
