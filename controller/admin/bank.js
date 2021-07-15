exports.bankView = (req, res, next) => {
    res.render('admin/bank', {
        title: 'Bank Page'
    });
}