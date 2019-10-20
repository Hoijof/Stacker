import { LOCAL_STORAGE_KEY } from '../constants';
import md5 from 'md5';

export function getUrlParam(urlParam) {
    const urlParams = window.location.search.replace('?', '').split('&');
    let result = null;

    urlParams.find((param) => {
        const pair = param.split('=');

        if (pair[0] === urlParam) {
            result = pair[1];
        }

        return true
    });

    return result;
}

export function getUserToken() {
    const userTokenId = `${LOCAL_STORAGE_KEY}-user-token`;
    let userToken = window.localStorage.getItem(userTokenId);

    if (userToken === null) {
        userToken = md5(prompt("Please enter your unique identifier", "username:password"));
        window.localStorage.setItem(userTokenId, userToken);
    }

    return userToken;
}