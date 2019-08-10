const app = require("express")();
const multiparty = require("multiparty");
const fs = require('fs')

app.post("/submit", function(req, res, next){

    var form = new multiparty.Form();

    var document = {};
    var fstream = null;

    // populate fields
    form.on("field", function (name, value) {
        document[name] = value ;
    });

    form.on("part", function (part) {

        if (!part.filename) {
            return;
        }

        var path = part.filename;

        fstream = fs.createWriteStream(path);

        document.type = part.headers["content-type"]
        document.name = part.filename;
        document.size = part.byteCount;
        document.path = path;

        fstream.on("close", function () {
            res.send(document)
            res.end();
        });
        part.pipe(fstream);

    });

    form.on("close", function (data) {

        fstream.end();
        fstream = null;

    });

    form.parse(req);

    form.on("error", function(error){
        console.log(error);
    })
    
});

app.get("/", function(httpRequest, httpResponse, next){ 
    httpResponse.send("<form action='http://localhost:8080/submit' method='post' enctype='multipart/form-data'><input type='file' name='thumbnail' /><input type='submit' value='Submit' /></form>");
});

app.listen(8080);