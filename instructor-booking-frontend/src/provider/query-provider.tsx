import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "../lib/query-client";

interface QueryProviderProps {
    children: React.ReactNode;
}

function QueryProvider({ children }: QueryProviderProps) {
    return (
        <QueryClientProvider client={queryClient} >
            {children}
        </QueryClientProvider>
    );
}

export default QueryProvider;