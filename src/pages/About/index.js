import Navbar from "../../components/Navbar";

export default function About() {
  return (
    <>
      <Navbar />
      <div className="divide-y  divide-gray-200 px-14 py-4 pt-20 md:pt-44 md:max-w-[70%] mx-auto dark:divide-gray-700">
        <h1 className="md:text-6xl text-2xl text-gray-500 border-b-2 pb-6 pt-4 font-bold">
          About
        </h1>
        <div className="font-regular pt-4 text-sm md:text-lg">
          At Clinica AI, we recognize the growing importance of Medical Affairs
          in the healthcare industry and its critical role in improving patient
          outcomes. Despite facing higher perceived barriers to change, we
          believe that Medical Affairs holds tremendous potential to drive
          competitive advantage and transform patient care. By challenging
          traditional beliefs and integrating innovative technologies, we are
          committed to unleashing this potential and ensuring Medical Affairs
          can make a significant impact.
          <div className="font-regular pt-4 text-sm md:text-lg">
            Our approach leverages cutting-edge technology to enhance the
            precision and impact of Medical Affairs. Utilizing advanced data
            analytics and AI, we provide granular insights into care patterns,
            optimize care delivery, and track improvements in real time. This
            not only helps reduce unmet patient needs but also improves overall
            healthcare efficiency. Our tools enable healthcare providers to make
            informed, data-driven decisions that enhance patient care and reduce
            costs.
          </div>
          <div className="font-regular pt-4 text-sm md:text-lg">
            The Clinica AI Medical Affairs Suite delivers key outputs designed
            to measure, optimize, and demonstrate the impact of initiatives.
            From defining and quantifying patient needs across the care journey
            to mapping variations in care and developing detailed patient
            profiles, our suite provides comprehensive tools for refining
            engagement strategies and tracking the effectiveness of initiatives.
            By moving from broad, direction-based approaches to precise,
            data-driven strategies, we empower Medical Affairs to lead in
            delivering exceptional patient care and healthcare excellence.
          </div>
        </div>
      </div>
    </>
  );
}
