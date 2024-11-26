import { DataTypes, Model, Optional, Sequelize } from "sequelize";

interface VisitAttributes {
  id: number;
  user_id?: number | null;
  event_id: number;
  anon_id?: string | null;
  visited_at: Date;
}

interface VisitCreationAttributes extends Optional<VisitAttributes, "id" | "user_id" | "anon_id"> {}

class UserEventVisit extends Model<VisitAttributes, VisitCreationAttributes> implements VisitAttributes {
  public id!: number;
  public user_id!: number | null;
  public event_id!: number;
  public anon_id!: string | null;
  public visited_at!: Date;

  static initModel(sequelize: Sequelize) {
    UserEventVisit.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        user_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
          onDelete: "SET NULL",
        },
        event_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          onDelete: "CASCADE",
        },
        anon_id: {
          type: DataTypes.STRING,
          allowNull: true,
          onDelete: "SET NULL",
        },
        visited_at: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
        },
      },
      {
        sequelize,
        tableName: "user_event_visits",
        timestamps: true,
      }
    );
  }
}

export default UserEventVisit;
