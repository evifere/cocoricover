<template>
<el-container>
  <el-aside width="505px">
      <canvas id='background'></canvas>
      <img  width="500" height="700" ref="preview" src="" />
  </el-aside>
  <el-container>
    <el-header>Cocoricorly générateur de couverture parodique !</el-header>
    <el-main>
      <el-col>
        <el-row>
          <el-select v-model="fontFamily" placeholder="Mais que fais la police ?">
            <el-option v-for="font in fonts" :key="font" :label="font" :value="font"></el-option>
          </el-select>
        </el-row>
        <el-row>
          <el-select v-model="logo" placeholder="Ton logo c'est ici !">
            <el-option v-for="logo in logos" :key="logo" :label="logo" :value="logo"></el-option>
          </el-select>
        </el-row>
        <el-row>
          <span class="col">Color : </span>
          <select class="col" v-model="mainColor">
            <option v-for="mainColor in mainColors" v-bind:value="mainColor">
              {{ mainColor }}
            </option>
          </select>
        </el-row>
        <el-row>
           <el-col :span="8">Font size</el-col>
           <el-col :span="16"><el-slider v-model="fontSize" :min="1" :max="120" :step="1" show-input></el-slider></el-col>
        </el-row>
        <el-row>
           <el-col :span="8">Line height</el-col>
           <el-col :span="16"><el-slider v-model="lineHeight" :min="0" :max="10" :step="0.1" show-input></el-slider></el-col>
        </el-row>
        <el-row>
          <el-col :span="8">Text align</el-col>
          <el-col :span="16">
            <el-select v-model="textAlign" placeholder="Alignement">
              <el-option v-for="alignment in alignments" :key="alignment" :label="alignment" :value="alignment.toLowerCase()"></el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row>
          <el-button type="primary" plain v-on:click="saveToPng">Preview as png</el-button>
          <a ref="downloadPng" href="#" download="cocoricover.png" v-show="false"></a>
          <el-button type="primary"  v-on:click="downloadPng" icon="el-icon-download">Png</el-button>
        </el-row>
    </el-col>


    </el-main>
    <el-footer>copyright 2018 @cocoricorly </el-footer>
  </el-container>
</el-container>

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
      fontSize: 20,
      lineHeight: 1.16,
      textAlign: "left",
      topText: "Taupe texte izi year !",
      titleText: "Le Ch'titre qui l'es bien là",
      authorsText: "Danny Boom & @cocoricorly",
      logo: "logo",
      mainColor: "darkmagenta",
      logos: require("./logos.json"),
      mainColors: require("./cocoricolors.json"),
      fonts: require("./fonts.json"),
      gofonts: require("./gofonts.json"),
      alignments:["Left","Center","Justify","Right"]
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

    fabric.Image.fromURL("./animals/" + this.logo + ".png", function(oImg) {
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
    setActiveProp(name, value) {
      var object = this.$canvas.getActiveObject();
      if (!object) {
        return;
      }

      object.set(name, value).setCoords();
      this.update();
      this.$canvas.renderAll();
    },

    update() {
      if (!this.$canvas) {
        return;
      }
      this.$canvas.fire("canvas:modified");
      this.$canvas.requestRenderAll();
    },
    loadAndUse(font) {
      let myfont = new FontFaceObserver(font);
      let _self = this;
      myfont
        .load()
        .then(function() {
          // when font is loaded, use it.
          _self.setActiveProp("fontFamily", font);
        })
        .catch(function(e) {
          console.log(e);
          alert("font loading failed " + font);
        });
    },

    saveToPng() {
      this.$refs.preview.src = this.$canvas.toDataURL("image/png");
    },

    downloadPng() {
      this.$refs.downloadPng.href = this.$canvas.toDataURL("image/png");
      this.$refs.downloadPng.click();
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
    fontFamily() {
      /*eslint no-console: ["error", { allow: ["warn", "error"] }] */

      if (this.gofonts.includes(this.fontFamily)) {
        console.log("loadAndUse fontFamily changed to " + this.fontFamily);

        this.loadAndUse(this.fontFamily);
      } else {
        console.log("fontFamily changed to " + this.fontFamily.toLowerCase());

        this.setActiveProp("fontFamily", this.fontFamily.toLowerCase());
      }
    },

    logo() {
      let _self = this;
      this.$coverImg.setSrc("/animals/" + this.logo + ".png", function(oImg) {
        oImg.set("left", 125).set("top", 100);
        _self.$canvas.add(oImg);
        _self.$coverImg = oImg;
      });
    },

    mainColor: function() {
      this.$headline.set({ fill: this.mainColor, stroke: this.mainColor });

      this.$titleTextbox.set({
        textBackgroundColor: this.mainColor,
        backgroundColor: this.mainColor,
        stroke: this.mainColor
      });

      this.$canvas.requestRenderAll();
    },
    fontSize() {
      this.setActiveProp("fontSize", this.fontSize);
    },
    lineHeight() {
      this.setActiveProp("lineHeight", this.lineHeight);
    },
    textAlign() {
      this.setActiveProp("textAlign", this.textAlign);
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
  padding: 0.5em;
}

.row.centered {
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  text-align: center;
}
</style>
