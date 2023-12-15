// import fs from 'fs';
// import readline from 'readline';
// import axios from 'axios';

import { decrypt } from './decrypt';

// const uniqueCitizens = new Map();
// const homeworldGroups = new Map();
// const API_KEY = 'Q76n6BBoa46yWuxYL7By02KcKfOQz0kd9lVflIXZ';

// async function decryptAndProcessData() {
//   const fileStream = fs.createReadStream('./super-secret-data.txt');
//   const rl = readline.createInterface({
//     input: fileStream,
//     crlfDelay: Infinity,
//   });

//   for await (const line of rl) {
//     try {
//       console.log('Data to API', line.trim());
//       const response = await axios.post(
//         'https://txje3ik1cb.execute-api.us-east-1.amazonaws.com/prod/decrypt',
//         line.trim(),
//         // { parameters: "none" },
//         {
//           headers: { 'x-api-key': API_KEY, 'Content-Type': 'application/json' },
//         }
//       );
//       console.log('API response:', response.data);
//       const decryptedData = JSON.parse(response.data);
//       if (!uniqueCitizens.has(decryptedData.name)) {
//         uniqueCitizens.set(decryptedData.name, decryptedData.homeworld);
//       }
//     } catch (error) {
//       console.error('Error in decryption:', error);
//     }
//   }
// }

// async function fetchHomeworldNames() {
//   for (const [name, homeworldUrl] of uniqueCitizens) {
//     try {
//       const response = await axios.get(homeworldUrl.replace('.co', '.dev'));
//       console.log('response.data', response);
//       uniqueCitizens.set(name, response.data.name);
//     } catch (error) {
//       console.error('Error fetching homeworld:', error);
//     }
//   }
// }

// function groupCitizensByHomeworld() {
//   console.log('uniqueCitizens', uniqueCitizens);
//   uniqueCitizens.forEach((homeworld, citizen) => {
//     if (!homeworldGroups.has(homeworld)) {
//       homeworldGroups.set(homeworld, []);
//     }
//     homeworldGroups.get(homeworld).push(citizen);
//   });
// }

// function writeOutput() {
//   let output = '';
//   homeworldGroups.forEach((citizens, homeworld) => {
//     output += `Homeworld: ${homeworld}\nCitizens: ${citizens.join(', ')}\n\n`;
//   });
//   fs.writeFileSync('citizens-super-secret-info.txt', output);
// }

async function main() {
  const env = process.env;

  const data = await fileRead();
  decrypt();
  groupCitizensByHomeworld();
  writeOutput();
}

main().catch(console.error);
