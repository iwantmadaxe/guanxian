// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import router from './router';
import store from './vuex/store.js';
import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-default/index.css';
import App from './App';

Vue.use(ElementUI);
/* eslint-disable no-new */
new Vue({
	store,
	router,
	template: '<App/>',
	components: {App}
}).$mount('#app');

let indexScrollTop = 0;
router.beforeEach((route, redirect, next) => {
	if (route.path !== '/') {
		indexScrollTop = document.body.scrollTop;
	}
	document.title = route.meta.title || document.title;
	next();
});

router.afterEach(route => {
	if (route.path !== '/') {
		document.body.scrollTop = 0;
	} else {
		Vue.nextTick(() => {
			document.body.scrollTop = indexScrollTop;
		});
	}
});
