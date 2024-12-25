const api_key = '725eac908b66401788061b28123ae584';
const url = `https://openexchangerates.org/api/latest.json?app_id=${api_key}`;

const resultHolder = document.getElementById('result-holder');

const fromOptions = document.getElementById('from-options');
const toOptions = document.getElementById('to-options');
const fromOptionsList = document.getElementById('from-options-list');
const toOptionsList = document.getElementById('to-options-list');
const fromImage = document.getElementById('from-image');
const toImage = document.getElementById('to-image');

// Default currencies
const defaultFromCurrency = 'USD';
const defaultToCurrency = 'ZMW';

const timeStamp = document.getElementById('time-stamp');
const date = new Date();

async function fetchData() {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const dataRates = data.rates;

        // Populate the from and to options lists
        Object.keys(dataRates).forEach(currency => {
            const optionFrom = document.createElement('option');
            optionFrom.value = currency;
            optionFrom.textContent = currency;

            const optionTo = document.createElement('option');
            optionTo.value = currency;
            optionTo.textContent = currency;

            fromOptionsList.appendChild(optionFrom);
            toOptionsList.appendChild(optionTo);

            // Set flag images for the "From" and "To" currencies based on the currency code
            if (currency === defaultFromCurrency) {
                const setCurrency = currency.split('').slice(0, 2).join('');
                fromImage.setAttribute('src', `https://flagsapi.com/${setCurrency}/flat/24.png`);
            }

            if (currency === defaultToCurrency) {
                const setCurrency = currency.split('').slice(0, 2).join('');
                toImage.setAttribute('src', `https://flagsapi.com/${setCurrency}/flat/24.png`);
            }
        });

        // Set default values for the input fields
        fromOptions.value = defaultFromCurrency;
        toOptions.value = defaultToCurrency;

    } catch (error) {
        alert(error.message);
    }
}

// Event listener for the conversion
document.getElementById('amount').addEventListener('keyup', async () => {
    const amount = document.getElementById('amount').value;
    const fromCurrency = fromOptions.value;
    const toCurrency = toOptions.value;

    try {
        const response = await fetch(url);
        const data = await response.json();

        const conversionRateFrom = data.rates[fromCurrency];
        const conversionRateTo = data.rates[toCurrency];

        const result = (amount * conversionRateTo) / conversionRateFrom;
        resultHolder.textContent = `${amount} ${fromCurrency} = ${result.toFixed(2)} ${toCurrency}`
        timeStamp.textContent = 'Conversion Time: ' + date;
    } catch (error) {
        resultHolder.textContent = 'Error during conversion: ' + error.message;
    }
});

// Fetch the exchange rates and populate the dropdowns when the page loads
fetchData();

// Update the flag images when the user changes the selected currency
fromOptions.addEventListener('input', function () {
    const selectedCurrency = fromOptions.value;
    const setCurrency = selectedCurrency.split('').slice(0, 2).join('');
    fromImage.setAttribute('src', `https://flagsapi.com/${setCurrency}/flat/24.png`);
});

toOptions.addEventListener('input', function () {
    const selectedCurrency = toOptions.value;
    const setCurrency = selectedCurrency.split('').slice(0, 2).join('');
    toImage.setAttribute('src', `https://flagsapi.com/${setCurrency}/flat/24.png`);
});