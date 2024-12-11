module.exports = ({
    department,
    dateRequested,
    details,
    requestedBy,
    confirmedBy,
    services,
    preparedBy, 
    confirmedBySignature,
    endorsedBy,
    approvedBy,
  }) => {
    const today = new Date();
    return `
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Service Request Form</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #ffffff;
              color: #000000;
            }
            .container {
              width: 100%;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
              border: 1px solid #000;
            }
            h1, h2, h3 {
              text-align: center;
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            td, th {
              border: 1px solid #000;
              padding: 5px;
              text-align: left;
            }
            .section {
              margin-bottom: 20px;
            }
            .section-title {
              font-weight: bold;
              margin-bottom: 5px;
            }
            .signature {
              margin-top: 50px;
            }
            .signature-box {
              width: 45%;
              display: inline-block;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>AIMCoop - Service Request Form</h1>
            <div class="section">
              <div class="section-title">Department / Branch:</div>
              <div>${department}</div>
            </div>
            <div class="section">
              <div class="section-title">Date Requested:</div>
              <div>${dateRequested || `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`}</div>
            </div>
            <div class="section">
              <div class="section-title">Details:</div>
              <div>${details}</div>
            </div>
            <div class="section">
              <table>
                <thead>
                  <tr>
                    <th>Service</th>
                    <th>Details or Recommendations</th>
                  </tr>
                </thead>
                <tbody>
                  ${services
                    .map(
                      (service) => `
                    <tr>
                      <td>${service.name}</td>
                      <td>${service.details}</td>
                    </tr>`
                    )
                    .join("")}
                </tbody>
              </table>
            </div>
            <div class="section">
              <div class="section-title">Requested By:</div>
              <div>${requestedBy}</div>
            </div>
            <div class="section">
              <div class="section-title">Confirmed By:</div>
              <div>${confirmedBy}</div>
            </div>
            <div class="signature">
              <div class="signature-box">
                <div>Prepared By:</div>
                <div>${preparedBy}</div>
              </div>
              <div class="signature-box">
                <div>Approved By:</div>
                <div>${approvedBy}</div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
  };
  