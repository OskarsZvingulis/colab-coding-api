function getstockdata() {
  // API key is kept server-side. Frontend calls /api/stock which proxies to Marketstack.
  const button = typeof document !== 'undefined' ? document.getElementById("apistock") : null;
  const symbolEl = typeof document !== 'undefined' ? document.getElementById("symbol") : null;
  if (!button || !symbolEl) return; // nothing to do when not running in a browser environment

  // Function to fetch stock data
  const fetchStockData = async () => {
    const resultDiv = document.getElementById("result");
    const symbol = symbolEl.value.trim().toUpperCase();

    if (!symbol) {
      if (resultDiv) resultDiv.innerHTML = "Please enter a stock symbol.";
      return;
    }

    // Show loading message
    if (resultDiv) resultDiv.innerHTML = "Loading...";

    try {
      // Call the backend proxy which uses the server-side API key
      const resp = await fetch(`/api/stock?symbol=${encodeURIComponent(symbol)}`);
      if (!resp.ok) {
        // Try to show server-provided error details (JSON or plain text)
        let details = '';
        try {
          const errJson = await resp.json();
          details = errJson.error || JSON.stringify(errJson);
        } catch (e) {
          try {
            details = await resp.text();
          } catch (e2) {
            details = resp.statusText || 'Unknown error';
          }
        }
        if (resultDiv) resultDiv.innerHTML = `Request failed: ${resp.status} - ${details}`;
        return;
      }
      
      const data = await resp.json();
      
      // Check if we have data
      if (!data.data || data.data.length === 0) {
        if (resultDiv) resultDiv.innerHTML = "No stock data found for that symbol.";
        return;
      }

      // Build HTML table
      let tableHTML = `
        <div style="font-family: sans-serif; margin-top: 1em; overflow-x: auto;">
          <h2>${symbol} - Last 10 Days</h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 1em; font-size: 14px;">
            <thead>
              <tr style="background-color: #f0f0f0;">
                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Date</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Symbol</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Exchange</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Open</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">High</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Low</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Close</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Adj Close</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Volume</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Dividend</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Split Factor</th>
              </tr>
            </thead>
            <tbody>
      `;

      // Add rows for each day (limited to 10 by backend)
      data.data.forEach((day, index) => {
        const formattedDate = new Date(day.date).toLocaleDateString();
        const rowStyle = index % 2 === 0 ? 'background-color: #f9f9f9;' : '';
        tableHTML += `
          <tr style="${rowStyle}">
            <td style="border: 1px solid #ddd; padding: 8px;">${formattedDate}</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${day.symbol || 'N/A'}</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${day.exchange || 'N/A'}</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">$${day.open.toFixed(2)}</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">$${day.high.toFixed(2)}</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">$${day.low.toFixed(2)}</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">$${day.close.toFixed(2)}</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">$${day.adj_close.toFixed(2)}</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${day.volume.toLocaleString()}</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${day.dividend ? '$' + day.dividend.toFixed(2) : '$0.00'}</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${day.split_factor || 1}</td>
          </tr>
        `;
      });

      tableHTML += `
            </tbody>
          </table>
        </div>
      `;

      if (resultDiv) resultDiv.innerHTML = tableHTML;
    } catch (err) {
      if (resultDiv) resultDiv.innerHTML = `Error: ${err.message}`;
    }
  };

  // Add click event listener to button
  button.addEventListener("click", fetchStockData);

  // Add Enter key event listener to input field
  symbolEl.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      fetchStockData();
    }
  });
}

// Initialize when loaded in a browser
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', getstockdata);
}
