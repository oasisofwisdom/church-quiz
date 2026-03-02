const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const fs = require("fs");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

app.use(express.static("public"));

// =====================
// DATA STORAGE
// =====================
let participants = {}; // socket.id => {name, examNumber}
let scores = {};       // name => score
let currentSection = "";
let questionIndex = 0;
let currentQuestion = {};
let answers = {};
let answeredQuestions = {};
let sections = {};     // Loaded from questions.json

// =====================
// LOAD QUESTIONS.JSON
// =====================
const questionsPath = path.join(__dirname, "public", "questions.json");
if (fs.existsSync(questionsPath)) {
  const rawData = fs.readFileSync(questionsPath);
  sections = JSON.parse(rawData);
  console.log("Questions loaded:", Object.keys(sections));
} else {
  console.error("questions.json not found in /public folder!");
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

  // Admin requests sections
  socket.on("get_sections", () => {
    io.to(socket.id).emit("sections_list", Object.keys(sections));
  });

  // Admin starts a section
  socket.on("start_section", section => {
    if (!sections[section]) return;
    currentSection = section;
    questionIndex = 0;
    answeredQuestions[section] = sections[section].map(() => false);
    io.emit("section_started", section);
    io.emit("admin_section_questions", {
      section,
      questions: sections[section],
      answered: answeredQuestions[section]
    });
  });

  // Admin sends next question
  socket.on("new_question", () => {
    const sectionQuestions = sections[currentSection];
    if (!sectionQuestions || questionIndex >= sectionQuestions.length) return;

    currentQuestion = sectionQuestions[questionIndex];
    answers = {};
    io.emit("question", currentQuestion);
    io.emit("answers_update", { answers });
  });

  // Admin starts timer
  socket.on("start_timer", () => {
    io.emit("start_timer");
  });

  // Admin sends waiting message
  socket.on("waiting_message", () => {
    io.emit("waiting_message", {
      text: "Welcome to BBC 7.0 Quiz Page.\nWaiting for Quiz Master to begin Quiz."
    });
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
    const sectionQuestions = sections[currentSection];

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
