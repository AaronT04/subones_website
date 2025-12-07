const bcrypt = require('bcrypt');

const password = process.argv[2];
if (!password) {
    console.error('Please provide a password to hash');
    console.error('Usage: node generate-hash.js <your_password>');
    process.exit(1);
}

bcrypt.hash(password, 10).then(hash => {
    console.log('\nGenerated Hash:');
    console.log(hash);
    console.log('\nCopy the line above and update your database user password field with it.');
}).catch(err => {
    console.error(err);
});
