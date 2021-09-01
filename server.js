const express = require("express");
//paths
const path = require("path");
const controller = require("./controllers");
//handlebars
const exphbs = require("express-handlebars");
//sequelize
const sequelize = require("./config/connection");
//creating session variables
const session = require("express-session");
const SequlizeStore = require("connect-session-sequelize")(session.Store);

//session setup(from main)
const sess = {
  secret: "super secret secret",
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequlizeStore({
    db: sequelize,
  }),
};

//start server
const app = express();
const PORT = process.env.PORT || 3003;

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(session(sess));

//controllers
app.use("/", controller);

//renders handlebars
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log(`Now listening on port ${PORT}`));
});
