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
			<div>
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
								in:fade={{ delay: 1000, duration: 500 }}
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
		</div>
		<div class="right-column mt-3">
			{#if isRowComplete(grid, currentRow) && !doesWordExist(grid, currentRow, words)}
				<h4 class="wordDoesNotExist error" transition:fade={{ duration: 800 }}>
					Not a valid word!
				</h4>
			{:else if doesWordExist(grid, currentRow, words) && filteredPossibles.length === 0 && areAllCurrentRowStatusesSet(statuses, currentRow)}
				<h4 class="error wordDoesNotExistDelay">No possible words</h4>
			{:else if filteredPossibles.length > 0}
				<p class="center mt-4" transition:fade={{ duration: 800 }}>
					{filteredPossibles.length} possible {filteredPossibles.length > 1 ? 'words' : 'word'}
				</p>
				<button
					class="wide"
					onclick={() => (showPossibles = !showPossibles)}
					in:fade={{ duration: 800 }}
					out:fade={{ duration: 800 }}
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
	{#if currentRow > 0 || filteredPossibles.length === 1}
		<div class="w-50">
			<button in:fade={{ delay: 1000, duration: 1200 }} class="reset wide" onclick={reset}
				>Reset...</button
			>
		</div>
	{/if}
</div>

<style lang="scss">
	.outer {
		align-items: center;
		display: flex;
		flex-direction: column;
		font-size: clamp(0.875rem, 1.75vw, 1.5rem);
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
		max-width: min(95vw, 35rem);
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 2rem;
		margin-inline: auto;
		// border: 2px solid orange;
	}

	.left-column {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		// border: 2px solid greenyellow;

		.row {
			align-items: center;
			display: flex;
			justify-content: center;
		}

		.cell {
			margin-inline: 0.125rem;
			align-items: center;
			display: flex;
			flex-direction: column;
			width: 3rem;
		}

		.letter {
			align-items: center;
			background-color: white;
			display: flex;
			justify-content: center;
			aspect-ratio: 1;
			border: 2px solid #333;
			color: black;
			border-radius: 0.5rem;
			margin-inline: 0.5rem;
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
	}

	.reset {
		// border: 2px solid #333;
		margin-top: 14rem;
		margin-inline: auto;
		// width: 15rem;
	}

	.right-column {
		// align-items: stretch;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		// border: 2px solid purple;
	}

	.bold {
		font-weight: bold;
	}
	.center {
		display: flex;
		justify-content: center;
		// background: pink;
	}

	button.status {
		height: 2rem;
		box-shadow: none;
		width: 3rem;
		background-color: violet;
	}

	button {
		border: 2px solid #333;
		font-size: 125%;
		font-weight: 500;
		// outline: none;
		box-shadow: none;
		padding: 0.5rem;
		width: 100%;
	}

	.error {
		color: red;
	}

	.scrollable-list {
		background-color: white;
		border: 2px solid #333;
		border-radius: 0.25rem;
		max-height: 30vh;
		overflow-y: auto;
		padding: 0.5rem;
		margin-top: 0.5rem;
	}

	@media only screen and (max-width: 512px) {
		.container {
			align-items: center;
			// background: red;
			display: flex;
			flex-direction: column;
			font-size: 150%;

			.left-column {
				// border: 2px solid yellow;

				.cell {
					margin-inline: 0.075rem;
					display: flex;
					flex-direction: column;
					width: 3rem;
				}

				.letter {
					align-items: center;
					background-color: white;
					display: flex;
					justify-content: center;
					aspect-ratio: 1;
					border: 2px solid #333;
					font-size: 1.125rem;

					&:focus-within {
						border: none;
					}
				}

				input {
					aspect-ratio: 1;
					padding-block-end: 0.375rem;

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
				width: 100%;
				// border: 3px solid purple;
			}
		}

		button {
			height: 1.75rem;
			// border: none;
			box-shadow: none;
			width: 100%;
			// aspect-ratio: 1;
			// border: 2px solid black;

			&.wide {
				font-size: 1rem;
				padding: 0.5rem;
				padding-block-start: 0.75rem;
				padding-block-end: 1rem;
				width: 100%;
			}
			.status {
				width: 100%;
			}
		}
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
			opacity: 0;
		}
		67% {
			transform: translateX(-2px);
			opacity: 0;
		}
		73% {
			transform: translateX(4px);
		}
		80% {
			transform: translateX(-6px);
		}
		86% {
			transform: translateX(+4px);
		}
		93% {
			transform: translateX(-2px);
		}
		100% {
			transform: translateX(0);
			opacity: 1;
		}
	}
</style>
