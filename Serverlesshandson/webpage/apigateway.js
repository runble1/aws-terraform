const requestGet = (artist, callback) => {
    const apigClient = apigClientFactory.newClient();

    const params = {
        artist: artist
    };
    const body = {};
    const additionalParams = {};

    apigClient.itemsGet(params, body, additionalParams)
        .then(function(result) {
            console.log("API Gateway: GET method:", result);
            callback(result);
        }).catch(function(result) {
            console.log("API Gateway: GET method:", result);
            callback(result);
        });
}

const requestPost = (artist, title, callback) => {
    const apigClient = apigClientFactory.newClient();

    const params = {};
    const body = {
        artist: artist,
        title: title
    };
    const additionalParams = {};

    apigClient.itemsPost(params, body, additionalParams)
        .then(function(result){
            console.log("API Gateway: POST method:", result);
            callback(result);
        }).catch(function(result){
            console.log("API Gateway: POST method:", result);
            callback(result);
        });
}
