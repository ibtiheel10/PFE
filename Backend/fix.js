const fs = require('fs');

try {
    let f1 = 'src/entreprise/entreprise.service.ts';
    let content1 = fs.readFileSync(f1, 'utf8');
    content1 = content1.replace(/Compétence Technique/g, 'Sujet ciblé');
    fs.writeFileSync(f1, content1);
    console.log('entreprise.service.ts OK');

    let f2 = 'src/candidat/candidat.service.ts';
    let content2 = fs.readFileSync(f2, 'utf8');
    content2 = content2.replace(/Généralement l'email/g, "L'email");
    fs.writeFileSync(f2, content2);
    console.log('candidat.service.ts OK');
} catch(e) {
    console.error(e);
}
