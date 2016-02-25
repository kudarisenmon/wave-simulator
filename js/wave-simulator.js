var t = 0; // 時間
// 右向きの波(y1)
var a1;
var t1;
var l1;
var s1 = 1;
// 左向きの波(y2)
var a2;
var t2;
var l2;
var s2 = 1;

var autoSwitch = false;
var associated = false;

var lineChart = {
	"config" : {
		"minY" : -4, //Y軸最小値
		"maxY" : 4, //Y軸最大値
		"minX" : 0,
		"maxX" : 40,
		"roundDigit": 1,
		"axisXLen" : 10, //水平目盛線の本数
		"xScaleSkip" : 20,
		"colorSet": ["green","blue","orange"],
		"bg": "white",
		"lineWidth": "3",
		"useShadow" : "no", //影
		"height" : "500",
		"width" : "900",
	},
	"data" : [[""], ["右向きの波"], ["左向きの波"], ["合成波"]]
};

function draw() {
	for(j = 0; j <= 200; j++) {
		var x = j * 0.2;
		var y1 = 0;
		if (t >= x * t1 / l1) {
			y1 = s1 * a1 * Math.sin(2 * Math.PI * (t / t1 - x / l1));
		}
		var y2 = 0;
		if (t >= (40 - x) * t2 / l2) {
			y2 = s2 * a2 * Math.sin(2 * Math.PI * (t / t2 + x / l2));
		}
		lineChart["data"][0][j+1] = x;
		lineChart["data"][1][j+1] = y1;
		lineChart["data"][2][j+1] = y2;
		if (associated == true) {
			lineChart["data"][3][j+1] = y1 + y2;
		} else {
			lineChart["data"][3][j+1] = null;
		}
	}
	ccchart.base('', {config : {
		"type" : "line",
		"lineWidth": 0,
	}});
	ccchart.init("canvas", lineChart);
	$("#slider").slider("value", t);
	$("#slidervalue").html(t.toFixed(1));
}

function auto() {
	if (t >= 40) {
		autoSwitch = false;
		return;
	}
	t = t + 0.1;
	draw();
	if (autoSwitch == true) {
		setTimeout("auto()", 30);
	}
}

function reset() {
	autoSwitch = false;
	a1 = $('#a1').val();
	t1 = $('#t1').val();
	l1 = $('#l1').val();
	a2 = $('#a2').val();
	t2 = $('#t2').val();
	l2 = $('#l2').val();
	t = 0;
	draw();
}

$(function() {
	$( "#slider" ).slider({
		max: 40.0,
		min: 0.0,
		value: 0.0,
		step: 0.1,
		slide: function( event, ui ) {
			autoSwitch = false;
			t = ui.value;
			draw();
		}
	});
	$("#dialog").dialog({
		autoOpen: false,
		width: 300,
		modal: true,
		buttons: [
			{
				text: '初期値に戻す',
				click: function() {
					$('#a1').val(2);
					$('#t1').val(10);
					$('#l1').val(20);
					$('#a2').val(2);
					$('#t2').val(10);
					$('#l2').val(20);
				}
			}, {
				text: 'キャンセル',
				click: function() {
					$('#a1').val(a1);
					$('#t1').val(t1);
					$('#l1').val(l1);
					$('#a2').val(a2);
					$('#t2').val(t2);
					$('#l2').val(l2);
					$(this).dialog("close");
				}
			}, {
				text: 'OK',
				click: function() {
					var valid = $('#form').valid();
					if (valid == true) {
						$(this).dialog("close");
						reset();
					}
				}
			}
		]
	});
	$('#form').validate({
		rules: {
			a1: {required: true, number: true, min: 0.1, max: 2, range: [0.1, 2.0]},
			t1: {required: true, digits: true, min: 1, max: 100},
			l1: {required: true, digits: true, min: 1, max: 100},
			a2: {required: true, number: true, min: 0.1, max: 2, range: [0.1, 2.0]},
			t2: {required: true, digits: true, min: 1, max: 100},
			l2: {required: true, digits: true, min: 1, max: 100},
		}
	});
	$("#setup").click(function() {
		autoSwitch = false;
		$("#dialog").dialog("open");
	});
	$("#forward").click(function() {
		autoSwitch = false;
		if (t >= 40) {
			return;
		}
		t = t + 0.1;
		draw();
	});
	$("#backward").click(function() {
		autoSwitch = false;
		if (t <= 0) {
			return;
		}
		t = t - 0.1;
		draw();
	});
	$("#togleAssociated").click(function() {
		associated = !associated;
		draw();
	});
	$("#togleAuto").click(function() {
		autoSwitch = !autoSwitch;
		if (autoSwitch == true) {
			if (t >= 40) {
				alert("最後まで再生しました。リセットしてください。");
				autoSwitch = false;
				return;
			} else {
				setTimeout("auto()", 30);
			}
		}
	});
	$("#phase").change(function() {
		var phase = $('#phase option:selected').val().split(":");
		console.log(phase);
		s1 = phase[0];
		s2 = phase[1];
		reset();
	});
	$("#slider").draggable();
	reset();
	draw();
});
