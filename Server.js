const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");


require('dotenv').config();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

const filePath = path.join(__dirname, "Data.json");


if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '[]');
}

app.get("/", (req, res) => {
    res.render("Index");
});

app.post("/submit", (req, res) => {
    const { name, email, phone, message } = req.body;
    const newEntry = { name, email, phone, message };

    fs.readFile(filePath, "utf8", (err, data) => {
        let jsonData = [];
        if (!err && data) {
            try {
                jsonData = JSON.parse(data);
            } catch (parseErr) {
                console.log("JSON Parse Error:", parseErr);
            }
        }

        jsonData.push(newEntry);

        fs.writeFile(filePath, JSON.stringify(jsonData, null, 4), (writeErr) => {
            if (writeErr) {
                console.log("Error: Data was not saved", writeErr);
                return res.status(500).send("Internal Server Error");
            } else {
                console.log("Data was saved.");
                res.render("success", { name, email, phone, message });
            }
        });
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Hare Krishna! Server is running on http://localhost:${PORT}`);
});
