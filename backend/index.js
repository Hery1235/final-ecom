const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const paypal = require("@paypal/checkout-server-sdk");
const { error } = require("console");
const { isReadable } = require("stream");
const { type } = require("os");

app.use(express.json());
app.use(cors());

// Database connection : mongodb+srv://mh47098:<db_password>@cluster0.owbqb.mongodb.net/
mongoose.connect(
  "mongodb+srv://mh47098:Hamdankhan1122%40@cluster0.owbqb.mongodb.net/e-comerece"
);

//Api creation

app.get("/", (req, res) => {
  res.send("Express in running");
});

// image storage
const storage = multer.diskStorage({
  destination: "./upload/images",
  filename: (req, file, cb) => {
    return cb(
      null,
      `${file.fieldname}_${Date.now()}_${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage: storage });

// Creating upload endpoints for images
app.use("/images", express.static("upload/images"));
app.post("/upload", upload.single("product"), (req, res) => {
  res.json({
    success: 1,
    image_url: `http://localhost:${port}/images/${req.file.filename}`,
  });
});

// schema for creating products
const Product = mongoose.model("product", {
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  new_price: {
    type: Number,
    required: true,
  },
  old_price: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  available: {
    type: Boolean,
    default: true,
  },
});

// creating endpoints for add product
app.post("/addproduct", async (req, res) => {
  let products = await Product.find({});
  let id;
  if (products.length > 0) {
    const lastProduct_array = products.slice(-1);
    let last_product = lastProduct_array[0];
    id = last_product.id + 1;
  } else {
    id = 1;
  }
  const product = new Product({
    id: id,
    name: req.body.name,
    image: req.body.image,
    category: req.body.category,
    new_price: req.body.new_price,
    old_price: req.body.old_price,
  });

  await product.save();
  console.log("Product saved");
  res.json({
    success: true,
    name: req.body.name,
  });
});

// creating api for deleting products
app.post("/removeproduct", async (req, res) => {
  await Product.deleteOne({ id: req.body.id });
  console.log("Deleted");
  res.json({
    success: true,
    name: req.body.name,
  });
});

// Retrive all the products from database
app.get("/allproducts", async (req, res) => {
  let products = await Product.find({});
  try {
    res.send(products);
  } catch (error) {
    console.log("Error while sending data ", error);
  }
});

app.get("/allproducts/:productid", async (req, res) => {
  try {
    // Extract the product ID from the request parameters
    const productId = req.params.productid;

    // Use `findById` to fetch the product with the specific ID from the database
    let product = await Product.findById(productId);

    // Check if the product was found
    if (!product) {
      return res.status(404).send("Product not found");
    }

    // Send the product data as the response

    res.json(product);
  } catch (error) {
    console.error("Error while fetching product by ID:", error);
    res.status(500).send("Server error");
  }
});

//schema creating user model

const Users = mongoose.model("Users", {
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  cartData: [
    {
      productId: {
        type: String,
        default: null,
      },
      S: {
        type: Number,
        default: 0,
      },
      M: {
        type: Number,
        default: 0,
      },
      L: {
        type: Number,
        default: 0,
      },
      XL: {
        type: Number,
        default: 0,
      },
      XXL: {
        type: Number,
        default: 0,
      },
    },
  ],

  date: {
    type: Date,
    default: Date.now,
  },
});

// Creating endpoints for resgistering user
app.post("/signup", async (req, res) => {
  try {
    // Check if the user already exists
    let check = await Users.findOne({ email: req.body.email });
    if (check) {
      return res.status(400).json({
        success: false,
        error: "Existing user found with same email ID",
      });
    }

    // Create default cartData (an array of 300 objects, each with default values)
    let cart = [];

    // Create a new user with the cartData
    const user = new Users({
      name: req.body.username,
      email: req.body.email,
      password: req.body.password,
      cartData: cart, // Pass the cart array to the user object
    });

    // Save the user in the database
    await user.save();

    // Generate JWT token
    const data = {
      user: {
        id: user.id,
      },
    };

    const token = jwt.sign(data, "secret_ecom"); // Replace 'secret_icon' with your secret

    // Send response
    res.json({ success: true, token });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// creating end points for login
app.post("/login", async (req, res) => {
  let user = await Users.findOne({ email: req.body.email });
  if (user) {
    const passCompare = req.body.password === user.password;
    if (passCompare) {
      const data = {
        user: {
          id: user.id,
        },
      };
      const token = jwt.sign(data, "secret_ecom");
      res.json({ success: true, token });
    } else {
      res.json({ success: false, error: "Wrong passsword" });
    }
  } else {
    res.json({ success: false, error: "User not found" });
  }
});

// Creating endpoint forpopular items
app.get("/popular", async (req, res) => {
  try {
    // Fetch the last 4 products ordered by the newest
    const lastFourProducts = await Product.find().sort({ _id: -1 }).limit(4);

    // Return the last four products
    res.send(lastFourProducts);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error in fetching the last 4 products", error });
  }
});

//Creating endpoint for new collection
app.get("/newcollection", async (req, res) => {
  try {
    // Fetch the last 4 products ordered by the newest
    const lastEightProducts = await Product.find().sort({ _id: -1 }).limit(8);

    // Return the last four products
    res.send(lastEightProducts);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error in fetching the last 8 products", error });
  }
});

// fething user
const fetchUser = async (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    console("USer not found");
    res.status(401).send({ error: "We do not have a valid token " });
  } else {
    try {
      const data = jwt.verify(token, "secret_ecom");

      console.log(data);
      req.user = data.user;
      next();
    } catch (error) {
      res
        .status(401)
        .send({ error: "Please authenticate using a valid token" });
    }
  }
};
//Add to cart endpoint
app.post("/addtocart", fetchUser, async (req, res) => {
  try {
    const userId = req.user.id; // Fetch user ID from the middleware
    const { productId, size } = req.body; // Extract product ID and size from request body

    console.log(productId, "  ", size, "  ", userId);
    if (!userId) {
      return res.status(401).send("Unauthorized");
    }

    // Find the user in the database
    const userData = await Users.findById(userId);
    if (!userData) {
      return res.status(404).send("User not found");
    }

    // Check if the product is already in the cart
    const existingProduct = userData.cartData?.find(
      (item) => item?.productId === productId
    );
    if (existingProduct) {
      // If the product exists, increment the quantity for the specified size
      existingProduct[size] = (existingProduct[size] || 0) + 1;
    } else {
      // If the product is not in the cart, create a new object
      console.log("Adding new product to cart:", { productId, size });
      const newProduct = {
        productId: productId,
        S: 0,
        M: 0,
        L: 0,
        XL: 0,
        XXL: 0,
        [size]: 1, // Initialize quantity for the specified size to 1
      };
      userData.cartData.push(newProduct);
    }

    // Save the updated user data
    await userData.save();

    res.json({ success: true, message: "Cart updated successfully" });
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).send("Server error");
  }
});

// Remove from cart endpoint
app.post("/removefromcart", fetchUser, async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user is identified by req.user.id
    if (!userId) {
      return res.status(401).send("Unauthorized");
    }

    // Find the user in the database
    let userData = await Users.findOne({ _id: userId });
    if (!userData) {
      return res.status(404).send("User not found");
    }

    // Convert cartData from Map to Object if needed
    const cartData =
      userData.cartData instanceof Map
        ? Object.fromEntries(userData.cartData)
        : userData.cartData;

    // Extract itemId and size from the request body
    const { productId, size } = req.body;
    if (!productId || !size) {
      return res.status(400).send("Item ID and size are required");
    }

    Object.keys(cartData).forEach((index) => {
      const cartItem = cartData[index];

      // Check if the productId matches the item you want to update
      if (cartItem?.productId === productId) {
        // Decrease the quantity of the specific size by 1
        cartItem[size] = Math.max(0, cartItem[size] - 1);

        console.log(
          `Decreased ${size} size of product ${productId} to:`,
          cartItem[size]
        );

        // Optionally remove the item if all sizes are 0
        const allSizesZero = ["S", "M", "L", "XL", "XXL"].every(
          (sz) => cartItem[sz] === 0
        );

        if (allSizesZero) {
          delete cartData[index]; // Remove the item from the cart if all sizes are zero
          console.log(`Removed product ${productId} from cart.`);
        }
      }
    });

    cartData?.filter((item) => item);

    // Save the updated cartData to the database
    await Users.findOneAndUpdate(
      { _id: userId },
      { $set: { cartData: cartData } }
    );

    res.json("Removed from cart");
  } catch (error) {
    console.error("Error in /removefromcart:", error);
    res.status(500).send("Server error");
  }
});

// Get cart end ponints
app.post("/getcart", fetchUser, async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user is identified by req.user.id

    if (!userId) {
      return res.status(401).send("Unauthorized");
    }

    // Find the user in the database
    let userData = await Users.findOne({ _id: userId });
    if (!userData) {
      return res.status(404).send("User not found");
    }
    // Convert cartData (if it's a Map) back to an object for the response
    let cartData =
      userData.cartData instanceof Map
        ? Object.fromEntries(userData.cartData)
        : userData.cartData;

    // remove null values
    cartData = cartData?.filter((item) => item);

    // Return the cart data to the client

    res.json({ cartData });
  } catch (error) {
    console.error("Error in /getcart:", error);
    res.status(500).send("Server error");
  }
});

// PayPal Environment
let environment = new paypal.core.SandboxEnvironment(
  "Aaei0zojyru90c49LxduL7vBe1VmGJaqF5DCUiqOzi_RH0TOfuyXX9Mwh_caFsTPzT_iAjUflyl1rKgl", // Your PayPal Client ID
  "EJDWfzTUM--YQbBj8cuQKZ3kQj0PNY4nKsBo_5NXNODyybVfUy2LQp4rCApJNAat0q-ngY8KmLaUi-XH" // Your PayPal Secret
);
let client = new paypal.core.PayPalHttpClient(environment);

// Create an order
app.post("/create-order", async (req, res) => {
  const request = new paypal.orders.OrdersCreateRequest();
  request.prefer("return=representation");
  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: "100.00", // You can replace this with dynamic amount
        },
      },
    ],
  });

  try {
    const order = await client.execute(request);
    res.json({ id: order.result.id }); // Send the order ID back to the frontend
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Capture the payment
app.post("/capture-order", async (req, res) => {
  const { orderID } = req.body;

  const request = new paypal.orders.OrdersCaptureRequest(orderID);
  request.requestBody({});

  try {
    const capture = await client.execute(request);

    // If the capture was successful
    if (capture.result.status === "COMPLETED") {
      res.json({ status: "success", capture });
    } else {
      res.json({ status: "failed", capture });
    }
  } catch (error) {
    console.error("Error capturing order:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, (error) => {
  if (!error) {
    console.log("Server running on ", port);
  } else {
    console.log("Error ", error);
  }
});
