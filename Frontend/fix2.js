const fs = require('fs');
const file = 'C:\\Users\\aya labyedh\\Desktop\\PFE\\Frontend\\src\\components\\Result.vue';
let lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
const scriptLine = lines.findIndex(l => l.includes('<script setup lang="ts">'));

const goodLines = [
'            </div>',
'          </div>',
'        </div>',
'      </div>',
'',
'    </div>',
'  </div>',
'</template>',
''
];

// Combine lines: 0 to 177, then goodLines, then everything from scriptLine onwards
const newLines = [...lines.slice(0, 178), ...goodLines, ...lines.slice(scriptLine)];

fs.writeFileSync(file, newLines.join('\r\n'));
