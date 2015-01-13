var bcrypt = require('bcrypt');
var schema = require('validate');
'use strict';

module.exports = function(sequelize, DataTypes) {

  // var user = schema({
  //     old_password: {
  //       type: 'string',
  //       required: true,
  //       message: 'Old password is required'
  //     },
  //     new_password: {
  //       type: 'string',
  //       required: true,
  //       match: /(.+){5,}/,
  //       message: 'New password is required and min length is 5 symbols'
  //     },
  //     confirm_new_password: {
  //       type: 'string',
  //       match: /(.+){5,}/,
  //       required: true,
  //       message: 'Confirm New is required and min length is 5 symbols'
  //     }
  //   });


  return sequelize.define('User', {
    username: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    validate: {
        new_password: function (value,done) {
          // if (typeof this.new_password  != 'undefined') {
            if ((this.new_password || "").trim().length < 5) {
              throw new Error('min length 5 symbols');
            }
          // }
        },
        confirm_new_password: function(value,done) {
          // if (typeof this.new_password  != 'undefined') {
            if (this.new_password !=this.confirm_new_password) {
               throw new Error(' Passwords mismatch');
            }
          // }
        },
        old_password: function(value,done) {
          // if (typeof this.old_password  != 'undefined') {
            if ((this.old_password || "").trim().length < 5) {
              throw new Error('Old password required');
            }
            if (!this.validate_password(this.old_password)) {
               throw new Error('Old Passwords wrong');
            } else {
              this.set_password(this.new_password)
            }
          // }
        }
    },
    getterMethods: {
      old_password: function() { return this._old_password},
      new_password: function() { return this._password },
      confirm_new_password: function() { return this._confirm_new_password }
    },
   
    setterMethods: {
      old_password: function(v) { this._old_password = v },
      new_password: function(v) { this._password = v },
      confirm_new_password: function(v) { this._confirm_new_password = v }
    },
    instanceMethods: {
      validate_password: function(password) {
        return bcrypt.compareSync(password, this.password);
      },
      set_password: function(plain_password) {
        var salt = bcrypt.genSaltSync(10);
        this.password = bcrypt.hashSync(plain_password, salt);
        return this;
      }
    }
  });
};
