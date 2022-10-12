import React from 'react';
import { Route, HashRouter as Router, Switch } from 'react-router-dom';
import { ModalProvider, Web3Provider } from './contexts';
import { Logo, Navigation, Transactions } from './components';
import './App.sass';
import { CreateSafe, Home, LoadSafe, Safe } from './pages';

const Wrapper = ({ children }) => <div className="App">{children}</div>;

const Sidebar = ({ children }) => (
  <div className="sidebar screen-height is-flex is-flex-direction-column t-0 l-0 py-6">
    {children}
  </div>
);

const Body = () => (
  <div className="body has-background-white-rounded">
    <Transactions />
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route exact path="/load-safe">
        <LoadSafe />
      </Route>
      <Route exact path="/create-safe">
        <CreateSafe />
      </Route>
      <Route path={['/safe/:address/:tab', '/safe/:address']}>
        <Safe />
      </Route>
    </Switch>
  </div>
);

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
            <Body />
          </Wrapper>
        </ModalProvider>
      </Web3Provider>
    </Router>
  );
}

export default App;
