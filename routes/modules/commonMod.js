var formidable = require('formidable'),
    path = require('path'),
    fs = require('fs');

module.exports = {
    //文件上传
    imageUpload: function (req, res) {
        var form = new formidable.IncomingForm();

        form.keepExtensions = true; //保留后缀
        form.maxFieldsSize = 20 * 1024 * 1024; //文件大小
        form.uploadDir = path.join(__dirname, '../../files');

        form.parse(req, function(err, fields, files) {
            if (err) throw err;

            res.send({
                code: 200,
                data: files.file.path.split('\\').pop(),
                msg: ''
            });
        });
    },

    image: function (req, res) {
        var filePath = './files/' + req.query.fileName;
        res.sendfile(filePath);
    }
};
