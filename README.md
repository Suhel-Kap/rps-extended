# Rock Paper Scissors Lizard Spock (RPSLS) Smart Contract Game

## Overview

This project is a simple implementation of the Rock Paper Scissors Lizard Spock game using a smart contract on the Sepolia testnet.

Players can stake ETH, make their moves, and let the smart contract decide the winner based on predefined rules. The game is turn-based, with timeouts ensuring that players cannot stall indefinitely.

The frontend is built with NextJS and it uses Tanstack React Query for state management. It uses ConnectKit for wallet integration and viem for interacting with the smart contract.

## Frontend Functionalities

- Create a Game:
  - Input Player 2’s wallet address, stake amount, move, and random salt (auto-generated or custom).
	-	Game details are stored in local storage, with prompts to save these externally.
	-	After successful contract deployment, the contract address is displayed for sharing with Player 2.
-	Play a Game:
	-	Input the contract address or use a prefilled address from a previously created game.
	-	Verify the contract’s validity using its runtime bytecode.
	-	Fetch the game state (e.g., stake amount, player details, last action).

### Game Actions:

Based on the connected wallet’s role:
-	Player 1: Solve the game or withdraw their stake.
-	Player 2: Play their move or withdraw the full stake if Player 1 fails to reveal.

## Features:

- Random Salt Generation: To prevent move prediction, player 1's salt must be truly random. For this we use the browser's built-in crypto API to generate a random salt.
