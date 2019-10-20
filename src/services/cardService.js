import fakeData from './fakeData';
import { getUrlParam } from '../utils/utils';

import { 
    saveStuff as saveStuffLocalStorage,
    getUserInformation as getUserInformationLocalStorage
 } from './localStorage';

 import {
     saveStuff as saveStuffServer,
     getUserInformation as getUserInformationServer
 } from './server';

 const fakeDataActive = getUrlParam('fakeData');

export async function getUserInformation() {
    if (fakeDataActive) {
        return fakeData;
    }

    const data = await getUserInformationServer();

    if (data === null) {
        return Promise.resolve(fakeData);
    }

    return Promise.resolve(data);
    // return getUserInformationLocalStorage();
}

export async function saveStuff(data) {
    if (fakeDataActive) {
        return
    }

    // return saveStuffLocalStorage(data);
    return saveStuffServer(data);
}