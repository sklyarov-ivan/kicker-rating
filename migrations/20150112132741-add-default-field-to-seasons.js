"use strict";

module.exports = {
  up: function(migration, DataTypes, done) {
    migration.addColumn(
      'seasons',
      'default',
      {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: null
      }
    ).finally(done);
  },
  down: function(migration, DataTypes, done) {
    migration.removeColumn('seasons', 'default').finally(done);
  }
};
