/** 항상 가장 처음 실행되는 state입니다.
 * 시작화면에서의 접근이 신규 유저의 접근인지 기존 유저의 접근인지에 따라 준비하는 데이터가 상이합니다.
 * 1.신규 유저의 접근
 * 		게임의 기초 초기화 데이터를 로드한 뒤 인트로 start
 * 2.기존 유저의 접근
 * 		ID 컬럼 조회 후 세이브 데이터에 기초하여 데이터 초기화
 * 		그 후 마을 start
 */
var isLogo = true;
var language = "KOREAN";
var Preload = function(game){};
var gameLoading;

Preload.prototype = {
	preload : function(){
		alert("Preload");
		game.world.removeAll();
		setLanguage();
		//로고 이미지 불러오기
		game.load.spritesheet('gameLoding', 'resources/Images/preload/32x32x1_BeatovenFace.png', 32, 32, 1);
		//프로그래스 이미지 등 불러오기
		game.load.spritesheet('progressBar', 'resources/Images/preload/852x480x13_ProgressBar.png', 852, 480, 13);
		
	},
	create: function(){
		game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
		game.input.onDown.add(gofull, this);
		
		//배경색 지정
		game.stage.backgroundColor = '#FF9966';
		//로고 혹은 로딩 화면 생성
		if (isLogo) {
			//로고 띄우기
			gameLoding = game.add.sprite(game.world.centerX, game.world.centerY, 'gameLoding');
			gameLoding.scale.set(15);
			gameLoding.anchor.setTo(0.5, 0.5);
			gameLoding.smoothed = false;
			var progressBar = game.add.sprite(game.world.centerX, game.world.centerY + 200, 'progressBar');
			progressBar.scale.set(0.5);
			progressBar.anchor.setTo(0.5, 0.5);
			progressBar.smoothed = false;
			var progressBarAni = progressBar.animations.add('loading', null, 30, false);
			progressBarAni.play('loading');
		}else {
			//로딩 띄우기
		}
		
		game.time.events.loop(Phaser.Timer.SECOND * 3, requestState, this);
	},
	update : function(){
	},
	requestUserInfo: function(){
		$.ajax({
			url:"requestUserInfo"
			,type: "post"
			,success: function(userInfo){
			},error: function(){
			}
		});
	}
}

function setLanguage(){
	$.ajax({
		url:'setLanguage'
		,type: 'post'
		,success: function(str){
			language = str;
			alert("language is "+language);
		},error: function(){
			language = "KOREAN";
			alert("language Setting Fail");;
		}
	})
}

function getStageInfo(stageNum){
	$.ajax({
		url : "getStage" // a.jsp 의 제이슨오브젝트값을 가져옴
		,type : "post"
		,dataType : "json" // 데이터 타입을 제이슨 꼭해야함, 다른방법도 2가지있음
		,cache : false // 이걸 안쓰거나 true하면 수정해도 값반영이 잘안댐
		,success : function(stageInfo) {
			//BGM 길이를 가져와야함
			bgImgName = stageInfo[0].bgImgName;
			musicName = stageInfo[0].musicName;
			beat = stageInfo[1];
			monsterlistA = stageInfo[2];
			monsterlistB = stageInfo[3];
			monsterlistC = stageInfo[4];
			multiNum = stageInfo[5];
		}
	});
	$.ajax({
	      url: 'readMotionList'
	      ,type : 'post'
	      // 성공하면 가져온 모션 리스트를 표시
	      ,success: function(jsonText) {
	         alert('readMotionList success');
	         //{"button": [{"turn": "4", "lane": "AB"},{"turn": "3", "lane": "CA"},{"turn": "2", "lane": "C"}]}
	         if (jsonText == '000') {
	        	  alert('저장된 모션이 없습니다!');
	        	  var motionList = "default";
	        	  setMotion(motionList);
	              game.state.start("stage");
	         }
	         else {
	        	 alert('저장된 모션이 있습니다!' + jsonText);
	        	 var motionList = JSON.parse(jsonText);
	        	 setMotion(motionList);
	        	 game.state.start("stage");
	         }
	      }
	      // 실패하면 기본값을 표시
	      ,error: function() {
	          alert('readMotionList error');
	      }
	   });
}

//DB를 참조해서 모션세팅값을 적절히 처리한다.
function setMotion(motionList){
	
	 //기초 설정 초기화
	 point_isA = false;
	 point_isB = false;
	 point_isC = false;
	 up_isA = false;
	 up_isB = false;
	 up_isC = false;
	 down_isA = false;
	 down_isB = false;
	 down_isC = false;
	 left_isA = false;
	 left_isB = false;
	 left_isC = false;
	 right_isA = false;
	 right_isB = false;
	 right_isC = false;

	 if (motionList == "default") {
		 point_isA = true;
		 up_isB = true;
		 down_isC = true;
		 return;
	 }
	 
	 turn1 = parseInt(motionList.button[0].turn);
	 turn2 = parseInt(motionList.button[1].turn);
	 turn3 = parseInt(motionList.button[2].turn);
	 
	 lane1 = motionList.button[0].lane;
	 lane2 = motionList.button[1].lane;
	 lane3 = motionList.button[2].lane;
	 
	//1번 모션의 공격 범위 지정
	 switch(turn1){
	 case 0:
		 //POINT
		 switch(lane1){
		 case 'A': 
			 point_isA = true;
			 point_isB = false;
			 point_isC = false;
			 break;
		 case 'B':
			 point_isA = false;
			 point_isB = true;
			 point_isC = false;
			 break;
		 case 'C':
			 point_isA = false;
			 point_isB = false;
			 point_isC = true;
			 break;
		 }
		 break;
	 case 1:
		 //UP
		 switch(lane1){
		 case 'A': 
			 up_isA = true;
			 up_isB = false;
			 up_isC = false;
			 break;
		 case 'B':
			 up_isA = false;
			 up_isB = true;
			 up_isC = false;
			 break;
		 case 'C':
			 up_isA = false;
			 up_isB = false;
			 up_isC = true;
			 break;
		 }
		 break;
	 case 2:
		 //DOWN
		 switch(lane1){
		 case 'A': 
			 down_isA = true;
			 down_isB = false;
			 down_isC = false;
			 break;
		 case 'B':
			 down_isA = false;
			 down_isB = true;
			 down_isC = false;
			 break;
		 case 'C':
			 down_isA = false;
			 down_isB = false;
			 down_isC = true;
			 break;
		 }
		 break;
	 case 3:
		 //LEFT
		 switch(lane1){
		 case 'AB': 
			 left_isA = true;
			 left_isB = true;
			 left_isC = false;
			 break;
		 case 'BC':
			 left_isA = false;
			 left_isB = true;
			 left_isC = true;
			 break;
		 case 'CA':
			 left_isA = true;
			 left_isB = false;
			 left_isC = true;
			 break;
		 }
		 break;
	 case 4:
		 //RIGHT
		 switch(lane1){
		 case 'AB': 
			 right_isA = true;
			 right_isB = true;
			 right_isC = false;
			 break;
		 case 'BC':
			 right_isA = false;
			 right_isB = true;
			 right_isC = true;
			 break;
		 case 'CA':
			 right_isA = true;
			 right_isB = false;
			 right_isC = true;
			 break;
		 }
		 break;
	 }
	 
	//2번 모션의 공격 범위 지정
	 switch(turn2){
	 case 0:
		 //POINT
		 switch(lane1){
		 case 'A': 
			 point_isA = true;
			 point_isB = false;
			 point_isC = false;
			 break;
		 case 'B':
			 point_isA = false;
			 point_isB = true;
			 point_isC = false;
			 break;
		 case 'C':
			 point_isA = false;
			 point_isB = false;
			 point_isC = true;
			 break;
		 }
		 break;
	 case 1:
		 //UP
		 switch(lane1){
		 case 'A': 
			 up_isA = true;
			 up_isB = false;
			 up_isC = false;
			 break;
		 case 'B':
			 up_isA = false;
			 up_isB = true;
			 up_isC = false;
			 break;
		 case 'C':
			 up_isA = false;
			 up_isB = false;
			 up_isC = true;
			 break;
		 }
		 break;
	 case 2:
		 //DOWN
		 switch(lane1){
		 case 'A': 
			 down_isA = true;
			 down_isB = false;
			 down_isC = false;
			 break;
		 case 'B':
			 down_isA = false;
			 down_isB = true;
			 down_isC = false;
			 break;
		 case 'C':
			 down_isA = false;
			 down_isB = false;
			 down_isC = true;
			 break;
		 }
		 break;
	 case 3:
		 //LEFT
		 switch(lane1){
		 case 'AB': 
			 left_isA = true;
			 left_isB = true;
			 left_isC = false;
			 break;
		 case 'BC':
			 left_isA = false;
			 left_isB = true;
			 left_isC = true;
			 break;
		 case 'CA':
			 left_isA = true;
			 left_isB = false;
			 left_isC = true;
			 break;
		 }
		 break;
	 case 4:
		 //RIGHT
		 switch(lane1){
		 case 'AB': 
			 right_isA = true;
			 right_isB = true;
			 right_isC = false;
			 break;
		 case 'BC':
			 right_isA = false;
			 right_isB = true;
			 right_isC = true;
			 break;
		 case 'CA':
			 right_isA = true;
			 right_isB = false;
			 right_isC = true;
			 break;
		 }
		 break;
	 }
	 
	 //3번 모션의 공격 범위 지정
	 switch(turn3){
	 case 0:
		 //POINT
		 switch(lane1){
		 case 'A': 
			 point_isA = true;
			 point_isB = false;
			 point_isC = false;
			 break;
		 case 'B':
			 point_isA = false;
			 point_isB = true;
			 point_isC = false;
			 break;
		 case 'C':
			 point_isA = false;
			 point_isB = false;
			 point_isC = true;
			 break;
		 }
		 break;
	 case 1:
		 //UP
		 switch(lane1){
		 case 'A': 
			 up_isA = true;
			 up_isB = false;
			 up_isC = false;
			 break;
		 case 'B':
			 up_isA = false;
			 up_isB = true;
			 up_isC = false;
			 break;
		 case 'C':
			 up_isA = false;
			 up_isB = false;
			 up_isC = true;
			 break;
		 }
		 break;
	 case 2:
		 //DOWN
		 switch(lane1){
		 case 'A': 
			 down_isA = true;
			 down_isB = false;
			 down_isC = false;
			 break;
		 case 'B':
			 down_isA = false;
			 down_isB = true;
			 down_isC = false;
			 break;
		 case 'C':
			 down_isA = false;
			 down_isB = false;
			 down_isC = true;
			 break;
		 }
		 break;
	 case 3:
		 //LEFT
		 switch(lane1){
		 case 'AB': 
			 left_isA = true;
			 left_isB = true;
			 left_isC = false;
			 break;
		 case 'BC':
			 left_isA = false;
			 left_isB = true;
			 left_isC = true;
			 break;
		 case 'CA':
			 left_isA = true;
			 left_isB = false;
			 left_isC = true;
			 break;
		 }
		 break;
	 case 4:
		 //RIGHT
		 switch(lane1){
		 case 'AB': 
			 right_isA = true;
			 right_isB = true;
			 right_isC = false;
			 break;
		 case 'BC':
			 right_isA = false;
			 right_isB = true;
			 right_isC = true;
			 break;
		 case 'CA':
			 right_isA = true;
			 right_isB = false;
			 right_isC = true;
			 break;
		 }
		 break;
	 }
}

//DB에서 대화문 불러오기
function loadStoryContents(){
	console.log("Re:"+storyNum);
	$.ajax({
		url : 'loadStoryContents'
		,type : 'post'
		,dataType : 'json'
		,data: {storyNum : parseInt(storyNum)}
		,success:function(arrtest){
			storyText = new Array();
			arr = new Array();
			arr = arrtest;
			console.log(" 스토리 대화문 컬럼 수 = " + arr.length);
			game.state.start("Story");
		},error: function(){
			alert("대화문 임포트 에러");
		}

	});
}

function setResources(state){
	if (state == "Intro") {
		//Intro assets
		//인트로 실행
		game.state.start("Intro");
		
		
	}else if (state == "Tutorial"){
		//Totorial assets
	    //튜토리얼 실행
		game.state.start("Tutorial");
		
		
	}else if (state == "Story") {
		//Story assets , contentNum required
	    //스토리 실행
		storyNum = contentNum;
		console.log('storyNum'+storyNum);
		loadStoryContents();
		
	}else if (state == "Stage") {
		//Stage assets , contentNum required
		getStageInfo(contentNum);
		
	}else if (state == "Village") {
		//Village assets
		
		
		//마을 실행
		game.state.start("Village");
		
	}else if (state == "Ending") {
		//Ending assets
		//엔딩 크레딧 실행
		game.state.start("Ending");
		
	}else if (state == "HallOfFame"){
		//HallOfFame.jsp로 이동
	}
	
}
