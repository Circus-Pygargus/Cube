import Chart from 'chart.js/auto';

const ctx = document.querySelector('#main-stats');

function formatChartData(chartData, year) {
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const data = chartData[year]?.months || [];

    return {
        labels: months.map(m => {
            const monthData = data.find(d => d.month === m);
            const monthLabel = new Date(year, m - 1).toLocaleDateString('fr-FR', { month: 'short' });
            const nb = monthData ? monthData.nbChronos : 0;
            return nb > 0 ? `${monthLabel} (${nb})` : monthLabel;
        }),
        datasets: [
            {
                label: 'Meilleur temps',
                data: months.map(m => {
                    const monthData = data.find(d => d.month === m);
                    return monthData ? monthData.bestTime / 1000 : null;
                }),
                borderColor: '#4caf50',
                fill: false,
            },
            {
                label: 'Moyenne',
                data: months.map(m => {
                    const monthData = data.find(d => d.month === m);
                    return monthData ? monthData.avgTime / 1000 : null;
                }),
                borderColor: '#2196f3',
                fill: false,
            },
            {
                label: 'Pire temps',
                data: months.map(m => {
                    const monthData = data.find(d => d.month === m);
                    return monthData ? monthData.worstTime / 1000 : null;
                }),
                borderColor: '#f44336',
                fill: false,
            }
        ]
    };
}

const chart = new Chart(ctx, {
    type: 'line',
    data: formatChartData(chartData),
    options: {
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const ms = context.parsed.y;
                        return `${context.dataset.label}: ${formatChrono(ms * 1000)}`;
                    }
                }
            }
        },
        elements: {
            line: {
                tension: 0, // or 0.4 if curve wanted
                spanGaps: true // Allow line even if none or only one chrono in a month
            }
        }
    }
});

// Update graph according to year wanted
const yearBtns = document.querySelectorAll('.tab-button');
yearBtns.forEach(button => {
    button.addEventListener('click', () => {
        // Change active year tab
        document.querySelector('.tab-button.active').classList.remove('active');
        button.classList.add('active');

        // Update graph
        const year = button.dataset.year;
        chart.data = formatChartData(chartData, year);
        chart.update();
    });
});

// On load, display default year which is chosen in template
const year = document.querySelector('.tab-button.active').dataset.year;
chart.data = formatChartData(chartData, year);
chart.update();

/** Human readable duration
 *  @param durationToFormat duration in ms
 *  @return duration with format HH:MM:SS.ms
 */
function formatChrono(durationToFormat) {
    const hours = Math.floor(durationToFormat / 3600000);
    let remaining = durationToFormat - (hours * 3600000);
    const minutes = Math.floor(remaining / 60000);
    remaining = remaining - (minutes * 60000);
    const seconds = Math.floor(remaining / 1000);
    const millisecs = remaining - (seconds * 1000);

    const formattedMillisecs = String(millisecs).padStart(3, '0');
    let result = '';

    if (hours) {
        result += hours + ':';
        if (minutes < 10) result += '0';
    }
    if (minutes) {
        result += minutes + ':';
        if (seconds < 10) result += '0';
    }
    result += seconds + '.' + formattedMillisecs;

    return result;
}   