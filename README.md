# ex_multiparty
implementation of multiparty directly into fs

# explanation
Most implementations are using the form.on('file') implemention, which is adding a temporary file into the file system.

If you want to actually upload a file into the file system, then using 'file' you would copy the temporary file into the actual folder you want it.

This implementation streams the file directly into your file system.

# references

This tutorial shows how to use the form.('part') to stream a file, it also has a simple form for the front end
http://qnimate.com/stream-file-uploads-to-storage-server-in-node-js/

This stack overflow question resolves how to create pipe the file to fs.createWriteStream.
https://stackoverflow.com/questions/29846199/uploading-document-in-nodejs-using-fs-module-error-write-after-end
