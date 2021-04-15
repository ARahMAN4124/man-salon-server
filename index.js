const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = 5050;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.g1gfx.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect((err) => {
  const ServiceCollection = client.db("manSalon").collection("service");
  const TestimonialCollection = client.db("manSalon").collection("testimonial");
  const AdminDevCollection = client.db("manSalon").collection("adminDev");

  //   service add to database

  app.post("/addService", (req, res) => {
    const service = req.body.serviceInfo;
    console.log(service);
    ServiceCollection.insertOne(service).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  //service send to ul

  app.get("/services", (req, res) => {
    ServiceCollection.find({}).toArray((err, document) => {
      res.send(document);
    });
  });

  // testimonial add to database

  app.post("/addTestimonial", (req, res) => {
    const testimonial = req.body.testimonialInfo;
    console.log(testimonial);
    TestimonialCollection.insertOne(testimonial).then((result) => {
      console.log(result.insertedCount);
      res.send(result.insertedCount > 0);
    });
  });

  // testimonial send to ul

  app.get("/testimonials", (req, res) => {
    TestimonialCollection.find({}).toArray((err, document) => {
      res.send(document);
    });
  });

  //add admin

  app.post("/addAdmin", (req, res) => {
    const admin = req.body.data;
    console.log(admin);
    AdminDevCollection.insertOne(admin).then((result) => {
      console.log(result.insertedCount);
    });
  });

  //send admin to ul
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port);
