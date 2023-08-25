import axios from 'axios';

const API_KEY = 'AIzaSyBOtDAO_44YzHR6Y0rYLSoDZKUjMmAmV0c';

export async function authenticate(mode, email, password){
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:${mode}?key=${API_KEY}` //we are using `` as template literal
  const response = await axios.post(
    url, 
    {
      email: email,
      password: password,
      returnSecureToken: true
    } 
  );

  const token = response.data.idToken;
  return token;
}

export function createUser(email, password) {
  return authenticate('signUp', email, password);
}

export  function login(email, password){
  return authenticate('signInWithPassword', email, password);
}

