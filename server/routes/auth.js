const express = require('express');
const passport = require('passport');
const router = express.Router();

// Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', {
  failureRedirect: `${process.env.CLIENT_ORIGIN}/login`
}), (req, res) => {
  res.redirect(process.env.CLIENT_ORIGIN || 'http://localhost:3000');
});

// GitHub
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get('/github/callback', passport.authenticate('github', { failureRedirect: `${process.env.CLIENT_ORIGIN}/login` }),
  (req, res) => res.redirect(process.env.CLIENT_ORIGIN || 'http://localhost:3000'));

// Facebook
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: `${process.env.CLIENT_ORIGIN}/login` }),
  (req, res) => res.redirect(process.env.CLIENT_ORIGIN || 'http://localhost:3000'));

// Logout
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.clearCookie('connect.sid');
    res.redirect(process.env.CLIENT_ORIGIN || '/');
  });
});

module.exports = router;
