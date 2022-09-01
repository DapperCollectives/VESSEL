import React from "react";
import { Web3Consumer } from "../contexts/Web3";
import { shortenAddr } from "../utils";
import { useHistory } from "react-router-dom";

const SignInOutButton = ({ user: { loggedIn, addr }, injectedProvider }) => {
  const history = useHistory();
  const signInOrOut = async (event) => {
    event.preventDefault();
    if (loggedIn) {
      injectedProvider.unauthenticate();
      history.push("/");
    } else {
      injectedProvider.authenticate();
    }
  };
  return (
    <>
      {loggedIn && <div className="p-4">{addr}</div>}
      {loggedIn && <hr />}
      <div onClick={signInOrOut} className="is-underlined p-4 pointer">
        {loggedIn ? "Disconnect" : "Connect"}
      </div>
    </>
  );
};

const CurrentUser = ({ web3 }) => {
  const { user, injectedProvider } = web3;
  if (!user) {
    return null;
  }

  return (
    <div className="">
      <p className="pl-4 has-text-grey">Connected Wallet</p>
      <SignInOutButton user={user} injectedProvider={injectedProvider} />
    </div>
  );
};

export default Web3Consumer(CurrentUser);
