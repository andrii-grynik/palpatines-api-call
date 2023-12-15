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
  //
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let counter = 0;
  const MAX_CALLS = 200;

  for await (const line of rl) {
    try {
      //console.log("Data to API", line.trim());
      const response = await axios.post(URL, line.trim(), {
        headers: { "x-api-key": API_KEY, "Content-Type": "application/json" },
      });

      //console.log("API response:", response.data);
      const decryptedData = JSON.parse(response.data);
      if (!uniqueCitizens.has(decryptedData.name)) {
        uniqueCitizens.set(decryptedData.name, decryptedData.homeworld);
      }
    } catch (error) {
      console.error("Error in decryption:", error);
    }

    counter++;
    if (counter >= MAX_CALLS) {
      break;
    }
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
  //console.log("uniqueCitizens", uniqueCitizens);
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

////possibly for batch (Needs async and data twigs)

// async function decryptAndProcessData() {
//   const fileStream = fs.createReadStream("./super-secret-data.txt");
//   const rl = readline.createInterface({
//     input: fileStream,
//     crlfDelay: Infinity,
//   });

//   let batch = [];
//   const batchSize = 1000; // Adjust based on the API's limit

//   for await (const line of rl) {
//     batch.push(line.trim());
//     if (batch.length === batchSize) {
//       await sendBatch(batch);
//       batch = [];
//     }
//   }

//   // Send the last batch if it has any data
//   if (batch.length > 0) {
//     await sendBatch(batch);
//   }
// }

// async function sendBatch(batch) {
//   try {
//     const response = await axios.post(URL, batch, {
//       headers: { "x-api-key": API_KEY, "Content-Type": "application/json" },
//     });
//     console.log("API response:", response.data);
//     processDecryptedData(response.data);
//   } catch (error) {
//     console.error("Error in batch decryption:", error);
//   }
// }

// function processDecryptedData(decryptedBatch) {
//   decryptedBatch.forEach((decryptedData) => {
//     if (!uniqueCitizens.has(decryptedData.name)) {
//       uniqueCitizens.set(decryptedData.name, decryptedData.homeworld);
//     }
//   });
// }
