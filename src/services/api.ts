//Uso do axios no Next.js :)
import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://localhost:3333/'
})