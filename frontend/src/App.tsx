import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Authentication from './pages/Authentication/Authentication';
import Navigation from './pages/Navigation/Navigation';
import isEmpty from 'lodash/isEmpty';

function App() {

  const [token, setToken] = React.useState<string | null>(null);

  return (
    <BrowserRouter>
      {isEmpty(token) ? (
        <Authentication setToken={setToken} />
      )
        : (
          <Routes>
            <Route path="/navigate" element={<Navigation />} />
            <Route path="/login" element={<Authentication setToken={setToken} />} />
          </Routes>
        )}
    </BrowserRouter>
  );
}

export default App;
