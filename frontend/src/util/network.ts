import { baseUrl, loginRoute } from "./constants";
import get from 'lodash/get';
import has from 'lodash/has';


export class Network {

    public static async login(username: string, password: string): Promise<string> {

        return fetch(baseUrl + loginRoute, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password,
            }),
        }).then(response => response.json()).then(data => {
            if (has(data, 'token')) {
                return get(data, 'token');
            } else {
                throw new Error('Unexpected response from server. Please try again later.');
            }
        }).catch(error => {
            throw new Error('Unable to connect to server. Please try again later.');
        });
    }
}