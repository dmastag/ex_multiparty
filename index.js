const app = require("express")();
const multiparty = require("multiparty");
const {createWriteStream} = require('fs')
const allowExt = ["jpg", "jpeg", "png"];

app.post("/submit", function(req, res, next){

    var form = new multiparty.Form();

    var documents = [];
    var fstream = null;

    // populate fields
    form.on("field", function (name, value) {
        documents.push({name: name, value: value});
    });

    form.on("part", function (part) {

        if (!part.filename) {
            return part.resume();
        }

        if (allowExt.indexOf(part.filename.split('.').pop()) === -1) {
            hasError = true;
            req.unpipe(form)
            return res.status(415).json({message: "Filetype not allowed"})
        }

        var path = part.filename;

        fstream = createWriteStream(path);
        const document = {};

        document.type = part.headers["content-type"]
        document.name = part.filename;
        document.size = part.byteCount;
        document.path = path;

        documents.push(document);
        part.pipe(fstream);

    });

    form.on("close", function (data) {
            
        if(fstream) {
            fstream.end();
            fstream = null;
        }   
    
        res.send({files: documents})
        res.end();
    });

    form.parse(req);

    form.on("error", function(error){
        console.log(error);
        req.unpipe(form)
        res.status(status || 400).json('something went wrong')
    })
    
});

app.get("/", function(httpRequest, httpResponse, next){ 
    httpResponse.send(`
            <form action='http://localhost:8080/submit' method='post' enctype='multipart/form-data'>
                <input type='text' name='title'><br>
                <input type='file' name='thumbnail' />
                <input type='file' name='test' />
                <input type='submit' value='Submit' />
            </form>`);
});

app.listen(8080);