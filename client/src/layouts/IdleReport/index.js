import React, { useState, useEffect, useMemo, useCallback, memo } from "react";
import axios from "axios";
import { CardActionArea, CardActions, IconButton } from "@mui/material";
import { Bar, Doughnut } from "react-chartjs-2";
import { Box, Typography } from "@mui/material";
import DatePicker from "@mui/lab/DatePicker";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import Autocomplete from "@mui/material/Autocomplete";
import CheckIcon from "@mui/icons-material/Check";
import SelfImprovementIcon from "@mui/icons-material/SelfImprovement";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import CloseIcon from "@mui/icons-material/Close";
import { Card, CardContent, CardHeader, Grid, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDButton from "components/MDButton";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AssessmentIcon from "@mui/icons-material/Assessment";
import WorkIcon from "@mui/icons-material/Work";
import * as XLSX from "xlsx";
import GroupIcon from '@material-ui/icons/Group';
import CategoryIcon from '@mui/icons-material/Category';
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import MDBox from "components/MDBox";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

const MemoizedBarChart = memo(
  ({ chartData }) =>
    chartData.labels.length > 0 && (
      <div style={{ height: "333px", overflowY: "auto" }}>
        <Bar
          data={chartData}
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
      </div>
    )
);

const MemoizedBillingChart = memo(
  ({ pieChartData }) =>
    pieChartData.labels.length > 0 && (
      <Card>
        <CardHeader
          title={
            <h3 style={{ fontSize: "17px" }}>Billing & Non-Billing Status</h3>
          }
        />
        <CardContent>
          <Doughnut
            data={pieChartData}
            options={{
              plugins: {
                tooltip: {
                  enabled: true,
                  callbacks: {
                    label: (context) => {
                      const label = context.label || "";
                      const value = context.formattedValue || "";
                      return `${label}: ${value}`;
                    },
                  },
                },
                legend: {
                  position: "right",
                  labels: {
                    generateLabels: function (chart) {
                      const data = chart.data;
                      if (data.labels.length && data.datasets.length) {
                        return data.labels.map((label, index) => {
                          const dataset = data.datasets[0];
                          const value = dataset.data[index];
                          return {
                            text: `${label} (${value})`,
                            fillStyle: dataset.backgroundColor[index],
                            strokeStyle: dataset.backgroundColor[index],
                            lineWidth: 0,
                          };
                        });
                      }
                      return [];
                    },
                  },
                },
              },
              cutout: "60%",
            }}
          />
        </CardContent>
      </Card>
    )
);

const MemoizedDoughnutChart = memo(
  ({ pieChartDataAtt }) => {
    return (
      <Card>
        <CardHeader
          title={<h3 style={{ fontSize: "17px" }}>Attendance Overview</h3>}
        />
        <CardContent>
          <Doughnut
            data={pieChartDataAtt}
            options={{
              plugins: {
                tooltip: {
                  enabled: true,
                  callbacks: {
                    label: (context) => {
                      const label = context.label || "";
                      const value = context.formattedValue || "";
                      return `${label}: ${value}`;
                    },
                  },
                },
                legend: {
                  position: "right",
                  labels: {
                    generateLabels: function (chart) {
                      const data = chart.data;
                      if (data.labels.length && data.datasets.length) {
                        return data.labels.map((label, index) => {
                          const dataset = data.datasets[0];
                          const value = dataset.data[index];
                          return {
                            text: `${label} (${value})`,
                            fillStyle: dataset.backgroundColor[index],
                            strokeStyle: dataset.backgroundColor[index],
                            lineWidth: 0,
                          };
                        });
                      }
                      return [];
                    },
                  },
                },
              },
              cutout: "60%",
            }}
          />
        </CardContent>
      </Card>
    );
  },
  (prevProps, nextProps) => {
    // Compare the properties that should trigger a re-render
    return (
      JSON.stringify(prevProps.pieChartDataAtt.labels) ===
        JSON.stringify(nextProps.pieChartDataAtt.labels) &&
      JSON.stringify(prevProps.pieChartDataAtt.datasets[0].data) ===
        JSON.stringify(nextProps.pieChartDataAtt.datasets[0].data)
    );
  }
);

const MemoizedProjectStatusChart = memo(
  ({ pieChartData1 }) =>
    pieChartData1.labels.length > 0 && (
      <Card>
        <CardHeader
          title={<h3 style={{ fontSize: "17px" }}>Project Status</h3>}
        />
        <CardContent>
          <Doughnut
            data={pieChartData1}
            options={{
              plugins: {
                tooltip: {
                  enabled: true,
                  callbacks: {
                    label: (context) => {
                      const label = context.label || "";
                      const value = context.formattedValue || "";
                      const index = context.dataIndex;
                      const count = pieChartData1.datasets[0].data[index];
                      return `${label}: ${value}`;
                    },
                  },
                },
                legend: {
                  position: "right",
                  labels: {
                    generateLabels: function (chart) {
                      const data = chart.data;
                      if (data.labels.length && data.datasets.length) {
                        return data.labels.map((label, i) => {
                          const dataset = data.datasets[0];
                          const count = dataset.data[i];
                          return {
                            text: `${label} (${count})`,
                            fillStyle: dataset.backgroundColor[i],
                            hidden:
                              isNaN(dataset.data[i]) || dataset.data[i] === 0,
                          };
                        });
                      }
                      return [];
                    },
                  },
                },
              },
              cutout: "60%",
            }}
          />
        </CardContent>
      </Card>
    )
);

const TaskWiseBarChart = () => {
  const apiUrl = 'https://9tnby7zrib.execute-api.us-east-1.amazonaws.com/test/Emp';
  const getCurrentMonthStartDate = () => {
    const currentDate = new Date();
    return new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  };

  const getCurrentMonthEndDate = () => {
    const currentDate = new Date();
    return new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  };

  const [startDate, setStartDate] = useState(getCurrentMonthStartDate());
  const [endDate, setEndDate] = useState(getCurrentMonthEndDate());
  const [projectNames, setProjectNames] = useState([]);
  const [allProjectNames, setAllProjectNames] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [batchValue, setBatchValue] = useState(null);
  const [employeeCount, setEmployeeCount] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [batchCountByTeam, setBatchCountByTeam] = useState(null);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  const [tableData, setTableData] = useState([]);
  const [showTable, setShowTable] = useState(false);

  // New state variables
  const [idleNonBillableCount, setIdleNonBillableCount] = useState(0);
  const [idleBillableCount, setIdleBillableCount] = useState(0);
  const [productionCount, setProductionCount] = useState(0);
  const [teamProjects, setTeamProjects] = useState([]);

  // New state variable for Pie Chart
  const [pieChartData, setPieChartData] = useState({
    labels: ["Idle", "Production"],
    datasets: [
      {
        data: [0, 0, 0], // Initial percentages set to 0
        backgroundColor: ["#7b69bc", "#435671"],
        hoverBackgroundColor: ["#7b69bc", "#435671"],
      },
    ],
  });
  const [totalProductionCount, setTotalProductionCount] = useState(0);
  const [totalIdleCount, setTotalIdleCount] = useState(0);

  useEffect(() => {
    fetchDataTwo(selectedProject, selectedTeam, startDate, endDate);
  }, [selectedProject, selectedTeam, startDate, endDate]);

  const fetchDataTwo = async (projectName, team, sDate, eDate) => {
    try {
      let url = `${apiUrl}/analyst/counts`;
      const params = {};

      if (projectName) {
        params.projectName = projectName;
      }
      if (team) {
        params.team = team;
      }
      if (sDate && eDate) {
        params.sDate = sDate;
        params.eDate = eDate;
      }

      const response = await axios.get(url, { params });

      setTotalProductionCount(response.data.totalProductionTasks);
      setTotalIdleCount(response.data.totalIdleTasks);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const [teams, setTeams] = useState([]);
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get(`${apiUrl}/teams`);
        setTeams(response.data);
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    };

    fetchTeams();
  }, []);

  useEffect(() => {
    const fetchAllProjectNames = async () => {
      try {
        const response = await axios.get(`${apiUrl}/projectNames`);
        setAllProjectNames(response.data);
      } catch (error) {
        console.error("Error fetching all project names:", error);
      }
    };

    fetchAllProjectNames();
  }, []);

  // useEffect(() => {
  //   const fetchProjectNames = async () => {
  //     try {
  //       const response = await axios.get(`${apiUrl}/projectNames`);
  //       const projectNames = response.data;
  //       setProjectNames(projectNames);
  //     } catch (error) {
  //       console.error('Error fetching project names:', error);
  //     }
  //   };

  //   fetchProjectNames();
  // }, []);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "numeric", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const fetchPieChartData = useCallback(async () => {
    try {
      const totalProduction = idleBillableCount + totalProductionCount; // Include idleBillableCount in production count
      const total = totalProduction + idleNonBillableCount; // Include idleNonBillableCount separately
      const percentages = [idleNonBillableCount, totalProduction]; // Include totalProduction

      setPieChartData((prevData) => ({
        ...prevData,
        datasets: [
          {
            data: percentages,
            backgroundColor: ["#7b69bc", "#435671"],
            hoverBackgroundColor: ["#7b69bc", "#435671"],
          },
        ],
      }));
    } catch (error) {
      console.error("Error fetching pie chart data:", error);
    }
  }, [idleNonBillableCount, totalProductionCount, setPieChartData]);

  useEffect(() => {
    fetchPieChartData();
  }, [fetchPieChartData]);

  // Modify the useEffect hook where you calculate the production count
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!startDate || !endDate) {
          setChartData({
            labels: [],
            datasets: [],
          });
          setTableData([]);
          setIdleNonBillableCount(0);
          setIdleBillableCount(0);
          setProductionCount(0);
          return;
        }

        let response;

        if (selectedProject && selectedTeam) {
          // Fetch data for a specific project and team
          response = await axios.get(`${apiUrl}/fetch/taskwise`, {
            params: {
              sDate: startDate.toISOString().split("T")[0],
              eDate: endDate.toISOString().split("T")[0],
              projectName: selectedProject,
              team: selectedTeam,
            },
          });
        } else if (selectedTeam) {
          // Fetch data for all projects for a specific team
          response = await axios.get(`${apiUrl}/fetch/taskwise`, {
            params: {
              sDate: startDate.toISOString().split("T")[0],
              eDate: endDate.toISOString().split("T")[0],
              team: selectedTeam,
            },
          });
        } else {
          // Fetch data for all projects
          response = await axios.get(`${apiUrl}/fetch/taskwise`, {
            params: {
              sDate: startDate.toISOString().split("T")[0],
              eDate: endDate.toISOString().split("T")[0],
            },
          });
        }

        const data = response.data;
        const uniqueDates = [...new Set(data.map((item) => item._id.date))];
        const formattedDates = uniqueDates.map((date) => {
          const formattedDate = new Date(date);
          const day = formattedDate.getDate();
          const month = formattedDate.toLocaleString("en-US", {
            month: "short",
          });
          const year = formattedDate.getFullYear();
          return `${day} ${month} ${year}`;
        });

        // Sort the formattedDates array in chronological order
        formattedDates.sort((a, b) => new Date(a) - new Date(b));

        const uniqueTasks = [...new Set(data.map((item) => item._id.task))];

        const datasets = uniqueTasks.map((task) => {
          const taskData = data.filter((item) => item._id.task === task);
          return {
            label: task,
            data: formattedDates.map((formattedDate) => {
              const matchingItem = taskData.find((item) => {
                const itemDate = new Date(item._id.date);
                const day = itemDate.getDate();
                const month = itemDate.toLocaleString("en-US", {
                  month: "short",
                });
                const year = itemDate.getFullYear();
                const itemFormattedDate = `${day} ${month} ${year}`;
                return itemFormattedDate === formattedDate;
              });
              return matchingItem ? matchingItem.count : 0;
            }),
            backgroundColor: getRandomColor(),
          };
        });

        let idleNonBillableCount = 0;
        let idleBillableCount = 0;
        let productionCount = 0;

        datasets.forEach((dataset) => {
          const task = dataset.label.toLowerCase();
          const count = dataset.data.reduce((sum, value) => sum + value, 0);

          if (task.includes("idle") && task.includes("non billable")) {
            idleNonBillableCount += count;
          } else if (task.includes("idle") && task.includes("billable")) {
            idleBillableCount += count;
          } else {
            productionCount += count;
          }
        });

        // Add idle billable count to production count
        productionCount += idleBillableCount;

        setIdleNonBillableCount(idleNonBillableCount);
        setIdleBillableCount(idleBillableCount);
        setProductionCount(productionCount);

        setChartData({
          labels: formattedDates,
          datasets: datasets,
        });

        const tableData = uniqueTasks.map((task, index) => ({
          id: index + 1,
          task: task,
          count: datasets[index].data.reduce((sum, value) => sum + value, 0),
          // Include count property in the tableData
        }));

        setTableData(tableData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [startDate, endDate, selectedProject, selectedTeam]);

  const fetchDataBasedOnProject = async (newProject, newTeam) => {
    try {
      if (newProject !== null && newTeam === null) {
        // If only project is selected, fetch batch value
        const response = await axios.get(`${apiUrl}/getBatchByProjectName`, {
          params: {
            projectName: newProject,
          },
        });
        setBatchValue(response.data.batchValue);
        setEmployeeCount(null); // Reset employee count when a project is selected
        setBatchCountByTeam(null); // Reset batch count by team when only project is selected
      } else if (newProject === null && newTeam !== null) {
        // If only team is selected, fetch batch count by team
        const response = await axios.get(`${apiUrl}/overallBatchCountByTeam`, {
          params: {
            team: newTeam,
          },
        });
        setBatchCountByTeam(
          response.data.find((teamData) => teamData._id === newTeam)
            ?.overallBatchCount || 0
        );
        setBatchValue(null); // Reset batch value when only team is selected
        setEmployeeCount(null); // Reset employee count when only team is selected
      } else if (newProject !== null && newTeam !== null) {
        // If both project and team are selected, fetch batch value for the team related to the project
        const response = await axios.get(`${apiUrl}/getBatchByProjectName`, {
          params: {
            projectName: newProject,
          },
        });
        setBatchValue(response.data.batchValue);
        setEmployeeCount(null); // Reset employee count when both project and team are selected
        // Note: You might need additional logic here to set batch count by team for the specific team
      } else {
        // If no project or team is selected, fetch employee count
        const response = await axios.get(`${apiUrl}/employeeCount`);
        setEmployeeCount(response.data.count);
        setBatchValue(null); // Reset batch value when no project or team is selected
        setBatchCountByTeam(null); // Reset batch count by team when no project or team is selected
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle error, you might want to set an error state or display an error message
    }
  };

  const handleProjectChange = async (event, newProject) => {
    setSelectedProject(newProject);
    await fetchDataBasedOnProject(newProject, selectedTeam);
  };

  const handleFetchProjectsForTeam = async (team) => {
    try {
      const response = await axios.get(`${apiUrl}/projectNames?team=${team}`);
      // console.log(`Projects for ${team} Team Response:`, response.data);
      setTeamProjects(response.data);
    } catch (error) {
      console.error(`Error fetching projects for ${team} team:`, error);
    }
  };

  const handleTeamChange = async (event, newTeam) => {
    setSelectedTeam(newTeam);
    await fetchDataBasedOnProject(selectedProject, newTeam);
    setSelectedProject(null);
    try {
      handleFetchProjectsForTeam(newTeam);
    } catch (error) {
      console.error("Error fetching projects for the team:", error);
    }
  };
  // const handleTeamChange = async (event, newTeam) => {
  //   setSelectedTeam(newTeam);
  //   await fetchDataBasedOnProject(selectedProject, newTeam);
  // };

  useEffect(() => {
    // Fetch all project names when the component mounts
    const fetchAllProjectNames = async () => {
      try {
        const response = await axios.get("/projectNames"); // Replace with the actual endpoint to get all project names
        setAllProjectNames(response.data);
      } catch (error) {
        console.error("Error fetching all project names:", error);
        // Handle error, you might want to set an error state or display an error message
      }
    };

    fetchAllProjectNames();
    fetchDataBasedOnProject(null, null); // Fetch initial data with no project or team selected
  }, []);

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  //   // Function to calculate production count
  // const calculateProductionCount = () => {
  //   // Add your logic here to calculate the production count
  //   // For example, you might fetch the production count from your state or API
  //   return averageProductionCountPerDay; // Return the calculated production count
  // };
  // const calculateIdleCount = () => {
  //   // Add your logic here to calculate the production count
  //   // For example, you might fetch the production count from your state or API
  //   // return totalIdleCount; // Return the calculated production count
  //   return averageIdleCountPerDay;

  // };

  const exportChartDataToExcel = async () => {
    try {
      if (!selectedProject && !selectedTeam) {
        console.error("No project or team selected for export");
        return;
      }

      let response;
      let projectName;

      if (selectedProject) {
        response = await axios.get(`${apiUrl}/fetch/taskwise`, {
          params: {
            sDate: startDate.toISOString().split("T")[0],
            eDate: endDate.toISOString().split("T")[0],
            projectName: selectedProject,
          },
        });
        projectName = selectedProject;
      } else if (selectedTeam) {
        response = await axios.get(`${apiUrl}/fetch/taskwise`, {
          params: {
            sDate: startDate.toISOString().split("T")[0],
            eDate: endDate.toISOString().split("T")[0],
            teamName: selectedTeam,
          },
        });
        projectName = selectedTeam;
      }

      const data = response.data;

      if (data.length === 0) {
        console.error("No data available for export");
        return;
      }

      const wb = XLSX.utils.book_new();

      const uniqueDates = [...new Set(data.map((item) => item._id.date))];
      const formattedDates = uniqueDates.map((date) => {
        const formattedDate = new Date(date);
        return formattedDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
      });

      // Sort formattedDates in order
      formattedDates.sort((a, b) => {
        const dateA = new Date(a);
        const dateB = new Date(b);
        return dateA - dateB;
      });

      const uniqueTasks = [...new Set(data.map((item) => item._id.task))];

      // Create headers with project or team name in the first cell of the first row
      const mainHeader = [[projectName]];
      const subHeader = ["Date/Task", ...uniqueTasks]; // Include only Task headers initially

      // Calculate production count once
      const productionCount = calculateProductionCount();
      const idleCount = calculateIdleCount();

      // Add a new row for Production and Idle headers
      const productionIdleHeaderRow = ["", "Production", "Idle"];
      // Add a new row for Production and Idle counts
      const productionIdleCountRow = ["", productionCount, idleCount];

      const headers = [
        mainHeader,
        productionIdleHeaderRow,
        productionIdleCountRow,
        subHeader,
      ]; // Combine headers and counts
      const wsData = [...headers]; // Initialize sheet data with headers and counts

      formattedDates.forEach((date) => {
        const row = [date];
        uniqueTasks.forEach((task) => {
          const matchingItem = data.find((item) => {
            const itemDate = new Date(item._id.date);
            return (
              itemDate.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              }) === date && item._id.task === task
            );
          });
          row.push(matchingItem ? matchingItem.count : 0);
        });
        wsData.push(row);
      });

      const ws = XLSX.utils.aoa_to_sheet(wsData);
      XLSX.utils.book_append_sheet(wb, ws, "TaskWiseUserCount");

      XLSX.writeFile(wb, "TaskWiseUserCount.xlsx");
    } catch (error) {
      console.error("Error exporting data:", error);
    }
  };

  const handleViewTable = () => {
    setShowTable(!showTable);
  };

  const labelColors = {
    POC: "#2196F3", // Blue
    "NOT-Started": "#979700", // Dark Yellow
    Training: "#9F00FF", // Purple
    "In-Progress": "#FF9800", // Orange
    "Completed-Won": "#8BC34A", // Light Green
    "Completed-Lost": "#FF5722", // Deep Orange
  };
  const labelsData = [
    "POC",
    "NOT-Started",
    "Training",
    "In-Progress",
    "Completed-Won",
    "Completed-Lost",
  ];
  const [pieChartData1, setPieChartData1] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
        hoverBackgroundColor: [],
      },
    ],
  });
  useEffect(() => {
    const fetchProjectStatusData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/projectStatus`);
        const projectStatusData = response.data;

        // Assuming you have a function like aggregateStatus1Data to aggregate data
        const aggregatedData = aggregateStatus1Data(projectStatusData);

        const totalCount = aggregatedData.reduce(
          (sum, item) => sum + item.count,
          0
        );

        const percentages = aggregatedData.map((item) => item.count);

        setPieChartData1((prevData) => ({
          ...prevData,
          labels: aggregatedData.map((item) => item.status1),
          datasets: [
            {
              data: percentages,
              backgroundColor: aggregatedData.map(
                (item) => labelColors[item.status1] || "#000"
              ),
              hoverBackgroundColor: aggregatedData.map(
                (item) => labelColors[item.status1] || "#000"
              ),
            },
          ],
        }));
      } catch (error) {
        console.error("Error fetching project status data:", error);
      }
    };

    fetchProjectStatusData();
  }, [apiUrl]);

  // Function to aggregate counts for the same status1 values
  const aggregateStatus1Data = (data) => {
    const status1Map = new Map();

    data.forEach((item) => {
      const { status1, count } = item;
      if (status1Map.has(status1)) {
        status1Map.set(status1, status1Map.get(status1) + count);
      } else {
        status1Map.set(status1, count);
      }
    });

    return Array.from(status1Map.entries()).map(([status1, count]) => ({
      status1,
      count,
    }));
  };

  const [status1CountByProject, setStatus1CountByProject] = useState([]);

  useEffect(() => {
    const fetchStatus1CountByProject = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/status1CountByProject`);
        setStatus1CountByProject(response.data);
      } catch (error) {
        console.error("Error fetching status1 count by project:", error);
      }
    };

    fetchStatus1CountByProject();
  }, []);

  const aggregateStatus1Counts = (projects) => {
    const status1Map = new Map();

    projects.forEach((project) => {
      project.status1Counts.forEach((status1Count) => {
        const { status1, count } = status1Count;

        if (status1Map.has(status1)) {
          status1Map.set(status1, status1Map.get(status1) + count);
        } else {
          status1Map.set(status1, count);
        }
      });
    });

    return Array.from(status1Map.entries()).map(([status1, count]) => ({
      status1,
      count,
    }));
  };

  const columns = [
    { field: "status1", headerName: "Status1", flex: 1 },
    { field: "count", headerName: "Count", flex: 1 },
  ];

  const rows = aggregateStatus1Counts(status1CountByProject).map(
    (row, index) => ({
      id: index, // Use the index as the id (you may need a better strategy depending on your data)
      ...row,
    })
  );
  const [comparisonData, setComparisonData] = useState({
    totalEmployees: 0,
    presentEmployees: 0,
    absentEmployees: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/compareData`);
        setComparisonData(response.data);
      } catch (error) {
        console.error("Error fetching comparison data:", error);
      }
    };

    fetchData();
  }, []);

  const { totalEmployees, presentEmployees, absentEmployees } = comparisonData;

  // Calculate percentage for the doughnut chart
  const total = presentEmployees + absentEmployees;
  // const presentPercentage = ((idleBillableCount + idleNonBillableCount + productionCount) / totalEmployees) * 100;
  // const absentPercentage = ((totalEmployees - (idleBillableCount + idleNonBillableCount + productionCount)) / totalEmployees) * 100;
  const presentCount =
    idleBillableCount + idleNonBillableCount + productionCount;
  const absentCount = totalEmployees - presentCount;
  // Prepare data for the Doughnut chart
  const doughnutChartData = {
    labels: ["Present", "Absent"],
    datasets: [
      {
        // data: [presentPercentage, absentPercentage],
        data: [presentCount, absentCount],
        backgroundColor: ["#38812F", "#F33C51"],
        hoverBackgroundColor: ["#38812F", "#F04F62"],
      },
    ],
  };

  const calculateAttendanceData = () => {
    let totalAttendance = 0;
    let presentCount = 0;
    let absentCount = 0;

    if (selectedProject) {
      totalAttendance = batchValue;
      presentCount = totalProductionCount + totalIdleCount;
      absentCount = totalAttendance - presentCount;
    } else if (selectedTeam) {
      totalAttendance = batchCountByTeam;
      presentCount = totalProductionCount + totalIdleCount;
      absentCount = totalAttendance - presentCount;
    } else {
      totalAttendance = employeeCount;
      presentCount = totalProductionCount + totalIdleCount;
      absentCount = totalAttendance - presentCount;
    }

    return {
      totalAttendance,
      presentCount,
      absentCount,
    };
  };

  // Get the attendance data
  const attendanceData = calculateAttendanceData();

  // Create pie chart data
  const pieChartDataAtt = {
    labels: [`Present`, `Absent`],
    datasets: [
      {
        data: [
          totalProductionCount + totalIdleCount,
          attendanceData.absentCount,
        ],
        backgroundColor: ["#36a2eb", "#FF6384"],
      },
    ],
  };

  const [data, setData] = useState([]);
  const [dataTwo, setInitialData] = useState([]);
  useEffect(() => {
    axios.get(`${apiUrl}/admin`).then((response) => {
      // Update initial data
      setInitialData(response.data);
      setData(response.data);
    });
  }, []);
  const formattedData = useMemo(() => {
    const reversedData = data.map((row) => ({
      ...row,
      id: row._id,
    }));
    reversedData.reverse();
    return reversedData;
  }, [data]);

  const statusIcons = {
    POC: <SelfImprovementIcon />,
    "NOT-Started": <SelfImprovementIcon />,
    "Training:": <SelfImprovementIcon />,
    "In-Progress": <DirectionsRunIcon />,
    "Completed-Won": <CheckIcon />,
    "Completed-Lost": <CloseIcon />,
  };

  const columnsTwo = [
    { field: "projectname", headerName: "Projectname", flex: 1 },
    { field: "team", headerName: "Department", flex: 1 },
    {
      field: "jobs.managerTeam",
      headerName: "Manager",
      flex: 1,
      renderCell: (params) => (
        <div style={{ padding: "8px" }}>{params.row.jobs?.managerTeam}</div>
      ),
    },
    {
      field: "jobs.status1",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => (
        <div
          style={{
            padding: "2px",
            borderBottom: `5px solid`,
            borderRadius: `5px `,
            color: labelColors[params.row.jobs?.status1],
          }}
        >
          {statusIcons[params.row.jobs?.status1]}
          {params.row.jobs?.status1}
        </div>
      ),
    },
  ];

  const calculateProductionCount = () => {
    // Add your logic here to calculate the production count
    // For example, you might fetch the production count from your state or API
    // Include both idleBillable and totalProductionCount in the calculation
    return (
      (idleBillableCount + totalProductionCount) /
      differenceInDaysWithoutWeekends
    ); // Return the calculated production count
  };

  // Function to calculate idle count excluding idleBillable
  const calculateIdleCount = () => {
    // Add your logic here to calculate the idle count
    // For example, you might fetch the idle count from your state or API
    // Exclude idleBillableCount from the calculation
    return idleNonBillableCount / differenceInDaysWithoutWeekends; // Return the calculated idle count
  };

  //   const calculateDifferenceInDaysWithData = () => {
  //     // Filter data to include only dates within the selected range
  //     const filteredData = data.filter(item => {
  //       const itemDate = new Date(item._id.date);
  //       return itemDate >= startDate && itemDate <= endDate;
  //     });

  //     // Get unique dates from the filtered data
  //     const uniqueDatesWithData = [...new Set(filteredData.map(item => item._id.date))];

  //     // Calculate the earliest and latest dates with data
  //     const earliestDateWithData = new Date(Math.min(...uniqueDatesWithData));
  //     const latestDateWithData = new Date(Math.max(...uniqueDatesWithData));

  // // Determine the actual start and end dates based on data availability, user selection, and input dates
  // const actualStartDate = (selectedProject || selectedTeam || startDate) ? startDate : earliestDateWithData;
  // const actualEndDate = (selectedProject || selectedTeam || endDate) ? endDate : latestDateWithData;

  // // Calculate the difference in days between the actual start and end dates
  // const differenceInMs = actualEndDate.getTime() - actualStartDate.getTime();
  // const differenceInDays = differenceInMs / (1000 * 3600 * 24);

  //     return differenceInDays;
  //   };

  //   // Calculate difference in days based on available data range and user selection
  //   const differenceInDays = calculateDifferenceInDaysWithData();

  // const differenceInMs = endDate.getTime() - startDate.getTime();

  // // Convert the difference to days
  // const differenceInDays = differenceInMs / (1000 * 3600 * 24);

  // // Calculate the average production count per day
  // const averageProductionCountPerDay = ((idleBillableCount + totalProductionCount) / differenceInDays).toFixed(2);

  // // Calculate the average idle count per day
  // const averageIdleCountPerDay = (idleNonBillableCount / differenceInDays).toFixed(2);

  const calculateDifferenceInDaysWithoutWeekends = (startDate, endDate) => {
    let differenceInDays = 0;
    let currentDate = new Date(startDate);

    // Loop through each day between the start and end dates
    while (currentDate <= endDate) {
      // Check if the current day is not a Saturday (6) or Sunday (0)
      if (currentDate.getDay() !== 6 && currentDate.getDay() !== 0) {
        differenceInDays++;
      }
      // Move to the next day
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return differenceInDays;
  };
  const earliestDateWithData = new Date(
    Math.min(...data.map((item) => new Date(item._id.date)))
  );
  const latestDateWithData = new Date(
    Math.max(...data.map((item) => new Date(item._id.date)))
  );

  // Determine the actual start and end dates based on data availability and user selection
  const actualStartDate =
    selectedProject || selectedTeam || startDate
      ? startDate
      : earliestDateWithData;
  const actualEndDate =
    selectedProject || selectedTeam || endDate ? endDate : latestDateWithData;

  // Calculate the difference in days excluding weekends
  const differenceInDaysWithoutWeekends =
    calculateDifferenceInDaysWithoutWeekends(actualStartDate, actualEndDate);

  // Calculate the average production count per day
  const averageProductionCountPerDay = (
    (idleBillableCount + totalProductionCount) /
    differenceInDaysWithoutWeekends
  ).toFixed(2);

  // Calculate the average idle count per day
  const averageIdleCountPerDay = (
    idleNonBillableCount / differenceInDaysWithoutWeekends
  ).toFixed(2);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Grid container spacing={2}>
        <Grid item xs={12} md={12}>
          <MDButton
            variant="outlined"
            color="success"
            sx={{
              width: "fit-content",
              display: "flex",
              alignItems: "center",
              padding: "7px 7px", // Adjust top and bottom padding
              marginLeft: "auto",
              minHeight: "0px", // Adjust the height as needed
            }}
            onClick={exportChartDataToExcel}
          >
            Export Analytics
          </MDButton>
          {/* Filters Container */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mt={1}
            mb={2}
            p={0}
          >
            {/* Start Date Filter */}
            <Grid item xs={12} md={3}>
              <TextField
                label="Start Date"
                sx={{
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                  width: "98%",
                }}
                type="date"
                value={startDate.toISOString().split("T")[0]}
                onChange={(event) => setStartDate(new Date(event.target.value))}
                fullWidth
                variant="outlined"
                color="secondary"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                label="End Date"
                type="date"
                sx={{
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                  marginLeft: "5px",
                }}
                value={endDate.toISOString().split("T")[0]}
                onChange={(event) => setEndDate(new Date(event.target.value))}
                fullWidth
                variant="outlined"
                color="secondary"
              />
            </Grid>
            <Grid item xs={12} md={3} sx={{ padding: "8px", margin: "0 9px" }}>
              <Autocomplete
                value={selectedTeam}
                onChange={handleTeamChange}
                options={teams}
                sx={{
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                  width: "103%",
                  "& .MuiOutlinedInput-root": {
                    padding: 0.5,
                  },
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Team"
                    fullWidth
                    variant="outlined"
                    color="secondary"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={3} sx={{ padding: "8px" }}>
              <Autocomplete
                value={selectedProject}
                onChange={handleProjectChange}
                options={selectedTeam ? teamProjects : allProjectNames}
                sx={{
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                  "& .MuiOutlinedInput-root": {
                    padding: 0.6,
                  },
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Project Name"
                    fullWidth
                    variant="outlined"
                    color="secondary"
                  />
                )}
              />
            </Grid>
          </Box>
        </Grid>


        {/* <Grid container spacing={3}> */}
      <Grid item xs={12} md={6} lg={3}>
        <MDBox mb={1.5}>
          <ComplexStatisticsCard
            color="primary"
            icon={<GroupIcon />}
            title="Employees"
            count={
              selectedProject !== null
                ? batchValue !== null
                  ? batchValue
                  : "Loading..."
                : selectedTeam !== null
                ? batchCountByTeam !== null
                  ? batchCountByTeam
                  : "Loading..."
                : employeeCount !== null
                ? employeeCount
                : "Loading..."
            }
            percentage={{
              color: "success",
              amount: "",
              label: "Total Employees",
            }}
          />
        </MDBox>
      </Grid>
      <Grid item xs={12} md={6} lg={3}>
        <MDBox mb={1.5}>
          <ComplexStatisticsCard
            icon="more_time"
title="Production"
            count={`${idleBillableCount + totalProductionCount}`}
            percentage={{
              color: "success",
              amount: "",
          label: `${averageProductionCountPerDay}% Average `,
            }}
          />
        </MDBox>
      </Grid>
      <Grid item xs={12} md={6} lg={3}>
        <MDBox mb={1.5}>
          <ComplexStatisticsCard
            color="warning"
            icon="work_history"
            title="Idle Count"
            count={`${idleNonBillableCount}`}
            percentage={{
              color: "success",
              amount: "",
              label: `  ${averageIdleCountPerDay}% Average `,
            }}
          />
        </MDBox>
      </Grid>
      {/* <Grid item xs={12} md={6} lg={3}>
        <MDBox mb={1.5}>
          <ComplexStatisticsCard
            color="success"
            icon={<AccessTimeIcon />}
            title="Working Time"
            count={`${idleNonBillableCount}hr:${idleNonBillableCount}min`}
            percentage={{
              color: "success",
              amount: "",
              label: " over all  working Time",
            }}
          />
        </MDBox>
      </Grid> */}
  <Grid item xs={12} md={6} lg={3}>
        <MDBox mb={1.5}>
          <ComplexStatisticsCard
            color="secondary"
            icon={<WorkIcon />}
            title="Projects"
            count={
              selectedTeam ? teamProjects.length : allProjectNames.length
            }
            percentage={{
              color: "success",
              amount: "",
              label: " over all  Projects",
            }}
          />
        </MDBox>
      </Grid>
    {/* </Grid> */}
 


        <Grid item xs={12} md={4}>
          <MemoizedDoughnutChart pieChartDataAtt={pieChartDataAtt} />
        </Grid>
        <Grid item xs={12} md={4}>
          <MemoizedBillingChart pieChartData={pieChartData} />
        </Grid>
        <Grid item xs={12} md={4}>
          <MemoizedProjectStatusChart pieChartData1={pieChartData1} />
        </Grid>

        {/* DataGrid table */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              title={<h3 style={{ fontSize: "17px" }}>Latest task report</h3>}
            />
            <CardContent>
              <div
                style={{
                  height: 330,
                  width: "100%",
                  // marginTop: '20px',
                  backgroundColor: "#fff",
                }}
              >
                <DataGrid
                  rows={tableData}
                  columns={[
                    { field: "id", headerName: "ID", width: 30 },
                    { field: "task", headerName: "Task", width: 200, flex: 1 },
                    {
                      field: "count",
                      headerName: "Employee Count",
                      width: 150,
                      flex: 1,
                      backgroundColor:
                        "#eff1f4" /* Set your desired background color */,
                    },
                    // Include a new column for the count
                  ]}
                  pageSize={4}
                  rowsPerPageOptions={[4, 8, 16]}
                  pagination
                />
              </div>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              title={
                <h3 style={{ fontSize: "17px" }}>Latest project report</h3>
              }
            />
            <CardContent>
              <div
                style={{
                  height: 330,
                  width: "100%",
                  // marginTop: "20px",
                  backgroundColor: "#fff",
                }}
              >
                <DataGrid
                  rows={formattedData}
                  getRowId={(row) => row._id}
                  columns={columnsTwo}
                  rowsPerPageOptions={[5, 10, 25, 50, 100]}
                />
              </div>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={12}>
          <Card>
            <CardHeader
              title={<h3 style={{ fontSize: "17px" }}>Task Report Status</h3>}
            />
            <CardContent>
              <MemoizedBarChart chartData={chartData} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </DashboardLayout>
  );
};

export default TaskWiseBarChart;
