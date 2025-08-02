const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const app = express();
const port = 3000;

app.use(cors());

const db = new sqlite3.Database("./salon.sqlite");

const validateReferenceMonth = (req, res, next) => {
  const { referenceMonth } = req.query;

  if (!referenceMonth) {
    return res.status(400).json({ error: "Reference month is required." });
  }

  const isValidFormat = /^\d{4}-(0[1-9]|1[0-2])$/.test(referenceMonth);
  if (!isValidFormat) {
    return res
      .status(400)
      .json({ error: "Invalid format. Use 'YYYY-MM' (e.g., 2022-01)." });
  }

  const parsedDate = new Date(`${referenceMonth}-01`);
  if (isNaN(parsedDate.getTime())) {
    return res.status(400).json({ error: "Invalid reference month date." });
  }

  const earliestAllowed = new Date("2022-01-01");
  if (parsedDate < earliestAllowed) {
    return res.status(400).json({
      error: "Reference month must be Jan 2022 or later.",
    });
  }

  next();
};

app.get("/retention", validateReferenceMonth, (req, res) => {
  const { referenceMonth } = req.query;

  const startDate = `${referenceMonth}-01`;

  const tempDate = new Date(`${referenceMonth}-01`);
  tempDate.setMonth(tempDate.getMonth() + 1);
  const endDate = tempDate.toISOString().slice(0, 10);

  const query = `
    WITH 
    FirstAppointments AS (
      SELECT client_id, MIN(date) AS first_date
      FROM APPOINTMENTS
      WHERE date >= ? AND date < ?
      GROUP BY client_id
    ),

    FirstVisits AS (
      SELECT a.client_id, a.employee_id
      FROM APPOINTMENTS a
      INNER JOIN FirstAppointments fa
        ON a.client_id = fa.client_id AND a.date = fa.first_date
    ),

    ClientRetention AS (
      SELECT client_id, STRFTIME('%Y-%m', date) AS retention_month
      FROM APPOINTMENTS
      WHERE date >= ?
        AND client_id IN (SELECT client_id FROM FirstAppointments)
      GROUP BY client_id, retention_month
    ),

    EmployeeClientMap AS (
      SELECT employee_id, COUNT(DISTINCT client_id) AS total_clients
      FROM FirstVisits
      GROUP BY employee_id
    ),

    EmployeeRetentionMap AS (
      SELECT fv.employee_id, cr.retention_month, COUNT(DISTINCT cr.client_id) AS retained_clients
      FROM FirstVisits fv
      JOIN ClientRetention cr ON fv.client_id = cr.client_id
      GROUP BY fv.employee_id, cr.retention_month
    ),

   EmployeeRetentionList AS (
      SELECT 
        erm.employee_id,
        ecm.total_clients,
        erm.retained_clients,
        erm.retention_month
      FROM EmployeeRetentionMap erm
      JOIN EmployeeClientMap ecm ON erm.employee_id = ecm.employee_id
    )

    SELECT 
        e.employee_id,
        e.first_name || ' ' || e.last_name AS employee_name,
        erl.total_clients,
        erl.retained_clients,
        erl.retention_month
    FROM EMPLOYEES e
    LEFT JOIN EmployeeRetentionList erl ON e.employee_id = erl.employee_id
    GROUP BY e.employee_id, erl.retention_month
    ORDER BY e.employee_id, erl.retention_month;
    `;

  db.all(query, [startDate, endDate, endDate], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }

    const grouped = {};

    rows.forEach((row) => {
      const employeeId = row.employee_id;

      if (!grouped[employeeId]) {
        grouped[employeeId] = {
          employeeId,
          employeeName: row.employee_name,
          totalClients: row.total_clients,
          retention: [],
        };
      }

      grouped[employeeId].retention.push({
        month: row.retention_month,
        clients: row.retained_clients,
      });
    });

    const result = Object.values(grouped);

    res.json(result);
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
