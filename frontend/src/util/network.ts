import { baseUrl, loginRoute, navHistoryRoute, signupRoute } from "./constants";
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

    public static async signup(full_name: string, email: string, password: string): Promise<string> {
        return fetch(baseUrl + signupRoute, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                full_name: full_name,
                email: email,
                password: password,
            }),
        }).then(response => response.json()).then(data => {
            if (has(data, 'detail')) {
                throw new Error(get(data, 'detail'));
            }
            return 'Account creation success!';
        }).catch(error => {
            throw new Error(error);
        });
    }

    public static async navHistory(token: string): Promise<any[]> {
        return fetch(baseUrl + navHistoryRoute, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            },
        }).then(response => response.json()).then(data => {
            if (has(data, 'history')) {
                return get(data, 'history');
            } else {
                throw new Error('Unexpected response from server. Please try again later.');
            }
        }).catch(error => {
            throw new Error('Unable to connect to server. Please try again later.');
        });
    }

    public static async navigate(start: string, end: string, navigationType: string, token: string): Promise<string> {
        return fetch(baseUrl + loginRoute, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            },
            body: JSON.stringify({
                startLocation: start,
                endLocation: end,
                navigationType: navigationType,
            }),
        }).then(response => response.json()).then(data => {
            if (has(data, 'route')) {
                return data;
            } else {
                throw new Error('Unable to parse server response. Please try again later.');
            }
        }).catch(error => {
            throw new Error('Unable to connect to server. Please try again later.');
        });
    }
}