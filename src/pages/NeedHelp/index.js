import React, { useContext, useState } from "react";
import home from "../../assets/images/pages/home.jpg";
import opportunity from "../../assets/images/pages/opportunity.jpg";
import eligible from "../../assets/images/pages/eligible.jpg";
import institutional from "../../assets/images/pages/institutional.jpg";
import priority from "../../assets/images/pages/priority.jpg";
import payer from "../../assets/images/pages/payer.jpg";
import { IoMdAdd } from "react-icons/io";
import impact from "../../assets/images/pages/impact.jpg";
import patienttrajectory from "../../assets/images/pages/patienttrajectory.jpg";
import { APP_ROUTES, APP_ROUTES_LABEL } from "../../constants/appConstants";
import ContactSupport from "../../components/ContactSupport";
import { AuthContext } from "../../context/AuthContext";

const pageData = [
  {
    title: "Home",
    id: APP_ROUTES.home,
    img: home,
    description: "The Home page is used for navigating the rest of the app.",
  },
  {
    title: APP_ROUTES_LABEL.patient_opportunity_mapping_and_strategy,
    img: opportunity,
    id: APP_ROUTES.patient_opportunity_mapping_and_strategy,
    description:
      "The Patient Opportunity and Unmet Need Strategy page is used to better understand patient need across the treatment journey and prioritize unmet needs for engagement based on patient opportunity and trends.",
  },
  {
    title: APP_ROUTES_LABEL.priority_engagement_opportunity_page,
    id: APP_ROUTES.priority_engagement_opportunity_page,
    img: priority,
    description:
      "After prioritizing unmet needs, the Priority Engagement Opportunities page helps to refine engagement strategy across HCPs, institutions, and payers. It includes the ability to select multiple priority unmet needs and thresholds to segment each of these stakeholders.",
  },
  {
    title: APP_ROUTES_LABEL.eligible_patient_locator,
    id: APP_ROUTES.eligible_patient_locator,
    img: eligible,
    description:
      "The Physician Care Profiles page maps, ranks, and enables a deep dive into HCPs by unmet need. It includes deep care profiles including their unmet need profile, trends, and other stats.",
  },
  {
    title: APP_ROUTES_LABEL.institutional_variation,
    id: APP_ROUTES.institutional_variation,
    img: institutional,
    description:
      "The Hospital / Clinic Care Profiles page ranks and enables a deep dive into Hospitals / Clinics and IDN / Health Systems by unmet need. It includes deep care profiles including their unmet need profile, trends, and other stats.",
  },
  {
    title: APP_ROUTES_LABEL.payer_variation,
    id: APP_ROUTES.payer_variation,
    img: payer,
    description:
      "The Payer Care Profiles page ranks and enables a deep dive into Payers and Plans by unmet need. It includes deep care profiles including their unmet need profile, trends, and other stats.",
  },
  {
    title: APP_ROUTES_LABEL.target_lists,
    id: APP_ROUTES.target_lists,
    img: impact,
    description:
      "The Saved Lists page includes HCPs, institutions, and payers saved by the user for Impact Tracking. This page tracks these lists and allows users to remove saved items.",
  },
  {
    title: APP_ROUTES_LABEL.impact_tracking,
    id: APP_ROUTES.impact_tracking,
    img: impact,
    description:
      "The Impact Tracking page tracks quarterly trends in unmet need nationally, regionally, and by custom prioritized stakeholders.",
  },
  {
    title: APP_ROUTES_LABEL.patient_journey,
    id: APP_ROUTES.patient_journey,
    img: patienttrajectory,
    description:
      "The Asthma Patient Trajectory and Data Quality page includes additional analyses about the asthma patient journey that support and guide the unmet need analysis.",
  },
];

export const labelsPageData = {};

pageData.forEach((item) => {
  labelsPageData[item.title] = item;
});

const NeedHelp = () => {
  const [currentIndex, setCurrentIndex] = useState(null);
  const handleClick = (index) => {
    setCurrentIndex((prev) => (prev === index ? null : index));
  };
  const { user } = useContext(AuthContext);

  return (
    <div className="flex flex-col  gap-5  items-start">
        <ContactSupport />
      {user && pageData
        .filter((item) => (user.page_view && user.page_view.includes(item.id) )|| item.id === "home")
        .map((item, index) => {
          return (
            <div
              key={item.title}
              onClick={() => handleClick(index)}
              className="flex  w-full cursor-pointer shadow-box bg-slate-300 rounded-md flex-col items-start"
            >
              <div className="px-4 w-full flex justify-between items-center py-4 font-[600]">
                <div className="flex  md:text-[1.125rem] text-[0.95rem] items-center gap-5">
                  <img
                    src={item.img}
                    className="md:h-[5rem] h-[2.5rem] rounded-sm object-contain"
                    alt="icon"
                  />
                  {item.title}
                </div>
                <div
                  className="transition-all duration-[200]"
                  style={{ rotate: currentIndex === index ? "45deg" : "0deg" }}
                >
                  <IoMdAdd size={document.body.clientWidth < 786 ?  25 : 10} />
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
    
    </div>
  );
};

export default NeedHelp;
