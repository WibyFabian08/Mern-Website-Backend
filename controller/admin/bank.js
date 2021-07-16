const Bank = require("../../model/Bank");
const fs = require("fs");

exports.bankView = async (req, res, next) => {
  const data = await Bank.find();
  res.render("admin/bank", {
    title: "Bank Page",
    data: data,
    message: req.flash("message"),
    status: req.flash("status"),
  });
};

exports.addBank = async (req, res) => {
  try {
    const bank = new Bank({
      nameBank: req.body.nameBank,
      noRekening: req.body.noRekening,
      name: req.body.name,
      imageUrl: `images/${req.file.filename}`,
    });

    req.flash("message", "Add Bank Success");
    req.flash("status", "success");

    await bank.save();

    res.redirect("/admin/bank");
  } catch (error) {
    if (error) {
      req.flash("message", "Add Bank Failed");
      req.flash("status", "danger");
      res.redirect("/admin/bank");
    }
  }
};

exports.deleteBank = async (req, res) => {
  try {
    const id = req.body.id;
    const bank = await Bank.findOne({ _id: id });

    let image = bank.imageUrl;
    const path = `public/${image}`;

    fs.unlink(path, (err) => console.log(err));

    await Bank.deleteOne({ _id: id });

    req.flash("message", "Delete Bank Success");
    req.flash("status", "success");
    res.redirect("/admin/bank");
  } catch (error) {
    if (error) {
      req.flash("message", "Delete Bank Failed");
      req.flash("status", "danger");
      res.redirect("/admin/bank");
    }
  }
};

exports.upadateBank = async (req, res) => {
  try {
    const id = req.body.id;
    const bank = await Bank.findOne({_id: id});
    const oldImage = bank.imageUrl;
    
    bank.name = req.body.name;
    bank.nameBank = req.body.nameBank;
    bank.noRekening = req.body.noRekening;

    if(req.file) {
      bank.imageUrl = `images/${req.file.filename}`;
      const path = `public/${oldImage}`;

      fs.unlink(path, (err) => console.log(err));
    }

    await bank.save();

    req.flash("message", "Update Bank Success");
    req.flash("status", "success");

    res.redirect("/admin/bank");
  } catch (error) {
    if (error) {
      req.flash("message", "Update Bank Failed");
      req.flash("status", "danger");
      res.redirect("/admin/bank");
    }
  }
};
