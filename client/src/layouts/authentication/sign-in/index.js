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



import React from 'react';

const MaintenancePage = () => {
  return (
    <div className="maintenance-container">
      <div className="maintenance-content">
        <div className="icon-container">
          <div className="tool-icon"></div>
        </div>
        <h1>Under Maintenance</h1>
        <p>We're currently performing some updates. Come back soon!</p>
        <div className="progress-bar">
          <div className="progress"></div>
        </div>
      </div>
      <style jsx>{`
        .maintenance-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background-color: #f3f4f6;
          font-family: Arial, sans-serif;
        }
        .maintenance-content {
          text-align: center;
          padding: 2rem;
          background-color: white;
          border-radius: 0.5rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          max-width: 24rem;
        }
        .icon-container {
          display: flex;
          justify-content: center;
          margin-bottom: 1.5rem;
        }
        .tool-icon {
          width: 64px;
          height: 64px;
          border: 3px solid #3b82f6;
          border-top: 3px solid transparent;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        h1 {
          font-size: 2rem;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 1rem;
        }
        p {
          font-size: 1.25rem;
          color: #4b5563;
          margin-bottom: 2rem;
        }
        .progress-bar {
          width: 100%;
          height: 0.5rem;
          background-color: #e5e7eb;
          border-radius: 9999px;
          overflow: hidden;
        }
        .progress {
          width: 60%;
          height: 100%;
          background-color: #3b82f6;
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .5; }
        }
      `}</style>
    </div>
  );
};

export default MaintenancePage;
