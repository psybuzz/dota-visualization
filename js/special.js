//special.js

psy = {
	image: function(query, callback, number){
		number = number || 1;
		$.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?",
			{
				tags: query, tagmode: "any", format: "json"
			},
			function(data) {
				var images = data.items.map(function (item){
					return item.media.m;
				}).slice(0, number);
				return callback(images);
			});
	},
	imageBox: function(query, callback, number){
		number = number || 1;
		$.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?",
			{
				tags: query, tagmode: "any", format: "json"
			},
			function(data) {
				var boxes = data.items.map(function (item){
					var newBox = document.createElement('div');
					newBox.style.backgroundImage = "url(" + item.media.m + ")";
					return newBox;
				}).slice(0, number);
				return callback(boxes);
			});
	},
	loadImage: function(query, container){
		$.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?",
			{ tags: query, tagmode: "any", format: "json" },
			function(data) {
				//container must be selectified
				container.css("backgroundImage", "url(" + data.items[0].media.m + ")");
			});
	},
	colorPalette: function(variety){
		variety = variety || 100;
		$.getJSON("http://www.colourlovers.com/api/palettes/top&jsonCallback=?&numResults=" + variety.toString(),
			{
				format: "jsonp"
			},
			function(data) {
				var colors = data[Math.floor(Math.random()*variety)].colors;
				for (var c=0; c < colors.length; c++){
					var tid = (c+1);
					$('#t' + tid).css('background-color', '#'+colors[c]);
				}
			});
	},
	youtube: function(query){		//please fix
		var content = "<div class='sourceBlock' onClick=\"$(\'#youtube\').toggle(\'fast\')\">YouTube</div><div id='youtube'>";
		$.getJSON("https://gdata.youtube.com/feeds/api/videos?q=" + encodeURIComponent($('#wolfram').val()) + "&max-results=12&v=2&alt=json&callback=?",null,
		function(data){
			console.log(data);
			cv = data;
			if (typeof data.feed.entry != "undefined"){
				videos = data.feed.entry;
				content += "<table><tr>";
				var cols = 0;
				for (v in videos){
					content += "<td>";
					content += "<br><a href=\'" + videos[v].link[0].href + "\'><img src=\'" + videos[v].media$group.media$thumbnail[0].url + "\'><br>" + videos[v].title.$t + "</a><br>";
					content += "</td>";
					
					cols++;
					if (cols%6 == 0){		//limits the videos per row to 6
						cols = 0;
						content += "</tr><tr>";
					}
				}
				content += "</tr></table></div>";
				document.getElementById('wolfResult').innerHTML += content;
			}
			
			if (nextFn != null)
				nextFn();
		});
	},
	twitter: function(query){
		var content = "<div class='sourceBlock' onclick=\"$(\'#twitter\').toggle(\'fast\')\">Twitter</div><div id='twitter'>";
		$.getJSON("http://search.twitter.com/search.json?q=" + encodeURIComponent($('#wolfram').val()) + "&callback=?",null,
		function(data){
			for (a in data['results']){
				content += (data['results'][a]['text']) + "<br>";
			}
			content += "</div>";
			document.getElementById('wolfResult').innerHTML += content;
		});
	},
	edit: function(element){
		$(element).attr('contentEditable', !$(element).attr('contentEditable'));
	},
	fadeCover: function(duration, color){
		duration = duration || "slow";
		color = color || 'black';
		var sheet = ($('#sheet').length == 0) ? document.createElement('div') : $('#sheet');
		$(sheet).css('position', 'fixed').css('width', window.innerWidth).css('height', window.innerHeight).css('top', 0).css('left', 0).css('backgroundColor', color).attr('id', 'sheet');

		$('body').append(sheet);
		$(sheet).hide().fadeIn(duration);
		return this;
	},
	fadeReveal: function(duration, color){
		duration = duration || "slow";
		color = color || 'black';
		var sheet = ($('#sheet').length == 0) ? document.createElement('div') : $('#sheet');
		$(sheet).css('position', 'fixed').css('width', window.innerWidth).css('height', window.innerHeight).css('top', 0).css('left', 0).css('backgroundColor', color).attr('id', 'sheet');

		$('body').append(sheet);
		$(sheet).show().fadeOut(duration);
		return this;
	},
	enableZoom: function(duration, width){
		var duration = duration || 300;
		var outside = false;
		var width = width || 70;
		$('body').css('margin', 0).css('border', '0px solid gainsboro');
		$(document).on('keyup',function(e){
			//add some && this.zoomenabled or something, to allow disableZoom
			if (e.keyCode == 32){
				if ( outside == false ){
					$("body").animate({borderWidth:'+='+width}, duration);
					$(".inside").toggleClass("framed");
					outside = true;
				} else {
					$("body").animate({borderWidth:'-='+width}, duration, function(){
						$(".inside").toggleClass("framed");
					});
					outside = false;
				}

			}
		});
		return this;
	},
	gradian: function(el, radial){
		radial = (el == true || el == false) ? el : (typeof radial == 'undefined') ? false : radial;
		el = (typeof el == 'undefined') ? $('body') : (el == true || el == false) ? $('body') : el;

		//gradian info
		var g = new Array();
		g.push(Math.floor(Math.random()*360));
		for (var i=0; i<6; i++)
			g.push(Math.floor(Math.random()*255));
		
		//animate
		animate();
		var a = 1;	//alpha value
		function animate() {
			//update rotation
			g[0] = (g[0] + 1)%360;
			requestAnimationFrame( animate );

			if (radial){
				var radial = "radial-gradient(rgba("+g[1]+","+g[2]+","+g[3]+", "+a+"), rgba(" +g[4]+","+g[5]+","+g[6] + ", "+a+"))";
				el.css('background', radial);
			} else {
				var linear = "linear-gradient("+g[0]+"deg, rgba("+g[1]+","+g[2]+","+g[3]+", "+a+"), rgba(" +g[4]+","+g[5]+","+g[6] + ", "+a+"))";
				el.css('background', linear);
			}
		}
		return this;
	},
	bubbles: function(num, canvas, el){
		var self = this;
		num = num || 3;
		el = el || $('body');
		canvas = canvas || document.getElementsByTagName('canvas');
		if (canvas.length == 0){
			canvas = document.createElement('canvas');
			$(canvas).css('position', 'fixed').css('top', 0).css('left', 0);
			el.append(canvas);
		} else {
			canvas = canvas[0];
		}
		context = canvas.getContext("2d");
		W = canvas.width = window.innerWidth;
		H = canvas.height = window.innerHeight;

		this.circles = new Array();
		for (var i=0; i<num; i++)
		{
			var c = new Array();	//x, y, r
			c.push(W*Math.random());
			//c.push(H*Math.random());
			c.push(H-Math.random()*500);
			c.push(200*Math.random());

			self.circles.push(c);
		}
		

		var dr = 0.4;
		clearInterval(this.bloom);
		this.bloom = setInterval(function(){
			//clear
			context.clearRect(0,0,W,H);
			//canvas.width = canvas.width;

			if (dr > 0.05)
				dr *= 0.995;
			else
				dr = 0.05;

			for (c in self.circles)
			{
				self.circles[c][2] += dr;
				context.beginPath();
				context.arc(self.circles[c][0], self.circles[c][1], self.circles[c][2], 0, 2*Math.PI);

				context.strokeStyle = "#1B87E0";
				context.stroke();
			}
			
			
		}, 1);
		return this;
	},
	circles: [],
	bloom: {},
	overlay: function(el){		//see anymore.html
		if (typeof el == 'undefined'){
			//make a ghost table
			el = $('.pane');
		}
		el.css('-webkit-transform', 'translateZ(700px)').css('-webkit-transition', '-webkit-transform '+(speed/1000)+'s');

		var out = true;
		var speed = 200;
		$(document).keyup(function(e){
			if (e.keyCode == 32){
				if (!out){
					speed = 800;
					el.css('-webkit-transition', '-webkit-transform '+(speed/1000)+'s');
					el.css('-webkit-transform', 'translateZ(700px)');
					el.animate({opacity:0},speed-100);
				} else {
					speed = 600;
					el.css('-webkit-transition', '-webkit-transform '+(speed/1000)+'s');
					el.css('-webkit-transform', 'translateZ(0px)');
					el.animate({opacity:1},speed);
				}
				out = !out;
			}
		});
		return this;
	},
	typeAnywhere: function(sheet, fontsize){
		var self = this;
		fontsize = fontsize || 70;
		if (typeof sheet == 'undefined'){
			if ($('#typeSheet').length == 0){
				sheet = $(document.createElement('div'));
				$('body').append(sheet.css('position', 'fixed').css('top', '30%').css('left', 0).css('font-size', fontsize + 'px')
					.css('outline', 'none').css('line-height', fontsize + 'px')
					.attr('contentEditable', 'true').attr('id', 'typeSheet').attr('spellcheck', 'false')
					.hide());
			} else {
				sheet = $('#sheet');
			}
		}
		$(document).on('keyup',function(e){
			//if text is empty, hide sheet
			if (sheet.text().length == 0 && (sheet.css('display') != 'none')) {
				sheet.hide().blur();
			} else if (self.alphabet.indexOf(String.fromCharCode(e.keyCode).toLowerCase()) != -1) {
				sheet.show().focus();
			}
		});
		return this;
	},

	//UTILITIES
	days: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
	months: ['January','February','March','April','May','June','July','August','September','October','November','December'],
	alphabet: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
}
