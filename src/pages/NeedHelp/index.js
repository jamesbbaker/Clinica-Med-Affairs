import React, { useState } from "react";
import home from "../../assets/images/pages/home.jpg";
import opportunity from "../../assets/images/pages/opportunity.jpg";
import eligible from "../../assets/images/pages/eligible.jpg";
import institutional from "../../assets/images/pages/institutional.jpg";
import payer from "../../assets/images/pages/payer.jpg";
import medical from "../../assets/images/pages/medical.jpg";
import { IoMdAdd } from "react-icons/io";

import impact from "../../assets/images/pages/impact.jpg";
import patienttrajectory from "../../assets/images/pages/patienttrajectory.jpg";
import dataquality from "../../assets/images/pages/dataquality.jpg";
import unmetneed from "../../assets/images/pages/unmetneed.jpg";

const pageData = [
  {
    title: "Home",
    img: home,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tortor odio, lobortis in ornare et, cursus varius arcu. In hac habitasse platea dictumst. Duis et orci mi. Sed ut porttitor quam. Aliquam ac hendrerit erat. Sed leo orci, faucibus at vulputate ac, consequat id sem. Etiam pharetra vehicula finibus.",
  },
  {
    title: "Patient Opportunity Mapping and Strategy",
    img: opportunity,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tortor odio, lobortis in ornare et, cursus varius arcu. In hac habitasse platea dictumst. Duis et orci mi. Sed ut porttitor quam. Aliquam ac hendrerit erat. Sed leo orci, faucibus at vulputate ac, consequat id sem. Etiam pharetra vehicula finibus.",
  },
  {
    title: "Eligible Patient Locator",
    img: eligible,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tortor odio, lobortis in ornare et, cursus varius arcu. In hac habitasse platea dictumst. Duis et orci mi. Sed ut porttitor quam. Aliquam ac hendrerit erat. Sed leo orci, faucibus at vulputate ac, consequat id sem. Etiam pharetra vehicula finibus.",
  },
  {
    title: "Institutional Variation",
    img: institutional,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tortor odio, lobortis in ornare et, cursus varius arcu. In hac habitasse platea dictumst. Duis et orci mi. Sed ut porttitor quam. Aliquam ac hendrerit erat. Sed leo orci, faucibus at vulputate ac, consequat id sem. Etiam pharetra vehicula finibus.",
  },
  {
    title: "Payer Variation",
    img: payer,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tortor odio, lobortis in ornare et, cursus varius arcu. In hac habitasse platea dictumst. Duis et orci mi. Sed ut porttitor quam. Aliquam ac hendrerit erat. Sed leo orci, faucibus at vulputate ac, consequat id sem. Etiam pharetra vehicula finibus.",
  },
  {
    title: "Medical Affairs Toolbox",
    img: medical,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tortor odio, lobortis in ornare et, cursus varius arcu. In hac habitasse platea dictumst. Duis et orci mi. Sed ut porttitor quam. Aliquam ac hendrerit erat. Sed leo orci, faucibus at vulputate ac, consequat id sem. Etiam pharetra vehicula finibus.",
  },
  {
    title: "Impact Tracking",
    img: impact,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tortor odio, lobortis in ornare et, cursus varius arcu. In hac habitasse platea dictumst. Duis et orci mi. Sed ut porttitor quam. Aliquam ac hendrerit erat. Sed leo orci, faucibus at vulputate ac, consequat id sem. Etiam pharetra vehicula finibus.",
  },
  {
    title: "Patient Trajectory Insights",
    img: patienttrajectory,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tortor odio, lobortis in ornare et, cursus varius arcu. In hac habitasse platea dictumst. Duis et orci mi. Sed ut porttitor quam. Aliquam ac hendrerit erat. Sed leo orci, faucibus at vulputate ac, consequat id sem. Etiam pharetra vehicula finibus.",
  },
  {
    title: "Data Quality",
    img: dataquality,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tortor odio, lobortis in ornare et, cursus varius arcu. In hac habitasse platea dictumst. Duis et orci mi. Sed ut porttitor quam. Aliquam ac hendrerit erat. Sed leo orci, faucibus at vulputate ac, consequat id sem. Etiam pharetra vehicula finibus.",
  },
  {
    title: "Unmet Need Definitions",
    img: unmetneed,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tortor odio, lobortis in ornare et, cursus varius arcu. In hac habitasse platea dictumst. Duis et orci mi. Sed ut porttitor quam. Aliquam ac hendrerit erat. Sed leo orci, faucibus at vulputate ac, consequat id sem. Etiam pharetra vehicula finibus.",
  },
];

const NeedHelp = () => {
  const [currentIndex, setCurrentIndex] = useState(null);
  const handleClick = (index) => {
    setCurrentIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="flex flex-col  gap-5  items-start">
      {pageData.map((item, index) => {
        return (
          <div
       
            key={item.title}
            onClick={() => handleClick(index)}
            className="flex  cursor-pointer shadow-box bg-slate-300 rounded-md flex-col items-start"
          >
            <div className="px-4 w-full flex justify-between items-center py-4 font-[600]">
              <div className="flex  text-[1.125rem] items-center gap-5">
                <img
                  src={item.img}
                  className="h-[5rem] rounded-sm object-contain"
                  alt="icon"
                />
                {item.title}
              </div>
              <div
                className="transition-all duration-[200]"
                style={{ rotate: currentIndex === index ? "45deg" : "0deg" }}
              >
                <IoMdAdd size={25} />
              </div>
            </div>

            <div
              style={{
                gridTemplateRows: currentIndex === index ? "1fr" : "0fr",
                paddingBottom: currentIndex === index ? "1rem" : 0,
               animationTimingFunction: "cubic-bezier(0.68, -0.55, 0.27, 1.55)"
              }}
              className="grid   px-4  grid-rows-[0fr] transition-all cursor-pointer duration-[200]"
            >
              <div className=" overflow-hidden">{item.description}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default NeedHelp;
