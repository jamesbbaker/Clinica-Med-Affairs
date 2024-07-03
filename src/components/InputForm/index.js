import React, { useContext, useReducer } from "react";
import InputField from "../InputField";
import PrimaryBtn from "../PrimaryBtn";
import { addUser } from "../../features/admin/adminSlice";
import { useDispatch } from "react-redux";
import SelectBox from "../SelectBox";
import { AuthContext } from "../../context/AuthContext";
import { MultiSelect } from "react-multi-select-component";
import { menuList } from "../Sidebar";

const inputs = [
  {
    name: "name",
    id: "name",
    placeholder: "Enter Name",
    label: "Name",
    type: "text",
    required: true,
  },

  {
    name: "email",
    id: "email",
    placeholder: "Enter Email",
    label: "Email",
    type: "email",
    required: true,
  },

  {
    name: "password",
    placeholder: "Enter Password",
    id: "password",
    label: "Password",
    type: "password",
    required: true,
  },
  {
    name: "Pages",
    id: "page_view",
    label: "Page Access",
    type: "multiSelect",
    options: menuList
      .find((item) => item.name === "outputs")
      .children.map((item) => ({ label: item.name, value: item.id })),
    required: true,
  },
  {
    name: "region",
    id: "region",
    label: "Select Region",
    type: "select",
    options: [
      { id: "HQ", name: "HQ" },
      { id: "NE", name: "NE" },
      { id: "NW", name: "NW" },
      { id: "MW", name: "MW" },
      { id: "SE", name: "SE" },
      { id: "SW", name: "SW" },
    ],
    required: true,
    placeholder: "Region",
  },
  {
    name: "company",
    placeholder: "Enter Company Name",
    id: "company",
    label: "Company",
    type: "text",
    required: true,
  },

  {
    name: "role",
    id: "admin",
    label: "Admin",
    type: "checkbox",
    required: false,
    placeholder: "Enter Role",
  },
];

const initialState = {
  formData: {
    admin: false,
  },
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
  const { accessToken } = useContext(AuthContext);

  const validateForm = (fields) => {
    let errors = {};
    fields.forEach((field) => {
      if (field.required && !state.formData[field.id]) {
        errors[field.id] = `${field.name} is required.`;
      }
    });
    dispatch({
      type: ActionTypes.SUBMIT_FORM,
      payload: { "errors": errors ? { ...errors } : {} },
    });
    return Object.values(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm(inputs)) {
      return;
    }
    let data = {
      ...state.formData,
      page_view: state.formData.page_view.map((item) => item.value),
    };

    const response = await fetch(
      "https://clinica-server.replit.app/create_user",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ ...data }),
      }
    );
    await response.json();
    reduxDispatch(addUser(data));
    handleClose();
  };

  const handleChange = (e) => {
    let value = e.target.id === "admin" ? e.target.checked : e.target.value;
    dispatch({
      type: ActionTypes.SET_FIELD_VALUE,
      payload: {
        [e.target.id]: value,
      },
    });
  };

  const handleSelect = (e) => {
    dispatch({
      type: ActionTypes.SET_FIELD_VALUE,
      payload: {
        [e.target.id]: e.target.value,
      },
    });
  };

  const handleMultipleSelect = (val, input) => {
    dispatch({
      type: ActionTypes.SET_FIELD_VALUE,
      payload: {
        [input.id]: val,
      },
    });
  };

  return (
    <div className="flex flex-col items-center  gap-6 px-4 py-12">
      <h1 className="text-2xl font-medium">Add New User</h1>
      <div className="grid gap-4 grid-cols-2">
        {inputs.map((input) =>
          input.type === "select" ? (
            <SelectBox
              key={input.id}
              error={state.errors[input.name]}
              handleSelect={handleSelect}
              input={input}
            />
          ) : input.type === "multiSelect" ? (
            <div key={input.id} className="w-full mt-2">
              <div className={`font-medium text-sm`}>{input.label}</div>
              <MultiSelect
                options={input.options}
                className="mt-2 w-full"
                value={state.formData[input.id] || []}
                onChange={(val) => handleMultipleSelect(val, input)}
                labelledBy={input.label}
              />
            </div>
          ) : (
            <InputField
              key={input.id}s
              error={state.errors[input.name]}
              onChange={handleChange}
              input={input}
            />
          )
        )}
      </div>
      <PrimaryBtn
        onClick={handleSubmit}
        className={"w-40 text-slate-50"}
        text={"Submit"}
      />
    </div>
  );
};

export default InputForm;
