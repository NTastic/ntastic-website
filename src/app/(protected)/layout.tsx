import React from "react";
import NavigationLayout from "@/app/modules/navigationLayout/NavigationLayout";

const ProtectedLayout: React.FC<React.PropsWithChildren> = ({children}) => {
    return (
        <NavigationLayout>
            {children}
        </NavigationLayout>
    );
};

export default ProtectedLayout;