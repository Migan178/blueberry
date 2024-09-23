import type { BaseTable, UserData } from '../type'
import type { Snowflake } from 'discord.js'
import type { Pool } from 'mysql2/promise'
import run from '../run'

export class UserTable implements BaseTable<UserData, Snowflake> {
  public readonly name = 'user'
  public constructor(private _database: Pool) {}

  public async all(): Promise<UserData[]> {
    const [rows] = await this._database.execute<UserData[]>(
      `SELECT * FROM ${this.name};`,
    )
    return rows
  }

  public async findOne(key: string): Promise<UserData[]> {
    const [rows] = await this._database.execute<UserData[]>(
      `SELECT * FROM ${this.name} WHERE user_id = ?;`,
      [key],
    )
    return rows
  }

  public async insert(data: { user_id: Snowflake }): Promise<void> {
    const db = await this._database.getConnection()

    await run(db, async () => {
      await db.execute(`INSERT INTO ${this.name} (user_id) VALUES (?);`, [
        data.user_id,
      ])
    })
  }

  // TODO: 아무런 값도 없을때 에러 띄우는 등의 조치
  public async update(data: {
    user_id: Snowflake
    money?: bigint
    blocked?: boolean
    block_reason?: string
  }): Promise<void> {
    const db = await this._database.getConnection()

    if (data.money)
      await run(db, async () => {
        await db.execute(
          `UPDATE ${this.name} SET money = ? WHERE user_id = ?;`,
          [data.money, data.user_id],
        )
      })
    else if (data.blocked)
      await run(db, async () => {
        await db.execute(
          `UPDATE ${this.name} SET blocked = ? WHERE user_id = ?;`,
          [data.blocked, data.user_id],
        )
      })
    else if (data.block_reason)
      await run(db, async () => {
        await db.execute(
          `UPDATE ${this.name} SET block_reason = ? WHERE user_id = ?;`,
          [data.block_reason, data.user_id],
        )
      })
  }

  public async delete(key: string): Promise<void> {
    const db = await this._database.getConnection()

    await run(db, async () => {
      await db.execute(`DELETE FROM ${this.name} WHERE user_id = ?;`, [key])
    })
  }

  public async findOneAnotherKey(
    key: 'user_id' | 'money' | 'blocked' | 'created_at',
    data: any,
  ): Promise<UserData[]> {
    const [rows] = await this._database.execute<UserData[]>(
      `SELECT * FROM ${this.name} WHERE ${key} = ?;`,
      [data],
    )
    return rows
  }
}
