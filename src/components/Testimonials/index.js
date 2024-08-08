import React from "react";
import Quote_mark from "../../assets/images/Quote_mark.png";

const Testimonials = () => {
  return (
    <section className="py-20 relative bg-[#a0cff5] flex flex-col justify-center">
      <div className="w-full flex-col gap-10 cusotm:gap-0 relative h-full flex justify-center items-center">
        <div className="custom:absolute text-center custom:text-left custom:-top-4 custom:left-[20%] relative">
          <h2 className="md:text-4xl text-2xl custom:max-w-[70%] max-w-[100%] font-[700]">
            <img
              src={Quote_mark}
              className="absolute -top-10 -left-28"
              alt="quote"
            />
            Clinica is already empowering Life Sciences leaders
          </h2>
        </div>
        <div className="grid relative items-center gap-4 custom:max-w-[70%] max-w-[100%] grid-cols-1 custom:grid-cols-2">
          <div className="md:w-[25rem] custom:mt-20 mt-0 flex flex-col gap-6 p-10 bg-white rounded-xl ">
            {/* <img
                src={clientLogo}
                className="h-[2rem] w-[5rem] object-contain"
              /> */}
            <p className="custom:text-lg text-md">
              "The experience of using the app and the quality of the data have
              far exceed our expectations. We use this for everything from our
              strategy to tracking the impact of each of our medical
              initiatives."{" "}
            </p>
            <div className="flex flex-col items-start">
              <h2 className="font-[600]">Head of US Medical Affairs</h2>
              <p className="font-[300] text-[0.85rem]">
                Pre-launch respiratory product
              </p>
            </div>
          </div>
          <div className="relative flex flex-col gap-4 items-start">
            <div className="md:w-[25rem] flex flex-col gap-6 p-10 bg-white rounded-xl ">
              {/* <img
                  src={clientLogo}
                  className="h-[2rem] w-[5rem] object-contain"
                /> */}
              <p className="custom:text-lg text-md">
                "This is better than anything I've seen in 20 years of leading
                pharma sales teams."
              </p>
              <div className="flex flex-col items-start">
                <h2 className="font-[600]">Head of US Commercial</h2>
                <p className="font-[300] text-[0.85rem]">
                  Pre-launch respiratory product
                </p>
              </div>
            </div>
            <div className="custom:w-[20rem] md:w-[25rem]  flex flex-col gap-6 p-10 bg-white rounded-xl ">
              {/* <img
                  src={clientLogo}
                  className="h-[2rem] w-[5rem] object-contain"
                /> */}
              <p className="custom:text-lg text-md">
                "This approach and maximizing the value of RWE in our clinical
                trials are a top priority."
              </p>
              <div className="flex flex-col items-start">
                <h2 className="font-[600]">Head of R&D</h2>
                <p className="font-[300] text-[0.85rem]">Top 5 biopharma</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
