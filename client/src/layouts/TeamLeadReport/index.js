import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DeleteIcon from '@mui/icons-material/Delete'; // Assuming you're using Material-UI
// import Footer from "examples/Footer";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import Dialog from "@mui/material/Dialog";
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import VisibilityIcon from "@mui/icons-material/Visibility";
import { ToastContainer, toast } from "react-toastify";
import MDInput from "components/MDInput";
import IconButton from "@mui/material/IconButton";
import * as React from "react";
import CloseIcon from "@mui/icons-material/Close";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Attendance from "layouts/Attendance"
import { useSelector } from "react-redux";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import NotificationsIcon from '@mui/icons-material/Notifications';
// import IconButton from "@material-ui/core/IconButton";
// import FormControl from "@mui/material/FormControl";
// import Select from "@mui/material/Select";
import { Select, MenuItem, Input, Chip } from '@mui/material';
import { useState, useEffect, useMemo } from "react";
import { Badge, Popover, List, ListItem, ListItemText, Snackbar } from '@mui/material';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import Button from '@material-ui/core/Button';
import "react-datepicker/dist/react-datepicker.css";
import MuiAlert from '@material-ui/lab/Alert';
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import axios from "axios";
import { CSVLink } from "react-csv";
import moment from "moment";
// import Drawer from "@mui/material/Drawer";
import FilterListIcon from "@material-ui/icons/FilterList";
// import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
// import Dialog from "@mui/material/Dialog";
// import CloseIcon from "@mui/icons-material/Close";
// import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
// import DialogActions from "@mui/material/DialogActions";
import Popper from "@mui/material/Popper";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Paper from "@mui/material/Paper";
import CircularProgress from '@mui/material/CircularProgress';
import { v4 as uuidv4 } from 'uuid';
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

function AdminReport() {


  const apiUrl = 'https://9tnby7zrib.execute-api.us-east-1.amazonaws.com/test/Emp';

  const initialValues = {
    startDate: "",
    endDate: "",
    team: "",
  };
  const [values, setValues] = useState(initialValues);
  const [name, setName] = useState([]);
  const [empName, setEmpName] = useState(null);
  const [teamList, setTeamList] = useState(null);
  const [report, setReport] = useState([]);
  const [selectedUserData, setSelectedUserData] = useState(null);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [rejectionReasons, setRejectionReasons] = useState([]);
  const [projectNames, setProjectNames] = useState([]);
  const [projectName, setProjectName] = useState(null);
  const managerName = useSelector((state) => state.auth.user.name);
  const teamLeadName = useSelector((state) => state.auth.user.name);
  const [notificationCount, setNotificationCount] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [openRejectPopup, setOpenRejectPopup] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectionDescription, setRejectionDescription] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const handleChangeTab = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setValues({
      ...values,
      [name]: value,
    });
  };



  useEffect(() => {
    axios.get(`${apiUrl}/analyst-manager/projectName`, {
      params: {
        managerTask: managerName // Pass managerName as a query parameter
      }
    })
      .then(response => {
        setProjectNames(response.data); // Set project names in state
      })
      .catch(error => {
        console.error('Error fetching project names:', error);
      });
  }, [managerName]);

  const [teamData, setTeamData] = useState([]);


  useEffect(() => {
    // Fetch team data from the backend
    axios.get(`${apiUrl}/api/fetch/team?managerTask=${managerName}`)
      .then((response) => {
        setTeamData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching team data:', error);
      });
  }, [managerName]);

  const handleTeamchange = (event, value) => setTeamList(value);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Function to handle opening the drawer
  const openDrawer = () => {
    setDrawerOpen(true);
  };

  // Function to handle closing the drawer
  const closeDrawer = () => {
    setDrawerOpen(false);
  };

  const [filterDialogOpen, setFilterDialogOpen] = useState(false);



  // Function to handle closing the filter popup
  const closeFilterDialog = () => {
    setFilterDialogOpen(false);
  };


  const handleSubmit = (e) => {
    e.preventDefault();

    const sDate = values.startDate;
    const eDate = values.endDate;
    const name = empName;
    const team = teamList;
    const project = projectName; // Renamed projectName to project for clarity

    // Construct the API URL based on the presence of projectName
    let apiEndpoint;
    if (project) {
      apiEndpoint = `${apiUrl}/fetch/report/projectName/?sDate=${sDate}&eDate=${eDate}&team=${team}&projectName=${project}`;
    } else if (!name && !team && !project) {
      apiEndpoint = `${apiUrl}/fetch/report/date/?sDate=${sDate}&eDate=${eDate}&managerTask=${managerName}`;
    } else if (!name && team && !project) {
      apiEndpoint = `${apiUrl}/fetch/report/team/?sDate=${sDate}&eDate=${eDate}&team=${team}`;
    } else if (name && !team && !project) {
      apiEndpoint = `${apiUrl}/fetch/report/user/?sDate=${sDate}&eDate=${eDate}&name=${name}`;
    } else {
      apiEndpoint = `${apiUrl}/fetch/report/?sDate=${sDate}&eDate=${eDate}&name=${name}&team=${team}`;
    }

    axios.get(apiEndpoint)
      .then((res) => {
        setReport(res.data);
      })
      .catch((err) => console.log(`Error: ${err}`));

    // Reset form values
    setValues(initialValues);
    setEmpName(null);
    setTeamList(null);
    setProjectName(null);

    // Close the filter dialog
    closeFilterDialog();
  };
  const [newReports, setNewReports] = useState([]);

  const handleNewReport = (report) => {
    setNewReports(prevReports => [...prevReports, report]);
  };
  useEffect(() => {
    allReport();
  }, []);

  const allReport = () => {
    setLoading(true);
    const teamLead = teamLeadName.trim();
    axios.get(`${apiUrl}/analyst/byTeamLead/${teamLead}`)
      .then((res) => {
        setReport(res.data);
        // Calculate notification count
        const pendingReports = res.data.filter(item => item.approvalStatus === 'pending');
        setNotificationCount(pendingReports.length);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  };

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  // // Call the function
  // allReport();

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const userName = () => {
    return axios.get(`${apiUrl}/users`).then((res) => {
      setName(res.data);
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([allReport(), userName()]);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);



  const handleApprove = (taskId) => {
    axios.put(`${apiUrl}/tasks/${taskId}/approve`)
      .then((response) => {
        console.log('Task approved successfully:', response.data);
        if (response.data.approvalStatus !== 'pending') {
          setNotificationCount((prevCount) => prevCount - 1); // Decrease count only if status changed from pending
          setSnackbarMessage('Task approved successfully');
          setSnackbarOpen(true);
        }
        allReport(); // Refresh report data
      })
      .catch((error) => {
        console.error('Error approving task:', error);
      });
  };

  const handleReject = (taskId) => {
    // Set the selected task ID to state
    setSelectedTaskId(taskId);
    // Open the reject popup/modal
    setOpenRejectPopup(true);
  };
  const cancelClose = () => {
    // Open the reject popup/modal
    setOpenRejectPopup(false);
  };
  // Function to submit rejection with reason and description
  const submitRejection = () => {
    axios.put(`${apiUrl}/tasks/${selectedTaskId}/reject`, {
      rejectionReason,
      rejectionDescription
    })
      .then((response) => {
        console.log('Task rejected successfully:', response.data);
        // Handle success or close popup
        setOpenRejectPopup(false);
        // Refresh report data
        allReport();
        setOpenRejectPopup(false);
      })
      .catch((error) => {
        console.error('Error rejecting task:', error);
        // Handle error or show error message
      });
  };

  const handleOpenRejectPopup = (taskId) => {
    setSelectedTaskId(taskId);
    setOpenRejectPopup(true);
  };

  const handleCloseRejectPopup = () => {
    setOpenRejectPopup(false);
  };
  // const rejectionPopup = (
  //   <div>
  //     <div>Reason: 
  //       <select value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)}>
  //         <option value="Reason1">Reason1</option>
  //         <option value="Reason2">Reason2</option>
  //         <option value="Reason3">Reason3</option>
  //       </select>
  //     </div>
  //     <div>Description: 
  //       <textarea value={rejectionDescription} onChange={(e) => setRejectionDescription(e.target.value)} />
  //     </div>
  //     <button onClick={submitRejection}>Submit</button>
  //     <button onClick={cancelClose}>Cancel</button>
  //   </div>
  // );
  const getStatusColor = (approvalStatus) => {
    switch (approvalStatus.toLowerCase()) {
      case 'pending':
        return 'orange';
      case 'approved':
        return 'green';
      case 'rejected':
        return 'red';
      default:
        return 'inherit'; // Default color
    }
  };

  const openDialog = (userData) => {
    setSelectedUserData(userData);
    setDialogOpen(true);
  };

  // Function to handle closing the dialog
  const closeDialog = () => {
    setSelectedUserData(null);
    setDialogOpen(false);
  };
  const handleDelete = (_id) => {
    // Perform the deletion in MongoDB using the _id
    axios.delete(`${apiUrl}/delete/usertask/${_id}`).then((response) => {
      // Handle success, e.g., refetch the data
      allReport()
      toast.success('Successfully deleted.');
    }).catch((error) => {
      // Handle error
      toast.error('Error deleting the record.');
    });
  };
  // tabel report
  const columns = [
    { field: "id", headerName: "ID", width: 50 },
    {
      field: "date",
      headerName: "Date",
      width: 100,
      editable: false,
      flex: 1,
    },
    {
      field: "name",
      headerName: "Name",
      width: 200,
      editable: false,
      flex: 1,
    },
    {
      field: "team",
      headerName: "Team",
      width: 70,
      editable: false,
      flex: 1,
    },
    {
      field: "projectName",
      headerName: "Project Name",
      width: 150,
      editable: false,
      flex: 1,
    },
    {
      field: "taskCount",
      headerName: "Task Count",
      width: 120,
      editable: false,
      renderCell: (params) => (
        <Typography sx={{ fontSize: 15, textAlign: "center" }}>
          {params.row.taskCount}
        </Typography>
      ),
      align: "center",
    },
    {
      field: "managerTask",
      headerName: "Project Manager",
      width: 150,
      editable: false,
      flex: 1,
    },
    {
      field: "totalHours",
      headerName: "Total Hours",
      width: 140,
      editable: false,
      renderCell: (params) => (
        <Typography sx={{ fontSize: 15, textAlign: "center" }}>
          {calculateTotalHours(params.row.sessionOne)}
        </Typography>
      ),
      align: "center",
    },
    {
      field: 'approvalStatus',
      headerName: 'Approval Status',
      width: 150,

      renderCell: (params) => (
        <div>
          {params.row.approvalStatus === 'pending' && (
            <div>
              <IconButton onClick={() => handleApprove(params.row._id)}>
                <CheckCircleIcon style={{ color: 'green' }} />
              </IconButton>
              <IconButton onClick={() => handleReject(params.row._id)}>
                <CancelIcon style={{ color: 'red' }} />
              </IconButton>
            </div>
          )}
          {/* {params.row.approvalStatus !== 'pending' && (
            <Typography>{params.row.approvalStatus}</Typography>
            
          )} */}
          {params.row.approvalStatus !== 'pending' && (
            <Typography style={{ color: getStatusColor(params.row.approvalStatus), fontSize: 15 }}>
              {params.row.approvalStatus.toUpperCase()}
            </Typography>
          )}
        </div>

      ),
    },
    {
      field: "view",
      headerName: "View",
      sortable: false,
      filterable: false,
      width: 100,
      renderCell: (params) => (
        <IconButton style={{ color: "#2196f3", textAlign: "center" }} onClick={() => openDialog(params.row)}>
          <VisibilityIcon />
        </IconButton>
      ),
    },
    // {
    //   field: 'delete',
    //   headerName: 'Delete',
    //   sortable: false,
    //   filterable: false,
    //   width: 100,
    //   renderCell: (params) => (
    //     <IconButton 
    //       style={{ color: 'red' }}
    //       onClick={() => handleDelete(params.row._id)}
    //     >
    //       <DeleteIcon />
    //     </IconButton>
    //   ),
    // },

  ];

  // Function to calculate taskCount for each row
  const calculateTaskCount = (sessionOne) => {
    return sessionOne.length;
  };

  const row = useMemo(
    () =>
      report.reverse().map((item, index) => ({
        ...item,
        id: index + 1,
        name: item.name,
        team: item.team,
        date: moment(item.dateTask).format("DD-MM-YYYY"),
        projectName: item.projectName,
        task: item.task,
        managerTask: item.managerTask,
        sessionOne: item.sessionOne,
        taskCount: calculateTaskCount(item.sessionOne),
      })),
    [report]
  );


  // Team List
  const list = ["CV", "NLP", "CM", "SOURCING", "DEVELOPMENT"];

  const [popperOpen, setPopperOpen] = useState(false);

  const handlePopperToggle = () => {
    setPopperOpen((prev) => !prev);
  };

  const handlePopperClose = () => {
    setPopperOpen(false);
  };
  const calculateTotalHours = (sessionOne) => {
    let totalMinutes = 0;

    sessionOne.forEach((task) => {
      const [hours, minutes] = task.sessionOne.split(":");
      totalMinutes += parseInt(hours) * 60 + parseInt(minutes);
    });

    const hours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;

    return `${hours}:${remainingMinutes < 10 ? "0" : ""}${remainingMinutes}`;
  };



  // Billing report Datagrid table

  const calculateDateProjectWiseData = () => {
    const dateProjectWiseData = [];

    // Group the report data by date and projectName
    const groupedByDateAndProject = report.reduce((acc, curr) => {
      const date = moment(curr.dateTask).format('DD-MM-YYYY');
      const projectName = curr.projectName;
      const key = date + '_' + projectName;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(curr);
      return acc;
    }, {});

    // Iterate over each date and project group
    for (const key in groupedByDateAndProject) {
      const [date, projectName] = key.split('_');
      const projectData = groupedByDateAndProject[key];
      const teamSet = new Set();
      const nameSet = new Set();
      const managerTaskSet = new Set();
      let totalHours = 0; // Initialize total hours for the day
      let idleNonBillableCount = 0; // Initialize count for "Idle -Non Billable" tasks
      let idleNonBillableHours = 0; // Initialize total hours for "Idle -Non Billable" tasks
      let pendingCount = 0; // Initialize count for pending analysts
      let approvedCount = 0; // Initialize count for approved analysts
      let rejectedCount = 0; // Initialize count for rejected analysts

      // Collect unique teams, names, and manager tasks related to the project and date
      projectData.forEach(entry => {
        // Check if the entry has an 'approved' status
        if (entry.approvalStatus === 'approved') {
          approvedCount++;
        } else if (entry.approvalStatus === 'rejected') {
          rejectedCount++;
        } else {
          pendingCount++;
        }
        // Check if the entry has an 'approved' status
        if (entry.approvalStatus === 'approved') {
          teamSet.add(entry.team);
          managerTaskSet.add(entry.managerTask);

          // Exclude "Idle -Non Billable" tasks from name length and total hours calculations
          if (entry.sessionOne && entry.sessionOne.length > 0) {
            entry.sessionOne.forEach(session => {
              // Check if the task is "Idle -Non Billable"
              if (session.task === "Idle -Non Billable") {
                idleNonBillableCount++; // Increment count
                const [hours, minutes] = session.sessionOne.split(':'); // Extract hours and minutes
                idleNonBillableHours += parseInt(hours) * 60 + parseInt(minutes); // Convert hours to minutes and add to total for "Idle -Non Billable" tasks
              } else {
                // For other tasks, include in name length and total hours calculations
                nameSet.add(entry.name);
                const [hours, minutes] = session.sessionOne.split(':'); // Extract hours and minutes
                totalHours += parseInt(hours) * 60 + parseInt(minutes); // Convert hours to minutes and add to total
              }
            });
          }
        }
      });


      // Convert totalHours and idleNonBillableHours to hours:minutes format
      const formattedTotalHours = Math.floor(totalHours / 60) + 'hr:' + (totalHours % 60).toString().padStart(2, '0') + 'min';
      const formattedIdleNonBillableHours = Math.floor(idleNonBillableHours / 60) + ':' + (idleNonBillableHours % 60).toString().padStart(2, '0');
      // Now, integrate the counts of pending, approved, and rejected analysts
      report.forEach(entry => {
        // Check if the entry has an 'approved' status
        if (entry.approvalStatus === 'approved') {
          approvedCount++;
        } else if (entry.approvalStatus === 'rejected') {
          rejectedCount++;
        }
      });


      const dateProjectWiseDatum = {
        id: uuidv4(), // Generate unique ID for the row
        date: date,
        projectName: projectName,
        team: teamSet.size > 0 ? Array.from(teamSet).join(', ') : "N/A", // Concatenate unique team names if available, otherwise show "N/A"
        nameLength: nameSet.size, // Count of unique names excluding "Idle -Non Billable"
        managerTask: managerTaskSet.size > 0 ? Array.from(managerTaskSet).join(', ') : "N/A", // Concatenate unique manager tasks if available, otherwise show "N/A"
        totalHours: formattedTotalHours, // Total hours for sessionOne for the day excluding "Idle -Non Billable"
        idleNonBillableCount: idleNonBillableCount, // Count of "Idle -Non Billable" tasks
        idleNonBillableHours: formattedIdleNonBillableHours, // Total hours for "Idle -Non Billable" tasks
        pendingCount: pendingCount,
        approvedCount: approvedCount,
        rejectedCount: rejectedCount
      };





      // Push the calculated data for the date and project to the array
      dateProjectWiseData.push(dateProjectWiseDatum);
    }

    console.log(dateProjectWiseData); // Logging the calculated data
    return dateProjectWiseData;
  };


  // Define columns for the new DataGrid
  const dateProjectWiseColumns = [
    { field: 'date', headerName: 'Date', width: 150 },
    { field: 'projectName', headerName: 'Project Name', width: 200 },
    { field: 'team', headerName: 'Team', width: 200 },
    { field: 'nameLength', headerName: 'Id Count', width: 150 },
    { field: 'managerTask', headerName: 'Manager Name', width: 200 },
    { field: 'totalHours', headerName: 'Total Hours', width: 200 }, // Update the header to indicate it's for sessionOne
    { field: 'idleNonBillableCount', headerName: 'Idle Count', width: 200 }, // New header for count of "Idle -Non Billable" tasks
    { field: 'idleNonBillableHours', headerName: 'Idle Hours', width: 200 }, // New header for total hours of "Idle -Non Billable" tasks
    { field: 'pendingCount', headerName: 'Pending Count', width: 150 }, // New header for count of pending analysts
    { field: 'approvedCount', headerName: 'Approved Count', width: 150 }, // New header for count of approved analysts
    { field: 'rejectedCount', headerName: 'Rejected Count', width: 150 }, // New header for count of rejected analysts
  ];

  const dateProjectWiseData = calculateDateProjectWiseData();


  // Define csvReport data for CSVLink including sum values
  const sumIdCount = dateProjectWiseData.reduce((acc, row) => acc + row.nameLength, 0);

  // Function to convert hours and minutes to total minutes
  const getMinutesFromTimeString = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    return parseInt(hours) * 60 + parseInt(minutes);
  };

  const sumTotalMinutes = dateProjectWiseData.reduce((acc, row) => acc + getMinutesFromTimeString(row.totalHours), 0);
  const sumIdleNonBillableCount = dateProjectWiseData.reduce((acc, row) => acc + row.idleNonBillableCount, 0);
  const sumIdleNonBillableMinutes = dateProjectWiseData.reduce((acc, row) => acc + getMinutesFromTimeString(row.idleNonBillableHours), 0);

  // Function to convert total minutes back to hours and minutes format
  const getTimeStringFromMinutes = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}hr:${minutes.toString().padStart(2, '0')}min`;
  };

  // Convert summed total minutes back to hours and minutes format
  const sumTotalHours = getTimeStringFromMinutes(sumTotalMinutes);
  const sumIdleNonBillableHours = getTimeStringFromMinutes(sumIdleNonBillableMinutes);

  // Combine data with sum values
  const dataWithSum = [
    ...dateProjectWiseData.map(row => ({
      Date: row.date,
      Project_Name: row.projectName,
      Team: row.team,
      Id_Count: row.nameLength,
      Manager_Name: row.managerTask,
      Total_Hours: row.totalHours,
      Idle_Non_Billable_Count: row.idleNonBillableCount,
      Idle_Non_Billable_Hours: row.idleNonBillableHours
    })),
    {
      Date: "Sum",
      Project_Name: "",
      Team: "",
      Id_Count: sumIdCount,
      Manager_Name: "",
      Total_Hours: sumTotalHours,
      Idle_Non_Billable_Count: sumIdleNonBillableCount,
      Idle_Non_Billable_Hours: sumIdleNonBillableHours
    }
  ];

  // Define csvReport data for CSVLink
  const csvReport = {
    data: dataWithSum,
    headers: [
      { label: "Date", key: "Date" },
      { label: "Project Name", key: "Project_Name" },
      { label: "Team", key: "Team" },
      { label: "Members Count", key: "Id_Count" },
      { label: "Manager Name", key: "Manager_Name" },
      { label: "Total Hours", key: "Total_Hours" },
      { label: "Idle Count", key: "Idle_Non_Billable_Count" },
      { label: "Task Count", key: "taskCount" },
      { label: "Total Hours", key: "Total_Hours" },
      { label: "Idle Hours", key: "Idle_Non_Billable_Hours" }
    ],
    filename: "admin_report.csv"
  };

  const handleReasonChange = (event) => {
    const { value } = event.target;
    if (value.includes('Other')) {
      setOpenRejectPopup(false);
      setRejectionReasons(value.filter(reason => reason !== 'Other'));
      setRejectionDescription(value.join(', '));
    } else {
      setRejectionReasons(value);
      setRejectionDescription(value.join(', '));
    }
  };

  const params = { row: { _id: 'task_id', approvalStatus: 'pending' } };

  return (
    <DashboardLayout>
      <DashboardNavbar notificationCount={notificationCount} />
      {/* <Attendance notificationCount={notificationCount} /> */}
      <div>

        <Dialog open={openRejectPopup} onClose={handleCloseRejectPopup} maxWidth="sm" fullWidth>
          <DialogTitle>Comments</DialogTitle>
          <DialogContent>
            <div>
              {/* <div>Reason:
                <Select
                  multiple
                  value={rejectionReasons}
                  onChange={handleReasonChange}
                  input={<Input id="select-reason" />}
                  renderValue={(selected) => (
                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </div>
                  )}
                >
                  <MenuItem value="Reason1">Reason1</MenuItem>
                  <MenuItem value="Reason2">Reason2</MenuItem>
                  <MenuItem value="Reason3">Reason3</MenuItem>
                  <MenuItem value="Others">Others</MenuItem>
                </Select>
              </div> */}
              <div>
                <TextField
                  value={rejectionDescription}
                  onChange={(e) => setRejectionDescription(e.target.value)}
                  fullWidth
                  multiline
                  rows={4}
                />
              </div>
            </div>
          </DialogContent>
          <DialogActions>
            <MDButton onClick={submitRejection} variant="contained" color="success">Submit</MDButton>
            <MDButton onClick={handleCloseRejectPopup} variant="outlined" color="primary">Cancel</MDButton>
          </DialogActions>
        </Dialog>
      </div>
      {/* Notification icon with badge */}
      {/* <IconButton aria-label="notifications" onClick={handleClick}>
        <Badge badgeContent={notificationCount} color="secondary">
          <NotificationsIcon />
        </Badge>
      </IconButton> */}
      {/* Popover to display pending report names */}

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
      <Grid item xs={12} mb={1}>
        <Card>
          <Box>
            <Popper
              open={popperOpen}
              // anchorEl={/* Provide the reference to the element that triggers the popper */}
              role={undefined}
              transition
              disablePortal
              style={{
                zIndex: 9999,
                position: "absolute",
                top: "190px",
                left: "0px",
              }}
            >
              {({ TransitionProps, placement }) => (
                <ClickAwayListener onClickAway={handlePopperClose}>
                  <Paper>
                    {/* <DialogTitle sx={{ textAlign: 'center' }}>Your Popper Title</DialogTitle> */}
                    <DialogContent>
                      <MDBox
                        component="form"
                        role="form"
                        onSubmit={handleSubmit}
                        className="filter-popup"
                        sx={{ display: "flex", padding: "0px" }}
                      >
                        <MDBox
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            marginRight: 2,
                          }}
                        >
                          <MDTypography
                            variant="h6"
                            fontWeight="medium"
                            sx={{ fontSize: "15px" }}
                          >
                            Start Date
                          </MDTypography>
                          <MDInput
                            type="date"
                            name="startDate"
                            size="small"
                            sx={{ width: "100%" }}
                            value={values.startDate}
                            onChange={handleInputChange}
                          />
                        </MDBox>
                        <MDBox
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            marginRight: 2,
                          }}
                        >
                          <MDTypography
                            variant="h6"
                            // fontWeight="medium"
                            size="small"
                          >
                            End Date
                          </MDTypography>
                          <MDInput
                            id="movie-customized-option-demo"
                            type="date"
                            name="endDate"
                            size="small"
                            sx={{ width: "100%", border: "none !important" }}
                            value={values.endDate}
                            onChange={handleInputChange}
                          />
                        </MDBox>
                        <MDBox
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            marginRight: 2,
                          }}
                        >
                          <MDTypography variant="h6" fontWeight="medium">
                            Team
                          </MDTypography>
                          <Autocomplete
                            options={list}
                            onChange={handleTeamchange}
                            id="movie-customized-option-demo"
                            disableCloseOnSelect
                            sx={{ width: "100%" }}
                            PopperComponent={(props) => (
                              <Popper
                                {...props}
                                style={{ zIndex: 99999, position: "relative" }}
                              >
                                {props.children}
                              </Popper>
                            )}
                            renderInput={(params) => (
                              <TextField {...params} variant="standard" />
                            )}
                          />
                        </MDBox>

                        <MDBox
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            marginRight: 2,
                          }}
                        >
                          <MDTypography variant="h6" fontWeight="medium">
                            Project Name
                          </MDTypography>
                          <Autocomplete
                            options={projectNames}
                            onChange={(event, value) => setProjectName(value)} // Update projectName state with the selected value
                            id="project-name-filter"
                            disableClearable
                            sx={{ width: "100%" }}
                            renderInput={(params) => (
                              <TextField {...params} variant="standard" />
                            )}
                          />
                        </MDBox>
                        <Box
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                          pt={3}
                        >
                          <MDButton
                            variant="gradient"
                            size="small"
                            color="info"
                            type="submit"
                          >
                            Search
                          </MDButton>
                        </Box>
                      </MDBox>
                    </DialogContent>
                  </Paper>
                </ClickAwayListener>
              )}
            </Popper>
          </Box>
        </Card>
      </Grid>
      <Dialog open={isDialogOpen} onClose={closeDialog} maxWidth="lg">
        <DialogTitle
          style={{
            background: "#2196f3",
            color: "white",
            fontSize: "1.2rem",
            padding: "20px",
          }}
        >
          {"Task List"}
        </DialogTitle>
        <DialogContent>
          {selectedUserData && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography
                style={{ fontSize: "1rem", marginTop: "10px", padding: "10px" }}
              >
                <strong style={{ fontSize: "18px" }}>
                  Project Name:
                </strong>{" "}
                {selectedUserData.projectName}
              </Typography>

              <div
                style={{
                  maxHeight: "300px", // Set a fixed height for the scrollable area
                  overflow: "auto",  // Enable scrolling
                  marginTop: "10px",
                }}
              >
                <table
                  style={{
                    width: "600px",
                    borderCollapse: "collapse",
                    fontSize: "1rem",
                  }}
                >
                  <thead>
                    <tr>
                      <th
                        style={{
                          padding: "8px",
                          border: "1px solid #ccc",
                          borderRadius: "8px",
                          minWidth: "150px",
                        }}
                      >
                        Task Name
                      </th>
                      <th
                        style={{
                          padding: "8px",
                          border: "1px solid #ccc",
                          borderRadius: "8px",
                          minWidth: "150px",
                        }}
                      >
                        Total Hours
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedUserData.sessionOne.map((session, index) => (
                      <tr key={index}>
                        <td
                          style={{
                            padding: "8px",
                            border: "1px solid #ccc",
                            borderRadius: "8px",
                          }}
                        >
                          {session.task}
                        </td>
                        <td
                          style={{
                            padding: "8px",
                            border: "1px solid #ccc",
                            borderRadius: "8px",
                            textAlign: "center",
                          }}
                        >
                          {session.sessionOne}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {/* <Typography
          style={{ fontSize: "1rem", marginTop: "10px", padding: "10px" }}
        >
          <strong style={{ fontSize: "18px" }}>
            Description 
          </strong>{" "}
          {selectedUserData.rejectionDescription}
        </Typography> */}
                {selectedUserData !== null && (
                  <Typography style={{ fontSize: "1rem", marginTop: "10px", padding: "10px" }}>
                    {selectedUserData.rejectionDescription && ( // Check if description exists
                      <strong style={{ fontSize: "18px" }}>Comments</strong>
                    )}
                    <table style={{ marginTop: "10px" }}>
                      <tbody>
                        <tr>
                          <td>{selectedUserData.rejectionDescription}</td>
                        </tr>

                      </tbody>
                    </table>
                  </Typography>
                )}
                {selectedUserData !== null && (
                  <Typography style={{ fontSize: "1rem", marginTop: "10px", padding: "10px" }}>
                    {selectedUserData.description && ( // Check if description exists
                      <strong style={{ fontSize: "18px" }}>Description</strong>
                    )}
                    <table style={{ marginTop: "10px" }}>
                      <tbody>
                        <tr>
                          <td>{selectedUserData.description}</td>
                        </tr>
                      </tbody>
                    </table>
                  </Typography>
                )}
              </div>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Tabs value={activeTab} onChange={handleChangeTab} variant="fullWidth">
        <Tab label="Billing Report" />
        <Tab label="Task Report" />
      </Tabs>
      <Grid item xs={12} mb={10}>
        {/* <IconButton  onClick={openDrawer} color="primary" aria-label="Filter">
      <FilterListIcon />
    </IconButton> */}

        <MDBox pt={1}>
          <Grid item xs={12}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: "10px" }}>
              <CSVLink
                {...csvReport}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  textDecoration: "none",
                }}
              >
                <MDButton
                  variant="contained"
                  color="success" // Assuming "success" is a valid color option in your Material-UI Button component
                  size="small"
                  startIcon={<CloudDownloadIcon />}
                >
                  Export to CSV
                </MDButton>
              </CSVLink>
            </div>
            <Card>

              <MDBox pt={0}>

                <Box >
                  {activeTab === 0 && (
                    <div style={{ height: "670px" }}> {/* Set a fixed height */}
                      <DataGrid
                        rows={dateProjectWiseData}
                        columns={dateProjectWiseColumns}
                        rowsPerPageOptions={[5, 10, 25, 50, 100]}
                        checkboxSelection
                        disableSelectionOnClick
                        loading={loading}
                        components={{
                          Toolbar: () => (
                            <div style={{ display: "flex" }}>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  marginTop: "5px",
                                  marginLeft: "10px",
                                }}
                              >
                                {/* below date filter have a bug for tl need to update next verion*/}
                                {/* <FilterListIcon
                                  className="team-filter-icon"
                                  style={{
                                    cursor: "pointer",
                                    color: "#1a73e8",
                                    fontSize: "20px",
                                  }}
                                  onClick={handlePopperToggle}
                                  aria-label="Team Filter"
                                /> */}

                                {/* <MDTypography
                                  variant="h6"
                                  onClick={handlePopperToggle}
                                  style={{
                                    color: "#1a73e8",
                                    cursor: "pointer",
                                    fontSize: "12.1px",
                                  }}
                                >
                                  DATE FILTER
                                </MDTypography> */}
                              </div>

                              <GridToolbar />

                            </div>
                          ),
                        }}
                      />
                    </div>
                  )}
                  {activeTab === 1 && (
                    <div style={{ height: 670, width: "100%" }}>
                      <DataGrid
                        rows={row}
                        columns={columns}
                        // pageSize={10}
                        rowsPerPageOptions={[5, 10, 25, 50, 100]}
                        checkboxSelection
                        disableSelectionOnClick
                        loading={loading}
                        components={{
                          Toolbar: () => (
                            <div style={{ display: "flex" }}>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  marginTop: "5px",
                                  marginLeft: "10px",
                                }}
                              >
                                {/* below date filter have a bug for tl need to update next verion*/}
                                {/* <FilterListIcon
                                  className="team-filter-icon"
                                  style={{
                                    cursor: "pointer",
                                    color: "#1a73e8",
                                    fontSize: "20px",
                                  }}
                                  onClick={handlePopperToggle}
                                  aria-label="Team Filter"
                                />
                                <MDTypography
                                  variant="h6"
                                  onClick={handlePopperToggle}
                                  style={{
                                    color: "#1a73e8",
                                    cursor: "pointer",
                                    fontSize: "12.1px",
                                  }}
                                >
                                  DATE FILTER
                                </MDTypography> */}
                              </div>

                              <GridToolbar />

                            </div>
                          ),
                        }}

                      />
                    </div>
                  )}
                </Box>
                {/* <Box sx={{ height: 480, width: "100%" }}> */}

              </MDBox>
            </Card>
          </Grid>
        </MDBox>
      </Grid>
      {/* <Footer /> */}
      <ToastContainer />

    </DashboardLayout>
  );
}
export default AdminReport;
