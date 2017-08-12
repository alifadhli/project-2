module.exports = function(sequelize, Sequelize) {
	return sequelize.define('restaurant', {
		name: Sequelize.STRING,
		lastname: Sequelize.STRING,
		email: Sequelize.STRING,
		phone: Sequelize.STRING,
		restaurant: Sequelize.STRING,
		restaurantWeb: Sequelize.STRING,
		restaurantCity: Sequelize.STRING,
		restaurantZip: Sequelize.STRING,
		mobile: Sequelize.STRING
	})
}