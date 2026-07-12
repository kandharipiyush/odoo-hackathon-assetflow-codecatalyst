const TOKEN_KEY = 'assetflow_token';
const USER_KEY = 'assetflow_user';

/**
 * Saves JWT token in local storage
 * @param {string} token 
 */
export const saveToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

/**
 * Retrieves JWT token from local storage
 * @returns {string|null}
 */
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Removes JWT token from local storage
 */
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

/**
 * Saves user details in local storage
 * @param {object} user 
 */
export const saveUser = (user) => {
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
};

/**
 * Retrieves user details from local storage
 * @returns {object|null}
 */
export const getUser = () => {
  const user = localStorage.getItem(USER_KEY);
  try {
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error parsing user from localStorage:', error);
    return null;
  }
};

/**
 * Removes user details from local storage
 */
export const removeUser = () => {
  localStorage.removeItem(USER_KEY);
};

/**
 * Clears all authentication-related keys from local storage
 */
export const clearStorage = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};
