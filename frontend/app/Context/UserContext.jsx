// context/UserContext.js
'use client';
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [users,setUsers]=useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('https://insta-clone-e6rm.onrender.com/instaposts');
        setPosts(response.data.posts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, [posts]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://insta-clone-e6rm.onrender.com/allusers');
        setUsers(response.data.users);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchUsers();
  }, [users]);

  return (
    <UserContext.Provider value={{ posts,users }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
