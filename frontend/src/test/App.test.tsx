import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import React from 'react'
import App from '../App'

test('component loads', async () => {
    render(<App />)
})