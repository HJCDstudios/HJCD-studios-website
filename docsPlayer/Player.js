var lay = null;
var ImgP1 = null;
var serv = null;
var Is = {
  "Memeber":function(ip,id) {
    return (PlayerData.indexOf(ip+":"+id) != -1);
  },
  "Joined":false,
  "Server":false,
  "Joining":false,
  "Client":false
};
var p = {
  "l":0,
  "t":0
};
var m = {
  "up":false,
  "down":false,
  "right":false,
  "left":false
}
var Debug = app.InIDE();
var PlayerData = {
  "Players":[],
  "Data":{}
};
function OnStart() {
  app.EnableBackKey(false);
  app.PreventWifiSleep();
  app.PreventScreenLock(true);
  app.SetOrientation("Portrait");
  
  if (!Debug) {
    CreateStart();
  } else {
    CreateMain();
  }
}
function OnBack() {
  if (!Debug) {
    if (confirm("Exit App?")) {
      app.Exit(true);
    }
  } else {
    app.Exit(true);
  }
}

function CreateStart() {
  lay = app.CreateLayout("Linear","VCenter,FillXY");
  
  var Img1 = app.AddImage(lay,"Img/PDS.png",null,0.5);
  
  var TxtMade = app.AddText(lay,"Made By HJCD studios");
  TxtMade.SetMargins(0,0.02,0,0);
  TxtMade.SetTextSize(19);
  
  var Img2 = app.AddImage(lay,"Img/HJCD.png",null,0.4);
  
  app.AddLayout(lay);
  
  setTimeout(function() {
    lay.Animate("FadeOut",function() {
      lay.Gone();
      app.RemoveLayout(lay);
      lay = null;
      CreateMain();
    });
  },3000);
}

function SendMsg(m) {
  var ToSend = {
    "packageName":"com.HJCD.player",
    "type":"message",
    "room":room,
    "ID":app.GetDeviceId(),
    "name":name,
    "msg":m
  };
  SendMessage(ToSend);
}

function CreateMain() {
  var TlgLeft = null;
  var TlgUp = null;
  var TlgDown = null;
  var TlgRight = null;
  lay = app.CreateLayout("Absolute","VCenter,FillXY");
  
  ImgP1 = app.AddImage(lay,"Img/Steady.png",0.1);
  ImgP1.SetOnLoad(function() {
    p.t = ImgP1.GetTop();
    p.l = ImgP1.GetLeft();
  });
  
  var LayControls = app.CreateLayout("Linear","Horizontal");
  LayControls.SetPosition(0,0.93);
  lay.AddChild(LayControls);
  
  var BtnAddP = app.AddButton(LayControls,"Add Pearl");
  BtnAddP.SetOnTouch(function() {
    app.PlaySound("Snd/AddPearl.mp3");
    var pearl = app.AddImage(lay,"Img/Pearl.png",0.09);
    pearl.SetOnTouch(function() {
      app.PlaySound("Snd/RemovePearl.mp3");
      lay.RemoveChild(this);
    });
    pearl.SetPosition(p.l,p.t);
  });
  
  var BtnSetR = app.AddButton(LayControls,"Room");
  BtnSetR.SetOnTouch(ShowRoomDialog);
  
  var LayChat = app.CreateLayout("Linear","Horizontal");
  LayChat.SetPosition(0,0.6);
  lay.AddChild(LayChat);
  
  var TxtMsg = app.AddTextEdit(LayChat,"",0.8);
  TxtMsg.SetHint("Message");
  TxtMsg.SetOnEnter(function() {
  });
  
  var BtnSend = app.AddButton(LayChat,"Send");
  BtnSend.SetOnTouch(function() {
    
  });
  
  var LayBtns = app.CreateLayout("Linear","Vertical");
  LayBtns.SetPosition(0.5,0.7);
  lay.AddChild(LayBtns);
  
  TlgUp = app.AddToggle(LayBtns,"Up");
  TlgUp.SetOnTouch(function(bol) {
    m.up = bol;
    TlgLeft.SetChecked(false);
    TlgDown.SetChecked(false);
    TlgRight.SetChecked(false);
    m.left = false;
    m.right = false;
    m.down = false;
  });
  
  var LayBtns1 = app.CreateLayout("Linear","Horizontal");
  LayBtns.AddChild(LayBtns1);
  
  TlgLeft = app.AddToggle(LayBtns1,"Left");
  TlgLeft.SetOnTouch(function(bol) {
    m.left = bol;
    TlgUp.SetChecked(false);
    TlgDown.SetChecked(false);
    TlgRight.SetChecked(false);
    m.up = false;
    m.right = false;
    m.down = false;
  });
  
  TlgRight = app.AddToggle(LayBtns1,"Right");
  TlgRight.SetOnTouch(function(bol) {
    m.right = bol;
    TlgUp.SetChecked(false);
    TlgDown.SetChecked(false);
    TlgLeft.SetChecked(false);
    m.up = false;
    m.left = false;
    m.down = false;
  });
  
  TlgDown = app.AddToggle(LayBtns,"Down");
  TlgDown.SetOnTouch(function(bol) {
    m.down = bol;
    TlgUp.SetChecked(false);
    TlgRight.SetChecked(false);
    TlgLeft.SetChecked(false);
    m.up = false;
    m.right = false;
    m.left = false;
  });
  
  app.AddLayout(lay);
  setInterval(Move,100);
}

var src = "";
var Last = {
  "Src":"",
  "Top":0,
  "Left":0
};
function Move() {
  if (m.down) {
    if (src != "Img/Down.png") {
      ImgP1.SetImage("Img/Down.png");
      src = "Img/Down.png";
    }
    p.t = p.t += 0.01;
    ImgP1.SetPosition(p.l,p.t);
  } else if (m.up) {
    if (src != "Img/Up.png") {
      ImgP1.SetImage("Img/Up.png");
      src = "Img/Up.png";
    }
    p.t = p.t -= 0.01;
    ImgP1.SetPosition(p.l,p.t);
  } else if (m.left) {
    if (src != "Img/Left.png") {
      ImgP1.SetImage("Img/Left.png");
      src = "Img/Left.png";
    }
    p.l = p.l -= 0.01;
    ImgP1.SetPosition(p.l,p.t);
  } else if (m.right) {
    if (src != "Img/Right.png") {
      ImgP1.SetImage("Img/Right.png");
      src = "Img/Right.png";
    }
    p.l = p.l += 0.01;
    ImgP1.SetPosition(p.l,p.t);
  } else {
    if (src != "Img/Steady.png" && !m.right && !m.left && !m.up && !m.down) {
      ImgP1.SetImage("Img/Steady.png");
      src = "Img/Steady.png";
    }
  }
  if (src != Last.Src || Last.Top != ImgP1.GetTop() || Last.Left != ImgP1.GetLeft()) {
    var ToSend = {
      "packageName":"com.HJCD.player",
      "type":"move",
      "ID":app.GetDeviceId(),
      "src":src,
      "t":p.t,
      "l":p.l
    };
    SendData(ToSend);
    Last.Src = src;
    Last.Top = ImgP1.GetTop();
    Last.Left = ImgP1.GetLeft();
  }
}
function Received(data,ip,id) {
  try {
    data = atob(JSON.parse(data));
  } catch(e) { return }
  
  if (data.packageName != "com.HJCD.player") { return }
  if (data.ID == app.GetDeviceId()) { return }
  
  if (data.type == "join") {
    if (confirm("User: " + data.name + " wants to join\nAccept?")) {
      AddPlayer(data,{"ip":ip,"id":id});
    }
    return;
  }
  if (Is.Joined(ip,id) == false) { return }
  
  if (data.type == "leave") {
    RemovePlayer(data);
  } else if (data.type == "move") {
    UpdatePlayer(data);
  } else if (data.type == "message") {
    app.ShowPopup(data.name + "\n" + data.msg,"Bottom,Long");
  } else if (data.type == "addpearl") {
  }
}

function AddPlayer(d,ot) {
  PlayerData.Players.push(ot.ip+":"+op.id);
  var i1 = app.CreateLayout("Linear","Vertical");
  i1.SetPosition(d.l,d.t);
  var i2 = app.AddText(i1,d.name,0.1);
  var i3 = app.AddImage(i1,d.src,0.1);
  alert(JSON.stringify(i3));
  PlayerData.Data[ot.ip+":"+ot.id] = {};
  PlayerData.Data[d.ID].Img = i3;
  PlayerData.Data[d.ID].Lay = i1;
  lay.AddChild(i1);
}
function UpdatePlayer(d) {
  if (d.src != PlayerData.Data[d.ID].src) {
    PlayerData.Data[d.ID].Img.SetImage(d.src);
    PlayerData.Data[d.ID].src = d.src;
  }
  if (d.t != PlayerData.Data[d.ID].Lay.GetTop() || d.l != PlayerData.Data[d.ID].Lay.GetLeft()) {
    PlayerData.Data[d.ID].Lay.SetPosition(d.l,d.t);
  }
}

function SendData(d) {
  if (Is.Server) {
    serv.SendText(btoa(JSON.stringify(d)));
  } else if (Is.Client) {
    ws.Send(btoa(JSON.stringify(d)));
  } else {
    if (!Debug) {
      app.Quit("There was a problem","Error");
    }
  }
}

function ShowRoomDialog() {
  var dlg = app.CreateDialog("Room");
  var LayDlg = app.CreateLayout("Linear","Vertical");
  dlg.AddLayout(LayDlg);
  
  var TxtData = app.AddText(LayDlg,"Current Players: " + Math.floor(PlayerData.Players.length+1) + "\nRoom Name: " + room,0.3,null,"Multiline");
  TxtData.SetTextSize(19);
  
  var BtnSetR = app.AddButton(LayDlg,"Set Room");
  BtnSetR.SetOnTouch(function() {
    app.ShowTextDialog("Set Room Name",room,function(NewName) {
      if (PlayerData.Players.length == 0) {
        room = NewName;
        dlg.Dismiss();
        app.ShowPopup("Room name saved","Bottom,Short");
      } else {
        if (confirm("This will desconnect all the players?\nContinue?")) {
          room = NewName;
          PlayerData.Players = [];
        }
      }
    });
  });
  
  dlg.Show();
}

function CreateServer() {
  if (app.GetIPAddress() != "0.0.0.0" && app.IsWifiEnabled() && app.GetSSID() != "0.0.0.0") {
    servPort = JSON.stringify([
      Math.floor(Math.random()*9)+1,
      Math.floor(Math.random()*9)+1,
      Math.floor(Math.random()*9)+1,
      Math.floor(Math.random()*9)+1
    ]).replace("[","").replace("]","").replace(",","");
    serv = app.CreateWebServer(servPort,"Reflect");
    serv.SetOnReceive(Received);
    serv.Start();
  }
}