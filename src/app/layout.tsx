"use client";
import React, {useEffect} from "react";
import { Inter } from "next/font/google";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { ACCESS_TOKEN, IS_SM } from "@/shared/constants/storage";
import { useTheme, useMediaQuery } from "@mui/material";
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
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
  uri: "https://dev.ntastic.site/graphql",
});

const client = new ApolloClient({
  link: authLink.concat(uploadLink),
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
        <link rel="icon" href="https://i.postimg.cc/mkryN7K0/NTastic-icon.png" type="image/x-icon"/>
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