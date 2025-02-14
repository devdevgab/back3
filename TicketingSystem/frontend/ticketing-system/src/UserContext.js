import React, { createContext, useState, useContext } from 'react';

// Create the context
const UserContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {
  const [userFirstName, setUserFirstName] = useState('');
  const [userDepartment, setDepartment] = useState('');

  return (
    <UserContext.Provider value={{ userFirstName, setUserFirstName, userDepartment, setDepartment }}>
      {children}
    </UserContext.Provider>
  );
};

// Create a custom hook to use the context
export const useUser = () => useContext(UserContext);
