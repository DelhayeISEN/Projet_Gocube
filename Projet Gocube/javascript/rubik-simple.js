/********************************************************************************************************************************************
*                                             Création d'un module YUI appelé rubik-simple                                                  *     
*********************************************************************************************************************************************/

/* 
* YUI.add() est une méthode statique qui enregistre des modules essentiels et réutilisables. 
* Il ajoute un module à l'ensemble des modules utilisables pour être attacher a l'instance YUI via la méthode YUI.use(). 
*/

YUI.add('rubik-simple', function (Y) {

    /*
    * C'est ici que sont gérés les mouvements des cubies.
    * Quand un mouvement sur le cube se produit, il faut, d'une certaine manière, changer les positions des cubies sur le cube.
    * A chaque cubie est associé une classe css contenant sa transformation en 3D.
    * Prenons un exemple :
    * Quand on tourne la face gauche du cube dans le sens des aiguilles d'une montre,
    * ce qui correspond au mouvement M de la partie gauche (LM-left),
    * le cubie qui se situe dans le coin supérieur gauche de la face du haut ("utl") va, après le mouvement,
    * dans le coin gauche supérieur de la face de derrière ("btl").
    * Ainsi, pour un mouvement LM-left, "utl" => "btl"
    */

    /*
    * Ci-dessous, on definit les changements qui peuvent se produire selon le type de mouvement.
    */

    var CUBIE_MOVEMENTS = {

        /* Dans le sens horaire */

        /* Mouvements des stickers verticaux associés aux faces de gauche et de droite */

        "LM-right":{
            "utl":"ftl","ucl":"fcl","ubl":"fbl","ftl":"dtl","fcl":"dcl","fbl":"dbl","dtl":"btl",
            "dcl":"bcl","dbl":"bbl","btl":"utl","bcl":"ucl","bbl":"ubl","ltl":"ltr","lcl":"ltc",
            "lbl":"ltl","ltc":"lcr","lbc":"lcl","ltr":"lbr","lcr":"lbc","lbr":"lbl","lcc":"lcc"
        },
        'RM-right':{
            "utr":"ftr","ucr":"fcr","ubr":"fbr","ftr":"dtr","fcr":"dcr","fbr":"dbr","dtr":"btr",
            "dcr":"bcr","dbr":"bbr","btr":"utr","bcr":"ucr","bbr":"ubr","rtl":"rbl","rcl":"rbc",
            "rbl":"rbr","rtc":"rcl","rcc":"rcc","rbc":"rcr","rtr":"rtl","rcr":"rtc","rbr":"rtr"
        },

        /* Mouvements des stickers horizontaux associés aux faces du haut et du bas */

        'UE-right':{
            "ltl":"ftl","ltc":"ftc","ltr":"ftr","ftl":"rtl","ftc":"rtc","ftr":"rtr","rtl":"bbr",
            "rtc":"bbc","rtr":"bbl","bbr":"ltl","bbc":"ltc","bbl":"ltr","utl":"ubl","ucl":"ubc",
            "ubl":"ubr","utc":"ucl","ucc":"ucc","ubc":"ucr","utr":"utl","ucr":"utc","ubr":"utr"
        },
        'DE-right':{
            "fbl":"rbl","fbc":"rbc","fbr":"rbr","rbl":"btr","rbc":"btc","rbr":"btl","btr":"lbl",
            "btc":"lbc","btl":"lbr","lbl":"fbl","lbc":"fbc","lbr":"fbr","dtl":"dtr","dcl":"dtc",
            "dbl":"dtl","dtc":"dcr","dbc":"dcl","dtr":"dbr","dcr":"dbc","dbr":"dbl","dcc":"dcc"
        },

        /* Mouvements des stickers verticaux associés aux faces de devant et de derrière */

        'FS-right':{
            "ubl":"rtl","ubc":"rcl","ubr":"rbl","lbr":"ubl","lcr":"ubc","ltr":"ubr","dtl":"ltr",
            "dtc":"lcr","dtr":"lbr","rbl":"dtl","rcl":"dtc","rtl":"dtr","ftl":"ftr","fcl":"ftc",
            "fbl":"ftl","ftc":"fcr","fbc":"fcl","ftr":"fbr","fcr":"fbc","fbr":"fbl","fcc":"fcc"
        },
        'BS-right':{
            "utl":"rtr","utc":"rcr","utr":"rbr","rtr":"dbr","rcr":"dbc","rbr":"dbl","dbr":"lbl",
            "dbc":"lcl","dbl":"ltl","lbl":"utl","lcl":"utc","ltl":"utr","btl":"bbl","bcl":"bbc",
            "bbl":"bbr","btc":"bcl","bcc":"bcc","bbc":"bcr","btr":"btl","bcr":"btc","bbr":"btr"
        },

        /* Dans le sens antihoraire */

        /* Mouvements des stickers verticaux associés aux faces de gauche et de droite */

        'LM-left':{
            "utl":"btl","ucl":"bcl","ubl":"bbl","ftl":"utl","fcl":"ucl","fbl":"ubl","dtl":"ftl",
            "dcl":"fcl","dbl":"fbl","btl":"dtl","bcl":"dcl","bbl":"dbl","ltl":"lbl","lcl":"lbc",
            "lbl":"lbr","ltc":"lcl","lbc":"lcr","ltr":"ltl","lcr":"ltc","lbr":"ltr","lcc":"lcc"
        },
        'RM-left':{
            "utr":"btr","ucr":"bcr","ubr":"bbr","ftr":"utr","fcr":"ucr","fbr":"ubr","dtr":"ftr",
            "dcr":"fcr","dbr":"fbr","btr":"dtr","bcr":"dcr","bbr":"dbr","rtl":"rtr","rcl":"rtc",
            "rbl":"rtl","rtc":"rcr","rbc":"rcl","rtr":"rbr","rcr":"rbc","rbr":"rbl","rcc":"rcc"
        },

        /* Mouvements des stickers horizontaux associés aux faces du haut et du bas */

        'UE-left':{
            "rtl":"ftl","rtc":"ftc","rtr":"ftr","ftl":"ltl","ftc":"ltc","ftr":"ltr","ltl":"bbr",
            "ltc":"bbc","ltr":"bbl","bbr":"rtl","bbc":"rtc","bbl":"rtr","utl":"utr","ucl":"utc",
            "ubl":"utl","utc":"ucr","ubc":"ucl","utr":"ubr","ucr":"ubc","ubr":"ubl","ucc":"ucc"
        },
        'DE-left':{
            "fbl":"lbl","fbc":"lbc","fbr":"lbr","lbl":"btr","lbc":"btc","lbr":"btl","btr":"rbl",
            "btc":"rbc","btl":"rbr","rbl":"fbl","rbc":"fbc","rbr":"fbr","dtl":"dbl","dcl":"dbc",
            "dbl":"dbr","dtc":"dcl","dcc":"dcc","dbc":"dcr","dtr":"dtl","dcr":"dtc","dbr":"dtr"
        },

        /* Mouvements des stickers verticaux associés aux faces de devant et de derrière */

        'FS-left':{
            "ubl":"lbr","ubc":"lcr","ubr":"ltr","lbr":"dtr","lcr":"dtc","ltr":"dtl","dtl":"rbl",
            "dtc":"rcl","dtr":"rtl","rbl":"ubr","rcl":"ubc","rtl":"ubl","ftl":"fbl","fcl":"fbc",
            "fbl":"fbr","ftc":"fcl","fcc":"fcc","fbc":"fcr","ftr":"ftl","fcr":"ftc","fbr":"ftr"
        },
        'BS-left':{
            "rtr":"utl","rcr":"utc","rbr":"utr","dbr":"rtr","dbc":"rcr","dbl":"rbr","lbl":"dbr",
            "lcl":"dbc","ltl":"dbl","utl":"lbl","utc":"lcl","utr":"ltl","btl":"btr","bcl":"btc",
            "bbl":"btl","btc":"bcr","bbc":"bcl","btr":"bbr","bcr":"bbc","bbr":"bbl","bcc":"bcc"
        }
    }

    /*
    * Configuration initiale des couleurs des différentes faces
    */

    var INIT_CONFIG = {
        "front":"green",
        "back":"blue",
        "up":"white",
        "down":"yellow",
        "left":"orange",
        "right":"red"
    };

    /*
    * Initialisation du Rubik's Cube 
    */

    function Rubik (cfg) {
        this._init(cfg || {});
        this._bind();
        this._setInitialPosition(cfg);
    }

    Rubik.prototype = {
        _init: function (cfg) {
            this._container = Y.one(cfg.container || '#cube-container');
            this._cube = Y.one(cfg.src || '#cube');
            this._cube.moves = [];
            this._plane = Y.Node.create('<div id="plane"></div>');
            this._cube.append(this._plane);
            this._expectingTransition = false;
            this._setScroll();
        },

        /*
        * On utilise YUI afin de pouvoir intéragir avec les clics de la souris.
        */

        _bind: function () {
           this._cube.on('transitionend',this._endTransition,this);
           this._cube.on('webkitTransitionEnd',this._endTransition,this);
           this._container.on('gesturemovestart',this._onTouchCube,{preventDefault:true},this);
           this._container.on('gesturemove',this._onMoveCube,{preventDefault:true},this);
           this._container.on('gesturemoveend',this._onEndCube,{preventDefault:true},this);
           this._container.on('gesturestart',this._multiTouchStart,this);
           this._container.on('gesturechange',this._multiTouchMove,this);
           this._container.on('gestureend',this._multiTouchEnd,this);
           Y.one('body').on('gesturemovestart',this._checkScroll,{},this);
        },

        _setScroll: function (evt) {
            self = this;
            setTimeout(function () {
                window.scrollTo(0,1);
            },1);
        },

        _setInitialPosition: function (cfg) {
            this._setInitialColors();
            var pos = cfg && cfg.position || {x: 28, y: -28 };
            this._cube.setStyle('transform','rotateX('+ pos.y + 'deg) rotateY(' +pos.x + 'deg)');
            this._cubeXY = pos;
            this._tempXY = pos;
        },

        _setInitialColors: function (){
            for(var face in INIT_CONFIG){
                Y.all('.' +face + ' > div').addClass(INIT_CONFIG[face]);
            }
        },

        _endTransition: function (evt) {
            if (this._expectingTransition){
                evt.halt();
                this._plane.set('className',"");
                this._reorganizeCubies();
                this._detachToPlane();
                this._moving = false;
                this._expectingTransition = false;
            }
        },

        /*
        * Maintenant que nous avons l'intéraction de la souris avec le cube,
        * il faut sauvegarder la position. 
        */

        _onTouchCube:function (evt) {
            evt.halt();
            this._tempCubie = evt.target.ancestor('.cubie');
            this._startX = evt.clientX;
            this._startY = evt.clientY;
            this._deltaX = 0;
            this._deltaY = 0;
        },

        /*
        * Si l'on fait bouger la souris pendant que l'on clique,
        * il faut la rotation du cube.
        * Nous devons donc ajouter une certaine logique dû à la souris.
        * Ainsi, si on clique ou on effectue un geste, cette fonction se déclenche. 
        */

        _onMoveCube:function (evt) {
            evt.halt();
            var deltaX = this._deltaX = ((evt.clientX - this._startX)/1.2),
            deltaY = this._deltaY = ((evt.clientY - this._startY)/1.2),
            x = this._cubeXY.x + deltaX;
            y = this._cubeXY.y - deltaY;
            if (this._gesture){
                this._tempXY = {x: x, y:y};
                this._moved = true;
                this._cube.setStyle('transform','rotateX('+ y  + 'deg) rotateY(' + x + 'deg)');
                Y.one('#log > p').setContent("Moved:" + Math.floor(y) +' , ' + Math.floor(x) );
            }
            else{
                this._moved = false;
            }
        },

        /*
        * C'est ici que l'on regarde les mouvements que fait l'utilisateur (le sens, ...).
        * All magic happen here. Check how the user flick his finger, in which side...
        * On travaille sur une projection 2D du cube avant de le retransformer en 3D.
        */

        _onEndCube:function (evt) {
            if (this._disabledFLick || this._gesture || this._moved || !this._tempCubie) {
                this._gesture = false;
                this._moved = false;
                return;
            }
            evt.halt();
            if (!this._deltaX && !this._deltaY)return; // Si delta est nul, pas de mouvement.
            this._tempXY = {x: this._tempXY.x % 360, y: this._tempXY.y % 360 };
            var threshold = 70,
                movement,swap,
                rotateX = this._deltaX > 0 ? "right" :"left",
                rotateXInverted = rotateX == "right" ? "left": "right",
                deg = Math.abs(this._tempXY.x),
                rotateY = this._deltaY > 0 ? "right" : "left",
                rotateYInverted = rotateY == "right" ? "left": "right",
                rotateBoth = Math.abs(this._deltaX) > threshold && Math.abs(this._deltaY) > threshold;
                mHorizontal = Math.abs(this._deltaX) > Math.abs(this._deltaY),
                parts = this._tempCubie.get('className').split(' ');
                this._expectingTransition = true;
             /* 
             * Nous devons faire la conversion entre les mouvements de la souris et ceux du cube 
             * Cela implique une transformation 2D -> 3D 
             */
            switch(true){
                // Mouvements E:
                case parts[2] != "up" && parts[2] != "down" && mHorizontal:
                    movement = {face: parts[4].charAt(0),slice: parts[4].charAt(1),rotate: rotateX};
                    break;
                case (parts[2] == "up" || parts[2] == "down") && mHorizontal && deg>= -45 &&  deg<45:
                    if (parts[2] == "down"){swap = rotateX; rotateX = rotateXInverted; rotateXInverted = swap;}
                    movement = {face: parts[5].charAt(0),slice: parts[5].charAt(1),rotate: rotateX};
                    break;
                case (parts[2] == "up" || parts[2] == "down") && mHorizontal && deg>= 45 &&  deg< 135:
                    if (parts[2] == "down"){swap = rotateX; rotateX = rotateXInverted; rotateXInverted = swap;}
                    movement = {face: parts[3].charAt(0),slice: parts[3].charAt(1),rotate: this._tempXY.x < 0 ? rotateXInverted: rotateX};
                    break;             
                case (parts[2] == "up" || parts[2] == "down") && mHorizontal && deg>= 135 && deg < 225:
                    if (parts[2] == "down"){swap = rotateX; rotateX = rotateXInverted; rotateXInverted = swap;}
                    movement = {face: parts[5].charAt(0),slice: parts[5].charAt(1),rotate: rotateXInverted};
                    break;
                case (parts[2] == "up" || parts[2] == "down") && mHorizontal && deg>= 225 && deg < 315:
                    if (parts[2] == "down"){swap = rotateX; rotateX = rotateXInverted; rotateXInverted = swap;}
                    movement = {face: parts[3].charAt(0),slice: parts[3].charAt(1),rotate: this._tempXY.x < 0 ?rotateX: rotateXInverted};
                    break;
                //Mouvements M:
                case (parts[2] == "front" || parts[2] == "back") && !mHorizontal:
                    if (parts[2] == "back"){swap = rotateY; rotateY = rotateYInverted; rotateYInverted = swap;}
                    movement = {face: parts[3].charAt(0),slice: parts[3].charAt(1),rotate: rotateY};
                    break;
                case (parts[2] == "right" || parts[2] == "left") && !mHorizontal:
                    if (parts[2] == "left"){swap = rotateY; rotateY = rotateYInverted; rotateYInverted = swap;}
                    movement = {face: parts[5].charAt(0),slice: parts[5].charAt(1),rotate: rotateY};
                    break;
                case (parts[2] == "up" || parts[2] == "down") && !mHorizontal && deg>= -45 &&  deg<45:
                    movement = {face: parts[3].charAt(0),slice: parts[3].charAt(1),rotate: rotateY};
                    break;
                case (parts[2] == "up" || parts[2] == "down") && !mHorizontal && deg>= 45 &&  deg<135:
                    movement = {face: parts[5].charAt(0),slice: parts[5].charAt(1),rotate: rotateYInverted};
                    break;
                case (parts[2] == "up" || parts[2] == "down") && !mHorizontal && deg>= 135 &&  deg<225:
                    movement = {face: parts[3].charAt(0),slice: parts[3].charAt(1),rotate: rotateYInverted};
                    break;
                case (parts[2] == "up" || parts[2] == "down") && !mHorizontal && deg>= 225 &&  deg<315:
                    movement = {face: parts[5].charAt(0),slice: parts[5].charAt(1),rotate: rotateY};
                    break;
                default: break;
             }
            if (movement)
                this._doMovement(movement);
        },

        _multiTouchStart:function (evt) {
            evt.halt();
            this._startX = evt.clientX || evt.pageX;
            this._startY = evt.clientY || evt.pageY;
            this._gesture = true;
        },

        _multiTouchMove:function (evt) {
            if (this._portrait || !this._enableRotation)return;
            evt.clientX = evt.pageX;
            evt.clientY = evt.pageY;
            this._onMoveCube(evt);
        },

        _multiTouchEnd:function (evt) {
            this._gesture = false;
            evt.halt();
            this._cubeXY.x = this._tempXY.x;
            this._cubeXY.y = this._tempXY.y;
        },

        _doMovement:function (m,fromQueue) {
            if (this._moving)return;
            var plane = this._plane,
                list = Y.all('.' + m.face + m.slice);
            this._movement = m;
            this._moving = true;
            this._attachToPlane(list);
            plane.addClass('moving').addClass(m.slice +'-'+ m.rotate);
            this._cube.moves.push(m);
        },

                /*
        * La fonction suivante effectue une première optimisation simple des mouvements entrés par l'utilisateur
        */
       
        _optimizeMoves:function (){
            //moves_updated = this._greaterOptimizeMoves();
            //this._cube.moves.length = 0;
            //this._cube.moves = moves_updated;
            for (i=0; i<this._cube.moves.length; i++){
                
                if (i+2 < this._cube.moves.length){ // Pour vérifier qu'on ne sort pas de la liste
                    if ((this._cube.moves[i].face == this._cube.moves[i+1].face) && (this._cube.moves[i].face == this._cube.moves[i+2].face) && (this._cube.moves[i].slice == this._cube.moves[i+1].slice) && (this._cube.moves[i].slice == this._cube.moves[i+2].slice) && (this._cube.moves[i].rotate == this._cube.moves[i+1].rotate) && (this._cube.moves[i].rotate == this._cube.moves[i+2].rotate)){ 
                        this._cube.moves.splice(i+1,2);
                        if(this._cube.moves[i].rotate == "left"){
                            this._cube.moves[i].rotate = "right";
                        }
                        else{
                            this._cube.moves[i].rotate = "left";
                        }
                    }
                }
                
                if (i+1 < this._cube.moves.length){ // Pour vérifier qu'on ne sort pas de la liste
                    if ((this._cube.moves[i].face == this._cube.moves[i+1].face) && (this._cube.moves[i].slice == this._cube.moves[i+1].slice) && (this._cube.moves[i].rotate != this._cube.moves[i+1].rotate)) {
                        this._cube.moves.splice(i,2);
                    }
                }
            }
        },
        
        /*_greaterOptimizeMoves:function (){
            moves_updated = [];
            for (j=0; j<this._cube.moves.length; j++){
                let pas = 1;
                let compteurR = 0;
                let compteurL = 0;
                let compteurF = 0;
                let compteurB = 0;
                let compteurU = 0;
                let compteurD = 0;
                // Slice M
                if (this._cube.moves[j].slice == "M"){
                    while ((j+pas-1 < this._cube.moves.length) && (this._cube.moves[j+pas-1].slice == "M")){
                        if(this._cube.moves[j+pas-1].face == "L"){
                            if(this._cube.moves[j+pas-1].rotate == "right"){
                                compteurL += 1;
                            }
                            else{
                                compteurL -= 1;
                            }
                        }
                        else if (this._cube.moves[j+pas-1].face == "R"){
                            if(this._cube.moves[j+pas-1].rotate == "right"){
                                compteurR += 1;
                            }
                            else{
                                compteurR -= 1;
                            }
                        }
                        pas += 1;
                    compteurL = compteurL%4;
                    compteurR = compteurR%4;
                    }
                    if (compteurL > 0){
                        for (k=0; k<compteurL; k++){
                            moves_updated.push({face:"L", slice:"M", rotate:"right"});
                        }
                    }
                    else {
                        for (k=0; k>compteurL; k--){
                            moves_updated.push({face:"L", slice:"M", rotate:"left"});
                        }
                    }
                    if (compteurR > 0){
                        for (k=0; k<compteurR; k++){
                            moves_updated.push({face:"R", slice:"M", rotate:"right"});
                        }
                    }
                    else {
                        for (k=0; k>compteurR; k--){
                            moves_updated.push({face:"R", slice:"M", rotate:"left"});
                        }
                    }
                }

                // Slice S
                else if (this._cube.moves[j].slice == "S"){
                    while ((j+pas-1 < this._cube.moves.length) && (this._cube.moves[j+pas-1].slice == "S")){
                        if(this._cube.moves[j+pas-1].face == "F"){
                            if(this._cube.moves[j+pas-1].rotate == "right"){
                                compteurF += 1;
                            }
                            else{
                                compteurF -= 1;
                            }
                        }
                        else if (this._cube.moves[j+pas-1].face == "B"){
                            if(this._cube.moves[j+pas-1].rotate == "right"){
                                compteurB += 1;
                            }
                            else{
                                compteurB -= 1;
                            }
                        }
                        pas += 1;
                    compteurF = compteurF%4;
                    compteurB = compteurB%4;
                    }
                    if (compteurF > 0){
                        for (k=0; k<compteurF; k++){
                            moves_updated.push({face:"F", slice:"S", rotate:"right"});
                        }
                    }
                    else {
                        for (k=0; k>compteurF; k--){
                            moves_updated.push({face:"F", slice:"S", rotate:"left"});
                        }
                    }
                    if (compteurB > 0){
                        for (k=0; k<compteurB; k++){
                            moves_updated.push({face:"B", slice:"S", rotate:"right"});
                        }
                    }
                    else {
                        for (k=0; k>compteurB; k--){
                            moves_updated.push({face:"B", slice:"S", rotate:"left"});
                        }
                    }
                }
                // Slice E
                else if (this._cube.moves[j].slice == "E"){
                    while ((j+pas-1 < this._cube.moves.length) && (this._cube.moves[j+pas-1].slice == "E")){
                        if(this._cube.moves[j+pas-1].face == "U"){
                            if(this._cube.moves[j+pas-1].rotate == "right"){
                                compteurU += 1;
                            }
                            else{
                                compteurU -= 1;
                            }
                        }
                        else if (this._cube.moves[j+pas-1].face == "D"){
                            if(this._cube.moves[j+pas-1].rotate == "right"){
                                compteurD += 1;
                            }
                            else{
                                compteurD -= 1;
                            }
                        }
                        pas += 1;
                    compteurU = compteurU%4;
                    compteurD = compteurD%4;
                    }
                    if (compteurU > 0){
                        for (k=0; k<compteurU; k++){
                            moves_updated.push({face:"U", slice:"E", rotate:"right"});
                        }
                    }
                    else {
                        for (k=0; k>compteurU; k--){
                            moves_updated.push({face:"U", slice:"E", rotate:"left"});
                        }
                    }
                    if (compteurD > 0){
                        for (k=0; k<compteurD; k++){
                            moves_updated.push({face:"D", slice:"E", rotate:"right"});
                        }
                    }
                    else {
                        for (k=0; k>compteurD; k--){
                            moves_updated.push({face:"D", slice:"E", rotate:"left"});
                        }
                    }
                }
                j += pas;
                console.log("compteurR" + compteurR%4);
                console.log("compteurL" + compteurL%4);
                console.log("compteurF" + compteurF%4);
                console.log("compteurB" + compteurB%4);
                console.log("compteurU" + compteurU%4);
                console.log("compteurD" + compteurD%4);
            }
            console.log("moves_updated" + moves_updated.length);
            return moves_updated;
        },*/

        _resolve:function () {
            document.getElementById("resolution").textContent = "In progress...";
            cube._optimizeMoves();
            console.log(this._cube.moves);
            if (this._cube.moves.length != 0) {
                var move = this._cube.moves.pop();
                /*
                * Pour la résolution, nous effectuons les mouvements inverses de ceux entrés par l'utilisateur
                */
                if (move.rotate == "left"){
                    move.rotate = "right";
                }
                else {
                    move.rotate = "left";
                }
                cube._doMovement(move);
                //this._moving = false;
                this._cube.moves.pop();
                //this._moving = true;
                this._expectingTransition = true;
                console.log(this._cube.moves);
            }
            else {
                console.log("Déjà résolu !");
                document.getElementById("resolution").textContent = "Solved";
                this._moving = false;
                this._expectingTransition = true;
            }
        },

        _attachToPlane:function (list) {
            this._plane.setContent(list);
        },

        _detachToPlane:function () {
            var children = this._plane.get('children');
            this._cube.append(children);
        },

        _reorganizeCubies:function () {
            var m = this._movement,
                changes = CUBIE_MOVEMENTS[m.face + m.slice +'-' +m.rotate],
                list = this._plane.get('children'),
                tempCubies = {};
                list.each(function (originCube,i) {
                    if (originCube.hasClass('face'))return;
                    // on récupère la classe et la position du cubie
                    var originCubeClass = originCube.get('className'),
                        cubePos = (originCubeClass.split(' ',1))[0];
                    // on garde la position originale et la classe 
                    tempCubies[cubePos] = originCubeClass; 
                    // on essaie d'échanger les positions 
                    var destCube = Y.one('.' + changes[cubePos]);
                    // si on n'y arrive pas, on a déjà fait l'échange. On doit alors récupérer le css original de la classe.
                    var destCubeClass = destCube? destCube.get('className'): tempCubies[changes[cubePos]],
                        cubePosDes = destCubeClass.split(' ',1)[0];
                    // on échange les cubies
                    originCube.set('className', cubePosDes + destCubeClass.substr(3));
                });
        },

        _initLandscape:function () {
            var transformIn = {opacity: 1,duration:2},
                css = {display: 'block'};
            this._cube.transition(transformIn);
        },

        run:function () {
                this._initLandscape();
        }
    };

Y.Rubik = Rubik;

},"0.0.1",{

    requires:['yui-later','node','transition','event','event-delegate','event-gestures']

});