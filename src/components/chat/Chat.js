import React, { useState, useRef, useEffect } from "react";
import "./Chat.css";
import axios from "axios";

// const dropdowns = [
// {
//   label: "Heading 1",
//   items: [
//     { title: "Subheading 11", content: "You can take 10 days of leave" },
//     {
//       title: "Subheading 12",
//       content: "You can take 12 days of leave with LOP",
//     },
//   ],
// },
// {
//   label: "Heading 2",
//   items: [
//     { title: "Subheading 2", content: "Hey can take 10 days of leave" },
//     {
//       title: "Subheading 21",
//       content: "Heyy can take 12 days of leave with LOP",
//     },
//   ],
// },
// ];

const Chat = () => {
  const Dropdown = ({ label, items }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = () => setIsOpen(!isOpen);

    const showInfo = (item, title) => {
      setShowInformation(true);
      setShowChat(false);
      setSubheadingContent(item.content);
      setTitleInfo(title);
    };

    return (
      <div className="dropdown">
        <button
          className="dropdown-button"
          onClick={handleToggle}
          dangerouslySetInnerHTML={{ __html: label }}
        ></button>
        <div className={`dropdown-content ${isOpen ? "open" : ""}`}>
          {items.map((item, index) => (
            <div
              key={index}
              id="dropdown-item"
              onClick={() => showInfo(item, item.title)}
              dangerouslySetInnerHTML={{ __html: item.title }}
            ></div>
          ))}
        </div>
      </div>
    );
  };

  const [input, setInput] = useState("");
  const [questions, setQuestions] = useState([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [showInformation, setShowInformation] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [subheadingContent, setSubheadingContent] = useState("");
  const [titleInfo, setTitleInfo] = useState("");
  const [dropdownsState, setDropdownsState] = useState([]);
  const messageRef = useRef(null);

  const scrollToBottom = () => {
    messageRef.current.scrollTop = messageRef.current.scrollHeight;
  };

  useEffect(() => {
    // const fetchhead = async () => {
    //   await fetch("http://65.1.92.233:5000/get-all", {
    //     method: "GET",
    //   });
    //   const headdata = await fetchhead.JSON();
    //   console.log(headdata);
    // };
    axios
      .get("http://65.1.92.233:5000/get-all")
      .then((res) => {
        console.log(res.data.headings);
        setDropdownsState(res.data.headings);
      })
      .catch((err) => console.log(err));
    scrollToBottom();
  }, [questions]);

  const onChangeInputHandler = (e) => {
    setInput(e.target.value);
  };

  const onClickEventHandler = async (e) => {
    e.preventDefault();
    setIsButtonDisabled(true);
    setInput("");

    const newQuestion = { qn: input, ans: "..." };
    setQuestions((prevQns) => [...prevQns, newQuestion]);

    try {
      const response = await fetch("http://65.1.92.233:5000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ chat: input }),
      });
      const responseData = await response.json();
      console.log(responseData);

      setQuestions((prevQns) => {
        const updatedQuestions = [...prevQns];
        updatedQuestions[updatedQuestions.length - 1].ans =
          responseData.message.content;
        return updatedQuestions;
      });
    } catch (err) {
      console.log(err);
    }

    setIsButtonDisabled(false);
  };

  const showChatWindow = () => {
    setShowChat(true);
    setShowInformation(false);
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div id="container">
      <div className="chatbtn" onClick={() => showChatWindow()}>
        Chat with Assistant
      </div>
      <div className={`sidebar open`}>
        <div id="dropdown-container">
          {dropdownsState.map((dropdown, index) => (
            <Dropdown
              key={index}
              label={dropdown.title}
              items={dropdown.subheadings}
            />
          ))}
        </div>
      </div>

      {showInformation && (
        <div id="info-container">
          <div dangerouslySetInnerHTML={{ __html: titleInfo }}></div>
          <div
            style={{ marginTop: "20px" }}
            dangerouslySetInnerHTML={{ __html: subheadingContent }}
          ></div>
        </div>
      )}

      {showChat && (
        <form id="chat-container" onSubmit={onClickEventHandler}>
          <div id="chat-messages" ref={messageRef}>
            {questions.map((data, index) => (
              <div key={index}>
                <p
                  style={{
                    float: "right",
                    backgroundColor: "#eee",
                    padding: 8,
                    borderRadius: 10,
                    color: "#",
                  }}
                >
                  You : {data.qn}
                </p>
                <br></br>
                <p
                  style={{
                    float: "left",
                    backgroundColor: "#eee",
                    padding: 8,
                    borderRadius: 10,
                  }}
                >
                  Assistant : {data.ans}
                </p>
              </div>
            ))}
          </div>
          <div id="inputandbutton">
            <input
              onChange={onChangeInputHandler}
              type="text"
              id="chat-input"
              placeholder="Ask anything about HR policies..."
              value={input}
            />
            <div
              className={isButtonDisabled ? "SendingButton" : ""}
              id="send-button"
              disabled={isButtonDisabled}
            >
              {/* {isButtonDisabled ? "Sending..." : "Send"} */}
              <img
                src={require("../../assets/send.png")}
                style={{ width: "50%", float: "right" }}
              />
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default Chat;
