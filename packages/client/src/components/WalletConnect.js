import React from "react";
import { Web3Consumer } from "../contexts/Web3";
import { useHistory } from "react-router-dom";
import { shortenAddr } from "utils";

const SignInOutButton = ({ user, injectedProvider }) => {
  const history = useHistory();
  const signInOrOut = async (event) => {
    event.preventDefault();
    if (user?.loggedIn) {
      injectedProvider.unauthenticate();
      history.push("/");
    } else {
      injectedProvider.authenticate();
    }
  };
  return (
    <>
      {user?.loggedIn && (
        <div className="p-4">Wallet: {shortenAddr(user?.addr)}</div>
      )}
      {user?.loggedIn && <hr />}
      <div onClick={signInOrOut} className="is-underlined p-4 pointer">
        {user?.loggedIn ? "Disconnect" : "Connect"}
      </div>
    </>
  );
};

const CurrentUser = ({ web3 }) => {
  const { user, injectedProvider } = web3;
  return (
    <div>
      <p className="pl-4 has-text-grey">Connected Wallet</p>
      <SignInOutButton user={user} injectedProvider={injectedProvider} />
    </div>
  );
};

export default Web3Consumer(CurrentUser);
