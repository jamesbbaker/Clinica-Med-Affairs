/*eslint-disable*/
import React, { useEffect, useRef, useState } from "react";
import Navbar from "../../components/Navbar";
import "aos/dist/aos.css";
import ReactPlayer from "react-player";
import video1 from "../../assets/videos/landing_bg.mov";
import logo from "../../assets/images/logoIcon.png";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
import PrimaryBtn from "../../components/PrimaryBtn";
import Footer from "../../components/Footer";

const SolutionsList = [
  {
    id: 1,
    text: "R&D",
    title: "R&D",
    link: "rnd",
    description:
      "Our clinical and data experts have years of experience in mapping the patient journey from diagnosis to post-treatment across more than 20 diseases.",
  },
  {
    id: 2,
    text: "Medical Affairs",
    link: "medicalaffairs",
    title: "Medical Affairs",
    description:
      "Measure disparities in care in a disease down to the individual physician",
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

const texts = [
  "Find patients without diagnosis (e.g., endometriosis, dementia)",
  "Determine risk or severity of disease (e.g., high risk of Severe COVID Outcomes)",
  "Assess staging of disease (e.g., breast, lung cancer staging)",
  "Determine unobserved biomarkers (e.g., EGFR, HER2, PD-L1)",
  "Account for patients with incomplete data",
];

export default function Index() {
  const video1ref = useRef(null);
  const [currentToggle, setCurrentToggle] = useState(0);

  var settings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 2000,
    slidesToShow: 1,
    slidesToScroll: 1,
    afterChange: (e) => {
      setCurrentToggle(e);
    },
  };

  const handleReady = () => {
    console.log("first");
  };

  const sliderRef = useRef(null);

  const navigate = useNavigate();

  const handleClick = (index) => {
    sliderRef.current.slickGoTo(index);
  };

 
  const handleNavigate = (val) => {
    navigate(val);
  };

  return (
    <>
      <Navbar  darkMode/>
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
          <h2 className="md:text-[3rem] text-[1.5rem] nd:max-w-[70%] max-w-[90%] text-[#fff] text-center font-[400]">
            Empowering organizations to improve patient care with AI and RWE
          </h2>
          <div className="h-[10rem] p-2 flex items-center gap-2 rounded-lg">
            {/* <img src={logo} className="h-full" alt="logo" /> */}
            <PrimaryBtn text={"Request a Demo"} bg={"#c4c4c4"} className={"px-10 md:text-2xl text-md hover:scale-105 text-[#000]"} />
            <PrimaryBtn text={"Talk to an Expert"} bg={"#c4c4c4"}  className={"px-10  md:text-2xl textmd hover:scale-105 text-[#000]"} />
          </div>
        </div>
      </section>
      <section className="relative overflow-hidden py-20   bg-gray-100">
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
                <div className="md:px-4 px-0 py-10 w-full  min-h-[20rem] ">
                  <div className=" grid grid-cols-1 custom:grid-cols-2">
                    <div className="flex h-full justify-center col-span-1 flex-col items-center gap-4">
                      <div className="md:text-3xl text-xl font-[500] text-center">
                        {item.title}
                      </div>
                      <div className="md:text-xl text-md text-center">
                        {item.description}
                      </div>
                      <PrimaryBtn
                        onClick={() => handleNavigate(item.link)}
                        text={"Learn more"}
                        className={"px-10 md:text-2xl text-md text-[#fff]"}
                      />
                    </div>
                    <div className="col-span-1 custom:mt-0 mt-10 w-[80%] mx-auto h-[30rem] border-2 "></div>
                  </div>
                </div>
              );
            })}
          </Slider>
        </div>
      </section>
      <section className="min-h-[50vh] md:px-20 px-10 bg-gray-100 z-2 grid grid-cols-1">
        <div className="grid md:px-10 bg-gray-100 place-content-center">
          <h2 className="md:text-3xl text-xl text-center font-[400]">
            Each of our solutions leverages distinctive clinical and AI
            machinery to answer the most important questions
          </h2>
        </div>
        <div className="grid gap-6 mt-10 md:mt-0 md:grid-cols-3 grid-cols-2 mb-20 bg-gray-100">
          {texts.map((text, index) => (
            <div
              key={index}
              className={`transition-opacity md:text-xl text-md text-center grid place-content-center duration-700 ease-in-out`}
            >
              {text}
            </div>
          ))}
        </div>
      </section>
      <section className="grid bg-slate-200 px-10 py-20 grid-cols-2">
        <div className="px-10 grid place-content-center py-10">
          <PrimaryBtn text={"Request a Demo"} className={"px-10 md:text-2xl text-md text-[#fff]"} />
        </div>
        <div className="px-10 grid place-content-center py-10">
          <PrimaryBtn
            text={"Talk to an Expert"}
            className={"px-10 md:text-2xl text-md text-[#fff]"}
          />
        </div>
      </section>
      <Footer />
    </>
  );
}
