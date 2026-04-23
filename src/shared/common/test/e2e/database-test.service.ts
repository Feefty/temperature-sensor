import { DataSource } from 'typeorm';
import { DatabaseTestQuery } from './database-test-query';

export class DatabaseTestService {
  public constructor(private readonly dataSource: DataSource) {}

  public getFrom(tableName: string): DatabaseTestQuery {
    const query: DatabaseTestQuery = new DatabaseTestQuery(this.dataSource);
    query.tableName = tableName;
    return query;
  }
}
