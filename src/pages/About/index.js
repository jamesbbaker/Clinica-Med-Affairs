import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import img1 from "../../assets/images/about/image1.png";
import img2 from "../../assets/images/about/image2.png";
import img3 from "../../assets/images/about/image3.png";
import img4 from "../../assets/images/about/image4.png";
import { FaLinkedin, FaXTwitter } from "react-icons/fa6";
import ContactFooter from "../../components/ContactFooter";

const aboutPeople = [
  {
    name: "Dr. Ralph Horwitz",
    image: img1,
    designation: "Co-founder",
    description:
      "Former Chair of Medicine at Yale and Stanford, Dean at Case Western, Practicing academic physician (35+ years,) SVP at GSK",
    college: "American College of Physicians, MACP",
    // twitter: "https://www.linkedin.com/in/ralph-horwitz-733b3126/",
    linkedin: "https://www.linkedin.com/in/ralph-horwitz-733b3126/",
  },
  {
    name: "James Baker",
    image: img3,
    designation: "Co-founder",
    description:
      "Former Expert in Al and Lead Data Scientist McKinsey Life Sciences practice; Columbia Biomedical Informatics PhD student",
    college: "Yale University, B.A. Applied Mathematics",
    twitter: "https://x.com/jamesbbaker4",
    linkedin: " https://www.linkedin.com/in/james-baker-b1a0259b/",
  },
  {
    name: "Dr. Arnie Ghatak",
    image: img2,
    designation: "Co-founder",
    description:
      "Former Senior Partner at McKinsey (20+ yrs); Global head of Medical Affairs (8+ yrs); Recently Head of Strategy and Innovation at Public Biotech",
    college:
      "University of Pennsylvania, MD, MBA Princeton University, A.B. Molecular Biology",
    // twitter: "https://www.linkedin.com/in/arnie-ghatak/",
    linkedin: "https://www.linkedin.com/in/arnie-ghatak/",
  },
  {
    name: "Dr. Mark Cullen",
    image: img4,
    designation: "Sr Clinical Advisor",
    description:
      "Former Dean for Research of Stanford Medical School, Chief Division of General Medicine, Director of Stanford Center for Population Health Sciences",
    college: "Yale University Medical School, MD Harvard University, A.B.",
    // twitter: "https://www.linkedin.com/in/mark-cullen-35b99224/",
    linkedin: "https://www.linkedin.com/in/mark-cullen-35b99224/",
  },
];

export default function About() {
  return (
    <>
      <Navbar />
      <div className=" min-h-[100vh] py-4 pt-20 md:pt-44 md:max-w-[90%] mx-auto ">
        <h1 className="md:text-6xl md:px-0 px-10 text-2xl text-black border-b-2 pb-6 pt-4 font-[500]">
          About Us
        </h1>
        <div className="pt-4 md:px-0 px-10  md:text-xl  text-md">
          Clinica AI develops first-in-class digital software to empower
          healthcare leaders to improve the care of patients by using RWD and AI
          to crack previously unsolvable problems
          {/* At Clinica AI, we recognize the growing importance of Medical Affairs
          in the healthcare industry and its critical role in improving patient
          outcomes. Despite facing higher perceived barriers to change, we
          believe that Medical Affairs holds tremendous potential to drive
          competitive advantage and transform patient care. */}
          {/* <div className="font-regular pt-4 text-xl md:text-2xl">
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
          </div> */}
        </div>
        <div className="grid mt-28  md:grid-cols-4  grid-cols-1 gap-10">
          {aboutPeople.map((item) => {
            return (
              <div className="flex text-center mb-20 cursor-pointer card flex-col items-center gap-2">
                <img src={item.image} alt="image1" />
                <div className="flex flex-col gap-2 card-box  md:max-w-[100%] max-w-[80%] md:mt-0 mt-4  items-center text-center">
                  <h2 className="font-[500] text-2xl">{item.name}</h2>
                  <p>{item.designation}</p>
                  <p className="card-item  md:opacity-0 ">{item.description}</p>
                  <p className="card-item  md:opacity-0 ">{item.college}</p>
                  <div className="flex card-item  md:opacity-0  mt-2 items-center gap-6">
                    <a target="_blank" rel={"noreferrer"} href={item.linkedin}>
                      <FaLinkedin size={40} />
                    </a>
                    {item.twitter && (
                      <a target="_blank" rel={"noreferrer"} href={item.twitter}>
                        <FaXTwitter size={40} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <ContactFooter />
      <Footer />
    </>
  );
}
