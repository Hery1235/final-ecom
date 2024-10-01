import React, { useState } from "react";
import "./CSS/Login.css";

const LoginSignup = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
  });

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [state, setState] = useState("Sign Up");
  const handleClick = () => {
    if (state === "Sign Up") {
      setState("Login");
    } else {
      setState("Sign Up");
    }
  };

  const login = async () => {
    let responceData;
    await fetch("http://localhost:4000/login", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => (responceData = data));
    if (responceData.success) {
      localStorage.setItem("auth-token", responceData.token);
      window.location.replace("/");
    } else {
      alert(responceData.error);
    }
  };

  const signup = async () => {
    console.log("sign up pressed", formData);
    let responseData;

    await fetch("http://localhost:4000/signup", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => (responseData = data))
      .catch((error) => {
        console.error("Error:", error);
      });

    if (responseData.success) {
      localStorage.setItem("auth-token", responseData.token);
      window.location.replace("/");
    } else {
      alert(responseData.error);
    }
  };

  return (
    <div className="loginsignUp">
      <div className="loginsignup-container">
        <h1 className="login">{state}</h1>
        <div className="loginsignup-fields">
          {state === "Sign Up" ? (
            <input
              name="username"
              value={formData.username}
              onChange={changeHandler}
              type="text"
              className="emailpassword"
              placeholder="Your email"
            />
          ) : (
            <></>
          )}
          <input
            name="email"
            value={formData.email}
            onChange={changeHandler}
            type="email"
            className="emailpassword"
            placeholder="Email"
          />
          <input
            name="password"
            value={formData.password}
            onChange={changeHandler}
            type="password"
            className="emailpassword"
            placeholder="Password"
          />
          {state === "Sign Up" ? (
            <button onClick={signup}>Continue</button>
          ) : (
            <button onClick={login}>Continue</button>
          )}
        </div>

        {state === "Sign Up" ? (
          <p className="loginsignup-login">
            I have an account <span onClick={handleClick}>Click here</span>
          </p>
        ) : (
          <p className="loginsignup-login">
            Create an account <span onClick={handleClick}>Click here</span>
          </p>
        )}
        <div className="loginsignup-agree">
          <input type="checkbox" name="" id="" />
          <p>By continuing. i agree to the terms of use & privacy policy</p>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
