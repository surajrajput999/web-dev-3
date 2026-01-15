// ==========================================
// PART 1: API Fetching (With Random Offline Jokes)
// ==========================================

const setupEl = document.getElementById("setup");
const punchlineEl = document.getElementById("punchline");
const newJokeBtn = document.getElementById("new-joke-btn");

// Stable API URL
const API_URL =
  "https://v2.jokeapi.dev/joke/Programming?blacklistFlags=nsfw,religious,political,racist,sexist,explicit&type=twopart";

// --- LIST OF BEST JOKES (Offline Backup) ---
const offlineJokes = [
  {
    setup: "Why do programmers prefer dark mode?",
    delivery: "Because light attracts bugs! 🐛",
  },
  {
    setup: "How many programmers does it take to change a light bulb?",
    delivery: "None. It's a hardware problem. 💡",
  },
  {
    setup: "Why did the developer go broke?",
    delivery: "Because he used up all his cache! 💸",
  },
  {
    setup: "A SQL query walks into a bar, walks up to two tables and asks...",
    delivery: "'Can I join you?' 😆",
  },
  {
    setup: "Why do Java developers wear glasses?",
    delivery: "Because they don't C# (See Sharp)! 👓",
  },
  {
    setup: "What is a programmer's favorite hangout place?",
    delivery: "The Foo Bar. 🍻",
  },
];

async function fetchJoke() {
  // 1. Show Loading State
  setupEl.textContent = "Fetching a fresh joke...";
  punchlineEl.textContent = "Wait for it...";
  setupEl.style.color = "#2d3436";

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    // Success: Update UI from API
    setupEl.textContent = data.setup;
    punchlineEl.textContent = `> ${data.delivery}`;
  } catch (error) {
    console.error("API Error (Switching to Offline Mode):", error);

    // --- RANDOM JOKE SELECTOR (Offline Mode) ---
    const randomIndex = Math.floor(Math.random() * offlineJokes.length);
    const randomJoke = offlineJokes[randomIndex];

    setupEl.textContent = randomJoke.setup;
    punchlineEl.textContent = `> ${randomJoke.delivery} (Offline Mode)`;
    setupEl.style.color = "#e74c3c"; // Red color for offline indication
  }
}

// Fetch on load and on click
newJokeBtn.addEventListener("click", fetchJoke);
fetchJoke(); // Initial load

// ==========================================
// PART 2: Interactive Quiz Logic
// ==========================================

const questions = [
  {
    question: "What does DOM stand for?",
    options: [
      "Document Object Model",
      "Data Object Mode",
      "Digital Ordinance Model",
      "Desktop Orientation Module",
    ],
    answer: 0,
  },
  {
    question: "Which keyword is used to declare a constant in JavaScript?",
    options: ["var", "let", "const", "fixed"],
    answer: 2,
  },
  {
    question: "What is the purpose of CSS Media Queries?",
    options: [
      "To fetch data from API",
      "To make designs responsive",
      "To run database queries",
      "To animate images",
    ],
    answer: 1,
  },
  {
    question: "Which HTTP method is used to request data from a server?",
    options: ["POST", "PUT", "GET", "DELETE"],
    answer: 2,
  },
  {
    question: "What does 'NaN' stand for in JavaScript?",
    options: ["Not a Null", "New and Native", "Not a Number", "None and Null"],
    answer: 2,
  },
];

let currentQuestionIndex = 0;
let score = 0;

const questionText = document.getElementById("question-text");
const optionsContainer = document.getElementById("options-container");
const feedbackEl = document.getElementById("feedback");
const nextBtn = document.getElementById("next-btn");
const scoreBadge = document.getElementById("score-badge");

function loadQuestion() {
  const currentQuestion = questions[currentQuestionIndex];

  questionText.textContent = `${currentQuestionIndex + 1}. ${
    currentQuestion.question
  }`;

  optionsContainer.innerHTML = "";
  feedbackEl.textContent = "";
  nextBtn.classList.add("hidden");

  currentQuestion.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.textContent = option;
    button.classList.add("option-btn");
    button.onclick = () => checkAnswer(index, button);
    optionsContainer.appendChild(button);
  });
}

function checkAnswer(selectedIndex, button) {
  const currentQuestion = questions[currentQuestionIndex];
  const allButtons = document.querySelectorAll(".option-btn");

  allButtons.forEach((btn) => btn.classList.add("disabled"));

  if (selectedIndex === currentQuestion.answer) {
    button.classList.add("correct");
    feedbackEl.textContent = "Correct! 🎉";
    feedbackEl.style.color = "var(--success)";
    score++;
    scoreBadge.textContent = `Score: ${score}`;
  } else {
    button.classList.add("wrong");
    allButtons[currentQuestion.answer].classList.add("correct");
    feedbackEl.textContent = "Wrong Answer! ❌";
    feedbackEl.style.color = "var(--error)";
  }

  nextBtn.classList.remove("hidden");
}

nextBtn.addEventListener("click", () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    loadQuestion();
  } else {
    questionText.textContent = `Quiz Completed! You scored ${score} out of ${questions.length}.`;
    optionsContainer.innerHTML = "";
    nextBtn.textContent = "Restart Quiz";
    nextBtn.onclick = () => location.reload();
  }
});

loadQuestion();
