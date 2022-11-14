import { fireEvent, render } from '@testing-library/react'
import '@testing-library/jest-dom'
import React from 'react'
import fetchMock from 'jest-fetch-mock'
import { NavigationTypeButton } from 'pages/Navigation/Layout/SidebarComponents/NavigationTypeButton'
import { noop } from 'lodash'

window.document.getSelection = jest.fn()  // must stub this out for the Material UI TextField to work

describe('Navigation Type Button', () => {
    beforeEach(() => {
        fetchMock.resetMocks()
    })

    it('should render description and icon on load', async () => {
        const { getByText, getByTestId } = render(<NavigationTypeButton
            navigationType='testNavigationType'
            navigationDescription='testNavigationDescription'
            targetNavigationType='testTargetNavigationType'
            setNavigationType={noop}
            buttonIcon={<div>testIcon</div>}
        />);
        expect(getByText('testNavigationDescription')).toBeInTheDocument();
        expect(getByText('testIcon')).toBeInTheDocument();
    });

    it('should call update function when clicked', async () => {
        let newNavigationType = '';
        const { getByText, getByTestId } = render(<NavigationTypeButton
            navigationType='testNavigationType'
            navigationDescription='testNavigationDescription'
            targetNavigationType='testTargetNavigationType'
            setNavigationType={(navigationType: string): void => { newNavigationType = navigationType }}
            buttonIcon={<></>}
        />);
        fireEvent.click(getByText('testNavigationDescription'));
        expect(newNavigationType).toBe('testTargetNavigationType');
    });

});
