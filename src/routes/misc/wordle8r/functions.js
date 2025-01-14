// if clicking on an occupied input, move the cursor to the right of the character so that backspace works as expected
export function moveCursorToEnd(row, col) {
	return () => {
		const input = document.querySelector(`input[name="${row}${col}"]`);
		// input.focus();
		input.selectionStart = input.selectionEnd = input.value.length;
	};
}
// restrict inputs to only allow letters and backspace
export function handleKeyDown(event, grid, row, col, statuses) {
	const key = event.key;

	if (!/^[a-zA-Z]$/.test(key) && key !== 'Backspace') {
		event.preventDefault();
	}

	if (key === 'Backspace') {
		if (grid[row][col] === '') {
			// Move focus to the previous input if backspace is pressed and the current input is empty
			if (col > 0) {
				let prevInput = document.querySelector(`input[name="${row}${col - 1}"]`);
				prevInput.focus();
			} else if (!isRowEmpty(grid, row)) {
				for (let i = 4; i >= 0; i--) {
					if (grid[row][i] !== '') {
						let prevInput = document.querySelector(`input[name="${row}${i}"]`);
						prevInput.focus();
						break;
					}
				}
			}
		}
		// when backspacing, clear all the status entries for the row
		statuses[row].fill('');
		// console.log(statuses[row]);
	}
}

export function handleInput(event, grid, row, col) {
	const value = event.target.value.toLowerCase();
	grid[row][col] = value;
	event.target.value = event.target.value.toLowerCase();

	// automatically move to the next input when the current input is filled
	for (let i = 0; i < 5; i++) {
		// if next input is empty, move to it. Otherwise, move to the next empty input, wrapping around to the beginning of the row if necessary
		if (grid[row][(col + i) % 5] === '') {
			let nextInput = document.querySelector(`input[name="${row}${(col + i) % 5}"]`);
			nextInput.focus();
			return;
		}
	}
}

export function isRowEmpty(grid, row) {
	return grid[row].every((cell) => cell === '');
}

export function isRowComplete(grid, row) {
	return grid[row].every((cell) => cell !== '');
}

export function doesWordExist(grid, row, words) {
	const word = grid[row].join('');
	return words.has(word);
}

export function areAllCurrentRowStatusesSet(statuses, row) {
	return statuses[row].every((cell) => cell !== '');
}

export function setAllStatuses(statuses, row, status) {
	statuses[row].fill(status);
}

export function getStatusString(statuses, row) {
	return statuses[row].join('');
}

export function getGuess(grid, row) {
	let guess = grid[row].join('');
	return guess;
}

export function colorise(guess, target) {
	const [g0, g1, g2, g3, g4] = guess;
	const [t0, t1, t2, t3, t4] = target;
	let [c0, c1, c2, c3, c4] = ['o', 'o', 'o', 'o', 'o'];
	let unmatched = {};

	if (t0 === g0) {
		c0 = 'x';
	} else {
		unmatched[t0] = (unmatched[t0] || 0) + 1;
	}
	if (t1 === g1) {
		c1 = 'x';
	} else {
		unmatched[t1] = (unmatched[t1] || 0) + 1;
	}
	if (t2 === g2) {
		c2 = 'x';
	} else {
		unmatched[t2] = (unmatched[t2] || 0) + 1;
	}
	if (t3 === g3) {
		c3 = 'x';
	} else {
		unmatched[t3] = (unmatched[t3] || 0) + 1;
	}
	if (t4 === g4) {
		c4 = 'x';
	} else {
		unmatched[t4] = (unmatched[t4] || 0) + 1;
	}

	if (unmatched[g0] && c0 !== 'x') {
		c0 = 'n';
		unmatched[g0] -= 1;
	}
	if (unmatched[g1] && c1 !== 'x') {
		c1 = 'n';
		unmatched[g1] -= 1;
	}
	if (unmatched[g2] && c2 !== 'x') {
		c2 = 'n';
		unmatched[g2] -= 1;
	}
	if (unmatched[g3] && c3 !== 'x') {
		c3 = 'n';
		unmatched[g3] -= 1;
	}
	if (unmatched[g4] && c4 !== 'x') {
		c4 = 'n';
		unmatched[g4] -= 1;
	}

	return c0 + c1 + c2 + c3 + c4;
}

export function setPossibles(possibles, row, guess, status) {
	possibles[row].push({ guess, status });
}

// export function advanceRow(currentRow) {
// 	currentRow++;
// 	tick().then(() => {
// 		const firstCol = document.querySelector(`input[name="${currentRow}0"]`);
// 		if (firstCol) {
// 			firstCol.focus();
// 		}
// 	});
// }

export function advanceRow(currentRow) {
	currentRow++;
	tick().then(() => {
		const firstCol = document.querySelector(`input[name="${currentRow}0"]`);
		if (firstCol) {
			firstCol.focus();
		}
	});
	return currentRow;
}
