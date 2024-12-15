import {useQuery} from "@tanstack/react-query";
import {Address} from "viem";
import {getContractState} from "@/lib/contract";

export const useGetContractState = (address: Address) => {
    const {data, refetch, isLoading, isFetching, isError, error} = useQuery({
        queryFn: async () => {
            return await getContractState(address)
        },
        queryKey: ['getContractState']
    })

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