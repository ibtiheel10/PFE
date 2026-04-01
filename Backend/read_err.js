const fs = require('fs');
try {
    const data = fs.readFileSync('compile_errors.txt', 'utf8');
    console.log("----- ERRORS -----");
    console.log(data);
} catch (e) {
    console.error(e.message);
}
