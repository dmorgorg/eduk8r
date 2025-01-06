// if clicking on an occupied input, move the cursor to the right of the character so that backspace works as expected
export function moveCursorToEnd(row, col) {
	return () => {
		const input = document.querySelector(`input[name="${row}${col}"]`);
		// input.focus();
		input.selectionStart = input.selectionEnd = input.value.length;
	};
}
// restrict inputs to only allow letters and backspace
export function handleKeyDown(event, grid, row, col) {
	const key = event.key;
	if (!/^[a-zA-Z]$/.test(key) && key !== 'Backspace') {
		event.preventDefault();
	}

	if (key === 'Backspace' && grid[row][col] === '') {
		// Move focus to the previous input if backspace is pressed and the current input is empty
		if (col > 0) {
			let prevInput = document.querySelector(`input[name="${row}${col - 1}"]`);
			prevInput.focus();
		} else if (!isRowEmpty(grid, isRowEmpty)) {
			for (let i = 4; i >= 0; i--) {
				if (grid[row][i] !== '') {
					let prevInput = document.querySelector(`input[name="${row}${i}"]`);
					prevInput.focus();
					break;
				}
			}
		}
		// when backspacing, clear all the status entries for the row
		status[row].fill('');
	}
}

export function handleInput(event, grid, row, col) {
	const value = event.target.value.toLowerCase();
	grid[row][col] = value;

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

export function areAllCurrentRowStatusesSet(grid, row, statuses) {
	return statuses.every((row) => row.every((cell) => cell !== ''));
}

export function setStatus(statuses, row, col, status) {
	statuses[row][col] = status;
}

export function setAllStatuses(statuses, row, status) {
	statuses[row].fill(status);
}

export function getStatusString(statuses, row) {
	return statuses[row].join('');
}
