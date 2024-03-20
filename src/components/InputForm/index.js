import React, { useReducer } from "react";
import InputField from "../InputField";
import PrimaryBtn from "../PrimaryBtn";
import { updateUsers } from "../../features/admin/adminSlice";
import { useDispatch } from "react-redux";

const inputs = [
  { name: "email", label: "Email", type: "email", required: true },
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
      const errors = {};
      action.payload.fields.forEach((field) => {
        if (field.required && !state.formData[field.name]) {
          errors[field.name] = `${field.label || field.name} is required.`;
        }
      });
      return {
        ...state,
        errors: { ...errors },
      };
    default:
      return state;
  }
};

const InputForm = ({ handleClose }) => {
  const [state, dispatch] = useReducer(Reducer, initialState);
  const reduxDispatch = useDispatch();

  const handleSubmit = () => {
    let data = {
      ...state.formData,
      code: Math.floor(1000 + Math.random() * 9000),
    };
    reduxDispatch(updateUsers(data));
    handleClose();
  };

  const handleChange = (e) => {
    dispatch({
      type: ActionTypes.SET_FIELD_VALUE,
      payload: {
        [e.target.name]: e.target.value,
      },
    });
  };

  return (
    <div className="flex flex-col items-center bg-slate-50 gap-12 px-4 py-12">
      <h1 className="text-2xl font-medium">Add New User</h1>
      {inputs.map((input) => (
        <InputField onChange={handleChange} input={input} />
      ))}
      <PrimaryBtn onClick={handleSubmit} className={"w-40"} text={"Submit"} />
    </div>
  );
};

export default InputForm;
