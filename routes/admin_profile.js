var express = require('express');
var router = express.Router();
var models  = require('../models');
var _ = require('underscore');

module.exports = function (access) {
    router.get('/', access.if_logged_in_as_admin(), function (req, res) {
        res.render('admin/profile/index', {
          mainNav: 'profile',
          title: 'Profile',
          layout_type: 'profile'
        });
    });

    router.get('/change_password', access.if_logged_in_as_admin(), function (req, res) {
        res.render('admin/profile/change_password', {
          mainNav: 'profile',
          subNav: 'change_password',
          title: 'Change Password',
          layout_type: 'profile',
          values: {},
          errors: {}
        });
    });


    router.post('/change_password', access.if_logged_in_as_admin(), function (req, res) {
          models.User.find({ where: {username: 'admin'} })
            .then(function (user) {
              
              user.old_password = req.body.old_password;
              user.new_password = req.body.new_password;
              user.confirm_new_password = req.body.confirm_new_password;

              user.save().
              then(function (season) {
                // redirect to profile page
                req.flash('success', 'The password has updated');
                res.redirect('/admin/profile');
              })
              .catch(models.Sequelize.ValidationError, function (err) {
                console.log('err',err)
                res.render('admin/profile/change_password', {
                  mainNav: 'profile',
                  subNav: 'change_password',
                  title: 'Change Password',
                  layout_type: 'profile',
                  values: {},
                  errors: _.object(_.map(err.errors, function (error) { return [error.path, error]; }))
                });
              })
            })
            .catch(function (err) {
              console.log('err !',err);
            });


    });

    router.get('/properties', access.if_logged_in_as_admin(), function (req, res) {
        res.render('admin/profile/properties', {
          mainNav: 'profile',
          subNav: 'properties',
          title: 'Properties',
          layout_type: 'profile'
        });
    });

    return router;
  }