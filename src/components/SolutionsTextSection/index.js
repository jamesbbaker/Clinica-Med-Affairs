import React, { useRef } from "react";
import { useEffect } from "react";
import gsap from "gsap/all";

const texts = [
    "Find patients without diagnosis (e.g., endometriosis, dementia)",
    "Determine risk or severity of disease (e.g., high risk of Severe COVID Outcomes)",
    "Assess staging of disease (e.g., breast, lung cancer staging)",
    "Determine unobserved biomarkers (e.g., EGFR, HER2, PD-L1)",
    "Account for patients with incomplete data",
  ];

const SolutionsTextSection = ({ textsList = texts }) => {
  const itemsRef = useRef([]);
  useEffect(() => {
    const items = itemsRef.current;
    gsap.to(items, {
      opacity: 1,
      duration: 0.5,
      stagger: 1,
      repeat: -1,
      repeatDelay: 1,
      ease: "linear",
      yoyo: false,
      delay: 1,
      onComplete: () => {
        items.forEach((item) => (item.style.opacity = 0));
      },
    });
  }, []);
  return (
    <section className="min-h-[50vh] md:px-20 px-10 bg-[#fff] z-2 grid grid-cols-1">
      <div className="grid md:px-10 bg-[#fff] place-content-center">
        <h2 className="md:text-3xl text-xl text-center font-[400]">
          Each of our solutions leverages distinctive clinical and AI machinery
          to answer the most important questions
        </h2>
      </div>
      <div
        id="btn-section"
        className="grid gap-6 mt-10 md:mt-0 md:grid-cols-3 grid-cols-2 mb-20 bg-[#fff]"
      >
        {textsList.map((text, index) => (
          <div
            key={index}
            ref={(el) => (itemsRef.current[index] = el)}
            className={` opacity-0 md:text-xl text-md text-center grid place-content-center `}
          >
            {text}
          </div>
        ))}
      </div>
    </section>
  );
};

export default SolutionsTextSection;
