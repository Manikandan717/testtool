import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { ToastContainer, toast } from "react-toastify";
import IconButton from "@mui/material/IconButton";
// import AddIcon from "@mui/icons-material/Add";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import InputLabel from "@mui/material/InputLabel";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useSelector } from 'react-redux';

const TaskCreation = () => {

  const name = useSelector((state) => state.auth.user.name);

  const isParthibanU = name === 'Mohamed Afsar M I';
  const isSuperadmin = name === 'Super Admin';

  const apiUrl = 'https://9tnby7zrib.execute-api.us-east-1.amazonaws.com/test/Emp';

 
    const [annotator, setAnnotator] = useState({
      createAnnotator: '',
      createName: ''
    });
  
    const [annotatorDataMain, setAnnotatorDataMain] = useState([]);
  
    useEffect(() => {
      axios.get(`${apiUrl}/fetch/annotatordata`).then((response) => {
        setAnnotatorDataMain(response.data);
      });
    }, []);
  
    const handleInputChangeMain = (e) => {
      const { name, value } = e.target;
      setAnnotator({
        ...annotator,
        [name]: value,
      });
    };
  
    const handleSubmitMain = () => {
      if (!annotator.createAnnotator || !annotator.createName) {
        toast.error('Both fields are required');
        return;
      }
  
      axios
        .post(`${apiUrl}/add-annotator`, annotator)
        .then((res) => {
          toast.success(res.data);
          axios.get(`${apiUrl}/fetch/annotatordata`).then((response) => {
            setAnnotatorDataMain(response.data);
          });
          updateDataTwo();
          setAnnotator({
        createAnnotator: '',
      createName: ''
          });
        })
        .catch((err) => toast.error(err));
    };
  

    const handleDelete = (id) => {
      axios
        .delete(`${apiUrl}/delete/annotator/` + id)
        .then((res) => {
          toast.success(res.data);
          axios.get(`${apiUrl}/fetch/annotatordata`).then((response) => {
            setAnnotatorDataMain(response.data);
          });
          updateDataTwo();
          setAnnotator({
        createAnnotator: '',
      createName: ''
          });
        })
        .catch((err) => console.log(err));
    };
  
    const updateDataTwo = () => {
      axios.get(`${apiUrl}/fetch/annotatordata`).then((response) => {
        setAnnotatorData(response.data);
      });
    };
  
  const [task, setTask] = useState({
    createTask: "",
  });

  const [addManager, setAddManager] = useState({
    createManager: "",
  });

  const [addTeam, setAddTeam] = useState({
    createTeam: "",
  });
  // const [addAnnotator, setAddAnnotator] = useState({
  //   createAnnotator: "",
  // });
  // const [addAnnotatorName, setAddAnnotatorName] = useState({
  //   createName: "",
  // });
  const [addDecRes, setAddDecRes] = useState({
    createDecReason: "",
  });
  const [addOverPref, setAddOverPref] = useState({
    createOverPref: "",
  });
  const [addOverRank, setAddOverRank] = useState({
    createOverRank: "",
  });
  const [addResOne, setAddResOne] = useState({
    createResOne: "",
  });
  const [addResTwo, setAddResTwo] = useState({
    createResTwo: "",
  });
  const [addHarmPref, setAddHarmPref] = useState({
    createHarmPref: "",
  });
  const [addHarmRank, setAddHarmRank] = useState({
    createHarmRank: "",
  });
  const [addHonestPref, setAddHonestPref] = useState({
    createHonestPref: "",
  });
  const [addHonestRank, setAddHonestRank] = useState({
    createHonestRank: "",
  });
  const [addHelpPref, setAddHelpPref] = useState({
    createHelpPref: "",
  });
  const [addHelpRank, setAddHelpRank] = useState({
    createHelpRank: "",
  });

  const [annotatorData, setAnnotatorData] = useState([]);
  const [annotatorNameData, setAnnotatorNameData] = useState([]);
  const [annDecResData, setAnnDecResData] = useState([]);
  const [annOverRef, setAnnOverRef] = useState([]);
  const [annOverRank, setAnnOverRank] = useState([]);
  const [annResOne, setAnnResOne] = useState([]);
  const [annResTwo, setAnnResTwo] = useState([]);
  const [annHarmPref, setAnnHarmPref] = useState([]);
  const [annHarmRank, setAnnHarmRank] = useState([]);
  const [annHonestPref, setAnnHonestPref] = useState([]);
  const [annHonestRank, setAnnHonestRank] = useState([]);
  const [annHelpPref, setAnnHelpPref] = useState([]);
  const [annHelpRank, setAnnHelpRank] = useState([]);
  const [taskData, setTaskData] = useState([]);
  const [teamData, setTeamData] = useState([]);
  const [managerData, setManagerData] = useState([]);

  const fetchData = () => {
    axios.get(`${apiUrl}/fetch/annotatordata`).then((response) => {
      setAnnotatorData(response.data);
    });
    axios.get(`${apiUrl}/fetch/task-data`).then((response) => {
      setTaskData(response.data);
    });
  
    axios.get(`${apiUrl}/fetch/addteam-data`).then((response) => {
      setTeamData(response.data);
    });
  
    axios.get(`${apiUrl}/fetch/manager-data`).then((response) => {
      setManagerData(response.data);
    });
  
    axios.get(`${apiUrl}/fetch/annotator-data`).then((response) => {
      setAnnotatorData(response.data);
    });
    axios.get(`${apiUrl}/fetch/annotator-name-data`).then((response) => {
      setAnnotatorNameData(response.data);
    });
    axios.get(`${apiUrl}/fetch/decline-task`).then((response) => {
      setAnnDecResData(response.data);
    });
    axios.get(`${apiUrl}/fetch/overall-pref`).then((response) => {
      setAnnOverRef(response.data);
    });
    axios.get(`${apiUrl}/fetch/overall-rank`).then((response) => {
      setAnnOverRank(response.data);
    });
    axios.get(`${apiUrl}/fetch/res-one`).then((response) => {
      setAnnResOne(response.data);
    });
    axios.get(`${apiUrl}/fetch/res-two`).then((response) => {
      setAnnResTwo(response.data);
    });
    axios.get(`${apiUrl}/fetch/harm-pref`).then((response) => {
      setAnnHarmPref(response.data);
    });
    axios.get(`${apiUrl}/fetch/harm-rank`).then((response) => {
      setAnnHarmRank(response.data);
    });
    axios.get(`${apiUrl}/fetch/honest-pref`).then((response) => {
      setAnnHonestPref(response.data);
    });
    axios.get(`${apiUrl}/fetch/honest-rank`).then((response) => {
      setAnnHonestRank(response.data);
    });
    axios.get(`${apiUrl}/fetch/helpful-pref`).then((response) => {
      setAnnHelpPref(response.data);
    });
    axios.get(`${apiUrl}/fetch/helpful-rank`).then((response) => {
      setAnnHelpRank(response.data);
    });
  };
  

  const updateData = () => {
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTask({
      ...task,
      [name]: value,
    });
  };

  const handleInputChangeTwo = (e) => {
    const { name, value } = e.target;
    setAddManager({
      ...addManager,
      [name]: value,
    });
  };

  const handleInputChangeThree = (e) => {
    const { name, value } = e.target;
    setAddTeam({
      ...addTeam,
      [name]: value,
    });
  };


  // const handleInputChangeFour = (e) => {
  //   const { name, value } = e.target;
  //   setAddAnnotator({
  //     ...addAnnotator,
  //     [name]: value,
  //   });
  // };
  
  // const handleInputChangeFive = (e) => {
  //   const { name, value } = e.target;
  //   setAddAnnotatorName({
  //     ...addAnnotatorName,
  //     [name]: value,
  //   });
  // };
  const handleInputChangeSix = (e) => {
    const { name, value } = e.target;
    setAddDecRes({
      ...addDecRes,
      [name]: value,
    });
  };
  const handleInputChangeSeven = (e) => {
    const { name, value } = e.target;
    setAddOverPref({
      ...addOverPref,
      [name]: value,
    });
  };
  const handleInputChangeEight = (e) => {
    const { name, value } = e.target;
    setAddOverRank({
      ...addOverRank,
      [name]: value,
    });
  };
  const handleInputChangeNine = (e) => {
    const { name, value } = e.target;
    setAddResOne({
      ...addResOne,
      [name]: value,
    });
  };
  const handleInputChangeTen = (e) => {
    const { name, value } = e.target;
    setAddResTwo({
      ...addResTwo,
      [name]: value,
    });
  };
  const handleInputChangeEleven= (e) => {
    const { name, value } = e.target;
    setAddHarmPref({
      ...addHarmPref,
      [name]: value,
    });
  };
  const handleInputChangeTwelve = (e) => {
    const { name, value } = e.target;
    setAddHarmRank({
      ...addHarmRank,
      [name]: value,
    });
  };
  const handleInputChangeThirteen = (e) => {
    const { name, value } = e.target;
    setAddHonestPref({
      ...addHonestPref,
      [name]: value,
    });
  };
  const handleInputChangeFourteen = (e) => {
    const { name, value } = e.target;
    setAddHonestRank({
      ...addHonestRank,
      [name]: value,
    });
  };
  const handleInputChangeFifteen = (e) => {
    const { name, value } = e.target;
    setAddHelpPref({
      ...addHelpPref,
      [name]: value,
    });
  };
    const handleInputChangeSixteen = (e) => {
    const { name, value } = e.target;
    setAddHelpRank({
      ...addHelpRank,
      [name]: value,
    });
  };
  const handleSubmit = () => {

    if (!task.createTask) {
      toast.error("Task cannot be empty");
      return;
    }

    const taskData = {
      createTask: task.createTask,
    };

    axios
      .post(`${apiUrl}/task/new`, taskData)
      .then((res) => {
        toast.success(res.data);
        updateData();
        setTask({
          createTask: "",
        });
      })
      .catch((err) => toast.error(err));
  };

  const handleSubmitTwo = () => {

    if (!addManager.createManager) {
      toast.error("Manager cannot be empty");
      return;
    }

    const managerData = {
      createManager: addManager.createManager,
    };

    axios
      .post(`${apiUrl}/add-manager/new`, managerData)
      .then((res) => {
        toast.success(res.data);
        axios.get(`${apiUrl}/fetch/addteam-data`).then((response) => {
          setTeamData(response.data);
        });
        updateData();
        setAddManager({
          createManager: "",
        });
      })
      .catch((err) => toast.error(err));
  };

  const handleSubmitThree = () => {

    if (!addTeam.createTeam) {
      toast.error("Team cannot be empty");
      return;
    }
    
    const teamData = {
      createTeam: addTeam.createTeam,
    };

    axios
      .post(`${apiUrl}/add-team/new`, teamData)
      .then((res) => {
        toast.success(res.data);
        axios.get(`${apiUrl}/fetch/manager-data`).then((response) => {
          setManagerData(response.data);
        });
        updateData();
        setAddTeam({
          createTeam: "",
        });
      })
      .catch((err) => toast.error(err));
  };

  // const handleSubmitFour = () => {
  //   if (!addAnnotator.createAnnotator) {
  //     toast.error("Annotator ID cannot be empty");
  //     return;
  //   }
  
  //   const annotatorData = {
  //     createAnnotator: addAnnotator.createAnnotator,
  //   };
  
  //   axios
  //     .post(`${apiUrl}/add-annotator/new`, annotatorData)
  //     .then((res) => {
  //       toast.success(res.data);
  //       updateData();
  //       setAddAnnotator({
  //         createAnnotator: "",
  //       });
  //     })
  //     .then((res) => {
  //       toast.success(res.data);
  //       axios.get(`${apiUrl}/fetch/annotator-data`).then((response) => {
  //       setAnnotatorData(response.data);
  //       });
  //    updateData();
  //       setAddAnnotator({
  //         createAnnotator: "",
  //       });
  //     })
  //     .catch((err) => toast.error(err));
  // };
  // const handleSubmitFive = () => {
  //   if (!addAnnotatorName.createName) {
  //     toast.error("Annotator ID cannot be empty");
  //     return;
  //   }
  
  //   const annotatorNameData = {
  //     createName: addAnnotatorName.createName,
  //   };
  
  //   axios
  //     .post(`${apiUrl}/add-annotator-name/new`, annotatorNameData)
  //     .then((res) => {
  //       toast.success(res.data);
  //       updateData();
  //       setAddAnnotatorName({
  //         createName: "",
  //       });
  //     })
  //     .then((res) => {
  //       toast.success(res.data);
  //       axios.get(`${apiUrl}/fetch/annotator-name-data`).then((response) => {
  //         setAnnotatorNameData(response.data);
  //       });
  //    updateData();
  //    setAddAnnotatorName({
  //         createName: "",
  //       });
  //     })
  //     .catch((err) => toast.error(err));
  // };
  
  const handleSubmitSix = () => {
    if (!addDecRes.createDecReason) {
      toast.error("Decline Reason cannot be empty");
      return;
    }
  
    const declineRes = {
      createDecReason: addDecRes.createDecReason,
    };
  
    axios
      .post(`${apiUrl}/decline-task`, declineRes)
      .then((res) => {
        toast.success(res.data);
        updateData();
        setAddDecRes({
          createDecReason: "",
        });
      })
      .then((res) => {
        toast.success(res.data);
        axios.get(`${apiUrl}/fetch/decline-task`).then((response) => {
          setAnnDecResData(response.data);
        });
     updateData();
     setAddDecRes({
      createDecReason: "",
        });
      })
      .catch((err) => toast.error(err));
  };

    
  const handleSubmitSeven = () => {
    if (!addOverPref.createOverPref) {
      toast.error("Overall Preference cannot be empty");
      return;
    }
  
    const overPref = {
      createOverPref: addOverPref.createOverPref,
    };
  
    axios
      .post(`${apiUrl}/overall-pref`, overPref)
      .then((res) => {
        toast.success(res.data);
        updateData();
        setAddOverPref({
          createOverPref: "",
        });
      })
      .then((res) => {
        toast.success(res.data);
        axios.get(`${apiUrl}/fetch/overall-pref`).then((response) => {
          setAnnOverRef(response.data);
        });
     updateData();
     setAddOverPref({
      createOverPref: "",
        });
      })
      .catch((err) => toast.error(err));
  };

  const handleSubmitEight = () => {
    if (!addOverRank.createOverRank) {
      toast.error("Overall Ranking cannot be empty");
      return;
    }
  
    const overRank = {
      createOverRank: addOverRank.createOverRank,
    };
  
    axios
      .post(`${apiUrl}/overall-rank`, overRank)
      .then((res) => {
        toast.success(res.data);
        updateData();
        setAddOverRank({
          createOverRank: "",
        });
      })
      .then((res) => {
        toast.success(res.data);
        axios.get(`${apiUrl}/fetch/overall-rank`).then((response) => {
          setAnnOverRank(response.data);
        });
     updateData();
     setAddOverRank({
      createOverRank: "",
        });
      })
      .catch((err) => toast.error(err));
  };
  const handleSubmitNine = () => {
    if (!addResOne.createResOne) {
      toast.error("Response One cannot be empty");
      return;
    }
  
    const overResOne = {
      createResOne: addResOne.createResOne,
    };
  
    axios
      .post(`${apiUrl}/res-one`, overResOne)
      .then((res) => {
        toast.success(res.data);
        updateData();
        setAddResOne({
          createResOne: "",
        });
      })
      .then((res) => {
        toast.success(res.data);
        axios.get(`${apiUrl}/fetch/res-one`).then((response) => {
          setAnnResOne(response.data);
        });
     updateData();
     setAddResOne({
      createResOne: "",
        });
      })
      .catch((err) => toast.error(err));
  };
  const handleSubmitTen = () => {
    if (!addResTwo.createResTwo) {
      toast.error("Response Two cannot be empty");
      return;
    }
  
    const overResTwo = {
      createResTwo: addResTwo.createResTwo,
    };
  
    axios
      .post(`${apiUrl}/res-two`, overResTwo)
      .then((res) => {
        toast.success(res.data);
        updateData();
        setAddResTwo({
          createResTwo: "",
        });
      })
      .then((res) => {
        toast.success(res.data);
        axios.get(`${apiUrl}/fetch/res-two`).then((response) => {
          setAnnResTwo(response.data);
        });
     updateData();
     setAddResTwo({
      createResTwo: "",
        });
      })
      .catch((err) => toast.error(err));
  };
  const handleSubmitEleven = () => {
    if (!addHarmPref.createHarmPref) {
      toast.error("Harmless Preference cannot be empty");
      return;
    }
  
    const harmPref = {
      createHarmPref: addHarmPref.createHarmPref,
    };
  
    axios
      .post(`${apiUrl}/harm-pref`, harmPref)
      .then((res) => {
        toast.success(res.data);
        updateData();
        setAddHarmPref({
          createHarmPref: "",
        });
      })
      .then((res) => {
        toast.success(res.data);
        axios.get(`${apiUrl}/fetch/harm-pref`).then((response) => {
          setAddHarmPref(response.data);
        });
     updateData();
     setAddHarmPref({
      createHarmPref: "",
        });
      })
      .catch((err) => toast.error(err));
  };
  const handleSubmitTwelve = () => {
    if (!addHarmRank.createHarmRank) {
      toast.error("Harmless Ranking cannot be empty");
      return;
    }
  
    const harmRank = {
      createHarmRank: addHarmRank.createHarmRank,
    };
  
    axios
      .post(`${apiUrl}/harm-rank`, harmRank)
      .then((res) => {
        toast.success(res.data);
        updateData();
        setAddHarmRank({
          createHarmRank: "",
        });
      })
      .then((res) => {
        toast.success(res.data);
        axios.get(`${apiUrl}/fetch/harm-rank`).then((response) => {
          setAddHarmRank(response.data);
        });
     updateData();
     setAddHarmRank({
      createHarmRank: "",
        });
      })
      .catch((err) => toast.error(err));
  };
  const handleSubmitThirteen = () => {
    if (!addHonestPref.createHonestPref) {
      toast.error("Honest Preference cannot be empty");
      return;
    }
  
    const honestPref = {
      createHonestPref: addHonestPref.createHonestPref,
    };
  
    axios
      .post(`${apiUrl}/honest-pref`, honestPref)
      .then((res) => {
        toast.success(res.data);
        updateData();
        setAddHonestPref({
          createHonestPref: "",
        });
      })
      .then((res) => {
        toast.success(res.data);
        axios.get(`${apiUrl}/fetch/honest-pref`).then((response) => {
          setAddHonestPref(response.data);
        });
     updateData();
     setAddHonestPref({
      createHonestPref: "",
        });
      })
      .catch((err) => toast.error(err));
  };
  const handleSubmitFourteen = () => {
    if (!addHonestRank.createHonestRank) {
      toast.error("Honest Ranking cannot be empty");
      return;
    }
  
    const honestRank = {
      createHonestRank: addHonestRank.createHonestRank,
    };
  
    axios
      .post(`${apiUrl}/honest-rank`, honestRank)
      .then((res) => {
        toast.success(res.data);
        updateData();
        setAddHonestRank({
          createHonestRank: "",
        });
      })
      .then((res) => {
        toast.success(res.data);
        axios.get(`${apiUrl}/fetch/honest-rank`).then((response) => {
          setAddHonestRank(response.data);
        });
     updateData();
     setAddHonestRank({
      createHonestRank: "",
        });
      })
      .catch((err) => toast.error(err));
  };
  const handleSubmitFifteen = () => {
    if (!addHelpPref.createHelpPref) {
      toast.error("Helpfull Preference cannot be empty");
      return;
    }
  
    const helpPref = {
      createHelpPref: addHelpPref.createHelpPref,
    };
  
    axios
      .post(`${apiUrl}/helpful-pref`, helpPref)
      .then((res) => {
        toast.success(res.data);
        updateData();
        setAddHonestRank({
          createHelpPref: "",
        });
      })
      .then((res) => {
        toast.success(res.data);
        axios.get(`${apiUrl}/fetch/helpful-pref`).then((response) => {
          setAddHelpPref(response.data);
        });
     updateData();
     setAddHelpPref({
      createHelpPref: "",
        });
      })
      .catch((err) => toast.error(err));
  };
  const handleSubmitSixteen = () => {
    if (!addHelpRank.createHelpRank) {
      toast.error("Helpfull Ranking cannot be empty");
      return;
    }
  
    const helpRank = {
      createHelpRank: addHelpRank.createHelpRank,
    };
  
    axios
      .post(`${apiUrl}/helpful-rank`, helpRank)
      .then((res) => {
        toast.success(res.data);
        updateData();
        setAddHelpRank({
          createHelpRank: "",
        });
      })
      .then((res) => {
        toast.success(res.data);
        axios.get(`${apiUrl}/fetch/helpful-rank`).then((response) => {
          setAddHelpRank(response.data);
        });
     updateData();
     setAddHelpRank({
      createHelpRank: "",
        });
      })
      .catch((err) => toast.error(err));
  };
  const handleDeleteTask = (id) => {
    axios
      .delete(`${apiUrl}/delete/task/` + id)
      .then((res) => {
        toast.warn(res.data);
        updateData();
      })
      .catch((err) => console.log(err));
  };

  const handleDeleteManager = (id) => {
    axios
      .delete(`${apiUrl}/delete/manager/` + id)
      .then((res) => {
        toast.warn(res.data);
        updateData();
      })
      .catch((err) => console.log(err));
  };

  const handleDeleteTeam = (id) => {
    axios
      .delete(`${apiUrl}/delete/team/` + id)
      .then((res) => {
        toast.warn(res.data);
        updateData();
      })
      .catch((err) => console.log(err));
  };
  

  const handleDeleteAnnotator = (id) => {
    axios
      .delete(`${apiUrl}/delete/annotator/` + id)
      .then((res) => {
        toast.warn(res.data);
        updateData();
      })
      .catch((err) => console.log(err));
  };

  
  const handleDeleteAnnotatorName = (id) => {
    axios
      .delete(`${apiUrl}/delete/annotator-name/` + id)
      .then((res) => {
        toast.warn(res.data);
        updateData();
      })
      .catch((err) => console.log(err));
  };

  const handleDeleteDecRes = (id) => {
    axios
      .delete(`${apiUrl}/delete/decline-task/` + id)
      .then((res) => {
        toast.warn(res.data);
        updateData();
      })
      .catch((err) => console.log(err));
  };
  const handleDeleteOverPref = (id) => {
    axios
      .delete(`${apiUrl}/delete/overall-pref/` + id)
      .then((res) => {
        toast.warn(res.data);
        updateData();
      })
      .catch((err) => console.log(err));
  };
  
  const handleDeleteOverRank = (id) => {
    axios
      .delete(`${apiUrl}/delete/overall-rank/` + id)
      .then((res) => {
        toast.warn(res.data);
        updateData();
      })
      .catch((err) => console.log(err));
  };
  
  const handleDeleteResOne = (id) => {
    axios
      .delete(`${apiUrl}/delete/res-one/` + id)
      .then((res) => {
        toast.warn(res.data);
        updateData();
      })
      .catch((err) => console.log(err));
  };
  const handleDeleteResTwo = (id) => {
    axios
      .delete(`${apiUrl}/delete/res-two/` + id)
      .then((res) => {
        toast.warn(res.data);
        updateData();
      })
      .catch((err) => console.log(err));
  };
  const handleDeleteHarmPref = (id) => {
    axios
      .delete(`${apiUrl}/delete/harm-pref/` + id)
      .then((res) => {
        toast.warn(res.data);
        updateData();
      })
      .catch((err) => console.log(err));
  };
  const handleDeleteHarmRank = (id) => {
    axios
      .delete(`${apiUrl}/delete/harm-rank/` + id)
      .then((res) => {
        toast.warn(res.data);
        updateData();
      })
      .catch((err) => console.log(err));
  };
  const handleDeleteHonestPref = (id) => {
    axios
      .delete(`${apiUrl}/delete/honest-pref/` + id)
      .then((res) => {
        toast.warn(res.data);
        updateData();
      })
      .catch((err) => console.log(err));
  };
  const handleDeleteHonestRank = (id) => {
    axios
      .delete(`${apiUrl}/delete/honest-rank/` + id)
      .then((res) => {
        toast.warn(res.data);
        updateData();
      })
      .catch((err) => console.log(err));
  };
  const handleDeleteHelpPref = (id) => {
    axios
      .delete(`${apiUrl}/delete/helpful-pref/` + id)
      .then((res) => {
        toast.warn(res.data);
        updateData();
      })
      .catch((err) => console.log(err));
  };
  const handleDeleteHelpRank = (id) => {
    axios
      .delete(`${apiUrl}/delete/helpful-rank/` + id)
      .then((res) => {
        toast.warn(res.data);
        updateData();
      })
      .catch((err) => console.log(err));
  };
  
  
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Grid
        container
        justifyContent="center"
        alignItems="top"
        style={{ height: "80vh" }}
        spacing={4}
      >
        {/* Task Section */}
        {isSuperadmin && (
          <Grid item xs={4}>
            <Card>
              <Box p={2}>
                <InputLabel
                  sx={{ ml: 1, mb: 1, fontWeight: "bolder", fontSize: "17px" }}
                  htmlFor="add-task"
                >
                  Add Task
                </InputLabel>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <TextField
                    name="createTask"
                    id="add-task"
                    value={task.createTask}
                    onChange={handleInputChange}
                    variant="outlined"
                    fullWidth
                    style={{ marginRight: "10px" }}
                    required
                  />
                  <IconButton
                    style={{ background: "#4caf50", borderRadius: "5px" }}
                    onClick={() => {
                      handleSubmit();
                      updateData();
                    }}
                  >
                    <InputLabel
                      sx={{
                        fontWeight: "bolder",
                        color: "#fff",
                        mt: 0.5,
                        padding: "5px",
                      }}
                      htmlFor="add-team"
                    >
                      ADD
                    </InputLabel>
                  </IconButton>
                </div>
                <ul
                  style={{
                    listStyleType: "none",
                    paddingTop: 10,
                    paddingLeft: 15,
                    paddingRight: 15,
                    maxHeight: "35vh",
                    overflowY: "auto",
                  }}
                >
                  {taskData.slice(0).map((task) => (
                    <li
                      key={task._id}
                      style={{
                        borderBottom: "2px solid #f0f0f0",
                        padding: "3px",
                        borderRadius: "5px",
                        marginBottom: "5px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {task.createTask}
                      <span
                        style={{
                          cursor: "pointer",
                          marginLeft: "10px",
                          color: "red",
                        }}
                        onClick={() => handleDeleteTask(task._id)}
                      >
                        &#x1F5D1;
                      </span>
                    </li>
                  ))}
                </ul>
              </Box>
            </Card>
          </Grid>
        )}

        {/* Manager Section */}
        {isSuperadmin && (
          <Grid item xs={4}>
            <Card>
              <Box p={2}>
                <InputLabel
                  sx={{ ml: 1, mb: 1, fontWeight: "bolder", fontSize: "17px" }}
                  htmlFor="add-manager"
                >
                  Add Manager
                </InputLabel>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <TextField
                    name="createManager"
                    id="add-manager"
                    value={addManager.createManager}
                    onChange={handleInputChangeTwo}
                    variant="outlined"
                    fullWidth
                    style={{ marginRight: "10px" }}
                    required
                  />
                  <IconButton
                    style={{ background: "#4caf50", borderRadius: "5px" }}
                    onClick={() => {
                      handleSubmitTwo();
                      updateData();
                    }}
                  >
                    <InputLabel
                      sx={{
                        fontWeight: "bolder",
                        color: "#fff",
                        mt: 0.5,
                        padding: "5px",
                      }}
                      htmlFor="add-team"
                    >
                      ADD
                    </InputLabel>
                  </IconButton>
                </div>
                <ul
                  style={{
                    listStyleType: "none",
                    paddingTop: 10,
                    paddingLeft: 15,
                    paddingRight: 15,
                    maxHeight: "35vh",
                    overflowY: "auto",
                  }}
                >
                  {managerData.slice(0).map((manager) => (
                    <li
                      key={manager._id}
                      style={{
                        borderBottom: "2px solid #f0f0f0",
                        padding: "3px",
                        borderRadius: "5px",
                        marginBottom: "5px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {manager.createManager}
                      <span
                        style={{
                          cursor: "pointer",
                          marginLeft: "10px",
                          color: "red",
                        }}
                        onClick={() => handleDeleteManager(manager._id)}
                      >
                        &#x1F5D1;
                      </span>
                    </li>
                  ))}
                </ul>
              </Box>
            </Card>
          </Grid>
        )}
        {/* Team Section */}
        {isSuperadmin && (
          <Grid item xs={4}>
            <Card>
              <Box p={2}>
                <InputLabel
                  sx={{ ml: 1, mb: 1, fontWeight: "bolder", fontSize: "17px" }}
                  htmlFor="add-team"
                >
                  Add Team
                </InputLabel>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <TextField
                    name="createTeam"
                    id="add-team"
                    value={addTeam.createTeam}
                    onChange={handleInputChangeThree}
                    variant="outlined"
                    fullWidth
                    style={{ marginRight: "10px" }}
                    required
                  />
                  <IconButton
                    style={{ background: "#4caf50", borderRadius: "5px" }}
                    onClick={() => {
                      handleSubmitMain();
                      updateDataTwo();
                    }}
                  >
                    {/* <InputLabel sx={{  fontWeight: 'bolder', color: '#fff', mt:0.5 }} htmlFor="add-team">
              ADD
            </InputLabel><AddIcon style={{ color: "white" }} /> */}
                    <InputLabel
                      sx={{
                        fontWeight: "bolder",
                        color: "#fff",
                        mt: 0.5,
                        padding: "5px",
                      }}
                      htmlFor="add-team"
                    >
                      ADD
                    </InputLabel>
                  </IconButton>
                </div>
                <ul
                  style={{
                    listStyleType: "none",
                    paddingTop: 10,
                    paddingLeft: 15,
                    paddingRight: 15,
                    maxHeight: "35vh",
                    overflowY: "auto",
                  }}
                >
                  {teamData.slice(0).map((team) => (
                    <li
                      key={team._id}
                      style={{
                        borderBottom: "2px solid #f0f0f0",
                        padding: "3px",
                        borderRadius: "5px",
                        marginBottom: "5px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {team.createTeam}
                      <span
                        style={{
                          cursor: "pointer",
                          marginLeft: "10px",
                          color: "red",
                        }}
                        onClick={() => handleDeleteTeam(team._id)}
                      >
                        &#x1F5D1;
                      </span>
                    </li>
                  ))}
                </ul>
              </Box>
            </Card>
          </Grid>
        )}
     <Grid container spacing={2} sx={{ mt: 3, mb: 3, ml: 1 }}>
  {/* First Row */}
  {isParthibanU && (
    <>
      <Grid item xs={12} sm={6} md={8}>
        <Card>
          <Box p={2} sx={{ width: '100%', height: '100%' }}>
            <InputLabel
              sx={{
                ml: 1,
                mb: 1,
                fontWeight: 'bolder',
                fontSize: '17px',
              }}
              htmlFor="add-annotator"
            >
              Add Annotator Id and Name
            </InputLabel>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <TextField
                name="createAnnotator"
                id="add-annotator"
                value={annotator.createAnnotator}
                onChange={handleInputChangeMain}
                variant="outlined"
                fullWidth
                style={{ marginRight: '10px' }}
                required
              />
              <TextField
                name="createName"
                id="add-annotator-name"
                value={annotator.createName}
                onChange={handleInputChangeMain}
                variant="outlined"
                fullWidth
                style={{ marginRight: '10px' }}
                required
              />
              <IconButton
                style={{ background: '#4caf50', borderRadius: '5px' }}
                onClick={handleSubmitMain}
              >
                <InputLabel
                  sx={{
                    fontWeight: 'bolder',
                    color: '#fff',
                    mt: 0.5,
                    padding: '5px',
                  }}
                  htmlFor="add-annotator"
                >
                  ADD
                </InputLabel>
              </IconButton>
            </div>
            <ul
              style={{
                listStyleType: 'none',
                paddingTop: 10,
                paddingLeft: 15,
                paddingRight: 15,
                maxHeight: '35vh',
                overflowY: 'auto',
              }}
            >
              {annotatorDataMain.map((annotator) => (
                <li
                  key={annotator._id}
                  style={{
                    borderBottom: '2px solid #f0f0f0',
                    padding: '3px',
                    borderRadius: '5px',
                    marginBottom: '5px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {annotator.createAnnotator} - {annotator.createName}
                  <span
                    style={{
                      cursor: 'pointer',
                      marginLeft: '10px',
                      color: 'red',
                    }}
                    onClick={() => handleDelete(annotator._id)}
                  >
                    &#x1F5D1;
                  </span>
                </li>
              ))}
            </ul>
          </Box>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
        <Card>
          <Box p={2} sx={{ width: '100%', height: '100%' }}>
            <InputLabel
              sx={{
                ml: 1,
                mb: 1,
                fontWeight: 'bolder',
                fontSize: '17px',
              }}
              htmlFor="Dec-Res"
            >
              Add Deline Reason
            </InputLabel>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <TextField
                name="createDecReason"
                id="Dec-Res"
                value={addDecRes.createDecReason}
                onChange={handleInputChangeSix}
                variant="outlined"
                fullWidth
                style={{ marginRight: '10px' }}
                required
              />
              <IconButton
                style={{ background: '#4caf50', borderRadius: '5px' }}
                onClick={() => {
                  handleSubmitSix();
                  updateData();
                }}
              >
                <InputLabel
                  sx={{
                    fontWeight: 'bolder',
                    color: '#fff',
                    mt: 0.5,
                    padding: '5px',
                  }}
                  htmlFor="add-annotator"
                >
                  ADD
                </InputLabel>
              </IconButton>
            </div>
            <ul
              style={{
                listStyleType: 'none',
                paddingTop: 10,
                paddingLeft: 15,
                paddingRight: 15,
                maxHeight: '35vh',
                overflowY: 'auto',
              }}
            >
              {annDecResData.slice(0).map((annDec) => (
                <li
                  key={annDec._id}
                  style={{
                    borderBottom: '2px solid #f0f0f0',
                    padding: '3px',
                    borderRadius: '5px',
                    marginBottom: '5px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {annDec.createDecReason}
                  <span
                    style={{
                      cursor: 'pointer',
                      marginLeft: '10px',
                      color: 'red',
                    }}
                    onClick={() => handleDeleteDecRes(annDec._id)}
                  >
                    &#x1F5D1;
                  </span>
                </li>
              ))}
            </ul>
          </Box>
        </Card>
      </Grid>
    </>
  )}
</Grid>


        <Grid container spacing={2} sx={{ mt: 4, mb: 4, ml: 1 }}>
          {/* Third Row */}
          {isParthibanU && (
            <Grid container item xs={12} spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <Card>
                  <Box p={2}>
                    <InputLabel
                      sx={{
                        ml: 1,
                        mb: 1,
                        fontWeight: "bolder",
                        fontSize: "17px",
                      }}
                      htmlFor="Over-Pref"
                    >
                      Add Overall Preference
                    </InputLabel>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <TextField
                        name="createOverPref"
                        id="Over-Pref"
                        value={addOverPref.createOverPref}
                        onChange={handleInputChangeSeven}
                        variant="outlined"
                        fullWidth
                        style={{ marginRight: "10px" }}
                        required
                      />
                      <IconButton
                        style={{ background: "#4caf50", borderRadius: "5px" }}
                        onClick={() => {
                          handleSubmitSeven();
                          updateData();
                        }}
                      >
                        <InputLabel
                          sx={{
                            fontWeight: "bolder",
                            color: "#fff",
                            mt: 0.5,
                            padding: "5px",
                          }}
                          htmlFor="add-annotator"
                        >
                          ADD
                        </InputLabel>
                      </IconButton>
                    </div>
                    <ul
                      style={{
                        listStyleType: "none",
                        paddingTop: 10,
                        paddingLeft: 15,
                        paddingRight: 15,
                        maxHeight: "35vh",
                        overflowY: "auto",
                      }}
                    >
                      {annOverRef.slice(0).map((overPreference) => (
                        <li
                          key={overPreference._id}
                          style={{
                            borderBottom: "2px solid #f0f0f0",
                            padding: "3px",
                            borderRadius: "5px",
                            marginBottom: "5px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {overPreference.createOverPref}
                          <span
                            style={{
                              cursor: "pointer",
                              marginLeft: "10px",
                              color: "red",
                            }}
                            onClick={() =>
                              handleDeleteOverPref(overPreference._id)
                            }
                          >
                            &#x1F5D1;
                          </span>
                        </li>
                      ))}
                    </ul>
                  </Box>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Card>
                  <Box p={2}>
                    <InputLabel
                      sx={{
                        ml: 1,
                        mb: 1,
                        fontWeight: "bolder",
                        fontSize: "17px",
                      }}
                      htmlFor="Over-Rank"
                    >
                      Add Overall Ranking
                    </InputLabel>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <TextField
                        name="createOverRank"
                        id="Over-Rank"
                        value={addOverRank.createOverRank}
                        onChange={handleInputChangeEight}
                        variant="outlined"
                        fullWidth
                        style={{ marginRight: "10px" }}
                        required
                      />
                      <IconButton
                        style={{ background: "#4caf50", borderRadius: "5px" }}
                        onClick={() => {
                          handleSubmitEight();
                          updateData();
                        }}
                      >
                        <InputLabel
                          sx={{
                            fontWeight: "bolder",
                            color: "#fff",
                            mt: 0.5,
                            padding: "5px",
                          }}
                          htmlFor="add-annotator"
                        >
                          ADD
                        </InputLabel>
                      </IconButton>
                    </div>
                    <ul
                      style={{
                        listStyleType: "none",
                        paddingTop: 10,
                        paddingLeft: 15,
                        paddingRight: 15,
                        maxHeight: "35vh",
                        overflowY: "auto",
                      }}
                    >
                      {annOverRank.slice(0).map((overRranking) => (
                        <li
                          key={overRranking._id}
                          style={{
                            borderBottom: "2px solid #f0f0f0",
                            padding: "3px",
                            borderRadius: "5px",
                            marginBottom: "5px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {overRranking.createOverRank}
                          <span
                            style={{
                              cursor: "pointer",
                              marginLeft: "10px",
                              color: "red",
                            }}
                            onClick={() =>
                              handleDeleteOverRank(overRranking._id)
                            }
                          >
                            &#x1F5D1;
                          </span>
                        </li>
                      ))}
                    </ul>
                  </Box>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Card>
                  <Box p={2}>
                    <InputLabel
                      sx={{
                        ml: 1,
                        mb: 1,
                        fontWeight: "bolder",
                        fontSize: "17px",
                      }}
                      htmlFor="Res-One"
                    >
                      Add Response One Rating
                    </InputLabel>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <TextField
                        name="createResOne"
                        id="Res-One"
                        value={addResOne.createResOne}
                        onChange={handleInputChangeNine}
                        variant="outlined"
                        fullWidth
                        style={{ marginRight: "10px" }}
                        required
                      />
                      <IconButton
                        style={{ background: "#4caf50", borderRadius: "5px" }}
                        onClick={() => {
                          handleSubmitNine();
                          updateData();
                        }}
                      >
                        <InputLabel
                          sx={{
                            fontWeight: "bolder",
                            color: "#fff",
                            mt: 0.5,
                            padding: "5px",
                          }}
                          htmlFor="add-annotator"
                        >
                          ADD
                        </InputLabel>
                      </IconButton>
                    </div>
                    <ul
                      style={{
                        listStyleType: "none",
                        paddingTop: 10,
                        paddingLeft: 15,
                        paddingRight: 15,
                        maxHeight: "35vh",
                        overflowY: "auto",
                      }}
                    >
                      {annResOne.slice(0).map((resOne) => (
                        <li
                          key={resOne._id}
                          style={{
                            borderBottom: "2px solid #f0f0f0",
                            padding: "3px",
                            borderRadius: "5px",
                            marginBottom: "5px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {resOne.createResOne}
                          <span
                            style={{
                              cursor: "pointer",
                              marginLeft: "10px",
                              color: "red",
                            }}
                            onClick={() => handleDeleteResOne(resOne._id)}
                          >
                            &#x1F5D1;
                          </span>
                        </li>
                      ))}
                    </ul>
                  </Box>
                </Card>
              </Grid>
            </Grid>
          )}
        </Grid>

        <Grid container spacing={2} sx={{ mt: 4, mb: 4, ml: 1 }}>
          {isParthibanU && (
            <Grid container item xs={12} spacing={2}>
              <Grid item xs={12} sm={4}>
                <Card>
                  <Box p={2}>
                    <InputLabel
                      sx={{
                        ml: 1,
                        mb: 1,
                        fontWeight: "bolder",
                        fontSize: "17px",
                      }}
                      htmlFor="Res-Two"
                    >
                      Add Response Two Ratring
                    </InputLabel>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <TextField
                        name="createResTwo"
                        id="Res-Two"
                        value={addResOne.createResTwo}
                        onChange={handleInputChangeTen}
                        variant="outlined"
                        fullWidth
                        style={{ marginRight: "10px" }}
                        required
                      />
                      <IconButton
                        style={{ background: "#4caf50", borderRadius: "5px" }}
                        onClick={() => {
                          handleSubmitTen();
                          updateData();
                        }}
                      >
                        <InputLabel
                          sx={{
                            fontWeight: "bolder",
                            color: "#fff",
                            mt: 0.5,
                            padding: "5px",
                          }}
                          htmlFor="add-annotator"
                        >
                          ADD
                        </InputLabel>
                      </IconButton>
                    </div>
                    <ul
                      style={{
                        listStyleType: "none",
                        paddingTop: 10,
                        paddingLeft: 15,
                        paddingRight: 15,
                        maxHeight: "35vh",
                        overflowY: "auto",
                      }}
                    >
                      {annResTwo.slice(0).map((resTwo) => (
                        <li
                          key={resTwo._id}
                          style={{
                            borderBottom: "2px solid #f0f0f0",
                            padding: "3px",
                            borderRadius: "5px",
                            marginBottom: "5px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {resTwo.createResTwo}
                          <span
                            style={{
                              cursor: "pointer",
                              marginLeft: "10px",
                              color: "red",
                            }}
                            onClick={() => handleDeleteResTwo(resTwo._id)}
                          >
                            &#x1F5D1;
                          </span>
                        </li>
                      ))}
                    </ul>
                  </Box>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card>
                  <Box p={2}>
                    <InputLabel
                      sx={{
                        ml: 1,
                        mb: 1,
                        fontWeight: "bolder",
                        fontSize: "17px",
                      }}
                      htmlFor="Harm-Pref"
                    >
                      Add Harmless Preference
                    </InputLabel>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <TextField
                        name="createHarmPref"
                        id="Harm-Pref"
                        value={addHarmPref.createHarmPref}
                        onChange={handleInputChangeEleven}
                        variant="outlined"
                        fullWidth
                        style={{ marginRight: "10px" }}
                        required
                      />
                      <IconButton
                        style={{ background: "#4caf50", borderRadius: "5px" }}
                        onClick={() => {
                          handleSubmitEleven();
                          updateData();
                        }}
                      >
                        <InputLabel
                          sx={{
                            fontWeight: "bolder",
                            color: "#fff",
                            mt: 0.5,
                            padding: "5px",
                          }}
                          htmlFor="add-annotator"
                        >
                          ADD
                        </InputLabel>
                      </IconButton>
                    </div>
                    <ul
                      style={{
                        listStyleType: "none",
                        paddingTop: 10,
                        paddingLeft: 15,
                        paddingRight: 15,
                        maxHeight: "35vh",
                        overflowY: "auto",
                      }}
                    >
                      {annHarmPref.slice(0).map((harmPref) => (
                        <li
                          key={harmPref._id}
                          style={{
                            borderBottom: "2px solid #f0f0f0",
                            padding: "3px",
                            borderRadius: "5px",
                            marginBottom: "5px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {harmPref.createHarmPref}
                          <span
                            style={{
                              cursor: "pointer",
                              marginLeft: "10px",
                              color: "red",
                            }}
                            onClick={() => handleDeleteHarmPref(harmPref._id)}
                          >
                            &#x1F5D1;
                          </span>
                        </li>
                      ))}
                    </ul>
                  </Box>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card>
                  <Box p={2}>
                    <InputLabel
                      sx={{
                        ml: 1,
                        mb: 1,
                        fontWeight: "bolder",
                        fontSize: "17px",
                      }}
                      htmlFor="Harm-Rank"
                    >
                      Add Harmless Ranking
                    </InputLabel>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <TextField
                        name="createHarmRank"
                        id="Harm-Rank"
                        value={addHarmRank.createHarmRank}
                        onChange={handleInputChangeTwelve}
                        variant="outlined"
                        fullWidth
                        style={{ marginRight: "10px" }}
                        required
                      />
                      <IconButton
                        style={{ background: "#4caf50", borderRadius: "5px" }}
                        onClick={() => {
                          handleSubmitTwelve();
                          updateData();
                        }}
                      >
                        <InputLabel
                          sx={{
                            fontWeight: "bolder",
                            color: "#fff",
                            mt: 0.5,
                            padding: "5px",
                          }}
                          htmlFor="add-annotator"
                        >
                          ADD
                        </InputLabel>
                      </IconButton>
                    </div>
                    <ul
                      style={{
                        listStyleType: "none",
                        paddingTop: 10,
                        paddingLeft: 15,
                        paddingRight: 15,
                        maxHeight: "35vh",
                        overflowY: "auto",
                      }}
                    >
                      {annHarmRank.slice(0).map((harmRank) => (
                        <li
                          key={harmRank._id}
                          style={{
                            borderBottom: "2px solid #f0f0f0",
                            padding: "3px",
                            borderRadius: "5px",
                            marginBottom: "5px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {harmRank.createHarmRank}
                          <span
                            style={{
                              cursor: "pointer",
                              marginLeft: "10px",
                              color: "red",
                            }}
                            onClick={() => handleDeleteHarmRank(harmRank._id)}
                          >
                            &#x1F5D1;
                          </span>
                        </li>
                      ))}
                    </ul>
                  </Box>
                </Card>
              </Grid>
            </Grid>
          )}
        </Grid>
        

        <Grid container spacing={2} sx={{ mt: 4, mb: 4, ml: 1 }}>
  {isParthibanU && (
    <Grid container item xs={12} spacing={2}>
      <Grid item xs={12} sm={4}>
        <Card>
          <Box p={2}>
            <InputLabel
              sx={{
                ml: 1,
                mb: 1,
                fontWeight: "bolder",
                fontSize: "17px",
              }}
              htmlFor="Honest-Rank"
            >
              Add Honest Ranking
            </InputLabel>
            <div style={{ display: "flex", alignItems: "center" }}>
              <TextField
                name="createHonestRank"
                id="Honest-Rank"
                value={addHonestRank.createHonestRank}
                onChange={handleInputChangeFourteen}
                variant="outlined"
                fullWidth
                style={{ marginRight: "10px" }}
                required
              />
              <IconButton
                style={{ background: "#4caf50", borderRadius: "5px" }}
                onClick={() => {
                  handleSubmitFourteen();
                  updateData();
                }}
              >
                <InputLabel
                  sx={{
                    fontWeight: "bolder",
                    color: "#fff",
                    mt: 0.5,
                    padding: "5px",
                  }}
                  htmlFor="add-annotator"
                >
                  ADD
                </InputLabel>
              </IconButton>
            </div>
            <ul
              style={{
                listStyleType: "none",
                paddingTop: 10,
                paddingLeft: 15,
                paddingRight: 15,
                maxHeight: "35vh",
                overflowY: "auto",
              }}
            >
              {annHonestRank.slice(0).map((honestRank) => (
                <li
                  key={honestRank._id}
                  style={{
                    borderBottom: "2px solid #f0f0f0",
                    padding: "3px",
                    borderRadius: "5px",
                    marginBottom: "5px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {honestRank.createHonestRank}
                  <span
                    style={{
                      cursor: "pointer",
                      marginLeft: "10px",
                      color: "red",
                    }}
                    onClick={() => handleDeleteHonestRank(honestRank._id)}
                  >
                    &#x1F5D1;
                  </span>
                </li>
              ))}
            </ul>
          </Box>
        </Card>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Card>
          <Box p={2}>
          <InputLabel sx={{ ml: 1, mb:1, fontWeight: 'bolder', fontSize: '17px' }} htmlFor="Help-Pref">
                  Add Honest Preference
                </InputLabel>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <TextField
                    name="createHonestPref"
                    id="Help-Rank"
                    value={addHonestPref.createHonestPref}
                    onChange={handleInputChangeThirteen}
                    variant="outlined"
                    fullWidth
                    style={{ marginRight: '10px' }}
                    required
                  />
              <IconButton
                    style={{ background: "#4caf50", borderRadius: "5px" }}
                    onClick={() => {
                      handleSubmitThirteen();
                      updateData();
                    }}
                  >
                <InputLabel sx={{  fontWeight: 'bolder', color: '#fff', mt:0.5, padding: '5px' }} htmlFor="add-annotator">
                      ADD
                    </InputLabel>
                    </IconButton>
                </div>
                <ul style={{ listStyleType: "none", paddingTop: 10, paddingLeft: 15, paddingRight: 15, maxHeight: "35vh", overflowY: "auto" }}>
                  {annHonestPref.slice(0).map((honestPref) => (
                    <li
                      key={honestPref._id}
                      style={{
                        borderBottom: "2px solid #f0f0f0",
                        padding: "3px",
                        borderRadius: "5px",
                        marginBottom: "5px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {honestPref.createHonestPref}
                      <span
                        style={{
                          cursor: "pointer",
                          marginLeft: "10px",
                          color: "red",
                        }}
                        onClick={() => handleDeleteHonestPref
                          (honestPref._id)}
                      >
                        &#x1F5D1;
                      </span>
                    </li>
                  ))}
                </ul>
          </Box>
        </Card>
      </Grid>
    </Grid>
  )}
</Grid>
        
<Grid container spacing={2} sx={{ mt: 4, mb: 4, ml: 1 }}>
  {isParthibanU && (
    <Grid container item xs={12} spacing={2}>
      <Grid item xs={12} sm={4}>
        <Card>
          <Box p={2}>
            <InputLabel
              sx={{
                ml: 1,
                mb: 1,
                fontWeight: "bolder",
                fontSize: "17px",
              }}
              htmlFor="Help-Rank"
            >
              Add Helpfull Ranking
            </InputLabel>
            <div style={{ display: "flex", alignItems: "center" }}>
              <TextField
                name="createHelpRank"
                id="Help-Rank"
                value={addHelpRank.createHelpRank}
                onChange={handleInputChangeSixteen}
                variant="outlined"
                fullWidth
                style={{ marginRight: "10px" }}
                required
              />
              <IconButton
                style={{ background: "#4caf50", borderRadius: "5px" }}
                onClick={() => {
                  handleSubmitSixteen();
                  updateData();
                }}
              >
                <InputLabel
                  sx={{
                    fontWeight: "bolder",
                    color: "#fff",
                    mt: 0.5,
                    padding: "5px",
                  }}
                  htmlFor="add-annotator"
                >
                  ADD
                </InputLabel>
              </IconButton>
            </div>
            <ul
              style={{
                listStyleType: "none",
                paddingTop: 10,
                paddingLeft: 15,
                paddingRight: 15,
                maxHeight: "35vh",
                overflowY: "auto",
              }}
            >
              {annHelpRank.slice(0).map((helpRank) => (
                <li
                  key={helpRank._id}
                  style={{
                    borderBottom: "2px solid #f0f0f0",
                    padding: "3px",
                    borderRadius: "5px",
                    marginBottom: "5px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {helpRank.createHelpRank}
                  <span
                    style={{
                      cursor: "pointer",
                      marginLeft: "10px",
                      color: "red",
                    }}
                    onClick={() => handleDeleteHelpRank(helpRank._id)}
                  >
                    &#x1F5D1;
                  </span>
                </li>
              ))}
            </ul>
          </Box>
        </Card>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Card>
          <Box p={2}>
          <InputLabel sx={{ ml: 1, mb:1, fontWeight: 'bolder', fontSize: '17px' }} htmlFor="Help-Pref">
                  Add Helpfull Preference
                </InputLabel>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <TextField
                    name="createHelpPref"
                    id="Help-Rank"
                    value={addHelpPref.createHelpPref}
                    onChange={handleInputChangeFifteen}
                    variant="outlined"
                    fullWidth
                    style={{ marginRight: '10px' }}
                    required
                  />
              <IconButton
                    style={{ background: "#4caf50", borderRadius: "5px" }}
                    onClick={() => {
                      handleSubmitFifteen();
                      updateData();
                    }}
                  >
                <InputLabel sx={{  fontWeight: 'bolder', color: '#fff', mt:0.5, padding: '5px' }} htmlFor="add-annotator">
                      ADD
                    </InputLabel>
                    </IconButton>
                </div>
                <ul style={{ listStyleType: "none", paddingTop: 10, paddingLeft: 15, paddingRight: 15, maxHeight: "35vh", overflowY: "auto" }}>
                  {annHelpPref.slice(0).map((helpPref) => (
                    <li
                      key={helpPref._id}
                      style={{
                        borderBottom: "2px solid #f0f0f0",
                        padding: "3px",
                        borderRadius: "5px",
                        marginBottom: "5px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {helpPref.createHelpPref}
                      <span
                        style={{
                          cursor: "pointer",
                          marginLeft: "10px",
                          color: "red",
                        }}
                        onClick={() => handleDeleteHelpPref
                          (helpPref._id)}
                      >
                        &#x1F5D1;
                      </span>
                    </li>
                  ))}
                </ul>
          </Box>
        </Card>
      </Grid>
    </Grid>
  )}
</Grid>

      </Grid>
      {/* <Footer /> */}
      <ToastContainer />
    </DashboardLayout>
  );
};

export default TaskCreation;
