import React, { useContext, useState } from "react";
import PrimaryBtn from "../PrimaryBtn";
import Popup from "reactjs-popup";
import { AiOutlineCheckCircle } from "react-icons/ai";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const ContactSupport = ({ contactPage = false }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const {sendEmail} = useContext(AuthContext)

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
      formData.name.length === 0 ||
      formData.email.length === 0 ||
      formData.message.length === 0
    ) {
      setError(true);
    }
    console.log("Form Data:", formData);
  
    const res = await sendEmail(formData)
    console.log(res)
    setShowAlert(true);
    setLoading(false)
  };

  const closeModal = () => {
    console.log("first");
    setShowAlert(false);
  };

  return (
    <div
      className={`w-full h-[60vh] flex items-center mx-auto mt-10  border ${
        !contactPage ? "rounded-lg bg-slate-300" : "bg-white"
      } `}
    >
      {contactPage && (
        <div className="min-w-[30%] h-full bg-primary grid place-content-center font-[700] leading-relaxed tracking-wider text-[#fff] relative text-5xl overflow-hidden">
          <div className="absolute -top-10 -left-12 bg-white opacity-20 w-44 h-44 border-2 rounded-[50%] backdrop-blur-xl"></div>{" "}
          <div className="absolute -bottom-10 right-20 bg-white opacity-20 w-24 h-24 border-2 rounded-[50%] backdrop-blur-xl"></div>
          <div className="max-w-[70%] text-center m-auto">GET IN TOUCH!</div>
        </div>
      )}
      <div className="flex flex-col items-start px-10 py-5 w-full">
        {!contactPage && (
          <h2 className="text-2xl text-[#000] font-bold mb-6">
            Contact Support
          </h2>
        )}
        <form className="w-full" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-[#000] text-sm font-bold mb-2"
              htmlFor="name"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="shadow appearance-none  border-[#c4c4c4] rounded w-full py-2 px-3 text-[#000] leading-tight focus:outline-none "
              placeholder="Your name"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-[#000] text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="shadow appearance-none border-[#c4c4c4] rounded w-full py-2 px-3 text-[#000] leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Your email"
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-[#000] text-sm font-bold mb-2"
              htmlFor="message"
            >
              Message
            </label>
            <textarea
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
              className={"w-40 text-slate-50"}
              text={"Submit"}
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
