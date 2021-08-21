export function postRequest(data, url){
    var host = 'http://192.168.1.8:8080'
    var request = new Request(`${host}${url}`, {
        method: 'POST',
        headers: new Headers({ 'Content-Type' : 'application/json', 'Accept': 'application/json' }),
        body: JSON.stringify(data)
    });
    return request;
}