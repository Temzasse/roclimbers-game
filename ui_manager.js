var stage, world, main_menu, paused_menu, currentLevel, selected_level

WIDTH = 600;
HEIGHT = $(window).height();

var items = [];
var difficulty = 0.97;
var gameStarted = false;
var gamePaused = false;
var music;

// Muuta canvaksen piirto- ja todellinen korkeus
var can = document.getElementById("game");
can.style.height = HEIGHT + "px";
can.height = HEIGHT;


function showGame(){
	stage.removeChild(main_menu);
	stage.removeChild(paused_menu);
	stage.addChild(world);
	console.log(gamePaused);
	if (gamePaused){
		music.resume();
	}
	else{
		music = createjs.Sound.play(level.music, {loop:-1});
	}
	gamePaused = false;
}

function showPausedMenu(){
	stage.removeChild(world);
	stage.removeChild(main_menu);
	stage.addChild(paused_menu);
	music.pause();
}

function showMainMenu(){
	stage.removeChild(world);
	stage.removeChild(paused_menu);
	stage.removeChild(win_menu);
	stage.addChild(main_menu);
	music.pause();
}

function showWinMenu(){
	stage.addChild(win_menu);
	createjs.Sound.play("win_sound", {loop:0});
	music.stop();
}
function showDeadMenu(){
	stage.addChild(dead_menu);
	music.stop();
}
function showInstructions(){
	stage.addChild(instructions);
}
function closeInstructions(){
	stage.removeChild(instructions);
}

function createGame(){

	// tyhjennetään itemsit
	items = [];
	//selected_level = null;

	//Luodaan stageen "maailma", joka sisältää kaikki siinä olevat objektit
	world = new createjs.Container();
	//Järjestellään objektit layereihin.
	//"World layer 0". Taustakuva
	wl0 = new createjs.Container();
	//"World layer 1". Kallio seinämä
	wl1 = new createjs.Container();
	//"World layer 2". Pelaajaobjektit (eli oikeesti vaan yks jäbä)
	wl2 = new createjs.Container();
	//Lisätään containerit maailmaa ja maailma stageen
	world.addChild(wl1);
	world.addChild(wl2);
	//stage.addChild(world);
	//stage.addChild(menu);
	
	//Luodaan pelaaja: 1 elämä, positio (10,10)
	player = new Player(1, WIDTH/2, HEIGHT-60);
	wl2.addChild(player.sprite);
	
	//Tehään läpällä heti kivi. Nyt kivi lisää intensä world layer kakkoseen konstruktorissa. Toinen mahdollisuus olisi luoda initissä "item"-container johon itemmit aina lisäisivät itsensä. Se auttais konsistentimmassa piirtämisjärjestyksessä.
	stone = new Item(100, wl2);
	items.push(stone);

	if( selected_level === 1){
		//Vika parametri on nykyään voittamiskorkeus, eli esim. 100px pienempi kuin taso itse.
		level = new Level(lvl1ga, lvl1bg, 1900, "lvl_1_music");
	}
	else if( selected_level === 2){
		level = new Level(lvl2ga, lvl2bg, 1900, "lvl_2_music");
	}
	
	currentLevel = level;
	wl1.addChild(level.bg);
	wl1.addChild(level.ga);
	
	//Score!
	score = new createjs.Text("yolo", "36px Arial", "#ffffff");
	score.x = 10;
	score.y=10; 
	wl2.addChild(score);

	gameStarted = true;
	gamePaused = false;
	// Piilota Menu ja aloita peli
	showGame();
}

function createMenus(){

	// Main Menu---------------------------------------------------
	main_menu = new createjs.Container();

	// tausta
	var texture = new Image();
	texture.src = "images/texture.png";
	texture.onload = function() {
	    var menu_bg = new createjs.Shape();	
		//menu_bg.graphics.beginFill("red").drawRect(0, 0, WIDTH, HEIGHT);
		menu_bg.graphics.beginBitmapFill(texture).drawRect(0, 0, WIDTH, HEIGHT);

		// Pelin nimi
		var title = new createjs.Text("Roclimbers 2", "bold 46px Impact", "#fff")
		title.name = "title";
		title.textAlign = "center";
		title.textBaseline = "middle";
		title.x = WIDTH/2;
		title.y = 50;
		var sub_title = new createjs.Text("Adventure Of The Zen Mountain", "bold 22px Oswald", "#fff")
		sub_title.name = "sub_title";
		sub_title.textAlign = "center";
		sub_title.textBaseline = "middle";
		sub_title.x = WIDTH/2;
		sub_title.y = 90;

		// Napit
		// Level valinnat
		var choose_level_text = new createjs.Text("Choose level and difficulty", "20px Oswald", "#fff");
		choose_level_text.name = "choose-level-label";
		choose_level_text.textAlign = "center";
		choose_level_text.textBaseline = "middle";
		choose_level_text.x = WIDTH/2;
		choose_level_text.y = HEIGHT*(2/8);

		var lvl_1 = new createjs.Bitmap(lvl1thumb);
		var lvl_2 = new createjs.Bitmap(lvl2thumb);
		lvl_1.shadow = new createjs.Shadow("#000", 3, 3, 20);
		lvl_2.shadow = new createjs.Shadow("#000", 3, 3, 20);

		// Levelin valinta border
		var lvl_1_stroke = new createjs.Shape();
		var lvl_2_stroke = new createjs.Shape();
		lvl_1_stroke.graphics.beginStroke("#CC6633").setStrokeStyle(8).beginFill("#000").drawRect(200, HEIGHT*(2/8)+25, 200, 128);
		lvl_2_stroke.graphics.beginStroke("#CC6633").setStrokeStyle(8).beginFill("#000").drawRect(200, HEIGHT*(2/8)+128+50, 200, 128);
		lvl_1_stroke.alpha = 0;
		lvl_2_stroke.alpha = 0;

		// Kuvan koko on 200x255
		lvl_1.x = 200;
		lvl_1.y = HEIGHT*(2/8)+25;
		lvl_2.x = 200;
		lvl_2.y = HEIGHT*(2/8)+128+50;

		// normal
		var normal_dif_bg = new createjs.Shape();
		//normal_dif_bg.graphics.beginFill("#fff").drawRoundRect( 0, 0, 60, 30, 5);
		// normal on default vaikeusaste
		normal_dif_bg.graphics.clear().beginStroke("#CC6633").setStrokeStyle(4).beginFill("#fff").drawRoundRect( 0, 0, 60, 30, 5);

		var normal_dif_label = new createjs.Text("normal", "bold 14px Arial", "#333");
		normal_dif_label.name = "normal-dif-label";
		normal_dif_label.textAlign = "center";
		normal_dif_label.textBaseline = "middle";
		normal_dif_label.x = 60/2;
		normal_dif_label.y = 30/2;

		var normal_dif_button = new createjs.Container();
		normal_dif_button.name = "button";
		normal_dif_button.x = ((WIDTH/2)-30-70);
		normal_dif_button.y = HEIGHT*(2/8)+(128*2)+75;
		normal_dif_button.addChild(normal_dif_bg, normal_dif_label);
		// hard
		var hard_dif_bg = new createjs.Shape();
		hard_dif_bg.graphics.beginFill("#fff").drawRoundRect( 0, 0, 60, 30, 5);
		var hard_dif_label = new createjs.Text("hard", "bold 14px Arial", "#333");
		hard_dif_label.name = "hard_dif-label";
		hard_dif_label.textAlign = "center";
		hard_dif_label.textBaseline = "middle";
		hard_dif_label.x = 60/2;
		hard_dif_label.y = 30/2;

		var hard_dif_button = new createjs.Container();
		hard_dif_button.name = "button";
		hard_dif_button.x = ((WIDTH/2)-30);
		hard_dif_button.y = HEIGHT*(2/8)+(128*2)+75;
		hard_dif_button.addChild(hard_dif_bg, hard_dif_label);
		// insane
		var insane_dif_bg = new createjs.Shape();
		insane_dif_bg.graphics.beginFill("#fff").drawRoundRect( 0, 0, 60, 30, 5);

		var insane_dif_label = new createjs.Text("insane", "bold 14px Arial", "#33");
		insane_dif_label.name = "insane_dif-label";
		insane_dif_label.textAlign = "center";
		insane_dif_label.textBaseline = "middle";
		insane_dif_label.x = 60/2;
		insane_dif_label.y = 30/2;

		var insane_dif_button = new createjs.Container();
		insane_dif_button.name = "button";
		insane_dif_button.x = ((WIDTH/2)-30+70);
		insane_dif_button.y = HEIGHT*(2/8)+(128*2)+75;
		insane_dif_button.addChild(insane_dif_bg, insane_dif_label);

		// start_game = st
		var st_bg = new createjs.Shape();
		st_bg.graphics.beginFill("#fff").drawRoundRect( 0, 0, 150, 60, 15);

		var st_label = new createjs.Text("Start Game", "26px Impact", "#333");
		st_label.name = "start-game-label";
		st_label.textAlign = "center";
		st_label.textBaseline = "middle";
		st_label.x = 150/2;
		st_label.y = 60/2;

		var st_button = new createjs.Container();
		st_button.name = "button";
		st_button.x = ((WIDTH/2)-75);
		st_button.y = HEIGHT*(2/8)+(128*2)+130;
		st_button.addChild(st_bg, st_label);

		// ohjeet
		var ins_bg = new createjs.Shape();
		ins_bg.graphics.beginFill("#fff").drawRoundRect( 0, 0, 60, 20, 15);

		var ins_label = new createjs.Text("Guide", "bold 14px Arial", "#333");
		ins_label.name = "ins-label";
		ins_label.textAlign = "center";
		ins_label.textBaseline = "middle";
		ins_label.x = 60/2;
		ins_label.y = 20/2;

		var ins_button = new createjs.Container();
		ins_button.name = "button";
		ins_button.x = (WIDTH-10-60);
		ins_button.y = 10;
		ins_button.addChild(ins_bg, ins_label);

		// lisätään Main Menu elementit
		main_menu.addChild(menu_bg, title, sub_title, choose_level_text, lvl_1_stroke, lvl_2_stroke, lvl_1, lvl_2, normal_dif_button, hard_dif_button, insane_dif_button, st_button, ins_button);
		stage.addChild(main_menu);

		// Lisätään tapahtumakuuntelijat nappeihin ja thumbnaileihins
		ins_button.on("click", showInstructions);
		st_button.on("click", function(){
			if ( selected_level ){
				createGame();
			}
			else{
				alert("Select a level to play!");
			}
		});

		lvl_1.on("click", function(){
			selected_level = 1;
			lvl_1_stroke.alpha = 1;
			lvl_2_stroke.alpha = 0;
		});

		lvl_2.on("click", function(){
			selected_level = 2;
			lvl_2_stroke.alpha = 1;
			lvl_1_stroke.alpha = 0;
		});
		normal_dif_button.on("click", function(){
			difficulty = 0.97;
			//normal_dif_bg.graphics.beginStroke("green").setStrokeStyle(8);
			hard_dif_bg.graphics.clear().beginFill("#fff").drawRoundRect( 0, 0, 60, 30, 5);
			insane_dif_bg.graphics.clear().beginFill("#fff").drawRoundRect( 0, 0, 60, 30, 5);
			normal_dif_bg.graphics.clear().beginStroke("#CC6633").setStrokeStyle(4).beginFill("#fff").drawRoundRect( 0, 0, 60, 30, 5);
		});
		hard_dif_button.on("click", function(){
			difficulty = 0.95;
			normal_dif_bg.graphics.clear().beginFill("#fff").drawRoundRect( 0, 0, 60, 30, 5);
			insane_dif_bg.graphics.clear().beginFill("#fff").drawRoundRect( 0, 0, 60, 30, 5);
			hard_dif_bg.graphics.clear().beginStroke("#CC6633").setStrokeStyle(4).beginFill("#fff").drawRoundRect( 0, 0, 60, 30, 5);
		});
		insane_dif_button.on("click", function(){
			difficulty = 0.90;
			normal_dif_bg.graphics.clear().beginFill("#fff").drawRoundRect( 0, 0, 60, 30, 5);
			hard_dif_bg.graphics.clear().beginFill("#fff").drawRoundRect( 0, 0, 60, 30, 5);
			insane_dif_bg.graphics.clear().beginStroke("#CC6633").setStrokeStyle(4).beginFill("#fff").drawRoundRect( 0, 0, 60, 30, 5);
		});
		// Main Menu END---------------------------------------------------



		// Paused Menu---------------------------------------------------
		paused_menu = new createjs.Container();

		// game paused text
		var paused_text = new createjs.Text("Game paused!", "bold 24px Oswald", "#fff");
		paused_text.name = "paused-text-label";
		paused_text.textAlign = "center";
		paused_text.textBaseline = "middle";
		paused_text.x = WIDTH/2;
		paused_text.y = HEIGHT*(1/6)+50;

		// resume button
		var resume_bg = new createjs.Shape();
		resume_bg.graphics.beginFill("#fff").drawRoundRect( 0, 0, 150, 60, 15);

		var resume_label = new createjs.Text("Resume", "24px Impact", "#333");
		resume_label.name = "resume-game-label";
		resume_label.textAlign = "center";
		resume_label.textBaseline = "middle";
		resume_label.x = 150/2;
		resume_label.y = 60/2;

		var resume_button = new createjs.Container();
		resume_button.name = "button";
		resume_button.x = ((WIDTH/2)-75);
		resume_button.y = HEIGHT*(2/6);
		resume_button.addChild(resume_bg, resume_label);

		// replay button
		var replay_bg = new createjs.Shape();
		replay_bg.graphics.beginFill("#fff").drawRoundRect( 0, 0, 150, 60, 15);

		var replay_label = new createjs.Text("Replay", "24px Impact", "#333");
		replay_label.name = "replay-label";
		replay_label.textAlign = "center";
		replay_label.textBaseline = "middle";
		replay_label.x = 150/2;
		replay_label.y = 60/2;

		var replay_button = new createjs.Container();
		replay_button.name = "button";
		replay_button.x = ((WIDTH/2)-75);
		replay_button.y = HEIGHT*(3/6);
		replay_button.addChild(replay_bg, replay_label);

		// main menu button
		var main_menu_bg = new createjs.Shape();
		main_menu_bg.graphics.beginFill("#fff").drawRoundRect( 0, 0, 150, 60, 15);

		var main_menu_label = new createjs.Text("Main menu", "24px Impact", "#333");
		main_menu_label.name = "main-menu-label";
		main_menu_label.textAlign = "center";
		main_menu_label.textBaseline = "middle";
		main_menu_label.x = 150/2;
		main_menu_label.y = 60/2;

		var main_menu_button = new createjs.Container();
		main_menu_button.name = "button";
		main_menu_button.x = ((WIDTH/2)-75);
		main_menu_button.y = HEIGHT*(4/6);
		main_menu_button.addChild(main_menu_bg, main_menu_label);

		// lisätään Paused Menu elementit
		paused_menu.addChild(menu_bg.clone(true), title.clone(true), sub_title.clone(true), paused_text, resume_button, replay_button, main_menu_button);
		// Lisätään tapahtumakuuntelijat nappeihin
		resume_button.on("click", showGame);
		replay_button.on("click", createGame);
		main_menu_button.on("click", showMainMenu);
		// Paused Menu END---------------------------------------------------
		


		// Win Menu -----------------------------
		win_menu = new createjs.Container();
		var win_text = new createjs.Text("You won!", "72px Impact", "#000");
		win_text.name = "win-menu-label";
		win_text.textAlign = "center";
		win_text.textBaseline = "middle";
		win_text.x = WIDTH/2;
		win_text.y = HEIGHT*(2/6);

		var win_replay_button = new createjs.Container();
		win_replay_button.x = ((WIDTH/2)-75);
		win_replay_button.y = HEIGHT*(3/6);
		win_replay_button.addChild(replay_bg.clone(true), replay_label.clone(true));

		var win_menu_button = new createjs.Container();
		win_menu_button.name = "button";
		win_menu_button.x = ((WIDTH/2)-75);
		win_menu_button.y = HEIGHT*(4/6);
		win_menu_button.addChild(main_menu_bg.clone(true),main_menu_label.clone(true));
		// lisätään Win Menu elementit
		win_menu.addChild(win_text, win_replay_button, win_menu_button);
		win_replay_button.on("click", createGame);
		win_menu_button.on("click", showMainMenu);




		// Dead Menu---------------------------------------------------
		dead_menu = new createjs.Container();
		// You died text
		var dead_text = new createjs.Text("You died", "72px Impact", "#000");
		dead_text.name = "dead-text-label";
		dead_text.textAlign = "center";
		dead_text.textBaseline = "middle";
		dead_text.x = WIDTH/2;
		dead_text.y = HEIGHT*(2/6);

		var dead_replay_button = new createjs.Container();
		dead_replay_button.x = ((WIDTH/2)-75);
		dead_replay_button.y = HEIGHT*(3/6);
		dead_replay_button.addChild(replay_bg.clone(true), replay_label.clone(true));

		var dead_main_menu_button = new createjs.Container();
		dead_main_menu_button.x = ((WIDTH/2)-75);
		dead_main_menu_button.y = HEIGHT*(4/6);
		dead_main_menu_button.addChild(main_menu_bg.clone(true), main_menu_label.clone(true));
		// lisätään Dead Menu elementit
		dead_menu.addChild(dead_text, dead_replay_button, dead_main_menu_button);
		dead_replay_button.on("click", createGame);
		dead_main_menu_button.on("click", showMainMenu);
		// Dead Menu END---------------------------------------------------


		// Instruction---------------------------------------------------
		instructions = new createjs.Container();
		instructions_content = new createjs.Container();
		var ins_title = new createjs.Text("Instructions", "32px Impact", "#fff");
		ins_title.textAlign = "center";
		ins_title.textBaseline = "middle";
		ins_title.x = WIDTH/2;
		ins_title.y = HEIGHT*(1/6);
		var ins_text1 = new createjs.Text("You can control the player with the arrow keys.", "16px Roboto", "#fff");
		ins_text1.textAlign = "center";
		ins_text1.textBaseline = "middle";
		ins_text1.x = WIDTH/2;
		ins_text1.y = HEIGHT*(1/6)+50;
		var ins_text2 = new createjs.Text("Pause the game with the 'esc' key.", "16px Roboto", "#fff");
		ins_text2.textAlign = "center";
		ins_text2.textBaseline = "middle";
		ins_text2.x = WIDTH/2;
		ins_text2.y = HEIGHT*(1/6)+80;
		var ins_text3 = new createjs.Text("If you get hit by a falling rock you die.", "16px Roboto", "#fff");
		ins_text3.textAlign = "center";
		ins_text3.textBaseline = "middle";
		ins_text3.x = WIDTH/2;
		ins_text3.y = HEIGHT*(1/6)+110;
		var ins_text4 = new createjs.Text("The game is won when you reach the top of the mountain. Good luck!  ", "16px Roboto", "#fff");
		ins_text4.textAlign = "center";
		ins_text4.textBaseline = "middle";
		ins_text4.x = WIDTH/2;
		ins_text4.y = HEIGHT*(1/6)+140;
		instructions_content.addChild(ins_title, ins_text1, ins_text2, ins_text3, ins_text4);

		requirments_content = new createjs.Container();
		var req_title = new createjs.Text("requirments", "32px Impact", "#fff");
		req_title.textAlign = "center";
		req_title.textBaseline = "middle";
		req_title.x = WIDTH/2;
		req_title.y = HEIGHT*(1/6)+220;
		var req_text1 = new createjs.Text("The game works at least with:", "16px Roboto", "#fff");
		req_text1.textAlign = "center";
		req_text1.textBaseline = "middle";
		req_text1.x = WIDTH/2;
		req_text1.y = HEIGHT*(1/6)+270;
		var req_text2 = new createjs.Text("Chrome v. 39", "bold 16px Roboto", "#fff");
		req_text2.textAlign = "center";
		req_text2.textBaseline = "middle";
		req_text2.x = WIDTH/2;
		req_text2.y = HEIGHT*(1/6)+300;
		var req_text3 = new createjs.Text("Windows 7", "bold 16px Roboto", "#fff");
		req_text3.textAlign = "center";
		req_text3.textBaseline = "middle";
		req_text3.x = WIDTH/2;
		req_text3.y = HEIGHT*(1/6)+330;
		var req_text4 = new createjs.Text("OS X Yosemite", "bold 16px Roboto", "#fff");
		req_text4.textAlign = "center";
		req_text4.textBaseline = "middle";
		req_text4.x = WIDTH/2;
		req_text4.y = HEIGHT*(1/6)+360;
		requirments_content.addChild(req_title, req_text1, req_text2, req_text3, req_text4);


		var ins_close_label = new createjs.Text("close", "32px Impact", "#333");
		ins_close_label.textAlign = "center";
		ins_close_label.textBaseline = "middle";
		ins_close_label.x = 150/2;
		ins_close_label.y = 60/2;
		var ins_close_button = new createjs.Container();
		ins_close_button.x = ((WIDTH/2)-75);
		ins_close_button.y = HEIGHT*(5/6);
		ins_close_button.addChild(replay_bg.clone(true), ins_close_label);

		var separator = new createjs.Shape();
		separator.graphics.beginFill("#fff").drawRoundRect( 30, HEIGHT*(1/6)+180, WIDTH-60, 5, 3);


		instructions.addChild(menu_bg.clone(true), instructions_content, separator, requirments_content, ins_close_button);
		ins_close_button.on("click", closeInstructions);
		
		// Instruction END---------------------------------------------------
	}
	

}





