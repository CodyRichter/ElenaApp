import { Button } from "@mui/material";
import { buttonPrimarySelectedColor } from "style/theme";


export function NavigationTypeButton({
    navigationType,
    navigationDescription,
    targetNavigationType,
    setNavigationType,
    buttonIcon,
    ...props
}: {
    navigationType: string,
    navigationDescription: string,
    targetNavigationType: string,
    setNavigationType: (navigationType: string) => void,
    buttonIcon: JSX.Element
}) {
    return (
        <Button
            sx={{
                display: "flex",
                flexDirection: "column",
                backgroundColor: navigationType === targetNavigationType ? buttonPrimarySelectedColor : "color.primary",
            }}
            onClick={() => setNavigationType(targetNavigationType)}
            {...props}
        >
            {buttonIcon}
            {navigationDescription}
        </Button>
    )
}