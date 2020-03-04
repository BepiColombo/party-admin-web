const TOKEN_KEY = "TOKEN";

export const setItem = (key, data) => {
  localStorage.setItem(key, data);
};

export const getItem = key => {
  return localStorage.getItem(key);
};

export const removeItem = key => {
  localStorage.removeItem(key);
};

export const setToken = token => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};
