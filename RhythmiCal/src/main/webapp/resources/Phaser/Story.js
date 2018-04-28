/** 게임의 스토리 진행을 담당하는 중요한 화면입니다.
 * 미연시식 UI를 제공하며 호출되는 빈도가 가장 높습니다.
 * 1.DB에서 데이터와 함께 초기화 됨
 * 2.데이터 초기화
 * 3.텍스트, 배경음, 효과음 등 실행
 * 4.그 후 적절한 STATE 실행 ( 초기화 될 당시에 포함되어 있습니다)
 */
//스토리 넘버
var storynum = 1;
var reg = {};//음악 로드시 저장
var typewriter = new Typewriter(); // 글자 타이핑 효과
var cursors;
var dialogueBG;
var storyOrder;
var npc;
//npc 나타날 곳
var left=70, right=1030, npcY=160;
var switchingleftright;
//대화문 어레이 생성
var storyText;
//대화문 테이블
var arr;
//캐릭터 이름
var characterName;
//배경음악
var bgMusicName;
//소리 효과
var soundEffect;
//배경이미지
var bgImgName;
//배경 정보
var bgInfo;
//실제쓰인 배경과 그 효과
var backimag,hikari;
var Story = function(game){};
Story.prototype = {
	preload: function() {
		//비트맵형 글자폰트 로드
		game.load.bitmapFont('neo_font', 'resources/neo_font/neo_font.png', 'resources/neo_font/neo_font.fnt');
		this.loadStoryContents();
		
		
		//배경음악 일단 다 로드
		game.load.audio('숲속',"resources/Audios/bgm/story/숲속.mp3");
		game.load.audio('레코드판',"resources/Audios/bgm/story/레코드판.mp3");
		game.load.audio('마을',"resources/Audios/bgm/story/마을.mp3");
		game.load.audio('비토벤의 집',"resources/Audios/bgm/story/비토벤의 집.mp3");
		game.load.audio('적의 막사',"resources/Audios/bgm/story/적의 막사.mp3");
		game.load.audio('노비토의 막사',"resources/Audios/bgm/story/노비토의 막사.mp3");
		game.load.audio('Dok3의 집',"resources/Audios/bgm/story/Dok3의 집.mp3");
		
		//음향효과
		game.load.audio('노크소리',"resources/Audios/bgm/story/노크소리.mp3");
		game.load.audio('잔잔한 음악',"resources/Audios/bgm/story/잔잔한 음악.mp3");
		
		// 배경화면 로드
		game.load.spritesheet("숲속", "resources/Images/story/bgimg/숲속.png",1600,900);
		game.load.spritesheet("레코드판", "resources/Images/story/bgimg/레코드판.png",1600,900);
		game.load.spritesheet("마을", "resources/Images/story/bgimg/마을.png",1600,900);
		game.load.spritesheet("비토벤의 집", "resources/Images/story/bgimg/비토벤의 집.png",1600,900);
		game.load.spritesheet("적의 막사", "resources/Images/story/bgimg/적의 막사.png",1600,900);
		game.load.spritesheet("노비토의 막사", "resources/Images/story/bgimg/노비토의 막사.png",1600,900);
		game.load.spritesheet("Dok3의 집", "resources/Images/story/bgimg/Dok3의 집.png",1600,900);
		
		//npc 이미지 로드
		game.load.image('???', 'resources/Images/story/npc/누군가.png');
		game.load.image('Dok3', 'resources/Images/story/npc/Dok3.png');
		game.load.image('그녀', 'resources/Images/story/npc/그녀.png');
		game.load.image('나보', 'resources/Images/story/npc/나보.png');
		game.load.image('노비토', 'resources/Images/story/npc/노비토.png');
		game.load.image('리드미', 'resources/Images/story/npc/리드미.png');
		game.load.image('??', 'resources/Images/story/npc/리드미등장.png');
		game.load.image('마을 사람 1', 'resources/Images/story/npc/마을 사람 1.png');
		game.load.image('마을 사람 2', 'resources/Images/story/npc/마을 사람 2.png');
		game.load.image('마을 사람들', 'resources/Images/story/npc/마을 사람들.png');
		game.load.image('마을 소년', 'resources/Images/story/npc/마을 소년.png');
		game.load.image('부사관', 'resources/Images/story/npc/부사관.png');
		game.load.image('비토벤', 'resources/Images/story/npc/비토벤.png');
		game.load.image('월량풍', 'resources/Images/story/npc/월량풍.png');
		game.load.image('적군a', 'resources/Images/story/npc/적군a.png');
		game.load.image('적군b', 'resources/Images/story/npc/적군b.png');

		
		
		
	    
	    
	    //텍스트 박스
	    game.load.image("textbox", "resources/Images/tutorial/dialog.png");
	    //game.load.image("textbox", "resources/Images/story/textbox.png"); 
	    
	},
	create: function() {
		
		
		cursors = game.input.keyboard.createCursorKeys();
		this.typethetext("STORY1 ",game.world.centerX-150, game.world.centerY- 50,90);
		
		//2초있다가  스토리 시작
		game.time.events.add(2000, function () {  //글자 나올때 소리 추가
		
			//카메라 페이드 인
			game.camera.flash(0x000000, 3000);   
		
			typewriter.destroy();
			
		   	storyOrder = 0;
		   	
	   		this.dialogueExport(storyOrder);
		}, this);
	},
	update: function() {
	
		//앱에서 o누르면????   키보트 아래 누르면 다음 대화 
		if(cursors.down.isDown || game.input.activePointer.leftButton.isDown == true) {
			//어레이가 다 담겼다면 그때 적용되게끔  	
			if (typeof storyOrder !== "undefined"){
				//대화에서  번째가 마지막이 아니라면 다음 대화로
				  	if (storyOrder != arr.length-1) {
						storyOrder += 1;
					  	this.dialogueExport(storyOrder);
					  	//마지막 대화라면 빠져나가기
					}else if (storyOrder == arr.length-1){
						this.outfromstory();
					}
			  	}
		  //앱에서 x 누르면??? 키보드 오른쪽 누르면 스토리에서 나가기
		 }else if (cursors.right.isDown){
			 this.outfromstory();
		 }
	},
	render: function() {
		//현재 대화 몇번째인가 체크 하려고 만듬.
		if(typeof storyOrder !== 'undefined'){
	    game.debug.text("현재 storyOrder 확인 = "+ storyOrder, 32, 132);
		}if(typeof arr !=='undefined'){
	    game.debug.text(storynum +"스토리 대화 갯 수 = " + arr.length, 32, 162);
	    }
	},
	
	//페이드 아웃하기
	 outfromstory: function(){
		//2초뒤 페이드 아웃
		game.camera.fade('#000000',1000);
		//게임 시작
		game.camera.onFadeComplete.add(this.gotostage,this);
		
		game.timer.events.loop(Phaser.Timer.SECOND * 2, game.state.start("Preload"),this);
	},
		
	dialogueExport: function(storyOrder){
		alert(storyOrder);
        
 		//대화문이 있으면 삭제
 		if(typeof typewriter !== "undefined"){
 			typewriter.destroy();
 		}
   		//만약 dialogueBG가 있다면 삭제
 		if(typeof dialogueBG !== "undefined"){
 			dialogueBG.destroy();
 		}//만약 backimage가 있다면 삭제
 		if(typeof backimage !== "undefined"){
 			backimage.destroy();
 		}
 		
 		
 		//배경음악
 		if(storyOrder == 0){
 			bgMusicName = arr[storyOrder].bgImgName;
	 		this.music = game.add.sound(bgMusicName);
			this.music.play();
			//음악 반복
			this.music.loopFull();
			console.log("배경 음악 재생 = " + bgMusicName);
 		}
 		//배경음악 바뀜
 		else if(bgMusicName != arr[storyOrder].bgImgName){
 			this.music.stop();
 			bgMusicName = arr[storyOrder].bgImgName;
	 		this.music = game.add.sound(bgMusicName);
			this.music.play();
			this.music.loopFull();
			console.log("배경 음악 재생 = " + bgMusicName);
 		}
 		//음악 효과
 		if(arr[storyOrder].bgMusicName != "null"){
 			this.music = game.add.sound(arr[storyOrder].bgMusicName).play();
 			
 			console.log("음악 효과 재생 =" + arr[storyOrder].bgMusicName);
 		}
 		
		//배경이미지
		bgImgName = arr[storyOrder].bgImgName;
	    backimage = game.add.sprite(0, 0, bgImgName,10);
	    hikari = backimage.animations.add('hikari');
	    hikari.play(10,true);
	    console.log("배경이미지 = " + bgImgName);
	    
	    //대화할 npc 생성
		 if(storyOrder == 0){
			 characterName = arr[storyOrder].characterName;
			 switchingleftright = left
			    npc = game.add.sprite(switchingleftright, npcY, characterName);
			    console.log("npc 등장 = " + characterName);
		 }else if(characterName == arr[storyOrder].characterName){
			 	npc = game.add.sprite(switchingleftright, npcY, characterName);
			    console.log("npc 등장 = " + characterName);
		 }else if(characterName != arr[storyOrder].characterName){
		 
		 if(switchingleftright == left){ 
			 switchingleftright = right;
		 }else if(switchingleftright == right){
			 switchingleftright = left;
		 }
		    characterName = arr[storyOrder].characterName;
		    npc = game.add.sprite(switchingleftright, npcY, characterName);
		    console.log("npc 등장 = " + characterName);
	    }
	    //텍스트박스
		dialogueBG = game.add.sprite(50,650,'textbox');
		dialogueBG.width = 1500;

		this.typethetext(arr[storyOrder].characterName + " : "+ arr[storyOrder].content + "  >>", 100, 700,50);
		
		//배경 장소 정보 좌상단에 띄우기
 		//if(storyOrder == 0){
 			bgInfo = game.add.bitmapText(50, 50, 'neo_font',arr[storyOrder].bgImgName,50);
 			console.log("배경 정보  = " + arr[storyOrder].bgImgName);
 		/*}else if( bgImgName != arr[storyOrder].bgImgName ){
 			bgInfo.destroy(); 
 			bgInfo = game.add.bitmapText(50, 50, 'neo_font',arr[storyOrder].bgImgName,50);
 			console.log("배경 정보  = " + arr[storyOrder].bgImgName);
 		}*/
 		
	},

	//타이핑효과 함수 (텍스트값,x위치 , y위치)
	typethetext: function (txt, xvalue, yvalue, size) {
		//글자 타이핑효과 정의
		typewriter.init(game, {
			time:10,
			x : xvalue,
			y : yvalue,
			fontFamily : "neo_font",
			fontSize : size,
			maxWidth : 1400,
			//타이핑 소리 줌
			// sound: reg.track,
			text : txt
		});
		//타이핑 시작
		typewriter.start();

	},
	//DB에서 대화문 불러오기
	loadStoryContents: function(){ 
		$.ajax({
			url : 'loadStoryContents'
			,type : 'post'
			,dataType : 'json'
			,data: {storynum : storynum}
			/*cache : false,
			async : false,*/
			,success:function(arrtest){
				storyText = new Array();
				arr = new Array();
				arr = arrtest;
				console.log(" 스토리 대화문 컬럼 수 = " + arr.length);
				
			},error: function(){
				alert("대화문 임포트 에러");
			}

		});
		
	
	},

	//게임으로 이동 
	 gotostage: function(){
		//모든 게임 elements 날리기.
		game.world.removeAll()
		this.music.stop();
		
		//game.state.start('Ending');
		//game.state.start('stage'+i);  //예를 들어 stage1 
	}
}