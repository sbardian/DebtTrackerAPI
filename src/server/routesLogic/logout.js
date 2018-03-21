export const logout = (req, res) => {
  console.log('Session = ', req.session);
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        return res
          .status(400)
          .json({ error: true, message: 'Error logging out.' });
      }
      return res
        .status(200)
        .json({ error: false, message: 'You have successfully logged out.' })
        .end();
    });
  }
};
