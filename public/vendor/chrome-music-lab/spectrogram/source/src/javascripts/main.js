// Motion Atlas compatibility edits, 2026-11-18. See README.md and provenance.json.
/********************************************************
Copyright 2016 Google Inc. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*********************************************************/



'use strict';

window.isMobile = ( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) );
window.isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
window.isAndroid = /Android/.test(navigator.userAgent) && !window.MSStream;

window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
		  window.webkitRequestAnimationFrame ||
		  window.mozRequestAnimationFrame    ||
		  function( callback ){
			window.setTimeout(callback, 1000 / 60);
		  };
})();

// -~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~
var spec3D = require('./UI/spectrogram');
// -~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~

$(function(){
	var parseQueryString = function(){
		var q = window.location.search.slice(1).split('&');
		for(var i=0; i < q.length; ++i){
			var qi = q[i].split('=');
			q[i] = {};
			q[i][qi[0]] = qi[1];
		}
		return q;
	}

	// Labels are local; no Google-hosted locale request is needed.
	var getLocalization = function(){
        var labels = {
            mic: 'Microphone (optional)', draw: 'Draw sound',
            Spectrogram_UI_Instrament_Flute: 'Flute',
            Spectrogram_UI_Instrament_Harp: 'Harp',
            Spectrogram_UI_Instrament_Whistling: 'Whistling',
            Spectrogram_UI_Instrament_Trombone: 'Trombone',
            Spectrogram_UI_Instrament_Drum_Machine: 'Drum machine',
            Spectrogram_UI_Instrament_Birds: 'Birds',
            Spectrogram_UI_Instrament_Modem: 'Modem',
            Spectrogram_UI_Instrament_Wine_Glass: 'Wine glass'
        };
        $('[data-name]').each(function(){
            var label = labels[$(this).attr('data-name')];
            if(label) $(this).attr({'data-name':label, 'aria-label':label, title:label});
        });
    };

	var startup = function (){
        var source = null; // global source for user dropped audio

		getLocalization();
		window.parent.postMessage('ready','*');

		var sp = spec3D;
        if (!window.AtlasSpectrogram.prepare()) return;
        try { sp.attached(); }
        catch(error) { window.AtlasSpectrogram.unavailable(error); return; }
        window.AtlasSpectrogram.connect(sp);
        sp.startRender();
        sp.stopRender();
		// --------------------------------------------
		$('.music-box__tool-tip').hide(0);
		$('#loadingSound').hide(0);

		$('.music-box__buttons__button').click(function(e){
			window.AtlasSpectrogram.unlock();
			sp.startRender();
			
			var wasPlaying = sp.isPlaying();
			sp.stop();
			sp.drawingMode = false;
			
			if($(this).hasClass('selected')) {
				$('.music-box__buttons__button').removeClass('selected'); 
			}else{
				$('.music-box__buttons__button').removeClass('selected'); 
				$(this).addClass('selected');
				// check for start recoding data instruction **********************
				if ($(this).attr('data-mic')!== undefined) {
					if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia){
						// Throw Microphone Error *********************************
						window.AtlasSpectrogram.status('Microphone is unavailable here. Choose a sample or Draw sound instead.');
						// Remove Selection ***************************************
						$(this).removeClass('selected');
					}else{
						// Show Record Modal Screen *******************************
						$('#record').fadeIn().delay(2000).fadeOut();
						// Start Recording ****************************************
						sp.live();
					}
				// Check for Start drawing data instruction  **********************
				}else if ($(this).attr('data-draw') !== undefined) {
					sp.drawingMode = true;
					$('#drawAnywhere').fadeIn().delay(2000).fadeOut();
				// Check for play audio data instruction **************************
				}else if ($(this).attr('data-src') !== undefined) {
					sp.loopChanged( true );
					$('#loadingMessage').text($(this).attr('data-name'));
					sp.play($(this).attr('data-src'));
				}
			}
		})
		
		var killSound = function(){
			sp.stopRender();
			var wasPlaying = sp.isPlaying();
			sp.stop();
			sp.drawingMode = false;
			$('.music-box__buttons__button').removeClass('selected').attr('aria-pressed','false'); 
		}

		window.addEventListener('blur', function() {
		   killSound();
		});
		document.addEventListener('visibilitychange', function(){
		    killSound();
		});

        var decodeBuffer = function(file) {
            var requestId = ++sp.player.requestId;
            window.AtlasSpectrogram.unlock();
            file.arrayBuffer().then(function(bytes){
                return sp.player.context.decodeAudioData(bytes);
            }).then(function(buffer){
                if (requestId !== sp.player.requestId || document.hidden) return;
                sp.startRender();
                sp.loopChanged(true);
                sp.userAudio({buffer:buffer});
                $('#loadingSound').hide();
            }).catch(function(){
                $('#loadingSound').hide();
                window.AtlasSpectrogram.status('That audio file could not be decoded. Try a different sound file.');
            });
        };

        var fileDrop = function() {
            var $fileDrop = $('#fileDrop');
            var $description = $('.file-overlay-description');

            $(window).on({'dragover': function(e) {
                e.preventDefault();
                e.stopPropagation();

                $description.text('Drop your sound file here.');
                $fileDrop.addClass('active');
            }, 'dragleave': function(e) {
                e.preventDefault();
                e.stopPropagation();

                $fileDrop.removeClass('active');
            }, 'drop': function(e) {
                e.preventDefault();
                e.stopPropagation();

                $fileDrop.addClass('pointer-events');

                // Stop other sounds
                killSound();

                var droppedFiles = e.originalEvent.dataTransfer;
                if (droppedFiles && droppedFiles.files.length && droppedFiles.items[0] && droppedFiles.items[0].type !== 'audio/midi') {
                    $.each(droppedFiles.files, function(i, file) {
                        if (file.type.indexOf('audio') > -1) {
                            $('#loadingMessage').text(file.name);
                            $('#loadingSound').show(0);
                            decodeBuffer(file);
                            $fileDrop.removeClass('active');
                            $fileDrop.removeClass('pointer-events');
                        } else {
                            $description.text('Only sound files will work here.');
						}
                    });
                } else {
                    $description.text('Only sound files will work here.');
				}
            } });

            $fileDrop.on('click', function() {
                $fileDrop.removeClass('active');
                $fileDrop.removeClass('pointer-events');
			});
        };

        fileDrop();
	};

    $('#iosButton').addClass('hide');
    startup();
});
