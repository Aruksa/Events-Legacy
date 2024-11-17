import { DataTypes, Model, Sequelize } from "sequelize";

class Attendy extends Model {
  public id!: number;
  public status!: number;
  public eventId!: number; // Foreign key for Event
  public userId!: number; // Foreign key for User

  static initModel(sequelize: Sequelize) {
    Attendy.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        status: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        eventId: {
          type: DataTypes.INTEGER,
          references: {
            model: "events",
            key: "id",
          },
          allowNull: false,
        },
        userId: {
          type: DataTypes.INTEGER,
          references: {
            model: "users",
            key: "id",
          },
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: "attendies",
      }
    );
  }
}

export default Attendy;
