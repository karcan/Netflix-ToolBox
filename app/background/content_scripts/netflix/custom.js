let ntb_ui;
ntb_ui = {
    init: () => {
    
        netflixToolBox.on("movie:start", data => {

            // DURATION NAME
            if(netflixToolBox.userConfig.duration.isActive){
                ntb_ui.elements.durationName = ntb_ui.movieTitleElement(data.api, "duration");
                !$('.ntb-movie-title.duration-name')[0] || $('.ntb-movie-title.duration-name').remove();
                $('.PlayerControlsNeo__layout').append(ntb_ui.elements.durationName);
    
                setTimeout(()=>{
                    $('.ntb-movie-title.duration-name').remove();
                }, /* TODO seçeneklerden gelen süre */ netflixToolBox.userConfig.duration.second * 1000);
            }
            
            // MINI NAME
            if(netflixToolBox.userConfig.mini.isActive){
                ntb_ui.elements.miniName = ntb_ui.movieTitleElement(data.api, "mini");
                !$('.ntb-movie-title.mini-name')[0] || $('.ntb-movie-title.mini-name').remove();
                $('.PlayerControlsNeo__layout').append(ntb_ui.elements.miniName);
            }

            // FIXED VOLUME
            if(netflixToolBox.userConfig.volume.isActive){
                data.player.setVolume(netflixToolBox.userConfig.volume.level);
            }

        });

        netflixToolBox.on("movie:change", function (d) {
            console.log("movie change event 1", d);
        });

        netflixToolBox.on("movie:running", function (d) {

            if(netflixToolBox.userConfig.skip.isActive){
                // credit / intro
                if(netflixToolBox.userConfig.skip.credit){
                    if (d.data.currentTime >= d.data.credit.start && d.data.currentTime <= d.data.credit.end) {
                        d.player.seek(d.data.credit.end);
                        console.log("catch credit");
                    }
                }

                // recap / özet
                if(netflixToolBox.userConfig.skip.recap){
                    if (d.data.currentTime >= d.data.recap.start && d.data.currentTime <= d.data.recap.end) {
                        d.player.seek(d.data.recap.end);
                        console.log("catch recap");
                    }
                }
            }

        })
    },
    elements: {},
    movieTitleElement: (callback, type) => {
        let movieName;
        let config = netflixToolBox.userConfig;
        if (callback.movieType == "movie") {
            movieName = callback.movieTitle;
        } else if (callback.movieType == "show") {
            let temp = [];
            if(type == "duration"){
                if(config.duration.showMovieName)
                    temp.push(callback.movieTitle);

                if(config.duration.showSeasonEpisodeName)
                    temp.push(callback.episodeTemplate
                    .replace("{SEASON_TITLE}", callback.seasonTitle)
                    .replace("{EPISODE_NUMBER}", callback.episodeNum));
                movieName = temp.join("\n");
                
            }else if(type == "mini"){
                if(config.mini.showMovieName)
                temp.push(callback.movieTitle);

                if(config.mini.showSeasonEpisodeName)
                    temp.push(callback.episodeTemplate
                    .replace("{SEASON_TITLE}", callback.seasonTitle)
                    .replace("{EPISODE_NUMBER}", callback.episodeNum));
                movieName = temp.join("\n");
            }
            

        }
        let el = $("<div/>")
            .addClass("ntb-movie-title")
            .addClass(type + "-name")
            .append(
                $("<span/>").text(movieName)
            );

        if(type == "duration")
            $(el)
            .addClass(config.duration.fontSize)
            .attr("style", "opacity:" + config.duration.opacity);
        else if (type == "mini"){
            $(el)
            .addClass(config.mini.fontSize)
            .addClass(config.mini.textPosition)
            .attr("style", "opacity:" + config.mini.opacity);
        }

        return el[0];
    },

};

ntb_ui.init();
