<template>
  <div class="page">
  	<div>
   		<canvas id='background' width="500" height="500"></canvas>
   		<img  width="500" height="500" ref="preview" src="" />
   	</div>
   <div>
   		<span>fontFamily : </span>
		<select v-model="fontFamily">
		  <option v-for="font in fonts" v-bind:value="font">
		    {{ font }}
		  </option>
		</select>
		<button   v-on:click="saveToPng" >Preview as png</button>
   </div>
  </div>
</template>

<script scoped>
import { fabric } from "fabric";
let FontFaceObserver = require("fontfaceobserver");

export default {
  name: 'CocoricoEditor',
  props: {
    msg: String
  },

	data() {
		return {
			fontFamily: "",
			fonts: ["Pacifico", "VT323", "Quicksand", "Inconsolata"]
		};
	},

	mounted() {
		/*eslint no-console: ["error", { allow: ["warn", "error"] }] */
		this.$canvas = new fabric.Canvas("background");

		let textbox = new fabric.Textbox("Lorum ipsum dolor sit amet", {
			left: 50,
			top: 50,
			width: 150,
			fontSize: 20
		});
		this.$canvas.add(textbox).setActiveObject(textbox);
		this.saveToPng();
	},

	methods: {
		loadAndUse(font) {
			let myfont = new FontFaceObserver(font);
			let _self = this;
			myfont
				.load()
				.then(function() {
					// when font is loaded, use it.
					_self.$canvas.getActiveObject().set("fontFamily", font);
					_self.$canvas.requestRenderAll();
				})
				.catch(function(e) {
					console.log(e);
					alert("font loading failed " + font);
				});
		},

		saveToPng() {
			this.$refs.preview.src = this.$canvas.toDataURL("image/png");
		}
	},
	watch: {
		fontFamily: function() {
			/*eslint no-console: ["error", { allow: ["warn", "error"] }] */
			console.log("fontFamily changed to " + this.fontFamily, this);

			if (this.fontFamily !== "Times New Roman") {
				this.loadAndUse(this.fontFamily);
			} else {
				this.$canvas
					.getActiveObject()
					.set("fontFamily", this.fontFamily);
				this.$canvas.requestRenderAll();
			}
		}
	}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
div.page {
	display: inline-flex;
}

canvas,
img {
	border: 1px solid blue;
}
</style>
