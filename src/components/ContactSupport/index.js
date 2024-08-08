import React, { useContext, useState } from "react";
import PrimaryBtn from "../PrimaryBtn";
import Popup from "reactjs-popup";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { AuthContext } from "../../context/AuthContext";
import contactImg from "../../assets/images/contact.png"
import { IoCloseCircle } from "react-icons/io5";

const ContactSupport = ({closeContact, contactPage = false }) => {
  const [formData, setFormData] = useState({
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const { sendEmail } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (
      formData.message.length === 0
    ) {
      setLoading(false);
      return;
    }
    const res = await sendEmail(formData);
    if (res) {
      setShowAlert(true);
      setLoading(false);
    }
  };

  const closeModal = () => {
    setShowAlert(false);
  };

  return (
    <div
      className={`w-full  custom:items-start items-center flex custom:flex-row flex-col   ${
        !contactPage ? "rounded-lg border bg-slate-300 mt-10 custom:mt-10 mx-auto  md:mt-32 " : "bg-white py-10"
      } `}
    >
      {contactPage && <IoCloseCircle onClick={closeContact} size={40} className="absolute cursor-pointer top-5 right-5" />}
      {contactPage && <img src={contactImg} alt="contactImg" className="w-[50rem] object-contain" />}
      <div className="flex flex-col justify-between items-start px-4 md:px-10 py-20 w-full">
        <h2 className="text-5xl text-[#000] font-[500] mb-0">
         {contactPage ? "Reach out to the" : "Contact Support"}
        </h2>
        {contactPage && <h2 className="text-5xl text-[#000] font-[500] mb-12">Clinica team</h2>}
        {/* {contactPage && <p className="text-2xl font-[500] max-w-[80%] text-[#000]">Let us know your reason for setting up the discussion and we will respond shortly</p>} */}
        <form className="w-full" onSubmit={handleSubmit}>
          {/* <div className={`${contactPage && "w-[40%]"} mb-8`}>
            <label
              className="block text-[#000] text-sm font-[500] mb-2"
              htmlFor="name"
            >
              Name
            </label>
            <input
              required
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="shadow appearance-none  border-[#c4c4c4] rounded w-full py-2 px-3 text-[#000] leading-tight focus:outline-none "
              placeholder="Your name"
            />
          </div> */}
          {contactPage &&<div className={` mt-10 mb-8`}>
            <label
              className="block text-gray-500 text-sm font-[500] mb-2"
              htmlFor="email"
            >
              Email address
            </label>
            <input
              required
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="shadow appearance-none border-[#c4c4c4] rounded w-full py-2 px-3 text-[#000] leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Your email"
            />
          </div>}
          <div className="mb-10">
            <label
              className="block text-gray-500 text-sm font-[500] mb-2"
              htmlFor="message"
            >
          Message
            </label>
            <textarea
              required
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="shadow appearance-none border-[#c4c4c4] rounded w-full py-2 px-3 text-[#000] leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Your message"
              rows="4"
            ></textarea>
          </div>
          <div className="flex items-center justify-between">
            <PrimaryBtn
              disabled={loading}
              className={"w-40 bg-[#0A1172]  hover:scale-105 transition-all ease-in-out duration-200 text-slate-50"}
              text={"Send Message"}
            />
          </div>
        </form>
      </div>
      <Popup
        onClose={closeModal}
        modal
        open={showAlert}
        position="center center"
      >
        <div className="flex justify-center rounded-lg gap-6 flex-col items-center bg-white h-[40vh] w-[40vw]">
          <AiOutlineCheckCircle size={200} color="green" />
          <h2 className="font-[600] text-center text-xl">
            Your message has been successfully submitted.
            <br /> Thank you for contacting us!
          </h2>
        </div>
      </Popup>
    </div>
  );
};

export default ContactSupport;
