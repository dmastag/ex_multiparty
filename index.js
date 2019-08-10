var app = require("express")();
var multiparty = require("multiparty");

app.post("/submit", function(httpRequest, httpResponse, next){

    var form = new multiparty.Form();

    form.on("part", function(part){
        if(part.filename)
        {
            var FormData = require("form-data");
            var request = require("request")
            var form = new FormData();

            form.append("thumbnail", part, {filename: part.filename,contentType: part["content-type"]});

            var r = request.post("http://localhost:7070/store", { "headers": {"transfer-encoding": "chunked"} }, function(err, res, body){ 
                httpResponse.send(res);
            });
            
            r._form = form
        }
    })

    form.on("error", function(error){
        console.log(error);
    })

    form.parse(httpRequest);    
    
});

app.get("/", function(httpRequest, httpResponse, next){ 
    httpResponse.send("<form action='http://localhost:9090/submit' method='post' enctype='multipart/form-data'><input type='file' name='thumbnail' /><input type='submit' value='Submit' /></form>");
});

app.listen(8080);