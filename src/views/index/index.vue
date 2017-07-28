<template>
	<div class="index">

	</div>
</template>

<script type="text/javascript">
	// import apis from '../../apis/index.js';
	// import axios from 'axios';

	export default {
		name: 'dx-index',
		data () {
			return {
			};
		},
		created () {
		},
		methods: {
			goServiceDetail (id) {
				this.$router.push({name: 'ServiceList', params: {category_no: id}});
			},
			goPackageList () {
				this.$router.push({name: 'PackageListChoose'});
			},
			goFlowCheck () {
				this.$router.push({name: 'QueryDataChoose'});
			},
			goFlowRecord () {
				this.$router.push({name: 'RecordListChoose'});
			}
		},
		components: {
		}
	};
</script>
<style lang="scss">
	@import '../../assets/sass/partials/_var.scss';
	@import '../../assets/sass/partials/_border.scss';

</style>
