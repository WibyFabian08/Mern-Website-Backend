const Category = require("../../model/Category");
const Image = require("../../model/Image");
const Item = require("../../model/Item");

exports.itemView = async (req, res, next) => {
  const category = await Category.find();
  res.render("admin/item", {
    title: "List Item Page",
    category: category
  });
};

exports.itemAdd = async (req, res) => {
    try {
        const title = req.body.title;
        const city = req.body.city;
        const country = req.body.country;
        const category = req.body.category;
        const description = req.body.description;
        const price = req.body.price;
        const popular = req.body.popular;
    
        const newItem = {
            title: title,
            city: city,
            country: country,
            category: category,
            description: description,
            price: price,
            isPopular: popular
        }
    
        const item = await Item.create(newItem);
     
        // insert image ke Image
        for(let i = 0; i < req.files.length; i++) {
            const imageSave = await Image.create({imageUrl: `images/${req.files[i].filename}`});
            item.imageId.push({_id: imageSave._id})
            await item.save();
        }
        res.redirect("/admin/item");
    } catch(error) {
        console.log(error)
        res.redirect("/admin/item");
    }

};
