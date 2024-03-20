import React from "react";
import logo from "../../assets/images/logo.png";
import PrimaryBtn from "../../components/PrimaryBtn";
import { useNavigate } from "react-router";
import InputField from "../../components/InputField";

const inputs = [
  {
    name: "email",
    label: "Email",
    id: "email",
    placeholder: "Enter your email address",
    type: "email",
  },
  {
    name: "password",
    id: "password",
    label: "Password",
    placeholder: "Enter your password",
    type: "password",
  },
];

const Login = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/");
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="w-1/2 bg-primary rounded-tr-2xl rounded-br-2xl h-full flex flex-col justify-center items-center gap-2">
        <h1 className="text-4xl relative text-slate-50 font-semibold before:absolute before:w-large before:h-large before:rounded-full before:bg-blue-200 before:opacity-15  before:-translate-x-1/2 before:-translate-y-1/2  before:left-1/2 before:top-1/2 after:absolute after:w-extraLarge after:h-extraLarge after:rounded-full after:bg-blue-200 after:opacity-25  after:-translate-x-1/2 after:-translate-y-1/2  after:left-1/2 after:top-1/2">
          Welcome to Clinica AI
        </h1>
        <h4 className="text-xl font-regular text-slate-50">
          AI & RWD for better patient care
        </h4>
      </div>
      <div className="w-1/2 bg-slate-50 h-full flex justify-center items-center">
        <div className="w-1/2 flex flex-col justify-center items-center gap-14">
          <img src={logo} className="w-40" />
          <div className="flex w-full flex-col gap-8">
            {inputs.map((input) => (
              <InputField input={input} />
            ))}
          </div>
          <PrimaryBtn
            className={"w-full"}
            text={"Log In"}
            onClick={handleClick}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
