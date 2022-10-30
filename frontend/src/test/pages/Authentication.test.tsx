import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import React from 'react'
import Authentication from '../../pages/Authentication/Authentication'

test('component loads', async () => {
    let testToken: string | null = null;
    const setToken = (token: string) => {
        testToken = token;
    };
    render(<Authentication setToken={setToken} />)

    // ACT
    // await userEvent.click(screen.getByText('Load Greeting'))
    // await screen.findByRole('heading')

    // ASSERT
    expect(screen.getByRole('heading')).toHaveTextContent('Authentication')
})