Vue.component('tabs', {
  template: `
      <div>
          <div class="tabs" :style="{fontSize:fontSize}">
            <ul>
              <li v-for="tab in tabs" :class="{ 'is-active': tab.isActive }">
                  <a :href="tab.href" @click="selectTab(tab)">{{ tab.name }}</a>
              </li>
            </ul>
          </div>
          <div class="tabs-details">
              <slot></slot>
          </div>
      </div>
  `,
  props: {
    fontSize: { type: String, default: '16px'}
  },
  data() {
      return {tabs: [] };
  },
  created() {
      this.tabs = this.$children;
  },
  methods: {
      selectTab(selectedTab) {
          this.tabs.forEach(tab => {
              tab.isActive = (tab.name == selectedTab.name);
          });
      }
  }
});

Vue.component('tab', {
  // 
  template: `
      <div :style="style"><slot></slot>

      </div>
  `,
  props: {
      name: { required: true },
      selected: { default: false}
  },
  data() {
      return {
          isActive: false
      };
  },
  computed: {
      href() {
          return '#' + this.name.toLowerCase().replace(/ /g, '-');
      },
      style(){
        return this.isActive ? {
        } : {
          // Hack...
          // Impossible d'utilier display:none car sinon
          // Le terminal freeze sous firefox (bloucle infinie de calcul de taille)
          position: 'absolute',
          left: '-99999px'
        };
      }
  },
  mounted() {
      this.isActive = this.selected;
  }
});

