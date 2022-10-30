import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import React from 'react'
import Header from '../../shared/Header'

test('component loads', async () => {
    render(<Header />)
    expect(screen.getByRole('heading')).toHaveTextContent('Header')
})