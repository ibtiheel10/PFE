const fs = require('fs');
const txt = fs.readFileSync('src/components/Result.vue', 'utf8');
const id1 = txt.indexOf('aiRecommendation.text }}</p>');
const id2 = txt.indexOf('<script setup lang="ts">');
const newTxt = txt.substring(0, id1 + 28) + '\r\n            </div>\r\n          </div>\r\n        </div>\r\n      </div>\r\n\r\n    </div>\r\n  </div>\r\n</template>\r\n\r\n' + txt.substring(id2);
fs.writeFileSync('src/components/Result.vue', newTxt);
