<script>
	import { fade } from 'svelte/transition';
	import { tick } from 'svelte';
	import { words } from './words.js';
	import { onMount } from 'svelte';

	import {
		handleKeyDown,
		handleInput,
		isRowComplete,
		isRowEmpty,
		doesWordExist,
		moveCursorToEnd,
		areAllCurrentRowStatusesSet,
		getGuess,
		getStatusString,
		// getPossibles,
		colorise
	} from './functions.js';

	// setStatus,
	// getStatusString,
	// getGuess,
	// colorise,

	import '$lib/css/app.css';

	let currentRow = $state(0);
	let grid = $state(Array.from({ length: 6 }, () => Array(5).fill('')));
	let statuses = $state(Array.from({ length: 6 }, () => Array(5).fill('')));
	let possibles = { 0: Array.from(words), 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
	let filteredPossibles = $state([]);
	let showPossibles = $state(false);

	onMount(() => {
		const firstInput = document.querySelector(`input[name="00"]`);
		if (firstInput) {
			firstInput.focus();
		}
	});

	// has to be in this file for the tick to work?
	function advanceRow() {
		currentRow++;
		tick().then(() => {
			const firstCol = document.querySelector(`input[name="${currentRow}0"]`);
			if (firstCol) {
				firstCol.focus();
			}
		});
	}

	function setStatus(row, col, status) {
		statuses[row][col] = status;

		if (areAllCurrentRowStatusesSet(statuses, row)) {
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
				console.log(word);
				filteredPossibles.push(word);
			}
		}
		// console.log(filteredPossibles.length + ' possibles');
		// tick().then(() => {
		// 	return;
		// });
		possibles[currentRow + 1] = filteredPossibles;
	}
</script>

<div class="container pt-4">
	<div class="left-column">
		<div class="grid">
			{#each Array.from(Array(6).keys()) as row (row)}
				<div class:hide={row > currentRow} class:show={row <= currentRow}>
					<div class="row mt-4 wordDoesNotExist">
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
										name={`${row}${col}`}
										type="text"
										maxlength="1"
										onkeydown={(event) => handleKeyDown(event, grid, row, col, statuses)}
										oninput={(event) => handleInput(event, grid, row, col)}
										onclick={moveCursorToEnd(row, col)}
									/>
								</div>
								{#if isRowComplete(grid, row)}
									{#if doesWordExist(grid, row, words)}
										{#if !areAllCurrentRowStatusesSet(statuses, row)}
											<div class="buttons" transition:fade>
												<button
													class="exact mt-2"
													onclick={() => setStatus(row, col, 'x')}
													aria-label="Set to exact"
												></button>
												<button
													class="near mt-2"
													onclick={() => setStatus(row, col, 'n')}
													aria-label="Set to close"
												></button>
												<button
													class="none mt-2"
													onclick={() => setStatus(row, col, 'o')}
													aria-label="Set to absent"
												></button>
											</div>
											<!-- {:else}get possibles -->
										{/if}
									{:else}
										<div class="wordDoesNotExist">dne</div>
									{/if}
								{/if}
							</div>
						{/each}
					</div>
				</div>
				{#if currentRow < 5 && currentRow === row && areAllCurrentRowStatusesSet(statuses, currentRow)}
					<!-- {(filteredPossibles = Array.from(filteredPossibles))} -->
					<button class="wide mt-4" onclick={advanceRow}> Guess... </button>
				{/if}
			{/each}
		</div>
	</div>
	<div class="right-column mt-4">
		<!-- <br class="mt-4" /> -->
		{#if filteredPossibles.length > 0}
			<p>{filteredPossibles.length} possible words:</p>
			<button class="wide" onclick={() => (showPossibles = !showPossibles)}>
				{showPossibles ? 'Hide' : 'Show'}...
			</button>
			{#if showPossibles}
				<div class="scrollable-list">
					{#each filteredPossibles as possible}
						<div>{possible}</div>
					{/each}
				</div>
			{/if}
		{/if}
	</div>
</div>

<style lang="scss">
	.container {
		max-width: min(100vw, 30rem, 50rem);
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 2rem;
		margin-inline: auto;
	}

	.left-column {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		border: 1px solid red;

		.row {
			align-items: center;
			display: flex;
		}

		.cell {
			margin-inline: 0.25rem;
			align-items: center;
			display: flex;
			flex-direction: column;
			justify-content: center;
			padding: 0;
			width: 3rem;
		}

		.letter {
			align-items: center;
			background-color: white;
			display: flex;
			height: 3rem;
			justify-content: center;
			aspect-ratio: 1;
			border: 2px solid #333;
			font-size: 2rem;
			color: black;
			border-radius: 0.5rem;
			margin-inline: 0.5rem;

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
			padding-block-end: 0.25rem;
			margin: 0;
			// caret-color: transparent;

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
	}

	.right-column {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		border: 1px solid red;
	}
	.show {
		display: block;
	}
	.hide {
		display: none;
	}

	button {
		height: 2rem;
		// border: none;
		box-shadow: none;
		width: 3rem;

		&.wide {
			border: 2px solid #333;
			float: right;
			font-size: 125%;
			font-weight: 500;
			margin-inline: 0.25rem;
			padding: 1.25rem;
			padding-inline: 2.5rem;
			vertical-align: middle;
			width: 100%;
		}
	}

	.scrollable-list {
		background-color: white;
		max-height: 15rem;
		overflow-y: auto;
		border: 2px solid #333;
		padding: 0.5rem;
		margin-top: 0.5rem;
	}

	@media (prefers-reduced-motion: no-preference) {
		.wordDoesNotExist {
			animation: wiggle 0.5s;
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
</style>
