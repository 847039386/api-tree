import axios from 'axios';

var http = axios.create({
    baseURL: 'http://localhost:3000',
    // timeout: 3000,
    // headers: {'X-Custom-Header': 'foobar'}
});

export default http;


