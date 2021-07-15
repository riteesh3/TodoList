const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = ['Buy','Cook','Eat'];
let workItems = [];
app.get("/",(req,res)=> {
    
    var today = new Date();
    
    var options = {
        weekday : "long",
        day : "numeric",
        month : "long"
    };

    var day = today.toLocaleDateString("en-US",options);

    res.render('list', {ListTitle : day,AddItems : items});
});

app.post("/",(req,res)=> {

    item = req.body.Newitem;
    if(req.body.list == "Work") {
        workItems.push(item);
        res.redirect("/work");        
    } else {
    items.push(item);
    res.redirect("/");
    }
});

app.get("/work",(req,res)=> {
    res.render('list',{ListTitle: "Work",AddItems: workItems });
});

app.get("/about",(req,res)=> {
    res.render("about");
});

app.post("/work",(req,res)=> {
    item = req.body.Newitem;
    workItems.push(item);
    res.redirect("/work");
});

app.listen(3000, ()=> {
    console.log("server started on port 3k");
});