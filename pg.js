// Make sure to install the 'pg' package 
// import { drizzle } from 'drizzle-orm/node-postgres';
// import * as dotenv from 'dotenv';
const { drizzle } = require('drizzle-orm/node-postgres')
const dotenv = require('dotenv');
dotenv.config();

const tester = async () => {
    const db = drizzle({ 
        connection: { 
          connectionString: process.env.DATABASE_URL,
          ssl: false
        }
      });
 
    const result = await db.execute('SELECT * FROM userstable');
    console.log(result.rows);
}

tester();

