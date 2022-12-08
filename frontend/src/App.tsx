import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Authentication from "./pages/Authentication/Authentication";
import Navigation from "./pages/Navigation/Navigation";
import isEmpty from "lodash/isEmpty";
// import { AccountAccessIcon } from 'shared/AccountAccessIcon';

function App() {
    const [token, setToken] = React.useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!isEmpty(token)) {
            setToken(token);
        }
    }, []);

    async function updateAndSaveToken(token: string) {
        if (isEmpty(token)) {
            setToken(null);
            localStorage.removeItem("token");
        } else {
            localStorage.setItem("token", token);
            setToken(token);
        }
    }

    return (
        <BrowserRouter>
            {isEmpty(token) ? (
                <Authentication setToken={updateAndSaveToken} />
            ) : (
                <>
                    <Routes>
                        <Route
                            path="/navigate"
                            element={<Navigation token={token as string} />}
                        />
                        <Route
                            path="/login"
                            element={
                                <Authentication setToken={updateAndSaveToken} />
                            }
                        />
                        <Route
                            path="/"
                            element={<Navigation token={token as string} />}
                        />
                    </Routes>
                    {/* <AccountAccessIcon token={token} setToken={updateAndSaveToken} /> */}
                </>
            )}
        </BrowserRouter>
    );
}

export default App;
