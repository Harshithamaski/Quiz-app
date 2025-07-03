function validateLogin() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
  
    if (username === "" || password === "") {
      alert("Please enter both username and password.");
    } else {
      localStorage.setItem("quizUser", username);
      window.location.href = "home.html";
    }
  }
  // Host (Create Room) Questions 
  const hostQuizData = [
    {
      question: "Which tag is used to create a hyperlink in HTML?",
      options: ["<link>", "<a>", "<href>", "<hyper>"],
      answer: "<a>"
    },
    {
      question: "Which CSS property is used to change text color?",
      options: ["background", "font-color", "color", "text-style"],
      answer: "color"
    },
    {
      question: "Which language is commonly used for backend in web dev?",
      options: ["HTML", "Python", "CSS", "SQL"],
      answer: "Python"
    },
    {
      question: "What does AI stand for?",
      options: ["Artificial Instinct", "Advanced Intelligence", "Automatic Interface", "Artificial Intelligence"],
      answer: "Artificial Intelligence"
    },
    {
      question: "Which data structure uses FIFO (First In First Out)?",
      options: ["Stack", "Queue", "Tree", "Graph"],
      answer: "Queue"
    },
    {
      question: "Which keyword is used to define a function in Python?",
      options: ["def", "function", "fun", "define"],
      answer: "def"
    },
    {
      question: "Which sorting algorithm has the best average case time complexity?",
      options: ["Bubble Sort", "Selection Sort", "Merge Sort", "Linear Sort"],
      answer: "Merge Sort"
    },
    {
      question: "In Java, which keyword is used to inherit a class?",
      options: ["implements", "inherits", "extends", "instanceof"],
      answer: "extends"
    },
    {
      question: "What does DOM stand for in JavaScript?",
      options: ["Document Object Method", "Document Object Model", "Data Object Module", "Desktop Oriented Mode"],
      answer: "Document Object Model"
    },
    {
      question: "Which Python library is popular for machine learning?",
      options: ["NumPy", "Matplotlib", "TensorFlow", "Flask"],
      answer: "TensorFlow"
    }
  ];
  // Guest (Join Room) Questions
const guestQuizData = [
    {
      question: "What is the output of 2 + '2' in JavaScript?",
      options: ["4", "22", "NaN", "Error"],
      answer: "22"
    },
    {
      question: "Which language is used for styling web pages?",
      options: ["HTML", "JQuery", "CSS", "XML"],
      answer: "CSS"
    },
    {
      question: "Which of the following is a Python web framework?",
      options: ["TensorFlow", "Flask", "PyTorch", "NumPy"],
      answer: "Flask"
    },
    {
      question: "What is JSX?",
      options: ["A CSS extension", "A JavaScript framework", "A syntax extension for React", "A Python library"],
      answer: "A syntax extension for React"
    },
    {
      question: "What does SQL stand for?",
      options: ["Structured Query Language", "Strong Question List", "Styled Query Language", "Sorted Queue Language"],
      answer: "Structured Query Language"
    },
    {
      question: "Which keyword creates a constant in JavaScript?",
      options: ["let", "var", "constant", "const"],
      answer: "const"
    },
    {
      question: "What is the output of typeof null in JS?",
      options: ["null", "object", "undefined", "number"],
      answer: "object"
    },
    {
      question: "Which tag is used to define a table row?",
      options: ["<th>", "<tr>", "<td>", "<row>"],
      answer: "<tr>"
    },
    {
      question: "What is Big O notation used for?",
      options: ["Measuring time", "Looping", "Sorting", "Algorithm complexity"],
      answer: "Algorithm complexity"
    },
    {
      question: "Which company developed React?",
      options: ["Google", "Facebook", "Microsoft", "Twitter"],
      answer: "Facebook"
    }
  ];
  let currentQuestion = 0;
  let score = 0;
  let timer;
  let timeLeft = 15;
  const isHost = localStorage.getItem("isHost") === "true";
const quizData = isHost ? hostQuizData : guestQuizData;

  const user = localStorage.getItem("quizUser");
  if (user) {
    const welcomeText = document.getElementById("welcome-user");
    if (welcomeText) welcomeText.textContent = `👋 Welcome, ${user}!`;
  }
  
  function loadQuestion() {
    const q = quizData[currentQuestion];
    document.getElementById("question").textContent = q.question;
  
    const optionsDiv = document.getElementById("options");
    optionsDiv.innerHTML = "";
  
    q.options.forEach(option => {
      const btn = document.createElement("button");
      btn.textContent = option;
      btn.onclick = () => checkAnswer(option);
      optionsDiv.appendChild(btn);
    });
  
    startTimer();
  }
  
  function startTimer() {
    clearInterval(timer);
    timeLeft = 15;
  
    const footer = document.querySelector(".quiz-footer");
    let timerDisplay = document.getElementById("timer");
  
    if (!timerDisplay) {
      timerDisplay = document.createElement("p");
      timerDisplay.id = "timer";
      footer.insertBefore(timerDisplay, footer.firstChild);
    }
  
    timerDisplay.textContent = `⏱️ Time left: ${timeLeft}s`;
  
    timer = setInterval(() => {
      timeLeft--;
      timerDisplay.textContent = `⏱️ Time left: ${timeLeft}s`;
  
      if (timeLeft === 0) {
        clearInterval(timer);
        document.querySelectorAll("#options button").forEach(btn => btn.disabled = true);
        document.querySelector(".next-btn").disabled = false;
      }
    }, 1000);
  }

  function checkAnswer(selected) {
    clearInterval(timer);
  
    const correct = quizData[currentQuestion].answer;
  
    const sound = selected === correct
      ? document.getElementById("correct-sound")
      : document.getElementById("wrong-sound");
    if (sound) sound.play();
  
    if (selected === correct) {
      score++;
      document.getElementById("score").textContent = `Score: ${score}`;
  
      // 💰 Add coin for correct answer
      let coins = parseInt(localStorage.getItem("coins")) || 0;
      coins += 1;
      localStorage.setItem("coins", coins);
    }
  
    // ✅ Apply green/red background colors
    const optionButtons = document.querySelectorAll("#options button");
    optionButtons.forEach(btn => {
      btn.disabled = true;
      if (btn.textContent === correct) {
        btn.style.backgroundColor = "#a5d6a7"; // Green
      }
      if (btn.textContent === selected && selected !== correct) {
        btn.style.backgroundColor = "#ef9a9a"; // Red
      }
    });
  
    document.querySelector(".next-btn").disabled = false;
  }
  
  function nextQuestion() {
    currentQuestion++;
    if (currentQuestion < quizData.length) {
      loadQuestion();
    } else {
      showResult();
    }
  }
  
  function showResult() {
    const quizBox = document.querySelector(".quiz-wrapper");
    let message = "";
    let emoji = "";
  
    if (score === 10) {
      message = "Perfect! You're a pro!";
      emoji = "🎉";
    } else if (score >= 7) {
      message = "Great job!";
      emoji = "😎";
    } else if (score >= 4) {
      message = "Good try!";
      emoji = "🙂";
    } else {
      message = "Keep practicing!";
      emoji = "🤓";
    }
  
    updateHighScore(score);
    updateLeaderboard(user, score);
    addCoins(score * 2); // 💰 2 coins per correct answer

    quizBox.innerHTML = `
      <h2>Quiz Completed ${emoji}</h2>
      <p>Your Score: <strong>${score} / ${quizData.length}</strong></p>
      <p>🥇 High Score: <strong>${getHighScore()} / ${quizData.length}</strong></p>
      <p>${message}</p>
      <button class="next-btn" onclick="restartQuiz()">🔁 Play Again</button>
    `;
  }
  
  function updateLeaderboard(name, score) {
    let data = JSON.parse(localStorage.getItem("leaderboard")) || [];
    data.push({ name, score });
  
    // Keep only top 5 scores
    data.sort((a, b) => b.score - a.score);
    data = data.slice(0, 5);
  
    localStorage.setItem("leaderboard", JSON.stringify(data));
  }
  updateLeaderboard(user || "Player", score);

  function restartQuiz() {
    window.location.reload();
  }
  
  function updateHighScore(currentScore) {
    const best = localStorage.getItem("highScore") || 0;
    if (currentScore > best) {
      localStorage.setItem("highScore", currentScore);
    }
  }
  
  function getHighScore() {
    return localStorage.getItem("highScore") || 0;
  } 

  // room //
  function createRoom() {
    const roomCode = Math.random().toString(36).substring(2, 7).toUpperCase();
    localStorage.setItem("roomCode", roomCode);
    localStorage.setItem("isHost", true);
    window.location.href = "soloquiz.html"; // or multiplayer.html if you prefer later
  }
  
  function joinRoom() {
    const roomCode = prompt("Enter Room Code:");
    if (roomCode && roomCode.trim() !== "") {
      localStorage.setItem("roomCode", roomCode.trim().toUpperCase());
      localStorage.setItem("isHost", false);
      window.location.href = "soloquiz.html"; // or multiplayer.html if you create it later
    } else {
      alert("Please enter a valid room code.");
    }
  }
  function openJoinRoomPopup() {
    document.getElementById("joinRoomPopup").classList.remove("hidden");
  }

  function closePopup() {
    document.getElementById("joinRoomPopup").classList.add("hidden");
  }

  function submitRoomCode() {
    const code = document.getElementById("roomCodeInput").value.trim();
    if (code === "") {
      alert("Please enter a room code.");
    } else {
      localStorage.setItem("roomCode", code);
      localStorage.setItem("isHost", false);
      window.location.href = "soloquiz.html";

    }
  }
  function openCreateRoomPopup() {
    document.getElementById("createRoomPopup").classList.remove("hidden");
  }
  
  function submitCreateRoom() {
    let roomCode = document.getElementById("createRoomInput").value.trim();
  
    if (roomCode === "") {
      // Generate a random 5-letter uppercase code
      roomCode = Math.random().toString(36).substring(2, 7).toUpperCase();
    }
  
    localStorage.setItem("roomCode", roomCode);
    localStorage.setItem("isHost", true);
    window.location.href = "soloquiz.html";
    // Or your quiz page
  }
  function closePopup() {
    document.getElementById("joinRoomPopup").classList.add("hidden");
    document.getElementById("createRoomPopup").classList.add("hidden");
  }
  // leader board 
  function updateLeaderboard(username, score) {
    let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
  
    leaderboard.push({ name: username, score: score });
  
    // Sort by score, highest first
    leaderboard.sort((a, b) => b.score - a.score);
  
    // Keep only top 5
    leaderboard = leaderboard.slice(0, 5);
  
    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
  }
  function showLeaderboard() {
    const popup = document.getElementById("leaderboardPopup");
    const list = document.getElementById("leaderboardList");
    const data = JSON.parse(localStorage.getItem("leaderboard")) || [];
  
    list.innerHTML = "";
  
    if (data.length === 0) {
      list.innerHTML = "<li>No scores yet!</li>";
    } else {
      data.forEach(entry => {
        const li = document.createElement("li");
        li.textContent = `${entry.name} - ${entry.score}`;
        list.appendChild(li);
      });
    }
  
    popup.classList.remove("hidden");
  }
  function closePopup() {
    const popups = document.querySelectorAll(".popup");
    popups.forEach(popup => popup.classList.add("hidden"));
  }
  function addCoins(amount) {
    let currentCoins = parseInt(localStorage.getItem("coins") || "0");
    currentCoins += amount;
    localStorage.setItem("coins", currentCoins);
  }
  function showCoins() {
    const popup = document.getElementById("coinsPopup");
    const count = parseInt(localStorage.getItem("coins") || "0");
    document.getElementById("coinCount").textContent = `Coins: ${count}`;
    popup.classList.remove("hidden");
  }
// coins // 
function showCoins() {
    const popup = document.getElementById("coinsPopup");
    const coinText = document.getElementById("coinCount");
    const coins = localStorage.getItem("coins") || 0;
  
    coinText.textContent = `${coins} 🪙 Coins`;
    popup.classList.remove("hidden");
  }
  
  function closePopup() {
    const popups = document.querySelectorAll(".popup");
    popups.forEach(popup => popup.classList.add("hidden"));
  }
  function showProfile() {
    const username = localStorage.getItem("quizUser") || "Guest";
    const highScore = localStorage.getItem("highScore") || 0;
    const coins = localStorage.getItem("coinCount") || 0;
  
    document.getElementById("profileName").textContent = username;
    document.getElementById("profileScore").textContent = highScore;
    document.getElementById("profileCoins").textContent = coins;
  
    document.getElementById("profilePopup").classList.remove("hidden");
  }
  function signOut() {
  localStorage.clear(); // Clears username, score, coins, etc.
  window.location.href = "index.html"; // Or your login page
}
// settings //
function showSettings() {
    document.getElementById("settingsPopup").classList.remove("hidden");
  }
  
  document.getElementById("soundToggle").addEventListener("change", function () {
    const soundEnabled = this.checked;
    localStorage.setItem("sound", soundEnabled);
  });
  
  document.getElementById("darkModeToggle").addEventListener("change", function () {
    const isDark = this.checked;
    document.body.classList.toggle("dark-mode", isDark);
    localStorage.setItem("darkMode", isDark);
  });
  
  // Optional: apply saved settings on load
  window.onload = function () {
    if (localStorage.getItem("darkMode") === "true") {
      document.body.classList.add("dark-mode");
      document.getElementById("darkModeToggle").checked = true;
    }
  
    if (localStorage.getItem("sound") === "false") {
      document.getElementById("soundToggle").checked = false;
    }
  };

  

  