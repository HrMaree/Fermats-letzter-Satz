function loadGedankenSheet(tabName) {
  const sheetUrl = `https://docs.google.com/spreadsheets/d/1H_5DD-T3VIRRcPMohU5dr8rKnQj8U1mOakuW1AKpBuw/gviz/tq?sheet=${tabName}`;

  function handleResponse(response) {
    if (response.isError()) {
      document.getElementById("gedanken-content").innerText = "Fehler beim Laden der Gedanken.";
      return;
    }

    const data = response.getDataTable();
    const numRows = data.getNumberOfRows();
    const numCols = data.getNumberOfColumns();

    let html = "";

    console.log("Spaltenübersicht:");
    for (let j = 0; j < numCols; j++) {
      console.log(`Spalte ${j}: ${data.getColumnLabel(j)}`);
    }

    for (let i = 1; i < numRows; i++) {
      console.log("Zeile " + i + ":");
    for (let j = 0; j < numCols; j++) {
      console.log(`  Spalte ${j}:`, data.getValue(i, j));
    }

      const kapitel = data.getValue(i, 1); // Spalte B: Kapitel
      const gedanke = data.getValue(i, 2); // Spalte C: Gedanke
      const autor = numCols >= 4 ? data.getValue(i, 3) : "";

      if (kapitel && gedanke) {
        html += `
          <section class="gedanken-block">
            <h3>${kapitel}</h3>
            <p class="gedanke">„${gedanke}“</p>
            ${autor ? `<p class="autor">– ${autor}</p>` : ""}
          </section>
        `;
      }
    }

    document.getElementById("gedanken-content").innerHTML = html;
    if (window.MathJax) MathJax.typesetPromise();
  }

  google.charts.load('current', { packages: ['corechart'] });
  google.charts.setOnLoadCallback(() => {
    const query = new google.visualization.Query(sheetUrl);
    query.send(handleResponse);
  });
}
