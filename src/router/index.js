import Vue from 'vue';
import Router from 'vue-router';
import Login from '../views/login/login.vue'; // 登陆页面
import MacList from '../views/mac/index.vue'; // 机器列表
import MacAdd from '../views/mac/add.vue'; // 机器新增
import MacEdit from '../views/mac/edit.vue'; // 机器编辑
import ReactList from '../views/react/list.vue'; // 腔体列表
import ReactAdd from '../views/react/add.vue'; // 腔体新增
import ReactEdit from '../views/react/edit.vue'; // 腔体编辑
import Charts from '../views/charts/index.vue'; // 图表

Vue.use(Router);

export default new Router({
	routes: [
		{
			path: '/login',
			name: 'Login',
			component: Login,
			meta: {
				title: '登陆'
			}
		},
		{
			path: '/mac/list',
			name: 'MacList',
			component: MacList,
			meta: {
				title: '机器列表'
			}
		},
		{
			path: '/mac/add',
			name: 'MacAdd',
			component: MacAdd,
			meta: {
				title: '机器新增'
			}
		},
		{
			path: '/mac/edit/:id',
			name: 'MacEdit',
			component: MacEdit,
			meta: {
				title: '机器编辑'
			}
		},
		{
			path: '/react/list/:macId',
			name: 'ReactList',
			component: ReactList,
			meta: {
				title: '腔体列表'
			}
		},
		{
			path: '/react/add/:macId',
			name: 'ReactAdd',
			component: ReactAdd,
			meta: {
				title: '腔体新增'
			}
		},
		{
			path: '/react/edit/:macId/:reactId',
			name: 'ReactEdit',
			component: ReactEdit,
			meta: {
				title: '腔体编辑'
			}
		},
		{
			path: '/charts',
			name: 'Charts',
			component: Charts,
			meta: {
				title: '图表'
			}
		},
		{
			path: '*',
			redirect: {
				name: 'MacList'
			}
		}
	]
});
