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
				if (document && document.getElementById(`${i}${j}`)) {
					const doc = document.getElementById(`${i}${j}`);
					doc.value = '';
				}
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
	<div>
		<a class="how-to-play mt-4" href="/misc/wordle8r/how-to-use"
			><img src="/information-button.png" alt="information button" />How to use...</a
		>
	</div>
	<div class="container pt-4">
		<div class="left-column">
			<!-- <form name="form" id="form" action="?/enter"> -->
			<div class="grid">
				{#each Array.from(Array(6).keys()) as row (row)}
					{#if row <= currentRow}
						<div
							class="row mt-4"
							in:fade={{ delay: 500, duration: 800 }}
							out:fade={{ duration: 800 }}
						>
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

									{#if isRowComplete(grid, row) && doesWordExist(grid, row, words) && !areAllCurrentRowStatusesSet(statuses, row)}
										<div class="buttons" in:fade={{ duration: 500 }} out:fade={{ duration: 500 }}>
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
									<!-- {:else}
										<div class="wordDoesNotExist">dne</div> -->
								</div>
							{/each}
						</div>
						{#if currentRow < 5 && currentRow === row && areAllCurrentRowStatusesSet(statuses, currentRow) && filteredPossibles.length > 1}
							<button
								class="wide mt-4"
								in:fade={{ delay: 1500, duration: 500 }}
								out:fade={{ duration: 500 }}
								onclick={advanceRow}
							>
								Next Guess...
							</button>
						{/if}
					{/if}
				{/each}
			</div>
			<!-- </form> -->
			{#if currentRow > 0 || filteredPossibles.length === 1}
				<button in:fade={{ delay: 1000, duration: 1200 }} class="wide reset mt-5" onclick={reset}
					>Reset...</button
				>
			{/if}
		</div>
		<div class="right-column mt-3">
			{#if isRowComplete(grid, currentRow) && !doesWordExist(grid, currentRow, words)}
				<h4 class="wordDoesNotExist error center" transition:fade={{ duration: 800 }}>
					Not a valid word!
				</h4>
			{:else if doesWordExist(grid, currentRow, words) && filteredPossibles.length === 0 && areAllCurrentRowStatusesSet(statuses, currentRow)}
				<h4 in:fade={{ delay: 2000, duration: 500 }} class="mt-2 error center">
					No possible words
				</h4>
			{:else if filteredPossibles.length > 0}
				<p class="center mt-4" transition:fade={{ duration: 800 }}>
					{filteredPossibles.length} possible {filteredPossibles.length > 1 ? 'words' : 'word'}
				</p>
				<button
					class="wide"
					onclick={() => (showPossibles = !showPossibles)}
					transition:fade={{ delay: 500, duration: 800 }}
				>
					{showPossibles ? 'Hide' : 'Show'}...
				</button>
				{#if showPossibles}
					<div class="scrollable-list" in:fade={{ duration: 800 }} out:fade={{ duration: 500 }}>
						{#each filteredPossibles as possible}
							<div class:bold={select.has(possible)}>{possible}</div>
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
		font-size: clamp(0.75rem, 1.75vw, 1.25rem);
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
		.reset {
			margin-top: 4rem;
		}
	}

	.right-column {
		align-items: stretch;
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
	.bold {
		font-weight: bold;
	}
	.center {
		display: flex;
		justify-content: center;
	}

	.error {
		color: red;
		font-weight: bold;
		text-align: center;
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
		&.wide75 {
			border: 2px solid #333;
			float: right;
			font-size: 125%;
			font-weight: 500;
			margin-inline: 0.25rem;
			padding: 1.25rem;
			padding-inline: 2.5rem;
			vertical-align: middle;
			width: 75%;
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
