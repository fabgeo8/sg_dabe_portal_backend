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
        queryInterface.addColumn('PvApplications', 'fee_amount_municipality', {
          type: Sequelize.DataTypes.FLOAT,
          defaultValue: 0
        }, { transaction: t }),
        queryInterface.addColumn('PvApplications', 'fee_amount_canton', {
          type: Sequelize.DataTypes.FLOAT,
          defaultValue: 0
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
        queryInterface.removeColumn('PvApplications', 'fee_amount_municipality', { transaction: t }),
        queryInterface.removeColumn('PvApplications', 'fee_amount_canton', { transaction: t })
      ]);
    });
  }
};
