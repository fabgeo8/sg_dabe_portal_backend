'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

      return queryInterface.sequelize.transaction(t => {
        return Promise.all([
          queryInterface.addColumn('PvApplications', 'cleared', {
            type: Sequelize.DataTypes.BOOLEAN,
            defaultValue: false
          }, { transaction: t }),
          queryInterface.addColumn('PvApplications', 'cleared_date', {
            type: Sequelize.DataTypes.DATEONLY,
          }, { transaction: t })
        ]);
      });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('PvApplications', 'cleared', { transaction: t }),
        queryInterface.removeColumn('PvApplications', 'cleared_date', { transaction: t })
      ]);
    });
  }
};
