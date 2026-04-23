import { DataSource } from 'typeorm';

export class DatabaseTestQuery {
  private _tableName: string;
  private _orderBy: string;

  public constructor(private readonly dataSource: DataSource) {}

  public orderBy(column: string, direction: 'ASC' | 'DESC' = 'ASC'): this {
    this._orderBy = `${column} ${direction}`;
    return this;
  }

  public async run<T = Record<string, unknown>>(): Promise<T[]> {
    const query: string = this.buildSelectAllQuery();
    return this.dataSource.query(query) as Promise<T[]>;
  }

  public async getOne<T = Record<string, unknown>>(): Promise<T | undefined> {
    const query: string = this.buildSelectAllQuery() + this.buildOrderBy() + ' LIMIT 1';
    const rows: T[] = await this.dataSource.query(query);
    return rows[0];
  }

  public async count(): Promise<number> {
    const query: string = `SELECT COUNT(*) as count FROM ${this._tableName}`;
    const rows: Array<{ count: string }> = await this.dataSource.query(query);
    return Number.parseInt(rows[0].count, 10);
  }

  private buildSelectAllQuery(): string {
    return `SELECT * FROM ${this._tableName}`;
  }

  private buildOrderBy(): string {
    return this._orderBy ? ` ORDER BY ${this._orderBy}` : '';
  }

  public set tableName(name: string) {
    this._tableName = name;
  }

  public get tableName(): string {
    return this._tableName;
  }
}
