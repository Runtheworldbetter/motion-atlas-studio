/* Original Chrome Music Lab Spectrogram, packaged by Motion Atlas. See THIRD-PARTY-NOTICES.txt and provenance.json. */
"use strict";
(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // source/src/javascripts/util/util.js
  var require_util = __commonJS({
    "source/src/javascripts/util/util.js"(exports, module) {
      "use strict";
      var Util = window.Util || {};
      Util.loadTrackSrc = function(context, src, callback, opt_progressCallback) {
        var request = new XMLHttpRequest();
        request.open("GET", src, true);
        request.responseType = "arraybuffer";
        request.onload = function() {
          context.decodeAudioData(request.response, function(buffer) {
            callback(buffer);
          }, function(e) {
            console.error(e);
          });
        };
        if (opt_progressCallback) {
          request.onprogress = function(e) {
            var percent = e.loaded / e.total;
            opt_progressCallback(percent);
          };
        }
        request.send();
      };
      Util.setLogScale = function(x1, y1, x2, y2) {
        this.b = Math.log(y1 / y2) / (x1 - x2);
        this.a = y1 / Math.exp(this.b * x1);
      };
      Util.lin2log = function(x) {
        return this.a * Math.exp(this.b * x);
      };
      Util.log2lin = function(y) {
        return Math.log(y / this.a) / this.b;
      };
      module.exports = Util;
    }
  });

  // source/src/javascripts/UI/player.js
  var require_player = __commonJS({
    "source/src/javascripts/UI/player.js"(exports, module) {
      "use strict";
      var Util = require_util();
      function Player() {
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        var context = new AudioContext();
        context.suspend().catch(function() {
        });
        this.requestId = 0;
        var analyser = context.createAnalyser();
        analyser.fftSize = window.isMobile ? 1024 : 2048;
        analyser.smoothingTimeConstant = 0;
        var mix = context.createGain();
        var bandpass = context.createBiquadFilter();
        bandpass.Q.value = 10;
        bandpass.type = "bandpass";
        var filterGain = context.createGain();
        filterGain.gain.value = 1;
        mix.connect(analyser);
        analyser.connect(filterGain);
        filterGain.connect(context.destination);
        this.context = context;
        this.mix = mix;
        this.filterGain = filterGain;
        this.analyser = analyser;
        this.buffers = {};
      }
      Player.prototype.playSrc = function(src) {
        var requestId = ++this.requestId;
        this.filterGain.gain.value = 0.65;
        if (this.input) {
          this.input.disconnect();
          this.input = null;
          return;
        }
        if (this.buffers[src]) {
          $("#loadingSound").fadeIn(100).delay(1e3).fadeOut(500);
          this.playHelper_(src);
          return;
        }
        $("#loadingSound").fadeIn(100);
        Util.loadTrackSrc(this.context, src, function(buffer) {
          this.buffers[src] = buffer;
          if (requestId !== this.requestId || document.hidden) return;
          this.playHelper_(src);
          $("#loadingSound").delay(500).fadeOut(500);
        }.bind(this));
      };
      Player.prototype.playUserAudio = function(src) {
        this.filterGain.gain.value = 0.65;
        if (this.input) {
          this.input.disconnect();
          this.input = null;
          return;
        }
        this.buffers["user"] = src.buffer;
        this.playHelper_("user");
      };
      Player.prototype.playHelper_ = function(src) {
        var buffer = this.buffers[src];
        this.source = this.createSource_(buffer, true);
        this.source.start(0);
        if (!this.loop) {
          this.playTimer = setTimeout(function() {
            this.stop();
          }.bind(this), buffer.duration * 2e3);
        }
      };
      Player.prototype.live = function() {
        var self = this;
        var requestId = ++this.requestId;
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          window.AtlasSpectrogram.status("Microphone is unavailable here. Choose a sample or Draw sound instead.");
          return;
        }
        this.context.resume().catch(function() {
        });
        navigator.mediaDevices.getUserMedia({ audio: true }).then(function(stream) {
          if (requestId !== self.requestId || document.hidden) {
            stream.getTracks().forEach(function(track) {
              track.stop();
            });
            return;
          }
          self.filterGain.gain.value = 0;
          self.onStream_(stream);
        }).catch(function() {
          $(".music-box__buttons__button[data-mic]").removeClass("selected").attr("aria-pressed", "false");
          $("#record").hide();
          window.AtlasSpectrogram.status("Microphone access was not enabled. The samples and Draw sound still work.");
        });
      };
      Player.prototype.onStream_ = function(stream) {
        var input = this.context.createMediaStreamSource(stream);
        input.connect(this.mix);
        this.input = input;
        this.stream = stream;
      };
      Player.prototype.onStreamError_ = function(e) {
      };
      Player.prototype.setLoop = function(loop) {
        this.loop = loop;
      };
      Player.prototype.createSource_ = function(buffer, loop) {
        var source = this.context.createBufferSource();
        source.buffer = buffer;
        source.loop = loop;
        source.connect(this.mix);
        return source;
      };
      Player.prototype.setMicrophoneInput = function() {
      };
      Player.prototype.stop = function() {
        ++this.requestId;
        if (this.source) {
          try {
            this.source.stop(0);
          } catch (error) {
          }
          this.source.disconnect();
          this.source = null;
        }
        clearTimeout(this.playTimer);
        this.playTimer = null;
        if (this.input) {
          this.input.disconnect();
          this.input = null;
        }
        if (this.stream) {
          this.stream.getTracks().forEach(function(track) {
            track.stop();
          });
          this.stream = null;
        }
        this.stopTone();
      };
      Player.prototype.getAnalyserNode = function() {
        return this.analyser;
      };
      Player.prototype.setBandpassFrequency = function(freq) {
        if (freq == null) {
          console.log("Removing bandpass filter");
          this.mix.disconnect();
          this.mix.connect(this.analyser);
        } else {
          this.bandpass.frequency.value = freq;
          this.mix.disconnect();
          this.mix.connect(this.bandpass);
          this.filterGain.connect(this.analyser);
        }
      };
      Player.prototype.playTone = function(freq) {
        if (!Number.isFinite(freq) || freq <= 0) {
          this.stopTone();
          return;
        }
        if (!this.osc) {
          this.osc = this.context.createOscillator();
          this.osc.connect(this.mix);
          this.osc.type = "sine";
          this.osc.start(0);
        }
        this.osc.frequency.value = freq;
        this.filterGain.gain.value = 0.2;
      };
      Player.prototype.stopTone = function() {
        if (!this.osc) return;
        try {
          this.osc.stop(0);
        } catch (error) {
        }
        this.osc.disconnect();
        this.osc = null;
      };
      module.exports = Player;
    }
  });

  // source/src/javascripts/3D/matrix4x4.js
  var require_matrix4x4 = __commonJS({
    "source/src/javascripts/3D/matrix4x4.js"(exports, module) {
      "use strict";
      function Matrix4x4() {
        this.elements = Array(16);
        this.loadIdentity();
      }
      Matrix4x4.prototype = {
        scale: function(sx, sy, sz) {
          this.elements[0 * 4 + 0] *= sx;
          this.elements[0 * 4 + 1] *= sx;
          this.elements[0 * 4 + 2] *= sx;
          this.elements[0 * 4 + 3] *= sx;
          this.elements[1 * 4 + 0] *= sy;
          this.elements[1 * 4 + 1] *= sy;
          this.elements[1 * 4 + 2] *= sy;
          this.elements[1 * 4 + 3] *= sy;
          this.elements[2 * 4 + 0] *= sz;
          this.elements[2 * 4 + 1] *= sz;
          this.elements[2 * 4 + 2] *= sz;
          this.elements[2 * 4 + 3] *= sz;
          return this;
        },
        translate: function(tx, ty, tz) {
          this.elements[3 * 4 + 0] += this.elements[0 * 4 + 0] * tx + this.elements[1 * 4 + 0] * ty + this.elements[2 * 4 + 0] * tz;
          this.elements[3 * 4 + 1] += this.elements[0 * 4 + 1] * tx + this.elements[1 * 4 + 1] * ty + this.elements[2 * 4 + 1] * tz;
          this.elements[3 * 4 + 2] += this.elements[0 * 4 + 2] * tx + this.elements[1 * 4 + 2] * ty + this.elements[2 * 4 + 2] * tz;
          this.elements[3 * 4 + 3] += this.elements[0 * 4 + 3] * tx + this.elements[1 * 4 + 3] * ty + this.elements[2 * 4 + 3] * tz;
          return this;
        },
        rotate: function(angle, x, y, z) {
          var mag = Math.sqrt(x * x + y * y + z * z);
          var sinAngle = Math.sin(angle * Math.PI / 180);
          var cosAngle = Math.cos(angle * Math.PI / 180);
          if (mag > 0) {
            var xx, yy, zz, xy, yz, zx, xs, ys, zs;
            var oneMinusCos;
            var rotMat;
            x /= mag;
            y /= mag;
            z /= mag;
            xx = x * x;
            yy = y * y;
            zz = z * z;
            xy = x * y;
            yz = y * z;
            zx = z * x;
            xs = x * sinAngle;
            ys = y * sinAngle;
            zs = z * sinAngle;
            oneMinusCos = 1 - cosAngle;
            rotMat = new Matrix4x4();
            rotMat.elements[0 * 4 + 0] = oneMinusCos * xx + cosAngle;
            rotMat.elements[0 * 4 + 1] = oneMinusCos * xy - zs;
            rotMat.elements[0 * 4 + 2] = oneMinusCos * zx + ys;
            rotMat.elements[0 * 4 + 3] = 0;
            rotMat.elements[1 * 4 + 0] = oneMinusCos * xy + zs;
            rotMat.elements[1 * 4 + 1] = oneMinusCos * yy + cosAngle;
            rotMat.elements[1 * 4 + 2] = oneMinusCos * yz - xs;
            rotMat.elements[1 * 4 + 3] = 0;
            rotMat.elements[2 * 4 + 0] = oneMinusCos * zx - ys;
            rotMat.elements[2 * 4 + 1] = oneMinusCos * yz + xs;
            rotMat.elements[2 * 4 + 2] = oneMinusCos * zz + cosAngle;
            rotMat.elements[2 * 4 + 3] = 0;
            rotMat.elements[3 * 4 + 0] = 0;
            rotMat.elements[3 * 4 + 1] = 0;
            rotMat.elements[3 * 4 + 2] = 0;
            rotMat.elements[3 * 4 + 3] = 1;
            rotMat = rotMat.multiply(this);
            this.elements = rotMat.elements;
          }
          return this;
        },
        frustum: function(left, right, bottom, top, nearZ, farZ) {
          var deltaX = right - left;
          var deltaY = top - bottom;
          var deltaZ = farZ - nearZ;
          var frust;
          if (nearZ <= 0 || farZ <= 0 || deltaX <= 0 || deltaY <= 0 || deltaZ <= 0)
            return this;
          frust = new Matrix4x4();
          frust.elements[0 * 4 + 0] = 2 * nearZ / deltaX;
          frust.elements[0 * 4 + 1] = frust.elements[0 * 4 + 2] = frust.elements[0 * 4 + 3] = 0;
          frust.elements[1 * 4 + 1] = 2 * nearZ / deltaY;
          frust.elements[1 * 4 + 0] = frust.elements[1 * 4 + 2] = frust.elements[1 * 4 + 3] = 0;
          frust.elements[2 * 4 + 0] = (right + left) / deltaX;
          frust.elements[2 * 4 + 1] = (top + bottom) / deltaY;
          frust.elements[2 * 4 + 2] = -(nearZ + farZ) / deltaZ;
          frust.elements[2 * 4 + 3] = -1;
          frust.elements[3 * 4 + 2] = -2 * nearZ * farZ / deltaZ;
          frust.elements[3 * 4 + 0] = frust.elements[3 * 4 + 1] = frust.elements[3 * 4 + 3] = 0;
          frust = frust.multiply(this);
          this.elements = frust.elements;
          return this;
        },
        perspective: function(fovy, aspect, nearZ, farZ) {
          var frustumH = Math.tan(fovy / 360 * Math.PI) * nearZ;
          var frustumW = frustumH * aspect;
          return this.frustum(-frustumW, frustumW, -frustumH, frustumH, nearZ, farZ);
        },
        ortho: function(left, right, bottom, top, nearZ, farZ) {
          var deltaX = right - left;
          var deltaY = top - bottom;
          var deltaZ = farZ - nearZ;
          var ortho = new Matrix4x4();
          if (deltaX == 0 || deltaY == 0 || deltaZ == 0)
            return this;
          ortho.elements[0 * 4 + 0] = 2 / deltaX;
          ortho.elements[3 * 4 + 0] = -(right + left) / deltaX;
          ortho.elements[1 * 4 + 1] = 2 / deltaY;
          ortho.elements[3 * 4 + 1] = -(top + bottom) / deltaY;
          ortho.elements[2 * 4 + 2] = -2 / deltaZ;
          ortho.elements[3 * 4 + 2] = -(nearZ + farZ) / deltaZ;
          ortho = ortho.multiply(this);
          this.elements = ortho.elements;
          return this;
        },
        multiply: function(right) {
          var tmp = new Matrix4x4();
          for (var i = 0; i < 4; i++) {
            tmp.elements[i * 4 + 0] = this.elements[i * 4 + 0] * right.elements[0 * 4 + 0] + this.elements[i * 4 + 1] * right.elements[1 * 4 + 0] + this.elements[i * 4 + 2] * right.elements[2 * 4 + 0] + this.elements[i * 4 + 3] * right.elements[3 * 4 + 0];
            tmp.elements[i * 4 + 1] = this.elements[i * 4 + 0] * right.elements[0 * 4 + 1] + this.elements[i * 4 + 1] * right.elements[1 * 4 + 1] + this.elements[i * 4 + 2] * right.elements[2 * 4 + 1] + this.elements[i * 4 + 3] * right.elements[3 * 4 + 1];
            tmp.elements[i * 4 + 2] = this.elements[i * 4 + 0] * right.elements[0 * 4 + 2] + this.elements[i * 4 + 1] * right.elements[1 * 4 + 2] + this.elements[i * 4 + 2] * right.elements[2 * 4 + 2] + this.elements[i * 4 + 3] * right.elements[3 * 4 + 2];
            tmp.elements[i * 4 + 3] = this.elements[i * 4 + 0] * right.elements[0 * 4 + 3] + this.elements[i * 4 + 1] * right.elements[1 * 4 + 3] + this.elements[i * 4 + 2] * right.elements[2 * 4 + 3] + this.elements[i * 4 + 3] * right.elements[3 * 4 + 3];
          }
          this.elements = tmp.elements;
          return this;
        },
        copy: function() {
          var tmp = new Matrix4x4();
          for (var i = 0; i < 16; i++) {
            tmp.elements[i] = this.elements[i];
          }
          return tmp;
        },
        get: function(row, col) {
          return this.elements[4 * row + col];
        },
        // In-place inversion
        invert: function() {
          var tmp_0 = this.get(2, 2) * this.get(3, 3);
          var tmp_1 = this.get(3, 2) * this.get(2, 3);
          var tmp_2 = this.get(1, 2) * this.get(3, 3);
          var tmp_3 = this.get(3, 2) * this.get(1, 3);
          var tmp_4 = this.get(1, 2) * this.get(2, 3);
          var tmp_5 = this.get(2, 2) * this.get(1, 3);
          var tmp_6 = this.get(0, 2) * this.get(3, 3);
          var tmp_7 = this.get(3, 2) * this.get(0, 3);
          var tmp_8 = this.get(0, 2) * this.get(2, 3);
          var tmp_9 = this.get(2, 2) * this.get(0, 3);
          var tmp_10 = this.get(0, 2) * this.get(1, 3);
          var tmp_11 = this.get(1, 2) * this.get(0, 3);
          var tmp_12 = this.get(2, 0) * this.get(3, 1);
          var tmp_13 = this.get(3, 0) * this.get(2, 1);
          var tmp_14 = this.get(1, 0) * this.get(3, 1);
          var tmp_15 = this.get(3, 0) * this.get(1, 1);
          var tmp_16 = this.get(1, 0) * this.get(2, 1);
          var tmp_17 = this.get(2, 0) * this.get(1, 1);
          var tmp_18 = this.get(0, 0) * this.get(3, 1);
          var tmp_19 = this.get(3, 0) * this.get(0, 1);
          var tmp_20 = this.get(0, 0) * this.get(2, 1);
          var tmp_21 = this.get(2, 0) * this.get(0, 1);
          var tmp_22 = this.get(0, 0) * this.get(1, 1);
          var tmp_23 = this.get(1, 0) * this.get(0, 1);
          var t0 = tmp_0 * this.get(1, 1) + tmp_3 * this.get(2, 1) + tmp_4 * this.get(3, 1) - (tmp_1 * this.get(1, 1) + tmp_2 * this.get(2, 1) + tmp_5 * this.get(3, 1));
          var t1 = tmp_1 * this.get(0, 1) + tmp_6 * this.get(2, 1) + tmp_9 * this.get(3, 1) - (tmp_0 * this.get(0, 1) + tmp_7 * this.get(2, 1) + tmp_8 * this.get(3, 1));
          var t2 = tmp_2 * this.get(0, 1) + tmp_7 * this.get(1, 1) + tmp_10 * this.get(3, 1) - (tmp_3 * this.get(0, 1) + tmp_6 * this.get(1, 1) + tmp_11 * this.get(3, 1));
          var t3 = tmp_5 * this.get(0, 1) + tmp_8 * this.get(1, 1) + tmp_11 * this.get(2, 1) - (tmp_4 * this.get(0, 1) + tmp_9 * this.get(1, 1) + tmp_10 * this.get(2, 1));
          var d = 1 / (this.get(0, 0) * t0 + this.get(1, 0) * t1 + this.get(2, 0) * t2 + this.get(3, 0) * t3);
          var out_00 = d * t0;
          var out_01 = d * t1;
          var out_02 = d * t2;
          var out_03 = d * t3;
          var out_10 = d * (tmp_1 * this.get(1, 0) + tmp_2 * this.get(2, 0) + tmp_5 * this.get(3, 0) - (tmp_0 * this.get(1, 0) + tmp_3 * this.get(2, 0) + tmp_4 * this.get(3, 0)));
          var out_11 = d * (tmp_0 * this.get(0, 0) + tmp_7 * this.get(2, 0) + tmp_8 * this.get(3, 0) - (tmp_1 * this.get(0, 0) + tmp_6 * this.get(2, 0) + tmp_9 * this.get(3, 0)));
          var out_12 = d * (tmp_3 * this.get(0, 0) + tmp_6 * this.get(1, 0) + tmp_11 * this.get(3, 0) - (tmp_2 * this.get(0, 0) + tmp_7 * this.get(1, 0) + tmp_10 * this.get(3, 0)));
          var out_13 = d * (tmp_4 * this.get(0, 0) + tmp_9 * this.get(1, 0) + tmp_10 * this.get(2, 0) - (tmp_5 * this.get(0, 0) + tmp_8 * this.get(1, 0) + tmp_11 * this.get(2, 0)));
          var out_20 = d * (tmp_12 * this.get(1, 3) + tmp_15 * this.get(2, 3) + tmp_16 * this.get(3, 3) - (tmp_13 * this.get(1, 3) + tmp_14 * this.get(2, 3) + tmp_17 * this.get(3, 3)));
          var out_21 = d * (tmp_13 * this.get(0, 3) + tmp_18 * this.get(2, 3) + tmp_21 * this.get(3, 3) - (tmp_12 * this.get(0, 3) + tmp_19 * this.get(2, 3) + tmp_20 * this.get(3, 3)));
          var out_22 = d * (tmp_14 * this.get(0, 3) + tmp_19 * this.get(1, 3) + tmp_22 * this.get(3, 3) - (tmp_15 * this.get(0, 3) + tmp_18 * this.get(1, 3) + tmp_23 * this.get(3, 3)));
          var out_23 = d * (tmp_17 * this.get(0, 3) + tmp_20 * this.get(1, 3) + tmp_23 * this.get(2, 3) - (tmp_16 * this.get(0, 3) + tmp_21 * this.get(1, 3) + tmp_22 * this.get(2, 3)));
          var out_30 = d * (tmp_14 * this.get(2, 2) + tmp_17 * this.get(3, 2) + tmp_13 * this.get(1, 2) - (tmp_16 * this.get(3, 2) + tmp_12 * this.get(1, 2) + tmp_15 * this.get(2, 2)));
          var out_31 = d * (tmp_20 * this.get(3, 2) + tmp_12 * this.get(0, 2) + tmp_19 * this.get(2, 2) - (tmp_18 * this.get(2, 2) + tmp_21 * this.get(3, 2) + tmp_13 * this.get(0, 2)));
          var out_32 = d * (tmp_18 * this.get(1, 2) + tmp_23 * this.get(3, 2) + tmp_15 * this.get(0, 2) - (tmp_22 * this.get(3, 2) + tmp_14 * this.get(0, 2) + tmp_19 * this.get(1, 2)));
          var out_33 = d * (tmp_22 * this.get(2, 2) + tmp_16 * this.get(0, 2) + tmp_21 * this.get(1, 2) - (tmp_20 * this.get(1, 2) + tmp_23 * this.get(2, 2) + tmp_17 * this.get(0, 2)));
          this.elements[0 * 4 + 0] = out_00;
          this.elements[0 * 4 + 1] = out_01;
          this.elements[0 * 4 + 2] = out_02;
          this.elements[0 * 4 + 3] = out_03;
          this.elements[1 * 4 + 0] = out_10;
          this.elements[1 * 4 + 1] = out_11;
          this.elements[1 * 4 + 2] = out_12;
          this.elements[1 * 4 + 3] = out_13;
          this.elements[2 * 4 + 0] = out_20;
          this.elements[2 * 4 + 1] = out_21;
          this.elements[2 * 4 + 2] = out_22;
          this.elements[2 * 4 + 3] = out_23;
          this.elements[3 * 4 + 0] = out_30;
          this.elements[3 * 4 + 1] = out_31;
          this.elements[3 * 4 + 2] = out_32;
          this.elements[3 * 4 + 3] = out_33;
          return this;
        },
        // Returns new matrix which is the inverse of this
        inverse: function() {
          var tmp = this.copy();
          return tmp.invert();
        },
        // In-place transpose
        transpose: function() {
          var tmp = this.elements[0 * 4 + 1];
          this.elements[0 * 4 + 1] = this.elements[1 * 4 + 0];
          this.elements[1 * 4 + 0] = tmp;
          tmp = this.elements[0 * 4 + 2];
          this.elements[0 * 4 + 2] = this.elements[2 * 4 + 0];
          this.elements[2 * 4 + 0] = tmp;
          tmp = this.elements[0 * 4 + 3];
          this.elements[0 * 4 + 3] = this.elements[3 * 4 + 0];
          this.elements[3 * 4 + 0] = tmp;
          tmp = this.elements[1 * 4 + 2];
          this.elements[1 * 4 + 2] = this.elements[2 * 4 + 1];
          this.elements[2 * 4 + 1] = tmp;
          tmp = this.elements[1 * 4 + 3];
          this.elements[1 * 4 + 3] = this.elements[3 * 4 + 1];
          this.elements[3 * 4 + 1] = tmp;
          tmp = this.elements[2 * 4 + 3];
          this.elements[2 * 4 + 3] = this.elements[3 * 4 + 2];
          this.elements[3 * 4 + 2] = tmp;
          return this;
        },
        loadIdentity: function() {
          for (var i = 0; i < 16; i++)
            this.elements[i] = 0;
          this.elements[0 * 4 + 0] = 1;
          this.elements[1 * 4 + 1] = 1;
          this.elements[2 * 4 + 2] = 1;
          this.elements[3 * 4 + 3] = 1;
          return this;
        }
      };
      module.exports = Matrix4x4;
    }
  });

  // source/src/javascripts/3D/cameracontroller.js
  var require_cameracontroller = __commonJS({
    "source/src/javascripts/3D/cameracontroller.js"(exports, module) {
      "use strict";
      function CameraController(element, opt_canvas, opt_context) {
        var controller = this;
        this.onchange = null;
        this.xRot = 0;
        this.yRot = 0;
        this.zRot = 0;
        this.scaleFactor = 3;
        this.dragging = false;
        this.curX = 0;
        this.curY = 0;
        if (opt_canvas)
          this.canvas_ = opt_canvas;
        if (opt_context)
          this.context_ = opt_context;
        return;
        element.onmousedown = function(ev) {
          controller.curX = ev.clientX;
          controller.curY = ev.clientY;
          var dragging = false;
          if (controller.canvas_ && controller.context_) {
            var rect = controller.canvas_.getBoundingClientRect();
            var canvasRelativeX = ev.pageX - rect.left;
            var canvasRelativeY = ev.pageY - rect.top;
            var canvasWidth = controller.canvas_.width;
            var canvasHeight = controller.canvas_.height;
            if (canvasRelativeX > 0 && canvasRelativeX < canvasWidth && canvasRelativeY > 0 && canvasRelativeY < canvasHeight) {
              var pixels = controller.context_.readPixels(
                canvasRelativeX,
                canvasHeight - canvasRelativeY,
                1,
                1,
                controller.context_.RGBA,
                controller.context_.UNSIGNED_BYTE
              );
              if (pixels) {
                if (pixels[3] > 255 / 10) {
                  dragging = true;
                }
              }
            }
          } else {
            dragging = true;
          }
          controller.dragging = dragging;
        };
        element.onmouseup = function(ev) {
          controller.dragging = false;
        };
        element.onmousemove = function(ev) {
          if (controller.dragging) {
            var curX = ev.clientX;
            var curY = ev.clientY;
            var deltaX = (controller.curX - curX) / controller.scaleFactor;
            var deltaY = (controller.curY - curY) / controller.scaleFactor;
            controller.curX = curX;
            controller.curY = curY;
            controller.yRot = (controller.yRot + deltaX) % 360;
            controller.xRot = controller.xRot + deltaY;
            if (controller.xRot < -90) {
              controller.xRot = -90;
            } else if (controller.xRot > 90) {
              controller.xRot = 90;
            }
            if (controller.onchange != null) {
              controller.onchange(controller.xRot, controller.yRot);
            }
          }
        };
      }
      module.exports = CameraController;
    }
  });

  // source/src/javascripts/3D/visualizer.js
  var require_visualizer = __commonJS({
    "source/src/javascripts/3D/visualizer.js"(exports, module) {
      "use strict";
      var Matrix4x4 = require_matrix4x4();
      var CameraController = require_cameracontroller();
      var ANALYSISTYPE_FREQUENCY = 0;
      var ANALYSISTYPE_SONOGRAM = 1;
      var ANALYSISTYPE_3D_SONOGRAM = 2;
      var ANALYSISTYPE_WAVEFORM = 3;
      var model = 0;
      var view = 0;
      var projection = 0;
      var AnalyserView = function(canvas) {
        this.analysisType = ANALYSISTYPE_3D_SONOGRAM;
        this.sonogram3DWidth = 256;
        this.sonogram3DHeight = 256;
        this.sonogram3DGeometrySize = 9.5;
        this.freqByteData = 0;
        this.texture = 0;
        this.TEXTURE_HEIGHT = 256;
        this.yoffset = 0;
        this.frequencyShader = 0;
        this.waveformShader = 0;
        this.sonogramShader = 0;
        this.sonogram3DShader = 0;
        this.backgroundColor = [0.08, 0.08, 0.08, 1];
        this.foregroundColor = [0, 0.7, 0, 1];
        this.canvas = canvas;
        this.initGL();
      };
      AnalyserView.prototype.getAvailableContext = function(canvas, contextList) {
        if (canvas.getContext) {
          for (var i = 0; i < contextList.length; ++i) {
            try {
              var context = canvas.getContext(contextList[i], { antialias: true });
              if (context !== null)
                return context;
            } catch (ex) {
            }
          }
        }
        return null;
      };
      AnalyserView.prototype.initGL = function() {
        model = new Matrix4x4();
        view = new Matrix4x4();
        projection = new Matrix4x4();
        var sonogram3DWidth = this.sonogram3DWidth;
        var sonogram3DHeight = this.sonogram3DHeight;
        var sonogram3DGeometrySize = this.sonogram3DGeometrySize;
        var backgroundColor = this.backgroundColor;
        var canvas = this.canvas;
        var gl = this.getAvailableContext(canvas, ["webgl", "experimental-webgl"]);
        this.gl = gl;
        this.has3DVisualizer = gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS) > 0;
        if (!this.has3DVisualizer && this.analysisType == ANALYSISTYPE_3D_SONOGRAM)
          this.analysisType = ANALYSISTYPE_FREQUENCY;
        var cameraController = new CameraController(canvas);
        this.cameraController = cameraController;
        cameraController.xRot = -180;
        cameraController.yRot = 270;
        cameraController.zRot = 90;
        cameraController.xT = 0;
        cameraController.yT = -2;
        cameraController.zT = -2;
        gl.clearColor(backgroundColor[0], backgroundColor[1], backgroundColor[2], backgroundColor[3]);
        gl.enable(gl.DEPTH_TEST);
        var vertices = new Float32Array([
          1,
          1,
          0,
          -1,
          1,
          0,
          -1,
          -1,
          0,
          1,
          1,
          0,
          -1,
          -1,
          0,
          1,
          -1,
          0
        ]);
        var texCoords = new Float32Array([
          1,
          1,
          0,
          1,
          0,
          0,
          1,
          1,
          0,
          0,
          1,
          0
        ]);
        var vboTexCoordOffset = vertices.byteLength;
        this.vboTexCoordOffset = vboTexCoordOffset;
        var vbo = gl.createBuffer();
        this.vbo = vbo;
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
        gl.bufferData(
          gl.ARRAY_BUFFER,
          vboTexCoordOffset + texCoords.byteLength,
          gl.STATIC_DRAW
        );
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, vertices);
        gl.bufferSubData(gl.ARRAY_BUFFER, vboTexCoordOffset, texCoords);
        var numVertices = sonogram3DWidth * sonogram3DHeight;
        if (numVertices > 65536) {
          throw "Sonogram 3D resolution is too high: can only handle 65536 vertices max";
        }
        vertices = new Float32Array(numVertices * 3);
        texCoords = new Float32Array(numVertices * 2);
        for (var z = 0; z < sonogram3DHeight; z++) {
          for (var x = 0; x < sonogram3DWidth; x++) {
            vertices[3 * (sonogram3DWidth * z + x) + 0] = sonogram3DGeometrySize * (x - sonogram3DWidth / 2) / sonogram3DWidth;
            vertices[3 * (sonogram3DWidth * z + x) + 1] = 0;
            vertices[3 * (sonogram3DWidth * z + x) + 2] = sonogram3DGeometrySize * (z - sonogram3DHeight / 2) / sonogram3DHeight;
            texCoords[2 * (sonogram3DWidth * z + x) + 0] = x / (sonogram3DWidth - 1);
            texCoords[2 * (sonogram3DWidth * z + x) + 1] = z / (sonogram3DHeight - 1);
          }
        }
        var vbo3DTexCoordOffset = vertices.byteLength;
        this.vbo3DTexCoordOffset = vbo3DTexCoordOffset;
        var sonogram3DVBO = gl.createBuffer();
        this.sonogram3DVBO = sonogram3DVBO;
        gl.bindBuffer(gl.ARRAY_BUFFER, sonogram3DVBO);
        gl.bufferData(gl.ARRAY_BUFFER, vbo3DTexCoordOffset + texCoords.byteLength, gl.STATIC_DRAW);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, vertices);
        gl.bufferSubData(gl.ARRAY_BUFFER, vbo3DTexCoordOffset, texCoords);
        var sonogram3DNumIndices = (sonogram3DWidth - 1) * (sonogram3DHeight - 1) * 6;
        this.sonogram3DNumIndices = sonogram3DNumIndices - 6 * 600;
        var indices = new Uint16Array(sonogram3DNumIndices);
        var idx = 0;
        for (var z = 0; z < sonogram3DHeight - 1; z++) {
          for (var x = 0; x < sonogram3DWidth - 1; x++) {
            indices[idx++] = z * sonogram3DWidth + x;
            indices[idx++] = z * sonogram3DWidth + x + 1;
            indices[idx++] = (z + 1) * sonogram3DWidth + x + 1;
            indices[idx++] = z * sonogram3DWidth + x;
            indices[idx++] = (z + 1) * sonogram3DWidth + x + 1;
            indices[idx++] = (z + 1) * sonogram3DWidth + x;
          }
        }
        var sonogram3DIBO = gl.createBuffer();
        this.sonogram3DIBO = sonogram3DIBO;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sonogram3DIBO);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
        this.frequencyShader = o3djs.shader.loadFromURL(gl, "bin/shaders/common-vertex.shader", "bin/shaders/frequency-fragment.shader");
        this.waveformShader = o3djs.shader.loadFromURL(gl, "bin/shaders/common-vertex.shader", "bin/shaders/waveform-fragment.shader");
        this.sonogramShader = o3djs.shader.loadFromURL(gl, "bin/shaders/common-vertex.shader", "bin/shaders/sonogram-fragment.shader");
        if (this.has3DVisualizer) {
          this.sonogram3DShader = o3djs.shader.loadFromURL(gl, "bin/shaders/sonogram-vertex.shader", "bin/shaders/sonogram-fragment.shader");
        }
        console.log("this.sonogramShader", this.sonogramShader);
        console.log("this.sonogram3DShader", this.sonogram3DShader);
      };
      AnalyserView.prototype.initByteBuffer = function() {
        var gl = this.gl;
        var TEXTURE_HEIGHT = this.TEXTURE_HEIGHT;
        if (!this.freqByteData || this.freqByteData.length != this.analyser.frequencyBinCount) {
          var freqByteData = new Uint8Array(this.analyser.frequencyBinCount);
          this.freqByteData = freqByteData;
          if (this.texture) {
            gl.deleteTexture(this.texture);
            this.texture = null;
          }
          var texture = gl.createTexture();
          this.texture = texture;
          gl.bindTexture(gl.TEXTURE_2D, texture);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
          var tmp = new Uint8Array(freqByteData.length * TEXTURE_HEIGHT);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.ALPHA, freqByteData.length, TEXTURE_HEIGHT, 0, gl.ALPHA, gl.UNSIGNED_BYTE, tmp);
        }
      };
      AnalyserView.prototype.setAnalysisType = function(type) {
        if (!this.has3DVisualizer && type == ANALYSISTYPE_3D_SONOGRAM)
          return;
        this.analysisType = type;
      };
      AnalyserView.prototype.analysisType = function() {
        return this.analysisType;
      };
      AnalyserView.prototype.doFrequencyAnalysis = function(event) {
        var freqByteData = this.freqByteData;
        switch (this.analysisType) {
          case ANALYSISTYPE_FREQUENCY:
            this.analyser.smoothingTimeConstant = 0.75;
            this.analyser.getByteFrequencyData(freqByteData);
            break;
          case ANALYSISTYPE_SONOGRAM:
          case ANALYSISTYPE_3D_SONOGRAM:
            this.analyser.smoothingTimeConstant = 0;
            this.analyser.getByteFrequencyData(freqByteData);
            break;
          case ANALYSISTYPE_WAVEFORM:
            this.analyser.smoothingTimeConstant = 0.1;
            this.analyser.getByteTimeDomainData(freqByteData);
            break;
        }
        this.drawGL();
      };
      AnalyserView.prototype.drawGL = function() {
        var canvas = this.canvas;
        var gl = this.gl;
        var vbo = this.vbo;
        var vboTexCoordOffset = this.vboTexCoordOffset;
        var sonogram3DVBO = this.sonogram3DVBO;
        var vbo3DTexCoordOffset = this.vbo3DTexCoordOffset;
        var sonogram3DGeometrySize = this.sonogram3DGeometrySize;
        var sonogram3DNumIndices = this.sonogram3DNumIndices;
        var sonogram3DWidth = this.sonogram3DWidth;
        var sonogram3DHeight = this.sonogram3DHeight;
        var freqByteData = this.freqByteData;
        var texture = this.texture;
        var TEXTURE_HEIGHT = this.TEXTURE_HEIGHT;
        var frequencyShader = this.frequencyShader;
        var waveformShader = this.waveformShader;
        var sonogramShader = this.sonogramShader;
        var sonogram3DShader = this.sonogram3DShader;
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
        if (this.analysisType != ANALYSISTYPE_SONOGRAM && this.analysisType != ANALYSISTYPE_3D_SONOGRAM) {
          this.yoffset = 0;
        }
        gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, this.yoffset, freqByteData.length, 1, gl.ALPHA, gl.UNSIGNED_BYTE, freqByteData);
        if (this.analysisType == ANALYSISTYPE_SONOGRAM || this.analysisType == ANALYSISTYPE_3D_SONOGRAM) {
          this.yoffset = (this.yoffset + 1) % TEXTURE_HEIGHT;
        }
        var yoffset = this.yoffset;
        var vertexLoc;
        var texCoordLoc;
        var frequencyDataLoc;
        var foregroundColorLoc;
        var backgroundColorLoc;
        var texCoordOffset;
        var currentShader;
        switch (this.analysisType) {
          case ANALYSISTYPE_FREQUENCY:
          case ANALYSISTYPE_WAVEFORM:
            gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
            currentShader = this.analysisType == ANALYSISTYPE_FREQUENCY ? frequencyShader : waveformShader;
            currentShader.bind();
            vertexLoc = currentShader.gPositionLoc;
            texCoordLoc = currentShader.gTexCoord0Loc;
            frequencyDataLoc = currentShader.frequencyDataLoc;
            foregroundColorLoc = currentShader.foregroundColorLoc;
            backgroundColorLoc = currentShader.backgroundColorLoc;
            gl.uniform1f(currentShader.yoffsetLoc, 0.5 / (TEXTURE_HEIGHT - 1));
            texCoordOffset = vboTexCoordOffset;
            break;
          case ANALYSISTYPE_SONOGRAM:
            gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
            sonogramShader.bind();
            vertexLoc = sonogramShader.gPositionLoc;
            texCoordLoc = sonogramShader.gTexCoord0Loc;
            frequencyDataLoc = sonogramShader.frequencyDataLoc;
            foregroundColorLoc = sonogramShader.foregroundColorLoc;
            backgroundColorLoc = sonogramShader.backgroundColorLoc;
            gl.uniform1f(sonogramShader.yoffsetLoc, yoffset / (TEXTURE_HEIGHT - 1));
            texCoordOffset = vboTexCoordOffset;
            break;
          case ANALYSISTYPE_3D_SONOGRAM:
            gl.bindBuffer(gl.ARRAY_BUFFER, sonogram3DVBO);
            sonogram3DShader.bind();
            vertexLoc = sonogram3DShader.gPositionLoc;
            texCoordLoc = sonogram3DShader.gTexCoord0Loc;
            frequencyDataLoc = sonogram3DShader.frequencyDataLoc;
            foregroundColorLoc = sonogram3DShader.foregroundColorLoc;
            backgroundColorLoc = sonogram3DShader.backgroundColorLoc;
            gl.uniform1i(sonogram3DShader.vertexFrequencyDataLoc, 0);
            var normalizedYOffset = this.yoffset / (TEXTURE_HEIGHT - 1);
            gl.uniform1f(sonogram3DShader.yoffsetLoc, normalizedYOffset);
            var discretizedYOffset = Math.floor(normalizedYOffset * (sonogram3DHeight - 1)) / (sonogram3DHeight - 1);
            gl.uniform1f(sonogram3DShader.vertexYOffsetLoc, discretizedYOffset);
            gl.uniform1f(sonogram3DShader.verticalScaleLoc, sonogram3DGeometrySize / 3.5);
            projection.loadIdentity();
            projection.perspective(55, canvas.width / canvas.height, 1, 100);
            view.loadIdentity();
            view.translate(
              0,
              0,
              -9
              /*-13.0*/
            );
            model.loadIdentity();
            model.rotate(this.cameraController.xRot, 1, 0, 0);
            model.rotate(this.cameraController.yRot, 0, 1, 0);
            model.rotate(this.cameraController.zRot, 0, 0, 1);
            model.translate(this.cameraController.xT, this.cameraController.yT, this.cameraController.zT);
            var mvp = new Matrix4x4();
            mvp.multiply(model);
            mvp.multiply(view);
            mvp.multiply(projection);
            gl.uniformMatrix4fv(sonogram3DShader.worldViewProjectionLoc, gl.FALSE, mvp.elements);
            texCoordOffset = vbo3DTexCoordOffset;
            break;
        }
        if (frequencyDataLoc) {
          gl.uniform1i(frequencyDataLoc, 0);
        }
        if (foregroundColorLoc) {
          gl.uniform4fv(foregroundColorLoc, this.foregroundColor);
        }
        if (backgroundColorLoc) {
          gl.uniform4fv(backgroundColorLoc, this.backgroundColor);
        }
        gl.enableVertexAttribArray(vertexLoc);
        gl.vertexAttribPointer(vertexLoc, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(texCoordLoc);
        gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, gl.FALSE, 0, texCoordOffset);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        if (this.analysisType == ANALYSISTYPE_FREQUENCY || this.analysisType == ANALYSISTYPE_WAVEFORM || this.analysisType == ANALYSISTYPE_SONOGRAM) {
          gl.drawArrays(gl.TRIANGLES, 0, 6);
        } else if (this.analysisType == ANALYSISTYPE_3D_SONOGRAM) {
          gl.drawElements(gl.TRIANGLES, sonogram3DNumIndices, gl.UNSIGNED_SHORT, 0);
        }
        gl.disableVertexAttribArray(vertexLoc);
        gl.disableVertexAttribArray(texCoordLoc);
      };
      AnalyserView.prototype.setAnalyserNode = function(analyser) {
        this.analyser = analyser;
      };
      module.exports = AnalyserView;
    }
  });

  // source/src/javascripts/UI/spectrogram.js
  var require_spectrogram = __commonJS({
    "source/src/javascripts/UI/spectrogram.js"(exports, module) {
      "use strict";
      var Util = require_util();
      var Player = require_player();
      var AnalyserView = require_visualizer();
      var spec3D2 = {
        cxRot: 90,
        drawingMode: false,
        prevX: 0,
        point: function(e) {
          var touch = e.originalEvent && e.originalEvent.touches && e.originalEvent.touches[0];
          return { x: touch ? touch.pageX : e.pageX, y: touch ? touch.pageY : e.pageY };
        },
        handleTrack: function(e) {
          switch (e.type) {
            case "mousedown":
            case "touchstart":
              spec3D2.prevX = spec3D2.point(e).x;
              $(e.currentTarget).on("mousemove", spec3D2.handleTrack);
              $(e.currentTarget).on("touchmove", spec3D2.handleTrack);
              if (spec3D2.drawingMode == false) return false;
              var freq = spec3D2.yToFreq(spec3D2.point(e).y);
              if (spec3D2.isPlaying()) spec3D2.player.setBandpassFrequency(freq);
              else spec3D2.player.playTone(freq);
              return false;
              break;
            case "mousemove":
            case "touchmove":
              var ddx = spec3D2.point(e).x - spec3D2.prevX;
              spec3D2.prevX = spec3D2.point(e).x;
              if (spec3D2.drawingMode) {
                var y = spec3D2.point(e).y;
                var freq = spec3D2.yToFreq(y);
                if (spec3D2.isPlaying()) spec3D2.player.setBandpassFrequency(freq);
                else spec3D2.player.playTone(freq);
              } else if (spec3D2.isPlaying()) {
                spec3D2.cxRot += ddx * 0.2;
                if (spec3D2.cxRot < 0) spec3D2.cxRot = 0;
                else if (spec3D2.cxRot > 90) spec3D2.cxRot = 90;
              }
              return false;
              break;
            case "mouseup":
            case "touchend":
            case "touchcancel":
              $(e.currentTarget).off("mousemove", spec3D2.handleTrack);
              $(e.currentTarget).off("touchmove", spec3D2.handleTrack);
              if (spec3D2.drawingMode == false) return false;
              if (spec3D2.isPlaying()) spec3D2.player.setBandpassFrequency(null);
              else spec3D2.player.stopTone();
              return false;
              break;
          }
        },
        attached: function() {
          console.log("spectrogram-3d attached");
          Util.setLogScale(20, 20, 2e4, 2e4);
          spec3D2.onResize_();
          spec3D2.init_();
          window.addEventListener("resize", spec3D2.onResize_.bind(spec3D2));
        },
        stop: function() {
          if (spec3D2.player) spec3D2.player.stop();
        },
        isPlaying: function() {
          return !!this.player.source;
        },
        stopRender: function() {
          spec3D2.isRendering = false;
        },
        startRender: function() {
          if (spec3D2.isRendering) {
            return;
          }
          spec3D2.isRendering = true;
          spec3D2.draw_();
        },
        loopChanged: function(loop) {
          spec3D2.player.setLoop(loop);
        },
        play: function(src) {
          spec3D2.src = src;
          spec3D2.player.playSrc(src);
        },
        live: function() {
          spec3D2.player.live();
        },
        userAudio: function(src) {
          spec3D2.player.playUserAudio(src);
        },
        init_: function() {
          var player = new Player();
          var analyserNode = player.getAnalyserNode();
          var analyserView = new AnalyserView(this.canvas);
          analyserView.setAnalyserNode(analyserNode);
          analyserView.initByteBuffer();
          spec3D2.player = player;
          spec3D2.analyserView = analyserView;
          $("#spectrogram").on("mousedown", this.handleTrack).on("touchstart", this.handleTrack).on("mouseup", this.handleTrack).on("touchend", this.handleTrack).on("touchcancel", this.handleTrack);
        },
        onResize_: function() {
          console.log("onResize_");
          var canvas = $("#spectrogram")[0];
          spec3D2.canvas = canvas;
          canvas.width = $(window).width();
          canvas.height = $(window).height();
          var legend = $("#legend")[0];
          legend.width = $(window).width();
          legend.height = $(window).height() - 158;
          spec3D2.drawLegend_();
        },
        draw_: function() {
          if (!spec3D2.isRendering) {
            console.log("stopped draw_");
            return;
          }
          spec3D2.analyserView.doFrequencyAnalysis();
          requestAnimationFrame(spec3D2.draw_.bind(spec3D2));
        },
        drawLegend_: function() {
          var canvas = $("#legend")[0];
          var ctx = canvas.getContext("2d");
          var x = canvas.width - 10;
          ctx.fillStyle = "#FFFFFF";
          ctx.font = "14px Roboto";
          ctx.textAlign = "right";
          ctx.textBaseline = "middle";
          ctx.fillText("20,000 Hz -", x, canvas.height - spec3D2.freqToY(2e4));
          ctx.fillText("2,000 Hz -", x, canvas.height - spec3D2.freqToY(2e3));
          ctx.fillText("200 Hz -", x, canvas.height - spec3D2.freqToY(200));
          ctx.fillText("20 Hz -", x, canvas.height - spec3D2.freqToY(20));
        },
        /**
         * Convert between frequency and the offset on the canvas (in screen space).
         * For now, we fudge this...
         *
         * TODO(smus): Make this work properly with WebGL.
         */
        freqStart: 20,
        freqEnd: 2e4,
        padding: 30,
        yToFreq: function(y) {
          var padding = spec3D2.padding;
          var height = $("#spectrogram").height();
          if (height < 2 * padding || // The spectrogram isn't tall enough
          y < padding || // Y is out of bounds on top.
          y > height - padding) {
            return null;
          }
          var percentFromBottom = 1 - (y - padding) / (height - padding);
          var freq = spec3D2.freqStart + (spec3D2.freqEnd - spec3D2.freqStart) * percentFromBottom;
          return Util.lin2log(freq);
        },
        // Just an inverse of yToFreq.
        freqToY: function(logFreq) {
          var freq = Util.log2lin(logFreq);
          var height = $("#spectrogram").height();
          var padding = spec3D2.padding;
          var percent = (freq - spec3D2.freqStart) / (spec3D2.freqEnd - spec3D2.freqStart);
          return spec3D2.padding + percent * (height - 2 * padding);
        },
        easeInOutCubic: function(t, b, c, d) {
          if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
          return c / 2 * ((t -= 2) * t * t + 2) + b;
        },
        easeInOutQuad: function(t, b, c, d) {
          if ((t /= d / 2) < 1) return c / 2 * t * t + b;
          return -c / 2 * (--t * (t - 2) - 1) + b;
        },
        easeInOutQuint: function(t, b, c, d) {
          if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
          return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
        },
        easeInOutExpo: function(t, b, c, d) {
          if (t == 0) return b;
          if (t == d) return b + c;
          if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
          return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
        }
      };
      module.exports = spec3D2;
    }
  });

  // source/src/javascripts/main.js
  window.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  window.isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  window.isAndroid = /Android/.test(navigator.userAgent) && !window.MSStream;
  window.requestAnimFrame = (function() {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(callback) {
      window.setTimeout(callback, 1e3 / 60);
    };
  })();
  var spec3D = require_spectrogram();
  $(function() {
    var parseQueryString = function() {
      var q = window.location.search.slice(1).split("&");
      for (var i = 0; i < q.length; ++i) {
        var qi = q[i].split("=");
        q[i] = {};
        q[i][qi[0]] = qi[1];
      }
      return q;
    };
    var getLocalization = function() {
      var labels = {
        mic: "Microphone (optional)",
        draw: "Draw sound",
        Spectrogram_UI_Instrament_Flute: "Flute",
        Spectrogram_UI_Instrament_Harp: "Harp",
        Spectrogram_UI_Instrament_Whistling: "Whistling",
        Spectrogram_UI_Instrament_Trombone: "Trombone",
        Spectrogram_UI_Instrament_Drum_Machine: "Drum machine",
        Spectrogram_UI_Instrament_Birds: "Birds",
        Spectrogram_UI_Instrament_Modem: "Modem",
        Spectrogram_UI_Instrament_Wine_Glass: "Wine glass"
      };
      $("[data-name]").each(function() {
        var label = labels[$(this).attr("data-name")];
        if (label) $(this).attr({ "data-name": label, "aria-label": label, title: label });
      });
    };
    var startup = function() {
      var source = null;
      getLocalization();
      window.parent.postMessage("ready", "*");
      var sp = spec3D;
      if (!window.AtlasSpectrogram.prepare()) return;
      try {
        sp.attached();
      } catch (error) {
        window.AtlasSpectrogram.unavailable(error);
        return;
      }
      window.AtlasSpectrogram.connect(sp);
      sp.startRender();
      sp.stopRender();
      $(".music-box__tool-tip").hide(0);
      $("#loadingSound").hide(0);
      $(".music-box__buttons__button").click(function(e) {
        window.AtlasSpectrogram.unlock();
        sp.startRender();
        var wasPlaying = sp.isPlaying();
        sp.stop();
        sp.drawingMode = false;
        if ($(this).hasClass("selected")) {
          $(".music-box__buttons__button").removeClass("selected");
        } else {
          $(".music-box__buttons__button").removeClass("selected");
          $(this).addClass("selected");
          if ($(this).attr("data-mic") !== void 0) {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
              window.AtlasSpectrogram.status("Microphone is unavailable here. Choose a sample or Draw sound instead.");
              $(this).removeClass("selected");
            } else {
              $("#record").fadeIn().delay(2e3).fadeOut();
              sp.live();
            }
          } else if ($(this).attr("data-draw") !== void 0) {
            sp.drawingMode = true;
            $("#drawAnywhere").fadeIn().delay(2e3).fadeOut();
          } else if ($(this).attr("data-src") !== void 0) {
            sp.loopChanged(true);
            $("#loadingMessage").text($(this).attr("data-name"));
            sp.play($(this).attr("data-src"));
          }
        }
      });
      var killSound = function() {
        sp.stopRender();
        var wasPlaying = sp.isPlaying();
        sp.stop();
        sp.drawingMode = false;
        $(".music-box__buttons__button").removeClass("selected").attr("aria-pressed", "false");
      };
      window.addEventListener("blur", function() {
        killSound();
      });
      document.addEventListener("visibilitychange", function() {
        killSound();
      });
      var decodeBuffer = function(file) {
        var requestId = ++sp.player.requestId;
        window.AtlasSpectrogram.unlock();
        file.arrayBuffer().then(function(bytes) {
          return sp.player.context.decodeAudioData(bytes);
        }).then(function(buffer) {
          if (requestId !== sp.player.requestId || document.hidden) return;
          sp.startRender();
          sp.loopChanged(true);
          sp.userAudio({ buffer });
          $("#loadingSound").hide();
        }).catch(function() {
          $("#loadingSound").hide();
          window.AtlasSpectrogram.status("That audio file could not be decoded. Try a different sound file.");
        });
      };
      var fileDrop = function() {
        var $fileDrop = $("#fileDrop");
        var $description = $(".file-overlay-description");
        $(window).on({ "dragover": function(e) {
          e.preventDefault();
          e.stopPropagation();
          $description.text("Drop your sound file here.");
          $fileDrop.addClass("active");
        }, "dragleave": function(e) {
          e.preventDefault();
          e.stopPropagation();
          $fileDrop.removeClass("active");
        }, "drop": function(e) {
          e.preventDefault();
          e.stopPropagation();
          $fileDrop.addClass("pointer-events");
          killSound();
          var droppedFiles = e.originalEvent.dataTransfer;
          if (droppedFiles && droppedFiles.files.length && droppedFiles.items[0] && droppedFiles.items[0].type !== "audio/midi") {
            $.each(droppedFiles.files, function(i, file) {
              if (file.type.indexOf("audio") > -1) {
                $("#loadingMessage").text(file.name);
                $("#loadingSound").show(0);
                decodeBuffer(file);
                $fileDrop.removeClass("active");
                $fileDrop.removeClass("pointer-events");
              } else {
                $description.text("Only sound files will work here.");
              }
            });
          } else {
            $description.text("Only sound files will work here.");
          }
        } });
        $fileDrop.on("click", function() {
          $fileDrop.removeClass("active");
          $fileDrop.removeClass("pointer-events");
        });
      };
      fileDrop();
    };
    $("#iosButton").addClass("hide");
    startup();
  });
})();
