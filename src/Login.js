import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "./UserContext";
import { useNavigate } from "react-router-dom";

let Login = (props) => {
  var [email, setEmail] = useState("scott@test.com");
  var [password, setPassword] = useState("Scott123");
  let userContext = useContext(UserContext);
  const navigate = useNavigate();

  let [dirty, setDirty] = useState({
    email: false,
    password: false,
  });

  let [errors, setErrors] = useState({
    email: [],
    password: [],
  });

  let [loginMessage, setLoginMessage] = useState("");

  useEffect(() => {
    //console.log(email, password);
  });

  useEffect(() => {
    if (email.indexOf("@") > 0) {
      //console.log("valid");
    } else {
      //console.log("invalid");
    }
  }, [email]);

  useEffect(() => {
    document.title = "Login - eCommerce";
  }, []);

  useEffect(() => {
    return () => {
      console.log("Component Unmount");
    };
  }, []);

  let validate = () => {
    let errorsData = {};

    errorsData.email = [];

    if (!email) {
      errorsData.email.push("Email can't be blank");
    }

    let validEmailRegex = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
    if (email) {
      if (!validEmailRegex.test(email)) {
        errorsData.email.push("Proper email address is expected");
      }
    }

    errorsData.password = [];

    if (!password) {
      errorsData.password.push("Password can't be blank");
    }

    let validPasswordRegex = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,15})/;
    if (password) {
      if (!validPasswordRegex.test(password)) {
        errorsData.password.push(
          "Password should be 6 to 15 characters long with at least one uppercase letter, one lowercase letter and one digit"
        );
      }
    }

    setErrors(errorsData);
  };

  useEffect(validate, [email, password]);

  let onLoginClick = async () => {
    let dirtyData = dirty;
    Object.keys(dirty).forEach((control) => {
      dirtyData[control] = true;
    });
    setDirty(dirtyData);

    validate();

    if (isValid()) {
      let response = await fetch(
        `http://localhost:5000/users?email=${email}&password=${password}`,
        { method: "GET" }
      );
      if (response.ok) {
        let responseBody = await response.json();

        if (responseBody.length > 0) {
          userContext.setUser({
            ...userContext.user,
            isLoggedIn: true,
            currentUserName: responseBody[0].fullName,
            currentUserId: responseBody[0].id,
          });

          navigate("/dashboard");
        } else {
          setLoginMessage(
            <span className="text-red-600">Invalid Login, please try again</span>
          );
        }
      } else {
        setLoginMessage(
          <span className="text-red-600">Unable to connect to server</span>
        );
      }
    }
  };

  let isValid = () => {
    let valid = true;

    for (let control in errors) {
      if (errors[control].length > 0) valid = false;
    }

    return valid;
  };
  
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="border-b border-green-500 pb-3 mb-3">
            <h4 className="text-4xl text-green-500 text-center">Login</h4>
          </div>

          <div className="border-b border-green-500 pb-3 mb-3">
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700">Email</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                id="email"
                name="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                }}
                onBlur={() => {
                  setDirty({ ...dirty, email: true });
                  validate();
                }}
                placeholder="Email"
              />
              <div className="text-red-600">
                {dirty["email"] && errors["email"][0] ? errors["email"] : ""}
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700">Password</label>
              <input
                type="password"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                id="password"
                name="password"
                value={password}
                placeholder="Password"
                onChange={(event) => {
                  setPassword(event.target.value);
                }}
                onBlur={() => {
                  setDirty({ ...dirty, password: true });
                  validate();
                }}
              />
              <div className="text-red-600">
                {dirty["password"] && errors["password"][0] ? errors["password"] : ""}
              </div>
            </div>
          </div>

          <div className="text-center">
            <div className="mb-2">{loginMessage}</div>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
              onClick={onLoginClick}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
