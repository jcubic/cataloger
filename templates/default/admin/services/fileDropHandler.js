function fileDropHandler($q) {
    function process(event, path, upload_file) {
        var defered = $q.defer();
        var self = this;
        if (event.originalEvent) {
            event = event.originalEvent;
        }
        var items;
        if (event.dataTransfer.items) {
            items = [].slice.call(event.dataTransfer.items);
        }
        var files = (event.dataTransfer.files || event.target.files);
        if (files) {
            files = [].slice.call(files);
        }
        if (items && items.length) {
            if (items[0].webkitGetAsEntry) {
                var entries = [];
                items.forEach(function(item) {
                    var entry = item.webkitGetAsEntry();
                    if (entry) {
                        entries.push(entry);
                    }
                });
                (function upload() {
                    var entry = entries.shift();
                    if (entry) {
                        upload_tree(entry, path, upload_file).then(upload);
                    } else {
                        defered.resolve();
                    }
                })();
            }
        } else if (files && files.length) {
            (function upload() {
                var file = files.shift();
                if (file) {
                    upload_file(file, path).then(upload);
                } else {
                    defered.resolve();
                }
            })();
        } else if (event.dataTransfer.getFilesAndDirectories) {
            event.dataTransfer.getFilesAndDirectories().then(function(items) {
                (function upload() {
                    var item = items.shift();
                    if (item) {
                        upload_tree(item, path, upload_file).then(upload);
                    }  else {
                        defered.resolve();
                    }
                })();
            });
        }
        return defered.promise;
    }
    function upload_tree(tree, path, file_upload_callback) {
        var defered = $q.defer();
        var self = this;
        function process(entries, callback) {
            entries = entries.slice();
            (function recur() {
                var entry = entries.shift();
                if (entry) {
                    callback(entry).then(recur).fail(function() {
                        defered.reject();
                    });
                } else {
                    defered.resolve();
                }
            })();
        }
        function upload_files(entries) {
            process(entries, function(entry) {
                return upload_tree(entry, path + '/' + tree.name);
            });
        }
        function upload_file(file) {
            var ret = file_upload_callback(file, path);
            if (ret && ret.then) {
                ret.then(function() {
                    defered.resolve();
                }).fail(function() {
                    defered.reject();
                });
            } else {
                defered.resolve();
            }
        }
        if (typeof Directory != 'undefined' && tree instanceof Directory) { // firefox
            tree.getFilesAndDirectories().then(function(entries) {
                upload_files(entries);
            });
        } else if (typeof File != 'undefined' && tree instanceof File) { // firefox
            upload_file(tree);
        } else if (tree.isFile) { // chrome
            tree.file(upload_file);
        } else if (tree.isDirectory) { // chrome
            var dirReader = tree.createReader();
            dirReader.readEntries(function(entries) {
                upload_files(entries);
            });
        }
        return defered.promise;
    }
    function is_file_drop(event) {
        if (event.originalEvent) {
            event = event.originalEvent;
        }
        if (event.dataTransfer.items && event.dataTransfer.items.length) {
            return !![].filter.call(event.dataTransfer.items, function(item) {
                return item.kind == 'file';
            }).length;
        } else {
            return event.dataTransfer.files && event.dataTransfer.files.length;
        }
    }
    return function(event, path, callback) {
        if (is_file_drop(event)) {
            return process(event, path, callback);
        } else {
            return $q.resolve();
        }
    };
}

fileDropHandler.$inject = ['$q'];

export default fileDropHandler;
