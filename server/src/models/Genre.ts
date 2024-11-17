import { DataTypes, Model, Optional, Sequelize } from 'sequelize';


interface GenreAttributes {
  id: number;
  name: string;
}

interface GenreCreationAttributes extends Optional<GenreAttributes, 'id'> {}

class Genre extends Model<GenreAttributes, GenreCreationAttributes> implements GenreAttributes {
  public id!: number;
  public name!: string;
  
  static initModel(sequelize: Sequelize) {
    Genre.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'genres',
    }
  );
}
}

export default Genre;
