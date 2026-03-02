const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const fs = require("fs");
const path = require("path");

const app = express();
const server = http.createServer(app);

// Socket.io with CORS for mobile/remote access
const io = new Server(server, {
  cors: { origin: "*" }
});

app.use(express.static("public"));

// =====================
// DATA STORAGE
// =====================
let participants = {};     // socket.id => {name, examNumber}
let scores = {};           // name => score
let currentQuestion = {};
let answers = {};
let currentSection = "";
let questionIndex = 0;
let quiz = {};             // Will hold questions loaded from JSON
let answeredQuestions = {}; // Track answered questions per section

// =====================
// LOAD QUESTIONS FROM JSON
// =====================
const questionsPath = path.join(__dirname, "questions.json");

try {
  const rawData = fs.readFileSync(questionsPath);
  quiz = JSON.parse(rawData);
  console.log("Questions loaded from questions.json");
} catch (err) {
  console.error("Error reading questions.json:", err);
  process.exit(1);
}

// =====================
// SOCKET EVENTS
// =====================
io.on("connection", socket => {
  console.log("Connected:", socket.id);

  // Participant joins
  socket.on("join", data => {
    participants[socket.id] = { name: data.name, examNumber: data.examNumber };
    if (!(data.name in scores)) scores[data.name] = 0;

    io.emit("participants_update", participants);
    io.emit("leaderboard_update", scores);
  });

  // Admin starts a section
  socket.on("start_section", section => {
    if (!quiz[section]) return;

    currentSection = section;
    questionIndex = 0;

    answeredQuestions[section] = quiz[section].map(() => false);

    io.emit("section_started", section);
    io.emit("admin_section_questions", {
      section,
      questions: quiz[section],
      answered: answeredQuestions[section]
    });
  });

  // Admin sends current question
  socket.on("new_question", () => {
    const sectionQuestions = quiz[currentSection];
    if (!sectionQuestions || questionIndex >= sectionQuestions.length) return;

    currentQuestion = sectionQuestions[questionIndex];
    answers = {};

    io.emit("question", currentQuestion);
    io.emit("answers_update", { answers });
  });

  // Admin starts 15-second timer
  socket.on("start_timer", () => {
    io.emit("start_timer");
  });

  // Participant answers
  socket.on("answer", data => {
    if (!participants[socket.id]) return;
    const name = participants[socket.id].name;
    answers[name] = data.answer;
    io.emit("answers_update", { answers });
  });

  // Admin reveals correct answer
  socket.on("show_correct", () => {
    const results = {};

    for (let name in answers) {
      const correct = answers[name].startsWith(currentQuestion.correct);
      if (correct) scores[name] += 1;
      results[name] = { answer: answers[name], correct };
    }

    answeredQuestions[currentSection][questionIndex] = true;

    io.emit("correct_answer", {
      correctOption: currentQuestion.correct,
      results,
      scores,
      section: currentSection,
      questionIndex
    });

    io.emit("leaderboard_update", scores);
  });

  // Admin goes to next question
  socket.on("next_question", () => {
    questionIndex++;
    const sectionQuestions = quiz[currentSection];

    if (questionIndex < sectionQuestions.length) {
      currentQuestion = sectionQuestions[questionIndex];
      answers = {};
      io.emit("question", currentQuestion);
      io.emit("answers_update", { answers });
    } else {
      io.emit("section_complete", currentSection);
      questionIndex = 0;
    }
  });

  // Admin sends message to participants
  socket.on("admin_message", msg => {
    io.emit("admin_message", msg);
  });

  // Export results to CSV
  socket.on("export_results", () => {
    let csv = "Name,Exam Number,Score\n";
    for (let id in participants) {
      const p = participants[id];
      csv += `${p.name},${p.examNumber},${scores[p.name] || 0}\n`;
    }
    fs.writeFileSync("quiz_results.csv", csv);
    console.log("Results exported to quiz_results.csv");
  });

  // Disconnect
  socket.on("disconnect", () => {
    delete participants[socket.id];
    io.emit("participants_update", participants);
    io.emit("leaderboard_update", scores);
  });
});

// =====================
// START SERVER
// =====================
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
