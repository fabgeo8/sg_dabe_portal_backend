'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('GlobalSettings', {
          id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
            primaryKey: true
          },
          setting: {
            type: Sequelize.STRING
          },
          value: {
            type: Sequelize.STRING
          },
          application_type: {
            type: Sequelize.STRING
          },
          createdAt: {
            allowNull: false,
            type: Sequelize.DATE
          },
          updatedAt: {
            allowNull: false,
            type: Sequelize.DATE
          }
        }
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('GlobalSettings');
  }
};