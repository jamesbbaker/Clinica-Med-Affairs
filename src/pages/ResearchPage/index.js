import React from "react";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";

const articles = [
  {
    name: "Article 1",
    desc: "More acurate trials with RWE",
  },
  {
    name: "Article 2",
    desc: "Roots of physician variation in care",
  },
  {
    name: "Article 3",
    desc: "Severe COVID Outcomes Risk Score",
  },
];

const publications = [
  {
    title: "Development of a Novel Clinical Risk Score for COVID-19 Infections",
    sub: "JB Baker, A Ghatak, MR Cullen, RI Horwitz",
    desc: "The American Journal of Medicine 136 (12), 1169-1178. e7",
    year: 2023,
    link: "https://www.amjmed.com/article/S0002-9343(23)00551-X/fulltext",
  },
  {
    title:
      "Randomization Bias, Multi-Morbidity, and the Composite Clinical Score",
    sub: "RI Horwitz, JB Baker, A Ghatak, MR Cullen, ",
    desc: "Psychotherapy and Psychosomotics 8, 9",
    year: 2024,
    link: "https://karger.com/pps/article/doi/10.1159/000539522/909321/Randomization-Bias-Multi-Morbidity-and-the",
  },
];

const ResearchPage = () => {
    const navigate = useNavigate()

    const handleClick = (link) => {
        window.location.href = link
    }

  return (
    <>
      <Navbar />
      <div className="px-20 py-20">
        <h2 className="text-5xl mt-10 font-[500]">Research</h2>
        <h2 className="text-4xl mt-10 font-[500]">Articles</h2>
        <div className="text-[#000] grid grid-cols-4 mt-10 items-center gap-4 ">
          {articles.map((item) => (
            <div className="border-2 cursor-pointer p-6 hover:scale-105 transform-all ease-in-out duration-200">
              <div className="w-full h-[20rem] border-2"></div>
              <p className="text-2xl mt-10">{item.desc}</p>
              {/* <img src={} alt="" className="w-20 h-20" /> */}
            </div>
          ))}
        </div>
        <h2 className="text-4xl mt-20 font-[500]">Scientific Publications</h2>
        <div className="flex flex-col items-start mt-10 gap-6">
          <div className="flex w-full bg-[#c3c3c3] p-4 text-3xl justify-between gap-4 items-start">
            <div className="flex flex-col items-start gap-1">TITLE</div>
            <div>Year</div>
          </div>
          {publications.map((item) => (
            <div onClick={() => handleClick(item.link)} className="flex cursor-pointer hover:bg-[#c4c4c4] px-4 w-full justify-between  items-start">
              <div className="flex text-xl text-gray-800 flex-col items-start">
                <div className="text-3xl text-[#000]">{item.title}</div>
                <div>{item.sub}</div>
                <div>{item.desc}</div>
              </div>
              <div className="text-2xl font-[500]">{item.year}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ResearchPage;
