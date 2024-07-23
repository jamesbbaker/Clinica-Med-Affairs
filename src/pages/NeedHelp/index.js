import React, { useState } from "react";
import home from "../../assets/images/pages/home.jpg";
import opportunity from "../../assets/images/pages/opportunity.jpg";
import eligible from "../../assets/images/pages/eligible.jpg";
import institutional from "../../assets/images/pages/institutional.jpg";
import payer from "../../assets/images/pages/payer.jpg";
import { IoMdAdd } from "react-icons/io";
import impact from "../../assets/images/pages/impact.jpg";
import patienttrajectory from "../../assets/images/pages/patienttrajectory.jpg";
import { APP_ROUTES_LABEL } from "../../constants/appConstants";
import ContactSupport from "../../components/ContactSupport";

const pageData = [
  {
    title: "Home",
    img: home,
    description: "The Home page is used for navigating the rest of the app.",
  },
  {
    title: APP_ROUTES_LABEL.patient_opportunity_mapping_and_strategy,
    img: opportunity,
    description:
      "The Patient Opportunity and Unmet Need Strategy page is used to better understand patient need across the treatment journey and prioritize unmet needs for engagement based on patient opportunity and trends.",
  },
  {
    title: APP_ROUTES_LABEL.eligible_patient_locator,
    img: eligible,
    description:
      "The Physician Care Profiles page maps, ranks, and enables a deep dive into HCPs by unmet need. It includes deep care profiles including their unmet need profile, trends, and other stats.",
  },
  {
    title: APP_ROUTES_LABEL.institutional_variation,
    img: institutional,
    description:
      "The Hospital / Clinic Care Profiles page ranks and enables a deep dive into Hospitals / Clinics and IDN / Health Systems by unmet need. It includes deep care profiles including their unmet need profile, trends, and other stats.",
  },
  {
    title: APP_ROUTES_LABEL.payer_variation,
    img: payer,
    description:
      "The Payer Care Profiles page ranks and enables a deep dive into Payers and Plans by unmet need. It includes deep care profiles including their unmet need profile, trends, and other stats.",
  },

  {
    title: APP_ROUTES_LABEL.impact_tracking,
    img: impact,
    description:
      "The Impact Tracking page tracks quarterly trends in unmet need nationally, regionally, and by custom prioritized stakeholders.",
  },
  {
    title: APP_ROUTES_LABEL.patient_journey,
    img: patienttrajectory,
    description:
      "The Asthma Patient Trajectory and Data Quality page includes additional analyses about the asthma patient journey that support and guide the unmet need analysis.",
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
                animationTimingFunction:
                  "cubic-bezier(0.68, -0.55, 0.27, 1.55)",
              }}
              className="grid   px-4  grid-rows-[0fr] transition-all cursor-pointer duration-[200]"
            >
              <div className=" overflow-hidden">{item.description}</div>
            </div>
          </div>
        );
      })}
      <ContactSupport />
    </div>
  );
};

export default NeedHelp;
