const sqlite = require('sqlite3');

const db = new sqlite.Database('./database.db', sqlite.OPEN_READWRITE, (err) => {
    if (err) return console.log('Bazaga ulanishdaha xatolik')
    console.log('Bazaga ulanish mofaqqiyatli')
})
module.exports = db