module.exports = function(sequelize, Sequelize) {
	return sequelize.define('user', {
		name: Sequelize.STRING,
		lastname: Sequelize.STRING,
		email: Sequelize.STRING,
		password: Sequelize.STRING,
	})
}