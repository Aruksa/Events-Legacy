import { DataTypes, Model, Sequelize } from 'sequelize';


class EventGenre extends Model {
  public id!: Number
  public eventId!: Number
  public genreId!: Number

  static initModel(sequelize: Sequelize) {
    EventGenre.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        eventId: {
          type: DataTypes.INTEGER,
          references: {
            model: 'events',
            key: 'id',
          },
          primaryKey: true,
        },
        genreId: {
          type: DataTypes.INTEGER,
          references: {
            model: 'genres',
            key: 'id',
          },
          primaryKey: true,
        },
      },
      {
        sequelize,
        tableName: 'event_genres',
      }
    );
  }
}



export default EventGenre;
