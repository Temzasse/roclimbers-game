var stage, pauseCircle, goCircle, output;

		function init() {
			stage = new createjs.Stage("demoCanvas");
			
			pauseCircle = new createjs.Shape();
			pauseCircle.graphics.beginFill("red").drawCircle(0, 0, 40);
			pauseCircle.y = 50;
			stage.addChild(pauseCircle);
			
			goCircle = new createjs.Shape();
			goCircle.graphics.beginFill("green").drawCircle(0, 0, 40);
			goCircle.y = 150;
			stage.addChild(goCircle);

			// and register our main listener
			createjs.Ticker.on("tick", tick);

			// UI code:
			output = stage.addChild(new createjs.Text("", "14px monospace", "#000"));
			output.lineHeight = 15;
			output.textBaseline = "top";
			output.x = 10;
			output.y = stage.canvas.height-output.lineHeight*3-10;
		}
		
		function tick(event) {
			goCircle.x += 10;
			if (goCircle.x > stage.canvas.width) { goCircle.x = 0; }

            if (!createjs.Ticker.getPaused()) {
                pauseCircle.x += 10;
                if (pauseCircle.x > stage.canvas.width) { pauseCircle.x = 0; }
            }
			
			output.text = "getPaused()    = "+createjs.Ticker.getPaused()+"\n"+
				"getTime(true)  = "+createjs.Ticker.getTime(true)+"\n"+
				"getTime(false) = "+createjs.Ticker.getTime(false);
			
			stage.update(event); // important!!
		}
		
		function togglePause() {
			var paused = !createjs.Ticker.getPaused();
			createjs.Ticker.setPaused(paused);
			document.getElementById("pauseBtn").value = paused ? "unpause" : "pause";
		}