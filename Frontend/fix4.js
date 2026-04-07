const fs = require('fs');
const file = 'C:\\Users\\aya labyedh\\Desktop\\PFE\\Frontend\\src\\components\\Result.vue';
let content = fs.readFileSync(file, 'utf8');

const marker1 = '{{ aiRecommendation.text }}</p>';
const marker2 = '<script setup lang="ts">';

const idx1 = content.indexOf(marker1);
if (idx1 === -1) { fs.writeFileSync('out.txt', 'no marker 1'); process.exit(1); }
const endOfP = idx1 + marker1.length;

const idx2 = content.indexOf(marker2);
if (idx2 === -1) { fs.writeFileSync('out.txt', 'no marker 2'); process.exit(1); }

const head = content.substring(0, endOfP);
const replacement = '\r\n            </div>\r\n          </div>\r\n        </div>\r\n      </div>\r\n\r\n    </div>\r\n  </div>\r\n</template>\r\n\r\n';
const tail = content.substring(idx2);

fs.writeFileSync(file, head + replacement + tail, 'utf8');
fs.writeFileSync('out.txt', 'success');
