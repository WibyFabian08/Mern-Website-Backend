const Category = require("../../model/Category");
const Image = require("../../model/Image");
const Item = require("../../model/Item");
const fs = require("fs");

exports.itemView = async (req, res, next) => {
  const data = await Item.find();
  const category = await Category.find();
  res.render("admin/item", {
    title: "List Item Page",
    category: category,
    data: data,
    message: req.flash("message"),
    status: req.flash("status"),
  });
};

exports.itemAdd = async (req, res) => {
  try {
    const category = await Category.findOne({ _id: req.body.category });
    console.log(category);
    const newItem = {
      title: req.body.title,
      city: req.body.city,
      country: req.body.country,
      categoryId: category._id,
      description: req.body.description,
      price: req.body.price,
      isPopular: req.body.popular,
    };

    const item = await Item.create(newItem);

    // insert image ke Image
    for (let i = 0; i < req.files.length; i++) {
      const imageSave = await Image.create({
        imageUrl: `images/${req.files[i].filename}`,
        itemId: item._id,
      });
      item.imageId.push({ _id: imageSave._id });
      await item.save();
    }
    req.flash("message", "Add Item Success");
    req.flash("status", "success");
    res.redirect("/admin/item");
  } catch (error) {
    console.log(error);
    req.flash("message", "Add Item Failed");
    req.flash("status", "danger");
    res.redirect("/admin/item");
  }
};

exports.itemDelete = async (req, res) => {
  try {
    const id = req.body.id;

    const item = await Item.findOne({ _id: id });
    const images = item.imageId;

    for (let i = 0; i < images.length; i++) {
      const imageDelete = await Image.find({ _id: images[i] });
      for (let j = 0; j < imageDelete.length; j++) {
        let path = `public/${imageDelete[j].imageUrl}`;
        fs.unlink(path, (err) => console.log(err));
        await Image.deleteMany({ _id: images[i] });
      }
    }

    await Item.deleteOne({ _id: id });
    req.flash("message", "Delete Item Success");
    req.flash("status", "success");
    res.redirect("/admin/item");
  } catch (error) {
    if (error) {
      req.flash("message", "Delete Item Failed");
      req.flash("status", "danger");
      res.redirect("/admin/item");
    }
  }
};

exports.itemEdit = async (req, res) => {
  const id = req.params.id;
  const category = await Category.find();
  const item = await Item.findOne({ _id: id });
  const categoryId = await Category.findOne({ _id: item.categoryId });

  let images;
  for (let i = 0; i < item.imageId.length; i++) {
    const poto = await Image.find({ _id: item.imageId });
    images = poto;
  }

  res.render("admin/item/editItem", {
    title: "Edit Item",
    category: category,
    item: item,
    categoryId: categoryId,
    images: images,
  });
};

exports.deleteImage = async (req, res) => {
  try {
    const imageId = req.body.image;
    const id = req.body.id;

    let item = await Item.findOne({ _id: id });
    const imageUpdate = [];

    const imageDeleted = await Image.findOne({ _id: imageId });

    let path = `public/${imageDeleted.imageUrl}`;
    fs.unlink(path, (err) => console.log(err));

    await Image.deleteOne({ _id: imageDeleted._id });

    const image = await Image.find({ itemId: id });
    for (let i = 0; i < image.length; i++) {
      imageUpdate.push(image[i]._id);
    }

    item.imageId = imageUpdate;
    await item.save();

    res.redirect("/admin/item");
  } catch (error) {
    res.redirect("/admin/item");
  }
};

exports.updateItem = async (req, res) => {
  const category = await Category.findOne({ _id: req.body.category });
  let item = await Item.findOne({ _id: req.body.id });

  item.title = req.body.title;
  item.city = req.body.city;
  item.country = req.body.country;
  item.categoryId = req.body.category;
  item.description = req.body.description;
  item.price = req.body.price;
  item.isPopular = req.body.popular;

  if (req.files.length > 0) {
    console.log(req.files);
    // insert image ke Image
    for (let i = 0; i < req.files.length; i++) {
      const imageSave = await Image.create({
        imageUrl: `images/${req.files[i].filename}`,
        itemId: item._id,
      });
      item.imageId.push({ _id: imageSave._id });
    }
  }

  console.log(item);
  console.log(category);
  await item.save();

  res.redirect("/admin/item");
};
