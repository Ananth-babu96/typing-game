const fs = require("fs");

const inputFile = "5000.txt";
const outputFile = "5000.json";

const lines = fs
   .readFileSync(inputFile, "utf-8")
   .split("\n")
   .map((line) => line.trim()) // Remove extra spaces
   .filter((line) => line.length > 0); // Remove empty lines

fs.writeFileSync(outputFile, JSON.stringify(lines, null, 2), "utf-8");

console.log(`Converted ${lines.length} lines to JSON array.`);
