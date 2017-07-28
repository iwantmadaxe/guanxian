<template>
	<div class="mac-list">
	  	<div class="overflow-hidden">
			<div class="wrapper preload">
				<common-header></common-header>
				<common-aside></common-aside>
				<div class="main-container">
					<div class="padding-md dx-context">
						<h1>机器列表</h1>
						<div @click="singleAdd" class="btn-con">
							<add-new-btn></add-new-btn>
						</div>
						<el-table
							:data="list.data"
							style="width: 100%">
							<el-table-column
								prop="Account"
								label="Account">
							</el-table-column>
							<el-table-column
								prop="MachineName"
								label="MachineName">
							</el-table-column>
							<el-table-column
								prop="MachineType"
								label="MachineType">
							</el-table-column>
							<el-table-column
								prop="ServerAddress"
								label="ServerAddress">
							</el-table-column>
							<el-table-column
							  fixed="right"
							  label="操作"
							  width="160">
							  <template scope="scope">
							  	<el-button
									size="small"
									@click="goCheck(scope)">编辑</el-button>
								<el-button
									size="small"
									@click="goDelete(scope)">删除</el-button>
								<el-button
									size="small"
									@click="goReactList(scope)">查看腔体列表</el-button>
							  </template>
							</el-table-column>
						</el-table>
						<page-select :total="list.meta.pagination.total" :current-page="list.meta.pagination.current_page" :handle-current-change="fetchData"></page-select>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script type="text/javascript">
	import CommonHeader from '../../components/common/header.vue';
	import CommonAside from '../../components/common/aside.vue';
	import AddNewBtn from '../../components/common/addNewBtn.vue';
	import PageSelect from '../../components/common/pageSelect.vue';
	import apis from '../../apis/index.js';
	import axios from 'axios';
	import { readLocal } from '../../utils/localstorage.js';

	export default {
		name: 'mac-list',
		data () {
			return {
				token: '',
				loading: null,
				type: [
					{
						value: 1,
						name: 'k465i'
					},
					{
						value: 2,
						name: 'MaxBright'
					}
				],
				list: {
					data: [
						{
							username: '',
							status: '',
							checked_at: '',
							code: '',
							created_at: {
								date: ''
							},
							id: '',
							phone: '',
							reason: ''
						}
					],
					meta: {
						pagination: {
							links: []
						}
					}
				}
			};
		},
		created () {
			this.token = readLocal('user').token;
			// axios.defaults.headers.common['Authorization'] = this.token;
			this.fetchData(1);
		},
		methods: {
			singleAdd () {
				this.$router.push({name: 'MacAdd'});
			},
			goCheck (scope) {
				this.$router.push({name: 'MacEdit', params: {id: scope.row.Id}});
			},
			goDelete (scope) {
				axios.post(apis.urls.macDelete + '?id=' + scope.row.Id + '&token=' + this.token)
				.then((response) => {
					this.list.data.splice(scope.row.$index, 1);
					this.$message('删除成功!');
				})
				.catch((error) => {
					this.loading.close();
					apis.errors.errorPublic(error.response, this);
				});
			},
			goReactList (scope) {
				this.$router.push({name: 'ReactList', params: {macId: scope.row.Id}});
			},
			fetchData (p) {
				this.loading = this.$loading({text: '加载中...'});
				// 获取机器列表
				axios.post(apis.urls.macList + '?currentPage=' + p + '&perpage=15&token=' + this.token)
				.then((response) => {
					this.loading.close();
					let _this = this;
					response.data.data.map(function (item) {
						item.MachineType = _this.type[1].name;
						return item;
					});
					this.list = response.data;
				})
				.catch((error) => {
					this.loading.close();
					apis.errors.errorPublic(error.response, this);
				});
			}
		},
		components: {
			[CommonHeader.name]: CommonHeader,
			[PageSelect.name]: PageSelect,
			[CommonAside.name]: CommonAside,
			[AddNewBtn.name]: AddNewBtn
		}
	};
</script>
<style lang="scss">
	@import '../../assets/sass/partials/_var.scss';
	@import '../../assets/sass/partials/_border.scss';

	.main-container {
		.el-button {
			margin: 10px;
		}
	}

</style>
