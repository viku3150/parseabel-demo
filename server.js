const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Proxy route — browser calls /proxy/ingest, server forwards to Parseable
app.post("/proxy/ingest", async (req, res) => {
	const { parseableUrl, auth, stream, logs } = req.body;
	try {
		const response = await fetch(`${parseableUrl}/api/v1/ingest`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: auth,
				"X-P-Stream": stream,
			},
			body: JSON.stringify(logs),
		});
		res.status(response.status).json({ ok: response.ok });
	} catch (err) {
		res.status(500).json({ ok: false, error: err.message });
	}
});

app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => console.log(`Running on port ${PORT}`));
