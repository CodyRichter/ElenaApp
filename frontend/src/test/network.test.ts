import '@testing-library/jest-dom'
import { Network } from '../util/network';
import fetchMock from 'jest-fetch-mock';
import { enableFetchMocks } from 'jest-fetch-mock'


describe('testing network', () => {
    beforeEach(() => {
        fetchMock.resetMocks()
    })

    describe('test login', () => {
        it('should successfully login', async () => {
            enableFetchMocks();
            const testTokenValue = 'testTokenValue';
            fetchMock.mockResponseOnce(JSON.stringify({ access_token: testTokenValue }));

            const token = await Network.login('username', 'password');
            expect(token).toBe(testTokenValue);
        });

        it('should throw error on login bad server response', async () => {
            enableFetchMocks();
            fetchMock.mockOnce(JSON.stringify({ 'notToken': '123' }));
            expect(Network.login('username', 'password')).rejects.toThrow();
        });

        it('should throw error when login server is down', async () => {
            enableFetchMocks();
            fetchMock.mockRejectOnce(new Error('Server down...'));
            expect(Network.login('username', 'password')).rejects.toThrow();
        });
    })

    describe('signup', () => {
        it('should successfully create a new account', async () => {
            enableFetchMocks();
            const testName = 'testStart';
            const testEmail = 'testEnd';
            const testPassword = 'testPass';
            const testResponse = {};
            fetchMock.mockResponseOnce(JSON.stringify(testResponse));
            const signupResponse = await Network.signup(testName, testEmail, testPassword);

            expect(signupResponse).toEqual('Account creation success!');
        });

        it('should throw error on navigation bad server response', async () => {
            enableFetchMocks();
            const testName = 'testStart';
            const testEmail = 'testEnd';
            const testPassword = 'testPass';
            const testResponse = {};
            fetchMock.mockResponseOnce(JSON.stringify({ 'detail': 'badResponse' }));

            expect(Network.signup(testName, testEmail, testPassword)).rejects.toThrow();
        });

        it('should throw error when server is down', async () => {
            enableFetchMocks();
            fetchMock.mockRejectOnce(new Error('Server down...'));
            expect(Network.signup('name', 'email', 'pass')).rejects.toThrow();
        });
    });

    describe('navHistory', () => {
        it('should successfully get nav history', async () => {
            enableFetchMocks();
            fetchMock.mockResponseOnce(JSON.stringify({ 'history': [] }));

            const token = await Network.navHistory('');
            expect(token).toEqual([]);
        });

        it('should throw error on history bad server response', async () => {
            enableFetchMocks();
            fetchMock.mockOnce(JSON.stringify({ 'notHistory': '123' }));
            expect(Network.navHistory('token')).rejects.toThrow();
        });

        it('should throw error when server is down', async () => {
            enableFetchMocks();
            fetchMock.mockRejectOnce(new Error('Server down...'));
            expect(Network.navHistory('token')).rejects.toThrow();
        });
    });

    describe('navigate', () => {
        it('should successfully obtain navigation data', async () => {
            enableFetchMocks();
            const testStart = 'testStart';
            const testEnd = 'testEnd';
            const testNavigationType = 'testNavigationType';
            const testToken = 'testToken';
            const testResponse = { waypoints: 'testRoute' };
            fetchMock.mockResponseOnce(JSON.stringify(testResponse));
            const token = await Network.navigate(testStart, testEnd, testNavigationType, 100, testToken);

            expect(token).toEqual(testResponse);
        });

        it('should throw error on navigation bad server response', async () => {
            enableFetchMocks();
            const testStart = 'testStart';
            const testEnd = 'testEnd';
            const testNavigationType = 'testNavigationType';
            const testToken = 'testToken';
            const testResponse = { noRoute: 'badRouteData' };
            fetchMock.mockResponseOnce(JSON.stringify(testResponse));
            expect(Network.navigate(testStart, testEnd, testNavigationType, 100, testToken)).rejects.toThrow();
        });

        it('should throw error when navigation server is down', async () => {
            enableFetchMocks();
            fetchMock.mockRejectOnce(new Error('Server down...'));
            expect(Network.navigate('start', 'end', 'type', 100, 'token')).rejects.toThrow();
        });
    });
});
