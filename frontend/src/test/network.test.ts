import '@testing-library/jest-dom'
import { Network } from '../util/network';
import fetchMock from 'jest-fetch-mock';
import { enableFetchMocks } from 'jest-fetch-mock'


describe('testing network', () => {
    beforeEach(() => {
        fetchMock.resetMocks()
    })

    it('should successfully login', async () => {
        enableFetchMocks();
        const testTokenValue = 'testTokenValue';
        fetchMock.mockResponseOnce(JSON.stringify({ token: testTokenValue }));

        const token = await Network.login('username', 'password');
        expect(token).toBe(testTokenValue);
    });

    it('should throw error on bad server response', async () => {
        enableFetchMocks();
        fetchMock.mockOnce(JSON.stringify({ 'notToken': '123' }));
        expect(Network.login('username', 'password')).rejects.toThrow();
    });

    it('should throw error when login server is down', async () => {
        enableFetchMocks();
        fetchMock.mockRejectOnce(new Error('Server down...'));
        expect(Network.login('username', 'password')).rejects.toThrow();
    });
});
