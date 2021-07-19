const Customer = require('../../model/Customer');
const Item = require('../../model/Item');
const Bank = require('../../model/Bank');
const Booking = require('../../model/Booking');

exports.dahsboardView = async (req, res) => {
    const customer = await Customer.find();
    const item = await Item.find();
    const bank = await Bank.find();
    const booking = await Booking.find();

    res.render('admin/dashboard', {
        title: 'Dashboard Page',
        customer: customer,
        item: item,
        bank: bank,
        booking: booking,
    });
}
