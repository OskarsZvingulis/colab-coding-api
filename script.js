let apikey="3DYhxLmJJPYtWuBusm7uFEXcTcVv2ospnxRMRNT0"

document.getElementById("apistock").addEventListener("click", async () => {
    const symbol = document.getElementById("symbol").value.trim().toUpperCase();
  const resultDiv = document.getElementById("result");
    
  if (!symbol) {
    resultDiv.innerHTML = "Please enter a stock symbol.";
    return;
  }