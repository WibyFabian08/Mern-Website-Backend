const Category = require("../../model/Category");

exports.categoryView = (req, res) => {
  Category.find()
    .then((result) => {
      res.render("admin/category", {
        data: result,
        message: req.flash("message"),
        title: "Category Page",
        status: req.flash("status"),
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.addCategory = async (req, res) => {
  try {
    const category = new Category({
      name: req.body.name,
    });

    const duplikat = await Category.findOne({ name: req.body.name });

    if (duplikat) {
      req.flash("message", "Category Already On The List");
      req.flash("status", "danger");

      return res.redirect("/admin/category");
    } else {
      await category.save();
      req.flash("message", "Add Category Success");
      req.flash("status", "success");

      res.redirect("/admin/category");
    }
  } catch (error) {
    if (error) {
      req.flash("message", "Please Input A Category!!!");
      req.flash("status", "danger");
      res.redirect("/admin/category");
    }
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const id = req.body.id;
    await Category.deleteOne({ _id: id });

    req.flash("message", "Delete Category Success");
    req.flash("status", "success");
    res.redirect("/admin/category");
  } catch (error) {
    if (error) {
      req.flash("message", "Delete Category Failde");
      req.flash("status", "danger");
      res.redirect("/admin/category");
    }
  }
};

exports.editCategory = async (req, res) => {
  try {
    const name = req.body.name;
    const id = req.body.id;

    const category = await Category.findOne({ _id: id });

    const duplikat = await Category.findOne({ name: name });

    if (duplikat) {
      req.flash("message", "Category Already Taken, Update Failed!!");
      req.flash("status", "success");
      res.redirect("/admin/category");
    } else {
      category.name = name;

      await category.save();

      req.flash("message", "Update Category Success");
      req.flash("status", "success");
      res.redirect("/admin/category");
    }
  } catch (error) {
    if (error) {
      req.flash("message", "Please Input A Category!!!");
      req.flash("status", "danger");
      res.redirect("/admin/category");
    }
  }
};
