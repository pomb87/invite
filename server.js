const express = require("express");
const app = express();
const sqlite3 = require("sqlite3").verbose();

var bodyparser = require('body-parser');
app.use(bodyparser.json());

app.set("view engine", "ejs");

const path = require("path");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false })); // <--- middleware configuration
app.use('/favicon.ico', express.static('images/favicon.ico'));

const db_name = path.join(__dirname, "data", "guestbook.db");
const db = new sqlite3.Database(db_name, err => {
    if (err) {
        return console.error(err.message);
    }
    console.log("Successful connection to the database 'guestbook.db'");
});

const sql_create = `CREATE TABLE IF NOT EXISTS guestbook (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    NAME VARCHAR(256) NOT NULL,
    TIMESTAMP_RESP DATE,
    MSG VARCHAR(2048)
  );`;

db.run(sql_create, err => {
    if (err) {
        return console.error(err.message);
    }
    console.log("Successful creation of the 'guestbook' table " + sql_create);
});


app.listen(3000, () => {
    console.log("Server started (http://localhost:3000/) !");
});

/*****************GET requests **************/
app.get("/", (req, res) => {
    console.log("get home through /");
    res.render("main");
});

app.get("/home", (req, res) => {
    console.log("get home");
    res.render("main");
});

app.get("/menu", (req, res) => {
    console.log("get menu");
    res.render("menu");
});

app.get("/menu_expanded", (req, res) => {
    console.log("get menu_expanded");
    res.render("menu_expanded");
});

app.get("/gallery", (req, res) => {
    console.log("get gallery");
    res.render("gallery");
});

app.get("/weddingAbc", (req, res) => {
    console.log("get weddingAbc");
    res.render("weddingAbc");
});

app.get("/guestbook", (req, res) => {
    console.log("get guestbook");
    const sql = "SELECT * FROM GUESTBOOK ORDER BY TIMESTAMP_RESP desc";
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error(err.message);
            res.render("error", {
                model:
                    {}
            });
        }
        res.render("guestbook", { model: rows });
    });

    /*console.log("get guestbook");
    res.render("guestbook", {
        model: {}
    });*/
});

app.get("/guestbook_input", (req, res) => {
    console.log("get guestbook_input");
    res.render("guestbook_input", {
        model: {}
    });
});

app.get("/timeline", (req, res) => {
    console.log("get timeline");
    res.render("timeline", {
        model: {}
    });
});

app.get("/info", (req, res) => {
    console.log("get info");
    res.render("info", {
        model: {}
    });
});

/**************** Error Page **************/
app.get("/error", (req, res) => {
    console.log("get error page");
    res.render("error");
});

// Route not found (404)
/*app.use(function (req, res, next) {
    console.log("page not found");
    res.render("notfound");
});*/

/*****************POST requests **************/

app.post("/saveEntry", (req, res) => {
    console.log("saveEntry1");
    forwardTo("guestbook_entry", "guestbook", req, res);
});

function forwardTo(urlFrom, renderUrl, req, res) {
    console.log("forward to post " + urlFrom);
    /** name is filled on first step */
     insertAndForwardGuestbook(renderUrl, req, res);
}

function insertAndForwardGuestbook(renderUrl, req, res) {
    var address = "" + req.body.address1 + " - " + req.body.address2;
    const sql = "INSERT INTO guestbook (NAME, MSG, TIMESTAMP_RESP) VALUES (?,?,strftime('%Y-%m-%d %H-%M-%S','now'))";
    const insert = [req.body.name, req.body.message];
    db.run(sql, insert, err => {
        if (err) {
            console.log("ERROR - " + err);
            res.render("error", {
                model:
                    {}
            });
        } else {
            console.log("INSERT of - name = " + req.body.name + " message = " + req.body.message);
            /*res.render(renderUrl, {
                model:
                    {}
            });*/
            const sql = "SELECT * FROM GUESTBOOK ORDER BY TIMESTAMP_RESP desc";
            db.all(sql, [], (err, rows) => {
                if (err) {
                    console.error(err.message);
                    res.render("error", {
                        model:
                            {}
                    });
                }
                res.render("guestbook", { model: rows });
            });
        }
    });
}
