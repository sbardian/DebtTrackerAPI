const Total = require('../models/Total');

export const getTotals = (req, res) => {
  let response = {};
  // console.log('req  >>>  ', req.session);
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
  const db = new Total();
  let response = {};
  if (!(req.session.userId && req.body.user && req.body.total)) {
    return res.status(400).json({
      error: true,
      message: 'Error adding data',
    });
  }
  db.userId = req.session && req.session.userId;
  db.user = req.body.user;
  db.total = req.body.total;
  db.save(err => {
    if (err) {
      return res
        .status(400)
        .json({ error: true, message: 'Error adding data' });
    }
    response = {
      error: false,
      message: 'Data added',
      id: db.id,
      updated_at: db.updated_at,
      v: db.v,
    };
    return res.json(response);
  });
};

export const deleteTotal = (req, res) => {
  let response = {};
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
      response = {
        error: false,
        message: `Data associated with ${req.params.id} is deleted`,
        data,
      };
      res.json(response);
    });
  });
};
