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