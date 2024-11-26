import { Sequelize } from "sequelize";
import dbConfig from "../config/dbConfig";
import User from "./User";
import Event from "./Event";
import Genre from "./Genre";
import EventGenre from "./EventGenre";
import Attendy from "./Attendy";
import UserEventVisit from "./UserEventVisit";

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect as any,
});

// Authenticate and test the database connection
sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

// Initialize models
User.initModel(sequelize);
Event.initModel(sequelize);
Genre.initModel(sequelize);
EventGenre.initModel(sequelize);
Attendy.initModel(sequelize);
UserEventVisit.initModel(sequelize);

// Define model associations

// User and Event: One-to-Many
User.hasMany(Event, { foreignKey: "userId" });
Event.belongsTo(User, { foreignKey: "userId" });

// Event and Genre: Many-to-Many
Event.belongsToMany(Genre, { through: EventGenre, foreignKey: "eventId" });
Genre.belongsToMany(Event, { through: EventGenre, foreignKey: "genreId" });

// Event and User: Many-to-Many through Attendy
Event.belongsToMany(User, { through: Attendy, foreignKey: "eventId" });
User.belongsToMany(Event, { through: Attendy, foreignKey: "userId" });

// Visit: Associations
Event.hasMany(UserEventVisit, { foreignKey: "event_id", onDelete: "CASCADE" });
UserEventVisit.belongsTo(Event, { foreignKey: "event_id" });

User.hasMany(UserEventVisit, { foreignKey: "user_id", onDelete: "CASCADE" });
UserEventVisit.belongsTo(User, { foreignKey: "user_id" });

// Export sequelize and models
export default sequelize;
export { User, Event, Genre, EventGenre, Attendy, UserEventVisit };

// import { Sequelize } from "sequelize";
// import dbConfig from "../config/dbConfig";
// import  User from "./User";
// import Event from "./Event";
// import Genre from "./Genre";
// import EventGenre from "./EventGenre";
// import Attendy from "./Attendy";

// const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
//   host: dbConfig.HOST,
//   dialect: dbConfig.dialect as any,
// });

// sequelize
//   .authenticate()
//   .then(() => {
//     console.log("Database connected successfully");
//   })
//   .catch((err) => {
//     console.error("Unable to connect to the database:", err);
//   });

//   // const db = {
//   //   Sequelize,
//   //   sequelize,
//   // };

//   User.initModel(sequelize),
//   Event.initModel(sequelize),
//   Genre.initModel(sequelize),
//   EventGenre.initModel(sequelize),
//   Attendy.initModel(sequelize)

//   //User and Event one to many
//   User.hasMany(Event, { foreignKey: 'userId' });
//   Event.belongsTo(User, { foreignKey: 'userId' });

//   // Event and Genre many to many relations
//   Event.belongsToMany(Genre, { through: EventGenre, foreignKey: 'eventId' });
//   Genre.belongsToMany(Event, { through: EventGenre, foreignKey: 'genreId' });

//   // Event and Genre many to many relations
//   Event.belongsToMany(User, { through: Attendy, foreignKey: 'eventId' });
//   User.belongsToMany(Event, { through: Attendy, foreignKey: 'userId' });

//   export default sequelize;
//   export {User, Event, Genre, EventGenre, Attendy}
