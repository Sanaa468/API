const express = require("express");
const app = express();
const mongoose = require("mongoose");

app.use(express.json());

async function connectToDB() {
    try {
        await mongoose.connect("mongodb://localhost:27017/Information");
        console.log("Connected to database");
    } catch (err) {
        console.error("Error connecting to database", err);
    }
}
connectToDB();
const sch = new mongoose.Schema({
    name: String,
    email: String,
    id: Number
});

const Monmodel = mongoose.model("studentLists", sch);

app.post("/post", async (req, res) => {
    console.log("Working on post function");
    const data = new Monmodel({
        name: req.body.name,
        email: req.body.email,
        id: req.body.id
    });

    data.save()
        .then(() => {
            res.send("Posted");
        })
        .catch((err) => {
            res.status(500).send("Error posting data");
        });
});

app.put("/update/:id", async (req, res) => {
    let upid = req.params.id;
    let updatedname = req.body.name;
    let updatedemail = req.body.email;

    try {
        const data = await Monmodel.findOneAndUpdate(
            { id: upid },
            { $set: { name: updatedname, email: updatedemail } },
            { new: true }
        );

        if (data) {
            res.send(data);
        } else {
            res.status(404).send("Data not found");
        }
    } catch (err) {
        res.status(500).send("Error updating data");
    }
});

app.listen(3000, () => {
    console.log("Running on port 3009");
});
