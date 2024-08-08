/*eslint-disable*/
import React, { useEffect, useMemo, useRef, useState } from "react";
import Navbar from "../../components/Navbar";
import "aos/dist/aos.css";
import ReactPlayer from "react-player";
import video1 from "../../assets/videos/landing_bg.mov";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
import PrimaryBtn from "../../components/PrimaryBtn";
import Footer from "../../components/Footer";
import gsap from "gsap/all";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MA_Section_Homepage from "../../assets/images/MA_Section_Homepage.svg";
import icon from "../../assets/images/Icon.png";
import Icon_2 from "../../assets/images/Icon_2.png";
import Icon_3 from "../../assets/images/Icon_3.png";
import Icon_4 from "../../assets/images/Icon_4.png";
import rnd from "../../assets/videos/R&D_Section_Homepage.mp4";
import Testimonials from "../../components/Testimonials";
import ContactFooter from "../../components/ContactFooter";

gsap.registerPlugin(ScrollTrigger);

const SolutionsList = [
  {
    id: 1,
    text: "R&D",
    title: "R&D",
    link: "rnd",
    video: rnd,
    description:
      "Predict patient outcomes, optimize clinical trials, and enhance recruitment efficiency for faster, more accurate therapeutic innovation",
  },
  {
    id: 2,
    text: "Medical Affairs",
    link: "medicalaffairs",
    img: MA_Section_Homepage,
    title: "Medical Affairs",
    description:
      "Measure variations in care, promote best practices, customize outreach, and measure the results of initiatives",
  },
  // {
  //   id: 3,
  //   text: "Non-Profits",
  //   link: "nonprofits",
  //   title: "Non-Profits",
  //   description:
  //     "Tailor messaging based on profiles to bring the most impactful messages to the right audiences to influence care",
  // },
];



export default function Index() {
  const video1ref = useRef(null);
  const [currentToggle, setCurrentToggle] = useState(0);


  const [loop, setLoop] = useState(true);

  var settings = useMemo(
    () => ({
      dots: false,
      arrows: false,
      infinite: true,
      speed: 500,
      autoplay: loop,
      autoplaySpeed: 3000,
      slidesToShow: 1,
      slidesToScroll: 1,
      afterChange: (e) => {
        setCurrentToggle(e);
      },
    }),
    [loop]
  );


  const handleReady = () => {
    console.log("first");
  };

  const sliderRef = useRef(null);

  const navigate = useNavigate();

  const handleClick = (index) => {
    setLoop(false)
    sliderRef.current.slickGoTo(index);
  };

  const handleNavigate = (val) => {
    navigate(val);
  };

 
  return (
    <>
      <Navbar darkMode />
      <section className="w-full flex flex-col justify-center relative items-center h-[100vh]">
        <ReactPlayer
          muted={true}
          id="introVideo"
          url={video1}
          loop
          width={"100vw"}
          height={"100vh"}
          className="object-cover absolute left-0 top-0"
          ref={video1ref}
          playsinline
          onReady={handleReady}
          playing={true}
          controls={false}
        />
        <div className="absolute left-0 top-0 w-[100vw] h-[100vh]    backdrop-blur-sm"></div>
        
       
        <div className="z-2  rounded-xl px-12 py-10 flex flex-col items-center justify-center gap-4">
          <h2 className="md:text-[3rem] font-secondary text-[1.5rem]  text-[#fff] text-center font-[400]">
            Empowering organizations to improve <br/> patient care with AI and RWE
          </h2>
          <div className="h-[10rem] p-2 flex items-center gap-2 rounded-lg">
            {/* <img src={logo} className="h-full" alt="logo" /> */}
            <PrimaryBtn
              text={"R&D"}
              bg={"transparent"}
              onClick={() => handleNavigate("rnd")}
              className={
                "px-10  before:absolute before:left-0 relative rounded-lg z-2 border text-[#ffff] border-[#fff] hover:text-[#000] before:top-0 before:bg-[#fff]  before:-z-2 overflow-hidden before:overflow-hidden before:w-full before:h-0 hover:before:top-[unset] hover:before:h-full hover:before:bottom-0 before:transition-all before:duration-200 before:ease-in-out md:text-2xl text-md hover:scale-105 text-[#000]"
              }
            />
            <PrimaryBtn
              text={"Medical Affairs"}
              bg={"transparent"}
              onClick={() => handleNavigate("medicalaffairs")}
              className={
                "px-10  before:absolute before:left-0 relative  rounded-lg z-2 border text-[#ffff]  border-[#fff] hover:text-[#000] before:top-0 before:bg-[#fff]  before:-z-2 overflow-hidden before:overflow-hidden before:w-full before:h-0 hover:before:top-[unset] hover:before:h-full hover:before:bottom-0 before:transition-all before:duration-200 before:ease-in-out md:text-2xl text-md hover:scale-105 text-[#000]"
              }
            />
            {/* <PrimaryBtn text={"Talk to an Expert"} bg={"#c4c4c4"}  className={"px-10  md:text-2xl textmd hover:scale-105 text-[#000]"} /> */}
          </div>
        </div>
      </section>
      <section className="relative overflow-hidden py-10   bg-gray-100">
        <div className="flex flex-none flex-wrap justify-center gap-6 items-center px-10 py-4">
          {SolutionsList.map((item, index) => (
            <div
              onClick={() => handleClick(index)}
              className={`${
                currentToggle === index && "bg-slate-300"
              } font-[500] md:text-2xl text-md  rounded-md text-center hover:bg-slate-300 p-2 cursor-pointer`}
            >
              {item.text}
            </div>
          ))}
        </div>
        <div className="md:px-20 px-10 h-full justify-center flex flex-col relative">
          <Slider ref={sliderRef} {...settings}>
            {SolutionsList.map((item) => {
              return (
                <div className="md:px-4 px-0  w-full  ">
                  <div className="flex flex-col md:flex-row items-center justify-between">
                    <div className="flex h-full justify-center flex-col items-center gap-4">
                      <div className="md:text-3xl text-xl font-[500] text-center">
                        {item.title}
                      </div>
                      <div className="md:text-xl  text-md max-w-[70%] text-center">
                        {item.description}
                      </div>
                      <PrimaryBtn
                        onClick={() => handleNavigate(item.link)}
                        text={"Learn more"}
                        className={"px-10 bg-[#0A1172] rounded-lg  hover:scale-105 transition-all ease-in-out duration-200 md:text-2xl mt-2 text-md text-[#fff]"}
                      />
                    </div>
                    <div className="grid place-content-center custom:mt-0 mt-10 w-[90%] mx-auto ">
                      {item.img && (
                        <img
                          src={item.img}
                          alt={item.title}
                          className="object-contain max-w-none h-full w-full"
                        />
                      )}
                      {item.video && (
                        <div className="h-full md:w-[50vw] w-[70vw] py-10">
                        <ReactPlayer
                          muted={true}
                          url={item.video}
                         width={"100%"}
                         height={"100%"}
                          loop
                          playsinline
                          onReady={handleReady}
                          playing={true}
                          controls={false}
                        />
                      </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </Slider>
        </div>
      </section>
      <Testimonials />
    
     
      <section>
        <div className="grid bg-gray-100 custom:grid-cols-2 grid-cols-1 px-10 md:px-28 py-20">
          <div className="flex flex-col items-start gap-4">
            <h2 className="md:text-5xl text-2xl custom:max-w-[70%] max-w-[70%] font-[600]">
              The most predictive machine learning algorithms
            </h2>
       
            <p className="">
            Leveraging a proprietary library of more than 50,000 patient features
            </p>
          </div>
          <div className="grid custom:mt-0 mt-10 md:gap-8 gap-10 grid-cols-1 md:grid-cols-2">
            <div className="flex items-center gap-2">
              <img src={icon} />
              <div className="flex flex-col items-start">
                <h2 className="text-xl font-[600]">
                  {">50k predictive features"}
                </h2>
                {/* <p>Downloads per day</p> */}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <img src={Icon_2} />
              <div className="flex flex-col items-start">
                <h2 className="text-xl font-[600]">All diseases</h2>
                {/* <p>Users</p> */}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <img src={Icon_3} />
              <div className="flex flex-col items-start">
                <h2 className="text-xl font-[600]">Dozens of use cases</h2>
                {/* <p>Clients</p> */}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <img src={Icon_4} />
              <div className="flex flex-col items-start">
                <h2 className="text-xl font-[600]">
                  Claims, Medical Records, Proprietary Webscraped Datasets
                </h2>
                {/* <p>Countries</p> */}
              </div>
            </div>
          </div>
        </div>
      </section>
      <ContactFooter />
   
      <Footer />
    </>
  );
}
