document.addEventListener('DOMContentLoaded', () => {
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

    async function fetchData() {
        try {
            const response = await fetch(url);

            if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);

            const data = await response.json();
            const dataRates = data.rates;

            // Populate the from and to options lists with currencies
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
            resultHolder.textContent = error.message;
        }
    }
    
    // Timeout variable is used to delay the output of the conversion to avoid unnecessary fetch requests during user input
    let timeout;
    const amountInput = document.getElementById('amount');

    async function runConversion() {
        clearTimeout(timeout);
        const amount = amountInput.value;
        const fromCurrency = fromOptions.value;
        const toCurrency = toOptions.value;

        const timeStamp = document.getElementById('time-stamp');
        const date = new Date();

        timeout = setTimeout(async () => {
            try {
                const response = await fetch(url); 
                const data = await response.json();

                if (!data.rates) throw new Error('Rates data is not available');

                const conversionRateFrom = data.rates[fromCurrency];
                const conversionRateTo = data.rates[toCurrency];
                const result = (amount * conversionRateTo) / conversionRateFrom;

                resultHolder.textContent = `${amount} ${fromCurrency} = ${result.toFixed(2)} ${toCurrency}`;
                timeStamp.textContent = 'Conversion Time: ' + date;
            } catch (error) {
                resultHolder.textContent = error.message;
            }
        }, 500);
    }

    // EventListeners to trigger conversion when their input in the input fields
    amountInput.addEventListener('input', runConversion);

    fromOptions.addEventListener('input', () => {
        const selectedCurrency = fromOptions.value;
        const setCurrency = selectedCurrency.split('').slice(0, 2).join('');
        fromImage.setAttribute('src', `https://flagsapi.com/${setCurrency}/flat/24.png`);
        runConversion();  
    });

    toOptions.addEventListener('input', () => {
        const selectedCurrency = toOptions.value;
        const setCurrency = selectedCurrency.split('').slice(0, 2).join('');
        toImage.setAttribute('src', `https://flagsapi.com/${setCurrency}/flat/24.png`);
        runConversion();
    });

    // This function is executed to fetch the exchange rate data and populate the options lists
    fetchData();

    // Load initial input values when the page loads
    runConversion()
});
