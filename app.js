//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");

const app = express();

const mongoose = require("mongoose");

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// const items = ["Buy Food", "Cook Food", "Eat Food"];
const workItems = [];

mongoose.connect("mongodb://localhost:27017/todoListDB",{useNewUrlParser: true}, {useUnifiedTopology: true });

const itemSchema = {
  name : String
};

const listSchema = {
  name : String,
  items : [itemSchema] 
};

const Item = mongoose.model("Item",itemSchema);

const List = mongoose.model("List",listSchema);

let buy = new Item({
  name : "Buy"
});

let cook = new Item({
  name : "cook"
});

let eat = new Item({
  name : "Eat"
});

arrItems = [buy,cook,eat];

app.get("/", function(req, res) {

  Item.find({},(err,foundItems)=> {

    if(foundItems.length == 0){
      Item.insertMany(arrItems,(err)=>{
        if(err) {
          console.log(err);
        } else {
          console.log("success");
        }
      });
      res.redirect("/");
    } else {  
    if(err){
      console.log(err);
    } else {
      res.render("list", {listTitle: "Today", newListItems: foundItems});
    }
  }
  });
});

app.get("/:name",(req,res)=> {
  const customName = _.capitalize(req.params.name);

  List.findOne({name:customName},(err,customList)=>{
    if(!err){
      if(!customList) {
        const newListItem = new List({
          name : customName,
          items : arrItems
        });
        newListItem.save();
        res.redirect("/" + newListItem.name);
      } else {
        res.render("list",{listTitle : customList.name, newListItems : customList.items});
      }
    }
  });

});

app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const listName = req.body.list;

  const newItem = new Item({
    name:itemName
  });

  if(listName == "Today"){
    newItem.save();
    res.redirect("/");
  } else {
    List.findOne({name:listName},(err,foundList)=>{
      foundList.items.push(newItem);
      foundList.save();
      res.redirect("/"+ foundList.name );
    });
    }
});

app.post("/delete", (req,res)=> {
  const id = req.body.checkbox;
  const listName = req.body.listName;

  if(listName == "Today") {
    Item.remove({_id : id},(err,removed)=> {
      if(err){
        console.log(err);
      } else {
        console.log(removed);
        console.log("deleted sucess");
        res.redirect("/");
      }
    });
  } else {
    List.findOneAndUpdate({name : listName},{$pull:{items:{_id : id}}},(err,foundList)=> {
      if(!err) {
        res.redirect("/"+ listName );
      }
    });

  }

});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});