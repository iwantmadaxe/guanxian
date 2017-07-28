<template>
	<div class="charts">
		<div class="overflow-hidden">
			<div class="wrapper preload">
				<common-header></common-header>
				<common-aside></common-aside>
				<div class="main-container">
					<div class="padding-md clearfix">
						<div class="mac-add dx-context">
							<h1>图表</h1>
							<div class="clearfix">
								<div class="normal-btn">
									<el-button @click="dialogVisible = true" type="primary">设置参数</el-button>
								</div>
							</div>
							<div v-if="nodata">
								暂无数据
							</div>
							<div class="main-chart" id="main-chart">
							</div>
							<el-dialog title="设置参数" :visible.sync="dialogVisible" size="large" :show-close="false">
								<div class="charts-row clearfix">
									<label class="left control-label label-type">选择机器：</label>
									<div class="right clearfix">
										<el-select @change="getReactList(charts.MachineId)" v-model="charts.MachineId" placeholder="请选择">
											<el-option
												v-for="item in macList"
												:key="item.value"
												:label="item.name"
												:value="item.value">
											</el-option>
										</el-select>
									</div>
								</div>
								<div class="charts-row clearfix">
									<label class="left control-label label-type">选择Recipe：</label>
									<div class="right clearfix">
										<el-select @change="getrunIDList()" v-model="charts.RecipeID" placeholder="请选择">
											<el-option
												v-for="item in dataItem.ProcessRun.RecipeIDList"
												:key="item.value"
												:label="item.name"
												:value="item.name">
											</el-option>
										</el-select>
									</div>
								</div>
								<div class="charts-row clearfix">
									<label class="left control-label label-type">选择腔体：</label>
									<div class="right clearfix">
										<el-select @change="getDataItem(charts.reactId)" v-model="charts.reactId" placeholder="请选择">
											<el-option
												v-for="item in reactList"
												:key="item.value"
												:label="item.name"
												:value="item.value">
											</el-option>
										</el-select>
									</div>
								</div>
								<div class="charts-row clearfix">
									<label class="left control-label label-type">选择Run：</label>
									<div class="right clearfix">
										<el-select v-model="charts.RunId" placeholder="请选择">
											<el-option
												v-for="item in dataItem.ProcessRun.RunIDList"
												:key="item.value"
												:label="item.name"
												:value="item.value">
											</el-option>
										</el-select>
									</div>
								</div>
								<div class="charts-row clearfix" style="width: 100%;">
									<div class="block">
										<label class="left demonstration control-label label-type">选择时间：</label>
										<el-date-picker
											v-model="time"
											type="daterange"
											placeholder="选择日期范围">
										</el-date-picker>
									</div>
								</div>
								<div class="clearfix">
									<div class="charts-row clearfix">
										<el-radio class="radio" v-model="enumerated" :label="true">模拟信号</el-radio>
										<el-radio class="radio" v-model="enumerated" :label="false">数字信号</el-radio>
									</div>
<!-- 									<div class="charts-row clearfix">
										<p class="topic" style="margin-top: 12px;">已选参数：</p>
									</div> -->
								</div>
								<div class="charts-row clearfix" v-if="enumerated">
									<el-tree accordion :data="dataItem.EnumeratedDataItem.EnumeratedSubClass" node-key="id" ref="tree" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
								</div>
								<div class="charts-row clearfix" v-else>
									<el-tree accordion :data="dataItem.NumericalDataItem.SubClassList" node-key="id" ref="tree" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
								</div>
<!-- 								<div class="buttons">
									<el-button @click="getCheckedNodes">选取</el-button>
								</div> -->
								<div class="charts-row clearfix">
									<div class="choose-list" v-if="chosedList.length !== 0">
										<div class="choose-row" v-for="(item, index) in chosedList">
											{{item.SubClass}}&nbsp;|&nbsp;{{item.Device}}&nbsp;|&nbsp;{{item.DataItem}}<span class="delete" @click="cancelChoose(index)">删除</span>
										</div>
									</div>
									<div v-else class="choose-list">
										<div class="choose-row" style="text-align: center;">
											尚未选择
										</div>
									</div>
								</div>
								<div slot="footer" class="dialog-footer">
									<el-button @click="dialogVisible = false">取 消</el-button>
									<el-button type="primary" @click="getCharts()">确 定</el-button>
								</div>
							</el-dialog>
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
	import apis from '../../apis/index.js';
	import axios from 'axios';
	import { readLocal } from '../../utils/localstorage.js';
	import echarts from 'echarts';
	import $ from 'jquery';

	export default {
		name: 'charts',
		data () {
			return {
				token: '',
				enumerated: false,
				dialogVisible: false,  //  弹窗开关
				nodata: false,  //  无数据
				time: '',
				macList: [
				],
				reactList: [
				],
				chartCanvas: null,
				charts: {
					MachineId: '',
					reactId: '',
					RecipeID: '',
					RunId: ''
				},
				dataItem: {
					EnumeratedDataItem: {
						EnumeratedSubClass: []
					},
					NumericalDataItem: {
						SubClassList: []
					},
					ProcessRun: {
						RecipeIDList: [],
						RunIDList: []
					}
				},
				defaultProps: {
					children: 'children',
					label: 'label'
				},
				waitToChoose: [],
				chosedList: [],
				dataTest: [],
				option: {
					title: {
						text: '',
						subtext: '',
						x: 'center',
						align: 'right'
					},
					grid: {
						left: '3%',
						right: '3%',
						top: '10%',
						bottom: '5%',
						width: '90%',
						height: '80%',
						containLabel: true
					},
					toolbox: {
						feature: {
							dataZoom: {
								yAxisIndex: 'none'
							},
							restore: {show: true},
							saveAsImage: {}
						}
					},
					tooltip: {
						trigger: 'axis'
						// axisPointer: {
						// 	type: 'cross',
						// 	animation: false,
						// 	label: {
						// 		backgroundColor: '#505765'
						// 	}
						// }
					},
					legend: {
						data: [],
						x: 'left'
					},
					dataZoom: [
						{
							show: true,
							realtime: true,
							start: 0,
							end: 50
						}
					],
					xAxis: [
						{
							type: 'category',
							// boundaryGap: false,
							// axisLine: {onZero: false},
							data: []
						}
					],
					yAxis: [
						{
							type: 'value'
						}
					],
					// yAxis: [
					// 	{
					// 		name: '流量(m^3/s)',
					// 		type: 'value',
					// 		max: 500
					// 	},
					// 	{
					// 		name: '降雨量(mm)',
					// 		nameLocation: 'start',
					// 		max: 5,
					// 		type: 'value',
					// 		inverse: true
					// 	}
					// ],
					series: []
				}
			};
		},
		created () {
			this.token = readLocal('user').token;
		},
		mounted () {
			this.$nextTick(function () {
				let height = document.body.offsetHeight - 280;
				document.querySelector('.main-chart').style.height = height + 'px';
				axios.defaults.headers.common['Authorization'] = this.token;
				// this.dataTest.push(1);
				// this.dataTest.push(2);
				this.fetchData();
				this.initCanvas();
				// this.loadCharts();
			});
		},
		methods: {
			loadCharts (callback) {
				let _this = this;
				if (!_this.nodata) {
					return false;
				}
				_this.option.legend.data = [];
				_this.option.series = [];
				_this.option.xAxis = [];
				console.log(_this.dataTest);
				_this.dataTest.map(function (item, index) {
					let valueData = [];
					let timeData = [];
					if (item.LoggerData.length !== 0) {
						_this.nodata = false;
					}
					item.LoggerData.map(function (item2, index2) {
						valueData.push(item2.DataValue);
						timeData.push(item2.LogTime);
					});
					_this.option.series.push({
						name: item.name,
						type: 'line',
						data: valueData
					});
					_this.option.xAxis.push({
						type: 'category',
						axisLine: {onZero: false},
						boundaryGap: false,
						data: timeData
					});
					_this.option.legend.data.push(item.name);
					return item;
				});
				// _this.loading.close();
				_this.initCanvas();
			},
			initCanvas () {
				// echarts.dispose(this.chartCanvas);
				this.chartCanvas = echarts.init(document.getElementById('main-chart'));
				this.chartCanvas.setOption(this.option);
			},
			emptyStatus () {
				this.enumerateStatus.SubClass = null;
				this.enumerateStatus.Device = null;
				this.enumerateStatus.DataItem = null;
				this.notEnumerateStatus.SubClass = null;
				this.notEnumerateStatus.Device = null;
				this.notEnumerateStatus.DataItem = null;
			},
			getCheckedNodes () {
				// console.log(this.$refs.tree.getCheckedNodes());
			},
			handleNodeClick (data, node, dom) {
				// console.log(data, dom.$el);
				let _this = this;
				let sameChoose = false;
				if (data.hasOwnProperty('children')) {
					if (data['children']) {
						return false;
					}
				}
				if (this.enumerated) {
					let DeviceName = $(dom.$el).parents().eq(1).find('.el-tree-node__label').html();
					let SubClassName = $(dom.$el).parents().eq(6).find('.el-tree-node__label').html();
					this.chosedList.map(function (item) {
						if (item.key === data.$treeNodeId) {
							_this.$message('已选择该属性！');
							sameChoose = true;
							return false;
						}
					});
					if (!sameChoose) {
						this.chosedList.push({
							key: data.$treeNodeId,
							label: data.label,
							SubClass: SubClassName,
							Device: DeviceName,
							DataItem: data.label,
							enumerated: this.enumerated,
							reactId: this.charts.reactId
						});
					}
				} else {
					let DeviceName = $(dom.$el).parents().eq(2).find('.el-tree-node__label').html();
					let SubClassName = $(dom.$el).parents().eq(4).find('.el-tree-node__label').html();
					this.chosedList.map(function (item) {
						if (item.key === data.$treeNodeId) {
							_this.$message('已选择该属性！');
							sameChoose = true;
							return false;
						}
					});
					if (!sameChoose) {
						this.chosedList.push({
							key: data.$treeNodeId,
							label: data.label,
							SubClass: SubClassName,
							Device: DeviceName,
							DataItem: data.label,
							enumerated: this.enumerated,
							reactId: this.charts.reactId
						});
					}
				}
			},
			getCharts () {
				this.preferCharts();
				// _this.loading.close();
			},
			preferCharts () {
				if (!this.time) {
					this.$message('请选择时间！', '提示');
					return false;
				}
				// let timestart = this.time[0];
				// let timeend = this.time[1];
				let timestart = '2010-10-02 00:00:01';
				let timeend = '2010-10-06 02:00:06';
				let _this = this;
				// _this.loading = _this.$loading({text: '绘图中...'});
				_this.chosedList.map(function (item, index) {
					let itemData = item;
					axios.post(apis.urls.getChartsData + '?token=' + _this.token + '&chamberId=' + item.reactId + '&isEnumerated=' + item.enumerated + '&StartTime=' + timestart + '&EndTime=' + timeend,
						{
							StartTime: timestart,
							EndTime: timeend,
							SubClass: item.SubClass,
							DeviceName: item.Device,
							DataItem: item.DataItem
						}
					)
					.then((response) => {
						if (response.data.data.length !== 0) {
							_this.nodata = true;
						} else {
							_this.nodata = false;
						}
						response.data.data.name = itemData.SubClass + ' | ' + itemData.Device + ' | ' + itemData.DataItem;
						_this.$set(_this.dataTest, index, response.data.data);
						_this.loadCharts();
					})
					.catch((error) => {
						apis.errors.errorPublic(error.response, _this);
					});
				});
				_this.dialogVisible = false;
			},
			fetchData () {
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
			getrunIDList () {
				this.loading = this.$loading({text: '加载中...'});
				axios.get(apis.urls.channelGetRunIdList + '?token=' + this.token + '&chamberId=' + this.charts.reactId + '&recipeId=' + this.charts.RecipeID)
				.then((response) => {
					this.loading.close();
					this.dataItem.ProcessRun.RunIDList = [];
					this.dataItem.ProcessRun.RunIDList = response.data.data.map(function (item, index) {
						let itemTpl = {};
						itemTpl.value = index;
						itemTpl.name = item;
						return itemTpl;
					});
				})
				.catch((error) => {
					this.loading.close();
					apis.errors.errorPublic(error.response, this);
				});
			},
			getReactList (id) {
				this.charts.reactId = '';
				this.loading = this.$loading({text: '加载中...'});
				axios.get(apis.urls.reactListOfMac + '?machineId=' + id + '&token=' + this.token)
				.then((response) => {
					this.loading.close();
					this.reactList = response.data.data.map(function (item) {
						item.value = item.Id;
						item.name = item.ChamberName;
						return item;
					});
				})
				.catch((error) => {
					this.loading.close();
					apis.errors.errorPublic(error.response, this);
				});
			},
			cancelChoose (index) {
				this.chosedList.splice(index, 1);
			},
			getDataItem (id) {
				if (id === '') {
					return false;
				}
				this.loading = this.$loading({text: '加载中...'});
				this.dataItem.ProcessRun.RecipeIDList = [];
				this.dataItem.ProcessRun.RunIDList = [];
				this.charts.RecipeID = '';
				this.charts.RunId = '';
				axios.get(apis.urls.channelGetDataItem + '?token=' + this.token + '&chamberId=' + id)
				.then((response) => {
					this.loading.close();
					this.dataItem = response.data.data;
					this.dataItem.ProcessRun.RecipeIDList = this.dataItem.ProcessRun.RecipeIDList.map(function (item, index) {
						let itemTpl = {};
						itemTpl.value = index;
						itemTpl.name = item;
						return itemTpl;
					});
					this.dataItem.ProcessRun.RunIDList = this.dataItem.ProcessRun.RunIDList.map(function (item, index) {
						let itemTpl = {};
						itemTpl.value = index;
						itemTpl.name = item;
						return itemTpl;
					});
					this.dataItem.EnumeratedDataItem.EnumeratedSubClass = this.dataItem.EnumeratedDataItem.EnumeratedSubClass.map(function (item) {
						let itemTpl = {};
						itemTpl.label = item.SubClass;
						itemTpl.children = item.ChannelTypeList;
						itemTpl.children = itemTpl.children.map(function (item2) {
							let itemTpl2 = {};
							itemTpl2.label = item2.ChannelType;
							itemTpl2.children = item2.DeviceList;
							itemTpl2.children = itemTpl2.children.map(function (item3) {
								let itemTpl3 = {};
								itemTpl3.label = item3.DeviceName;
								itemTpl3.Device = item3.Device;
								itemTpl3.children = item3.DataItemList;
								itemTpl3.children = itemTpl3.children.map(function (item4) {
									let itemTpl4 = {};
									itemTpl4.label = item4;
									return itemTpl4;
								});
								return itemTpl3;
							});
							return itemTpl2;
						});
						return itemTpl;
					});
					this.dataItem.NumericalDataItem.SubClassList = this.dataItem.NumericalDataItem.SubClassList.map(function (item) {
						let itemTpl = {};
						itemTpl.label = item.SubClass;
						itemTpl.children = item.DeviceList;
						itemTpl.children = itemTpl.children.map(function (item2) {
							let itemTpl2 = {};
							itemTpl2.label = item2.DeviceName;
							itemTpl2.Device = item2.Device;
							itemTpl2.children = item2.DataItemList;
							itemTpl2.children = itemTpl2.children.map(function (item3) {
								let itemTpl3 = {};
								itemTpl3.label = item3;
								return itemTpl3;
							});
							return itemTpl2;
						});
						return itemTpl;
					});
				})
				.catch((error) => {
					this.loading.close();
					apis.errors.errorPublic(error.response, this);
				});
			}
		},
		components: {
			[CommonHeader.name]: CommonHeader,
			[CommonAside.name]: CommonAside
		}
	};
</script>
<style lang="scss">
	@import '../../assets/sass/partials/_var.scss';
	@import '../../assets/sass/partials/_border.scss';

	.nav-header {
		z-index: 1;
	    #sidebarToggleSM {
		    z-index: 10;
		    position: relative;
		}
		.brand {
			position: relative;
		}
	}
	.charts {
		.el-tree {
			max-height: 400px;
			overflow: scroll;
		}
		.main-chart {
			width: 100%;
			height: 600px;
		}
		.choose-list {
			border: 1px solid #e5e5e5;
			.choose-row {
				padding: 10px;
				border-bottom: 1px solid #a1a1a1;
				.delete {
					margin-left: 12px;
					color: blue;
					cursor: pointer;
				}
			}
			.choose-row:last-child {
				border-bottom: none;
			}
		}
	}
	.charts .el-dialog {
		min-width: 850px;
	}
	.sidebar-menu .main-menu ul li {
		cursor: pointer;
	}
	.dx-context {
		.charts-row {
			width: 50%;
			float: left;
			min-width: 400px;
			.topic {
				font-size: 13px;
				font-weight: bold;
				margin-bottom: 12px;
			}
		}
		.dozen-row {
			.el-input__inner {
				width: 200px;
			}
			.dozen-row-topic {
				font-size: 13px;
				font-weight: bold;
				margin-bottom: 12px;
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
