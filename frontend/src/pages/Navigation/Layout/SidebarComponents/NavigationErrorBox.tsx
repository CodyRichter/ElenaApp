import { Alert } from "@mui/material";
import { isEmpty } from "lodash";


export function NavigationErrorBox({ hidden, startLocation, endLocation, navigationType, ...props }: { hidden: boolean, startLocation: string, endLocation: string, navigationType: string }) {

    function getErrorMessages() {
        let errors = [];
        if (isEmpty(startLocation)) {
            errors.push('- Please enter a start location.');
        }
        if (isEmpty(endLocation)) {
            errors.push('- Please enter a destination.');
        }
        if (isEmpty(navigationType)) {
            errors.push('- Please select a navigation mode.');
        }
        return errors;
    }

    return (
        !hidden && (isEmpty(startLocation) || isEmpty(endLocation) || isEmpty(navigationType)) ? (
            <Alert severity="error" className='mt-4' data-testid="navigationError" {...props}>
                {getErrorMessages().map((error, index) => (
                    <div key={error + index}>{error}</div>
                ))}
            </Alert>
        ) : null
    );
}