import './App.scss'
import AuthProvider from "react-auth-kit";
import createStore from 'react-auth-kit/createStore';
import {BrowserRouter as Router, Route , Routes } from "react-router-dom";
import MainPage from "./pages/MainPage";
import UploadVideo from "./pages/UploadVideo";
import TempTest from "./pages/TempTest";


const store = createStore({
  authName:'_auth',
  authType:'cookie',
  cookieDomain: window.location.hostname,
  cookieSecure: window.location.protocol === 'https:',
});

function App() {
    localStorage.removeItem('access_token');
    return (
      <AuthProvider store={store}>
          <Router>
              <Routes>
                  <Route path="/upload-video" element={<UploadVideo/>} />
                  <Route path="/test" element={<TempTest/>}/>
                  <Route path="/" element={<MainPage/>}/>
              </Routes>
          </Router>
      </AuthProvider>
  );
}

export default App;
