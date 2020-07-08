const fetchAPI = (method, url, payload = null, customHeaders = {}) => {
    let options = {};

    options['method'] = method;
    if (payload) {
        options['body'] = JSON.stringify(payload);
    }
    options['headers'] = {
        'Content-Type': 'application/json',
        ...customHeaders
    };
    return fetch(url, {...options}).then((res) => res.json());
};

const getRequest = (url, customHeaders) => {
    return fetchAPI('GET', url, null, customHeaders);
};

const postRequest = (url, payload, customHeaders) => {
    return fetchAPI('POST', url, payload, customHeaders);
};

const putRequest = (url, payload, customHeaders) => {
    return fetchAPI('PUT', url, payload, customHeaders);
};

const deleteRequest = (url, customHeaders) => {
    return fetchAPI('DELETE', url, null, customHeaders);
};

export default {
    get: getRequest,
    post: postRequest,
    put: putRequest,
    delete: deleteRequest
};
