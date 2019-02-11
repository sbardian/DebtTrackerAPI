const Total = require('../models/Total');

export const getTotals = (req, res) => {
  Total.find({ userId: req.session && req.session.userId }, (err, data) => {
    if (err) {
      return res
        .status(400)
        .json({ error: true, message: 'Error fetching data' });
    }
    return res.json({ error: false, message: data });
  }).sort([['updated_at', 'descending']]);
};

export const addTotal = (req, res) => {
  if (req.body.user && req.body.total) {
    const db = new Total();
    db.userId = req.session.userId;
    db.total = req.body.total;
    db.save((err, data) => {
      if (err) {
        return res
          .status(400)
          .json({ error: true, message: 'Error adding data' });
      }
      return res.json({
        error: false,
        message: 'Total saved',
        total: data,
      });
    });
  } else {
    return res.status(400).json({
      error: true,
      message: 'Error adding data',
    });
  }
};

// TODO: confirm you can only delete your own totals.
export const deleteTotal = (req, res) => {
  Total.findById(req.params.id, (err, data) => {
    if (err) {
      return res
        .status(400)
        .json({ error: true, message: 'Error fetching data' });
    }
    Total.remove({ _id: req.params.id }, error => {
      if (error) {
        return res
          .status(400)
          .json({ error: true, message: 'Error deleting data' });
      }
      return res.json({
        error: false,
        message: `Total has been deleted`,
        data,
      });
    });
  });
};
