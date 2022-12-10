game.GameOverScreen = me.ScreenObject.extend({
  init: function () {
    this.savedData = null;
    this.handler = null;
  },

  onResetEvent: function () {
    //save section
    this.savedData = {
      score: game.data.score,
      steps: game.data.steps,
    };
    me.save.add(this.savedData);

    if (!me.save.topSteps) me.save.add({ topSteps: game.data.steps });
    if (game.data.steps > me.save.topSteps) {
      me.save.topSteps = game.data.steps;
      game.data.newHiScore = true;
    }
    me.input.bindKey(me.input.KEY.ENTER, "enter", true);
    me.input.bindKey(me.input.KEY.SPACE, "enter", false);
    me.input.bindPointer(me.input.pointer.LEFT, me.input.KEY.ENTER);

    this.handler = me.event.subscribe(
      me.event.KEYDOWN,
      function (action, keyCode, edge) {
        if (action === "enter") {
          me.state.change(me.state.MENU);
        }
      }
    );

    me.game.world.addChild(
      new me.Sprite(
        me.game.viewport.width / 2,
        me.game.viewport.height / 2 - 94,
        { image: "gameover" }
      ),
      12
    );

    var gameOverBG = new me.Sprite(
      me.game.viewport.width / 2,
      me.game.viewport.height / 2,
      { image: "gameoverbg" }
    );
    me.game.world.addChild(gameOverBG, 10);

    me.game.world.addChild(new BackgroundLayer("bg", 1));

    // ground
    this.ground1 = me.pool.pull("ground", 0, me.game.viewport.height - 96);
    this.ground2 = me.pool.pull(
      "ground",
      me.game.viewport.width,
      me.video.renderer.getHeight() - 96
    );
    me.game.world.addChild(this.ground1, 11);
    me.game.world.addChild(this.ground2, 11);

    // add the dialog witht he game information
    if (game.data.newHiScore) {
      var newRect = new me.Sprite(gameOverBG.width / 2, gameOverBG.height / 2, {
        image: "new",
      });
      me.game.world.addChild(newRect, 12);
    }

    this.dialog = new (me.Renderable.extend({
      // constructor
      init: function () {
        this._super(me.Renderable, "init", [
          0,
          0,
          me.game.viewport.width / 4,
          me.game.viewport.height / 3,
        ]);
        this.font = new me.Font("Press Start 2P", 20, "#FF5555", "left");
        this.steps = "Poeng:" + game.data.steps.toString();
        this.topSteps = "Rekord:" + me.save.topSteps.toString();
      },

      draw: function (renderer) {
        var stepsText = this.font.measureText(renderer, this.steps);
        var topStepsText = this.font.measureText(renderer, this.topSteps);
        var scoreText = this.font.measureText(renderer, this.score);

        //steps
        this.font.draw(
          renderer,
          this.steps,
          me.game.viewport.width / 2 - stepsText.width / 2 - 26,
          me.game.viewport.height / 2 - 6
        );

        //top score
        this.font.draw(
          renderer,
          this.topSteps,
          me.game.viewport.width / 2 - stepsText.width / 2 - 26,
          me.game.viewport.height / 2 + 26
        );
      },
    }))();
    me.game.world.addChild(this.dialog, 12);
  },

  onDestroyEvent: function () {
    // unregister the event
    me.event.unsubscribe(this.handler);
    me.input.unbindKey(me.input.KEY.ENTER);
    me.input.unbindKey(me.input.KEY.SPACE);
    me.input.unbindPointer(me.input.pointer.LEFT);
    this.ground1 = null;
    this.ground2 = null;
    this.font = null;
    me.audio.stop("theme");
  },
});
