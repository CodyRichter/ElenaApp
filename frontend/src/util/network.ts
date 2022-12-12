import { baseUrl, loginRoute, navHistoryRoute, navPathRoute, signupRoute } from "./constants";
import get from 'lodash/get';
import has from 'lodash/has';


export class Network {

    public static async login(username: string, password: string): Promise<string> {

        let formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);

        return fetch(baseUrl + loginRoute, {
            method: 'POST',
            body: formData,
        }).then(response => response.json()).then(data => {
            if (has(data, 'access_token')) {
                return get(data, 'access_token');
            } else {
                throw new Error('Invalid Username or Password.');
            }
        }).catch(error => {
            throw new Error(error);
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
                throw new Error('Unable to fetch navigation history.');
            }
        }).catch(error => {
            throw new Error(error);
        });
    }

    public static async navigate(start: string, end: string, navigationType: string, maxDistance: number, token: string): Promise<any> {
        return fetch(baseUrl + navPathRoute, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            },
            body: JSON.stringify({
                origin: start,
                destination: end,
                mode: navigationType,
                max_distance: maxDistance
            }),
        }).then(response => response.json()).then(data => {
            if (has(data, 'waypoints')) {
                return data;
            } else {
                throw new Error('Unable to parse server response. Please try again later.');
            }
        }).catch(error => {
            throw new Error('Unable to connect to server. Please try again later.');
        });
    }
}