let fs = require('fs')
let path = require('path')

let outputFiles = ['./ydk/src/main/assets/ShareSDK.xml','./appkey.properties'];
//
let appJson= require("../app.json");

for(let outputFile of outputFiles){
    generateFile(outputFile);
}


function generateFile(outputFile){
    let paths = outputFile.split('.')
    paths[paths.length-2]= paths[paths.length-2]+"-template";
    let templateFile =path.join(__dirname, paths.join('.'))//合成
    console.log('templateFile', templateFile)
    let content = fs.readFileSync(templateFile).toString();
    for(let key in appJson){
//    content = content.replace('{'+key+'}',appJson[key]);//替换匹配到的第一个
    content = content.replace(new RegExp('{'+key+'}',"gm"),appJson[key]);//全部替换
    }
    fs.writeFileSync(outputFile,content,"utf8");

}




