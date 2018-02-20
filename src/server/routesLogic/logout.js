export const logout = (req, res, next) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        return next(err);
      }
      return res.status(200).end();
    });
  }
};
