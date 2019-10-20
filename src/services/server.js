import { SERVER_URL } from '../constants';
import { getUserToken } from '../utils/utils';

const LOCAL_STORAGE_KEY = 'stacker-reborn';
const EMPTY_DATA = {
    cards: []
};


export async function getUserInformation() {
    const response = await fetch(`${SERVER_URL}/${getUserToken()}`);
    
    return response.json();
}

export async function saveStuff(data) {
    const response = await fetch(`${SERVER_URL}/${getUserToken()}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },      
        body: JSON.stringify(data)
      });

      return await response.json(); // parses JSON response into native JavaScript objects
}