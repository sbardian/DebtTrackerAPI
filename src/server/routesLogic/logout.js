export const logout = (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        return res
          .status(400)
          .json({ error: true, message: 'Error logging out' });
      }
      return res
        .status(200)
        .json({ error: false, message: 'Logout successful' })
        .end();
    });
  }
};
