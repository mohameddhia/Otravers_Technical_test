import type { AuthRouterProps } from "src/types/authTypes";

import React, { useEffect } from "react";
import { Flex, Spinner } from "@chakra-ui/react";

import { useRouter } from "src/routes/hooks";

import { useAppSelector } from "src/redux/hooks/redux";

export const ProtectedRoute: React.FC<AuthRouterProps> = ({ children }) => {
    const router = useRouter();
    const { isLoading, isAuthenticated } = useAppSelector((state) => state.auth);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/sign-in');
        }
    }, [isLoading, isAuthenticated, router]);

    if (isLoading) {
        return (
            <Flex minH="100vh" align="center" justify="center">
                <Spinner size="xl" />
            </Flex>
        );
    }

    // Only render children if authenticated
    return isAuthenticated ? <>{children}</> : null;
};