<template>
  <div class="page">

    <div class="col">
    <div class="row">
      <span class="col">fontFamily : </span>
      <select class="col" v-model="fontFamily">
        <option v-for="font in fonts" v-bind:value="font">
          {{ font }}
        </option>
      </select>
    </div>
    <div class="row">
      <span class="col">Logos : </span>
      <select v-model="logo" class="col">
        <option v-for="logo in logos" v-bind:value="logo">
          {{ logo }}
        </option>
      </select>
    </div>
    <div class="row">
      <span class="col">Color : </span>
      <select class="col" v-model="mainColor">
        <option v-for="mainColor in mainColors" v-bind:value="mainColor">
          {{ mainColor }}
        </option>
      </select>
    </div>
    <div class="row centered">
        <button   v-on:click="saveToPng" >Preview as png</button>
    </div>
    <div class="board col">
      <canvas id='background'></canvas>
      <img  width="500" height="700" ref="preview" src="" />
    </div>
   </div>

  </div>
</template>

<script scoped>
import { fabric } from "fabric";

let FontFaceObserver = require("fontfaceobserver");

export default {
  name: "CocoricoEditor",
  props: {
    msg: String
  },

  data() {
    return {
      fontFamily: "Times New Roman",
      topText: "Taupe texte izi year !",
      titleText: "Le Ch'titre qui l'es bien là",
      authorsText: "Danny Boom & @cocoricorly",
      logo: "logo",
      mainColor: "darkmagenta",
      fonts: [
        "Times New Roman",
        "Pacifico",
        "VT323",
        "Quicksand",
        "Inconsolata"
      ],
      logos: require("./logos.json"),
      mainColors: require("./cocoricolors.json")
    };
  },

  mounted() {
    /*eslint no-console: ["error", { allow: ["warn", "error"] }] */
    this.$canvas = new fabric.Canvas("background", {
      width: 500,
      height: 700,
      backgroundColor: "white"
    });

    //heading line
    this.$headline = this.makeLine([5, 0, 495, 0], this.mainColor);
    this.$canvas.add(this.$headline);

    //top text
    let topTextbox = new fabric.Textbox(this.topText, {
      left: 50,
      top: 10,
      width: 400,
      fontSize: 20,
      fontStyle: "italic",
      borderColor: "green"
    });

    this.$canvas.add(topTextbox).setActiveObject(topTextbox);

    let _self = this;

    fabric.Image.fromURL("/animals/" + this.logo + ".png", function(oImg) {
      oImg.set("left", 125).set("top", 100);
      _self.$canvas.add(oImg);
      _self.$coverImg = oImg;
    });

    //title text
    this.$titleTextbox = new fabric.Textbox(this.titleText, {
      left: 10,
      top: 410,
      width: 490,
      height: 2000,
      textBackgroundColor: this.mainColor,
      borderColor: "green",
      selectionBackgroundColor: "yellow",
      backgroundColor: this.mainColor,
      stroke: this.mainColor,
      fill: "white",
      fontSize: 60,
      fontStyle: "normal"
    });

    this.$canvas.add(this.$titleTextbox);

    //title text
    let authorsTextbox = new fabric.Textbox(this.authorsText, {
      left: 200,
      top: 670,
      width: 300,
      borderColor: "green",
      selectionBackgroundColor: "yellow",
      fontSize: 20,
      fontStyle: "italic"
    });

    this.$canvas.add(authorsTextbox);

    //corocico copyright
    let cocoricoSymbol = new fabric.Text("?", {
      left: 70,
      top: 670,
      fontSize: 15,
      fontWeight: "bold"
    });
    this.$canvas.add(cocoricoSymbol).add(cocoricoSymbol);

    let cocoricopiright = new fabric.Text("CocoricoRLY", {
      left: 10,
      top: 680,
      fontSize: 10,
      fontWeight: "bold"
    });
    this.$canvas.add(cocoricopiright).add(cocoricopiright);

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
    },

    makeLine(coords, color) {
      return new fabric.Line(coords, {
        fill: color,
        stroke: color,
        strokeWidth: 5,
        selectable: false,
        originX: "left",
        originY: "top"
      });
    }
  },
  watch: {
    fontFamily: function() {
      /*eslint no-console: ["error", { allow: ["warn", "error"] }] */
      console.log("fontFamily changed to " + this.fontFamily, this);

      if (this.fontFamily !== "Times New Roman") {
        this.loadAndUse(this.fontFamily);
      } else {
        this.$canvas.getActiveObject().set("fontFamily", this.fontFamily);
        this.$canvas.requestRenderAll();
      }
    },

    logo: function() {
      console.log("fontFamily changed to " + this.logo, this);
      let _self = this;
      this.$coverImg.setSrc("/animals/" + this.logo + ".png", function(oImg) {
        oImg.set("left", 125).set("top", 100);
        _self.$canvas.add(oImg);
        _self.$coverImg = oImg;
      });
    },

    mainColor: function() {
      console.log("mainColor changed to " + this.mainColor, this);
      this.$headline.set({ fill: this.mainColor, stroke: this.mainColor });

      this.$titleTextbox.set({
        textBackgroundColor: this.mainColor,
        backgroundColor: this.mainColor,
        stroke: this.mainColor
      });

      this.$canvas.requestRenderAll();
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

div.board {
  display: inline-flex;
}

div.board img {
  margin-left: 0.8em;
}

.hidden {
  display: none;
}

.page {
  display: flex;
}
.col {
  flex: 1;
}
.row {
  box-sizing: border-box;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-flex: 0;
  -ms-flex: 0 1 auto;
  flex: 0 1 auto;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  -ms-flex-direction: row;
  flex-direction: row;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  margin-right: -0.5rem;
  margin-left: -0.5rem;
  padding:0.5em;
}

.row.centered{
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    text-align: center;
}
</style>
