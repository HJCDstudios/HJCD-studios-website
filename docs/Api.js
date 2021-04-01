var githubApi = {};
githubApi.header = {};
githubApi.header.Accept = "application/vnd.github.v3+json"; //make sure we use v3
githubApi.header.Authorization = "token <token>";
githubApi.baseUrl = "https://api.github.com";
githubApi.username = "";
githubApi.nameRepo = "";
githubApi.sha = "";
githubApi.path = "";
githubApi.newFile = false;
function apiRequest(method, url, jsonData, callback) {
  //load the json file
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 ){
      if (xhr.status == 200 || xhr.status == 201) {
        callback(xhr.responseText);
      } else {
        cout(xhr.status);
        cout(xhr.responseText);
      }
    }
  }
  xhr.open(method, url, true);
  for(var key in githubApi.header) {
    xhr.setRequestHeader(key, githubApi.header[key]);
  }
  xhr.send(jsonData);
  ResetApi();
}
function ResetApi() {
githubApi = {};
githubApi.header = {};
githubApi.header.Accept = "application/vnd.github.v3+json"; //make sure we use v3
githubApi.header.Authorization = "token <token>";
githubApi.baseUrl = "https://api.github.com";
githubApi.username = "";
githubApi.nameRepo = "";
githubApi.sha = "";
githubApi.path = "";
githubApi.newFile = false;
}
