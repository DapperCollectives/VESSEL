import "./App.sass";
import React from "react";
import {
  HashRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { Web3Provider, ModalProvider, Web3Consumer } from "./contexts";
import { Home, Safe, LoadSafe, CreateSafe } from "./pages";
import { Logo, Navigation, Transactions } from "./components";

const Wrapper = ({ children }) => <div className="App">{children}</div>;

const Sidebar = ({ children }) => (
  <div className="sidebar screen-height is-flex is-flex-direction-column t-0 l-0 py-6">
    {children}
  </div>
);
const PrivateRoutes = ({ canAccess }) => {
  if (canAccess) {
    return (
      <>
        <Route exact path="/load-safe">
          <LoadSafe />
        </Route>
        <Route exact path="/create-safe">
          <CreateSafe />
        </Route>
        <Route path={["/safe/:address/:tab", "/safe/:address"]}>
          <Safe />
        </Route>
      </>
    );
  } else {
    return <Redirect to="/" />;
  }
};
const Body = ({ web3 }) => {
  return (
    <div className="body has-background-white-rounded">
      <Transactions />
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <PrivateRoutes canAccess={web3?.user?.addr && web3?.user?.loggedIn} />
      </Switch>
    </div>
  );
};
const BodyWithContext = Web3Consumer(Body);

function App() {
  return (
    <Router>
      <Web3Provider network={process.env.REACT_APP_FLOW_ENV}>
        <ModalProvider>
          <Wrapper>
            <Sidebar>
              <Logo className="mb-6 px-4" />
              <Navigation />
            </Sidebar>
            <BodyWithContext />
          </Wrapper>
        </ModalProvider>
      </Web3Provider>
    </Router>
  );
}

export default App;
