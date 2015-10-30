'use strict';

var fs = require('fs');
var createJSONFromSpreadsheet = require('./index.js');

//https://docs.google.com/spreadsheets/d/1Tb3qcVq_qlBx41KoUda3PTx2_0QcuqkaXURnodvj6D4/edit#gid=319739613
// >>> file_id = 1Tb3qcVq_qlBx41KoUda3PTx2_0QcuqkaXURnodvj6D4
// >>> gid = 319739613

var config = {
    file_id: "1Tb3qcVq_qlBx41KoUda3PTx2_0QcuqkaXURnodvj6D4",
    credential: "./credential.json",
    sheets: [
        {
            gid: 0,//default 0
            key_name: "Key",
            value_name: "Value",
            dest: "./sheet1.json"
        },
        {
            gid: 1514469990,//default 0
            key_name: "Key",
            value_name: "Value",
            dest: "./sheet2.json"
        },
        {
            gid: 319739613,//default 0
            key_name: "Key",
            value_name: "Value",
            dest: "./sheet3.json"
        }
    ]
};

createJSONFromSpreadsheet(config, function(err){
    console.log('complete');
});
