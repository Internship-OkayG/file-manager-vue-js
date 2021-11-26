const express = require('express');
const path = require('path')
const app = express();
const fs = require('fs');
const dotenv = require('dotenv')
const multer = require('multer');

dotenv.config({ path: './config.env' })
const port = process.env.PORT || 8000;

const responsedelay = 50;   // miliseconds

// static folders
app.use(express.static('public'));
app.use(express.static('userfiles'));
app.use(express.static('vue'));

// home page
app.get('/', function (req, res) {
    res.sendFile('index.html');
});

// upload handler
var uploadStorage = multer.diskStorage(
    {
        destination: function (req, file, cb) {
            cb(null, `./userfiles/${req.query.type}`);  ///${req.folder}`);
        },
        filename: function (req, file, cb) {
            //let fileName = checkFileExistense(req.query.folder ,file.originalname);
            cb(null, file.originalname);
        }
    });

var upload = multer({ storage: uploadStorage });

app.post('/', upload.single('file'), function (req, res) {
    console.log(req.file);
    res.send('file upload...');
});

// all type of files except images will explored here
app.post('/files-list', function (req, res) {
    let folder = req.query.folder;
    let contents = '';
    let isfolder = false;
    let isfile = false
    let readingdirectory = `./userfiles/${folder}`;

    fs.readdir(readingdirectory, function (err, files) {
        if (err) { console.log(err); }
        else if (files.length > 0) {
            files.forEach(function (value, index, array) {
                fs.stat(`${readingdirectory}/${value}`, function (err, stats) {
                    // console.log(stats)
                    if (value.lastIndexOf('.') == -1) {
                        fs.readdir(`${readingdirectory}/${value}`, function (err, f ) {
                            if (err) { console.log(err); }
                            f.forEach(function (v, i, a) {
                                fs.stat(`${readingdirectory}/${value}/${v}`, function (err, stats) {
                                    if (err) { console.log(err); }
                                    let filesize = ConvertSize(stats.size);
                                    contents += '<tr><td><a href="/' + folder + '/' + value + '/' + encodeURI(v) + '">' + value + '/' + v + '</a></td><td>' + filesize + '</td><td>/' + folder + '/' + value + '/' + encodeURI(v) +'</td></tr>' + '\n';
                                    if (i == (a.length - 1)) {  res.send(contents)  }
                                });
                            })

                        }) 

                    }
                    else {
                        let filesize = ConvertSize(stats.size);
                        contents += '<tr><td><a href="/' + folder + '/' + encodeURI(value) + '">' + value + '</a></td><td>' + filesize + '</td><td>/' + folder + '/' + value + '</td></tr>' + '\n';
                        if (index == (array.length - 1)) { res.send(contents) }
                        // console.log("else "+contents)
                    }
                });
            });
        }
        else {
            console.log("Running else")
            res.send(contents); 
        }
    });
});

function ConvertSize(number) {
    if (number <= 1024) { return (`${number} Byte`); }
    else if (number > 1024 && number <= 1048576) { return ((number / 1024).toPrecision(3) + ' KB'); }
    else if (number > 1048576 && number <= 1073741824) { return ((number / 1048576).toPrecision(3) + ' MB'); }
    else if (number > 1073741824 && number <= 1099511627776) { return ((number / 1073741824).toPrecision(3) + ' GB'); }
}


app.get('/files', function (req, res) {
    fs.readdir(`./userfiles`, function (err, files) {
        res.send(files)
    })
});


// start server
app.listen(port, function () {
    console.log(`Server is started on port: ${port}`);
});