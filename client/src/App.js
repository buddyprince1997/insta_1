import React, { useEffect, createContext, useReducer, useContext } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import NavBar from './components/Navbar';
import './App.css';
import Home from './components/screens/Home';
import Signin from './components/screens/SignIn';
import Profile from './components/screens/Profile';
import Signup from './components/screens/Signup';
import CreatePost from './components/screens/CreatePost';
import { reducer, initialState } from './reducers/userReducer';
import UserProfile from './components/screens/UserProfile';
import SubscribedUserPosts from './components/screens/SubscribesUserPosts'; // Ensure this component exists
import Reset from './components/screens/Reset';
import NewPassword from './components/screens/Newpassword';

export const UserContext = createContext();

const Routing = () => {
  const { dispatch } = useContext(UserContext); // Removed 'state' since it's not used
  const navigate = useNavigate();
  const location = useLocation();

  const navigateToSignIn = () => {
    if (!location.pathname.startsWith('/reset')) {
      navigate('/signin');
    }
  };

  useEffect(() => {
    const userString = localStorage.getItem("user");

    if (userString) {
      try {
        const user = JSON.parse(userString);
        if (user) {
          dispatch({ type: "USER", payload: user });
        } else {
          throw new Error("Parsed user is null");
        }
      } catch (error) {
        //console.error('Error parsing JSON:', error);
        navigateToSignIn();
      }
    } else {
      navigateToSignIn();
    }
  },[]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/create" element={<CreatePost />} />
      <Route path="/profile/:userid" element={<UserProfile />} />
      <Route path="/myfollowingpost" element={<SubscribedUserPosts />} /> {/* Ensure this file exists */}
      <Route path="/reset" element={<Reset />} />
      <Route path="/reset/:token" element={<NewPassword />} />
    </Routes>
  );
};

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <NavBar />
        <Routing />
      </BrowserRouter>
    </UserContext.Provider>
  );
};

export default App;
