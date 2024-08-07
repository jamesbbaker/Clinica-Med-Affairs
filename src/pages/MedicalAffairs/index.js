/*eslint-disable*/
import React, { useEffect, useMemo, useRef, useState } from "react";
import Navbar from "../../components/Navbar";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AOS from "aos";
import "aos/dist/aos.css";
import ReactPlayer from "react-player";
import video1 from "../../assets/videos/intro.mp4";
import PrimaryBtn from "../../components/PrimaryBtn";
import Slider from "react-slick";
import icon from "../../assets/images/Icon.png";
import Icon_2 from "../../assets/images/Icon_2.png";
import Icon_3 from "../../assets/images/Icon_3.png";
import Icon_4 from "../../assets/images/Icon_4.png";

import { useNavigate } from "react-router-dom";
import { MdOutlineReplay } from "react-icons/md";
import Popup from "reactjs-popup";
import DemoContact from "../../components/DemoContact";
import medicalImg from "../../assets/images/medicalSvg.svg";
import targetImage from "../../assets/images/targetedEngagement.gif";
import tailoredMessaging from "../../assets/images/tailoredMessaging.gif";
import evidence from "../../assets/images/evidence.svg";
import Footer from "../../components/Footer";
import impactTracking from "../../assets/images/impactTracking.gif";
import Testimonials from "../../components/Testimonials";
import SolutionsTextSection from "../../components/SolutionsTextSection";
import ContactFooter from "../../components/ContactFooter";

gsap.registerPlugin(ScrollTrigger);

const SolutionsList = [
  {
    id: 1,
    text: "Medical Strategy",
    img: medicalImg,
    title: "Map of patient need across clinical journey",
    description:
      "Our clinical and data experts have years of experience in mapping the patient journey from diagnosis to post-treatment across more than 20 diseases.",
    cardText: "Medical Strategy",
  },
  {
    id: 2,
    text: "Targeted Engagement",
    img: targetImage,
    title: "HCPs, hospitals / clinics, plans patient need (MSL ready)",
    description:
      "Measure disparities in care in a disease down to the individual physician",
    cardText: "Targeted Engagement",
  },
  {
    id: 3,
    text: "Tailored Messaging",
    img: tailoredMessaging,
    title: "Tailored messaging based on deep profiles",
    description:
      "Tailor messaging based on profiles to bring the most impactful messages to the right audiences to influence care",
    cardText: "Tailored Messaging",
  },
  {
    id: 4,
    text: "Evidence Generation and Digital",
    img: evidence,
    title: "Generate evidence and materials to support strategy",
    description:
      "Develop evidence and digital tools to support targeted engagement strategy",
    cardText: "Evidence Generation and Digital",
  },
  {
    id: 5,
    text: "Impact Tracking",
    img: impactTracking,
    title: "Track impact of initiatives",
    description:
      "Track the real patient impact of initiatives in real-time across initiatives",
    cardText: "Impact Tracking",
  },
];

export default function MedicalAffairsLanding() {
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
    setLoop(false)
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
              className={
                "md:px-10  bg-[#0A1172]  hover:scale-105 transition-all ease-in-out duration-200 px-4 md:text-2xl text:xs text-[#fff]"
              }
            />
          </div>
          <Popup
            onClose={closeModal}
            modal
            open={popupOpen}
            className="rounded-xl"
            position="center center"
          >
            <DemoContact handleClose={closeModal} />
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
                    <div className="col-span-1 custom:mt-0 mt-10 w-[80%] mx-auto h-[30rem] grid place-content-center">
                      <img
                        src={item.img}
                        className="w-full object-contain"
                        alt="solution image"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </Slider>
        </div>
      </section>
      <SolutionsTextSection />
      {/* <section>
        <div className="grid bg-gray-200 custom:grid-cols-2 grid-cols-1 px-10 md:px-28 py-20">
          <div className="flex flex-col items-start gap-4">
            <h2 className="md:text-6xl text-3xl custom:max-w-[100%] max-w-[100%] font-[600]">
              Best-in-class AI prediction
            </h2>
            <p>
              Leveraging a proprietary feature library of over 50k patient
              features
            </p>
          </div>
          <div className="grid custom:mt-0 mt-10 md:gap-8 gap-10 grid-cols-1 md:grid-cols-2">
            <div className="flex items-center gap-2">
              <img src={icon} />
              <div className="flex flex-col items-start">
                <h2 className="text-xl font-[600]">
                  {">50k predictive features"}
                </h2>
              
              </div>
            </div>
            <div className="flex items-center gap-2">
              <img src={Icon_2} />
              <div className="flex flex-col items-start">
                <h2 className="text-xl font-[600]">All diseases</h2>
               
              </div>
            </div>
            <div className="flex items-center gap-2">
              <img src={Icon_3} />
              <div className="flex flex-col items-start">
                <h2 className="text-xl font-[600]">Dozes of use cases</h2>
             
              </div>
            </div>
            <div className="flex items-center gap-2">
              <img src={Icon_4} />
              <div className="flex flex-col items-start">
                <h2 className="text-xl font-[600]">
                  Claims, Medical Records, Proprietary Webscraped Datasets
                </h2>
               
              </div>
            </div>
          </div>
        </div>
      </section> */}
      <ContactFooter />
      <Footer />
    </>
  );
}
