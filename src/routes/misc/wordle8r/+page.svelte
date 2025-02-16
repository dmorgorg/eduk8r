<script>
	import { fade } from 'svelte/transition';
	import { tick } from 'svelte';
	import { words, select } from './words.js';
	import { onMount } from 'svelte';

	import {
		handleKeyDown,
		handleInput,
		isRowComplete,
		isRowEmpty,
		doesWordExist,
		moveCursorToEnd,
		areAllRowStatusesSet,
		getGuess,
		getStatusString,
		colorise
	} from './functions.js';

	import '$lib/css/app.css';

	let currentRow = $state(0);
	let grid = $state(Array.from({ length: 6 }, () => Array(5).fill('')));
	let statuses = $state(Array.from({ length: 6 }, () => Array(5).fill('')));
	let possibles = { 0: Array.from(words), 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
	let filteredPossibles = $state([]);
	let showPossibles = $state(false);

	onMount(() => {
		setFocus(0, 0);
	});

	function setFocus(row, col) {
		document.querySelector(`input[name="${row}${col}"]`).focus({ focusVisible: true });
	}

	// has to be in this file for the tick to work?
	function advanceRow() {
		currentRow++;
		tick().then(() => {
			setFocus(currentRow, 0);
		});
	}

	function reset() {
		currentRow = 0;
		possibles = { 0: Array.from(words), 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
		filteredPossibles = [];
		showPossibles = false;
		for (let i = 0; i < 6; i++) {
			for (let j = 0; j < 5; j++) {
				grid[i][j] = '';
				statuses[i][j] = '';
				if (document && document.getElementById(`${i}${j}`)) {
					const doc = document.getElementById(`${i}${j}`);
					doc.value = '';
				}
			}
		}
		const firstInput = document.querySelector(`input[name="00"]`);
		if (firstInput) {
			firstInput.disabled = false;
			setFocus(0, 0);
		}
	}

	function setStatus(row, col, status) {
		statuses[row][col] = status;

		if (areAllRowStatusesSet(statuses, row)) {
			const g = getGuess(grid, currentRow);
			const s = getStatusString(statuses, currentRow);
			getPossibles(g, s);
		}
	}

	function getPossibles(guess, status) {
		filteredPossibles = [];
		for (let word of possibles[currentRow]) {
			const wordStatusString = colorise(guess, word);
			if (wordStatusString === status) {
				filteredPossibles.push(word);
			}
		}

		possibles[currentRow + 1] = filteredPossibles;
	}
</script>

<div class="outer">
	<div>
		<a class="how-to-play mt-4" href="/how-to-use"
			><img src="/information-button.png" alt="information button" />How to use...</a
		>
	</div>
	<div class="container pt-4">
		{#each Array.from(Array(6).keys()) as row (row)}
			{#if row <= currentRow}
				<div class="row">
					{#each Array.from(Array(5).keys()) as col (col)}
						<div class="cell">
							<div
								class="letter"
								class:exact={statuses[row][col] === 'x'}
								class:near={statuses[row][col] === 'n'}
								class:none={statuses[row][col] === 'o'}
							>
								<input
									autocomplete="off"
									id={`${row}${col}`}
									name={`${row}${col}`}
									type="text"
									disabled={row < currentRow}
									maxlength="1"
									onkeydown={(event) => handleKeyDown(event, grid, row, col, statuses)}
									oninput={(event) => handleInput(event, grid, row, col)}
									onclick={moveCursorToEnd(row, col)}
								/>
							</div>

							{#if isRowComplete(grid, row) && doesWordExist(grid, row, words) && !areAllRowStatusesSet(statuses, row)}
								<div class="buttons">
									<button
										class="exact mt-2 status"
										onclick={() => setStatus(row, col, 'x')}
										aria-label="Set to exact"
									></button>
									<button
										class="near mt-2 status"
										onclick={() => setStatus(row, col, 'n')}
										aria-label="Set to close"
									></button>
									<button
										class="none mt-2 status"
										onclick={() => setStatus(row, col, 'o')}
										aria-label="Set to absent"
									></button>
								</div>
							{/if}
						</div>
					{/each}
				</div>
			{/if}
		{/each}

		{#if isRowComplete(grid, currentRow) && !doesWordExist(grid, currentRow, words)}
			<h4 class="wordDoesNotExist error center">Not a valid word!</h4>
		{/if}

		{#if doesWordExist(grid, currentRow, words) && filteredPossibles.length === 0 && areAllRowStatusesSet(statuses, currentRow)}
			<h4 class="wordDoesNotExist error center ht-4">No possible words</h4>
		{/if}

		{#if (currentRow > 0 && areAllRowStatusesSet(statuses, currentRow - 1) && filteredPossibles.length > 0) || (doesWordExist(grid, currentRow, words) && filteredPossibles.length > 0)}
			<div class="center fs-120">
				{filteredPossibles.length} possible {filteredPossibles.length > 1 ? 'words' : 'word'}
			</div>
			<button class="wide" onclick={() => (showPossibles = !showPossibles)}>
				{showPossibles ? 'Hide' : 'Show'}...
			</button>
			<!-- showPossibles: {showPossibles} -->
		{/if}
		{#if showPossibles && filteredPossibles.length > 0}
			<div class="scrollable-list">
				{#each filteredPossibles as possible}
					<div class:bold={select.has(possible)} class="fs-120">{possible}</div>
				{/each}
			</div>
		{/if}

		{#if currentRow < 5 && areAllRowStatusesSet(statuses, currentRow) && filteredPossibles.length > 1}
			<button class="wide" onclick={advanceRow}> Next Guess... </button>
		{/if}

		{#if currentRow > 0 || filteredPossibles.length === 1}
			<button class="wide" onclick={reset}>Reset...</button>
		{/if}
	</div>
</div>

<style lang="scss">
	.outer {
		align-items: center;
		display: flex;
		flex-direction: column;
		font-size: clamp(0.875rem, 1.125vw, 1.5rem);
	}

	a.how-to-play {
		color: black;
		display: flex;
		justify-content: center;
		align-items: center;
		&:hover {
			text-decoration: none;
			cursor: pointer;
		}
		img {
			display: inline;
			width: 1.5rem;
			height: 1.5rem;
			margin-inline-end: 0.5rem;
		}
	}

	.container {
		width: 20rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding-inline: 1rem;
	}

	.row {
		align-items: center;
		display: flex;
		justify-content: center;
		margin-block: 0;
	}

	.cell {
		// align-items: center;
		display: flex;
		flex-direction: column;
		margin-inline: 0.125rem;
	}

	.letter {
		align-items: center;
		background-color: white;
		display: flex;
		justify-content: center;
		aspect-ratio: 1;
		border: 0.125rem solid black;
		color: black;
		border-radius: 0.25rem;
		width: 100%;

		&:focus-within {
			border: none;
		}
	}

	input {
		width: 100%;
		height: 100%;
		background-color: inherit;
		box-shadow: var(--shadow-6);
		outline: none;
		text-align: center;
		padding: 0;
		// padding-inline: 0.125rem;
		padding-block-end: 0.25rem;
		margin: 0;
		font-size: 150%;

		&:focus {
			border: 2px solid #090;
			outline: none;
		}
	}

	.exact {
		background-color: green;
	}
	.near {
		background-color: #ffc040;
	}
	.none {
		background-color: #aaa;
	}

	.bold {
		font-weight: bold;
	}

	.center {
		display: flex;
		justify-content: center;
	}

	button.status {
		height: 2rem;
		box-shadow: none;
		width: 100%;
	}

	button {
		border: 0.125rem solid black;
		font-size: 110%;
		font-weight: 500;
		// outline: none;
		box-shadow: none;
		padding: 0.25rem;
		width: 100%;
		background-color: #ccc;
	}

	.error {
		color: red;
		font-size: 1.25rem;
		font-weight: 500;
	}

	.scrollable-list {
		background-color: white;
		border: 2px solid #333;
		border-radius: 0.25rem;
		max-height: 30vh;
		overflow-y: auto;
		padding: 0.5rem;
		padding-inline-start: 1rem;
		// margin-top: 0.125rem;
	}

	@media (prefers-reduced-motion: no-preference) {
		.wordDoesNotExist {
			animation: wiggle 0.5s;
		}
		.wordDoesNotExistDelay {
			animation: wiggleDelay 0.5s;
			// background: yellow;
			transition-delay: 1s;
		}
	}

	@keyframes wiggle {
		0% {
			transform: translateX(0);
		}
		10% {
			transform: translateX(-2px);
		}
		30% {
			transform: translateX(4px);
		}
		50% {
			transform: translateX(-6px);
		}
		70% {
			transform: translateX(+4px);
		}
		90% {
			transform: translateX(-2px);
		}
		100% {
			transform: translateX(0);
		}
	}
	@keyframes wiggleDelay {
		0% {
			transform: translateX(0);
		}
		10% {
			transform: translateX(-2px);
		}
		30% {
			transform: translateX(4px);
		}
		50% {
			transform: translateX(-6px);
		}
		70% {
			transform: translateX(+4px);
		}
		90% {
			transform: translateX(-2px);
		}
		100% {
			transform: translateX(0);
		}
	}

	// @keyframes wiggleDelay {
	// 	0% {
	// 		transform: translateX(0);
	// 		opacity: 0;
	// 	}
	// 	67% {
	// 		transform: translateX(-2px);
	// 		opacity: 0;
	// 	}
	// 	73% {
	// 		transform: translateX(4px);
	// 	}
	// 	80% {
	// 		transform: translateX(-6px);
	// 	}
	// 	86% {
	// 		transform: translateX(+4px);
	// 	}
	// 	93% {
	// 		transform: translateX(-2px);
	// 	}
	// 	100% {
	// 		transform: translateX(0);
	// 		opacity: 1;
	// 	}
	// }
</style>
