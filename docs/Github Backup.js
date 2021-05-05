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
GithubPush(app.GetAppPath() + "/","Github Backup.js","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");
function GithubPush(AppPath,AppName,token) {
  //load ~git.json
  var GitData = {};
  try {
    GitData = JSON.parse(app.ReadFile(AppPath + "~git.json"));
  } catch(e) {
    app.Alert("Failed to Read\nAppPath: " + AppPath + "\nError:\n\n" + e + "\n\nData:\n\n" + app.ReadFile(AppPath + "~git.json"),"Error");
    return;
  }
  //Check if the app already exists
  var CheckExists = function(cb) {
    var xml = new XMLHttpRequest();
    xml.open("GET","https://api.github.com/repos/" + GitData.UserName + "/" + GitData.Respiratory + "/contents/" + GitData.Path,true);
    xml.onreadystatechange = function() {
      if (xml.readyState == 4) {
        if (xml.status == 200) {
          cb(true); //call the callback that the app exists
        } else {
          cb(false); //call the callback that the app does not exists
        }
      }
    };
    xml.send(null);// send the request
  };
  
  CheckExists(function(e) {
    if (e) {
      _GitUpdate(AppPath,AppName,GitData,token);//update the file
    } else {
      _GitCreate(AppPath,AppName,GitData,token);//create the file
    }
  });
}
function _GitUpdate(AppPath,AppName,GitData,token) {
  //create the auth
  var auth = {
    "Accept":"application/vnd.github.v3+json",//Accept only V3
    "Authorization":"token " + token//token
  };
  
  //generate the json that will be sent
  var ToSend = {
    "message":"Updated with DroidScript",
    "content":btoa(app.ReadFile(AppPath + "/" + AppName)),
    "branch":GitData.Branch,
    "path":GitData.Path
  };
  
  //url
  var url = "https://api.github.com/repos/" + GitData.UserName + "/" + GitData.Respiratory + "/contents/" + GitData.Path + AppName;
  //send via xml http
  var xml = new XMLHttpRequest();
  xml.open("PUT",url,true);
  xml.onreadystatechange = function() {
    if (xml.readyState == 4) {
      if (xml.status == 200) {
        app.Alert("Done","Success");
      } else {
        app.Alert("Failed!\nStatus: " + xml.status + "\nResponse:\n\n" + xml.responseText,"Error");
      }
    }
  };
  for(var key in auth) {
    xml.setRequestHeader(key,auth[key]);
  }
  xml.send(JSON.stringify(ToSend));
}
function _GitCreate(AppPath,AppName,GitData) {
  //create the auth
  var auth = {
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
  
  //url
  var url = "https://api.github.com/repos/" + GitData.UserName + "/" + GitData.Respiratory + "/contents/" + GitData.Path + AppName;
  //send via xml http
  var xml = new XMLHttpRequest();
  xml.open("PUT",url,true);
  xml.onreadystatechange = function() {
    if (xml.readyState == 4) {
      if (xml.status == 201) {
        app.Alert("Done","Success");
      } else {
        app.Alert("Failed!\nStatus: " + xml.status + "\nResponse:\n\n" + xml.responseText,"Error");
      }
    }
  };
  for(var key in auth) {
    xml.setRequestHeader(key,auth[key]);
  }
  xml.send(JSON.stringify(ToSend));
}
  