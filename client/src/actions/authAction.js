
import setAuthToken from 'utils/setAuthToken';
import jwt_decode from 'jwt-decode';
import {GET_ERRORS,SET_CURRENT_USER,USER_LOADING} from  './types';
import axios from 'axios';
 
const apiUrl = process.env.REACT_APP_API_URL || 'https://9tnby7zrib.execute-api.us-east-1.amazonaws.com/test/Emp';
export const registerUser = (userData) => dispatch =>{
    axios.post(`${apiUrl}/register`,userData)
    .then(res=> window.location = '/authentication/sign-in')
    .catch(err=>dispatch(
        {
            type: GET_ERRORS,
            payload: err.response.data
        }
    ));
};
 
// export const loginUser = (userData) => dispatch => {
//   axios
//   .post(`${apiUrl}/login`, userData)
//   .then(res => {
//       const { token }  = res.data;
//       // Log the token in the console
//       // console.log('Frontend Token:', token);
//       // Set token to localStorage
//       localStorage.setItem("jwtToken", token);
//       // Set token to Auth header
//       setAuthToken(token);
//       // Decode token to get user data
//       const decoded = jwt_decode(token);
//       // Set current user
//       dispatch(setCurrentUser(decoded));
//   })
//   .catch(err => {
//       dispatch({
//         type: GET_ERRORS,
//         payload: err.response.data
//       });
//   });
// }
export const loginUser = (userData) => (dispatch) => {
  // Set loading to true when starting the authentication request
  dispatch(setUserLoading(true));

  return axios.post(`${apiUrl}/login`, userData)
    .then((res) => {
      const { token } = res.data;
      console.log('Frontend Token:', token);
      
      localStorage.setItem("jwtToken", token);
      setAuthToken(token);

      const decoded = jwt_decode(token);
      dispatch(setCurrentUser(decoded));
      
      // Set loading to false after successful authentication
      dispatch(setUserLoading(false));
    })
    .catch((err) => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });

      // Set loading to false if there's an error during authentication
      dispatch(setUserLoading(false));

      // Return a rejected promise to allow catching errors in the component
      return Promise.reject(err);
    });
};
 
 // Set logged in user
 export const setCurrentUser = decoded => {
    return {
      type: SET_CURRENT_USER,
      payload: decoded
    };
  };
 
  // User loading
  export const setUserLoading = () => {
    return {
      type: USER_LOADING
    };
  };
 
   // Log user out
   export const logoutUser = () => dispatch => {
    // Remove token from local storage
    localStorage.removeItem("jwtToken");
    // Remove auth header for future requests
    setAuthToken(false);
    // Set current user to empty object {} which will set isAuthenticated to false
    dispatch(setCurrentUser({}));
  };