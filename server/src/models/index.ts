import { Sequelize } from "sequelize";
import dbConfig from "../config/dbConfig";
import  User from "./User";
import Event from "./Event";
import Genre from "./Genre";
import EventGenre from "./EventGenre";
import Attendy from "./Attendy";

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect as any,
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

  // const db = {
  //   Sequelize,
  //   sequelize,
  // };

  User.initModel(sequelize),
  Event.initModel(sequelize),
  Genre.initModel(sequelize),
  EventGenre.initModel(sequelize),
  Attendy.initModel(sequelize)

  //User and Event one to many
  User.hasMany(Event, { foreignKey: 'userId' });
  Event.belongsTo(User, { foreignKey: 'userId' });
  
  // Event and Genre many to many relations
  Event.belongsToMany(Genre, { through: EventGenre, foreignKey: 'eventId' });
  Genre.belongsToMany(Event, { through: EventGenre, foreignKey: 'genreId' });

  // Event and Genre many to many relations
  Event.belongsToMany(User, { through: Attendy, foreignKey: 'eventId' });
  User.belongsToMany(Event, { through: Attendy, foreignKey: 'userId' });




  export default sequelize;
  export {User, Event, Genre, EventGenre, Attendy}