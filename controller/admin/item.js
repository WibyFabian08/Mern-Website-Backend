const Category = require("../../model/Category");
const Image = require("../../model/Image");
const Item = require("../../model/Item");
const Facility = require("../../model/Facility");
const Activity = require("../../model/Activity");
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

    // push itemId to caregoty
    category.itemId.push(item._id);
    await category.save();

    req.flash("message", "Add Item Success");
    req.flash("status", "success");
    res.redirect("/admin/item");
  } catch (error) {
    req.flash("message", `Add Item Failed ${error.message}`);
    req.flash("status", "danger");
    res.redirect("/admin/item");
  }
};

exports.itemDelete = async (req, res) => {
  try {
    const id = req.body.id;

    const item = await Item.findOne({ _id: id });
    const activity = await Activity.find({ itemId: item._id });
    const facility = await Facility.find({ itemId: item._id });
    const category = await Category.find({ _id: item.categoryId }).select('itemId');
    let updateCategory = await Category.findOne({ _id: item.categoryId });
    const images = item.imageId;
    let newId = [];

    // for(let i = 0; i < category.length; i++) {
    //   for(let j = 0; j < category[i].itemId.length; j++) {
    //     if(category[i].itemId[j] != id) {
    //       newId.push(category[i].itemId[j])
    //     }
    //   }
    // }

    for(let i = 0; i < updateCategory.itemId.length; i++) {
      if(updateCategory.itemId[i] != id) {
        newId.push(updateCategory.itemId[i])
      }
    }

    // delete itemId from category
    updateCategory.itemId = newId;
    await updateCategory.save()

    // delete facility
    for (let i = 0; i < facility.length; i++) {
      console.log(facility[i]._id)
      let path = `public/${facility[i].imageUrl}`;
      fs.unlink(path, (err) => console.log(err));
      await Facility.deleteMany({ _id: facility[i]._id });
    }

    // delete activity
    for (let i = 0; i < activity.length; i++) {
      let path = `public/${activity[i].imageUrl}`;
      fs.unlink(path, (err) => console.log(err));
      await Activity.deleteMany({ _id: activity[i]._id });
    }

    // delete iamge
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
      req.flash("message", `Delete Item Failed ${error.message}`);
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
    req.flash("message", `Delete Image Failed ${error.message}`);
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
      req.flash("message", `Edit Item Failed ${error.message}`);
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
      req.flash("message", `Add Facility Failed ${error.message}`);
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
      req.flash("message", `Delete Activity Failed ${error.message}`);
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
    req.flash("message", `Update Facility Failed ${error.message}`);
    req.flash("status", "danger");
    res.redirect(`/admin/item/facility/${req.body.params}`);
  }
};

exports.showActivity = async (req, res) => {
  const activity = await Activity.find({ itemId: req.params.id });
  res.render("./admin/item/detail/activity", {
    title: "Item Activity",
    params: req.params.id,
    status: req.flash("status"),
    message: req.flash("message"),
    activity: activity,
  });
};

exports.addActivity = async (req, res) => {
  try {
    const item = await Item.findOne({ _id: req.body.params });

    const newActivity = {
      name: req.body.name,
      type: req.body.type,
      isPopular: req.body.popular,
      imageUrl: `images/${req.file.filename}`,
      itemId: item._id,
    };

    const activity = await Activity.create(newActivity);

    item.activityId.push(activity._id);
    await item.save();

    req.flash("message", "Add Activity Success");
    req.flash("status", "success");
    res.redirect(`/admin/item/activity/${req.body.params}`);
  } catch (error) {
    if (error) {
      req.flash("message", `Add Activity Failed ${error.message}`);
      req.flash("status", "danger");
      res.redirect(`/admin/item/activity/${req.body.params}`);
    }
  }
};

exports.deleteActivity = async (req, res) => {
  try {
    const activity = await Activity.findOne({ _id: req.body.id });
    let item = await Item.findOne({ _id: req.body.params });

    await Activity.deleteOne({ _id: activity._id });

    const activityImage = await Activity.find({ itemId: req.body.params });

    const activityId = [];
    for (let i = 0; i < activityImage.length; i++) {
      activityId.push(activityImage[i]._id);
    }

    let path = `public/${activity.imageUrl}`;
    fs.unlink(path, (err) => console.log(err));

    item.activityId = activityId;
    await item.save();

    req.flash("message", "Delete Activity Success");
    req.flash("status", "success");

    res.redirect(`/admin/item/activity/${req.body.params}`);
  } catch (error) {
    if (error) {
      req.flash("message", `Delete Activity Failed ${error.message}`);
      req.flash("status", "danger");
      res.redirect(`/admin/item/activity/${req.body.params}`);
    }
  }
};

exports.updateActivity = async (req, res) => {
  try {
    const activity = await Activity.findOne({ _id: req.body.id });

    activity.name = req.body.name;
    activity.type = req.body.type;
    if (req.body.popular) {
      activity.isPopular = req.body.popular;
    }

    if (req.file) {
      let path = `public/${activity.imageUrl}`;
      fs.unlink(path, (err) => console.log(err));
      activity.imageUrl = `images/${req.file.filename}`;
    }

    await activity.save();

    req.flash("message", "Update Activity Success");
    req.flash("status", "success");
    res.redirect(`/admin/item/activity/${req.body.params}`);
  } catch (error) {
    if (error) {
      req.flash("message", `Delete Activity Failed ${error.message}`);
      req.flash("status", "danger");
      res.redirect(`/admin/item/activity/${req.body.params}`);
    }
  }
};
