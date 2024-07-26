/* eslint-disable no-undef */
import { useState, useEffect } from "react";
// react-router components
import { useLocation, Link } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";
import Dialog from "@mui/material/Dialog";
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from "@mui/material/TextField";
import Button from '@material-ui/core/Button';
import axios from "axios";
// @material-ui core components
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import {  Select, MenuItem,Input, Chip } from '@mui/material';
import Menu from "@mui/material/Menu";
// import Grid from "@mui/material/Grid";
import DialogContent from "@mui/material/DialogContent";
import Icon from "@mui/material/Icon";
import { Badge, Popover, List, ListItem, ListItemText, Snackbar } from '@mui/material';
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
// import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import Attendance from "layouts/Attendance";
import MDAvatar from "components/MDAvatar";
// Material Dashboard 2 React example components
import NotificationsIcon from '@mui/icons-material/Notifications';
import Breadcrumbs from "examples/Breadcrumbs";
import NotificationItem from "examples/Items/NotificationItem";
import fav1 from "assets/images/fav-1.png";
// Custom styles for DashboardNavbar
import {
  navbar,
  navbarContainer,
  navbarRow,
  navbarIconButton,
  // navbarMobileMenu,
} from "examples/Navbars/DashboardNavbar/styles";

// Material Dashboard 2 React context
import {
  useMaterialUIController,
  setTransparentNavbar,
  // setMiniSidenav,
  // setOpenConfigurator,
} from "context";
import MDButton from "components/MDButton";

// Redux functions
import { logoutUser } from "actions/authAction";
import { connect, useSelector } from "react-redux";

function DashboardNavbar(props) {
  const apiUrl = 'https://9tnby7zrib.execute-api.us-east-1.amazonaws.com/test/Emp';
  const { absolute, light, isMini, notificationCount, setNotificationCount } = props;
  const teamLeadName = useSelector((state) => state.auth.user.name);
  const [report, setReport] = useState([]);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [navbarType, setNavbarType] = useState();
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    allReport();
  }, []);
  
  const allReport = () => {
    setLoading(true);
    const teamLead = teamLeadName.trim();
    axios.get(`${apiUrl}/analyst/byManagerTask/${teamLead}`)
      .then((res) => {
        setReport(res.data);
        // Calculate notification count
        const pendingReports = res.data.filter(item => item.approvalStatus === 'pending');
        setNotificationCount(pendingReports.length);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  };


  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };


  
  const params = { row: { _id: 'task_id', approvalStatus: 'pending' } };
  const [controller, dispatch] = useMaterialUIController();
  // eslint-disable-next-line no-unused-vars
  const { miniSidenav, transparentNavbar, fixedNavbar, darkMode } = controller;
  const [openMenu, setOpenMenu] = useState(false);
  const route = useLocation().pathname.split("/").slice(1);
  const mail = useSelector((state) => state.auth.user.email);
  const name = useSelector((state)=>state.auth.user.name);
  const img = "https://ui-avatars.com/api/?name="+name+'&background=random';
  useEffect(() => {
    // Setting the navbar type
    if (fixedNavbar) {
      setNavbarType("sticky");
    } else {
      setNavbarType("static");
    }

    // A function that sets the transparent state of the navbar.
    function handleTransparentNavbar() {
      setTransparentNavbar(dispatch, (fixedNavbar && window.scrollY === 0) || !fixedNavbar);
    }

    /** 
     The event listener that's calling the handleTransparentNavbar function when 
     scrolling the window.
    */
    window.addEventListener("scroll", handleTransparentNavbar);

    // Call the handleTransparentNavbar function to set the state with the initial value.
    handleTransparentNavbar();

    // Remove event listener on cleanup
    return () => window.removeEventListener("scroll", handleTransparentNavbar);
  }, [dispatch, fixedNavbar]);

  // const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);
  // const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);
  const handleOpenMenu = (event) => setOpenMenu(event.currentTarget);
  const handleCloseMenu = () => setOpenMenu(false);

  // logout Function
  const onOut = (e) => {
    e.preventDefault();
    props.logoutUser();
  };

  // Render the notifications menu
  const renderMenu = () => (
    <Menu
      anchorEl={openMenu}
      anchorReference={null}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      open={Boolean(openMenu)}
      onClose={handleCloseMenu}
      sx={{ mt: 2 }}
    >
      <NotificationItem icon={<Icon>email</Icon>} title={mail} />
      <NotificationItem icon={<Icon>logout</Icon>} title="Logout" onClick={onOut}/>
      {/* <NotificationItem icon={<Icon>shopping_cart</Icon>} title="Payment successfully completed" /> */}
    </Menu>
  );

  // Styles for the navbar icons
  // eslint-disable-next-line no-unused-vars
  const iconsStyle = ({ palette: { dark, white, text }, functions: { rgba } }) => ({
    color: () => {
      let colorValue = light || darkMode ? white.main : dark.main;

      if (transparentNavbar && !light) {
        colorValue = darkMode ? rgba(text.main, 0.6) : text.main;
      }

      return colorValue;
    },
  });

  return (
    <AppBar
      position={absolute ? "absolute" : navbarType}
      color="inherit"
      sx={(theme) => navbar(theme, { transparentNavbar, absolute, light, darkMode })}
    >
      <Toolbar sx={(theme) => navbarContainer(theme)}>
        <MDBox color="inherit" mb={{ xs: 1, md: 0 }} sx={(theme) => navbarRow(theme, { isMini })}>
          <Breadcrumbs icon="home" title={route[route.length - 1]} route={route} light={light} />
        </MDBox>
        {isMini ? null : (
          <MDBox sx={(theme) => navbarRow(theme, { isMini })}>
            {/* <MDBox pr={1}>
              <MDInput label="Search here" />
            </MDBox> */}
            <MDBox color={light ? "white" : "inherit"}>
                      {/* Notification icon with badge */}
                      <Link to="/manager-report">
      <IconButton aria-label="notifications" style={{ marginRight: '10px' }} onClick={handleClick}>
        <Badge badgeContent={notificationCount} color="primary" >
          <NotificationsIcon />
        </Badge>
      </IconButton>
    </Link>
      {/* Popover to display pending report names */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          style: {
            backgroundColor: 'white',
            maxHeight: '60vh', // Set maximum height for the popover
            overflowY: 'auto', // Enable vertical scrollbar if needed
          },
        }}
      >
        {/* {report.filter(item => item.approvalStatus === 'pending').map((pendingReport) => (
          <Typography key={pendingReport.id} style={{ fontSize: '16px' }}>{pendingReport.name}</Typography>
        ))} */}
      </Popover>
            {/* Snackbar for notifications */}
            <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        action={
          <IconButton size="small" aria-label="close" color="inherit" onClick={handleSnackbarClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
              {/* <Link to="/authentication/sign-in/basic">
                <IconButton sx={navbarIconButton} size="small" disableRipple>
                  <Icon sx={iconsStyle}>account_circle</Icon>
                </IconButton>
              </Link>
              <IconButton
                size="small"
                disableRipple
                color="inherit"
                sx={navbarMobileMenu}
                onClick={handleMiniSidenav}
              >
                <Icon sx={iconsStyle} fontSize="medium">
                  {miniSidenav ? "menu_open" : "menu"}
                </Icon>
              </IconButton>
              <IconButton
                size="small"
                disableRipple
                color="inherit"
                sx={navbarIconButton}
                onClick={handleConfiguratorOpen}
              >
                <Icon sx={iconsStyle}>settings</Icon>
              </IconButton> */}
             {name} <IconButton
                size="small"
                disableRipple
                color="inherit"
                sx={navbarIconButton}
                aria-controls="notification-menu"
                aria-haspopup="true"
                variant="contained"
                onClick={handleOpenMenu}
              >
                
                <MDAvatar src={img} alt="Thankyou" size="md" />
                {/* <Icon sx={iconsStyle}>account_circle</Icon> */}
              </IconButton>
              {renderMenu()}
            </MDBox>
          </MDBox>
        )}
      </Toolbar>
      
 
    </AppBar>
  );
}

DashboardNavbar.propTypes = {
  absolute: PropTypes.bool,
  light: PropTypes.bool,
  isMini: PropTypes.bool,
  notificationCount: PropTypes.number.isRequired,
  setNotificationCount: PropTypes.func.isRequired,
};

DashboardNavbar.defaultProps = {
  absolute: false,
  light: false,
  isMini: false,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logoutUser })(DashboardNavbar);
