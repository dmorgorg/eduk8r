<script>
	let viewCalc = true;
	let selectedOption = 'percentages';
	let pv = '87';
	let dv = '33';
	let popnSize = '100000';
	let deathsSize = '100';
	let numberVaccinated;
	let numberUnvaccinated;
	let vaccinatedDeaths;
	let unvaccinatedDeaths;

	let result;

	const options = [
		{ value: 'percentages', label: 'Percentages' },
		{ value: 'numbers', label: 'Percentages and Numbers' }
	];

	// function percentageResult()) {
	// 	let result = ((100 - dv)/(100-pv)*pv/dv).toFixed(2)
	// 	return result
	// }
</script>

<div class="outer">
	<div class="wrapper">
		<h1 class="card">Vaccine Efficacy Calculator</h1>

		<div class="card">
			<div class="radioGroup">
				<h4>Percentages only or percentages and population numbers?</h4>
				{#each options as option}
					<label class="radio">
						<input
							type="radio"
							name="radioGroup"
							bind:group={selectedOption}
							value={option.value}
							checked={selectedOption === option.value}
							style="vertical-align: top"
						/>
						{option.label}
					</label>
				{/each}
			</div>

			{#if selectedOption !== 'percentages'}
				<div style="padding-inline: 2rem; color:#0a0;">
					(
					<strong>Note</strong>
					that population numbers are not required for the result but are useful to simplify the manual
					calculation below &mdash; and to avoid the use of algebra for those who have been out of school
					for a while!)
				</div>
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
						<input type="number" id="popVaccinated" bind:value={pv} />
						<span>%</span>
					</div>

					<div class="label">Number of deaths</div>
					<div class="input">
						<input type="number" id="deathsVaccinated" bind:value={deathsSize} />
					</div>
					<div class="label">Percentage of deaths that were vaccinated</div>
					<div class="input">
						<input type="number" id="deathsVaccinated" bind:value={dv} />
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
								(((100 - Number(dv)) * Number(pv)) / (100 - Number(pv)) / Number(dv)).toFixed(2)
							)}
						</span>
						times more likely than for the vaccinated.
					{/if}
				</div>
			{/if}
		</div>

		{#if selectedOption === 'percentages' && pv && dv && Number(pv) < 100 && Number(dv) < 100}
			<div class="card">percentages</div>
		{:else if pv && dv && Number(pv) < 100 && Number(dv) < 100 && popnSize && deathsSize}
			<div class="card calc">
				<h4>Calculations</h4>
				<ul>
					<li>
						{pv}% of the population of {popnSize} are vaccinated.
						<br />
						That is,
						<strong>
							{(numberVaccinated = (Number(pv) / 100) * Number(popnSize))} are vaccinated.
						</strong>
					</li>
					<li>
						100% - {pv}% = {(numberUnvaccinated = 100 - Number(pv))}% of the population of {popnSize}
						are not vaccinated.
						<br />
						That is,
						<strong>
							{(numberUnvaccinated = ((100 - Number(pv)) / 100) * Number(popnSize))} are NOT vaccinated.
						</strong>
					</li>
					<li>
						{dv}% of the {deathsSize} deaths were vaccinated.
						<br />
						That is,
						<strong>
							{(vaccinatedDeaths = (Number(dv) / 100) * Number(deathsSize))} who died were vaccinated.
						</strong>
					</li>
					<li>
						100% - {dv}% = {(unvaccinatedDeaths = 100 - Number(dv))}% of the {Number(deathsSize)} deaths
						were not vaccinated.
						<br />
						That is,
						<strong>
							{((100 - Number(dv)) / 100) * Number(deathsSize)} who died were NOT vaccinated.
						</strong>
					</li>
					<li>
						{unvaccinatedDeaths} unvaccinated died out of the unvaccinated {numberUnvaccinated}.
						<br />
						That is,
						<strong>
							1 in {Number(numberUnvaccinated / unvaccinatedDeaths).toFixed(2)} unvaccinated died.
						</strong>
					</li>
					<li>
						{vaccinatedDeaths} vaccinated died out of the vaccinated {numberVaccinated}.
						<br />
						That is,
						<strong>
							1 in {Number(numberVaccinated / vaccinatedDeaths).toFixed(2)} vaccinated died.
						</strong>
					</li>
				</ul>
				So, unvaccinated are {Number(numberVaccinated / vaccinatedDeaths).toFixed(2)}/{Number(
					numberUnvaccinated / unvaccinatedDeaths
				).toFixed(2)} = {(
					(numberVaccinated / vaccinatedDeaths / numberUnvaccinated) *
					unvaccinatedDeaths
				).toFixed(2)} times more likely to die than are vaccinated for these inputs.
			</div>
		{/if}
	</div>
</div>

<style>
	.calc h4 {
		margin: 0;
	}
	.calc ul {
		list-style-type: none;
		padding-inline-start: 0;
		text-align: left;
	}
	.calc ul li {
		margin-block-end: 1rem;
	}
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
		font-size: 1.25rem;
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
		padding: 1rem;
		min-height: 100vh;
	}
	.wrapper {
		display: flex;
		justify-content: start;
		align-items: center;
		flex-direction: column;
		margin-inline: auto;
		text-align: center;
		max-width: 1024px;
		padding: var(--size-3);
		max-width: 50rem;
		font-size: var(--font-size-fluid-0);
	}

	.wrapper h1.card {
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
		font-family: 'AlkesRgIt', sans-serif;
		font-size: var(--font-size-3);
		font-style: italic;
	}

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
		height: 60%;
		margin: 20% auto;
		border-radius: 50%;
	}

	input[type='radio']:checked:before {
		background: #080;
	}
	label.radio {
		display: inline-block;
		margin-block-end: 2rem;
		margin-inline: 2rem;
	}

	input[type='number'] {
		width: 5rem;
	}

	input[type='number']::-webkit-outer-spin-button,
	input[type='number']::-webkit-inner-spin-button {
		-webkit-appearance: none;
		display: none;
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
			font-family: 'Katherine Script', sans-serif;
			font-size: var(--font-size-2);
		}

		.card {
			border-width: var(--border-size-3);
			font-size: 100%;
			margin-inline: auto;
			margin-block-start: 0;
			min-width: 0;
			padding-inline: 0.5rem;
		}
		.calc {
			width: 85%;
			margin-inline: auto;
		}
		.resultbox {
			font-size: 120%;
		}
		.result {
			font-size: 1.25rem;
			padding: 0.5rem;
			padding-block: 0.25rem;
		}
	}
</style>
