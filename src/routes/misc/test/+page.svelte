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
		// document.getElementById('form').reset();
		currentRow = 0;
		possibles = { 0: Array.from(words), 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
		filteredPossibles = [];
		showPossibles = false;
		for (let i = 0; i < 6; i++) {
			for (let j = 0; j < 5; j++) {
				grid[i][j] = '';
				statuses[i][j] = '';
				document.getElementById(`${i}${j}`).value = '';
			}
		}
		setFocus(0, 0);
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
				filteredPossibles.push(word);
			}
		}

		possibles[currentRow + 1] = filteredPossibles;
	}
</script>

<div class="outer">
	<div class="container pt-4">
		<div class="left-column">
			<!-- <form name="form" id="form" action="?/enter"> -->
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
											id={`${row}${col}`}
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
						<button class="wide50 mt-4" onclick={advanceRow}> Guess... </button>
					{/if}
				{/each}
			</div>
			<!-- </form> -->
			{#if currentRow > 0 || filteredPossibles.length === 1}
				<button in:fade={{ delay: 1000, duration: 800 }} class="wide50 reset mt-5" onclick={reset}
					>Reset...</button
				>
			{/if}
		</div>
		<div class="right-column mt-4">
			<!-- <br class="mt-4" /> -->
			{#if filteredPossibles.length > 0}
				<p>{filteredPossibles.length} possible words:</p>
				<button class="wide" onclick={() => (showPossibles = !showPossibles)}>
					{showPossibles ? 'Hide' : 'Show'}...
				</button>
				{#if showPossibles}
					<div class="scrollable-list mt-2">
						{#each filteredPossibles as possible}
							<div>{possible}</div>
						{/each}
					</div>
				{/if}
			{/if}
		</div>
	</div>
</div>

<style lang="scss">
	.outer {
		align-items: center;
		display: flex;
		flex-direction: column;
		font-size: clamp(0.875rem, 2vw, 1.25rem);
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
		max-width: min(100vw, 30rem);
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 2rem;
		margin-inline: auto;
	}

	.left-column {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		// border: 1px solid red;

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
		// border: 1px solid red;
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

		&.wide50 {
			border: 2px solid #333;
			float: right;
			font-size: 125%;
			font-weight: 500;
			margin-inline: 0.25rem;
			padding: 1.25rem;
			padding-inline: 2.5rem;
			vertical-align: middle;
			width: 50%;
		}
		&.wide {
			border: 2px solid #333;
			float: right;
			font-size: 125%;
			font-weight: 500;
			// margin-inline: 0.25rem;
			padding: 1.25rem;
			padding-inline: 2.5rem;
			vertical-align: middle;
			width: 100%;
		}
	}

	.scrollable-list {
		background-color: white;
		border: 2px solid #333;
		border-radius: 0.25rem;
		max-height: 40vh;
		overflow-y: auto;
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
