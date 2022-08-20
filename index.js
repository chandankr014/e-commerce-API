const express  = require("express");
const app = express();
const mongoose = require("mongoose");
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/products");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");

const dotenv = require("dotenv");
dotenv.config();
/* to hide our login credentials we take the use of dotenv class, 
    this is useful when we have to upload our project onto GitHub
*/


mongoose
    .connect(process.env.MONGO_URL_user014)
    .then(() => console.log("Database Connected"))
    .catch((err) => {
        console.log(err);
    });

/* creating methods for the API */
app.get("/", () => {
    console.log("HELLO WORLD");
});

app.get("/key", (req,res) =>{
    const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    function generateString(length) {
        let result = '';
        const charactersLength = characters.length;
        for ( let i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
    r = generateString(8);
    console.log(r);
    res.status(200).json(r);
});


/* making app use different routes */
app.use(express.json());
app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/product", productRoute);
app.use("/api/cart", cartRoute);
app.use("/api/order", orderRoute);


/* making the API active to the PORT given */
app.listen(process.env.PORT || 5000, () => {
    console.log("server is live now");
    console.log("connecting to the Database....");
});

