import { useEffect, useState } from "react";
import { dataRef } from "./firebase/firebase.js";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  Dialog,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import uuid from "react-uuid";
import styled from "@emotion/styled";

const CustomButton = styled(Button)({
  textTransform: "none",
  maxWidth: "75%",
  margin: "5px auto",
  color: "#fff",
  background: "blue",
  "&:hover": {
    background: "blue",
  },
});

function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [city, setCity] = useState("");
  const [tableData, setTableData] = useState([]);
  const [updateObj, setUpdateObj] = useState({
    id: "",
    name: "",
    email: "",
    age: "",
    gender: "",
    city: "",
  });
  const [open, setOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);

  const addUser = (e) => {
    e.preventDefault();
    const uniqueId = uuid().substring(0, 4);
    dataRef.ref().child("Users").push({
      id: uniqueId,
      name,
      email,
      age,
      gender,
      city,
    });
  };

  useEffect(() => {
    dataRef
      .ref()
      .child("Users")
      .on("value", (data) => {
        const getData = Object.values(data.val());
        console.log(getData);
        setTableData(getData);
      });
  }, []);

  const onUpdate = (e, key) => {
    e.preventDefault();
    dataRef
      .ref()
      .child("Users")
      .get()
      .then((s) => {
        const dbObj = s.val();
        for (let keys in dbObj) {
          if (dbObj[keys].id === key) {
            dataRef.ref().child("Users").child(keys).update(updateObj);
          }
        }
      });
    setUpdateOpen(false);
  };

  const onDelete = (e, key) => {
    e.preventDefault();
    dataRef
      .ref()
      .child("Users")
      .get()
      .then((s) => {
        const dbObj = s.val();
        for (let keys in dbObj) {
          if (dbObj[keys].id === key) {
            dataRef.ref().child("Users").child(keys).remove();
          }
        }
      });
  };

  const onUpdateClicked = (row) => {
    setUpdateObj(row);
    setUpdateOpen(true);
  };

  const setDefault = () => {
    setName("");
    setEmail("");
    setAge("");
    setGender("");
    setCity("");
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
      }}
    >
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Age</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>City</TableCell>
              <TableCell>Update/Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.length &&
              tableData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.age}</TableCell>
                  <TableCell>{row.gender}</TableCell>
                  <TableCell>{row.city}</TableCell>
                  <TableCell
                    sx={{
                      "&>button": {
                        textTransform: "none",
                      },
                      width: "10%",
                    }}
                  >
                    <IconButton onClick={() => onUpdateClicked(row)}>
                      <CreateIcon />
                    </IconButton>
                    <IconButton onClick={(e) => onDelete(e, row.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          textAlign: "center",
          flexDirection: "column",
        }}
      >
        <Typography>
          {tableData.length === 0 ? "Empty database Add user" : ""}
        </Typography>
        <CustomButton
          onClick={() => {
            setOpen(true);
            setDefault();
          }}
        >
          Add User
        </CustomButton>
      </Box>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            width: "75%",
            height: "50vh",
          },
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "100%",
          }}
        >
          <Box
            sx={{
              width: "100%",
              background: "#f4f4f4",
              display: "flex",
              "&>button": {
                margin: "0 0 0 auto",
              },
            }}
          >
            <IconButton
              onClick={() => {
                setOpen(false);
                setDefault();
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              padding: "15px",
              overflow: "scroll",
              "&>div": {
                margin: "3px 0",
              },
            }}
          >
            <TextField
              id="standard-basic"
              label="Enter name"
              variant="standard"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              id="standard-basic"
              label="Enter email"
              variant="standard"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              id="standard-basic"
              label="Enter age"
              variant="standard"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
            <InputLabel id="demo-simple-select-label">Select Gender</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={gender.length > 0 ? gender : "select"}
              label="Gender"
              onChange={(e) => {
                setGender(e.target.value);
              }}
            >
              <MenuItem value={"Male"}>Male</MenuItem>
              <MenuItem value={"Female"}>Female</MenuItem>
            </Select>
            <TextField
              id="standard-basic"
              label="Enter city"
              variant="standard"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <CustomButton
              onClick={(e) => {
                addUser(e);
                setOpen(false);
              }}
            >
              Add User
            </CustomButton>
          </Box>
        </Box>
      </Dialog>
      <Dialog
        open={updateOpen}
        onClose={() => setUpdateOpen(false)}
        PaperProps={{
          sx: {
            width: "75%",
            height: "50vh",
          },
        }}
      >
        <Box sx={{ width: "100%", height: "100%" }}>
          <Box
            sx={{
              width: "100%",
              background: "#f4f4f4",
              display: "flex",
              "&>button": {
                margin: "0 0 0 auto",
              },
            }}
          >
            <IconButton
              onClick={() => {
                setUpdateOpen(false);
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              padding: "15px",
              "&>div": {
                margin: "5px 2px",
              },
            }}
          >
            <TextField
              id="standard-basic"
              label="Update name"
              variant="standard"
              value={updateObj.name}
              onChange={(e) =>
                setUpdateObj({ ...updateObj, name: e.target.value })
              }
            />
            <TextField
              id="standard-basic"
              label="Update email"
              variant="standard"
              value={updateObj.email}
              onChange={(e) =>
                setUpdateObj({ ...updateObj, email: e.target.value })
              }
            />
            <TextField
              id="standard-basic"
              label="Update age"
              variant="standard"
              value={updateObj.age}
              onChange={(e) =>
                setUpdateObj({ ...updateObj, age: e.target.value })
              }
            />
            <InputLabel id="demo-simple-select-label">Select Gender</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={updateObj.gender}
              label="Gender"
              onChange={(e) => {
                setUpdateObj({ ...updateObj, gender: e.target.value });
              }}
            >
              <MenuItem value={"Male"}>Male</MenuItem>
              <MenuItem value={"Female"}>Female</MenuItem>
            </Select>
            <TextField
              id="standard-basic"
              label="Update city"
              variant="standard"
              value={updateObj.city}
              onChange={(e) =>
                setUpdateObj({ ...updateObj, city: e.target.value })
              }
            />
            <CustomButton onClick={(e) => onUpdate(e, updateObj.id)}>
              Update
            </CustomButton>
          </Box>
        </Box>
      </Dialog>
    </Box>
  );
}

export default App;
