"use client";
import { Inter } from "next/font/google";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider
} from "@apollo/client";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const client = new ApolloClient({
  uri: "https://dev.ntastic.site/graphql",
  cache: new InMemoryCache()
});

const RootLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/images/NTastic_icon.svg" type="image/x-icon"/>
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