exports.itemView = (req, res, next) => {
    res.render('admin/item', {
        title: 'List Item Page'
    });
}