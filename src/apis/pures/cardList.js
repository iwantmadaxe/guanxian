function pureCardList (data) {
	let list = [];
	for (let i in data) {
		list.push({
			id: i,
			code: data[i]
		});
	}
	return list;
}
export default pureCardList;
