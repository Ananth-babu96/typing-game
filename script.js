let paragraphs;

// const paragraphs = [
//    "The rain fell gently over the old village, coating rooftops in a silver sheen. Children ran barefoot through puddles, laughing as the water splashed around their ankles. An elderly man watched from his porch, sipping warm tea, the steam curling in the cool air. Nearby, a cat darted beneath a cart, chasing the scent of roasted fish from a nearby stall. Life moved slowly here, but every moment seemed stitched with peace. Lanterns flickered on as dusk crept in, painting soft glows on cobbled stones. It was a town that remembered how to breathe deeply.",

//    "In the heart of the desert, a lone traveler paused beside a rusted signpost. Wind whipped across the dunes, shaping golden waves that stretched into the horizon. Her compass trembled slightly in her palm, pointing toward a distant mountain range cloaked in mirage. The sun hung low, casting shadows across her boots. Crows circled overhead, their cries lost to the emptiness. She adjusted the straps on her backpack and continued forward. Somewhere out there was an oasis, rumored to shimmer with crystal waters and hidden truths. With every step, she walked deeper into legend.",

//    "The library towered above the town square, its stone walls cloaked in ivy and mystery. Inside, shelves stretched from floor to ceiling, stacked with books older than memory. The scent of aged parchment and polished wood filled the air. A boy, barely ten, tiptoed through the aisles, clutching a worn notebook and pencil. He sought stories whispered about in bedtime tales — dragons, time travelers, secret codes. A flickering candle led him to a narrow passage he hadn’t noticed before. Beyond it, a spiral staircase curled downward into shadow. The boy’s heart pounded with wonder and fear.",

//    "On the edge of a cliff, a lighthouse stood like a sentinel, watching over the restless sea. Waves slammed into jagged rocks below, hissing and foaming with untamed energy. Inside, the keeper wound the massive light, gears clinking with each careful turn. The beacon blinked rhythmically, slicing through the mist like a blade. He jotted notes into a journal, sketching passing ships and distant constellations. Outside, gulls cried into the wind. The world was loud with nature’s voice, but up here, he felt something quiet and eternal. The lighthouse didn’t just guide ships — it held stories.",

//    "Beneath a canopy of fireflies, the forest whispered forgotten secrets. Moonlight painted silver ribbons along the forest floor, and every tree seemed alive with memory. A girl crouched by a stream, watching its gentle flow over mossy stones. In her hand, she held a charm passed down from generations, said to protect those who listened carefully. She heard footsteps — not her own — but didn’t flee. Instead, she waited. Something ancient stirred in the shadows. Magic, not seen for a hundred years, was waking. And in the stillness between heartbeats, the forest breathed her name.",
// ];

let words = "hello";

const setQuotes = async () => {
   const response = await fetch("./data.json");
   const data = await response.json();
   paragraphs = data.listOfQuotes;

   let nums = [...Array(paragraphs.length).keys()];
   let ranNums = [];
   let totalStr = [];
   for (let i = 0; i < 3; i++) {
      let j = Math.floor(Math.random() * nums.length);
      ranNums.push(nums[j]);
      totalStr.push(paragraphs[j]);
      nums.splice(j, 1);
   }
   words = totalStr.join(" ");
};
setQuotes();

const durationBtns = document.querySelectorAll(".duration");
const wordsCount = words.length;
window.gameStarted = false;
window.timer = 30;
window.timeStart = 30;
window.gameOver = false;
let selectedDur = 30;
let totalTyped = 0;
let correctChars = 0;
const timeleft = document.getElementById("timeleft");
timeleft.innerHTML = window.timer;
let gameInterval = null;

const addClass = (element, cls) => {
   element.className += " " + cls;
};
const removeClass = (element, cls) => {
   element.className = element.className.replace(cls, "");
};
durationBtns.forEach((btn) => {
   btn.addEventListener("click", () => {
      if (gameStarted) return;

      const dur = Number(btn.dataset.duration);
      window.timer = dur;
      window.timeStart = dur;
      selectedDur = dur;
      timeleft.innerHTML = window.timer;

      durationBtns.forEach((b) => removeClass(b, "current-duration"));

      addClass(btn, "current-duration");
   });
});

window.addEventListener("DOMContentLoaded", async () => {
   await setQuotes();
   newGame();
   document.getElementById("game").focus();
});
document.getElementById("reset").addEventListener("click", async () => {
   clearInterval(gameInterval);
   await setQuotes();

   window.gameStarted = false;
   window.gameOver = false;
   window.timer = selectedDur;
   window.timeStart = selectedDur;
   totalTyped = 0;
   correctChars = 0;

   document.getElementById("wpm").innerHTML = "";
   document.getElementById("accuracy").innerHTML = "";
   document.getElementById("timeleft").innerHTML = selectedDur;
   document.getElementById("caret").style.display = "block";
   document.getElementById("words").style.opacity = "1";
   addClass(document.getElementById("caret"), "caret-animation");
   document.getElementById("words").style.marginTop = "0px";

   document.getElementById("game").focus();
   // removeClass(document.querySelectorAll(".char"), "correct");
   // removeClass(document.querySelectorAll(".char"), "incorrect");
   // removeClass(document.querySelectorAll(".char"), "current");
   document.getElementById("caret").style.left = "0";
   document.querySelectorAll(".char").forEach((el) => {
      el.classList.remove("current", "correct", "incorrect", "underline");
   });
   addClass(document.querySelector(".char"), "current");

   newGame();
});
function randomWord() {
   const randomIndex = Math.ceil(Math.random() * wordsCount);
   return words[randomIndex - 1];
}

const showText = () => {
   return words.split(" ");
};
const newGame = () => {
   const showWords = words.split("").map((c, i) => {
      return `<span class='char'>${c}</span>`;
   });
   document.getElementById("words").innerHTML = showWords.join("");

   addClass(document.querySelector(".char"), "current");
};

document.getElementById("game").addEventListener("keydown", (e) => {
   if (window.gameOver) return;

   const currentKey = e.key;
   const currentInput = document.querySelector(".char.current");
   const expected = currentInput.innerHTML;
   const isLetterOrSpace = currentKey.length === 1 || currentKey === " ";
   const isSpace = currentKey === " ";
   const isBackspace = currentKey === "Backspace";

   removeClass(document.getElementById("caret"), "caret-animation");

   if (isLetterOrSpace) {
      if (!window.gameStarted) {
         window.gameStarted = true;
         gameInterval = setInterval(() => {
            window.timer -= 1;
            timeleft.innerHTML = window.timer;
            if (window.timer <= 0) {
               clearInterval(gameInterval);
               window.gameOver = true;
               const minutes = window.timeStart / 60;
               const wpm = Math.round(correctChars / 5 / minutes);
               const accuracy =
                  Math.round((correctChars / totalTyped) * 100) || 0;

               document.getElementById("wpm").textContent = wpm;
               document.getElementById("accuracy").textContent = `${accuracy}%`;
               document.getElementById("caret").style.display = "none";
               document.getElementById("words").style.opacity = "0.5";
               document.getElementById("result").style.display = "flex";
            }
         }, 1000);
      }
      if (currentKey === expected) {
         addClass(currentInput, "correct");
         correctChars++;
      } else {
         addClass(currentInput, "incorrect");
      }
      totalTyped++;
      // addClass(currentInput, currentKey === expected ? "correct" : "incorrect");
      if (expected === " " && currentKey !== " ") {
         addClass(currentInput, "underline");
      }
      removeClass(currentInput, "current");
      addClass(currentInput.nextSibling, "current");
      const rect = currentInput.nextSibling.getBoundingClientRect().top;
      const gameRect = document
         .getElementById("game")
         .getBoundingClientRect().top;

      const currentHeight = rect - gameRect;
      if (currentHeight > 5) {
         const words = document.getElementById("words");
         const currentMargin = parseInt(words.style.marginTop || "0px");
         words.style.marginTop = currentMargin - 38 + "px";
      }
      // document.getElementById("words").style.transform = `translateY(-${
      //    rect - gameRect
      // }px)`;
   }
   if (isBackspace) {
      if (!currentInput.previousSibling) return;
      removeClass(currentInput, "current");
      removeClass(currentInput.previousSibling, "correct");
      removeClass(currentInput.previousSibling, "incorrect");
      removeClass(currentInput.previousSibling, "underline");
      addClass(currentInput.previousSibling, "current");
   }
   //caret positioning...

   const caret = document.getElementById("caret");
   const current = document.querySelector(".char.current");

   if (current) {
      const rect = current.getBoundingClientRect();
      const gameRect = document.getElementById("game").getBoundingClientRect();

      caret.style.left = `${rect.left - gameRect.left}px`;
      caret.style.top = `${rect.top - gameRect.top + 4}px`;
   }
});

newGame();
// if (window.gameStarted) {
//    setInterval(() => {
//       window.timer -= 1;
//       timeleft.innerHTML = window.timer;
//       console.log(window.timer);
//    }, 1000);
// }
