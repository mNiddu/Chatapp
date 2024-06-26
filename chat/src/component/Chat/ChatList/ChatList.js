import React, { useState, useEffect } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import SearchIcon from "@mui/icons-material/Search";
import { formatDistanceToNow, parseISO} from 'date-fns'
import {
  IconButton,
  TextField,
  InputAdornment,
  Button,
  Typography,
  Modal,
  Box,
} from "@mui/material/";
import * as Yup from "yup";
import axios from "axios";
import "./ChatList.css";
import { ReactComponent as Notification } from "../../Images/noti.svg";
import { ReactComponent as Correct } from "../../Images/correct.svg";
import { ReactComponent as Wrong } from "../../Images/wrong.svg";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Slide } from "react-toastify";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50%",
  bgcolor: "background.paper",

  boxShadow: 24,
  p: 4,
};
export default function ChatList() {
  const [count, setCount] = useState(false);
  const [requested, setRequested] = useState([]);
  const UserToken = useSelector((state) => state.loginId);


  const [open, setOpen] = React.useState(false);
  const [contact, setContact] = useState({
    phone: "",
  });
  const [Error, setError] = useState({});
  const [showNotifications, setShowNotifications] = useState(false);
console.log(requested)
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/usercontact/getcontact`, {
        headers: { "auth-token": UserToken.token },
      })
      .then((res) => {
        setRequested(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
  };
  const ValidationSchema = Yup.object({
    phone: Yup.string()
      .required("Phone Number required")
      .min(10, "Enter ten degits Number")
      .matches(/[0-9]/, "Enter Only Number"),
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const HandleContact = (e) => {
    setContact({ ...contact, [e.target.name]: e.target.value.trim() });
    setError({});
  };
  const HandleAddContact = async () => {
    try {
      await ValidationSchema.validate(contact, { abortEarly: false });
      setError({});

      const response = await axios.post(
        "http://localhost:5000/api/usercontact/contact",
        contact,
        { headers: { "auth-token": UserToken.token } }
      );
      if (response.data.success == true) {
        toast.success(response.data.message, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Slide,
        });
        setOpen(!open);
        setCount(!count);
      } else {
        toast.error(response.data.message, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Slide,
        });
      }
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const validationErrors = {};
        err.inner.forEach((error) => {
          validationErrors[error.path] = error.message;
        });
        setError(validationErrors);
      } else {
        console.log(err);
      }
    }
  };
  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Slide}
      />
      <div className="chat-top">
        <h5>Chats</h5>
        <div className="chat-icon">
          {" "}
          <IconButton onClick={handleOpen}>
            <AddCircleOutlineIcon />
          </IconButton>
          <div className="notificatoin-center">
            <IconButton onClick={handleNotificationClick}>
              <Notification />
            </IconButton>
            {showNotifications && (
              <div className="notifications">
              <div className="check-status"> <p>Pending</p> 
               <p>Accepted</p> 
               <p>Rejected</p> 
               <p>User Request</p> </div>
                {requested.findContact.map((data) => (
                  <div className="notification">
                    <div className="notify-lists">
                      <div className="notify-chats">
                        <img
                          src={`http://localhost:5000/api/profile/${data.UserId.image}`}
                          alt="Profile"
                        />

                        <div className="notify-list">
                          <h6>{data.UserId.name}</h6>
                          <p>{data.UserId.phone}</p>
                        </div>
                      </div>

                      <div className="notify-date">
                        <div className="status">
                          <IconButton>
                            {" "}
                            <Correct />
                          </IconButton>
                          <IconButton>
                            {" "}
                            <Wrong />
                          </IconButton>
                        </div>
                        <h6>{formatDistanceToNow(parseISO(data.date),{addSuffix:true})}</h6>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="chat-search">
        <TextField
          type="search"
          placeholder="Search"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          size="small"
          variant="outlined"
          className="textField"
        />
      </div>
      <div className="chat-lists">
        <div className="chats">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXJA32WU4rBpx7maglqeEtt3ot1tPIRWptxA&s"
            alt="Profile"
          />

          <div className="list">
            <h6>Suresh Kumar</h6>
            <p>Hello how r u</p>
          </div>
        </div>

        <div className="chat-date">
          <h6>jan 6,2002</h6>
        </div>
      </div>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="model-main">
            <div className="heading">Add Contact</div>
            <input
              type="tel"
              name="phone"
              onChange={HandleContact}
              placeholder="Enter Phone Number"
            />
            {Error.phone && (
              <p style={{ color: "red", margin: 0, fontSize: "1.rem" }}>
                {Error.phone}
              </p>
            )}
            <button onClick={HandleAddContact}>Add Contact</button>
          </div>
        </Box>
      </Modal>
    </>
  );
}
