export const HowToPlay = () => {
    return (
        <div className="text-center rounded-lg border border-transparent px-5 py-4 hover:border-gray-300 hover:bg-gray-100">
            <div className='text-xl font-semibold'>How to Play</div>
            <p>Player 1 commits a move, stakes some ETH</p>
            <p>Player 2 stakes same ETH and chooses a move</p>
            <p>Player 1 reveals its move</p>
            <p>Winner gets double the ETH than staked</p>
        </div>
    )
}