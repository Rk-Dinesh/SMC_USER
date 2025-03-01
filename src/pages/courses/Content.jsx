import React, { useContext, useEffect, useState } from "react";
import TruncatedText from "../../components/TruncatedText";
import { useLocation, useNavigate } from "react-router-dom";
import { IoIosArrowDown } from "react-icons/io";
import { FaCaretSquareLeft } from "react-icons/fa";
import StyledText from "../../components/StyledText";
import YouTube from "react-youtube";
import { toast } from "react-toastify";
import axios from "axios";
import { IoChatbubbleEllipses, IoClose } from "react-icons/io5";
import { FaCheck } from "react-icons/fa";
import { API } from "../../Host";
import Headers from "../layout/Headers";
import robot from "../../assets/robot.png";
import { motion } from "framer-motion";
import { ThemeContext } from "../../App";

const Content = () => {
  const { global, setGlobal } = useContext(ThemeContext);
  const [isOpen, setIsOpen] = useState(false);
  const [key, setkey] = useState("");
  const { state } = useLocation();
  const { mainTopic, type, courseId, end } = state || {};
  const jsonData = JSON.parse(localStorage.getItem("jsonData"));
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selected, setSelected] = useState("");
  const [theory, setTheory] = useState("");
  const [media, setMedia] = useState("");
  const [percentage, setPercentage] = useState(0);
  const [isComplete, setIsCompleted] = useState(false);
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const handleOnClose = () => setIsOpenDrawer(false);
  const [isAnimationVisible, setIsAnimationVisible] = useState(false);
  const user = localStorage.getItem("user");

  const CountDoneTopics = () => {
    let doneCount = 0;
    let totalTopics = 0;

    jsonData[mainTopic.toLowerCase()].forEach((topic) => {
      topic.subtopics.forEach((subtopic) => {
        if (subtopic.done) {
          doneCount++;
        }
        totalTopics++;
      });
    });
    const completionPercentage = Math.round((doneCount / totalTopics) * 100);
    setPercentage(completionPercentage);
    if (completionPercentage >= "100") {
      setIsCompleted(true);
      finish();
    }
  };

  const [openTopics, setOpenTopics] = useState({});

  const handleOpenClose = (title) => {
    setOpenTopics((prev) => ({
      ...prev,
      [title]: !prev[title], // Toggle the open state for the clicked topic
    }));
  };

  const opts = {
    height: "390",
    width: "640",
  };

  const optsMobile = {
    height: "250px",
    width: "100%",
  };

  async function finish() {
    if (localStorage.getItem("first") === "true") {
      if (!end) {
        const today = new Date();
        const formattedDate = today.toLocaleDateString("en-GB");
        navigate("/viewcertificate", {
          state: { courseTitle: mainTopic, end: formattedDate },
        });
      } else {
        navigate("/viewcertificate", {
          state: { courseTitle: mainTopic, end: end },
        });
      }
    } else {
      const dataToSend = {
        courseId: courseId,
      };
      try {
        const postURL = API + "/api/finish";
        const response = await axios.post(postURL, dataToSend);
        if (response.data.success) {
          const today = new Date();
          const formattedDate = today.toLocaleDateString("en-GB");
          localStorage.setItem("first", "true");
          sendEmail(formattedDate);
          const formData = {
            user: user,
            subject: `Course Completion Confirmation`,
            description: `Congratulations! You've completed the course ${mainTopic}`,
          };
          await axios.post(`${API}/api/notify`, formData);
          setGlobal(!global);
        } else {
          finish();
        }
      } catch (error) {
        finish();
      }
    }
  }

  async function sendEmail(formattedDate) {
    const userName = localStorage.getItem("fname");
    const email = localStorage.getItem("email");
    const html = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html lang="en">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  </head>
  <body style="margin-left:auto;margin-right:auto;margin-top:auto;margin-bottom:auto;background-color:rgb(255,255,255);font-family:ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';">
    <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width:37.5em;margin-left:auto;margin-right:auto;margin-top:40px;margin-bottom:40px;width:465px;border-radius:0.25rem;border-width:1px;border-style:solid;border-color:rgb(234,234,234);padding:20px">
      <tr style="width:100%">
        <td>
          <h1 style="margin-left:0px;margin-right:0px;margin-top:30px;margin-bottom:30px;padding:0px;text-align:center;font-size:24px;font-weight:400;color:rgb(0,0,0)">Congratulations on Completing Your Course!</h1>
          <p style="font-size:14px;line-height:24px;margin:16px 0;color:rgb(0,0,0)">Hi <strong>${userName}</strong>,</p>
          <p style="font-size:14px;line-height:24px;margin:16px 0;color:rgb(0,0,0)">Congratulations on completing the course <strong>"${mainTopic}"</strong> on Pick My Course! We're thrilled to see you achieve your learning goals. You've demonstrated dedication and a thirst for knowledge, and we commend you for your accomplishment.</p>
          <p style="font-size:14px;line-height:24px;margin:16px 0;color:rgb(0,0,0)">To celebrate your success, we've prepared a certificate of completion for you. You can download it here:</p>
          <p style="font-size:14px;line-height:24px;margin:16px 0;color:rgb(0,0,0)">We encourage you to share your achievement with your friends and colleagues on social media using the hashtag <strong>#SeekMyCourseGrad</strong>.</p>
          <p style="font-size:14px;line-height:24px;margin:16px 0;color:rgb(0,0,0)">What's next? Continue your learning journey with Pick My Course! Explore our vast library of courses and discover new topics to master.</p>
          <p style="font-size:14px;line-height:24px;margin:16px 0;color:rgb(0,0,0)">Keep learning, keep growing!</p>
          <p style="font-size:14px;line-height:24px;margin:16px 0;color:rgb(0,0,0)">The <strong>Pick My Course</strong> Team</p>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

    try {
      const postURL = API + "/api/sendcertificate";
      await axios
        .post(postURL, { html, email })
        .then((res) => {
          navigate("/viewcertificate", {
            state: { courseTitle: mainTopic, end: formattedDate },
          });
        })
        .catch((error) => {
          navigate("/viewcertificate", {
            state: { courseTitle: mainTopic, end: formattedDate },
          });
        });
    } catch (error) {
      navigate("/viewcertificate", {
        state: { courseTitle: mainTopic, end: formattedDate },
      });
    }
  }

  useEffect(() => {
    loadMessages();
    const CountDoneTopics = () => {
      let doneCount = 0;
      let totalTopics = 0;

      jsonData[mainTopic.toLowerCase()].forEach((topic) => {
        topic.subtopics.forEach((subtopic) => {
          if (subtopic.done) {
            doneCount++;
          }
          totalTopics++;
        });
      });
      const completionPercentage = Math.round((doneCount / totalTopics) * 100);
      setPercentage(completionPercentage);
      if (completionPercentage >= "100") {
        setIsCompleted(true);
      }
    };

    if (!mainTopic) {
      navigate("/create");
    } else {
      if (percentage >= "100") {
        setIsCompleted(true);
      }

      const mainTopicData = jsonData[mainTopic.toLowerCase()][0];
      const firstSubtopic = mainTopicData.subtopics[0];
      firstSubtopic.done = true;
      setSelected(firstSubtopic.title);
      setTheory(firstSubtopic.theory);

      if (type === "video & text course") {
        setMedia(firstSubtopic.youtube);
      } else {
        setMedia(firstSubtopic.image);
      }
      localStorage.setItem("jsonData", JSON.stringify(jsonData));
      CountDoneTopics();
    }
  }, []);

  useEffect(() => {
    setIsAnimationVisible(true);

    const timer = setTimeout(() => {
      setIsAnimationVisible(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleSelect = (topics, sub) => {
    const mTopic = jsonData[mainTopic.toLowerCase()].find(
      (topic) => topic.title === topics
    );
    const mSubTopic = mTopic?.subtopics.find(
      (subtopic) => subtopic.title === sub
    );

    if (
      mSubTopic.theory === "" ||
      mSubTopic.theory === undefined ||
      mSubTopic.theory === null
    ) {
      if (type === "video & text course") {
        const query = `${mSubTopic.title} ${mainTopic} in english`;
        const id = toast.loading("Please wait...");
        sendVideo(query, topics, sub, id, mSubTopic.title);
      } else {
        const prompt = `Explain me about this subtopic of ${mainTopic} with examples :- ${mSubTopic.title}. Please Strictly Don't Give Additional Resources And Images.`;
        const promptImage = `Example of ${mSubTopic.title} in ${mainTopic}`;
        const id = toast.loading("Please wait...");
        sendPrompt(prompt, promptImage, topics, sub, id);
      }
    } else {
      setSelected(mSubTopic.title);

      setTheory(mSubTopic.theory);
      if (type === "video & text course") {
        setMedia(mSubTopic.youtube);
      } else {
        setMedia(mSubTopic.image);
      }
    }
    setIsSidebarOpen(false);
  };

  async function sendPrompt(prompt, promptImage, topics, sub, id) {
    const dataToSend = {
      prompt: prompt,
    };
    try {
      const postURL = API + "/api/generate";
      const res = await axios.post(postURL, dataToSend);
      const generatedText = res.data.text;
      const htmlContent = generatedText;
      try {
        const parsedJson = htmlContent;
        sendImage(parsedJson, promptImage, topics, sub, id);
      } catch (error) {
        sendPrompt(prompt, promptImage, topics, sub, id);
      }
    } catch (error) {
      sendPrompt(prompt, promptImage, topics, sub, id);
    }
  }

  async function sendImage(parsedJson, promptImage, topics, sub, id) {
    const dataToSend = {
      prompt: promptImage,
    };
    try {
      const postURL = API + "/api/image";
      const res = await axios.post(postURL, dataToSend);
      try {
        const generatedText = res.data.url;
        sendData(generatedText, parsedJson, topics, sub, id);
      } catch (error) {
        sendImage(parsedJson, promptImage, topics, sub, id);
      }
    } catch (error) {
      sendImage(parsedJson, promptImage, topics, sub, id);
    }
  }

  async function sendData(image, theory, topics, sub, id) {
    const mTopic = jsonData[mainTopic.toLowerCase()].find(
      (topic) => topic.title === topics
    );
    const mSubTopic = mTopic?.subtopics.find(
      (subtopic) => subtopic.title === sub
    );
    mSubTopic.theory = theory;
    mSubTopic.image = image;
    setSelected(mSubTopic.title);

    toast.update(id, {
      render: "Done!",
      type: "success",
      isLoading: false,
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
    });
    setTheory(theory);
    if (type === "video & text course") {
      setMedia(mSubTopic.youtube);
    } else {
      setMedia(image);
    }
    mSubTopic.done = true;
    updateCourse();
  }

  async function sendDataVideo(image, theory, topics, sub, id) {
    const mTopic = jsonData[mainTopic.toLowerCase()].find(
      (topic) => topic.title === topics
    );
    const mSubTopic = mTopic?.subtopics.find(
      (subtopic) => subtopic.title === sub
    );
    mSubTopic.theory = theory;
    mSubTopic.youtube = image;
    setSelected(mSubTopic.title);

    toast.update(id, {
      render: "Done!",
      type: "success",
      isLoading: false,
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
    });
    setTheory(theory);
    if (type === "video & text course") {
      setMedia(image);
    } else {
      setMedia(mSubTopic.image);
    }
    mSubTopic.done = true;
    updateCourse();
  }

  async function updateCourse() {
    CountDoneTopics();
    localStorage.setItem("jsonData", JSON.stringify(jsonData));
    const dataToSend = {
      content: JSON.stringify(jsonData),
      courseId: courseId,
    };
    try {
      const postURL = API + "/api/update";
      await axios.post(postURL, dataToSend);
    } catch (error) {
      updateCourse();
    }
  }

  async function sendVideo(query, mTopic, mSubTopic, id, subtop) {
    const dataToSend = {
      prompt: query,
    };
    try {
      const postURL = API + "/api/yt";
      const res = await axios.post(postURL, dataToSend);

      try {
        const generatedText = res.data.url;
        sendTranscript(generatedText, mTopic, mSubTopic, id, subtop);
      } catch (error) {
        sendVideo(query, mTopic, mSubTopic, id, subtop);
      }
    } catch (error) {
      sendVideo(query, mTopic, mSubTopic, id, subtop);
    }
  }

  async function sendTranscript(url, mTopic, mSubTopic, id, subtop) {
    const dataToSend = {
      prompt: url,
    };
    try {
      const postURL = API + "/api/transcript";
      const res = await axios.post(postURL, dataToSend);

      try {
        const generatedText = res.data.url;
        const allText = generatedText.map((item) => item.text);
        const concatenatedText = allText.join(" ");
        const prompt = `Summarize this theory in a teaching way :- ${concatenatedText}.`;
        sendSummery(prompt, url, mTopic, mSubTopic, id);
      } catch (error) {
        const prompt = `Explain me about this subtopic of ${mainTopic} with examples :- ${subtop}. Please Strictly Don't Give Additional Resources And Images.`;
        sendSummery(prompt, url, mTopic, mSubTopic, id);
      }
    } catch (error) {
      const prompt = `Explain me about this subtopic of ${mainTopic} with examples :- ${subtop}.  Please Strictly Don't Give Additional Resources And Images.`;
      sendSummery(prompt, url, mTopic, mSubTopic, id);
    }
  }

  async function sendSummery(prompt, url, mTopic, mSubTopic, id) {
    const dataToSend = {
      prompt: prompt,
    };
    try {
      const postURL = API + "/api/generate";
      const res = await axios.post(postURL, dataToSend);
      const generatedText = res.data.text;
      const htmlContent = generatedText;
      try {
        const parsedJson = htmlContent;
        sendDataVideo(url, parsedJson, mTopic, mSubTopic, id);
      } catch (error) {
        sendSummery(prompt, url, mTopic, mSubTopic, id);
      }
    } catch (error) {
      sendSummery(prompt, url, mTopic, mSubTopic, id);
    }
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const defaultMessage = `<p>Hey there! I'm your AI teacher. If you have any questions about your ${mainTopic} course, whether it's about videos, images, or theory, just ask me. I'm here to clear your doubts.</p>`;
  const defaultPrompt = `I have a doubt about this topic :- ${mainTopic}. Please clarify my doubt in very short :- `;

  const loadMessages = async () => {
    try {
      const jsonValue = localStorage.getItem(mainTopic);
      if (jsonValue !== null) {
        setMessages(JSON.parse(jsonValue));
      } else {
        const newMessages = [
          ...messages,
          { text: defaultMessage, sender: "bot" },
        ];
        setMessages(newMessages);
        await storeLocal(newMessages);
      }
    } catch (error) {
      loadMessages();
    }
  };

  const sendMessage = async () => {
    if (newMessage.trim() === "") return;

    const userMessage = { text: newMessage, sender: "user" };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    await storeLocal(updatedMessages);
    setNewMessage("");

    let mainPrompt = defaultPrompt + newMessage;
    const dataToSend = { prompt: mainPrompt };
    const url = API + "/api/chat";

    try {
      const response = await axios.post(url, dataToSend);

      if (response.data.success === false) {
        sendMessage();
      } else {
        const botMessage = { text: response.data.text, sender: "bot" };
        const updatedMessagesWithBot = [...updatedMessages, botMessage];
        setMessages(updatedMessagesWithBot);
        await storeLocal(updatedMessagesWithBot);
      }
    } catch (error) {}
  };

  async function storeLocal(messages) {
    try {
      localStorage.setItem(mainTopic, JSON.stringify(messages));
    } catch (error) {
      localStorage.setItem(mainTopic, JSON.stringify(messages));
    }
  }

  const redirectcourse = () => {
    navigate("/course");
  };

  const renderTopicsAndSubtopics = (topics) => {
    return (
      <>
        <span
          className=" flex gap-2 mx-4 items-center text-white font-poppins font-extralight "
          onClick={redirectcourse}
          // onClick={() => setIsSidebarOpen(false)}
        >
          <FaCaretSquareLeft className="text-lg" />
          <p className="my-3 "> Back to Home</p>
        </span>
        <div className=" font-poppins font-extralight ">
          {topics.map((topic) => (
            <div key={topic.title} className="">
              <div className=" ">
                <button
                  onClick={() => handleOpenClose(topic.title)}
                  type="button"
                  className={`inline-flex  justify-between w-full text-left text-lg  text-white px-6 py-2.5 ${
                    openTopics[topic.title]
                      ? "bg-gradient-to-r from-[#110038] to-[#08006B]"
                      : ""
                  }`}
                >
                  {topic.title}
                  <IoIosArrowDown
                    className={` h-5 w-5 mt-2 transition-transform bg-white text-[#200098] rounded ${
                      openTopics[topic.title] ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {openTopics[topic.title] && (
                  <div className="px-5">
                    <div
                      className="py-0.5"
                      role="menu"
                      aria-orientation="vertical"
                    >
                      {topic.subtopics.map((subtopic) => (
                        <p
                          key={subtopic.title}
                          onClick={() =>
                            handleSelect(topic.title, subtopic.title)
                          }
                          className="flex py-1 text-base items-center font-extralight text-white cursor-pointer"
                          role="menuitem"
                        >
                          {subtopic.title}
                          {subtopic.done && (
                            <FaCheck className="ml-2" size={12} />
                          )}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </>
    );
  };

  return (
    <>
      <Headers show={"no"} />
      {!mainTopic ? null : (
        <div className="flex flex-col h-screen bg-gradient-to-r from-[#110038] to-[#08006B] ">
          import {motion} from "framer-motion";
          {isAnimationVisible && (
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{
                duration: 1,
                ease: [0.6, -0.05, 0.01, 0.99],
              }}
              className="fixed bottom-36 right-10 z-50"
            >
              <div className="relative bg-gradient-to-r from-purple-500 to-blue-500 text-white p-3 rounded-xl shadow-lg w-56 font-poppins border-2">
                <p className="text-center text-sm font-light leading-relaxed">
                  Hi, I am your AI teacher. <br />
                  You can ask me any doubts you have on this course.
                </p>

                <div className="absolute -bottom-2 right-6 h-5 w-5 rotate-45 bg-gradient-to-r from-blue-500 to-blue-500"></div>
              </div>
            </motion.div>
          )}
          <div
            onClick={() => setIsOpenDrawer(true)}
            className="m-5 fixed bottom-8 right-6 z-40  lg:w-32  md:w-32  w-24 h-16  text-white  flex justify-center items-center shadow-md "
          >
            <img src={robot} alt="Image" />
          </div>
          <div className="flex flex-row overflow-y-auto mt-12 ">
            <div
              className={`${
                isSidebarOpen ? "w-full" : "w-0"
              } md:w-3/12 bg-[#200098] overflow-y-auto transition-all duration-300 relative`}
            >
              <div className="mt-3">
                {jsonData &&
                  renderTopicsAndSubtopics(jsonData[mainTopic.toLowerCase()])}
              </div>
            </div>
            <div
              className={`overflow-y-auto flex-grow flex-col ${
                isSidebarOpen ? "hidden" : "w-full"
              } md:w-9/12`}
            >
              <button
                className="md:hidden block p-2 bg-[#200098] text-white fixed top-12 left-0 z-30 w-full"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                ☰ Open Sub Topics
              </button>
              <nav className="py-5 bg-gradient-to-b from-[#110038] via-[#150243] to-[#150243] border-b border-white flex items-center">
                <div className="ml-1  flex flex-col w-1/2">
                  <TruncatedText text={mainTopic} len={10} />
                  {isComplete ? (
                    <p
                      onClick={finish}
                      className="mr-3 underline text-white font-normal mx-8"
                    >
                      Download Certificate
                    </p>
                  ) : (
                    <span className="text-white">
                      <p className="w-3/4 text-end mx-4 text-lg font-extralight">{`${percentage}%`}</p>
                      <div className="w-3/4 bg-gray-200 rounded-full h-4 dark:bg-gray-700 mx-5">
                        <div
                          className="bg-gradient-to-r from-[#3D03FA] to-[#A71CD2] h-4 rounded-full"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <p className="mx-6 mt-0.5 text-sm">Completion status</p>
                    </span>
                  )}
                </div>
              </nav>
              <div className="px-5 text-white bg-gradient-to-b from-[#110038] via-[#150243] to-[#300080] pt-5 font-poppins font-extralight">
                <p className="text-white font-normal text-lg">{selected}</p>
                <div className="overflow-hidden mt-4 text-white text-base pb-10 max-w-full">
                  {type === "video & text course" ? (
                    <div>
                      <YouTube
                        key={media}
                        className="mb-5 overflow-auto no-scrollbarss"
                        videoId={media}
                        opts={opts}
                      />
                      <StyledText text={theory} />
                    </div>
                  ) : (
                    <div>
                      <StyledText text={theory} />
                      <img
                        className="overflow-hidden p-10"
                        src={media}
                        alt="Media"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div
            className={`fixed inset-0 z-50 ${
              isOpenDrawer ? "block" : "hidden"
            }`}
          >
            <div className="bg-[#200098] h-full lg:w-96 md:w-80 w-72 right-0 absolute">
              <div className="flex justify-end items-center p-2">
                <button
                  onClick={() => setIsOpenDrawer(false)}
                  className="text-white"
                >
                  <IoClose size={24} />
                </button>
              </div>
              <div
                className="overflow-y-auto"
                style={{ height: "calc(100% - 200px)" }}
              >
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex font-poppins font-extralight text-base ${
                      msg.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`rounded-lg  p-1 m-2 ${
                        msg.sender === "user"
                          ? "text-center text-white"
                          : "text-center text-white"
                      }`}
                    >
                      <div dangerouslySetInnerHTML={{ __html: msg.text }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mx-6 mt-2">
                <input
                  value={newMessage}
                  placeholder="Ask Something..."
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="w-full border border-gray-300 rounded-md outline-none py-5 text-center  "
                  type="text"
                />
              </div>
              <div className="flex justify-center">
                <button
                  className={`text-white text-base bg-gradient-to-r from-[#3D03FA] to-[#A71CD2] w-1/2 py-2.5 my-5 `}
                  type="submit"
                  onClick={sendMessage}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Content;
