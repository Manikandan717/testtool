import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import moment from "moment";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDButton from "components/MDButton/index";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import checkinImage from "../images/check-in.png";
import checkoutImage from "../images/check-out.png";
import Box from "@mui/material/Box";
import './calendar.css';

function Attendance() {
  const apiUrl = "https://9tnby7zrib.execute-api.us-east-1.amazonaws.com/test/Emp"; // Update with your backend URL
  const dispatch = useDispatch();
  const [checkinTime, setCheckinTime] = useState("");
  const [checkoutTime, setCheckoutTime] = useState("");
  const [total, setTotal] = useState("");
  const name = useSelector((state) => state.auth.user.name);
  const empId = useSelector((state) => state.auth.user.empId);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState([]);
  const [isCheckinButtonDisabled, setCheckinButtonDisabled] = useState(false);
  const [isCheckoutButtonDisabled, setCheckoutButtonDisabled] = useState(false);
  const [selectedAttendanceData, setSelectedAttendanceData] = useState([]);
  const [mode, setMode] = useState("");

  const dayCellRenderer = ({ date }) => {
    const isPastDate = moment(date).isSameOrBefore(moment(), "day");
    const attendanceDataForDate = selectedAttendanceData.find(
      (item) => moment(item.currentDate).isSame(date, "day")
    );
    const symbol =
      isPastDate && attendanceDataForDate && attendanceDataForDate.checkOutTime
        ? "P"
        : isPastDate
        ? "A"
        : "";

    const cellStyle = {
      padding: "9px",
      textAlign: "center",
      fontWeight: "bold",
      color: isPastDate ? (symbol === "P" ? "green" : "red") : "unset",
      cursor: "not-allowed",
    };

    const handleDateClick = () => {
      if (isPastDate && !attendanceDataForDate) {
        const updatedData = selectedAttendanceData.map((item) => {
          if (moment(item.currentDate).isSame(date, "day")) {
            return {
              ...item,
              hasAttendance: !item.hasAttendance,
            };
          }
          return item;
        });

        setSelectedAttendanceData(updatedData);
      }
    };

    return (
      <div style={cellStyle} onClick={handleDateClick}>
        {symbol}
      </div>
    );
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

  useEffect(() => {
    const fetchInitialMode = async () => {
      try {
        const modeResponse = await fetch(`${apiUrl}/att/mode?empId=${empId}`);
        const modeData = await modeResponse.json();
        setMode(modeData.mode);
      } catch (error) {
        console.error("Error fetching initial mode:", error);
      }
    };

    fetchInitialMode();
  }, [empId]);

  const fetchData = async () => {
    try {
      const response = await fetch(`${apiUrl}/fetch/att-data?empId=${empId}`);

      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`);
      }

      const data = await response.json();
      const mappedData = data.map((item) => ({ ...item, id: item._id, hasAttendance: true }));

      const filteredData = selectedDate
        ? mappedData.filter((item) => moment(item.currentDate).isSame(selectedDate, "day"))
        : mappedData;

      setAttendanceData(filteredData);
      setSelectedAttendanceData(mappedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

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
          name,
          empId,
          checkInTime: timeNow,
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log("Check-in time saved successfully");
  
        setCheckinTime(data.latestCheckin);
        setCheckoutTime("");
        setTotal("");

        // Fetch the latest attendance data immediately after check-in
        await fetchData();
  
        // Fetch the current mode from the server after successful check-in
        const modeResponse = await fetch(`${apiUrl}/att/mode?empId=${empId}`);
        const modeData = await modeResponse.json();
        setMode(modeData.mode);
      } else {
        console.error("Failed to save check-in time");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setTimeout(() => {
        setCheckinButtonDisabled(false);
      }, 0);
    }
  };
  

  const handleCheckout = async () => {
    try {
      setCheckoutButtonDisabled(true);

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
        const data = await response.json();
        console.log("Check-out time saved successfully");

        setCheckoutTime(data.latestCheckout);
        setTotal(data.latestTotal);

        await fetchData();
      } else {
        console.error("Failed to save check-out time");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setTimeout(() => {
        setCheckoutButtonDisabled(false);
      }, 0);
    }
  };

  useEffect(() => {
    fetchData();
  }, [empId, selectedDate]);

  const columns = [
    { field: "id", headerName: "S.No", editable: false },
    {
      field: "currentDate",
      headerName: "Date",
      width: 120,
      valueGetter: (params) => moment(params.row.currentDate).format("YYYY-MM-DD"),
    },
    { field: "checkInTime", headerName: "Check In", width: 120, flex: 1 },
    { field: "checkOutTime", headerName: "Check Out", width: 120, flex: 1 },
    { field: "total", headerName: "Total", width: 120, flex: 1 },
  ];

  const mappedData = attendanceData.map((item, index) => ({
    ...item,
    id: index + 1,
    name: item.name,
    empId: item.empId,
    status: item.checkOutTime ? 'Present' : 'Absent',
  }));

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Grid item xs={12} mt={1}>
        <MDBox mt={2} mb={2}>
        <Grid container spacing={3} justifyContent="center">
  <Grid item xs={12} lg={8} container justifyContent="center">
    <MDBox
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="space-between"
    >
      <MDTypography mb={3}  variant="caption" color="info" fontWeight="regular">
        <h1>ATTENDANCE</h1>
      </MDTypography>
      <MDBox
        display="flex"
        width="850px"
        flexDirection="column"
        alignItems="center"
        justifyContent="space-evenly"
      >
        <Grid item xs={12} md={6} lg={4} container justifyContent="center">
          <MDButton
            type="submit"
            onClick={handleToggleButtonClick}
            disabled={isCheckinButtonDisabled || isCheckoutButtonDisabled}
          >
            <img
              src={mode === "checkin" ? checkinImage : checkoutImage}
              alt={mode === "checkin" ? "Check In" : "Check Out"}
              display="flex"
              style={{ cursor: "pointer", marginBottom: "16px", width: "100%", maxWidth: "100px" }}
            />
          </MDButton>
        </Grid>
        <Grid item xs={12} mt={2} md={6} lg={4} container justifyContent="center">
          <MDBox>
            <MDTypography variant="caption" color="dark" fontWeight="regular" style={{ textAlign: "center" }}>
              <h2>{mode === "checkin" ? "PUNCH-IN" : "PUNCH-OUT"} </h2>
            </MDTypography>
          </MDBox>
        </Grid>
      </MDBox>
    </MDBox>
  </Grid>
</Grid>

        </MDBox>
      </Grid>

      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} lg={7} xl={6}>
          <MDBox
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="space-between"
            style={{
              height: '500', overflowY: 'auto', "@media screen and (min-width: 768px)": {
                height: '570',
              },
            }}
          >
            <Calendar
              selected={selectedDate}
              onChange={(date) => {
                setSelectedDate(date);
                fetchData();
              }}
              dateFormat="yyyy-MM-dd"
              isClearable
              tileContent={({ date }) => dayCellRenderer({ date })}
            />
          </MDBox>
        </Grid>
        <Grid item xs={12} lg={5} xl={6}>
          <Card>
            <Box
              sx={{
                height: 480,
                width: "100%",
                "@media screen and (min-width: 768px)": {
                  height: 545,
                },
              }}
            >
              <DataGrid rows={mappedData} columns={columns} rowsPerPageOptions={[5, 10, 25, 50, 100]} components={{ Toolbar: () => <GridToolbar /> }} />
            </Box>
          </Card>
        </Grid>
      </Grid>
    </DashboardLayout>
  );
}

export default Attendance;
