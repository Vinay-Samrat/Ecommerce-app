import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "./UserContext";
import { useNavigate } from "react-router-dom";

let Register = () => {
  const { setUser } = useContext(UserContext);
  let [state, setState] = useState({
    email: "",
    password: "",
    fullName: "",
    dateOfBirth: "",
    gender: "",
    country: "",
    receiveNewsLetters: false,
  });

  let [countries] = useState([
    { id: 1, countryName: "India" },
    { id: 2, countryName: "USA" },
    { id: 3, countryName: "UK" },
    { id: 4, countryName: "Japan" },
    { id: 5, countryName: "France" },
    { id: 6, countryName: "Brazil" },
    { id: 7, countryName: "Mexico" },
    { id: 8, countryName: "Canada" },
  ]);

  let [errors, setErrors] = useState({
    email: [],
    password: [],
    fullName: [],
    dateOfBirth: [],
    gender: [],
    country: [],
    receiveNewsLetters: [],
  });

  let [dirty, setDirty] = useState({
    email: false,
    password: false,
    fullName: false,
    dateOfBirth: false,
    gender: false,
    country: false,
    receiveNewsLetters: false,
  });

  let [message, setMessage] = useState("");

  let userContext = useContext(UserContext);
  const navigate = useNavigate();

  let validate = () => {
    let errorsData = {};

    // email
    errorsData.email = [];
    if (!state.email) {
      errorsData.email.push("Email can't be blank");
    }
    const validEmailRegex = /^[^\.\s][\w\-]+(\.[\w\-]+)*@([\w-]+\.)+[\w-]{2,}$/gm;
    if (state.email && !validEmailRegex.test(state.email)) {
      errorsData.email.push("Proper email address is expected");
    }

    // password
    errorsData.password = [];
    if (!state.password) {
      errorsData.password.push("Password can't be blank");
    }
    const validPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,15}$/;
    if (state.password && !validPasswordRegex.test(state.password)) {
      errorsData.password.push("Password should be 6 to 15 characters along with at least one uppercase letter, one lowercase letter and one digit ");
    }

    // full name
    errorsData.fullName = [];
    if (!state.fullName) {
      errorsData.fullName.push("Full name can't be blank");
    }

    // date of birth
    errorsData.dateOfBirth = [];
    if (!state.dateOfBirth) {
      errorsData.dateOfBirth.push("Date of Birth can't be blank");
    }

    // gender
    errorsData.gender = [];
    if (!state.gender) {
      errorsData.gender.push("Gender can't be blank");
    }

    // country
    errorsData.country = [];
    if (!state.country) {
      errorsData.country.push("Please select a country");
    }

    // receiveNewsLetters
    errorsData.receiveNewsLetters = [];

    setErrors(errorsData);
  };

  useEffect(validate, [state]);

  let onRegisterClick = async () => {
    // Set all controls as dirty
    let dirtyData = dirty;
    Object.keys(dirty).forEach((control) => {
      dirtyData[control] = true;
    });
    setDirty(dirtyData);

    validate();

    if (isValid()) {
      try {
        console.log("Sending request to register user:", state);
        let response = await fetch("http://localhost:5000/users", {
          method: "POST",
          body: JSON.stringify(state),
          headers: {
            "Content-type": "application/json",
          },
        });

        if (response.ok) {
          let responseBody = await response.json();
          console.log("Received response from server:", responseBody);

          const newUser = {
            isLoggedIn: true,  // Correct property name
            currentUserId: responseBody.user.id, 
            currentUserName: responseBody.user.fullName,
          };

          console.log("User context after setting user:", newUser);
          setUser(newUser);
          setMessage(<span className="text-success">Successfully Registered</span>);
          navigate("/login");
        } else {
          setMessage(<span className="text-danger">Errors in database connection</span>);
        }
      } catch (error) {
        console.log("Error during fetch:", error);
        setMessage(<span className="text-danger">An error occurred: {error.message}</span>);
      }
    } else {
      setMessage(<span className="text-danger">Errors</span>);
    }
  };

  let isValid = () => {
    let valid = true;

    // Reading all controls from "errors" state
    for (let control in errors) {
      if (errors[control].length > 0) {
        valid = false;
      }
    }
    return valid;
  };

  return (
    <div className="flex flex-col justify-center items-center mt-4 mx-auto px-6">
      <h2 className="font-bold text-green-400 text-2xl">Register</h2>
      <div className="border border-blue-400 px-6 py-8 w-[50%] mt-4 shadow-lg rounded-lg">
        <div className="flex flex-col py-2 px-2">
          <ul>
            {Object.keys(errors).map((control) => {
              if (dirty[control]) {
                return errors[control].map((err) => {
                  return <li key={err}>{err}</li>;
                });
              } else {
                return null;
              }
            })}
          </ul>
          <label htmlFor="email" className="px-2 pb-2 font-bold">Email</label>
          <input
            type="text"
            className="border px-2"
            placeholder="Email"
            name="email"
            id="email"
            value={state.email}
            onChange={(event) => setState({ ...state, [event.target.name]: event.target.value })}
            onBlur={(event) => {
              setDirty({ ...dirty, [event.target.name]: true });
              validate();
            }}
          />
          <div className="text-red-500">
            {dirty["email"] && errors["email"][0] ? errors["email"] : ""}
          </div>
        </div>
        <div className="flex flex-col py-2 px-2">
          <label htmlFor="password" className="px-2 pb-2 font-bold">Password</label>
          <input
            type="password"
            className="border px-2"
            placeholder="Password"
            name="password"
            id="password"
            value={state.password}
            onChange={(event) => setState({ ...state, [event.target.name]: event.target.value })}
            onBlur={(event) => {
              setDirty({ ...dirty, [event.target.name]: true });
              validate();
            }}
          />
          <div className="text-red-500">
            {dirty["password"] && errors["password"][0] ? errors["password"] : ""}
          </div>
        </div>
        <div className="flex flex-col py-2 px-2">
          <label htmlFor="fullName" className="px-2 pb-2 font-bold">Full Name</label>
          <input
            type="text"
            className="border px-2"
            placeholder="Full Name"
            id="fullName"
            name="fullName"
            value={state.fullName}
            onChange={(event) => setState({ ...state, [event.target.name]: event.target.value })}
            onBlur={(event) => {
              setDirty({ ...dirty, [event.target.name]: true });
              validate();
            }}
          />
          <div className="text-red-500">
            {dirty["fullName"] && errors["fullName"][0] ? errors["fullName"] : ""}
          </div>
        </div>
        <div className="flex flex-col py-2 px-2">
          <label htmlFor="dateOfBirth" className="px-2 pb-2 font-bold">Date of Birth</label>
          <input
            type="date"
            className="border px-2"
            placeholder="Date of Birth"
            id="dateOfBirth"
            name="dateOfBirth"
            value={state.dateOfBirth}
            onChange={(event) => setState({ ...state, [event.target.name]: event.target.value })}
            onBlur={(event) => {
              setDirty({ ...dirty, [event.target.name]: true });
              validate();
            }}
          />
          <div className="text-red-500">
            {dirty["dateOfBirth"] && errors["dateOfBirth"][0] ? errors["dateOfBirth"] : ""}
          </div>
        </div>
        <div className="flex flex-col py-2 px-2">
          <label htmlFor="gender" className="px-2 pb-2 font-bold">Gender</label>
          <select
            className="border px-2"
            name="gender"
            id="gender"
            value={state.gender}
            onChange={(event) => setState({ ...state, [event.target.name]: event.target.value })}
            onBlur={(event) => {
              setDirty({ ...dirty, [event.target.name]: true });
              validate();
            }}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <div className="text-red-500">
            {dirty["gender"] && errors["gender"][0] ? errors["gender"] : ""}
          </div>
        </div>
        <div className="flex flex-col py-2 px-2">
          <label htmlFor="country" className="px-2 pb-2 font-bold">Country</label>
          <select
            className="border px-2"
            name="country"
            id="country"
            value={state.country}
            onChange={(event) => setState({ ...state, [event.target.name]: event.target.value })}
            onBlur={(event) => {
              setDirty({ ...dirty, [event.target.name]: true });
              validate();
            }}
          >
            <option value="">Select Country</option>
            {countries.map((country) => (
              <option key={country.id} value={country.countryName}>
                {country.countryName}
              </option>
            ))}
          </select>
          <div className="text-red-500">
            {dirty["country"] && errors["country"][0] ? errors["country"] : ""}
          </div>
        </div>
        <div className="flex flex-col py-2 px-2">
          <label className="px-2 pb-2 font-bold">Receive Newsletters</label>
          <div>
            <input
              type="checkbox"
              id="receiveNewsLetters"
              name="receiveNewsLetters"
              checked={state.receiveNewsLetters}
              onChange={(event) => setState({ ...state, [event.target.name]: event.target.checked })}
              onBlur={(event) => {
                setDirty({ ...dirty, [event.target.name]: true });
                validate();
              }}
            />
            <label htmlFor="receiveNewsLetters" className="px-2">Yes, I want to receive newsletters</label>
          </div>
          <div className="text-red-500">
            {dirty["receiveNewsLetters"] && errors["receiveNewsLetters"][0] ? errors["receiveNewsLetters"] : ""}
          </div>
        </div>
        <div className="flex justify-center">
          <button
            className="bg-green-400 text-white rounded-md py-2 px-4"
            onClick={onRegisterClick}
          >
            Register
          </button>
        </div>
        <div className="text-center mt-4">
          {message}
        </div>
      </div>
    </div>
  );
};

export default Register;
