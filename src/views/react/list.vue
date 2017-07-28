<template>
	<div class="react-list">
	  	<div class="overflow-hidden">
			<div class="wrapper preload">
				<common-header></common-header>
				<common-aside></common-aside>
				<div class="main-container">
					<div class="padding-md dx-context">
						<h1>腔体列表</h1>
						<div @click="singleAdd" class="btn-con">
							<add-new-btn text="+ 新增腔体"></add-new-btn>
						</div>
						<el-table
							:data="list.data"
							style="width: 100%">
							<el-table-column
								prop="ChamberName"
								label="ChamberName">
							</el-table-column>
							<el-table-column
								prop="MachineName"
								label="MachineName">
							</el-table-column>
							<el-table-column
								prop="DatabaseName"
								label="DatabaseName">
							</el-table-column>
							<el-table-column
								prop="MachineType"
								label="MachineType">
							</el-table-column>
							<el-table-column
							  fixed="right"
							  label="操作"
							  width="100"
							  >
							  <template scope="scope">
							  	<el-button
									size="small"
									@click="goCheck(scope)">编辑</el-button>
								<el-button
									size="small"
									@click="goDelete(scope)">删除</el-button>
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
		name: 'react-list',
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
				this.$router.push({name: 'ReactAdd', params: {macId: this.$route.params.macId}});
			},
			goCheck (scope) {
				this.$router.push({name: 'ReactEdit',
					params: {
						macId: this.$route.params.macId,
						reactId: scope.row.Id
					}
				});
			},
			goDelete (scope) {
				this.$confirm('确认删除该腔体?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					axios.post(apis.urls.reactDelete + '?id=' + scope.row.Id + '&token=' + this.token)
					.then((response) => {
						this.list.data.splice(scope.row.$index, 1);
						this.$message('删除成功!');
					})
					.catch((error) => {
						this.loading.close();
						apis.errors.errorPublic(error.response, this);
					});
				}).catch(() => {
					// this.$message({
					// 	type: 'info',
					// 	message: '已取消删除'
					// });
				});
			},
			fetchData (p) {
				this.loading = this.$loading({text: '加载中...'});
				// 获取机器列表
				axios.post(apis.urls.reactList + '?currentPage=' + p + '&perpage=15&token=' + this.token, {
					MachineId: this.$route.params.macId
				})
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
