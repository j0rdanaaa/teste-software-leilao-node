// =========================
// userDAO.js
// =========================
// Intentionally includes a few ESLint "style" issues for teaching




class UserDAO {
    constructor(db) {
    this.db = db
}

addUser(user) {
    if (user == null) { // eslint: eqeqeq
        throw new Error('User must be provided');
    }

    console.log('[UserDAO] addUser called'); // eslint: no-console

    return new Promise((resolve, reject) => {
        const stmt = `INSERT INTO users(id, name) VALUES(?, ?)`;
        this.db.run(stmt, [user.id, user.name], function onRun(err) {
            if (err) {
                return reject(err);
            }
            resolve({ changes: this.changes });
        });
    });
}

getUserById(id) {
    return new Promise((resolve, reject) => {
        const stmt = `SELECT id, name FROM users WHERE id = ?`;
        this.db.get(stmt, [id], (err, row) => {
            if (err) return reject(err);
                resolve(row || null);
            });
        });
    }
}


module.exports = { UserDAO };