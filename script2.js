const game = document.getElementById("game");
const words = document.getElementById("words");
const caret = document.getElementById("caret");
const resetBtn = document.getElementById("reset");
const timeLeft = document.getElementById("timeleft");
const wpm = document.getElementById("wpm");
const accuracy = document.getElementById("accuracy");
const durations = document.querySelectorAll(".duration");
let gameInterval = null;
let textData;
let selectedDuration = 30;
let timer = selectedDuration;
let gameStarted = false;
let gameOver = false;
let correctEntries = 0;
let totalTyped = 0;
let selectedGameMode = "listOfQuotes";
let quotes;
let tricky;

//---------------------HELPER FUNCTIONS ---------------------------
const addClass = (el, cls) => {
   el.className += " " + cls;
};
const removeClass = (el, cls) => {
   el.className = el.className.replace(cls, "");
};

const calculateWpmAndAccuracy = () => {
   const minutes = selectedDuration / 60;
   const wordsperminute = Math.round(correctEntries / 5 / minutes);
   const acrcy = Math.round((correctEntries / totalTyped) * 100) || 0;
   wpm.textContent = wordsperminute;
   accuracy.textContent = `${acrcy}%`;
};
//-----------------------TEXT GENERATOR FUNCTION -----------------------

const generateText = async () => {
   textData =
      selectedGameMode === "listOfQuotes"
         ? quotes
         : selectedGameMode === "trickySpelling" && tricky;
   let arrIdx = [...Array(textData.length).keys()];
   const maxItems = selectedGameMode === "listOfQuotes" ? 4 : 50;
   const totalItems = Math.min(textData.length, maxItems);
   let textList = [];
   for (let i = 0; i < totalItems; i++) {
      const randNum = Math.floor(Math.random() * arrIdx.length);
      textList.push(textData[randNum]);
      arrIdx.splice(randNum, 1);
   }
   words.innerHTML = textList
      .join(" ")
      .split("")
      .map((c, _) => {
         return `<span class="char">${c}</span>`;
      })
      .join("");

   //-------------------------SECONDARY EVENT LISTENERS---------------------------------------
};
window.addEventListener("DOMContentLoaded", async () => {
   const response = await fetch("./data.json");
   const data = await response.json();
   quotes = await data.listOfQuotes;
   tricky = await data.trickySpelling;

   await generateText();
   timeLeft.textContent = timer;
   addClass(document.querySelector(".char"), "current");
   game.focus();
});

durations.forEach((btn) => {
   btn.addEventListener("click", () => {
      if (gameStarted) return;

      selectedDuration = Number(btn.dataset.duration);
      timer = selectedDuration;
      timeLeft.textContent = selectedDuration;
      game.focus();
      addClass(document.getElementById("caret"), "caret-animation");

      durations.forEach((d) => removeClass(d, "current-duration"));
      addClass(btn, "current-duration");
   });
});
resetBtn.addEventListener("click", async () => {
   await resetGame();
});
//------------------------------CHANGE GAME MODES----------------------------------------------------

document.querySelectorAll(".game-mode").forEach((btn) => {
   btn.addEventListener("click", async () => {
      selectedGameMode = btn.dataset.mode;
      resetGame();
      document.querySelectorAll(".game-mode").forEach((b) => {
         removeClass(b, "current-game-mode");
      });
      addClass(btn, "current-game-mode");
   });
});

//---------------------------MAIN GAME EVENT LISTENER--------------------------------

game.addEventListener("keydown", (e) => {
   if (gameOver) return;
   const pressedKey = e.key;
   const currentChar = document.querySelector(".char.current");
   const expected = currentChar.innerHTML;
   let letterOrSpace = pressedKey.length === 1 || pressedKey === " ";
   let backSpace = pressedKey === "Backspace";

   if (letterOrSpace) {
      if (!gameStarted) {
         gameStarted = true;
         gameInterval = setInterval(() => {
            timer -= 1;
            timeLeft.innerHTML = timer;
            if (timer <= 0) {
               clearInterval(gameInterval);
               gameOver = true;
               caret.style.display = "none";
               words.style.opacity = "0.5";
               calculateWpmAndAccuracy();
            }
         }, 1000);
      }
      removeClass(document.getElementById("caret"), "caret-animation");

      if (pressedKey === expected) {
         correctEntries++;
         addClass(currentChar, "correct");
      } else if (expected === " " && pressedKey !== " ") {
         addClass(currentChar, "underline");
      } else {
         addClass(currentChar, "incorrect");
      }
      totalTyped++;
      addClass(currentChar.nextSibling, "current");
      removeClass(currentChar, "current");
   }
   if (backSpace) {
      if (!currentChar.previousSibling) return;

      removeClass(currentChar, "current");
      removeClass(currentChar.previousSibling, "correct");
      removeClass(currentChar.previousSibling, "incorrect");
      removeClass(currentChar.previousSibling, "underline");
      addClass(currentChar.previousSibling, "current");
   }

   //-----------caret and line positioning------------
   const rect = currentChar.nextSibling.getBoundingClientRect().top;
   const gameRect = document.getElementById("game").getBoundingClientRect().top;

   const currentHeight = rect - gameRect;
   if (currentHeight > 60) {
      const words = document.getElementById("words");
      const currentMargin = parseInt(words.style.marginTop || "0px");
      words.style.marginTop = currentMargin - 38 + "px";
   }

   const caret = document.getElementById("caret");
   const current = document.querySelector(".char.current");

   if (current) {
      const rect = current.getBoundingClientRect();
      const gameRect = document.getElementById("game").getBoundingClientRect();
      caret.style.left = `${rect.left - gameRect.left}px`;
      caret.style.top = `${rect.top - gameRect.top + 4}px`;
   }
});

//-----------------------------RESET GAME -----------------------------------------------------

const resetGame = async () => {
   clearInterval(gameInterval);

   await generateText();

   timer = selectedDuration;
   timeLeft.textContent = selectedDuration;
   wpm.textContent = "";
   accuracy.textContent = "";

   gameOver = false;
   gameStarted = false;
   totalTyped = 0;
   correctEntries = 0;

   words.style.opacity = "1";
   words.style.marginTop = "0px";
   caret.style.display = "block";
   addClass(document.getElementById("caret"), "caret-animation");

   document.querySelectorAll(".char").forEach((el) => {
      el.classList.remove("current", "correct", "incorrect", "underline");
   });

   const firstChar = document.querySelector(".char");
   if (firstChar) addClass(firstChar, "current");

   const rect = firstChar.getBoundingClientRect();
   const gameRect = game.getBoundingClientRect();
   caret.style.left = `${rect.left - gameRect.left}px`;
   caret.style.top = `${rect.top - gameRect.top + 4}px`;

   game.focus();
};
