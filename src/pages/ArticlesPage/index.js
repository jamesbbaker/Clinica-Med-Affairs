import React from "react";
import { articles } from "../ResearchPage";
import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import img3 from "../../assets/images/about/image3.png";

const articlesData = {};
articles.forEach((item) => (articlesData[item.id] = item));

const ArticlesPage = () => {
  const { id } = useParams();
  const item = articlesData[id];

  return (
    <>
      <Navbar />
      <div className="grid mx-auto max-w-[90%] py-28 gap-20 grid-cols-1">
        <div className="flex flex-col gap-4 items-start">
          <div className="text-3xl font-[500]">{item.label}</div>
          <div className="text-2xl">{"caption"}</div>
          <div className="italic flex text-xl gap-4 items-center ">
            <img src={img3} alt="author" className="w-[4rem] h-[4rem] object-contain" />
            James Baker
          </div>
          <div  className="text-md md:text-xl">{item.para}</div>
        </div>
        {/* <div className="flex flex-col gap-4 items-center">
        {item.button1 && (
          <div className=" bg-gray-100 rounded-xl w-full p-10">
            <h1 className="text-2xl font-[500]">{item.button1}</h1>
            <h1  className="text-xl">{item.button1Desc}</h1>
          </div>
        )}
        {item.button2 && (
          <div className=" rounded-xl bg-gray-100 w-full p-10">
            <h1 className="text-2xl font-[500]">{item.button2}</h1>
            <h1  className="text-xl">{item.button2Desc}</h1>
          </div>
        )}
      </div> */}
        {item.para &&<iframe
          src="https://scors-2023.replit.app/"
          title="score"
          className="w-full col-span-2 mt-10 min-h-[100vh]"
        />}
      </div>
    </>
  );
};

export default ArticlesPage;
