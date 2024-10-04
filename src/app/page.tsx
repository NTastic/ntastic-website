import React from "react";
import RootPage from "./modules/rootPage/RootPage";
import { RouteConfig } from "@/routes/route";

export const metadata = RouteConfig.Root.Metadata;

const App: React.FC = () => {
  return <RootPage />;
};

export default App;
