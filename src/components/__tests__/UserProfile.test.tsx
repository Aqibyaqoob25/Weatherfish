import React from 'react'
import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import UserProfile from '../UserProfile'

// Mock services
vi.mock('../../services/auth', () => ({
  getCurrentUser: vi.fn(async () => ({ id: 1, username: 'alice', email: 'alice@example.com', hobbies: ['gardening'] })),
  updateCurrentUser: vi.fn(async (d) => ({ id: 1, username: d.username || 'alice', email: d.email || 'alice@example.com', hobbies: d.hobbies || ['gardening'] })),
  logout: vi.fn(async () => {}),
  deleteCurrentUser: vi.fn(async () => ({})),
}))

describe('UserProfile', () => {
  it('renders user info', async () => {
    render(<UserProfile />)
    await waitFor(() => expect(screen.getByText('alice')).toBeInTheDocument())
    expect(screen.getByText('alice@example.com')).toBeInTheDocument()
    expect(screen.getByText(/Hobbies/)).toBeInTheDocument()
  })

  it('calls deleteCurrentUser and logout when delete is confirmed', async () => {
    const { deleteCurrentUser, logout } = await import('../../services/auth') as any
    render(<UserProfile />)
    await waitFor(() => expect(screen.getByText('alice')).toBeInTheDocument())

    // mock confirmation
    vi.spyOn(window, 'confirm').mockImplementation(() => true)

    const user = userEvent.setup()
    const deleteBtn = screen.getByText('Delete account')
    await user.click(deleteBtn)

    await waitFor(() => expect(deleteCurrentUser).toHaveBeenCalled())
    expect(logout).toHaveBeenCalled()

    // restore confirm
    ;(window.confirm as any).mockRestore()
  })
})
