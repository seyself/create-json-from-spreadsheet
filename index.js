'use strict';

var fs = require('fs');
var GoogleSpreadsheet = require('google-spreadsheet');

function gid_to_wid(gid) {
  var xorval = gid > 31578 ? 474 : 31578;
  var letter = gid > 31578 ? 'o' : '';
  return letter + parseInt((gid ^ xorval)).toString(36);
}

module.exports = function(params, callback)
{
    var credential = require(params.credential);
    var spreadSheet = new GoogleSpreadsheet(params.file_id);
    var queue = [];
    var sheet_ids = [];
    var len = params.sheets.length;
    for (var i=0; i<len; i++)
    {
        var worksheet_id = gid_to_wid(params.sheets[i].gid || 0);
        sheet_ids.push(worksheet_id);
    }

    spreadSheet.useServiceAccountAuth(credential, function(err){
        if (err)
        {
            if (callback) callback(err);
            return;
        }

        spreadSheet.getInfo(function(err, sheet_info){
            if (err)
            {
                if (callback) callback(err);
                return;
            }

            var numSheets = sheet_info.worksheets.length;
            for (var i=0; i<numSheets; i++)
            {
                var sheet = sheet_info.worksheets[i];
                var index = sheet_ids.indexOf(sheet.id);
                if (index >= 0)
                {
                    queue.push({
                        params: params.sheets[index],
                        sheet: sheet
                    });
                }
            }

            next();
        });
    });

    function next()
    {
        var data = queue.shift();
        if (data)
        {
            var sheet = data.sheet;
            var params = data.params;
            console.log(sheet.title + ' [' + params.gid + ']');
            sheet.getRows(function(err, rows){
                if (err)
                {
                    if (callback) callback(err);
                    return;
                }

                var len = rows.length;
                var table = [];
                var data = {};
                for(var i=0;i<len;i++)
                {
                    var item = rows[i];
                    var key = item[params.key_name];
                    var value = item[params.value_name];
                    data[key] = value;
                }
                var json = JSON.stringify(data, null, "  ");

                fs.writeFileSync(params.dest, json, 'utf-8');

                next();
            });
        }
        else
        {
            if (callback)
                callback(null);
        }
    }
}




