/*eslint-disable*/
import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AOS from "aos";
import "aos/dist/aos.css";

gsap.registerPlugin(ScrollTrigger);

const SolutionsList = [
  {
    id: 1,
    title: "Map of patient need across clinical journey",
    description:
      "Our clinical and data experts have years of experience in mapping the patient journey from diagnosis to post-treatment across more than 20 diseases.",
    cardText: "Medical Strategy",
  },
  {
    id: 2,
    title: "HCPs, hospitals / clinics, plans patient need (MSL ready)",
    description:
      "Measure disparities in care in a disease down to the individual physician",
    cardText: "Segmentation and Targeted Engagement",
  },
  {
    id: 3,
    title: "Tailored messaging based on deep profiles",
    description:
      "Tailor messaging based on profiles to bring the most impactful messages to the right audiences to influence care",
    cardText: "Tailored Messaging and Evidence Generation",
  },
  {
    id: 4,
    title: "Track impact of initiatives",
    description:
      "Track the real patient impact of initiatives in real-time across initiatives",
    cardText: "Impact Tracking",
  },
];

export default function Index() {
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
        },
      );
    });
  }, []);

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

        <div className="max-w-6xl z-[1] mx-auto px-4 sm:px-6">
          {/* Hero content */}
          <div className="pt-32 pb-12 md:pt-40 md:pb-20">
            {/* Section header */}
            <div className="text-center pb-14 md:pb-16">
              <h1
                className="text-2xl md:text-6xl font-extrabold leading-tighter mb-4"
                data-aos="zoom-y-out"
              >
                The first real-time Medical Affairs intelligence suite driven by
              </h1>
              <h1
                data-aos="zoom-y-out"
                data-aos-delay="150"
                className="mt-8 text-3xl md:text-6xl font-extrabold leading-tighter tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400"
              >
                AI + RWD
              </h1>
              <div className="max-w-3xl mt-12 mx-auto">
                <p
                  className="text-md md:text-xl text-gray-600 mb-4"
                  data-aos="zoom-y-out"
                  data-aos-delay="250"
                >
                  Digital, AI, and RWD have enabled a new frontier of Medical
                  Affairs patient impact.
                </p>
                <p
                  className="text-md md:text-xl text-gray-600 mb-4"
                  data-aos="zoom-y-out"
                  data-aos-delay="300"
                >
                  We are able to measure granular patient care patterns
                  physician, hospital / clinic, and plan levels
                </p>
                <p
                  className="text-md md:text-xl text-gray-600 mb-4"
                  data-aos="zoom-y-out"
                  data-aos-delay="350"
                >
                  The app suite includes a real-time mapping of patient care
                  across the clinical treatment journey and deep profiles on
                  stakeholders including HCPs, hospitals / clinics, health
                  systems, and payers.
                </p>
                {/* <div
                  className="max-w-xs mx-auto sm:max-w-none sm:flex sm:justify-center"
                  data-aos="zoom-y-out"
                  data-aos-delay="300"
                >
                  <div>
                    <a
                      className="btn text-white bg-blue-600 hover:bg-blue-700 w-full mb-4 sm:w-auto sm:mb-0"
                      href="#0"
                    >
                      Start free trial
                    </a>
                  </div>
                  <div>
                    <a
                      className="btn text-white bg-gray-900 hover:bg-gray-800 w-full sm:w-auto sm:ml-4"
                      href="#0"
                    >
                      Learn more
                    </a>
                  </div>
                </div> */}
                <div className="grid md:grid-cols-2 mt-12 gap-8">
                  <div
                    data-aos="zoom-y-out"
                    data-aos-delay="400"
                    className="text-whit shadow-box mt-6 rounded-xl"
                  >
                    <h3 className="text-2xl text-white h-100  py-4 bg-[#7bdcb5] rounded-tr-xl rounded-tl-xl bg-circle font-bold ">
                      Problem
                    </h3>
                    <p className="text-lg py-6 text-gray-600  px-10">
                      Significant disparities in patient care across physicians,
                      institutions, payers, and regions
                    </p>
                  </div>
                  <div
                    data-aos="zoom-y-out"
                    data-aos-delay="400"
                    className="text-white h-100 shadow-box mt-6 rounded-xl"
                  >
                    <h3 className="text-2xl py-4 bg-[#87CEEB] rounded-tr-xl rounded-tl-xl bg-circle font-bold ">
                      Solution
                    </h3>
                    <p className="text-lg py-6 text-gray-600  px-10">
                      Best-in-class mapping of clinical patient care, variation
                      in care, and profiles across stakeholders to guide
                      initiatives
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="relative overflow-hidden  bg-gray-100">
        <div className=" max-w-6xl mx-auto px-4 sm:px-6">
          <div className="pt-12 md:pt-20">
            {/* Section header */}
            <div
              data-aos="zoom-y-out"
              data-aos-delay="150"
              className="max-w-3xl mx-auto text-center pb-12 md:pb-16"
            >
              <h1 className="text-md md:text-2xl h2 mb-4">Explore the app</h1>
              <p className="text-sm md:text-xl text-gray-600">
                The Medical Affairs AI Suite enables healthcare organizations to
                measure and maximize the patient impact of initiatives
              </p>
            </div>
            {/* Section content */}
            {/* Content */}
            <div className="max-w-xl h-[200vh] md:max-w-none md:w-full mx-auto">
              <div
                id={`solution-wrapper`}
                className="mb-8 overflow-hidden md:mb-0"
              >
                {SolutionsList.map((item, index) => {
                  return (
                    <div
                      key={index}
                      id={`solution-${item.id}`}
                      className="grid min-w-[50%] grid-cols-2 gap-10 mb-10"
                    >
                      <a
                        className={`flex flex-col-reverse justify-between md:flex-row items-center  md:h-[10rem] text-lg p-5 rounded border transition duration-300 ease-in-out `}
                        href="#0"
                      >
                        <div className="flex items-center flex-col">
                          <h4 className="font-bold text-sm md:text-xl leading-snug tracking-tight mb-1">
                            {item.title}
                          </h4>
                          <p className="text-xs md:text-md text-gray-600">
                            {item.description}
                          </p>
                        </div>
                        <div className="flex justify-center items-center w-4 h-4 md:w-8 md:h-8 bg-white rounded-full shadow flex-shrink-0 mb-4 md:ml-3">
                          <svg
                            className="w-2 h-2 md:w-3 md:h-3 fill-current"
                            viewBox="0 0 12 12"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M11.953 4.29a.5.5 0 00-.454-.292H6.14L6.984.62A.5.5 0 006.12.173l-6 7a.5.5 0 00.379.825h5.359l-.844 3.38a.5.5 0 00.864.445l6-7a.5.5 0 00.075-.534z" />
                          </svg>
                        </div>
                      </a>
                      <div
                        className={`h-[100%] w-[100%] grid place-content-center hero-card-${item.id}`}
                      >
                        <h1
                          className={`text-xl md:text-5xl font-extrabold  text-white`}
                        >
                          {item.cardText}
                        </h1>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
