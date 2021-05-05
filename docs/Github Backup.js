/*
  Example of the ~git.json
  {
    "UserName":"{UserName}",
    "Respiratory":"{repo}",
    "Branch":"{branch}",
    "Path":"{path}"
  }
  
  Repiratory,
  Branch,
  UserName:
    spaces should be replaced by "-"
  
  Path:
    example:
      docs/
      docs/otherfolder/
      or just leave blank
      
    ********
    AppPath:
      /storage/emulated/0/DroidScript/MyApp/
    AppName:
      MyApp.html
      MyApp.js
    token:
      GithubApi Token
*/
GithubPush(app.GetAppPath() + "/","Github Backup.js","g"+"hp"+"_CKjj2Tj"+"b7tNxV"+"PTUJ"+"rfMdL"+"38fLsPzf"+"4RWmTW");
function GithubPush(AppPath,AppName,token) {
  "use strict"
  //load ~git.json
  var GitData = {};
  try {
    GitData = JSON.parse(app.ReadFile(AppPath + "~git.json"));
  } catch(e) {
    app.Alert("Failed to Read\nAppPath: " + AppPath + "\nError:\n\n" + e + "\n\nData:\n\n" + app.ReadFile(AppPath + "~git.json"),"Error");
    return;
  }
  _GitDo(AppPath,AppName,GitData,token);
}
function _GitDo(AppPath,AppName,GitData,token) {
  "use strict"
  //create the auth
  var header = {
    "Accept":"application/vnd.github.v3+json",//Accept only V3
    "Authorization":"token " + token//token
  };
  
  //generate the json that will be sent
  var ToSend = {
    "message":"Created with DroidScript",
    "content":btoa(app.ReadFile(AppPath + "/" + AppName)),
    "branch":GitData.Branch,
    "path":GitData.Path
  };
  _GitGetSha(AppPath,AppName,GitData,function(sha) {
    if (sha != "false") { ToSend.sha = sha; }
    //url
    var url = "https://api.github.com/repos/" + GitData.UserName + "/" + GitData.Respiratory + "/contents/" + GitData.Path + AppName;
    //send via xml http
    var xml = new XMLHttpRequest();
    xml.open("PUT",url,true);
    xml.onreadystatechange = function() {
      if (xml.readyState == 4) {
        if (xml.status == 200 || xml.status == 201) {
          app.Alert("Done","Success");
        } else {
          app.Alert("Failed!\nURL:" + url + "\nSent:\n\n" + JSON.stringify(ToSend) + "\n\nStatus: " + xml.status + "\nResponse:\n\n" + xml.responseText,"Error");
        }
      }
    };
    for(var key in header) {
      xml.setRequestHeader(key,header[key]);
      alert("Key: " + key + "\nHeader Key: " + header[key]);
    }
    xml.send(JSON.stringify(ToSend));
  });
}
//this function is to get sha
function _GitGetSha(AppPath,AppName,GitData,cb) {
  //use strict
  var xml = new XMLHttpRequest();
  //url
  var url = "https://api.github.com/repos/" + GitData.UserName + "/" + GitData.Respiratory + "/contents/" + GitData.Path + AppName;
  xml.open("GET",url,true);
  xml.onreadystatechange = function() {
    if (xml.readyState == 4) {
      if (xml.status == 200) {
        cb(JSON.parse(xml.responseText).sha);
      } else {
        if (JSON.parse(xml.responseText).message == "Not Found") {
          cb("false");
        } else {
          alert(xml.repsonseText);
        }
      }
    }
  };
  xml.send(null);
}
  