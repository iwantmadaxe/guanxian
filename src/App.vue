<template>
	<div id="wrapper">
		<router-view></router-view>
	</div>
</template>

<script>
export default {
	return () {
	},
	computed: {
		visible () {
			return ['/', '/header', '/search'].indexOf(this.$route.path) < 0;
		}
	}
};
</script>

<style lang="scss">
@import 'assets/sass/base/normalize.scss';
@import 'assets/sass/base/mobile.scss';
@import 'assets/sass/base/base.scss';
@import 'assets/fonts/iconfont.css';

html {
  height: 100%;
  font-family: Microsoft YaHei;
}

body{
	background-color: #f0f2f5;
}

#wrapper {
  color: #666;
  width: 100%;
  text-align: left;
}
</style>
