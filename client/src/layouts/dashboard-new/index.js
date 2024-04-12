import React, { useState, useEffect, memo } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
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
  Radio,
  RadioGroup,
  FormControlLabel,
  Box,
  TextField,
  Typography,
  LinearProgress,
} from "@mui/material";
// import { Bar } from 'react-chartjs-2';
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import { Doughnut, Bar } from "react-chartjs-2";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNav from "examples/Navbars/DashboardNav";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Icon from "@mui/material/Icon";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import axios from "axios"; // Import axios for making HTTP requests
import cartoon from "assets/images/cartoon.png";
import SkillBar from "./skillbar"; // Import the SkillBar component
import CircularProgress from "@mui/material/CircularProgress";
import FilterListIcon from "@material-ui/icons/FilterList";
 
const MemoizedBarChart = memo(({ chartData }) => {
  const formatDate = (dateString) => {
    return moment(dateString).format("DD MMM"); // Format date with day and month
  };
  return (
    <div style={{ height: "330px", overflowY: "auto" }}>
      {chartData ? (
        <Bar
          data={{
            labels: chartData.labels.map((date) => formatDate(date)),
            datasets: chartData.data.map((dataset) => ({
              label: dataset.label,
              data: dataset.data,
              backgroundColor: "rgba(54, 162, 235, 0.6)",
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 1,
              hoverBackgroundColor: "rgba(54, 162, 235, 0.8)",
              hoverBorderColor: "rgba(54, 162, 235, 1)",
            })),
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: { stacked: true },
              y: { stacked: true },
            },
            plugins: {
              legend: {
                display: true,
                position: "top",
              },
            },
            barThickness: 30,
          }}
        />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
});
 
const YourComponent = ({notificationCount}) => {
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
  const [data, setData] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [reportType, setReportType] = useState("month");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [totalSessionOne, setTotalSessionOne] = useState(0);
  const [currentDateSessionOne, setCurrentDateSessionOne] = useState(0);
  const [totalAvailableHours, setTotalAvailableHours] = useState(0);
  const [isFilterOpen, setFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [quote, setQuote] = useState(null);
  const [error, setError] = useState(null);
 
  const quotes = () => {
    setIsLoading(true);
    axios
      .get("https://api.quotable.io/random")
      .then((res) => {
        setQuote(res.data);
      })
      .catch((error) => {
        console.error("Error fetching quotes:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
 
  useEffect(() => {
    quotes();
  }, []);
 
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [modeResponse, attendanceResponse] = await Promise.all([
          fetch(`${apiUrl}/att/mode?empId=${empId}`),
          fetch(`${apiUrl}/fetch/att-data/dashboard?empId=${empId}`),
        ]);
 
        const [modeData, attendanceData] = await Promise.all([
          modeResponse.json(),
          attendanceResponse.json(),
        ]);
 
        setMode(modeData.mode);
        setLatestAttendance(attendanceData.latestAttendance);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };
 
    fetchInitialData();
  }, [empId]);
 
  useEffect(() => {
    const fetchTaskData = async () => {
      try {
        const [taskCountResponse, tasksResponse] = await Promise.all([
          axios.get(
            `${apiUrl}/task-count/${empId}?startDate=${startDate}&endDate=${endDate}`
          ),
          axios.get(
            `${apiUrl}/tasks/${empId}?startDate=${startDate}&endDate=${endDate}`
          ),
        ]);
 
        setTaskCount(taskCountResponse.data.count);
        setTasks(tasksResponse.data.tasks);
 
        // console.log("Task Count:", taskCountResponse.data.count);
        // console.log("Tasks:", tasksResponse.data.tasks);
      } catch (error) {
        console.error("Error fetching task data:", error);
      }
    };
 
    fetchTaskData();
  }, [empId, startDate, endDate]);
 
  useEffect(() => {
    // Fetch project counts from the backend API with start date and end date
    const fetchProjectCounts = async () => {
      try {
        const response = await fetch(
          `${apiUrl}/project-counts/analyst?empId=${empId}&startDate=${startDate}&endDate=${endDate}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch project counts");
        }
        const data = await response.json();
        setProjectCounts(data);
      } catch (error) {
        console.error("Error fetching project counts:", error);
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
        // console.log("Check-in time saved successfully");
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
        // console.log("Check-out time saved successfully");
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
 
  const fetchLatestAttendance = async () => {
    try {
      const response = await fetch(
        `${apiUrl}/fetch/att-data/dashboard?empId=${empId}`
      );
 
      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`);
      }
 
      const data = await response.json();
      setLatestAttendance(data.latestAttendance);
    } catch (error) {
      console.error("Error fetching latest attendance:", error);
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
    greet = "morning";
    styles.color = "#D90000";
  } else if (hours >= 12 && hours < 17) {
    greet = "afternoon";
    styles.color = "#04733F";
  } else if (hours >= 17 && hours < 20) {
    greet = "evening";
    styles.color = "#04756F";
  } else {
    greet = "night";
    styles.color = "#04756F";
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
 
  useEffect(() => {
    const fetchSessionOneData = async () => {
      try {
        let response;
        if (reportType === "month") {
          response = await axios.get(
            `${apiUrl}/sessionOneSum/${empId}/${selectedMonth}`
          );
          setTotalSessionOne(response.data.totalHours);
        } else if (reportType === "day") {
          response = await axios.get(
            `${apiUrl}/sessionOneDate/${empId}/${selectedDate}`
          );
          setCurrentDateSessionOne(response.data.totalHours);
        }
        // console.log("Total Session One:", totalSessionOne);
      } catch (error) {
        console.error("Error fetching sessionOne data:", error);
      }
    };
 
    fetchSessionOneData();
  }, [empId, selectedMonth, selectedDate, reportType]);
 
  useEffect(() => {
    // Set the default selected month to the current month (YYYY-MM format)
    setSelectedMonth(moment().format("YYYY-MM"));
 
    // Set the default selected date to yesterday's date (YYYY-MM-DD format)
    const yesterday = moment().subtract(1, "days").format("YYYY-MM-DD");
    setSelectedDate(yesterday);
  }, []);
 
  const totalAvailableHoursMap = {
    day: 12, // Assuming 12 hours in a day
    week: 12 * 7, // Assuming 12 hours in a day multiplied by 7 days in a week
    month: 12 * moment().daysInMonth(), // Assuming 12 hours in a day multiplied by the number of days in the current month
  };
 
  // Calculate total available hours based on report type
  useEffect(() => {
    setTotalAvailableHours(totalAvailableHoursMap[reportType]);
  }, [reportType]);
 
  const convertToNumeric = (timeString) => {
    // Validate if timeString is a string
    if (typeof timeString !== "string") {
      console.error("Invalid timeString. Expected a string.");
      return NaN;
    }
 
    // Split the timeString into hours and minutes
    const [hoursStr, minutesStr] = timeString.split(":");
 
    // Convert hours and minutes to numbers
    const hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);
 
    // Check if hours and minutes are valid numbers
    if (isNaN(hours) || isNaN(minutes)) {
      console.error("Unable to parse hours or minutes from timeString.");
      return NaN;
    }
 
    // Calculate the total minutes
    const totalMinutes = hours * 60 + minutes;
 
    return totalMinutes;
  };
  const calculatePercentage = () => {
    let totalAvailableHoursNumeric = 0;
 
    // Calculate total available hours based on report type
    if (reportType === "month") {
      totalAvailableHoursNumeric = 186 * 60; // Total available minutes for the month
    } else if (reportType === "day") {
      totalAvailableHoursNumeric = 12 * 60; // Total available minutes for the day
    }
 
    // Convert totalSessionOne to numeric format (in minutes)
    const totalSessionOneNumeric = convertToNumeric(totalSessionOne);
 
    // Validate numeric values
    if (!isNaN(totalSessionOneNumeric) && !isNaN(totalAvailableHoursNumeric)) {
      // Calculate percentage based on totalSessionOne and totalAvailableHours
      const percentage =
        (totalSessionOneNumeric / totalAvailableHoursNumeric) * 100;
      return percentage;
    } else {
      console.error("Unable to calculate percentage. Invalid data format.");
      return 0; // Return default value or handle error as needed
    }
  };
 
  const [previousDateSessionOne, setPreviousDateSessionOne] = useState({
    sessionOneHours: 0,
    totalAvailableHours: 0,
    status: ''
  });
 
  useEffect(() => {
    const fetchPreviousDayData = async () => {
      try {
        // Calculate previous day's date
        const today = new Date();
        const previousDay = new Date(today);
        previousDay.setDate(today.getDate() - 1);

        // Format the previous day's date as 'YYYY-MM-DD'
        const formattedPreviousDay = `${previousDay.getFullYear()}-${(
          previousDay.getMonth() + 1
        )
          .toString()
          .padStart(2, '0')}-${previousDay
          .getDate()
          .toString()
          .padStart(2, '0')}`;

        // Fetch data for the previous day
        const previousDayData = await fetchDataForDate(formattedPreviousDay);

        // Update state with the data for the previous day
        setPreviousDateSessionOne(previousDayData);
      } catch (error) {
        console.error('Error fetching data for the previous day:', error);
      }
    };

    fetchPreviousDayData();
  }, []);

  // Function to fetch data for a specific date
  const fetchDataForDate = async date => {
    try {
      const response = await axios.get(
        `${apiUrl}/sessionOneDate/${empId}/${date}`
      );

      // Assuming response.data.totalHours is in the format "hours:minutes"
      const [hours, minutes] = response.data.totalHours.split(':');
      const totalHoursNumeric = parseFloat(hours) + parseFloat(minutes) / 60;

      // Assuming total available hours is fixed to 9.30
      const totalAvailableHours = 9.30;
      const sessionOneHours = totalHoursNumeric;
      const sessionOnePercentage =
        totalAvailableHours !== 0
          ? (sessionOneHours / totalAvailableHours) * 100
          : 0;

      // Determine the status based on sessionOneHours
      const status = sessionOneHours === 0 ? 'pending' : '';

      return {
        sessionOneHours,
        totalAvailableHours,
        sessionOnePercentage,
        status
      };
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error; // Rethrow the error to handle it upstream if necessary
    }
  };
 
  const [currentWeekSessionOne, setCurrentWeekSessionOne] = useState({
    sessionOneHours: 0,
    totalAvailableHours: 0,
  });
 
  useEffect(() => {
    const fetchCurrentWeekData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/sessionOneWeek/${empId}`);
        // console.log("API Response:", response.data); // Log the API response to inspect it
 
        const [hours, minutes] = response.data.totalHours.split(":");
        const totalHoursNumeric = parseFloat(hours) + parseFloat(minutes) / 60;
 
        const totalAvailableHours = 46.50; // Assuming 40 hours in a typical workweek
        const sessionOneHours = totalHoursNumeric;
        const sessionOnePercentage =
          totalAvailableHours !== 0
            ? (sessionOneHours / totalAvailableHours) * 100
            : 0;
 
        setCurrentWeekSessionOne({
          sessionOneHours,
          totalAvailableHours,
          sessionOnePercentage,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
 
    fetchCurrentWeekData();
  }, [apiUrl, empId]);
 
  const handleFilterToggle = () => {
    setFilterOpen(!isFilterOpen);
  };
 
  const [chartData, setChartData] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/total-session-hours/${empId}`,
          {
            params: {
              startDate: startDate, // Replace with your start date
              endDate: endDate, // Replace with your end date
            },
          }
        );
        setChartData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
 
    fetchData();
  }, [empId, startDate, endDate]);
 
  const formatDate = (dateString) => {
    return moment(dateString).format("DD MMM"); // Format date with day and month
  };
 
  return (
    <DashboardLayout>
     <DashboardNav notificationCount={notificationCount} />
 
      <Grid container spacing={2}>
        <Grid item xs={12} md={3.5}>
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
              <CardContent
                sx={{
                  paddingTop: 3,
                  paddingBottom: 3,
                  display: "flex",
                  flexDirection: "column", // Set flex direction to column
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                {/* <Box> */}
                {/* <Typography
                 variant="h4"
                 gutterBottom
                 style={{ fontSize: "22px" }}
               >
                 Attendance
               </Typography> */}
                <MDTypography
                  mb={3}
                  variant="caption"
                  color="info"
                  fontWeight="regular"
                >
                  <h2> Attendance</h2>
                </MDTypography>
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  mb={2}
                >
                  {/* Circular progress bar with total time */}
                  <CircularProgress
                    variant="determinate"
                    value={100}
                    thickness={2}
                    size={170}
                  />
 
                  <Box
                    position="absolute"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    width="100%"
                    height="100%"
                  >
                    <Typography
                      variant="h6"
                      component="div"
                      color="dark"
                      style={{ fontSize: "14px", textAlign: "center" }}
                    >
                      <Typography variant="h5" component="div" align="center">
  {latestAttendance ? (  latestAttendance.total !== undefined ? (  `${latestAttendance.total}` ) : ( "Counting..." ) ) : ( "No data"  )}
</Typography>
                      Working Hours
                    </Typography>
                  </Box>
                </Box>
 
                <Grid>
                  <Button
                    variant="h6"
                    align="center"
                    style={{
                      backgroundColor: mode === "checkin" ? "green" : "red",
                      borderRadius: 10,
                      width: 130,
                      height: 30,
                      color: "white",
                      marginTop: "15px",
                      marginBottom: "15px",
                      // Align button at the bottom
                    }}
                    // startIcon={<ExpandLessIcon />}
                    type="submit"
                    onClick={handleToggleButtonClick}
                    disabled={
                      isCheckinButtonDisabled || isCheckoutButtonDisabled
                    }
                  >
                    {mode === "checkin" ? "Punch In" : "Punch Out"}
                  </Button>
                </Grid>
              </CardContent>
 
              <Grid
                container
                spacing={1}
                justifyContent="space-between"
                alignItems="center"
                // style={{ marginTop: "1px" }}
              >
                <Grid
                  item
                  xs={6}
                  style={{
                    borderTop: "1px solid #e0e0e0",
                    borderRight: "1px solid #e0e0e0",
                  }}
                >
                  <Box textAlign="center">
                    <Typography variant="h6" gutterBottom>
                      Punch in
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      color="text.secondary"
                      style={{ fontSize: "16px", fontWeight: "bold" }}
                    >
                      {latestAttendance
                        ? `${latestAttendance.checkInTime}`
                        : "No data"}
                    </Typography>
                  </Box>
                </Grid>
                <Grid
                  item
                  xs={6}
                  style={{
                    borderLeft: "1px solid #e0e0e0",
                    borderTop: "1px solid #e0e0e0",
                  }}
                >
                  <Box textAlign="center">
                    <Typography variant="h6" gutterBottom>
                      Punch out
                    </Typography>
                    <Typography
  variant="subtitle1"
  color="text.secondary"
  style={{ fontSize: "16px", fontWeight: "bold" }}
>
  {latestAttendance ? ( latestAttendance.checkOutTime !== undefined ? (`${latestAttendance.checkOutTime}` ) : ( "Counting..." ) ) : (  "No data" )}
</Typography>

                  </Box>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </Grid>
        <Grid item xs={12} md={5}>
          <Card
            sx={{
              // height: 310,
              width: "100%",
              "@media screen and (min-width: 768px)": {
                height: 400,
              },
            }}
          >
            <Grid container>
              {/* Left side */}
              <Grid item xs={6}>
                <MDBox pt={12} px={1}>
                  <MDBox
                    pt={5}
                    px={2}
                    display="flex"
                    flexDirection="row"
                    justifyContent="center"
                  >
                    <MDBox>
                      <MDTypography
                        variant="caption"
                        color="success"
                        fontWeight="bold"
                      >
                        <h2>
                          Hi, <span>{name}</span>
                        </h2>
                      </MDTypography>
                    </MDBox>
                  </MDBox>
                  <MDBox
                    px={1.5}
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <MDTypography
                      variant="h4"
                      fontWeight="bold"
                      color="info"
                      textTransform="capitalize"
                    >
                      <div>Good {greet} !!</div>
                    </MDTypography>
                  </MDBox>
                  <MDBox
                    px={2}
                    display="flex"
                    flexDirection="row"
                    justifyContent="center"
                  >
                    <MDBox>
                      <MDTypography
                        variant="caption"
                        color="success"
                        fontWeight="bold"
                      >
                        <h2>Have a good day </h2>
                      </MDTypography>
                    </MDBox>
                  </MDBox>
                </MDBox>
              </Grid>
 
              {/* Right side */}
              <Grid item xs={6}>
                <MDBox pt={2} px={2}>
                  <MDBox
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="flex-end"
                  >
                    <MDBox color="text" mr={0.5} lineHeight={1}>
                      <Icon color="info" fontSize="45px">
                        schedule
                      </Icon>
                    </MDBox>
                    <MDTypography color="warning" fontWeight="regular" style={{ fontSize: "18px" }}>
                      {today.format("LT")}
                    </MDTypography>
                  </MDBox>
                  <MDBox
                    pt={3}
                    pb={2}
                    px={2}
                    display="flex"
                    flexDirection="row"
                    justifyContent="center" // Adjusted alignment to center
                  >
                    <MDBox
                      component="img"
                      src={cartoon}
                      alt="cartoon"
                      width="100%" // Adjusted image width
                    />
                  </MDBox>
                </MDBox>
              </Grid>
 
              <Grid container justifyContent="center">
                <Grid item xs={12}>
                  <MDBox
                    // mt={3}
                    display="flex"
                    flexDirection="column"
                    textAlign="center"
                  >
                    {isLoading && <p></p>}
                    {quote && (
                      <div
                        style={{ overflow: "hidden", textOverflow: "ellipsis" }}
                      >
                        <MDTypography
                          sx={{ whiteSpace: "pre-wrap" }}
                          variant="h6"
                          color="text"
                        >
                          {quote.content}
                        </MDTypography>
                        <MDTypography variant="h6" color="dark">
                          - {quote.author}
                        </MDTypography>
                      </div>
                    )}
                  </MDBox>
                </Grid>
              </Grid>
            </Grid>
          </Card>
        </Grid>
 
        <Grid item xs={12} md={3.5}>
          <Grid item xs={12}>
            <Card
              sx={{
                height: 310,
                width: "100%",
                "@media screen and (min-width: 768px)": {
                  height: 400,
                },
              }}
            >
              <CardContent>
                <Grid item xs={12} style={{ marginTop: "8px" }}>
                  <MDTypography
                    mb={3}
                    variant="caption"
                    color="info"
                    fontWeight="regular"
                  >
                    <h2> Statistics</h2>
                  </MDTypography>
                </Grid>
 
                {/* Heading for Previous Day's Session One */}
                <div
      style={{
        border: '1px solid #ccc',
        borderRadius: '10px',
        width: '100%',
        padding: '5px',
        margin: 'auto',
        marginTop: '15px',
      }}
    >
      <Typography variant="h6" gutterBottom style={{ marginTop: '0px', fontSize: '15px' }}>
        Previous Day
      </Typography>
      {/* Previous Day's Session One */}
      <Grid container style={{ marginTop: '5px' }}>
        <Grid item xs={7} style={{ paddingRight: '10px' }}>
          {/* Display the skill bar with calculated percentage */}
          <SkillBar percentage={(previousDateSessionOne.sessionOneHours / previousDateSessionOne.totalAvailableHours) * 100} />
        </Grid>
        <Grid item xs={5} style={{ textAlign: 'right' }}>
          {previousDateSessionOne.status === 'pending' ? (
            <Typography variant="body1" style={{ fontSize: '13px', fontWeight: 'bolder' }}>
              Your status is pending
            </Typography>
          ) : (
            <Typography variant="body1" style={{ fontSize: '13px', fontWeight: 'bolder' }}>
              {previousDateSessionOne.sessionOneHours} hrs / {previousDateSessionOne.totalAvailableHours} hrs
            </Typography>
          )}
        </Grid>
      </Grid>
    </div>
                <div
                  style={{
                    border: "1px solid #ccc",
                    borderRadius: "10px",
                    width: "100%",
                    padding: "5px",
                    margin: "auto",
                    marginTop: "20px",
                  }}
                >
                  <Typography
                    variant="h6"
                    gutterBottom
                    style={{ marginTop: "0px", fontSize: "15px" }}
                  >
                    This Week
                  </Typography>
                  <Grid container>
                    <Grid item xs={7} marginTop={0}>
                      {/* Display the skill bar with calculated percentage */}
                      <SkillBar
                        percentage={currentWeekSessionOne.sessionOnePercentage}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={5}
                      style={{ textAlign: "right", marginTop: "0px" }}
                    >
                      <Typography
                        variant="body1"
                        style={{ fontSize: "13px", fontWeight: "bolder" }}
                      >
                        {currentWeekSessionOne.sessionOneHours} hrs /{" "}
                        {currentWeekSessionOne.totalAvailableHours} hrs
                      </Typography>
                    </Grid>
                  </Grid>
                </div>
                {/* Heading for Monthly Session One */}
                <div
                  style={{
                    border: "1px solid #ccc",
                    borderRadius: "10px",
                    width: "100%",
                    padding: "5px",
                    margin: "auto",
                    marginTop: "20px",
                  }}
                >
                  <Typography
                    variant="h6"
                    gutterBottom
                    style={{ marginTop: "0px", fontSize: "15px" }}
                  >
                    This Month
                  </Typography>
                  {/* Monthly Session One */}
                <Grid container spacing={2}>
                    <Grid item xs={7} marginTop={0}>
                      {/* Display the skill bar with calculated percentage */}
                      <SkillBar percentage={calculatePercentage()} />
                    </Grid>
                    <Grid
                      item
                      xs={5}
                      style={{ textAlign: "right", marginTop: "0px" }}
                    >
                      <Typography
                        style={{ fontSize: "13px", fontWeight: "bolder" }}
                        variant="body1"
                      >
                        {totalSessionOne} hrs / 186 hrs
                      </Typography>
                    </Grid>
                  </Grid>
                </div>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>
      <Grid container spacing={2} marginTop={1}>
        {/* Bar Chart */}
        <Grid item xs={12}>
          <Card xs={{ height: "100px" }}>
            <CardContent >
              <MDTypography
                mb={5}
                variant="caption"
                color="info"
                fontWeight="regular"
              >
                <h2> Task Report</h2>
              </MDTypography>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                {/* Project Count */}
                <div style={{ marginTop: "25px" }}>
                  <Typography variant="h6" gutterBottom>
                    Project Count ({totalCount})  Task Count ({taskCount})
                  </Typography>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <div style={{ maxWidth: 200 }}>
                        <label
                          htmlFor="startDate"
                          style={{ fontSize: "15px", fontWeight: "bold" }}
                        >
                          Start Date
                        </label>
                        <TextField
                          id="startDate"
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          variant="outlined"
                          fullWidth
                          style={{ width: "220px" }}
                          inputProps={{ style: { height: "10px" } }}
                        />
                      </div>
                    </Grid>
                    <Grid item xs={6}>
                      <div>
                        <label
                          htmlFor="endDate"
                          style={{ fontSize: "15px", fontWeight: "bold" }}
                        >
                          End Date
                        </label>
                        <TextField
                          id="endDate"
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          variant="outlined"
                          fullWidth
                          style={{ width: "220px" }}
                          inputProps={{ style: { height: "10px" } }}
                        />
                      </div>
                    </Grid>
                  </Grid>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "end",
                  
                  alignItems: "center",
                }}
              ></div>
              <CardContent>
                <MemoizedBarChart chartData={chartData} />
              </CardContent>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </DashboardLayout>
  );
};
 
export default YourComponent;