const Category = require("../../model/Category");
const Image = require("../../model/Image");
const Item = require("../../model/Item");
const Facility = require("../../model/Facility");
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
    message: req.flash("message"),
    status: req.flash("status"),
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
    req.flash("message", "Delete Image Success");
    req.flash("status", "success");
    res.redirect(`/admin/item/${id}`);
  } catch (error) {
    req.flash("message", "Delete Image Failed");
    req.flash("status", "danger");
    res.redirect(`/admin/item/${id}`);
  }
};

exports.updateItem = async (req, res) => {
  try {
    const category = await Category.findOne({ _id: req.body.category });
    let item = await Item.findOne({ _id: req.body.id });

    item.title = req.body.title;
    item.city = req.body.city;
    item.country = req.body.country;
    item.categoryId = category._id;
    item.description = req.body.description;
    item.price = req.body.price;
    item.isPopular = req.body.popular;

    if (req.files.length > 0) {
      // insert image ke Image
      for (let i = 0; i < req.files.length; i++) {
        const imageSave = await Image.create({
          imageUrl: `images/${req.files[i].filename}`,
          itemId: item._id,
        });
        item.imageId.push({ _id: imageSave._id });
      }
    }

    await item.save();

    req.flash("message", "Edit Item Success");
    req.flash("status", "success");

    res.redirect(`/admin/item/${req.body.id}`);
  } catch (error) {
    if (error) {
      req.flash("message", "Edit Item Failed");
      req.flash("status", "danger");

      res.redirect(`/admin/item/${req.body.id}`);
    }
  }
};

exports.showFacility = async (req, res) => {
  try {
    const facility = await Facility.find({ itemId: req.params.id });

    res.render("./admin/item/detail/facility", {
      title: "Facility Item",
      message: req.flash("message"),
      status: req.flash("status"),
      params: req.params.id,
      facility: facility,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.addFacility = async (req, res) => {
  try {
    const item = await Item.findOne({ _id: req.body.params });

    const facility = {
      name: req.body.name,
      qty: req.body.quantity,
      imageUrl: `images/${req.file.filename}`,
      itemId: item._id,
    };

    const FacilityCreate = await Facility.create(facility);
    item.facilityId.push(FacilityCreate._id);
    await item.save();

    req.flash("message", "Add Facility Success");
    req.flash("status", "success");

    res.redirect(`/admin/item/facility/${req.body.params}`);
  } catch (error) {
    if (error) {
      req.flash("message", "Add Facility Failde");
      req.flash("status", "danger");
      res.redirect(`/admin/item/facility/${req.body.params}`);
    }
  }
};

exports.deleteFacility = async (req, res) => {
  try {
    const facility = await Facility.findOne({ _id: req.body.id });
    let item = await Item.findOne({ _id: req.body.params });

    await Facility.deleteOne({ _id: req.body.id });

    const facilityImage = await Facility.find({ itemId: req.body.params });

    const facilityId = [];
    for (let i = 0; i < facilityImage.length; i++) {
      facilityId.push(facilityImage[i]._id);
    }

    let path = `public/${facility.imageUrl}`;
    fs.unlink(path, (err) => console.log(err));

    item.facilityId = facilityId;
    await item.save();

    req.flash("message", "Delete Facility Success");
    req.flash("status", "success");
    res.redirect(`/admin/item/facility/${req.body.params}`);
  } catch (error) {
    if (error) {
      req.flash("message", "Delete Facility Failed");
      req.flash("status", "danger");
      res.redirect(`/admin/item/facility/${req.body.params}`);
    }
  }
};

exports.updateFacility = async (req, res) => {
  try {
    const facility = await Facility.findOne({ _id: req.body.id });

    if (req.file) {
      let path = `public/${facility.imageUrl}`;
      fs.unlink(path, (err) => console.log(err));
    }

    facility.name = req.body.name;
    facility.qty = req.body.quantity;
    facility.imageUrl = `images/${req.file.filename}`;

    await facility.save();
    req.flash("message", "Update Facility Success");
    req.flash("status", "success");
    res.redirect(`/admin/item/facility/${req.body.params}`);
  } catch (error) {
    req.flash("message", "Update Facility Failed");
    req.flash("status", "danger");
    res.redirect(`/admin/item/facility/${req.body.params}`);
  }
};
