import fakeData from './fakeData';
import { getUrlParam } from '../utils/utils';

import { 
    saveStuff as saveStuffLocalStorage,
    getUserInformation as getUserInformationLocalStorage
 } from './localStorage';

 const fakeDataActive = getUrlParam('fakeData');

export async function getUserInformation() {
    if (fakeDataActive) {
        return fakeData;
    }

    return getUserInformationLocalStorage();
}

export async function saveStuff(data) {
    if (fakeDataActive) {
        return
    }

    return saveStuffLocalStorage(data);
}