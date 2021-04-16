const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
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
  const OrderCollection = client.db("manSalon").collection("orders");

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

  // One service load for order
  app.post("/orderOn", (req, res) => {
    const serviceDetail = req.body;
    ServiceCollection.find({ _id: ObjectId(serviceDetail.id) }).toArray(
      (err, document) => {
        res.send(document);
      }
    );
  });

  //order insert to database

  app.post("/addOrder", (req, res) => {
    const order = req.body;
    OrderCollection.insertOne(order).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  //order list  send to user/admin

  app.post("/orderList", (req, res) => {
    const checkAdmin = req.body.email;
    AdminDevCollection.find({ Email: checkAdmin }).toArray((err, result) => {
      console.log(result.length > 0);
      if (result.length == 0) {
        OrderCollection.find({ email: checkAdmin }).toArray((err, document) => {
          res.send(document);
        });
      }
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
    AdminDevCollection.insertOne(admin).then((result) => {
      console.log(result.insertedCount);
    });
  });

  //send admin to ul

  app.post("/admins", (req, res) => {
    const isAdmin = req.body.email;
    AdminDevCollection.find({ Email: isAdmin }).toArray((err, result) => {
      res.send(result.length > 0);
    });
  });
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port);
