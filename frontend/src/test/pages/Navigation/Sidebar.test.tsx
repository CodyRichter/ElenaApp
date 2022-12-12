import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import React, { Dispatch, SetStateAction } from 'react'
import fetchMock from 'jest-fetch-mock'
import { noop } from 'util/constants'
import Sidebar from 'pages/Navigation/Layout/Sidebar'

window.document.getSelection = jest.fn()  // must stub this out for the Material UI TextField to work


describe('Navigation Sidebar', () => {
    beforeEach(() => {
        fetchMock.resetMocks()
    })

    it('should render components on load', async () => {
        const { getByText, getByTestId } = render(<Sidebar
            startLocation={''} setStartLocation={noop}
            endLocation={''} setEndLocation={noop}
            navigationType={''} setNavigationType={noop}
            navigationErrorHidden={true} setNavigationErrorHidden={noop}
            sliderValue={''} handleSliderChange={noop} isLoaded={true}
            calculateRoute={jest.fn().mockImplementationOnce(() => Promise.resolve())} />);
        expect(getByText('Navigate')).toBeInTheDocument();
        expect(getByTestId('startLocation')).toBeInTheDocument();
        expect(getByTestId('endLocation')).toBeInTheDocument();
        expect(getByTestId('distanceSlider')).toBeInTheDocument();
        expect(getByTestId('startNavigationButton')).toBeInTheDocument();
    });

    it('should not display error on initial page load', async () => {
        const { queryByTestId } = render(<Sidebar
            startLocation={''} setStartLocation={noop}
            endLocation={''} setEndLocation={noop}
            navigationType={''} setNavigationType={noop}
            navigationErrorHidden={true} setNavigationErrorHidden={noop}
            sliderValue={''} handleSliderChange={noop} isLoaded={true}
            calculateRoute={jest.fn().mockImplementationOnce(() => Promise.resolve())} />);
        expect(queryByTestId('navigationError')).not.toBeInTheDocument();
    });

    it('should not display error if all fields are present', async () => {
        const { queryByTestId, getByTestId } = render(<Sidebar
            startLocation={''} setStartLocation={noop}
            endLocation={''} setEndLocation={noop}
            navigationType={''} setNavigationType={noop}
            navigationErrorHidden={true} setNavigationErrorHidden={noop}
            sliderValue={''} handleSliderChange={noop} isLoaded={true}
            calculateRoute={jest.fn().mockImplementationOnce(() => Promise.resolve())} />);
        userEvent.type(getByTestId('startLocation'), 'start');
        userEvent.type(getByTestId('endLocation'), 'end');
        userEvent.click(getByTestId('startNavigationButton'));
        expect(queryByTestId('navigationError')).not.toBeInTheDocument();
    });

    it('should enable distance slider metrics if mode is not mostDirect', async () => {
        const { getByTestId } = render(<Sidebar
            startLocation={''} setStartLocation={noop}
            endLocation={''} setEndLocation={noop}
            navigationType={''} setNavigationType={noop}
            navigationErrorHidden={true} setNavigationErrorHidden={noop}
            sliderValue={''} handleSliderChange={noop} isLoaded={true}
            calculateRoute={jest.fn().mockImplementationOnce(() => Promise.resolve())} />);
        userEvent.click(getByTestId('directButton'));
        userEvent.click(getByTestId('minimizeElevationButton'));
        expect(getByTestId('minDistanceThreshold')).toHaveTextContent('1x');
        expect(getByTestId('currDistanceThreshold')).not.toHaveTextContent('-');
        expect(getByTestId('maxDistanceThreshold')).toHaveTextContent('10x');
        userEvent.click(getByTestId('maximizeElevationButton'));
        expect(getByTestId('minDistanceThreshold')).toHaveTextContent('1x');
        expect(getByTestId('currDistanceThreshold')).not.toHaveTextContent('-');
        expect(getByTestId('maxDistanceThreshold')).toHaveTextContent('10x');
    });

});
