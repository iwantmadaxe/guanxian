<template>
	<div class="react-edit">
	  	<div class="overflow-hidden">
			<div class="wrapper preload">
				<common-header></common-header>
				<common-aside></common-aside>
				<div class="main-container">
					<div class="padding-md">
						<h1>机器编辑</h1>
						<div class="mac-add dx-context">
							<div class="dozen-row clearfix">
								<label class="left control-label">ChamberName：</label>
								<div class="right clearfix">
									<el-input v-model="add.ChamberName" placeholder=""></el-input>
								</div>
							</div>
							<div class="dozen-row clearfix">
								<label class="left control-label label-type">MachineId：</label>
								<div class="right clearfix">
									<span class="select-text">{{computedMac}}</span>
									<el-select v-model="add.MachineId" placeholder="请选择">
										<el-option
											v-for="item in macList"
											:key="item.value"
											:label="item.name"
											:value="item.value">
										</el-option>
									</el-select>
								</div>
							</div>
							<div class="dozen-row clearfix">
								<label class="left control-label">DatabaseName：</label>
								<div class="right clearfix">
									<el-input v-model="add.DatabaseName" placeholder=""></el-input>
								</div>
							</div>
							<div class="dozen-row clearfix">
								<div class="normal-btn">
									<el-button @click="postAdd" type="primary">确定</el-button>
									<el-button @click="cancel" type="danger">取消</el-button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script type="text/javascript">
	import CommonHeader from '../../components/common/header.vue';
	import CommonAside from '../../components/common/aside.vue';
	import PageSelect from '../../components/common/pageSelect.vue';
	import apis from '../../apis/index.js';
	import axios from 'axios';
	import { readLocal } from '../../utils/localstorage.js';

	export default {
		name: 'react-edit',
		data () {
			return {
				token: '',
				reactId: '',
				add: {
					ChamberName: null,
					MachineId: null,
					DatabaseName: null
				},
				macList: [
					{
						name: '',
						value: ''
					}
				]
			};
		},
		created () {
			this.token = readLocal('user').token;
			this.reactId = this.$route.params.reactId;
			this.add.MachineId = this.$route.params.macId;
			this.fetchData(this.reactId);
			// axios.defaults.headers.common['Authorization'] = this.token;
		},
		computed: {
			computedMac: function () {
				let _this = this;
				let name;
				_this.macList.map(function (item) {
					if (item.value === parseInt(_this.add.MachineId)) {
						name = item.name;
					}
				});
				return name;
			}
		},
		methods: {
			cancel () {
				window.history.go(-1);
			},
			fetchData (id) {
				axios.get(apis.urls.reactSingle + '/' + id + '?token=' + this.token)
				.then((response) => {
					this.add = response.data.data;
				})
				.catch((error) => {
					apis.errors.errorPublic(error.response, this);
				});
				axios.get(apis.urls.macGetAll + '?token=' + this.token)
				.then((response) => {
					this.macList = response.data.map(function (item) {
						item.name = item.MachineName;
						item.value = item.Id;
						return item;
					});
				})
				.catch((error) => {
					apis.errors.errorPublic(error.response, this);
				});
			},
			postAdd () {
				if (!this.add.ChamberName) {
					this.$alert('ChamberName未填!', '提示');
					return false;
				}
				if (!this.add.DatabaseName) {
					this.$alert('DatabaseName未填!', '提示');
					return false;
				}
				axios.post(apis.urls.reactEdit + '?id=' + this.reactId + '&token=' + this.token, this.add)
				.then((response) => {
					this.$message('编辑成功！');
					this.$router.push({name: 'ReactList', params: {macId: this.$route.params.macId}});
				})
				.catch((error) => {
					apis.errors.errorPublic(error.response, this);
				});
			}
		},
		components: {
			[CommonHeader.name]: CommonHeader,
			[PageSelect.name]: PageSelect,
			[CommonAside.name]: CommonAside
		}
	};
</script>
<style lang="scss">
	@import '../../assets/sass/partials/_var.scss';
	@import '../../assets/sass/partials/_border.scss';

	.dx-context {
		.dozen-row {
			.el-input__inner {
				width: 200px;
			}
		}
	}
	.dx-context {
		padding: 15px 0;
		.el-button {
			margin-left: 10px;
			margin-bottom: 10px;
		}
		.filename {
			padding: 0 20px;
		}
		.label-type2 {
			margin-top: 10px;
		}
		.search-row {
			.el-dropdown {
				margin-left: 10px;
				height: 36px;
    			line-height: 36px;
			}
			.search-con {
				float: left;
				margin: 0 10px 15px 0;
				position: relative;
				.unit {
					position: absolute;
					top: 0;
				    right: 5px;
				    height: 36px;
				    line-height: 36px;
				}
				.topic {
					padding: 0 10px;
					font-size: 14px;
					font-weight: 600;
					float: left;
    				display: block;
				    height: 36px;
				    line-height: 36px;
				    width: auto;
				}
				.el-input {
					float: left;
    				display: block;
    				width: 160px;
					.el-input__inner {
						width: 100%;
						float: left;
	    				display: block;
					}
				}
			}
		}
		.dozen-row {
			margin: 10px 0;
			padding: 0 15px;
			position: relative;
			.select-text {
			    position: absolute;
			    left: 220px;
			    height: 36px;
			    line-height: 36px;
			    display: block;
			    z-index: 20;
		        font-size: 14px;
			}
			.add-new-btn {
				position: relative;
				.upload-xls {
					width: 88px;
					height: 36px;
					position: absolute;
					top: 0;
					left: 0;
					opacity: 0;
				}
			}
			.left {
				width: 15%;
				float: left;
			    margin-top: 10px;
			}
			.right {
				width: 85%;
				float: left;
			}
			.el-dropdown {
				border: 1px solid #48576a;
				border-radius: 5px;
				padding: 0 10px;
				height: 36px;
    			line-height: 36px;
			}
			p {

			}
		}
	}

</style>
