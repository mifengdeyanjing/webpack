
import "./style/icon/iconfont.css"//引入字体图标库
import "./style/index.css";
import "./style/styleLess.less";
import "./style/styleScss.scss";
import "./style/styleSass.sass";
import json from "./data/a.json";
import xml from './data/a.xml';
import notes from './data/a.csv';
import _ from 'lodash';
import React from "react";
import ReactDOM from "react-dom/client";
import Hello from './react/Hello';

const domContainer = document.getElementById('App');
const root = ReactDOM.createRoot(domContainer);
root.render(<Hello/>);

let x = 100
console.log(x,'x')
console.log(_(),'lodash')
console.log(json,'json')
console.log(xml,'xml')
console.log(notes,'notes')