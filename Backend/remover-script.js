const fs = require('fs');
let f1 = 'c:\\\\Users\\\\aya labyedh\\\\Desktop\\\\PFE\\\\Backend\\\\src\\\\entreprise\\\\entreprise.service.ts';
let content = fs.readFileSync(f1, 'utf8');
content = content.replace(/'Compétence Technique'/g, "'Sujet ciblé'");
fs.writeFileSync(f1, content);

let f2 = 'c:\\\\Users\\\\aya labyedh\\\\Desktop\\\\PFE\\\\Backend\\\\src\\\\suggestion\\\\suggestion.service.ts';
let content2 = fs.readFileSync(f2, 'utf8');
content2 = content2.replace(/'competence', /g, "");
content2 = content2.replace(/'expertise', /g, "");
content2 = content2.replace(/'basique', /g, "");
content2 = content2.replace(/'technique', /g, "");
content2 = content2.replace(/'general', /g, "");
content2 = content2.replace(/Compétences correspondantes/g, "Connaissances correspondantes");
fs.writeFileSync(f2, content2);
console.log("Done");
