import { createReadStream } from 'fs';
import readline from 'readline';

export async function readFile(
  filename: string,
  callbackFn: (line: string) => Promise<void>
): Promise<void> {
  const fileStream = createReadStream(filename);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    try {
      await callbackFn(line);
    } catch (error) {
      console.error('Error in decryption:', error);
    }
    break;
  }
}
