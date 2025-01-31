<script>
	let viewCalc = true;
	let selectedOption = 'numbers';
	let pv = '87';
	let dv = '33';
	let popnSize = '100000';
	let deathsSize = '100';
	let numberVaccinated;
	let numberUnvaccinated;
	let vaccinatedDeaths;
	let unvaccinatedDeaths;
	let precision = 5;

	let result;

	const options = [
		{ value: 'percentages', label: 'Percentages' },
		{ value: 'numbers', label: 'Percentages with numbers' }
	];

	// function percentageResult()) {
	// 	let result = ((100 - dv)/(100-pv)*pv/dv).toFixed(2)
	// 	return result
	// }
</script>

<div class="outer">
	<div class="wrapper">
		<h1>Vaccine Efficacy Calculator</h1>

		<div class="card">
			<h4>Percentages only? Or percentages with population numbers?</h4>
			<div class="radioGroup">
				{#each options as option}
					<label class="radio">
						<input
							type="radio"
							name="radioGroup"
							bind:group={selectedOption}
							value={option.value}
							checked={selectedOption === option.value}
							class="input"
						/>
						{option.label}
					</label>
				{/each}
			</div>

			{#if selectedOption !== 'percentages'}
				<blockquote>
					Note that population numbers are not required for the result but are useful to simplify
					the manual calculation below &mdash; and to avoid the use of algebra for those who have
					been out of school for a while!
				</blockquote>
				<p></p>
			{/if}

			<section class="form">
				{#if selectedOption === 'percentages'}
					<div class="label">Percentage of the population vaccinated</div>
					<div class="input">
						<input type="number" id="popVaccinated" bind:value={pv} />
						<span>%</span>
					</div>
					<div class="label">Percentage of deaths that were vaccinated</div>
					<div class="input">
						<input type="number" id="deathsVaccinated" bind:value={dv} />
						<span>%</span>
					</div>
				{:else}
					<div class="label">Size of the population</div>
					<div class="input">
						<input type="number" id="popVaccinated" bind:value={popnSize} />
					</div>
					<div class="label">Percentage of the population vaccinated</div>
					<div class="input">
						<input
							type="number"
							id="popVaccinated"
							bind:value={pv}
							on:input={() => {
								if (pv >= 100) {
									pv = 99;
								}
							}}
						/>
						<span>%</span>
					</div>

					<div class="label">Number of deaths</div>
					<div class="input">
						<input type="number" id="deathsVaccinated" bind:value={deathsSize} />
					</div>
					<div class="label">Percentage of deaths that were vaccinated</div>
					<div class="input">
						<input
							type="number"
							id="deathsVaccinated"
							bind:value={dv}
							on:input={() => {
								if (dv >= 100) {
									dv = 99;
								}
							}}
						/>
						<span>%</span>
					</div>
				{/if}
			</section>

			{#if selectedOption === 'percentages'}
				<div class="resultbox">
					{#if pv && dv && Number(pv) < 100 && Number(dv) < 100}Death for the unvaccinated is <span
							class="result"
						>
							{Number(
								(((100 - Number(dv)) * Number(pv)) / (100 - Number(pv)) / Number(dv)).toFixed(2)
							)}
						</span>
						times as likely as for the vaccinated.
					{/if}
				</div>
			{:else}
				<div class="resultbox">
					{#if pv && dv && Number(pv) < 100 && Number(dv) < 100}Death for the unvaccinated is <span
							class="result"
						>
							{Number(
								(((100 - Number(dv)) * Number(pv)) / (100 - Number(pv)) / Number(dv)).toPrecision(
									precision - 1
								)
							)}
						</span>
						times more likely than for the vaccinated.
					{/if}
				</div>
			{/if}
		</div>

		{#if selectedOption === 'percentages' && pv && dv && Number(pv) < 100 && Number(dv) < 100}
			<!-- <div class="card">percentages</div> -->
			<div>&nbsp;</div>
		{:else if pv && dv && Number(pv) < 100 && Number(dv) < 100 && popnSize && deathsSize}
			<div class="card calc">
				<h4>Calculations</h4>
				<ul>
					<li>
						{Number(Number(pv).toPrecision(precision))}% of the population of {popnSize} are vaccinated.
						<br />
						That is,
						<strong>
							{(numberVaccinated = (Number(pv) / 100) * Number(popnSize)).toPrecision(precision)} are
							vaccinated.
						</strong>
					</li>
					<li>
						100% - {Number(Number(pv).toPrecision(precision))}% = {Number(
							(numberUnvaccinated = 100 - pv).toPrecision(precision)
						)}% of the population of {popnSize}
						are not vaccinated.
						<br />
						That is,
						<strong>
							{(numberUnvaccinated = Number(
								(((100 - pv) / 100) * popnSize).toPrecision(precision)
							))}
							{numberUnvaccinated === 1 ? 'is' : 'are'} NOT vaccinated.
						</strong>
					</li>
					<li>
						{dv}% of the {deathsSize} deaths were vaccinated.
						<br />
						That is,
						<strong>
							{(vaccinatedDeaths = (dv / 100) * deathsSize)} who died were vaccinated.
						</strong>
					</li>
					<li>
						100% - {Number(Number(dv).toPrecision(precision))}% = {(unvaccinatedDeaths = 100 - dv)}%
						of the {Number(deathsSize)} deaths were not vaccinated.
						<br />
						That is,
						<strong>
							{((100 - dv) / 100) * deathsSize} who died were NOT vaccinated.
						</strong>
					</li>
					<li>
						{unvaccinatedDeaths} unvaccinated died out of the unvaccinated {numberUnvaccinated}.
						<br />
						That is,
						<strong>
							1 in {Number((numberUnvaccinated / unvaccinatedDeaths).toPrecision(precision))} unvaccinated
							died.
						</strong>
					</li>
					<li>
						{vaccinatedDeaths} vaccinated died out of the vaccinated {numberVaccinated}.
						<br />
						That is,
						<strong>
							1 in {Number((numberVaccinated / vaccinatedDeaths).toPrecision(precision))} vaccinated
							died.
						</strong>
					</li>
				</ul>
				<div class="resultbox">
					So, unvaccinated are {Number(numberVaccinated / vaccinatedDeaths).toPrecision(
						precision
					)}/{Number(numberUnvaccinated / unvaccinatedDeaths).toPrecision(precision)} =
					<span class="result"
						>{(
							(numberVaccinated / vaccinatedDeaths / numberUnvaccinated) *
							unvaccinatedDeaths
						).toPrecision(precision - 1)}</span
					> times more likely to die than are vaccinated for these inputs.
				</div>
			</div>
		{/if}
	</div>
</div>

<style lang="scss">
	.result {
		color: white;
		background: #0a0;
		border-radius: var(--radius-2);
		font-size: 1.5rem;
		padding-inline: 1rem;
		padding-block: 0.25rem;
	}
	.resultbox {
		height: 2rem;
		margin-block: 1rem;
		font-family: inherit;
		// font-size: 1.55rem;
		font-style: italic;
		font-weight: bold;
	}

	section.form {
		display: grid;
		grid-template-columns: 3fr 1fr;
		row-gap: 0.5rem;
		column-gap: 1rem;
	}
	.form .input {
		justify-self: start;
		align-self: center;
	}
	.form .label {
		justify-self: end;
		align-self: center;
	}
	.outer {
		background-image: var(--gradient-19);
		margin: 0;
		// padding: 1rem;
		min-height: 100vh;
		width: 100vw;
		// overflow-x: none;
	}
	.wrapper {
		display: flex;
		justify-content: start;
		align-items: center;
		flex-direction: column;
		margin-inline: auto;
		text-align: center;
		max-width: 50rem;
		font-size: var(--font-size-fluid-3);
	}

	.wrapper h1 {
		background-color: inherit;
		border: none;
		box-shadow: none;
		color: #0a0;
		font-family: 'Shitake', cursive;
		font-size: var(--font-size-8);
		font-weight: bold;
		letter-spacing: 0.25rem;
		padding-inline: 2rem;
		margin: 0;
		-webkit-text-stroke: black 0.5px;
		word-spacing: 0;
	}

	.card {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background: white;
		border: var(--border-size-3) solid #080;
		border-radius: var(--radius-3);
		box-shadow: var(--shadow-6);
		margin: 1rem;
		padding: 1rem;
		padding-block-end: 2rem;
		font-family: 'AlkesRgIt', sans-serif;
		font-size: var(--font-size-4);
		font-style: italic;

		& h4 {
			// background: pink;
			font-size: var(--font-size-4);
			margin-block-end: 1rem;
		}

		.resultbox {
			// background: pink;
			width: 80%;
			margin-top: 2rem;
		}

		& + .calc {
			// width: 100%;
			ul {
				font-size: 1.5rem;
				list-style-type: none;
				margin-inline: auto;
				padding-inline-start: 0;
				text-align: left;
				width: 90%;

				li {
					margin-block: 1rem;
				}
			}
		}
	}

	.radioGroup {
		display: flex;
		justify-content: center;
		align-items: center;
		// background: yellow;

		label.radio {
			cursor: pointer;
			display: inline-block;
			margin-block: 1rem;
			margin-inline: 2rem;
			input {
				vertical-align: middle;

				&:hover {
					background: #aaa;
					// color: white;
				}
				&:checked {
					background: #080;
					// color: white;
				}
			}
		}
	}
	// hide default styling
	input[type='radio'] {
		appearance: none;
		width: 20px;
		height: 20px;
		border: 2px solid #333;
		border-radius: 50%;
		outline: none;
	}

	input[type='radio']:before {
		content: '';
		display: block;
		width: 60%;
		border-radius: 50%;
	}

	input[type='radio']:checked:before {
		background: #080;
		border-width: 4px;
	}

	input[type='number'] {
		background-color: #eee;
		border: 1px solid #333;
		// box-shadow: var(--shadow-6);
		width: 7rem;
	}

	input[type='number']::-webkit-outer-spin-button,
	input[type='number']::-webkit-inner-spin-button {
		-webkit-appearance: none;
		display: none;
	}

	blockquote {
		padding-inline: 2rem;
		background-color: #eee;
		// border: 1px solid #333;
		// border-left: 5px solid #080;
		// border-radius: 5px;
		color: #080;
		margin-bottom: 1.5rem;
		text-align: left;
	}

	@media (max-width: 600px) {
		.outer {
			padding: 0.5rem;
			padding-inline: 0;
		}
		.wrapper {
			padding: var(--size-1);
		}
		.wrapper h1 {
			font-family: 'Shitake';
			font-size: var(--font-size-5);
		}

		.card {
			border-width: var(--border-size-3);
			font-size: 1.25rem;
			margin-inline: auto;
			margin-block-start: 1rem;
			padding-block: 1rem;
			min-width: 0;
			padding-inline: 0.5rem;
		}
		.calc {
			width: 85%;
			margin-inline: auto;
		}
		/* .resultbox {
			font-size: 120%;
		} */
		.radioGroup {
			padding-block-start: 0;
		}

		.result {
			font-size: 1.25rem;
			padding: 0.5rem;
			padding-block: 0.25rem;
		}
	}
</style>
