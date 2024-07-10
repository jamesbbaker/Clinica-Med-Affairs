import React, { useState } from "react";
import PrimaryBtn from "../PrimaryBtn";

const ContactSupport = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    // Here you can add the logic to send the form data to your server or API
  };

  return (
    <div className="w-full mx-auto mt-10 p-6 bg-slate-300 rounded-lg ">
      <h2 className="text-2xl text-[#000] font-bold mb-6">Contact Support</h2>
      <form onSubmit={handleSubmit}>
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
            className="shadow appearance-none  border-none rounded w-full py-2 px-3 text-[#000] leading-tight focus:outline-none "
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
            className="shadow appearance-none border-none rounded w-full py-2 px-3 text-[#000] leading-tight focus:outline-none focus:shadow-outline"
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
            className="shadow appearance-none border-none rounded w-full py-2 px-3 text-[#000] leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Your message"
            rows="4"
          ></textarea>
        </div>
        <div className="flex items-center justify-between">
          <PrimaryBtn className={"w-40 text-slate-50"} text={"Submit"} />
        </div>
      </form>
    </div>
  );
};

export default ContactSupport;
