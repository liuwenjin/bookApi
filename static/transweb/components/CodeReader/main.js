﻿webCpu.regComponent("CodeReader", {
	css: "style.css"
}, function (container, data, task) {
	webCpu.CodeReader.initRadios(task);
	$(container).html("<div style='padding-left: 20px; width: 100%; height: 29px; display: flex; justify-content:left; align-items:center;'>" + (task.option.fileName || "项目文件") + "</div>\
					  <div class='blocksArea' style='padding: 20px; width: 100%; box-shadow: 0px 1px 0px inset #e2e2e2; height: calc( 100% - 30px ); overflow: auto;'></div>");

	task.blocksArea = $(container).find(".blocksArea")[0];

	for (var j = 0; j < task.option.current + 1 && j < task.option.block.length; j++) {
		var flag = (j === task.option.current);
		webCpu.CodeReader.initBlock(task, j, flag);
	}

	task.blocksArea.scrollTo(0, task.blocksArea.scrollHeight - task.blocksArea.offsetHeight);
	var block = task.option.block[task.option.current];
	if (task.currentAudio && task.currentAudio.pause) {
		task.currentAudio.pause();
	}

	if (block && block.audio && typeof (block.audio.play) === "function") {
		task.currentAudio = block.audio;
		block.audio.play();
		block.audio.onend = function () {
			webCpu.CodeReader.next(task);
		}
	} else if (!block) {
		if (task.option.auto) {
			webCpu.CodeReader.next(task);
		}
	} else if (block && block.type !== "input") {
		var interval = block.interval || task.option.interval;
		if (interval) {
			setTimeout(function () {
				webCpu.CodeReader.next(task);
			}, interval);
		}
	} else {}
	webCpu.CodeReader.initFilesArea(task);
});


webCpu.CodeReader.initBlock = function (task, index, flag) {
	var elemSelector = $("<div index='" + index + "'></div>");
	var tElem = $(task.container).find(".blocksArea");
	elemSelector.appendTo(tElem);
	elemSelector.css({
		float: "left",
		position: "relative",
		width: "100%",
		display: "block"
	});
	var block = task.option.block[index];
	if (block.type === "input") {
		var textArea = $("<textarea style='width: 100%; resize: none;'></textarea>");
		textArea.appendTo(elemSelector);
		textArea.attr("rows", block.end - block.start + 1);
		if (flag) {
			var submitArea = $("<div style='width: 100%; text-align: right;'><label class='confirmErrorTips' style='padding-top: 6px; display: inline-block; width: calc( 100% - 70px ); color: #f3abaa; margin-right: 10px;'></label>\
									<label class='confirmSuccessTips' style='display: none; font-size: 12px; width: 35px; height: 35px; border-radius: 100%; padding-top: 10px; text-align: center; display: none; color: #fff; background-color: #59dd00; margin: 0px;'>正确</label>\
									<button index='" + index + "' class='btn btn-primary confirmBtn'>确认</buttoon></div>").appendTo(elemSelector);
			submitArea.find(".confirmBtn").on("click", function () {
				var j = $(this).attr("index");
				var tBlock = task.option.block[j];
				var str = submitArea.parent().find("textarea").val();
				var ret = webCpu.CodeReader.check(task, j);
				if (ret) {
					tBlock.input = str;
					submitArea.find(".confirmErrorTips").html("");
					submitArea.find(".confirmSuccessTips").show();
					submitArea.find(".confirmBtn").hide();
					setTimeout(function() {
						webCpu.CodeReader.next(task);	
					}, 1000);
					
				} else {
					//tool tips showing
					submitArea.find(".confirmErrorTips").html("错误, 请仔细对比左侧代码提示。");
					submitArea.find(".confirmSuccessTips").hide();
					submitArea.find(".confirmBtn").show();
				}

			});
			webCpu.CodeReader.initBlockTips(task);
			var textArea = webCpu.CodeReader.produceBlock(task, index, 1);
			textArea.appendTo(task.tipsDiv.find(".CodeReader_tipsContent"));
			webCpu.CodeReader.resizeTextArea(textArea);

			var pos = webCpu.CodeReader.getTipsPos(task);
			if (task.option.mode === "exam") {
				task.tipsDiv.css({
					display: "none",
					top: (pos + 20) + "px"
				});
			} else {
				task.tipsDiv.css({
					display: "block",
					top: (pos + 20) + "px"
				});
			}

		} else {
			textArea.attr("disabled", true);
			textArea.html(block.input);
			textArea.css({
				border: "none",
				backgroundColor: "#f2f2f2"
			});

			webCpu.CodeReader.resizeTextArea(textArea);
		}
	} else {
		var textArea = webCpu.CodeReader.produceBlock(task, index);
		textArea.appendTo(elemSelector);
		var rows = (textArea[0].scrollHeight - textArea[0].scrollTop - Number(textArea.css("padding-top").replace("px", "")) - Number(textArea.css("padding-bottom").replace("px", ""))) / Number(textArea.css("line-height").replace("px", ""));
		rows = Math.round(rows);
		textArea.attr("rows", rows);
		webCpu.CodeReader.resizeTextArea(textArea);
	}

}

webCpu.CodeReader.resizeTextArea = function (textArea) {
	var rows = (textArea[0].scrollHeight - textArea[0].scrollTop - Number(textArea.css("padding-top").replace("px", "")) - Number(textArea.css("padding-bottom").replace("px", ""))) / Number(textArea.css("line-height").replace("px", ""));
	rows = Math.floor(rows);
	textArea.attr("rows", rows);
}

webCpu.CodeReader.produceBlock = function (task, k, flag) {
	var block = task.option.block[k];
	var code = task.data[block.start];
	if (flag) {
		var ts = "";
		for (var index = 0; code[index] === " "; index++) {
			ts += code[index];
		}
		code = code.replace(ts, "");
	}

	for (var i = block.start + 1; i < task.data.length && i < block.end + 1; i++) {
		var tStr = task.data[i];
		if (flag) {
			tStr = tStr.replace(ts, "");
		}
		code += "\n" + tStr;
	}
	var textArea = $("<textarea style='width: 100%; resize: none;'></textarea>");
	textArea.attr("rows", block.end - block.start + 1);
	textArea.val(code);
	textArea.css({
		border: "none",
		backgroundColor: "transparent"
	});
	textArea.attr("disabled", true);
	return textArea;
}


webCpu.CodeReader.getBlocksHight = function (task) {
	var height = 0;
	var selector = $(task.container).find(".blocksArea").children("div");
	for (var i = 0; i < selector.length - 1; i++) {
		height += selector.eq(i).height();
	}
	return height;
}

webCpu.CodeReader.getTipsPos = function (task) {
	var pos = 20;
	var maxHeight = $(task.container).height();
	var bottomPos = this.getBlocksHight(task);
	var tHeight = $(task.tipsDiv).height();
	if (bottomPos + tHeight > maxHeight) {
		pos = maxHeight - tHeight - 80;
	} else {
		pos = bottomPos + tHeight/2 - 30;
	}
	return pos;
}

webCpu.CodeReader.initBlockTips = function (task) {
	task.tipsDiv = $("<div class='CodeReader_tipsArea'><div class='CodeReader_tipsContent'></div><span class='CodeReader_tipsArrow'></span></div>");
	task.tipsDiv.prependTo($(task.container));
}

webCpu.CodeReader.initFilesArea = function (task) {
	if (task.option.files) {
		if (task.filesArea) {
			task.filesArea.remove();
		}
		task.filesArea = $("<div class='CodeReader_filesArea'><div style='padding-left: 20px; width: 100%; height: 29px; display: flex; justify-content:left; align-items:center;'>项目文件结构</div>\
		<div class='filesTree' style='padding: 20px; width: 100%; box-shadow: 0px 1px 0px inset #e2e2e2; height: calc( 100% - 30px ); overflow: auto;'></div></div>");
		task.filesArea.appendTo($(task.container));
	}
}



webCpu.CodeReader.shuffleBlocks = function (task) {
	if (!task.option || !task.option.block) {
		return false;
	}
	for (var i = 0; i < task.option.block.length; i++) {
		task.option.block[i].type = "visible";
	}
	var k = 0;
	while (k < task.option.block.length) {
		var n = ((Math.random() * 3) >> 0) + 3;
		k += n;
		if (task.option.block[k]) {
			task.option.block[k].type = "input";
		}
	}
}


webCpu.CodeReader.initRadios = function (task) {
	if (!task.option || !task.option.block) {
		return false;
	}
	webCpu._audioArr = webCpu._audioArr || [];
	for (var i in webCpu._audioArr) {
		webCpu._audioArr[i].pause();
	}
	webCpu._audioArr = [];
	for (var j in task.option.block) {
		var url = task.option.block[j].audioUrl;
		if (url) {
			var audio = new Audio(url);
			task.option.block[j].audio = audio;
			webCpu._audioArr.push(audio);
		}
	}
}

webCpu.CodeReader.dealCodeBlock = function (data, flag) {
	if (typeof (data) === "string") {
		data = data.split("\n");
	}

	var code = $.trim(data[0]);

	if (!code) {
		return "";
	}

	if (flag) {
		var ts = "";
		for (var index = 0; code[index] === " "; index++) {
			ts += code[index];
		}
		code = code.replace(ts, "");
	}

	for (var i = 1; i < data.length && i < data.length; i++) {
		var tStr = data[i];
		if (flag) {
			tStr = tStr.replace(ts, "");
		}
		if (tStr && tStr != " " && tStr != "\n")
			code += "\n" + $.trim(tStr);
	}
	return js_beautify(code);
}

webCpu.CodeReader.check = function (task, index) {
	var ret = true;
	var str = $(task.container).find("div[index=" + index + "]>textarea").val();
	str = this.dealCodeBlock(str, flag);
	//check
	var d = [];
	var block = task.option.block[index];
	for (var i = block.start; i < block.end + 1; i++) {
		d.push(task.data[i]);
	}
	var cStr = this.dealCodeBlock(d);

	ret = (str === cStr);

	return ret;
}

webCpu.CodeReader.next = function (task) {
	var i = task.option.current + 1;
	webCpu.CodeReader.play(task, i);
}

webCpu.CodeReader.play = function (task, i) {
	task.option.current = i;
	if (task.option.current < task.option.block.length + 1) {
		this.updateView(task);
	}
}