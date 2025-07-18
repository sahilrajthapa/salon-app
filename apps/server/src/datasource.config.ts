import { DataSource, DataSourceOptions } from 'typeorm';

export const datasourceOptions: DataSourceOptions = {
  type: 'sqlite',
  database: 'salon.sqlite',
  synchronize: false,
  migrations: ['dist/db/migrations/*{.ts,.js}'],
  entities: ['dist/retention/entities/*{.ts,.js}'],
};

const datasource = new DataSource(datasourceOptions);

export default datasource;
