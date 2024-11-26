import React, { useContext, useEffect, useMemo, useState } from "react";
import { FaUser } from "react-icons/fa";
import { MdEmail, MdPhone, MdLocalPrintshop } from "react-icons/md";
import { IoLocation } from "react-icons/io5";
import { IoSendSharp } from "react-icons/io5";
import { BsEmojiGrin } from "react-icons/bs";
import { MdEmojiEmotions } from "react-icons/md";
import axios from "axios";
import { AuthContext } from "../../Context/AuthContext";
import "../../CssFolder/Css.css";
import { useRef } from "react";
import { v4 as uuidv4 } from "uuid";

const Chat = ({ userSelected, socket }) => {
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const [messagesDisplay, setMessagesDisplay] = useState([]);
  const { user, dispatch } = useContext(AuthContext);
  const { arrivalMessage, setArrivalMessage } = useState(null);
  const scrolRef = useRef();
  const submitMessage = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5555/chat", {
        msg: message,
        receiver: userSelected._id,
        sender: user.userId,
      })
      .then(() => {
        setMessage("");
      })
      .catch((error) => {
        console.log(error);
      });
    socket.current.emit("send-message", {
      sender: user.userId,
      receiver: userSelected._id,
      message: message,
    });

    const msgs = [...allMessages];
    msgs.push({
      message: message,
      sender: user.userId,
      receiver: userSelected._id,
    });
    setAllMessages(msgs);
  };

  useEffect(() => {
    axios
      .get(`http://localhost:5555/chat/${user.userId}`)
      .then((response) => {
        setAllMessages(response.data.messages);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    if (socket.current) {
      socket.current.on("message-recive", (data) => {
        
     
       setAllMessages((prev)=>[...prev,data])
      });
      
    }
    
 
  }, [setArrivalMessage]);

  useEffect(() => {
    if(arrivalMessage!=null){
        setMessagesDisplay((prev) => [...prev, arrivalMessage]);
    }
   
  }, [arrivalMessage]);

  useEffect(() => {
    scrolRef.current?.scrollIntoView({ behaviour: "smooth" });
  }, [messagesDisplay]);

  useEffect(() => {
    const newMessages = allMessages.filter(
      (msg) =>
        msg.receiver == userSelected._id || msg.sender == userSelected._id
    );
    setMessagesDisplay(newMessages);
  }, [allMessages]);

  useEffect(() => {
    const newMessages = allMessages.filter(
      (msg) =>
        msg.receiver == userSelected._id || msg.sender == userSelected._id
    );
    setMessagesDisplay(newMessages);
  }, [userSelected]);

  const displayMessages =useMemo(()=>messagesDisplay.map((msg, index) => {
    return (
      <div
        ref={scrolRef}
        key={uuidv4()}
        className={`w-full flex items-center ${
          msg.sender == user.userId ? "justify-end" : "justify-start"
        }`}
      >
        <div
          className={`px-2 py-1 rounded-lg bg-blue-900  ${
            msg.sender == user.userId
              ? "text-white"
              : "bg-gray-400 text-gray-900"
          }`}
        >
          {msg.message}
        </div>
      </div>
    );
  }),[messagesDisplay]) 

  return (
    <div className="w-[77%] pl-[30px] pt-[30px] flex justify-start items-start h-screen border-2 ">
      <div className="w-[71%]  relative flex flex-col justify-between items-center h-[100%] pb-5   ">
        <div className="w-full h-[82%] ">
       
          <p className="text-lg font-semibold">{userSelected.name}</p>
          <div className="h-[100%] pt-3 messages w-full px-6 flex flex-col justify-start items-center gap-y-2 pb-4 scrollbar-custom">
            {displayMessages}
          </div>
        </div>
        <form
          onSubmit={submitMessage}
          className="flex justify-start items-center gap-x-3 w-full"
        >
          <input
            onChange={(e) => {
              setMessage(e.target.value);
            }}
            value={message}
            type="text"
            className="w-[86%] px-3 py-1 bg-gray-300 rounded-full"
          />
          <MdEmojiEmotions className="text-yellow-400 text-2xl cursor-pointer hover:text-yellow-300" />
          <button type="submit">
            <IoSendSharp className="text-gray-500 text-2xl cursor-pointer hover:text-black" />
          </button>
        </form>
      </div>
      <div className="flex flex-col justify-start items-start gap-y-[30px] w-[29%] max-h[100%]">
        <div className="flex flex-col justify-start items-center px-5 gap-y-3 w-full">
          <FaUser className="text-6xl" />
          <p className="text-sm font-semibold">{userSelected.name}</p>
        </div>
        <div className="flex flex-col justify-start items-start gap-y-6 w-full px-8">
          <div className="flex justify-start items-center gap-x-3">
            <MdEmail />
            <p>{userSelected.email}</p>
          </div>
          <div className="flex justify-start items-center gap-x-3">
            <MdPhone />
            <p>0656149785</p>
          </div>
          <div className="flex justify-start items-center gap-x-3">
            <IoLocation />
            <p>EL-GUELTA CHLEF ALGERIA</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
