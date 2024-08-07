/*eslint-disable*/
import React, { useEffect, useMemo, useRef, useState } from "react";
import Navbar from "../../components/Navbar";
import "aos/dist/aos.css";
import ReactPlayer from "react-player";
import video1 from "../../assets/videos/landing_bg.mov";
import logo from "../../assets/images/logoIcon.png";
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
    text: "RWE",
    title: "RWE",
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
      <section className="w-full flex flex-col justify-center items-center relative h-[100vh]">
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
        
       
        <div className="z-2  rounded-xl px-12 py-10 flex flex-col items-center justify-center gap-4">
          <h2 className="md:text-[3rem] backdrop-blur-sm text-[1.5rem] nd:max-w-[70%] max-w-[90%] text-[#fff] text-center font-[400]">
            Empowering organizations to improve patient care with AI and RWE
          </h2>
          <div className="h-[10rem] p-2 flex items-center gap-2 rounded-lg">
            {/* <img src={logo} className="h-full" alt="logo" /> */}
            <PrimaryBtn
              text={"RWE"}
              bg={"transparent"}
              onClick={() => handleNavigate("rnd")}
              className={
                "px-10  before:absolute before:left-0 relative z-2 border text-[#ffff] border-[#fff] hover:text-[#000] before:top-0 before:bg-[#fff]  before:-z-2 overflow-hidden before:overflow-hidden before:w-full before:h-0 hover:before:top-[unset] hover:before:h-full hover:before:bottom-0 before:transition-all before:duration-200 before:ease-in-out md:text-2xl text-md hover:scale-105 text-[#000]"
              }
            />
            <PrimaryBtn
              text={"Medical Affairs"}
              bg={"transparent"}
              onClick={() => handleNavigate("medicalaffairs")}
              className={
                "px-10  before:absolute before:left-0 relative z-2 border text-[#ffff]  border-[#fff] hover:text-[#000] before:top-0 before:bg-[#fff]  before:-z-2 overflow-hidden before:overflow-hidden before:w-full before:h-0 hover:before:top-[unset] hover:before:h-full hover:before:bottom-0 before:transition-all before:duration-200 before:ease-in-out md:text-2xl text-md hover:scale-105 text-[#000]"
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
                <div className="md:px-4 px-0  w-full  min-h-[20rem] ">
                  <div className=" grid grid-cols-1 custom:grid-cols-2">
                    <div className="flex h-full justify-center col-span-1 flex-col items-center gap-4">
                      <div className="md:text-3xl text-xl font-[500] text-center">
                        {item.title}
                      </div>
                      <div className="md:text-xl max-w-[70%] text-md text-center">
                        {item.description}
                      </div>
                      <PrimaryBtn
                        onClick={() => handleNavigate(item.link)}
                        text={"Learn more"}
                        className={"px-10 bg-[#0A1172]  hover:scale-105 transition-all ease-in-out duration-200 md:text-2xl mt-2 text-md text-[#fff]"}
                      />
                    </div>
                    <div className="col-span-1 grid place-content-center custom:mt-0 mt-10 w-[80%] mx-auto h-[30rem]">
                      {item.img && (
                        <img
                          src={item.img}
                          alt={item.title}
                          className="object-contain w-full h-full"
                        />
                      )}
                      {item.video && (
                        <ReactPlayer
                          muted={true}
                          url={item.video}
                          loop
                          playsinline
                          onReady={handleReady}
                          playing={true}
                          controls={false}
                        />
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
    
      <ContactFooter />
      <section>
        <div className="grid custom:grid-cols-2 grid-cols-1 px-10 md:px-28 py-20">
          <div className="flex flex-col items-start gap-4">
            <h2 className="md:text-6xl text-3xl custom:max-w-[100%] max-w-[100%] font-[600]">
              Over 18 years of achievements
            </h2>
            <p>With out super powers we have reached this</p>
          </div>
          <div className="grid custom:mt-0 mt-10 md:gap-8 gap-10 grid-cols-1 md:grid-cols-2">
            <div className="flex items-center gap-2">
              <img src={icon} />
              <div className="flex flex-col items-start">
                <h2 className="text-3xl font-[600]">10,000+</h2>
                <p>Downloads per day</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <img src={Icon_2} />
              <div className="flex flex-col items-start">
                <h2 className="text-3xl font-[600]">2 Million</h2>
                <p>Users</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <img src={Icon_3} />
              <div className="flex flex-col items-start">
                <h2 className="text-3xl font-[600]">500+</h2>
                <p>Clients</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <img src={Icon_4} />
              <div className="flex flex-col items-start">
                <h2 className="text-3xl font-[600]">140</h2>
                <p>Countries</p>
              </div>
            </div>
          </div>
        </div>
      </section>
   
      <Footer />
    </>
  );
}
