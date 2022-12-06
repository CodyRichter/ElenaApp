import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Authentication from "./pages/Authentication/Authentication";
import Navigation from "./pages/Navigation/Navigation";
import isEmpty from "lodash/isEmpty";

function App() {

    const [token, setToken] = React.useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!isEmpty(token)) {
          setToken(token);
        }
      }, []);

  async function updateAndSaveToken(token: string) {
    localStorage.setItem("token", token);
    setToken(token);
  }

  return (
    <BrowserRouter>
      {isEmpty(token) ? (
        <Authentication setToken={updateAndSaveToken} />
      ) : (
        <Routes>
          <Route path="/navigate" element={<Navigation />} />
          <Route
            path="/login"
            element={<Authentication setToken={updateAndSaveToken} />}
          />
          <Route path="/" element={<Navigation />} />
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default App;
