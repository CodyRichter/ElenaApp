import { fireEvent, render, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import React from 'react'
import Authentication from '../../../pages/Authentication/Authentication'
import fetchMock from 'jest-fetch-mock'
import { noop } from '../../../util/constants'

window.document.getSelection = jest.fn()  // must stub this out for the Material UI TextField to work

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom') as any,
    useNavigate: () => jest.fn(),
}));

describe('Authentication', () => {
    beforeEach(() => {
        fetchMock.resetMocks()
    })

    it('should render login components on load', async () => {
        const { getByText, getByTestId } = render(<Authentication setToken={noop} />);
        expect(getByText('Login')).toBeInTheDocument();
        expect(getByTestId('loginEmail')).toBeInTheDocument();
        expect(getByTestId('loginPassword')).toBeInTheDocument();
        expect(getByTestId('loginButton')).toBeInTheDocument();
    });

    it('should show error on login with no username or password', async () => {
        const { getByTestId } = render(<Authentication setToken={noop} />);

        userEvent.click(getByTestId('loginButton'))
        expect(getByTestId('loginError')).toBeInTheDocument();
    });

    it('should show error on login with no email', async () => {
        const { getByTestId } = render(<Authentication setToken={noop} />);

        const passwordField = getByTestId("loginPassword");
        await fireEvent.change(passwordField, { target: { value: 'password' } });

        await userEvent.click(getByTestId('loginButton'))
        expect(getByTestId('loginError')).toBeInTheDocument();
    });

    it('should show error on login with no password', async () => {
        const { getByTestId } = render(<Authentication setToken={noop} />);

        const emailField = getByTestId("loginEmail");
        await fireEvent.change(emailField, { target: { value: 'user@email.com' } });

        await userEvent.click(getByTestId('loginButton'))
        expect(getByTestId('loginError')).toBeInTheDocument();
    });

    it('should set token on login with valid credentials', async () => {
        fetchMock.mockResponses(JSON.stringify({ token: 'token' }));
        const setTokenMock = jest.fn();
        const { findByTestId, getByTestId } = render(<Authentication setToken={setTokenMock} />);

        const emailField = getByTestId("loginEmail");
        const passwordField = getByTestId("loginPassword");

        fireEvent.change(emailField, { target: { value: 'user@email.com' } });
        fireEvent.change(passwordField, { target: { value: 'password' } });

        userEvent.click(getByTestId('loginButton'));
        await waitFor(() => {
            expect(setTokenMock).toHaveBeenCalledWith('token');
        });

    });

    it('should show error on login with good credentials but bad server response.', async () => {
        fetchMock.mockRejectOnce(new Error('Server down...'));

        const { findByTestId, getByTestId } = render(<Authentication setToken={noop} />);

        const emailField = getByTestId("loginEmail");
        const passwordField = getByTestId("loginPassword");

        fireEvent.change(emailField, { target: { value: 'user@email.com' } });
        fireEvent.change(passwordField, { target: { value: 'password' } });

        userEvent.click(getByTestId('loginButton'));
        await findByTestId('loginError');

        expect(getByTestId('loginError')).toBeInTheDocument();
    });
});
