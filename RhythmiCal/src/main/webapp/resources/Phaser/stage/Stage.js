	/**실제로 게임이 이루어지는 화면입니다.
 *DB에서 받아온 데이터를 기초해서 각기 다른 스테이지를 만들어냅니다. 
 *1.DB에서 적절한 데이터와 함께 호출됨
 *2.데이터 초기화
 *3.게임의 실행
 *4.종료 후 적절한 STATE START
 */

//DB에서 가져온 데이터로 초기화시킬 변수들
var monstersA;
var monstersB;
var monstersC;
var beatStart;
//생명력. DB에서 불러와야 하는 값이며, 현재 임의로 상수를 주었다. ver.2 초기화 메소드에서 초기화 진행할것임 // TODO
var life;
var stageBGM;

//이곳에서 조정 혹은 고정된 변수들
var BPM;
//syuzincou => beatoven
var beatoven;
//Beatoven의 애니메이션 anim => animBeatoven
var animBeatoven;
//음표스프라이트 sprites =>noteSprites
var noteSprites;
//음표배경화면
var noteBgGroup;
//attackLine Info
var lineYLocation = [300, 490, 680];
var jumpX = [135,137.5,140];
//Beat counter
var currentBeat = 0;
//image => popUpImage
var popUpImage;
var comboCnt = 0;
var isComboNow = false;
var beatZone = false;
var beat = 0;
var numOfBeat;

//최대체력
var maxLife = 10; 
var lifeArray;
var BPMfactor = 60;

//모션효과에 관련된 변수들
var pointDamage = 3;
var point_isA,point_isB,point_isC;
var up_isA,up_isB,up_isC;
var down_isA,down_isB,down_isC;
var left_isA,left_isB,left_isC;
var right_isA,right_isB,right_isC;

//모션 세팅에 따른 변수 설정

//Controller에서 받아올 변수들
//멀티유저번호
var userNumber;
var tempNote;
var genNote;
var multiNum;
var contentNum;

//contentNum을 이용해 DB : stage에서 받아온 값을 저장할 변수
var bgImgName;
var monsterlistA; //moster테이블을 조회해 만든 arraylist:monsterlist를 저장할 변수
var monsterlistB; //moster테이블을 조회해 만든 arraylist:monsterlist를 저장할 변수
var monsterlistC; //moster테이블을 조회해 만든 arraylist:monsterlist를 저장할 변수
var bgmName;
var stageNum;

var resultFlag = true;

//보스를 담을 전역 변수
var boss, bossName;

var Stage = function(game) {};

Stage.prototype = {
	preload: function(){
		//DB에서 가져와야 할 리소스
		/////////////////stageNum을 받아오는 과정이 필요함
		//배경 로드
		game.load.image('stageBG','resources/Images/stage/' + bgImgName);
		//스테이지 BGM 로드

		game.load.audio('stageBGM1','resources/Audios/bgm/stage/bgm_stage_hiq_50bpm.mp3');	
		game.load.audio('stageBGM2','resources/Audios/bgm/stage/bgm_stage_mrtea_60bpm.mp3');

		//몬스터 로드
		game.load.spritesheet('Goblin', 'resources/Images/characters/monsters/26x32x6_Goblin.png', 26, 32, 6);
		game.load.spritesheet('GoblinHurt', 'resources/Images/characters/monsters/29x31x4_GoblinHurt.png', 29, 31, 4);
		game.load.spritesheet('GoblinDie', 'resources/Images/characters/monsters/56x31x9_GoblinDie.png', 56, 31, 9);
		game.load.spritesheet('Cutty', 'resources/Images/characters/monsters/21x24x12_Cutty.png', 21, 24, 12);
		game.load.spritesheet('CuttyHurt', 'resources/Images/characters/monsters/21x24x4_CuttyHurt.png', 21, 24, 4);
		game.load.spritesheet('CuttyDie', 'resources/Images/characters/monsters/21x24x12_CuttyDie.png', 32, 34, 12);
		game.load.spritesheet('TheFast', 'resources/Images/characters/monsters/40x30x6_TheFast.png', 40, 30, 6);
		game.load.spritesheet('TheFastHurt', 'resources/Images/characters/monsters/38x30x3_TheFastHurt.png', 38, 30, 3);
		game.load.spritesheet('TheFastDie', 'resources/Images/characters/monsters/44x29x7_TheFastDie.png', 44, 29, 7);
		game.load.spritesheet('TheFastest', 'resources/Images/characters/monsters/67x32x5_TheFastest.png', 67, 32, 5);
		game.load.spritesheet('TheFastestHurt', 'resources/Images/characters/monsters/39x24x4_TheFastestHurt.png', 39, 24, 4);
		game.load.spritesheet('TheFastestDie', 'resources/Images/characters/monsters/67x32x5_TheFastestDie.png', 67, 32, 5);
		game.load.spritesheet('Troll', 'resources/Images/characters/monsters/58x42x18_Troll.png', 58, 42, 18);
		game.load.spritesheet('TrollHurt', 'resources/Images/characters/monsters/58x42x3_TrollHurt.png', 58, 42, 3);
		game.load.spritesheet('TrollDie', 'resources/Images/characters/monsters/58x42x9_TrollDie.png', 58, 42, 9);
		game.load.spritesheet('BombGoblin', 'resources/Images/characters/monsters/192x288x6_BombGoblin.png', 192, 288, 6);
		game.load.spritesheet('BombGoblinHurt', 'resources/Images/characters/monsters/192x272x2_BombGoblinHurt.png', 192, 272, 2);
		game.load.spritesheet('BombGoblinDie', 'resources/Images/characters/monsters/256x272x8_BombGoblinDie.png', 256, 272, 8);
		game.load.spritesheet('Bull', 'resources/Images/characters/monsters/96x77x18_Bull.png', 96, 77, 18);
		game.load.spritesheet('BullHurt', 'resources/Images/characters/monsters/96x77x4_BullHurt.png', 96, 77, 4);
		game.load.spritesheet('BullDie', 'resources/Images/characters/monsters/96x77x8_BullDie.png', 96, 77, 8);
		game.load.spritesheet('BullRush', 'resources/Images/characters/monsters/96x77x6_BullRush.png', 96, 77, 6);
		game.load.spritesheet('Wind', 'resources/Images/characters/monsters/45x45x8_Wind.png', 45, 45, 8);
		game.load.spritesheet('WindHurt', 'resources/Images/characters/monsters/45x45x3_WindHurt.png', 45, 45, 3);
		game.load.spritesheet('WindDie', 'resources/Images/characters/monsters/45x45x8_WindDie.png', 45, 45, 8);
		game.load.spritesheet('Jyama', 'resources/Images/characters/monsters/40x40x8_Jyama.png', 40, 40, 8);
		game.load.spritesheet('JyamaHurt', 'resources/Images/characters/monsters/40x40x4_JyamaHurt.png', 40, 40, 4);
		game.load.spritesheet('JyamaDie', 'resources/Images/characters/monsters/40x40x8_JyamaDie.png', 40, 40, 8);
		game.load.spritesheet('JyamaSkill', 'resources/Images/characters/monsters/40x40x9_JyamaSkill.png', 40, 40, 9);
		game.load.spritesheet('Shield', 'resources/Images/characters/monsters/88x62x19_Shield.png', 88, 62, 19);
		game.load.spritesheet('ShieldHurt', 'resources/Images/characters/monsters/90x80x4_ShieldHurt.png', 90, 80, 4);
		game.load.spritesheet('ShieldDie', 'resources/Images/characters/monsters/90x80x5_ShieldDie.png', 90, 80, 5);
		//모션의 종류 및 효과 등 모션 데이터를 불러와야 함
		
		//Jyama스킬 방해구름 이미지
		game.load.spritesheet('Cloud', 'resources/Images/others/48x48x1_cloud.png', 48, 48, 1);
		
		//BombGoblin스킬 폭발 이미지
		game.load.spritesheet('Explosion', 'resources/Images/others/54x51x4_Explosion.png', 54, 51, 4);
		
		//항상 고정적인 리소스
		game.load.spritesheet('StunEffect', 'resources/Images/effect/1200x180x10_StunEffect.png', 1200, 180, 10);
		game.load.spritesheet('KnockBackEffect', 'resources/Images/effect/1200x180x8_KnockBackEffect.png', 1200, 180, 8);
		game.load.spritesheet('PoinEffect', 'resources/Images/effect/1200x180x12_PointEffect.png', 1200, 180, 12);
		game.load.spritesheet('NomalAttackEffect', 'resources/Images/effect/1200x180x5_NomalAttackEffect.png', 1200, 180, 5);
		//콤보 효과음 로드
		game.load.audio('comboSound', 'resources/Audios/effectSound/stage/effect_stage_combo.mp3');
		//생명력 이미지
		game.load.image('life', 'resources/Images/others/trebleclef.png');
		//비토벤 스프라이트시트
		game.load.spritesheet('beatoven', 'resources/Images/characters/beatoven.png', 32, 32, 16);
		//노비토 스프라이트시트
		game.load.spritesheet('Nobeato', 'resources/Images/characters/nobeato/64x64x8_Nobeato.png', 64, 64, 8);
		game.load.spritesheet('NobeatoJump', 'resources/Images/characters/nobeato/64x64x8_Nobeato.png', 64, 64, 8);
		game.load.spritesheet('NobeatoHurt', 'resources/Images/characters/nobeato/64x64x4_NobeatoHurt.png', 64, 64, 4);
		game.load.spritesheet('NobeatoDie', 'resources/Images/characters/nobeato/64x64x4_NobeatoDie.png', 64, 64, 4);
		//노비토 스프라이트시트
		game.load.spritesheet('tp1', 'resources/Images/characters/townPeople/intro_2_dancing01_60x60.png', 60, 60, 12);
		game.load.spritesheet('tp2', 'resources/Images/characters/townPeople/intro_2_dancing02_60x60.png', 60, 60, 9);
		game.load.spritesheet('tp3', 'resources/Images/characters/townPeople/intro_2_dancing03_60x60.png', 60, 60, 11);
		game.load.spritesheet('tp4', 'resources/Images/characters/townPeople/intro_2_dancing04_60x60.png', 60, 60, 6);
		//나보 스프라이트시트
		game.load.spritesheet('Nabo', 'resources/Images/characters/nabo/19x39x6_Nabo.png', 19, 39, 6);
		game.load.spritesheet('NaboHurt', 'resources/Images/characters/nabo/21x41x3_NaboHurt.png', 21, 41, 3);
		game.load.spritesheet('NaboDie', 'resources/Images/characters/nabo/26x41x8_NaboDie.png', 26, 41, 8);
		game.load.spritesheet('NaboJump', 'resources/Images/characters/nabo/34x42x6_NaboJump.png', 34, 42, 6);
		//월량풍 스프라이트시트
		game.load.spritesheet('WollYangPung', 'resources/Images/characters/wollyangpung/48x48x6_WollYangPung.png', 48, 48, 6);
		game.load.spritesheet('WollYangPungJump', 'resources/Images/characters/wollyangpung/48x48x6_WollYangPung.png', 48, 48, 6);
		game.load.spritesheet('WollYangPungHurt', 'resources/Images/characters/wollyangpung/48x48x6_WollYangPungHurt.png', 48, 48, 6);
		game.load.spritesheet('WollYangPungDie', 'resources/Images/characters/wollyangpung/48x48x6_WollYangPungDie.png', 48, 48, 6);
		//음표그림4개 로드   1:노랑, 2:초록, 3:빨강, 4:파랑
		for(var i=1; i<=4;i++){
			game.load.image('note'+i, 'resources/Images/notes/note'+i+'.png');
		}
		//음표배경 로드
		game.load.image('noteBG', 'resources/Images/notes/noteBG.png');
		game.load.spritesheet('imgO', 'resources/Images/notes/342x306x18_imgO.png',342,306,18);
		game.load.spritesheet('imgX', 'resources/Images/notes/304x262x7_imgX.png',304,262,7);
		//체력바 관련 로드
		game.load.spritesheet('healthFill', 'resources/Images/others/healthFill.png', 32, 32, 1);
		game.load.spritesheet('healthBlank', 'resources/Images/others/healthBlank.png', 32, 32, 1);
		//숫자(0~9) 스프라이트
		for (var i = 0; i < 10; i++) {
			game.load.spritesheet('number'+i, 'resources/Images/numbers/number_'+i+'.png', 32, 32, 20);
		}
		//클리어 및 실패 , 페이드아웃 이미지
		game.load.spritesheet('msgclear', 'resources/Images/others/clear.png', 32, 32, 5);
		game.load.spritesheet('msgfail', 'resources/Images/others/fail.png', 32, 32, 4);
		game.load.image('blackScreen', 'resources/Images/others/black.png');
		//ABC 레인 알파벳 로드
		game.load.image('A', 'resources/Images/stage/line_A.png');
		game.load.image('B', 'resources/Images/stage/line_B.png');
		game.load.image('C', 'resources/Images/stage/line_C.png');
	},
	create: function(){
		//physics
		game.physics.startSystem(Phaser.Physics.ARCADE);
		game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
		game.input.onDown.add(gofull, this);
		

		if (contentNum%2 == 0) {
			stageBGM = game.add.audio('stageBGM1');
			BPM = BPMfactor / 50;
		}else if (contentNum%2 == 1) {
			stageBGM = game.add.audio('stageBGM2');
			BPM = BPMfactor / 60;
		}

		//여기에 BPM 값을 넣는다 
		beatStart = 0;
		//고정 데이터들의 생성
		//배경색
		game.add.sprite(0, 0, 'stageBG');
		game.stage.backgroundColor = '#6688ee';
		//콤보 효과음 설정
		comboSound = game.add.audio('comboSound');
		comboSound.addMarker('comboSound', 0, 1);
		//ABC 레인을 표시하는 스프라이트 생성
		game.add.image(300, 150, 'A');
		game.add.image(280, 340, 'B');
		game.add.image(250, 540, 'C');
		
		//마을사람들 생성
		createTownPeople();
		//feverdancingControl(20);
		//changeTownPeopleDepressed();
		//스프라이트 시트에서 2번째 이미지를 먼저 시작한다.
		beatoven = game.add.sprite(150, game.world.centerY, 'beatoven',1);
		beatoven.anchor.setTo(0.5,1);
		beatoven.scale.set(5); 
		beatoven.smoothed = false;
		//하나씩 나타나는 음표를 그룹으로 주기
		sprites = game.add.group();
		//음표 뒤에 배경생성    game.width/2-150, 500 위치에 생성
		var noteBG = sprites.create(game.width/2, 730, 'noteBG');
		noteBG.anchor.setTo(0.5,0.5);
		noteBG.scale.set(2);
		noteBG.alpha = 0.5;
		//음표 흐르는 거 배경을 그룹으로 주기
		noteBgGroup = game.add.group();
		//그룹에  noteBG이미지 넣기
		noteBgGroup.add(noteBG);
		//목숨 추가
		iniLife();
		//게임 기초 세팅
		
		//몬스터를 담을 배열 생성
		monstersA = new Array();
		monstersB = new Array();
		monstersC = new Array();
		//Monster(game, attackLine, speed, monsterName, appearanceBeat)
		for (var i = 0; i < monsterlistA.length; i++) {
			monstersA[i] = new Monster(game, monsterlistA[i].monsterNum, monsterlistA[i].attackline, monsterlistA[i].speed, monsterlistA[i].monsterName, monsterlistA[i].appearanceBeat, monsterlistA[i].health);
			monstersA[i].status = "STAY";
		}
		for (var i = 0; i < monsterlistB.length; i++) {
			monstersB[i] = new Monster(game, monsterlistB[i].monsterNum, monsterlistB[i].attackline, monsterlistB[i].speed, monsterlistB[i].monsterName, monsterlistB[i].appearanceBeat, monsterlistB[i].health);
			monstersB[i].status = "STAY";
		}
		for (var i = 0; i < monsterlistC.length; i++) {
			monstersC[i] = new Monster(game, monsterlistC[i].monsterNum, monsterlistC[i].attackline, monsterlistC[i].speed, monsterlistC[i].monsterName, monsterlistC[i].appearanceBeat, monsterlistC[i].health);
			monstersC[i].status = "STAY";
		}
		
		//Boss(game, health, bossSpriteName, bossSpriteSplitNum)
		if (bossName != null) {
			boss = new Boss(game, 5, bossName);			
		}

		//Timer functions here
	    game.time.events.loop(Phaser.Timer.SECOND * BPM, this.loopFunction, this);
	    game.time.events.loop((Phaser.Timer.SECOND / 5) * BPM , toggleBeatZone, this);
	},
	render: function(){
	    game.debug.text("BeatZone : "+ (beatZone? "@@@@@@@@@@@":""), game.width/2-100, game.height/2+300);
	},
	update: function(){
		if(beatZone){
			motionCheck();
		}else{
			wrongTiming();
		}
	},
	//나중에 이곳으로 모은다.
	loopFunction: function(){
		//add 1 currentBeat
		if (currentBeat == 0) {
			stageBGM.play();
		}else if(currentBeat >= 60){
			if (currentBeat >= 65) {
				stageBGM.stop();
			}
			stageResult(true);
			return;
		}
		currentBeat += 1;
		console.log(currentBeat);
		startMonster();
		jumpchar();
		createNotes();
		//hitBoss(boss, 1);
		//bossJump();
		isFail();
	
	}
}

function isFail(){
	if (life == 0) {
		//실패 처리
		//실행하던거 전부 종료하고 fail 페이드아웃
		//stageResult(false);
		//끝낸 다음에 fail.js 실행
		game.time.events.add(5000, function() {
			resultFlag = true;
			updateLife(7);
			requestContentNum("Stage");
		});
		//fail.js에서는 실패 이미지(?)를 잠시 보여주고 다시 이 스테이지를 실행한다.
	}else if(currentBeat >= numOfBeat){
		stageResult(true);
		game.time.events.add(5000, function() {
			resultFlag = true;
			game.state.start("Preload");
		});
	}
}

function gofull() {
	if (game.scale.isFullScreen) {
		game.scale.stopFullScreen();
	}
	else {
		game.scale.startFullScreen(false);
	}
}
