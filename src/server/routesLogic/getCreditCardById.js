const CreditCard = require('../models/CreditCard');

export const getCreditCardByID = (req, res) => {
  let response = {};
  CreditCard.findById(req.params.id, (err, data) => {
    if (err) {
      response = { error: true, message: 'Error fetching data' };
    } else {
      response = { error: false, message: data };
    }
    res.json(response);
  });
};
