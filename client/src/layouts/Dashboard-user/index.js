import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import {
  Grid,
  Card,
  CardActionArea,
  CardContent,
  IconButton,
  Button,
  CardActions,
  Paper,
  CardHeader,
  Box,
  Typography,
  
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import TaskOutlinedIcon from '@mui/icons-material/TaskOutlined';
import { Doughnut } from 'react-chartjs-2';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import MDBox from 'components/MDBox';
import { Pie } from 'react-chartjs-2';
import MDTypography from 'components/MDTypography';
import Icon from '@mui/material/Icon';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import axios from 'axios'; // Import axios for making HTTP requests

const UserDashboard = () => {
  const apiUrl = "https://9tnby7zrib.execute-api.us-east-1.amazonaws.com/test/Emp";
  const name = useSelector((state) => state.auth.user.name);
  const empId = useSelector((state) => state.auth.user.empId);
  const [mode, setMode] = useState("");
  const [isCheckinButtonDisabled, setCheckinButtonDisabled] = useState(false);
  const [isCheckoutButtonDisabled, setCheckoutButtonDisabled] = useState(false);
  const [latestAttendance, setLatestAttendance] = useState(null);
  const [projectCounts, setProjectCounts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [taskCount, setTaskCount] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [totalSessionHours, setTotalSessionHours] = useState(null);
  const [data, setData] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [modeResponse, attendanceResponse] = await Promise.all([
          fetch(`${apiUrl}/att/mode?empId=${empId}`),
          fetch(`${apiUrl}/fetch/att-data/dashboard?empId=${empId}`)
        ]);

        const [modeData, attendanceData] = await Promise.all([
          modeResponse.json(),
          attendanceResponse.json()
        ]);

        setMode(modeData.mode);
        setLatestAttendance(attendanceData.latestAttendance);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    fetchInitialData();
  }, [empId]);

  // useEffect(() => {
  //   const fetchTotalSessionHours = async () => {
  //     try {
  //       const response = await axios.get(`http://localhost:5000/total-session-hours/${empId}`);
  //       const data = response.data;

  //       // Update state with the total sessionOne hours
  //       setTotalSessionHours(data.totalHours);
  //     } catch (error) {
  //       console.error('Error fetching total sessionOne hours:', error);
  //     }
  //   };

  //   fetchTotalSessionHours();
  // }, [empId]);

  // task count get api endpoint
  useEffect(() => {
    const fetchTaskData = async () => {
      try {
        const [taskCountResponse, tasksResponse] = await Promise.all([
          axios.get(`${apiUrl}/task-count/${empId}?startDate=${startDate}&endDate=${endDate}`),
          axios.get(`${apiUrl}/tasks/${empId}?startDate=${startDate}&endDate=${endDate}`),
        ]);

        setTaskCount(taskCountResponse.data.count);
        setTasks(tasksResponse.data.tasks);

        console.log("Task Count:", taskCountResponse.data.count);
        console.log("Tasks:", tasksResponse.data.tasks);
      } catch (error) {
        console.error('Error fetching task data:', error);
      }
    };

    fetchTaskData();
  }, [empId, startDate, endDate]);

  useEffect(() => {
    

  
    // Fetch project counts from the backend API with start date and end date
    const fetchProjectCounts = async () => {
      try {
        const response = await fetch(`${apiUrl}/project-counts/analyst?empId=${empId}&startDate=${startDate}&endDate=${endDate}`);
        if (!response.ok) {
          throw new Error('Failed to fetch project counts');
        }
        const data = await response.json();
        setProjectCounts(data);
      } catch (error) {
        console.error('Error fetching project counts:', error);
      }
    };
  
    fetchProjectCounts();
  }, [apiUrl, empId, startDate, endDate]);
  


  useEffect(() => {
    // Calculate total count when projectCounts change
    let count = 0;
    projectCounts.forEach((emp) => {
      emp.projects.forEach((project) => {
        count += project.count;
      });
    });
    setTotalCount(count);
  }, [projectCounts]);

  const handleCheckin = async () => {
    try {
      setCheckinButtonDisabled(true);
      const timeNow = moment().format("hh:mm a");
      const response = await fetch(`${apiUrl}/att/checkin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          empId,
          checkInTime: timeNow,
        }),
      });

      if (response.ok) {
        console.log("Check-in time saved successfully");
        await fetchLatestAttendance();
        // Update mode to "checkout" after successful check-in
        setMode("checkout");
      } else {
        console.error("Failed to save check-in time");
      }
    } catch (error) {
      console.error("Error checking in:", error);
    } finally {
      setCheckinButtonDisabled(false);
    }
  };


  const handleCheckout = async () => {
    try {
      setCheckinButtonDisabled(true);
      const checkTime = moment().format("hh:mm a");
      const response = await fetch(`${apiUrl}/att/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          empId,
          checkOutTime: checkTime,
        }),
      });

      if (response.ok) {
        console.log("Check-out time saved successfully");
        await fetchLatestAttendance();
      } else {
        console.error("Failed to save check-out time");
      }
    } catch (error) {
      console.error("Error checking out:", error);
    } finally {
      setCheckinButtonDisabled(false);
    }
  };

  const fetchLatestAttendance = async () => {
    try {
      const response = await fetch(`${apiUrl}/fetch/att-data/dashboard?empId=${empId}`);

      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`);
      }

      const data = await response.json();
      setLatestAttendance(data.latestAttendance);
    } catch (error) {
      console.error("Error fetching latest attendance:", error);
    }
  };

  const handleToggleButtonClick = async () => {
    try {
      if (mode === "checkin") {
        await handleCheckin();
      } else {
        await handleCheckout();
        const modeResponse = await fetch(`${apiUrl}/att/mode?empId=${empId}`);
        const modeData = await modeResponse.json();
        setMode(modeData.mode);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const date = new Date();
  const hours = date.getHours();
  const today = moment();

  let greet;
  const styles = {
    fontSize: 35,
  };

  if (hours < 12) {
    greet = 'morning';
    styles.color = '#D90000';
  } else if (hours >= 12 && hours < 17) {
    greet = 'afternoon';
    styles.color = '#04733F';
  } else if (hours >= 17 && hours < 20) {
    greet = 'evening';
    styles.color = '#04756F';
  } else {
    greet = 'night';
    styles.color = '#04756F';
  }

  useEffect(() => {
    // Set start date to yesterday's date
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    setStartDate(yesterday.toISOString().slice(0, 10));

    // Set end date to today
    const today = new Date();
    setEndDate(yesterday.toISOString().slice(0, 10));
  }, []);
  const fetchSessionOneData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/total-session-hours/${empId}`, {
        params: {
          startDate: startDate,
          endDate: endDate
        }
      });
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchSessionOneData();
  }, [empId, startDate, endDate]);

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const [selectedMonth, setSelectedMonth] = useState(moment().format('YYYY-MM'));
  const [totalSessionOne, setTotalSessionOne] = useState("0:00");
  const [totalSessionDate, setTotalSessionDate] = useState("0:00");
  const [weeklySessionOne, setWeeklySessionOne] = useState({});
  const [currentDateSessionOne, setCurrentDateSessionOne] = useState("0:00");

  useEffect(() => {
    const fetchSessionOneData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/sessionOneSum/${empId}/${selectedMonth}`);
        setTotalSessionOne(response.data.totalHours);
      } catch (error) {
        console.error('Error fetching sessionOne data:', error);
      }
    };

    fetchSessionOneData();
  }, [selectedMonth]);

  useEffect(() => {
    const fetchWeeklySessionOne = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/weeklySessionOne/${empId}/${selectedMonth}`);
        setWeeklySessionOne(response.data);
      } catch (error) {
        console.error('Error fetching weekly sessionOne data:', error);
      }
    };

    fetchWeeklySessionOne();
  }, [selectedMonth]);

  const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));


  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  useEffect(() => {
    const fetchSessionOneData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/sessionOneDate/${empId}/${selectedDate}`);
        setTotalSessionDate(response.data.totalHours);
      } catch (error) {
        console.error('Error fetching sessionOne data:', error);
      }
    };

    fetchSessionOneData();
  }, [selectedDate]);

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };


  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div>
      <h2>Total Session One Hours and Minutes</h2>
      <div>
        <label htmlFor="selectedMonth">Select Month:</label>
        <input type="month" id="selectedMonth" value={selectedMonth} onChange={handleMonthChange} />
      </div>
      <div>
        <p>Total Session One for {selectedMonth}: {totalSessionOne}</p>
      </div>
      <div>
        <h3>Weekly Session One</h3>
        <ul>
          {Object.keys(weeklySessionOne).map((week) => (
            <li key={week}>Week {week}: {weeklySessionOne[week]}</li>
          ))}
        </ul>
      </div>
      <div>
        <p>Session One for current date: {currentDateSessionOne}</p>
      </div>
      <div>
      <h2>Total Session One Hours and Minutes for Selected Date</h2>
      <div>
        <label htmlFor="selectedDate">Select Date:</label>
        <input type="date" id="selectedDate" value={selectedDate} onChange={handleDateChange} />
      </div>
      <div>
        <p>Total Session One for {selectedDate}: {totalSessionDate}</p>
      </div>
    </div>
    </div>
      <div>
      <h2>Total Session One Hours by Task</h2>
      <div>
        <label htmlFor="startDate">Start Date:</label>
        <input type="date" id="startDate" value={startDate} onChange={handleStartDateChange} />
      </div>
      <div>
        <label htmlFor="endDate">End Date:</label>
        <input type="date" id="endDate" value={endDate} onChange={handleEndDateChange} />
      </div>
      {data ? (
        <Doughnut
          data={{
            labels: data.labels,
            datasets: [{
              data: data.data,
              backgroundColor: [
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(75, 192, 192, 0.6)',
                'rgba(153, 102, 255, 0.6)',
                'rgba(255, 159, 64, 0.6)',
              ],
            }],
          }}
        />
      ) : (
        <p>Loading...</p>
      )}
    </div>
      <Box>
        <Grid container spacing={2}>
          <Grid item xs={12} md={5}>
            <Grid
              item
              sx={{
                display: "flex",
                alignItems: "center",
                minHeight: "0px",
                flexDirection: "row",
                // marginTop: "1px",
                gap: "10px",
              }}
            >


              <Card sx={{ width: "950px !important", height: "100%" }}>
                <MDBox
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <MDTypography
                    variant="h6"
                    fontWeight="bold"
                    color="info"
                    textTransform="capitalize"
                  >
                    <div style={{ marginLeft: "20px", marginTop: "15px" }}>
                      Good {greet} !!
                      {/* <span style={{ marginLeft: "5px" }}>{name}</span> */}
                    </div>
                  </MDTypography>
                  <MDBox
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="flex-end"
                    marginLeft={2} // Adjust the left margin as needed
                    marginRight={3}
                    marginTop={2}
                  >
                    <MDBox color="text" mr={0.5} lineHeight={0}>
                      <Icon color="info" fontSize="medium">
                        schedule
                      </Icon>
                    </MDBox>
                    <MDTypography
                      color="warning"
                      fontWeight="regular"
                      variant="h6"
                    >
                      {today.format("LT")}
                    </MDTypography>
                  </MDBox>
                </MDBox>
                <Card>
                  <CardContent>
                    <Typography variant="h5" component="h2">
                      Task Count
                    </Typography>
                    <Typography color="textSecondary">
                      Total Tasks: {taskCount}
                    </Typography>
                  </CardContent>
                </Card>
                <CardActionArea>
                  <CardContent
                    sx={{
                      paddingTop: 3,
                      paddingBottom: 3,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: 'space-between'
                    }}
                  >

                    <Box>
                      <Typography variant="h5" gutterBottom>
                        Latest Attendance
                      </Typography>
                      <Typography variant="subtitle1" color="text.secondary">
                        {latestAttendance ? (
                          `${latestAttendance.checkInTime} | ${latestAttendance.checkOutTime}`
                        ) : (
                          "No attendance data found."
                        )}
                      </Typography>
                    </Box>

                    <Button
                      variant="contained"
                      style={{
                        backgroundColor: mode === "checkin" ? 'green' : 'red',
                        borderRadius: 30,
                        width: 130,
                        height: 40,
                        color: 'white',
                      }}
                      startIcon={<ExpandLessIcon />}
                      type="submit"
                      onClick={handleToggleButtonClick}
                      disabled={isCheckinButtonDisabled || isCheckoutButtonDisabled}
                    >
                      {mode === "checkin" ? "Punch-In" : "Punch-Out"}
                    </Button>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
            <Grid
              item
              sx={{
                display: "flex",
                alignItems: "center",
                minHeight: "0px",
                flexDirection: "row",
                marginTop: "10px",
                gap: "10px",
              }}
            >
              <Card sx={{ width: "100%", height: "100%" }}>
                <CardActionArea>
                  <CardContent sx={{ paddingTop: 3, paddingBottom: 3 }}>
                    <IconButton
                      sx={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        bottom: 1,
                      }}
                    >
                      <WorkOutlineIcon
                        fontSize="large"
                        style={{ color: "#42a883" }}
                      />
                    </IconButton>
                    <h3>Projects</h3>
                    {/* Display project counts */}
                    <ul>
                      {projectCounts.map((projectCount) => (
                        <li key={projectCount._id}>
                          <h4>empId: {projectCount._id}</h4>
                          <ul>
                            {projectCount.projects.map((project) => (
                              <li key={project.projectName}>
                                {project.projectName}: {project.count}
                              </li>
                            ))}
                          </ul>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </CardActionArea>
              </Card>

              <Card sx={{ width: "100%", height: "100%" }}>
                <CardActionArea>
                  <CardContent sx={{ paddingTop: 3, paddingBottom: 3 }}>
                    <IconButton
                      sx={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        bottom: 1,
                      }}
                    >
                      <AccessTimeIcon
                        fontSize="large"
                        style={{ color: "#36a2eb" }}
                      />
                    </IconButton>
                    <h3>Task</h3>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
            <Card>
              <CardActionArea>
                <CardContent>
                  <IconButton>
                    <WorkOutlineIcon fontSize="large" style={{ color: '#42a883' }} />
                  </IconButton>
                  <Typography variant="h5" component="h2">
                    Projects
                  </Typography>
                  <Typography variant="body2" color="textSecondary" component="p">
                    Total Count: {totalCount}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
            <Grid
              item
              sx={{
                display: "flex",
                alignItems: "center",
                minHeight: "0px",
                flexDirection: "row",
                marginTop: "10px",
                gap: "10px",
              }}
            >
              <Card sx={{ width: "100%", height: "100%" }}>
                <CardActionArea>
                  <CardContent sx={{ paddingTop: 3, paddingBottom: 3 }}>
                    <h3>ABCD</h3>
                  </CardContent>
                </CardActionArea>
              </Card>
              <Card sx={{ width: "100%", height: "100%" }}>
                <CardActionArea>
                  <CardContent sx={{ paddingTop: 3, paddingBottom: 3 }}>
                    <h3>ABCD</h3>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          </Grid>
          <Grid item xs={12} md={5} mb={1}>
            <Card sx={{ height: "400px", width: "670px", marginLeft: "4px" }}>
              <CardHeader
                title={
                  <h3 style={{ fontSize: "17px", marginTop: "1px" }}>
                    Present vs Absent Count
                  </h3>
                }
              />
              <CardContent
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "1px",
                }}
              >
                <div style={{ height: "250px", width: "350px" }}>

                </div>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader
                title={
                  <h3 style={{ fontSize: "17px" }}>Latest assigned projects</h3>
                }
              />
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader
                title={<h3 style={{ fontSize: "17px" }}>Latest tasks</h3>}
              />
            </Card>
          </Grid>
        </Grid>
        
      </Box>
    </DashboardLayout>
  );
};

export default UserDashboard;
