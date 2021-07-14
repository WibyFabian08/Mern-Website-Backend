exports.dahsboardView = (req, res, next) => {
    res.render('admin/dashboard');
}

exports.categoryView = (req, res, next) => {
    res.render('admin/category');
}

exports.bankView = (req, res, next) => {
    res.render('admin/bank');
}

exports.itemView = (req, res, next) => {
    res.render('admin/item');
}

exports.bookingView = (req, res, next) => {
    res.render('admin/booking');
}