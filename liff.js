window.onload = function (e) {
    // init で初期化。基本情報を取得。
    // https://developers.line.me/ja/reference/liff/#initialize-liff-app
    liff.init(function (data) {
        getProfile();
        initializeApp(data);
        // Initialize Cloud Firestore through Firebase

    });

    var firebaseConfig = {
      apiKey: "",
      authDomain: "",
      databaseURL: "",
      projectId: "",
      storageBucket: "",
      messagingSenderId: "",
      appId: "",
      measurementId: ""
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    var db = firebase.firestore();


    const listitem = document.getElementsByClassName('btn')

    for(let i = 0; i < listitem.length; i++){

      listitem[i].addEventListener('click', function (e) {
        liff.sendMessages([{
            type: 'text',
            text: '「' + e.target.textContent + '」を記録しました。'
        }]).then(function (e) {
            liff.closeWindow();
        }).catch(function (error) {
            window.alert("Error sending message: " + error);
        });

      var userId = document.getElementById('useridprofilefield').textContent
      db.collection(userId).add({
        name: e.target.textContent,
        datetime: new Date()
      })
      .then((doc) => {
        console.log(`追加に成功しました (${doc.id})`);
      })
      .catch((error) => {
        console.log(`追加に失敗しました (${error})`);
      });
    });

  }

function getDrivingRecord(){
  db.collection("users").get().then((query) => {
    var buff = [];
    query.forEach((doc) => {
      var data = doc.data();
      buff.push([doc.id, data.name, data.age]);
    });
    console.log(buff);
  })
  .catch((error)=>{
    console.log(`データの取得に失敗しました (${error})`);
  });

}


// プロファイルの取得と表示
function getProfile(){
    // https://developers.line.me/ja/reference/liff/#liffgetprofile()
    liff.getProfile().then(function (profile) {
        document.getElementById('useridprofilefield').textContent = profile.userId;
        document.getElementById('displaynamefield').textContent = profile.displayName;

        var profilePictureDiv = document.getElementById('profilepicturediv');
        if (profilePictureDiv.firstElementChild) {
            profilePictureDiv.removeChild(profilePictureDiv.firstElementChild);
        }
        var img = document.createElement('img');
        img.src = profile.pictureUrl;
        img.alt = "Profile Picture";
        img.width = 200;
        profilePictureDiv.appendChild(img);

        document.getElementById('statusmessagefield').textContent = profile.statusMessage;
    }).catch(function (error) {
        window.alert("Error getting profile: " + error);
    });
}

function initializeApp(data) {
    document.getElementById('languagefield').textContent = data.language;
    document.getElementById('viewtypefield').textContent = data.context.viewType;
    document.getElementById('useridfield').textContent = data.context.userId;
    document.getElementById('utouidfield').textContent = data.context.utouId;
    document.getElementById('roomidfield').textContent = data.context.roomId;
    document.getElementById('groupidfield').textContent = data.context.groupId;
}
}
