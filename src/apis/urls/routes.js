const apiRoutes = {
	login: 'Employee/Login',  //  登陆
	macAdd: 'Machine/Add',  //  添加机器
	macList: 'Machine/Paging',  //  机器列表
	macEdit: 'Machine/Modify',  //  机器编辑
	macDelete: 'Machine/Delete',  //  机器删除
	macSingle: 'Machine/Get',  //  机器单个详情
	macGetAll: 'Machine/GetAll',  //  机器列表
	reactAdd: 'Chamber/Add',  //  腔体添加
	reactList: 'Chamber/Paging',  //  腔体列表
	reactEdit: 'Chamber/Modify',  //  腔体编辑
	reactSingle: 'Chamber/Get',  //  腔体单个详情
	reactDelete: 'Chamber/Delete',  //  腔体删除
	reactListOfMac: 'Chamber/GetChamber',  //  根据机器Id获取腔体列表
	channelGetDataItem: 'Channel/GetDataItem',  //  根据腔体Id获取图表搜索条件
	channelGetRunIdList: 'Channel/GetRunIdList',  //  根据recipeId获取runId下拉列
	getChartsData: 'Channel/GetDataLogger'  //  获取图表数据
};

export default apiRoutes;
