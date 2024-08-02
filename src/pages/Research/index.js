/*eslint-disable*/
import React, { useEffect, useRef, useState } from "react";
import Navbar from "../../components/Navbar";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AOS from "aos";
import "aos/dist/aos.css";
import ReactPlayer from "react-player";
import video1 from "../../assets/videos/randd.mp4";
import PrimaryBtn from "../../components/PrimaryBtn";
import Slider from "react-slick";
import clientLogo from "../../assets/images/Vector.png";
import icon from "../../assets/images/Icon.png";
import Icon_2 from "../../assets/images/Icon_2.png";
import Icon_3 from "../../assets/images/Icon_3.png";
import Icon_4 from "../../assets/images/Icon_4.png";
import Quote_mark from "../../assets/images/Quote_mark.png";
import { useNavigate } from "react-router-dom";
import { MdOutlineReplay } from "react-icons/md";
import Popup from "reactjs-popup";
import InputField from "../../components/InputField";
import DemoContact from "../../components/DemoContact";
import Footer from "../../components/Footer";

gsap.registerPlugin(ScrollTrigger);

const SolutionsList = [
  {
    id: 1,
    text: "Best-in-class outcome prediction algorithms",
    title: "Best-in-class outcome prediction algorithms",
    description:
      "Our clinical and data experts have years of experience in mapping the patient journey from diagnosis to post-treatment across more than 20 diseases.",
    cardText: "Medical Strategy",
  },
  {
    id: 2,
    text: "More accurate trial designs",
    title: "More accurate trial designs",
    description:
      "Measure disparities in care in a disease down to the individual physician",
    cardText: "",
  },
  {
    id: 3,
    text: "Improved patient allocations",
    title: "Improved patient allocations",
    description:
      "Tailor messaging based on profiles to bring the most impactful messages to the right audiences to influence care",
    cardText: "Tailored Messaging",
  },
];

export default function Research() {
  const [currentTab, setCurrentTab] = useState(0);

  useEffect(() => {
    AOS.init();
    SolutionsList.forEach((item) => {
      gsap.fromTo(
        `#solution-${item.id}`,
        {
          clipPath: "inset(0% 0% 100% 0)",
        },
        {
          clipPath: "inset(0% 0% 0% 0)",
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: `#solution-${item.id}`,
            start: "top 70%",
            end: "top 100%",
            scrub: 1,
            pin: false,
            pinSpacing: false,
            repeat: 0,
          },
        }
      );
    });
  }, []);

  const video1ref = useRef(null);
  const isAnimationPlayed = useRef(false);
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
    if (isAnimationPlayed.current) {
      return;
    }
    isAnimationPlayed.current = true;

    gsap.fromTo(
      `#introVideo`,
      {
        scale: 0,
      },
      {
        scale: 1,
        ease: "power2.inOut",
      }
    );
  };

  const sliderRef = useRef(null);

  const navigate = useNavigate();

  const handleClick = (index) => {
    sliderRef.current.slickGoTo(index);
  };

  const [showEnded, setShowEnded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [popupOpen, setPopup] = useState(false);

  const handleReplay = () => {
    setShowEnded(false);
    video1ref.current.seekTo(0);
    setIsPlaying(true);
  };

  const handleEnd = () => {
    setShowEnded(true);
    setIsPlaying(false);
  };

  const closeModal = () => {
    setPopup(false);
  };

  return (
    <>
      <Navbar />
      <section className="relative overflow-hidden">
        <div
          className="absolute left-1/2 transform -translate-x-1/2 bottom-0 pointer-events-none z-[-1]"
          aria-hidden="true"
        >
          <svg
            width="1360"
            height="578"
            viewBox="0 0 1360 578"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient
                x1="50%"
                y1="0%"
                x2="50%"
                y2="100%"
                id="illustration-01"
              >
                <stop stopColor="#FFF" offset="0%" />
                <stop stopColor="#EAEAEA" offset="77.402%" />
                <stop stopColor="#DFDFDF" offset="100%" />
              </linearGradient>
            </defs>
            <g fill="url(#illustration-01)" fillRule="evenodd">
              <circle cx="1232" cy="128" r="128" />
              <circle cx="155" cy="443" r="64" />
            </g>
          </svg>
        </div>

        <div className="z-[1] md:py-52 custom:py-32 py-20 mx-auto grid grid-cols-1 custom:grid-cols-2 custom:px-20 px-10 sm:px-6">
          {/* Hero content */}
          <div className="flex gap-10 px-10 flex-col items-center justify-center">
            {/* Section header */}

            <h1
              className="text-xl text-center custom:text-3xl md:text-6xl font-[600] leading-tighter"
              data-aos="zoom-y-out"
            >
              The first real-time Medical Affairs intelligence suite driven by
            </h1>
            <h1
              data-aos="zoom-y-out"
              data-aos-delay="150"
              className="text-3xl custom:text-3xl md:text-6xl font-extrabold leading-tighter tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400"
            >
              AI + RWD
            </h1>

            <PrimaryBtn
              onClick={() => setPopup(true)}
              text={"Request a Demo"}
              className={"md:px-10 px-4 md:text-2xl text:xs text-[#fff]"}
            />
          </div>
          <Popup
            onClose={closeModal}
            modal
            open={popupOpen}
            className="rounded-xl"
            position="center center"
          >
            <DemoContact />
          </Popup>
          <div className="relative w-full custom:mt-0 mt-10 grid place-content-center">
            <ReactPlayer
              // muted={true}
              id="introVideo"
              url={video1}
              onEnded={handleEnd}
              width={document.body.clientWidth < 800 ? 300 : 600}
              className="scale-0"
              ref={video1ref}
              playsinline
              onReady={handleReady}
              playing={isPlaying}
              onPlay={() => setIsPlaying(true)}
              controls={true}
            />
            {showEnded && (
              <div
                onClick={handleReplay}
                className=" absolute left-0 top-0 w-full h-full flex items-center justify-center"
              >
                <MdOutlineReplay size={80} className="cursor-pointer" />
              </div>
            )}
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
            } font-[500] md:text-2xl text-md rounded-md text-center hover:bg-slate-300 p-2 cursor-pointer`}
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
                    </div>
                    <div className="col-span-1 custom:mt-0 mt-10 w-[80%] mx-auto h-[30rem] border-2 "></div>
                  </div>
                </div>
              );
            })}
          </Slider>
        </div>
      </section>
      <section className="py-20 relative bg-[#D5FAFC] flex flex-col justify-center">
        <div className="w-full flex-col gap-10 cusotm:gap-0 relative h-full flex justify-center items-center">
          <div className="custom:absolute text-center custom:text-left custom:-top-4 custom:left-[20%] relative">
            <h2 className="text-4xl custom:max-w-[70%] max-w-[100%] font-[700]">
              <img
                src={Quote_mark}
                className="absolute -top-10 -left-28"
                alt="quote"
              />
              Real Stories from Real Customers
            </h2>
            <p className="text-center custom:text-left">
              Get inspired by these stories.
            </p>
          </div>
          <div className="grid relative items-center gap-4 custom:max-w-[70%] max-w-[100%] grid-cols-1 custom:grid-cols-2">
            <div className="md:w-[25rem] custom:mt-20 mt-0 flex flex-col gap-6 p-10 bg-white rounded-xl ">
              <img
                src={clientLogo}
                className="h-[2rem] w-[5rem] object-contain"
              />
              <p className="custom:text-lg text-md">
                To quickly start my startup landing page design, I was looking
                for a landing page UI Kit. Landify is one of the best landing
                page UI kit I have come across. It’s so flexible, well organised
                and easily editable.
              </p>
              <div className="flex flex-col items-start">
                <h2 className="font-[600]">Floyd Miles</h2>
                <p className="font-[300] text-[0.85rem]">
                  Vice President, GoPro
                </p>
              </div>
            </div>
            <div className="relative flex flex-col gap-4 items-start">
              <div className="md:w-[25rem] flex flex-col gap-6 p-10 bg-white rounded-xl ">
                <img
                  src={clientLogo}
                  className="h-[2rem] w-[5rem] object-contain"
                />
                <p className="custom:text-lg text-md">
                  I used landify and created a landing page for my startup
                  within a week. The Landify UI Kit is simple and highly
                  intuitive, so anyone can use it.
                </p>
                <div className="flex flex-col items-start">
                  <h2 className="font-[600]">Jane Cooper</h2>
                  <p className="font-[300] text-[0.85rem]">CEO, Airbnb</p>
                </div>
              </div>
              <div className="custom:w-[20rem] md:w-[25rem]  flex flex-col gap-6 p-10 bg-white rounded-xl ">
                <img
                  src={clientLogo}
                  className="h-[2rem] w-[5rem] object-contain"
                />
                <p className="custom:text-lg text-md">
                  Landify saved our time in designing my company page.
                </p>
                <div className="flex flex-col items-start">
                  <h2 className="font-[600]">Kristin Watson</h2>
                  <p className="font-[300] text-[0.85rem]">
                    Co-Founder, Strapi
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
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
