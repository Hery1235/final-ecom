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
const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const Product = require("./models/productModel");
const SliceShow = require("./models/slideShowModel");
const Users = require("./models/userModel");
const Orders = require("./models/orderModel");

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://frontend-two-azure-18.vercel.app",
    "http://localhost:3000",
  ], // Allow only your frontend
  methods: "GET, POST, PUT, DELETE", // Allowed HTTP methods
  allowedHeaders: "Content-Type, Authorization", // Allowed headers
  credentials: true, // Allow cookies if needed
};

app.use(cors(corsOptions));
app.use(express.json());

// Order place function to database
const placeOrder = async (
  userId,
  orderId,
  customerName,
  phoneNumber,
  customerEmail,
  shippingAddress,
  totalPaid,
  cartData
) => {
  const fullAddress = `${shippingAddress.address_line_1}, ${shippingAddress.admin_area_2}, ${shippingAddress.postal_code}, ${shippingAddress.country_code}`;

  let order = new Orders({
    userId: userId,
    orderId: orderId,
    oderName: customerName,
    orderPhoneNumber: phoneNumber,
    orderEmail: customerEmail,
    orderAdress: fullAddress,
    totalPaid: totalPaid,
    date: Date.now(),
    cartData: cartData, // Ensure this is an array of products as per the schema
  });

  await order.save();

  return;
};

const getCartByUserID = async (userId) => {
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

  return cartData;
};

const getProductById = async (productId) => {
  // Use `findById` to fetch the product with the specific ID from the database
  let product = await Product.findOne({ _id: productId });
  // let userData = await Users.findOne({ _id: userId });

  return product;
};

const getTotalAmount = async (cartItems) => {
  if (!cartItems?.length) {
    return 0;
  }
  console.log(cartItems.length);

  let totalAmount = 0;

  for (let index = 0; index < cartItems.length; index++) {
    const productId = cartItems[index].productId;
    let totalItems = 0;

    totalItems =
      totalItems +
      cartItems[index].S +
      cartItems[index].M +
      cartItems[index].L +
      cartItems[index].XL +
      cartItems[index].XXL;

    const productData = await getProductById(productId);

    let price = totalItems * productData.new_price;

    totalAmount = totalAmount + price;

    // return productData;
  }

  return totalAmount;
};

// Database connection : mongodb+srv://mh47098:<db_password>@cluster0.owbqb.mongodb.net/
mongoose.connect(
  "mongodb+srv://mh47098:Hamdankhan1122%40@cluster0.owbqb.mongodb.net/e-comerece"
);

//Api creation
app.get("/", (req, res) => {
  res.send("Express in running");
});

// // image storage
// const storage = multer.diskStorage({
//   destination: "./upload/images",
//   filename: (req, file, cb) => {
//     return cb(
//       null,
//       `${file.fieldname}_${Date.now()}_${path.extname(file.originalname)}`
//     );
//   },
// });

// const upload = multer({ storage: storage });

// // Creating upload endpoints for images
// app.use("/images", express.static("upload/images"));
// app.post("/upload", upload.single("product"), (req, res) => {
//   res.json({
//     success: 1,
//     image_url: `http://localhost:${port}/images/${req.file.filename}`,
//   });
// });

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Cloudinary Cloud Name
  api_key: process.env.CLOUDINARY_API_KEY, // Cloudinary API Key
  api_secret: process.env.CLOUDINARY_API_SECRET, // Cloudinary API Secret
});

// Use Cloudinary as the storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads", // The folder name in your Cloudinary account
    allowed_formats: ["jpg", "png", "jpeg"], // Allowed image formats
  },
});

const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } });

// Upload endpoint
app.post("/upload", upload.single("product"), (req, res) => {
  res.json({
    success: 1,
    image_url: req.file.path, // Cloudinary URL for the uploaded image
  });
});

app.post("/addslideshow", async (req, res) => {
  let slideShows = await SliceShow.find({});

  let id;
  if (slideShows.length > 0) {
    const lastSlideShow_array = slideShows.slice(-1);
    let last_slideShow = lastSlideShow_array[0];
    id = last_slideShow.id + 1;
  } else {
    id = 1;
  }
  const sliceShow = new SliceShow({
    id: id,

    image: req.body.imageUrl,
    category: req.body.slideShowCategory,
  });
  await sliceShow.save();
  console.log("SlideShow saved");
  res.json({
    success: true,
    name: req.body.name,
  });
});
app.get("/allslideshow", async (req, res) => {
  let slideshows = await SliceShow.find({});
  try {
    res.send(slideshows);
  } catch (error) {
    console.log("Error while sending data ", error);
  }
});
app.post("/removeslideshow", async (req, res) => {
  await SliceShow.deleteOne({ id: req.body.id });
  console.log("Deleted");
  res.json({
    success: true,
  });
});

//creating api for deleting products
app.post("/removeproduct", async (req, res) => {
  await Product.deleteOne({ id: req.body.id });
  console.log("Deleted");
  res.json({
    success: true,
    name: req.body.name,
  });
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
    discription: req.body.discription,
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
    const product = await getProductById(req.params.productid); // Add 'await' here

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
    // Fetch 4 random products
    const randomProducts = await Product.aggregate([{ $sample: { size: 4 } }]);

    // Return the random products
    res.send(randomProducts);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error in fetching random products", error });
  }
});

//Creating endpoint for new collection
app.get("/newcollection", async (req, res) => {
  try {
    // Fetch the last 4 products ordered by the newest
    const lastEightProducts = await Product.find().sort({ _id: -1 }).limit(8);

    console.log("Last 8 products ", lastEightProducts);
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
    console.log("USer not found");
    res.status(401).send({ error: "We do not have a valid token " });
  } else {
    try {
      const data = jwt.verify(token, "secret_ecom");

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
app.post("/getcart", cors(corsOptions), fetchUser, async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("User id:", userId);

    const cartData = await getCartByUserID(userId);

    if (!cartData) {
      console.error("No cart data found");
      return res.status(404).json({ message: "Cart data not found" });
    }

    // Return the cart data to the client
    res.json(cartData); // Make sure this is always reached
  } catch (error) {
    console.error("Error in /getcart:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/gettotalamount", fetchUser, async (req, res) => {
  try {
    const userId = req.user.id;

    const cartItems = await getCartByUserID(userId);

    const totalAmount = await getTotalAmount(cartItems);

    res.json(totalAmount);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

// PayPal Environment
let environment = new paypal.core.SandboxEnvironment(
  "ATefffvXltp2Byw3YHCL2TH5DsH8bLGbweDw8xkq_l_W_UZWOIhd8yVeTv4I74XIk1yUnMfx6DeXU9p0", // Your PayPal Client ID
  "ENm-NG9bk2y8rZGpyWjaAfD0Fla6qzJcnkiwC0ObOEBfNUha_V8Gu-cfcpucOnvZHlh_eKqv9zFOvMYL" // Your PayPal Secret
);
let client = new paypal.core.PayPalHttpClient(environment);

// Create an order
// Create an order
app.post("/create-order", fetchUser, async (req, res) => {
  let totalAmount;
  debugger;
  try {
    const userId = req.user.id;
    const cartItems = await getCartByUserID(userId);
    totalAmount = await getTotalAmount(cartItems);
    debugger;
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }

  const request = new paypal.orders.OrdersCreateRequest();
  request.prefer("return=representation");
  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: totalAmount, // Use the dynamic amount calculated
        },
        // Add this line to indicate that you want shipping info
        shipping: {
          // This field is left empty for PayPal to collect from the customer
        },
      },
    ],
  });

  try {
    debugger;
    const order = await client.execute(request);
    debugger;
    res.json({ id: order.result.id }); // Send the order ID back to the frontend
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Capture the payment
// Capture the payment
app.post("/capture-order", fetchUser, async (req, res) => {
  const { orderID } = req.body;
  let totalPaid;
  let cartData;
  let userId;

  try {
    userId = req.user.id;
    cartData = await getCartByUserID(userId);
    totalPaid = await getTotalAmount(cartData);
    console.log("This is the trpe of total padi money");
    console.log(totalPaid);
    debugger;
    // console.log(typeof totalPaid);
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }

  const request = new paypal.orders.OrdersCaptureRequest(orderID);
  request.requestBody({}); // Capture the order

  try {
    const capture = await client.execute(request);

    // If the capture was successful
    if (capture.result.status === "COMPLETED") {
      // Capture customer details
      const customerName =
        capture.result.payer.name.given_name +
        " " +
        capture.result.payer.name.surname;

      const customerEmail = capture.result.payer.email_address;
      const shippingAddress = capture.result.purchase_units[0].shipping.address;

      const phoneNumber = "07459151351";
      // capture.result.payer?.phone?.phone_number?.national_number;
      placeOrder(
        userId,
        orderID,
        customerName,
        phoneNumber,
        customerEmail,
        shippingAddress,
        totalPaid,
        cartData
      );
      res.json({ status: "success", capture });
    } else {
      res.json({ status: "failed", capture });
    }
  } catch (error) {
    console.error("Error capturing order:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get all the order
app.get("/allorders", async (req, res) => {
  const allOrders = await Orders.find({});
  try {
    res.json(allOrders);
  } catch (error) {
    console.log(
      "Error in sending of all orders this error is from backend Thanks "
    );
  }
});
app.post("/deletefromorder", async (req, res) => {
  console.log("Trying to delte from backend ", req.body);
  await Orders.deleteOne({ _id: req.body.id });
  console.log("Deleted");
  res.json({
    success: true,
  });
});

app.listen(port, (error) => {
  if (!error) {
    console.log("Server running on ", port);
  } else {
    console.log("Error ", error);
  }
});

module.exports = app;
