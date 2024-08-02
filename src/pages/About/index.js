import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";

export default function About() {
  return (
    <>
      <Navbar />
      <div className="divide-y min-h-[100vh] divide-gray-200 py-4 pt-20 md:pt-44 md:max-w-[90%] mx-auto dark:divide-gray-700">
        <h1 className="md:text-6xl text-2xl text-gray-500 border-b-2 pb-6 pt-4 font-bold">
          About
        </h1>
        <div className="font-regular pt-4 text-xl md:text-2xl">
          At Clinica AI, we recognize the growing importance of Medical Affairs
          in the healthcare industry and its critical role in improving patient
          outcomes. Despite facing higher perceived barriers to change, we
          believe that Medical Affairs holds tremendous potential to drive
          competitive advantage and transform patient care.
          <div className="font-regular pt-4 text-xl md:text-2xl">
            Our approach leverages cutting-edge technology to enhance the
            precision and impact of Medical Affairs. With RWD and AI, we provide
            granular insights into care, enable highly tailored initiatives, and
            track improvements in real time.
          </div>
          <div className="font-regular pt-4 text-xl md:text-2xl">
            The Medical Affairs AI Suite is designed to guide, optimize, and
            demonstrate the impact of Medical initiatives. By moving from broad,
            direction-based approaches to precise, data-driven strategies, we
            aim to empower Medical Affairs to lead in delivering exceptional
            patient care.
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
