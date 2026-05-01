/**
 * charts.js — Shared Chart.js helpers and theme defaults for Bench Signal.
 */

// ── Global Chart.js defaults ────────────────────────────────────────────────
Chart.defaults.color = '#94a3b8';          // slate-400
Chart.defaults.borderColor = '#1e293b';    // slate-800
Chart.defaults.font.family = "'Inter', ui-sans-serif, system-ui, sans-serif";
Chart.defaults.font.size = 12;

// ── Palette ──────────────────────────────────────────────────────────────────
const COLORS = {
  indigo:     '#6366f1',
  indigoDim:  '#4338ca',
  cyan:       '#22d3ee',
  cyanDim:    '#0891b2',
  granted:    '#34d399',   // emerald-400
  denied:     '#f87171',   // red-400
  grantedBg:  'rgba(52,211,153,0.75)',
  deniedBg:   'rgba(248,113,113,0.75)',
  slate:      '#64748b',
  slateDim:   '#334155',
};

// ── Tooltip style ────────────────────────────────────────────────────────────
const TOOLTIP_OPTS = {
  backgroundColor: '#0f172a',
  borderColor: '#334155',
  borderWidth: 1,
  titleColor: '#e2e8f0',
  bodyColor: '#94a3b8',
  padding: 10,
  cornerRadius: 6,
};

// ── Shared axis config ───────────────────────────────────────────────────────
function makeAxis(opts = {}) {
  return {
    grid: { color: '#1e293b' },
    ticks: { color: '#64748b' },
    ...opts,
  };
}

// ── Helper: pct formatter ────────────────────────────────────────────────────
function pct(v, decimals = 1) {
  if (v == null || isNaN(v)) return 'N/A';
  return (v * 100).toFixed(decimals) + '%';
}

function grantRateColor(rate) {
  if (rate == null) return COLORS.slate;
  if (rate >= 0.8) return COLORS.granted;
  if (rate >= 0.5) return '#fbbf24';  // amber
  return COLORS.denied;
}

// ── Horizontal bar chart (judge grant rates) ─────────────────────────────────
function createJudgeBarChart(canvasId, judges) {
  const sorted = [...judges]
    .filter(j => j.grant_rate != null)
    .sort((a, b) => b.grant_rate - a.grant_rate);

  const labels = sorted.map(j => j.name.replace('Hon. ', ''));
  const rates  = sorted.map(j => +(j.grant_rate * 100).toFixed(1));
  const colors = sorted.map(j => grantRateColor(j.grant_rate));

  return new Chart(document.getElementById(canvasId), {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Grant Rate (%)',
        data: rates,
        backgroundColor: colors,
        borderRadius: 4,
        borderSkipped: false,
      }],
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          ...TOOLTIP_OPTS,
          callbacks: {
            label: ctx => ` ${ctx.parsed.x.toFixed(1)}% grant rate`,
          },
        },
      },
      scales: {
        x: {
          ...makeAxis(),
          min: 0,
          max: 100,
          ticks: {
            color: '#64748b',
            callback: v => v + '%',
          },
        },
        y: { ...makeAxis(), ticks: { color: '#cbd5e1', font: { size: 11 } } },
      },
    },
  });
}

// ── Doughnut chart ────────────────────────────────────────────────────────────
function createDoughnutChart(canvasId, labels, values, colors) {
  const palette = colors || [
    '#6366f1', '#22d3ee', '#34d399', '#fbbf24', '#f87171', '#a78bfa',
  ];
  return new Chart(document.getElementById(canvasId), {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data: values,
        backgroundColor: palette,
        borderColor: '#0f172a',
        borderWidth: 3,
        hoverOffset: 6,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '62%',
      plugins: {
        legend: {
          position: 'right',
          labels: { color: '#94a3b8', padding: 14, font: { size: 12 } },
        },
        tooltip: {
          ...TOOLTIP_OPTS,
          callbacks: {
            label: ctx => {
              const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
              const pct = ((ctx.parsed / total) * 100).toFixed(1);
              return ` ${ctx.label}: ${ctx.parsed} (${pct}%)`;
            },
          },
        },
      },
    },
  });
}

// ── Stacked bar chart (temporal) ──────────────────────────────────────────────
function createStackedBar(canvasId, labels, grantedData, deniedData, xLabel) {
  return new Chart(document.getElementById(canvasId), {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Granted',
          data: grantedData,
          backgroundColor: COLORS.grantedBg,
          stack: 'outcomes',
          borderRadius: { topLeft: 0, topRight: 0, bottomLeft: 3, bottomRight: 3 },
        },
        {
          label: 'Denied',
          data: deniedData,
          backgroundColor: COLORS.deniedBg,
          stack: 'outcomes',
          borderRadius: { topLeft: 3, topRight: 3, bottomLeft: 0, bottomRight: 0 },
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: '#94a3b8', font: { size: 11 } },
        },
        tooltip: {
          ...TOOLTIP_OPTS,
          callbacks: {
            label: ctx => ` ${ctx.dataset.label}: ${ctx.parsed.y}`,
          },
        },
      },
      scales: {
        x: {
          ...makeAxis(),
          stacked: true,
          title: { display: !!xLabel, text: xLabel, color: '#64748b', font: { size: 11 } },
        },
        y: {
          ...makeAxis(),
          stacked: true,
          ticks: { color: '#64748b', precision: 0 },
        },
      },
    },
  });
}

// ── Grant-rate bar chart (timing buckets etc.) ────────────────────────────────
function createGrantRateBar(canvasId, labels, rates, title) {
  const colors = rates.map(r => grantRateColor(r / 100));
  return new Chart(document.getElementById(canvasId), {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: title || 'Grant Rate (%)',
        data: rates,
        backgroundColor: colors,
        borderRadius: 4,
        borderSkipped: false,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          ...TOOLTIP_OPTS,
          callbacks: { label: ctx => ` ${ctx.parsed.y.toFixed(1)}%` },
        },
      },
      scales: {
        x: { ...makeAxis() },
        y: {
          ...makeAxis(),
          min: 0,
          max: 100,
          ticks: { color: '#64748b', callback: v => v + '%' },
        },
      },
    },
  });
}

// ── Export helpers ────────────────────────────────────────────────────────────
window.BenchSignal = {
  COLORS,
  TOOLTIP_OPTS,
  pct,
  grantRateColor,
  createJudgeBarChart,
  createDoughnutChart,
  createStackedBar,
  createGrantRateBar,
};
