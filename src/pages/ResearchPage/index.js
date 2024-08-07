import React from "react";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";

export const articles = [
  {
    name: "Article 1",
    id: "article1",
    desc: "More acurate trials with RWE",
    label: "More acurate trials with RWE",
    para: ``,
    button1: '',
    button1Desc: "",
    button2: "",
    button2Desc: ""
  },
  {
    name: "Article 2",
    id: "article2",
    desc: "Roots of physician variation in care",
    label: "Roots of physician variation in care",
    para: ``,
    button1: '',
    button1Desc: "",
    button2: "",
    button2Desc: ""
    
  },
  {
    name: "Article 3",
    id: "article3",
    desc: "Severe COVID Outcomes Risk Score",
    label: "Unlock Severe COVID Outcomes Risk Score (SCORS) in Moments",
    para: `Dive deep into a scientifically-validated assessment of Risk Adjusted Age for Severe COVID Outcomes. This research is outlined in the research publication ‘Development of a Novel Risk Score for COVID-19 Infections’, featured in the American Journal of Medicine (December, 2023). Developed as part of our public-private partnership with the COVID-19 Research Database to improve patient care for the public good using data and AI. We do not save any user submitted healthcare information.`,
    button1: 'Less than 1 minute to your personalized SCORS',
    button1Desc: "A refined risk assessment empowers both patients and healthcare professionals to make informed, safety-first choices.",
    button2: "Best-in-class accuracy",
    button2Desc: "Our data represents a comprehensive and representative foundation for COVID risk. The analysis includes COVID events from March 2020 to September 2022."
  },
  {
    name: "Article 4",
    id: "article4",
    desc: "Tracking Severe COVID Outcome Risk",
    label: "Tracking Severe COVID Outcome Risk",
    para: ``,
    button1: '',
    button1Desc: "",
    button2: "",
    button2Desc: ""
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
  const navigate = useNavigate();

  const handleClick = (link) => {
    window.location.href = link;
  };

  const handleGoToArticle = (id) => {
    navigate(`/articles/${id}`);
  };

  return (
    <>
      <Navbar />
      <div className="md:px-20 px-10 py-20">
        <h2 className="text-5xl mt-10 font-[500]">Research</h2>
        <h2 className="text-4xl mt-10 font-[500]">Articles</h2>
        <div className="text-[#000] grid grid-cols-1 md:grid-cols-4 mt-10 items-center gap-4 ">
          {articles.map((item) => (
            <div
              onClick={() => handleGoToArticle(item.id)}
              className="border-2 cursor-pointer h-[25rem] p-6 hover:scale-105 transform-all ease-in-out duration-200"
            >
              <div className="w-full h-[15rem] border-2"></div>
              <p className="text-2xl mt-10">{item.desc}</p>
            </div>
          ))}
        </div>
        <h2 className=" md:text-4xl  text-xl mt-20 font-[500]">Scientific Publications</h2>
        <div className="flex flex-col items-start mt-10 gap-6">
          <div className="flex w-full border-b border-b-black p-4 text-3xl justify-between gap-4 items-start">
            <div className="flex flex-col items-start gap-1">Title</div>
            <div>Year</div>
          </div>
          {publications.map((item) => (
            <div
              onClick={() => handleClick(item.link)}
              className="flex cursor-pointer hover:bg-[#c4c4c4] px-4 w-full justify-between  items-start"
            >
              <div className="flex text-xl text-gray-800 flex-col items-start">
                <div className="md:text-3xl text-xl text-[#000]">{item.title}</div>
                <div>{item.sub}</div>
                <div>{item.desc}</div>
              </div>
              <div className="md:text-2xl text-lg font-[500]">{item.year}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ResearchPage;
