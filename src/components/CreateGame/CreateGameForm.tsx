'use client'

import { useState } from 'react';
import { Address, isAddress } from 'viem';
import { Moves } from '@/utils/const';
import {CreateGameType, Move} from "@/utils/types";
import { generateRandomSalt } from "@/utils/generateRandomSalt";
import {useCreateGame} from "@/hooks/useCreateGame";

export const CreateGameForm = () => {
    const [form, setForm] = useState<CreateGameType>({
        move: null,
        player2: null,
        salt: generateRandomSalt(),
        stake: 0
    })
    const [error, setError] = useState<string>('');
    const {isPending, mutate} = useCreateGame()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const { player2, stake, move, salt } = form;
        if (!player2 || !stake || !move || !salt) {
            setError('All fields are required');
            return;
        }
        if (!isAddress(player2)) {
            setError('Invalid address');
            return;
        }
        if (stake <= 0) {
            setError('Stake must be greater than zero');
            return;
        }
        setError('');
        mutate(form)
    };

    const handleGenerateNewSalt = () => {
        setForm({
            ...form,
            salt: generateRandomSalt()
        })
    };

    const handleCopySalt = () => {
        navigator.clipboard.writeText(form.salt);
    };

    return (
        <div className="max-w-md mx-auto p-4 bg-white border border-gray-600 rounded-lg shadow-md mt-4">
            <h2 className="text-2xl font-bold mb-4 text-black">Create Game</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700">Player 2 Address</label>
                    <input
                        type="text"
                        value={form.player2 || ''}
                        placeholder={'0x...'}
                        onChange={(e) => setForm({ ...form, player2: e.target.value as Address })}
                        className="w-full px-3 py-2 border rounded-lg text-black placeholder:text-gray-500"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Stake (ETH)</label>
                    <input
                        type="number"
                        value={form.stake}
                        onChange={(e) => setForm({ ...form, stake: parseFloat(e.target.value) })}
                        className="w-full px-3 py-2 border rounded-lg text-black placeholder:text-gray-500"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Move</label>
                    <select
                        value={form.move || ''}
                        onChange={(e) => setForm({ ...form, move: e.target.value as unknown as Move })}
                        className="w-full px-3 py-2 border rounded-lg text-black placeholder:text-gray-500"
                    >
                        <option value="">Select Move</option>
                        {Moves.map((move) => (
                            <option key={move} value={move}>
                                {Move[move]}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Salt</label>
                    <label className="block text-orange-500 italic">Please copy and store the salt securely!</label>
                    <div className="flex">
                        <input
                            type="text"
                            value={form.salt}
                            onChange={(e) => setForm({ ...form, salt: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg text-black placeholder:text-gray-500"
                        />
                        <button
                            type="button"
                            onClick={handleCopySalt}
                            className="ml-2 bg-gray-300 text-black py-2 px-4 rounded-lg hover:bg-gray-400"
                        >
                            Copy
                        </button>
                        <button
                            type="button"
                            onClick={handleGenerateNewSalt}
                            className="ml-2 bg-gray-300 text-black py-2 px-4 rounded-lg hover:bg-gray-400"
                        >
                            Regenerate
                        </button>
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
                >
                    {isPending ? 'Creating...' : 'Create Game'}
                </button>
            </form>
        </div>
    );
};