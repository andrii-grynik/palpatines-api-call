const fs = require("fs");
const readline = require("readline");
const axios = require("axios");
require("dotenv").config();

const uniqueCitizens = new Map();
const homeworldGroups = new Map();
const API_KEY = process.env.API_KEY;
const URL = process.env.URL;

async function decryptAndProcessData() {
  const fileStream = fs.createReadStream("./super-secret-data.txt");
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    try {
      console.log("Data to API", line.trim());
      const response = await axios.post(
        URL,
        line.trim(),
        // { parameters: "none" },
        {
          headers: { "x-api-key": API_KEY, "Content-Type": "application/json" },
        }
      );
      console.log("API response:", response.data);
      const decryptedData = JSON.parse(response.data);
      if (!uniqueCitizens.has(decryptedData.name)) {
        uniqueCitizens.set(decryptedData.name, decryptedData.homeworld);
      }
    } catch (error) {
      console.error("Error in decryption:", error);
    }
    break;
  }
}

async function fetchHomeworldNames() {
  for (const [name, homeworldUrl] of uniqueCitizens) {
    try {
      const response = await axios.get(homeworldUrl.replace(".co", ".dev"));
      console.log("response.data", response);
      uniqueCitizens.set(name, response.data.name);
    } catch (error) {
      console.error("Error fetching homeworld:", error);
    }
  }
}

function groupCitizensByHomeworld() {
  console.log("uniqueCitizens", uniqueCitizens);
  uniqueCitizens.forEach((homeworld, citizen) => {
    if (!homeworldGroups.has(homeworld)) {
      homeworldGroups.set(homeworld, []);
    }
    homeworldGroups.get(homeworld).push(citizen);
  });
}

function writeOutput() {
  let output = "";
  homeworldGroups.forEach((citizens, homeworld) => {
    output += `Homeworld: ${homeworld}\nCitizens: ${citizens.join(", ")}\n\n`;
  });
  fs.writeFileSync("citizens-super-secret-info.txt", output);
}

async function main() {
  await decryptAndProcessData();
  await fetchHomeworldNames();
  groupCitizensByHomeworld();
  writeOutput();
}

main().catch(console.error);
