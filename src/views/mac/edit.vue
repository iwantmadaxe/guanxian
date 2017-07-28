<template>
	<div class="mac-edit">
	  	<div class="overflow-hidden">
			<div class="wrapper preload">
				<common-header></common-header>
				<common-aside></common-aside>
				<div class="main-container">
					<div class="padding-md">
						<h1>机器编辑</h1>
						<div class="mac-add dx-context">
							<div class="dozen-row clearfix">
								<label class="left control-label">MachineName：</label>
								<div class="right clearfix">
									<el-input v-model="add.MachineName" placeholder=""></el-input>
								</div>
							</div>
							<div class="dozen-row clearfix">
								<label class="left control-label label-type">MachineType：</label>
								<div class="right clearfix">
									<!-- <el-radio v-for="item in type" class="radio" v-model="add.MachineType" :label="item.value">{{item.name}}</el-radio> -->
									<span class="select-text">{{computedType}}</span>
									<el-select v-model="add.MachineType" placeholder="请选择">
										<el-option
											v-for="item in macType"
											:key="item.value"
											:label="item.name"
											:value="item.value">
										</el-option>
									</el-select>
			<!-- 						<div class="form-group">
										<label for="name">选择列表</label>
										<select class="form-control">
											<option v-for="item in macType">{{item.name}}</option>
										</select>
									</div> -->
								</div>
							</div>
							<div class="dozen-row clearfix">
								<label class="left control-label">ServerAddress：</label>
								<div class="right clearfix">
									<el-input v-model="add.ServerAddress" placeholder=""></el-input>
								</div>
							</div>
							<div class="dozen-row clearfix">
								<label class="left control-label">Account：</label>
								<div class="right clearfix">
									<el-input v-model="add.Account" placeholder=""></el-input>
								</div>
							</div>
							<div class="dozen-row clearfix">
								<label class="left control-label">Password：</label>
								<div class="right clearfix">
									<el-input v-model="add.Password" placeholder=""></el-input>
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
		name: 'mac-edit',
		data () {
			return {
				token: '',
				id: '',
				macType: [
					{
						value: 1,
						name: 'k465i'
					},
					{
						value: 2,
						name: 'MaxBright'
					}
				],
				add: {
					MachineName: null,
					MachineType: null,
					ServerAddress: null,
					Account: null,
					Password: null
				}
			};
		},
		created () {
			this.token = readLocal('user').token;
			this.id = this.$route.params.id;
			this.fetchData(this.id);
			// axios.defaults.headers.common['Authorization'] = this.token;
		},
		computed: {
			computedType: function () {
				let _this = this;
				let name;
				_this.macType.map(function (item) {
					if (item.value === _this.add.MachineType) {
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
				axios.get(apis.urls.macSingle + '/' + id + '?token=' + this.token)
				.then((response) => {
					this.add = response.data.data;
				})
				.catch((error) => {
					apis.errors.errorPublic(error.response, this);
				});
			},
			postAdd () {
				if (!this.add.MachineName) {
					this.$alert('MachineName未填!', '提示');
					return false;
				}
				if (!this.add.MachineType) {
					this.$alert('MachineType未填!', '提示');
					return false;
				}
				if (!this.add.ServerAddress) {
					this.$alert('ServerAddress未填!', '提示');
					return false;
				}
				if (!this.add.Account) {
					this.$alert('Account未填!', '提示');
					return false;
				}
				if (!this.add.Password) {
					this.$alert('Password未填!', '提示');
					return false;
				}
				axios.post(apis.urls.macAdd + '?token=' + this.token, this.add)
				.then((response) => {
					this.$message('编辑成功！');
					this.$router.push({name: 'MacList'});
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
