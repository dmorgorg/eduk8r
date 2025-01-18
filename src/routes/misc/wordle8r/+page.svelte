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
		const firstInput = document.querySelector(`input[name="00"]`);
		if (firstInput) {
			firstInput.focus();
		}
	});

	function reset() {
		document.getElementById('form').reset();
		currentRow = 0;
		possibles = { 0: Array.from(words), 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
		filteredPossibles = [];
		showPossibles = false;
		for (let i = 0; i < 6; i++) {
			for (let j = 0; j < 5; j++) {
				grid[i][j] = '';
				statuses[i][j] = '';
			}
		}
		const firstInput = document.querySelector(`input[name="00"]`);
		if (firstInput) {
			console.log('focus');
			firstInput.focus();
		}
	}

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
			// showPossibles = false;
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

	// function areAllCurrentRowStatusesSet() {
	// 	return statuses[currentRow].every((cell) => cell !== '');
	// }
</script>

<div class="container pt-4">
	<div class="left-column">
		<a class="how-to-play" href="/misc/wordle8r/how-to-use"
			><img src="/information-button.png" alt="information button" />How to use...</a
		>
		<form id="form">
			<div class="grid">
				{#each Array.from(Array(6).keys()) as row (row)}
					{#if row <= currentRow}
						<div
							class:hide={row > currentRow}
							class:show={row <= currentRow}
							out:fade={{ duration: 800 }}
							in:fade={{ delay: 1000, duration: 800 }}
						>
							<div class="row mt-4">
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
												disabled={row < currentRow}
												onkeydown={(event) => handleKeyDown(event, grid, row, col, statuses)}
												oninput={(event) => handleInput(event, grid, row, col)}
												onclick={moveCursorToEnd(row, col)}
											/>
										</div>
										{#if isRowComplete(grid, row) && doesWordExist(grid, row, words) && !areAllCurrentRowStatusesSet(statuses, row)}
											<div
												class="buttons"
												in:fade={{ duration: 1800 }}
												out:fade={{ duration: 800 }}
											>
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
											<!-- {/if} -->
											<!-- {:else}
											<div class="wordDoesNotExist">dne</div>
										{/if} -->
										{/if}
									</div>
								{/each}
							</div>
						</div>
						{#if currentRow < 5 && currentRow === row && areAllCurrentRowStatusesSet(statuses, currentRow) && filteredPossibles.length > 1}
							<!-- {(filteredPossibles = Array.from(filteredPossibles))} -->
							<button
								class="wide75 mt-4"
								onclick={advanceRow}
								in:fade={{ delay: 1000, duration: 800 }}
								out:fade={{ duration: 500 }}
							>
								Next Guess...
							</button>
						{/if}{/if}
				{/each}
			</div>
		</form>
		<button class="wide50 reset" onclick={reset}>Reset...</button>
	</div>

	<div class="right-column mb-5">
		<!-- <br class="mt-4" /> -->
		{#if filteredPossibles.length === 0 && areAllCurrentRowStatusesSet(statuses, currentRow)}
			<div>No possible solutions!</div>
		{/if}
		{#if filteredPossibles.length > 0}
			<div>
				{filteredPossibles.length} possible {filteredPossibles.length > 1 ? 'words' : 'word'}:
			</div>

			<button class="wide mt-4" onclick={() => (showPossibles = !showPossibles)}>
				{showPossibles ? 'Hide' : 'Show'}...
			</button>
			{#if showPossibles}
				<div class="scrollable-list mt-4" in:fade={{ duration: 800 }} out:fade={{ duration: 500 }}>
					{#each filteredPossibles as possible}
						<div class:bold={select.has(possible)}>{possible}</div>
					{/each}
				</div>
			{/if}
		{/if}
	</div>
</div>

<svelte:head>
	<title>Wordle8r</title>
	<meta
		name="description"
		content="An interactive aid to finding possible valid words for Wordle"
	/>
</svelte:head>

<style lang="scss">
	.container {
		max-width: min(100vw, 30rem);
		display: grid;
		font-size: var(--font-size-fluid-1);
		grid-template-columns: 1fr 1fr;
		gap: 2rem;
		margin-inline: auto;
	}

	@media (max-width: 768px) {
		.container {
			display: flex;
			flex-direction: column;
			font-size: 100%;
			justify-content: start;
			align-items: center;
			// border: 1px solid red;
		}
	}

	.left-column {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		// border: 1px solid red;

		.row {
			align-items: center;
			display: flex;
			// border: 2px solid red;
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
		align-items: center;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.bold {
		font-weight: bold;
	}

	// .buttons {
	// 	display: none;
	// }

	button {
		height: 2rem;
		font-size: 0.5rem;
		// border: none;
		box-shadow: none;
		color: black;
		width: 100%;

		&.wide50 {
			border: 2px solid #333;
			float: right;
			font-size: 100%;
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
			font-size: 100%;
			font-weight: 500;
			margin-inline: 0.25rem;
			padding: 1.25rem;
			// padding-inline: 2.5rem;
			vertical-align: middle;
			width: 75%;
		}
		&.wide {
			border: 2px solid #333;
			// color: black;
			float: right;
			font-size: 100%;
			font-weight: 500;
			height: 2.75rem;
			margin-inline: 0.25rem;
			padding: 1.375rem;
			padding-inline: 2.5rem;
			vertical-align: middle;
			width: 100%;
		}

		&.reset {
			background-color: white;
			color: black;
			align-self: end;
			font-weight: 500;
			// margin-block-start: 0.5rem;
			margin-inline: 0.25rem;
		}
	}

	.scrollable-list {
		background-color: white;
		border: 2px solid #333;
		border-radius: 0.25rem;
		max-height: 40vh;
		overflow-y: auto;
		padding: 0.5rem;
		margin-top: 0.25rem;
		margin-top: 0;
		width: 100%;
	}

	a.how-to-play {
		color: var(--color-text);
		display: flex;
		justify-content: center;
		align-items: center;
		align-self: center;

		&:hover {
			color: black;
			text-decoration: none;
			font-weight: 500;
		}

		img {
			display: inline;
			width: 1.5rem;
			margin-inline-end: 0.5rem;
		}
	}
	// .show {
	// 	display: block;
	// }
	// .hide {
	// 	border: 0;
	// 	clip: rect(0 0 0 0);
	// 	height: auto;
	// 	margin: 0;
	// 	overflow: hidden;
	// 	padding: 0;
	// 	position: absolute;
	// 	width: 1px;
	// 	white-space: nowrap;
	// 	// transition: all 3.5s;
	// }

	.show {
		transition: opacity 1s ease-out;
		opacity: 1;
		height: auto;
	}
	.hide {
		transition: opacity 1s ease-out;
		opacity: 0;
		height: 0;
		overflow: hidden;
	}

	// .how-to-play::before {
	// 	content: 'i';
	// 	display: inline-block;
	// 	// font-size: 0.8em;
	// 	font-weight: 900;
	// 	width: 2em;
	// 	height: 2em;
	// 	padding: 0.2em;
	// 	line-height: 1;
	// 	border: 1.5px solid black;
	// 	border-radius: 50%;
	// 	text-align: center;
	// 	margin: 0 0.5em 0 0;
	// 	position: relative;
	// 	top: -0.05em;
	// }

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
