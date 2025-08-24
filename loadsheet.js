function loadSheet(tabName) {
  const sheetUrl = `https://docs.google.com/spreadsheets/d/1H_5DD-T3VIRRcPMohU5dr8rKnQj8U1mOakuW1AKpBuw/gviz/tq?sheet=${tabName}`;

  function handleQueryResponse(response) {
    if (response.isError()) {
      document.getElementById("sheet-content").innerText = 'Fehler beim Laden der Tabelle.';
      return;
    }

    const data = response.getDataTable();
    const numRows = data.getNumberOfRows();
    const numCols = data.getNumberOfColumns();

    const title = data.getValue(0, 0);
    document.getElementById("sheet-title").innerHTML = `<h2>${title}</h2>`;

    let html = `
      <table>
        <colgroup>
          <col style="width: 30%;">
          <col style="width: 70%;">
        </colgroup>
    `;

    html += '<tr>';
    for (let j = 0; j < numCols; j++) {
      html += `<th>${data.getValue(1, j) || ''}</th>`;
    }
    html += '</tr>';

    for (let i = 2; i < numRows; i++) {
      html += '<tr>';
      for (let j = 0; j < numCols; j++) {
        html += `<td>${data.getValue(i, j) || ''}</td>`;
      }
      html += '</tr>';
    }

    html += '</table>';
    document.getElementById("sheet-content").innerHTML = html;
  }

  google.charts.load('current', { packages: ['corechart'] });
  google.charts.setOnLoadCallback(() => {
    const query = new google.visualization.Query(sheetUrl);
    query.send(handleQueryResponse);
  });
}
