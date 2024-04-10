/*eslint-disable*/
import React, { useState } from "react";
import Navbar from "../../components/Navbar";

export default function Index() {
  const [currentTab, setCurrentTab] = useState(0)
  return (
    <>
      <Navbar />
      <section className="relative">
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
                className="text-5xl md:text-6xl font-extrabold leading-tighter mb-4"
                data-aos="zoom-y-out"
              >
                The first real-time Medical Affairs intelligence suite driven by
              </h1>
              <h1 className="mt-8 text-5xl md:text-6xl font-extrabold leading-tighter tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
                AI + RWD
              </h1>
              <div className="max-w-3xl mt-12 mx-auto">
                <p
                  className="text-xl text-gray-600 mb-4"
                  data-aos="zoom-y-out"
                  data-aos-delay="150"
                >
                Digital, AI, and RWD have enabled a new frontier of Medical Affairs patient impact (A Vision for Medical Affairs in 2025, McKinsey)
                </p>
                <p  className="text-xl text-gray-600 mb-4"
                  data-aos="zoom-y-out"
                  data-aos-delay="150">
                Our apps empower Medical Affairs to measure and optimize the impact of initiatives across functions focusing on patient need.
                </p>
                <p  className="text-xl text-gray-600 mb-4"
                  data-aos="zoom-y-out"
                  data-aos-delay="150">
                The app suite includes a real-time mapping of patient care across the clinical treatment journey and deep profiles on stakeholders including HCPs, institutions, and payers
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
                <div className="grid grid-cols-2 mt-12 gap-8">
                  <div className="text-whit shadow-md mt-6 rounded-xl">
                    <h3 className="text-4xl text-white h-100  py-4 bg-[#7bdcb5] rounded-tr-xl rounded-tl-xl bg-circle font-bold ">Problem</h3>
                    <p className="text-xl py-6 text-gray-600  px-10">Significant disparities in patient care across physicians, institutions, payers, and regions</p>
                  </div>
                  <div className="text-white h-100 shadow-md mt-6 rounded-xl">
                    <h3 className="text-4xl py-4 bg-[#f78da7] rounded-tr-xl rounded-tl-xl bg-circle font-bold ">Solution</h3>
                    <p className="text-xl py-6 text-gray-600  px-10">Best-in-class mapping of clinical patient need, understanding of HCP care patterns, and care “fingerprints” of stakeholders to guide initiatives</p>
                  </div>
                </div>
                
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="relative before:w-screen before:h-[10rem] overflow-hidden before:bg-white before:absolute before:bottom-0 before:-left-18 bg-gray-100">
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <div className="pt-12 md:pt-20">

          {/* Section header */}
          <div className="max-w-3xl mx-auto text-center pb-12 md:pb-16">
            <h1 className="h2 mb-4">Explore the solutions</h1>
            <p className="text-xl text-gray-600">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat.</p>
          </div>

          {/* Section content */}
          <div className="md:grid md:grid-cols-12 md:gap-6">

            {/* Content */}
            <div className="max-w-xl md:max-w-none md:w-full mx-auto md:col-span-7 lg:col-span-6 md:mt-6" data-aos="fade-right">

              <div className="mb-8 md:mb-0">
                <a
                  className={`flex items-center  ${currentTab == 0 ? "bg-gray-300" : "bg-white"} text-lg p-5 rounded border transition duration-300 ease-in-out mb-3 `}
                  href="#0"
                  onClick={(e) => { e.preventDefault(); setCurrentTab(0); }}
                >
                  <div>
                    <div className="font-bold leading-snug tracking-tight mb-1">Real-time map of patient need across clinical journey</div>
                    <div className="text-gray-600">Track impact of initiatives on patient need (across all stakeholders)</div>
                  </div>
                  <div className="flex justify-center items-center w-8 h-8 bg-white rounded-full shadow flex-shrink-0 ml-3">
                    <svg className="w-3 h-3 fill-current" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11.953 4.29a.5.5 0 00-.454-.292H6.14L6.984.62A.5.5 0 006.12.173l-6 7a.5.5 0 00.379.825h5.359l-.844 3.38a.5.5 0 00.864.445l6-7a.5.5 0 00.075-.534z" />
                    </svg>
                  </div>
                </a>
                <a
                  className={`flex items-center ${currentTab == 1 ? "bg-gray-300" : "bg-white"} text-lg p-5 rounded border transition duration-300 ease-in-out mb-3 `}
                  href="#0"
                  onClick={(e) => { e.preventDefault(); setCurrentTab(1); }}
                >
                  <div>
                    <div className="font-bold leading-snug tracking-tight mb-1">HCPs by actionability and patient need (MSL ready)</div>
                    <div className="text-gray-600">{`HCP segmentation, prioritization, and profiles based on >1k features`}</div>
                  </div>
                  <div className="flex justify-center items-center w-8 h-8 bg-white rounded-full shadow flex-shrink-0 ml-3">
                    <svg className="w-3 h-3 fill-current" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11.854.146a.5.5 0 00-.525-.116l-11 4a.5.5 0 00-.015.934l4.8 1.921 1.921 4.8A.5.5 0 007.5 12h.008a.5.5 0 00.462-.329l4-11a.5.5 0 00-.116-.525z" fillRule="nonzero" />
                    </svg>
                  </div>
                </a>
                <a
                  className={`flex items-center ${currentTab == 2 ? "bg-gray-300" : "bg-white"}  text-lg p-5 rounded border transition duration-300 ease-in-out mb-3 `}
                  href="#0"
                  onClick={(e) => { e.preventDefault(); setCurrentTab(2); }}
                >
                  <div>
                    <div className="font-bold leading-snug tracking-tight mb-1">Institutions by actionability and patient need</div>
                    <div className="text-gray-600">Profiles on institutions including comparison to others and variability in care </div>
                  </div>
                  <div className="flex justify-center items-center w-8 h-8 bg-white rounded-full shadow flex-shrink-0 ml-3">
                    <svg className="w-3 h-3 fill-current" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11.334 8.06a.5.5 0 00-.421-.237 6.023 6.023 0 01-5.905-6c0-.41.042-.82.125-1.221a.5.5 0 00-.614-.586 6 6 0 106.832 8.529.5.5 0 00-.017-.485z" fill="#191919" fillRule="nonzero" />
                    </svg>
                  </div>
                </a>
                <a
                  className={`flex items-center ${currentTab == 3 ? "bg-gray-300" : "bg-white"}  text-lg p-5 rounded border transition duration-300 ease-in-out mb-3 `}
                  href="#0"
                  onClick={(e) => { e.preventDefault(); setCurrentTab(3); }}
                >
                  <div>
                    <div className="font-bold leading-snug tracking-tight mb-1">Payers by actionability and patient need</div>
                    <div className="text-gray-600">Profiles on payers including comparison to others and variability in care</div>
                  </div>
                  <div className="flex justify-center items-center w-8 h-8 bg-white rounded-full shadow flex-shrink-0 ml-3">
                    <svg className="w-3 h-3 fill-current" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11.334 8.06a.5.5 0 00-.421-.237 6.023 6.023 0 01-5.905-6c0-.41.042-.82.125-1.221a.5.5 0 00-.614-.586 6 6 0 106.832 8.529.5.5 0 00-.017-.485z" fill="#191919" fillRule="nonzero" />
                    </svg>
                  </div>
                </a>
              </div>
            </div>

            {/* Tabs items */}
            <div className="max-w-xl md:max-w-none md:w-full mx-auto md:col-span-5 lg:col-span-6 mb-8 md:mb-0 md:order-1">
              <div className="transition-all">
                {currentTab == 0 && <div className="w-[25rem] h-[25rem] grid place-content-center rounded-xl hero-card-1">
                  <h1 className="text-5xl font-extrabold text-white">HQ</h1>
                  </div>}
                  {currentTab == 1 && <div className="w-[25rem] h-[25rem] grid place-content-center rounded-xl hero-card-2">
                  <h1 className="text-5xl font-extrabold text-white">HCP</h1>
                  </div>}
                  {currentTab == 2 && <div className="w-[25rem] h-[25rem] grid place-content-center rounded-xl hero-card-3">
                  <h1 className="text-5xl font-extrabold text-white">Institution</h1>
                  </div>}
                  {currentTab == 3 && <div className="w-[25rem] h-[25rem] grid place-content-center rounded-xl hero-card-4">
                  <h1 className="text-5xl font-extrabold text-white">Payer</h1>
                  </div>}
                
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
    </>
  );
}
