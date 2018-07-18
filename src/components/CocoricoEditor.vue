<template>
<el-container>
  <el-aside width="508px" v-show="!isEditable">
        <img  width="500" height="700" ref="preview" src="" />
  </el-aside>
  <el-aside width="525px" v-show="isEditable">
        <canvas id='background'></canvas>
  </el-aside>
  <el-container>
    <el-header>Cocoricorly générateur de couverture parodique !</el-header>
    <el-main>
        <hr/>
        <el-col class="params-panel">
          <el-row>
            <el-col :span="8">Mais que fais la police !</el-col>
            <el-col :span="16">
              <el-select v-model="currentTextObjectConfig.fontFamily" placeholder="Mais que fais la police ?" v-bind:disabled="!isTextSelected || !isEditable">
                <el-option v-for="font in fonts" :key="font" :label="font" :value="font"></el-option>
              </el-select>
            </el-col>        
          </el-row>
          <el-row>
            <el-col :span="8">Gérer les kilos en trop</el-col>
            <el-col :span="16">
              <el-select v-model="currentTextObjectConfig.fontWeight" placeholder="font weight" v-bind:disabled="!isTextSelected || !isEditable">
                <el-option v-for="font in fontWeights" :key="font" :label="font" :value="font"></el-option>
              </el-select>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">Avoir du style </el-col>
            <el-col :span="6">
              <el-select v-model="currentTextObjectConfig.fontStyle" placeholder="font weight" v-bind:disabled="!isTextSelected || !isEditable">
                <el-option v-for="font in fontStyles" :key="font" :label="font" :value="font"></el-option>
              </el-select>
            </el-col>
            <el-col :span="10">
              <el-checkbox v-model="currentTextObjectConfig.underline">Underline</el-checkbox>
              <el-checkbox v-model="currentTextObjectConfig.linethrough">Line through</el-checkbox>
              <el-checkbox v-model="currentTextObjectConfig.overline">Overline</el-checkbox>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">Un logo logo dans la case avec ma frame !</el-col>
            <el-col :span="16">
              <el-select v-model="logo" placeholder="Ton logo c'est ici !" v-bind:disabled="!isEditable">
                <el-option v-for="logo in logos" :key="logo" :label="logo" :value="logo"></el-option>
              </el-select>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">L'égoût et les couleurs !</el-col>
             <el-col :span="16">          
              <el-select v-model="mainColor" placeholder="L'égoût et les couleurs !" v-bind:disabled="!isEditable">
                <el-option v-for="mainColor in mainColors" :key="mainColor" :label="mainColor" :value="mainColor"></el-option>
              </el-select>
            </el-col>
          </el-row>
          <el-row>
             <el-col :span="8">Thunder Stroke</el-col>
             <el-col :span="8">
              <el-color-picker v-model="currentTextObjectConfig.stroke" size="mini" color-format="hex"></el-color-picker>
             </el-col>
             <el-col :span="8"><el-slider v-model="currentTextObjectConfig.strokeWidth" :min="0" :max="10" :step="0.1" show-input v-bind:disabled="!isTextSelected || !isEditable"></el-slider></el-col>
          </el-row>
          <el-row>
            <el-col :span="8">La couleur de la plume est plus forte que le pêt.</el-col>
             <el-col :span="16">          
              <el-select v-model="currentTextObjectConfig.fill" placeholder="La couleur du texte" v-bind:disabled="!isTextSelected  || !isEditable">
                <el-option v-for="fillColor in mainColors" :key="fillColor" :label="fillColor" :value="fillColor"></el-option>
              </el-select>
            </el-col>
          </el-row>
          <el-row>
             <el-col :span="8">Font size</el-col>
             <el-col :span="16"><el-slider v-model="currentTextObjectConfig.fontSize" :min="1" :max="120" :step="1" show-input v-bind:disabled="!isTextSelected  || !isEditable"></el-slider></el-col>
          </el-row>
          <el-row>
             <el-col :span="8">Line height</el-col>
             <el-col :span="16"><el-slider v-model="currentTextObjectConfig.lineHeight" :min="0" :max="10" :step="0.1" show-input v-bind:disabled="!isTextSelected  || !isEditable"></el-slider></el-col>
          </el-row>
          <el-row>
            <el-col :span="8">Text align</el-col>
            <el-col :span="16">
              <el-select v-model="currentTextObjectConfig.textAlign" placeholder="Alignement" v-bind:disabled="!isTextSelected  || !isEditable">
                <el-option v-for="alignment in alignments" :key="alignment" :label="alignment" :value="alignment.toLowerCase()"></el-option>
              </el-select>
            </el-col>
          </el-row>
          <el-row>
            <el-switch v-model="isEditable" active-text="Edition en cours" inactive-text="Mode Preview" v-on:change="saveToPng"> </el-switch>
          </el-row>
          <hr/>
          <el-row>
            <a ref="downloadPng" href="#" download="cocoricover.png" v-show="false"></a>
            <el-button type="primary"  v-on:click="downloadPng" icon="el-icon-download">Png</el-button>
          </el-row>
      </el-col>
    </el-main>
    <el-footer align="right">copyright 2018 @cocoricorly </el-footer>
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
      currentTextObjectConfig: {
        fontFamily: "Times New Roman",
        fontWeight: "normal",
        fontStyle: "normal",
        fontSize: 5,
        underline: false,
        linethrough: false,
        overline: false,
        lineHeight: 1.16,
        textAlign: "left",
        fill: "white",
        strokeWidth:1,
        stroke: "#ffffff"
      },
      isTextSelected: true,
      topText: "Taupe texte izi year !",
      guideText: "Le guide expéditif.",
      guideTextBottom: "100 % pas remboursé !",
      titleText: "Le Ch'titre qui l'es bien là",
      authorsText: "Danny Boom & @cocoricorly",
      logo: "logo",
      mainColor: "darkmagenta",
      logos: require("./logos.json"),
      mainColors: require("./cocoricolors.json"),
      fonts: require("./fonts.json"),
      gofonts: require("./gofonts.json"),
      alignments: ["Left", "Center", "Justify", "Right"],
      isEditable: true,
      fontStyles: ["", "normal", "italic", "oblique"],
      fontWeights: ["bold", "normal", 400, 600, 800]
    };
  },

  mounted() {
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
      borderColor: "green",
      textAlign: "center"
    });

    this.$canvas.add(topTextbox).setActiveObject(topTextbox);
    this.currentTextObjectConfig = topTextbox.toObject();
    let _self = this;

    let baseUrl =
      process.env.NODE_ENV === "production "
        ? "http://evifere.lescigales.org/cocoricover/animals/"
        : "./animals/";

    fabric.Image.fromURL(baseUrl + this.logo + ".png", function(oImg) {
      oImg.set("left", 125).set("top", 100);
      _self.$canvas.add(oImg);
      _self.$coverImg = oImg;
    });

    //guide text
    let guideTextbox = new fabric.Textbox(this.guideText, {
      left: 10,
      top: 390,
      width: 490,
      fontSize: 20,
      fontStyle: "normal",
      borderColor: "green",
      textAlign: "left"
    });

    this.$canvas.add(guideTextbox);

    //guide text
    let guideTextboxBottom = new fabric.Textbox(this.guideTextBottom, {
      left: 10,
      top: 560,
      width: 490,
      fontSize: 20,
      fontStyle: "bold",
      borderColor: "green",
      textAlign: "right",
      linethrough: true
    });

    this.$canvas.add(guideTextboxBottom);

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
      fontStyle: "normal",
      stroke:"#C96B1D"
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

    this.registerTextWatcher();

    this.$canvas.on("selection:cleared", this.onObjectSelected);

    this.$canvas.on("selection:created", this.onObjectSelected);

    this.$canvas.on("selection:updated", this.onObjectSelected);

    this.saveToPng();
  },

  methods: {
    /**
     * registerTextWatcher - map defaut wtacher for main currentTextObjectConfig values
     *
     */
    registerTextWatcher() {
      Object.keys(this.currentTextObjectConfig)
        .filter(confKey => confKey !== "fontFamily")
        .forEach(confKey =>
          this.$watch("currentTextObjectConfig." + confKey, newVal =>
            this.setActiveProp(confKey, newVal)
          )
        );
    },
    onObjectSelected(evt) {
      let currentObject = this.$canvas.findTarget(evt);
      this.isTextSelected = false;
      if (!!currentObject) {
        this.isTextSelected = !(currentObject.type === "image");
        this.currentTextObjectConfig = currentObject.toObject();
      }
    },

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
    "currentTextObjectConfig.fontFamily"() {
      if (this.gofonts.includes(this.currentTextObjectConfig.fontFamily)) {
        this.loadAndUse(this.currentTextObjectConfig.fontFamily);
      } else {
        this.setActiveProp(
          "fontFamily",
          this.currentTextObjectConfig.fontFamily
        );
      }
    },

    logo() {
      let _self = this;
      let baseUrl =
        process.env.NODE_ENV === "production "
          ? "http://evifere.lescigales.org/cocoricover/animals/"
          : "./animals/";

      this.$coverImg.setSrc(baseUrl + this.logo + ".png", function(oImg) {
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

.el-aside {
  overflow: hidden;
  min-height: 706px;
}

.el-header {
  font-size: 30px;
  font-weight: bold;
}

.el-footer {
  font-size: 20px;
  font-weight: italic;
}

.params-panel .el-row {
  padding-top: 0.6em;
}
</style>
