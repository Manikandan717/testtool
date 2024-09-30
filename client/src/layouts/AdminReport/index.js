import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbarManager";
import DeleteIcon from "@mui/icons-material/Delete"; // Assuming you're using Material-UI
// import Footer from "examples/Footer";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { ToastContainer, toast } from "react-toastify";
import MDInput from "components/MDInput";
import IconButton from "@mui/material/IconButton";
import * as React from "react";
import CloseIcon from "@mui/icons-material/Close";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Select, MenuItem, Input, Chip } from "@mui/material";
import {
  Badge,
  Popover,
  List,
  ListItem,
  ListItemText,
  Snackbar,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useSelector } from "react-redux";
// import IconButton from "@material-ui/core/IconButton";
// import FormControl from "@mui/material/FormControl";
// import Select from "@mui/material/Select";
import { useState, useEffect, useMemo } from "react";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import Button from "@material-ui/core/Button";
import "react-datepicker/dist/react-datepicker.css";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
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
import CircularProgress from "@mui/material/CircularProgress";
import { v4 as uuidv4 } from "uuid";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

function AdminReport() {
  const apiUrl = "https://9tnby7zrib.execute-api.us-east-1.amazonaws.com/test/Emp";

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
  const [projectNames, setProjectNames] = useState([]);
  const [projectName, setProjectName] = useState(null);
  const managerName = useSelector((state) => state.auth.user.name);
  const [activeTab, setActiveTab] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(50);
  const [hasMore, setHasMore] = useState(true);
  const [filteredColumns, setFilteredColumns] = useState([]);
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
    axios
      .get(`${apiUrl}/analyst-manager/projectName`, {
        params: {
          managerTask: managerName, // Pass managerName as a query parameter
        },
      })
      .then((response) => {
        setProjectNames(response.data); // Set project names in state
      })
      .catch((error) => {
        console.error("Error fetching project names:", error);
      });
  }, [managerName]);

  const [teamData, setTeamData] = useState([]);

  useEffect(() => {
    // Fetch team data from the backend
    axios
      .get(`/api/fetch/team?managerTask=${managerName}`)
      .then((response) => {
        setTeamData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching team data:", error);
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

    axios
      .get(apiEndpoint)
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

  const allReport = () => {
    const managerTask = managerName.trim();

    return axios
      .get(`${apiUrl}/analyst/byManagerTask/${managerTask}`, {
        params: {
          page: page + 1, // Add 1 because backend uses 1-based indexing
          limit: pageSize,
        },
      })
      .then((res) => {
        if (res.data.analysts.length < pageSize) {
          setHasMore(false);
        }
        setReport((prevReport) => [...prevReport, ...res.data.analysts]);
        setPage((prevPage) => prevPage + 1);
      })
      .catch((err) => console.log(err));
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const [notificationCount, setNotificationCount] = useState(0);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [openRejectPopup, setOpenRejectPopup] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectionDescription, setRejectionDescription] = useState("");

  const handleApprove = (taskId) => {
    axios
      .put(`${apiUrl}/tasks/${taskId}/approve`)
      .then((response) => {
        console.log("Task approved successfully:", response.data);
        if (response.data.approvalStatus !== "pending") {
          setSnackbarMessage("Task approved successfully");
          setSnackbarOpen(true);
          
          // Update the local state
          setReport((prevReport) =>
            prevReport.map((item) =>
              item._id === taskId ? { ...item, approvalStatus: "approved" } : item
            )
          );
        }
      })
      .catch((error) => {
        console.error("Error approving task:", error);
        setSnackbarMessage("Error approving task");
        setSnackbarOpen(true);
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
    axios
      .put(`${apiUrl}/tasks/${selectedTaskId}/reject`, {
        rejectionReason,
        rejectionDescription,
      })
      .then((response) => {
        console.log("Task rejected successfully:", response.data);
        // Handle success or close popup
        setOpenRejectPopup(false);
        // Refresh report data
        allReport();
        setOpenRejectPopup(false);
      })
      .catch((error) => {
        console.error("Error rejecting task:", error);
        // Handle error or show error message
      });
  };

  const handleCloseRejectPopup = () => {
    setOpenRejectPopup(false);
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
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
    axios
      .delete(`${apiUrl}/delete/usertask/${_id}`)
      .then((response) => {
        // Handle success, e.g., refetch the data
        allReport();
        toast.success("Successfully deleted.");
      })
      .catch((error) => {
        // Handle error
        toast.error("Error deleting the record.");
      });
  };

  const getStatusColor = (approvalStatus) => {
    switch (approvalStatus.toLowerCase()) {
      case "pending":
        return "orange";
      case "approved":
        return "green";
      case "rejected":
        return "red";
      default:
        return "inherit"; // Default color
    }
  };
  // tabel report
  const columns = [
    { field: "id", headerName: "ID", width: 50 },
    {
      field: "date",
      headerName: "Date",
      width: 170,
      // editable: false,
      // flex: 1
    },
    {
      field: "name",
      headerName: "Name",
      width: 170,
      // editable: false,
      // flex: 1
    },
    {
      field: "annName",
      headerName: "Annotator Name",
      width: 170,
      // editable: false,
      // flex: 1,
    },
    {
      field: "annotatorId",
      headerName: "Annotator ID",
      width: 270,
      // editable: false,
      // flex: 1,
    },
    {
      field: "declineReason",
      headerName: "Reason For Decline",
      width: 170,
      // editable: false,
      // flex: 1,
    },
    {
      field: "annBatch",
      headerName: "Batch",
      width: 170,
      // editable: false,
      // flex: 1,
    },
    {
      field: "annPrompt",
      headerName: "Prompt",
      width: 370,
      // editable: false,
      // flex: 1,
    },
    {
      field: "annReasonOne",
      headerName: "Response One",
      width: 170,
      // editable: false,
      // flex: 1,
    },
    {
      field: "annReasonTwo",
      headerName: "Response Two",
      width: 170,
      // editable: false,
      // flex: 1,
    },
    {
      field: "overallPref",
      headerName: "Overall Preference",
      width: 170,
      // editable: false,
      // flex: 1,
    },
    {
      field: "overallRank",
      headerName: "Overall Ranking",
      width: 170,
      // editable: false,
      // flex: 1,
    },
    {
      field: "responseOne",
      headerName: "Response One Rating",
      width: 170,
      // editable: false,
      // flex: 1,
    },
    {
      field: "responseTwo",
      headerName: "Response Two Rating",
      width: 170,
      // editable: false,
      // flex: 1,
    },
    {
      field: "harmlessPref",
      headerName: "Harmless Preference",
      width: 170,
      // editable: false,
      // flex: 1,
    },
    {
      field: "harmlessRank",
      headerName: "Harmless Ranking",
      width: 170,
      // editable: false,
      // flex: 1,
    },
    {
      field: "honestPref",
      headerName: "Honest Preference",
      width: 170,
      // editable: false,
      // flex: 1,
    },
    {
      field: "honestRank",
      headerName: "Honest Ranking",
      width: 170,
      // editable: false,
      // flex: 1,
    },
    {
      field: "helpPref",
      headerName: "Helpful Preference",
      width: 170,
      // editable: false,
      // flex: 1,
    },
    {
      field: "helpRank",
      headerName: "Helpful Ranking",
      width: 170,
      // editable: false,
      // flex: 1,
    },
    {
      field: "commentAnn",
      headerName: "Comments",
      width: 170,
      // editable: false,
      // flex: 1,
    },
    {
      field: "startTime",
      headerName: "Start Time",
      width: 170,
      // editable: false,
      // flex: 1,
    },
    {
      field: "endTime",
      headerName: "End Time",
      width: 170,
      // editable: false,
      // flex: 1,
    },
    {
      field: "totalTime",
      headerName: "Total Time",
      width: 170,
      // editable: false,
      // flex: 1,
    },
    {
      field: "toolTime",
      headerName: "Tool Time",
      width: 170,
      // editable: false,
      // flex: 1,
    },
    {
      field: "mins",
      headerName: "Minutes",
      width: 170,
      // editable: false,
      // flex: 1,
    },
    {
      field: "sec",
      headerName: "Seconds",
      width: 170,
      // editable: false,
      // flex: 1,
    },
    {
      field: "team",
      headerName: "Team",
      width: 170,
      // editable: false,
      // flex: 1
    },
    {
      field: "projectName",
      headerName: "Project Name",
      width: 170,
      // editable: false,
      // flex: 1
    },
    {
      field: "taskCount",
      headerName: "Task Count",
      width: 170,
      // editable: false,
      valueGetter: (params) => params.row.sessionOne.length,
      align: "center",
    },
    {
      field: "managerTask",
      headerName: "Project Manager",
      width: 170,
      // editable: false,
      // flex: 1
    },
    {
      field: "totalHours",
      headerName: "Total Hours",
      width: 170,
      // editable: false,
      valueGetter: (params) => calculateTotalHours(params.row.sessionOne),
      align: "center",
    },
    // Conditional rendering of "Annotator ID" column based on the user's name
    {
      field: "approvalStatus",
      headerName: "Approval Status",
      width: 170,
      renderCell: (params) => {
        const dateTask = new Date(params.row.dateTask);
        const taskMonth = dateTask.getMonth() + 1;
        const taskDay = dateTask.getDate();
        const taskYear = dateTask.getFullYear();
        const isBeforeDate =
          taskYear < 2024 ||
          (taskYear === 2024 && (taskMonth < 4 || (taskMonth === 4 && taskDay < 12)));

        if (isBeforeDate) {
          return (
            <Typography style={{ color: "green", fontSize: 15 }}>
              APPROVED
            </Typography>
          );
        } else {
          return (
            <div>
              {params.row.approvalStatus === "pending" && (
                <div>
                  <IconButton onClick={() => handleApprove(params.row._id)}>
                    <CheckCircleIcon style={{ color: "green" }} />
                  </IconButton>
                  <IconButton onClick={() => handleReject(params.row._id)}>
                    <CancelIcon style={{ color: "red" }} />
                  </IconButton>
                </div>
              )}
              {params.row.approvalStatus !== "pending" && (
                <Typography
                  style={{
                    color: getStatusColor(params.row.approvalStatus),
                    fontSize: 15,
                  }}
                >
                  {params.row.approvalStatus.toUpperCase()}
                </Typography>
              )}
            </div>
          );
        }
      },
    },
    { field: "teamLead", headerName: "Approved By" },
    {
      field: "view",
      headerName: "View",
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <IconButton
          style={{ color: "#2196f3", textAlign: "center" }}
          onClick={() => openDialog(params.row)}
        >
          <VisibilityIcon />
        </IconButton>
      ),
    },
    {
      field: "delete",
      headerName: "Delete",
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <IconButton
          style={{ color: "red" }}
          onClick={() => handleDelete(params.row._id)}
        >
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];
  const calculateTaskCount = (sessionOne) => {
    return sessionOne.length;
  };

  const row = useMemo(
    () =>
      report.map((item, index) => ({
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
  
  useEffect(() => {
    const filterColumns = (data, columns) => {
      return columns.filter(
        (column) =>
          column.field === "delete" || // Always include the "edit" column
          column.field === "view" || // Always include the "view" column
          data.some(
            (row) =>
              row[column.field] !== undefined &&
              row[column.field] !== null &&
              row[column.field] !== ""
          )
      );
    };

    const filtered = filterColumns(row, columns);
    setFilteredColumns(filtered);
  }, [row]);
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
      const date = moment(curr.dateTask).format("DD-MM-YYYY");
      const projectName = curr.projectName;
      const key = date + "_" + projectName;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(curr);
      return acc;
    }, {});

    // Iterate over each date and project group
    for (const key in groupedByDateAndProject) {
      const [date, projectName] = key.split("_");
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
      projectData.forEach((entry) => {
        // Check if the entry has an 'approved' status
        if (entry.approvalStatus === "approved") {
          approvedCount++;
        } else if (entry.approvalStatus === "rejected") {
          rejectedCount++;
        } else {
          pendingCount++;
        }
        // Check if the entry has an 'approved' status
        if (entry.approvalStatus === "approved") {
          teamSet.add(entry.team);
          managerTaskSet.add(entry.managerTask);

          // Exclude "Idle -Non Billable" tasks from name length and total hours calculations
          if (entry.sessionOne && entry.sessionOne.length > 0) {
            entry.sessionOne.forEach((session) => {
              // Check if the task is "Idle -Non Billable"
              if (session.task === "Idle -Non Billable") {
                idleNonBillableCount++; // Increment count
                const [hours, minutes] = session.sessionOne.split(":"); // Extract hours and minutes
                idleNonBillableHours +=
                  parseInt(hours) * 60 + parseInt(minutes); // Convert hours to minutes and add to total for "Idle -Non Billable" tasks
              } else {
                // For other tasks, include in name length and total hours calculations
                nameSet.add(entry.name);
                const [hours, minutes] = session.sessionOne.split(":"); // Extract hours and minutes
                totalHours += parseInt(hours) * 60 + parseInt(minutes); // Convert hours to minutes and add to total
              }
            });
          }
        }
      });

      // Convert totalHours and idleNonBillableHours to hours:minutes format
      const formattedTotalHours =
        Math.floor(totalHours / 60) +
        "hr:" +
        (totalHours % 60).toString().padStart(2, "0") +
        "min";
      const formattedIdleNonBillableHours =
        Math.floor(idleNonBillableHours / 60) +
        ":" +
        (idleNonBillableHours % 60).toString().padStart(2, "0");
      // Now, integrate the counts of pending, approved, and rejected analysts
      report.forEach((entry) => {
        // Check if the entry has an 'approved' status
        if (entry.approvalStatus === "approved") {
          approvedCount++;
        } else if (entry.approvalStatus === "rejected") {
          rejectedCount++;
        }
      });
      const dateProjectWiseDatum = {
        id: uuidv4(), // Generate unique ID for the row
        date: date,
        projectName: projectName,
        team: teamSet.size > 0 ? Array.from(teamSet).join(", ") : "N/A", // Concatenate unique team names if available, otherwise show "N/A"
        nameLength: nameSet.size, // Count of unique names excluding "Idle -Non Billable"
        managerTask:
          managerTaskSet.size > 0
            ? Array.from(managerTaskSet).join(", ")
            : "N/A", // Concatenate unique manager tasks if available, otherwise show "N/A"
        totalHours: formattedTotalHours, // Total hours for sessionOne for the day excluding "Idle -Non Billable"
        idleNonBillableCount: idleNonBillableCount, // Count of "Idle -Non Billable" tasks
        idleNonBillableHours: formattedIdleNonBillableHours, // Total hours for "Idle -Non Billable" tasks
        pendingCount: pendingCount,
        approvedCount: approvedCount,
        rejectedCount: rejectedCount,
      };

      // Push the calculated data for the date and project to the array
      dateProjectWiseData.push(dateProjectWiseDatum);
    }

    console.log(dateProjectWiseData); // Logging the calculated data
    return dateProjectWiseData;
  };

  // Define columns for the new DataGrid
  const dateProjectWiseColumns = [
    { field: "date", headerName: "Date", width: 150 },
    { field: "projectName", headerName: "Project Name", width: 200 },
    { field: "team", headerName: "Team", width: 200 },
    { field: "nameLength", headerName: "Id Count", width: 150 },
    { field: "managerTask", headerName: "Manager Name", width: 200 },
    { field: "totalHours", headerName: "Total Hours", width: 200 }, // Update the header to indicate it's for sessionOne
    { field: "idleNonBillableCount", headerName: "Idle Count", width: 200 }, // New header for count of "Idle -Non Billable" tasks
    { field: "idleNonBillableHours", headerName: "Idle Hours", width: 200 }, // New header for total hours of "Idle -Non Billable" tasks
    { field: "pendingCount", headerName: "Pending Count", width: 150 }, // New header for count of pending analysts
    { field: "approvedCount", headerName: "Approved Count", width: 150 }, // New header for count of approved analysts
    { field: "rejectedCount", headerName: "Rejected Count", width: 150 }, // New header for count of rejected analysts
  ];

  // Calculate date and project-wise data
  const dateProjectWiseData = calculateDateProjectWiseData();

  // Define csvReport data for CSVLink including sum values
  const sumIdCount = dateProjectWiseData.reduce(
    (acc, row) => acc + row.nameLength,
    0
  );

  // Function to convert hours and minutes to total minutes
  const getMinutesFromTimeString = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    return parseInt(hours) * 60 + parseInt(minutes);
  };

  const sumTotalMinutes = dateProjectWiseData.reduce(
    (acc, row) => acc + getMinutesFromTimeString(row.totalHours),
    0
  );
  const sumIdleNonBillableCount = dateProjectWiseData.reduce(
    (acc, row) => acc + row.idleNonBillableCount,
    0
  );
  const sumIdleNonBillableMinutes = dateProjectWiseData.reduce(
    (acc, row) => acc + getMinutesFromTimeString(row.idleNonBillableHours),
    0
  );

  // Function to convert total minutes back to hours and minutes format
  const getTimeStringFromMinutes = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}hr:${minutes.toString().padStart(2, "0")}min`;
  };

  // Convert summed total minutes back to hours and minutes format
  const sumTotalHours = getTimeStringFromMinutes(sumTotalMinutes);
  const sumIdleNonBillableHours = getTimeStringFromMinutes(
    sumIdleNonBillableMinutes
  );

  // Combine data with sum values
  const dataWithSum = [
    ...dateProjectWiseData.map((row) => ({
      Date: row.date,
      Project_Name: row.projectName,
      Team: row.team,
      Id_Count: row.nameLength,
      Manager_Name: row.managerTask,
      Total_Hours: row.totalHours,
      Idle_Non_Billable_Count: row.idleNonBillableCount,
      Idle_Non_Billable_Hours: row.idleNonBillableHours,
    })),
    {
      Date: "Sum",
      Project_Name: "",
      Team: "",
      Id_Count: sumIdCount,
      Manager_Name: "",
      Total_Hours: sumTotalHours,
      Idle_Non_Billable_Count: sumIdleNonBillableCount,
      Idle_Non_Billable_Hours: sumIdleNonBillableHours,
    },
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

      { label: "Idle Hours", key: "Idle_Non_Billable_Hours" },
    ],
    filename: "admin_report.csv",
  };

  const [rejectionReasons, setRejectionReasons] = useState([]);

  const handleReasonChange = (event) => {
    const { value } = event.target;
    if (value.includes("Other")) {
      setOpenRejectPopup(false);
      setRejectionReasons(value.filter((reason) => reason !== "Other"));
      setRejectionDescription(value.join(", "));
    } else {
      setRejectionReasons(value);
      setRejectionDescription(value.join(", "));
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar notificationCount={notificationCount} />
      <div>
        <Dialog
          open={openRejectPopup}
          onClose={handleCloseRejectPopup}
          maxWidth="sm"
          fullWidth
        >
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
            <MDButton
              onClick={submitRejection}
              variant="contained"
              color="success"
            >
              Submit
            </MDButton>
            <MDButton
              onClick={handleCloseRejectPopup}
              variant="outlined"
              color="primary"
            >
              Cancel
            </MDButton>
          </DialogActions>
        </Dialog>
      </div>

      {/* Popover to display pending report names */}

      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleSnackbarClose}
          >
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
                <strong style={{ fontSize: "18px" }}>Project Name:</strong>{" "}
                {selectedUserData.projectName}
              </Typography>
              <div
                style={{
                  maxHeight: "300px", // Set a fixed height for the scrollable area
                  overflow: "auto", // Enable scrolling
                  marginTop: "10px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "center" }}>
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
                </div>
                {/* <Typography style={{ fontSize: "1rem", marginTop: "10px", padding: "10px" }}>
                  <strong style={{ fontSize: "18px" }}>Rejection Description:</strong>
                  <table style={{ marginTop: "10px" }}>
                    <tbody>
                      <tr>
                        <td>{selectedUserData.rejectionDescription}</td>
                      </tr>
                    </tbody>
                  </table>
                </Typography> */}
                {selectedUserData !== null && (
                  <Typography
                    style={{
                      fontSize: "1rem",
                      marginTop: "10px",
                      padding: "10px",
                    }}
                  >
                    {selectedUserData.description && ( // Check if description exists
                      <strong style={{ fontSize: "18px" }}>
                        Rejection Description
                      </strong>
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
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginBottom: "10px",
              }}
            >
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
                <Box>
                  {activeTab === 0 && (
                    <div style={{ height: "670px" }}>
                      {" "}
                      {/* Set a fixed height */}
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
                                <FilterListIcon
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
                                </MDTypography>
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
                        // rows={row}
                        // columns={columns}
                        rows={row}
                        columns={filteredColumns}
                        pageSize={pageSize}
                        rowCount={report.length}
                        paginationMode="server"
                        onPageChange={(newPage) => setPage(newPage)}
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
                                <FilterListIcon
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
                                </MDTypography>
                              </div>

                              <GridToolbar />
                            </div>
                          ),
                          Footer: () => (
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                padding: "10px",
                              }}
                            >
                              {hasMore && (
                                <MDButton
                                  variant="contained"
                                  color="primary"
                                  size="small"
                                  onClick={allReport}
                                >
                                  Load More
                                </MDButton>
                              )}
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
