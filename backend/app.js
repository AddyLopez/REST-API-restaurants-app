const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

/* This file sets up a modular organization of routes.
When the routes in app.use() in the bottommost grouping are hit,
those requests are directed to and handled in the files required in the constants below,
which are the second parameters in the app.use() functions. The format, simply, is app.use('/route', routeHandler).

The home page routes are handled in ./routes/index.js
The restaurants routes are handled in ./routes/restaurants.js
The starred restaurants routes are handled in ./routes/starredRestaurants.js
*/

const indexRouter = require("./routes/index");

const restaurantsModule = require("./routes/restaurants");
const restaurantsRouter = restaurantsModule.router;

const starredRestaurantsRouter = require("./routes/starredRestaurants");

const cors = require("cors");

const app = express();
app.use(cors());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/restaurants/starred", starredRestaurantsRouter);
app.use("/restaurants", restaurantsRouter);

module.exports = app;
