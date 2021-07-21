const Activity = require("../../model/Activity");
const Item = require("../../model/Item");
const Customer = require("../../model/Customer");
const Category = require("../../model/Category");

exports.landingPage = async (req, res) => {
  const cities = await Item.find().countDocuments();
  const treasures = await Activity.find().countDocuments();
  const trevelers = await Customer.find().countDocuments();

  const mostPicked = await Item.find()
    .select("_id title price unit city country imageId type")
    .populate({ path: "imageId", select: "imageUrl" })
    .limit(5);

  const categories = await Category.find()
    .select("_id name itemId")
    .limit(3)
    .populate({
      path: "itemId",
      select: "_id title imageId country city isPopular",
      option: { sort: { sumBooking: -1 } },
      perDocumentLimit: 4,
      populate: { path: "imageId", select: "imageUrl", perDocumentLimit: 1 },
    });

    for(let i = 0; i < categories.length; i++) {
        for(let j = 0; j < categories[i].itemId.length; j++) {
            const item = await Item.findOne({_id: categories[i].itemId[j]._id});
            item.isPopular = false;
            await item.save()

            if(categories[i].itemId[0] === categories[i].itemId[j]) {
                item.isPopular = true;
                await item.save()
            }
        }
    }

  const hero = {
    cities: cities,
    treasures: treasures,
    trevelers: trevelers,
  };

  res.status(200).json({
    status: "Ok",
    hero: hero,
    mostPicked: mostPicked,
    categories: categories,
  });
};
