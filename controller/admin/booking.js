exports.bookingView = (req, res, next) => {
    res.render('admin/booking', {
        title: 'Booking Page'
    });
}