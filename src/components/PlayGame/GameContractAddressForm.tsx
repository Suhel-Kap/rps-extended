'use client'

import {useEffect, useState} from "react";
import {Address} from "viem";
import {getContractByteCode} from "@/lib/contract";
import {RSPLS_CONSTRUCTOR_BYTECODE} from "@/contracts/bytecode";
import {useGetContractState} from "@/hooks/useGetContractState";

export const GameContractAddressForm = () => {
    const [address, setAddress] = useState<Address>()
    const {data, refetch} = useGetContractState(address)
    console.log(data)

    useEffect(() => {
        refetch()
    }, [address]);
    return (
        <div>
            <input type="text" value={address} onChange={(e) => setAddress(e.target.value as Address)} />
        </div>
    )
}