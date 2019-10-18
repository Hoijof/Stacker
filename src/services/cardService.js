import fakeData from './fakeData';
import { 
    saveStuff as saveStuffLocalStorage,
    getUserInformation as getUserInformationLocalStorage
 } from './localStorage';

export async function getUserInformation() {
    return getUserInformationLocalStorage();
}

export async function saveStuff(data) {
    debugger;
    return saveStuffLocalStorage(data);
}