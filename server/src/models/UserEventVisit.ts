import { DataTypes, Model, Optional, Sequelize } from "sequelize";

interface VisitAttributes {
  id: string;
  user_id?: string | null;
  event_id: string;
  anon_id?: string | null;
  visited_at: Date;
}

interface VisitCreationAttributes extends Optional<VisitAttributes, "id" | "user_id" | "anon_id"> {}

class UserEventVisit extends Model<VisitAttributes, VisitCreationAttributes> implements VisitAttributes {
  public id!: string;
  public user_id!: string | null;
  public event_id!: string;
  public anon_id!: string | null;
  public visited_at!: Date;

  static initModel(sequelize: Sequelize) {
    UserEventVisit.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        user_id: {
          type: DataTypes.UUID,
          allowNull: true,
          onDelete: "CASCADE",
        },
        event_id: {
          type: DataTypes.UUID,
          allowNull: false,
          onDelete: "CASCADE",
        },
        anon_id: {
          type: DataTypes.STRING,
          allowNull: true,
          onDelete: "CASCADE",
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
