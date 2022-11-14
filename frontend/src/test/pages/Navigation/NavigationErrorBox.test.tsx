import { fireEvent, render } from '@testing-library/react'
import '@testing-library/jest-dom'
import React from 'react'
import fetchMock from 'jest-fetch-mock'
import { NavigationErrorBox } from 'pages/Navigation/Layout/SidebarComponents/NavigationErrorBox'

window.document.getSelection = jest.fn()  // must stub this out for the Material UI TextField to work

describe('Navigation Error Box', () => {
    beforeEach(() => {
        fetchMock.resetMocks()
    })

    it('should render empty if hidden and all fields present', async () => {
        const { container, getByText, getByTestId } = render(<NavigationErrorBox
            hidden={true}
            startLocation='start'
            endLocation='end'
            navigationType='type'
        />);
        expect(container).toBeEmptyDOMElement();
    });

    it('should render empty if hidden and fields missing', async () => {
        const { container, getByText, getByTestId } = render(<NavigationErrorBox
            hidden={true}
            startLocation=''
            endLocation=''
            navigationType=''
        />);
        expect(container).toBeEmptyDOMElement();
    });

    it('should render empty if not hidden and all fields present', async () => {
        const { container, getByText, getByTestId } = render(<NavigationErrorBox
            hidden={false}
            startLocation='start'
            endLocation='end'
            navigationType='type'
        />);
        expect(container).toBeEmptyDOMElement();
    });

    it('should render error if not hidden and start location missing', async () => {
        const { container, getByText, getByTestId } = render(<NavigationErrorBox
            hidden={false}
            startLocation=''
            endLocation='end'
            navigationType='type'
        />);
        expect(getByText('- Please enter a start location.')).toBeInTheDocument();
    });

    it('should render error if not hidden and end location missing', async () => {
        const { getByText } = render(<NavigationErrorBox
            hidden={false}
            startLocation='start'
            endLocation=''
            navigationType='type'
        />);
        expect(getByText('- Please enter a destination.')).toBeInTheDocument();
    });

    it('should render error if not hidden and navigation type missing', async () => {
        const { getByText } = render(<NavigationErrorBox
            hidden={false}
            startLocation='start'
            endLocation='end'
            navigationType=''
        />);
        expect(getByText('- Please select a navigation mode.')).toBeInTheDocument();
    });

    it('should render error if not hidden and multiple fields missing', async () => {
        const { getByTestId } = render(<NavigationErrorBox
            hidden={false}
            startLocation=''
            endLocation=''
            navigationType=''
        />);
        expect(getByTestId('navigationError')).toBeInTheDocument();
    });
});
