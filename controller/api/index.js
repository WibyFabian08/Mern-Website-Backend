const Activity = require("../../model/Activity");
const Item = require("../../model/Item");
const Customer = require("../../model/Customer");
const Category = require("../../model/Category");
const Bank = require("../../model/Bank");
const Booking = require("../../model/Booking");

exports.landingPage = async (req, res) => {
  try {
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

    for (let i = 0; i < categories.length; i++) {
      for (let j = 0; j < categories[i].itemId.length; j++) {
        const item = await Item.findOne({ _id: categories[i].itemId[j]._id });
        item.isPopular = false;
        await item.save();

        if (categories[i].itemId[0] == categories[i].itemId[j]) {
          item.isPopular = true;
          await item.save();
        }
      }
    }

    const hero = {
      cities: cities,
      treasures: treasures,
      trevelers: trevelers,
    };

    res.status(200).json({
      status: "ok",
      hero: hero,
      mostPicked: mostPicked,
      categories: categories,
    });
  } catch (error) {
    if (error) {
      res.status(500).json({
        status: "error",
        message: "Something went wrong",
      });
    }
  }
};

exports.detailItem = async (req, res) => {
  const item = await Item.findOne({ _id: req.params.id })
    .select(
      "_id title type imageId country city price unit isPopular description facilityId activityId"
    )
    .populate({ path: "facilityId", select: "_id name qty imageUrl" })
    .populate({ path: "activityId", select: "_id name type imageUrl" })
    .populate({ path: "imageId", select: "imageUrl" });

  const bank = await Bank.find();

  res.status(200).json({
    status: "ok",
    item: item,
    bank: bank
  });
};

exports.booking = async (req, res) => {
  const item = await Item.findOne({_id: req.body.id})

  if(!item) {
    res.status(404).json({
      status: 'error',
      meesage: 'item not found'
    })
  }

  item.sumBooking += 1;

  await item.save();

  const customer = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
  }

  await Customer.create(customer);

  const invoice = Math.floor(1000000 + Math.random() * 9000000);

  let total = (req.body.duration * item.price);
  let tax = total * 0.10;

  if(!req.file) {
    res.status(500).json({
      status: 'error',
      message: 'please upload transfer proof'
    })
  }
  
  const newBooking = {
    bookingStartDate: new Date(req.body.bookingStartDate),
    bookingEndDate: new Date(req.body.bookingEndDate),
    invoice: invoice,
    item: {
      _id: item._id,
      title: item.title,
      price: item.price,
      duration: req.body.duration
    },
    total: total + tax,
    customerId: customer._id,
    payments: {
      transferProof: `images/${req.file.filename}`,
      transferFrom: req.body.transferFrom,
      transferFromBank: req.body.transferFromBank
    }
  }

  await Booking.create(newBooking)

  res.status(200).json({
    status: "oke",
    message: "booking success",
    booking: newBooking,
  });
};
