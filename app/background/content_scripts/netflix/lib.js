class netflixToolBox {
    // default config
    static configDefault = {
        api : {requestStart : false},
        player : {},
        elements : {
            episodeName : {dom : null , css : {}},
            miniEpisodeName : {dom : null , css : {}},
            jumpTo : {dom : null , css : {}}
        },
        intervals : [],
        events : {
            keyPress : {ShiftLeft : false, ControlLeft : false, AltLeft : false, ArrowUp : false, ArrowDown : false, ArrowLeft : false, ArrowRight : false, KeyN : false , KeyM : false}, "movie:start":[],"movie:change":[],"movie:running":[],"movie:iddle":[]
        }
        
    };
    static config = JSON.parse(JSON.stringify(this.configDefault));
    static loads = {
        player : false
    };
    static on(e,c){
        if(typeof netflixToolBox.configDefault.events[e] != "object")
            throw new Error(e + " event not found");
        else if(typeof c != "function")
            throw new Error (c + " is not a function");
        
            netflixToolBox.configDefault.events[e].push(c);
    };
    static userConfig = {};
    // check variables is ready for player ?
    static loadCheck = function() {
        if (typeof netflix == "undefined")
            return false;
        else if (!netflix.hasOwnProperty("appContext"))
            return false;
        else if (!netflix.appContext.hasOwnProperty("state"))
            return false;
        else if (!netflix.appContext.state.hasOwnProperty("playerApp"))
            return false;
        else if (!netflix.appContext.state.playerApp.hasOwnProperty("getAPI") && typeof netflix.appContext.state.playerApp.getAPI != "function")
            return false;
        else if (!netflix.appContext.state.playerApp.getAPI().hasOwnProperty("videoPlayer"))
            return false;
        else if (!netflix.appContext.state.playerApp.getAPI().videoPlayer.hasOwnProperty("getVideoPlayerBySessionId"))
            return false;
        else if (!netflix.appContext.state.playerApp.getAPI().videoPlayer.hasOwnProperty("getAllPlayerSessionIds"))
            return false;
        else if (typeof netflix.appContext.state.playerApp.getAPI().videoPlayer.getVideoPlayerBySessionId(netflix.appContext.state.playerApp.getAPI().videoPlayer.getAllPlayerSessionIds().filter(i => i.indexOf("watch") != -1)) != "object")
            return false;
        else if (!netflix.appContext.state.playerApp.getAPI().videoPlayer.getVideoPlayerBySessionId(netflix.appContext.state.playerApp.getAPI().videoPlayer.getAllPlayerSessionIds().filter(i => i.indexOf("watch") != -1)).hasOwnProperty("loaded"))
            return false;

        else
            return true;
    }
    // logger for console
    static logger = function(type, text){
        var choice = {
            error : "#CE352C",
            warning : "#F0A30A",
            info : "#00AFF0",
            success : "#60A917"
        }
        var a = new Date();
        a = a.toLocaleTimeString();
        console.log('%c[Netflix ToolBox] : %c' + text +' %c    ' + a,'font-weight:bold;font-family:Tahoma;color:' + choice[type] +';font-size:18px','font-family:Tahoma;font-size:18px','font-family:Tahoma;font-size:10px');
    }
    // load player & config
    static loadPlayer(calllback){
        var cll = calllback;
        // remove Intervals before created.
        $.each(netflixToolBox.config.intervals, function(k,v){
            clearInterval(v);
            var index = netflixToolBox.config.intervals.indexOf(v);
            netflixToolBox.config.intervals.splice(index,1);
        });

        this.loadPlayerTimer = setInterval(()=>{
            if(!netflixToolBox.loads.player){

                netflixToolBox.config.events = netflixToolBox.configDefault.events;

                if (!netflixToolBox.loadCheck())
                    return false;

                netflixToolBox.config.player.videoPlayer = netflix.appContext.state.playerApp.getAPI().videoPlayer;
                netflixToolBox.config.player.player = netflixToolBox.config.player.videoPlayer.getVideoPlayerBySessionId(netflix.appContext.state.playerApp.getAPI().videoPlayer.getAllPlayerSessionIds().filter(i => i.indexOf("watch") != -1));
                netflixToolBox.config.api.episodeTemplate = netflix.reactContext.models.i18nStrings.data["player/player"]["paused.season.episode.title"];
                netflixToolBox.config.api.watchId = netflix.appContext.state.prevRouteHandler.params.id;
                netflixToolBox.config.api.url = netflix.reactContext.models.playerModel.data.config.ui.initParams.apiUrl;
                netflixToolBox.config.api.path = "/metadata?webp=true&movieid=" + netflixToolBox.config.api.watchId + "&imageFormat=webp";

                // if ready for api call, do it :)
                if (typeof netflixToolBox.config.api.response == "undefined" && !netflixToolBox.config.api.requestStart){
                    netflixToolBox.config.api.requestStart = true;
                    netflixToolBox.logger('info','API calling for movie details.');

                    $.post(netflixToolBox.config.api.url + netflixToolBox.config.api.path , ()=>{

                    }).done((response)=>{

                        netflixToolBox.config.api.response = response;
                        netflixToolBox.config.api.movieType = netflixToolBox.config.api.response.video.type;
                        netflixToolBox.config.api.movieTitle = netflixToolBox.config.api.response.video.title;
                        netflixToolBox.config.api.skipMarkers = response.video.skipMarkers;

                        if(netflixToolBox.config.api.movieType == "show"){
                            $.each(netflixToolBox.config.api.response.video.seasons, (k,v) => {
                                $.each(v.episodes, (k2,v2) => {
                                    if(v2.id === netflixToolBox.config.api.response.video.currentEpisode){
                                        netflixToolBox.config.api.seasonTitle = v.title;

                                        netflixToolBox.config.api.episodeTitle = netflixToolBox.config.api.episodeTemplate.replace('{EPISODE_NUMBER}',v2.seq).replace('{SEASON_TITLE}','').replace(":","").trim();

                                        netflixToolBox.config.api.episodeNum = v2.seq;
                                    }
                                });
                            });
                        }

                        // finish api call
                        netflixToolBox.logger('info','API has been successfully called and details of the movie are retrieved.');

                        /*netflixToolBox.logger('info','Movie Name : [' + netflixToolBox.config.api.movieTitle + ' | ' + netflixToolBox.config.api.seasonTitle + ' : ' + netflixToolBox.config.api.episodeTitle + '] , Movie Type : ' + netflixToolBox.config.api.movieType);*/
                    });


                }

                // when everything is ready
                if (netflixToolBox.config.player.player.loaded
                    && document.getElementsByClassName("PlayerControlsNeo__layout").length > 0
                    && netflixToolBox.config.player.player.isReady()){
                    netflixToolBox.loads.player = true;
                    clearInterval(this.loadPlayerTimer);

                    netflixToolBox.logger('success','Player loaded.');
                    var q = setInterval(()=>{
                        if(netflixToolBox.config.api.movieType){
                            $.each(netflixToolBox.config.events["movie:start"],function(k,v){
                                v({player : netflixToolBox.config.player.player, api : netflixToolBox.config.api});
                            });

                            netflixToolBox.config.intervals.push(setInterval(function(a){
                                $.each(netflixToolBox.config.events["movie:running"],function(k,v){
                                    if(netflixToolBox.config.player.player.isPlaying()){
                                        //if(netflixToolBox.config.api.skipMarkers){
                                            v({player : netflixToolBox.config.player.player , data : {currentTime : netflixToolBox.config.player.player.getCurrentTime(), credit : netflixToolBox.config.api.skipMarkers.credit, recap : netflixToolBox.config.api.skipMarkers.recap}}); 
                                        //}
                                    }
                                });
                            },100));
                            
                            clearInterval(q);
                        }
                    },10);
                    

                    

                    // player status check
                    // this codes that will always work when everything is done
                    // create a new Interval.
                    netflixToolBox.config.intervals.push(setInterval(function(a){
                        // player status check;
                        if(!netflixToolBox.loadCheck()){
                            return;
                        }

                        if((netflixToolBox.config.player.player.isPlaying() == true || netflixToolBox.config.player.player.isPlaying() == false)
                            && netflixToolBox.config.player.lastStatus != netflixToolBox.config.player.player.isPlaying()){

                            netflixToolBox.logger("warning",((netflixToolBox.config.player.player.isPlaying()) ? "Playing now." : "Player paused."));

                            netflixToolBox.config.player.lastStatus = netflixToolBox.config.player.player.isPlaying();

                        }
                    },100));

                    // set configDefaults new interval if episode changes so that it can be delete.
                    netflixToolBox.configDefault.intervals = netflixToolBox.config.intervals;

                    // fix to clear for next episode & return to movie from browse.
                    $(window).unbind("keydown");
                    $(window).unbind("keyup");

                    // store key press for key events.
                    $(window).keydown(function(e){
                        var code = e.originalEvent.code;
                        if(netflixToolBox.config.events.keyPress.hasOwnProperty(code)){
                            netflixToolBox.config.events.keyPress[code] = true;

                            // execute custom events on custom.js
                            if(netflixToolBox.config.events.hasOwnProperty("keyEvents")){
                                $.each(netflixToolBox.config.events.keyEvents, function(k,v){
                                    if(typeof v == "function"){
                                        v(netflixToolBox.config.events.keyPress);
                                    }
                                });
                            }
                        }
                    });

                    // if key up then remove key from store
                    $(window).keyup(function(e){
                        var code = e.originalEvent.code;
                        if(netflixToolBox.config.events.keyPress.hasOwnProperty(code)){
                            netflixToolBox.config.events.keyPress[code] = false;
                        }
                    });

                    if(cll && typeof cll == "function"){
                        cll();
                    }

                    return true;



                }
            }else{
                clearInterval(this.loadPlayerTimer);
                netflixToolBox.logger('success','Player loaded.');
                calllback();
                return true;
            }
        },100);
    }
    // program main.
    static main = function(){
        netflixToolBox.logger('info','New movie detected. Attempting player load.');
        netflixToolBox.loadPlayer(function(){
            netflixToolBox.config.api.lastPath = location.pathname;

            setInterval(()=>{
            let clause = {
                reInject : false,
                status : null
            };

                // returning to home page from movie.
                if(location.pathname.indexOf("watch") == -1 && location.pathname != netflixToolBox.config.api.lastPath){

                    if(location.pathname.indexOf("browse") != -1){
                        netflixToolBox.logger('warning','Returning to browse page..');
                        clause.status = "browse";
                        clause.reInject = true;
                    }else if(location.pathname.indexOf("/search") != -1){
                        netflixToolBox.logger('warning','You are on the search page.');
                        clause.status = "search";
                        clause.reInject = true;
                    }


                } // returning to movie from home page.
                else if (location.pathname.indexOf("watch") === 1
                    && netflixToolBox.config.api.lastPath.indexOf("watch") == -1
                    && location.pathname != netflixToolBox.config.api.lastPath){
                    netflixToolBox.logger('info','Yay! , you picked a movie...');
                    clause.status = "picked";
                    clause.reInject = true;
                }

                else if (!netflixToolBox.loadCheck())
                    return;

                else if (netflixToolBox.loads.player && netflixToolBox.config.api.lastPath != location.pathname){

                    netflixToolBox.logger('info','Episode changing detected. Attempting player re-load.');
                    clause.status = "change";
                    clause.reInject = true;

                    $.each(netflixToolBox.config.events["movie:change"],function(k,v){
                        v({currentTime : netflixToolBox.config.player.player.getCurrentTime()});
                    });
                }
                else if(netflixToolBox.loads.player
                    && !netflix.appContext.state.playerApp.getAPI().videoPlayer.getVideoPlayerBySessionId(netflix.appContext.state.playerApp.getAPI().videoPlayer.getAllPlayerSessionIds().filter(i => i.indexOf("watch") != -1)).isReady()
                    && netflix.appContext.state.playerApp.getAPI().videoPlayer.getVideoPlayerBySessionId(netflix.appContext.state.playerApp.getAPI().videoPlayer.getAllPlayerSessionIds().filter(i => i.indexOf("watch") != -1)).isLoading()
                ){
                    netflixToolBox.logger('info','Player idle detected. Attempting player re-load.');
                    clause.status = "idle";
                    clause.reInject = true;
                }

                if (clause.reInject){

                    netflixToolBox.config.intervals.map((a)=>{
                        clearInterval(a);
                        netflixToolBox.config.intervals = [];
                    });

                    netflixToolBox.config = JSON.parse(JSON.stringify(netflixToolBox.configDefault));
                    netflixToolBox.loads.player = false;
                    netflixToolBox.config.api.lastPath = location.pathname;

                    if(clause.status == "browse" || clause.status == "search"){
                        
                    }
                    else{
                        netflixToolBox.loadPlayer();
                    }

                    return;
                }

            },10);
        });


    }
}
netflixToolBox.logger("info","Library is injected.");
netflixToolBox.main();
