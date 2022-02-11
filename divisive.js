const DATA = require('dsv-stream');
const sift = require('sift').default;
const fs = require('fs');
const ks = require('kitchen-sync');

let supportedTypes = [
    'DSV',
    'CSV',
    'SSV',
    'TSV'
]

module.exports = {
    parseData : (file, opts, cb)=>{
        let callback = typeof opts === 'function'?opts:cb;
        let options = typeof opts === 'function'?{}:opts;
        callback = ks(callback);
        const type = file.split('.').pop().toUpperCase();
        if(supportedTypes.indexOf(type) === -1){
            callback(new Error('Unsupported file type: '+type));
        }else{
            let stream = fs.createReadStream(file);
            let decomposer = new DATA[type]();
            let rows = [];
            let headers = null;

            decomposer.on('row', function(row){
                if(!headers) headers = row.data.map((header)=> header.trim());
                else{
                    let data = DATA.rowToObject(
                        row.data.map((header)=> header.trim()),
                        headers
                    );
                    if(opts.filter){
                        if(!sift(opts.filter)(data)) return;
                    }
                    if(opts.row){
                        let rowResult = opts.row(data);
                        if(rowResult) rows.push(rowResult);
                    }else rows.push(data);
                }
            });

            decomposer.on('complete', function(){
                callback(null, rows);
            });
            stream.pipe(decomposer.writer());
        }
        return callback.return;
    }
}
