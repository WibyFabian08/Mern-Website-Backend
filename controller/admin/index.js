exports.dahsboardView = (req, res, next) => {
    res.render('admin/dashboard', {
        title: 'Dashboard Page'
    });
}
