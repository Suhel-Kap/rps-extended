import {useQuery} from "@tanstack/react-query";
import {Address} from "viem";
import {getContractState} from "@/lib/contract";

export const useGetContractState = (address: Address | undefined) => {
    const {data, refetch, isLoading, isFetching, isError, error} = useQuery({
        queryFn: async () => {
            if (!address) return {};
            return await getContractState(address)
        },
        queryKey: ['getContractState'],
        enabled: !!address,
        refetchOnWindowFocus: true,
        refetchOnMount: true,
    });

    const errorMessage = error?.message || 'An error occurred';

    return {
        data,
        refetch,
        isLoading,
        isFetching,
        isError,
        errorMessage
    }
}