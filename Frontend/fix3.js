const fs = require('fs');
const file = 'C:\\Users\\aya labyedh\\Desktop\\PFE\\Frontend\\src\\components\\Result.vue';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/<p class="tips-text whitespace-pre-wrap">\{\{ aiRecommendation\.text \}\}<\/p>[\s\S]*?<script setup lang="ts">/, 
`<p class="tips-text whitespace-pre-wrap">{{ aiRecommendation.text }}</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">`
);

fs.writeFileSync(file, content, 'utf8');
console.log('Fixed file layout');
