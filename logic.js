const words =
   "On a quiet island, a dragon slept beneath a volcano, its shadow stretching across the forest. A gentle breeze carried the scent of orange blossoms past a broken window in an old tower. Nearby, a knight with a rusty sword studied a map by the light of a lantern, searching for a hidden valley filled with crystals and honey. He wore a jacket patched with zippers, and carried a magnet, a quill, and a tiny mirror in his backpack. As he passed a fallen tree, he saw a glowing xylophone resting near a puzzle made of stone. Somewhere in the distance, a rocket launched into the universe, lighting up the night sky. A giraffe from a nearby zoo had escaped and now wandered through the jungle, nibbling on a lemon. Above, a cloud shaped like a balloon floated silently, while a whisper echoed from the tunnel beneath the mountain, calling him toward his next adventure.";

const wordsTo = words.split("").map((c, i) => {
   return `<span class='char'>${c}</span>`;
});

const addClass = 

const newGame = () => {
   document.getElementById("words").innerHTML = wordsTo.join("");
   document.querySelector(".char").

};

newGame();
