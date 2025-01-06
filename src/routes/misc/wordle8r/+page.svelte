<script>
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { words } from './words.js';
	import {
		moveCursorToEnd,
		handleKeyDown,
		handleInput,
		isRowEmpty,
		isRowComplete,
		doesWordExist,
		areAllCurrentRowStatusesSet,
		setStatus,
		getStatusString
	} from './functions.js';
	import '$lib/css/app.css';
	import { get } from 'svelte/store';

	let currentRow = $state(0);
	let grid = $state(Array.from({ length: 6 }, () => Array(5).fill('')));
	let statuses = $state(Array.from({ length: 6 }, () => Array(5).fill('')));
	let wordExists = $state(Array(6).fill(false));

	onMount(() => {
		const firstInput = document.querySelector(`input[name="00"]`);
		if (firstInput) {
			firstInput.focus();
		}
	});
</script>

<div class="container pt-4">
	<div class="left-column">
		<div class="grid">
			{#each Array.from(Array(6).keys()) as row (row)}
				<div class:hide={row > currentRow} class:show={row <= currentRow}>
					<div class="row mt-4">
						{#each Array.from(Array(5).keys()) as col (col)}
							<div class="cell">
								<div
									class="letter"
									class:exact={statuses[row][col] === 'x'}
									class:near={statuses[row][col] === 'c'}
									class:none={statuses[row][col] === 'o'}
								>
									<input
										autocomplete="off"
										name={`${row}${col}`}
										type="text"
										maxlength="1"
										onclick={moveCursorToEnd(row, col)}
										oninput={(event) => handleInput(event, grid, row, col)}
										onkeydown={(event) => handleKeyDown(event, grid, row, col)}
									/>
								</div>

								{#if isRowComplete(grid, row) && doesWordExist(grid, row, words) && !areAllCurrentRowStatusesSet(grid, row, statuses)}
									<div class="buttons" transition:fade>
										<button
											class="exact mt-2"
											onclick={() => setStatus(statuses, row, col, 'x')}
											aria-label="Set to exact"
										></button>
										<button
											class="near mt-2"
											onclick={() => setStatus(statuses, row, col, 'c')}
											aria-label="Set to close"
										></button>
										<button
											class="none mt-2"
											onclick={() => setStatus(statuses, row, col, 'o')}
											aria-label="Set to absent"
										></button>
									</div>
								{/if}
							</div>
						{/each}

						{#if row < 5}
							<button onclick={() => (currentRow = row + 1)}>Next</button>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	</div>
	<div class="right-column"><div class="mt-4">{getStatusString(statuses, currentRow)}</div></div>
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
			border: 3px solid #aaa;
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
				border: 3px solid #090;
				outline: none;
			}
		}

		button {
			height: 2rem;
			border: none;
			box-shadow: none;
			width: 100%;
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
	}
	.show {
		display: block;
	}
	.hide {
		display: none;
	}
</style>
