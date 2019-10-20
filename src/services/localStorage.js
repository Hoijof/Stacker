import { LOCAL_STORAGE_KEY } from '../constants';
const EMPTY_DATA = {
    cards: []
};

function getItem(key) {
    return JSON.parse(window.localStorage.getItem(`${LOCAL_STORAGE_KEY}-${key}`) || EMPTY_DATA);
}

function saveItem(data, key) {
    window.localStorage.setItem(`${LOCAL_STORAGE_KEY}-${key}`, JSON.stringify(data));
}

export async function getUserInformation() {
    return Promise.resolve(getItem('userInformation'));
}

export async function saveStuff(data) {
    return Promise.resolve(saveItem(data, 'userInformation'));
}