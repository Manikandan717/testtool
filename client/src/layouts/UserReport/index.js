import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import CardContent from "@mui/material/CardContent";
import * as React from "react";
import { DataGrid, GridToolbar, GridPagination } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import { useState, useMemo, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNav from "examples/Navbars/DashboardNav";
import { useSelector } from "react-redux";
import { useRef } from 'react';
import axios from "axios";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import moment from "moment";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Typography from "@mui/material/Typography";
import Drawer from "@mui/material/Drawer";
import CircularProgress from "@mui/material/CircularProgress";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import { ToastContainer, toast } from "react-toastify";
import InputLabel from "@mui/material/InputLabel";
import FilterListIcon from "@material-ui/icons/FilterList";
import DialogContent from "@mui/material/DialogContent";
import Paper from "@mui/material/Paper";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Popper from "@mui/material/Popper";
import EditIcon from "@mui/icons-material/Edit";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import { fontSize } from "@mui/system";
import { ms } from "date-fns/locale";

function Report({ notificationCount }) {
  const apiUrl = "https://9tnby7zrib.execute-api.us-east-1.amazonaws.com/test/Emp";
  // task page code start
  const [data, setData] = useState([]);
  const [disable, setDisable] = useState(true);
  const [teamlist, setTeamlist] = useState([]);
  const [taskList, setTaskList] = useState([]);
  const [selectedUserData, setSelectedUserData] = useState(null);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [projectNames, setProjectNames] = useState([]);
  const [managers, setManagers] = useState([]);
  const name = useSelector((state) => state.auth.user.name);
  const empid = useSelector((state) => state.auth.user.empId);
  const [teamleads, setTeamLeads] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeamLead, setSelectedTeamLead] = useState('');
  const initialvalues = {
    editMode: false,
    team: "",
    projectName: "",
    task: "",
    managerTask: "",
    teamLead: "",
    dateTask: "",
    description: "",
    sessionOne: "",
  };

  const [value, setValue] = useState(initialvalues);
  const handleTeamchange = (event, value) => setTeamlist(value);
  const handleTaskChange = (index, event, value) => {
    const newTasks = [...tasks];
    newTasks[index].task = value; // Assuming you want to update the 'task' property here

    // Update the state with the new tasks
    setTasks(newTasks);
  };
  useEffect(() => {
    const fetchTeamLeads = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/teamleads`);
        setTeamLeads(response.data.teamleads);
      } catch (error) {
        console.error('Error fetching team leads:', error);
      }
    };

    fetchTeamLeads();
  }, []);

  const handleSearchTermChange = (event, value) => {
    setSearchTerm(value);
  };

  const handleTeamLeadSelect = (event, value) => {
    setSelectedTeamLead(value);
  };


  const [loading, setLoading] = useState(false);

  const saveData = async (data) => {
    try {
      const response = await fetch(`${apiUrl}/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // You might need to include other headers like authorization if required
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        // Handle the error, for example:
        throw new Error(`Failed to save data. Server returned ${response.status}`);
      }

      // If the request was successful, you might return some response data
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      // Handle any other errors that might occur during the fetch
      throw new Error(`Error saving data: ${error.message}`);
    }
  };

  const [dataSubmitted, setDataSubmitted] = useState(false);
  const saveOperationRef = useRef(null);

  const handleSave = async () => {
    if (saveOperationRef.current || dataSubmitted) {
      // Save operation is already in progress or data has already been submitted, ignore the click
      return;
    }

    try {
      // Set the ref to the current promise to track the ongoing save operation
      saveOperationRef.current = saveData(); // Replace with your actual save function
      // Perform your save operation here
      await saveOperationRef.current;
      // Optionally, you can reset the form or perform any other actions after saving
      toast.success("Data saved successfully!");
      setDataSubmitted(true);
    } catch (error) {
      console.error('Error saving data:', error);
      // Handle the error if needed
      // toast.error('Error saving data. Please try again.');
    } finally {
      // Reset the ref once the operation is complete
      saveOperationRef.current = null;
    }
  };

  const handleInputchange = (e) => {
    const { name, value: inputValue } = e.target;

    setValue((prevValue) => ({
      ...prevValue,
      [name]: inputValue,
    }));
  };

  const [tasks, setTasks] = useState([
    {
      task: "",
      sessionOneHours: "",
      sessionOneMinutes: "",
    },
  ]);



  const handleEdit = (rowData) => {
    setEditMode(true); // Set edit mode to true
    setTasks(rowData.tasks || []);
    setRowData(rowData);

    // Set the value of the form fields based on the selected record
    setValue({
      name: rowData.name,
      empId: rowData.empId,
      team: rowData.team,
      teamLead: rowData.teamLead,
      projectName: rowData.projectName,
      managerTask: rowData.managerTask,
      dateTask: moment(rowData.dateTask).format("YYYY-MM-DD"),
      // Populate other fields as needed
    });

    // Set the selected team lead to the team lead of the selected record
    setSelectedTeamLead(rowData.teamLead);

    // Set the tasks data in the state
    setTasks(
      rowData.sessionOne.map((task) => ({
        task: task.task,
        sessionOneHours: task.sessionOne.split(":")[0],
        sessionOneMinutes: task.sessionOne.split(":")[1] || "",
      }))
    );

    // Open the drawer
    openDrawer();
  };




  const handleTaskInputChange = (index, event) => {
    const newTasks = [...tasks];
    newTasks[index][event.target.name] = event.target.value;
    setTasks(newTasks);
  };

  const handleAddTaskField = () => {
    setTasks([
      ...tasks,
      { task: "", sessionOneHours: "", sessionOneMinutes: "" },
    ]);
  };

  const handleRemoveTaskField = (index) => {
    const newTasks = [...tasks];
    newTasks.splice(index, 1);
    setTasks(newTasks);
  };

  const [drawerOpen, setDrawerOpen] = useState(false);

  // Function to handle opening the drawer
  const openDrawer = () => {
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);

    // Reset project name and managerTask when the drawer is closed
    setValue((prevValues) => ({
      ...prevValues,
      projectName: "",
      managerTask: "",
      sessionOne: "",
      teamLead: "",
      // sessionMinute: ''
    }));

    // Reset tasks to initial state when the drawer is closed without saving
    setTasks([
      {
        task: "",
        sessionOneHours: "",
        sessionOneMinutes: "",
      },
    ]);

    // Reset selectedTeamLead state
    setSelectedTeamLead(null); // or setSelectedTeamLead("")
  };

  const [filterDialogOpen, setFilterDialogOpen] = useState(false);

  // Function to handle opening the filter popup
  const openFilterDialog = () => {
    setFilterDialogOpen(true);
  };

  // Function to handle closing the filter popup
  const closeFilterDialog = () => {
    setFilterDialogOpen(false);
  };
  const handleCancel = () => {
    // Reset all fields to their initial values
    setValues(initialValues);
    setTeamList(null);

    // Close the filter popup
    closeFilterDialog();
  };

  // Define getCurrentDate function
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();

    month = month < 10 ? `0${month}` : month;
    day = day < 10 ? `0${day}` : day;

    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    axios.get(`${apiUrl}/admin`).then((response) => {
      const projects = response.data.map((item) => item.projectname);
      const managers = response.data
        .map((item) => item.jobs?.managerTeam)
        .filter(Boolean);
      axios.get(`${apiUrl}/fetch/task-data`).then((response) => {
        setTaskList(response.data);
      });
      setProjectNames(projects);
      setManagers(managers);

      // Find the selected project in the response data
      const selectedProject = response.data.find(
        (item) => item.projectname === value.projectName
      );

      if (selectedProject) {
        const projectManager = selectedProject.jobs?.managerTeam;
        const projectTeam = selectedProject.team; // Assuming the team information is available in the API response

        setValue((prevValues) => ({
          ...prevValues,
          managerTask: projectManager || "",
          team: projectTeam || "", // Set the team based on the selected project
        }));

        if (!editMode) {
          const currentDate = getCurrentDate();
          setValue((prevValues) => ({
            ...prevValues,
            dateTask: currentDate,
          }));
        }
      } else {
        // Reset date, manager, and team when another project name is selected
        setValue((prevValues) => ({
          ...prevValues,
          dateTask: "",
          managerTask: "",
          team: "", // Reset team value
          teamLead: "",
        }));
      }
    });
  }, [value.projectName, editMode]);

  const fetchUpdatedData = () => {
    axios.get(`${apiUrl}/fetch/userdata/?empId=${empId}`)
      .then((response) => {
        setInitialData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching updated data:", error);
        // Handle error if needed
      });
  };
  // Upload Data
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    // Get the selected team lead
    const selectedTeamlead = selectedTeamLead || teamleads[0]; // Default to the first team lead if none selected

    const userData = {
      name,
      empId,
      team: value.team,
      projectName: value.projectName,
      managerTask: value.managerTask,
      dateTask: value.dateTask,
      sessionOne: tasks.map((task) => ({
        task: task.task,
        sessionOne: `${task.sessionOneHours}:${task.sessionOneMinutes || "00"}`,
      })),
      idleTasks: countIdleTasks(),
      productionTasks: countProductionTasks(),
      teamLead: selectedTeamlead, // Correct field name
      description: value.description
    };


    try {
      if (editMode) {
        await axios.put(`${apiUrl}/update/analyst/${rowData._id}`, userData);
        toast.success("Data Updated Successfully 👌");
        fetchUpdatedData();
        closeDrawer();
        fetchData();
        setEditMode(false);
      } else {
        await axios.post(`${apiUrl}/add`, userData);
        toast.success("Data Submitted Successfully 👌");
        fetchUpdatedData();
        closeDrawer();
        fetchData();
      }

      setTasks([
        {
          task: "",
          sessionOneHours: "",
          sessionOneMinutes: "",
        },
      ]);
      setValue((prevValues) => ({
        ...prevValues,
        dateTask: "",
        team: "",
        projectName: "",
        managerTask: "",
        teamLead: "",
      }));
    } catch (err) {
      console.error("Error updating/submitting data:", err);
      toast.error(`Error updating/submitting data. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };





  const [rowData, setRowData] = useState(null);

  const openDrawerForEdit = (rowData) => {
    setRowData(rowData);
    setEditMode(true);
    // Additional code to open the drawer
  };

  useEffect(() => { }, [tasks, selectedUserData]);

  const listtask = ["CV", "NLP", "CM"];

  const tasklist = [
    "Initial Annotation-Billable",
    "QC Annotation-Billable",
    "Project Training-Billable",
    "Spot QC-Non Billable",
    "Other-Interval Tracking -Billable",

    "Guidelines",
    "POC",
  ];

  // task page code end

  // const { columns, rows } = authorsTableData();
  const initialValues = {
    startDate: "",
    endDate: "",
    empname: "",
    team: "",
  };
  const [values, setValues] = useState(initialValues);
  const [report, setReport] = useState([]);
  const [teamList, setTeamList] = useState(null);
  const [reversedRows, setReversedRows] = useState([]);
  const empId = useSelector((state) => state.auth.user.empId);
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setValues({
      ...values,
      [name]: value,
    });
  };
  const handleTeamChange = (event, value) => setTeamList(value);
  const [show, setShow] = useState(false);

  const [initialData, setInitialData] = useState([]);

  // Fetch initial data without filter
  // Fetch initial data
  useEffect(() => {
    axios.get(`${apiUrl}/fetch/userdata/?empId=${empId}`).then((response) => {
      setInitialData(response.data);
    });
  }, [empId]);

  const openDialog = (userData) => {
    setSelectedUserData(userData);
    setDialogOpen(true);
  };


  const countIdleTasks = () => {
    const uniqueIdleTasks = new Set();

    tasks.forEach((task) => {
      if (task.task.startsWith("Idle")) {
        uniqueIdleTasks.add("Idle");
      }
    });

    return uniqueIdleTasks.size;
  };

  const countProductionTasks = () => {
    const uniqueProductionTasks = new Set();

    tasks.forEach((task) => {
      if (!task.task.startsWith("Idle")) {
        uniqueProductionTasks.add("Production");
      }
    });

    return uniqueProductionTasks.size;
  };
  // Function to handle closing the dialog
  const closeDialog = () => {
    setSelectedUserData(null);
    setDialogOpen(false);
  };
  // Fetch data when a new task is submitted
  const fetchData = () => {
    if (!values.startDate || !values.endDate) {
      console.log(); // Empty console.log()
      return;
    }

    axios
      .get(
        `${apiUrl}/fetch/user-data/?sDate=${values.startDate}&eDate=${values.endDate}&empId=${empId}&team=${teamList}`
      )
      .then((res) => {
        setReport(res.data);
      })
      .catch((err) => console.log(`Error: ${err.message}`));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const userData = {
      startDate: values.startDate,
      endDate: values.endDate,
      team: teamList,
    };
    // console.log(userData);
    fetchData();
    axios
      .get(
        `${apiUrl}/fetch/user-data/?sDate=${values.startDate}&eDate=${values.endDate}&empId=${empId}&team=${teamList}`
      )
      .then((res) => {
        setReport(res.data);
      })
      .catch((err) => console.log(`Error:${err}`));

    setValues(initialValues);
    setTeamList(null);

    closeFilterDialog();
  };

  // tabel report

  const initialDataColumns = [
    {
      field: "dateTask",
      headerName: "Date",
      width: 130,
      editable: false,
      flex: 1,
      valueFormatter: (params) => {
        return moment(params.value).format("DD-MM-YYYY");
      },
    },
    {
      field: "name",
      headerName: "Name",
      width: 50,
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
      field: "team",
      headerName: "Team",
      width: 50,
      editable: false,
      flex: 1,
    },
    {
      field: "taskCount",
      headerName: "Task Count",
      width: 120,
      editable: false,
      renderCell: (params) => (
        <Typography sx={{ fontSize: 15 }}>
          {params.row.sessionOne.length}
        </Typography>
      ),
      align: "center",
    },
    {
      field: "teamLead",
      headerName: "Team Lead",
      width: 150,
      editable: false,
      flex: 1,
    },
    {
      field: "managerTask",
      headerName: "Project Manager",
      width: 150,
      editable: false,
      flex: 1,
    },
    // {
    //   field: "approvalStatus",
    //   headerName: "Status",
    //   width: 150,
    //   editable: false,
    //   flex: 1,
    //   renderCell: (params) => (
    //     <div style={{ color: params.value.toLowerCase() === "approved" ? "green" : params.value.toLowerCase() === "rejected" ? "red" : params.value.toLowerCase() === "pending" ? "orange" : "inherit" }}>
    //       {params.value.charAt(0).toUpperCase() + params.value.slice(1)}
    //     </div>
    //   ),
    // },
    {
      field: "approvalStatus",
      headerName: "Status",
      width: 150,
      editable: false,
      flex: 1,
      renderCell: (params) => {
        // Convert dateTask to a Date object
        const dateTask = new Date(params.row.dateTask);
        // Get the month, day, and year of the dateTask
        const taskMonth = dateTask.getMonth() + 1;
        const taskDay = dateTask.getDate();
        const taskYear = dateTask.getFullYear();
        // Compare the dateTask to "12/04/2024"
        const isBeforeOrEqualToDate = taskYear < 2024 || (taskYear === 2024 && (taskMonth < 4 || (taskMonth === 4 && taskDay <= 12)));
        // If it's before or equal to the specific date, apply existing rendering logic for approval status
        if (isBeforeOrEqualToDate) {
          return (
            <Typography style={{ color: 'green', fontSize: 15 }}>
              Approved
            </Typography>
          );
        } else {
          // If it's after the specific date, return 'Approved'
    
          return (
            <div style={{ color: params.value.toLowerCase() === "approved" ? "green" : params.value.toLowerCase() === "rejected" ? "red" : params.value.toLowerCase() === "pending" ? "orange" : "inherit" }}>
              {params.value.charAt(0).toUpperCase() + params.value.slice(1)}
            </div>
          );
        }
      },
    },
    
    
    
    


    {
      field: "totalHours",
      headerName: "Total Hours",
      width: 140,
      editable: false,
      renderCell: (params) => (
        <Typography sx={{ fontSize: 15 }}>
          {calculateTotalHours(params.row.sessionOne)}
        </Typography>
      ),
      align: "center",
    },

    {
      field: "view",
      headerName: "View",
      sortable: false,
      filterable: false,
      width: 100,
      renderCell: (params) => (
        <IconButton
          style={{ color: "#2196f3" }}
          onClick={() => openDialog(params.row)}
        >
          <VisibilityIcon />
        </IconButton>
      ),
    },
    {
      field: "edit",
      headerName: "Edit",
      sortable: false,
      filterable: false,
      width: 100,
      renderCell: (params) => (
        params.row.approvalStatus !== "approved" && (
          <IconButton
            style={{ color: "#4caf50" }}
            onClick={() => handleEdit(params.row)}
          >
            <EditIcon />
          </IconButton>
        )
      ),
    },
  ];

  const columns = [
    { field: "id", headerName: "ID", width: 50 },
    ...initialDataColumns,
  ];

  useEffect(() => {

    setLoading(true);

    setTimeout(() => {
      const reversedRowsData =
        report.length === 0
          ? initialData
            .slice()
            .reverse()
            .map((item, index) => ({
              ...item,
              id: index + 1,
              name: item.name,
              team: item.team,
              date: moment(item.createdAt).format("DD-MM-YYYY"),
              projectName: item.projectName,
              task: item.task,
              teamLead: item.teamLead,
              managerTask: item.managerTask,
              sessionOne: item.sessionOne,
              // sessionMinute: item.sessionMinute,
            }))
          : report.slice().reverse() || [];

      setReversedRows(reversedRowsData);
      setLoading(false);
    }, 1000);
  }, [report, initialData]);
  // Team List
  const list = ["CV", "NLP", "CM", "SOURCING"];

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

    const formattedTotalHours = `${hours}hr:${remainingMinutes.toString().padStart(2, '0')}min`;

    return formattedTotalHours;
  };

  return (
    <DashboardLayout>
      <DashboardNav notificationCount={notificationCount} />

      <div
        style={{
          display: "flex",
          justifyContent: "end",
        }}
      >
        <MDButton
          variant="gradient"
          color="success"
          startIcon={<AddCircleOutlineIcon />}
          onClick={openDrawer}
          style={{
            display: "flex",
            justifyContent: "center",
            // padding: "6px 12px", // Adjusted padding
            fontSize: "0.7rem", // Adjusted font size
            borderRadius: "10px",
            textAlign: "center",
            minHeight: "10px", // Adjust the height as needed
            minWidth: "120px",
            padding: "10px", // Adjust the width as needed
          }}
        >
          Create Task
        </MDButton>
      </div>

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
          <Button
            onClick={closeDialog}
            color="primary"
            style={{
              color: "red",
              display: "flex",
              justifyContent: "center",
              fontSize: "0.7rem",
              borderRadius: "10px",
              textAlign: "center",
              minHeight: "10px",
              minWidth: "80px",
              border: "1px solid red",
              padding: "7px",
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Drawer
        anchor="right"
        PaperProps={{
          style: {
            width: 712,
            backgroundColor: "#fff",
            color: "rgba(0, 0, 0, 0.87)",
            boxShadow:
              "0px 8px 10px -5px rgba(0,0,0,0.2), 0px 16px 24px 2px rgba(0,0,0,0.14), 0px 6px 30px 5px rgba(0,0,0,0.12)",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            height: "100%",
            flex: "1 0 auto",
            zIndex: 1200,
            WebkitOverflowScrolling: "touch",
            position: "fixed",
            top: 0,
            outline: 0,
            margin: "0",
            border: "none",
            borderRadius: "0",
            padding: "23px",
          },
        }}
        open={drawerOpen}
        onClose={closeDrawer}
      >
        <MDBox
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2, // Adjusted margin-bottom
          }}
        >
          <Typography variant="h6">
            {editMode ? "Edit Task" : "New Task"}
          </Typography>
          <IconButton
            sx={{ position: "absolute", top: 10, right: 0 }} // Positioned to the top right corner
            onClick={closeDrawer}
          >
            <CloseIcon />
          </IconButton>
        </MDBox>

        {loading && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              background: "rgba(255, 255, 255, 0.8)",
              zIndex: 1300,
            }}
          >
            <CircularProgress color="primary" />
          </div>
        )}

        <MDBox pb={5} component="form" role="form" onSubmit={submit}>
          <MDBox sx={{ width: 250, p: 2 }}>
            <InputLabel htmlFor="project-name">Project Name</InputLabel>
            <Autocomplete
              sx={{ width: 626, mt: 1 }}
              id="project-name"
              options={projectNames}
              value={value.projectName}
              aria-required
              onChange={(event, newValue) => {
                setValue({
                  ...value,
                  projectName: newValue,
                });
              }}
              clearIcon={null}
              renderInput={(params) => (
                <TextField
                  {...params}
                  required
                  placeholder="Select a Project"
                  InputProps={{
                    ...params.InputProps,
                    disableUnderline: true,
                    sx: {
                      "&.MuiOutlinedInput-root": {
                        padding: "4px",
                      },
                    },
                  }}
                />
              )}
            />
          </MDBox>
          {/* <MDBox sx={{ width: 250, p: 2 }}>
            <InputLabel htmlFor="department">Department</InputLabel>
            <Autocomplete
              sx={{ width: 626, mt: 1 }}
              disablePortal
              id="combo-box-demo"
              options={list}
              aria-required
              value={
                value.projectName === "Not assigned-CV"
                  ? "CV"
                  : value.projectName === "Not assigned-NLP"
                  ? "NLP"
                  : value.team
              }
              onChange={(event, newValue) => {
                setValue({
                  ...value,
                  team: newValue,
                });
              }}
              disabled
              renderInput={(params) => (
                <TextField
                  {...params}
                  required
                  placeholder="Select a Department"
                  InputProps={{
                    ...params.InputProps,
                    disableUnderline: true,
                    sx: {
                      "&.MuiOutlinedInput-root": {
                        padding: "4px",
                      },
                    },
                  }}
                />
              )}
            />
          </MDBox>
          <MDBox sx={{ width: 250, p: 2 }}>
            <InputLabel htmlFor="team lead">Team Lead</InputLabel>
            <Autocomplete
              sx={{ width: 626, mt: 1 }}
              options={teamleads}
              value={selectedTeamLead}
              onChange={handleTeamLeadSelect}
              inputValue={searchTerm}
              onInputChange={handleSearchTermChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  // label="Search team leads"
                  placeholder="Select a Team Lead"
                  variant="outlined"
                  sx={{
                    "&.MuiOutlinedInput-root": {
                      padding: "4px",
                    },
                    "& input": {
                      height: "10px", // Adjust height as needed
                    },
                  }}
                />
              )}
            />
          </MDBox> */}
          <MDBox sx={{ display: "flex", flexDirection: "row", p: 2 }}>
            <div style={{ marginRight: "71px" }}>
              <InputLabel htmlFor="department">Department</InputLabel>
              <Autocomplete
                sx={{ width: 250, mt: 1 }}
                disablePortal
                id="combo-box-demo"
                options={list}
                aria-required
                value={
                  value.projectName === "Not assigned-CV"
                    ? "CV"
                    : value.projectName === "Not assigned-NLP"
                      ? "NLP"
                      : value.team
                }
                onChange={(event, newValue) => {
                  setValue({
                    ...value,
                    team: newValue,
                  });
                }}
                disabled
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    placeholder="Select a Department"
                    InputProps={{
                      ...params.InputProps,
                      disableUnderline: true,
                      sx: {
                        width: 305,
                        "&.MuiOutlinedInput-root": {
                          padding: "4px",
                        },
                      },
                    }}
                  />
                )}
              />
            </div>
            <div sx={{ mt: 5 }}>
              <InputLabel htmlFor="manager" sx={{ mb: 1 }}>Manager</InputLabel>
              <Autocomplete
                fullWidth
                id="manager"
                options={managers}
                value={value.managerTask}
                onChange={(event, newValue) => {
                  setValue({
                    ...value,
                    managerTask: newValue,
                  });
                }}
                sx={{ width: 305 }}
                disabled
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Select a Manager"
                    InputProps={{
                      ...params.InputProps,
                      disableUnderline: true,
                      sx: {
                        "&.MuiOutlinedInput-root": {
                          padding: "3.9px",
                        },
                      },
                    }}
                  />
                )}
              />
            </div>
          </MDBox>
          <MDBox
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              mt: 1,
            }}
          >
            <InputLabel sx={{ mt: 1, ml: 2 }} htmlFor="Team Lead">
              Team Lead
            </InputLabel>
            <InputLabel sx={{ mt: 1, mr: 37 }} htmlFor="date">
              Date
            </InputLabel>
          </MDBox>
          <MDBox
            sx={{ p: 1, ml: 1 }}
            style={{
              display: "flex",
            }}
          >
  <Autocomplete
  fullWidth
  options={['None', ...teamleads]} // Add 'None' as the first option
  value={selectedTeamLead}
  onChange={handleTeamLeadSelect}
  inputValue={searchTerm}
  onInputChange={handleSearchTermChange}
  sx={{ width: 305 }}
  renderInput={(params) => (
    <TextField
      {...params}
      placeholder="Select a Team Lead"
      variant="outlined"
      required
      sx={{
        width: 305,
        "&.MuiOutlinedInput-root": {
          padding: "4px",
        },
        "& input": {
          height: "10px", // Adjust height as needed
        },
      }}
    />
  )}
/>


            <TextField
              sx={{
                width: 305,
                ml: 2,
                "& .MuiOutlinedInput-root": {
                  padding: "0px",
                },
              }}
              style={{ display: "flex" }}
              id="date"
              variant="outlined"
              fullWidth
              type="date"
              name="dateTask"
              value={value.dateTask}
              onChange={handleInputchange}
            />
          </MDBox>

          <MDBox
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              mt: 1,
            }}
          >
            <InputLabel sx={{ mt: 1, ml: 2, width: "46%" }} htmlFor="task">
              Task
            </InputLabel>
            <InputLabel sx={{ mt: 1, ml: 2, width: "21%" }} htmlFor="hours">
              Hours
            </InputLabel>
            <InputLabel sx={{ mt: 1, ml: 2, width: "25%" }} htmlFor="minute">
              Minutes
            </InputLabel>
          </MDBox>
          {tasks.map((task, index) => (
            <MDBox
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
              }}
              key={index}
            >
              <Autocomplete
                disablePortal
                aria-required
                required
                id={`task_${index}`} // Unique ID for each Autocomplete
                name={`createTask_${index}`} // Unique name for each Autocomplete
                options={taskList.map((task) => task.createTask)} // Pass taskList directly
                value={task.task} // Set the value of Autocomplete
                onChange={(event, value) =>
                  handleTaskChange(index, event, value)
                }
                sx={{ width: "46%", mt: 1 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Select a Task"
                    InputProps={{
                      ...params.InputProps,
                      disableUnderline: true,
                      sx: {
                        "&.MuiOutlinedInput-root": {
                          padding: "4.9px",
                        },
                      },
                    }}
                  />
                )}
              />

              <FormControl sx={{ minWidth: 120, width: "24%", ml: 1 }}>
                <TextField
                  id="sessionOneHours"
                  name="sessionOneHours"
                  sx={{
                    width: "100%",
                    p: 1,
                    "& .MuiOutlinedInput-root": {
                      padding: "0px",
                    },
                  }}
                  aria-required
                  required
                  value={task.sessionOneHours}
                  onChange={(e) => handleTaskInputChange(index, e, setTasks)} // Pass setTasks to handleTaskInputChange
                  variant="outlined"
                  select
                  SelectProps={{
                    native: true,
                    IconComponent: () => <></>,
                  }}
                >
                  <option value="" disabled>
                    Hours
                  </option>
                  {[...Array(13).keys()].slice(0, 13).map((hour) => (
                    <option key={hour} value={hour}>
                      {hour}
                    </option>
                  ))}
                </TextField>
              </FormControl>

              <FormControl sx={{ minWidth: 120, width: "24%" }}>
                <TextField
                  id="sessionOneMinutes"
                  name="sessionOneMinutes"
                  sx={{
                    width: "100%",
                    p: 1,
                    "& .MuiOutlinedInput-root": {
                      padding: "0px",
                    },
                  }}
                  required
                  value={task.sessionOneMinutes}
                  onChange={(e) => handleTaskInputChange(index, e, setTasks)} // Pass setTasks to handleTaskInputChange
                  variant="outlined"
                  aria-required
                  select
                  SelectProps={{
                    native: true,
                    IconComponent: () => <></>,
                  }}
                >
                  <option value="" disabled>
                    Minutes
                  </option>
                  <option value="00">00</option>
                  <option value="15">15</option>
                  <option value="30">30</option>
                  <option value="45">45</option>
                </TextField>
              </FormControl>

              {index > 0 && (
                <div style={{ position: "relative" }}>
                  <IconButton
                    onClick={() => handleRemoveTaskField(index)}
                    sx={{
                      position: "absolute",
                      top: 13,
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                  {/* Rest of the content for this row */}
                </div>
              )}
      
            </MDBox>
          ))}
        {value.projectName === "LIME_QC" && ( // Conditionally render based on selected project name
                <MDBox sx={{ width: 626, mt: 1,mb: 2, ml: 2 }}>
                  <InputLabel sx={{  mb: 1}} htmlFor="description">Description</InputLabel>
                  <TextField
                    id="description"
                    name="description"
                    placeholder="Enter description"
                    multiline
                    rows={4}
                    value={value.description}
                    onChange={handleInputchange}
                    variant="outlined"
                    fullWidth
                  />
                </MDBox>
              )}
          <MDButton
            onClick={handleAddTaskField}
            color="success"
            variant="outlined"
            startIcon={<AddCircleOutlineIcon />}
            sx={{
              width: "fit-content",
              display: "flex",
              alignItems: "center",
              padding: "1px 7px", // Adjust top and bottom padding
              marginLeft: "15px",
              marginTop: "5px",
              minHeight: "30px", // Adjust the height as needed
            }}
          >
            Add Task
          </MDButton>

          <MDBox
            pt={3}
            px={2}
            display="flex"
            // justifyContent="end"
            alignItems="center"
          >
            <MDButton
              type="submit"
              color="success"
              onClick={handleSave}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Loading..." : editMode ? "Update" : "Save"}
            </MDButton>
          </MDBox>
        </MDBox>
      </Drawer>

      <Grid item xs={12} mb={5}>
        {/* <Card> */}
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
                  top: "131px",
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
                              value={teamlist}
                              onChange={(event, value) =>
                                handleTeamchange(event, value)
                              }
                              id="movie-customized-option-demo"
                              disableCloseOnSelect
                              sx={{ width: "100%" }}
                              PopperComponent={(props) => (
                                <Popper
                                  {...props}
                                  style={{
                                    zIndex: 99999,
                                    position: "relative",
                                  }}
                                >
                                  {props.children}
                                </Popper>
                              )}
                              // isOptionEqualToValue={(option, value) =>
                              //   option === value
                              // }
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
        {/* </Card> */}
        {/* {show ? ( */}
        <MDBox pt={4}>
          <Grid item xs={12}>
            <Card>
              <MDBox pt={0}>
                {/* <Box sx={{ height: 500, width: "100%", display: "flex", borderRadius: 20 }}> */}
                <div>
                  {loading ? (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100vh",
                      }}
                    >
                      <CircularProgress style={{ color: "#3b95ee" }} />
                    </div>
                  ) : (
                    <div>
                      <Box
                        sx={{
                          height: 480,
                          width: "100%",
                          "@media screen and (min-width: 768px)": {
                            height: 670,
                          },
                        }}
                      >
                        <DataGrid
                          rows={reversedRows}
                          columns={
                            report.length === 0 ? initialDataColumns : columns
                          } // Use initialDataColumns when report is empty
                          pageSize={10}
                          rowsPerPageOptions={[10]}
                          checkboxSelection
                          getRowId={(row) => row._id}
                          disableSelectionOnClick
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
                                <div
                                  style={{
                                    display: "flex",
                                    marginLeft: "auto",
                                    alignItems: "center",
                                  }}
                                >
                                  {/* <MDButton
                    className="team-report-btn"
                    variant="outlined"
                    color="error"
                    size="small"
                    style={{ marginRight: "13px" }}
                    onClick={allReport}
                  >
                    &nbsp;All Report
                  </MDButton> */}
                                </div>
                              </div>
                            ),
                          }}
                        />
                      </Box>
                    </div>
                  )}
                </div>
              </MDBox>
            </Card>
          </Grid>
        </MDBox>
        {/* ) : null} */}
      </Grid>
      {/* <Footer /> */}
      <ToastContainer />
    </DashboardLayout>
  );
}

export default Report;
