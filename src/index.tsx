import App from "./App";
import "./index.css";
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink
} from "apollo-boost";
import React from "react";
import { Provider } from "react-redux";
import { ApolloProvider } from "react-apollo";
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";
import { store } from "./Store";
import { BrowserRouter as Router } from "react-router-dom";

const httpLink = new HttpLink({ uri: process.env.REACT_APP_API_URI });

const authLink = new ApolloLink((operation, forward) => {
  // Retrieve the authorization token from local storage.
  const token = localStorage.getItem("token");

  // Use the setContext method to set the HTTP headers.
  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : ""
    }
  });

  // Call the next link in the middleware chain.
  return forward(operation);
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    addTypename: false
  })
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>
  </ApolloProvider>,
  document.getElementById("root")
);

serviceWorker.unregister();
