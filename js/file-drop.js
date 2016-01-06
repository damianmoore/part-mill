function handleFileDrop(files) {
    for (var i = 0; i < files.length; i++) {
        var fileName = files[i].name;
        var fileType = files[i].type;
        var fileSize = files[i].size;
        var r = new FileReader();
        r.onload = function(e) {
            var contents = e.target.result;
            var extensionPat = /.*\.(js|txt|html|java|c|cpp|sql|stl)$/i;
            var mimePat = /^text.*/i;
            if (!extensionPat.test(fileName) && !mimePat.test(fileType)) {
                contents = btoa(contents);
                fileSize = contents.length;
            }
            $('#result').val("Got the file.\n" + "name: " + fileName + "\n" + "type: " + fileType + "\n" + "size: " + fileSize + " bytes\n" + "contents:\n\n" + contents);
            loadStl(contents);
        }
        r.readAsBinaryString(files[i]);
    }
}

$('#result').bind("dragenter dragover", function() {
    $('#dragBox, #topDiv').show();
});
$('#topDiv').bind("dragleave dragout", function() {
    $('#dragBox, #topDiv').hide();
});
$('#topDiv').bind("dragenter dragover", function(e) {
    e.preventDefault();
    return false;
});
$('#topDiv').bind("drop", function(e) {
    e.preventDefault();
    e.stopPropagation();
    e.originalEvent.preventDefault();
    e.originalEvent.stopPropagation();
    $('#dragBox, #topDiv').hide();
    var dt = e.originalEvent.dataTransfer;
    var files = dt.files;
    handleFileDrop(files);
    return false;
})
