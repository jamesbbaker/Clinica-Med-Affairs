import React, { useState } from "react";
import PrimaryBtn from "../PrimaryBtn";
import Popup from "reactjs-popup";
import DemoContact from "../DemoContact";
import ContactUs from "../../pages/ContactUs";

const ContactFooter = () => {
  const [popupOpen, setPopup] = useState(false);
  const [contact, setContact] = useState(false);

  const closeModal = () => {
    setPopup(false);
  };

  const closeContact = () => {
    setContact(false);
  };

  return (
    <section className="flex bg-[#a0cff5] px-10 py-20  items-center flex-col gap-10">
      <Popup
        onClose={closeModal}
        modal
        open={popupOpen}
        className="rounded-xl"
        position="center center"
      >
        <DemoContact handleClose={closeModal} />
      </Popup>
      <Popup
        onClose={closeContact}
        modal
        open={contact}
        className="rounded-xl"
        position="center center"
      >
        <ContactUs closeContact={closeContact} />
      </Popup>
      <div className="flex flex-col gap-10 font-[500] items-center">
        <h2 className="md:text-5xl text-3xl">Contact Us</h2>
        <p className="md:text-3xl text-xl">
          Learn how we can empower your R&D and Medical Affairs teams
        </p>  
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="px-10 grid place-content-center py-10">
          <PrimaryBtn
            onClick={() => setPopup(true)}
            text={"Request a Demo"}
            className={"md:px-10 px-10 rounded-lg bg-[#0A1172] hover:scale-105 transition-all  md:w-auto ease-in-out duration-200 md:text-2xl text-md text-[#fff]"}
          />
        </div>
        <div className="px-10 grid place-content-center py-10">
          <PrimaryBtn
            onClick={() => setContact(true)}
            text={"Talk to an Expert"}
            className={"md:px-10 px-10 rounded-lg bg-[#0A1172] hover:scale-105 transition-all  md:w-auto ease-in-out duration-200 md:text-2xl text-md text-[#fff]"}
          />
        </div>
      </div>
    </section>
  );
};

export default ContactFooter;
