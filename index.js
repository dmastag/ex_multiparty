const app = require("express")();
const multiparty = require("multiparty");
const fs = require('fs')

app.post("/submit", function(req, res, next){

    var form = new multiparty.Form();

    var documents = [];
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
        const document = {};

        document.type = part.headers["content-type"]
        document.name = part.filename;
        document.size = part.byteCount;
        document.path = path;

        documents.push(document);
        part.pipe(fstream);

    });

    form.on("close", function (data) {

        fstream.end();
        fstream = null;

        res.send({files: documents})
        res.end();

    });

    form.parse(req);

    form.on("error", function(error){
        console.log(error);
    })
    
});

app.get("/", function(httpRequest, httpResponse, next){ 
    httpResponse.send(`
            <form action='http://localhost:8080/submit' method='post' enctype='multipart/form-data'>
                <input type='file' name='thumbnail' />
                <input type='file' name='test' />
                <input type='submit' value='Submit' />
            </form>`);
});

app.listen(8080);