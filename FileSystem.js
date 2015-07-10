window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;

(function(){
  if(!window.requestFileSystem) {
    return console.error('Your browser does not support files system API');
  }
})();

FileSystem = function(){};

FileSystem.fs = null;
FileSystem.DEFAULT_QUOTA = 4*1024*1024;//4Mb of default storage

FileSystem.onError = function(err){
  var message = '';

  switch (error.code) {
    case FileError.SECURITY_ERR:
      message = 'Security Error';
      break;
    case FileError.NOT_FOUND_ERR:
      message = 'Not Found Error';
      break;
    case FileError.QUOTA_EXCEEDED_ERR:
      message = 'Quota Exceeded Error';
      break;
    case FileError.INVALID_MODIFICATION_ERR:
      message = 'Invalid Modification Error';
      break;
    case FileError.INVALID_STATE_ERR:
      message = 'Invalid State Error';
      break;
    default:
      message = 'Unknown Error';
      break;
  }

  console.log(message);
};

//request the file system
//@param storageSize Size, in bytes, that we want to store. IE) 5*1024*1024 === 5Mb
FileSystem.init = function(storageSize, callback){

  storageSize = storageSize || FileSystem.DEFAULT_QUOTA;

  navigator.webkitPersistentStorage.requestQuota(storageSize, function(grantedSize) {

    window.requestFileSystem(window.PERSISTENT, grantedSize, function(fs){
      FileSystem.onReqSuccess(fs);
      if (callback) {
        callback(fs);
      }
    }, FileSystem.onReqFail);

  }, FileSystem.onReqFail);
};

//success on getting the file system and quota
FileSystem.onReqSuccess = function(fs){
  FileSystem.fs = fs;
  console.log('We did it! File system is ready to use!');
};

FileSystem.onReqFail = function(err){
  console.error(err);
};

//create a file and save to it!
FileSystem.createFile = function(fileName, content){

  if(!FileSystem.fs) {

    return console.error('NO FILE SYSTEM PRESENT!');

  }

  FileSystem.fs.root.getFile(fileName, {create:true}, function(entry){

    entry.createWriter(function(writer){

      writer.onwriteend = function(e) {
        console.log(fileName, 'successfully created!');
      };

      writer.onerror = function(e) {
        console.log('Failed to create', fileName);
      };

      writer.write(content);

    }, console.error);

  });

};
