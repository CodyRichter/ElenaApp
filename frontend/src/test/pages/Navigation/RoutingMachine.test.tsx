import '@testing-library/jest-dom'
import fetchMock from 'jest-fetch-mock'

window.document.getSelection = jest.fn()  // must stub this out for the Material UI TextField to work


describe('Navigation Routing Machine', () => {
    beforeEach(() => {
        fetchMock.resetMocks()
    })

    it('placeholder', async () => {

    });

});
