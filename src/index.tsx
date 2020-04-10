import App from "./App";
import "./index.css";
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
} from "apollo-boost";
import React from "react";
import { Provider } from "react-redux";
import { ApolloProvider } from "react-apollo";
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";
import { store } from "./Store";
import { BrowserRouter as Router } from "react-router-dom";

<<<<<<< HEAD
const httpLink = new HttpLink({ uri: "/graphql" });
=======
const httpLink = new HttpLink({ uri: process.env.REACT_APP_API_URI + "/graphql", credentials: 'include' });
>>>>>>> a34ce9e0713800bcb1a0a6e5db80b7e9dc276741

const authLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem("token");
  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : "",
    },
  });
  return forward(operation);
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    addTypename: false,
  }),
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