import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import CoverLayout from "layouts/authentication/components/CoverLayout";
import MDButton from "components/MDButton";
import axios from "axios";
import FormHelperText from "@mui/material/FormHelperText";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { registerUser } from "actions/authAction";
import CircularProgress from "@mui/material/CircularProgress";

function Cover(props) {
  const initialValues = {
    name: "",
    empId: "",
    role: "",
    email: "",
    password: "",
    cpassword: "",
  };

  const [values, setValues] = useState(initialValues);
  const [err, setErr] = useState({
    name: "",
    role: "",
    empId: "",
    email: "",
    password: "",
    password2: "",
    emailAlready: "",
    emailNotFound: "",
  });

  const navigate = useNavigate();

  const handleSignInClick = () => {
    navigate("/authentication/sign-in"); 
    window.location.reload(); 
  };
  
  const [red, setRed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const img = "https://images.unsplash.com/photo-1471734134930-fdd4b1af533e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1749&q=80";
  const [loading, setLoading] = useState(false);
  const apiUrl = 'https://9tnby7zrib.execute-api.us-east-1.amazonaws.com/test/Emp';
  const fetchEmployeeDetails = async (empId) => {
    try {
      if (empId.trim() !== "") {
        const response = await axios.get(`${apiUrl}/getEmployeeDetails/${empId}`);
        const employeeDetails = response.data;
        setValues((prevValues) => ({
          ...prevValues,
          name: employeeDetails.emp_name,
          email: employeeDetails.email_id,
        }));
        setErr((prevErr) => ({
          ...prevErr,
          emailNotFound: "",
        }));
      }
    } catch (error) {
      console.error("Error fetching employee details:", error);
      setValues((prevValues) => ({
        ...prevValues,
        name: "",
        email: "",
      }));
      setErr((prevErr) => ({
        ...prevErr,
        emailNotFound: "Employee not found in the database",
      }));
    }
  };
  useEffect(() => {
    fetchEmployeeDetails(values.empId);
  }, [values.empId]); // Trigger the effect whenever empId changes

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
    
    // Clear the error message for the changed input field
    setErr({
      ...err,
      [name]: "",
    });
  };

  useEffect(() => {
    if (props.errors) {
      setErr({
        name: props.errors.name,
        empId: props.errors.empId,
        email: props.errors.email,
        password: props.errors.password,
        password2: props.errors.password2,
        emailAlready: props.errors.emailAlready,
        emailNotFound: props.errors.emailNotFound,
      });
    }
    if (
      err.email &&
      err.password &&
      err.name &&
      err.empId &&
      err.password2 &&
      err.emailNotFound &&
      err.emailAlready !== ""
    ) {
      setRed(true);
    }
  }, [props.errors]);

  useEffect(() => {
    return () => {
      setErr({
        name: "",
        empId: "",
        email: "",
        password: "",
        password2: "",
        emailAlready: "",
        emailNotFound: "",
      });
    };
  }, []);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const userData = {
      name: values.name,
      empId: values.empId,
      role: "defaultRole",
      email: values.email,
      password: values.password,
      password2: values.cpassword,
    };
    try {
      await props.registerUser(userData);
      setLoading(false);
    } catch (error) {
      console.error("Registration failed:", error);
      setLoading(false);
    }
  };

  return (
    <>
      <CoverLayout image={img}>
        <Card>
          <MDBox
            variant="gradient"
            bgColor="info"
            borderRadius="lg"
            coloredShadow="success"
            mx={2}
            mt={-3}
            p={3}
            mb={1}
            textAlign="center"
          >
            <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
              Sign up
            </MDTypography>
            <MDTypography display="block" variant="button" color="white" my={1}>
              Enter your details to register
            </MDTypography>
          </MDBox>
          <MDBox pt={4} pb={3} px={3}>
            <MDBox
              component="form"
              role="form"
              onSubmit={handleSubmit}
              noValidate
            >
              <MDBox mb={2}>
                <MDInput
                  type="text"
                  value={values.empId}
                  onChange={handleInputChange}
                  helperText={
                    <span style={{ color: err.empId ? "red" : "inherit" }}>
                      {err.empId}
                    </span>
                  }
                  name="empId"
                  label="Employee Number"
                  onBlur={() => fetchEmployeeDetails(values.empId)}
                  fullWidth
                />
                {err.emailNotFound && (
                  <FormHelperText style={{ color: "red" }}>
                    {err.emailNotFound}
                  </FormHelperText>
                )}
              </MDBox>
              <MDBox mb={2}>
                <MDInput
                  label="Full Name"
                  value={values.name}
                  onChange={handleInputChange}
                  helperText={
                    <span style={{ color: err.name ? "red" : "inherit" }}>
                      {err.name}
                    </span>
                  }
                  name="name"
                  fullWidth
                  disabled
                />
              </MDBox>
              <MDBox mb={2}>
                <MDInput
                  type="email"
                  value={values.email}
                  onChange={handleInputChange}
                  name="email"
                  helperText={
                    <span style={{ color: err.email ? "red" : "inherit" }}>
                      {err.email || err.emailAlready}
                    </span>
                  }
                  label="Email"
                  fullWidth
                  disabled
                />
              </MDBox>
              <MDBox mb={2}>
                <MDInput
                  label="Create New Password"
                  variant="outlined"
                  name="password"
                  value={values.password}
                  type={showPassword ? "text" : "password"}
                  onChange={handleInputChange}
                  error={red}
                  helperText={
                    <span style={{ color: err.password ? "red" : "inherit" }}>
                      {err.password}
                    </span>
                  }
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </MDBox>
              <MDBox mb={2}>
                <MDInput
                  label="Confirm Password"
                  variant="outlined"
                  name="cpassword"
                  value={values.cpassword}
                  type={showPassword ? "text" : "password"}
                  onChange={handleInputChange}
                  error={red}
                  helperText={
                    <span style={{ color: err.password2 ? "red" : "inherit" }}>
                      {err.password2}
                    </span>
                  }
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </MDBox>
              <MDBox mt={4} mb={1}>
                <MDButton
                  variant="gradient"
                  type="submit"
                  color="info"
                  fullWidth
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null} 
                >
                  {loading ? "Loading..." : "Sign Up"}
                </MDButton>
              </MDBox>
              <MDBox mt={3} mb={1} textAlign="center">
                <MDTypography variant="button" color="text">
                  Already have an account?{" "}
                  <MDTypography
                    component={Link}
                    to="/authentication/sign-in"
                    variant="button"
                    color="info"
                    fontWeight="medium"
                    textGradient
                    onClick={handleSignInClick}
                  >
                    Sign In
                  </MDTypography>
                </MDTypography>
              </MDBox>
            </MDBox>
          </MDBox>
        </Card>
      </CoverLayout>
    </>
  );
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.error,
});

export default connect(mapStateToProps, { registerUser })(Cover);
