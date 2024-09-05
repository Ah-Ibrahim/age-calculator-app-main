'use strict';

const inputs = document.querySelectorAll('input');
const [inputDay, inputMonth, inputYear] = inputs;
const outputs = document.querySelectorAll('.output');
const [outputYear, outputMonth, outputDay] = outputs;
const btn = document.querySelector('.btn');

const inputDate = {
	day: 0,
	month: 0,
	year: 0,
};
let userDate, currentDate;
let error = false;

const showError = function () {
	error = true;

	for (let input of inputs) input.classList.add('error');
};

const resetErrors = function () {
	error = false;

	for (let input of inputs) {
		input.classList.remove('error');
		input.classList.remove('error--invalid');
		input.classList.remove('error--empty');
	}

	for (let output of outputs) {
		output.textContent = '- -';
	}
};

const clearInputs = function () {
	for (let input of inputs) {
		input.value = '';
	}
};

const clamp = function (value, min, max) {
	if (value > max) {
		return max;
	} else if (value < min) {
		return min;
	}

	return value;
};

const isLeapYear = function (year) {
	const yearNum = Number(year);

	return (yearNum % 4 === 0 && yearNum % 100 !== 0) || yearNum % 400 === 0;
};

const updateOutput = function (yearDiff, monthDiff, dayDiff) {
	outputYear.textContent = yearDiff;
	outputMonth.textContent = monthDiff;
	outputDay.textContent = dayDiff;
};

const calcAge = function () {
	const [userDay, userMonth, userYear] = [userDate.getDate(), userDate.getMonth() + 1, userDate.getFullYear()];
	const [currentDay, currentMonth, currentYear] = [
		currentDate.getDate(),
		currentDate.getMonth() + 1,
		currentDate.getFullYear(),
	];

	const daysInMonthForUserYear = [31, isLeapYear(userYear) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

	let yearDiff = currentYear - userYear;
	let monthDiff;
	let dayDiff;

	if (currentMonth < userMonth) {
		yearDiff--;
		monthDiff = 12 - userMonth + currentMonth;
	} else {
		monthDiff = currentMonth - userMonth;
	}

	if ((currentMonth < userMonth && currentDay <= userDay) || currentDay < userDay) {
		if (--monthDiff < 0) {
			yearDiff--;
			monthDiff = 11;
		}

		dayDiff = daysInMonthForUserYear[userMonth - 1] - userDay + currentDay;
	} else {
		dayDiff = currentDay - userDay;
	}

	return [yearDiff, monthDiff, dayDiff];
};

const validateDate = function (date) {
	const daysInMonth = [31, isLeapYear(date.year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	const currentYear = String(new Date().getFullYear());

	if (date.day === '') {
		showError();
		inputDay.classList.add('error--empty');
	} else if (
		!(
			!isNaN(+date.month) &&
			date.day.length == 2 &&
			date.day >= '01' &&
			date.day <= daysInMonth[clamp(+date.month - 1, 0, 11)]
		)
	) {
		showError();
		inputDay.classList.add('error--invalid');
	}

	if (date.month === '') {
		showError();
		inputMonth.classList.add('error--empty');
	} else if (!(date.month.length == 2 && date.month >= '01' && date.month <= '12')) {
		showError();
		inputMonth.classList.add('error--invalid');
	}

	if (date.year === '') {
		showError();
		inputYear.classList.add('error--empty');
	} else if (!(date.year.length == 4 && date.year >= '0000' && date.year <= currentYear)) {
		showError();
		inputYear.classList.add('error--invalid');
	}

	if (error) {
		return false;
	}

	const dateString = `${date.year}-${date.month}-${date.day}`;
	userDate = new Date(dateString);
	currentDate = new Date();

	if (userDate > currentDate) {
		showError();
		alert('Please do not enter a future date!');
		return false;
	}

	return true;
};

const parseDate = function () {
	resetErrors();

	inputDate.day = inputDay.value;
	inputDate.month = inputMonth.value;
	inputDate.year = inputYear.value;

	if (validateDate(inputDate)) {
		updateOutput(...calcAge());
	}
};

const autoSwitch = function (input, nextInput) {
	if (input.value.length === input.maxLength && validateInputNumbersOnly(input)) {
		nextInput.focus();
	}
};

const validateInputNumbersOnly = function (input) {
	if (input.value === input.value.replace(/[^0-9]/g, '')) {
		return true;
	}

	input.value = input.value.replace(/[^0-9]/g, '');
	return false;
};

btn.addEventListener('click', parseDate);
inputDay.addEventListener('input', function () {
	validateInputNumbersOnly(this);
	autoSwitch(this, inputMonth);
});
inputMonth.addEventListener('input', function () {
	validateInputNumbersOnly(this);
	autoSwitch(this, inputYear);
});

inputYear.addEventListener('input', function () {
	validateInputNumbersOnly(this);
});
document.addEventListener('keydown', (event) => {
	if (event.key === 'Enter') {
		parseDate();
	} else if (event.key === 'Escape') {
		resetErrors();
		clearInputs();
	}
});
