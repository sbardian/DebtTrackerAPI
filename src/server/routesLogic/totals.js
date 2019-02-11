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

export const deleteTotal = (req, res) => {
  Total.findById(req.params.id, (err, card) => {
    if (err) {
      return res
        .status(400)
        .json({ error: true, message: 'Error fetching data' });
    }
    Total.remove(
      { _id: req.params.id, userId: req.session.userId },
      (removeError, data) => {
        if (data.n === 0 || removeError) {
          return res
            .status(400)
            .json({ error: true, message: `Error deleting ${card.name} data` });
        }
        return res.json({
          error: false,
          message: `Total has been deleted`,
          data,
        });
      },
    );
  });
};
