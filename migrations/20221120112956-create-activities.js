'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Activities', {
                id: {
                    type: Sequelize.UUID,
                    defaultValue: Sequelize.UUIDV4,
                    allowNull: false,
                    primaryKey: true
                },
                changed_value: {
                    type: Sequelize.STRING
                },
                changed_by: {
                    type: Sequelize.STRING
                },
                activity_text: {
                    type: Sequelize.STRING
                },
                application: {
                    type: Sequelize.STRING
                },
                application_type: {
                    type: Sequelize.STRING
                },
                identifier: {
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
        await queryInterface.dropTable('Activities');
    }
};