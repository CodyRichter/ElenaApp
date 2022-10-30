import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import React from 'react'
import Navigation from '../../pages/Navigation/Navigation'

test('component loads', async () => {
  render(<Navigation />)

  // ACT
  // await userEvent.click(screen.getByText('Load Greeting'))
  // await screen.findByRole('heading')

  // ASSERT
  expect(screen.getByRole('heading')).toHaveTextContent('Navigation')
  // expect(screen.getByRole('button')).toBeDisabled()
})