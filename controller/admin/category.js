const express = require("express");
const flash = require("connect-flash");

const Category = require("../../model/Category");

const app = express();

app.use(flash());

exports.categoryView = (req, res, next) => {
  Category.find()
    .then((result) => {
      res.render("admin/category", {
        data: result,
        message: req.flash("message"),
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.addCategory = async (req, res, next) => {
  const category = new Category({
    name: req.body.name,
  });

  const duplikat = await Category.findOne({ name: req.body.name });

  if (duplikat) {
    req.flash("message", "Category Already Use");

    return res.redirect("/admin/category");
  } else {
    category
      .save()
      .then((result) => {
        console.log(result);
        req.flash("message", "Add Category Success");

        res.redirect("/admin/category");
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

exports.deleteCategory = (req, res, next) => {
  const id = req.body.id;
  Category.deleteOne({ _id: id })
    .then(() => {
      req.flash("message", "Delete Category Success");
      res.redirect("/admin/category");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.editCategory = async (req, res, next) => {
  const name = req.body.name;
  const id = req.body.id;

  const category = await Category.findOne({ _id: id });

  const duplikat = await Category.findOne({ name: name });

  if(duplikat) {
    req.flash("message", "Category Already Taken, Update Failed!!");
    res.redirect("/admin/category");
  } else {
    category.name = name;
  
    await category.save();

    req.flash("message", "Update Category Success");
    res.redirect("/admin/category");
  }
  
}
