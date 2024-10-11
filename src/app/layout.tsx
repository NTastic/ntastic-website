"use client";
import React, { useEffect } from "react";
import { Inter } from "next/font/google";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  Observable,
  ApolloLink
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { ACCESS_TOKEN, IS_SM, REFRESH_TOKEN } from "@/shared/constants/storage";
import { useTheme, useMediaQuery } from "@mui/material";
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";
import { onError } from "@apollo/client/link/error";
import { refreshAccessToken } from "@/validation/auth/auth";
import { RouteConfig } from "@/routes/route";

const URL_GRAPHQL_ENDPOINT = process.env.URL_GRAPHQL_ENDPOINT || "https://dev.ntastic.site/graphql";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const refreshClient = new ApolloClient({
  uri: URL_GRAPHQL_ENDPOINT,
  cache: new InMemoryCache(),
});

const errorLink = onError(({ graphQLErrors, operation, forward }) => {
  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      const contxt = operation.getContext();
      console.log('context', contxt);
      if (
        err.extensions && err.extensions.code === "UNAUTHENTICATED" &&
        !operation.getContext().isRetry
      ) {
        // Return a new observable to retry the request
        return new Observable((observer) => {
          refreshAccessToken(refreshClient)
            .then((newAccessToken) => {
              // Update the headers with the new token
              operation.setContext(({ headers = {} }) => ({
                headers: {
                  ...headers,
                  authorization: `Bearer ${newAccessToken}`,
                },
              }));

              operation.setContext({ isRetry: true });
              // Retry the request
              const subscriber = {
                next: observer.next.bind(observer),
                error: observer.error.bind(observer),
                complete: observer.complete.bind(observer),
              };

              forward(operation).subscribe(subscriber);
            })
            .catch((error) => {
              // Redirect to login page on refresh failure
              localStorage.removeItem(ACCESS_TOKEN);
              localStorage.removeItem(REFRESH_TOKEN);
              window.location.href = RouteConfig.Login.Path;
              observer.error(error);
            });
        });
      }
    }
  }
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem(ACCESS_TOKEN);
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  };
});

const uploadLink = createUploadLink({
  uri: URL_GRAPHQL_ENDPOINT,
});

const client = new ApolloClient({
  link: ApolloLink.from([errorLink, authLink, uploadLink]),
  cache: new InMemoryCache()
});

const RootLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm")) ? "true" : "false";

  useEffect(() => {
    localStorage.setItem(IS_SM, isSmallScreen);
  }, [isSmallScreen]);

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="https://i.postimg.cc/mkryN7K0/NTastic-icon.png" type="image/x-icon" />
      </head>
      <body
        className={`${inter.variable} font-sans subpixel-antialiased`}
      >
        <ApolloProvider client={client}>
          {children}
        </ApolloProvider>
      </body>
    </html>
  );
};

export default RootLayout;