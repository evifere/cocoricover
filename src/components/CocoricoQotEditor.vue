<template>
<el-container :style="mainorientation">
  <el-aside width="508px" v-show="!isEditable">
        <img  width="500" height="175" ref="preview" src="" />
  </el-aside>
  <el-aside width="525px" v-show="isEditable" >
      <emoji-picker @emoji="insertEmoji" :search="search" v-show="isTextSelected">
                  <div class="emoji-invoker" slot="emoji-invoker" slot-scope="{ events: { click: clickEvent } }" @click.stop="clickEvent">
                     <svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0 0h24v24H0z" fill="none"/>
                      <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
                    </svg>
                  </div>
                  <div class="emoji-picker" slot="emoji-picker" slot-scope="{ emojis, insert, display }">
                    <div>
                      <div>
                        <input type="text" v-model="search">
                      </div>
                      <div>
                        <div v-for="(emojiGroup, category) in emojis" :key="category">
                          <h5>{{ category }}</h5>
                          <div>
                            <span
                              v-for="(emoji, emojiName) in emojiGroup"
                              :key="emojiName"
                              @click="insertEmoji(emoji)"
                              :title="emojiName"
                            >{{ emoji }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
        </emoji-picker>
        <canvas  id='background' tabindex="0" ></canvas>
  </el-aside>
  <el-container style="min-width: 500px;">
    <el-header>CocoriQot générateur de citation parodique ! <el-button @click="$router.push('cocoricover')">Couverture</el-button></el-header>
    <el-main>
        <hr/>
        <el-col class="params-panel">
          <el-row>
            <el-col :span="$mq | mq({ sm: 12, md: 4, lg: 4 })" class="col-label col-text-center"><label>Mais que fais la police !</label></el-col>
            <el-col :span="$mq | mq({ sm: 12, md: 4, lg: 4 })">
              <el-select v-model="currentTextObjectConfig.fontFamily" placeholder="Mais que fais la police ?" v-bind:disabled="!isTextSelected || !isEditable">
                <el-option v-for="font in allFonts" :key="font" :label="font" :value="font"><span :style="'font-family:'+font">{{ font }}</span></el-option>
              </el-select>
            </el-col>        
            <el-col :span="$mq | mq({ sm: 12, md: 4, lg: 4 })" class="col-label col-text-center"><label>Gérer les kilos en trop</label></el-col>
            <el-col :span="$mq | mq({ sm: 12, md: 4, lg: 4 })">
              <el-select v-model="currentTextObjectConfig.fontWeight" placeholder="font weight" v-bind:disabled="!isTextSelected || !isEditable">
                <el-option v-for="font in fontWeights" :key="font" :label="font" :value="font"></el-option>
              </el-select>
            </el-col>
            <el-col :span="$mq | mq({ sm: 12, md: 4, lg: 4 })" class="col-label col-text-center"><label>Avoir du style</label></el-col>
            <el-col :span="$mq | mq({ sm: 12, md: 4, lg: 4 })">
              <el-select v-model="currentTextObjectConfig.fontStyle" placeholder="font weight" v-bind:disabled="!isTextSelected || !isEditable">
                <el-option v-for="font in fontStyles" :key="font" :label="font" :value="font"></el-option>
              </el-select>
            </el-col>
          </el-row>
          <el-row type="flex" justify="center">            
            <el-col :span="$mq | mq({ sm: 24, md: 10, lg: 10 })">
              <el-checkbox v-model="currentTextObjectConfig.underline">Underline</el-checkbox>
              <el-checkbox v-model="currentTextObjectConfig.linethrough">Line through</el-checkbox>
              <el-checkbox v-model="currentTextObjectConfig.overline">Overline</el-checkbox>
            </el-col>
          </el-row>
          <el-row class="empty"></el-row>
          <el-row>
            <el-col :span="8" class="col-label col-text-left"><label>L'égoût et les couleurs !</label></el-col>
             <el-col :span="16">          
              <el-select v-model="mainColor" placeholder="L'égoût et les couleurs !" v-bind:disabled="!isEditable">
                <el-option v-for="mainColor in mainColors" :key="mainColor" :label="mainColor" :value="mainColor">
                  <el-row>
                    <el-col :span="16"><span >{{ mainColor }}</span></el-col> <el-col :span="8"><div class="color-box" :style="'background:'+mainColor+';'"></div></el-col>
                  </el-row>
                </el-option>
              </el-select>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8" class="col-label col-text-left"><label>La couleur de la plume est plus forte que le pêt.</label></el-col>
             <el-col :span="16">          
              <el-select v-model="currentTextObjectConfig.fill" placeholder="La couleur du texte" v-bind:disabled="!isTextSelected  || !isEditable">
                <el-option v-for="fillColor in mainColors" :key="fillColor" :label="fillColor" :value="fillColor">
                  <el-row>
                    <el-col :span="16"><span >{{ fillColor }}</span></el-col> <el-col :span="8"><div class="color-box" :style="'background:'+fillColor+';'"></div></el-col>
                  </el-row>
                </el-option>
              </el-select>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8" class="col-label col-text-left"><label>Text align</label></el-col>
            <el-col :span="16">
              <el-select v-model="currentTextObjectConfig.textAlign" placeholder="Alignement" v-bind:disabled="!isTextSelected  || !isEditable">
                <el-option v-for="alignment in alignments" :key="alignment" :label="alignment" :value="alignment.toLowerCase()"></el-option>
              </el-select>
            </el-col>
          </el-row>
          <el-row class="empty"></el-row>
          <el-row>
             <el-col :span="4" class="col-label col-text-left"><label>Thunder Stroke</label></el-col>
             <el-col :span="4">
              <el-color-picker v-model="currentTextObjectConfig.stroke" size="mini" color-format="hex"></el-color-picker>
             </el-col>
             <el-col :span="16"><el-slider v-model="currentTextObjectConfig.strokeWidth" :min="0" :max="10" :step="0.1" show-input v-bind:disabled="!isTextSelected || !isEditable"></el-slider></el-col>
          </el-row>
          <el-row>
             <el-col :span="8" class="col-label col-text-left"><label>Font size</label></el-col>
             <el-col :span="16"><el-slider v-model="currentTextObjectConfig.fontSize" :min="1" :max="120" :step="1" show-input v-bind:disabled="!isTextSelected  || !isEditable"></el-slider></el-col>
          </el-row>
          <el-row>
             <el-col :span="8" class="col-label col-text-left"><label>Line height</label></el-col>
             <el-col :span="16"><el-slider v-model="currentTextObjectConfig.lineHeight" :min="0" :max="10" :step="0.1" show-input v-bind:disabled="!isTextSelected  || !isEditable"></el-slider></el-col>
          </el-row>
          <el-row>
            <el-switch v-model="isEditable" active-text="Edition en cours" inactive-text="Mode Preview" v-on:change="saveToPng"> </el-switch>
          </el-row>
          <hr/>
          <el-row>
            <a ref="downloadPng" href="#" download="cocoriQot.png" v-show="false"></a>
            <el-button type="primary"  v-on:click="downloadPng" icon="el-icon-download">Png</el-button>
          </el-row>
      </el-col>
    </el-main>
    <el-footer align="right">copyright 2018-2019 @cocoricorly v{{version}}</el-footer>
  </el-container>
</el-container>

</template>

<script scoped>
import { fabric } from "fabric";
import {version} from '../../package.json';

let FontFaceObserver = require("fontfaceobserver");
import EmojiPicker from 'vue-emoji-picker';

export default {
  name: "CocoricoQotEditor",
  components: {
    EmojiPicker,
  },
  props: {
    msg: String
  },

  data() {
    return {
      input:'',
      search:'',
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
        strokeWidth: 1,
        stroke: "#ffffff"
      },
      isTextSelected: true,
      topText: "“ Je ne fais qu'une chose c'est que je ne fait rien ”",
      authorsText: "Benny Hillist , philosophe",
      mainColor: "darkmagenta",
      mainColors: require("./cocoricolors.json"),
      fonts: require("./fonts.json"),
      gofonts: require("./gofonts.json"),
      alignments: ["Left", "Center", "Justify", "Right"],
      isEditable: true,
      fontStyles: ["", "normal", "italic", "oblique"],
      fontWeights: ["bold", "normal", 400, 600, 800],
      version:version
    };
  },

  mounted() {
    this.$canvas = new fabric.Canvas("background", {
      width: 500,
      height: 175,
      backgroundColor: "white"
    });

    this.$canvas.upperCanvasEl.setAttribute("tabindex", "1");
    this.$canvas.upperCanvasEl.addEventListener('keydown',this.onKeyDown);
    //heading line
    this.$headline = this.makeLine([5, 0, 495, 0], this.mainColor);
    this.$canvas.add(this.$headline);

    //top text
    let topTextbox = new fabric.Textbox(this.topText, {
      left: 10,
      top: 10,
      width: 460,
      fontSize: 42,
      fontStyle: "italic",
      borderColor: "green",
      textAlign: "center"
    });

    //heading line
    this.$footline = this.makeLine([100, 140, 400, 140], this.mainColor);
    this.$canvas.add(this.$footline);

    this.$canvas.add(topTextbox).setActiveObject(topTextbox);
    this.currentTextObjectConfig = topTextbox.toObject();

    //title text
    let authorsTextbox = new fabric.Textbox(this.authorsText, {
      left: 280,
      top: 150,
      width: 300,
      borderColor: "green",
      selectionBackgroundColor: "yellow",
      fontSize: 20,
      fontStyle: "italic"
    });

    this.$canvas.add(authorsTextbox);

    //corocico copyright
    let cocoricoSymbol = new fabric.Text("💬", {
      left: 70,
      top: 150,
      fontSize: 15,
      fontWeight: "bold"
    });
    this.$canvas.add(cocoricoSymbol).add(cocoricoSymbol);

    let cocoricopiright = new fabric.Text("CocoricoRLY", {
      left: 10,
      top: 160,
      fontSize: 10,
      fontWeight: "bold"
    });
    this.$canvas.add(cocoricopiright).add(cocoricopiright);

    this.registerTextWatcher();

    this.$canvas.on("selection:cleared", this.onObjectSelected);

    this.$canvas.on("selection:created", this.onObjectSelected);

    this.$canvas.on("selection:updated", this.onObjectSelected);

    this.saveToPng();
          
    this.$canvas.requestRenderAll();

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

      if (!(currentObject === (void 0))) {
        this.isTextSelected = !(currentObject.type === "image");
        this.currentTextObjectConfig = currentObject.toObject();
      }
    },
    onKeyDown(evt){
      if (evt.code ==='Backspace' || evt.code ==='Delete'){
          this.deleteActiveObject();
      }
    },

    deleteActiveObject(){
    var object = this.$canvas.getActiveObject();
      if (!object) {
        return;
      }
     this.$canvas.remove(object);
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
          /*eslint no-console: ["error", { allow: ["warn", "error"] }] */
          console.error(e);
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
    },
    
    insertEmoji(emoji) {
      let object = this.$canvas.getActiveObject();
      let insertAt = (object.selectionStart > 0) ? object.selectionStart : object._text.length;
      object.insertChars(emoji,null,insertAt);
      this.$canvas.requestRenderAll();
    }
  },
  computed:{
    allFonts(){
     return this.fonts.concat(this.gofonts); 
    },

    mainorientation() {
      return this.$mq === "sm"
        ? { display: "flex", "flex-direction": "column" }
        : null;
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

    mainColor: function() {
      this.$headline.set({ fill: this.mainColor, stroke: this.mainColor });
      this.$footline.set({ fill: this.mainColor, stroke: this.mainColor });
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
.el-aside img {
  border: 1px solid blue;
}

.el-aside {
  overflow: hidden;
  min-height: 706px;
  margin-top: 14rem;
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
.params-panel .el-row .el-col label,.params-panel .el-row .el-col.col-label{
padding-top: .5em;
}

.col-text-left{
text-align:left;
}

.col-text-center{
text-align:center;
}
.color-box{
  margin-top:8px;width:16px;height:16px;
}
.el-row.empty{
  height:2em;
}


.wrapper {
  position: relative;
  display: inline-block;
}

.regular-input {
  padding: 0.5rem 1rem;
  border-radius: 3px;
  border: 1px solid #ccc;
  width: 20rem;
  height: 12rem;
}

.emoji-invoker {
  position: absolute;
  z-index: 1;
  top: 18.5rem;
  left:29.5rem;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s;
}
.emoji-invoker:hover {
  transform: scale(1.1);
}
.emoji-invoker > svg {
  fill: #b1c6d0;
}

.emoji-picker {
  position: absolute;
  z-index: 1;
  left: 29.5rem;
  font-family: Montserrat;
  border: 1px solid #ccc;
  width: 15rem;
  height: 50rem;
  overflow: hidden;
  padding: 1rem;
  box-sizing: border-box;
  border-radius: 0.5rem;
  background: #fff;
  box-shadow: 1px 1px 8px #c7dbe6;
  cursor: pointer;
}
.emoji-picker__search {
  display: flex;
}
.emoji-picker__search > input {
  flex: 1;
  border-radius: 10rem;
  border: 1px solid #ccc;
  padding: 0.5rem 1rem;
  outline: none;
}
.emoji-picker h5 {
  margin-bottom: 0;
  color: #b1b1b1;
  text-transform: uppercase;
  font-size: 0.8rem;
  cursor: default;
}
.emoji-picker .emojis {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.emoji-picker .emojis:after {
  content: "";
  flex: auto;
}
.emoji-picker .emojis span {
  padding: 0.2rem;
  cursor: pointer;
  border-radius: 5px;
}
.emoji-picker .emojis span:hover {
  background: #ececec;
  cursor: pointer;
}

</style>
