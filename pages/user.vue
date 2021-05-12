<template>
	<view>
		{{title}}--{{name}}
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title:"",
				name:""
			}
		},
		onLoad(e) {
			if(e){
				this.title = e.title;
				this.name = e.name;
			}
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
