import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import React from 'react'
import Footer from '../../shared/Footer'

test('component loads', async () => {
    render(<Footer />)
    expect(screen.getByRole('heading')).toHaveTextContent('Footer')
})