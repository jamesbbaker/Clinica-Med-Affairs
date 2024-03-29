import React, { useContext, useReducer } from "react";
import logo from "../../assets/images/logo.png";
import PrimaryBtn from "../../components/PrimaryBtn";
import InputField from "../../components/InputField";
import { AuthContext } from "../../context/AuthContext";
import { useState } from "react";

const inputs = [
  {
    name: "Email",
    label: "Email",
    required: true,
    id: "email",
    placeholder: "Enter your email address",
    type: "email",
  },
  {
    name: "Password",
    id: "password",
    required: true,
    label: "Password",
    placeholder: "Enter your password",
    type: "password",
  },
];

const initialState = {
  formData: {},
  errors: {},
};

const ActionTypes = {
  SET_FIELD_VALUE: "SET_FIELD_VALUE",
  RESET_FORM: "RESET_FORM",
  SUBMIT_FORM: "SUBMIT_FORM",
};

const Reducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.SET_FIELD_VALUE:
      return {
        ...state,
        formData: {
          ...state.formData,
          ...action.payload,
        },
      };
    case ActionTypes.RESET_FORM:
      return {
        ...state,
        formData: {},
        errors: {},
      };
    case ActionTypes.SUBMIT_FORM:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

const Login = () => {
  const [state, dispatch] = useReducer(Reducer, initialState);
  const { loginAction } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const validateForm = (fields) => {
    let errors = {};
    fields.forEach((field) => {
      if (field.required && !state.formData[field.id]) {
        errors[field.id] = `${field.name} is required.`;
      }
    });
    dispatch({
      type: ActionTypes.SUBMIT_FORM,
      payload: { ["errors"]: errors ? { ...errors } : {} },
    });
    return Object.values(errors).length == 0;
  };

  const handleSubmit = () => {
    setLoading(true);
    if (!validateForm(inputs)) {
      setLoading(false);
      return;
    }

    loginAction(state.formData)
      .then((res) => {
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        dispatch({
          type: ActionTypes.SUBMIT_FORM,
          payload: { ["errors"]: { global: "Invalid Email or Password" } },
        });
      });
  };

  const handleChange = (e) => {
    dispatch({
      type: ActionTypes.SET_FIELD_VALUE,
      payload: {
        [e.target.id]: e.target.value,
      },
    });
  };

  return (
    <div className="w-screen font-primary h-screen flex justify-center items-center">
      <div className="w-1/2 bg-primary rounded-tr-2xl rounded-br-2xl h-full flex flex-col justify-center items-center gap-2">
        <h1 className="text-4xl relative text-slate-50 font-semibold before:absolute before:w-large before:h-large before:rounded-full before:bg-blue-200 before:opacity-15  before:-translate-x-1/2 before:-translate-y-1/2  before:left-1/2 before:top-1/2 after:absolute after:w-extraLarge after:h-extraLarge after:rounded-full after:bg-blue-200 after:opacity-25  after:-translate-x-1/2 after:-translate-y-1/2  after:left-1/2 after:top-1/2">
          Welcome to Clinica AI
        </h1>
        <h4 className="text-xl font-regular text-slate-50">
          AI & RWD for better patient care
        </h4>
      </div>
      <div className="w-1/2 bg-slate-50 h-full flex justify-center items-center">
        <div className="w-1/2 flex flex-col justify-center items-center gap-8">
          <img src={logo} className="w-40" />
          <div className="flex w-full flex-col gap-2">
            {inputs.map((input) => (
              <InputField
                onChange={handleChange}
                error={state.errors[input.id]}
                input={input}
              />
            ))}
          </div>
          <div className="flex w-full flex-col gap">
            <div className="mt-1 text-center text-xs h-6 text-red-700">
              {state.errors.global || ""}
            </div>
            <PrimaryBtn
              disabled={loading}
              className={"w-full text-slate-50"}
              text={"Log In"}
              onClick={handleSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
