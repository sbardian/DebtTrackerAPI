const Total = require('../models/Total');

export const getTotals = (req, res) => {
  let response = {};
  Total.find({ userId: req.session.userId }, (err, data) => {
    if (err) {
      response = { error: true, message: 'Error fetching data' };
    } else {
      response = { error: false, message: data };
    }
    res.json(response);
  }).sort([['updated_at', 'descending']]);
};

export const addTotal = (req, res) => {
  const db = new Total();
  let response = {};
  db.userId = req.session.userId;
  db.user = req.body.user;
  db.total = req.body.total;
  db.save(err => {
    if (err) {
      response = { error: true, message: 'Error adding data' };
    } else {
      response = {
        error: false,
        message: 'Data added',
        id: db.id,
        updated_at: db.updated_at,
        v: db.v,
      };
    }
    res.json(response);
  });
};

export const deleteTotal = (req, res) => {
  let response = {};
  Total.findById(req.params.id, err => {
    if (err) {
      response = { error: true, message: 'Error fetching data' };
    } else {
      Total.remove({ _id: req.params.id }, () => {
        if (err) {
          response = { error: true, message: 'Error deleting data' };
        } else {
          response = {
            error: false,
            message: `Data associated with ${req.params.id} is deleted`,
          };
        }
        res.json(response);
      });
    }
  });
};
