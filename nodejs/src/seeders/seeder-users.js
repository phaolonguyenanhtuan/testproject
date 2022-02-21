'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    return queryInterface.bulkInsert('Users',[{
        firstName:'nguyen',
        lastName:'tuan',
        email:'admin@gmail.com',
        password:'123456',
        address:'VietNam',
        gender:'1',
        typeRole:'ROLE',
        keyRole:'R1',       

        createdAt: new Date(),
        updatedAt: new Date()

    }]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
