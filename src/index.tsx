import App from "./App";
import "./index.css";
import ApolloClient from "apollo-boost";
import React from "react";
import { Provider } from "react-redux";
import { ApolloProvider } from "react-apollo";
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";
import { store } from "./Store";

const client = new ApolloClient({
  uri: "https://signup5-stage.herokuapp.com/graphql"
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <Provider store={store}>
      <App />
    </Provider>
  </ApolloProvider>,
  document.getElementById("root")
);

serviceWorker.unregister();
