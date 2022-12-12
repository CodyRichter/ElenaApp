import { fireEvent, render } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";
import fetchMock from "jest-fetch-mock";
import Navigation from "pages/Navigation/Navigation";
import { noop } from "lodash";

window.document.getSelection = jest.fn(); // must stub this out for the Material UI TextField to work

describe("Navigation Container", () => {
    beforeEach(() => {
        fetchMock.resetMocks();
    });

    it('should render components on load', async () => {
        const { getByTestId } = render(<Navigation token={""} />);
        expect(getByTestId('sidebar')).toBeInTheDocument();
    });
});
