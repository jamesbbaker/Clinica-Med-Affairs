import React from "react";
import logo from "../../assets/images/logo.png";
import { PrimaryBtn } from "../../components/PrimaryBtn";
import { useNavigate } from "react-router-dom";

const inputs = [
  {
    name: "Email",
    placeholder: "Enter Email",
    id: "email",
    type: "email",
  },
  {
    name: "Password",
    placeholder: "Enter Password",
    id: "password",
    type: "password",
  },
];

const LoginPageDetails = {
  heading: "Welcome to Clinica AI",
  description: "AI & RWD for better patient care",
  btnText: "Log In",
};

const Login = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/");
  };

  return (
    <div className="w-full h-screen overflow-hidden flex flex-row-reverse justify-center items-center">
      <div className="w-1/2 h-full  flex justify-center items-center ">
        <form className="w-2/5 flex flex-col justify-center items-center gap-5">
          <img src={logo} className=" w-48 mr-auto object-contain" />
          {inputs.map((input) => {
            return (
              <div className="flex flex-col items-start gap-2 my-2 w-full">
                <h2 className=" font-semibold">{`${input.name}*`}</h2>
                <input
                  required={true}
                  id={input.id}
                  type={input.type}
                  placeholder={input.placeholder}
                  className="py-2 px-4 focus:outline-none border rounded-md border-opacity-25 border-primary text-md w-full"
                />
              </div>
            );
          })}
          <div className="w-full mt-6">
            <PrimaryBtn
              onClick={handleNavigate}
              text={LoginPageDetails.btnText}
            />
          </div>
        </form>
      </div>
      <div className="bg-primary rounded-br-2xl rounded-tr-2xl z-10 w-1/2  h-full flex flex-col justify-center relative items-center ">
        <h1 className="text-slate-50  font-bold text-4xl before:content-[''] before:absolute before:w-lg before:opacity-15 before:h-lg before:left-1/2  before:top-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:bg-slate-400 before:z-minus before:rounded-full after:content-[''] after:absolute after:w-dlg after:opacity-15 after:h-dlg after:left-1/2  after:top-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:bg-slate-400 after:z-minus after:rounded-full">
          {LoginPageDetails.heading}
        </h1>
        <h4 className="text-slate-50 font-regular text-lg mt-4">
          {LoginPageDetails.description}
        </h4>
      </div>
    </div>
  );
};

export default Login;
