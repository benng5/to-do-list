//jshint esversion:6
/**
 * A todoList web app using Javascript with Node.js, Express.js, mongoDB, and mongoose
 * Item is a document with the name of a task
 * List is a document with the list's name and an array of item documents
 * Each route parameter creates a new list document
 */

const express = require("express");
const bodyParser = require("body-parser");
//const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
//Connecting to mongoose server
mongoose.connect("mongodb+srv://admin-ben:Test123@cluster0.qlhnglx.mongodb.net/todolistDB");

//Creating item Schema
const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true
  }
});

//Creating a list Schema with an array of items document
const listSchema = new mongoose.Schema({
  name: String,
  items: [itemSchema]
});

//Creating an Item collection followed itemSchema
const Item = mongoose.model("Item", itemSchema);
const List = mongoose.model("List", listSchema);

//Sample items
const item0 = new Item({
  name: "Welcome to your todoList!!!"
});

const item1 = new Item({
  name: "Hit the + button to add a new item."
});

const item2 = new Item({
  name: "<-- Hit this to delete an item."
});

const defaultItems = [item0, item1, item2];

//Handling GET request to root route
app.get("/", function(req, res) {

  //Finding data from Item collection
  Item.find({}, function(err, result) {
    //Handling error
    if (err) {
      console.log(err);
    } else {
      //Adding default items if the found data is empty
      if(result.length === 0) {
        Item.insertMany(defaultItems, function(err) {
          if(err) {
            console.log(err);
          }
          else {
            console.log("Insertion Successfully.");
          }
        });
        //Redirecting back to root route (refreshing the page)
        res.redirect("/");
      }
      //Rendering the view for root route
      res.render("list", {
        listTitle: "Today",
        //Passing result array as an argument to ejs parameter
        newListItems: result
      });
    }
  });
});

/**
 * If it's a new list name, Express's route parameter creates a new list document
 * then initializes it by adding default item.
 * Otherwise, the function will find the existing matched name list
 * the display it to viewer.
 * @param: list's name
 * @return: Rendering a new list or displaying an existing list.
 */
app.get("/:customListName", function(req, res) {
  const customListName = _.capitalize(req.params.customListName);
  //Finding a collection matched with customListName
  List.findOne({name: customListName}, function(err, foundList) {
    //No errors
    if(!err) {
      //Not found the matched name document
      if(!foundList) {
        //Creating a new document (a list with an array of item documents)
        const list = new List({
          name: customListName,
          //Assigning the items array to defaultItems array
          items: defaultItems
        });
        //Saving the new document to the collection
        list.save();
        res.redirect("/" + customListName);
      }
      //Found the matched name document
      else {
        //Displaying the exisiting list with matched name
        res.render("list", {
          listTitle: foundList.name,
          newListItems: foundList.items
        });
      }
    }
  });
});

app.post("/", function(req, res){
  //New Item's name
  const itemName = req.body.newItem;
  //Saving the listName, which is document's name
  const listName = req.body.list;

  //Creating a new item document
  const item = new Item({
    name: itemName
  });

  //Checking if it's the default list
  if(listName === "Today") {
    //Saving the new item into the database
    item.save();
    res.redirect("/");
  }
  else {
    //Finding the document in List collection with matched name
    List.findOne({name: listName}, function(err, result) {
      if(!err) {
        //Adding the new item to the array of items document
        result.items.push(item);
        //Saving the found document with the new item in the array of items document
        result.save();
        res.redirect("/" + listName);
      }
    });
  }
});

/**
 * Delete an item that has the checkbox checked
 */
app.post("/delete", function(req, res) {
  //Saving the listName, which is document's name
  const listName = req.body.list;
  const itemId = req.body.checkbox;

  //The default list
  if(listName == "Today") {
    //Finding a document by its Id and delete it
    Item.findByIdAndRemove(itemId, function(err) {
      if(err) {
        console.log(err);
      }
      else {
        console.log("Deletion Successfully.");
        res.redirect("/" + listName);
      }
    });
  }

  //Customized list
  else {
    //Find the item in the listName and delete it
    List.findOneAndUpdate(
      //Condition
      {name: listName},
      //Update = {$pull: {field: {condition(query)}}}
      { $pull: {items: {_id: itemId}}},
      function(err, result){
        if(!err) {
          res.redirect("/" + listName);
        }
      }
    );
  }
});

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server started successfully");
});
