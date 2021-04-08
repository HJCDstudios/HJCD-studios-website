var githubApi = {};
githubApi.header = {};
githubApi.header.Accept = "application/vnd.github.v3+json"; //make sure we use v3
githubApi.header.Authorization = "token REDACTED-TOKEN";
function apiRequest(method, url, jsonData, callback) {
  //load the json file
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 ){
      if (xhr.status == 200 || xhr.status == 201) {
        callback(false,xhr.responseText);
      } else {
        callback(true,xhr.responseText);
      }
    }
  }
  xhr.open(method, url, true);
  for(var key in githubApi.header) {
    xhr.setRequestHeader(key, githubApi.header[key]);
  }
  xhr.send(jsonData);
}
function CreateFile(ob) {
  var jsonData = new Object();
  jsonData.message = ob.CommitMsg;
  jsonData.content = btoa(ob.Content); //encode64
  jsonData.path = ob.Path;
  jsonData.branch = ob.Branch;
  var url = "https://api.github.com/repos/" + ob.UserName + "/" + ob.RepoName + "/contents/" + ob.Path;
  jsonData = JSON.stringify(jsonData); //api expects json as string
  apiRequest("PUT", url, jsonData,cb);
}
function DeleteFile(ob) {
  var jsonData = new Object();
  jsonData.
}
