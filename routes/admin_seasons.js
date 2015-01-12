var express = require('express');
var router = express.Router();
var models  = require('../models');
var _ = require('underscore');

module.exports = function (access) {
    router.get('/', access.if_logged_in_as_admin(), function (req, res) {
      models.Location.find({where: {name: 'Taganrog'}}).then(function (location) {
        models.Season.findAll({where: {location_id: location.id}}).then(function (seasons) {
          res.render('admin/seasons/index', {
            mainNav: 'admin',
            subNav: 'seasons',
            title: 'Seasons list',
            seasons: seasons
          });
        });
      });
    });

    router.get('/create', access.if_logged_in_as_admin(), function (req, res) {
      res.render('admin/seasons/create', {
        title: 'Create a new season',
        errors: {},
        values: {}
      });
    });

    router.post('/create', access.if_logged_in_as_admin(), function (req, res) {
      // find default location

      models.Location.find({where: {name: 'Taganrog'}}).then(function (location) {
        function updateSeason(req,res){
          models.Season.create({
            name: req.body.name,
            date_started: req.body.date_started,
            date_ended: req.body.date_ended,
            note: req.body.note,
            default: !!req.body.default,
            location_id: location.id
          }).then(function (season) {
            // redirect to seasons list
            req.flash('success', 'The season was added')
            res.redirect('/admin/seasons');
          }).catch(models.Sequelize.ValidationError, function (err) {
            // show errors
            res.render('admin/seasons/create', {
              title: 'Create a new season',
              values: req.body,
              errors: _.object(_.map(err.errors, function (error) { return [error.path, error]; }))
            });
          });
        }
        // create new season
        if (!!req.body.default) {
          models.Season.update({default:false},{where:{default:true}})
          .then(function (seasons) {
            updateSeason(req,res);
          })
          .catch(function(err){
            res.status(400);
          });
        } else {
          models.Season.find({where:'id IS NOT NULL'})
          .then(function (season) {
            if (!season) {
              req.body.default = true;
            }
            updateSeason(req,res);
          })
          .catch(function(err){
            res.status(400);
          });
        }
      });
      
    });

    return router;
};
