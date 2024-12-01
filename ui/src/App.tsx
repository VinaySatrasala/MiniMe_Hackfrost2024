import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './Pages/HomePage';
import Navbar from './Components/NavBar';
import SignupPage from './Pages/Singup';
import SignInPage from './Pages/Signin';
import MainContentPage from './Pages/Generate';
import CredentialPage from './Pages/Credentials';

function App() {
  return (
    <Router>
      {/* Navbar appears on all pages */}
      <Navbar />
      {/* Define your routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Add more routes as needed */}
        <Route path='/signup' element={<SignupPage/>}/>
        <Route path='/signin' element={<SignInPage/>}/>
        <Route path='/generate' element={<MainContentPage/>}/>
        <Route path='/credentials' element={<CredentialPage/>}/>
      </Routes>
    </Router>
  );
}

export default App;
