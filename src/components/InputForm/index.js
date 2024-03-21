import React, { useReducer } from "react";
import InputField from "../InputField";
import PrimaryBtn from "../PrimaryBtn";
import { updateUsers } from "../../features/admin/adminSlice";
import { useDispatch, useSelector } from "react-redux";

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
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

const InputForm = ({ handleClose }) => {
  const [state, dispatch] = useReducer(Reducer, initialState);
  const reduxDispatch = useDispatch();
  const users = useSelector((state) => state.admin.users);
  const validateForm = (fields) => {
    let errors = {};
    fields.forEach((field) => {
      if (field.required && !state.formData[field.name]) {
        errors[field.name] = `${field.label || field.name} is required.`;
      }
    });
    dispatch({
      type: ActionTypes.SUBMIT_FORM,
      payload: { ["errors"]: errors ? { ...errors } : {} },
    });
    return Object.values(errors).length == 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm(inputs)) {
      return;
    }
    let data = {
      ...state.formData,
      id: Math.floor(1000 + Math.random() * 9000),
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
    <form className="flex flex-col items-center bg-slate-50 gap-6 px-4 py-12">
      <h1 className="text-2xl font-medium">Add New User</h1>
      <div className="flex flex-col">
        {inputs.map((input) => (
          <InputField
            error={state.errors[input.name]}
            onChange={handleChange}
            input={input}
          />
        ))}
      </div>
      <PrimaryBtn
        type="submit"
        onClick={handleSubmit}
        className={"w-40 text-slate-50"}
        text={"Submit"}
      />
    </form>
  );
};

export default InputForm;
