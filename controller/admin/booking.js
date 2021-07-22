const Booking = require('../../model/Booking');

exports.bookingView = async (req, res) => {
    const booking = await Booking.find();

    res.render('admin/booking', {
        title: 'Booking Page',
        booking: booking
    });
}

exports.detailBooking = async (req, res) => {

    const booking = await Booking.findOne({_id: req.params.id})

    res.render('admin/booking/detail', {
        title: 'Detail Booking',
        booking: booking
    });
}

exports.upDateBookingSuccess = async (req, res) => {
    const booking = await Booking.findOne({_id: req.params.id})

    booking.payments.status = 'Success';

    await booking.save();

    res.redirect(`/admin/booking/${req.params.id}`)
}

exports.upDateBookingReject = async (req, res) => {
    const booking = await Booking.findOne({_id: req.params.id})

    booking.payments.status = 'Failed';

    await booking.save();

    res.redirect(`/admin/booking/${req.params.id}`)
}