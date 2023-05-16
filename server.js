const express = require("express");
const path = require("path");

const app = express();

app.use(express.static(path.join(__dirname, "dist")));

app.get("*", (req, res) => {
	res.sendFile(path.resolve(__dirname, "dist", "index.html"));
});

var port = process.env.PORT || "5000";

app.listen(port, () => {
	console.log(`Server listening on ${port}`);
});
