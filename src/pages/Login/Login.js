import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory } from "react-router-dom";

import * as authActions from "../../redux/auth/authActions";

export default function Login() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { register, handleSubmit } = useForm();

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const onLoginCallback = () => history.push("/dashboard");

  const onSubmit = (data) => {
    dispatch(authActions.authenticate(data, onLoginCallback));
  };

  return (
    <>
      {isAuthenticated && <Redirect to='/dashboard' />}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        {/* "handleSubmit" will validate your inputs before invoking "onSubmit" */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{
            width: "50%",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* register your input into the hook by invoking the "register" function */}
          <input name='email' defaultValue='' ref={register} />

          {/* include validation with required or other standard HTML validation rules */}
          <input
            name='password'
            type='password'
            defaultValue=''
            ref={register}
          />

          <input type='submit' />
        </form>
      </div>
    </>
  );
}
