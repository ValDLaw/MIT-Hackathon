document.getElementById('filterForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get form data
    const county = document.getElementById('county').value;
    const ethnicity = document.getElementById('ethnicity').value;
    const sentenceType = document.getElementById('sentence_type').value;

    // Build query string
    const queryParams = new URLSearchParams({
        county,
        ethnicity,
        sentence_type: sentenceType
    }).toString();

    // Fetch data from the backend
    const response = await fetch(`http://127.0.0.1:5004/filter?${queryParams}`);
    const data = await response.json();

    // Display results
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ''; // Clear previous results

    if (data.length === 0) {
        resultsDiv.innerHTML = '<p>No results found.</p>';
        return;
    }

    data.forEach(item => {
        const div = document.createElement('div');
        div.className = 'result';
        div.innerHTML = `
            <h3>Case Number: ${item.case_number}</h3>
            <p><strong>County:</strong> ${item.county}</p>
            <p><strong>Ethnicity:</strong> ${item.ethnicity}</p>
            <p><strong>Sentence Type:</strong> ${item.sentence_type}</p>
            <p><strong>Aggregate Sentence Time:</strong> ${item.aggregate_sentence_time}</p>
            <p><strong>Prior Commitments:</strong> ${item.prior_commitments.join(', ')}</p>
            <p><strong>Current Commitments:</strong> ${item.current_commitments.join(', ')}</p>
        `;
        resultsDiv.appendChild(div);
    });
});

const text = "California Resentencing Dataset Scores"; // Text to type
const speed = 100; // Typing speed in milliseconds

let index = 0;
function typeEffect() {
    const title = document.getElementById("typingTitle");
    title.textContent = text.slice(0, index);
    index++;
    if (index > text.length) {
        index = 0; // Reset for the loop
    }
    setTimeout(typeEffect, speed);
}

// Start the typing effect
typeEffect();


let currentPage = 1; // Track the current page

async function fetchData(filterType = '', filterValue = '', page = 1) {
    const queryParams = new URLSearchParams({
        filter_type: filterType,
        filter_value: filterValue,
        page: page
    }).toString();

    try {
        const response = await fetch(`http://127.0.0.1:5000/filter?${queryParams}`);
        const result = await response.json();

        renderTable(result.data, result.page, result.total_pages);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

function renderTable(data, page, totalPages) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ''; // Clear previous results

    if (!data.length) {
        resultsDiv.innerHTML = '<p>No results found.</p>';
        return;
    }

    const table = document.createElement('table');
    table.className = 'results-table';

    const headers = ['ID', 'Aggregate Sentence Months', 'Sentence Type', 'Eligible', 'Eligibility Score'];
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    data.forEach(record => {
        const row = document.createElement('tr');

        Object.values(record).forEach(value => {
            const td = document.createElement('td');
            td.textContent = value;
            row.appendChild(td);
        });

        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    resultsDiv.appendChild(table);

    renderPagination(page, totalPages);
}

function renderPagination(page, totalPages) {
    const resultsDiv = document.getElementById('results');
    const paginationDiv = document.createElement('div');
    paginationDiv.className = 'pagination';

    const prevButton = document.createElement('button');
    prevButton.textContent = 'Previous';
    prevButton.disabled = page === 1;
    prevButton.onclick = () => {
        currentPage--;
        fetchData(document.getElementById('filterType').value, document.getElementById('filterValue').value, currentPage);
    };

    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.disabled = page === totalPages;
    nextButton.onclick = () => {
        currentPage++;
        fetchData(document.getElementById('filterType').value, document.getElementById('filterValue').value, currentPage);
    };

    paginationDiv.appendChild(prevButton);
    paginationDiv.appendChild(nextButton);
    resultsDiv.appendChild(paginationDiv);
}

function updateFilterInput() {
    const filterType = document.getElementById('filterType').value;
    const container = document.getElementById('filterInputContainer');
    container.innerHTML = ''; // Clear previous input

    if (filterType === 'county') {
        const select = document.createElement('select');
        select.id = 'filterValue';
        select.name = 'filterValue';

        // Add options for California's 58 counties
        const counties = [
            'Alameda', 'Alpine', 'Amador', 'Butte', 'Calaveras', 'Colusa', 'Contra Costa',
            'Del Norte', 'El Dorado', 'Fresno', 'Glenn', 'Humboldt', 'Imperial', 'Inyo',
            'Kern', 'Kings', 'Lake', 'Lassen', 'Los Angeles', 'Madera', 'Marin', 'Mariposa',
            'Mendocino', 'Merced', 'Modoc', 'Mono', 'Monterey', 'Napa', 'Nevada', 'Orange',
            'Placer', 'Plumas', 'Riverside', 'Sacramento', 'San Benito', 'San Bernardino',
            'San Diego', 'San Francisco', 'San Joaquin', 'San Luis Obispo', 'San Mateo',
            'Santa Barbara', 'Santa Clara', 'Santa Cruz', 'Shasta', 'Sierra', 'Siskiyou',
            'Solano', 'Sonoma', 'Stanislaus', 'Sutter', 'Tehama', 'Trinity', 'Tulare',
            'Tuolumne', 'Ventura', 'Yolo', 'Yuba'
        ];

        counties.forEach(county => {
            const opt = document.createElement('option');
            opt.value = county;
            opt.textContent = county;
            select.appendChild(opt);
        });

        container.appendChild(select);

    } else if (filterType === 'ethnicity') {
        const select = document.createElement('select');
        select.id = 'filterValue';
        select.name = 'filterValue';

        // Add ethnicity options
        const ethnicities = ['Black', 'White', 'Hispanic', 'Native American', 'Others'];
        ethnicities.forEach(ethnicity => {
            const opt = document.createElement('option');
            opt.value = ethnicity;
            opt.textContent = ethnicity;
            select.appendChild(opt);
        });

        container.appendChild(select);

    } else if (filterType === 'sentence_type') {
        const select = document.createElement('select');
        select.id = 'filterValue';
        select.name = 'filterValue';

        // Add sentence type options
        const sentenceTypes = ['Second Striker', 'Life with Parole'];
        sentenceTypes.forEach(type => {
            const opt = document.createElement('option');
            opt.value = type;
            opt.textContent = type;
            select.appendChild(opt);
        });

        container.appendChild(select);

    } else if (filterType === 'eligible') {
        const select = document.createElement('select');
        select.id = 'filterValue';
        select.name = 'filterValue';

        // Add eligibility options
        ['1', '0'].forEach(value => {
            const opt = document.createElement('option');
            opt.value = value;
            opt.textContent = value === '1' ? 'Yes' : 'No';
            select.appendChild(opt);
        });

        container.appendChild(select);

    } else if (filterType === 'eligibility_score') {
        const input = document.createElement('input');
        input.type = 'number';
        input.id = 'filterValue';
        input.name = 'filterValue';
        input.placeholder = 'Enter minimum score';
        container.appendChild(input);
    }
}


// Fetch initial data when the page loads
document.addEventListener('DOMContentLoaded', () => {
    fetchData();
});

// Handle filter form submission
document.getElementById('filterForm').addEventListener('submit', (e) => {
    e.preventDefault();
    currentPage = 1; // Reset to the first page
    fetchData(document.getElementById('filterType').value, document.getElementById('filterValue').value, currentPage);
});
