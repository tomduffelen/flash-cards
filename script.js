// ============================================================
// CONFIGURATION
// Edit these values to fine-tune text placement and styling.
// Canvas is 1920 × 1080 px. x/y are the top-left origin of
// the text block. lineHeight is a multiplier of fontSize.
// ============================================================
const CONFIG = {
  projectName: {
    x: 40,
    y: 55,
    maxWidth: 1100,
    fontSize: 70,
    fontWeight: '900',
    fontFamily: 'Arial, sans-serif',
    textColour: '#ffffff',
    lineHeight: 1.2,
  },
  date: {
    x: 1670,
    y: 15,
    maxWidth: 240,
    fontSize: 31,
    fontWeight: 'bold',
    fontFamily: 'Arial, sans-serif',
    textColour: '#2dd4bf',
    lineHeight: 1.3,
  },
  status: {
    x: 1670,
    y: 43,
    maxWidth: 240,
    fontSize: 31,
    fontWeight: 'bold',
    fontFamily: 'Arial, sans-serif',
    textColour: '#2dd4bf', // overridden at render time by selected option's data-colour
    lineHeight: 1.3,
  },
  // Box 1 — top left panel
  doneSince: {
    x: 138,
    y: 360,
    maxWidth: 580,
    fontSize: 34,
    fontWeight: 'bold',
    fontFamily: 'Arial, sans-serif',
    textColour: '#1a3a3a',
    lineHeight: 1.55,
  },
  // Box 2 — top centre panel
  doingNow: {
    x: 768,
    y: 360,
    maxWidth: 580,
    fontSize: 34,
    fontWeight: 'bold',
    fontFamily: 'Arial, sans-serif',
    textColour: '#1a3a3a',
    lineHeight: 1.55,
  },
  // Box 3 — top right panel
  toDoNext: {
    x: 1398,
    y: 360,
    maxWidth: 560,
    fontSize: 34,
    fontWeight: 'bold',
    fontFamily: 'Arial, sans-serif',
    textColour: '#1a3a3a',
    lineHeight: 1.55,
  },
  // Box 4 — bottom left panel
  successes: {
    x: 138,
    y: 760,
    maxWidth: 860,
    fontSize: 34,
    fontWeight: 'bold',
    fontFamily: 'Arial, sans-serif',
    textColour: '#1a3a3a',
    lineHeight: 1.55,
  },
  // Box 5 — bottom right panel
  risks: {
    x: 1078,
    y: 760,
    maxWidth: 860,
    fontSize: 34,
    fontWeight: 'bold',
    fontFamily: 'Arial, sans-serif',
    textColour: '#1a3a3a',
    lineHeight: 1.55,
  },
};

// ── Field → DOM id mapping ───────────────────────────────────
const FIELDS = [
  { key: 'projectName', id: 'projectName' },
  { key: 'date',        id: 'date'        },
  { key: 'status',      id: 'status'      },
  { key: 'doneSince',   id: 'doneSince'   },
  { key: 'doingNow',    id: 'doingNow'    },
  { key: 'toDoNext',    id: 'toDoNext'    },
  { key: 'successes',   id: 'successes'   },
  { key: 'risks',       id: 'risks'       },
];

// ── Canvas setup ─────────────────────────────────────────────
const canvas = document.getElementById('canvas');
const ctx    = canvas.getContext('2d');

// Background image — loaded once, reused on every redraw
const bgImage = new Image();
bgImage.src = 'assets/background.png';

// Trigger the first render once the background has loaded
bgImage.addEventListener('load', render);
bgImage.addEventListener('error', () => {
  // If image is missing, fill with a placeholder colour so the
  // canvas is still usable for layout testing
  ctx.fillStyle = '#c8d6e5';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#555';
  ctx.font = '32px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('background.png not found — place it in /assets/', canvas.width / 2, canvas.height / 2);
});

// ── Text rendering helpers ───────────────────────────────────

/**
 * Break a single paragraph of text into an array of strings
 * that each fit within maxWidth pixels at the current font.
 * ctx.font must already be set before calling.
 */
function breakIntoLines(ctx, text, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let current = '';

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (ctx.measureText(candidate).width <= maxWidth) {
      current = candidate;
    } else {
      // Current line is full — push it and start a new one
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

/**
 * Render multi-line, word-wrapped text onto the canvas.
 * Respects manual newlines (\n) in the source string.
 * Returns the y coordinate just below the last line drawn.
 */
function drawWrappedText(ctx, text, cfg) {
  if (!text.trim()) return cfg.y;

  // Build the full CSS font string
  ctx.font       = `${cfg.fontWeight} ${cfg.fontSize}px ${cfg.fontFamily}`;
  ctx.fillStyle  = cfg.textColour;
  ctx.textAlign  = 'left';
  ctx.textBaseline = 'top';

  const lineHeightPx = cfg.fontSize * cfg.lineHeight;
  let cursorY = cfg.y;

  // Split on manual newlines first, then wrap each segment
  const paragraphs = text.split('\n');
  for (const para of paragraphs) {
    if (para.trim() === '') {
      // Blank line — advance by one line height
      cursorY += lineHeightPx;
      continue;
    }
    const wrapped = breakIntoLines(ctx, para, cfg.maxWidth);
    for (const line of wrapped) {
      ctx.fillText(line, cfg.x, cursorY);
      cursorY += lineHeightPx;
    }
  }

  return cursorY;
}

// ── Main render function ─────────────────────────────────────

function render() {
  // 1. Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 2. Draw the background image at full canvas size (1920 × 1080)
  ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);

  // 3. Draw each configured field using its current input value
  for (const { key, id } of FIELDS) {
    const el  = document.getElementById(id);
    const cfg = CONFIG[key];
    if (!el || !cfg) continue;

    if (key === 'status' && el.tagName === 'SELECT') {
      // Use the colour stored on the selected option rather than the static CONFIG colour
      const selectedColour = el.options[el.selectedIndex]?.dataset?.colour || cfg.textColour;
      drawWrappedText(ctx, el.value, { ...cfg, textColour: selectedColour });
    } else {
      drawWrappedText(ctx, el.value, cfg);
    }
  }
}

// ── Pre-populate date with today ─────────────────────────────
const today = new Date();
const formatted = today.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
document.getElementById('date').value = formatted;

// ── Event listeners ──────────────────────────────────────────

// Update the status dropdown's CSS colour class to match the selection
const statusEl = document.getElementById('status');
const statusClassMap = {
  'On Track':  'status-on-track',
  'At Risk':   'status-at-risk',
  'Off Track': 'status-off-track',
  'Completed': 'status-completed',
  'On Hold':   'status-on-hold',
};
function updateStatusClass() {
  statusEl.className = statusClassMap[statusEl.value] || '';
}
statusEl.addEventListener('change', () => { updateStatusClass(); render(); });

// Redraw on every keystroke across all inputs and textareas
for (const { id } of FIELDS) {
  const el = document.getElementById(id);
  if (el && id !== 'status') el.addEventListener('input', render);
}

// Export button — saves the full-resolution 1920 × 1080 canvas
document.getElementById('exportBtn').addEventListener('click', () => {
  const link      = document.createElement('a');
  link.download   = 'flash-report-card.png';
  link.href       = canvas.toDataURL('image/png');
  link.click();
});

// Clear All — reset every field and redraw
document.getElementById('clearBtn').addEventListener('click', () => {
  for (const { id } of FIELDS) {
    const el = document.getElementById(id);
    if (el) el.value = '';
  }
  updateStatusClass();
  render();
});
