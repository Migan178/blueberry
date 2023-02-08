import { database, config } from '../src/modules'
import { createConnection } from 'mysql2/promise'

describe('test database system', () => {
  test('Validate rows', async () => {
    return database.getConnection().then(async conn1 => {
      const [rows1] = await conn1.query('SELECT * FROM statement;')
      const conn2 = await createConnection(config)
      const [rows2] = await conn2.query(`SELECT * FROM statement;`)
      expect(rows1).toEqual(rows2)
    })
  })
})
