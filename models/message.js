const message = (sequelize, DataTypes) -> {
  const Message = sequelize.define('message', {
    message: DataTypes.STRING,
    answer: DataTypes.STRING,
    customerName: DataTypes.STRING,
    agentName: DataTypes.STRING,
    createdOn: DataTypes.DATE,
    answeredOn: DataTypes.DATE

  })
}
