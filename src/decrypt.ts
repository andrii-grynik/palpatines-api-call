import axios from 'axios';

const DECRYPT_URL =
  'https://txje3ik1cb.execute-api.us-east-1.amazonaws.com/prod/decrypt';

interface Character {
  name: string;
  homeworld: string;
}

export async function decrypt(params: {
  API_KEY: string;
  data: string[];
}): Promise<Character[]> {
  const { data, API_KEY } = params;
  try {
    const response = await axios.post(DECRYPT_URL, JSON.stringify(data), {
      headers: { 'x-api-key': API_KEY, 'Content-Type': 'application/json' },
    });
    return JSON.parse(response.data) as Character[];
  } catch (error) {
    console.error('Error in decryption:', error);
    return [];
  }
}
