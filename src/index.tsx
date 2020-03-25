import App from "./App";
import "./index.css";
import ApolloClient, {InMemoryCache} from "apollo-boost";
import React from "react";
import {Provider} from "react-redux";
import {ApolloProvider} from "react-apollo";
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";
import {store} from "./Store";
import {BrowserRouter as Router} from "react-router-dom";

const client = new ApolloClient({
  uri: process.env.REACT_APP_API_URI,
  cache: new InMemoryCache({
    addTypename: false
})
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <Provider store={store}>
      <Router>
      <App/>
      </Router>
    </Provider>
  </ApolloProvider>,
  document.getElementById("root")
);

serviceWorker.unregister();
