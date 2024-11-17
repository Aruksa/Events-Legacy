import { DataTypes, Model, Optional, Sequelize } from "sequelize";

interface EventAttributes {
  id: number;
  title: string;
  details: string;
  thumbnailUrl: string;
  location: string;
  startDate: Date;
  endDate: Date;
  userId: Number;
}

interface EventCreationAttributes extends Optional<EventAttributes, "id"> {}

class Event
  extends Model<EventAttributes, EventCreationAttributes>
  implements EventAttributes
{
  public id!: number;
  public title!: string;
  public details!: string;
  public thumbnailUrl!: string;
  public location!: string;
  public startDate!: Date;
  public endDate!: Date;
  public userId!: number; // Foreign key for User

  static initModel(sequelize: Sequelize) {
    Event.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        title: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        details: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        thumbnailUrl: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        location: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        startDate: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        endDate: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "users",
            key: "id",
          },
        },
      },
      {
        sequelize,
        tableName: "events",
      }
    );
  }
}

export default Event;
