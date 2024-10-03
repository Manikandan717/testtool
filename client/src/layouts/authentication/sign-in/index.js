// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import Card from "@mui/material/Card";
// import MDBox from "components/MDBox";
// import MDTypography from "components/MDTypography";
// import MDInput from "components/MDInput";
// import MDButton from "components/MDButton";
// import BasicLayout from "layouts/authentication/components/BasicLayout";
// import { loginUser } from "actions/authAction";
// import { connect } from "react-redux";
// import Visibility from "@mui/icons-material/Visibility";
// import VisibilityOff from "@mui/icons-material/VisibilityOff";
// import InputAdornment from "@mui/material/InputAdornment";
// import IconButton from "@mui/material/IconButton";
// import CircularProgress from "@mui/material/CircularProgress"; 

// const Basic = function (props) {
//   const [rememberMe, setRememberMe] = useState();
//   const [err, setErr] = useState({
//     email: "",
//     password: "",
//     emailIncorrect: "",
//     passwordIncorrect: "",
//   });
//   const navigate = useNavigate();

//   const handleSignUpClick = () => {
//     navigate("/authentication/sign-up"); 
//     window.location.reload(); 
//   };
//   const initialValues = {
//     email: "",
//     password: "",
//   };
//   const [values, setValues] = useState(initialValues);
//   const handleSetRememberMe = () => setRememberMe(!rememberMe);
//   const [red, setRed] = useState(false);

//   const [showPassword, setShowPassword] = useState(false);
//   const handleClickShowPassword = () => setShowPassword(!showPassword);
//   const handleMouseDownPassword = () => setShowPassword(!showPassword);

//   const [loading, setLoading] = useState(false); 

//   useEffect(() => {

//     setErr({
//       email: "",
//       password: "",
//       emailIncorrect: "",
//       passwordIncorrect: "",
//     });
//     setRed(false);
//   }, []);

//   useEffect(() => {
//     if (props.auth.isAuthenticated) {
//       const { role } = props.auth.user;
      
//       if (role === "superadmin") {
//         navigate("/allreport");
//       } else if (role === "analyst" || role === "Team Leader") {
//         navigate("/dashboardUser");
//       } else {
//         navigate("/dashboard");
//       }
//     }
//   }, [props.auth.isAuthenticated, props.auth.user, navigate]);
  

//   useEffect(() => {
//     if (props.errors) {
//       setErr({
//         email: props.errors.email,
//         password: props.errors.password,
//         emailIncorrect: props.errors.emailNotFound,
//         passwordIncorrect: props.errors.passwordIncorrect,
//       });
//       setRed(true);
//     } else {
//       setErr({
//         email: "",
//         password: "",
//         emailIncorrect: "",
//         passwordIncorrect: "",
//       });
//       setRed(false);
//     }
//   }, [props.errors]);

//   const img = "https://source.unsplash.com/random/2560×1600/?Nature";

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;

//     if (name === "email") {
//       setErr(prevErr => ({
//         ...prevErr,
//         email: "", 
//         emailIncorrect: "", 
//       }));
//     }
//     else if (name === "password") {
//       setErr(prevErr => ({
//         ...prevErr,
//         password: "", 
//         passwordIncorrect: "", 
//       }));
//     }
//     else {
//       setErr(prevErr => ({
//         ...prevErr,
//         [name]: "", 
//       }));
//     }
//     setValues({
//       ...values,
//       [name]: value,
//       showPassword: !values.showPassword,
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     const userData = {
//       email: values.email,
//       password: values.password,
//     };

//     setLoading(true); 

//     props.loginUser(userData)
//       .then(() => {
//         setValues(initialValues);
//       })
//       .catch((err) => {
//         console.error('Login failed:', err);
//       })
//       .finally(() => {
//         setLoading(false); // Reset loading state regardless of success or failure
//       });
//   };

//   return (
//     <BasicLayout image={img}>
//       <Card>
//         <MDBox
//           variant="gradient"
//           bgColor="info"
//           borderRadius="lg"
//           coloredShadow="info"
//           mx={2}
//           mt={-3}
//           p={2}
//           mb={1}
//           textAlign="center"
//         >
//           <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
//             Sign In
//           </MDTypography>
//         </MDBox>

//         <MDBox pt={4} pb={3} px={3}>
//           <MDBox component="form" role="form" onSubmit={handleSubmit}>
//             <MDBox mb={2}>
//               <MDInput
//                 type="email"
//                 label="Email"
//                 value={values.email}
//                 onChange={handleInputChange}
//                 helperText={
//                   <span style={{ color: err.email || err.emailIncorrect ? 'red' : 'inherit' }}>
//                     {err.email || err.emailIncorrect}
//                   </span>
//                 }
//                 name="email"
//                 fullWidth
//               />
//             </MDBox>
//             <MDBox mb={2}>
//               <MDInput
//                 label="Password"
//                 variant="outlined"
//                 name="password"
//                 value={values.password}
//                 type={showPassword ? "text" : "password"}
//                 onChange={handleInputChange}
//                 helperText={
//                   <span style={{ color: red ? 'red' : 'inherit' }}>
//                     {err.password || err.passwordIncorrect}
//                   </span>
//                 }
//                 fullWidth
//                 InputProps={{
//                   endAdornment: (
//                     <InputAdornment position="end">
//                       <IconButton
//                         aria-label="toggle password visibility"
//                         onClick={handleClickShowPassword}
//                         onMouseDown={handleMouseDownPassword}
//                       >
//                         {showPassword ? <Visibility /> : <VisibilityOff />}
//                       </IconButton>
//                     </InputAdornment>
//                   ),
//                 }}
//               />
//             </MDBox>

//             <MDBox mt={2} mb={1}>
//               <MDButton
//                 variant="gradient"
//                 type="submit"
//                 color="info"
//                 fullWidth
//                 // disabled={loading} 
//                 startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null} 
//               >
//                 {loading ? 'Loading...' : 'Submit'}
//               </MDButton>
//             </MDBox>
//             <MDBox mt={1} mb={1} textAlign="center">
//               <MDTypography variant="button" color="text">
//                 Forgot your password?{" "}
//                 <MDTypography
//                   component={Link}
//                   to="/authentication/forgotpwd"
//                   variant="button"
//                   color="error"
//                   fontWeight="medium"
//                   textGradient
//                 >
//                   Get new
//                 </MDTypography>
//               </MDTypography>
//             </MDBox>
//             <MDBox mt={1} mb={1} textAlign="center">
//               <MDTypography variant="button" color="text">
//                 Don&apos;t have an account?{" "}
//                 <MDTypography
//                   component={Link}
//                   to="/authentication/sign-up"
//                   variant="button"
//                   color="info"
//                   fontWeight="medium"
//                   textGradient
//                   onClick={handleSignUpClick}
//                 >
//                   Sign up
//                 </MDTypography>
//               </MDTypography>
//             </MDBox>
//           </MDBox>
//         </MDBox>
//       </Card>
//     </BasicLayout>
//   );
// };

// const mapStateToProps = (state) => ({
//   auth: state.auth,
//   errors: state.error,
// });

// const mapDispatchToProps = (dispatch) => ({
//   loginUser: (userData) => dispatch(loginUser(userData)),
// });

// export default connect(mapStateToProps, mapDispatchToProps)(Basic);



// under maintenence code

import React, { useState, useEffect } from 'react';

const UnderMaintenance = () => {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prevRotation) => (prevRotation + 10) % 360);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <svg
        className="w-32 h-32 mb-8"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g transform={`rotate(${rotation} 50 50)`}>
          <circle cx="50" cy="50" r="45" fill="#f3f4f6" stroke="#4b5563" strokeWidth="2" />
          <rect x="35" y="35" width="30" height="30" fill="#4b5563" />
          <circle cx="50" cy="50" r="5" fill="#f3f4f6" />
        </g>
      </svg>
      <h1 className="text-4xl font-bold mb-4 text-gray-800">Under Maintenance</h1>
      <p className="text-xl text-gray-600 mb-8">
        We're currently performing some updates. Come back soon!
      </p>
      {/* <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4">
        <p className="text-yellow-700">
          Estimated downtime: 2 hours. We apologize for any inconvenience.
        </p>
      </div> */}
    </div>
  );
};

export default UnderMaintenance;
