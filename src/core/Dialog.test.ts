import { describe, expect, test, vi } from 'vitest'
import * as Dialog from './Dialog.js'

describe('Dialog', () => {
  describe('popup', () => {
    test('behavior: syncRequests handles open errors gracefully', async () => {
      // Mock window.open to return null (popup blocked)
      const originalOpen = window.open
      window.open = vi.fn().mockReturnValue(null)

      const dialog = Dialog.popup()
      const instance = dialog.setup({
        host: 'https://id.porto.sh',
        internal: {
          store: {
            getState: vi.fn().mockReturnValue({ requestQueue: [] }),
            setState: vi.fn(),
          },
        },
      })

      const mockRequests = [
        {
          account: null,
          request: { id: '1', method: 'eth_requestAccounts', params: [] },
          status: 'pending' as const,
        },
      ]

      // This should not throw an unhandled error
      await expect(instance.syncRequests(mockRequests)).resolves.toBeUndefined()

      // Restore original window.open
      window.open = originalOpen
    })

    test('behavior: syncRequests works normally when popup opens successfully', async () => {
      // Mock successful popup opening
      const mockPopup = {
        close: vi.fn(),
        closed: false,
        focus: vi.fn(),
      }
      const originalOpen = window.open
      window.open = vi.fn().mockReturnValue(mockPopup)

      // Mock messenger
      const mockMessenger = {
        destroy: vi.fn(),
        on: vi.fn(),
        send: vi.fn(),
      }

      // Mock Messenger.bridge to return our mock
      const originalBridge = (await import('./Messenger.js')).bridge
      vi.doMock('./Messenger.js', () => ({
        bridge: vi.fn().mockReturnValue(mockMessenger),
        fromWindow: vi.fn(),
      }))

      const dialog = Dialog.popup()
      const instance = dialog.setup({
        host: 'https://id.porto.sh',
        internal: {
          store: {
            getState: vi.fn().mockReturnValue({ requestQueue: [] }),
            setState: vi.fn(),
          },
        },
      })

      const mockRequests = [
        {
          account: null,
          request: { id: '1', method: 'eth_requestAccounts', params: [] },
          status: 'pending' as const,
        },
      ]

      await instance.syncRequests(mockRequests)

      expect(mockMessenger.send).toHaveBeenCalledWith(
        'rpc-requests',
        mockRequests,
      )

      // Restore mocks
      window.open = originalOpen
    })
  })

  describe('requiresConfirmation', () => {
    test('behavior: returns true when no policy found', () => {
      const request = { method: 'eth_requestAccounts', params: [] }
      const result = Dialog.requiresConfirmation(request)
      expect(result).toBe(true)
    })

    test('behavior: returns false for headless policy', () => {
      const request = { method: 'eth_requestAccounts', params: [] }
      const methodPolicies = [
        { method: 'eth_requestAccounts', modes: { headless: true } },
      ]
      const result = Dialog.requiresConfirmation(request, { methodPolicies })
      expect(result).toBe(false)
    })
  })
})
